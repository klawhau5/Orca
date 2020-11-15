'use strict'

/* global client */

const motionKeys = {}

motionKeys.h = function (command) {
  command.count = command.count ? command.count : 1
  client.vim.move(-command.count, 0, -command.count, 0)
}

motionKeys.j = function (command) {
  command.count = command.count ? command.count : 1
  client.vim.move(0, -command.count, 0, command.count)
}

motionKeys.k = function (command) {
  command.count = command.count ? command.count : 1
  client.vim.move(0, command.count, 0, -command.count)
}

motionKeys.l = function (command) {
  command.count = command.count ? command.count : 1
  client.vim.move(command.count, 0, command.count, 0)
}

motionKeys.w = function (command) {
  command.count = command.count ? command.count : 1
  client.vim.wordMotion(1, command.count)
}

motionKeys.b = function (command) {
  command.count = command.count ? command.count : 1
  client.vim.wordMotion(-1, command.count)
}

motionKeys.Escape = function () {
  if (client.vim.isInsert) {
    client.vim.move(-1, 0, -1, 0)
  }
  client.vim.reset()
  client.cursor.ins = false
  client.cursor.reset()
}

