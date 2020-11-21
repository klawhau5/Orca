'use strict'

/* global client */

const searchKeys = {}

searchKeys.n = function (command) {
  client.vim.findNext(1)
}

searchKeys.N = function (command) {
  client.vim.findNext(-1)
}

searchKeys["/"] = function (command) {
  client.vim.clearInputBuffer()
  client.acels.setPipe(client.commander)
  client.commander.start('find:')
}

