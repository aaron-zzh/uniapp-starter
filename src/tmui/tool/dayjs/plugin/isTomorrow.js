!(function (o, e) {
  'object' == typeof exports && 'undefined' != typeof module
    ? (module.exports = e())
    : 'function' == typeof define && define.amd
    ? define(e)
    : ((o = 'undefined' != typeof globalThis ? globalThis : o || self).dayjs_plugin_isTomorrow = e())
})(this, function () {
  'use strict'
  return function (o, e, t) {
    e.prototype.isTomorrow = function () {
      var o = 'YYYY-MM-DD',
        e = t().add(1, 'day')
      return this.format(o) === e.format(o)
    }
  }
})
