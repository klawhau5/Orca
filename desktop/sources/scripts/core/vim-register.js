'use strict'

/* global client */

const registerKeys = {}

registerKeys["\""] = function (command) {
  client.vim.setRegister(command.identifier)
}
