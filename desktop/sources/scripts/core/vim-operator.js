'use strict'

/* global client */

const operatorKeys = {}

operatorKeys.d = function () {
  if (client.vim.isVisual) { client.vim.isVisual = false }
  client.cursor.cut()
}

