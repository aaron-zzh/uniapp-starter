'use strict'
function t(t) {
  for (var e = Object.create(null), n = t.attributes.length; n--; ) e[t.attributes[n].name] = t.attributes[n].value
  return e
}
function e() {
  a[1] && ((this.src = a[1]), (this.onerror = null)),
    (this.onclick = null),
    (this.ontouchstart = null),
    uni.postMessage({ data: { action: 'onError', source: 'img', attrs: t(this) } })
}
function n() {
  ;(window.unloadimgs -= 1), 0 === window.unloadimgs && uni.postMessage({ data: { action: 'onReady' } })
}
function o(r, s, c) {
  for (var d = 0; d < r.length; d++)
    !(function (d) {
      var u = r[d],
        l = void 0
      if (u.type && 'node' !== u.type) l = document.createTextNode(u.text.replace(/&amp;/g, '&'))
      else {
        var g = u.name
        'svg' === g && (c = 'http://www.w3.org/2000/svg'),
          ('html' !== g && 'body' !== g) || (g = 'div'),
          (l = c ? document.createElementNS(c, g) : document.createElement(g))
        for (var p in u.attrs) l.setAttribute(p, u.attrs[p])
        if ((u.children && o(u.children, l, c), 'img' === g)) {
          if (
            ((window.unloadimgs += 1),
            (l.onload = n),
            (l.onerror = n),
            !l.src && l.getAttribute('data-src') && (l.src = l.getAttribute('data-src')),
            u.attrs.ignore ||
              (l.onclick = function (e) {
                e.stopPropagation(), uni.postMessage({ data: { action: 'onImgTap', attrs: t(this) } })
              }),
            a[2])
          ) {
            var h = new Image()
            ;(h.src = l.src),
              (l.src = a[2]),
              (h.onload = function () {
                l.src = this.src
              }),
              (h.onerror = function () {
                l.onerror()
              })
          }
          l.onerror = e
        } else if ('a' === g)
          l.addEventListener(
            'click',
            function (e) {
              e.stopPropagation(), e.preventDefault()
              var n,
                o = this.getAttribute('href')
              o && '#' === o[0] && (n = (document.getElementById(o.substr(1)) || {}).offsetTop),
                uni.postMessage({ data: { action: 'onLinkTap', attrs: t(this), offset: n } })
            },
            !0
          )
        else if ('video' === g || 'audio' === g)
          i.push(l),
            u.attrs.autoplay || u.attrs.controls || l.setAttribute('controls', 'true'),
            (l.onplay = function () {
              if ((uni.postMessage({ data: { action: 'onPlay' } }), a[3]))
                for (var t = 0; t < i.length; t++) i[t] !== this && i[t].pause()
            }),
            (l.onerror = function () {
              uni.postMessage({ data: { action: 'onError', source: g, attrs: t(this) } })
            })
        else if ('table' === g && a[4] && !l.style.cssText.includes('inline')) {
          var f = document.createElement('div')
          ;(f.style.overflow = 'auto'), f.appendChild(l), (l = f)
        } else 'svg' === g && (c = void 0)
      }
      s.appendChild(l)
    })(d)
}
document.addEventListener('UniAppJSBridgeReady', function () {
  ;(document.body.onclick = function () {
    return uni.postMessage({ data: { action: 'onClick' } })
  }),
    uni.postMessage({ data: { action: 'onJSBridgeReady' } })
})
var a,
  i = []
;(window.setContent = function (t, e, n) {
  var r = document.getElementById('content')
  e[0] && (document.body.style.cssText = e[0]),
    e[5] || (r.style.userSelect = 'none'),
    n || ((r.innerHTML = ''), (i = [])),
    (a = e),
    (window.unloadimgs = 0)
  var s = document.createDocumentFragment()
  o(t, s), r.appendChild(s)
  var c = r.scrollHeight
  uni.postMessage({ data: { action: 'onLoad', height: c } }),
    window.unloadimgs || uni.postMessage({ data: { action: 'onReady', height: c } }),
    clearInterval(window.timer),
    (window.timer = setInterval(function () {
      r.scrollHeight !== c && ((c = r.scrollHeight), uni.postMessage({ data: { action: 'onHeightChange', height: c } }))
    }, 350))
}),
  (window.onunload = function () {
    clearInterval(window.timer)
  })
