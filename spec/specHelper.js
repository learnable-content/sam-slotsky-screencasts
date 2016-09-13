import { jsdom } from 'jsdom'

const doc = jsdom('<!doctype html><html><body></body></html>')

const win = doc.defaultView

global.document = doc
global.window = win

function propagateToGlobal(window) {
  Object.keys(window).forEach(key => {
    if (!global[key]) {
      global[key] = window[key]
    }
  })
}

propagateToGlobal(win)

