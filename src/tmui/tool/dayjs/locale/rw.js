!(function (a, e) {
  'object' == typeof exports && 'undefined' != typeof module
    ? (module.exports = e(require('dayjs')))
    : 'function' == typeof define && define.amd
    ? define(['dayjs'], e)
    : ((a = 'undefined' != typeof globalThis ? globalThis : a || self).dayjs_locale_rw = e(a.dayjs))
})(this, function (a) {
  'use strict'
  function e(a) {
    return a && 'object' == typeof a && 'default' in a ? a : { default: a }
  }
  var u = e(a),
    t = {
      name: 'rw',
      weekdays: 'Ku Cyumweru_Kuwa Mbere_Kuwa Kabiri_Kuwa Gatatu_Kuwa Kane_Kuwa Gatanu_Kuwa Gatandatu'.split('_'),
      months:
        'Mutarama_Gashyantare_Werurwe_Mata_Gicurasi_Kamena_Nyakanga_Kanama_Nzeri_Ukwakira_Ugushyingo_Ukuboza'.split(
          '_'
        ),
      relativeTime: {
        future: 'mu %s',
        past: '%s',
        s: 'amasegonda',
        m: 'Umunota',
        mm: '%d iminota',
        h: 'isaha',
        hh: '%d amasaha',
        d: 'Umunsi',
        dd: '%d iminsi',
        M: 'ukwezi',
        MM: '%d amezi',
        y: 'umwaka',
        yy: '%d imyaka',
      },
      formats: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'DD/MM/YYYY',
        LL: 'D MMMM YYYY',
        LLL: 'D MMMM YYYY HH:mm',
        LLLL: 'dddd, D MMMM YYYY HH:mm',
      },
      ordinal: function (a) {
        return a
      },
    }
  return u.default.locale(t, null, !0), t
})
