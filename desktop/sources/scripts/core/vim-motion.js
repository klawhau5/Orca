'use strict'

/* global client */

const motionKeys = {}

motionKeys.h = function (count = 1) {
  count = count ? count : 1
  client.vim.move(-count, 0, -count, 0)
}

motionKeys.j = function (count = 1) {
  count = count ? count : 1
  client.vim.move(0, -count, 0, count)
}

motionKeys.k = function (count = 1) {
  count = count ? count : 1
  client.vim.move(0, count, 0, -count)
}

motionKeys.l = function (count = 1) {
  count = count ? count : 1
  client.vim.move(count, 0, count, 0)
}

motionKeys.w = function (count = 1) {
  count = count ? count : 1
  client.vim.wordMotion(1, count)
}

motionKeys.b = function (count = 1) {
  count = count ? count : 1
  client.vim.wordMotion(-1, count)
}

motionKeys.Escape = function () {
  if (client.vim.isInsert) {
    client.vim.move(-1, 0, -1, 0)
  }
  client.vim.reset()
  client.cursor.ins = false
  client.cursor.reset()
}

