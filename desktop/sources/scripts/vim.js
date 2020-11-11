'use strict'

const fs = require('fs')

function Vim (client) {
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

  // {operator} {count} {motion}
  // {count} {operator} {motion}

  this.operators = ['c', 'd', 'y']
  this.motions = ['w', 'e', 'h', 'j', 'k', 'l']

  this.start = () => {
    this.isActive = true
    this.isInsert = false
    this.isVisual = false
    this.inputBuffer = []
    this.operator = ''
    this.count = 1
    this.motion = ''
    client.cursor.ins = false
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

  this.onKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey) { return }
    client[this.isActive === true ? 'commander' : client.vim.isActive === true ? 'vim' : 'cursor'].write(e.key)
    e.stopPropagation()
  }

  this.write = (g) => {
    if (!client.orca.isAllowed(g)) { return }
    if (!client.vim.isActive || (client.vim.isActive && client.vim.isInsert)) {
      if (client.orca.write(this.x, this.y, g) && this.ins) {
        this.move(1, 0)
      }
    }
    client.vim.isInsert = this.ins
    client.history.record(client.orca.s)
  }

  /* 
    Returns true when the most recent character(s) on the input
    stack correspond to a motion. Operator and count may or
    may not be defined.
  */

  this.processMotionOrCommand = () => {
    if (this.parseCommand()) {
      if (!client.cursor.ins) {
        switch (this.motion) {
          case 'h':
            this.move(-1 * this.count, 0, -1 * this.count, 0)
            break
          case 'j':
            this.move(0, -1 * this.count, 0, 1 * this.count)
            break
          case 'k':
            this.move(0, 1 * this.count, 0, -1 * this.count)
            break
          case 'l':
            this.move(1 * this.count, 0, 1 * this.count, 0)
            break
          case 'i':
            client.cursor.ins = true
            this.isInsert = true
            break
          case 'w':
            this.wordMotion(1)
            break
          case 'b':
            this.wordMotion(-1)
            break
          case 'n':
            client.cursor.findNext(1)
            break
          case 'N':
            client.cursor.findNext(-1)
            break
          case 'Escape':
            client.cursor.reset()
            break
          case 'd':
            if (this.isVisual) { this.isVisual = false }
            client.cursor.cut()
            break
          case 'x':
            if (this.isVisual) { this.isVisual = false }
            client.cursor.cut()
            break
          case 'y':
            if (this.isVisual) { this.isVisual = false }
            client.cursor.copy()
            break
          case 'p':
            client.cursor.paste()
            break
          case 'u':
            client.history.undo()
            break
          case '/':
            this.clearInputBuffer()
            client.commander.start('find:')
            break
          case 'v':
            this.isVisual = !this.isVisual
            if (this.isVisual) {
              client.cursor.select(client.cursor.x, client.cursor.y, client.cursor.w, client.cursor.h)
            } else {
              client.cursor.reset()
            }
            break
          case 'm':
            this.setMark(this.identifier, client.cursor.x, client.cursor.y)
            break
          case 'm':
            client.cursor.move(client.orca.posAt(this.getMark(this.identifier)))
            break
        }
      } else {
        switch (this.motion) {
          case 'Escape':
            this.isInsert = false
            client.cursor.ins = false
            break
        }
      }
      this.clearInputBuffer()
    }
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

  this.pushKey = (inKey) => {
    var key = this.checkVimrcMappings(inKey)
    if (key !== 'Escape') {
      key = key.split('')
    }
    this.inputBuffer = this.inputBuffer.concat(key)
    this.parseInputBuffer()
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
