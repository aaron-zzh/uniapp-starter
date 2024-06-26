!(function (e, _) {
  'object' == typeof exports && 'undefined' != typeof module
    ? (module.exports = _(require('dayjs')))
    : 'function' == typeof define && define.amd
    ? define(['dayjs'], _)
    : ((e = 'undefined' != typeof globalThis ? globalThis : e || self).dayjs_locale_ar_tn = _(e.dayjs))
})(this, function (e) {
  'use strict'
  function _(e) {
    return e && 'object' == typeof e && 'default' in e ? e : { default: e }
  }
  var t = _(e),
    d = {
      name: 'ar-tn',
      weekdays: 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
      months: 'جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
      weekStart: 1,
      weekdaysShort: 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
      monthsShort: 'جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
      weekdaysMin: 'ح_ن_ث_ر_خ_ج_س'.split('_'),
      ordinal: function (e) {
        return e
      },
      formats: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'DD/MM/YYYY',
        LL: 'D MMMM YYYY',
        LLL: 'D MMMM YYYY HH:mm',
        LLLL: 'dddd D MMMM YYYY HH:mm',
      },
      meridiem: function (e) {
        return e > 12 ? 'ص' : 'م'
      },
      relativeTime: {
        future: 'في %s',
        past: 'منذ %s',
        s: 'ثوان',
        m: 'دقيقة',
        mm: '%d دقائق',
        h: 'ساعة',
        hh: '%d ساعات',
        d: 'يوم',
        dd: '%d أيام',
        M: 'شهر',
        MM: '%d أشهر',
        y: 'سنة',
        yy: '%d سنوات',
      },
    }
  return t.default.locale(d, null, !0), d
})
