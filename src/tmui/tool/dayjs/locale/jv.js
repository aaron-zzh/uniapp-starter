!(function (e, n) {
  'object' == typeof exports && 'undefined' != typeof module
    ? (module.exports = n(require('dayjs')))
    : 'function' == typeof define && define.amd
    ? define(['dayjs'], n)
    : ((e = 'undefined' != typeof globalThis ? globalThis : e || self).dayjs_locale_jv = n(e.dayjs))
})(this, function (e) {
  'use strict'
  function n(e) {
    return e && 'object' == typeof e && 'default' in e ? e : { default: e }
  }
  var t = n(e),
    _ = {
      name: 'jv',
      weekdays: 'Minggu_Senen_Seloso_Rebu_Kemis_Jemuwah_Septu'.split('_'),
      months: 'Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_Nopember_Desember'.split('_'),
      weekStart: 1,
      weekdaysShort: 'Min_Sen_Sel_Reb_Kem_Jem_Sep'.split('_'),
      monthsShort: 'Jan_Feb_Mar_Apr_Mei_Jun_Jul_Ags_Sep_Okt_Nop_Des'.split('_'),
      weekdaysMin: 'Mg_Sn_Sl_Rb_Km_Jm_Sp'.split('_'),
      ordinal: function (e) {
        return e
      },
      formats: {
        LT: 'HH.mm',
        LTS: 'HH.mm.ss',
        L: 'DD/MM/YYYY',
        LL: 'D MMMM YYYY',
        LLL: 'D MMMM YYYY [pukul] HH.mm',
        LLLL: 'dddd, D MMMM YYYY [pukul] HH.mm',
      },
      relativeTime: {
        future: 'wonten ing %s',
        past: '%s ingkang kepengker',
        s: 'sawetawis detik',
        m: 'setunggal menit',
        mm: '%d menit',
        h: 'setunggal jam',
        hh: '%d jam',
        d: 'sedinten',
        dd: '%d dinten',
        M: 'sewulan',
        MM: '%d wulan',
        y: 'setaun',
        yy: '%d taun',
      },
    }
  return t.default.locale(_, null, !0), _
})
