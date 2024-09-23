
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./sbnsolarsystemviewer.cjs.production.min.js')
} else {
  module.exports = require('./sbnsolarsystemviewer.cjs.development.js')
}
