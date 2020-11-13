'use strict'

const motions = {}

motions.h = function (count) {
  client.vim.move(-count, 0, -count, 0)
}

motions.j = function (count) {
  client.vim.move(0, -count, 0, count)
}

motions.k = function (count) {
  client.vim.move(0, count, 0, -count)
}

motions.l = function (count) {
  client.vim.move(count, 0, count, 0)
}

motions.i = function () {
  client.cursor.ins = true
  client.vim.isInsert = true
}

motions.w = function () {
  client.vim.wordMotion(1)
}

motions.b = function () {
  client.vim.wordMotion(-1)
}

motions.n = function () {
  client.vim.findNext(1)
}

motions.N = function () {
  client.vim.findNext(-1)
}

motions.Escape = function () {
  if (client.vim.isInsert) {
    client.vim.move(-1, 0, -1, 0)
  }
  client.vim.isInsert = false
  client.vim.isVisual = false
  client.cursor.ins = false
  client.cursor.reset()
}

motions.d = function () {
  if (client.vim.isVisual) { client.vim.isVisual = false }
  client.cursor.cut()
}

motions.x = function () {
  if (client.vim.isVisual) { client.vim.isVisual = false }
  client.cursor.cut()
}

motions.y = function () {
  if (client.vim.isVisual) { client.vim.isVisual = false }
  client.cursor.copy()
}

motions.p = function () {
  client.cursor.paste()
}

motions.u = function () {
  client.history.undo()
}

motions.v = function () {
  client.vim.isVisual = !client.vim.isVisual
  if (client.vim.isVisual) {
    client.cursor.select(client.cursor.x, client.cursor.y, client.cursor.w, client.cursor.h)
  } else {
    client.cursor.reset()
  }
}

motions.m = function () {
  client.vim.setMark(client.vim.identifier, client.cursor.x, client.cursor.y)
}

motions.m = function () {
  client.cursor.move(client.orca.posAt(client.vim.getMark(client.vim.identifier)))
}

motions["/"] = function () {
  client.vim.clearInputBuffer()
  client.acels.setPipe(client.commander)
  client.commander.start('find:')
}
