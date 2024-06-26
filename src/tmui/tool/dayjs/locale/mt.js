!(function (e, t) {
  'object' == typeof exports && 'undefined' != typeof module
    ? (module.exports = t(require('dayjs')))
    : 'function' == typeof define && define.amd
    ? define(['dayjs'], t)
    : ((e = 'undefined' != typeof globalThis ? globalThis : e || self).dayjs_locale_mt = t(e.dayjs))
})(this, function (e) {
  'use strict'
  function t(e) {
    return e && 'object' == typeof e && 'default' in e ? e : { default: e }
  }
  var a = t(e),
    i = {
      name: 'mt',
      weekdays: 'Il-Ħadd_It-Tnejn_It-Tlieta_L-Erbgħa_Il-Ħamis_Il-Ġimgħa_Is-Sibt'.split('_'),
      months: 'Jannar_Frar_Marzu_April_Mejju_Ġunju_Lulju_Awwissu_Settembru_Ottubru_Novembru_Diċembru'.split('_'),
      weekStart: 1,
      weekdaysShort: 'Ħad_Tne_Tli_Erb_Ħam_Ġim_Sib'.split('_'),
      monthsShort: 'Jan_Fra_Mar_Apr_Mej_Ġun_Lul_Aww_Set_Ott_Nov_Diċ'.split('_'),
      weekdaysMin: 'Ħa_Tn_Tl_Er_Ħa_Ġi_Si'.split('_'),
      ordinal: function (e) {
        return e
      },
      formats: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'DD/MM/YYYY',
        LL: 'D MMMM YYYY',
        LLL: 'D MMMM YYYY HH:mm',
        LLLL: 'dddd, D MMMM YYYY HH:mm',
      },
      relativeTime: {
        future: 'f’ %s',
        past: '%s ilu',
        s: 'ftit sekondi',
        m: 'minuta',
        mm: '%d minuti',
        h: 'siegħa',
        hh: '%d siegħat',
        d: 'ġurnata',
        dd: '%d ġranet',
        M: 'xahar',
        MM: '%d xhur',
        y: 'sena',
        yy: '%d sni',
      },
    }
  return a.default.locale(i, null, !0), i
})
