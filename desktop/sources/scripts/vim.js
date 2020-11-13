'use strict'

const fs = require('fs')

function Vim (client) {
  this.motions = motions
  this.isActive = false
  this.isInsert = false
  this.isVisual = false
  this.inputBuffer = [] 
  this.operator = ''
  this.count = 1
  this.motion = ''
  this.identifier = ''
  this.mappings = {}
  this.marks = {}
  this.findString = ''

  // {operator} {count} {motion}
  // {count} {operator} {motion}

  this.operators = ['c', 'd', 'y']

  this.start = () => {
    this.isActive = true
    this.isInsert = false
    this.isVisual = false
    this.inputBuffer = []
    this.operator = ''
    this.count = 1
    this.motion = ''
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
    for (var attributename in this.mappings){
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

  this.parseCommand = () => {
    const motionRegex = /\D/
    const countRegex = /[\d]+/
    const operatorRegex = /\D/
    const identifierRegex = /\D/
    this.motion = this.parseCommandComponent(motionRegex)
    if (this.motion.length > 0) {
      if (this.motion == 'm') {
        if (this.identifier = this.parseCommandComponent(identifierRegex !== '')) {
          return true
        }
      } else {
        this.count = Number(this.parseCommandComponent(countRegex))
        this.count = this.count == 0 ? 1 : this.count
        this.operator = this.parseCommandComponent(operatorRegex)
        return true
      }
    }
  }

  this.parseCommandComponent = (regex) => {
    const lastInput = this.inputBuffer[this.inputBuffer.length - 1]
    if (lastInput == 'Escape') { return lastInput }
    const inputBufferString = this.inputBuffer.join('')
    const componentIndex = inputBufferString.search(regex)
    if (componentIndex > -1) {
      this.popKey()
      const component = inputBufferString.match(regex)
      return component[component.length - 1]
    }
    return ''
  }

  this.processMotionOrCommand = () => {
    if (this.parseCommand()) {
      this.motions[this.motion](this.count)
      this.clearInputBuffer()
    }
  }

  this.onKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey) { return }
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

  this.wordMotion = (direction) => {
    if (this.operator.length) {
    } else {
      this.moveWord(direction)
    }
  }

  this.moveWord = (direction) => {
    var index = 0
    var indices = []
    var wordCount = 1
    var newWordIndex = 0
    const wordRegex = /[^.]+/g
    if (direction == 1 ) {
      indices = this.getWordIndices(wordRegex, client.orca.s)
      while (index < indices.length) {
        if (indices[index] > client.orca.indexAt(client.cursor.x, client.cursor.y)) {
          if (wordCount == this.count) {
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
          if (wordCount == this.count) {
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

  this.setMark = (identifier, xPosition, yPosition) => {
    const index = client.orca.indexAt(xPosition, yPosition)
    this.marks[identifier, index]
  }

  this.getMark = (identifier) => {
    var outIndex = -1
    if (outIndex = this.marks[identifier] > 0) {
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
    this.inputBuffer = this.inputBuffer.concat(key)
    this.parseInputBuffer()
    this.processMotionOrCommand()
  }
  
  this.trigger = () => {
    if (this.isActive) {
      client.acels.setPipe(this)
    }
  }

  this.popKey = () => {
    this.inputBuffer.pop()
  }

  /*
    Numbers will enter as individual digits.
    Need to combine to full entered number.
  */
  
  this.parseInputBuffer = () => {

  }

  this.clearInputBuffer = () => {
    this.inputBuffer = [] 
    this.operator = ''
    this.count = 1
    this.motion = ''
  }
}
