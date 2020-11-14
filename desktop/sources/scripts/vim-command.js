'use strict'

/* global vim-edit */
/* global vim-mark */
/* global vim-motion */
/* global vim-operator */
/* global vim-search */

function Command (vim) {
  this.count = 0
  this.operator = ''
  this.motion = ''
  this.identifier = ''

  this.operation = null

  this.setCount = (count) => {
    this.count = count
  }

  this.getCount = () => {
    return this.count
  }

  this.setOperation = (operation) => {
    this.operation = operation
  }

  this.setMotion = () => {
  }

  this.execute = () => {
    this.operation(this.count)
    this.flush()
  }

  this.flush = () => {
    this.count = 0
    this.operator = ''
    this.motion = ''
    this.identifier = ''
    this.operation = null
  }
}
