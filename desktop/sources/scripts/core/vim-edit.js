'use strict'

/* global client */

const editKeys = {}

editKeys.i = function () {
  client.cursor.ins = true
  client.vim.isInsert = true
}

editKeys.r = function () {
  client.orca.replaceAt(character, client.orca.indexAt(client.cursor.x, client.cursor.y))
}

editKeys.y = function () {
  if (client.vim.isVisual) { client.vim.isVisual = false }
  client.cursor.copy()
}

editKeys.p = function () {
  client.cursor.paste()
}

editKeys.u = function () {
  client.history.undo()
}

editKeys.x = function () {
  if (client.vim.isVisual) { client.vim.isVisual = false }
  client.cursor.cut()
}

editKeys.v = function () {
  client.vim.isVisual = !client.vim.isVisual
  if (client.vim.isVisual) {
    client.cursor.select(client.cursor.x, client.cursor.y, client.cursor.w, client.cursor.h)
  } else {
    client.cursor.reset()
  }
}



