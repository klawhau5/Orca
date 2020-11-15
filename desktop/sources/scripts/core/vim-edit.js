'use strict'

/* global client */

const editKeys = {}

editKeys.i = function (command) {
  client.cursor.ins = true
  client.vim.isInsert = true
}

editKeys.r = function (command) {
  client.orca.replaceAt(character, client.orca.indexAt(client.cursor.x, client.cursor.y))
}

editKeys.y = function (command) {
  if (client.vim.isVisual) { client.vim.isVisual = false }
  client.vim.yank()
}

editKeys.p = function (command) {
  client.vim.put()
}

editKeys.u = function (command) {
  client.history.undo()
}

editKeys.x = function (command) {
  if (client.vim.isVisual) { client.vim.isVisual = false }
  client.vim.delete()
}

editKeys.v = function (command) {
  client.vim.isVisual = !client.vim.isVisual
  if (client.vim.isVisual) {
    client.cursor.select(client.cursor.x, client.cursor.y, client.cursor.w, client.cursor.h)
  } else {
    client.cursor.reset()
  }
}



