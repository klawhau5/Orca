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
  this.operationType = ''
  this.isVisual = false

  this.execute = () => {
    this.operation(this)
    this.flush()
  }

  this.flush = () => {
    this.count = 0
    this.operator = ''
    this.motion = ''
    this.identifier = ''
    this.operation = null
    this.operationType = ''
    this.isVisual = false
  }
}
