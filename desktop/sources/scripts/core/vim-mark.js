'use strict'

/* global client */

const markKeys = {}

markKeys.m = function (command) {
  client.vim.setMark(command.identifier, client.cursor.x, client.cursor.y)
}

markKeys["'"] = function (command) {
  const markIndex = client.vim.getMark(command.identifier)
  const position = client.orca.posAt(markIndex)
  client.cursor.moveTo(position.x, position.y)
}
