!(function (e, o) {
  'object' == typeof exports && 'undefined' != typeof module
    ? (module.exports = o())
    : 'function' == typeof define && define.amd
    ? define(o)
    : ((e = 'undefined' != typeof globalThis ? globalThis : e || self).dayjs_plugin_isToday = o())
})(this, function () {
  'use strict'
  return function (e, o, t) {
    o.prototype.isToday = function () {
      var e = 'YYYY-MM-DD',
        o = t()
      return this.format(e) === o.format(e)
    }
  }
})
