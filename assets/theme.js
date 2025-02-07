(window.theme = window.theme || {}),
  (window.theme = window.theme || {}),
  (theme.Sections = function () {
    (this.constructors = {}),
      (this.instances = []),
      document.addEventListener(
        "shopify:section:load",
        this._onSectionLoad.bind(this)
      ),
      document.addEventListener(
        "shopify:section:unload",
        this._onSectionUnload.bind(this)
      ),
      document.addEventListener(
        "shopify:section:select",
        this._onSelect.bind(this)
      ),
      document.addEventListener(
        "shopify:section:deselect",
        this._onDeselect.bind(this)
      ),
      document.addEventListener(
        "shopify:block:select",
        this._onBlockSelect.bind(this)
      ),
      document.addEventListener(
        "shopify:block:deselect",
        this._onBlockDeselect.bind(this)
      );
  }),
  (theme.Sections.prototype = Object.assign({}, theme.Sections.prototype, {
    _createInstance: function (e, t) {
      var i = e.getAttribute("data-section-id"),
        s = e.getAttribute("data-section-type");
      if (void 0 !== (t = t || this.constructors[s])) {
        var n = Object.assign(new t(e), { id: i, type: s, container: e });
        this.instances.push(n);
      }
    },
    _onSectionLoad: function (e) {
      var t = document.querySelector(
        '[data-section-id="' + e.detail.sectionId + '"]'
      );
      t && this._createInstance(t);
    },
    _onSectionUnload: function (e) {
      this.instances = this.instances.filter(function (t) {
        var i = t.id === e.detail.sectionId;
        return i && "function" == typeof t.onUnload && t.onUnload(e), !i;
      });
    },
    _onSelect: function (e) {
      var t = this.instances.find(function (t) {
        return t.id === e.detail.sectionId;
      });
      void 0 !== t && "function" == typeof t.onSelect && t.onSelect(e);
    },
    _onDeselect: function (e) {
      var t = this.instances.find(function (t) {
        return t.id === e.detail.sectionId;
      });
      void 0 !== t && "function" == typeof t.onDeselect && t.onDeselect(e);
    },
    _onBlockSelect: function (e) {
      var t = this.instances.find(function (t) {
        return t.id === e.detail.sectionId;
      });
      void 0 !== t &&
        "function" == typeof t.onBlockSelect &&
        t.onBlockSelect(e);
    },
    _onBlockDeselect: function (e) {
      var t = this.instances.find(function (t) {
        return t.id === e.detail.sectionId;
      });
      void 0 !== t &&
        "function" == typeof t.onBlockDeselect &&
        t.onBlockDeselect(e);
    },
    register: function (e, t) {
      (this.constructors[e] = t),
        document.querySelectorAll('[data-section-type="' + e + '"]').forEach(
          function (e) {
            this._createInstance(e, t);
          }.bind(this)
        );
    },
  })),
  (window.slate = window.slate || {}),
  (slate.utils = {
    getParameterByName: function (e, t) {
      t || (t = window.location.href);
      var i = RegExp(
        "[?&]" + (e = e.replace(/[[\]]/g, "\\$&")) + "(=([^&#]*)|&|#|$)"
      ).exec(t);
      return i
        ? i[2]
          ? decodeURIComponent(i[2].replace(/\+/g, " "))
          : ""
        : null;
    },
    resizeSelects: function (e) {
      e.forEach(function (e) {
        var t = document.createElement("span");
        (t.innerHTML = e.selectedOptions[0].label),
          document.querySelector(".site-footer").appendChild(t);
        var i = t.offsetWidth + 55;
        t.remove(), (e.style.width = i + "px");
      });
    },
    keyboardKeys: {
      TAB: 9,
      ENTER: 13,
      ESCAPE: 27,
      LEFTARROW: 37,
      RIGHTARROW: 39,
    },
  }),
  (window.slate = window.slate || {}),
  (slate.rte = {
    wrapTable: function (e) {
      e.tables.forEach(function (t) {
        var i = document.createElement("div");
        i.classList.add(e.tableWrapperClass),
          t.parentNode.insertBefore(i, t),
          i.appendChild(t);
      });
    },
    wrapIframe: function (e) {
      e.iframes.forEach(function (t) {
        var i = document.createElement("div");
        i.classList.add(e.iframeWrapperClass),
          t.parentNode.insertBefore(i, t),
          i.appendChild(t),
          (t.src = t.src);
      });
    },
  }),
  (window.slate = window.slate || {}),
  (slate.a11y = {
    state: { firstFocusable: null, lastFocusable: null },
    pageLinkFocus: function (e) {
      if (e) {
        var t = "js-focus-hidden";
        e.setAttribute("tabIndex", "-1"),
          e.focus(),
          e.classList.add(t),
          e.addEventListener(
            "blur",
            function () {
              e.classList.remove(t), e.removeAttribute("tabindex");
            },
            { once: !0 }
          );
      }
    },
    trapFocus: function (e) {
      var t = Array.from(
        e.container.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex^="-"])'
        )
      ).filter(function (e) {
        var t = e.offsetWidth,
          i = e.offsetHeight;
        return (
          0 !== t &&
          0 !== i &&
          "none" !== getComputedStyle(e).getPropertyValue("display")
        );
      });
      (this.state.firstFocusable = t[0]),
        (this.state.lastFocusable = t[t.length - 1]),
        e.elementToFocus || (e.elementToFocus = e.container),
        e.container.setAttribute("tabindex", "-1"),
        e.elementToFocus.focus(),
        this._setupHandlers(),
        document.addEventListener("focusin", this._onFocusInHandler),
        document.addEventListener("focusout", this._onFocusOutHandler);
    },
    _setupHandlers: function () {
      this._onFocusInHandler ||
        (this._onFocusInHandler = this._onFocusIn.bind(this)),
        this._onFocusOutHandler ||
          (this._onFocusOutHandler = this._onFocusIn.bind(this)),
        this._manageFocusHandler ||
          (this._manageFocusHandler = this._manageFocus.bind(this));
    },
    _onFocusOut: function () {
      document.removeEventListener("keydown", this._manageFocusHandler);
    },
    _onFocusIn: function (e) {
      (e.target !== this.state.lastFocusable &&
        e.target !== this.state.firstFocusable) ||
        document.addEventListener("keydown", this._manageFocusHandler);
    },
    _manageFocus: function (e) {
      e.keyCode === slate.utils.keyboardKeys.TAB &&
        (e.target !== this.state.lastFocusable ||
          e.shiftKey ||
          (e.preventDefault(), this.state.firstFocusable.focus()),
        e.target === this.state.firstFocusable &&
          e.shiftKey &&
          (e.preventDefault(), this.state.lastFocusable.focus()));
    },
    removeTrapFocus: function (e) {
      e.container && e.container.removeAttribute("tabindex"),
        document.removeEventListener("focusin", this._onFocusInHandler);
    },
    accessibleLinks: function (e) {
      var t = document.querySelector("body"),
        i = {
          newWindow: "a11y-new-window-message",
          external: "a11y-external-message",
          newWindowExternal: "a11y-new-window-external-message",
        };
      (void 0 !== e.links && e.links.length) ||
        (e.links = document.querySelectorAll(
          "a[href]:not([aria-describedby])"
        )),
        e.links.forEach(function (e) {
          var t,
            s,
            n = e.getAttribute("target"),
            r = e.getAttribute("rel"),
            a = ((t = e), (s = window.location.hostname), t.hostname !== s),
            o = "_blank" === n;
          if ((a && e.setAttribute("aria-describedby", i.external), o)) {
            if (!r || -1 === r.indexOf("noopener")) {
              var c = void 0 === r ? "" : r + " ";
              (c += "noopener"), e.setAttribute("rel", c);
            }
            e.setAttribute("aria-describedby", i.newWindow);
          }
          a && o && e.setAttribute("aria-describedby", i.newWindowExternal);
        }),
        (function (e) {
          "object" != typeof e && (e = {});
          var s = Object.assign(
              {
                newWindow: "Opens in a new window.",
                external: "Opens external website.",
                newWindowExternal: "Opens external website in a new window.",
              },
              e
            ),
            n = document.createElement("ul"),
            r = "";
          for (var a in s) r += "<li id=" + i[a] + ">" + s[a] + "</li>";
          n.setAttribute("hidden", !0), (n.innerHTML = r), t.appendChild(n);
        })(e.messages);
    },
  }),
  (theme.Images = {
    preload: function (e, t) {
      "string" == typeof e && (e = [e]);
      for (var i = 0; i < e.length; i++) {
        var s = e[i];
        this.loadImage(this.getSizedImageUrl(s, t));
      }
    },
    loadImage: function (e) {
      new Image().src = e;
    },
    switchImage: function (e, t, i) {
      var s = this.imageSize(t.src),
        n = this.getSizedImageUrl(e.src, s);
      i ? i(n, e, t) : (t.src = n);
    },
    imageSize: function (e) {
      var t = e.match(
        /.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\\.@]/
      );
      return null !== t ? (void 0 !== t[2] ? t[1] + t[2] : t[1]) : null;
    },
    getSizedImageUrl: function (e, t) {
      if (null === t) return e;
      if ("master" === t) return this.removeProtocol(e);
      var i = e.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);
      if (null !== i) {
        var s = e.split(i[0]),
          n = i[0];
        return this.removeProtocol(s[0] + "_" + t + n);
      }
      return null;
    },
    removeProtocol: function (e) {
      return e.replace(/http(s)?:/, "");
    },
  }),
  (theme.Currency = {
    formatMoney: function (e, t) {
      "string" == typeof e && (e = e.replace(".", ""));
      var i = "",
        s = /\{\{\s*(\w+)\s*\}\}/,
        n = t || "${{amount}}";
      function r(e, t, i, s) {
        if (((i = i || ","), (s = s || "."), isNaN(e) || null === e)) return 0;
        var n = (e = (e / 100).toFixed(t)).split(".");
        return (
          n[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + i) +
          (n[1] ? s + n[1] : "")
        );
      }
      switch (n.match(s)[1]) {
        case "amount":
          i = r(e, 2);
          break;
        case "amount_no_decimals":
          i = r(e, 0);
          break;
        case "amount_with_comma_separator":
          i = r(e, 2, ".", ",");
          break;
        case "amount_no_decimals_with_comma_separator":
          i = r(e, 0, ".", ",");
          break;
        case "amount_no_decimals_with_space_separator":
          i = r(e, 0, " ");
          break;
        case "amount_with_apostrophe_separator":
          i = r(e, 2, "'");
      }
      return n.replace(s, i);
    },
  }),
  (slate.Variants = (function () {
    function e(e) {
      (this.container = e.container),
        (this.product = e.product),
        (this.originalSelectorId = e.originalSelectorId),
        (this.enableHistoryState = e.enableHistoryState),
        (this.singleOptions = this.container.querySelectorAll(
          e.singleOptionSelector
        )),
        (this.currentVariant = this._getVariantFromOptions()),
        this.singleOptions.forEach(
          function (e) {
            e.addEventListener("change", this._onSelectChange.bind(this));
          }.bind(this)
        );
    }
    return (
      (e.prototype = Object.assign({}, e.prototype, {
        _getCurrentOptions: function () {
          var e = [];
          return (
            this.singleOptions.forEach(function (t) {
              var i = t.getAttribute("type");
              (("radio" !== i && "checkbox" !== i) || t.checked) &&
                e.push({ value: t.value, index: t.getAttribute("data-index") });
            }),
            e
          );
        },
        _getVariantFromOptions: function () {
          var e = this._getCurrentOptions();
          return this.product.variants.find(function (t) {
            return e.every(function (e) {
              return t[e.index] === e.value;
            });
          });
        },
        _onSelectChange: function () {
          var e = this._getVariantFromOptions();
          this.container.dispatchEvent(
            new CustomEvent("variantChange", {
              detail: { variant: e },
              bubbles: !0,
              cancelable: !0,
            })
          ),
            e &&
              (this._updateMasterSelect(e),
              this._updateImages(e),
              this._updatePrice(e),
              this._updateSKU(e),
              (this.currentVariant = e),
              this.enableHistoryState && this._updateHistoryState(e));
        },
        _updateImages: function (e) {
          var t = e.featured_image || {},
            i = this.currentVariant.featured_image || {};
          e.featured_image &&
            t.src !== i.src &&
            this.container.dispatchEvent(
              new CustomEvent("variantImageChange", {
                detail: { variant: e },
                bubbles: !0,
                cancelable: !0,
              })
            );
        },
        _updatePrice: function (e) {
          (e.price === this.currentVariant.price &&
            e.compare_at_price === this.currentVariant.compare_at_price &&
            e.unit_price === this.currentVariant.unit_price) ||
            this.container.dispatchEvent(
              new CustomEvent("variantPriceChange", {
                detail: { variant: e },
                bubbles: !0,
                cancelable: !0,
              })
            );
        },
        _updateSKU: function (e) {
          e.sku !== this.currentVariant.sku &&
            this.container.dispatchEvent(
              new CustomEvent("variantSKUChange", {
                detail: { variant: e },
                bubbles: !0,
                cancelable: !0,
              })
            );
        },
        _updateHistoryState: function (e) {
          if (history.replaceState && e) {
            var t =
              window.location.protocol +
              "//" +
              window.location.host +
              window.location.pathname +
              "?variant=" +
              e.id;
            document.querySelector('.product-form__cart-submit').setAttribute('data-variant', e.id)
            
            checkProductsInCart()
            window.history.replaceState({ path: t }, "", t);
          }
        },
        _updateMasterSelect: function (e) {
          var t = this.container.querySelector(this.originalSelectorId);
          t && (t.value = e.id);
        },
      })),
      e
    );
  })()),
  (this.Shopify = this.Shopify || {}),
  (this.Shopify.theme = this.Shopify.theme || {}),
  (this.Shopify.theme.PredictiveSearch = (function () {
    "use strict";
    function e() {
      var e = Error.call(this);
      return (
        (e.name = "Server error"),
        (e.message = "Something went wrong on the server"),
        (e.status = 500),
        e
      );
    }
    function t(e) {
      var t = Error.call(this);
      return (
        (t.name = "Not found"), (t.message = "Not found"), (t.status = e), t
      );
    }
    function i() {
      var e = Error.call(this);
      return (
        (e.name = "Server error"),
        (e.message = "Something went wrong on the server"),
        (e.status = 500),
        e
      );
    }
    function s(e) {
      var t = Error.call(this);
      return (
        (t.name = "Content-Type error"),
        (t.message = "Content-Type was not provided or is of wrong type"),
        (t.status = e),
        t
      );
    }
    function n(e) {
      var t = Error.call(this);
      return (
        (t.name = "JSON parse error"),
        (t.message = "JSON syntax error"),
        (t.status = e),
        t
      );
    }
    function r(e, t, i, s) {
      var n = Error.call(this);
      return (
        (n.name = t), (n.message = i), (n.status = e), (n.retryAfter = s), n
      );
    }
    function a(e, t, i) {
      var s = Error.call(this);
      return (s.name = t), (s.message = i), (s.status = e), s;
    }
    function o(e, t, i) {
      var s = Error.call(this);
      return (s.name = t), (s.message = i), (s.status = e), s;
    }
    function c(e) {
      (this._store = {}),
        (this._keys = []),
        e && e.bucketSize
          ? (this.bucketSize = e.bucketSize)
          : (this.bucketSize = 20);
    }
    function l() {
      this.events = {};
    }
    function d(e) {
      (this.eventName = e), (this.callbacks = []);
    }
    (c.prototype.set = function (e, t) {
      if (this.count() >= this.bucketSize) {
        var i = this._keys.splice(0, 1);
        this.delete(i);
      }
      return this._keys.push(e), (this._store[e] = t), this._store;
    }),
      (c.prototype.get = function (e) {
        return this._store[e];
      }),
      (c.prototype.has = function (e) {
        return Boolean(this._store[e]);
      }),
      (c.prototype.count = function () {
        return Object.keys(this._store).length;
      }),
      (c.prototype.delete = function (e) {
        var t = Boolean(this._store[e]);
        return delete this._store[e], t && !this._store[e];
      }),
      (l.prototype.on = function (e, t) {
        var i = this.events[e];
        i || ((i = new d(e)), (this.events[e] = i)), i.registerCallback(t);
      }),
      (l.prototype.off = function (e, t) {
        var i = this.events[e];
        i &&
          i.callbacks.indexOf(t) > -1 &&
          (i.unregisterCallback(t),
          0 === i.callbacks.length && delete this.events[e]);
      }),
      (l.prototype.dispatch = function (e, t) {
        var i = this.events[e];
        i && i.fire(t);
      }),
      (d.prototype.registerCallback = function (e) {
        this.callbacks.push(e);
      }),
      (d.prototype.unregisterCallback = function (e) {
        var t = this.callbacks.indexOf(e);
        t > -1 && this.callbacks.splice(t, 1);
      }),
      (d.prototype.fire = function (e) {
        this.callbacks.slice(0).forEach(function (t) {
          t(e);
        });
      });
    var u,
      h,
      p,
      v =
        ((u = function (c, l, d, u, h) {
          var p = new XMLHttpRequest();
          (p.onreadystatechange = function () {
            if (p.readyState === XMLHttpRequest.DONE) {
              var c = p.getResponseHeader("Content-Type");
              if (p.status >= 500) h(new i());
              else if (404 !== p.status) {
                if (
                  "string" == typeof c &&
                  null !== c.toLowerCase().match("application/json")
                ) {
                  if (417 !== p.status) {
                    if (422 !== p.status) {
                      if (429 !== p.status) {
                        if (200 !== p.status)
                          try {
                            var l = JSON.parse(p.responseText);
                            h(new e(p.status, l.message, l.description));
                          } catch (v) {
                            h(new n(p.status));
                          }
                        else
                          try {
                            var m = JSON.parse(p.responseText);
                            (m.query = d), u(m);
                          } catch (f) {
                            h(new n(p.status));
                          }
                      } else
                        try {
                          var y = JSON.parse(p.responseText);
                          h(
                            new r(
                              p.status,
                              y.message,
                              y.description,
                              p.getResponseHeader("Retry-After")
                            )
                          );
                        } catch (g) {
                          h(new n(p.status));
                        }
                    } else
                      try {
                        var b = JSON.parse(p.responseText);
                        h(new o(p.status, b.message, b.description));
                      } catch (S) {
                        h(new n(p.status));
                      }
                  } else
                    try {
                      var L = JSON.parse(p.responseText);
                      h(new a(p.status, L.message, L.description));
                    } catch (E) {
                      h(new n(p.status));
                    }
                } else h(new s(p.status));
              } else h(new t(p.status));
            }
          }),
            p.open(
              "get",
              c + "/suggest.json?q=" + encodeURIComponent(d) + "&" + l
            ),
            p.setRequestHeader("Content-Type", "application/json"),
            p.send();
        }),
        (h = 10),
        (p = null),
        function () {
          var e = this,
            t = arguments;
          clearTimeout(p),
            (p = setTimeout(function () {
              (p = null), u.apply(e, t);
            }, h || 0));
        });
    function m(e, t) {
      if (!e) throw TypeError("No params object was specified");
      (this.searchUrl = t),
        (this._retryAfter = null),
        (this._currentQuery = null),
        (this.dispatcher = new l()),
        (this.cache = new c({ bucketSize: 40 })),
        (this.queryParams = (function e(t, i) {
          var s = "";
          return (
            (i = i || null),
            Object.keys(t).forEach(function (n) {
              var r,
                a = n + "=";
              switch (
                (i && (a = i + "[" + n + "]"),
                (r = t[n]),
                Object.prototype.toString.call(r).slice(8, -1).toLowerCase())
              ) {
                case "object":
                  s += e(t[n], i ? a : n);
                  break;
                case "array":
                  s += a + "=" + t[n].join(",") + "&";
                  break;
                default:
                  i && (a += "="), (s += a + encodeURIComponent(t[n]) + "&");
              }
            }),
            s
          );
        })(e));
    }
    function f(e) {
      return "string" != typeof e
        ? null
        : e.trim().replace(" ", "-").toLowerCase();
    }
    return (
      (m.TYPES = { PRODUCT: "product", PAGE: "page", ARTICLE: "article" }),
      (m.FIELDS = {
        AUTHOR: "author",
        BODY: "body",
        PRODUCT_TYPE: "product_type",
        TAG: "tag",
        TITLE: "title",
        VARIANTS_BARCODE: "variants.barcode",
        VARIANTS_SKU: "variants.sku",
        VARIANTS_TITLE: "variants.title",
        VENDOR: "vendor",
      }),
      (m.UNAVAILABLE_PRODUCTS = { SHOW: "show", HIDE: "hide", LAST: "last" }),
      (m.prototype.query = function (e) {
        try {
          !(function (e) {
            var t;
            if (null == e)
              throw (
                (((t = TypeError("'query' is missing")).type = "argument"), t)
              );
            if ("string" != typeof e)
              throw (
                (((t = TypeError("'query' is not a string")).type = "argument"),
                t)
              );
          })(e);
        } catch (t) {
          return void this.dispatcher.dispatch("error", t);
        }
        if ("" === e) return this;
        this._currentQuery = f(e);
        var i = this.cache.get(this._currentQuery);
        return i
          ? (this.dispatcher.dispatch("success", i), this)
          : (v(
              this.searchUrl,
              this.queryParams,
              e,
              function (e) {
                this.cache.set(f(e.query), e),
                  f(e.query) === this._currentQuery &&
                    ((this._retryAfter = null),
                    this.dispatcher.dispatch("success", e));
              }.bind(this),
              function (e) {
                e.retryAfter && (this._retryAfter = e.retryAfter),
                  this.dispatcher.dispatch("error", e);
              }.bind(this)
            ),
            this);
      }),
      (m.prototype.on = function (e, t) {
        return this.dispatcher.on(e, t), this;
      }),
      (m.prototype.off = function (e, t) {
        return this.dispatcher.off(e, t), this;
      }),
      m
    );
  })()),
  (this.Shopify = this.Shopify || {}),
  (this.Shopify.theme = this.Shopify.theme || {}),
  (this.Shopify.theme.PredictiveSearchComponent = (function (e) {
    "use strict";
    var t = {
      resources: {
        type: [
          (e = e && e.hasOwnProperty("default") ? e.default : e).TYPES.PRODUCT,
        ],
        options: {
          unavailable_products: e.UNAVAILABLE_PRODUCTS.LAST,
          fields: [
            e.FIELDS.TITLE,
            e.FIELDS.VENDOR,
            e.FIELDS.PRODUCT_TYPE,
            e.FIELDS.VARIANTS_TITLE,
          ],
        },
      },
    };
    function i(i) {
      if (
        !(
          i &&
          i.selectors &&
          i.selectors.input &&
          n(i.selectors.input) &&
          i.selectors.result &&
          n(i.selectors.result) &&
          i.resultTemplateFct &&
          a(i.resultTemplateFct) &&
          i.numberOfResultsTemplateFct &&
          a(i.numberOfResultsTemplateFct) &&
          i.loadingResultsMessageTemplateFct &&
          a(i.loadingResultsMessageTemplateFct)
        )
      ) {
        var s,
          r,
          o,
          c,
          l = TypeError("PredictiveSearchComponent config is not valid");
        throw ((l.type = "argument"), l);
      }
      ((this.nodes =
        ((o = i.selectors),
        {
          input: document.querySelector(o.input),
          reset: document.querySelector(o.reset),
          result: document.querySelector(o.result),
        })),
      (s = this.nodes) && s.input && s.result && "INPUT" === s.input.tagName)
        ? ((this.searchUrl = i.searchUrl || "/search"),
          (this._searchKeyword = ""),
          (this.resultTemplateFct = i.resultTemplateFct),
          (this.numberOfResultsTemplateFct = i.numberOfResultsTemplateFct),
          (this.loadingResultsMessageTemplateFct =
            i.loadingResultsMessageTemplateFct),
          (this.numberOfResults = i.numberOfResults || 4),
          (this.classes = {
            visibleVariant: i.visibleVariant
              ? i.visibleVariant
              : "predictive-search-wrapper--visible",
            itemSelected: i.itemSelectedClass
              ? i.itemSelectedClass
              : "predictive-search-item--selected",
            clearButtonVisible: i.clearButtonVisibleClass
              ? i.clearButtonVisibleClass
              : "predictive-search__clear-button--visible",
          }),
          (this.selectors = {
            searchResult: i.searchResult
              ? i.searchResult
              : "[data-search-result]",
          }),
          (this.callbacks = {
            onBodyMousedown: (r = i).onBodyMousedown,
            onBeforeOpen: r.onBeforeOpen,
            onOpen: r.onOpen,
            onBeforeClose: r.onBeforeClose,
            onClose: r.onClose,
            onInputFocus: r.onInputFocus,
            onInputKeyup: r.onInputKeyup,
            onInputBlur: r.onInputBlur,
            onInputReset: r.onInputReset,
            onBeforeDestroy: r.onBeforeDestroy,
            onDestroy: r.onDestroy,
          }),
          (c = this.nodes.input).setAttribute("autocorrect", "off"),
          c.setAttribute("autocomplete", "off"),
          c.setAttribute("autocapitalize", "off"),
          c.setAttribute("spellcheck", "false"),
          this._addInputEventListeners(),
          this._addBodyEventListener(),
          this._addAccessibilityAnnouncer(),
          this._toggleClearButtonVisibility(),
          (this.predictiveSearch = new e(
            i.PredictiveSearchAPIConfig ? i.PredictiveSearchAPIConfig : t,
            this.searchUrl
          )),
          this.predictiveSearch.on(
            "success",
            this._handlePredictiveSearchSuccess.bind(this)
          ),
          this.predictiveSearch.on(
            "error",
            this._handlePredictiveSearchError.bind(this)
          ))
        : console.warn("Could not find valid nodes");
    }
    function s(e) {
      return Object.prototype.toString.call(e);
    }
    function n(e) {
      return "[object String]" === s(e);
    }
    function r(e) {
      return "[object Boolean]" === s(e);
    }
    function a(e) {
      return "[object Function]" === s(e);
    }
    return (
      (i.prototype.isResultVisible = !1),
      (i.prototype.results = {}),
      (i.prototype._latencyTimer = null),
      (i.prototype._resultNodeClicked = !1),
      (i.prototype._addInputEventListeners = function () {
        var e = this.nodes.input,
          t = this.nodes.reset;
        e &&
          ((this._handleInputFocus = this._handleInputFocus.bind(this)),
          (this._handleInputBlur = this._handleInputBlur.bind(this)),
          (this._handleInputKeyup = this._handleInputKeyup.bind(this)),
          (this._handleInputKeydown = this._handleInputKeydown.bind(this)),
          e.addEventListener("focus", this._handleInputFocus),
          e.addEventListener("blur", this._handleInputBlur),
          e.addEventListener("keyup", this._handleInputKeyup),
          e.addEventListener("keydown", this._handleInputKeydown),
          t &&
            ((this._handleInputReset = this._handleInputReset.bind(this)),
            t.addEventListener("click", this._handleInputReset)));
      }),
      (i.prototype._removeInputEventListeners = function () {
        var e = this.nodes.input;
        e.removeEventListener("focus", this._handleInputFocus),
          e.removeEventListener("blur", this._handleInputBlur),
          e.removeEventListener("keyup", this._handleInputKeyup),
          e.removeEventListener("keydown", this._handleInputKeydown);
      }),
      (i.prototype._addBodyEventListener = function () {
        (this._handleBodyMousedown = this._handleBodyMousedown.bind(this)),
          document
            .querySelector("body")
            .addEventListener("mousedown", this._handleBodyMousedown);
      }),
      (i.prototype._removeBodyEventListener = function () {
        document
          .querySelector("body")
          .removeEventListener("mousedown", this._handleBodyMousedown);
      }),
      (i.prototype._removeClearButtonEventListener = function () {
        var e = this.nodes.reset;
        e && e.removeEventListener("click", this._handleInputReset);
      }),
      (i.prototype._handleBodyMousedown = function (e) {
        if (this.isResultVisible && null !== this.nodes) {
          if (
            e.target.isEqualNode(this.nodes.input) ||
            this.nodes.input.contains(e.target) ||
            e.target.isEqualNode(this.nodes.result) ||
            this.nodes.result.contains(e.target)
          )
            this._resultNodeClicked = !0;
          else if (a(this.callbacks.onBodyMousedown)) {
            var t = this.callbacks.onBodyMousedown(this.nodes);
            r(t) && t && this.close();
          } else this.close();
        }
      }),
      (i.prototype._handleInputFocus = function (e) {
        if (a(this.callbacks.onInputFocus)) {
          var t = this.callbacks.onInputFocus(this.nodes);
          if (r(t) && !t) return !1;
        }
        return e.target.value.length > 0 && this._search(), !0;
      }),
      (i.prototype._handleInputBlur = function () {
        return (
          setTimeout(
            function () {
              if (a(this.callbacks.onInputBlur)) {
                var e = this.callbacks.onInputBlur(this.nodes);
                if (r(e) && !e) return !1;
              }
              return (
                !document.activeElement.isEqualNode(this.nodes.reset) &&
                (this._resultNodeClicked
                  ? ((this._resultNodeClicked = !1), !1)
                  : void this.close())
              );
            }.bind(this)
          ),
          !0
        );
      }),
      (i.prototype._addAccessibilityAnnouncer = function () {
        (this._accessibilityAnnouncerDiv =
          window.document.createElement("div")),
          this._accessibilityAnnouncerDiv.setAttribute(
            "style",
            "position: absolute !important; overflow: hidden; clip: rect(0 0 0 0); height: 1px; width: 1px; margin: -1px; padding: 0; border: 0;"
          ),
          this._accessibilityAnnouncerDiv.setAttribute(
            "data-search-announcer",
            ""
          ),
          this._accessibilityAnnouncerDiv.setAttribute("aria-live", "polite"),
          this._accessibilityAnnouncerDiv.setAttribute("aria-atomic", "true"),
          this.nodes.result.parentElement.appendChild(
            this._accessibilityAnnouncerDiv
          );
      }),
      (i.prototype._removeAccessibilityAnnouncer = function () {
        this.nodes.result.parentElement.removeChild(
          this._accessibilityAnnouncerDiv
        );
      }),
      (i.prototype._updateAccessibilityAttributesAfterSelectingElement =
        function (e, t) {
          this.nodes.input.setAttribute("aria-activedescendant", t.id),
            e && e.removeAttribute("aria-selected"),
            t.setAttribute("aria-selected", !0);
        }),
      (i.prototype._clearAriaActiveDescendant = function () {
        this.nodes.input.setAttribute("aria-activedescendant", "");
      }),
      (i.prototype._announceNumberOfResultsFound = function (e) {
        var t = this._accessibilityAnnouncerDiv.innerHTML,
          i = this.numberOfResultsTemplateFct(e);
        t === i && (i += "&nbsp;"),
          (this._accessibilityAnnouncerDiv.innerHTML = i);
      }),
      (i.prototype._announceLoadingState = function () {
        this._accessibilityAnnouncerDiv.innerHTML =
          this.loadingResultsMessageTemplateFct();
      }),
      (i.prototype._handleInputKeyup = function (e) {
        if (a(this.callbacks.onInputKeyup)) {
          var t = this.callbacks.onInputKeyup(this.nodes);
          if (r(t) && !t) return !1;
        }
        if (
          (this._toggleClearButtonVisibility(),
          this.isResultVisible && null !== this.nodes)
        ) {
          if (38 === e.keyCode) return this._navigateOption(e, "UP"), !0;
          if (40 === e.keyCode) return this._navigateOption(e, "DOWN"), !0;
          if (13 === e.keyCode) return this._selectOption(), !0;
          27 === e.keyCode && this.close();
        }
        return (
          e.target.value.length <= 0
            ? (this.close(), this._setKeyword(""))
            : e.target.value.length > 0 && this._search(),
          !0
        );
      }),
      (i.prototype._handleInputKeydown = function (e) {
        13 === e.keyCode &&
          null !== this._getSelectedOption() &&
          e.preventDefault(),
          (38 !== e.keyCode && 40 !== e.keyCode) || e.preventDefault();
      }),
      (i.prototype._handleInputReset = function (e) {
        if ((e.preventDefault(), a(this.callbacks.onInputReset))) {
          var t = this.callbacks.onInputReset(this.nodes);
          if (r(t) && !t) return !1;
        }
        return (
          (this.nodes.input.value = ""),
          this.nodes.input.focus(),
          this._toggleClearButtonVisibility(),
          this.close(),
          !0
        );
      }),
      (i.prototype._navigateOption = function (e, t) {
        var i = this._getSelectedOption();
        if (i) {
          if ("DOWN" === t) {
            var s = i.nextElementSibling;
            s &&
              (i.classList.remove(this.classes.itemSelected),
              s.classList.add(this.classes.itemSelected),
              this._updateAccessibilityAttributesAfterSelectingElement(i, s));
          } else {
            var n = i.previousElementSibling;
            n &&
              (i.classList.remove(this.classes.itemSelected),
              n.classList.add(this.classes.itemSelected),
              this._updateAccessibilityAttributesAfterSelectingElement(i, n));
          }
        } else {
          var r = this.nodes.result.querySelector(this.selectors.searchResult);
          r.classList.add(this.classes.itemSelected),
            this._updateAccessibilityAttributesAfterSelectingElement(null, r);
        }
      }),
      (i.prototype._getSelectedOption = function () {
        return this.nodes.result.querySelector("." + this.classes.itemSelected);
      }),
      (i.prototype._selectOption = function () {
        var e = this._getSelectedOption();
        e && e.querySelector("a, button").click();
      }),
      (i.prototype._search = function () {
        var e = this.nodes.input.value;
        this._searchKeyword !== e &&
          (clearTimeout(this._latencyTimer),
          (this._latencyTimer = setTimeout(
            function () {
              (this.results.isLoading = !0),
                this._announceLoadingState(),
                this.nodes.result.classList.add(this.classes.visibleVariant),
                (this.nodes.result.innerHTML = this.resultTemplateFct(
                  this.results
                ));
            }.bind(this),
            500
          )),
          this.predictiveSearch.query(e),
          this._setKeyword(e));
      }),
      (i.prototype._handlePredictiveSearchSuccess = function (e) {
        clearTimeout(this._latencyTimer),
          (this.results = e.resources.results),
          (this.results.isLoading = !1),
          (this.results.products = this.results.products.slice(
            0,
            this.numberOfResults
          )),
          (this.results.canLoadMore =
            this.numberOfResults <= this.results.products.length),
          (this.results.searchQuery = this.nodes.input.value),
          this.results.products.length > 0 || this.results.searchQuery
            ? ((this.nodes.result.innerHTML = this.resultTemplateFct(
                this.results
              )),
              this._announceNumberOfResultsFound(this.results),
              this.open())
            : ((this.nodes.result.innerHTML = ""), this._closeOnNoResults());
      }),
      (i.prototype._handlePredictiveSearchError = function () {
        clearTimeout(this._latencyTimer),
          (this.nodes.result.innerHTML = ""),
          this._closeOnNoResults();
      }),
      (i.prototype._closeOnNoResults = function () {
        this.nodes &&
          this.nodes.result.classList.remove(this.classes.visibleVariant),
          (this.isResultVisible = !1);
      }),
      (i.prototype._setKeyword = function (e) {
        this._searchKeyword = e;
      }),
      (i.prototype._toggleClearButtonVisibility = function () {
        this.nodes.reset &&
          (this.nodes.input.value.length > 0
            ? this.nodes.reset.classList.add(this.classes.clearButtonVisible)
            : this.nodes.reset.classList.remove(
                this.classes.clearButtonVisible
              ));
      }),
      (i.prototype.open = function () {
        if (!this.isResultVisible) {
          if (a(this.callbacks.onBeforeOpen)) {
            var e = this.callbacks.onBeforeOpen(this.nodes);
            if (r(e) && !e) return !1;
          }
          return (
            this.nodes.result.classList.add(this.classes.visibleVariant),
            this.nodes.input.setAttribute("aria-expanded", !0),
            (this.isResultVisible = !0),
            (a(this.callbacks.onOpen) && this.callbacks.onOpen(this.nodes)) ||
              !0
          );
        }
      }),
      (i.prototype.close = function () {
        if (!this.isResultVisible) return !0;
        if (a(this.callbacks.onBeforeClose)) {
          var e = this.callbacks.onBeforeClose(this.nodes);
          if (r(e) && !e) return !1;
        }
        return (
          this.nodes &&
            this.nodes.result.classList.remove(this.classes.visibleVariant),
          this.nodes.input.setAttribute("aria-expanded", !1),
          this._clearAriaActiveDescendant(),
          this._setKeyword(""),
          a(this.callbacks.onClose) && this.callbacks.onClose(this.nodes),
          (this.isResultVisible = !1),
          (this.results = {}),
          !0
        );
      }),
      (i.prototype.destroy = function () {
        if ((this.close(), a(this.callbacks.onBeforeDestroy))) {
          var e,
            t = this.callbacks.onBeforeDestroy(this.nodes);
          if (r(t) && !t) return !1;
        }
        return (
          this.nodes.result.classList.remove(this.classes.visibleVariant),
          (e = this.nodes.input).removeAttribute("autocorrect", "off"),
          e.removeAttribute("autocomplete", "off"),
          e.removeAttribute("autocapitalize", "off"),
          e.removeAttribute("spellcheck", "false"),
          this._removeInputEventListeners(),
          this._removeBodyEventListener(),
          this._removeAccessibilityAnnouncer(),
          this._removeClearButtonEventListener(),
          a(this.callbacks.onDestroy) && this.callbacks.onDestroy(this.nodes),
          !0
        );
      }),
      (i.prototype.clearAndClose = function () {
        (this.nodes.input.value = ""), this.close();
      }),
      i
    );
  })(Shopify.theme.PredictiveSearch)),
  (window.theme = window.theme || {}),
  (theme.TouchEvents = function (e, t) {
    this.axis,
      (this.checkEvents = []),
      (this.eventHandlers = {}),
      (this.eventModel = {}),
      (this.events = [
        ["touchstart", "touchmove", "touchend", "touchcancel"],
        ["pointerdown", "pointermove", "pointerup", "pointercancel"],
        ["mousedown", "mousemove", "mouseup"],
      ]),
      this.eventType,
      (this.difference = {}),
      this.direction,
      (this.start = {}),
      (this.element = e),
      (this.options = Object.assign(
        {},
        {
          dragThreshold: 10,
          start: function () {},
          move: function () {},
          end: function () {},
        },
        t
      )),
      (this.checkEvents = this._getCheckEvents()),
      (this.eventModel = this._getEventModel()),
      this._setupEventHandlers();
  }),
  (theme.TouchEvents.prototype = Object.assign(
    {},
    theme.TouchEvents.prototype,
    {
      destroy: function () {
        this.element.removeEventListener(
          "dragstart",
          this.eventHandlers.preventDefault
        ),
          this.element.removeEventListener(
            this.events[this.eventModel][0],
            this.eventHandlers.touchStart
          ),
          this.eventModel ||
            this.element.removeEventListener(
              this.events[2][0],
              this.eventHandlers.touchStart
            ),
          this.element.removeEventListener(
            "click",
            this.eventHandlers.preventClick
          );
      },
      _setupEventHandlers: function () {
        (this.eventHandlers.preventDefault = this._preventDefault.bind(this)),
          (this.eventHandlers.preventClick = this._preventClick.bind(this)),
          (this.eventHandlers.touchStart = this._touchStart.bind(this)),
          (this.eventHandlers.touchMove = this._touchMove.bind(this)),
          (this.eventHandlers.touchEnd = this._touchEnd.bind(this)),
          this.element.addEventListener(
            "dragstart",
            this.eventHandlers.preventDefault
          ),
          this.element.addEventListener(
            this.events[this.eventModel][0],
            this.eventHandlers.touchStart
          ),
          this.eventModel ||
            this.element.addEventListener(
              this.events[2][0],
              this.eventHandlers.touchStart
            ),
          this.element.addEventListener(
            "click",
            this.eventHandlers.preventClick
          );
      },
      _touchStart: function (e) {
        (this.eventType = this.eventModel),
          "mousedown" !== e.type || this.eventModel || (this.eventType = 2),
          this.checkEvents[this.eventType](e) ||
            (this.eventType && this._preventDefault(e),
            document.addEventListener(
              this.events[this.eventType][1],
              this.eventHandlers.touchMove
            ),
            document.addEventListener(
              this.events[this.eventType][2],
              this.eventHandlers.touchEnd
            ),
            this.eventType < 2 &&
              document.addEventListener(
                this.events[this.eventType][3],
                this.eventHandlers.touchEnd
              ),
            (this.start = {
              xPosition: this.eventType ? e.clientX : e.touches[0].clientX,
              yPosition: this.eventType ? e.clientY : e.touches[0].clientY,
              time: new Date().getTime(),
            }),
            Object.keys(this.difference).forEach(
              function (e) {
                delete this.difference[e];
              }.bind(this)
            ),
            this.options.start(e));
      },
      _touchMove: function (e) {
        (this.difference = this._getDifference(e)),
          (document["on" + this.events[this.eventType][1]] = function (e) {
            this._preventDefault(e);
          }.bind(this)),
          this.axis
            ? "xPosition" === this.axis
              ? (this.direction =
                  this.difference.xPosition < 0 ? "left" : "right")
              : "yPosition" === this.axis &&
                (this.direction = this.difference.yPosition < 0 ? "up" : "down")
            : this.options.dragThreshold < Math.abs(this.difference.xPosition)
            ? (this.axis = "xPosition")
            : this.options.dragThreshold < Math.abs(this.difference.yPosition)
            ? (this.axis = "yPosition")
            : (this.axis = !1),
          this.options.move(e, this.direction, this.difference);
      },
      _touchEnd: function (e) {
        document.removeEventListener(
          this.events[this.eventType][1],
          this.eventHandlers.touchMove
        ),
          document.removeEventListener(
            this.events[this.eventType][2],
            this.eventHandlers.touchEnd
          ),
          this.eventType < 2 &&
            document.removeEventListener(
              this.events[this.eventType][3],
              this.eventHandlers.touchEnd
            ),
          (document["on" + this.events[this.eventType][1]] = function () {
            return !0;
          }),
          this.options.end(e, this.direction, this.difference),
          (this.axis = !1);
      },
      _getDifference: function (e) {
        return {
          xPosition:
            (this.eventType ? e.clientX : e.touches[0].clientX) -
            this.start.xPosition,
          yPosition:
            (this.eventType ? e.clientY : e.touches[0].clientY) -
            this.start.yPosition,
          time: new Date().getTime() - this.start.time,
        };
      },
      _getCheckEvents: function () {
        return [
          function (e) {
            return (
              (e.touches && e.touches.length > 1) || (e.scale && 1 !== e.scale)
            );
          },
          function (e) {
            return (
              !e.isPrimary ||
              (e.buttons && 1 !== e.buttons) ||
              ("touch" !== e.pointerType && "pen" !== e.pointerType)
            );
          },
          function (e) {
            return e.buttons && 1 !== e.buttons;
          },
        ];
      },
      _getEventModel: function () {
        return window.navigator.pointerEnabled ? 1 : 0;
      },
      _preventDefault: function (e) {
        e.preventDefault ? e.preventDefault() : (e.returnValue = !1);
      },
      _preventClick: function (e) {
        Math.abs(this.difference.xPosition) > this.options.dragThreshold &&
          this._preventDefault(e);
      },
    }
  )),
  (theme.Drawers = (function () {
    function e(e, t, i) {
      if (
        ((this.nodes = {
          parents: [document.documentElement, document.body],
          page: document.getElementById("PageContainer"),
        }),
        (this.eventHandlers = {}),
        (this.config = Object.assign(
          {},
          {
            selectors: {
              openVariant: ".js-drawer-open-" + t,
              close: ".js-drawer-close",
            },
            classes: {
              open: "js-drawer-open",
              openVariant: "js-drawer-open-" + t,
            },
            withPredictiveSearch: !1,
          },
          i
        )),
        (this.position = t),
        (this.drawer = document.getElementById(e)),
        !this.drawer)
      )
        return !1;
      (this.drawerIsOpen = !1), this.init();
    }
    return (
      (e.prototype.init = function () {
        document
          .querySelector(this.config.selectors.openVariant)
          .addEventListener("click", this.open.bind(this)),
          this.drawer
            .querySelector(this.config.selectors.close)
            .addEventListener("click", this.close.bind(this));
      }),
      (e.prototype.open = function (e) {
        var t = !1;
        if (
          (e ? e.preventDefault() : (t = !0),
          e &&
            e.stopPropagation &&
            (e.stopPropagation(), (this.activeSource = e.currentTarget)),
          this.drawerIsOpen && !t)
        )
          return this.close();
        this.config.withPredictiveSearch ||
          theme.Helpers.prepareTransition(this.drawer),
          this.nodes.parents.forEach(
            function (e) {
              e.classList.add(
                this.config.classes.open,
                this.config.classes.openVariant
              );
            }.bind(this)
          ),
          (this.drawerIsOpen = !0),
          this.config.onDrawerOpen &&
            "function" == typeof this.config.onDrawerOpen &&
            (t || this.config.onDrawerOpen()),
          this.activeSource &&
            this.activeSource.hasAttribute("aria-expanded") &&
            this.activeSource.setAttribute("aria-expanded", "true");
        var i = { container: this.drawer };
        return (
          this.config.elementToFocusOnOpen &&
            (i.elementToFocus = this.config.elementToFocusOnOpen),
          slate.a11y.trapFocus(i),
          this.bindEvents(),
          this
        );
      }),
      (e.prototype.close = function () {
        this.drawerIsOpen &&
          (document.activeElement.dispatchEvent(
            new CustomEvent("blur", { bubbles: !0, cancelable: !0 })
          ),
          this.config.withPredictiveSearch ||
            theme.Helpers.prepareTransition(this.drawer),
          this.nodes.parents.forEach(
            function (e) {
              e.classList.remove(
                this.config.classes.open,
                this.config.classes.openVariant
              );
            }.bind(this)
          ),
          this.activeSource &&
            this.activeSource.hasAttribute("aria-expanded") &&
            this.activeSource.setAttribute("aria-expanded", "false"),
          (this.drawerIsOpen = !1),
          slate.a11y.removeTrapFocus({ container: this.drawer }),
          this.unbindEvents(),
          this.config.onDrawerClose &&
            "function" == typeof this.config.onDrawerClose &&
            this.config.onDrawerClose());
      }),
      (e.prototype.bindEvents = function () {
        (this.eventHandlers.drawerKeyupHandler = function (e) {
          return 27 !== e.keyCode || (this.close(), !1);
        }.bind(this)),
          (this.eventHandlers.drawerTouchmoveHandler = function () {
            return !1;
          }),
          (this.eventHandlers.drawerClickHandler = function () {
            return this.close(), !1;
          }.bind(this)),
          document.body.addEventListener(
            "keyup",
            this.eventHandlers.drawerKeyupHandler
          ),
          this.nodes.page.addEventListener(
            "touchmove",
            this.eventHandlers.drawerTouchmoveHandler
          ),
          this.nodes.page.addEventListener(
            "click",
            this.eventHandlers.drawerClickHandler
          );
      }),
      (e.prototype.unbindEvents = function () {
        this.nodes.page.removeEventListener(
          "touchmove",
          this.eventHandlers.drawerTouchmoveHandler
        ),
          this.nodes.page.removeEventListener(
            "click",
            this.eventHandlers.drawerClickHandler
          ),
          document.body.removeEventListener(
            "keyup",
            this.eventHandlers.drawerKeyupHandler
          );
      }),
      e
    );
  })()),
  (theme.Helpers = (function () {
    var e = !1,
      t = { preventScrolling: "prevent-scrolling" },
      i = window.pageYOffset;
    return {
      setTouch: function () {
        e = !0;
      },
      isTouch: function () {
        return e;
      },
      enableScrollLock: function () {
        (i = window.pageYOffset),
          (document.body.style.top = "-" + i + "px"),
          document.body.classList.add(t.preventScrolling);
      },
      disableScrollLock: function () {
        document.body.classList.remove(t.preventScrolling),
          document.body.style.removeProperty("top"),
          window.scrollTo(0, i);
      },
      debounce: function (e, t, i) {
        var s;
        return function () {
          var n = this,
            r = arguments,
            a = i && !s;
          clearTimeout(s),
            (s = setTimeout(function () {
              (s = null), i || e.apply(n, r);
            }, t)),
            a && e.apply(n, r);
        };
      },
      getScript: function (e, t) {
        return new Promise(function (i, s) {
          var n = document.createElement("script"),
            r = t || document.getElementsByTagName("script")[0];
          function a(e, t) {
            (t || !n.readyState || /loaded|complete/.test(n.readyState)) &&
              ((n.onload = null),
              (n.onreadystatechange = null),
              (n = void 0),
              t ? s() : i());
          }
          (n.async = !0),
            (n.defer = !0),
            (n.onload = a),
            (n.onreadystatechange = a),
            (n.src = e),
            r.parentNode.insertBefore(n, r);
        });
      },
      prepareTransition: function (e) {
        e.addEventListener(
          "transitionend",
          function (e) {
            e.currentTarget.classList.remove("is-transitioning");
          },
          { once: !0 }
        );
        var t = 0;
        [
          "transition-duration",
          "-moz-transition-duration",
          "-webkit-transition-duration",
          "-o-transition-duration",
        ].forEach(function (i) {
          var s = getComputedStyle(e)[i];
          s && (s.replace(/\D/g, ""), t || (t = parseFloat(s)));
        }),
          0 !== t && (e.classList.add("is-transitioning"), e.offsetWidth);
      },
      serialize: function (e) {
        var t = [];
        return (
          Array.prototype.slice.call(e.elements).forEach(function (e) {
            !e.name ||
              e.disabled ||
              ["file", "reset", "submit", "button"].indexOf(e.type) > -1 ||
              ("select-multiple" !== e.type
                ? (["checkbox", "radio"].indexOf(e.type) > -1 && !e.checked) ||
                  t.push(
                    encodeURIComponent(e.name) +
                      "=" +
                      encodeURIComponent(e.value)
                  )
                : Array.prototype.slice.call(e.options).forEach(function (i) {
                    i.selected &&
                      t.push(
                        encodeURIComponent(e.name) +
                          "=" +
                          encodeURIComponent(i.value)
                      );
                  }));
          }),
          t.join("&")
        );
      },
      cookiesEnabled: function () {
        var e = navigator.cookieEnabled;
        return (
          e ||
            ((document.cookie = "testcookie"),
            (e = -1 !== document.cookie.indexOf("testcookie"))),
          e
        );
      },
      promiseStylesheet: function (e) {
        var t = e || theme.stylesheet;
        return (
          void 0 === this.stylesheetPromise &&
            (this.stylesheetPromise = new Promise(function (e) {
              var i = document.querySelector('link[href="' + t + '"]');
              i.loaded && e(),
                i.addEventListener("load", function () {
                  setTimeout(e, 0);
                });
            })),
          this.stylesheetPromise
        );
      },
    };
  })()),
  (theme.LibraryLoader = (function () {
    var e = { link: "link", script: "script" },
      t = { requested: "requested", loaded: "loaded" },
      i = "https://cdn.shopify.com/shopifycloud/",
      s = {
        plyrShopifyStyles: {
          tagId: "plyr-shopify-styles",
          src: i + "plyr/v2.0/shopify-plyr.css",
          type: e.link,
        },
        modelViewerUiStyles: {
          tagId: "shopify-model-viewer-ui-styles",
          src: i + "model-viewer-ui/assets/v1.0/model-viewer-ui.css",
          type: e.link,
        },
      };
    return {
      load: function (i, n) {
        var r = s[i];
        if (r && r.status !== t.requested) {
          if (((n = n || function () {}), r.status !== t.loaded)) {
            switch (((r.status = t.requested), r.type)) {
              case e.script:
                h =
                  ((a = r),
                  (o = n),
                  ((c = document.createElement("script")).src = a.src),
                  c.addEventListener("load", function () {
                    (a.status = t.loaded), o();
                  }),
                  c);
                break;
              case e.link:
                h =
                  ((l = r),
                  (d = n),
                  ((u = document.createElement("link")).href = l.src),
                  (u.rel = "stylesheet"),
                  (u.type = "text/css"),
                  u.addEventListener("load", function () {
                    (l.status = t.loaded), d();
                  }),
                  u);
            }
            (h.id = r.tagId), (r.element = h);
            var a,
              o,
              c,
              l,
              d,
              u,
              h,
              p = document.getElementsByTagName(r.type)[0];
            p.parentNode.insertBefore(h, p);
          } else n();
        }
      },
    };
  })()),
  (window.theme = window.theme || {}),
  (theme.Header = (function () {
    var e = {
        body: "body",
        navigation: "#AccessibleNav",
        siteNavHasDropdown: "[data-has-dropdowns]",
        siteNavChildLinks: ".site-nav__child-link",
        siteNavActiveDropdown: ".site-nav--active-dropdown",
        siteNavHasCenteredDropdown: ".site-nav--has-centered-dropdown",
        siteNavCenteredDropdown: ".site-nav__dropdown--centered",
        siteNavLinkMain: ".site-nav__link--main",
        siteNavChildLink: ".site-nav__link--last",
        siteNavDropdown: ".site-nav__dropdown",
        siteHeader: ".site-header",
      },
      t = {
        activeClass: "site-nav--active-dropdown",
        childLinkClass: "site-nav__child-link",
        rightDropdownClass: "site-nav__dropdown--right",
        leftDropdownClass: "site-nav__dropdown--left",
      },
      i = {};
    function s(e) {
      e.stopImmediatePropagation();
    }
    function n() {
      i.activeDropdown &&
        (i.activeDropdown
          .querySelector(e.siteNavLinkMain)
          .setAttribute("aria-expanded", "false"),
        i.activeDropdown.classList.remove(t.activeClass),
        (i.activeDropdown = document.querySelector(e.siteNavActiveDropdown)),
        window.removeEventListener("keyup", o),
        document.body.removeEventListener("click", n));
    }
    function r(s) {
      s.forEach(function (s) {
        var n,
          r,
          a,
          o,
          c = s.querySelector(e.siteNavDropdown);
        c &&
          (((r = (n = s).getBoundingClientRect()),
          (a = n.ownerDocument.defaultView),
          (o = r.left + a.pageXOffset) >
            Math.floor(i.siteHeader.offsetWidth) / 2)
            ? (c.classList.remove(t.leftDropdownClass),
              c.classList.add(t.rightDropdownClass))
            : (c.classList.remove(t.rightDropdownClass),
              c.classList.add(t.leftDropdownClass)));
      });
    }
    function a() {
      document
        .querySelectorAll(e.siteNavHasCenteredDropdown)
        .forEach(function (t) {
          var i = t.querySelector(e.siteNavCenteredDropdown),
            s = t.offsetTop + 41;
          i.style.top = s + "px";
        });
    }
    function o(e) {
      27 === e.keyCode && n();
    }
    function c() {
      u();
    }
    function l(s) {
      var r,
        a = s.currentTarget;
      a.classList.contains(t.activeClass)
        ? n()
        : ((r = a).classList.add(t.activeClass),
          i.activeDropdown && n(),
          (i.activeDropdown = r),
          r
            .querySelector(e.siteNavLinkMain)
            .setAttribute("aria-expanded", "true"),
          setTimeout(function () {
            window.addEventListener("keyup", o),
              document.body.addEventListener("click", n);
          }, 250));
    }
    function d() {
      setTimeout(function () {
        !document.activeElement.classList.contains(t.childLinkClass) &&
          i.activeDropdown &&
          n();
      });
    }
    var u = theme.Helpers.debounce(function () {
      r(document.querySelectorAll(e.siteNavHasDropdown)), a();
    }, 50);
    return {
      init: function () {
        var t;
        (i = {
          nav: (t = document.querySelector(e.navigation)),
          topLevel: document.querySelectorAll(e.siteNavLinkMain),
          parents: t.querySelectorAll(e.siteNavHasDropdown),
          subMenuLinks: document.querySelectorAll(e.siteNavChildLinks),
          activeDropdown: document.querySelector(e.siteNavActiveDropdown),
          siteHeader: document.querySelector(e.siteHeader),
          siteNavChildLink: document.querySelectorAll(e.siteNavChildLink),
        }),
          r(document.querySelectorAll(e.siteNavHasDropdown)),
          a(),
          i.parents.forEach(function (e) {
            e.addEventListener("click", l);
          }),
          i.siteNavChildLink.forEach(function (e) {
            e.addEventListener("focusout", d);
          }),
          i.topLevel.forEach(function (e) {
            e.addEventListener("focus", n);
          }),
          i.subMenuLinks.forEach(function (e) {
            e.addEventListener("click", s);
          }),
          window.addEventListener("resize", c);
      },
      unload: function () {
        i.topLevel.forEach(function (e) {
          e.removeEventListener("focus", n);
        }),
          i.subMenuLinks.forEach(function (e) {
            e.removeEventListener("click", s);
          }),
          i.parents.forEach(function (e) {
            e.removeEventListener("click", l);
          }),
          i.siteNavChildLink.forEach(function (e) {
            e.removeEventListener("focusout", d);
          }),
          window.removeEventListener("resize", c),
          window.removeEventListener("keyup", o),
          document.body.removeEventListener("click", n);
      },
    };
  })()),
  (window.theme = window.theme || {}),
  (theme.MobileNav = (function () {
    var e,
      t,
      i,
      s = {
        mobileNavOpenIcon: "mobile-nav--open",
        mobileNavCloseIcon: "mobile-nav--close",
        navLinkWrapper: "mobile-nav__item",
        navLink: "mobile-nav__link",
        subNavLink: "mobile-nav__sublist-link",
        return: "mobile-nav__return-btn",
        subNavActive: "is-active",
        subNavClosing: "is-closing",
        navOpen: "js-menu--is-open",
        subNavShowing: "sub-nav--is-open",
        thirdNavShowing: "third-nav--is-open",
        subNavToggleBtn: "js-toggle-submenu",
      },
      n = {},
      r = 1,
      a = "(min-width: " + theme.breakpoints.medium + "px)",
      o = window.matchMedia(a);
    function c() {
      o.matches && n.mobileNavContainer.classList.contains(s.navOpen) && u();
    }
    function l() {
      var e;
      n.mobileNavToggle.classList.contains(s.mobileNavCloseIcon)
        ? u()
        : ((e = n.siteHeader.offsetHeight),
          theme.Helpers.prepareTransition(n.mobileNavContainer),
          n.mobileNavContainer.classList.add(s.navOpen),
          (n.mobileNavContainer.style.transform = "translateY(" + e + "px)"),
          (n.pageContainer.style.transform =
            "translate3d(0, " + n.mobileNavContainer.scrollHeight + "px, 0)"),
          slate.a11y.trapFocus({
            container: n.sectionHeader,
            elementToFocus: n.mobileNavToggle,
          }),
          n.mobileNavToggle.classList.add(s.mobileNavCloseIcon),
          n.mobileNavToggle.classList.remove(s.mobileNavOpenIcon),
          n.mobileNavToggle.setAttribute("aria-expanded", !0),
          window.addEventListener("keyup", d));
    }
    function d(e) {
      27 === e.which && u();
    }
    function u() {
      theme.Helpers.prepareTransition(n.mobileNavContainer),
        n.mobileNavContainer.classList.remove(s.navOpen),
        (n.mobileNavContainer.style.transform = "translateY(-100%)"),
        n.pageContainer.setAttribute("style", ""),
        slate.a11y.trapFocus({
          container: document.querySelector("html"),
          elementToFocus: document.body,
        }),
        n.mobileNavContainer.addEventListener("transitionend", h, { once: !0 }),
        n.mobileNavToggle.classList.add(s.mobileNavOpenIcon),
        n.mobileNavToggle.classList.remove(s.mobileNavCloseIcon),
        n.mobileNavToggle.setAttribute("aria-expanded", !1),
        n.mobileNavToggle.focus(),
        window.removeEventListener("keyup", d),
        window.scrollTo(0, 0);
    }
    function h() {
      slate.a11y.removeTrapFocus({ container: n.mobileNav });
    }
    function p(a) {
      if (!e) {
        var o,
          c,
          l,
          d,
          u,
          h = a.currentTarget;
        ((e = !0), h.classList.contains(s.return))
          ? (document
              .querySelectorAll(
                "." + s.subNavToggleBtn + "[data-level='" + (r - 1) + "']"
              )
              .forEach(function (e) {
                e.classList.remove(s.subNavActive);
              }),
            i && i.classList.remove(s.subNavActive))
          : h.classList.add(s.subNavActive),
          (i = h),
          (r = (c = (o = h.getAttribute("data-target"))
            ? document.querySelector(
                '.mobile-nav__dropdown[data-parent="' + o + '"]'
              )
            : n.mobileNav).dataset.level
            ? Number(c.dataset.level)
            : 1),
          t &&
            (theme.Helpers.prepareTransition(t),
            t.classList.add(s.subNavClosing)),
          (t = c),
          (l = c.offsetHeight),
          (d = r > 2 ? s.thirdNavShowing : s.subNavShowing),
          (n.mobileNavContainer.style.height = l + "px"),
          n.mobileNavContainer.classList.remove(s.thirdNavShowing),
          n.mobileNavContainer.classList.add(d),
          o ||
            n.mobileNavContainer.classList.remove(
              s.thirdNavShowing,
              s.subNavShowing
            ),
          (u = 1 === r ? n.sectionHeader : c),
          n.mobileNavContainer.addEventListener(
            "transitionend",
            function t() {
              slate.a11y.trapFocus({ container: u }),
                n.mobileNavContainer.removeEventListener("transitionend", t),
                (e = !1);
            },
            { once: !0 }
          ),
          (n.pageContainer.style.transform = "translateY(" + l + "px)"),
          t.classList.remove(s.subNavClosing);
      }
    }
    return {
      init: function () {
        (n = {
          pageContainer: document.querySelector("#PageContainer"),
          siteHeader: document.querySelector(".site-header"),
          mobileNavToggle: document.querySelector(".js-mobile-nav-toggle"),
          mobileNavContainer: document.querySelector(".mobile-nav-wrapper"),
          mobileNav: document.querySelector("#MobileNav"),
          sectionHeader: document.querySelector("#shopify-section-header"),
          subNavToggleBtns: document.querySelectorAll("." + s.subNavToggleBtn),
        }).mobileNavToggle && n.mobileNavToggle.addEventListener("click", l),
          n.subNavToggleBtns.forEach(function (e) {
            e.addEventListener("click", p);
          }),
          o.addListener(c);
      },
      unload: function () {
        o.removeListener(c);
      },
      closeMobileNav: u,
    };
  })()),
  (window.Modals = (function () {
    function e(e, t, i) {
      if (((this.modal = document.getElementById(e)), !this.modal)) return !1;
      (this.nodes = {
        parents: [document.querySelector("html"), document.body],
      }),
        (this.config = Object.assign(
          {
            close: ".js-modal-close",
            open: ".js-modal-open-" + t,
            openClass: "modal--is-active",
            closeModalOnClick: !1,
          },
          i
        )),
        (this.modalIsOpen = !1),
        (this.focusOnOpen = this.config.focusOnOpen
          ? document.getElementById(this.config.focusOnOpen)
          : this.modal),
        (this.openElement = document.querySelector(this.config.open)),
        this.init();
    }
    return (
      (e.prototype.init = function () {
        this.openElement.addEventListener("click", this.open.bind(this)),
          this.modal
            .querySelector(this.config.close)
            .addEventListener("click", this.closeModal.bind(this));
      }),
      (e.prototype.open = function (e) {
        var t = this,
          i = !1;
        this.modalIsOpen ||
          (e ? e.preventDefault() : (i = !0),
          e && e.stopPropagation && e.stopPropagation(),
          this.modalIsOpen && !i && this.closeModal(),
          this.modal.classList.add(this.config.openClass),
          this.nodes.parents.forEach(function (e) {
            e.classList.add(t.config.openClass);
          }),
          (this.modalIsOpen = !0),
          slate.a11y.trapFocus({
            container: this.modal,
            elementToFocus: this.focusOnOpen,
          }),
          this.bindEvents());
      }),
      (e.prototype.closeModal = function () {
        if (this.modalIsOpen) {
          document.activeElement.blur(),
            this.modal.classList.remove(this.config.openClass);
          var e = this;
          this.nodes.parents.forEach(function (t) {
            t.classList.remove(e.config.openClass);
          }),
            (this.modalIsOpen = !1),
            slate.a11y.removeTrapFocus({ container: this.modal }),
            this.openElement.focus(),
            this.unbindEvents();
        }
      }),
      (e.prototype.bindEvents = function () {
        (this.keyupHandler = this.keyupHandler.bind(this)),
          (this.clickHandler = this.clickHandler.bind(this)),
          document.body.addEventListener("keyup", this.keyupHandler),
          document.body.addEventListener("click", this.clickHandler);
      }),
      (e.prototype.unbindEvents = function () {
        document.body.removeEventListener("keyup", this.keyupHandler),
          document.body.removeEventListener("click", this.clickHandler);
      }),
      (e.prototype.keyupHandler = function (e) {
        27 === e.keyCode && this.closeModal();
      }),
      (e.prototype.clickHandler = function (e) {
        this.config.closeModalOnClick &&
          !this.modal.contains(e.target) &&
          this.closeModal();
      }),
      e
    );
  })()),
  (function () {
    var e = document.querySelector(".return-link");
    function t(e) {
      var t = document.createElement("a");
      return (t.ref = e), t.hostname;
    }
    document.referrer &&
      e &&
      window.history.length &&
      e.addEventListener(
        "click",
        function (e) {
          e.preventDefault();
          var i = t(document.referrer);
          return t(window.location.href) === i && history.back(), !1;
        },
        { once: !0 }
      );
  })(),
  (theme.Slideshow = (function () {
    var e = {
        button: "[data-slider-button]",
        indicator: "[data-slider-indicator]",
        indicators: "[data-slider-indicators]",
        pause: "[data-slider-pause]",
        slider: "[data-slider]",
        sliderItem: "[data-slider-item]",
        sliderItemLink: "[data-slider-item-link]",
        sliderTrack: "[data-slider-track]",
        sliderContainer: "[data-slider-container]",
      },
      t = {
        isPaused: "slideshow__pause--is-paused",
        indicator: "slider-indicators__item",
        indicatorActive: "slick-active",
        sliderInitialized: "slick-initialized",
        slideActive: "slideshow__slide--active",
        slideClone: "slick-cloned",
      };
    function i(i, s) {
      (this.container = i),
        (this.slider = this.container.querySelector(e.slider)),
        this.slider &&
          ((this.eventHandlers = {}),
          (this.lastSlide = 0),
          (this.slideIndex = 0),
          (this.sliderContainer = null),
          (this.slides = []),
          (this.options = Object.assign(
            {},
            {
              autoplay: !1,
              canUseKeyboardArrows: !0,
              canUseTouchEvents: !1,
              slideActiveClass: t.slideActive,
              slideInterval: 0,
              slidesToShow: 0,
              slidesToScroll: 1,
              type: "fade",
            },
            s
          )),
          (this.sliderContainer = this.slider.querySelector(e.sliderContainer)),
          (this.adaptHeight =
            "true" === this.sliderContainer.getAttribute("data-adapt-height")),
          (this.slides = Array.from(
            this.sliderContainer.querySelectorAll(e.sliderItem)
          )),
          (this.lastSlide = this.slides.length - 1),
          (this.buttons = this.container.querySelectorAll(e.button)),
          (this.pause = this.container.querySelector(e.pause)),
          (this.indicators = this.container.querySelectorAll(e.indicators)),
          this.slides.length <= 1 ||
            ((this.timeout = 250),
            this.options.autoplay && this.startAutoplay(),
            this.adaptHeight && this.setSlideshowHeight(),
            "slide" === this.options.type
              ? ((this.isFirstSlide = !1),
                (this.isLastSlide = !1),
                (this.sliderItemWidthTotal = 0),
                (this.sliderTrack = this.slider.querySelector(e.sliderTrack)),
                (this.sliderItemWidthTotal = 0),
                theme.Helpers.promiseStylesheet().then(
                  function () {
                    this._setupSlideType();
                  }.bind(this)
                ))
              : this.setupSlider(0),
            this._setupEventHandlers()));
    }
    return (
      (i.prototype = Object.assign({}, i.prototype, {
        previousSlide: function () {
          this._move();
        },
        nextSlide: function () {
          this._move("next");
        },
        setSlide: function (e) {
          this._setPosition(Number(e));
        },
        startAutoplay: function () {
          (this.isAutoPlaying = !0),
            window.clearTimeout(this.autoTimeOut),
            (this.autoTimeOut = window.setTimeout(
              function () {
                var e = this._getNextSlideIndex("next");
                this._setPosition(e);
              }.bind(this),
              this.options.slideInterval
            ));
        },
        stopAutoplay: function () {
          (this.isAutoPlaying = !1), window.clearTimeout(this.autoTimeOut);
        },
        setupSlider: function (e) {
          (this.slideIndex = e),
            this.indicators.length && this._setActiveIndicator(e),
            this._setupActiveSlide(e);
        },
        destroy: function () {
          this.adaptHeight &&
            window.removeEventListener(
              "resize",
              this.eventHandlers.debounceResize
            ),
            this.container.removeEventListener(
              "focus",
              this.eventHandlers.focus,
              !0
            ),
            this.slider.removeEventListener(
              "focusin",
              this.eventHandlers.focusIn,
              !0
            ),
            this.slider.removeEventListener(
              "focusout",
              this.eventHandlers.focusOut,
              !0
            ),
            this.container.removeEventListener(
              "blur",
              this.eventHandlers.blur,
              !0
            ),
            this.buttons &&
              this.buttons.forEach(
                function (e) {
                  e.removeEventListener(
                    "click",
                    this.eventHandlers.clickButton
                  );
                }.bind(this)
              ),
            this.indicators.forEach(function (e) {
              e.childNodes.forEach(function (e) {
                e.firstElementChild.removeEventListener(
                  "click",
                  this.eventHandlers.onClickIndicator
                ),
                  e.firstElementChild.removeEventListener(
                    "keydown",
                    this.eventHandlers.onKeydownIndicator
                  );
              }, this);
            }, this),
            "slide" === this.options.type &&
              (window.removeEventListener(
                "resize",
                this.eventHandlers.debounceResizeSlideIn
              ),
              this.touchEvents &&
                this.options.canUseTouchEvents &&
                (this.touchEvents.destroy(), (this.touchEvents = null)));
        },
        _setupEventHandlers: function () {
          (this.eventHandlers.focus = this._onFocus.bind(this)),
            (this.eventHandlers.focusIn = this._onFocusIn.bind(this)),
            (this.eventHandlers.focusOut = this._onFocusOut.bind(this)),
            (this.eventHandlers.blur = this._onBlur.bind(this)),
            (this.eventHandlers.keyUp = this._onKeyUp.bind(this)),
            (this.eventHandlers.clickButton = this._onClickButton.bind(this)),
            (this.eventHandlers.onClickIndicator =
              this._onClickIndicator.bind(this)),
            (this.eventHandlers.onKeydownIndicator =
              this._onKeydownIndicator.bind(this)),
            (this.eventHandlers.onClickPause = this._onClickPause.bind(this)),
            this.adaptHeight &&
              ((this.eventHandlers.debounceResize = theme.Helpers.debounce(
                function () {
                  this.setSlideshowHeight();
                }.bind(this),
                50
              )),
              window.addEventListener(
                "resize",
                this.eventHandlers.debounceResize
              )),
            this.container.addEventListener(
              "focus",
              this.eventHandlers.focus,
              !0
            ),
            this.slider.addEventListener(
              "focusin",
              this.eventHandlers.focusIn,
              !0
            ),
            this.slider.addEventListener(
              "focusout",
              this.eventHandlers.focusOut,
              !0
            ),
            this.container.addEventListener(
              "blur",
              this.eventHandlers.blur,
              !0
            ),
            this.buttons &&
              this.buttons.forEach(
                function (e) {
                  e.addEventListener("click", this.eventHandlers.clickButton);
                }.bind(this)
              ),
            this.pause &&
              this.pause.addEventListener(
                "click",
                this.eventHandlers.onClickPause
              ),
            this.indicators.forEach(function (e) {
              e.childNodes.forEach(function (e) {
                e.firstElementChild.addEventListener(
                  "click",
                  this.eventHandlers.onClickIndicator
                ),
                  e.firstElementChild.addEventListener(
                    "keydown",
                    this.eventHandlers.onKeydownIndicator
                  );
              }, this);
            }, this),
            "slide" === this.options.type &&
              ((this.eventHandlers.debounceResizeSlideIn =
                theme.Helpers.debounce(
                  function () {
                    (this.sliderItemWidthTotal = 0), this._setupSlideType(!0);
                  }.bind(this),
                  50
                )),
              window.addEventListener(
                "resize",
                this.eventHandlers.debounceResizeSlideIn
              ),
              this.options.canUseTouchEvents &&
                this.options.slidesToScroll < this.slides.length &&
                this._setupTouchEvents());
        },
        _setupTouchEvents: function () {
          this.touchEvents = new theme.TouchEvents(this.sliderTrack, {
            start: function () {
              this._onTouchStart();
            }.bind(this),
            move: function (e, t, i) {
              this._onTouchMove(e, t, i);
            }.bind(this),
            end: function (e, t, i) {
              this._onTouchEnd(e, t, i);
            }.bind(this),
          });
        },
        _setupSlideType: function (i) {
          (this.sliderItemWidth = Math.floor(
            this.sliderContainer.offsetWidth / this.options.slidesToShow
          )),
            (this.sliderTranslateXMove =
              this.sliderItemWidth * this.options.slidesToScroll),
            i || this.sliderContainer.classList.add(t.sliderInitialized),
            this.slides.forEach(function (t, i) {
              var s = t.querySelector(e.sliderItemLink);
              (t.style.width = this.sliderItemWidth + "px"),
                t.setAttribute("aria-hidden", !0),
                t.setAttribute("tabindex", -1),
                (this.sliderItemWidthTotal =
                  this.sliderItemWidthTotal + t.offsetWidth),
                s && s.setAttribute("tabindex", -1),
                i < this.options.slidesToShow &&
                  (t.setAttribute("aria-hidden", !1),
                  t.classList.add(this.options.slideActiveClass),
                  s && s.setAttribute("tabindex", 0));
            }, this),
            (this.sliderTrack.style.width =
              Math.floor(this.sliderItemWidthTotal) + "px"),
            (this.sliderTrack.style.transform = "translateX(-0px)"),
            this.buttons.length &&
              (this.buttons[0].setAttribute("aria-disabled", !0),
              this.buttons[1].removeAttribute("aria-disabled")),
            this.indicators.length && this._setActiveIndicator(0);
        },
        _onTouchStart: function () {
          this.touchStartPosition = this._getTranslateXPosition();
        },
        _onTouchMove: function (e, t, i) {
          Shopify.designMode &&
          (e.clientX <= 80 || e.clientX >= window.innerWidth - 80)
            ? e.target.dispatchEvent(
                new MouseEvent("mouseup", { bubbles: !0, cancelable: !0 })
              )
            : ("left" !== t && "right" !== t) ||
              ((this.touchMovePosition = this.touchStartPosition + i.xPosition),
              (this.sliderTrack.style.transform =
                "translateX(" + this.touchMovePosition + "px"));
        },
        _onTouchEnd: function (e, t, i) {
          var s = 0;
          0 !== Object.keys(i).length &&
            ("left" === t
              ? (s = this._isNextTranslateXLast(this.touchStartPosition)
                  ? this.touchStartPosition
                  : this.touchStartPosition - this.sliderTranslateXMove)
              : ((s = this.touchStartPosition + this.sliderTranslateXMove),
                this._isNextTranslateXFirst(this.touchStartPosition) &&
                  (s = 0)),
            (this.slideIndex = this._getNextSlideIndex(
              "left" === t ? "next" : ""
            )),
            (this.sliderTrack.style.transition = "transform 500ms ease 0s"),
            (this.sliderTrack.style.transform = "translateX(" + s + "px"),
            window.setTimeout(
              function () {
                this.sliderTrack.style.transition = "";
              }.bind(this),
              500
            ),
            this._verifyFirstLastSlideTranslateX(s),
            this._postTransitionEnd());
        },
        _onClickButton: function (e) {
          if (!(e.detail > 1)) {
            var t = e.currentTarget,
              i = t.hasAttribute("data-slider-button-next");
            ("slide" === this.options.type &&
              "true" === t.getAttribute("aria-disabled")) ||
              (this.options.autoplay &&
                this.isAutoPlaying &&
                this.stopAutoplay(),
              i ? this.nextSlide() : this.previousSlide());
          }
        },
        _onClickIndicator: function (e) {
          e.preventDefault(),
            e.target.classList.contains(t.indicatorActive) ||
              (this.options.autoplay &&
                this.isAutoPlaying &&
                this.stopAutoplay(),
              (this.slideIndex = Number(e.target.dataset.slideNumber)),
              this.goToSlideByIndex(this.slideIndex));
        },
        goToSlideByIndex: function (e) {
          if (
            (this._setPosition(e),
            "slide" === this.options.type && this.sliderTrack)
          ) {
            this.sliderTrack.style.transition = "transform 500ms ease 0s";
            var t = e * this.slides[0].offsetWidth;
            (this.sliderTrack.style.transform = "translateX(-" + t + "px)"),
              this.options.slidesToShow > 1 &&
                (this._verifyFirstLastSlideTranslateX(t),
                this.buttons.length && this._disableArrows(),
                this._setupMultipleActiveSlide(
                  e,
                  e + (this.options.slidesToShow - 1)
                ));
          }
        },
        _onKeydownIndicator: function (e) {
          e.keyCode === slate.utils.keyboardKeys.ENTER &&
            (this._onClickIndicator(e), this.slider.focus());
        },
        _onClickPause: function (e) {
          e.currentTarget.classList.contains(t.isPaused)
            ? (e.currentTarget.classList.remove(t.isPaused),
              this.startAutoplay())
            : (e.currentTarget.classList.add(t.isPaused), this.stopAutoplay());
        },
        _onFocus: function () {
          this.container.addEventListener("keyup", this.eventHandlers.keyUp);
        },
        _onFocusIn: function () {
          this.slider.hasAttribute("aria-live") ||
            (this.options.autoplay && this.isAutoPlaying && this.stopAutoplay(),
            this.slider.setAttribute("aria-live", "polite"));
        },
        _onBlur: function () {
          this.container.removeEventListener("keyup", this.eventHandlers.keyUp);
        },
        _onFocusOut: function () {
          this.slider.removeAttribute("aria-live"),
            setTimeout(
              function () {
                document.activeElement.closest(
                  "#" + this.slider.getAttribute("id")
                ) ||
                  !this.options.autoplay ||
                  this.isAutoPlaying ||
                  this.pause.classList.contains(t.isPaused) ||
                  this.startAutoplay();
              }.bind(this),
              this.timeout
            );
        },
        _onKeyUp: function (e) {
          switch (e.keyCode) {
            case slate.utils.keyboardKeys.LEFTARROW:
              if (
                !this.options.canUseKeyboardArrows ||
                ("slide" === this.options.type && this.isFirstSlide)
              )
                return;
              this.previousSlide();
              break;
            case slate.utils.keyboardKeys.RIGHTARROW:
              if (
                !this.options.canUseKeyboardArrows ||
                ("slide" === this.options.type && this.isLastSlide)
              )
                return;
              this.nextSlide();
              break;
            case slate.utils.keyboardKeys.ESCAPE:
              this.slider.blur();
          }
        },
        _move: function (e) {
          if ("slide" === this.options.type)
            (this.slideIndex = this._getNextSlideIndex(e)),
              this._moveSlideshow(e);
          else {
            var t = this._getNextSlideIndex(e);
            this._setPosition(t);
          }
        },
        _moveSlideshow: function (e) {
          this.direction = e;
          var t = 0,
            i = this._getTranslateXPosition(),
            s = this._getActiveSlidesIndex(),
            n = Math.min.apply(Math, s),
            r = Math.max.apply(Math, s);
          (this.nextMinIndex =
            "next" === e
              ? n + this.options.slidesToShow
              : n - this.options.slidesToShow),
            (this.nextMaxIndex =
              "next" === e ? r + this.options.slidesToShow : n - 1),
            (this.sliderTrack.style.transition = "transform 500ms ease 0s"),
            "next" === e
              ? ((t = i - this.sliderTranslateXMove),
                (this.sliderTrack.style.transform = "translateX(" + t + "px)"))
              : ((t = i + this.sliderTranslateXMove),
                (this.sliderTrack.style.transform = "translateX(" + t + "px)")),
            this._verifyFirstLastSlideTranslateX(t),
            this._postTransitionEnd(),
            this._setupMultipleActiveSlide(
              this.nextMinIndex,
              this.nextMaxIndex
            );
        },
        _setPosition: function (e) {
          (this.slideIndex = e),
            this.indicators.length && this._setActiveIndicator(e),
            this._setupActiveSlide(e),
            this.options.autoplay && this.isAutoPlaying && this.startAutoplay(),
            this.container.dispatchEvent(
              new CustomEvent("slider_slide_changed", { detail: e })
            );
        },
        _setupActiveSlide: function (e) {
          this.slides.forEach(function (e) {
            e.setAttribute("aria-hidden", !0),
              e.classList.remove(this.options.slideActiveClass);
          }, this),
            this.slides[e].setAttribute("aria-hidden", !1),
            this.slides[e].classList.add(this.options.slideActiveClass);
        },
        _setupMultipleActiveSlide: function (t, i) {
          this.slides.forEach(function (s) {
            var n = Number(s.getAttribute("data-slider-slide-index")),
              r = s.querySelector(e.sliderItemLink);
            s.setAttribute("aria-hidden", !0),
              s.classList.remove(this.options.slideActiveClass),
              r && r.setAttribute("tabindex", -1),
              n >= t &&
                n <= i &&
                (s.setAttribute("aria-hidden", !1),
                s.classList.add(this.options.slideActiveClass),
                r && r.setAttribute("tabindex", 0));
          }, this);
        },
        _setActiveIndicator: function (e) {
          this.indicators.forEach(function (i) {
            var s = i.querySelector("." + t.indicatorActive),
              n = i.childNodes[e];
            s &&
              (s.setAttribute("aria-selected", !1),
              s.classList.remove(t.indicatorActive),
              s.firstElementChild.removeAttribute("aria-current")),
              n.classList.add(t.indicatorActive),
              n.setAttribute("aria-selected", !0),
              n.firstElementChild.setAttribute("aria-current", !0);
          }, this);
        },
        setSlideshowHeight: function () {
          var e = this.sliderContainer.getAttribute("data-min-aspect-ratio");
          this.sliderContainer.style.height =
            document.documentElement.offsetWidth / e + "px";
        },
        _getNextSlideIndex: function (e) {
          if ("next" === e) {
            if (this.slideIndex === this.lastSlide)
              return "slide" === this.options.type ? this.lastSlide : 0;
          } else if (!this.slideIndex)
            return "slide" === this.options.type ? 0 : this.lastSlide;
          return this.slideIndex + ("next" === e ? 1 : -1);
        },
        _getActiveSlidesIndex: function () {
          return this.slides
            .filter(function (e) {
              if (e.classList.contains(this.options.slideActiveClass)) return e;
            }, this)
            .map(function (e) {
              return Number(e.getAttribute("data-slider-slide-index"));
            });
        },
        _disableArrows: function () {
          if (0 !== this.buttons.length) {
            var e = this.buttons[0],
              t = this.buttons[1];
            this.isFirstSlide
              ? e.setAttribute("aria-disabled", !0)
              : e.removeAttribute("aria-disabled"),
              this.isLastSlide
                ? t.setAttribute("aria-disabled", !0)
                : t.removeAttribute("aria-disabled");
          }
        },
        _verifyFirstLastSlideTranslateX: function (e) {
          this._isNextTranslateXFirst(e)
            ? (this.isFirstSlide = !0)
            : (this.isFirstSlide = !1),
            this._isNextTranslateXLast(e)
              ? (this.isLastSlide = !0)
              : (this.isLastSlide = !1);
        },
        _getTranslateXPosition: function () {
          return Number(
            this.sliderTrack.style.transform.match(/(-?[0-9]+)/g)[0]
          );
        },
        _isNextTranslateXFirst: function (e) {
          return 0 === e;
        },
        _isNextTranslateXLast: function (e) {
          return (
            Math.abs(e) + this.sliderTranslateXMove >= this.sliderItemWidthTotal
          );
        },
        _postTransitionEnd: function () {
          this.buttons.length && this._disableArrows(),
            this.indicators.length && this._setActiveIndicator(this.slideIndex);
        },
      })),
      i
    );
  })()),
  (theme.Video = (function () {
    var e = !1,
      t = !1,
      i = !1,
      s = !1,
      n = {},
      r = [],
      a = {
        ratio: 16 / 9,
        scrollAnimationDuration: 400,
        playerVars: {
          iv_load_policy: 3,
          modestbranding: 1,
          autoplay: 0,
          controls: 0,
          wmode: "opaque",
          branding: 0,
          autohide: 0,
          rel: 0,
        },
        events: {
          onReady: function (e) {
            e.target.setPlaybackQuality("hd1080");
            var t,
              i,
              s,
              n,
              r,
              a,
              l,
              d,
              h = y(e),
              v = e.target.getVideoData().title;
            p(),
              document.getElementById(h.id).setAttribute("tabindex", "-1"),
              S(),
              (t = h.videoWrapper),
              (i = v),
              (s = t.querySelectorAll(c.playVideoBtn)),
              (n = t.querySelector(c.closeVideoBtn)),
              (r = t.querySelector(c.pauseVideoBtn)),
              (a = n.querySelector(c.fallbackText)),
              (l = r
                .querySelector(c.pauseVideoStop)
                .querySelector(c.fallbackText)),
              (d = r
                .querySelector(c.pauseVideoResume)
                .querySelector(c.fallbackText)),
              s.forEach(function (e) {
                var t = e.querySelector(c.fallbackText);
                t.textContent = t.textContent.replace("[video_title]", i);
              }),
              (a.textContent = a.textContent.replace("[video_title]", i)),
              (l.textContent = l.textContent.replace("[video_title]", i)),
              (d.textContent = d.textContent.replace("[video_title]", i)),
              "background" === h.type && (e.target.mute(), u(h.id)),
              h.videoWrapper.classList.add(o.loaded);
          },
          onStateChange: function (t) {
            var i = y(t);
            switch (
              ("background" !== i.status ||
                E() ||
                e ||
                (t.data !== YT.PlayerState.PLAYING &&
                  t.data !== YT.PlayerState.BUFFERING) ||
                (h(!0), (e = !0), i.videoWrapper.classList.remove(o.loading)),
              t.data)
            ) {
              case YT.PlayerState.ENDED:
                !(function (e) {
                  switch (e.type) {
                    case "background":
                      r[e.id].seekTo(0);
                      break;
                    case "image_with_play":
                      f(e.id), g(e.id, !1);
                  }
                })(i);
                break;
              case YT.PlayerState.PAUSED:
                setTimeout(function () {
                  t.target.getPlayerState() === YT.PlayerState.PAUSED && m(i);
                }, 200);
            }
          },
        },
      },
      o = {
        playing: "video-is-playing",
        paused: "video-is-paused",
        loading: "video-is-loading",
        loaded: "video-is-loaded",
        backgroundVideoWrapper: "video-background-wrapper",
        videoWithImage: "video--image_with_play",
        backgroundVideo: "video--background",
        userPaused: "is-paused",
        supportsAutoplay: "autoplay",
        supportsNoAutoplay: "no-autoplay",
        wrapperMinHeight: "video-section-wrapper--min-height",
      },
      c = {
        section: ".video-section",
        videoWrapper: ".video-section-wrapper",
        playVideoBtn: ".video-control__play",
        closeVideoBtn: ".video-control__close-wrapper",
        pauseVideoBtn: ".video__pause",
        pauseVideoStop: ".video__pause-stop",
        pauseVideoResume: ".video__pause-resume",
        fallbackText: ".icon__fallback-text",
      };
    function l(e) {
      (t || i) && e && "function" == typeof r[e].playVideo && u(e);
    }
    function d(e) {
      r[e] && "function" == typeof r[e].pauseVideo && r[e].pauseVideo();
    }
    function u(t, s) {
      var a = n[t],
        c = r[t],
        l = a.videoWrapper;
      if (i) v(a);
      else {
        if (s || e)
          return l.classList.remove(o.loading), v(a), void c.playVideo();
        c.playVideo();
      }
    }
    function h(t) {
      var s = t ? o.supportsAutoplay : o.supportsNoAutoplay;
      document.documentElement.classList.remove(
        o.supportsAutoplay,
        o.supportsNoAutoplay
      ),
        document.documentElement.classList.add(s),
        t || (i = !0),
        (e = !0);
    }
    function p() {
      t || (E() && (i = !0), i && h(!1), (t = !0));
    }
    function v(e) {
      var t = e.videoWrapper,
        i = t.querySelector(c.pauseVideoBtn);
      t.classList.remove(o.loading),
        i.classList.contains(o.userPaused) && i.classList.remove(o.userPaused),
        "background" !== e.status &&
          (document.getElementById(e.id).setAttribute("tabindex", "0"),
          "image_with_play" === e.type &&
            (t.classList.remove(o.paused), t.classList.add(o.playing)),
          setTimeout(function () {
            t.querySelector(c.closeVideoBtn).focus();
          }, a.scrollAnimationDuration));
    }
    function m(e) {
      var t = e.videoWrapper;
      "image_with_play" === e.type &&
        ("closed" === e.status
          ? t.classList.remove(o.paused)
          : t.classList.add(o.paused)),
        t.classList.remove(o.playing);
    }
    function f(e) {
      var t,
        i,
        s = n[e],
        a = s.videoWrapper;
      switch (
        (document.getElementById(s.id).setAttribute("tabindex", "-1"),
        (s.status = "closed"),
        s.type)
      ) {
        case "image_with_play":
          r[e].stopVideo(), m(s);
          break;
        case "background":
          r[e].mute(),
            (t = e),
            (i = document.getElementById(t)).classList.remove(o.videoWithImage),
            i.classList.add(o.backgroundVideo),
            n[t].videoWrapper.classList.add(o.backgroundVideoWrapper),
            (n[t].status = "background"),
            L(i);
      }
      a.classList.remove(o.paused, o.playing);
    }
    function y(e) {
      return n[e.target.getIframe().id];
    }
    function g(e, t) {
      var i = n[e],
        s = i.videoWrapper.getBoundingClientRect().top + window.pageYOffset,
        r = i.videoWrapper.querySelector(c.playVideoBtn),
        l = 0,
        d = 0;
      if (
        (E() && i.videoWrapper.parentElement.classList.toggle("page-width", !t),
        t)
      ) {
        if (
          ((d = E()
            ? window.innerWidth / a.ratio
            : i.videoWrapper.offsetWidth / a.ratio),
          (l = (window.innerHeight - d) / 2),
          (i.videoWrapper.style.height =
            i.videoWrapper.getBoundingClientRect().height + "px"),
          i.videoWrapper.classList.remove(o.wrapperMinHeight),
          (i.videoWrapper.style.height = d + "px"),
          !E() || !Shopify.designMode)
        ) {
          var u = document.documentElement.style.scrollBehavior;
          (document.documentElement.style.scrollBehavior = "smooth"),
            window.scrollTo({ top: s - l }),
            (document.documentElement.style.scrollBehavior = u);
        }
      } else {
        (d = E()
          ? i.videoWrapper.dataset.mobileHeight
          : i.videoWrapper.dataset.desktopHeight),
          (i.videoWrapper.style.height = d + "px"),
          setTimeout(function () {
            i.videoWrapper.classList.add(o.wrapperMinHeight);
          }, 600);
        var h = window.scrollX,
          p = window.scrollY;
        r.focus(), window.scrollTo(h, p);
      }
    }
    var b = function (e) {
      var t = document.activeElement.dataset.controls;
      e.keyCode === slate.utils.keyboardKeys.ESCAPE && t && (f(t), g(t, !1));
    };
    function S() {
      document.querySelectorAll("." + o.backgroundVideo).forEach(function (e) {
        L(e);
      });
    }
    function L(e) {
      if (s) {
        if (E()) e.style.cssText = null;
        else {
          var t = e.closest(c.videoWrapper),
            i = t.clientWidth,
            n = e.clientWidth,
            r = t.dataset.desktopHeight;
          if (i / a.ratio < r) {
            var l =
              "width: " +
              (n = Math.ceil(r * a.ratio)) +
              "px; height: " +
              r +
              "px; left: " +
              (i - n) / 2 +
              "px; top: 0;";
            e.style.cssText = l;
          } else {
            var d =
              "width: " +
              i +
              "px; height: " +
              (r = Math.ceil(i / a.ratio)) +
              "px; top: " +
              (r - r) / 2 +
              "px; left: 0;";
            e.style.cssText = d;
          }
          theme.Helpers.prepareTransition(e), t.classList.add(o.loaded);
        }
      }
    }
    function E() {
      return window.innerWidth < theme.breakpoints.medium;
    }
    var C = theme.Helpers.debounce(function () {
        if (s) {
          var e,
            t = window.innerHeight === screen.height;
          if ((S(), E())) {
            for (e in n)
              n.hasOwnProperty(e) &&
                (n[e].videoWrapper.classList.contains(o.playing) &&
                  (t || (d(e), m(n[e]))),
                (n[e].videoWrapper.style.height =
                  document.documentElement.clientWidth / a.ratio + "px"));
            h(!1);
          } else
            for (e in (h(!0), n))
              n[e].videoWrapper.querySelectorAll("." + o.videoWithImage)
                .length || (r[e].playVideo(), v(n[e]));
        }
      }, 200),
      T = theme.Helpers.debounce(function () {
        if (s) {
          for (var e in n)
            if (n.hasOwnProperty(e)) {
              var t = n[e].videoWrapper,
                i =
                  t.getBoundingClientRect().top +
                    window.pageYOffset +
                    0.75 * t.offsetHeight <
                    window.pageYOffset ||
                  t.getBoundingClientRect().top +
                    window.pageYOffset +
                    0.25 * t.offsetHeight >
                    window.pageYOffset + window.innerHeight;
              if (t.classList.contains(o.playing)) {
                if (!i) return;
                f(e), g(e, !1);
              }
            }
        }
      }, 50);
    function A() {
      var e = document.querySelectorAll(c.playVideoBtn),
        t = document.querySelectorAll(c.closeVideoBtn),
        i = document.querySelectorAll(c.pauseVideoBtn);
      e.forEach(function (e) {
        e.addEventListener("click", function (e) {
          (function e(t) {
            var i,
              s,
              a = n[t];
            switch (
              (a.videoWrapper.classList.add(o.loading),
              (a.videoWrapper.style.height =
                a.videoWrapper.offsetHeight + "px"),
              (a.status = "open"),
              a.type)
            ) {
              case "image_with_play":
                u(t, !0);
                break;
              case "background":
                (i = t),
                  (s = document.getElementById(i)).classList.remove(
                    o.backgroundVideo
                  ),
                  s.classList.add(o.videoWithImage),
                  setTimeout(function () {
                    document.getElementById(i).style.cssText = null;
                  }, 600),
                  n[i].videoWrapper.classList.remove(o.backgroundVideoWrapper),
                  n[i].videoWrapper.classList.add(o.playing),
                  (n[i].status = "open"),
                  r[t].unMute(),
                  u(t, !0);
            }
            g(t, !0), document.addEventListener("keydown", b);
          })(e.currentTarget.dataset.controls);
        });
      }),
        t.forEach(function (e) {
          e.addEventListener("click", function (e) {
            var t = e.currentTarget.dataset.controls;
            e.currentTarget.blur(), f(t), g(t, !1);
          });
        }),
        i.forEach(function (e) {
          e.addEventListener("click", function (e) {
            var t, i, s;
            (s = (i = n[
              (t = e.currentTarget.dataset.controls)
            ].videoWrapper.querySelector(c.pauseVideoBtn)).classList.contains(
              o.userPaused
            ))
              ? (i.classList.remove(o.userPaused), l(t))
              : (i.classList.add(o.userPaused), d(t)),
              i.setAttribute("aria-pressed", !s);
          });
        }),
        window.addEventListener("resize", C),
        window.addEventListener("scroll", T);
    }
    function w(e) {
      var t = Object.assign(a, n[e]);
      (t.playerVars.controls = t.controls), (r[e] = new YT.Player(e, t));
    }
    return {
      init: function (e) {
        if (e) {
          if (
            ((n[e.id] = {
              id: e.id,
              videoId: e.dataset.id,
              type: e.dataset.type,
              status:
                "image_with_play" === e.dataset.type ? "closed" : "background",
              video: e,
              videoWrapper: e.closest(c.videoWrapper),
              section: e.closest(c.section),
              controls: "background" === e.dataset.type ? 0 : 1,
            }),
            !s)
          ) {
            var t = document.createElement("script");
            t.src = "https://www.youtube.com/iframe_api";
            var i = document.getElementsByTagName("script")[0];
            i.parentNode.insertBefore(t, i);
          }
          p();
        }
      },
      editorLoadVideo: function (e) {
        s && (w(e), A());
      },
      loadVideos: function () {
        for (var e in n) n.hasOwnProperty(e) && w(e);
        A(), (s = !0);
      },
      playVideo: l,
      pauseVideo: d,
      removeEvents: function () {
        document.removeEventListener("keydown", b),
          window.removeEventListener("resize", C),
          window.removeEventListener("scroll", T);
      },
    };
  })()),
  (theme.ProductVideo = (function () {
    var e = {},
      t = { shopify: "shopify", external: "external" },
      i = { productMediaWrapper: "[data-product-single-media-wrapper]" },
      s = { enableVideoLooping: "enable-video-looping", videoId: "video-id" };
    function n(i) {
      i
        ? (function () {
            for (var i in e)
              if (e.hasOwnProperty(i)) {
                var s = e[i];
                if (s.nativeVideo) continue;
                s.host === t.shopify &&
                  (s.element.setAttribute("controls", "controls"),
                  (s.nativeVideo = !0));
              }
          })()
        : r();
    }
    function r() {
      for (var t in e) e.hasOwnProperty(t) && e[t].ready();
    }
    return {
      init: function (r, a) {
        if (r) {
          var o,
            c = r.querySelector("iframe, video");
          if (c) {
            var l = r.getAttribute("data-media-id");
            (e[l] = {
              mediaId: l,
              sectionId: a,
              host: "VIDEO" === (o = c).tagName ? t.shopify : t.external,
              container: r,
              element: c,
              ready: function () {
                !(function (e) {
                  if (!e.player) {
                    var t = e.container.closest(i.productMediaWrapper),
                      n =
                        "true" ===
                        t.getAttribute("data-" + s.enableVideoLooping);
                    e.player = new Shopify.Video(e.element, {
                      loop: { active: n },
                    });
                    var r = function () {
                      e.player && e.player.pause();
                    };
                    t.addEventListener("mediaHidden", r),
                      t.addEventListener("xrLaunch", r),
                      t.addEventListener("mediaVisible", function () {
                        theme.Helpers.isTouch() ||
                          (e.player && e.player.play());
                      });
                  }
                })(this);
              },
            }),
              window.Shopify.loadFeatures([
                { name: "video-ui", version: "2.0", onLoad: n },
              ]),
              theme.LibraryLoader.load("plyrShopifyStyles");
          }
        }
      },
      hosts: t,
      loadVideos: r,
      removeSectionVideos: function (t) {
        for (var i in e)
          if (e.hasOwnProperty(i)) {
            var s = e[i];
            s.sectionId === t && (s.player && s.player.destroy(), delete e[i]);
          }
      },
    };
  })()),
  (theme.ProductModel = (function () {
    var e = {},
      t = {},
      i = {},
      s = {
        mediaGroup: "[data-product-single-media-group]",
        xrButton: "[data-shopify-xr]",
      };
    function n(e) {
      if (!e) {
        for (var i in t)
          if (t.hasOwnProperty(i)) {
            var s = t[i];
            s.modelViewerUi ||
              (s.modelViewerUi = new Shopify.ModelViewerUI(s.element)),
              r(s);
          }
      }
    }
    function r(e) {
      var t = i[e.sectionId];
      e.container.addEventListener("mediaVisible", function () {
        t.element.setAttribute("data-shopify-model3d-id", e.modelId),
          theme.Helpers.isTouch() || e.modelViewerUi.play();
      }),
        e.container.addEventListener("mediaHidden", function () {
          t.element.setAttribute("data-shopify-model3d-id", t.defaultId),
            e.modelViewerUi.pause();
        }),
        e.container.addEventListener("xrLaunch", function () {
          e.modelViewerUi.pause();
        });
    }
    return {
      init: function (r, a) {
        (e[a] = { loaded: !1 }),
          r.forEach(function (e, n) {
            var r = e.getAttribute("data-media-id"),
              o = e.querySelector("model-viewer"),
              c = o.getAttribute("data-model-id");
            if (0 === n) {
              var l = e.closest(s.mediaGroup).querySelector(s.xrButton);
              i[a] = { element: l, defaultId: c };
            }
            t[r] = { modelId: c, sectionId: a, container: e, element: o };
          }),
          window.Shopify.loadFeatures([
            {
              name: "shopify-xr",
              version: "1.0",
              onLoad: function t(i) {
                if (!i) {
                  if (window.ShopifyXR) {
                    for (var s in e)
                      if (e.hasOwnProperty(s)) {
                        var n = e[s];
                        if (n.loaded) continue;
                        var r = document.querySelector("#ModelJson-" + s);
                        window.ShopifyXR.addModels(JSON.parse(r.innerHTML)),
                          (n.loaded = !0);
                      }
                    window.ShopifyXR.setupXRElements();
                  } else
                    document.addEventListener(
                      "shopify_xr_initialized",
                      function () {
                        t();
                      }
                    );
                }
              },
            },
            { name: "model-viewer-ui", version: "1.0", onLoad: n },
          ]),
          theme.LibraryLoader.load("modelViewerUiStyles");
      },
      removeSectionModels: function (i) {
        for (var s in t)
          t.hasOwnProperty(s) &&
            t[s].sectionId === i &&
            (t[s].modelViewerUi.destroy(), delete t[s]);
        delete e[i];
      },
    };
  })()),
  (window.theme = window.theme || {}),
  (theme.FormStatus = (function () {
    var e = { statusMessage: "[data-form-status]" };
    return {
      init: function () {
        document.querySelectorAll(e.statusMessage).forEach(function (e) {
          e.setAttribute("tabindex", -1),
            e.focus(),
            e.addEventListener(
              "blur",
              function (e) {
                e.target.removeAttribute("tabindex");
              },
              { once: !0 }
            );
        });
      },
    };
  })()),
  (theme.Hero = (function () {
    var e = { indexSectionFlush: "index-section--flush" },
      t = {
        heroFixedWidthContent: ".hero-fixed-width__content",
        heroFixedWidthImage: ".hero-fixed-width__image",
      };
    return function (i, s) {
      var n = document.querySelector(i).getAttribute("data-layout"),
        r = document.querySelector("#shopify-section-" + s),
        a = r.querySelector(t.heroFixedWidthContent),
        o = r.querySelector(t.heroFixedWidthImage);
      function c() {
        var e, t;
        a && (e = a.offsetHeight + 50),
          o && (t = o.offsetHeight),
          e > t && (o.style.minHeight = e + "px");
      }
      "fixed_width" === n &&
        (r.classList.remove(e.indexSectionFlush),
        c(),
        window.addEventListener("resize", function () {
          theme.Helpers.debounce(function () {
            c();
          }, 50);
        }));
    };
  })()),
  (window.theme = window.theme || {}),
  (theme.SearchResultsTemplate = (function () {
    function e() {
      return [
        theme.settings.predictiveSearchShowPrice,
        theme.settings.predictiveSearchShowVendor,
      ].reduce(function (e, t) {
        return e + (t ? 1 : 0);
      }, 0);
    }
    return function (t) {
      var i,
        s,
        n,
        r,
        a,
        o,
        c,
        l,
        d,
        u,
        h = t.products || [],
        p = t.isLoading,
        v = t.searchQuery || "";
      return p && 0 === h.length
        ? [
            '<div class="predictive-search">',
            '<div class="predictive-search-loading">',
            '<span class="visually-hidden">' +
              theme.strings.loading +
              "</span>",
            '<span class="predictive-search-loading__icon">',
            '<span class="icon-predictive-search-spinner"></span>',
            "</span>",
            "</div>",
            "</div>",
          ].join("")
        : ((i = h),
          (s = p),
          (n = v),
          [
            '<div class="predictive-search">',
            ((r = i),
            (a = s),
            0 === r.length
              ? ""
              : [
                  '<div class="predictive-search-title">',
                  '<h3 id="predictive-search" class="predictive-search-title__content">' +
                    theme.strings.products +
                    "</h3>",
                  '<span class="predictive-search-title__loading-spinner">' +
                    (a
                      ? '<span class= "icon-predictive-search-spinner" ></span >'
                      : "") +
                    "</span>",
                  "</div>",
                ].join("")),
            ((o = i),
            (c = n),
            (l = o.length),
            [
              '<ul id="predictive-search-results" class="predictive-search__list" role="listbox" aria-labelledby="predictive-search">',
              o
                .map(function (t, i) {
                  var s, n, r, a, o, c, d, u, h, p, v, m, f, y, g;
                  return (
                    (n = {
                      url: ((s = t).variants.length > 0 ? s.variants[0] : s)
                        .url,
                      image:
                        ((o = s),
                        o.variants.length > 0 && null !== o.variants[0].image
                          ? (d = o.variants[0].featured_image)
                          : o.image
                          ? (d = o.featured_image)
                          : (c = null),
                        null !== c &&
                          (c = {
                            url: theme.Images.getSizedImageUrl(d.url, "100x"),
                            alt: d.alt,
                          }),
                        c),
                      title: s.title,
                      vendor: s.vendor || "",
                      price: theme.Currency.formatMoney(
                        s.price_min,
                        theme.moneyFormat
                      ),
                      compareAtPrice: theme.Currency.formatMoney(
                        s.compare_at_price_min,
                        theme.moneyFormat
                      ),
                      available: s.available,
                      isOnSale:
                        ((u = s),
                        null !== u.compare_at_price_min &&
                          parseInt(u.compare_at_price_min, 10) >
                            parseInt(u.price_min, 10)),
                      isPriceVaries: ((h = s), h.price_max !== h.price_min),
                      isCompareVaries:
                        ((p = s),
                        p.compare_at_price_max !== p.compare_at_price_min),
                    }),
                    (r = i),
                    (a = l),
                    [
                      '<li id="search-result-' +
                        r +
                        '" class="predictive-search-item" role="option" data-search-result>',
                      '<a class="predictive-search-item__link" href="' +
                        n.url +
                        '" tabindex="-1">',
                      '<div class="predictive-search__column predictive-search__column--image" data-image-loading-animation>',
                      ((v = n),
                      null === v.image
                        ? ""
                        : '<img class="predictive-search-item__image lazyload" src="' +
                          v.image.url +
                          '" data-src="' +
                          v.image.url +
                          '" data-image alt="' +
                          v.image.alt +
                          '" />'),
                      "</div>",
                      '<div class="predictive-search__column predictive-search__column--content ' +
                        (e() ? "" : "predictive-search__column--center") +
                        '">',
                      '<span class="predictive-search-item__title">',
                      '<span class="predictive-search-item__title-text">' +
                        n.title +
                        "</span>",
                      "</span>" +
                        (e()
                          ? ((m = n),
                            [
                              '<dl class="predictive-search-item__details price' +
                                (m.isOnSale ? " price--on-sale" : "") +
                                (m.available ? "" : " price--sold-out") +
                                (!m.isPriceVaries && m.isCompareVaries
                                  ? " price--compare-price-hidden"
                                  : "") +
                                '">',
                              '<div class="predictive-search-item__detail">',
                              ((f = m),
                              theme.settings.predictiveSearchShowVendor &&
                              "" !== f.vendor
                                ? [
                                    "<dt>",
                                    '<span class="visually-hidden">' +
                                      theme.strings.vendor +
                                      "</span>",
                                    "</dt>",
                                    '<dd class="predictive-search-item__vendor">' +
                                      f.vendor +
                                      "</dd>",
                                  ].join("")
                                : ""),
                              "</div>",
                              '<div class="predictive-search-item__detail predictive-search-item__detail--inline">' +
                                (function e(t) {
                                  if (!theme.settings.predictiveSearchShowPrice)
                                    return "";
                                  var i,
                                    s,
                                    n,
                                    r =
                                      '<div class="price__regular">' +
                                      ((s = t),
                                      [
                                        "<dt>",
                                        '<span class="visually-hidden">' +
                                          theme.strings.regularPrice +
                                          "</span>",
                                        "</dt>",
                                        "<dd>",
                                        '<span class="predictive-search-item__price">' +
                                          (s.isPriceVaries
                                            ? theme.strings.fromLowestPrice.replace(
                                                "[price]",
                                                s.price
                                              )
                                            : s.price) +
                                          "</span>",
                                        "</dd>",
                                      ].join("")) +
                                      "</div>",
                                    a =
                                      '<div class="price__sale">' +
                                      ((n = t),
                                      [
                                        "<dt>",
                                        '<span class="visually-hidden">' +
                                          theme.strings.salePrice +
                                          "</span>",
                                        "</dt>",
                                        "<dd>",
                                        '<span class="predictive-search-item__price predictive-search-item__price--sale">' +
                                          (n.isPriceVaries
                                            ? theme.strings.fromLowestPrice.replace(
                                                "[price]",
                                                n.price
                                              )
                                            : n.price) +
                                          "</span>",
                                        "</dd>",
                                        '<div class="price__compare">' +
                                          ((i = n),
                                          [
                                            "<dt>",
                                            '<span class="visually-hidden">' +
                                              theme.strings.regularPrice +
                                              "</span> ",
                                            "</dt>",
                                            "<dd>",
                                            '<span class="predictive-search-item__price predictive-search-item__price--compare">' +
                                              i.compareAtPrice +
                                              "</span>",
                                            "</dd>",
                                          ].join("")) +
                                          "</div>",
                                      ].join("")) +
                                      "</div>";
                                  return (
                                    '<span class="visually-hidden">, </span><div class="price__pricing-group">' +
                                    (t.isOnSale ? a : r) +
                                    "</div>"
                                  );
                                })(m),
                              "</div>",
                              "</dl>",
                            ].join(""))
                          : ""),
                      '<span class="visually-hidden">, </span>',
                      '<span class="visually-hidden">' +
                        ((y = r + 1),
                        (g = a),
                        theme.strings.number_of_results
                          .replace("[result_number]", y)
                          .replace("[results_count]", g)) +
                        "</span>",
                      "</div>",
                      "</a>",
                      "</li>",
                    ].join("")
                  );
                })
                .join(""),
              '<li id="search-all" class="predictive-search-view-all" role="option" data-search-result>' +
                ((d = c),
                [
                  '<button type="submit" class="predictive-search-view-all__button" tabindex="-1">',
                  theme.strings.searchFor +
                    '<span class="predictive-search-view-all__query"> &ldquo;' +
                    (u = d)
                      .replace(/&/g, "&amp;")
                      .replace(/</g, "&lt;")
                      .replace(/>/g, "&gt;")
                      .replace(/"/g, "&quot;")
                      .replace(/'/g, "&#39;") +
                    "&rdquo;</span>",
                  "</button>",
                ].join("")) +
                "</li>",
              "</ul>",
            ].join("")),
            "</div>",
          ].join(""));
    };
  })()),
  (window.theme = window.theme || {}),
  (function () {
    var e, t, i, s;
    function n(e) {
      return 1 === e.products.length
        ? theme.strings.one_result_found
        : theme.strings.number_of_results_found.replace(
            "[results_count]",
            e.products.length
          );
    }
    function r() {
      return theme.strings.loading;
    }
    function a(e, t) {
      t.addEventListener(
        "click",
        function (e, t) {
          0 === e.value.trim().length &&
            (void 0 !== t && t.preventDefault(), e.focus());
        }.bind(this, e)
      );
    }
    (window.theme.SearchPage =
      ((t = {
        searchReset: "[data-search-page-predictive-search-clear]",
        searchInput: "[data-search-page-predictive-search-input]",
        searchSubmit: "[data-search-page-predictive-search-submit]",
        searchResults: '[data-predictive-search-mount="default"]',
      }),
      {
        init: function (i) {
          var s = document.querySelector(t.searchInput),
            o = document.querySelector(t.searchSubmit),
            c = s.dataset.baseUrl;
          (e = new window.Shopify.theme.PredictiveSearchComponent({
            selectors: {
              input: t.searchInput,
              reset: t.searchReset,
              result: t.searchResults,
            },
            searchUrl: c,
            resultTemplateFct: window.theme.SearchResultsTemplate,
            numberOfResultsTemplateFct: n,
            loadingResultsMessageTemplateFct: r,
            onOpen: function (e) {
              if (!i.isTabletAndUp) {
                var t = s.getBoundingClientRect(),
                  n = document.body.offsetHeight - t.bottom - 50;
                e.result.style.maxHeight = n + "px";
              }
            },
            onBeforeDestroy: function (e) {
              e.result.style.maxHeight = "";
            },
          })),
            a(s, o);
        },
        unload: function () {
          e && (e.destroy(), (e = null));
        },
      })),
      (window.theme.SearchHeader =
        ((s = {
          searchInput: "[data-predictive-search-drawer-input]",
          searchResults: '[data-predictive-search-mount="drawer"]',
          searchFormContainer: "[data-search-form-container]",
          searchSubmit: "[data-search-form-submit]",
        }),
        {
          init: function (e) {
            var t = document.querySelector(s.searchInput),
              o = document.querySelector(s.searchSubmit),
              c = t.dataset.baseUrl;
            (i = new window.Shopify.theme.PredictiveSearchComponent({
              selectors: { input: s.searchInput, result: s.searchResults },
              searchUrl: c,
              resultTemplateFct: window.theme.SearchResultsTemplate,
              numberOfResultsTemplateFct: n,
              numberOfResults: e.numberOfResults,
              loadingResultsMessageTemplateFct: r,
              onInputBlur: function () {
                return !1;
              },
              onOpen: function (i) {
                var s = t.getBoundingClientRect(),
                  n =
                    window.innerHeight - s.bottom - (e.isTabletAndUp ? 20 : 0);
                (i.result.style.top = e.isTabletAndUp ? "" : s.bottom + "px"),
                  (i.result.style.maxHeight = n + "px");
              },
              onClose: function (e) {
                e.result.style.maxHeight = "";
              },
              onBeforeDestroy: function (e) {
                e.result.style.top = "";
              },
            })),
              a(t, o);
          },
          unload: function () {
            i && (i.destroy(), (i = null));
          },
          clearAndClose: function () {
            i && i.clearAndClose();
          },
        })),
      (window.theme.Search = (function () {
        var e = { searchTemplate: "template-search" },
          t = { siteHeader: ".site-header" },
          i = {
            mobile: window.matchMedia("(max-width: 749px)"),
            tabletAndUp: window.matchMedia("(min-width: 750px)"),
          };
        function s() {
          theme.SearchDrawer.close(),
            theme.SearchHeader.unload(),
            theme.SearchPage.unload(),
            i.mobile.matches
              ? (theme.SearchHeader.init({
                  numberOfResults: 4,
                  isTabletAndUp: !1,
                }),
                n() && theme.SearchPage.init({ isTabletAndUp: !1 }))
              : (theme.SearchHeader.init({
                  numberOfResults: 4,
                  isTabletAndUp: !0,
                }),
                n() && theme.SearchPage.init({ isTabletAndUp: !0 }));
        }
        function n() {
          return document.body.classList.contains(e.searchTemplate);
        }
        return {
          init: function () {
            document.querySelector(t.siteHeader) &&
              JSON.parse(
                document.getElementById("shopify-features").textContent
              ).predictiveSearch &&
              window.theme.settings.predictiveSearchEnabled &&
              (Object.keys(i).forEach(function (e) {
                i[e].addListener(s);
              }),
              s());
          },
          unload: function () {
            theme.SearchHeader.unload(), theme.SearchPage.unload();
          },
        };
      })());
  })(),
  (window.theme = window.theme || {}),
  (theme.SearchDrawer = (function () {
    var e,
      t = {
        headerSection: "[data-header-section]",
        drawer: "[data-predictive-search-drawer]",
        drawerOpenButton: "[data-predictive-search-open-drawer]",
        headerSearchInput: "[data-predictive-search-drawer-input]",
        predictiveSearchWrapper: '[data-predictive-search-mount="drawer"]',
      };
    return {
      init: function () {
        var i;
        (i = document.querySelector(t.drawerOpenButton)) &&
          (i.setAttribute("aria-controls", "SearchDrawer"),
          i.setAttribute("aria-expanded", "false"),
          i.setAttribute("aria-controls", "dialog")),
          (e = new theme.Drawers("SearchDrawer", "top", {
            onDrawerOpen: function () {
              var e, i;
              (e = document.querySelector(t.drawer)),
                (i = document.querySelector(t.headerSection).offsetHeight),
                (e.style.height = i + "px"),
                theme.MobileNav.closeMobileNav(),
                theme.Helpers.enableScrollLock();
            },
            onDrawerClose: function () {
              theme.SearchHeader.clearAndClose();
              var e = document.querySelector(t.drawerOpenButton);
              e && e.focus(), theme.Helpers.disableScrollLock();
            },
            withPredictiveSearch: !0,
            elementToFocusOnOpen: document.querySelector(t.headerSearchInput),
          }));
      },
      close: function () {
        e.close();
      },
    };
  })()),
  (theme.Disclosure = (function () {
    var e = "disclosure-list--visible";
    function t(e) {
      (this.container = e), this._cacheSelectors(), this._setupListeners();
    }
    return (
      (t.prototype = Object.assign({}, t.prototype, {
        _cacheSelectors: function () {
          this.cache = {
            disclosureForm: this.container.closest("[data-disclosure-form]"),
            disclosureList: this.container.querySelector(
              "[data-disclosure-list]"
            ),
            disclosureToggle: this.container.querySelector(
              "[data-disclosure-toggle]"
            ),
            disclosureInput: this.container.querySelector(
              "[data-disclosure-input]"
            ),
            disclosureOptions: this.container.querySelectorAll(
              "[data-disclosure-option]"
            ),
          };
        },
        _setupListeners: function () {
          (this.eventHandlers = this._setupEventHandlers()),
            this.cache.disclosureToggle.addEventListener(
              "click",
              this.eventHandlers.toggleList
            ),
            this.cache.disclosureOptions.forEach(function (e) {
              e.addEventListener("click", this.eventHandlers.connectOptions);
            }, this),
            this.container.addEventListener(
              "keyup",
              this.eventHandlers.onDisclosureKeyUp
            ),
            this.cache.disclosureList.addEventListener(
              "focusout",
              this.eventHandlers.onDisclosureListFocusOut
            ),
            this.cache.disclosureToggle.addEventListener(
              "focusout",
              this.eventHandlers.onDisclosureToggleFocusOut
            ),
            document.body.addEventListener(
              "click",
              this.eventHandlers.onBodyClick
            );
        },
        _setupEventHandlers: function () {
          return {
            connectOptions: this._connectOptions.bind(this),
            toggleList: this._toggleList.bind(this),
            onBodyClick: this._onBodyClick.bind(this),
            onDisclosureKeyUp: this._onDisclosureKeyUp.bind(this),
            onDisclosureListFocusOut: this._onDisclosureListFocusOut.bind(this),
            onDisclosureToggleFocusOut:
              this._onDisclosureToggleFocusOut.bind(this),
          };
        },
        _connectOptions: function (e) {
          e.preventDefault(), this._submitForm(e.currentTarget.dataset.value);
        },
        _onDisclosureToggleFocusOut: function (e) {
          !1 === this.container.contains(e.relatedTarget) && this._hideList();
        },
        _onDisclosureListFocusOut: function (t) {
          var i = t.currentTarget.contains(t.relatedTarget);
          this.cache.disclosureList.classList.contains(e) &&
            !i &&
            this._hideList();
        },
        _onDisclosureKeyUp: function (e) {
          e.which === slate.utils.keyboardKeys.ESCAPE &&
            (this._hideList(), this.cache.disclosureToggle.focus());
        },
        _onBodyClick: function (t) {
          var i = this.container.contains(t.target);
          this.cache.disclosureList.classList.contains(e) &&
            !i &&
            this._hideList();
        },
        _submitForm: function (e) {
          (this.cache.disclosureInput.value = e),
            this.cache.disclosureForm.submit();
        },
        _hideList: function () {
          this.cache.disclosureList.classList.remove(e),
            this.cache.disclosureToggle.setAttribute("aria-expanded", !1);
        },
        _toggleList: function () {
          var t =
            "true" ===
            this.cache.disclosureToggle.getAttribute("aria-expanded");
          this.cache.disclosureList.classList.toggle(e),
            this.cache.disclosureToggle.setAttribute("aria-expanded", !t);
        },
        destroy: function () {
          this.cache.disclosureToggle.removeEventListener(
            "click",
            this.eventHandlers.toggleList
          ),
            this.cache.disclosureOptions.forEach(function (e) {
              e.removeEventListener("click", this.eventHandlers.connectOptions);
            }, this),
            this.container.removeEventListener(
              "keyup",
              this.eventHandlers.onDisclosureKeyUp
            ),
            this.cache.disclosureList.removeEventListener(
              "focusout",
              this.eventHandlers.onDisclosureListFocusOut
            ),
            this.cache.disclosureToggle.removeEventListener(
              "focusout",
              this.eventHandlers.onDisclosureToggleFocusOut
            ),
            document.body.removeEventListener(
              "click",
              this.eventHandlers.onBodyClick
            );
        },
      })),
      t
    );
  })()),
  (theme.Zoom = (function () {
    var e = "data-image-zoom-target";
    function t(e) {
      (this.container = e),
        (this.cache = {}),
        (this.url = e.dataset.zoom),
        this._cacheSelectors(),
        this.cache.sourceImage && this._duplicateImage();
    }
    return (
      (t.prototype = Object.assign({}, t.prototype, {
        _cacheSelectors: function () {
          this.cache = {
            sourceImage: this.container.querySelector("[data-image-zoom]"),
          };
        },
        _init: function () {
          var e = this.cache.targetImage.width,
            t = this.cache.targetImage.height;
          this.cache.sourceImage === this.cache.targetImage
            ? ((this.sourceWidth = e), (this.sourceHeight = t))
            : ((this.sourceWidth = this.cache.sourceImage.width),
              (this.sourceHeight = this.cache.sourceImage.height)),
            (this.xRatio =
              (this.cache.sourceImage.width - e) / this.sourceWidth),
            (this.yRatio =
              (this.cache.sourceImage.height - t) / this.sourceHeight);
        },
        _start: function (e) {
          this._init(), this._move(e);
        },
        _stop: function () {
          this.cache.targetImage.style.opacity = 0;
        },
        _setTopLeftMaxValues: function (e, t) {
          return {
            left: Math.max(Math.min(t, this.sourceWidth), 0),
            top: Math.max(Math.min(e, this.sourceHeight), 0),
          };
        },
        _move: function (e) {
          var t =
              e.pageX -
              (this.cache.sourceImage.getBoundingClientRect().left +
                window.scrollX),
            i =
              e.pageY -
              (this.cache.sourceImage.getBoundingClientRect().top +
                window.scrollY),
            s = this._setTopLeftMaxValues(i, t);
          (i = s.top),
            (t = s.left),
            (this.cache.targetImage.style.left = -(-t * this.xRatio) + "px"),
            (this.cache.targetImage.style.top = -(-i * this.yRatio) + "px"),
            (this.cache.targetImage.style.opacity = 1);
        },
        _duplicateImage: function () {
          this._loadImage()
            .then(
              function (e) {
                (this.cache.targetImage = e),
                  (e.style.width = e.width + "px"),
                  (e.style.height = e.height + "px"),
                  (e.style.position = "absolute"),
                  (e.style.maxWidth = "none"),
                  (e.style.maxHeight = "none"),
                  (e.style.opacity = 0),
                  (e.style.border = "none"),
                  (e.style.left = 0),
                  (e.style.top = 0),
                  this.container.appendChild(e),
                  this._init(),
                  (this._start = this._start.bind(this)),
                  (this._stop = this._stop.bind(this)),
                  (this._move = this._move.bind(this)),
                  this.container.addEventListener("mouseenter", this._start),
                  this.container.addEventListener("mouseleave", this._stop),
                  this.container.addEventListener("mousemove", this._move),
                  (this.container.style.position = "relative"),
                  (this.container.style.overflow = "hidden");
              }.bind(this)
            )
            .catch(function (e) {
              console.warn("Error fetching image", e);
            });
        },
        _loadImage: function () {
          return new Promise(
            function (t, i) {
              var s = new Image();
              s.setAttribute("role", "presentation"),
                s.setAttribute(e, !0),
                s.classList.add("zoomImg"),
                (s.src = this.url),
                s.addEventListener("load", function () {
                  t(s);
                }),
                s.addEventListener("error", function (e) {
                  i(e);
                });
            }.bind(this)
          );
        },
        unload: function () {
          var t = this.container.querySelector("[" + e + "]");
          t && t.remove(),
            this.container.removeEventListener("mouseenter", this._start),
            this.container.removeEventListener("mouseleave", this._stop),
            this.container.removeEventListener("mousemove", this._move);
        },
      })),
      t
    );
  })()),
  (function () {
    var e = document.querySelectorAll("[data-blog-tag-filter]");
    e.length &&
      (slate.utils.resizeSelects(e),
      e.forEach(function (e) {
        e.addEventListener("change", function (e) {
          location.href = e.target.value;
        });
      }));
  })(),
  (window.theme = theme || {}),
  (theme.customerTemplates = (function () {
    var e = {
      RecoverHeading: "#RecoverHeading",
      RecoverEmail: "#RecoverEmail",
      LoginHeading: "#LoginHeading",
    };
    function t() {
      document.getElementById("RecoverPasswordForm").classList.remove("hide"),
        document.getElementById("CustomerLoginForm").classList.add("hide"),
        "true" === this.recoverEmail.getAttribute("aria-invalid") &&
          this.recoverEmail.focus();
    }
    return {
      init: function () {
        var i, s;
        (function i() {
          (this.recoverHeading = document.querySelector(e.RecoverHeading)),
            (this.recoverEmail = document.querySelector(e.RecoverEmail)),
            (this.loginHeading = document.querySelector(e.LoginHeading));
          var s = document.getElementById("RecoverPassword"),
            n = document.getElementById("HideRecoverPasswordLink");
          s &&
            s.addEventListener(
              "click",
              function (e) {
                e.preventDefault(),
                  t(),
                  this.recoverHeading.setAttribute("tabindex", "-1"),
                  this.recoverHeading.focus();
              }.bind(this)
            ),
            n &&
              n.addEventListener(
                "click",
                function (e) {
                  e.preventDefault(),
                    document
                      .getElementById("RecoverPasswordForm")
                      .classList.add("hide"),
                    document
                      .getElementById("CustomerLoginForm")
                      .classList.remove("hide"),
                    this.loginHeading.setAttribute("tabindex", "-1"),
                    this.loginHeading.focus();
                }.bind(this)
              ),
            this.recoverHeading &&
              this.recoverHeading.addEventListener("blur", function (e) {
                e.target.removeAttribute("tabindex");
              }),
            this.loginHeading &&
              this.loginHeading.addEventListener("blur", function (e) {
                e.target.removeAttribute("tabindex");
              });
        })(),
          (function () {
            "#recover" === window.location.hash && t.bind(this)();
          })(),
          (function () {
            if (document.querySelector(".reset-password-success")) {
              var e = document.getElementById("ResetSuccess");
              e.classList.remove("hide"), e.focus();
            }
          })(),
          (i = document.getElementById("AddressNewForm")),
          (s = document.getElementById("AddressNewButton")),
          i &&
            (Shopify &&
              new Shopify.CountryProvinceSelector(
                "AddressCountryNew",
                "AddressProvinceNew",
                { hideElement: "AddressProvinceContainerNew" }
              ),
            document
              .querySelectorAll(".address-country-option")
              .forEach(function (e) {
                var t = e.dataset.formId;
                new Shopify.CountryProvinceSelector(
                  "AddressCountry_" + t,
                  "AddressProvince_" + t,
                  { hideElement: "AddressProvinceContainer_" + t }
                );
              }),
            document
              .querySelectorAll(".address-new-toggle")
              .forEach(function (e) {
                e.addEventListener("click", function () {
                  var e = "true" === s.getAttribute("aria-expanded");
                  i.classList.toggle("hide"),
                    s.setAttribute("aria-expanded", !e),
                    s.focus();
                });
              }),
            document
              .querySelectorAll(".address-edit-toggle")
              .forEach(function (e) {
                e.addEventListener("click", function (e) {
                  var t = e.target.dataset.formId,
                    i = document.getElementById("EditFormButton_" + t),
                    s = document.getElementById("EditAddress_" + t),
                    n = "true" === i.getAttribute("aria-expanded");
                  s.classList.toggle("hide"),
                    i.setAttribute("aria-expanded", !n),
                    i.focus();
                });
              }),
            document.querySelectorAll(".address-delete").forEach(function (e) {
              e.addEventListener("click", function (e) {
                var t = e.target.dataset.target;
                confirm(
                  e.target.dataset.confirmMessage ||
                    "Are you sure you wish to delete this address?"
                ) && Shopify.postLink(t, { parameters: { _method: "delete" } });
              });
            }));
      },
    };
  })()),
  (window.theme = window.theme || {}),
  (theme.Cart = (function () {
    var e = {
        cartCount: "[data-cart-count]",
        cartCountBubble: "[data-cart-count-bubble]",
        cartDiscount: "[data-cart-discount]",
        cartDiscountTitle: "[data-cart-discount-title]",
        cartDiscountAmount: "[data-cart-discount-amount]",
        cartDiscountWrapper: "[data-cart-discount-wrapper]",
        cartErrorMessage: "[data-cart-error-message]",
        cartErrorMessageWrapper: "[data-cart-error-message-wrapper]",
        cartItem: "[data-cart-item]",
        cartItemDetails: "[data-cart-item-details]",
        cartItemDiscount: "[data-cart-item-discount]",
        cartItemDiscountedPriceGroup: "[data-cart-item-discounted-price-group]",
        cartItemDiscountTitle: "[data-cart-item-discount-title]",
        cartItemDiscountAmount: "[data-cart-item-discount-amount]",
        cartItemDiscountList: "[data-cart-item-discount-list]",
        cartItemFinalPrice: "[data-cart-item-final-price]",
        cartItemImage: "[data-cart-item-image]",
        cartItemLinePrice: "[data-cart-item-line-price]",
        cartItemOriginalPrice: "[data-cart-item-original-price]",
        cartItemPrice: "[data-cart-item-price]",
        cartItemPriceList: "[data-cart-item-price-list]",
        cartItemProperty: "[data-cart-item-property]",
        cartItemPropertyName: "[data-cart-item-property-name]",
        cartItemPropertyValue: "[data-cart-item-property-value]",
        cartItemRegularPriceGroup: "[data-cart-item-regular-price-group]",
        cartItemRegularPrice: "[data-cart-item-regular-price]",
        cartItemTitle: "[data-cart-item-title]",
        cartItemOption: "[data-cart-item-option]",
        cartItemSellingPlanName: "[data-cart-item-selling-plan-name]",
        cartLineItems: "[data-cart-line-items]",
        cartNote: "[data-cart-notes]",
        cartQuantityErrorMessage: "[data-cart-quantity-error-message]",
        cartQuantityErrorMessageWrapper:
          "[data-cart-quantity-error-message-wrapper]",
        cartRemove: "[data-cart-remove]",
        cartStatus: "[data-cart-status]",
        cartSubtotal: "[data-cart-subtotal]",
        cartTableCell: "[data-cart-table-cell]",
        cartWrapper: "[data-cart-wrapper]",
        emptyPageContent: "[data-empty-page-content]",
        quantityInput: "[data-quantity-input]",
        quantityInputMobile: "[data-quantity-input-mobile]",
        quantityInputDesktop: "[data-quantity-input-desktop]",
        quantityLabelMobile: "[data-quantity-label-mobile]",
        quantityLabelDesktop: "[data-quantity-label-desktop]",
        inputQty: "[data-quantity-input]",
        thumbnails: ".cart__image",
        unitPrice: "[data-unit-price]",
        unitPriceBaseUnit: "[data-unit-price-base-unit]",
        unitPriceGroup: "[data-unit-price-group]",
      },
      t = {
        cartNoCookies: "cart--no-cookies",
        cartRemovedProduct: "cart__removed-product",
        thumbnails: "cart__image",
        hide: "hide",
        inputError: "input--error",
      },
      i = "data-cart-item-index",
      s = "data-cart-item-key",
      n = "data-cart-item-title",
      r = "data-cart-item-url",
      a = "(min-width: " + theme.breakpoints.medium + "px)";
    function o(i) {
      (this.container = i),
        (this.thumbnails = this.container.querySelectorAll(e.thumbnails)),
        (this.quantityInputs = this.container.querySelectorAll(e.inputQty)),
        (this.ajaxEnabled =
          "true" === this.container.getAttribute("data-ajax-enabled")),
        (this.cartRoutes = JSON.parse(
          document.querySelector("[data-cart-routes]").innerHTML
        )),
        (this._handleInputQty = theme.Helpers.debounce(
          this._handleInputQty.bind(this),
          500
        )),
        (this.setQuantityFormControllers =
          this.setQuantityFormControllers.bind(this)),
        (this._onNoteChange = this._onNoteChange.bind(this)),
        (this._onRemoveItem = this._onRemoveItem.bind(this)),
        theme.Helpers.cookiesEnabled() ||
          this.container.classList.add(t.cartNoCookies),
        this.thumbnails.forEach(function (e) {
          e.style.cursor = "pointer";
        }),
        this.container.addEventListener("click", this._handleThumbnailClick),
        this.container.addEventListener("change", this._handleInputQty),
        (this.mql = window.matchMedia(a)),
        this.mql.addListener(this.setQuantityFormControllers),
        this.setQuantityFormControllers(),
        this.ajaxEnabled &&
          (this.container.addEventListener("click", this._onRemoveItem),
          this.container.addEventListener("change", this._onNoteChange),
          this._setupCartTemplates());
    }
    return (
      (o.prototype = Object.assign({}, o.prototype, {
        _setupCartTemplates: function () {
          this.container.querySelector(e.cartItem) &&
            ((this.itemTemplate = this.container
              .querySelector(e.cartItem)
              .cloneNode(!0)),
            (this.itemDiscountTemplate = this.itemTemplate
              .querySelector(e.cartItemDiscount)
              .cloneNode(!0)),
            (this.cartDiscountTemplate = this.container
              .querySelector(e.cartDiscount)
              .cloneNode(!0)),
            (this.itemPriceListTemplate = this.itemTemplate
              .querySelector(e.cartItemPriceList)
              .cloneNode(!0)),
            (this.itemOptionTemplate = this.itemTemplate
              .querySelector(e.cartItemOption)
              .cloneNode(!0)),
            (this.itemPropertyTemplate = this.itemTemplate
              .querySelector(e.cartItemProperty)
              .cloneNode(!0)),
            (this.itemSellingPlanNameTemplate = this.itemTemplate
              .querySelector(e.cartItemSellingPlanName)
              .cloneNode(!0)));
        },
        _handleInputQty: function (t) {
          if (t.target.hasAttribute("data-quantity-input")) {
            var i = t.target,
              s = i.closest(e.cartItem),
              n = Number(i.getAttribute("data-quantity-item")),
              r = this.container.querySelectorAll(
                "[data-quantity-item='" + n + "']"
              ),
              a = parseInt(i.value),
              o = !(a < 0 || isNaN(a));
            r.forEach(function (e) {
              e.value = a;
            }),
              this._hideCartError(),
              this._hideQuantityErrorMessage(),
              o
                ? o && this.ajaxEnabled && this._updateItemQuantity(n, s, r, a)
                : this._showQuantityErrorMessages(s);
          }
        },
        _updateItemQuantity: function (e, t, n, r) {
          var a = t.getAttribute(s),
            o = {
              method: "POST",
              headers: { "Content-Type": "application/json;" },
              body: JSON.stringify({
                line: Number(t.getAttribute(i)),
                quantity: r,
              }),
            };
          fetch(this.cartRoutes.cartChangeUrl + ".js", o)
            .then(function (e) {
              return e.json();
            })
            .then(
              function (e) {
                if ((this._setCartCountBubble(e.item_count), e.item_count)) {
                  var s = document.activeElement;
                  if ((this._createCart(e), r)) {
                    var n = this.getItem(a, e);
                    if ((this._updateLiveRegion(n), s)) {
                      var o = s.closest("[" + i + "]");
                      if (o) {
                        var c = this.container.querySelector(
                          "[" +
                            i +
                            '="' +
                            o.getAttribute(i) +
                            '"] [data-role="' +
                            s.getAttribute("data-role") +
                            '"]'
                        );
                        c && c.focus();
                      }
                    }
                  } else this._showRemoveMessage(t.cloneNode(!0));
                } else this._emptyCart();
              }.bind(this)
            )
            .catch(
              function () {
                this._showCartError(null);
              }.bind(this)
            );
        },
        getItem: function (e, t) {
          return t.items.find(function (t) {
            return t.key === e;
          });
        },
        _liveRegionText: function (e) {
          var t =
            theme.strings.update +
            ": [QuantityLabel]: [Quantity], [Regular] [$$] [DiscountedPrice] [$]. [PriceInformation]";
          t = t
            .replace("[QuantityLabel]", theme.strings.quantity)
            .replace("[Quantity]", e.quantity);
          var i = "",
            s = theme.Currency.formatMoney(
              e.original_line_price,
              theme.moneyFormat
            ),
            n = "",
            r = "",
            a = "";
          return (
            e.original_line_price > e.final_line_price &&
              ((i = theme.strings.regularTotal),
              (n = theme.strings.discountedTotal),
              (r = theme.Currency.formatMoney(
                e.final_line_price,
                theme.moneyFormat
              )),
              (a = theme.strings.priceColumn)),
            (t = t
              .replace("[Regular]", i)
              .replace("[$$]", s)
              .replace("[DiscountedPrice]", n)
              .replace("[$]", r)
              .replace("[PriceInformation]", a)
              .trim())
          );
        },
        _updateLiveRegion: function (t) {
          if (t) {
            var i = this.container.querySelector(e.cartStatus);
            (i.textContent = this._liveRegionText(t)),
              i.setAttribute("aria-hidden", !1),
              setTimeout(function () {
                i.setAttribute("aria-hidden", !0);
              }, 1e3);
          }
        },
        _createCart: function (i) {
          var s = this._createCartDiscountList(i),
            n = this.container.querySelector(e.cartLineItems);
          (n.innerHTML = ""),
            this._createLineItemList(i).forEach(function (e) {
              n.appendChild(e);
            }),
            this.setQuantityFormControllers(),
            (this.cartNotes =
              this.cartNotes || this.container.querySelector(e.cartNote)),
            this.cartNotes && (this.cartNotes.value = i.note);
          var r = this.container.querySelector(e.cartDiscountWrapper);
          0 === s.length
            ? ((r.innerHTML = ""), r.classList.add(t.hide))
            : ((r.innerHTML = ""),
              s.forEach(function (e) {
                r.appendChild(e);
              }),
              r.classList.remove(t.hide)),
            (this.container.querySelector(e.cartSubtotal).innerHTML =
              theme.Currency.formatMoney(
                i.total_price,
                theme.moneyFormatWithCurrency
              ));
        },
        _createCartDiscountList: function (t) {
          return t.cart_level_discount_applications.map(
            function (t) {
              var i = this.cartDiscountTemplate.cloneNode(!0);
              return (
                (i.querySelector(e.cartDiscountTitle).textContent = t.title),
                (i.querySelector(e.cartDiscountAmount).innerHTML =
                  theme.Currency.formatMoney(
                    t.total_allocated_amount,
                    theme.moneyFormat
                  )),
                i
              );
            }.bind(this)
          );
        },
        _createLineItemList: function (t) {
          return t.items.map(
            function (t, i) {
              var s = this.itemTemplate.cloneNode(!0),
                n = this.itemPriceListTemplate.cloneNode(!0);
              this._setLineItemAttributes(s, t, i),
                this._setLineItemImage(s, t.featured_image);
              var r = s.querySelector(e.cartItemTitle);
              (r.textContent = t.product_title), r.setAttribute("href", t.url);
              var a = t.selling_plan_allocation
                  ? t.selling_plan_allocation.selling_plan.name
                  : null,
                o = this._createProductDetailsList(
                  t.product_has_only_default_variant,
                  t.options_with_values,
                  t.properties,
                  a
                );
              this._setProductDetailsList(s, o),
                this._setItemRemove(s, t.title),
                (n.innerHTML = this._createItemPrice(
                  t.original_price,
                  t.final_price
                ).outerHTML),
                t.unit_price_measurement &&
                  n.appendChild(
                    this._createUnitPrice(
                      t.unit_price,
                      t.unit_price_measurement
                    )
                  ),
                this._setItemPrice(s, n);
              var c = this._createItemDiscountList(t);
              this._setItemDiscountList(s, c), this._setQuantityInputs(s, t, i);
              var l = this._createItemPrice(
                t.original_line_price,
                t.final_line_price
              );
              return this._setItemLinePrice(s, l), s;
            }.bind(this)
          );
        },
        _setLineItemAttributes: function (e, t, a) {
          e.setAttribute(s, t.key),
            e.setAttribute(r, t.url),
            e.setAttribute(n, t.title),
            e.setAttribute(i, a + 1),
            e.setAttribute("data-cart-item-quantity", t.quantity);
        },
        _setLineItemImage: function (i, s) {
          var n = i.querySelector(e.cartItemImage),
            r =
              null !== s.url
                ? theme.Images.getSizedImageUrl(s.url, "x190")
                : null;
          r
            ? (n.setAttribute("alt", s.alt),
              n.setAttribute("src", r),
              n.classList.remove(t.hide))
            : n.parentNode.removeChild(n);
        },
        _setProductDetailsList: function (i, s) {
          var n = i.querySelector(e.cartItemDetails);
          if (s.length)
            return (
              n.classList.remove(t.hide),
              void (n.innerHTML = s.reduce(function (e, t) {
                return e + t.outerHTML;
              }, ""))
            );
          n.classList.add(t.hide), (n.textContent = "");
        },
        _setItemPrice: function (t, i) {
          t.querySelector(e.cartItemPrice).innerHTML = i.outerHTML;
        },
        _setItemDiscountList: function (i, s) {
          var n = i.querySelector(e.cartItemDiscountList);
          0 === s.length
            ? ((n.innerHTML = ""), n.classList.add(t.hide))
            : ((n.innerHTML = s.reduce(function (e, t) {
                return e + t.outerHTML;
              }, "")),
              n.classList.remove(t.hide));
        },
        _setItemRemove: function (t, i) {
          t.querySelector(e.cartRemove).setAttribute(
            "aria-label",
            theme.strings.removeLabel.replace("[product]", i)
          );
        },
        _setQuantityInputs: function (t, i, s) {
          var n = t.querySelector(e.quantityInputMobile),
            r = t.querySelector(e.quantityInputDesktop);
          n.setAttribute("id", "updates_" + i.key),
            r.setAttribute("id", "updates_large_" + i.key),
            [n, r].forEach(function (e) {
              e.setAttribute("data-quantity-item", s + 1),
                (e.value = i.quantity);
            }),
            t
              .querySelector(e.quantityLabelMobile)
              .setAttribute("for", "updates_" + i.key),
            t
              .querySelector(e.quantityLabelDesktop)
              .setAttribute("for", "updates_large_" + i.key);
        },
        setQuantityFormControllers: function () {
          var t = document.querySelectorAll(e.quantityInputDesktop),
            i = document.querySelectorAll(e.quantityInputMobile);
          function s(e) {
            e.forEach(function (e) {
              e.setAttribute("name", "updates[]");
            });
          }
          function n(e) {
            e.forEach(function (e) {
              e.removeAttribute("name");
            });
          }
          this.mql.matches ? (s(t), n(i)) : (s(i), n(t));
        },
        _setItemLinePrice: function (t, i) {
          t.querySelector(e.cartItemLinePrice).innerHTML = i.outerHTML;
        },
        _createProductDetailsList: function (e, t, i, s) {
          var n = [];
          return (
            e || (n = n.concat(this._getOptionList(t))),
            s && (n = n.concat(this._getSellingPlanName(s))),
            null !== i &&
              0 !== Object.keys(i).length &&
              (n = n.concat(this._getPropertyList(i))),
            n
          );
        },
        _getOptionList: function (e) {
          return e.map(
            function (e) {
              var i = this.itemOptionTemplate.cloneNode(!0);
              return (
                (i.textContent = e.name + ": " + e.value),
                i.classList.remove(t.hide),
                i
              );
            }.bind(this)
          );
        },
        _getPropertyList: function (i) {
          return (null !== i ? Object.entries(i) : [])
            .filter(function (e) {
              return "_" !== e[0].charAt(0) && 0 !== e[1].length;
            })
            .map(
              function (i) {
                var s = this.itemPropertyTemplate.cloneNode(!0);
                return (
                  (s.querySelector(e.cartItemPropertyName).textContent =
                    i[0] + ": "),
                  -1 === i[0].indexOf("/uploads/")
                    ? (s.querySelector(e.cartItemPropertyValue).textContent =
                        i[1])
                    : (s.querySelector(e.cartItemPropertyValue).innerHTML =
                        '<a href="' +
                        i[1] +
                        '"> ' +
                        i[1].split("/").pop() +
                        "</a>"),
                  s.classList.remove(t.hide),
                  s
                );
              }.bind(this)
            );
        },
        _getSellingPlanName: function (e) {
          var i = this.itemSellingPlanNameTemplate.cloneNode(!0);
          return (i.textContent = e), i.classList.remove(t.hide), i;
        },
        _createItemPrice: function (i, s) {
          var n,
            r = theme.Currency.formatMoney(i, theme.moneyFormat);
          return (
            i !== s
              ? (((n = this.itemPriceListTemplate
                  .querySelector(e.cartItemDiscountedPriceGroup)
                  .cloneNode(!0)).querySelector(
                  e.cartItemOriginalPrice
                ).innerHTML = r),
                (n.querySelector(e.cartItemFinalPrice).innerHTML =
                  theme.Currency.formatMoney(s, theme.moneyFormat)))
              : ((n = this.itemPriceListTemplate
                  .querySelector(e.cartItemRegularPriceGroup)
                  .cloneNode(!0)).querySelector(
                  e.cartItemRegularPrice
                ).innerHTML = r),
            n.classList.remove(t.hide),
            n
          );
        },
        _createUnitPrice: function (i, s) {
          var n = this.itemPriceListTemplate
              .querySelector(e.unitPriceGroup)
              .cloneNode(!0),
            r =
              (1 !== s.reference_value ? s.reference_value : "") +
              s.reference_unit;
          return (
            (n.querySelector(e.unitPriceBaseUnit).textContent = r),
            (n.querySelector(e.unitPrice).innerHTML =
              theme.Currency.formatMoney(i, theme.moneyFormat)),
            n.classList.remove(t.hide),
            n
          );
        },
        _createItemDiscountList: function (t) {
          return t.line_level_discount_allocations.map(
            function (t) {
              var i = this.itemDiscountTemplate.cloneNode(!0);
              return (
                (i.querySelector(e.cartItemDiscountTitle).textContent =
                  t.discount_application.title),
                (i.querySelector(e.cartItemDiscountAmount).innerHTML =
                  theme.Currency.formatMoney(t.amount, theme.moneyFormat)),
                i
              );
            }.bind(this)
          );
        },
        _showQuantityErrorMessages: function (i) {
          i.querySelectorAll(e.cartQuantityErrorMessage).forEach(function (e) {
            e.textContent = theme.strings.quantityMinimumMessage;
          }),
            i
              .querySelectorAll(e.cartQuantityErrorMessageWrapper)
              .forEach(function (e) {
                e.classList.remove(t.hide);
              }),
            i.querySelectorAll(e.inputQty).forEach(function (e) {
              e.classList.add(t.inputError), e.focus();
            });
        },
        _hideQuantityErrorMessage: function () {
          document
            .querySelectorAll(e.cartQuantityErrorMessageWrapper)
            .forEach(function (i) {
              i.classList.add(t.hide),
                (i.querySelector(e.cartQuantityErrorMessage).textContent = "");
            }),
            this.container.querySelectorAll(e.inputQty).forEach(function (e) {
              e.classList.remove(t.inputError);
            });
        },
        _handleThumbnailClick: function (i) {
          i.target.classList.contains(t.thumbnails) &&
            (window.location.href = i.target
              .closest(e.cartItem)
              .getAttribute("data-cart-item-url"));
        },
        _onNoteChange: function (e) {
          if (e.target.hasAttribute("data-cart-notes")) {
            var t = e.target.value;
            this._hideCartError(),
              this._hideQuantityErrorMessage(),
              fetch("/cart/update.js", {
                method: "POST",
                headers: new Headers({ "Content-Type": "application/json" }),
                body: JSON.stringify({ note: t }),
              }).catch(
                function () {
                  this._showCartError(e.target);
                }.bind(this)
              );
          }
        },
        _showCartError: function (i) {
          (document.querySelector(e.cartErrorMessage).textContent =
            theme.strings.cartError),
            document
              .querySelector(e.cartErrorMessageWrapper)
              .classList.remove(t.hide),
            i && i.focus();
        },
        _hideCartError: function () {
          document
            .querySelector(e.cartErrorMessageWrapper)
            .classList.add(t.hide),
            (document.querySelector(e.cartErrorMessage).textContent = "");
        },
        _onRemoveItem: function (t) {
          if (t.target.hasAttribute("data-cart-remove")) {
            t.preventDefault();
            var s = t.target.closest(e.cartItem),
              n = Number(s.getAttribute(i));
            this._hideCartError();
            var r = {
              method: "POST",
              headers: { "Content-Type": "application/json;" },
              body: JSON.stringify({ line: n, quantity: 0 }),
            };
            fetch(this.cartRoutes.cartChangeUrl + ".js", r)
              .then(function (e) {
                return e.json();
              })
              .then(
                function (e) {
                  0 === e.item_count
                    ? this._emptyCart()
                    : (this._createCart(e),
                      this._showRemoveMessage(s.cloneNode(!0))),
                    this._setCartCountBubble(e.item_count);
                }.bind(this)
              )
              .catch(
                function () {
                  this._showCartError(null);
                }.bind(this)
              );
          }
        },
        _showRemoveMessage: function (e) {
          var t = e.getAttribute("data-cart-item-index"),
            i = this._getRemoveMessage(e);
          t - 1 == 0
            ? this.container
                .querySelector('[data-cart-item-index="1"]')
                .insertAdjacentHTML("beforebegin", i.outerHTML)
            : this.container
                .querySelector("[data-cart-item-index='" + (t - 1) + "']")
                .insertAdjacentHTML("afterend", i.outerHTML),
            this.container.querySelector("[data-removed-item-row]").focus();
        },
        _getRemoveMessage: function (i) {
          var s = this._formatRemoveMessage(i),
            n = i.querySelector(e.cartTableCell).cloneNode(!0);
          return (
            n.removeAttribute("class"),
            n.classList.add(t.cartRemovedProduct),
            n.setAttribute("colspan", "4"),
            (n.innerHTML = s),
            i.setAttribute("role", "alert"),
            i.setAttribute("tabindex", "-1"),
            i.setAttribute("data-removed-item-row", !0),
            (i.innerHTML = n.outerHTML),
            i
          );
        },
        _formatRemoveMessage: function (e) {
          var t = e.getAttribute("data-cart-item-quantity"),
            i = e.getAttribute(r),
            s = e.getAttribute(n);
          return theme.strings.removedItemMessage
            .replace("[quantity]", t)
            .replace(
              "[link]",
              '<a href="' +
                i +
                '" class="text-link text-link--accent">' +
                s +
                "</a>"
            );
        },
        _setCartCountBubble: function (i) {
          (this.cartCountBubble =
            this.cartCountBubble || document.querySelector(e.cartCountBubble)),
            (this.cartCount =
              this.cartCount || document.querySelector(e.cartCount)),
            i > 0
              ? (this.cartCountBubble.classList.remove(t.hide),
                (this.cartCount.textContent = i))
              : (this.cartCountBubble.classList.add(t.hide),
                (this.cartCount.textContent = ""));
        },
        _emptyCart: function () {
          (this.emptyPageContent =
            this.emptyPageContent ||
            this.container.querySelector(e.emptyPageContent)),
            (this.cartWrapper =
              this.cartWrapper || this.container.querySelector(e.cartWrapper)),
            this.emptyPageContent.classList.remove(t.hide),
            this.cartWrapper.classList.add(t.hide);
        },
      })),
      o
    );
  })()),
  (window.theme = window.theme || {}),
  (theme.Filters = (function () {
    var e = {
        mediaQueryMediumUp: "(min-width: " + theme.breakpoints.medium + "px)",
      },
      t = {
        filterSelection: "#FilterTags",
        sortSelection: "#SortBy",
        selectInput: "[data-select-input]",
      };
    function i(i) {
      (this.filterSelect = i.querySelector(t.filterSelection)),
        (this.sortSelect = i.querySelector(t.sortSelection)),
        (this.selects = document.querySelectorAll(t.selectInput)),
        this.sortSelect && (this.defaultSort = this._getDefaultSortValue()),
        this.selects.length &&
          this.selects.forEach(function (e) {
            e.classList.remove("hidden");
          }),
        (this.initBreakpoints = this._initBreakpoints.bind(this)),
        (this.mql = window.matchMedia(e.mediaQueryMediumUp)),
        this.mql.addListener(this.initBreakpoints),
        this.filterSelect &&
          this.filterSelect.addEventListener(
            "change",
            this._onFilterChange.bind(this)
          ),
        this.sortSelect &&
          this.sortSelect.addEventListener(
            "change",
            this._onSortChange.bind(this)
          ),
        theme.Helpers.promiseStylesheet().then(
          function () {
            this._initBreakpoints();
          }.bind(this)
        ),
        this._initParams();
    }
    return (
      (i.prototype = Object.assign({}, i.prototype, {
        _initBreakpoints: function () {
          this.mql.matches && slate.utils.resizeSelects(this.selects);
        },
        _initParams: function () {
          if (((this.queryParams = {}), location.search.length))
            for (
              var e, t = location.search.substr(1).split("&"), i = 0;
              i < t.length;
              i++
            )
              (e = t[i].split("=")).length > 1 &&
                (this.queryParams[decodeURIComponent(e[0])] =
                  decodeURIComponent(e[1]));
        },
        _onSortChange: function () {
          (this.queryParams.sort_by = this._getSortValue()),
            this.queryParams.page && delete this.queryParams.page,
            (window.location.search = decodeURIComponent(
              new URLSearchParams(Object.entries(this.queryParams)).toString()
            ));
        },
        _onFilterChange: function () {
          document.location.href = this._getFilterValue();
        },
        _getFilterValue: function () {
          return this.filterSelect.value;
        },
        _getSortValue: function () {
          return this.sortSelect.value || this.defaultSort;
        },
        _getDefaultSortValue: function () {
          return this.sortSelect.dataset.defaultSortby;
        },
        onUnload: function () {
          this.filterSelect &&
            this.filterSelect.removeEventListener(
              "change",
              this._onFilterChange
            ),
            this.sortSelect &&
              this.sortSelect.removeEventListener("change", this._onSortChange),
            this.mql.removeListener(this.initBreakpoints);
        },
      })),
      i
    );
  })()),
  (window.theme = window.theme || {}),
  (theme.HeaderSection = (function () {
    function e() {
      theme.Header.init(),
        theme.MobileNav.init(),
        theme.SearchDrawer.init(),
        theme.Search.init();
    }
    return (
      (e.prototype = Object.assign({}, e.prototype, {
        onUnload: function () {
          theme.Header.unload(),
            theme.Search.unload(),
            theme.MobileNav.unload();
        },
      })),
      e
    );
  })()),
  (theme.Maps = (function () {
    var e = null,
      t = [],
      i = {
        addressNoResults: theme.strings.addressNoResults,
        addressQueryLimit: theme.strings.addressQueryLimit,
        addressError: theme.strings.addressError,
        authError: theme.strings.authError,
      },
      s = {
        section: '[data-section-type="map"]',
        map: "[data-map]",
        mapOverlay: "[data-map-overlay]",
      },
      n = "map-section--load-error",
      r = "map-section__error errors text-center";
    function a(i) {
      (this.map = i.querySelector(s.map)),
        this.map &&
          ((this.key = this.map.dataset.apiKey),
          void 0 !== this.key &&
            ("loaded" === e
              ? this.createMap()
              : (t.push(this),
                "loading" !== e &&
                  ((e = "loading"),
                  void 0 === window.google &&
                    theme.Helpers.getScript(
                      "https://maps.googleapis.com/maps/api/js?key=" + this.key
                    ).then(function () {
                      (e = "loaded"),
                        t.forEach(function (e) {
                          e.createMap();
                        });
                    })))));
    }
    return (
      (window.gm_authFailure = function () {
        Shopify.designMode &&
          (document.querySelector(s.section).classList.add(n),
          document.querySelector(s.map).remove(),
          document
            .querySelector(s.mapOverlay)
            .insertAdjacentHTML(
              "afterend",
              '<div class="' + r + '">' + theme.strings.authError + "</div>"
            ));
      }),
      (a.prototype = Object.assign({}, a.prototype, {
        createMap: function () {
          var e;
          return ((e = this.map),
          new Promise(function (t, i) {
            var s = new google.maps.Geocoder(),
              n = e.dataset.addressSetting;
            s.geocode({ address: n }, function (e, s) {
              s !== google.maps.GeocoderStatus.OK && i(s), t(e);
            });
          }))
            .then(
              function (e) {
                var t = {
                    zoom: 14,
                    center: e[0].geometry.location,
                    draggable: !1,
                    clickableIcons: !1,
                    scrollwheel: !1,
                    disableDoubleClickZoom: !0,
                    disableDefaultUI: !0,
                  },
                  i = (this.map = new google.maps.Map(this.map, t)),
                  s = (this.center = i.getCenter());
                new google.maps.Marker({ map: i, position: i.getCenter() }),
                  google.maps.event.addDomListener(
                    window,
                    "resize",
                    theme.Helpers.debounce(
                      function () {
                        google.maps.event.trigger(i, "resize"),
                          i.setCenter(s),
                          this.map.removeAttribute("style");
                      }.bind(this),
                      250
                    )
                  );
              }.bind(this)
            )
            .catch(
              function () {
                var e;
                switch (status) {
                  case "ZERO_RESULTS":
                    e = i.addressNoResults;
                    break;
                  case "OVER_QUERY_LIMIT":
                    e = i.addressQueryLimit;
                    break;
                  case "REQUEST_DENIED":
                    e = i.authError;
                    break;
                  default:
                    e = i.addressError;
                }
                Shopify.designMode &&
                  (this.map.parentNode.classList.add(n),
                  (this.map.parentNode.innerHTML =
                    '<div class="' + r + '">' + e + "</div>"));
              }.bind(this)
            );
        },
        onUnload: function () {
          this.map && google.maps.event.clearListeners(this.map, "resize");
        },
      })),
      a
    );
  })()),
  (theme.Product = (function () {
    function e(e) {
      this.container = e;
      var t = e.getAttribute("data-section-id");
      (this.zoomPictures = []),
        (this.ajaxEnabled = "true" === e.getAttribute("data-ajax-enabled")),
        (this.settings = {
          mediaQueryMediumUp: "screen and (min-width: 750px)",
          mediaQuerySmall: "screen and (max-width: 749px)",
          bpSmall: !1,
          enableHistoryState:
            "true" === e.getAttribute("data-enable-history-state"),
          namespace: ".slideshow-" + t,
          sectionId: t,
          sliderActive: !1,
          zoomEnabled: !1,
        }),
        (this.selectors = {
          addToCart: "[data-add-to-cart]",
          addToCartText: "[data-add-to-cart-text]",
          cartCount: "[data-cart-count]",
          cartCountBubble: "[data-cart-count-bubble]",
          cartPopup: "[data-cart-popup]",
          cartPopupCartQuantity: "[data-cart-popup-cart-quantity]",
          cartPopupClose: "[data-cart-popup-close]",
          cartPopupDismiss: "[data-cart-popup-dismiss]",
          cartPopupImage: "[data-cart-popup-image]",
          cartPopupImageWrapper: "[data-cart-popup-image-wrapper]",
          cartPopupImagePlaceholder: "[data-image-loading-animation]",
          cartPopupProductDetails: "[data-cart-popup-product-details]",
          cartPopupQuantity: "[data-cart-popup-quantity]",
          cartPopupQuantityLabel: "[data-cart-popup-quantity-label]",
          cartPopupTitle: "[data-cart-popup-title]",
          cartPopupWrapper: "[data-cart-popup-wrapper]",
          loader: "[data-loader]",
          loaderStatus: "[data-loader-status]",
          quantity: "[data-quantity-input]",
          SKU: ".variant-sku",
          productStatus: "[data-product-status]",
          originalSelectorId: "#ProductSelect-" + t,
          productForm: "[data-product-form]",
          errorMessage: "[data-error-message]",
          errorMessageWrapper: "[data-error-message-wrapper]",
          imageZoomWrapper: "[data-image-zoom-wrapper]",
          productMediaWrapper: "[data-product-single-media-wrapper]",
          productThumbImages: ".product-single__thumbnail--" + t,
          productThumbs: ".product-single__thumbnails-" + t,
          productThumbListItem: ".product-single__thumbnails-item",
          productThumbsWrapper: ".thumbnails-wrapper",
          saleLabel: ".product-price__sale-label-" + t,
          singleOptionSelector: ".single-option-selector-" + t,
          shopifyPaymentButton: ".shopify-payment-button",
          productMediaTypeVideo: "[data-product-media-type-video]",
          productMediaTypeModel: "[data-product-media-type-model]",
          priceContainer: "[data-price]",
          regularPrice: "[data-regular-price]",
          salePrice: "[data-sale-price]",
          unitPrice: "[data-unit-price]",
          unitPriceBaseUnit: "[data-unit-price-base-unit]",
          productPolicies: "[data-product-policies]",
          storeAvailabilityContainer: "[data-store-availability-container]",
        }),
        (this.classes = {
          cartPopupWrapperHidden: "cart-popup-wrapper--hidden",
          hidden: "hide",
          visibilityHidden: "visibility-hidden",
          inputError: "input--error",
          jsZoomEnabled: "js-zoom-enabled",
          productOnSale: "price--on-sale",
          productUnitAvailable: "price--unit-available",
          productUnavailable: "price--unavailable",
          productSoldOut: "price--sold-out",
          cartImage: "cart-popup-item__image",
          productFormErrorMessageWrapperHidden:
            "product-form__error-message-wrapper--hidden",
          activeClass: "active-thumb",
          variantSoldOut: "product-form--variant-sold-out",
        }),
        (this.eventHandlers = {}),
        (this.quantityInput = e.querySelector(this.selectors.quantity)),
        (this.errorMessageWrapper = e.querySelector(
          this.selectors.errorMessageWrapper
        )),
        (this.productForm = e.querySelector(this.selectors.productForm)),
        (this.addToCart = e.querySelector(this.selectors.addToCart)),
        (this.addToCartText = this.addToCart.querySelector(
          this.selectors.addToCartText
        )),
        (this.shopifyPaymentButton = e.querySelector(
          this.selectors.shopifyPaymentButton
        )),
        (this.priceContainer = e.querySelector(this.selectors.priceContainer)),
        (this.productPolicies = e.querySelector(
          this.selectors.productPolicies
        )),
        (this.storeAvailabilityContainer = e.querySelector(
          this.selectors.storeAvailabilityContainer
        )),
        this.storeAvailabilityContainer && this._initStoreAvailability(),
        (this.loader = this.addToCart.querySelector(this.selectors.loader)),
        (this.loaderStatus = e.querySelector(this.selectors.loaderStatus)),
        (this.imageZoomWrapper = e.querySelectorAll(
          this.selectors.imageZoomWrapper
        ));
      var i = document.getElementById("ProductJson-" + t);
      i &&
        i.innerHTML.length &&
        ((this.productSingleObject = JSON.parse(i.innerHTML)),
        (this.productState = {
          available: !0,
          soldOut: !1,
          onSale: !1,
          showUnitPrice: !1,
        }),
        (this.settings.zoomEnabled =
          this.imageZoomWrapper.length > 0 &&
          this.imageZoomWrapper[0].classList.contains(
            this.classes.jsZoomEnabled
          )),
        (this.cartRoutes = JSON.parse(
          document.querySelector("[data-cart-routes]").innerHTML
        )),
        (this.initMobileBreakpoint = this._initMobileBreakpoint.bind(this)),
        (this.initDesktopBreakpoint = this._initDesktopBreakpoint.bind(this)),
        (this.mqlSmall = window.matchMedia(this.settings.mediaQuerySmall)),
        this.mqlSmall.addListener(this.initMobileBreakpoint),
        (this.mqlMediumUp = window.matchMedia(
          this.settings.mediaQueryMediumUp
        )),
        this.mqlMediumUp.addListener(this.initDesktopBreakpoint),
        this.initMobileBreakpoint(),
        this.initDesktopBreakpoint(),
        this._stringOverrides(),
        this._initVariants(),
        this._initMediaSwitch(),
        this._initAddToCart(),
        this._setActiveThumbnail(),
        this._initProductVideo(),
        this._initModelViewerLibraries(),
        this._initShopifyXrLaunch());
    }
    return (
      (e.prototype = Object.assign({}, e.prototype, {
        _stringOverrides: function () {
          (theme.productStrings = theme.productStrings || {}),
            (theme.strings = Object.assign(
              {},
              theme.strings,
              theme.productStrings
            ));
        },
        _initStoreAvailability: function () {
          (this.storeAvailability = new theme.StoreAvailability(
            this.storeAvailabilityContainer
          )),
            this.storeAvailabilityContainer.addEventListener(
              "storeAvailabilityModalOpened",
              function (e) {
                this.cartPopupWrapper &&
                  !this.cartPopupWrapper.classList.contains(
                    this.classes.cartPopupWrapperHidden
                  ) &&
                  this._hideCartPopup(e);
              }.bind(this)
            );
        },
        _initMobileBreakpoint: function () {
          this.mqlSmall.matches
            ? (this.container.querySelectorAll(
                this.selectors.productThumbImages
              ).length > 4 && this._initThumbnailSlider(),
              this.settings.zoomEnabled &&
                this.imageZoomWrapper.forEach(
                  function (e, t) {
                    this._destroyZoom(t);
                  }.bind(this)
                ),
              (this.settings.bpSmall = !0))
            : (this.settings.sliderActive && this._destroyThumbnailSlider(),
              (this.settings.bpSmall = !1));
        },
        _initDesktopBreakpoint: function () {
          this.mqlMediumUp.matches &&
            this.settings.zoomEnabled &&
            this.imageZoomWrapper.forEach(
              function (e, t) {
                this._enableZoom(e, t);
              }.bind(this)
            );
        },
        _initVariants: function () {
          var e = {
            container: this.container,
            enableHistoryState:
              "true" ===
              this.container.getAttribute("data-enable-history-state"),
            singleOptionSelector: this.selectors.singleOptionSelector,
            originalSelectorId: this.selectors.originalSelectorId,
            product: this.productSingleObject,
          };
          (this.variants = new slate.Variants(e)),
            this.storeAvailability &&
              this.variants.currentVariant.available &&
              this.storeAvailability.updateContent(
                this.variants.currentVariant.id
              ),
            (this.eventHandlers.updateAvailability =
              this._updateAvailability.bind(this)),
            (this.eventHandlers.updateMedia = this._updateMedia.bind(this)),
            (this.eventHandlers.updatePrice = this._updatePrice.bind(this)),
            (this.eventHandlers.updateSKU = this._updateSKU.bind(this)),
            this.container.addEventListener(
              "variantChange",
              this.eventHandlers.updateAvailability
            ),
            this.container.addEventListener(
              "variantImageChange",
              this.eventHandlers.updateMedia
            ),
            this.container.addEventListener(
              "variantPriceChange",
              this.eventHandlers.updatePrice
            ),
            this.container.addEventListener(
              "variantSKUChange",
              this.eventHandlers.updateSKU
            );
        },
        _initMediaSwitch: function () {
          if (document.querySelector(this.selectors.productThumbImages)) {
            var e = this,
              t = document.querySelectorAll(this.selectors.productThumbImages);
            (this.eventHandlers.handleMediaFocus =
              this._handleMediaFocus.bind(this)),
              t.forEach(function (t) {
                t.addEventListener("click", function (i) {
                  i.preventDefault();
                  var s = t.getAttribute("data-thumbnail-id");
                  e._switchMedia(s), e._setActiveThumbnail(s);
                }),
                  t.addEventListener("keyup", e.eventHandlers.handleMediaFocus);
              });
          }
        },
        _initAddToCart: function () {
          this.productForm.addEventListener(
            "submit",
            function (e) {
              if ("true" !== this.addToCart.getAttribute("aria-disabled")) {
                if (this.ajaxEnabled) {
                  e.preventDefault(),
                    (this.previouslyFocusedElement = document.activeElement);
                  var t = !!this.quantityInput && this.quantityInput.value <= 0;
                  if (!t)
                    return !t && this.ajaxEnabled
                      ? (this._handleButtonLoadingState(!0),
                        void this._addItemToCart(this.productForm))
                      : void 0;
                  // this._showErrorMessage(theme.strings.quantityMinimumMessage);
                }
              } else e.preventDefault();
            }.bind(this)
          );
        },
        _initProductVideo: function () {
          var e = this.settings.sectionId;
          this.container
            .querySelectorAll(this.selectors.productMediaTypeVideo)
            .forEach(function (t) {
              theme.ProductVideo.init(t, e);
            });
        },
        _initModelViewerLibraries: function () {
          var e = this.container.querySelectorAll(
            this.selectors.productMediaTypeModel
          );
          e.length < 1 || theme.ProductModel.init(e, this.settings.sectionId);
        },
        _initShopifyXrLaunch: function () {
          (this.eventHandlers.initShopifyXrLaunchHandler =
            this._initShopifyXrLaunchHandler.bind(this)),
            document.addEventListener(
              "shopify_xr_launch",
              this.eventHandlers.initShopifyXrLaunchHandler
            );
        },
        _initShopifyXrLaunchHandler: function () {
          this.container
            .querySelector(
              this.selectors.productMediaWrapper +
                ":not(." +
                self.classes.hidden +
                ")"
            )
            .dispatchEvent(
              new CustomEvent("xrLaunch", { bubbles: !0, cancelable: !0 })
            );
        },
        _addItemToCart: function (e) {
          var t = this;
          fetch(this.cartRoutes.cartAddUrl + ".js", {
            method: "POST",
            credentials: "same-origin",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              "X-Requested-With": "XMLHttpRequest",
            },
            body: theme.Helpers.serialize(e),
          })
            .then(function (e) {
              return e.json();
            })
            .then(function (e) {
              if (e.status && 200 !== e.status) {
                var i = Error(e.description);
                throw ((i.isFromServer = !0), i);
              }
              t._hideErrorMessage(), t._setupCartPopup(e);
            })
            .catch(function (e) {
              t.previouslyFocusedElement.focus(),
                t._showErrorMessage(
                  e.isFromServer && e.message.length
                    ? e.message
                    : theme.strings.cartError
                ),
                t._handleButtonLoadingState(!1),
                console.log(e);
            });
        },
        _handleButtonLoadingState: function (e) {
          e
            ? (this.addToCart.setAttribute("aria-disabled", !0),
              this.addToCartText.classList.add(this.classes.hidden),
              this.loader.classList.remove(this.classes.hidden),
              this.shopifyPaymentButton &&
                this.shopifyPaymentButton.setAttribute("disabled", !0),
              this.loaderStatus.setAttribute("aria-hidden", !1))
            : (this.addToCart.removeAttribute("aria-disabled"),
              this.addToCartText.classList.remove(this.classes.hidden),
              this.loader.classList.add(this.classes.hidden),
              this.shopifyPaymentButton &&
                this.shopifyPaymentButton.removeAttribute("disabled"),
              this.loaderStatus.setAttribute("aria-hidden", !0));
        },
        _showErrorMessage: function (e) {
          (this.container.querySelector(this.selectors.errorMessage).innerHTML =
            e),
            this.quantityInput &&
              this.quantityInput.classList.add(this.classes.inputError),
            this.errorMessageWrapper.classList.remove(
              this.classes.productFormErrorMessageWrapperHidden
            ),
            this.errorMessageWrapper.setAttribute("aria-hidden", !0),
            this.errorMessageWrapper.removeAttribute("aria-hidden");
        },
        _hideErrorMessage: function () {
          this.errorMessageWrapper.classList.add(
            this.classes.productFormErrorMessageWrapperHidden
          ),
            this.quantityInput &&
              this.quantityInput.classList.remove(this.classes.inputError);
        },
        _setupCartPopup: function (e) {
          (this.cartPopup =
            this.cartPopup || document.querySelector(this.selectors.cartPopup)),
            (this.cartPopupWrapper =
              this.cartPopupWrapper ||
              document.querySelector(this.selectors.cartPopupWrapper)),
            (this.cartPopupTitle =
              this.cartPopupTitle ||
              document.querySelector(this.selectors.cartPopupTitle)),
            (this.cartPopupQuantity =
              this.cartPopupQuantity ||
              document.querySelector(this.selectors.cartPopupQuantity)),
            (this.cartPopupQuantityLabel =
              this.cartPopupQuantityLabel ||
              document.querySelector(this.selectors.cartPopupQuantityLabel)),
            (this.cartPopupClose =
              this.cartPopupClose ||
              document.querySelector(this.selectors.cartPopupClose)),
            (this.cartPopupDismiss =
              this.cartPopupDismiss ||
              document.querySelector(this.selectors.cartPopupDismiss)),
            (this.cartPopupImagePlaceholder =
              this.cartPopupImagePlaceholder ||
              document.querySelector(this.selectors.cartPopupImagePlaceholder)),
            this._setupCartPopupEventListeners(),
            this._updateCartPopupContent(e);
        },
        _updateCartPopupContent: function (e) {
          var t = this,
            i = this.quantityInput ? this.quantityInput.value : 1,
            s = e.selling_plan_allocation
              ? e.selling_plan_allocation.selling_plan.name
              : null;
          (this.cartPopupTitle.textContent = e.product_title),
            (this.cartPopupQuantity.textContent = i),
            (this.cartPopupQuantityLabel.textContent =
              theme.strings.quantityLabel.replace("[count]", i)),
            this._setCartPopupPlaceholder(e.featured_image.url),
            this._setCartPopupImage(e.featured_image.url, e.featured_image.alt),
            this._setCartPopupProductDetails(
              e.product_has_only_default_variant,
              e.options_with_values,
              e.properties,
              s
            ),
            fetch(this.cartRoutes.cartUrl + ".js", {
              credentials: "same-origin",
            })
              .then(function (e) {
                return e.json();
              })
              .then(function (e) {
                t._setCartQuantity(e.item_count),
                  t._setCartCountBubble(e.item_count),
                  t._showCartPopup();
              })
              .catch(function (e) {
                console.log(e);
              });
        },
        _setupCartPopupEventListeners: function () {
          (this.eventHandlers.cartPopupWrapperKeyupHandler =
            this._cartPopupWrapperKeyupHandler.bind(this)),
            (this.eventHandlers.hideCartPopup = this._hideCartPopup.bind(this)),
            (this.eventHandlers.onBodyClick = this._onBodyClick.bind(this)),
            this.cartPopupWrapper.addEventListener(
              "keyup",
              this.eventHandlers.cartPopupWrapperKeyupHandler
            ),
            this.cartPopupClose.addEventListener(
              "click",
              this.eventHandlers.hideCartPopup
            ),
            this.cartPopupDismiss.addEventListener(
              "click",
              this.eventHandlers.hideCartPopup
            ),
            document.body.addEventListener(
              "click",
              this.eventHandlers.onBodyClick
            );
        },
        _cartPopupWrapperKeyupHandler: function (e) {
          e.keyCode === slate.utils.keyboardKeys.ESCAPE &&
            this._hideCartPopup(e);
        },
        _setCartPopupPlaceholder: function (e) {
          (this.cartPopupImageWrapper =
            this.cartPopupImageWrapper ||
            document.querySelector(this.selectors.cartPopupImageWrapper)),
            null !== e ||
              this.cartPopupImageWrapper.classList.add(this.classes.hidden);
        },
        _setCartPopupImage: function (e, t) {
          if (null !== e) {
            this.cartPopupImageWrapper.classList.remove(this.classes.hidden);
            var i = theme.Images.getSizedImageUrl(e, "200x"),
              s = document.createElement("img");
            (s.src = i),
              (s.alt = t),
              s.classList.add(this.classes.cartImage),
              s.setAttribute("data-cart-popup-image", ""),
              (s.onload = function () {
                this.cartPopupImagePlaceholder.removeAttribute(
                  "data-image-loading-animation"
                ),
                  this.cartPopupImageWrapper.append(s);
              }.bind(this));
          }
        },
        _setCartPopupProductDetails: function (e, t, i, s) {
          this.cartPopupProductDetails =
            this.cartPopupProductDetails ||
            document.querySelector(this.selectors.cartPopupProductDetails);
          var n = "";
          e || (n += this._getVariantOptionList(t)),
            s && (n += this._getSellingPlanHTML(s)),
            null !== i &&
              0 !== Object.keys(i).length &&
              (n += this._getPropertyList(i)),
            0 === n.length
              ? ((this.cartPopupProductDetails.innerHTML = ""),
                this.cartPopupProductDetails.setAttribute("hidden", ""))
              : ((this.cartPopupProductDetails.innerHTML = n),
                this.cartPopupProductDetails.removeAttribute("hidden"));
        },
        _getVariantOptionList: function (e) {
          var t = "";
          return (
            e.forEach(function (e) {
              t =
                t +
                '<li class="product-details__item product-details__item--variant-option">' +
                e.name +
                ": " +
                e.value +
                "</li>";
            }),
            t
          );
        },
        _getPropertyList: function (e) {
          var t = "";
          return (
            Object.entries(e).forEach(function (e) {
              "_" !== e[0].charAt(0) &&
                0 !== e[1].length &&
                (t =
                  t +
                  '<li class="product-details__item product-details__item--property"><span class="product-details__property-label">' +
                  e[0] +
                  ": </span>" +
                  e[1]);
            }),
            t
          );
        },
        _getSellingPlanHTML: function (e) {
          return (
            '<li class="product-details__item product-details__item--property">' +
            e +
            "</li>"
          );
        },
        _setCartQuantity: function (e) {
          var t;
          (this.cartPopupCartQuantity =
            this.cartPopupCartQuantity ||
            document.querySelector(this.selectors.cartPopupCartQuantity)),
            1 === e
              ? (t = theme.strings.oneCartCount)
              : e > 1 &&
                (t = theme.strings.otherCartCount.replace("[count]", e)),
            (this.cartPopupCartQuantity.textContent = e),
            this.cartPopupCartQuantity.setAttribute("aria-label", t);
        },
        _setCartCountBubble: function (e) {
          (this.cartCountBubble =
            this.cartCountBubble ||
            document.querySelector(this.selectors.cartCountBubble)),
            (this.cartCount =
              this.cartCount ||
              document.querySelector(this.selectors.cartCount)),
            this.cartCountBubble.classList.remove(this.classes.hidden),
            (this.cartCount.textContent = e);
        },
        _showCartPopup: function () {
          theme.Helpers.prepareTransition(this.cartPopupWrapper),
            this.cartPopupWrapper.classList.remove(
              this.classes.cartPopupWrapperHidden
            ),
            this._handleButtonLoadingState(!1),
            slate.a11y.trapFocus({
              container: this.cartPopupWrapper,
              elementToFocus: this.cartPopup,
              namespace: "cartPopupFocus",
            }),
            document.body.classList.add("product-incart");
        },
        _hideCartPopup: function (e) {
          var t = 0 === e.detail;
          theme.Helpers.prepareTransition(this.cartPopupWrapper),
            this.cartPopupWrapper.classList.add(
              this.classes.cartPopupWrapperHidden
            );
          var i = document.querySelector(this.selectors.cartPopupImage);
          i && i.remove(),
            this.cartPopupImagePlaceholder.setAttribute(
              "data-image-loading-animation",
              ""
            ),
            slate.a11y.removeTrapFocus({
              container: this.cartPopupWrapper,
              namespace: "cartPopupFocus",
            }),
            t && this.previouslyFocusedElement.focus(),
            this.cartPopupWrapper.removeEventListener(
              "keyup",
              this.eventHandlers.cartPopupWrapperKeyupHandler
            ),
            this.cartPopupClose.removeEventListener(
              "click",
              this.eventHandlers.hideCartPopup
            ),
            this.cartPopupDismiss.removeEventListener(
              "click",
              this.eventHandlers.hideCartPopup
            ),
            document.body.removeEventListener(
              "click",
              this.eventHandlers.onBodyClick
            );
        },
        _onBodyClick: function (e) {
          var t = e.target;
          t === this.cartPopupWrapper ||
            t.closest(this.selectors.cartPopup) ||
            this._hideCartPopup(e);
        },
        _setActiveThumbnail: function (e) {
          if (void 0 === e) {
            var t,
              i = this.container.querySelector(
                this.selectors.productMediaWrapper + ":not(.hide)"
              );
            if (!i) return;
            e = i.getAttribute("data-media-id");
          }
          this.container
            .querySelectorAll(
              this.selectors.productThumbListItem + ":not(.slick-cloned)"
            )
            .forEach(
              function (i) {
                var s = i.querySelector(
                  this.selectors.productThumbImages +
                    "[data-thumbnail-id='" +
                    e +
                    "']"
                );
                s && (t = s);
              }.bind(this)
            ),
            document
              .querySelectorAll(this.selectors.productThumbImages)
              .forEach(
                function (e) {
                  e.classList.remove(this.classes.activeClass),
                    e.removeAttribute("aria-current");
                }.bind(this)
              ),
            t &&
              (t.classList.add(this.classes.activeClass),
              t.setAttribute("aria-current", !0),
              this._adjustThumbnailSlider(t));
        },
        _adjustThumbnailSlider: function (e) {
          var t = e.closest("[data-slider-item]");
          if (t) {
            var i =
              3 *
              Math.floor(Number(t.getAttribute("data-slider-slide-index")) / 3);
            window.setTimeout(
              function () {
                this.slideshow && this.slideshow.goToSlideByIndex(i);
              }.bind(this),
              251
            );
          }
        },
        _switchMedia: function (e) {
          var t = this.container.querySelector(
              this.selectors.productMediaWrapper +
                ":not(." +
                this.classes.hidden +
                ")"
            ),
            i = this.container.querySelector(
              this.selectors.productMediaWrapper + "[data-media-id='" + e + "']"
            ),
            s = this.container.querySelectorAll(
              this.selectors.productMediaWrapper +
                ":not([data-media-id='" +
                e +
                "'])"
            );
          t.dispatchEvent(
            new CustomEvent("mediaHidden", { bubbles: !0, cancelable: !0 })
          ),
            i.classList.remove(this.classes.hidden),
            i.dispatchEvent(
              new CustomEvent("mediaVisible", { bubbles: !0, cancelable: !0 })
            ),
            s.forEach(
              function (e) {
                e.classList.add(this.classes.hidden);
              }.bind(this)
            );
        },
        _handleMediaFocus: function (e) {
          if (e.keyCode === slate.utils.keyboardKeys.ENTER) {
            var t = e.currentTarget.getAttribute("data-thumbnail-id");
            this.container
              .querySelector(
                this.selectors.productMediaWrapper +
                  "[data-media-id='" +
                  t +
                  "']"
              )
              .focus();
          }
        },
        _initThumbnailSlider: function () {
          setTimeout(
            function () {
              (this.slideshow = new theme.Slideshow(
                this.container.querySelector("[data-thumbnail-slider]"),
                {
                  canUseTouchEvents: !0,
                  type: "slide",
                  slideActiveClass: "slick-active",
                  slidesToShow: 3,
                  slidesToScroll: 3,
                }
              )),
                (this.settings.sliderActive = !0);
            }.bind(this),
            250
          );
        },
        _destroyThumbnailSlider: function () {
          var e = this.container.querySelectorAll("[data-slider-button]"),
            t = this.container.querySelector("[data-slider-track]"),
            i = t.querySelectorAll("[data-slider-item");
          (this.settings.sliderActive = !1),
            t &&
              (t.removeAttribute("style"),
              i.forEach(function (e) {
                var t = e.querySelector("[data-slider-item-link]");
                e.classList.remove("slick-active"),
                  e.removeAttribute("style"),
                  e.removeAttribute("tabindex"),
                  e.removeAttribute("aria-hidden"),
                  t.removeAttribute("tabindex");
              })),
            e.forEach(function (e) {
              e.removeAttribute("aria-disabled");
            }),
            this.slideshow.destroy(),
            (this.slideshow = null);
        },
        _liveRegionText: function (e) {
          var t = "[Availability] [Regular] [$$] [Sale] [$]. [UnitPrice] [$$$]";
          if (!this.productState.available) return theme.strings.unavailable;
          var i = this.productState.soldOut ? theme.strings.soldOut + "," : "";
          t = t.replace("[Availability]", i);
          var s = "",
            n = theme.Currency.formatMoney(e.price, theme.moneyFormat),
            r = "",
            a = "",
            o = "",
            c = "";
          return (
            this.productState.onSale &&
              ((s = theme.strings.regularPrice),
              (n =
                theme.Currency.formatMoney(
                  e.compare_at_price,
                  theme.moneyFormat
                ) + ","),
              (r = theme.strings.sale),
              (a = theme.Currency.formatMoney(e.price, theme.moneyFormat))),
            this.productState.showUnitPrice &&
              ((o = theme.strings.unitPrice),
              (c =
                theme.Currency.formatMoney(e.unit_price, theme.moneyFormat) +
                " " +
                theme.strings.unitPriceSeparator +
                " " +
                this._getBaseUnit(e))),
            (t = t
              .replace("[Regular]", s)
              .replace("[$$]", n)
              .replace("[Sale]", r)
              .replace("[$]", a)
              .replace("[UnitPrice]", o)
              .replace("[$$$]", c)
              .trim())
          );
        },
        _updateLiveRegion: function (e) {
          var t = e.detail.variant,
            i = this.container.querySelector(this.selectors.productStatus);
          (i.innerHTML = this._liveRegionText(t)),
            i.setAttribute("aria-hidden", !1),
            setTimeout(function () {
              i.setAttribute("aria-hidden", !0);
            }, 1e3);
        },
        _enableAddToCart: function (e) {
          this.addToCart.removeAttribute("aria-disabled"),
            this.addToCart.setAttribute("aria-label", e),
            (this.addToCartText.innerHTML = e),
            this.productForm.classList.remove(this.classes.variantSoldOut);
        },
        _disableAddToCart: function (e) {
          (e = e || theme.strings.unavailable),
            this.addToCart.setAttribute("aria-disabled", !0),
            this.addToCart.setAttribute("aria-label", e),
            (this.addToCartText.innerHTML = e),
            this.productForm.classList.add(this.classes.variantSoldOut);
        },
        _updateAddToCart: function () {
          this.productState.available
            ? this.productState.soldOut
              ? this._disableAddToCart(theme.strings.soldOut)
              : this._enableAddToCart(theme.strings.addToCart)
            : this._disableAddToCart(theme.strings.unavailable);
        },
        _setProductState: function (e) {
          var t = e.detail.variant;
          t
            ? ((this.productState.available = !0),
              (this.productState.soldOut = !t.available),
              (this.productState.onSale = t.compare_at_price > t.price),
              (this.productState.showUnitPrice = !!t.unit_price))
            : (this.productState.available = !1);
        },
        _updateAvailability: function (e) {
          this._hideErrorMessage(),
            this._setProductState(e),
            this._updateStoreAvailabilityContent(e),
            this._updateAddToCart(),
            this._updateLiveRegion(e),
            this._updatePriceComponentStyles(e);
        },
        _updateStoreAvailabilityContent: function (e) {
          this.storeAvailability &&
            (this.productState.available && !this.productState.soldOut
              ? this.storeAvailability.updateContent(e.detail.variant.id)
              : this.storeAvailability.clearContent());
        },
        _updateMedia: function (e) {
          var t = e.detail.variant.featured_media.id,
            i = this.settings.sectionId + "-" + t;
          this._switchMedia(i), this._setActiveThumbnail(i);
        },
        _hidePriceComponent: function () {
          this.priceContainer.classList.add(this.classes.productUnavailable),
            this.priceContainer.setAttribute("aria-hidden", !0),
            this.productPolicies &&
              this.productPolicies.classList.add(this.classes.visibilityHidden);
        },
        _updatePriceComponentStyles: function (e) {
          var t = e.detail.variant,
            i = this.priceContainer.querySelector(
              this.selectors.unitPriceBaseUnit
            );
          this.productState.available
            ? (this.productState.soldOut
                ? this.priceContainer.classList.add(this.classes.productSoldOut)
                : this.priceContainer.classList.remove(
                    this.classes.productSoldOut
                  ),
              this.productState.showUnitPrice
                ? ((i.innerHTML = this._getBaseUnit(t)),
                  this.priceContainer.classList.add(
                    this.classes.productUnitAvailable
                  ))
                : this.priceContainer.classList.remove(
                    this.classes.productUnitAvailable
                  ),
              this.productState.onSale
                ? this.priceContainer.classList.add(this.classes.productOnSale)
                : this.priceContainer.classList.remove(
                    this.classes.productOnSale
                  ),
              this.priceContainer.classList.remove(
                this.classes.productUnavailable
              ),
              this.priceContainer.removeAttribute("aria-hidden"),
              this.productPolicies &&
                this.productPolicies.classList.remove(
                  this.classes.visibilityHidden
                ))
            : this._hidePriceComponent();
        },
        _updatePrice: function (e) {
          var t = e.detail.variant,
            i = this.priceContainer.querySelectorAll(
              this.selectors.regularPrice
            ),
            s = this.priceContainer.querySelector(this.selectors.salePrice),
            n = this.priceContainer.querySelector(this.selectors.unitPrice),
            r = function (e, t) {
              e.innerHTML = theme.Currency.formatMoney(t, theme.moneyFormat);
            };
          this.productState.onSale
            ? (i.forEach(function (e) {
                r(e, t.compare_at_price);
              }),
              (s.innerHTML = theme.Currency.formatMoney(
                t.price,
                theme.moneyFormat
              )))
            : i.forEach(function (e) {
                r(e, t.price);
              }),
            this.productState.showUnitPrice &&
              (n.innerHTML = theme.Currency.formatMoney(
                t.unit_price,
                theme.moneyFormat
              ));
        },
        _getBaseUnit: function (e) {
          return 1 === e.unit_price_measurement.reference_value
            ? e.unit_price_measurement.reference_unit
            : e.unit_price_measurement.reference_value +
                e.unit_price_measurement.reference_unit;
        },
        _updateSKU: function (e) {
          var t = e.detail.variant,
            i = document.querySelector(this.selectors.SKU);
          i && (i.innerHTML = t.sku);
        },
        _enableZoom: function (e, t) {
          this.zoomPictures[t] = new theme.Zoom(e);
        },
        _destroyZoom: function (e) {
          0 !== this.zoomPictures.length && this.zoomPictures[e].unload();
        },
        onUnload: function () {
          this.container.removeEventListener(
            "variantChange",
            this.eventHandlers.updateAvailability
          ),
            this.container.removeEventListener(
              "variantImageChange",
              this.eventHandlers.updateMedia
            ),
            this.container.removeEventListener(
              "variantPriceChange",
              this.eventHandlers.updatePrice
            ),
            this.container.removeEventListener(
              "variantSKUChange",
              this.eventHandlers.updateSKU
            ),
            theme.ProductVideo.removeSectionVideos(this.settings.sectionId),
            theme.ProductModel.removeSectionModels(this.settings.sectionId),
            this.mqlSmall &&
              this.mqlSmall.removeListener(this.initMobileBreakpoint),
            this.mqlMediumUp &&
              this.mqlMediumUp.removeListener(this.initDesktopBreakpoint);
        },
      })),
      e
    );
  })()),
  (theme.ProductRecommendations = function (e) {
    var t =
      e.dataset.baseUrl +
      "?section_id=product-recommendations&product_id=" +
      e.dataset.productId +
      "&limit=4";
    window.performance.mark(
      "debut:product:fetch_product_recommendations.start"
    ),
      fetch(t)
        .then(function (e) {
          return e.text();
        })
        .then(function (t) {
          "" !== t.trim() &&
            ((e.innerHTML = t),
            (e.innerHTML = e.firstElementChild.innerHTML),
            window.performance.mark(
              "debut:product:fetch_product_recommendations.end"
            ),
            performance.measure(
              "debut:product:fetch_product_recommendations",
              "debut:product:fetch_product_recommendations.start",
              "debut:product:fetch_product_recommendations.end"
            ));
        });
  }),
  (theme.Quotes = (function () {
    var e = {
        mediaQuerySmall: "screen and (max-width: 749px)",
        mediaQueryMediumUp: "screen and (min-width: 750px)",
        slideCount: 0,
      },
      t = { canUseKeyboardArrows: !1, type: "slide", slidesToShow: 3 };
    function i(i) {
      this.container = i;
      var s = i.getAttribute("data-section-id");
      (this.slider = document.getElementById("Quotes-" + s)),
        (this.sliderActive = !1),
        (this.mobileOptions = Object.assign({}, t, {
          canUseTouchEvents: !0,
          slidesToShow: 1,
        })),
        (this.desktopOptions = Object.assign({}, t, {
          slidesToShow: Math.min(
            t.slidesToShow,
            this.slider.getAttribute("data-count")
          ),
        })),
        (this.initMobileSlider = this._initMobileSlider.bind(this)),
        (this.initDesktopSlider = this._initDesktopSlider.bind(this)),
        (this.mqlSmall = window.matchMedia(e.mediaQuerySmall)),
        this.mqlSmall.addListener(this.initMobileSlider),
        (this.mqlMediumUp = window.matchMedia(e.mediaQueryMediumUp)),
        this.mqlMediumUp.addListener(this.initDesktopSlider),
        this.initMobileSlider(),
        this.initDesktopSlider();
    }
    return (
      (i.prototype = Object.assign({}, i.prototype, {
        onUnload: function () {
          this.mqlSmall.removeListener(this.initMobileSlider),
            this.mqlMediumUp.removeListener(this.initDesktopSlider),
            this.slideshow.destroy();
        },
        onBlockSelect: function (e) {
          var t = Number(
            document
              .querySelector(".quotes-slide--" + e.detail.blockId)
              .getAttribute("data-slider-slide-index")
          );
          this.mqlMediumUp.matches &&
            (t = Math.max(0, Math.min(t, this.slideshow.slides.length - 3))),
            this.slideshow.goToSlideByIndex(t);
        },
        _initMobileSlider: function () {
          this.mqlSmall.matches && this._initSlider(this.mobileOptions);
        },
        _initDesktopSlider: function () {
          this.mqlMediumUp.matches && this._initSlider(this.desktopOptions);
        },
        _initSlider: function (e) {
          this.sliderActive &&
            (this.slideshow.destroy(), (this.sliderActive = !1)),
            (this.slideshow = new theme.Slideshow(this.container, e)),
            (this.sliderActive = !0);
        },
      })),
      i
    );
  })()),
  (theme.SlideshowSection = (function () {
    var e = { sliderMobileContentIndex: "[data-slider-mobile-content-index]" };
    return function (t) {
      var i = t.dataset.sectionId;
      (this.container = t),
        (this.eventHandlers = {}),
        (this.slideshowDom = t.querySelector("#Slideshow-" + i)),
        (this.sliderMobileContentIndex = t.querySelectorAll(
          e.sliderMobileContentIndex
        )),
        (this.slideshow = new theme.Slideshow(t, {
          autoplay:
            "true" === this.slideshowDom.getAttribute("data-autorotate"),
          slideInterval: this.slideshowDom.getAttribute("data-speed"),
        })),
        this._setupEventListeners();
    };
  })()),
  (theme.SlideshowSection.prototype = Object.assign(
    {},
    theme.SlideshowSection.prototype,
    {
      _setupEventListeners: function () {
        (this.eventHandlers.onSliderSlideChanged = function (e) {
          this._onSliderSlideChanged(e.detail);
        }.bind(this)),
          this.container.addEventListener(
            "slider_slide_changed",
            this.eventHandlers.onSliderSlideChanged
          );
      },
      _onSliderSlideChanged: function (e) {
        var t = "slideshow__text-content--mobile-active";
        this.sliderMobileContentIndex.forEach(function (i) {
          Number(i.getAttribute("data-slider-mobile-content-index")) === e
            ? i.classList.add(t)
            : i.classList.remove(t);
        });
      },
      onUnload: function () {
        this.slideshow.destroy();
      },
      onBlockSelect: function (e) {
        this.slideshow.adaptHeight && this.slideshow.setSlideshowHeight();
        var t = this.container
          .querySelector(".slideshow__slide--" + e.detail.blockId)
          .getAttribute("data-slider-slide-index");
        this.slideshow.setSlide(t), this.slideshow.stopAutoplay();
      },
      onBlockDeselect: function () {
        this.slideshow.startAutoplay();
      },
    }
  )),
  (window.theme = window.theme || {}),
  (theme.StoreAvailability = (function () {
    var e = "[data-store-availability-modal-open]";
    function t(e) {
      (this.container = e),
        (this.productTitle = this.container.dataset.productTitle),
        (this.hasOnlyDefaultVariant =
          "true" === this.container.dataset.hasOnlyDefaultVariant);
    }
    return (
      (t.prototype = Object.assign({}, t.prototype, {
        updateContent: function (t) {
          var i =
              this.container.dataset.baseUrl +
              "/variants/" +
              t +
              "/?section_id=store-availability",
            s = this,
            n = s.container.querySelector(e);
          (this.container.style.opacity = 0.5),
            n && ((n.disabled = !0), n.setAttribute("aria-busy", !0)),
            fetch(i)
              .then(function (e) {
                return e.text();
              })
              .then(function (t) {
                "" !== t.trim() &&
                  ((s.container.innerHTML = t),
                  (s.container.innerHTML =
                    s.container.firstElementChild.innerHTML),
                  (s.container.style.opacity = 1),
                  (n = s.container.querySelector(e)) &&
                    (n.addEventListener("click", s._onClickModalOpen.bind(s)),
                    (s.modal = s._initModal()),
                    s._updateProductTitle(),
                    s.hasOnlyDefaultVariant && s._hideVariantTitle()));
              });
        },
        clearContent: function () {
          this.container.innerHTML = "";
        },
        _onClickModalOpen: function () {
          this.container.dispatchEvent(
            new CustomEvent("storeAvailabilityModalOpened", {
              bubbles: !0,
              cancelable: !0,
            })
          );
        },
        _initModal: function () {
          return new window.Modals(
            "StoreAvailabilityModal",
            "store-availability-modal",
            {
              close: ".js-modal-close-store-availability-modal",
              closeModalOnClick: !0,
              openClass: "store-availabilities-modal--active",
            }
          );
        },
        _updateProductTitle: function () {
          this.container.querySelector(
            "[data-store-availability-modal-product-title]"
          ).textContent = this.productTitle;
        },
        _hideVariantTitle: function () {
          this.container
            .querySelector("[data-store-availability-modal-variant-title]")
            .classList.add("hide");
        },
      })),
      t
    );
  })()),
  (theme.VideoSection = function (e) {
    e.querySelectorAll(".video").forEach(function (e) {
      theme.Video.init(e), theme.Video.editorLoadVideo(e.id);
    });
  }),
  (theme.VideoSection.prototype = Object.assign(
    {},
    theme.VideoSection.prototype,
    {
      onUnload: function () {
        theme.Video.removeEvents();
      },
    }
  )),
  (theme.heros = {}),
  (theme.HeroSection = function (e) {
    var t = e.getAttribute("data-section-id"),
      i = "#Hero-" + t;
    theme.heros[i] = new theme.Hero(i, t);
  }),
  (window.theme = window.theme || {});
var selectors = {
  disclosureLocale: "[data-disclosure-locale]",
  disclosureCurrency: "[data-disclosure-currency]",
};
function onYouTubeIframeAPIReady() {
  theme.Video.loadVideos();
}
function removeImageLoadingAnimation(e) {
  var t = e.hasAttribute("data-image-loading-animation")
    ? e
    : e.closest("[data-image-loading-animation]");
  t && t.removeAttribute("data-image-loading-animation");
}
(theme.FooterSection = (function () {
  function e(e) {
    (this.container = e),
      (this.cache = {}),
      this.cacheSelectors(),
      this.cache.localeDisclosure &&
        (this.localeDisclosure = new theme.Disclosure(
          this.cache.localeDisclosure
        )),
      this.cache.currencyDisclosure &&
        (this.currencyDisclosure = new theme.Disclosure(
          this.cache.currencyDisclosure
        ));
  }
  return (
    (e.prototype = Object.assign({}, e.prototype, {
      cacheSelectors: function () {
        this.cache = {
          localeDisclosure: this.container.querySelector(
            selectors.disclosureLocale
          ),
          currencyDisclosure: this.container.querySelector(
            selectors.disclosureCurrency
          ),
        };
      },
      onUnload: function () {
        this.cache.localeDisclosure && this.localeDisclosure.destroy(),
          this.cache.currencyDisclosure && this.currencyDisclosure.destroy();
      },
    })),
    e
  );
})()),
  document.addEventListener("DOMContentLoaded", function () {
    var e = new theme.Sections();
    e.register("cart-template", theme.Cart),
      e.register("product", theme.Product),
      e.register("collection-template", theme.Filters),
      e.register("product-template", theme.Product),
      e.register("header-section", theme.HeaderSection),
      e.register("map", theme.Maps),
      e.register("slideshow-section", theme.SlideshowSection),
      e.register("store-availability", theme.StoreAvailability),
      e.register("video-section", theme.VideoSection),
      e.register("quotes", theme.Quotes),
      e.register("hero-section", theme.HeroSection),
      e.register("product-recommendations", theme.ProductRecommendations),
      e.register("footer-section", theme.FooterSection),
      theme.customerTemplates.init(),
      slate.rte.wrapTable({
        tables: document.querySelectorAll(
          ".rte table,.custom__item-inner--html table"
        ),
        tableWrapperClass: "scrollable-wrapper",
      }),
      slate.rte.wrapIframe({
        iframes: document.querySelectorAll(
          '.rte iframe[src*="youtube.com/embed"],.rte iframe[src*="player.vimeo"],.custom__item-inner--html iframe[src*="youtube.com/embed"],.custom__item-inner--html iframe[src*="player.vimeo"]'
        ),
        iframeWrapperClass: "video-wrapper",
      }),
      slate.a11y.pageLinkFocus(
        document.getElementById(window.location.hash.substr(1))
      );
    var t = document.querySelector(".in-page-link");
    t &&
      t.addEventListener("click", function (e) {
        slate.a11y.pageLinkFocus(
          document.getElementById(e.currentTarget.hash.substr(1))
        );
      }),
      document.querySelectorAll('a[href="#"]').forEach(function (e) {
        e.addEventListener("click", function (e) {
          e.preventDefault();
        });
      }),
      slate.a11y.accessibleLinks({
        messages: {
          newWindow: theme.strings.newWindow,
          external: theme.strings.external,
          newWindowExternal: theme.strings.newWindowExternal,
        },
        links: document.querySelectorAll(
          "a[href]:not([aria-describedby]), .product-single__thumbnail"
        ),
      }),
      theme.FormStatus.init(),
      document.addEventListener("lazyloaded", function (e) {
        var t = e.target;
        if (
          (removeImageLoadingAnimation(t),
          document.body.classList.contains("template-index"))
        ) {
          var i = document.getElementById("MainContent");
          if (i && i.children && i.children.length) {
            if (
              !document.getElementsByClassName("index-section")[0].contains(t)
            )
              return;
            window.performance.mark("debut:index:first_image_visible");
          }
        }
        if (t.hasAttribute("data-bgset")) {
          var s = t.querySelector(".lazyloaded");
          if (s) {
            var n = t.getAttribute("data-alt"),
              r = s.hasAttribute("data-src")
                ? s.getAttribute("data-src")
                : t.getAttribute("data-bg");
            t.setAttribute("alt", n || ""), t.setAttribute("src", r || "");
          }
        }
        t.hasAttribute("data-image");
      }),
      document.querySelectorAll(".lazyloaded").forEach(function (e) {
        removeImageLoadingAnimation(e);
      }),
      document.addEventListener(
        "touchstart",
        function () {
          theme.Helpers.setTouch();
        },
        { once: !0 }
      ),
      document.fonts &&
        document.fonts.ready.then(function () {
          window.performance.mark("debut:fonts_loaded");
        });
  });

if (window.location.href.indexOf("reset_password") > -1) {
  document.querySelector("#RecoverPasswordForm").classList.remove("hide");
  document.querySelector("#CustomerLoginForm").classList.add("hide");
}
