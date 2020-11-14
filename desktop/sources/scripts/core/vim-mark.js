'use strict'

/* global client */

const markKeys = {}

markKeys.m = function () {
  client.vim.setMark(client.vim.identifier, client.cursor.x, client.cursor.y)
}

markKeys["'"] = function () {
  const markIndex = client.vim.getMark(this.identifier)
  client.cursor.moveTo(client.orca.posAt(markIndex))
}
