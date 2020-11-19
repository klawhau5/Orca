'use strict'

/* global vim-command */
/* global vim-edit */
/* global vim-mark */
/* global vim-motion */
/* global vim-operator */
/* global vim-search */

const fs = require('fs')

function Vim (client) {
  this.editKeys = editKeys
  this.markKeys = markKeys
  this.motionKeys = motionKeys
  this.operatorKeys = operatorKeys
  this.registerKeys = registerKeys
  this.searchKeys = searchKeys
  this.isActive = false
  this.isInsert = false
  this.isVisual = false
  this.inputBuffer = []
  this.mappings = {}
  this.marks = {}
  this.currentRegister = '"'
  this.registers = {}
  this.findString = ''

  const editType = 1
  const markType = 2
  const motionType = 3
  const operatorType = 4
  const registerType = 5
  const searchType = 6

  this.command = new Command(this)

  this.start = () => {
    this.isActive = true
    this.isInsert = false
    this.isVisual = false
    this.inputBuffer = []
    client.cursor.ins = false
    client.acels.setPipe(this)
    client.update()
  }

  this.stop = () => {
    this.isActive = false
    client.acels.setPipe(client.commander)
    client.update()
  }

  this.checkVimrcMappings = (inKey) => {
    var outKey = inKey
    const data = fs.readFileSync(`${__dirname}/../vimrc.json`)
    this.mappings = JSON.parse(data)
    for (const attributename in this.mappings){
      if (attributename == inKey) {
        outKey = this.mappings[attributename]
      }
    }
    return outKey
  }

  /*
    Returns true when the most recent character(s) on the input
    stack correspond to a motion. Operator and count may or
    may not be defined.
  */

  this.commandIsComplete = () => {
    const lastInput = this.inputBuffer[this.inputBuffer.length - 1]
    if (this.command.operationType > 0) {
      if (this.command.operationType === operatorType) {
        this.command.identifier = lastInput
        return true
      }
      if (this.command.operationType === markType) {
        this.command.identifier = lastInput
        return true
      }
      if (this.command.operationType === registerType) {
        this.command.identifier = lastInput
        return true
      }
    } else {
      this.initializeCommand(lastInput)
      if (this.command.operationType === editType ||
          this.command.operationType === motionType ||
          this.command.operationType === searchType
      ) {
        return true
      }
    }
    return false
  }

  this.initializeCommand = (commandKey) => {
    const countRegex = /\d/
    if (commandKey.search(countRegex) > -1) {
      if (this.command.count > 0) {
        this.command.count = Number(this.command.count.toString() + commandKey)
      } else {
        this.command.count = Number(commandKey)
      }
    } else if (this.editKeys.hasOwnProperty(commandKey)) {
      this.command.operation = this.editKeys[commandKey]
      this.command.operationType = editType
    } else if (this.markKeys.hasOwnProperty(commandKey)) {
      this.command.operation = this.markKeys[commandKey]
      this.command.operationType = markType
    } else if (this.motionKeys.hasOwnProperty(commandKey)) {
      this.command.operation = this.motionKeys[commandKey]
      this.command.operationType = motionType
    } else if (this.operatorKeys.hasOwnProperty(commandKey)) {
      this.command.operation = this.operatorKeys[commandKey]
      this.command.operationType = operatorType
    } else if (this.registerKeys.hasOwnProperty(commandKey)) {
      this.command.operation = this.registerKeys[commandKey]
      this.command.operationType = registerType
    } else if (this.searchKeys.hasOwnProperty(commandKey)) {
      this.command.operation = this.searchKeys[commandKey]
      this.command.operationType = searchType
    }
  }

  this.processMotionOrCommand = () => {
    if (this.commandIsComplete()) {
      this.command.execute()
      this.clearInputBuffer()
    }
  }

  this.onKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey || e.key === ' ' || e.key === 'Spacebar') { return }
    client[this.isInsert === false || (e.key === 'Escape' && this.isInsert === true) ? 'vim' : 'cursor'].write(e.key)
    e.stopPropagation()
  }

  this.onKeyUp = (e) => {
    client.update()
  }

  this.move = (offsetX, offsetY, offsetW, offsetH) => {
    if (this.isVisual) {
      client.cursor.select(client.cursor.x, client.cursor.y, client.cursor.w + offsetW, client.cursor.h + offsetH)
    } else {
      client.cursor.move(offsetX, offsetY)
    }
  }

  // TODO: implement operators over motions

  this.wordMotion = (direction, count) => {
    this.moveWord(direction, count)
  }

  this.moveWord = (direction, count) => {
    var index = 0
    var indices = []
    var wordCount = 1
    var newWordIndex = 0
    const wordRegex = /[^.]+/g
    if (direction == 1 ) {
      indices = this.getWordIndices(wordRegex, client.orca.s)
      while (index < indices.length) {
        if (indices[index] > client.orca.indexAt(client.cursor.x, client.cursor.y)) {
          if (wordCount == count) {
            newWordIndex = indices[index]
            break
          }
          wordCount++
        }
        index++
      }
    }
    if (direction == -1) {
      indices = this.getWordIndices(wordRegex, client.orca.s)
      index = indices.length - 1
      while (index >= 0) {
        if (indices[index] < client.orca.indexAt(client.cursor.x, client.cursor.y)) {
          if (wordCount == count) {
            newWordIndex = indices[index]
            break
          }
          wordCount++
        }
        index--
      }
    }
    const newPostion = client.orca.posAt(newWordIndex)
    client.cursor.moveTo(newPostion.x, newPostion.y)
  }

  this.getWordIndices = (wordRegex, searchString) => {
    var match = []
    var indices = []
    while ((match = wordRegex.exec(searchString)) ) {
      indices.push(match.index);
    }
    return indices;
  }

  this.setRegister = (identifier) => {
    this.currentRegister = identifier
  }

  this.setMark = (identifier, xPosition, yPosition) => {
    const index = client.orca.indexAt(xPosition, yPosition)
    this.marks[identifier] = index
  }

  this.getMark = (identifier) => {
    const outIndex = this.marks[identifier]
    if (outIndex > 0) {
      return outIndex
    }
    return client.orca.indexAt(client.cursor.x, client.cursor.y)
  }

  this.find = (searchString) => {
    const index = client.orca.s.indexOf(searchString)
    if (index < 0) { return }
    const findPosition = client.orca.posAt(index)
    client.cursor.select(findPosition.x, findPosition.y, searchString.length - 1, 0)
    this.findString = searchString
  }

  this.findNext = (direction) => {
    var findResultIndices = []
    var index = -1
    const currentIndex = client.orca.indexAt(client.cursor.x, client.cursor.y)
    var findIndex = currentIndex
    if (this.findString.length) {
      while ((index = client.orca.s.indexOf(this.findString, index + 1)) >= 0) {
        findResultIndices.push(index)
      }
      if (direction == -1) {
        findResultIndices.reverse()
      }
      for (const index of findResultIndices) {
        if ((direction == 1 && index > currentIndex) || (direction == -1 && index < currentIndex)) {
          findIndex = index
          break
        }
      }
      if ((currentIndex <= findResultIndices[findResultIndices.length - 1] && direction == -1) ||
         (currentIndex >= findResultIndices[findResultIndices.length - 1] && direction == 1)
      ) { findIndex = findResultIndices[0] }
    }
    const findPosition = client.orca.posAt(findIndex)
    client.cursor.select(findPosition.x, findPosition.y, this.findString.length - 1, 0)
  }

  this.write = (inKey) => {
    if (inKey === 'Shift') { return }
    var key = this.checkVimrcMappings(inKey)
    if (key !== 'Escape') {
      key = key.split('')
    }
    if (key.length > 1 && key !== 'Escape') {
      for (const keyPart of key) {
        this.inputBuffer = this.inputBuffer.concat(keyPart)
        this.processMotionOrCommand()
      }
    } else {
      this.inputBuffer = this.inputBuffer.concat(key)
      this.processMotionOrCommand()
    }
  }

  this.yank = () => {
    this.registers[this.currentRegister] = client.cursor.selection()
    this.currentRegister = '"'
  }

  this.delete = () => {
    this.yank()
    client.cursor.erase()
    this.currentRegister = '"'
  }

  this.put = () => {
    if (this.registers.hasOwnProperty(this.currentRegister)) {
      const data = this.registers[this.currentRegister].trim()
      client.orca.writeBlock(client.cursor.minX, client.cursor.minY, data, client.cursor.ins)
      client.history.record(client.orca.s)
      client.cursor.scaleTo(data.split(/\r?\n/)[0].length - 1, data.split(/\r?\n/).length - 1)
    }
    this.currentRegister = '"'
  }

  this.trigger = () => {
    if (this.isActive) {
      client.acels.setPipe(this)
    }
  }

  this.popKey = () => {
    this.inputBuffer.pop()
  }

  this.clearInputBuffer = () => {
    this.inputBuffer = []
  }

  this.reset = () => {
    this.clearInputBuffer()
    this.isInsert = false
    this.isVisual = false
    this.command.flush()
  }
}

// test git osx
