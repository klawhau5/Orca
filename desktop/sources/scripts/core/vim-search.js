'use strict'

/* global client */

const searchKeys = {}

searchKeys["/"] = function () {
  client.vim.clearInputBuffer()
  client.acels.setPipe(client.commander)
  client.commander.start('find:')
}

searchKeys.n = function () {
  client.vim.findNext(1)
}

searchKeys.N = function () {
  client.vim.findNext(-1)
}


