!(function (_, e) {
  'object' == typeof exports && 'undefined' != typeof module
    ? (module.exports = e(require('dayjs')))
    : 'function' == typeof define && define.amd
    ? define(['dayjs'], e)
    : ((_ = 'undefined' != typeof globalThis ? globalThis : _ || self).dayjs_locale_tzm = e(_.dayjs))
})(this, function (_) {
  'use strict'
  function e(_) {
    return _ && 'object' == typeof _ && 'default' in _ ? _ : { default: _ }
  }
  var t = e(_),
    d = {
      name: 'tzm',
      weekdays: 'ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ'.split('_'),
      months: 'ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ'.split('_'),
      weekStart: 6,
      weekdaysShort: 'ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ'.split('_'),
      monthsShort: 'ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ'.split('_'),
      weekdaysMin: 'ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ'.split('_'),
      ordinal: function (_) {
        return _
      },
      formats: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'DD/MM/YYYY',
        LL: 'D MMMM YYYY',
        LLL: 'D MMMM YYYY HH:mm',
        LLLL: 'dddd D MMMM YYYY HH:mm',
      },
      relativeTime: {
        future: 'ⴷⴰⴷⵅ ⵙ ⵢⴰⵏ %s',
        past: 'ⵢⴰⵏ %s',
        s: 'ⵉⵎⵉⴽ',
        m: 'ⵎⵉⵏⵓⴺ',
        mm: '%d ⵎⵉⵏⵓⴺ',
        h: 'ⵙⴰⵄⴰ',
        hh: '%d ⵜⴰⵙⵙⴰⵄⵉⵏ',
        d: 'ⴰⵙⵙ',
        dd: '%d oⵙⵙⴰⵏ',
        M: 'ⴰⵢoⵓⵔ',
        MM: '%d ⵉⵢⵢⵉⵔⵏ',
        y: 'ⴰⵙⴳⴰⵙ',
        yy: '%d ⵉⵙⴳⴰⵙⵏ',
      },
    }
  return t.default.locale(d, null, !0), d
})
