!(function (t, s) {
  'object' == typeof exports && 'undefined' != typeof module
    ? (module.exports = s())
    : 'function' == typeof define && define.amd
    ? define(s)
    : ((t = 'undefined' != typeof globalThis ? globalThis : t || self).dayjs_plugin_duration = s())
})(this, function () {
  'use strict'
  var t,
    s,
    n = 1e3,
    i = 6e4,
    e = 36e5,
    r = 864e5,
    o = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,
    u = 31536e6,
    h = 2592e6,
    a =
      /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/,
    d = { years: u, months: h, days: r, hours: e, minutes: i, seconds: n, milliseconds: 1, weeks: 6048e5 },
    c = function (t) {
      return t instanceof p
    },
    f = function (t, s, n) {
      return new p(t, n, s.$l)
    },
    m = function (t) {
      return s.p(t) + 's'
    },
    l = function (t) {
      return t < 0
    },
    $ = function (t) {
      return l(t) ? Math.ceil(t) : Math.floor(t)
    },
    y = function (t) {
      return Math.abs(t)
    },
    g = function (t, s) {
      return t
        ? l(t)
          ? { negative: !0, format: '' + y(t) + s }
          : { negative: !1, format: '' + t + s }
        : { negative: !1, format: '' }
    },
    p = (function () {
      function l(t, s, n) {
        var i = this
        if (((this.$d = {}), (this.$l = n), void 0 === t && ((this.$ms = 0), this.parseFromMilliseconds()), s))
          return f(t * d[m(s)], this)
        if ('number' == typeof t) return (this.$ms = t), this.parseFromMilliseconds(), this
        if ('object' == typeof t)
          return (
            Object.keys(t).forEach(function (s) {
              i.$d[m(s)] = t[s]
            }),
            this.calMilliseconds(),
            this
          )
        if ('string' == typeof t) {
          var e = t.match(a)
          if (e) {
            var r = e.slice(2).map(function (t) {
              return null != t ? Number(t) : 0
            })
            return (
              (this.$d.years = r[0]),
              (this.$d.months = r[1]),
              (this.$d.weeks = r[2]),
              (this.$d.days = r[3]),
              (this.$d.hours = r[4]),
              (this.$d.minutes = r[5]),
              (this.$d.seconds = r[6]),
              this.calMilliseconds(),
              this
            )
          }
        }
        return this
      }
      var y = l.prototype
      return (
        (y.calMilliseconds = function () {
          var t = this
          this.$ms = Object.keys(this.$d).reduce(function (s, n) {
            return s + (t.$d[n] || 0) * d[n]
          }, 0)
        }),
        (y.parseFromMilliseconds = function () {
          var t = this.$ms
          ;(this.$d.years = $(t / u)),
            (t %= u),
            (this.$d.months = $(t / h)),
            (t %= h),
            (this.$d.days = $(t / r)),
            (t %= r),
            (this.$d.hours = $(t / e)),
            (t %= e),
            (this.$d.minutes = $(t / i)),
            (t %= i),
            (this.$d.seconds = $(t / n)),
            (t %= n),
            (this.$d.milliseconds = t)
        }),
        (y.toISOString = function () {
          var t = g(this.$d.years, 'Y'),
            s = g(this.$d.months, 'M'),
            n = +this.$d.days || 0
          this.$d.weeks && (n += 7 * this.$d.weeks)
          var i = g(n, 'D'),
            e = g(this.$d.hours, 'H'),
            r = g(this.$d.minutes, 'M'),
            o = this.$d.seconds || 0
          this.$d.milliseconds && (o += this.$d.milliseconds / 1e3)
          var u = g(o, 'S'),
            h = t.negative || s.negative || i.negative || e.negative || r.negative || u.negative,
            a = e.format || r.format || u.format ? 'T' : '',
            d = (h ? '-' : '') + 'P' + t.format + s.format + i.format + a + e.format + r.format + u.format
          return 'P' === d || '-P' === d ? 'P0D' : d
        }),
        (y.toJSON = function () {
          return this.toISOString()
        }),
        (y.format = function (t) {
          var n = t || 'YYYY-MM-DDTHH:mm:ss',
            i = {
              Y: this.$d.years,
              YY: s.s(this.$d.years, 2, '0'),
              YYYY: s.s(this.$d.years, 4, '0'),
              M: this.$d.months,
              MM: s.s(this.$d.months, 2, '0'),
              D: this.$d.days,
              DD: s.s(this.$d.days, 2, '0'),
              H: this.$d.hours,
              HH: s.s(this.$d.hours, 2, '0'),
              m: this.$d.minutes,
              mm: s.s(this.$d.minutes, 2, '0'),
              s: this.$d.seconds,
              ss: s.s(this.$d.seconds, 2, '0'),
              SSS: s.s(this.$d.milliseconds, 3, '0'),
            }
          return n.replace(o, function (t, s) {
            return s || String(i[t])
          })
        }),
        (y.as = function (t) {
          return this.$ms / d[m(t)]
        }),
        (y.get = function (t) {
          var s = this.$ms,
            n = m(t)
          return 'milliseconds' === n ? (s %= 1e3) : (s = 'weeks' === n ? $(s / d[n]) : this.$d[n]), 0 === s ? 0 : s
        }),
        (y.add = function (t, s, n) {
          var i
          return (i = s ? t * d[m(s)] : c(t) ? t.$ms : f(t, this).$ms), f(this.$ms + i * (n ? -1 : 1), this)
        }),
        (y.subtract = function (t, s) {
          return this.add(t, s, !0)
        }),
        (y.locale = function (t) {
          var s = this.clone()
          return (s.$l = t), s
        }),
        (y.clone = function () {
          return f(this.$ms, this)
        }),
        (y.humanize = function (s) {
          return t().add(this.$ms, 'ms').locale(this.$l).fromNow(!s)
        }),
        (y.milliseconds = function () {
          return this.get('milliseconds')
        }),
        (y.asMilliseconds = function () {
          return this.as('milliseconds')
        }),
        (y.seconds = function () {
          return this.get('seconds')
        }),
        (y.asSeconds = function () {
          return this.as('seconds')
        }),
        (y.minutes = function () {
          return this.get('minutes')
        }),
        (y.asMinutes = function () {
          return this.as('minutes')
        }),
        (y.hours = function () {
          return this.get('hours')
        }),
        (y.asHours = function () {
          return this.as('hours')
        }),
        (y.days = function () {
          return this.get('days')
        }),
        (y.asDays = function () {
          return this.as('days')
        }),
        (y.weeks = function () {
          return this.get('weeks')
        }),
        (y.asWeeks = function () {
          return this.as('weeks')
        }),
        (y.months = function () {
          return this.get('months')
        }),
        (y.asMonths = function () {
          return this.as('months')
        }),
        (y.years = function () {
          return this.get('years')
        }),
        (y.asYears = function () {
          return this.as('years')
        }),
        l
      )
    })()
  return function (n, i, e) {
    ;(t = e),
      (s = e().$utils()),
      (e.duration = function (t, s) {
        var n = e.locale()
        return f(t, { $l: n }, s)
      }),
      (e.isDuration = c)
    var r = i.prototype.add,
      o = i.prototype.subtract
    ;(i.prototype.add = function (t, s) {
      return c(t) && (t = t.asMilliseconds()), r.bind(this)(t, s)
    }),
      (i.prototype.subtract = function (t, s) {
        return c(t) && (t = t.asMilliseconds()), o.bind(this)(t, s)
      })
  }
})
