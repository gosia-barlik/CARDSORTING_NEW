!(function () {
  "use strict";
  /**
   * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
   *
   * @codingstandard ftlabs-jsv2
   * @copyright The Financial Times Limited [All Rights Reserved]
   * @license MIT License (see LICENSE.txt)
   */
  function a(b, d) {
    function e(a, b) {
      return function () {
        return a.apply(b, arguments);
      };
    }
    var f;
    if (
      ((d = d || {}),
      (this.trackingClick = !1),
      (this.trackingClickStart = 0),
      (this.targetElement = null),
      (this.touchStartX = 0),
      (this.touchStartY = 0),
      (this.lastTouchIdentifier = 0),
      (this.touchBoundary = d.touchBoundary || 10),
      (this.layer = b),
      (this.tapDelay = d.tapDelay || 200),
      (this.tapTimeout = d.tapTimeout || 700),
      !a.notNeeded(b))
    ) {
      for (
        var g = [
            "onMouse",
            "onClick",
            "onTouchStart",
            "onTouchMove",
            "onTouchEnd",
            "onTouchCancel",
          ],
          h = this,
          i = 0,
          j = g.length;
        j > i;
        i++
      )
        h[g[i]] = e(h[g[i]], h);
      c &&
        (b.addEventListener("mouseover", this.onMouse, !0),
        b.addEventListener("mousedown", this.onMouse, !0),
        b.addEventListener("mouseup", this.onMouse, !0)),
        b.addEventListener("click", this.onClick, !0),
        b.addEventListener("touchstart", this.onTouchStart, !1),
        b.addEventListener("touchmove", this.onTouchMove, !1),
        b.addEventListener("touchend", this.onTouchEnd, !1),
        b.addEventListener("touchcancel", this.onTouchCancel, !1),
        Event.prototype.stopImmediatePropagation ||
          ((b.removeEventListener = function (a, c, d) {
            var e = Node.prototype.removeEventListener;
            "click" === a
              ? e.call(b, a, c.hijacked || c, d)
              : e.call(b, a, c, d);
          }),
          (b.addEventListener = function (a, c, d) {
            var e = Node.prototype.addEventListener;
            "click" === a
              ? e.call(
                  b,
                  a,
                  c.hijacked ||
                    (c.hijacked = function (a) {
                      a.propagationStopped || c(a);
                    }),
                  d
                )
              : e.call(b, a, c, d);
          })),
        "function" == typeof b.onclick &&
          ((f = b.onclick),
          b.addEventListener(
            "click",
            function (a) {
              f(a);
            },
            !1
          ),
          (b.onclick = null));
    }
  }
  var b = navigator.userAgent.indexOf("Windows Phone") >= 0,
    c = navigator.userAgent.indexOf("Android") > 0 && !b,
    d = /iP(ad|hone|od)/.test(navigator.userAgent) && !b,
    e = d && /OS 4_\d(_\d)?/.test(navigator.userAgent),
    f = d && /OS [6-7]_\d/.test(navigator.userAgent),
    g = navigator.userAgent.indexOf("BB10") > 0;
  (a.prototype.needsClick = function (a) {
    switch (a.nodeName.toLowerCase()) {
      case "button":
      case "select":
      case "textarea":
        if (a.disabled) return !0;
        break;
      case "input":
        if ((d && "file" === a.type) || a.disabled) return !0;
        break;
      case "label":
      case "iframe":
      case "video":
        return !0;
    }
    return /\bneedsclick\b/.test(a.className);
  }),
    (a.prototype.needsFocus = function (a) {
      switch (a.nodeName.toLowerCase()) {
        case "textarea":
          return !0;
        case "select":
          return !c;
        case "input":
          switch (a.type) {
            case "button":
            case "checkbox":
            case "file":
            case "image":
            case "radio":
            case "submit":
              return !1;
          }
          return !a.disabled && !a.readOnly;
        default:
          return /\bneedsfocus\b/.test(a.className);
      }
    }),
    (a.prototype.sendClick = function (a, b) {
      var c, d;
      document.activeElement &&
        document.activeElement !== a &&
        document.activeElement.blur(),
        (d = b.changedTouches[0]),
        (c = document.createEvent("MouseEvents")),
        c.initMouseEvent(
          this.determineEventType(a),
          !0,
          !0,
          window,
          1,
          d.screenX,
          d.screenY,
          d.clientX,
          d.clientY,
          !1,
          !1,
          !1,
          !1,
          0,
          null
        ),
        (c.forwardedTouchEvent = !0),
        a.dispatchEvent(c);
    }),
    (a.prototype.determineEventType = function (a) {
      return c && "select" === a.tagName.toLowerCase() ? "mousedown" : "click";
    }),
    (a.prototype.focus = function (a) {
      var b;
      d &&
      a.setSelectionRange &&
      0 !== a.type.indexOf("date") &&
      "time" !== a.type &&
      "month" !== a.type
        ? ((b = a.value.length), a.setSelectionRange(b, b))
        : a.focus();
    }),
    (a.prototype.updateScrollParent = function (a) {
      var b, c;
      if (((b = a.fastClickScrollParent), !b || !b.contains(a))) {
        c = a;
        do {
          if (c.scrollHeight > c.offsetHeight) {
            (b = c), (a.fastClickScrollParent = c);
            break;
          }
          c = c.parentElement;
        } while (c);
      }
      b && (b.fastClickLastScrollTop = b.scrollTop);
    }),
    (a.prototype.getTargetElementFromEventTarget = function (a) {
      return a.nodeType === Node.TEXT_NODE ? a.parentNode : a;
    }),
    (a.prototype.onTouchStart = function (a) {
      var b, c, f;
      if (a.targetTouches.length > 1) return !0;
      if (
        ((b = this.getTargetElementFromEventTarget(a.target)),
        (c = a.targetTouches[0]),
        d)
      ) {
        if (((f = window.getSelection()), f.rangeCount && !f.isCollapsed))
          return !0;
        if (!e) {
          if (c.identifier && c.identifier === this.lastTouchIdentifier)
            return a.preventDefault(), !1;
          (this.lastTouchIdentifier = c.identifier), this.updateScrollParent(b);
        }
      }
      return (
        (this.trackingClick = !0),
        (this.trackingClickStart = a.timeStamp),
        (this.targetElement = b),
        (this.touchStartX = c.pageX),
        (this.touchStartY = c.pageY),
        a.timeStamp - this.lastClickTime < this.tapDelay && a.preventDefault(),
        !0
      );
    }),
    (a.prototype.touchHasMoved = function (a) {
      var b = a.changedTouches[0],
        c = this.touchBoundary;
      return Math.abs(b.pageX - this.touchStartX) > c ||
        Math.abs(b.pageY - this.touchStartY) > c
        ? !0
        : !1;
    }),
    (a.prototype.onTouchMove = function (a) {
      return this.trackingClick
        ? ((this.targetElement !==
            this.getTargetElementFromEventTarget(a.target) ||
            this.touchHasMoved(a)) &&
            ((this.trackingClick = !1), (this.targetElement = null)),
          !0)
        : !0;
    }),
    (a.prototype.findControl = function (a) {
      return void 0 !== a.control
        ? a.control
        : a.htmlFor
        ? document.getElementById(a.htmlFor)
        : a.querySelector(
            "button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea"
          );
    }),
    (a.prototype.onTouchEnd = function (a) {
      var b,
        g,
        h,
        i,
        j,
        k = this.targetElement;
      if (!this.trackingClick) return !0;
      if (a.timeStamp - this.lastClickTime < this.tapDelay)
        return (this.cancelNextClick = !0), !0;
      if (a.timeStamp - this.trackingClickStart > this.tapTimeout) return !0;
      if (
        ((this.cancelNextClick = !1),
        (this.lastClickTime = a.timeStamp),
        (g = this.trackingClickStart),
        (this.trackingClick = !1),
        (this.trackingClickStart = 0),
        f &&
          ((j = a.changedTouches[0]),
          (k =
            document.elementFromPoint(
              j.pageX - window.pageXOffset,
              j.pageY - window.pageYOffset
            ) || k),
          (k.fastClickScrollParent = this.targetElement.fastClickScrollParent)),
        (h = k.tagName.toLowerCase()),
        "label" === h)
      ) {
        if ((b = this.findControl(k))) {
          if ((this.focus(k), c)) return !1;
          k = b;
        }
      } else if (this.needsFocus(k))
        return a.timeStamp - g > 100 ||
          (d && window.top !== window && "input" === h)
          ? ((this.targetElement = null), !1)
          : (this.focus(k),
            this.sendClick(k, a),
            (d && "select" === h) ||
              ((this.targetElement = null), a.preventDefault()),
            !1);
      return d &&
        !e &&
        ((i = k.fastClickScrollParent),
        i && i.fastClickLastScrollTop !== i.scrollTop)
        ? !0
        : (this.needsClick(k) || (a.preventDefault(), this.sendClick(k, a)),
          !1);
    }),
    (a.prototype.onTouchCancel = function () {
      (this.trackingClick = !1), (this.targetElement = null);
    }),
    (a.prototype.onMouse = function (a) {
      return this.targetElement
        ? a.forwardedTouchEvent
          ? !0
          : a.cancelable &&
            (!this.needsClick(this.targetElement) || this.cancelNextClick)
          ? (a.stopImmediatePropagation
              ? a.stopImmediatePropagation()
              : (a.propagationStopped = !0),
            a.stopPropagation(),
            a.preventDefault(),
            !1)
          : !0
        : !0;
    }),
    (a.prototype.onClick = function (a) {
      var b;
      return this.trackingClick
        ? ((this.targetElement = null), (this.trackingClick = !1), !0)
        : "submit" === a.target.type && 0 === a.detail
        ? !0
        : ((b = this.onMouse(a)), b || (this.targetElement = null), b);
    }),
    (a.prototype.destroy = function () {
      var a = this.layer;
      c &&
        (a.removeEventListener("mouseover", this.onMouse, !0),
        a.removeEventListener("mousedown", this.onMouse, !0),
        a.removeEventListener("mouseup", this.onMouse, !0)),
        a.removeEventListener("click", this.onClick, !0),
        a.removeEventListener("touchstart", this.onTouchStart, !1),
        a.removeEventListener("touchmove", this.onTouchMove, !1),
        a.removeEventListener("touchend", this.onTouchEnd, !1),
        a.removeEventListener("touchcancel", this.onTouchCancel, !1);
    }),
    (a.notNeeded = function (a) {
      var b, d, e, f;
      if ("undefined" == typeof window.ontouchstart) return !0;
      if ((d = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1])) {
        if (!c) return !0;
        if ((b = document.querySelector("meta[name=viewport]"))) {
          if (-1 !== b.content.indexOf("user-scalable=no")) return !0;
          if (
            d > 31 &&
            document.documentElement.scrollWidth <= window.outerWidth
          )
            return !0;
        }
      }
      if (
        g &&
        ((e = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/)),
        e[1] >= 10 &&
          e[2] >= 3 &&
          (b = document.querySelector("meta[name=viewport]")))
      ) {
        if (-1 !== b.content.indexOf("user-scalable=no")) return !0;
        if (document.documentElement.scrollWidth <= window.outerWidth)
          return !0;
      }
      return "none" === a.style.msTouchAction ||
        "manipulation" === a.style.touchAction
        ? !0
        : ((f = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1]),
          f >= 27 &&
          ((b = document.querySelector("meta[name=viewport]")),
          b &&
            (-1 !== b.content.indexOf("user-scalable=no") ||
              document.documentElement.scrollWidth <= window.outerWidth))
            ? !0
            : "none" === a.style.touchAction ||
              "manipulation" === a.style.touchAction
            ? !0
            : !1);
    }),
    (a.attach = function (b, c) {
      return new a(b, c);
    }),
    "function" == typeof define && "object" == typeof define.amd && define.amd
      ? define(function () {
          return a;
        })
      : "undefined" != typeof module && module.exports
      ? ((module.exports = a.attach), (module.exports.FastClick = a))
      : (window.FastClick = a);
})();
foundation.alert.js;
