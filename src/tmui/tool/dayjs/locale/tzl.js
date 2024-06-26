!(function (e, _) {
  'object' == typeof exports && 'undefined' != typeof module
    ? (module.exports = _(require('dayjs')))
    : 'function' == typeof define && define.amd
    ? define(['dayjs'], _)
    : ((e = 'undefined' != typeof globalThis ? globalThis : e || self).dayjs_locale_tzl = _(e.dayjs))
})(this, function (e) {
  'use strict'
  function _(e) {
    return e && 'object' == typeof e && 'default' in e ? e : { default: e }
  }
  var t = _(e),
    a = {
      name: 'tzl',
      weekdays: 'Súladi_Lúneçi_Maitzi_Márcuri_Xhúadi_Viénerçi_Sáturi'.split('_'),
      months: 'Januar_Fevraglh_Març_Avrïu_Mai_Gün_Julia_Guscht_Setemvar_Listopäts_Noemvar_Zecemvar'.split('_'),
      weekStart: 1,
      weekdaysShort: 'Súl_Lún_Mai_Már_Xhú_Vié_Sát'.split('_'),
      monthsShort: 'Jan_Fev_Mar_Avr_Mai_Gün_Jul_Gus_Set_Lis_Noe_Zec'.split('_'),
      weekdaysMin: 'Sú_Lú_Ma_Má_Xh_Vi_Sá'.split('_'),
      ordinal: function (e) {
        return e
      },
      formats: {
        LT: 'HH.mm',
        LTS: 'HH.mm.ss',
        L: 'DD.MM.YYYY',
        LL: 'D. MMMM [dallas] YYYY',
        LLL: 'D. MMMM [dallas] YYYY HH.mm',
        LLLL: 'dddd, [li] D. MMMM [dallas] YYYY HH.mm',
      },
    }
  return t.default.locale(a, null, !0), a
})