'use strict'

/* global client */

const findKeys = {}

findKeys.f = function (command) {
  command.count = command.count ? command.count : 1
  client.vim.findInLine(command.identifier, command.count)
}

findKeys.F = function (command) {
  command.count = command.count ? command.count : 1
  client.vim.findInLine(command.identifier, command.count)
}
