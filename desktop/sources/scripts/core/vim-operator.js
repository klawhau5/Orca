'use strict'

/* global client */

const operatorKeys = {}

operatorKeys.d = function (command) {
  if (client.vim.isVisual) { client.vim.isVisual = false }
  client.cursor.cut()
}

operatorKeys.r = function (command) {
  client.orca.replaceAt(command.identifier, client.orca.indexAt(client.cursor.x, client.cursor.y))
}

