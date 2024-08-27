var Yp = Object.defineProperty,
  Qp = Object.defineProperties;
var Jp = Object.getOwnPropertyDescriptors;
var jc = Object.getOwnPropertySymbols;
var Xp = Object.prototype.hasOwnProperty,
  eg = Object.prototype.propertyIsEnumerable;
var zc = (e, t, r) =>
    t in e
      ? Yp(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r })
      : (e[t] = r),
  C = (e, t) => {
    for (var r in (t ||= {})) Xp.call(t, r) && zc(e, r, t[r]);
    if (jc) for (var r of jc(t)) eg.call(t, r) && zc(e, r, t[r]);
    return e;
  },
  K = (e, t) => Qp(e, Jp(t));
var Uc = null;
var ms = 1,
  vs = Symbol("SIGNAL");
function U(e) {
  let t = Uc;
  return (Uc = e), t;
}
var Bc = {
  version: 0,
  lastCleanEpoch: 0,
  dirty: !1,
  producerNode: void 0,
  producerLastReadVersion: void 0,
  producerIndexOfThis: void 0,
  nextProducerIndex: 0,
  liveConsumerNode: void 0,
  liveConsumerIndexOfThis: void 0,
  consumerAllowSignalWrites: !1,
  consumerIsAlwaysLive: !1,
  producerMustRecompute: () => !1,
  producerRecomputeValue: () => {},
  consumerMarkedDirty: () => {},
  consumerOnSignalRead: () => {},
};
function tg(e) {
  if (!(Cs(e) && !e.dirty) && !(!e.dirty && e.lastCleanEpoch === ms)) {
    if (!e.producerMustRecompute(e) && !ys(e)) {
      (e.dirty = !1), (e.lastCleanEpoch = ms);
      return;
    }
    e.producerRecomputeValue(e), (e.dirty = !1), (e.lastCleanEpoch = ms);
  }
}
function $c(e) {
  return e && (e.nextProducerIndex = 0), U(e);
}
function Hc(e, t) {
  if (
    (U(t),
    !(
      !e ||
      e.producerNode === void 0 ||
      e.producerIndexOfThis === void 0 ||
      e.producerLastReadVersion === void 0
    ))
  ) {
    if (Cs(e))
      for (let r = e.nextProducerIndex; r < e.producerNode.length; r++)
        ws(e.producerNode[r], e.producerIndexOfThis[r]);
    for (; e.producerNode.length > e.nextProducerIndex; )
      e.producerNode.pop(),
        e.producerLastReadVersion.pop(),
        e.producerIndexOfThis.pop();
  }
}
function ys(e) {
  li(e);
  for (let t = 0; t < e.producerNode.length; t++) {
    let r = e.producerNode[t],
      n = e.producerLastReadVersion[t];
    if (n !== r.version || (tg(r), n !== r.version)) return !0;
  }
  return !1;
}
function Gc(e) {
  if ((li(e), Cs(e)))
    for (let t = 0; t < e.producerNode.length; t++)
      ws(e.producerNode[t], e.producerIndexOfThis[t]);
  (e.producerNode.length =
    e.producerLastReadVersion.length =
    e.producerIndexOfThis.length =
      0),
    e.liveConsumerNode &&
      (e.liveConsumerNode.length = e.liveConsumerIndexOfThis.length = 0);
}
function ws(e, t) {
  if ((ng(e), li(e), e.liveConsumerNode.length === 1))
    for (let n = 0; n < e.producerNode.length; n++)
      ws(e.producerNode[n], e.producerIndexOfThis[n]);
  let r = e.liveConsumerNode.length - 1;
  if (
    ((e.liveConsumerNode[t] = e.liveConsumerNode[r]),
    (e.liveConsumerIndexOfThis[t] = e.liveConsumerIndexOfThis[r]),
    e.liveConsumerNode.length--,
    e.liveConsumerIndexOfThis.length--,
    t < e.liveConsumerNode.length)
  ) {
    let n = e.liveConsumerIndexOfThis[t],
      i = e.liveConsumerNode[t];
    li(i), (i.producerIndexOfThis[n] = t);
  }
}
function Cs(e) {
  return e.consumerIsAlwaysLive || (e?.liveConsumerNode?.length ?? 0) > 0;
}
function li(e) {
  (e.producerNode ??= []),
    (e.producerIndexOfThis ??= []),
    (e.producerLastReadVersion ??= []);
}
function ng(e) {
  (e.liveConsumerNode ??= []), (e.liveConsumerIndexOfThis ??= []);
}
function rg() {
  throw new Error();
}
var ig = rg;
function Wc(e) {
  ig = e;
}
function T(e) {
  return typeof e == "function";
}
function gn(e) {
  let r = e((n) => {
    Error.call(n), (n.stack = new Error().stack);
  });
  return (
    (r.prototype = Object.create(Error.prototype)),
    (r.prototype.constructor = r),
    r
  );
}
var ci = gn(
  (e) =>
    function (r) {
      e(this),
        (this.message = r
          ? `${r.length} errors occurred during unsubscription:
${r.map((n, i) => `${i + 1}) ${n.toString()}`).join(`
  `)}`
          : ""),
        (this.name = "UnsubscriptionError"),
        (this.errors = r);
    }
);
function ur(e, t) {
  if (e) {
    let r = e.indexOf(t);
    0 <= r && e.splice(r, 1);
  }
}
var ae = class e {
  constructor(t) {
    (this.initialTeardown = t),
      (this.closed = !1),
      (this._parentage = null),
      (this._finalizers = null);
  }
  unsubscribe() {
    let t;
    if (!this.closed) {
      this.closed = !0;
      let { _parentage: r } = this;
      if (r)
        if (((this._parentage = null), Array.isArray(r)))
          for (let o of r) o.remove(this);
        else r.remove(this);
      let { initialTeardown: n } = this;
      if (T(n))
        try {
          n();
        } catch (o) {
          t = o instanceof ci ? o.errors : [o];
        }
      let { _finalizers: i } = this;
      if (i) {
        this._finalizers = null;
        for (let o of i)
          try {
            qc(o);
          } catch (s) {
            (t = t ?? []),
              s instanceof ci ? (t = [...t, ...s.errors]) : t.push(s);
          }
      }
      if (t) throw new ci(t);
    }
  }
  add(t) {
    var r;
    if (t && t !== this)
      if (this.closed) qc(t);
      else {
        if (t instanceof e) {
          if (t.closed || t._hasParent(this)) return;
          t._addParent(this);
        }
        (this._finalizers =
          (r = this._finalizers) !== null && r !== void 0 ? r : []).push(t);
      }
  }
  _hasParent(t) {
    let { _parentage: r } = this;
    return r === t || (Array.isArray(r) && r.includes(t));
  }
  _addParent(t) {
    let { _parentage: r } = this;
    this._parentage = Array.isArray(r) ? (r.push(t), r) : r ? [r, t] : t;
  }
  _removeParent(t) {
    let { _parentage: r } = this;
    r === t ? (this._parentage = null) : Array.isArray(r) && ur(r, t);
  }
  remove(t) {
    let { _finalizers: r } = this;
    r && ur(r, t), t instanceof e && t._removeParent(this);
  }
};
ae.EMPTY = (() => {
  let e = new ae();
  return (e.closed = !0), e;
})();
var bs = ae.EMPTY;
function ui(e) {
  return (
    e instanceof ae ||
    (e && "closed" in e && T(e.remove) && T(e.add) && T(e.unsubscribe))
  );
}
function qc(e) {
  T(e) ? e() : e.unsubscribe();
}
var Ge = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
};
var mn = {
  setTimeout(e, t, ...r) {
    let { delegate: n } = mn;
    return n?.setTimeout ? n.setTimeout(e, t, ...r) : setTimeout(e, t, ...r);
  },
  clearTimeout(e) {
    let { delegate: t } = mn;
    return (t?.clearTimeout || clearTimeout)(e);
  },
  delegate: void 0,
};
function di(e) {
  mn.setTimeout(() => {
    let { onUnhandledError: t } = Ge;
    if (t) t(e);
    else throw e;
  });
}
function dr() {}
var Zc = Ds("C", void 0, void 0);
function Kc(e) {
  return Ds("E", void 0, e);
}
function Yc(e) {
  return Ds("N", e, void 0);
}
function Ds(e, t, r) {
  return { kind: e, value: t, error: r };
}
var Ht = null;
function vn(e) {
  if (Ge.useDeprecatedSynchronousErrorHandling) {
    let t = !Ht;
    if ((t && (Ht = { errorThrown: !1, error: null }), e(), t)) {
      let { errorThrown: r, error: n } = Ht;
      if (((Ht = null), r)) throw n;
    }
  } else e();
}
function Qc(e) {
  Ge.useDeprecatedSynchronousErrorHandling &&
    Ht &&
    ((Ht.errorThrown = !0), (Ht.error = e));
}
var Gt = class extends ae {
    constructor(t) {
      super(),
        (this.isStopped = !1),
        t
          ? ((this.destination = t), ui(t) && t.add(this))
          : (this.destination = ag);
    }
    static create(t, r, n) {
      return new yn(t, r, n);
    }
    next(t) {
      this.isStopped ? Ms(Yc(t), this) : this._next(t);
    }
    error(t) {
      this.isStopped
        ? Ms(Kc(t), this)
        : ((this.isStopped = !0), this._error(t));
    }
    complete() {
      this.isStopped ? Ms(Zc, this) : ((this.isStopped = !0), this._complete());
    }
    unsubscribe() {
      this.closed ||
        ((this.isStopped = !0), super.unsubscribe(), (this.destination = null));
    }
    _next(t) {
      this.destination.next(t);
    }
    _error(t) {
      try {
        this.destination.error(t);
      } finally {
        this.unsubscribe();
      }
    }
    _complete() {
      try {
        this.destination.complete();
      } finally {
        this.unsubscribe();
      }
    }
  },
  og = Function.prototype.bind;
function _s(e, t) {
  return og.call(e, t);
}
var Es = class {
    constructor(t) {
      this.partialObserver = t;
    }
    next(t) {
      let { partialObserver: r } = this;
      if (r.next)
        try {
          r.next(t);
        } catch (n) {
          fi(n);
        }
    }
    error(t) {
      let { partialObserver: r } = this;
      if (r.error)
        try {
          r.error(t);
        } catch (n) {
          fi(n);
        }
      else fi(t);
    }
    complete() {
      let { partialObserver: t } = this;
      if (t.complete)
        try {
          t.complete();
        } catch (r) {
          fi(r);
        }
    }
  },
  yn = class extends Gt {
    constructor(t, r, n) {
      super();
      let i;
      if (T(t) || !t)
        i = { next: t ?? void 0, error: r ?? void 0, complete: n ?? void 0 };
      else {
        let o;
        this && Ge.useDeprecatedNextContext
          ? ((o = Object.create(t)),
            (o.unsubscribe = () => this.unsubscribe()),
            (i = {
              next: t.next && _s(t.next, o),
              error: t.error && _s(t.error, o),
              complete: t.complete && _s(t.complete, o),
            }))
          : (i = t);
      }
      this.destination = new Es(i);
    }
  };
function fi(e) {
  Ge.useDeprecatedSynchronousErrorHandling ? Qc(e) : di(e);
}
function sg(e) {
  throw e;
}
function Ms(e, t) {
  let { onStoppedNotification: r } = Ge;
  r && mn.setTimeout(() => r(e, t));
}
var ag = { closed: !0, next: dr, error: sg, complete: dr };
var wn = (typeof Symbol == "function" && Symbol.observable) || "@@observable";
function Te(e) {
  return e;
}
function xs(...e) {
  return Is(e);
}
function Is(e) {
  return e.length === 0
    ? Te
    : e.length === 1
    ? e[0]
    : function (r) {
        return e.reduce((n, i) => i(n), r);
      };
}
var $ = (() => {
  class e {
    constructor(r) {
      r && (this._subscribe = r);
    }
    lift(r) {
      let n = new e();
      return (n.source = this), (n.operator = r), n;
    }
    subscribe(r, n, i) {
      let o = cg(r) ? r : new yn(r, n, i);
      return (
        vn(() => {
          let { operator: s, source: a } = this;
          o.add(
            s ? s.call(o, a) : a ? this._subscribe(o) : this._trySubscribe(o)
          );
        }),
        o
      );
    }
    _trySubscribe(r) {
      try {
        return this._subscribe(r);
      } catch (n) {
        r.error(n);
      }
    }
    forEach(r, n) {
      return (
        (n = Jc(n)),
        new n((i, o) => {
          let s = new yn({
            next: (a) => {
              try {
                r(a);
              } catch (l) {
                o(l), s.unsubscribe();
              }
            },
            error: o,
            complete: i,
          });
          this.subscribe(s);
        })
      );
    }
    _subscribe(r) {
      var n;
      return (n = this.source) === null || n === void 0
        ? void 0
        : n.subscribe(r);
    }
    [wn]() {
      return this;
    }
    pipe(...r) {
      return Is(r)(this);
    }
    toPromise(r) {
      return (
        (r = Jc(r)),
        new r((n, i) => {
          let o;
          this.subscribe(
            (s) => (o = s),
            (s) => i(s),
            () => n(o)
          );
        })
      );
    }
  }
  return (e.create = (t) => new e(t)), e;
})();
function Jc(e) {
  var t;
  return (t = e ?? Ge.Promise) !== null && t !== void 0 ? t : Promise;
}
function lg(e) {
  return e && T(e.next) && T(e.error) && T(e.complete);
}
function cg(e) {
  return (e && e instanceof Gt) || (lg(e) && ui(e));
}
function Ss(e) {
  return T(e?.lift);
}
function B(e) {
  return (t) => {
    if (Ss(t))
      return t.lift(function (r) {
        try {
          return e(r, this);
        } catch (n) {
          this.error(n);
        }
      });
    throw new TypeError("Unable to lift unknown Observable type");
  };
}
function z(e, t, r, n, i) {
  return new Os(e, t, r, n, i);
}
var Os = class extends Gt {
  constructor(t, r, n, i, o, s) {
    super(t),
      (this.onFinalize = o),
      (this.shouldUnsubscribe = s),
      (this._next = r
        ? function (a) {
            try {
              r(a);
            } catch (l) {
              t.error(l);
            }
          }
        : super._next),
      (this._error = i
        ? function (a) {
            try {
              i(a);
            } catch (l) {
              t.error(l);
            } finally {
              this.unsubscribe();
            }
          }
        : super._error),
      (this._complete = n
        ? function () {
            try {
              n();
            } catch (a) {
              t.error(a);
            } finally {
              this.unsubscribe();
            }
          }
        : super._complete);
  }
  unsubscribe() {
    var t;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      let { closed: r } = this;
      super.unsubscribe(),
        !r && ((t = this.onFinalize) === null || t === void 0 || t.call(this));
    }
  }
};
function Cn() {
  return B((e, t) => {
    let r = null;
    e._refCount++;
    let n = z(t, void 0, void 0, void 0, () => {
      if (!e || e._refCount <= 0 || 0 < --e._refCount) {
        r = null;
        return;
      }
      let i = e._connection,
        o = r;
      (r = null), i && (!o || i === o) && i.unsubscribe(), t.unsubscribe();
    });
    e.subscribe(n), n.closed || (r = e.connect());
  });
}
var bn = class extends $ {
  constructor(t, r) {
    super(),
      (this.source = t),
      (this.subjectFactory = r),
      (this._subject = null),
      (this._refCount = 0),
      (this._connection = null),
      Ss(t) && (this.lift = t.lift);
  }
  _subscribe(t) {
    return this.getSubject().subscribe(t);
  }
  getSubject() {
    let t = this._subject;
    return (
      (!t || t.isStopped) && (this._subject = this.subjectFactory()),
      this._subject
    );
  }
  _teardown() {
    this._refCount = 0;
    let { _connection: t } = this;
    (this._subject = this._connection = null), t?.unsubscribe();
  }
  connect() {
    let t = this._connection;
    if (!t) {
      t = this._connection = new ae();
      let r = this.getSubject();
      t.add(
        this.source.subscribe(
          z(
            r,
            void 0,
            () => {
              this._teardown(), r.complete();
            },
            (n) => {
              this._teardown(), r.error(n);
            },
            () => this._teardown()
          )
        )
      ),
        t.closed && ((this._connection = null), (t = ae.EMPTY));
    }
    return t;
  }
  refCount() {
    return Cn()(this);
  }
};
var Xc = gn(
  (e) =>
    function () {
      e(this),
        (this.name = "ObjectUnsubscribedError"),
        (this.message = "object unsubscribed");
    }
);
var ne = (() => {
    class e extends $ {
      constructor() {
        super(),
          (this.closed = !1),
          (this.currentObservers = null),
          (this.observers = []),
          (this.isStopped = !1),
          (this.hasError = !1),
          (this.thrownError = null);
      }
      lift(r) {
        let n = new hi(this, this);
        return (n.operator = r), n;
      }
      _throwIfClosed() {
        if (this.closed) throw new Xc();
      }
      next(r) {
        vn(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers ||
              (this.currentObservers = Array.from(this.observers));
            for (let n of this.currentObservers) n.next(r);
          }
        });
      }
      error(r) {
        vn(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            (this.hasError = this.isStopped = !0), (this.thrownError = r);
            let { observers: n } = this;
            for (; n.length; ) n.shift().error(r);
          }
        });
      }
      complete() {
        vn(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.isStopped = !0;
            let { observers: r } = this;
            for (; r.length; ) r.shift().complete();
          }
        });
      }
      unsubscribe() {
        (this.isStopped = this.closed = !0),
          (this.observers = this.currentObservers = null);
      }
      get observed() {
        var r;
        return (
          ((r = this.observers) === null || r === void 0 ? void 0 : r.length) >
          0
        );
      }
      _trySubscribe(r) {
        return this._throwIfClosed(), super._trySubscribe(r);
      }
      _subscribe(r) {
        return (
          this._throwIfClosed(),
          this._checkFinalizedStatuses(r),
          this._innerSubscribe(r)
        );
      }
      _innerSubscribe(r) {
        let { hasError: n, isStopped: i, observers: o } = this;
        return n || i
          ? bs
          : ((this.currentObservers = null),
            o.push(r),
            new ae(() => {
              (this.currentObservers = null), ur(o, r);
            }));
      }
      _checkFinalizedStatuses(r) {
        let { hasError: n, thrownError: i, isStopped: o } = this;
        n ? r.error(i) : o && r.complete();
      }
      asObservable() {
        let r = new $();
        return (r.source = this), r;
      }
    }
    return (e.create = (t, r) => new hi(t, r)), e;
  })(),
  hi = class extends ne {
    constructor(t, r) {
      super(), (this.destination = t), (this.source = r);
    }
    next(t) {
      var r, n;
      (n =
        (r = this.destination) === null || r === void 0 ? void 0 : r.next) ===
        null ||
        n === void 0 ||
        n.call(r, t);
    }
    error(t) {
      var r, n;
      (n =
        (r = this.destination) === null || r === void 0 ? void 0 : r.error) ===
        null ||
        n === void 0 ||
        n.call(r, t);
    }
    complete() {
      var t, r;
      (r =
        (t = this.destination) === null || t === void 0
          ? void 0
          : t.complete) === null ||
        r === void 0 ||
        r.call(t);
    }
    _subscribe(t) {
      var r, n;
      return (n =
        (r = this.source) === null || r === void 0
          ? void 0
          : r.subscribe(t)) !== null && n !== void 0
        ? n
        : bs;
    }
  };
var he = class extends ne {
  constructor(t) {
    super(), (this._value = t);
  }
  get value() {
    return this.getValue();
  }
  _subscribe(t) {
    let r = super._subscribe(t);
    return !r.closed && t.next(this._value), r;
  }
  getValue() {
    let { hasError: t, thrownError: r, _value: n } = this;
    if (t) throw r;
    return this._throwIfClosed(), n;
  }
  next(t) {
    super.next((this._value = t));
  }
};
var Pe = new $((e) => e.complete());
function eu(e) {
  return e && T(e.schedule);
}
function tu(e) {
  return e[e.length - 1];
}
function pi(e) {
  return T(tu(e)) ? e.pop() : void 0;
}
function Et(e) {
  return eu(tu(e)) ? e.pop() : void 0;
}
function ru(e, t, r, n) {
  function i(o) {
    return o instanceof r
      ? o
      : new r(function (s) {
          s(o);
        });
  }
  return new (r || (r = Promise))(function (o, s) {
    function a(h) {
      try {
        c(n.next(h));
      } catch (p) {
        s(p);
      }
    }
    function l(h) {
      try {
        c(n.throw(h));
      } catch (p) {
        s(p);
      }
    }
    function c(h) {
      h.done ? o(h.value) : i(h.value).then(a, l);
    }
    c((n = n.apply(e, t || [])).next());
  });
}
function nu(e) {
  var t = typeof Symbol == "function" && Symbol.iterator,
    r = t && e[t],
    n = 0;
  if (r) return r.call(e);
  if (e && typeof e.length == "number")
    return {
      next: function () {
        return (
          e && n >= e.length && (e = void 0), { value: e && e[n++], done: !e }
        );
      },
    };
  throw new TypeError(
    t ? "Object is not iterable." : "Symbol.iterator is not defined."
  );
}
function Wt(e) {
  return this instanceof Wt ? ((this.v = e), this) : new Wt(e);
}
function iu(e, t, r) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var n = r.apply(e, t || []),
    i,
    o = [];
  return (
    (i = {}),
    s("next"),
    s("throw"),
    s("return"),
    (i[Symbol.asyncIterator] = function () {
      return this;
    }),
    i
  );
  function s(g) {
    n[g] &&
      (i[g] = function (m) {
        return new Promise(function (w, O) {
          o.push([g, m, w, O]) > 1 || a(g, m);
        });
      });
  }
  function a(g, m) {
    try {
      l(n[g](m));
    } catch (w) {
      p(o[0][3], w);
    }
  }
  function l(g) {
    g.value instanceof Wt
      ? Promise.resolve(g.value.v).then(c, h)
      : p(o[0][2], g);
  }
  function c(g) {
    a("next", g);
  }
  function h(g) {
    a("throw", g);
  }
  function p(g, m) {
    g(m), o.shift(), o.length && a(o[0][0], o[0][1]);
  }
}
function ou(e) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var t = e[Symbol.asyncIterator],
    r;
  return t
    ? t.call(e)
    : ((e = typeof nu == "function" ? nu(e) : e[Symbol.iterator]()),
      (r = {}),
      n("next"),
      n("throw"),
      n("return"),
      (r[Symbol.asyncIterator] = function () {
        return this;
      }),
      r);
  function n(o) {
    r[o] =
      e[o] &&
      function (s) {
        return new Promise(function (a, l) {
          (s = e[o](s)), i(a, l, s.done, s.value);
        });
      };
  }
  function i(o, s, a, l) {
    Promise.resolve(l).then(function (c) {
      o({ value: c, done: a });
    }, s);
  }
}
var gi = (e) => e && typeof e.length == "number" && typeof e != "function";
function mi(e) {
  return T(e?.then);
}
function vi(e) {
  return T(e[wn]);
}
function yi(e) {
  return Symbol.asyncIterator && T(e?.[Symbol.asyncIterator]);
}
function wi(e) {
  return new TypeError(
    `You provided ${
      e !== null && typeof e == "object" ? "an invalid object" : `'${e}'`
    } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
  );
}
function ug() {
  return typeof Symbol != "function" || !Symbol.iterator
    ? "@@iterator"
    : Symbol.iterator;
}
var Ci = ug();
function bi(e) {
  return T(e?.[Ci]);
}
function Di(e) {
  return iu(this, arguments, function* () {
    let r = e.getReader();
    try {
      for (;;) {
        let { value: n, done: i } = yield Wt(r.read());
        if (i) return yield Wt(void 0);
        yield yield Wt(n);
      }
    } finally {
      r.releaseLock();
    }
  });
}
function _i(e) {
  return T(e?.getReader);
}
function re(e) {
  if (e instanceof $) return e;
  if (e != null) {
    if (vi(e)) return dg(e);
    if (gi(e)) return fg(e);
    if (mi(e)) return hg(e);
    if (yi(e)) return su(e);
    if (bi(e)) return pg(e);
    if (_i(e)) return gg(e);
  }
  throw wi(e);
}
function dg(e) {
  return new $((t) => {
    let r = e[wn]();
    if (T(r.subscribe)) return r.subscribe(t);
    throw new TypeError(
      "Provided object does not correctly implement Symbol.observable"
    );
  });
}
function fg(e) {
  return new $((t) => {
    for (let r = 0; r < e.length && !t.closed; r++) t.next(e[r]);
    t.complete();
  });
}
function hg(e) {
  return new $((t) => {
    e.then(
      (r) => {
        t.closed || (t.next(r), t.complete());
      },
      (r) => t.error(r)
    ).then(null, di);
  });
}
function pg(e) {
  return new $((t) => {
    for (let r of e) if ((t.next(r), t.closed)) return;
    t.complete();
  });
}
function su(e) {
  return new $((t) => {
    mg(e, t).catch((r) => t.error(r));
  });
}
function gg(e) {
  return su(Di(e));
}
function mg(e, t) {
  var r, n, i, o;
  return ru(this, void 0, void 0, function* () {
    try {
      for (r = ou(e); (n = yield r.next()), !n.done; ) {
        let s = n.value;
        if ((t.next(s), t.closed)) return;
      }
    } catch (s) {
      i = { error: s };
    } finally {
      try {
        n && !n.done && (o = r.return) && (yield o.call(r));
      } finally {
        if (i) throw i.error;
      }
    }
    t.complete();
  });
}
function De(e, t, r, n = 0, i = !1) {
  let o = t.schedule(function () {
    r(), i ? e.add(this.schedule(null, n)) : this.unsubscribe();
  }, n);
  if ((e.add(o), !i)) return o;
}
function Mi(e, t = 0) {
  return B((r, n) => {
    r.subscribe(
      z(
        n,
        (i) => De(n, e, () => n.next(i), t),
        () => De(n, e, () => n.complete(), t),
        (i) => De(n, e, () => n.error(i), t)
      )
    );
  });
}
function Ei(e, t = 0) {
  return B((r, n) => {
    n.add(e.schedule(() => r.subscribe(n), t));
  });
}
function au(e, t) {
  return re(e).pipe(Ei(t), Mi(t));
}
function lu(e, t) {
  return re(e).pipe(Ei(t), Mi(t));
}
function cu(e, t) {
  return new $((r) => {
    let n = 0;
    return t.schedule(function () {
      n === e.length
        ? r.complete()
        : (r.next(e[n++]), r.closed || this.schedule());
    });
  });
}
function uu(e, t) {
  return new $((r) => {
    let n;
    return (
      De(r, t, () => {
        (n = e[Ci]()),
          De(
            r,
            t,
            () => {
              let i, o;
              try {
                ({ value: i, done: o } = n.next());
              } catch (s) {
                r.error(s);
                return;
              }
              o ? r.complete() : r.next(i);
            },
            0,
            !0
          );
      }),
      () => T(n?.return) && n.return()
    );
  });
}
function xi(e, t) {
  if (!e) throw new Error("Iterable cannot be null");
  return new $((r) => {
    De(r, t, () => {
      let n = e[Symbol.asyncIterator]();
      De(
        r,
        t,
        () => {
          n.next().then((i) => {
            i.done ? r.complete() : r.next(i.value);
          });
        },
        0,
        !0
      );
    });
  });
}
function du(e, t) {
  return xi(Di(e), t);
}
function fu(e, t) {
  if (e != null) {
    if (vi(e)) return au(e, t);
    if (gi(e)) return cu(e, t);
    if (mi(e)) return lu(e, t);
    if (yi(e)) return xi(e, t);
    if (bi(e)) return uu(e, t);
    if (_i(e)) return du(e, t);
  }
  throw wi(e);
}
function J(e, t) {
  return t ? fu(e, t) : re(e);
}
function S(...e) {
  let t = Et(e);
  return J(e, t);
}
function Dn(e, t) {
  let r = T(e) ? e : () => e,
    n = (i) => i.error(r());
  return new $(t ? (i) => t.schedule(n, 0, i) : n);
}
function Ts(e) {
  return !!e && (e instanceof $ || (T(e.lift) && T(e.subscribe)));
}
var ft = gn(
  (e) =>
    function () {
      e(this),
        (this.name = "EmptyError"),
        (this.message = "no elements in sequence");
    }
);
function A(e, t) {
  return B((r, n) => {
    let i = 0;
    r.subscribe(
      z(n, (o) => {
        n.next(e.call(t, o, i++));
      })
    );
  });
}
var { isArray: vg } = Array;
function yg(e, t) {
  return vg(t) ? e(...t) : e(t);
}
function Ii(e) {
  return A((t) => yg(e, t));
}
var { isArray: wg } = Array,
  { getPrototypeOf: Cg, prototype: bg, keys: Dg } = Object;
function Si(e) {
  if (e.length === 1) {
    let t = e[0];
    if (wg(t)) return { args: t, keys: null };
    if (_g(t)) {
      let r = Dg(t);
      return { args: r.map((n) => t[n]), keys: r };
    }
  }
  return { args: e, keys: null };
}
function _g(e) {
  return e && typeof e == "object" && Cg(e) === bg;
}
function Oi(e, t) {
  return e.reduce((r, n, i) => ((r[n] = t[i]), r), {});
}
function Ti(...e) {
  let t = Et(e),
    r = pi(e),
    { args: n, keys: i } = Si(e);
  if (n.length === 0) return J([], t);
  let o = new $(Mg(n, t, i ? (s) => Oi(i, s) : Te));
  return r ? o.pipe(Ii(r)) : o;
}
function Mg(e, t, r = Te) {
  return (n) => {
    hu(
      t,
      () => {
        let { length: i } = e,
          o = new Array(i),
          s = i,
          a = i;
        for (let l = 0; l < i; l++)
          hu(
            t,
            () => {
              let c = J(e[l], t),
                h = !1;
              c.subscribe(
                z(
                  n,
                  (p) => {
                    (o[l] = p), h || ((h = !0), a--), a || n.next(r(o.slice()));
                  },
                  () => {
                    --s || n.complete();
                  }
                )
              );
            },
            n
          );
      },
      n
    );
  };
}
function hu(e, t, r) {
  e ? De(r, e, t) : t();
}
function pu(e, t, r, n, i, o, s, a) {
  let l = [],
    c = 0,
    h = 0,
    p = !1,
    g = () => {
      p && !l.length && !c && t.complete();
    },
    m = (O) => (c < n ? w(O) : l.push(O)),
    w = (O) => {
      o && t.next(O), c++;
      let _ = !1;
      re(r(O, h++)).subscribe(
        z(
          t,
          (D) => {
            i?.(D), o ? m(D) : t.next(D);
          },
          () => {
            _ = !0;
          },
          void 0,
          () => {
            if (_)
              try {
                for (c--; l.length && c < n; ) {
                  let D = l.shift();
                  s ? De(t, s, () => w(D)) : w(D);
                }
                g();
              } catch (D) {
                t.error(D);
              }
          }
        )
      );
    };
  return (
    e.subscribe(
      z(t, m, () => {
        (p = !0), g();
      })
    ),
    () => {
      a?.();
    }
  );
}
function le(e, t, r = 1 / 0) {
  return T(t)
    ? le((n, i) => A((o, s) => t(n, o, i, s))(re(e(n, i))), r)
    : (typeof t == "number" && (r = t), B((n, i) => pu(n, i, e, r)));
}
function Ps(e = 1 / 0) {
  return le(Te, e);
}
function gu() {
  return Ps(1);
}
function _n(...e) {
  return gu()(J(e, Et(e)));
}
function Pi(e) {
  return new $((t) => {
    re(e()).subscribe(t);
  });
}
function As(...e) {
  let t = pi(e),
    { args: r, keys: n } = Si(e),
    i = new $((o) => {
      let { length: s } = r;
      if (!s) {
        o.complete();
        return;
      }
      let a = new Array(s),
        l = s,
        c = s;
      for (let h = 0; h < s; h++) {
        let p = !1;
        re(r[h]).subscribe(
          z(
            o,
            (g) => {
              p || ((p = !0), c--), (a[h] = g);
            },
            () => l--,
            void 0,
            () => {
              (!l || !p) && (c || o.next(n ? Oi(n, a) : a), o.complete());
            }
          )
        );
      }
    });
  return t ? i.pipe(Ii(t)) : i;
}
function Ae(e, t) {
  return B((r, n) => {
    let i = 0;
    r.subscribe(z(n, (o) => e.call(t, o, i++) && n.next(o)));
  });
}
function xt(e) {
  return B((t, r) => {
    let n = null,
      i = !1,
      o;
    (n = t.subscribe(
      z(r, void 0, void 0, (s) => {
        (o = re(e(s, xt(e)(t)))),
          n ? (n.unsubscribe(), (n = null), o.subscribe(r)) : (i = !0);
      })
    )),
      i && (n.unsubscribe(), (n = null), o.subscribe(r));
  });
}
function mu(e, t, r, n, i) {
  return (o, s) => {
    let a = r,
      l = t,
      c = 0;
    o.subscribe(
      z(
        s,
        (h) => {
          let p = c++;
          (l = a ? e(l, h, p) : ((a = !0), h)), n && s.next(l);
        },
        i &&
          (() => {
            a && s.next(l), s.complete();
          })
      )
    );
  };
}
function It(e, t) {
  return T(t) ? le(e, t, 1) : le(e, 1);
}
function St(e) {
  return B((t, r) => {
    let n = !1;
    t.subscribe(
      z(
        r,
        (i) => {
          (n = !0), r.next(i);
        },
        () => {
          n || r.next(e), r.complete();
        }
      )
    );
  });
}
function ht(e) {
  return e <= 0
    ? () => Pe
    : B((t, r) => {
        let n = 0;
        t.subscribe(
          z(r, (i) => {
            ++n <= e && (r.next(i), e <= n && r.complete());
          })
        );
      });
}
function Ns(e) {
  return A(() => e);
}
function Ai(e = Eg) {
  return B((t, r) => {
    let n = !1;
    t.subscribe(
      z(
        r,
        (i) => {
          (n = !0), r.next(i);
        },
        () => (n ? r.complete() : r.error(e()))
      )
    );
  });
}
function Eg() {
  return new ft();
}
function qt(e) {
  return B((t, r) => {
    try {
      t.subscribe(r);
    } finally {
      r.add(e);
    }
  });
}
function Xe(e, t) {
  let r = arguments.length >= 2;
  return (n) =>
    n.pipe(
      e ? Ae((i, o) => e(i, o, n)) : Te,
      ht(1),
      r ? St(t) : Ai(() => new ft())
    );
}
function Mn(e) {
  return e <= 0
    ? () => Pe
    : B((t, r) => {
        let n = [];
        t.subscribe(
          z(
            r,
            (i) => {
              n.push(i), e < n.length && n.shift();
            },
            () => {
              for (let i of n) r.next(i);
              r.complete();
            },
            void 0,
            () => {
              n = null;
            }
          )
        );
      });
}
function ks(e, t) {
  let r = arguments.length >= 2;
  return (n) =>
    n.pipe(
      e ? Ae((i, o) => e(i, o, n)) : Te,
      Mn(1),
      r ? St(t) : Ai(() => new ft())
    );
}
function Fs(e, t) {
  return B(mu(e, t, arguments.length >= 2, !0));
}
function Rs(...e) {
  let t = Et(e);
  return B((r, n) => {
    (t ? _n(e, r, t) : _n(e, r)).subscribe(n);
  });
}
function Ne(e, t) {
  return B((r, n) => {
    let i = null,
      o = 0,
      s = !1,
      a = () => s && !i && n.complete();
    r.subscribe(
      z(
        n,
        (l) => {
          i?.unsubscribe();
          let c = 0,
            h = o++;
          re(e(l, h)).subscribe(
            (i = z(
              n,
              (p) => n.next(t ? t(l, p, h, c++) : p),
              () => {
                (i = null), a();
              }
            ))
          );
        },
        () => {
          (s = !0), a();
        }
      )
    );
  });
}
function Ls(e) {
  return B((t, r) => {
    re(e).subscribe(z(r, () => r.complete(), dr)), !r.closed && t.subscribe(r);
  });
}
function ue(e, t, r) {
  let n = T(e) || t || r ? { next: e, error: t, complete: r } : e;
  return n
    ? B((i, o) => {
        var s;
        (s = n.subscribe) === null || s === void 0 || s.call(n);
        let a = !0;
        i.subscribe(
          z(
            o,
            (l) => {
              var c;
              (c = n.next) === null || c === void 0 || c.call(n, l), o.next(l);
            },
            () => {
              var l;
              (a = !1),
                (l = n.complete) === null || l === void 0 || l.call(n),
                o.complete();
            },
            (l) => {
              var c;
              (a = !1),
                (c = n.error) === null || c === void 0 || c.call(n, l),
                o.error(l);
            },
            () => {
              var l, c;
              a && ((l = n.unsubscribe) === null || l === void 0 || l.call(n)),
                (c = n.finalize) === null || c === void 0 || c.call(n);
            }
          )
        );
      })
    : Te;
}
var Ju = "https://g.co/ng/security#xss",
  M = class extends Error {
    constructor(t, r) {
      super(oo(t, r)), (this.code = t);
    }
  };
function oo(e, t) {
  return `${`NG0${Math.abs(e)}`}${t ? ": " + t : ""}`;
}
function so(e) {
  return { toString: e }.toString();
}
var fr = globalThis;
function Z(e) {
  for (let t in e) if (e[t] === Z) return t;
  throw Error("Could not find renamed property on target object.");
}
function Ig(e, t) {
  for (let r in t) t.hasOwnProperty(r) && !e.hasOwnProperty(r) && (e[r] = t[r]);
}
function _e(e) {
  if (typeof e == "string") return e;
  if (Array.isArray(e)) return "[" + e.map(_e).join(", ") + "]";
  if (e == null) return "" + e;
  if (e.overriddenName) return `${e.overriddenName}`;
  if (e.name) return `${e.name}`;
  let t = e.toString();
  if (t == null) return "" + t;
  let r = t.indexOf(`
`);
  return r === -1 ? t : t.substring(0, r);
}
function vu(e, t) {
  return e == null || e === ""
    ? t === null
      ? ""
      : t
    : t == null || t === ""
    ? e
    : e + " " + t;
}
var Sg = Z({ __forward_ref__: Z });
function Ye(e) {
  return (
    (e.__forward_ref__ = Ye),
    (e.toString = function () {
      return _e(this());
    }),
    e
  );
}
function Ce(e) {
  return Xu(e) ? e() : e;
}
function Xu(e) {
  return (
    typeof e == "function" && e.hasOwnProperty(Sg) && e.__forward_ref__ === Ye
  );
}
function E(e) {
  return {
    token: e.token,
    providedIn: e.providedIn || null,
    factory: e.factory,
    value: void 0,
  };
}
function Nt(e) {
  return { providers: e.providers || [], imports: e.imports || [] };
}
function ao(e) {
  return yu(e, td) || yu(e, nd);
}
function ed(e) {
  return ao(e) !== null;
}
function yu(e, t) {
  return e.hasOwnProperty(t) ? e[t] : null;
}
function Og(e) {
  let t = e && (e[td] || e[nd]);
  return t || null;
}
function wu(e) {
  return e && (e.hasOwnProperty(Cu) || e.hasOwnProperty(Tg)) ? e[Cu] : null;
}
var td = Z({ ɵprov: Z }),
  Cu = Z({ ɵinj: Z }),
  nd = Z({ ngInjectableDef: Z }),
  Tg = Z({ ngInjectorDef: Z }),
  x = class {
    constructor(t, r) {
      (this._desc = t),
        (this.ngMetadataName = "InjectionToken"),
        (this.ɵprov = void 0),
        typeof r == "number"
          ? (this.__NG_ELEMENT_ID__ = r)
          : r !== void 0 &&
            (this.ɵprov = E({
              token: this,
              providedIn: r.providedIn || "root",
              factory: r.factory,
            }));
    }
    get multi() {
      return this;
    }
    toString() {
      return `InjectionToken ${this._desc}`;
    }
  };
function rd(e) {
  return e && !!e.ɵproviders;
}
var Pg = Z({ ɵcmp: Z }),
  Ag = Z({ ɵdir: Z }),
  Ng = Z({ ɵpipe: Z }),
  kg = Z({ ɵmod: Z }),
  zi = Z({ ɵfac: Z }),
  hr = Z({ __NG_ELEMENT_ID__: Z }),
  bu = Z({ __NG_ENV_ID__: Z });
function Tn(e) {
  return typeof e == "string" ? e : e == null ? "" : String(e);
}
function Fg(e) {
  return typeof e == "function"
    ? e.name || e.toString()
    : typeof e == "object" && e != null && typeof e.type == "function"
    ? e.type.name || e.type.toString()
    : Tn(e);
}
function Rg(e, t) {
  let r = t ? `. Dependency path: ${t.join(" > ")} > ${e}` : "";
  throw new M(-200, e);
}
function Ua(e, t) {
  throw new M(-201, !1);
}
var L = (function (e) {
    return (
      (e[(e.Default = 0)] = "Default"),
      (e[(e.Host = 1)] = "Host"),
      (e[(e.Self = 2)] = "Self"),
      (e[(e.SkipSelf = 4)] = "SkipSelf"),
      (e[(e.Optional = 8)] = "Optional"),
      e
    );
  })(L || {}),
  ea;
function id() {
  return ea;
}
function Ve(e) {
  let t = ea;
  return (ea = e), t;
}
function od(e, t, r) {
  let n = ao(e);
  if (n && n.providedIn == "root")
    return n.value === void 0 ? (n.value = n.factory()) : n.value;
  if (r & L.Optional) return null;
  if (t !== void 0) return t;
  Ua(e, "Injector");
}
var Lg = {},
  pr = Lg,
  Vg = "__NG_DI_FLAG__",
  Ui = "ngTempTokenPath",
  jg = "ngTokenPath",
  zg = /\n/gm,
  Ug = "\u0275",
  Du = "__source",
  Sn;
function Bg() {
  return Sn;
}
function Ot(e) {
  let t = Sn;
  return (Sn = e), t;
}
function $g(e, t = L.Default) {
  if (Sn === void 0) throw new M(-203, !1);
  return Sn === null
    ? od(e, void 0, t)
    : Sn.get(e, t & L.Optional ? null : void 0, t);
}
function P(e, t = L.Default) {
  return (id() || $g)(Ce(e), t);
}
function v(e, t = L.Default) {
  return P(e, lo(t));
}
function lo(e) {
  return typeof e > "u" || typeof e == "number"
    ? e
    : 0 | (e.optional && 8) | (e.host && 1) | (e.self && 2) | (e.skipSelf && 4);
}
function ta(e) {
  let t = [];
  for (let r = 0; r < e.length; r++) {
    let n = Ce(e[r]);
    if (Array.isArray(n)) {
      if (n.length === 0) throw new M(900, !1);
      let i,
        o = L.Default;
      for (let s = 0; s < n.length; s++) {
        let a = n[s],
          l = Hg(a);
        typeof l == "number" ? (l === -1 ? (i = a.token) : (o |= l)) : (i = a);
      }
      t.push(P(i, o));
    } else t.push(P(n));
  }
  return t;
}
function Hg(e) {
  return e[Vg];
}
function Gg(e, t, r, n) {
  let i = e[Ui];
  throw (
    (t[Du] && i.unshift(t[Du]),
    (e.message = Wg(
      `
` + e.message,
      i,
      r,
      n
    )),
    (e[jg] = i),
    (e[Ui] = null),
    e)
  );
}
function Wg(e, t, r, n = null) {
  e =
    e &&
    e.charAt(0) ===
      `
` &&
    e.charAt(1) == Ug
      ? e.slice(2)
      : e;
  let i = _e(t);
  if (Array.isArray(t)) i = t.map(_e).join(" -> ");
  else if (typeof t == "object") {
    let o = [];
    for (let s in t)
      if (t.hasOwnProperty(s)) {
        let a = t[s];
        o.push(s + ":" + (typeof a == "string" ? JSON.stringify(a) : _e(a)));
      }
    i = `{${o.join(", ")}}`;
  }
  return `${r}${n ? "(" + n + ")" : ""}[${i}]: ${e.replace(
    zg,
    `
  `
  )}`;
}
function Pn(e, t) {
  let r = e.hasOwnProperty(zi);
  return r ? e[zi] : null;
}
function Ba(e, t) {
  e.forEach((r) => (Array.isArray(r) ? Ba(r, t) : t(r)));
}
function sd(e, t, r) {
  t >= e.length ? e.push(r) : e.splice(t, 0, r);
}
function Bi(e, t) {
  return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0];
}
function qg(e, t, r, n) {
  let i = e.length;
  if (i == t) e.push(r, n);
  else if (i === 1) e.push(n, e[0]), (e[0] = r);
  else {
    for (i--, e.push(e[i - 1], e[i]); i > t; ) {
      let o = i - 2;
      (e[i] = e[o]), i--;
    }
    (e[t] = r), (e[t + 1] = n);
  }
}
function Zg(e, t, r) {
  let n = Or(e, t);
  return n >= 0 ? (e[n | 1] = r) : ((n = ~n), qg(e, n, t, r)), n;
}
function Vs(e, t) {
  let r = Or(e, t);
  if (r >= 0) return e[r | 1];
}
function Or(e, t) {
  return Kg(e, t, 1);
}
function Kg(e, t, r) {
  let n = 0,
    i = e.length >> r;
  for (; i !== n; ) {
    let o = n + ((i - n) >> 1),
      s = e[o << r];
    if (t === s) return o << r;
    s > t ? (i = o) : (n = o + 1);
  }
  return ~(i << r);
}
var An = {},
  je = [],
  Nn = new x(""),
  ad = new x("", -1),
  ld = new x(""),
  $i = class {
    get(t, r = pr) {
      if (r === pr) {
        let n = new Error(`NullInjectorError: No provider for ${_e(t)}!`);
        throw ((n.name = "NullInjectorError"), n);
      }
      return r;
    }
  },
  cd = (function (e) {
    return (e[(e.OnPush = 0)] = "OnPush"), (e[(e.Default = 1)] = "Default"), e;
  })(cd || {}),
  nt = (function (e) {
    return (
      (e[(e.Emulated = 0)] = "Emulated"),
      (e[(e.None = 2)] = "None"),
      (e[(e.ShadowDom = 3)] = "ShadowDom"),
      e
    );
  })(nt || {}),
  Me = (function (e) {
    return (
      (e[(e.None = 0)] = "None"),
      (e[(e.SignalBased = 1)] = "SignalBased"),
      (e[(e.HasDecoratorInputTransform = 2)] = "HasDecoratorInputTransform"),
      e
    );
  })(Me || {});
function Yg(e, t, r) {
  let n = e.length;
  for (;;) {
    let i = e.indexOf(t, r);
    if (i === -1) return i;
    if (i === 0 || e.charCodeAt(i - 1) <= 32) {
      let o = t.length;
      if (i + o === n || e.charCodeAt(i + o) <= 32) return i;
    }
    r = i + 1;
  }
}
function na(e, t, r) {
  let n = 0;
  for (; n < r.length; ) {
    let i = r[n];
    if (typeof i == "number") {
      if (i !== 0) break;
      n++;
      let o = r[n++],
        s = r[n++],
        a = r[n++];
      e.setAttribute(t, s, a, o);
    } else {
      let o = i,
        s = r[++n];
      Jg(o) ? e.setProperty(t, o, s) : e.setAttribute(t, o, s), n++;
    }
  }
  return n;
}
function Qg(e) {
  return e === 3 || e === 4 || e === 6;
}
function Jg(e) {
  return e.charCodeAt(0) === 64;
}
function gr(e, t) {
  if (!(t === null || t.length === 0))
    if (e === null || e.length === 0) e = t.slice();
    else {
      let r = -1;
      for (let n = 0; n < t.length; n++) {
        let i = t[n];
        typeof i == "number"
          ? (r = i)
          : r === 0 ||
            (r === -1 || r === 2
              ? _u(e, r, i, null, t[++n])
              : _u(e, r, i, null, null));
      }
    }
  return e;
}
function _u(e, t, r, n, i) {
  let o = 0,
    s = e.length;
  if (t === -1) s = -1;
  else
    for (; o < e.length; ) {
      let a = e[o++];
      if (typeof a == "number") {
        if (a === t) {
          s = -1;
          break;
        } else if (a > t) {
          s = o - 1;
          break;
        }
      }
    }
  for (; o < e.length; ) {
    let a = e[o];
    if (typeof a == "number") break;
    if (a === r) {
      if (n === null) {
        i !== null && (e[o + 1] = i);
        return;
      } else if (n === e[o + 1]) {
        e[o + 2] = i;
        return;
      }
    }
    o++, n !== null && o++, i !== null && o++;
  }
  s !== -1 && (e.splice(s, 0, t), (o = s + 1)),
    e.splice(o++, 0, r),
    n !== null && e.splice(o++, 0, n),
    i !== null && e.splice(o++, 0, i);
}
var ud = "ng-template";
function Xg(e, t, r, n) {
  let i = 0;
  if (n) {
    for (; i < t.length && typeof t[i] == "string"; i += 2)
      if (t[i] === "class" && Yg(t[i + 1].toLowerCase(), r, 0) !== -1)
        return !0;
  } else if ($a(e)) return !1;
  if (((i = t.indexOf(1, i)), i > -1)) {
    let o;
    for (; ++i < t.length && typeof (o = t[i]) == "string"; )
      if (o.toLowerCase() === r) return !0;
  }
  return !1;
}
function $a(e) {
  return e.type === 4 && e.value !== ud;
}
function em(e, t, r) {
  let n = e.type === 4 && !r ? ud : e.value;
  return t === n;
}
function tm(e, t, r) {
  let n = 4,
    i = e.attrs,
    o = i !== null ? im(i) : 0,
    s = !1;
  for (let a = 0; a < t.length; a++) {
    let l = t[a];
    if (typeof l == "number") {
      if (!s && !We(n) && !We(l)) return !1;
      if (s && We(l)) continue;
      (s = !1), (n = l | (n & 1));
      continue;
    }
    if (!s)
      if (n & 4) {
        if (
          ((n = 2 | (n & 1)),
          (l !== "" && !em(e, l, r)) || (l === "" && t.length === 1))
        ) {
          if (We(n)) return !1;
          s = !0;
        }
      } else if (n & 8) {
        if (i === null || !Xg(e, i, l, r)) {
          if (We(n)) return !1;
          s = !0;
        }
      } else {
        let c = t[++a],
          h = nm(l, i, $a(e), r);
        if (h === -1) {
          if (We(n)) return !1;
          s = !0;
          continue;
        }
        if (c !== "") {
          let p;
          if (
            (h > o ? (p = "") : (p = i[h + 1].toLowerCase()), n & 2 && c !== p)
          ) {
            if (We(n)) return !1;
            s = !0;
          }
        }
      }
  }
  return We(n) || s;
}
function We(e) {
  return (e & 1) === 0;
}
function nm(e, t, r, n) {
  if (t === null) return -1;
  let i = 0;
  if (n || !r) {
    let o = !1;
    for (; i < t.length; ) {
      let s = t[i];
      if (s === e) return i;
      if (s === 3 || s === 6) o = !0;
      else if (s === 1 || s === 2) {
        let a = t[++i];
        for (; typeof a == "string"; ) a = t[++i];
        continue;
      } else {
        if (s === 4) break;
        if (s === 0) {
          i += 4;
          continue;
        }
      }
      i += o ? 1 : 2;
    }
    return -1;
  } else return om(t, e);
}
function rm(e, t, r = !1) {
  for (let n = 0; n < t.length; n++) if (tm(e, t[n], r)) return !0;
  return !1;
}
function im(e) {
  for (let t = 0; t < e.length; t++) {
    let r = e[t];
    if (Qg(r)) return t;
  }
  return e.length;
}
function om(e, t) {
  let r = e.indexOf(4);
  if (r > -1)
    for (r++; r < e.length; ) {
      let n = e[r];
      if (typeof n == "number") return -1;
      if (n === t) return r;
      r++;
    }
  return -1;
}
function Mu(e, t) {
  return e ? ":not(" + t.trim() + ")" : t;
}
function sm(e) {
  let t = e[0],
    r = 1,
    n = 2,
    i = "",
    o = !1;
  for (; r < e.length; ) {
    let s = e[r];
    if (typeof s == "string")
      if (n & 2) {
        let a = e[++r];
        i += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
      } else n & 8 ? (i += "." + s) : n & 4 && (i += " " + s);
    else
      i !== "" && !We(s) && ((t += Mu(o, i)), (i = "")),
        (n = s),
        (o = o || !We(n));
    r++;
  }
  return i !== "" && (t += Mu(o, i)), t;
}
function am(e) {
  return e.map(sm).join(",");
}
function lm(e) {
  let t = [],
    r = [],
    n = 1,
    i = 2;
  for (; n < e.length; ) {
    let o = e[n];
    if (typeof o == "string")
      i === 2 ? o !== "" && t.push(o, e[++n]) : i === 8 && r.push(o);
    else {
      if (!We(i)) break;
      i = o;
    }
    n++;
  }
  return { attrs: t, classes: r };
}
function G(e) {
  return so(() => {
    let t = gd(e),
      r = K(C({}, t), {
        decls: e.decls,
        vars: e.vars,
        template: e.template,
        consts: e.consts || null,
        ngContentSelectors: e.ngContentSelectors,
        onPush: e.changeDetection === cd.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (t.standalone && e.dependencies) || null,
        getStandaloneInjector: null,
        signals: e.signals ?? !1,
        data: e.data || {},
        encapsulation: e.encapsulation || nt.Emulated,
        styles: e.styles || je,
        _: null,
        schemas: e.schemas || null,
        tView: null,
        id: "",
      });
    md(r);
    let n = e.dependencies;
    return (
      (r.directiveDefs = xu(n, !1)), (r.pipeDefs = xu(n, !0)), (r.id = dm(r)), r
    );
  });
}
function cm(e) {
  return Yt(e) || dd(e);
}
function um(e) {
  return e !== null;
}
function kt(e) {
  return so(() => ({
    type: e.type,
    bootstrap: e.bootstrap || je,
    declarations: e.declarations || je,
    imports: e.imports || je,
    exports: e.exports || je,
    transitiveCompileScopes: null,
    schemas: e.schemas || null,
    id: e.id || null,
  }));
}
function Eu(e, t) {
  if (e == null) return An;
  let r = {};
  for (let n in e)
    if (e.hasOwnProperty(n)) {
      let i = e[n],
        o,
        s,
        a = Me.None;
      Array.isArray(i)
        ? ((a = i[0]), (o = i[1]), (s = i[2] ?? o))
        : ((o = i), (s = i)),
        t ? ((r[o] = a !== Me.None ? [n, a] : n), (t[o] = s)) : (r[o] = n);
    }
  return r;
}
function ce(e) {
  return so(() => {
    let t = gd(e);
    return md(t), t;
  });
}
function Yt(e) {
  return e[Pg] || null;
}
function dd(e) {
  return e[Ag] || null;
}
function fd(e) {
  return e[Ng] || null;
}
function hd(e) {
  let t = Yt(e) || dd(e) || fd(e);
  return t !== null ? t.standalone : !1;
}
function pd(e, t) {
  let r = e[kg] || null;
  if (!r && t === !0)
    throw new Error(`Type ${_e(e)} does not have '\u0275mod' property.`);
  return r;
}
function gd(e) {
  let t = {};
  return {
    type: e.type,
    providersResolver: null,
    factory: null,
    hostBindings: e.hostBindings || null,
    hostVars: e.hostVars || 0,
    hostAttrs: e.hostAttrs || null,
    contentQueries: e.contentQueries || null,
    declaredInputs: t,
    inputTransforms: null,
    inputConfig: e.inputs || An,
    exportAs: e.exportAs || null,
    standalone: e.standalone === !0,
    signals: e.signals === !0,
    selectors: e.selectors || je,
    viewQuery: e.viewQuery || null,
    features: e.features || null,
    setInput: null,
    findHostDirectiveDefs: null,
    hostDirectives: null,
    inputs: Eu(e.inputs, t),
    outputs: Eu(e.outputs),
    debugInfo: null,
  };
}
function md(e) {
  e.features?.forEach((t) => t(e));
}
function xu(e, t) {
  if (!e) return null;
  let r = t ? fd : cm;
  return () => (typeof e == "function" ? e() : e).map((n) => r(n)).filter(um);
}
function dm(e) {
  let t = 0,
    r = [
      e.selectors,
      e.ngContentSelectors,
      e.hostVars,
      e.hostAttrs,
      e.consts,
      e.vars,
      e.decls,
      e.encapsulation,
      e.standalone,
      e.signals,
      e.exportAs,
      JSON.stringify(e.inputs),
      JSON.stringify(e.outputs),
      Object.getOwnPropertyNames(e.type.prototype),
      !!e.contentQueries,
      !!e.viewQuery,
    ].join("|");
  for (let i of r) t = (Math.imul(31, t) + i.charCodeAt(0)) << 0;
  return (t += 2147483648), "c" + t;
}
function zn(e) {
  return { ɵproviders: e };
}
function fm(...e) {
  return { ɵproviders: vd(!0, e), ɵfromNgModule: !0 };
}
function vd(e, ...t) {
  let r = [],
    n = new Set(),
    i,
    o = (s) => {
      r.push(s);
    };
  return (
    Ba(t, (s) => {
      let a = s;
      ra(a, o, [], n) && ((i ||= []), i.push(a));
    }),
    i !== void 0 && yd(i, o),
    r
  );
}
function yd(e, t) {
  for (let r = 0; r < e.length; r++) {
    let { ngModule: n, providers: i } = e[r];
    Ha(i, (o) => {
      t(o, n);
    });
  }
}
function ra(e, t, r, n) {
  if (((e = Ce(e)), !e)) return !1;
  let i = null,
    o = wu(e),
    s = !o && Yt(e);
  if (!o && !s) {
    let l = e.ngModule;
    if (((o = wu(l)), o)) i = l;
    else return !1;
  } else {
    if (s && !s.standalone) return !1;
    i = e;
  }
  let a = n.has(i);
  if (s) {
    if (a) return !1;
    if ((n.add(i), s.dependencies)) {
      let l =
        typeof s.dependencies == "function" ? s.dependencies() : s.dependencies;
      for (let c of l) ra(c, t, r, n);
    }
  } else if (o) {
    if (o.imports != null && !a) {
      n.add(i);
      let c;
      try {
        Ba(o.imports, (h) => {
          ra(h, t, r, n) && ((c ||= []), c.push(h));
        });
      } finally {
      }
      c !== void 0 && yd(c, t);
    }
    if (!a) {
      let c = Pn(i) || (() => new i());
      t({ provide: i, useFactory: c, deps: je }, i),
        t({ provide: ld, useValue: i, multi: !0 }, i),
        t({ provide: Nn, useValue: () => P(i), multi: !0 }, i);
    }
    let l = o.providers;
    if (l != null && !a) {
      let c = e;
      Ha(l, (h) => {
        t(h, c);
      });
    }
  } else return !1;
  return i !== e && e.providers !== void 0;
}
function Ha(e, t) {
  for (let r of e)
    rd(r) && (r = r.ɵproviders), Array.isArray(r) ? Ha(r, t) : t(r);
}
var hm = Z({ provide: String, useValue: Z });
function wd(e) {
  return e !== null && typeof e == "object" && hm in e;
}
function pm(e) {
  return !!(e && e.useExisting);
}
function gm(e) {
  return !!(e && e.useFactory);
}
function kn(e) {
  return typeof e == "function";
}
function mm(e) {
  return !!e.useClass;
}
var co = new x(""),
  Fi = {},
  vm = {},
  js;
function Ga() {
  return js === void 0 && (js = new $i()), js;
}
var Ee = class {},
  mr = class extends Ee {
    get destroyed() {
      return this._destroyed;
    }
    constructor(t, r, n, i) {
      super(),
        (this.parent = r),
        (this.source = n),
        (this.scopes = i),
        (this.records = new Map()),
        (this._ngOnDestroyHooks = new Set()),
        (this._onDestroyHooks = []),
        (this._destroyed = !1),
        oa(t, (s) => this.processProvider(s)),
        this.records.set(ad, En(void 0, this)),
        i.has("environment") && this.records.set(Ee, En(void 0, this));
      let o = this.records.get(co);
      o != null && typeof o.value == "string" && this.scopes.add(o.value),
        (this.injectorDefTypes = new Set(this.get(ld, je, L.Self)));
    }
    destroy() {
      this.assertNotDestroyed(), (this._destroyed = !0);
      let t = U(null);
      try {
        for (let n of this._ngOnDestroyHooks) n.ngOnDestroy();
        let r = this._onDestroyHooks;
        this._onDestroyHooks = [];
        for (let n of r) n();
      } finally {
        this.records.clear(),
          this._ngOnDestroyHooks.clear(),
          this.injectorDefTypes.clear(),
          U(t);
      }
    }
    onDestroy(t) {
      return (
        this.assertNotDestroyed(),
        this._onDestroyHooks.push(t),
        () => this.removeOnDestroy(t)
      );
    }
    runInContext(t) {
      this.assertNotDestroyed();
      let r = Ot(this),
        n = Ve(void 0),
        i;
      try {
        return t();
      } finally {
        Ot(r), Ve(n);
      }
    }
    get(t, r = pr, n = L.Default) {
      if ((this.assertNotDestroyed(), t.hasOwnProperty(bu))) return t[bu](this);
      n = lo(n);
      let i,
        o = Ot(this),
        s = Ve(void 0);
      try {
        if (!(n & L.SkipSelf)) {
          let l = this.records.get(t);
          if (l === void 0) {
            let c = Dm(t) && ao(t);
            c && this.injectableDefInScope(c)
              ? (l = En(ia(t), Fi))
              : (l = null),
              this.records.set(t, l);
          }
          if (l != null) return this.hydrate(t, l);
        }
        let a = n & L.Self ? Ga() : this.parent;
        return (r = n & L.Optional && r === pr ? null : r), a.get(t, r);
      } catch (a) {
        if (a.name === "NullInjectorError") {
          if (((a[Ui] = a[Ui] || []).unshift(_e(t)), o)) throw a;
          return Gg(a, t, "R3InjectorError", this.source);
        } else throw a;
      } finally {
        Ve(s), Ot(o);
      }
    }
    resolveInjectorInitializers() {
      let t = U(null),
        r = Ot(this),
        n = Ve(void 0),
        i;
      try {
        let o = this.get(Nn, je, L.Self);
        for (let s of o) s();
      } finally {
        Ot(r), Ve(n), U(t);
      }
    }
    toString() {
      let t = [],
        r = this.records;
      for (let n of r.keys()) t.push(_e(n));
      return `R3Injector[${t.join(", ")}]`;
    }
    assertNotDestroyed() {
      if (this._destroyed) throw new M(205, !1);
    }
    processProvider(t) {
      t = Ce(t);
      let r = kn(t) ? t : Ce(t && t.provide),
        n = wm(t);
      if (!kn(t) && t.multi === !0) {
        let i = this.records.get(r);
        i ||
          ((i = En(void 0, Fi, !0)),
          (i.factory = () => ta(i.multi)),
          this.records.set(r, i)),
          (r = t),
          i.multi.push(t);
      }
      this.records.set(r, n);
    }
    hydrate(t, r) {
      let n = U(null);
      try {
        return (
          r.value === Fi && ((r.value = vm), (r.value = r.factory())),
          typeof r.value == "object" &&
            r.value &&
            bm(r.value) &&
            this._ngOnDestroyHooks.add(r.value),
          r.value
        );
      } finally {
        U(n);
      }
    }
    injectableDefInScope(t) {
      if (!t.providedIn) return !1;
      let r = Ce(t.providedIn);
      return typeof r == "string"
        ? r === "any" || this.scopes.has(r)
        : this.injectorDefTypes.has(r);
    }
    removeOnDestroy(t) {
      let r = this._onDestroyHooks.indexOf(t);
      r !== -1 && this._onDestroyHooks.splice(r, 1);
    }
  };
function ia(e) {
  let t = ao(e),
    r = t !== null ? t.factory : Pn(e);
  if (r !== null) return r;
  if (e instanceof x) throw new M(204, !1);
  if (e instanceof Function) return ym(e);
  throw new M(204, !1);
}
function ym(e) {
  if (e.length > 0) throw new M(204, !1);
  let r = Og(e);
  return r !== null ? () => r.factory(e) : () => new e();
}
function wm(e) {
  if (wd(e)) return En(void 0, e.useValue);
  {
    let t = Cd(e);
    return En(t, Fi);
  }
}
function Cd(e, t, r) {
  let n;
  if (kn(e)) {
    let i = Ce(e);
    return Pn(i) || ia(i);
  } else if (wd(e)) n = () => Ce(e.useValue);
  else if (gm(e)) n = () => e.useFactory(...ta(e.deps || []));
  else if (pm(e)) n = () => P(Ce(e.useExisting));
  else {
    let i = Ce(e && (e.useClass || e.provide));
    if (Cm(e)) n = () => new i(...ta(e.deps));
    else return Pn(i) || ia(i);
  }
  return n;
}
function En(e, t, r = !1) {
  return { factory: e, value: t, multi: r ? [] : void 0 };
}
function Cm(e) {
  return !!e.deps;
}
function bm(e) {
  return (
    e !== null && typeof e == "object" && typeof e.ngOnDestroy == "function"
  );
}
function Dm(e) {
  return typeof e == "function" || (typeof e == "object" && e instanceof x);
}
function oa(e, t) {
  for (let r of e)
    Array.isArray(r) ? oa(r, t) : r && rd(r) ? oa(r.ɵproviders, t) : t(r);
}
function mt(e, t) {
  e instanceof mr && e.assertNotDestroyed();
  let r,
    n = Ot(e),
    i = Ve(void 0);
  try {
    return t();
  } finally {
    Ot(n), Ve(i);
  }
}
function _m() {
  return id() !== void 0 || Bg() != null;
}
function Mm(e) {
  return typeof e == "function";
}
var vt = 0,
  F = 1,
  I = 2,
  we = 3,
  qe = 4,
  Qe = 5,
  vr = 6,
  yr = 7,
  ye = 8,
  Fn = 9,
  Ze = 10,
  ie = 11,
  wr = 12,
  Iu = 13,
  Un = 14,
  Ke = 15,
  uo = 16,
  xn = 17,
  Rn = 18,
  fo = 19,
  bd = 20,
  Tt = 21,
  zs = 22,
  Qt = 23,
  ze = 25,
  Dd = 1;
var Jt = 7,
  Hi = 8,
  Gi = 9,
  be = 10,
  Wa = (function (e) {
    return (
      (e[(e.None = 0)] = "None"),
      (e[(e.HasTransplantedViews = 2)] = "HasTransplantedViews"),
      e
    );
  })(Wa || {});
function Zt(e) {
  return Array.isArray(e) && typeof e[Dd] == "object";
}
function yt(e) {
  return Array.isArray(e) && e[Dd] === !0;
}
function _d(e) {
  return (e.flags & 4) !== 0;
}
function ho(e) {
  return e.componentOffset > -1;
}
function qa(e) {
  return (e.flags & 1) === 1;
}
function Pt(e) {
  return !!e.template;
}
function Em(e) {
  return (e[I] & 512) !== 0;
}
var sa = class {
  constructor(t, r, n) {
    (this.previousValue = t), (this.currentValue = r), (this.firstChange = n);
  }
  isFirstChange() {
    return this.firstChange;
  }
};
function Md(e, t, r, n) {
  t !== null ? t.applyValueToInputSignal(t, n) : (e[r] = n);
}
function rn() {
  return Ed;
}
function Ed(e) {
  return e.type.prototype.ngOnChanges && (e.setInput = Im), xm;
}
rn.ngInherit = !0;
function xm() {
  let e = Id(this),
    t = e?.current;
  if (t) {
    let r = e.previous;
    if (r === An) e.previous = t;
    else for (let n in t) r[n] = t[n];
    (e.current = null), this.ngOnChanges(t);
  }
}
function Im(e, t, r, n, i) {
  let o = this.declaredInputs[n],
    s = Id(e) || Sm(e, { previous: An, current: null }),
    a = s.current || (s.current = {}),
    l = s.previous,
    c = l[o];
  (a[o] = new sa(c && c.currentValue, r, l === An)), Md(e, t, i, r);
}
var xd = "__ngSimpleChanges__";
function Id(e) {
  return e[xd] || null;
}
function Sm(e, t) {
  return (e[xd] = t);
}
var Su = null;
var et = function (e, t, r) {
    Su?.(e, t, r);
  },
  Om = "svg",
  Tm = "math",
  Pm = !1;
function Am() {
  return Pm;
}
function rt(e) {
  for (; Array.isArray(e); ) e = e[vt];
  return e;
}
function Sd(e, t) {
  return rt(t[e]);
}
function Ue(e, t) {
  return rt(t[e.index]);
}
function Za(e, t) {
  return e.data[t];
}
function Nm(e, t) {
  return e[t];
}
function Ft(e, t) {
  let r = t[e];
  return Zt(r) ? r : r[vt];
}
function Ka(e) {
  return (e[I] & 128) === 128;
}
function km(e) {
  return yt(e[we]);
}
function Wi(e, t) {
  return t == null ? null : e[t];
}
function Od(e) {
  e[xn] = 0;
}
function Fm(e) {
  e[I] & 1024 || ((e[I] |= 1024), Ka(e) && Cr(e));
}
function Rm(e, t) {
  for (; e > 0; ) (t = t[Un]), e--;
  return t;
}
function Ya(e) {
  return !!(e[I] & 9216 || e[Qt]?.dirty);
}
function aa(e) {
  e[Ze].changeDetectionScheduler?.notify(1),
    Ya(e)
      ? Cr(e)
      : e[I] & 64 &&
        (Am()
          ? ((e[I] |= 1024), Cr(e))
          : e[Ze].changeDetectionScheduler?.notify());
}
function Cr(e) {
  e[Ze].changeDetectionScheduler?.notify();
  let t = br(e);
  for (; t !== null && !(t[I] & 8192 || ((t[I] |= 8192), !Ka(t))); ) t = br(t);
}
function Td(e, t) {
  if ((e[I] & 256) === 256) throw new M(911, !1);
  e[Tt] === null && (e[Tt] = []), e[Tt].push(t);
}
function Lm(e, t) {
  if (e[Tt] === null) return;
  let r = e[Tt].indexOf(t);
  r !== -1 && e[Tt].splice(r, 1);
}
function br(e) {
  let t = e[we];
  return yt(t) ? t[we] : t;
}
var R = { lFrame: Vd(null), bindingsEnabled: !0, skipHydrationRootTNode: null };
function Vm() {
  return R.lFrame.elementDepthCount;
}
function jm() {
  R.lFrame.elementDepthCount++;
}
function zm() {
  R.lFrame.elementDepthCount--;
}
function Pd() {
  return R.bindingsEnabled;
}
function Um() {
  return R.skipHydrationRootTNode !== null;
}
function Bm(e) {
  return R.skipHydrationRootTNode === e;
}
function $m() {
  R.skipHydrationRootTNode = null;
}
function H() {
  return R.lFrame.lView;
}
function xe() {
  return R.lFrame.tView;
}
function oe(e) {
  return (R.lFrame.contextLView = e), e[ye];
}
function se(e) {
  return (R.lFrame.contextLView = null), e;
}
function Be() {
  let e = Ad();
  for (; e !== null && e.type === 64; ) e = e.parent;
  return e;
}
function Ad() {
  return R.lFrame.currentTNode;
}
function Hm() {
  let e = R.lFrame,
    t = e.currentTNode;
  return e.isParent ? t : t.parent;
}
function Tr(e, t) {
  let r = R.lFrame;
  (r.currentTNode = e), (r.isParent = t);
}
function Nd() {
  return R.lFrame.isParent;
}
function Gm() {
  R.lFrame.isParent = !1;
}
function Wm() {
  return R.lFrame.contextLView;
}
function qm() {
  let e = R.lFrame,
    t = e.bindingRootIndex;
  return t === -1 && (t = e.bindingRootIndex = e.tView.bindingStartIndex), t;
}
function Zm() {
  return R.lFrame.bindingIndex;
}
function Km(e) {
  return (R.lFrame.bindingIndex = e);
}
function Bn() {
  return R.lFrame.bindingIndex++;
}
function kd(e) {
  let t = R.lFrame,
    r = t.bindingIndex;
  return (t.bindingIndex = t.bindingIndex + e), r;
}
function Ym() {
  return R.lFrame.inI18n;
}
function Qm(e, t) {
  let r = R.lFrame;
  (r.bindingIndex = r.bindingRootIndex = e), la(t);
}
function Jm() {
  return R.lFrame.currentDirectiveIndex;
}
function la(e) {
  R.lFrame.currentDirectiveIndex = e;
}
function Xm(e) {
  let t = R.lFrame.currentDirectiveIndex;
  return t === -1 ? null : e[t];
}
function Fd(e) {
  R.lFrame.currentQueryIndex = e;
}
function e0(e) {
  let t = e[F];
  return t.type === 2 ? t.declTNode : t.type === 1 ? e[Qe] : null;
}
function Rd(e, t, r) {
  if (r & L.SkipSelf) {
    let i = t,
      o = e;
    for (; (i = i.parent), i === null && !(r & L.Host); )
      if (((i = e0(o)), i === null || ((o = o[Un]), i.type & 10))) break;
    if (i === null) return !1;
    (t = i), (e = o);
  }
  let n = (R.lFrame = Ld());
  return (n.currentTNode = t), (n.lView = e), !0;
}
function Qa(e) {
  let t = Ld(),
    r = e[F];
  (R.lFrame = t),
    (t.currentTNode = r.firstChild),
    (t.lView = e),
    (t.tView = r),
    (t.contextLView = e),
    (t.bindingIndex = r.bindingStartIndex),
    (t.inI18n = !1);
}
function Ld() {
  let e = R.lFrame,
    t = e === null ? null : e.child;
  return t === null ? Vd(e) : t;
}
function Vd(e) {
  let t = {
    currentTNode: null,
    isParent: !0,
    lView: null,
    tView: null,
    selectedIndex: -1,
    contextLView: null,
    elementDepthCount: 0,
    currentNamespace: null,
    currentDirectiveIndex: -1,
    bindingRootIndex: -1,
    bindingIndex: -1,
    currentQueryIndex: 0,
    parent: e,
    child: null,
    inI18n: !1,
  };
  return e !== null && (e.child = t), t;
}
function jd() {
  let e = R.lFrame;
  return (R.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e;
}
var zd = jd;
function Ja() {
  let e = jd();
  (e.isParent = !0),
    (e.tView = null),
    (e.selectedIndex = -1),
    (e.contextLView = null),
    (e.elementDepthCount = 0),
    (e.currentDirectiveIndex = -1),
    (e.currentNamespace = null),
    (e.bindingRootIndex = -1),
    (e.bindingIndex = -1),
    (e.currentQueryIndex = 0);
}
function t0(e) {
  return (R.lFrame.contextLView = Rm(e, R.lFrame.contextLView))[ye];
}
function Rt() {
  return R.lFrame.selectedIndex;
}
function Xt(e) {
  R.lFrame.selectedIndex = e;
}
function po() {
  let e = R.lFrame;
  return Za(e.tView, e.selectedIndex);
}
function n0() {
  return R.lFrame.currentNamespace;
}
var Ud = !0;
function Xa() {
  return Ud;
}
function el(e) {
  Ud = e;
}
function r0(e, t, r) {
  let { ngOnChanges: n, ngOnInit: i, ngDoCheck: o } = t.type.prototype;
  if (n) {
    let s = Ed(t);
    (r.preOrderHooks ??= []).push(e, s),
      (r.preOrderCheckHooks ??= []).push(e, s);
  }
  i && (r.preOrderHooks ??= []).push(0 - e, i),
    o &&
      ((r.preOrderHooks ??= []).push(e, o),
      (r.preOrderCheckHooks ??= []).push(e, o));
}
function tl(e, t) {
  for (let r = t.directiveStart, n = t.directiveEnd; r < n; r++) {
    let o = e.data[r].type.prototype,
      {
        ngAfterContentInit: s,
        ngAfterContentChecked: a,
        ngAfterViewInit: l,
        ngAfterViewChecked: c,
        ngOnDestroy: h,
      } = o;
    s && (e.contentHooks ??= []).push(-r, s),
      a &&
        ((e.contentHooks ??= []).push(r, a),
        (e.contentCheckHooks ??= []).push(r, a)),
      l && (e.viewHooks ??= []).push(-r, l),
      c &&
        ((e.viewHooks ??= []).push(r, c), (e.viewCheckHooks ??= []).push(r, c)),
      h != null && (e.destroyHooks ??= []).push(r, h);
  }
}
function Ri(e, t, r) {
  Bd(e, t, 3, r);
}
function Li(e, t, r, n) {
  (e[I] & 3) === r && Bd(e, t, r, n);
}
function Us(e, t) {
  let r = e[I];
  (r & 3) === t && ((r &= 16383), (r += 1), (e[I] = r));
}
function Bd(e, t, r, n) {
  let i = n !== void 0 ? e[xn] & 65535 : 0,
    o = n ?? -1,
    s = t.length - 1,
    a = 0;
  for (let l = i; l < s; l++)
    if (typeof t[l + 1] == "number") {
      if (((a = t[l]), n != null && a >= n)) break;
    } else
      t[l] < 0 && (e[xn] += 65536),
        (a < o || o == -1) &&
          (i0(e, r, t, l), (e[xn] = (e[xn] & 4294901760) + l + 2)),
        l++;
}
function Ou(e, t) {
  et(4, e, t);
  let r = U(null);
  try {
    t.call(e);
  } finally {
    U(r), et(5, e, t);
  }
}
function i0(e, t, r, n) {
  let i = r[n] < 0,
    o = r[n + 1],
    s = i ? -r[n] : r[n],
    a = e[s];
  i
    ? e[I] >> 14 < e[xn] >> 16 &&
      (e[I] & 3) === t &&
      ((e[I] += 16384), Ou(a, o))
    : Ou(a, o);
}
var On = -1,
  en = class {
    constructor(t, r, n) {
      (this.factory = t),
        (this.resolving = !1),
        (this.canSeeViewProviders = r),
        (this.injectImpl = n);
    }
  };
function o0(e) {
  return e instanceof en;
}
function s0(e) {
  return (e.flags & 8) !== 0;
}
function a0(e) {
  return (e.flags & 16) !== 0;
}
function $d(e) {
  return e !== On;
}
function qi(e) {
  return e & 32767;
}
function l0(e) {
  return e >> 16;
}
function Zi(e, t) {
  let r = l0(e),
    n = t;
  for (; r > 0; ) (n = n[Un]), r--;
  return n;
}
var ca = !0;
function Tu(e) {
  let t = ca;
  return (ca = e), t;
}
var c0 = 256,
  Hd = c0 - 1,
  Gd = 5,
  u0 = 0,
  tt = {};
function d0(e, t, r) {
  let n;
  typeof r == "string"
    ? (n = r.charCodeAt(0) || 0)
    : r.hasOwnProperty(hr) && (n = r[hr]),
    n == null && (n = r[hr] = u0++);
  let i = n & Hd,
    o = 1 << i;
  t.data[e + (i >> Gd)] |= o;
}
function Ki(e, t) {
  let r = Wd(e, t);
  if (r !== -1) return r;
  let n = t[F];
  n.firstCreatePass &&
    ((e.injectorIndex = t.length),
    Bs(n.data, e),
    Bs(t, null),
    Bs(n.blueprint, null));
  let i = nl(e, t),
    o = e.injectorIndex;
  if ($d(i)) {
    let s = qi(i),
      a = Zi(i, t),
      l = a[F].data;
    for (let c = 0; c < 8; c++) t[o + c] = a[s + c] | l[s + c];
  }
  return (t[o + 8] = i), o;
}
function Bs(e, t) {
  e.push(0, 0, 0, 0, 0, 0, 0, 0, t);
}
function Wd(e, t) {
  return e.injectorIndex === -1 ||
    (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
    t[e.injectorIndex + 8] === null
    ? -1
    : e.injectorIndex;
}
function nl(e, t) {
  if (e.parent && e.parent.injectorIndex !== -1) return e.parent.injectorIndex;
  let r = 0,
    n = null,
    i = t;
  for (; i !== null; ) {
    if (((n = Qd(i)), n === null)) return On;
    if ((r++, (i = i[Un]), n.injectorIndex !== -1))
      return n.injectorIndex | (r << 16);
  }
  return On;
}
function ua(e, t, r) {
  d0(e, t, r);
}
function qd(e, t, r) {
  if (r & L.Optional || e !== void 0) return e;
  Ua(t, "NodeInjector");
}
function Zd(e, t, r, n) {
  if (
    (r & L.Optional && n === void 0 && (n = null), !(r & (L.Self | L.Host)))
  ) {
    let i = e[Fn],
      o = Ve(void 0);
    try {
      return i ? i.get(t, n, r & L.Optional) : od(t, n, r & L.Optional);
    } finally {
      Ve(o);
    }
  }
  return qd(n, t, r);
}
function Kd(e, t, r, n = L.Default, i) {
  if (e !== null) {
    if (t[I] & 2048 && !(n & L.Self)) {
      let s = m0(e, t, r, n, tt);
      if (s !== tt) return s;
    }
    let o = Yd(e, t, r, n, tt);
    if (o !== tt) return o;
  }
  return Zd(t, r, n, i);
}
function Yd(e, t, r, n, i) {
  let o = p0(r);
  if (typeof o == "function") {
    if (!Rd(t, e, n)) return n & L.Host ? qd(i, r, n) : Zd(t, r, n, i);
    try {
      let s;
      if (((s = o(n)), s == null && !(n & L.Optional))) Ua(r);
      else return s;
    } finally {
      zd();
    }
  } else if (typeof o == "number") {
    let s = null,
      a = Wd(e, t),
      l = On,
      c = n & L.Host ? t[Ke][Qe] : null;
    for (
      (a === -1 || n & L.SkipSelf) &&
      ((l = a === -1 ? nl(e, t) : t[a + 8]),
      l === On || !Au(n, !1)
        ? (a = -1)
        : ((s = t[F]), (a = qi(l)), (t = Zi(l, t))));
      a !== -1;

    ) {
      let h = t[F];
      if (Pu(o, a, h.data)) {
        let p = f0(a, t, r, s, n, c);
        if (p !== tt) return p;
      }
      (l = t[a + 8]),
        l !== On && Au(n, t[F].data[a + 8] === c) && Pu(o, a, t)
          ? ((s = h), (a = qi(l)), (t = Zi(l, t)))
          : (a = -1);
    }
  }
  return i;
}
function f0(e, t, r, n, i, o) {
  let s = t[F],
    a = s.data[e + 8],
    l = n == null ? ho(a) && ca : n != s && (a.type & 3) !== 0,
    c = i & L.Host && o === a,
    h = h0(a, s, r, l, c);
  return h !== null ? Ln(t, s, h, a) : tt;
}
function h0(e, t, r, n, i) {
  let o = e.providerIndexes,
    s = t.data,
    a = o & 1048575,
    l = e.directiveStart,
    c = e.directiveEnd,
    h = o >> 20,
    p = n ? a : a + h,
    g = i ? a + h : c;
  for (let m = p; m < g; m++) {
    let w = s[m];
    if ((m < l && r === w) || (m >= l && w.type === r)) return m;
  }
  if (i) {
    let m = s[l];
    if (m && Pt(m) && m.type === r) return l;
  }
  return null;
}
function Ln(e, t, r, n) {
  let i = e[r],
    o = t.data;
  if (o0(i)) {
    let s = i;
    s.resolving && Rg(Fg(o[r]));
    let a = Tu(s.canSeeViewProviders);
    s.resolving = !0;
    let l,
      c = s.injectImpl ? Ve(s.injectImpl) : null,
      h = Rd(e, n, L.Default);
    try {
      (i = e[r] = s.factory(void 0, o, e, n)),
        t.firstCreatePass && r >= n.directiveStart && r0(r, o[r], t);
    } finally {
      c !== null && Ve(c), Tu(a), (s.resolving = !1), zd();
    }
  }
  return i;
}
function p0(e) {
  if (typeof e == "string") return e.charCodeAt(0) || 0;
  let t = e.hasOwnProperty(hr) ? e[hr] : void 0;
  return typeof t == "number" ? (t >= 0 ? t & Hd : g0) : t;
}
function Pu(e, t, r) {
  let n = 1 << e;
  return !!(r[t + (e >> Gd)] & n);
}
function Au(e, t) {
  return !(e & L.Self) && !(e & L.Host && t);
}
var Kt = class {
  constructor(t, r) {
    (this._tNode = t), (this._lView = r);
  }
  get(t, r, n) {
    return Kd(this._tNode, this._lView, t, lo(n), r);
  }
};
function g0() {
  return new Kt(Be(), H());
}
function ot(e) {
  return so(() => {
    let t = e.prototype.constructor,
      r = t[zi] || da(t),
      n = Object.prototype,
      i = Object.getPrototypeOf(e.prototype).constructor;
    for (; i && i !== n; ) {
      let o = i[zi] || da(i);
      if (o && o !== r) return o;
      i = Object.getPrototypeOf(i);
    }
    return (o) => new o();
  });
}
function da(e) {
  return Xu(e)
    ? () => {
        let t = da(Ce(e));
        return t && t();
      }
    : Pn(e);
}
function m0(e, t, r, n, i) {
  let o = e,
    s = t;
  for (; o !== null && s !== null && s[I] & 2048 && !(s[I] & 512); ) {
    let a = Yd(o, s, r, n | L.Self, tt);
    if (a !== tt) return a;
    let l = o.parent;
    if (!l) {
      let c = s[bd];
      if (c) {
        let h = c.get(r, tt, n);
        if (h !== tt) return h;
      }
      (l = Qd(s)), (s = s[Un]);
    }
    o = l;
  }
  return i;
}
function Qd(e) {
  let t = e[F],
    r = t.type;
  return r === 2 ? t.declTNode : r === 1 ? e[Qe] : null;
}
function Nu(e, t = null, r = null, n) {
  let i = Jd(e, t, r, n);
  return i.resolveInjectorInitializers(), i;
}
function Jd(e, t = null, r = null, n, i = new Set()) {
  let o = [r || je, fm(e)];
  return (
    (n = n || (typeof e == "object" ? void 0 : _e(e))),
    new mr(o, t || Ga(), n || null, i)
  );
}
var $n = (() => {
  let t = class t {
    static create(n, i) {
      if (Array.isArray(n)) return Nu({ name: "" }, i, n, "");
      {
        let o = n.name ?? "";
        return Nu({ name: o }, n.parent, n.providers, o);
      }
    }
  };
  (t.THROW_IF_NOT_FOUND = pr),
    (t.NULL = new $i()),
    (t.ɵprov = E({ token: t, providedIn: "any", factory: () => P(ad) })),
    (t.__NG_ELEMENT_ID__ = -1);
  let e = t;
  return e;
})();
var v0 = "ngOriginalError";
function $s(e) {
  return e[v0];
}
var pt = class {
    constructor() {
      this._console = console;
    }
    handleError(t) {
      let r = this._findOriginalError(t);
      this._console.error("ERROR", t),
        r && this._console.error("ORIGINAL ERROR", r);
    }
    _findOriginalError(t) {
      let r = t && $s(t);
      for (; r && $s(r); ) r = $s(r);
      return r || null;
    }
  },
  Xd = new x("", {
    providedIn: "root",
    factory: () => v(pt).handleError.bind(void 0),
  }),
  ef = (() => {
    let t = class t {};
    (t.__NG_ELEMENT_ID__ = y0), (t.__NG_ENV_ID__ = (n) => n);
    let e = t;
    return e;
  })(),
  fa = class extends ef {
    constructor(t) {
      super(), (this._lView = t);
    }
    onDestroy(t) {
      return Td(this._lView, t), () => Lm(this._lView, t);
    }
  };
function y0() {
  return new fa(H());
}
function w0() {
  return rl(Be(), H());
}
function rl(e, t) {
  return new Lt(Ue(e, t));
}
var Lt = (() => {
  let t = class t {
    constructor(n) {
      this.nativeElement = n;
    }
  };
  t.__NG_ELEMENT_ID__ = w0;
  let e = t;
  return e;
})();
var ha = class extends ne {
  constructor(t = !1) {
    super(),
      (this.destroyRef = void 0),
      (this.__isAsync = t),
      _m() && (this.destroyRef = v(ef, { optional: !0 }) ?? void 0);
  }
  emit(t) {
    let r = U(null);
    try {
      super.next(t);
    } finally {
      U(r);
    }
  }
  subscribe(t, r, n) {
    let i = t,
      o = r || (() => null),
      s = n;
    if (t && typeof t == "object") {
      let l = t;
      (i = l.next?.bind(l)), (o = l.error?.bind(l)), (s = l.complete?.bind(l));
    }
    this.__isAsync && ((o = Hs(o)), i && (i = Hs(i)), s && (s = Hs(s)));
    let a = super.subscribe({ next: i, error: o, complete: s });
    return t instanceof ae && t.add(a), a;
  }
};
function Hs(e) {
  return (t) => {
    setTimeout(e, void 0, t);
  };
}
var ve = ha;
function tf(e) {
  return (e.flags & 128) === 128;
}
var nf = new Map(),
  C0 = 0;
function b0() {
  return C0++;
}
function D0(e) {
  nf.set(e[fo], e);
}
function _0(e) {
  nf.delete(e[fo]);
}
var ku = "__ngContext__";
function tn(e, t) {
  Zt(t) ? ((e[ku] = t[fo]), D0(t)) : (e[ku] = t);
}
function rf(e) {
  return sf(e[wr]);
}
function of(e) {
  return sf(e[qe]);
}
function sf(e) {
  for (; e !== null && !yt(e); ) e = e[qe];
  return e;
}
var pa;
function af(e) {
  pa = e;
}
function M0() {
  if (pa !== void 0) return pa;
  if (typeof document < "u") return document;
  throw new M(210, !1);
}
var il = new x("", { providedIn: "root", factory: () => E0 }),
  E0 = "ng",
  ol = new x(""),
  Vt = new x("", { providedIn: "platform", factory: () => "unknown" });
var sl = new x("", {
  providedIn: "root",
  factory: () =>
    M0().body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") ||
    null,
});
var x0 = "h",
  I0 = "b";
var S0 = () => null;
function al(e, t, r = !1) {
  return S0(e, t, r);
}
var lf = !1,
  O0 = new x("", { providedIn: "root", factory: () => lf });
var Yi = class {
  constructor(t) {
    this.changingThisBreaksApplicationSecurity = t;
  }
  toString() {
    return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${Ju})`;
  }
};
function go(e) {
  return e instanceof Yi ? e.changingThisBreaksApplicationSecurity : e;
}
function cf(e, t) {
  let r = T0(e);
  if (r != null && r !== t) {
    if (r === "ResourceURL" && t === "URL") return !0;
    throw new Error(`Required a safe ${t}, got a ${r} (see ${Ju})`);
  }
  return r === t;
}
function T0(e) {
  return (e instanceof Yi && e.getTypeName()) || null;
}
var P0 = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
function uf(e) {
  return (e = String(e)), e.match(P0) ? e : "unsafe:" + e;
}
var ll = (function (e) {
  return (
    (e[(e.NONE = 0)] = "NONE"),
    (e[(e.HTML = 1)] = "HTML"),
    (e[(e.STYLE = 2)] = "STYLE"),
    (e[(e.SCRIPT = 3)] = "SCRIPT"),
    (e[(e.URL = 4)] = "URL"),
    (e[(e.RESOURCE_URL = 5)] = "RESOURCE_URL"),
    e
  );
})(ll || {});
function jt(e) {
  let t = A0();
  return t ? t.sanitize(ll.URL, e) || "" : cf(e, "URL") ? go(e) : uf(Tn(e));
}
function A0() {
  let e = H();
  return e && e[Ze].sanitizer;
}
function df(e) {
  return e instanceof Function ? e() : e;
}
var gt = (function (e) {
    return (
      (e[(e.Important = 1)] = "Important"),
      (e[(e.DashCase = 2)] = "DashCase"),
      e
    );
  })(gt || {}),
  N0;
function cl(e, t) {
  return N0(e, t);
}
function In(e, t, r, n, i) {
  if (n != null) {
    let o,
      s = !1;
    yt(n) ? (o = n) : Zt(n) && ((s = !0), (n = n[vt]));
    let a = rt(n);
    e === 0 && r !== null
      ? i == null
        ? gf(t, r, a)
        : Qi(t, r, a, i || null, !0)
      : e === 1 && r !== null
      ? Qi(t, r, a, i || null, !0)
      : e === 2
      ? Y0(t, a, s)
      : e === 3 && t.destroyNode(a),
      o != null && J0(t, e, o, r, i);
  }
}
function k0(e, t) {
  return e.createText(t);
}
function F0(e, t, r) {
  e.setValue(t, r);
}
function ff(e, t, r) {
  return e.createElement(t, r);
}
function R0(e, t) {
  hf(e, t), (t[vt] = null), (t[Qe] = null);
}
function L0(e, t, r, n, i, o) {
  (n[vt] = i), (n[Qe] = t), vo(e, n, r, 1, i, o);
}
function hf(e, t) {
  t[Ze].changeDetectionScheduler?.notify(1), vo(e, t, t[ie], 2, null, null);
}
function V0(e) {
  let t = e[wr];
  if (!t) return Gs(e[F], e);
  for (; t; ) {
    let r = null;
    if (Zt(t)) r = t[wr];
    else {
      let n = t[be];
      n && (r = n);
    }
    if (!r) {
      for (; t && !t[qe] && t !== e; ) Zt(t) && Gs(t[F], t), (t = t[we]);
      t === null && (t = e), Zt(t) && Gs(t[F], t), (r = t && t[qe]);
    }
    t = r;
  }
}
function j0(e, t, r, n) {
  let i = be + n,
    o = r.length;
  n > 0 && (r[i - 1][qe] = t),
    n < o - be
      ? ((t[qe] = r[i]), sd(r, be + n, t))
      : (r.push(t), (t[qe] = null)),
    (t[we] = r);
  let s = t[uo];
  s !== null && r !== s && z0(s, t);
  let a = t[Rn];
  a !== null && a.insertView(e), aa(t), (t[I] |= 128);
}
function z0(e, t) {
  let r = e[Gi],
    i = t[we][we][Ke];
  t[Ke] !== i && (e[I] |= Wa.HasTransplantedViews),
    r === null ? (e[Gi] = [t]) : r.push(t);
}
function pf(e, t) {
  let r = e[Gi],
    n = r.indexOf(t);
  r.splice(n, 1);
}
function Dr(e, t) {
  if (e.length <= be) return;
  let r = be + t,
    n = e[r];
  if (n) {
    let i = n[uo];
    i !== null && i !== e && pf(i, n), t > 0 && (e[r - 1][qe] = n[qe]);
    let o = Bi(e, be + t);
    R0(n[F], n);
    let s = o[Rn];
    s !== null && s.detachView(o[F]),
      (n[we] = null),
      (n[qe] = null),
      (n[I] &= -129);
  }
  return n;
}
function mo(e, t) {
  if (!(t[I] & 256)) {
    let r = t[ie];
    r.destroyNode && vo(e, t, r, 3, null, null), V0(t);
  }
}
function Gs(e, t) {
  if (t[I] & 256) return;
  let r = U(null);
  try {
    (t[I] &= -129),
      (t[I] |= 256),
      t[Qt] && Gc(t[Qt]),
      B0(e, t),
      U0(e, t),
      t[F].type === 1 && t[ie].destroy();
    let n = t[uo];
    if (n !== null && yt(t[we])) {
      n !== t[we] && pf(n, t);
      let i = t[Rn];
      i !== null && i.detachView(e);
    }
    _0(t);
  } finally {
    U(r);
  }
}
function U0(e, t) {
  let r = e.cleanup,
    n = t[yr];
  if (r !== null)
    for (let o = 0; o < r.length - 1; o += 2)
      if (typeof r[o] == "string") {
        let s = r[o + 3];
        s >= 0 ? n[s]() : n[-s].unsubscribe(), (o += 2);
      } else {
        let s = n[r[o + 1]];
        r[o].call(s);
      }
  n !== null && (t[yr] = null);
  let i = t[Tt];
  if (i !== null) {
    t[Tt] = null;
    for (let o = 0; o < i.length; o++) {
      let s = i[o];
      s();
    }
  }
}
function B0(e, t) {
  let r;
  if (e != null && (r = e.destroyHooks) != null)
    for (let n = 0; n < r.length; n += 2) {
      let i = t[r[n]];
      if (!(i instanceof en)) {
        let o = r[n + 1];
        if (Array.isArray(o))
          for (let s = 0; s < o.length; s += 2) {
            let a = i[o[s]],
              l = o[s + 1];
            et(4, a, l);
            try {
              l.call(a);
            } finally {
              et(5, a, l);
            }
          }
        else {
          et(4, i, o);
          try {
            o.call(i);
          } finally {
            et(5, i, o);
          }
        }
      }
    }
}
function $0(e, t, r) {
  return H0(e, t.parent, r);
}
function H0(e, t, r) {
  let n = t;
  for (; n !== null && n.type & 40; ) (t = n), (n = t.parent);
  if (n === null) return r[vt];
  {
    let { componentOffset: i } = n;
    if (i > -1) {
      let { encapsulation: o } = e.data[n.directiveStart + i];
      if (o === nt.None || o === nt.Emulated) return null;
    }
    return Ue(n, r);
  }
}
function Qi(e, t, r, n, i) {
  e.insertBefore(t, r, n, i);
}
function gf(e, t, r) {
  e.appendChild(t, r);
}
function Fu(e, t, r, n, i) {
  n !== null ? Qi(e, t, r, n, i) : gf(e, t, r);
}
function G0(e, t, r, n) {
  e.removeChild(t, r, n);
}
function ul(e, t) {
  return e.parentNode(t);
}
function W0(e, t) {
  return e.nextSibling(t);
}
function q0(e, t, r) {
  return K0(e, t, r);
}
function Z0(e, t, r) {
  return e.type & 40 ? Ue(e, r) : null;
}
var K0 = Z0,
  Ru;
function dl(e, t, r, n) {
  let i = $0(e, n, t),
    o = t[ie],
    s = n.parent || t[Qe],
    a = q0(s, n, t);
  if (i != null)
    if (Array.isArray(r))
      for (let l = 0; l < r.length; l++) Fu(o, i, r[l], a, !1);
    else Fu(o, i, r, a, !1);
  Ru !== void 0 && Ru(o, n, t, r, i);
}
function Vi(e, t) {
  if (t !== null) {
    let r = t.type;
    if (r & 3) return Ue(t, e);
    if (r & 4) return ga(-1, e[t.index]);
    if (r & 8) {
      let n = t.child;
      if (n !== null) return Vi(e, n);
      {
        let i = e[t.index];
        return yt(i) ? ga(-1, i) : rt(i);
      }
    } else {
      if (r & 32) return cl(t, e)() || rt(e[t.index]);
      {
        let n = mf(e, t);
        if (n !== null) {
          if (Array.isArray(n)) return n[0];
          let i = br(e[Ke]);
          return Vi(i, n);
        } else return Vi(e, t.next);
      }
    }
  }
  return null;
}
function mf(e, t) {
  if (t !== null) {
    let n = e[Ke][Qe],
      i = t.projection;
    return n.projection[i];
  }
  return null;
}
function ga(e, t) {
  let r = be + e + 1;
  if (r < t.length) {
    let n = t[r],
      i = n[F].firstChild;
    if (i !== null) return Vi(n, i);
  }
  return t[Jt];
}
function Y0(e, t, r) {
  let n = ul(e, t);
  n && G0(e, n, t, r);
}
function fl(e, t, r, n, i, o, s) {
  for (; r != null; ) {
    let a = n[r.index],
      l = r.type;
    if (
      (s && t === 0 && (a && tn(rt(a), n), (r.flags |= 2)),
      (r.flags & 32) !== 32)
    )
      if (l & 8) fl(e, t, r.child, n, i, o, !1), In(t, e, i, a, o);
      else if (l & 32) {
        let c = cl(r, n),
          h;
        for (; (h = c()); ) In(t, e, i, h, o);
        In(t, e, i, a, o);
      } else l & 16 ? Q0(e, t, n, r, i, o) : In(t, e, i, a, o);
    r = s ? r.projectionNext : r.next;
  }
}
function vo(e, t, r, n, i, o) {
  fl(r, n, e.firstChild, t, i, o, !1);
}
function Q0(e, t, r, n, i, o) {
  let s = r[Ke],
    l = s[Qe].projection[n.projection];
  if (Array.isArray(l))
    for (let c = 0; c < l.length; c++) {
      let h = l[c];
      In(t, e, i, h, o);
    }
  else {
    let c = l,
      h = s[we];
    tf(n) && (c.flags |= 128), fl(e, t, c, h, i, o, !0);
  }
}
function J0(e, t, r, n, i) {
  let o = r[Jt],
    s = rt(r);
  o !== s && In(t, e, n, o, i);
  for (let a = be; a < r.length; a++) {
    let l = r[a];
    vo(l[F], l, e, t, n, o);
  }
}
function X0(e, t, r, n, i) {
  if (t) i ? e.addClass(r, n) : e.removeClass(r, n);
  else {
    let o = n.indexOf("-") === -1 ? void 0 : gt.DashCase;
    i == null
      ? e.removeStyle(r, n, o)
      : (typeof i == "string" &&
          i.endsWith("!important") &&
          ((i = i.slice(0, -10)), (o |= gt.Important)),
        e.setStyle(r, n, i, o));
  }
}
function ev(e, t, r) {
  e.setAttribute(t, "style", r);
}
function vf(e, t, r) {
  r === "" ? e.removeAttribute(t, "class") : e.setAttribute(t, "class", r);
}
function yf(e, t, r) {
  let { mergedAttrs: n, classes: i, styles: o } = r;
  n !== null && na(e, t, n),
    i !== null && vf(e, t, i),
    o !== null && ev(e, t, o);
}
var st = {};
function y(e = 1) {
  wf(xe(), H(), Rt() + e, !1);
}
function wf(e, t, r, n) {
  if (!n)
    if ((t[I] & 3) === 3) {
      let o = e.preOrderCheckHooks;
      o !== null && Ri(t, o, r);
    } else {
      let o = e.preOrderHooks;
      o !== null && Li(t, o, 0, r);
    }
  Xt(r);
}
function Q(e, t = L.Default) {
  let r = H();
  if (r === null) return P(e, t);
  let n = Be();
  return Kd(n, r, Ce(e), t);
}
function Cf(e, t, r, n, i, o) {
  let s = U(null);
  try {
    let a = null;
    i & Me.SignalBased && (a = t[n][vs]),
      a !== null && a.transformFn !== void 0 && (o = a.transformFn(o)),
      i & Me.HasDecoratorInputTransform &&
        (o = e.inputTransforms[n].call(t, o)),
      e.setInput !== null ? e.setInput(t, a, o, r, n) : Md(t, a, n, o);
  } finally {
    U(s);
  }
}
function tv(e, t) {
  let r = e.hostBindingOpCodes;
  if (r !== null)
    try {
      for (let n = 0; n < r.length; n++) {
        let i = r[n];
        if (i < 0) Xt(~i);
        else {
          let o = i,
            s = r[++n],
            a = r[++n];
          Qm(s, o);
          let l = t[o];
          a(2, l);
        }
      }
    } finally {
      Xt(-1);
    }
}
function yo(e, t, r, n, i, o, s, a, l, c, h) {
  let p = t.blueprint.slice();
  return (
    (p[vt] = i),
    (p[I] = n | 4 | 128 | 8 | 64),
    (c !== null || (e && e[I] & 2048)) && (p[I] |= 2048),
    Od(p),
    (p[we] = p[Un] = e),
    (p[ye] = r),
    (p[Ze] = s || (e && e[Ze])),
    (p[ie] = a || (e && e[ie])),
    (p[Fn] = l || (e && e[Fn]) || null),
    (p[Qe] = o),
    (p[fo] = b0()),
    (p[vr] = h),
    (p[bd] = c),
    (p[Ke] = t.type == 2 ? e[Ke] : p),
    p
  );
}
function wo(e, t, r, n, i) {
  let o = e.data[t];
  if (o === null) (o = nv(e, t, r, n, i)), Ym() && (o.flags |= 32);
  else if (o.type & 64) {
    (o.type = r), (o.value = n), (o.attrs = i);
    let s = Hm();
    o.injectorIndex = s === null ? -1 : s.injectorIndex;
  }
  return Tr(o, !0), o;
}
function nv(e, t, r, n, i) {
  let o = Ad(),
    s = Nd(),
    a = s ? o : o && o.parent,
    l = (e.data[t] = av(e, a, r, t, n, i));
  return (
    e.firstChild === null && (e.firstChild = l),
    o !== null &&
      (s
        ? o.child == null && l.parent !== null && (o.child = l)
        : o.next === null && ((o.next = l), (l.prev = o))),
    l
  );
}
function bf(e, t, r, n) {
  if (r === 0) return -1;
  let i = t.length;
  for (let o = 0; o < r; o++) t.push(n), e.blueprint.push(n), e.data.push(null);
  return i;
}
function Df(e, t, r, n, i) {
  let o = Rt(),
    s = n & 2;
  try {
    Xt(-1), s && t.length > ze && wf(e, t, ze, !1), et(s ? 2 : 0, i), r(n, i);
  } finally {
    Xt(o), et(s ? 3 : 1, i);
  }
}
function _f(e, t, r) {
  if (_d(t)) {
    let n = U(null);
    try {
      let i = t.directiveStart,
        o = t.directiveEnd;
      for (let s = i; s < o; s++) {
        let a = e.data[s];
        if (a.contentQueries) {
          let l = r[s];
          a.contentQueries(1, l, s);
        }
      }
    } finally {
      U(n);
    }
  }
}
function Mf(e, t, r) {
  Pd() && (hv(e, t, r, Ue(r, t)), (r.flags & 64) === 64 && Of(e, t, r));
}
function Ef(e, t, r = Ue) {
  let n = t.localNames;
  if (n !== null) {
    let i = t.index + 1;
    for (let o = 0; o < n.length; o += 2) {
      let s = n[o + 1],
        a = s === -1 ? r(t, e) : e[s];
      e[i++] = a;
    }
  }
}
function xf(e) {
  let t = e.tView;
  return t === null || t.incompleteFirstPass
    ? (e.tView = hl(
        1,
        null,
        e.template,
        e.decls,
        e.vars,
        e.directiveDefs,
        e.pipeDefs,
        e.viewQuery,
        e.schemas,
        e.consts,
        e.id
      ))
    : t;
}
function hl(e, t, r, n, i, o, s, a, l, c, h) {
  let p = ze + n,
    g = p + i,
    m = rv(p, g),
    w = typeof c == "function" ? c() : c;
  return (m[F] = {
    type: e,
    blueprint: m,
    template: r,
    queries: null,
    viewQuery: a,
    declTNode: t,
    data: m.slice().fill(null, p),
    bindingStartIndex: p,
    expandoStartIndex: g,
    hostBindingOpCodes: null,
    firstCreatePass: !0,
    firstUpdatePass: !0,
    staticViewQueries: !1,
    staticContentQueries: !1,
    preOrderHooks: null,
    preOrderCheckHooks: null,
    contentHooks: null,
    contentCheckHooks: null,
    viewHooks: null,
    viewCheckHooks: null,
    destroyHooks: null,
    cleanup: null,
    contentQueries: null,
    components: null,
    directiveRegistry: typeof o == "function" ? o() : o,
    pipeRegistry: typeof s == "function" ? s() : s,
    firstChild: null,
    schemas: l,
    consts: w,
    incompleteFirstPass: !1,
    ssrId: h,
  });
}
function rv(e, t) {
  let r = [];
  for (let n = 0; n < t; n++) r.push(n < e ? null : st);
  return r;
}
function iv(e, t, r, n) {
  let o = n.get(O0, lf) || r === nt.ShadowDom,
    s = e.selectRootElement(t, o);
  return ov(s), s;
}
function ov(e) {
  sv(e);
}
var sv = () => null;
function av(e, t, r, n, i, o) {
  let s = t ? t.injectorIndex : -1,
    a = 0;
  return (
    Um() && (a |= 128),
    {
      type: r,
      index: n,
      insertBeforeIndex: null,
      injectorIndex: s,
      directiveStart: -1,
      directiveEnd: -1,
      directiveStylingLast: -1,
      componentOffset: -1,
      propertyBindings: null,
      flags: a,
      providerIndexes: 0,
      value: i,
      attrs: o,
      mergedAttrs: null,
      localNames: null,
      initialInputs: void 0,
      inputs: null,
      outputs: null,
      tView: null,
      next: null,
      prev: null,
      projectionNext: null,
      child: null,
      parent: t,
      projection: null,
      styles: null,
      stylesWithoutHost: null,
      residualStyles: void 0,
      classes: null,
      classesWithoutHost: null,
      residualClasses: void 0,
      classBindings: 0,
      styleBindings: 0,
    }
  );
}
function Lu(e, t, r, n, i) {
  for (let o in t) {
    if (!t.hasOwnProperty(o)) continue;
    let s = t[o];
    if (s === void 0) continue;
    n ??= {};
    let a,
      l = Me.None;
    Array.isArray(s) ? ((a = s[0]), (l = s[1])) : (a = s);
    let c = o;
    if (i !== null) {
      if (!i.hasOwnProperty(o)) continue;
      c = i[o];
    }
    e === 0 ? Vu(n, r, c, a, l) : Vu(n, r, c, a);
  }
  return n;
}
function Vu(e, t, r, n, i) {
  let o;
  e.hasOwnProperty(r) ? (o = e[r]).push(t, n) : (o = e[r] = [t, n]),
    i !== void 0 && o.push(i);
}
function lv(e, t, r) {
  let n = t.directiveStart,
    i = t.directiveEnd,
    o = e.data,
    s = t.attrs,
    a = [],
    l = null,
    c = null;
  for (let h = n; h < i; h++) {
    let p = o[h],
      g = r ? r.get(p) : null,
      m = g ? g.inputs : null,
      w = g ? g.outputs : null;
    (l = Lu(0, p.inputs, h, l, m)), (c = Lu(1, p.outputs, h, c, w));
    let O = l !== null && s !== null && !$a(t) ? Mv(l, h, s) : null;
    a.push(O);
  }
  l !== null &&
    (l.hasOwnProperty("class") && (t.flags |= 8),
    l.hasOwnProperty("style") && (t.flags |= 16)),
    (t.initialInputs = a),
    (t.inputs = l),
    (t.outputs = c);
}
function cv(e) {
  return e === "class"
    ? "className"
    : e === "for"
    ? "htmlFor"
    : e === "formaction"
    ? "formAction"
    : e === "innerHtml"
    ? "innerHTML"
    : e === "readonly"
    ? "readOnly"
    : e === "tabindex"
    ? "tabIndex"
    : e;
}
function pl(e, t, r, n, i, o, s, a) {
  let l = Ue(t, r),
    c = t.inputs,
    h;
  !a && c != null && (h = c[n])
    ? (gl(e, r, h, n, i), ho(t) && uv(r, t.index))
    : t.type & 3
    ? ((n = cv(n)),
      (i = s != null ? s(i, t.value || "", n) : i),
      o.setProperty(l, n, i))
    : t.type & 12;
}
function uv(e, t) {
  let r = Ft(t, e);
  r[I] & 16 || (r[I] |= 64);
}
function If(e, t, r, n) {
  if (Pd()) {
    let i = n === null ? null : { "": -1 },
      o = gv(e, r),
      s,
      a;
    o === null ? (s = a = null) : ([s, a] = o),
      s !== null && Sf(e, t, r, s, i, a),
      i && mv(r, n, i);
  }
  r.mergedAttrs = gr(r.mergedAttrs, r.attrs);
}
function Sf(e, t, r, n, i, o) {
  for (let c = 0; c < n.length; c++) ua(Ki(r, t), e, n[c].type);
  yv(r, e.data.length, n.length);
  for (let c = 0; c < n.length; c++) {
    let h = n[c];
    h.providersResolver && h.providersResolver(h);
  }
  let s = !1,
    a = !1,
    l = bf(e, t, n.length, null);
  for (let c = 0; c < n.length; c++) {
    let h = n[c];
    (r.mergedAttrs = gr(r.mergedAttrs, h.hostAttrs)),
      wv(e, r, t, l, h),
      vv(l, h, i),
      h.contentQueries !== null && (r.flags |= 4),
      (h.hostBindings !== null || h.hostAttrs !== null || h.hostVars !== 0) &&
        (r.flags |= 64);
    let p = h.type.prototype;
    !s &&
      (p.ngOnChanges || p.ngOnInit || p.ngDoCheck) &&
      ((e.preOrderHooks ??= []).push(r.index), (s = !0)),
      !a &&
        (p.ngOnChanges || p.ngDoCheck) &&
        ((e.preOrderCheckHooks ??= []).push(r.index), (a = !0)),
      l++;
  }
  lv(e, r, o);
}
function dv(e, t, r, n, i) {
  let o = i.hostBindings;
  if (o) {
    let s = e.hostBindingOpCodes;
    s === null && (s = e.hostBindingOpCodes = []);
    let a = ~t.index;
    fv(s) != a && s.push(a), s.push(r, n, o);
  }
}
function fv(e) {
  let t = e.length;
  for (; t > 0; ) {
    let r = e[--t];
    if (typeof r == "number" && r < 0) return r;
  }
  return 0;
}
function hv(e, t, r, n) {
  let i = r.directiveStart,
    o = r.directiveEnd;
  ho(r) && Cv(t, r, e.data[i + r.componentOffset]),
    e.firstCreatePass || Ki(r, t),
    tn(n, t);
  let s = r.initialInputs;
  for (let a = i; a < o; a++) {
    let l = e.data[a],
      c = Ln(t, e, a, r);
    if ((tn(c, t), s !== null && _v(t, a - i, c, l, r, s), Pt(l))) {
      let h = Ft(r.index, t);
      h[ye] = Ln(t, e, a, r);
    }
  }
}
function Of(e, t, r) {
  let n = r.directiveStart,
    i = r.directiveEnd,
    o = r.index,
    s = Jm();
  try {
    Xt(o);
    for (let a = n; a < i; a++) {
      let l = e.data[a],
        c = t[a];
      la(a),
        (l.hostBindings !== null || l.hostVars !== 0 || l.hostAttrs !== null) &&
          pv(l, c);
    }
  } finally {
    Xt(-1), la(s);
  }
}
function pv(e, t) {
  e.hostBindings !== null && e.hostBindings(1, t);
}
function gv(e, t) {
  let r = e.directiveRegistry,
    n = null,
    i = null;
  if (r)
    for (let o = 0; o < r.length; o++) {
      let s = r[o];
      if (rm(t, s.selectors, !1))
        if ((n || (n = []), Pt(s)))
          if (s.findHostDirectiveDefs !== null) {
            let a = [];
            (i = i || new Map()),
              s.findHostDirectiveDefs(s, a, i),
              n.unshift(...a, s);
            let l = a.length;
            ma(e, t, l);
          } else n.unshift(s), ma(e, t, 0);
        else
          (i = i || new Map()), s.findHostDirectiveDefs?.(s, n, i), n.push(s);
    }
  return n === null ? null : [n, i];
}
function ma(e, t, r) {
  (t.componentOffset = r), (e.components ??= []).push(t.index);
}
function mv(e, t, r) {
  if (t) {
    let n = (e.localNames = []);
    for (let i = 0; i < t.length; i += 2) {
      let o = r[t[i + 1]];
      if (o == null) throw new M(-301, !1);
      n.push(t[i], o);
    }
  }
}
function vv(e, t, r) {
  if (r) {
    if (t.exportAs)
      for (let n = 0; n < t.exportAs.length; n++) r[t.exportAs[n]] = e;
    Pt(t) && (r[""] = e);
  }
}
function yv(e, t, r) {
  (e.flags |= 1),
    (e.directiveStart = t),
    (e.directiveEnd = t + r),
    (e.providerIndexes = t);
}
function wv(e, t, r, n, i) {
  e.data[n] = i;
  let o = i.factory || (i.factory = Pn(i.type, !0)),
    s = new en(o, Pt(i), Q);
  (e.blueprint[n] = s), (r[n] = s), dv(e, t, n, bf(e, r, i.hostVars, st), i);
}
function Cv(e, t, r) {
  let n = Ue(t, e),
    i = xf(r),
    o = e[Ze].rendererFactory,
    s = 16;
  r.signals ? (s = 4096) : r.onPush && (s = 64);
  let a = Co(
    e,
    yo(e, i, null, s, n, t, null, o.createRenderer(n, r), null, null, null)
  );
  e[t.index] = a;
}
function bv(e, t, r, n, i, o) {
  let s = Ue(e, t);
  Dv(t[ie], s, o, e.value, r, n, i);
}
function Dv(e, t, r, n, i, o, s) {
  if (o == null) e.removeAttribute(t, i, r);
  else {
    let a = s == null ? Tn(o) : s(o, n || "", i);
    e.setAttribute(t, i, a, r);
  }
}
function _v(e, t, r, n, i, o) {
  let s = o[t];
  if (s !== null)
    for (let a = 0; a < s.length; ) {
      let l = s[a++],
        c = s[a++],
        h = s[a++],
        p = s[a++];
      Cf(n, r, l, c, h, p);
    }
}
function Mv(e, t, r) {
  let n = null,
    i = 0;
  for (; i < r.length; ) {
    let o = r[i];
    if (o === 0) {
      i += 4;
      continue;
    } else if (o === 5) {
      i += 2;
      continue;
    }
    if (typeof o == "number") break;
    if (e.hasOwnProperty(o)) {
      n === null && (n = []);
      let s = e[o];
      for (let a = 0; a < s.length; a += 3)
        if (s[a] === t) {
          n.push(o, s[a + 1], s[a + 2], r[i + 1]);
          break;
        }
    }
    i += 2;
  }
  return n;
}
function Tf(e, t, r, n) {
  return [e, !0, 0, t, null, n, null, r, null, null];
}
function Pf(e, t) {
  let r = e.contentQueries;
  if (r !== null) {
    let n = U(null);
    try {
      for (let i = 0; i < r.length; i += 2) {
        let o = r[i],
          s = r[i + 1];
        if (s !== -1) {
          let a = e.data[s];
          Fd(o), a.contentQueries(2, t[s], s);
        }
      }
    } finally {
      U(n);
    }
  }
}
function Co(e, t) {
  return e[wr] ? (e[Iu][qe] = t) : (e[wr] = t), (e[Iu] = t), t;
}
function va(e, t, r) {
  Fd(0);
  let n = U(null);
  try {
    t(e, r);
  } finally {
    U(n);
  }
}
function Ev(e) {
  return e[yr] || (e[yr] = []);
}
function xv(e) {
  return e.cleanup || (e.cleanup = []);
}
function Af(e, t) {
  let r = e[Fn],
    n = r ? r.get(pt, null) : null;
  n && n.handleError(t);
}
function gl(e, t, r, n, i) {
  for (let o = 0; o < r.length; ) {
    let s = r[o++],
      a = r[o++],
      l = r[o++],
      c = t[s],
      h = e.data[s];
    Cf(h, c, n, a, l, i);
  }
}
function Nf(e, t, r) {
  let n = Sd(t, e);
  F0(e[ie], n, r);
}
function Iv(e, t) {
  let r = Ft(t, e),
    n = r[F];
  Sv(n, r);
  let i = r[vt];
  i !== null && r[vr] === null && (r[vr] = al(i, r[Fn])), ml(n, r, r[ye]);
}
function Sv(e, t) {
  for (let r = t.length; r < e.blueprint.length; r++) t.push(e.blueprint[r]);
}
function ml(e, t, r) {
  Qa(t);
  try {
    let n = e.viewQuery;
    n !== null && va(1, n, r);
    let i = e.template;
    i !== null && Df(e, t, i, 1, r),
      e.firstCreatePass && (e.firstCreatePass = !1),
      t[Rn]?.finishViewCreation(e),
      e.staticContentQueries && Pf(e, t),
      e.staticViewQueries && va(2, e.viewQuery, r);
    let o = e.components;
    o !== null && Ov(t, o);
  } catch (n) {
    throw (
      (e.firstCreatePass &&
        ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)),
      n)
    );
  } finally {
    (t[I] &= -5), Ja();
  }
}
function Ov(e, t) {
  for (let r = 0; r < t.length; r++) Iv(e, t[r]);
}
function vl(e, t, r, n) {
  let i = U(null);
  try {
    let o = t.tView,
      a = e[I] & 4096 ? 4096 : 16,
      l = yo(
        e,
        o,
        r,
        a,
        null,
        t,
        null,
        null,
        n?.injector ?? null,
        n?.embeddedViewInjector ?? null,
        n?.dehydratedView ?? null
      ),
      c = e[t.index];
    l[uo] = c;
    let h = e[Rn];
    return h !== null && (l[Rn] = h.createEmbeddedView(o)), ml(o, l, r), l;
  } finally {
    U(i);
  }
}
function kf(e, t) {
  let r = be + t;
  if (r < e.length) return e[r];
}
function _r(e, t) {
  return !t || t.firstChild === null || tf(e);
}
function bo(e, t, r, n = !0) {
  let i = t[F];
  if ((j0(i, t, e, r), n)) {
    let s = ga(r, e),
      a = t[ie],
      l = ul(a, e[Jt]);
    l !== null && L0(i, e[Qe], a, t, l, s);
  }
  let o = t[vr];
  o !== null && o.firstChild !== null && (o.firstChild = null);
}
function Ff(e, t) {
  let r = Dr(e, t);
  return r !== void 0 && mo(r[F], r), r;
}
function Ji(e, t, r, n, i = !1) {
  for (; r !== null; ) {
    let o = t[r.index];
    o !== null && n.push(rt(o)), yt(o) && Tv(o, n);
    let s = r.type;
    if (s & 8) Ji(e, t, r.child, n);
    else if (s & 32) {
      let a = cl(r, t),
        l;
      for (; (l = a()); ) n.push(l);
    } else if (s & 16) {
      let a = mf(t, r);
      if (Array.isArray(a)) n.push(...a);
      else {
        let l = br(t[Ke]);
        Ji(l[F], l, a, n, !0);
      }
    }
    r = i ? r.projectionNext : r.next;
  }
  return n;
}
function Tv(e, t) {
  for (let r = be; r < e.length; r++) {
    let n = e[r],
      i = n[F].firstChild;
    i !== null && Ji(n[F], n, i, t);
  }
  e[Jt] !== e[vt] && t.push(e[Jt]);
}
var Rf = [];
function Pv(e) {
  return e[Qt] ?? Av(e);
}
function Av(e) {
  let t = Rf.pop() ?? Object.create(kv);
  return (t.lView = e), t;
}
function Nv(e) {
  e.lView[Qt] !== e && ((e.lView = null), Rf.push(e));
}
var kv = K(C({}, Bc), {
    consumerIsAlwaysLive: !0,
    consumerMarkedDirty: (e) => {
      Cr(e.lView);
    },
    consumerOnSignalRead() {
      this.lView[Qt] = this;
    },
  }),
  Lf = 100;
function Vf(e, t = !0, r = 0) {
  let n = e[Ze],
    i = n.rendererFactory,
    o = !1;
  o || i.begin?.();
  try {
    Fv(e, r);
  } catch (s) {
    throw (t && Af(e, s), s);
  } finally {
    o || (i.end?.(), n.inlineEffectRunner?.flush());
  }
}
function Fv(e, t) {
  ya(e, t);
  let r = 0;
  for (; Ya(e); ) {
    if (r === Lf) throw new M(103, !1);
    r++, ya(e, 1);
  }
}
function Rv(e, t, r, n) {
  let i = t[I];
  if ((i & 256) === 256) return;
  let o = !1;
  !o && t[Ze].inlineEffectRunner?.flush(), Qa(t);
  let s = null,
    a = null;
  !o && Lv(e) && ((a = Pv(t)), (s = $c(a)));
  try {
    Od(t), Km(e.bindingStartIndex), r !== null && Df(e, t, r, 2, n);
    let l = (i & 3) === 3;
    if (!o)
      if (l) {
        let p = e.preOrderCheckHooks;
        p !== null && Ri(t, p, null);
      } else {
        let p = e.preOrderHooks;
        p !== null && Li(t, p, 0, null), Us(t, 0);
      }
    if ((Vv(t), jf(t, 0), e.contentQueries !== null && Pf(e, t), !o))
      if (l) {
        let p = e.contentCheckHooks;
        p !== null && Ri(t, p);
      } else {
        let p = e.contentHooks;
        p !== null && Li(t, p, 1), Us(t, 1);
      }
    tv(e, t);
    let c = e.components;
    c !== null && Uf(t, c, 0);
    let h = e.viewQuery;
    if ((h !== null && va(2, h, n), !o))
      if (l) {
        let p = e.viewCheckHooks;
        p !== null && Ri(t, p);
      } else {
        let p = e.viewHooks;
        p !== null && Li(t, p, 2), Us(t, 2);
      }
    if ((e.firstUpdatePass === !0 && (e.firstUpdatePass = !1), t[zs])) {
      for (let p of t[zs]) p();
      t[zs] = null;
    }
    o || (t[I] &= -73);
  } catch (l) {
    throw (Cr(t), l);
  } finally {
    a !== null && (Hc(a, s), Nv(a)), Ja();
  }
}
function Lv(e) {
  return e.type !== 2;
}
function jf(e, t) {
  for (let r = rf(e); r !== null; r = of(r))
    for (let n = be; n < r.length; n++) {
      let i = r[n];
      zf(i, t);
    }
}
function Vv(e) {
  for (let t = rf(e); t !== null; t = of(t)) {
    if (!(t[I] & Wa.HasTransplantedViews)) continue;
    let r = t[Gi];
    for (let n = 0; n < r.length; n++) {
      let i = r[n],
        o = i[we];
      Fm(i);
    }
  }
}
function jv(e, t, r) {
  let n = Ft(t, e);
  zf(n, r);
}
function zf(e, t) {
  Ka(e) && ya(e, t);
}
function ya(e, t) {
  let n = e[F],
    i = e[I],
    o = e[Qt],
    s = !!(t === 0 && i & 16);
  if (
    ((s ||= !!(i & 64 && t === 0)),
    (s ||= !!(i & 1024)),
    (s ||= !!(o?.dirty && ys(o))),
    o && (o.dirty = !1),
    (e[I] &= -9217),
    s)
  )
    Rv(n, e, n.template, e[ye]);
  else if (i & 8192) {
    jf(e, 1);
    let a = n.components;
    a !== null && Uf(e, a, 1);
  }
}
function Uf(e, t, r) {
  for (let n = 0; n < t.length; n++) jv(e, t[n], r);
}
function yl(e) {
  for (e[Ze].changeDetectionScheduler?.notify(); e; ) {
    e[I] |= 64;
    let t = br(e);
    if (Em(e) && !t) return e;
    e = t;
  }
  return null;
}
var Vn = class {
  get rootNodes() {
    let t = this._lView,
      r = t[F];
    return Ji(r, t, r.firstChild, []);
  }
  constructor(t, r, n = !0) {
    (this._lView = t),
      (this._cdRefInjectingView = r),
      (this.notifyErrorHandler = n),
      (this._appRef = null),
      (this._attachedToViewContainer = !1);
  }
  get context() {
    return this._lView[ye];
  }
  set context(t) {
    this._lView[ye] = t;
  }
  get destroyed() {
    return (this._lView[I] & 256) === 256;
  }
  destroy() {
    if (this._appRef) this._appRef.detachView(this);
    else if (this._attachedToViewContainer) {
      let t = this._lView[we];
      if (yt(t)) {
        let r = t[Hi],
          n = r ? r.indexOf(this) : -1;
        n > -1 && (Dr(t, n), Bi(r, n));
      }
      this._attachedToViewContainer = !1;
    }
    mo(this._lView[F], this._lView);
  }
  onDestroy(t) {
    Td(this._lView, t);
  }
  markForCheck() {
    yl(this._cdRefInjectingView || this._lView);
  }
  detach() {
    this._lView[I] &= -129;
  }
  reattach() {
    aa(this._lView), (this._lView[I] |= 128);
  }
  detectChanges() {
    (this._lView[I] |= 1024), Vf(this._lView, this.notifyErrorHandler);
  }
  checkNoChanges() {}
  attachToViewContainerRef() {
    if (this._appRef) throw new M(902, !1);
    this._attachedToViewContainer = !0;
  }
  detachFromAppRef() {
    (this._appRef = null), hf(this._lView[F], this._lView);
  }
  attachToAppRef(t) {
    if (this._attachedToViewContainer) throw new M(902, !1);
    (this._appRef = t), aa(this._lView);
  }
};
var zO = new RegExp(`^(\\d+)*(${I0}|${x0})*(.*)`);
var zv = () => null;
function Mr(e, t) {
  return zv(e, t);
}
var wa = class {},
  Ca = class {},
  Xi = class {};
function Uv(e) {
  let t = Error(`No component factory found for ${_e(e)}.`);
  return (t[Bv] = e), t;
}
var Bv = "ngComponent";
var ba = class {
    resolveComponentFactory(t) {
      throw Uv(t);
    }
  },
  Do = (() => {
    let t = class t {};
    t.NULL = new ba();
    let e = t;
    return e;
  })(),
  Er = class {},
  on = (() => {
    let t = class t {
      constructor() {
        this.destroyNode = null;
      }
    };
    t.__NG_ELEMENT_ID__ = () => $v();
    let e = t;
    return e;
  })();
function $v() {
  let e = H(),
    t = Be(),
    r = Ft(t.index, e);
  return (Zt(r) ? r : e)[ie];
}
var Hv = (() => {
    let t = class t {};
    t.ɵprov = E({ token: t, providedIn: "root", factory: () => null });
    let e = t;
    return e;
  })(),
  Ws = {};
var ju = new Set();
function Pr(e) {
  ju.has(e) ||
    (ju.add(e),
    performance?.mark?.("mark_feature_usage", { detail: { feature: e } }));
}
function zu(...e) {}
function Gv() {
  let e = typeof fr.requestAnimationFrame == "function",
    t = fr[e ? "requestAnimationFrame" : "setTimeout"],
    r = fr[e ? "cancelAnimationFrame" : "clearTimeout"];
  if (typeof Zone < "u" && t && r) {
    let n = t[Zone.__symbol__("OriginalDelegate")];
    n && (t = n);
    let i = r[Zone.__symbol__("OriginalDelegate")];
    i && (r = i);
  }
  return { nativeRequestAnimationFrame: t, nativeCancelAnimationFrame: r };
}
var ee = class e {
    constructor({
      enableLongStackTrace: t = !1,
      shouldCoalesceEventChangeDetection: r = !1,
      shouldCoalesceRunChangeDetection: n = !1,
    }) {
      if (
        ((this.hasPendingMacrotasks = !1),
        (this.hasPendingMicrotasks = !1),
        (this.isStable = !0),
        (this.onUnstable = new ve(!1)),
        (this.onMicrotaskEmpty = new ve(!1)),
        (this.onStable = new ve(!1)),
        (this.onError = new ve(!1)),
        typeof Zone > "u")
      )
        throw new M(908, !1);
      Zone.assertZonePatched();
      let i = this;
      (i._nesting = 0),
        (i._outer = i._inner = Zone.current),
        Zone.TaskTrackingZoneSpec &&
          (i._inner = i._inner.fork(new Zone.TaskTrackingZoneSpec())),
        t &&
          Zone.longStackTraceZoneSpec &&
          (i._inner = i._inner.fork(Zone.longStackTraceZoneSpec)),
        (i.shouldCoalesceEventChangeDetection = !n && r),
        (i.shouldCoalesceRunChangeDetection = n),
        (i.lastRequestAnimationFrameId = -1),
        (i.nativeRequestAnimationFrame = Gv().nativeRequestAnimationFrame),
        Zv(i);
    }
    static isInAngularZone() {
      return typeof Zone < "u" && Zone.current.get("isAngularZone") === !0;
    }
    static assertInAngularZone() {
      if (!e.isInAngularZone()) throw new M(909, !1);
    }
    static assertNotInAngularZone() {
      if (e.isInAngularZone()) throw new M(909, !1);
    }
    run(t, r, n) {
      return this._inner.run(t, r, n);
    }
    runTask(t, r, n, i) {
      let o = this._inner,
        s = o.scheduleEventTask("NgZoneEvent: " + i, t, Wv, zu, zu);
      try {
        return o.runTask(s, r, n);
      } finally {
        o.cancelTask(s);
      }
    }
    runGuarded(t, r, n) {
      return this._inner.runGuarded(t, r, n);
    }
    runOutsideAngular(t) {
      return this._outer.run(t);
    }
  },
  Wv = {};
function wl(e) {
  if (e._nesting == 0 && !e.hasPendingMicrotasks && !e.isStable)
    try {
      e._nesting++, e.onMicrotaskEmpty.emit(null);
    } finally {
      if ((e._nesting--, !e.hasPendingMicrotasks))
        try {
          e.runOutsideAngular(() => e.onStable.emit(null));
        } finally {
          e.isStable = !0;
        }
    }
}
function qv(e) {
  e.isCheckStableRunning ||
    e.lastRequestAnimationFrameId !== -1 ||
    ((e.lastRequestAnimationFrameId = e.nativeRequestAnimationFrame.call(
      fr,
      () => {
        e.fakeTopEventTask ||
          (e.fakeTopEventTask = Zone.root.scheduleEventTask(
            "fakeTopEventTask",
            () => {
              (e.lastRequestAnimationFrameId = -1),
                Da(e),
                (e.isCheckStableRunning = !0),
                wl(e),
                (e.isCheckStableRunning = !1);
            },
            void 0,
            () => {},
            () => {}
          )),
          e.fakeTopEventTask.invoke();
      }
    )),
    Da(e));
}
function Zv(e) {
  let t = () => {
    qv(e);
  };
  e._inner = e._inner.fork({
    name: "angular",
    properties: { isAngularZone: !0 },
    onInvokeTask: (r, n, i, o, s, a) => {
      if (Kv(a)) return r.invokeTask(i, o, s, a);
      try {
        return Uu(e), r.invokeTask(i, o, s, a);
      } finally {
        ((e.shouldCoalesceEventChangeDetection && o.type === "eventTask") ||
          e.shouldCoalesceRunChangeDetection) &&
          t(),
          Bu(e);
      }
    },
    onInvoke: (r, n, i, o, s, a, l) => {
      try {
        return Uu(e), r.invoke(i, o, s, a, l);
      } finally {
        e.shouldCoalesceRunChangeDetection && t(), Bu(e);
      }
    },
    onHasTask: (r, n, i, o) => {
      r.hasTask(i, o),
        n === i &&
          (o.change == "microTask"
            ? ((e._hasPendingMicrotasks = o.microTask), Da(e), wl(e))
            : o.change == "macroTask" &&
              (e.hasPendingMacrotasks = o.macroTask));
    },
    onHandleError: (r, n, i, o) => (
      r.handleError(i, o), e.runOutsideAngular(() => e.onError.emit(o)), !1
    ),
  });
}
function Da(e) {
  e._hasPendingMicrotasks ||
  ((e.shouldCoalesceEventChangeDetection ||
    e.shouldCoalesceRunChangeDetection) &&
    e.lastRequestAnimationFrameId !== -1)
    ? (e.hasPendingMicrotasks = !0)
    : (e.hasPendingMicrotasks = !1);
}
function Uu(e) {
  e._nesting++, e.isStable && ((e.isStable = !1), e.onUnstable.emit(null));
}
function Bu(e) {
  e._nesting--, wl(e);
}
function Kv(e) {
  return !Array.isArray(e) || e.length !== 1
    ? !1
    : e[0].data?.__ignore_ng_zone__ === !0;
}
var Bf = (() => {
  let t = class t {
    constructor() {
      (this.handler = null), (this.internalCallbacks = []);
    }
    execute() {
      this.executeInternalCallbacks(), this.handler?.execute();
    }
    executeInternalCallbacks() {
      let n = [...this.internalCallbacks];
      this.internalCallbacks.length = 0;
      for (let i of n) i();
    }
    ngOnDestroy() {
      this.handler?.destroy(),
        (this.handler = null),
        (this.internalCallbacks.length = 0);
    }
  };
  t.ɵprov = E({ token: t, providedIn: "root", factory: () => new t() });
  let e = t;
  return e;
})();
function _a(e, t, r) {
  let n = r ? e.styles : null,
    i = r ? e.classes : null,
    o = 0;
  if (t !== null)
    for (let s = 0; s < t.length; s++) {
      let a = t[s];
      if (typeof a == "number") o = a;
      else if (o == 1) i = vu(i, a);
      else if (o == 2) {
        let l = a,
          c = t[++s];
        n = vu(n, l + ": " + c + ";");
      }
    }
  r ? (e.styles = n) : (e.stylesWithoutHost = n),
    r ? (e.classes = i) : (e.classesWithoutHost = i);
}
var eo = class extends Do {
  constructor(t) {
    super(), (this.ngModule = t);
  }
  resolveComponentFactory(t) {
    let r = Yt(t);
    return new xr(r, this.ngModule);
  }
};
function $u(e) {
  let t = [];
  for (let r in e) {
    if (!e.hasOwnProperty(r)) continue;
    let n = e[r];
    n !== void 0 &&
      t.push({ propName: Array.isArray(n) ? n[0] : n, templateName: r });
  }
  return t;
}
function Yv(e) {
  let t = e.toLowerCase();
  return t === "svg" ? Om : t === "math" ? Tm : null;
}
var Ma = class {
    constructor(t, r) {
      (this.injector = t), (this.parentInjector = r);
    }
    get(t, r, n) {
      n = lo(n);
      let i = this.injector.get(t, Ws, n);
      return i !== Ws || r === Ws ? i : this.parentInjector.get(t, r, n);
    }
  },
  xr = class extends Xi {
    get inputs() {
      let t = this.componentDef,
        r = t.inputTransforms,
        n = $u(t.inputs);
      if (r !== null)
        for (let i of n)
          r.hasOwnProperty(i.propName) && (i.transform = r[i.propName]);
      return n;
    }
    get outputs() {
      return $u(this.componentDef.outputs);
    }
    constructor(t, r) {
      super(),
        (this.componentDef = t),
        (this.ngModule = r),
        (this.componentType = t.type),
        (this.selector = am(t.selectors)),
        (this.ngContentSelectors = t.ngContentSelectors
          ? t.ngContentSelectors
          : []),
        (this.isBoundToModule = !!r);
    }
    create(t, r, n, i) {
      let o = U(null);
      try {
        i = i || this.ngModule;
        let s = i instanceof Ee ? i : i?.injector;
        s &&
          this.componentDef.getStandaloneInjector !== null &&
          (s = this.componentDef.getStandaloneInjector(s) || s);
        let a = s ? new Ma(t, s) : t,
          l = a.get(Er, null);
        if (l === null) throw new M(407, !1);
        let c = a.get(Hv, null),
          h = a.get(Bf, null),
          p = a.get(wa, null),
          g = {
            rendererFactory: l,
            sanitizer: c,
            inlineEffectRunner: null,
            afterRenderEventManager: h,
            changeDetectionScheduler: p,
          },
          m = l.createRenderer(null, this.componentDef),
          w = this.componentDef.selectors[0][0] || "div",
          O = n
            ? iv(m, n, this.componentDef.encapsulation, a)
            : ff(m, w, Yv(w)),
          _ = 512;
        this.componentDef.signals
          ? (_ |= 4096)
          : this.componentDef.onPush || (_ |= 16);
        let D = null;
        O !== null && (D = al(O, a, !0));
        let me = hl(0, null, null, 1, 0, null, null, null, null, null, null),
          fe = yo(null, me, null, _, null, null, g, m, a, null, D);
        Qa(fe);
        let Y, Je;
        try {
          let Oe = this.componentDef,
            Mt,
            gs = null;
          Oe.findHostDirectiveDefs
            ? ((Mt = []),
              (gs = new Map()),
              Oe.findHostDirectiveDefs(Oe, Mt, gs),
              Mt.push(Oe))
            : (Mt = [Oe]);
          let Zp = Qv(fe, O),
            Kp = Jv(Zp, O, Oe, Mt, fe, g, m);
          (Je = Za(me, ze)),
            O && ty(m, Oe, O, n),
            r !== void 0 && ny(Je, this.ngContentSelectors, r),
            (Y = ey(Kp, Oe, Mt, gs, fe, [ry])),
            ml(me, fe, null);
        } finally {
          Ja();
        }
        return new Ea(this.componentType, Y, rl(Je, fe), fe, Je);
      } finally {
        U(o);
      }
    }
  },
  Ea = class extends Ca {
    constructor(t, r, n, i, o) {
      super(),
        (this.location = n),
        (this._rootLView = i),
        (this._tNode = o),
        (this.previousInputValues = null),
        (this.instance = r),
        (this.hostView = this.changeDetectorRef = new Vn(i, void 0, !1)),
        (this.componentType = t);
    }
    setInput(t, r) {
      let n = this._tNode.inputs,
        i;
      if (n !== null && (i = n[t])) {
        if (
          ((this.previousInputValues ??= new Map()),
          this.previousInputValues.has(t) &&
            Object.is(this.previousInputValues.get(t), r))
        )
          return;
        let o = this._rootLView;
        gl(o[F], o, i, t, r), this.previousInputValues.set(t, r);
        let s = Ft(this._tNode.index, o);
        yl(s);
      }
    }
    get injector() {
      return new Kt(this._tNode, this._rootLView);
    }
    destroy() {
      this.hostView.destroy();
    }
    onDestroy(t) {
      this.hostView.onDestroy(t);
    }
  };
function Qv(e, t) {
  let r = e[F],
    n = ze;
  return (e[n] = t), wo(r, n, 2, "#host", null);
}
function Jv(e, t, r, n, i, o, s) {
  let a = i[F];
  Xv(n, e, t, s);
  let l = null;
  t !== null && (l = al(t, i[Fn]));
  let c = o.rendererFactory.createRenderer(t, r),
    h = 16;
  r.signals ? (h = 4096) : r.onPush && (h = 64);
  let p = yo(i, xf(r), null, h, i[e.index], e, o, c, null, null, l);
  return (
    a.firstCreatePass && ma(a, e, n.length - 1), Co(i, p), (i[e.index] = p)
  );
}
function Xv(e, t, r, n) {
  for (let i of e) t.mergedAttrs = gr(t.mergedAttrs, i.hostAttrs);
  t.mergedAttrs !== null &&
    (_a(t, t.mergedAttrs, !0), r !== null && yf(n, r, t));
}
function ey(e, t, r, n, i, o) {
  let s = Be(),
    a = i[F],
    l = Ue(s, i);
  Sf(a, i, s, r, null, n);
  for (let h = 0; h < r.length; h++) {
    let p = s.directiveStart + h,
      g = Ln(i, a, p, s);
    tn(g, i);
  }
  Of(a, i, s), l && tn(l, i);
  let c = Ln(i, a, s.directiveStart + s.componentOffset, s);
  if (((e[ye] = i[ye] = c), o !== null)) for (let h of o) h(c, t);
  return _f(a, s, i), c;
}
function ty(e, t, r, n) {
  if (n) na(e, r, ["ng-version", "17.3.5"]);
  else {
    let { attrs: i, classes: o } = lm(t.selectors[0]);
    i && na(e, r, i), o && o.length > 0 && vf(e, r, o.join(" "));
  }
}
function ny(e, t, r) {
  let n = (e.projection = []);
  for (let i = 0; i < t.length; i++) {
    let o = r[i];
    n.push(o != null ? Array.from(o) : null);
  }
}
function ry() {
  let e = Be();
  tl(H()[F], e);
}
var _o = (() => {
  let t = class t {};
  t.__NG_ELEMENT_ID__ = iy;
  let e = t;
  return e;
})();
function iy() {
  let e = Be();
  return sy(e, H());
}
var oy = _o,
  $f = class extends oy {
    constructor(t, r, n) {
      super(),
        (this._lContainer = t),
        (this._hostTNode = r),
        (this._hostLView = n);
    }
    get element() {
      return rl(this._hostTNode, this._hostLView);
    }
    get injector() {
      return new Kt(this._hostTNode, this._hostLView);
    }
    get parentInjector() {
      let t = nl(this._hostTNode, this._hostLView);
      if ($d(t)) {
        let r = Zi(t, this._hostLView),
          n = qi(t),
          i = r[F].data[n + 8];
        return new Kt(i, r);
      } else return new Kt(null, this._hostLView);
    }
    clear() {
      for (; this.length > 0; ) this.remove(this.length - 1);
    }
    get(t) {
      let r = Hu(this._lContainer);
      return (r !== null && r[t]) || null;
    }
    get length() {
      return this._lContainer.length - be;
    }
    createEmbeddedView(t, r, n) {
      let i, o;
      typeof n == "number"
        ? (i = n)
        : n != null && ((i = n.index), (o = n.injector));
      let s = Mr(this._lContainer, t.ssrId),
        a = t.createEmbeddedViewImpl(r || {}, o, s);
      return this.insertImpl(a, i, _r(this._hostTNode, s)), a;
    }
    createComponent(t, r, n, i, o) {
      let s = t && !Mm(t),
        a;
      if (s) a = r;
      else {
        let w = r || {};
        (a = w.index),
          (n = w.injector),
          (i = w.projectableNodes),
          (o = w.environmentInjector || w.ngModuleRef);
      }
      let l = s ? t : new xr(Yt(t)),
        c = n || this.parentInjector;
      if (!o && l.ngModule == null) {
        let O = (s ? c : this.parentInjector).get(Ee, null);
        O && (o = O);
      }
      let h = Yt(l.componentType ?? {}),
        p = Mr(this._lContainer, h?.id ?? null),
        g = p?.firstChild ?? null,
        m = l.create(c, i, g, o);
      return this.insertImpl(m.hostView, a, _r(this._hostTNode, p)), m;
    }
    insert(t, r) {
      return this.insertImpl(t, r, !0);
    }
    insertImpl(t, r, n) {
      let i = t._lView;
      if (km(i)) {
        let a = this.indexOf(t);
        if (a !== -1) this.detach(a);
        else {
          let l = i[we],
            c = new $f(l, l[Qe], l[we]);
          c.detach(c.indexOf(t));
        }
      }
      let o = this._adjustIndex(r),
        s = this._lContainer;
      return bo(s, i, o, n), t.attachToViewContainerRef(), sd(qs(s), o, t), t;
    }
    move(t, r) {
      return this.insert(t, r);
    }
    indexOf(t) {
      let r = Hu(this._lContainer);
      return r !== null ? r.indexOf(t) : -1;
    }
    remove(t) {
      let r = this._adjustIndex(t, -1),
        n = Dr(this._lContainer, r);
      n && (Bi(qs(this._lContainer), r), mo(n[F], n));
    }
    detach(t) {
      let r = this._adjustIndex(t, -1),
        n = Dr(this._lContainer, r);
      return n && Bi(qs(this._lContainer), r) != null ? new Vn(n) : null;
    }
    _adjustIndex(t, r = 0) {
      return t ?? this.length + r;
    }
  };
function Hu(e) {
  return e[Hi];
}
function qs(e) {
  return e[Hi] || (e[Hi] = []);
}
function sy(e, t) {
  let r,
    n = t[e.index];
  return (
    yt(n) ? (r = n) : ((r = Tf(n, t, null, e)), (t[e.index] = r), Co(t, r)),
    ly(r, t, e, n),
    new $f(r, e, t)
  );
}
function ay(e, t) {
  let r = e[ie],
    n = r.createComment(""),
    i = Ue(t, e),
    o = ul(r, i);
  return Qi(r, o, n, W0(r, i), !1), n;
}
var ly = dy,
  cy = () => !1;
function uy(e, t, r) {
  return cy(e, t, r);
}
function dy(e, t, r, n) {
  if (e[Jt]) return;
  let i;
  r.type & 8 ? (i = rt(n)) : (i = ay(t, r)), (e[Jt] = i);
}
function fy(e) {
  return typeof e == "function" && e[vs] !== void 0;
}
function Hf(e) {
  return fy(e) && typeof e.set == "function";
}
function hy(e) {
  return Object.getPrototypeOf(e.prototype).constructor;
}
function ke(e) {
  let t = hy(e.type),
    r = !0,
    n = [e];
  for (; t; ) {
    let i;
    if (Pt(e)) i = t.ɵcmp || t.ɵdir;
    else {
      if (t.ɵcmp) throw new M(903, !1);
      i = t.ɵdir;
    }
    if (i) {
      if (r) {
        n.push(i);
        let s = e;
        (s.inputs = Ni(e.inputs)),
          (s.inputTransforms = Ni(e.inputTransforms)),
          (s.declaredInputs = Ni(e.declaredInputs)),
          (s.outputs = Ni(e.outputs));
        let a = i.hostBindings;
        a && yy(e, a);
        let l = i.viewQuery,
          c = i.contentQueries;
        if (
          (l && my(e, l),
          c && vy(e, c),
          py(e, i),
          Ig(e.outputs, i.outputs),
          Pt(i) && i.data.animation)
        ) {
          let h = e.data;
          h.animation = (h.animation || []).concat(i.data.animation);
        }
      }
      let o = i.features;
      if (o)
        for (let s = 0; s < o.length; s++) {
          let a = o[s];
          a && a.ngInherit && a(e), a === ke && (r = !1);
        }
    }
    t = Object.getPrototypeOf(t);
  }
  gy(n);
}
function py(e, t) {
  for (let r in t.inputs) {
    if (!t.inputs.hasOwnProperty(r) || e.inputs.hasOwnProperty(r)) continue;
    let n = t.inputs[r];
    if (
      n !== void 0 &&
      ((e.inputs[r] = n),
      (e.declaredInputs[r] = t.declaredInputs[r]),
      t.inputTransforms !== null)
    ) {
      let i = Array.isArray(n) ? n[0] : n;
      if (!t.inputTransforms.hasOwnProperty(i)) continue;
      (e.inputTransforms ??= {}), (e.inputTransforms[i] = t.inputTransforms[i]);
    }
  }
}
function gy(e) {
  let t = 0,
    r = null;
  for (let n = e.length - 1; n >= 0; n--) {
    let i = e[n];
    (i.hostVars = t += i.hostVars),
      (i.hostAttrs = gr(i.hostAttrs, (r = gr(r, i.hostAttrs))));
  }
}
function Ni(e) {
  return e === An ? {} : e === je ? [] : e;
}
function my(e, t) {
  let r = e.viewQuery;
  r
    ? (e.viewQuery = (n, i) => {
        t(n, i), r(n, i);
      })
    : (e.viewQuery = t);
}
function vy(e, t) {
  let r = e.contentQueries;
  r
    ? (e.contentQueries = (n, i, o) => {
        t(n, i, o), r(n, i, o);
      })
    : (e.contentQueries = t);
}
function yy(e, t) {
  let r = e.hostBindings;
  r
    ? (e.hostBindings = (n, i) => {
        t(n, i), r(n, i);
      })
    : (e.hostBindings = t);
}
var At = class {},
  Ir = class {};
var xa = class extends At {
    constructor(t, r, n) {
      super(),
        (this._parent = r),
        (this._bootstrapComponents = []),
        (this.destroyCbs = []),
        (this.componentFactoryResolver = new eo(this));
      let i = pd(t);
      (this._bootstrapComponents = df(i.bootstrap)),
        (this._r3Injector = Jd(
          t,
          r,
          [
            { provide: At, useValue: this },
            { provide: Do, useValue: this.componentFactoryResolver },
            ...n,
          ],
          _e(t),
          new Set(["environment"])
        )),
        this._r3Injector.resolveInjectorInitializers(),
        (this.instance = this._r3Injector.get(t));
    }
    get injector() {
      return this._r3Injector;
    }
    destroy() {
      let t = this._r3Injector;
      !t.destroyed && t.destroy(),
        this.destroyCbs.forEach((r) => r()),
        (this.destroyCbs = null);
    }
    onDestroy(t) {
      this.destroyCbs.push(t);
    }
  },
  Ia = class extends Ir {
    constructor(t) {
      super(), (this.moduleType = t);
    }
    create(t) {
      return new xa(this.moduleType, t, []);
    }
  };
var to = class extends At {
  constructor(t) {
    super(),
      (this.componentFactoryResolver = new eo(this)),
      (this.instance = null);
    let r = new mr(
      [
        ...t.providers,
        { provide: At, useValue: this },
        { provide: Do, useValue: this.componentFactoryResolver },
      ],
      t.parent || Ga(),
      t.debugName,
      new Set(["environment"])
    );
    (this.injector = r),
      t.runEnvironmentInitializers && r.resolveInjectorInitializers();
  }
  destroy() {
    this.injector.destroy();
  }
  onDestroy(t) {
    this.injector.onDestroy(t);
  }
};
function Cl(e, t, r = null) {
  return new to({
    providers: e,
    parent: t,
    debugName: r,
    runEnvironmentInitializers: !0,
  }).injector;
}
var Hn = (() => {
  let t = class t {
    constructor() {
      (this.taskId = 0),
        (this.pendingTasks = new Set()),
        (this.hasPendingTasks = new he(!1));
    }
    get _hasPendingTasks() {
      return this.hasPendingTasks.value;
    }
    add() {
      this._hasPendingTasks || this.hasPendingTasks.next(!0);
      let n = this.taskId++;
      return this.pendingTasks.add(n), n;
    }
    remove(n) {
      this.pendingTasks.delete(n),
        this.pendingTasks.size === 0 &&
          this._hasPendingTasks &&
          this.hasPendingTasks.next(!1);
    }
    ngOnDestroy() {
      this.pendingTasks.clear(),
        this._hasPendingTasks && this.hasPendingTasks.next(!1);
    }
  };
  (t.ɵfac = function (i) {
    return new (i || t)();
  }),
    (t.ɵprov = E({ token: t, factory: t.ɵfac, providedIn: "root" }));
  let e = t;
  return e;
})();
function wy(e, t, r) {
  return (e[t] = r);
}
function it(e, t, r) {
  let n = e[t];
  return Object.is(n, r) ? !1 : ((e[t] = r), !0);
}
function Cy(e, t, r, n) {
  let i = it(e, t, r);
  return it(e, t + 1, n) || i;
}
function by(e) {
  return (e.flags & 32) === 32;
}
function Dy(e, t, r, n, i, o, s, a, l) {
  let c = t.consts,
    h = wo(t, e, 4, s || null, Wi(c, a));
  If(t, r, h, Wi(c, l)), tl(t, h);
  let p = (h.tView = hl(
    2,
    h,
    n,
    i,
    o,
    t.directiveRegistry,
    t.pipeRegistry,
    null,
    t.schemas,
    c,
    null
  ));
  return (
    t.queries !== null &&
      (t.queries.template(t, h), (p.queries = t.queries.embeddedTView(h))),
    h
  );
}
function k(e, t, r, n, i, o, s, a) {
  let l = H(),
    c = xe(),
    h = e + ze,
    p = c.firstCreatePass ? Dy(h, c, l, t, r, n, i, o, s) : c.data[h];
  Tr(p, !1);
  let g = _y(c, l, p, e);
  Xa() && dl(c, l, g, p), tn(g, l);
  let m = Tf(g, l, g, p);
  return (
    (l[h] = m),
    Co(l, m),
    uy(m, p, l),
    qa(p) && Mf(c, l, p),
    s != null && Ef(l, p, a),
    k
  );
}
var _y = My;
function My(e, t, r, n) {
  return el(!0), t[ie].createComment("");
}
function sn(e, t, r, n) {
  let i = H(),
    o = Bn();
  if (it(i, o, t)) {
    let s = xe(),
      a = po();
    bv(a, i, e, t, r, n);
  }
  return sn;
}
function Gf(e, t, r, n) {
  return it(e, Bn(), r) ? t + Tn(r) + n : st;
}
function Ey(e, t, r, n, i, o) {
  let s = Zm(),
    a = Cy(e, s, r, i);
  return kd(2), a ? t + Tn(r) + n + Tn(i) + o : st;
}
function ki(e, t) {
  return (e << 17) | (t << 2);
}
function nn(e) {
  return (e >> 17) & 32767;
}
function xy(e) {
  return (e & 2) == 2;
}
function Iy(e, t) {
  return (e & 131071) | (t << 17);
}
function Sa(e) {
  return e | 2;
}
function jn(e) {
  return (e & 131068) >> 2;
}
function Zs(e, t) {
  return (e & -131069) | (t << 2);
}
function Sy(e) {
  return (e & 1) === 1;
}
function Oa(e) {
  return e | 1;
}
function Oy(e, t, r, n, i, o) {
  let s = o ? t.classBindings : t.styleBindings,
    a = nn(s),
    l = jn(s);
  e[n] = r;
  let c = !1,
    h;
  if (Array.isArray(r)) {
    let p = r;
    (h = p[1]), (h === null || Or(p, h) > 0) && (c = !0);
  } else h = r;
  if (i)
    if (l !== 0) {
      let g = nn(e[a + 1]);
      (e[n + 1] = ki(g, a)),
        g !== 0 && (e[g + 1] = Zs(e[g + 1], n)),
        (e[a + 1] = Iy(e[a + 1], n));
    } else
      (e[n + 1] = ki(a, 0)), a !== 0 && (e[a + 1] = Zs(e[a + 1], n)), (a = n);
  else
    (e[n + 1] = ki(l, 0)),
      a === 0 ? (a = n) : (e[l + 1] = Zs(e[l + 1], n)),
      (l = n);
  c && (e[n + 1] = Sa(e[n + 1])),
    Gu(e, h, n, !0),
    Gu(e, h, n, !1),
    Ty(t, h, e, n, o),
    (s = ki(a, l)),
    o ? (t.classBindings = s) : (t.styleBindings = s);
}
function Ty(e, t, r, n, i) {
  let o = i ? e.residualClasses : e.residualStyles;
  o != null &&
    typeof t == "string" &&
    Or(o, t) >= 0 &&
    (r[n + 1] = Oa(r[n + 1]));
}
function Gu(e, t, r, n) {
  let i = e[r + 1],
    o = t === null,
    s = n ? nn(i) : jn(i),
    a = !1;
  for (; s !== 0 && (a === !1 || o); ) {
    let l = e[s],
      c = e[s + 1];
    Py(l, t) && ((a = !0), (e[s + 1] = n ? Oa(c) : Sa(c))),
      (s = n ? nn(c) : jn(c));
  }
  a && (e[r + 1] = n ? Sa(i) : Oa(i));
}
function Py(e, t) {
  return e === null || t == null || (Array.isArray(e) ? e[1] : e) === t
    ? !0
    : Array.isArray(e) && typeof t == "string"
    ? Or(e, t) >= 0
    : !1;
}
function Ie(e, t, r) {
  let n = H(),
    i = Bn();
  if (it(n, i, t)) {
    let o = xe(),
      s = po();
    pl(o, s, n, e, t, n[ie], r, !1);
  }
  return Ie;
}
function Wu(e, t, r, n, i) {
  let o = t.inputs,
    s = i ? "class" : "style";
  gl(e, r, o[s], s, n);
}
function wt(e, t) {
  return Ay(e, t, null, !0), wt;
}
function Ay(e, t, r, n) {
  let i = H(),
    o = xe(),
    s = kd(2);
  if ((o.firstUpdatePass && ky(o, e, s, n), t !== st && it(i, s, t))) {
    let a = o.data[Rt()];
    jy(o, a, i, i[ie], e, (i[s + 1] = zy(t, r)), n, s);
  }
}
function Ny(e, t) {
  return t >= e.expandoStartIndex;
}
function ky(e, t, r, n) {
  let i = e.data;
  if (i[r + 1] === null) {
    let o = i[Rt()],
      s = Ny(e, r);
    Uy(o, n) && t === null && !s && (t = !1),
      (t = Fy(i, o, t, n)),
      Oy(i, o, t, r, s, n);
  }
}
function Fy(e, t, r, n) {
  let i = Xm(e),
    o = n ? t.residualClasses : t.residualStyles;
  if (i === null)
    (n ? t.classBindings : t.styleBindings) === 0 &&
      ((r = Ks(null, e, t, r, n)), (r = Sr(r, t.attrs, n)), (o = null));
  else {
    let s = t.directiveStylingLast;
    if (s === -1 || e[s] !== i)
      if (((r = Ks(i, e, t, r, n)), o === null)) {
        let l = Ry(e, t, n);
        l !== void 0 &&
          Array.isArray(l) &&
          ((l = Ks(null, e, t, l[1], n)),
          (l = Sr(l, t.attrs, n)),
          Ly(e, t, n, l));
      } else o = Vy(e, t, n);
  }
  return (
    o !== void 0 && (n ? (t.residualClasses = o) : (t.residualStyles = o)), r
  );
}
function Ry(e, t, r) {
  let n = r ? t.classBindings : t.styleBindings;
  if (jn(n) !== 0) return e[nn(n)];
}
function Ly(e, t, r, n) {
  let i = r ? t.classBindings : t.styleBindings;
  e[nn(i)] = n;
}
function Vy(e, t, r) {
  let n,
    i = t.directiveEnd;
  for (let o = 1 + t.directiveStylingLast; o < i; o++) {
    let s = e[o].hostAttrs;
    n = Sr(n, s, r);
  }
  return Sr(n, t.attrs, r);
}
function Ks(e, t, r, n, i) {
  let o = null,
    s = r.directiveEnd,
    a = r.directiveStylingLast;
  for (
    a === -1 ? (a = r.directiveStart) : a++;
    a < s && ((o = t[a]), (n = Sr(n, o.hostAttrs, i)), o !== e);

  )
    a++;
  return e !== null && (r.directiveStylingLast = a), n;
}
function Sr(e, t, r) {
  let n = r ? 1 : 2,
    i = -1;
  if (t !== null)
    for (let o = 0; o < t.length; o++) {
      let s = t[o];
      typeof s == "number"
        ? (i = s)
        : i === n &&
          (Array.isArray(e) || (e = e === void 0 ? [] : ["", e]),
          Zg(e, s, r ? !0 : t[++o]));
    }
  return e === void 0 ? null : e;
}
function jy(e, t, r, n, i, o, s, a) {
  if (!(t.type & 3)) return;
  let l = e.data,
    c = l[a + 1],
    h = Sy(c) ? qu(l, t, r, i, jn(c), s) : void 0;
  if (!no(h)) {
    no(o) || (xy(c) && (o = qu(l, null, r, i, a, s)));
    let p = Sd(Rt(), r);
    X0(n, s, p, i, o);
  }
}
function qu(e, t, r, n, i, o) {
  let s = t === null,
    a;
  for (; i > 0; ) {
    let l = e[i],
      c = Array.isArray(l),
      h = c ? l[1] : l,
      p = h === null,
      g = r[i + 1];
    g === st && (g = p ? je : void 0);
    let m = p ? Vs(g, n) : h === n ? g : void 0;
    if ((c && !no(m) && (m = Vs(l, n)), no(m) && ((a = m), s))) return a;
    let w = e[i + 1];
    i = s ? nn(w) : jn(w);
  }
  if (t !== null) {
    let l = o ? t.residualClasses : t.residualStyles;
    l != null && (a = Vs(l, n));
  }
  return a;
}
function no(e) {
  return e !== void 0;
}
function zy(e, t) {
  return (
    e == null ||
      e === "" ||
      (typeof t == "string"
        ? (e = e + t)
        : typeof e == "object" && (e = _e(go(e)))),
    e
  );
}
function Uy(e, t) {
  return (e.flags & (t ? 8 : 16)) !== 0;
}
var Ta = class {
  destroy(t) {}
  updateValue(t, r) {}
  swap(t, r) {
    let n = Math.min(t, r),
      i = Math.max(t, r),
      o = this.detach(i);
    if (i - n > 1) {
      let s = this.detach(n);
      this.attach(n, o), this.attach(i, s);
    } else this.attach(n, o);
  }
  move(t, r) {
    this.attach(r, this.detach(t));
  }
};
function Ys(e, t, r, n, i) {
  return e === r && Object.is(t, n) ? 1 : Object.is(i(e, t), i(r, n)) ? -1 : 0;
}
function By(e, t, r) {
  let n,
    i,
    o = 0,
    s = e.length - 1;
  if (Array.isArray(t)) {
    let a = t.length - 1;
    for (; o <= s && o <= a; ) {
      let l = e.at(o),
        c = t[o],
        h = Ys(o, l, o, c, r);
      if (h !== 0) {
        h < 0 && e.updateValue(o, c), o++;
        continue;
      }
      let p = e.at(s),
        g = t[a],
        m = Ys(s, p, a, g, r);
      if (m !== 0) {
        m < 0 && e.updateValue(s, g), s--, a--;
        continue;
      }
      let w = r(o, l),
        O = r(s, p),
        _ = r(o, c);
      if (Object.is(_, O)) {
        let D = r(a, g);
        Object.is(D, w)
          ? (e.swap(o, s), e.updateValue(s, g), a--, s--)
          : e.move(s, o),
          e.updateValue(o, c),
          o++;
        continue;
      }
      if (((n ??= new ro()), (i ??= Ku(e, o, s, r)), Pa(e, n, o, _)))
        e.updateValue(o, c), o++, s++;
      else if (i.has(_)) n.set(w, e.detach(o)), s--;
      else {
        let D = e.create(o, t[o]);
        e.attach(o, D), o++, s++;
      }
    }
    for (; o <= a; ) Zu(e, n, r, o, t[o]), o++;
  } else if (t != null) {
    let a = t[Symbol.iterator](),
      l = a.next();
    for (; !l.done && o <= s; ) {
      let c = e.at(o),
        h = l.value,
        p = Ys(o, c, o, h, r);
      if (p !== 0) p < 0 && e.updateValue(o, h), o++, (l = a.next());
      else {
        (n ??= new ro()), (i ??= Ku(e, o, s, r));
        let g = r(o, h);
        if (Pa(e, n, o, g)) e.updateValue(o, h), o++, s++, (l = a.next());
        else if (!i.has(g))
          e.attach(o, e.create(o, h)), o++, s++, (l = a.next());
        else {
          let m = r(o, c);
          n.set(m, e.detach(o)), s--;
        }
      }
    }
    for (; !l.done; ) Zu(e, n, r, e.length, l.value), (l = a.next());
  }
  for (; o <= s; ) e.destroy(e.detach(s--));
  n?.forEach((a) => {
    e.destroy(a);
  });
}
function Pa(e, t, r, n) {
  return t !== void 0 && t.has(n)
    ? (e.attach(r, t.get(n)), t.delete(n), !0)
    : !1;
}
function Zu(e, t, r, n, i) {
  if (Pa(e, t, n, r(n, i))) e.updateValue(n, i);
  else {
    let o = e.create(n, i);
    e.attach(n, o);
  }
}
function Ku(e, t, r, n) {
  let i = new Set();
  for (let o = t; o <= r; o++) i.add(n(o, e.at(o)));
  return i;
}
var ro = class {
  constructor() {
    (this.kvMap = new Map()), (this._vMap = void 0);
  }
  has(t) {
    return this.kvMap.has(t);
  }
  delete(t) {
    if (!this.has(t)) return !1;
    let r = this.kvMap.get(t);
    return (
      this._vMap !== void 0 && this._vMap.has(r)
        ? (this.kvMap.set(t, this._vMap.get(r)), this._vMap.delete(r))
        : this.kvMap.delete(t),
      !0
    );
  }
  get(t) {
    return this.kvMap.get(t);
  }
  set(t, r) {
    if (this.kvMap.has(t)) {
      let n = this.kvMap.get(t);
      this._vMap === void 0 && (this._vMap = new Map());
      let i = this._vMap;
      for (; i.has(n); ) n = i.get(n);
      i.set(n, r);
    } else this.kvMap.set(t, r);
  }
  forEach(t) {
    for (let [r, n] of this.kvMap)
      if ((t(n, r), this._vMap !== void 0)) {
        let i = this._vMap;
        for (; i.has(n); ) (n = i.get(n)), t(n, r);
      }
  }
};
function V(e, t, r) {
  Pr("NgControlFlow");
  let n = H(),
    i = Bn(),
    o = Fa(n, ze + e),
    s = 0;
  if (it(n, i, t)) {
    let a = U(null);
    try {
      if ((Ff(o, s), t !== -1)) {
        let l = Ra(n[F], ze + t),
          c = Mr(o, l.tView.ssrId),
          h = vl(n, l, r, { dehydratedView: c });
        bo(o, h, s, _r(l, c));
      }
    } finally {
      U(a);
    }
  } else {
    let a = kf(o, s);
    a !== void 0 && (a[ye] = r);
  }
}
var Aa = class {
  constructor(t, r, n) {
    (this.lContainer = t), (this.$implicit = r), (this.$index = n);
  }
  get $count() {
    return this.lContainer.length - be;
  }
};
function Mo(e, t) {
  return t;
}
var Na = class {
  constructor(t, r, n) {
    (this.hasEmptyBlock = t), (this.trackByFn = r), (this.liveCollection = n);
  }
};
function Eo(e, t, r, n, i, o, s, a, l, c, h, p, g) {
  Pr("NgControlFlow");
  let m = l !== void 0,
    w = H(),
    O = a ? s.bind(w[Ke][ye]) : s,
    _ = new Na(m, O);
  (w[ze + e] = _), k(e + 1, t, r, n, i, o), m && k(e + 2, l, c, h, p, g);
}
var ka = class extends Ta {
  constructor(t, r, n) {
    super(),
      (this.lContainer = t),
      (this.hostLView = r),
      (this.templateTNode = n),
      (this.needsIndexUpdate = !1);
  }
  get length() {
    return this.lContainer.length - be;
  }
  at(t) {
    return this.getLView(t)[ye].$implicit;
  }
  attach(t, r) {
    let n = r[vr];
    (this.needsIndexUpdate ||= t !== this.length),
      bo(this.lContainer, r, t, _r(this.templateTNode, n));
  }
  detach(t) {
    return (
      (this.needsIndexUpdate ||= t !== this.length - 1), $y(this.lContainer, t)
    );
  }
  create(t, r) {
    let n = Mr(this.lContainer, this.templateTNode.tView.ssrId);
    return vl(
      this.hostLView,
      this.templateTNode,
      new Aa(this.lContainer, r, t),
      { dehydratedView: n }
    );
  }
  destroy(t) {
    mo(t[F], t);
  }
  updateValue(t, r) {
    this.getLView(t)[ye].$implicit = r;
  }
  reset() {
    this.needsIndexUpdate = !1;
  }
  updateIndexes() {
    if (this.needsIndexUpdate)
      for (let t = 0; t < this.length; t++) this.getLView(t)[ye].$index = t;
  }
  getLView(t) {
    return Hy(this.lContainer, t);
  }
};
function xo(e) {
  let t = U(null),
    r = Rt();
  try {
    let n = H(),
      i = n[F],
      o = n[r];
    if (o.liveCollection === void 0) {
      let a = r + 1,
        l = Fa(n, a),
        c = Ra(i, a);
      o.liveCollection = new ka(l, n, c);
    } else o.liveCollection.reset();
    let s = o.liveCollection;
    if ((By(s, e, o.trackByFn), s.updateIndexes(), o.hasEmptyBlock)) {
      let a = Bn(),
        l = s.length === 0;
      if (it(n, a, l)) {
        let c = r + 2,
          h = Fa(n, c);
        if (l) {
          let p = Ra(i, c),
            g = Mr(h, p.tView.ssrId),
            m = vl(n, p, void 0, { dehydratedView: g });
          bo(h, m, 0, _r(p, g));
        } else Ff(h, 0);
      }
    }
  } finally {
    U(t);
  }
}
function Fa(e, t) {
  return e[t];
}
function $y(e, t) {
  return Dr(e, t);
}
function Hy(e, t) {
  return kf(e, t);
}
function Ra(e, t) {
  return Za(e, t);
}
function Gy(e, t, r, n, i, o) {
  let s = t.consts,
    a = Wi(s, i),
    l = wo(t, e, 2, n, a);
  return (
    If(t, r, l, Wi(s, o)),
    l.attrs !== null && _a(l, l.attrs, !1),
    l.mergedAttrs !== null && _a(l, l.mergedAttrs, !0),
    t.queries !== null && t.queries.elementStart(t, l),
    l
  );
}
function f(e, t, r, n) {
  let i = H(),
    o = xe(),
    s = ze + e,
    a = i[ie],
    l = o.firstCreatePass ? Gy(s, o, i, t, r, n) : o.data[s],
    c = Wy(o, i, l, a, t, e);
  i[s] = c;
  let h = qa(l);
  return (
    Tr(l, !0),
    yf(a, c, l),
    !by(l) && Xa() && dl(o, i, c, l),
    Vm() === 0 && tn(c, i),
    jm(),
    h && (Mf(o, i, l), _f(o, l, i)),
    n !== null && Ef(i, l),
    f
  );
}
function u() {
  let e = Be();
  Nd() ? Gm() : ((e = e.parent), Tr(e, !1));
  let t = e;
  Bm(t) && $m(), zm();
  let r = xe();
  return (
    r.firstCreatePass && (tl(r, e), _d(e) && r.queries.elementEnd(e)),
    t.classesWithoutHost != null &&
      s0(t) &&
      Wu(r, t, H(), t.classesWithoutHost, !0),
    t.stylesWithoutHost != null &&
      a0(t) &&
      Wu(r, t, H(), t.stylesWithoutHost, !1),
    u
  );
}
function b(e, t, r, n) {
  return f(e, t, r, n), u(), b;
}
var Wy = (e, t, r, n, i, o) => (el(!0), ff(n, i, n0()));
function $e() {
  return H();
}
var io = "en-US";
var qy = io;
function Zy(e) {
  typeof e == "string" && (qy = e.toLowerCase().replace(/_/g, "-"));
}
function X(e, t, r, n) {
  let i = H(),
    o = xe(),
    s = Be();
  return Wf(o, i, i[ie], s, e, t, n), X;
}
function Ky(e, t, r, n) {
  let i = e.cleanup;
  if (i != null)
    for (let o = 0; o < i.length - 1; o += 2) {
      let s = i[o];
      if (s === r && i[o + 1] === n) {
        let a = t[yr],
          l = i[o + 2];
        return a.length > l ? a[l] : null;
      }
      typeof s == "string" && (o += 2);
    }
  return null;
}
function Wf(e, t, r, n, i, o, s) {
  let a = qa(n),
    c = e.firstCreatePass && xv(e),
    h = t[ye],
    p = Ev(t),
    g = !0;
  if (n.type & 3 || s) {
    let O = Ue(n, t),
      _ = s ? s(O) : O,
      D = p.length,
      me = s ? (Y) => s(rt(Y[n.index])) : n.index,
      fe = null;
    if ((!s && a && (fe = Ky(e, t, i, n.index)), fe !== null)) {
      let Y = fe.__ngLastListenerFn__ || fe;
      (Y.__ngNextListenerFn__ = o), (fe.__ngLastListenerFn__ = o), (g = !1);
    } else {
      o = Qu(n, t, h, o, !1);
      let Y = r.listen(_, i, o);
      p.push(o, Y), c && c.push(i, me, D, D + 1);
    }
  } else o = Qu(n, t, h, o, !1);
  let m = n.outputs,
    w;
  if (g && m !== null && (w = m[i])) {
    let O = w.length;
    if (O)
      for (let _ = 0; _ < O; _ += 2) {
        let D = w[_],
          me = w[_ + 1],
          Je = t[D][me].subscribe(o),
          Oe = p.length;
        p.push(o, Je), c && c.push(i, n.index, Oe, -(Oe + 1));
      }
  }
}
function Yu(e, t, r, n) {
  let i = U(null);
  try {
    return et(6, t, r), r(n) !== !1;
  } catch (o) {
    return Af(e, o), !1;
  } finally {
    et(7, t, r), U(i);
  }
}
function Qu(e, t, r, n, i) {
  return function o(s) {
    if (s === Function) return n;
    let a = e.componentOffset > -1 ? Ft(e.index, t) : t;
    yl(a);
    let l = Yu(t, r, n, s),
      c = o.__ngNextListenerFn__;
    for (; c; ) (l = Yu(t, r, c, s) && l), (c = c.__ngNextListenerFn__);
    return i && l === !1 && s.preventDefault(), l;
  };
}
function j(e = 1) {
  return t0(e);
}
function Gn(e, t, r) {
  return Wn(e, "", t, "", r), Gn;
}
function Wn(e, t, r, n, i) {
  let o = H(),
    s = Gf(o, t, r, n);
  if (s !== st) {
    let a = xe(),
      l = po();
    pl(a, l, o, e, s, o[ie], i, !1);
  }
  return Wn;
}
function Fe(e) {
  let t = Wm();
  return Nm(t, ze + e);
}
function d(e, t = "") {
  let r = H(),
    n = xe(),
    i = e + ze,
    o = n.firstCreatePass ? wo(n, i, 1, t, null) : n.data[i],
    s = Yy(n, r, o, t, e);
  (r[i] = s), Xa() && dl(n, r, s, o), Tr(o, !1);
}
var Yy = (e, t, r, n, i) => (el(!0), k0(t[ie], n));
function at(e) {
  return Ar("", e, ""), at;
}
function Ar(e, t, r) {
  let n = H(),
    i = Gf(n, e, t, r);
  return i !== st && Nf(n, Rt(), i), Ar;
}
function Io(e, t, r, n, i) {
  let o = H(),
    s = Ey(o, e, t, r, n, i);
  return s !== st && Nf(o, Rt(), s), Io;
}
function lt(e, t, r) {
  Hf(t) && (t = t());
  let n = H(),
    i = Bn();
  if (it(n, i, t)) {
    let o = xe(),
      s = po();
    pl(o, s, n, e, t, n[ie], r, !1);
  }
  return lt;
}
function Ct(e, t) {
  let r = Hf(e);
  return r && e.set(t), r;
}
function ct(e, t) {
  let r = H(),
    n = xe(),
    i = Be();
  return Wf(n, r, r[ie], i, e, t), ct;
}
function Qy(e, t, r) {
  let n = xe();
  if (n.firstCreatePass) {
    let i = Pt(e);
    La(r, n.data, n.blueprint, i, !0), La(t, n.data, n.blueprint, i, !1);
  }
}
function La(e, t, r, n, i) {
  if (((e = Ce(e)), Array.isArray(e)))
    for (let o = 0; o < e.length; o++) La(e[o], t, r, n, i);
  else {
    let o = xe(),
      s = H(),
      a = Be(),
      l = kn(e) ? e : Ce(e.provide),
      c = Cd(e),
      h = a.providerIndexes & 1048575,
      p = a.directiveStart,
      g = a.providerIndexes >> 20;
    if (kn(e) || !e.multi) {
      let m = new en(c, i, Q),
        w = Js(l, t, i ? h : h + g, p);
      w === -1
        ? (ua(Ki(a, s), o, l),
          Qs(o, e, t.length),
          t.push(l),
          a.directiveStart++,
          a.directiveEnd++,
          i && (a.providerIndexes += 1048576),
          r.push(m),
          s.push(m))
        : ((r[w] = m), (s[w] = m));
    } else {
      let m = Js(l, t, h + g, p),
        w = Js(l, t, h, h + g),
        O = m >= 0 && r[m],
        _ = w >= 0 && r[w];
      if ((i && !_) || (!i && !O)) {
        ua(Ki(a, s), o, l);
        let D = ew(i ? Xy : Jy, r.length, i, n, c);
        !i && _ && (r[w].providerFactory = D),
          Qs(o, e, t.length, 0),
          t.push(l),
          a.directiveStart++,
          a.directiveEnd++,
          i && (a.providerIndexes += 1048576),
          r.push(D),
          s.push(D);
      } else {
        let D = qf(r[i ? w : m], c, !i && n);
        Qs(o, e, m > -1 ? m : w, D);
      }
      !i && n && _ && r[w].componentProviders++;
    }
  }
}
function Qs(e, t, r, n) {
  let i = kn(t),
    o = mm(t);
  if (i || o) {
    let l = (o ? Ce(t.useClass) : t).prototype.ngOnDestroy;
    if (l) {
      let c = e.destroyHooks || (e.destroyHooks = []);
      if (!i && t.multi) {
        let h = c.indexOf(r);
        h === -1 ? c.push(r, [n, l]) : c[h + 1].push(n, l);
      } else c.push(r, l);
    }
  }
}
function qf(e, t, r) {
  return r && e.componentProviders++, e.multi.push(t) - 1;
}
function Js(e, t, r, n) {
  for (let i = r; i < n; i++) if (t[i] === e) return i;
  return -1;
}
function Jy(e, t, r, n) {
  return Va(this.multi, []);
}
function Xy(e, t, r, n) {
  let i = this.multi,
    o;
  if (this.providerFactory) {
    let s = this.providerFactory.componentProviders,
      a = Ln(r, r[F], this.providerFactory.index, n);
    (o = a.slice(0, s)), Va(i, o);
    for (let l = s; l < a.length; l++) o.push(a[l]);
  } else (o = []), Va(i, o);
  return o;
}
function Va(e, t) {
  for (let r = 0; r < e.length; r++) {
    let n = e[r];
    t.push(n());
  }
  return t;
}
function ew(e, t, r, n, i) {
  let o = new en(e, r, Q);
  return (
    (o.multi = []),
    (o.index = t),
    (o.componentProviders = 0),
    qf(o, i, n && !r),
    o
  );
}
function bt(e, t = []) {
  return (r) => {
    r.providersResolver = (n, i) => Qy(n, i ? i(e) : e, t);
  };
}
var tw = (() => {
  let t = class t {
    constructor(n) {
      (this._injector = n), (this.cachedInjectors = new Map());
    }
    getOrCreateStandaloneInjector(n) {
      if (!n.standalone) return null;
      if (!this.cachedInjectors.has(n)) {
        let i = vd(!1, n.type),
          o =
            i.length > 0
              ? Cl([i], this._injector, `Standalone[${n.type.name}]`)
              : null;
        this.cachedInjectors.set(n, o);
      }
      return this.cachedInjectors.get(n);
    }
    ngOnDestroy() {
      try {
        for (let n of this.cachedInjectors.values()) n !== null && n.destroy();
      } finally {
        this.cachedInjectors.clear();
      }
    }
  };
  t.ɵprov = E({
    token: t,
    providedIn: "environment",
    factory: () => new t(P(Ee)),
  });
  let e = t;
  return e;
})();
function W(e) {
  Pr("NgStandalone"),
    (e.getStandaloneInjector = (t) =>
      t.get(tw).getOrCreateStandaloneInjector(e));
}
function Dt(e, t, r, n) {
  return rw(H(), qm(), e, t, r, n);
}
function nw(e, t) {
  let r = e[t];
  return r === st ? void 0 : r;
}
function rw(e, t, r, n, i, o) {
  let s = t + r;
  return it(e, s, i) ? wy(e, s + 1, o ? n.call(o, i) : n(i)) : nw(e, s + 1);
}
var So = (() => {
  let t = class t {
    log(n) {
      console.log(n);
    }
    warn(n) {
      console.warn(n);
    }
  };
  (t.ɵfac = function (i) {
    return new (i || t)();
  }),
    (t.ɵprov = E({ token: t, factory: t.ɵfac, providedIn: "platform" }));
  let e = t;
  return e;
})();
var Zf = new x("");
function an(e) {
  return !!e && typeof e.then == "function";
}
function Kf(e) {
  return !!e && typeof e.subscribe == "function";
}
var Yf = new x(""),
  Qf = (() => {
    let t = class t {
      constructor() {
        (this.initialized = !1),
          (this.done = !1),
          (this.donePromise = new Promise((n, i) => {
            (this.resolve = n), (this.reject = i);
          })),
          (this.appInits = v(Yf, { optional: !0 }) ?? []);
      }
      runInitializers() {
        if (this.initialized) return;
        let n = [];
        for (let o of this.appInits) {
          let s = o();
          if (an(s)) n.push(s);
          else if (Kf(s)) {
            let a = new Promise((l, c) => {
              s.subscribe({ complete: l, error: c });
            });
            n.push(a);
          }
        }
        let i = () => {
          (this.done = !0), this.resolve();
        };
        Promise.all(n)
          .then(() => {
            i();
          })
          .catch((o) => {
            this.reject(o);
          }),
          n.length === 0 && i(),
          (this.initialized = !0);
      }
    };
    (t.ɵfac = function (i) {
      return new (i || t)();
    }),
      (t.ɵprov = E({ token: t, factory: t.ɵfac, providedIn: "root" }));
    let e = t;
    return e;
  })(),
  Oo = new x("");
function iw() {
  Wc(() => {
    throw new M(600, !1);
  });
}
function ow(e) {
  return e.isBoundToModule;
}
function sw(e, t, r) {
  try {
    let n = r();
    return an(n)
      ? n.catch((i) => {
          throw (t.runOutsideAngular(() => e.handleError(i)), i);
        })
      : n;
  } catch (n) {
    throw (t.runOutsideAngular(() => e.handleError(n)), n);
  }
}
var qn = (() => {
  let t = class t {
    constructor() {
      (this._bootstrapListeners = []),
        (this._runningTick = !1),
        (this._destroyed = !1),
        (this._destroyListeners = []),
        (this._views = []),
        (this.internalErrorHandler = v(Xd)),
        (this.afterRenderEffectManager = v(Bf)),
        (this.externalTestViews = new Set()),
        (this.beforeRender = new ne()),
        (this.afterTick = new ne()),
        (this.componentTypes = []),
        (this.components = []),
        (this.isStable = v(Hn).hasPendingTasks.pipe(A((n) => !n))),
        (this._injector = v(Ee));
    }
    get destroyed() {
      return this._destroyed;
    }
    get injector() {
      return this._injector;
    }
    bootstrap(n, i) {
      let o = n instanceof Xi;
      if (!this._injector.get(Qf).done) {
        let m = !o && hd(n),
          w = !1;
        throw new M(405, w);
      }
      let a;
      o ? (a = n) : (a = this._injector.get(Do).resolveComponentFactory(n)),
        this.componentTypes.push(a.componentType);
      let l = ow(a) ? void 0 : this._injector.get(At),
        c = i || a.selector,
        h = a.create($n.NULL, [], c, l),
        p = h.location.nativeElement,
        g = h.injector.get(Zf, null);
      return (
        g?.registerApplication(p),
        h.onDestroy(() => {
          this.detachView(h.hostView),
            Xs(this.components, h),
            g?.unregisterApplication(p);
        }),
        this._loadComponent(h),
        h
      );
    }
    tick() {
      this._tick(!0);
    }
    _tick(n) {
      if (this._runningTick) throw new M(101, !1);
      let i = U(null);
      try {
        (this._runningTick = !0), this.detectChangesInAttachedViews(n);
      } catch (o) {
        this.internalErrorHandler(o);
      } finally {
        this.afterTick.next(), (this._runningTick = !1), U(i);
      }
    }
    detectChangesInAttachedViews(n) {
      let i = 0,
        o = this.afterRenderEffectManager;
      for (;;) {
        if (i === Lf) throw new M(103, !1);
        if (n) {
          let s = i === 0;
          this.beforeRender.next(s);
          for (let { _lView: a, notifyErrorHandler: l } of this._views)
            aw(a, s, l);
        }
        if (
          (i++,
          o.executeInternalCallbacks(),
          ![...this.externalTestViews.keys(), ...this._views].some(
            ({ _lView: s }) => ja(s)
          ) &&
            (o.execute(),
            ![...this.externalTestViews.keys(), ...this._views].some(
              ({ _lView: s }) => ja(s)
            )))
        )
          break;
      }
    }
    attachView(n) {
      let i = n;
      this._views.push(i), i.attachToAppRef(this);
    }
    detachView(n) {
      let i = n;
      Xs(this._views, i), i.detachFromAppRef();
    }
    _loadComponent(n) {
      this.attachView(n.hostView), this.tick(), this.components.push(n);
      let i = this._injector.get(Oo, []);
      [...this._bootstrapListeners, ...i].forEach((o) => o(n));
    }
    ngOnDestroy() {
      if (!this._destroyed)
        try {
          this._destroyListeners.forEach((n) => n()),
            this._views.slice().forEach((n) => n.destroy());
        } finally {
          (this._destroyed = !0),
            (this._views = []),
            (this._bootstrapListeners = []),
            (this._destroyListeners = []);
        }
    }
    onDestroy(n) {
      return (
        this._destroyListeners.push(n), () => Xs(this._destroyListeners, n)
      );
    }
    destroy() {
      if (this._destroyed) throw new M(406, !1);
      let n = this._injector;
      n.destroy && !n.destroyed && n.destroy();
    }
    get viewCount() {
      return this._views.length;
    }
    warnIfDestroyed() {}
  };
  (t.ɵfac = function (i) {
    return new (i || t)();
  }),
    (t.ɵprov = E({ token: t, factory: t.ɵfac, providedIn: "root" }));
  let e = t;
  return e;
})();
function Xs(e, t) {
  let r = e.indexOf(t);
  r > -1 && e.splice(r, 1);
}
function aw(e, t, r) {
  (!t && !ja(e)) || lw(e, r, t);
}
function ja(e) {
  return Ya(e);
}
function lw(e, t, r) {
  let n;
  r ? ((n = 0), (e[I] |= 1024)) : e[I] & 64 ? (n = 0) : (n = 1), Vf(e, t, n);
}
var za = class {
    constructor(t, r) {
      (this.ngModuleFactory = t), (this.componentFactories = r);
    }
  },
  bl = (() => {
    let t = class t {
      compileModuleSync(n) {
        return new Ia(n);
      }
      compileModuleAsync(n) {
        return Promise.resolve(this.compileModuleSync(n));
      }
      compileModuleAndAllComponentsSync(n) {
        let i = this.compileModuleSync(n),
          o = pd(n),
          s = df(o.declarations).reduce((a, l) => {
            let c = Yt(l);
            return c && a.push(new xr(c)), a;
          }, []);
        return new za(i, s);
      }
      compileModuleAndAllComponentsAsync(n) {
        return Promise.resolve(this.compileModuleAndAllComponentsSync(n));
      }
      clearCache() {}
      clearCacheFor(n) {}
      getModuleId(n) {}
    };
    (t.ɵfac = function (i) {
      return new (i || t)();
    }),
      (t.ɵprov = E({ token: t, factory: t.ɵfac, providedIn: "root" }));
    let e = t;
    return e;
  })();
var cw = (() => {
  let t = class t {
    constructor() {
      (this.zone = v(ee)), (this.applicationRef = v(qn));
    }
    initialize() {
      this._onMicrotaskEmptySubscription ||
        (this._onMicrotaskEmptySubscription =
          this.zone.onMicrotaskEmpty.subscribe({
            next: () => {
              this.zone.run(() => {
                this.applicationRef.tick();
              });
            },
          }));
    }
    ngOnDestroy() {
      this._onMicrotaskEmptySubscription?.unsubscribe();
    }
  };
  (t.ɵfac = function (i) {
    return new (i || t)();
  }),
    (t.ɵprov = E({ token: t, factory: t.ɵfac, providedIn: "root" }));
  let e = t;
  return e;
})();
function uw(e) {
  return [
    { provide: ee, useFactory: e },
    {
      provide: Nn,
      multi: !0,
      useFactory: () => {
        let t = v(cw, { optional: !0 });
        return () => t.initialize();
      },
    },
    {
      provide: Nn,
      multi: !0,
      useFactory: () => {
        let t = v(pw);
        return () => {
          t.initialize();
        };
      },
    },
    { provide: Xd, useFactory: dw },
  ];
}
function dw() {
  let e = v(ee),
    t = v(pt);
  return (r) => e.runOutsideAngular(() => t.handleError(r));
}
function fw(e) {
  let t = uw(() => new ee(hw(e)));
  return zn([[], t]);
}
function hw(e) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: e?.runCoalescing ?? !1,
  };
}
var pw = (() => {
  let t = class t {
    constructor() {
      (this.subscription = new ae()),
        (this.initialized = !1),
        (this.zone = v(ee)),
        (this.pendingTasks = v(Hn));
    }
    initialize() {
      if (this.initialized) return;
      this.initialized = !0;
      let n = null;
      !this.zone.isStable &&
        !this.zone.hasPendingMacrotasks &&
        !this.zone.hasPendingMicrotasks &&
        (n = this.pendingTasks.add()),
        this.zone.runOutsideAngular(() => {
          this.subscription.add(
            this.zone.onStable.subscribe(() => {
              ee.assertNotInAngularZone(),
                queueMicrotask(() => {
                  n !== null &&
                    !this.zone.hasPendingMacrotasks &&
                    !this.zone.hasPendingMicrotasks &&
                    (this.pendingTasks.remove(n), (n = null));
                });
            })
          );
        }),
        this.subscription.add(
          this.zone.onUnstable.subscribe(() => {
            ee.assertInAngularZone(), (n ??= this.pendingTasks.add());
          })
        );
    }
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
  };
  (t.ɵfac = function (i) {
    return new (i || t)();
  }),
    (t.ɵprov = E({ token: t, factory: t.ɵfac, providedIn: "root" }));
  let e = t;
  return e;
})();
function gw() {
  return (typeof $localize < "u" && $localize.locale) || io;
}
var Dl = new x("", {
  providedIn: "root",
  factory: () => v(Dl, L.Optional | L.SkipSelf) || gw(),
});
var Jf = new x("");
var ji = null;
function mw(e = [], t) {
  return $n.create({
    name: t,
    providers: [
      { provide: co, useValue: "platform" },
      { provide: Jf, useValue: new Set([() => (ji = null)]) },
      ...e,
    ],
  });
}
function vw(e = []) {
  if (ji) return ji;
  let t = mw(e);
  return (ji = t), iw(), yw(t), t;
}
function yw(e) {
  e.get(ol, null)?.forEach((r) => r());
}
var ln = (() => {
  let t = class t {};
  t.__NG_ELEMENT_ID__ = ww;
  let e = t;
  return e;
})();
function ww(e) {
  return Cw(Be(), H(), (e & 16) === 16);
}
function Cw(e, t, r) {
  if (ho(e) && !r) {
    let n = Ft(e.index, t);
    return new Vn(n, n);
  } else if (e.type & 47) {
    let n = t[Ke];
    return new Vn(n, t);
  }
  return null;
}
function Xf(e) {
  try {
    let { rootComponent: t, appProviders: r, platformProviders: n } = e,
      i = vw(n),
      o = [fw(), ...(r || [])],
      a = new to({
        providers: o,
        parent: i,
        debugName: "",
        runEnvironmentInitializers: !1,
      }).injector,
      l = a.get(ee);
    return l.run(() => {
      a.resolveInjectorInitializers();
      let c = a.get(pt, null),
        h;
      l.runOutsideAngular(() => {
        h = l.onError.subscribe({
          next: (m) => {
            c.handleError(m);
          },
        });
      });
      let p = () => a.destroy(),
        g = i.get(Jf);
      return (
        g.add(p),
        a.onDestroy(() => {
          h.unsubscribe(), g.delete(p);
        }),
        sw(c, l, () => {
          let m = a.get(Qf);
          return (
            m.runInitializers(),
            m.donePromise.then(() => {
              let w = a.get(Dl, io);
              Zy(w || io);
              let O = a.get(qn);
              return t !== void 0 && O.bootstrap(t), O;
            })
          );
        })
      );
    });
  } catch (t) {
    return Promise.reject(t);
  }
}
function Nr(e) {
  return typeof e == "boolean" ? e : e != null && e !== "false";
}
var rh = null;
function _t() {
  return rh;
}
function ih(e) {
  rh ??= e;
}
var To = class {};
var Se = new x(""),
  oh = (() => {
    let t = class t {
      historyGo(n) {
        throw new Error("");
      }
    };
    (t.ɵfac = function (i) {
      return new (i || t)();
    }),
      (t.ɵprov = E({ token: t, factory: () => v(_w), providedIn: "platform" }));
    let e = t;
    return e;
  })();
var _w = (() => {
  let t = class t extends oh {
    constructor() {
      super(),
        (this._doc = v(Se)),
        (this._location = window.location),
        (this._history = window.history);
    }
    getBaseHrefFromDOM() {
      return _t().getBaseHref(this._doc);
    }
    onPopState(n) {
      let i = _t().getGlobalEventTarget(this._doc, "window");
      return (
        i.addEventListener("popstate", n, !1),
        () => i.removeEventListener("popstate", n)
      );
    }
    onHashChange(n) {
      let i = _t().getGlobalEventTarget(this._doc, "window");
      return (
        i.addEventListener("hashchange", n, !1),
        () => i.removeEventListener("hashchange", n)
      );
    }
    get href() {
      return this._location.href;
    }
    get protocol() {
      return this._location.protocol;
    }
    get hostname() {
      return this._location.hostname;
    }
    get port() {
      return this._location.port;
    }
    get pathname() {
      return this._location.pathname;
    }
    get search() {
      return this._location.search;
    }
    get hash() {
      return this._location.hash;
    }
    set pathname(n) {
      this._location.pathname = n;
    }
    pushState(n, i, o) {
      this._history.pushState(n, i, o);
    }
    replaceState(n, i, o) {
      this._history.replaceState(n, i, o);
    }
    forward() {
      this._history.forward();
    }
    back() {
      this._history.back();
    }
    historyGo(n = 0) {
      this._history.go(n);
    }
    getState() {
      return this._history.state;
    }
  };
  (t.ɵfac = function (i) {
    return new (i || t)();
  }),
    (t.ɵprov = E({ token: t, factory: () => new t(), providedIn: "platform" }));
  let e = t;
  return e;
})();
function sh(e, t) {
  if (e.length == 0) return t;
  if (t.length == 0) return e;
  let r = 0;
  return (
    e.endsWith("/") && r++,
    t.startsWith("/") && r++,
    r == 2 ? e + t.substring(1) : r == 1 ? e + t : e + "/" + t
  );
}
function eh(e) {
  let t = e.match(/#|\?|$/),
    r = (t && t.index) || e.length,
    n = r - (e[r - 1] === "/" ? 1 : 0);
  return e.slice(0, n) + e.slice(r);
}
function cn(e) {
  return e && e[0] !== "?" ? "?" + e : e;
}
var Po = (() => {
    let t = class t {
      historyGo(n) {
        throw new Error("");
      }
    };
    (t.ɵfac = function (i) {
      return new (i || t)();
    }),
      (t.ɵprov = E({ token: t, factory: () => v(ah), providedIn: "root" }));
    let e = t;
    return e;
  })(),
  Mw = new x(""),
  ah = (() => {
    let t = class t extends Po {
      constructor(n, i) {
        super(),
          (this._platformLocation = n),
          (this._removeListenerFns = []),
          (this._baseHref =
            i ??
            this._platformLocation.getBaseHrefFromDOM() ??
            v(Se).location?.origin ??
            "");
      }
      ngOnDestroy() {
        for (; this._removeListenerFns.length; )
          this._removeListenerFns.pop()();
      }
      onPopState(n) {
        this._removeListenerFns.push(
          this._platformLocation.onPopState(n),
          this._platformLocation.onHashChange(n)
        );
      }
      getBaseHref() {
        return this._baseHref;
      }
      prepareExternalUrl(n) {
        return sh(this._baseHref, n);
      }
      path(n = !1) {
        let i =
            this._platformLocation.pathname + cn(this._platformLocation.search),
          o = this._platformLocation.hash;
        return o && n ? `${i}${o}` : i;
      }
      pushState(n, i, o, s) {
        let a = this.prepareExternalUrl(o + cn(s));
        this._platformLocation.pushState(n, i, a);
      }
      replaceState(n, i, o, s) {
        let a = this.prepareExternalUrl(o + cn(s));
        this._platformLocation.replaceState(n, i, a);
      }
      forward() {
        this._platformLocation.forward();
      }
      back() {
        this._platformLocation.back();
      }
      getState() {
        return this._platformLocation.getState();
      }
      historyGo(n = 0) {
        this._platformLocation.historyGo?.(n);
      }
    };
    (t.ɵfac = function (i) {
      return new (i || t)(P(oh), P(Mw, 8));
    }),
      (t.ɵprov = E({ token: t, factory: t.ɵfac, providedIn: "root" }));
    let e = t;
    return e;
  })();
var kr = (() => {
  let t = class t {
    constructor(n) {
      (this._subject = new ve()),
        (this._urlChangeListeners = []),
        (this._urlChangeSubscription = null),
        (this._locationStrategy = n);
      let i = this._locationStrategy.getBaseHref();
      (this._basePath = Iw(eh(th(i)))),
        this._locationStrategy.onPopState((o) => {
          this._subject.emit({
            url: this.path(!0),
            pop: !0,
            state: o.state,
            type: o.type,
          });
        });
    }
    ngOnDestroy() {
      this._urlChangeSubscription?.unsubscribe(),
        (this._urlChangeListeners = []);
    }
    path(n = !1) {
      return this.normalize(this._locationStrategy.path(n));
    }
    getState() {
      return this._locationStrategy.getState();
    }
    isCurrentPathEqualTo(n, i = "") {
      return this.path() == this.normalize(n + cn(i));
    }
    normalize(n) {
      return t.stripTrailingSlash(xw(this._basePath, th(n)));
    }
    prepareExternalUrl(n) {
      return (
        n && n[0] !== "/" && (n = "/" + n),
        this._locationStrategy.prepareExternalUrl(n)
      );
    }
    go(n, i = "", o = null) {
      this._locationStrategy.pushState(o, "", n, i),
        this._notifyUrlChangeListeners(this.prepareExternalUrl(n + cn(i)), o);
    }
    replaceState(n, i = "", o = null) {
      this._locationStrategy.replaceState(o, "", n, i),
        this._notifyUrlChangeListeners(this.prepareExternalUrl(n + cn(i)), o);
    }
    forward() {
      this._locationStrategy.forward();
    }
    back() {
      this._locationStrategy.back();
    }
    historyGo(n = 0) {
      this._locationStrategy.historyGo?.(n);
    }
    onUrlChange(n) {
      return (
        this._urlChangeListeners.push(n),
        (this._urlChangeSubscription ??= this.subscribe((i) => {
          this._notifyUrlChangeListeners(i.url, i.state);
        })),
        () => {
          let i = this._urlChangeListeners.indexOf(n);
          this._urlChangeListeners.splice(i, 1),
            this._urlChangeListeners.length === 0 &&
              (this._urlChangeSubscription?.unsubscribe(),
              (this._urlChangeSubscription = null));
        }
      );
    }
    _notifyUrlChangeListeners(n = "", i) {
      this._urlChangeListeners.forEach((o) => o(n, i));
    }
    subscribe(n, i, o) {
      return this._subject.subscribe({ next: n, error: i, complete: o });
    }
  };
  (t.normalizeQueryParams = cn),
    (t.joinWithSlash = sh),
    (t.stripTrailingSlash = eh),
    (t.ɵfac = function (i) {
      return new (i || t)(P(Po));
    }),
    (t.ɵprov = E({ token: t, factory: () => Ew(), providedIn: "root" }));
  let e = t;
  return e;
})();
function Ew() {
  return new kr(P(Po));
}
function xw(e, t) {
  if (!e || !t.startsWith(e)) return t;
  let r = t.substring(e.length);
  return r === "" || ["/", ";", "?", "#"].includes(r[0]) ? r : t;
}
function th(e) {
  return e.replace(/\/index.html$/, "");
}
function Iw(e) {
  if (new RegExp("^(https?:)?//").test(e)) {
    let [, r] = e.split(/\/\/[^\/]+/);
    return r;
  }
  return e;
}
function Ao(e, t) {
  t = encodeURIComponent(t);
  for (let r of e.split(";")) {
    let n = r.indexOf("="),
      [i, o] = n == -1 ? [r, ""] : [r.slice(0, n), r.slice(n + 1)];
    if (i.trim() === t) return decodeURIComponent(o);
  }
  return null;
}
var _l = /\s+/,
  nh = [],
  Kn = (() => {
    let t = class t {
      constructor(n, i) {
        (this._ngEl = n),
          (this._renderer = i),
          (this.initialClasses = nh),
          (this.stateMap = new Map());
      }
      set klass(n) {
        this.initialClasses = n != null ? n.trim().split(_l) : nh;
      }
      set ngClass(n) {
        this.rawClass = typeof n == "string" ? n.trim().split(_l) : n;
      }
      ngDoCheck() {
        for (let i of this.initialClasses) this._updateState(i, !0);
        let n = this.rawClass;
        if (Array.isArray(n) || n instanceof Set)
          for (let i of n) this._updateState(i, !0);
        else if (n != null)
          for (let i of Object.keys(n)) this._updateState(i, !!n[i]);
        this._applyStateDiff();
      }
      _updateState(n, i) {
        let o = this.stateMap.get(n);
        o !== void 0
          ? (o.enabled !== i && ((o.changed = !0), (o.enabled = i)),
            (o.touched = !0))
          : this.stateMap.set(n, { enabled: i, changed: !0, touched: !0 });
      }
      _applyStateDiff() {
        for (let n of this.stateMap) {
          let i = n[0],
            o = n[1];
          o.changed
            ? (this._toggleClass(i, o.enabled), (o.changed = !1))
            : o.touched ||
              (o.enabled && this._toggleClass(i, !1), this.stateMap.delete(i)),
            (o.touched = !1);
        }
      }
      _toggleClass(n, i) {
        (n = n.trim()),
          n.length > 0 &&
            n.split(_l).forEach((o) => {
              i
                ? this._renderer.addClass(this._ngEl.nativeElement, o)
                : this._renderer.removeClass(this._ngEl.nativeElement, o);
            });
      }
    };
    (t.ɵfac = function (i) {
      return new (i || t)(Q(Lt), Q(on));
    }),
      (t.ɵdir = ce({
        type: t,
        selectors: [["", "ngClass", ""]],
        inputs: { klass: [Me.None, "class", "klass"], ngClass: "ngClass" },
        standalone: !0,
      }));
    let e = t;
    return e;
  })();
var pe = (() => {
    let t = class t {};
    (t.ɵfac = function (i) {
      return new (i || t)();
    }),
      (t.ɵmod = kt({ type: t })),
      (t.ɵinj = Nt({}));
    let e = t;
    return e;
  })(),
  lh = "browser",
  Sw = "server";
function No(e) {
  return e === Sw;
}
var Zn = class {};
var Rr = class {},
  Ro = class {},
  un = class e {
    constructor(t) {
      (this.normalizedNames = new Map()),
        (this.lazyUpdate = null),
        t
          ? typeof t == "string"
            ? (this.lazyInit = () => {
                (this.headers = new Map()),
                  t
                    .split(
                      `
`
                    )
                    .forEach((r) => {
                      let n = r.indexOf(":");
                      if (n > 0) {
                        let i = r.slice(0, n),
                          o = i.toLowerCase(),
                          s = r.slice(n + 1).trim();
                        this.maybeSetNormalizedName(i, o),
                          this.headers.has(o)
                            ? this.headers.get(o).push(s)
                            : this.headers.set(o, [s]);
                      }
                    });
              })
            : typeof Headers < "u" && t instanceof Headers
            ? ((this.headers = new Map()),
              t.forEach((r, n) => {
                this.setHeaderEntries(n, r);
              }))
            : (this.lazyInit = () => {
                (this.headers = new Map()),
                  Object.entries(t).forEach(([r, n]) => {
                    this.setHeaderEntries(r, n);
                  });
              })
          : (this.headers = new Map());
    }
    has(t) {
      return this.init(), this.headers.has(t.toLowerCase());
    }
    get(t) {
      this.init();
      let r = this.headers.get(t.toLowerCase());
      return r && r.length > 0 ? r[0] : null;
    }
    keys() {
      return this.init(), Array.from(this.normalizedNames.values());
    }
    getAll(t) {
      return this.init(), this.headers.get(t.toLowerCase()) || null;
    }
    append(t, r) {
      return this.clone({ name: t, value: r, op: "a" });
    }
    set(t, r) {
      return this.clone({ name: t, value: r, op: "s" });
    }
    delete(t, r) {
      return this.clone({ name: t, value: r, op: "d" });
    }
    maybeSetNormalizedName(t, r) {
      this.normalizedNames.has(r) || this.normalizedNames.set(r, t);
    }
    init() {
      this.lazyInit &&
        (this.lazyInit instanceof e
          ? this.copyFrom(this.lazyInit)
          : this.lazyInit(),
        (this.lazyInit = null),
        this.lazyUpdate &&
          (this.lazyUpdate.forEach((t) => this.applyUpdate(t)),
          (this.lazyUpdate = null)));
    }
    copyFrom(t) {
      t.init(),
        Array.from(t.headers.keys()).forEach((r) => {
          this.headers.set(r, t.headers.get(r)),
            this.normalizedNames.set(r, t.normalizedNames.get(r));
        });
    }
    clone(t) {
      let r = new e();
      return (
        (r.lazyInit =
          this.lazyInit && this.lazyInit instanceof e ? this.lazyInit : this),
        (r.lazyUpdate = (this.lazyUpdate || []).concat([t])),
        r
      );
    }
    applyUpdate(t) {
      let r = t.name.toLowerCase();
      switch (t.op) {
        case "a":
        case "s":
          let n = t.value;
          if ((typeof n == "string" && (n = [n]), n.length === 0)) return;
          this.maybeSetNormalizedName(t.name, r);
          let i = (t.op === "a" ? this.headers.get(r) : void 0) || [];
          i.push(...n), this.headers.set(r, i);
          break;
        case "d":
          let o = t.value;
          if (!o) this.headers.delete(r), this.normalizedNames.delete(r);
          else {
            let s = this.headers.get(r);
            if (!s) return;
            (s = s.filter((a) => o.indexOf(a) === -1)),
              s.length === 0
                ? (this.headers.delete(r), this.normalizedNames.delete(r))
                : this.headers.set(r, s);
          }
          break;
      }
    }
    setHeaderEntries(t, r) {
      let n = (Array.isArray(r) ? r : [r]).map((o) => o.toString()),
        i = t.toLowerCase();
      this.headers.set(i, n), this.maybeSetNormalizedName(t, i);
    }
    forEach(t) {
      this.init(),
        Array.from(this.normalizedNames.keys()).forEach((r) =>
          t(this.normalizedNames.get(r), this.headers.get(r))
        );
    }
  };
var xl = class {
  encodeKey(t) {
    return ch(t);
  }
  encodeValue(t) {
    return ch(t);
  }
  decodeKey(t) {
    return decodeURIComponent(t);
  }
  decodeValue(t) {
    return decodeURIComponent(t);
  }
};
function Pw(e, t) {
  let r = new Map();
  return (
    e.length > 0 &&
      e
        .replace(/^\?/, "")
        .split("&")
        .forEach((i) => {
          let o = i.indexOf("="),
            [s, a] =
              o == -1
                ? [t.decodeKey(i), ""]
                : [t.decodeKey(i.slice(0, o)), t.decodeValue(i.slice(o + 1))],
            l = r.get(s) || [];
          l.push(a), r.set(s, l);
        }),
    r
  );
}
var Aw = /%(\d[a-f0-9])/gi,
  Nw = {
    40: "@",
    "3A": ":",
    24: "$",
    "2C": ",",
    "3B": ";",
    "3D": "=",
    "3F": "?",
    "2F": "/",
  };
function ch(e) {
  return encodeURIComponent(e).replace(Aw, (t, r) => Nw[r] ?? t);
}
function Fo(e) {
  return `${e}`;
}
var zt = class e {
  constructor(t = {}) {
    if (
      ((this.updates = null),
      (this.cloneFrom = null),
      (this.encoder = t.encoder || new xl()),
      t.fromString)
    ) {
      if (t.fromObject)
        throw new Error("Cannot specify both fromString and fromObject.");
      this.map = Pw(t.fromString, this.encoder);
    } else
      t.fromObject
        ? ((this.map = new Map()),
          Object.keys(t.fromObject).forEach((r) => {
            let n = t.fromObject[r],
              i = Array.isArray(n) ? n.map(Fo) : [Fo(n)];
            this.map.set(r, i);
          }))
        : (this.map = null);
  }
  has(t) {
    return this.init(), this.map.has(t);
  }
  get(t) {
    this.init();
    let r = this.map.get(t);
    return r ? r[0] : null;
  }
  getAll(t) {
    return this.init(), this.map.get(t) || null;
  }
  keys() {
    return this.init(), Array.from(this.map.keys());
  }
  append(t, r) {
    return this.clone({ param: t, value: r, op: "a" });
  }
  appendAll(t) {
    let r = [];
    return (
      Object.keys(t).forEach((n) => {
        let i = t[n];
        Array.isArray(i)
          ? i.forEach((o) => {
              r.push({ param: n, value: o, op: "a" });
            })
          : r.push({ param: n, value: i, op: "a" });
      }),
      this.clone(r)
    );
  }
  set(t, r) {
    return this.clone({ param: t, value: r, op: "s" });
  }
  delete(t, r) {
    return this.clone({ param: t, value: r, op: "d" });
  }
  toString() {
    return (
      this.init(),
      this.keys()
        .map((t) => {
          let r = this.encoder.encodeKey(t);
          return this.map
            .get(t)
            .map((n) => r + "=" + this.encoder.encodeValue(n))
            .join("&");
        })
        .filter((t) => t !== "")
        .join("&")
    );
  }
  clone(t) {
    let r = new e({ encoder: this.encoder });
    return (
      (r.cloneFrom = this.cloneFrom || this),
      (r.updates = (this.updates || []).concat(t)),
      r
    );
  }
  init() {
    this.map === null && (this.map = new Map()),
      this.cloneFrom !== null &&
        (this.cloneFrom.init(),
        this.cloneFrom
          .keys()
          .forEach((t) => this.map.set(t, this.cloneFrom.map.get(t))),
        this.updates.forEach((t) => {
          switch (t.op) {
            case "a":
            case "s":
              let r = (t.op === "a" ? this.map.get(t.param) : void 0) || [];
              r.push(Fo(t.value)), this.map.set(t.param, r);
              break;
            case "d":
              if (t.value !== void 0) {
                let n = this.map.get(t.param) || [],
                  i = n.indexOf(Fo(t.value));
                i !== -1 && n.splice(i, 1),
                  n.length > 0
                    ? this.map.set(t.param, n)
                    : this.map.delete(t.param);
              } else {
                this.map.delete(t.param);
                break;
              }
          }
        }),
        (this.cloneFrom = this.updates = null));
  }
};
var Il = class {
  constructor() {
    this.map = new Map();
  }
  set(t, r) {
    return this.map.set(t, r), this;
  }
  get(t) {
    return (
      this.map.has(t) || this.map.set(t, t.defaultValue()), this.map.get(t)
    );
  }
  delete(t) {
    return this.map.delete(t), this;
  }
  has(t) {
    return this.map.has(t);
  }
  keys() {
    return this.map.keys();
  }
};
function kw(e) {
  switch (e) {
    case "DELETE":
    case "GET":
    case "HEAD":
    case "OPTIONS":
    case "JSONP":
      return !1;
    default:
      return !0;
  }
}
function uh(e) {
  return typeof ArrayBuffer < "u" && e instanceof ArrayBuffer;
}
function dh(e) {
  return typeof Blob < "u" && e instanceof Blob;
}
function fh(e) {
  return typeof FormData < "u" && e instanceof FormData;
}
function Fw(e) {
  return typeof URLSearchParams < "u" && e instanceof URLSearchParams;
}
var Fr = class e {
    constructor(t, r, n, i) {
      (this.url = r),
        (this.body = null),
        (this.reportProgress = !1),
        (this.withCredentials = !1),
        (this.responseType = "json"),
        (this.method = t.toUpperCase());
      let o;
      if (
        (kw(this.method) || i
          ? ((this.body = n !== void 0 ? n : null), (o = i))
          : (o = n),
        o &&
          ((this.reportProgress = !!o.reportProgress),
          (this.withCredentials = !!o.withCredentials),
          o.responseType && (this.responseType = o.responseType),
          o.headers && (this.headers = o.headers),
          o.context && (this.context = o.context),
          o.params && (this.params = o.params),
          (this.transferCache = o.transferCache)),
        (this.headers ??= new un()),
        (this.context ??= new Il()),
        !this.params)
      )
        (this.params = new zt()), (this.urlWithParams = r);
      else {
        let s = this.params.toString();
        if (s.length === 0) this.urlWithParams = r;
        else {
          let a = r.indexOf("?"),
            l = a === -1 ? "?" : a < r.length - 1 ? "&" : "";
          this.urlWithParams = r + l + s;
        }
      }
    }
    serializeBody() {
      return this.body === null
        ? null
        : typeof this.body == "string" ||
          uh(this.body) ||
          dh(this.body) ||
          fh(this.body) ||
          Fw(this.body)
        ? this.body
        : this.body instanceof zt
        ? this.body.toString()
        : typeof this.body == "object" ||
          typeof this.body == "boolean" ||
          Array.isArray(this.body)
        ? JSON.stringify(this.body)
        : this.body.toString();
    }
    detectContentTypeHeader() {
      return this.body === null || fh(this.body)
        ? null
        : dh(this.body)
        ? this.body.type || null
        : uh(this.body)
        ? null
        : typeof this.body == "string"
        ? "text/plain"
        : this.body instanceof zt
        ? "application/x-www-form-urlencoded;charset=UTF-8"
        : typeof this.body == "object" ||
          typeof this.body == "number" ||
          typeof this.body == "boolean"
        ? "application/json"
        : null;
    }
    clone(t = {}) {
      let r = t.method || this.method,
        n = t.url || this.url,
        i = t.responseType || this.responseType,
        o = t.transferCache ?? this.transferCache,
        s = t.body !== void 0 ? t.body : this.body,
        a = t.withCredentials ?? this.withCredentials,
        l = t.reportProgress ?? this.reportProgress,
        c = t.headers || this.headers,
        h = t.params || this.params,
        p = t.context ?? this.context;
      return (
        t.setHeaders !== void 0 &&
          (c = Object.keys(t.setHeaders).reduce(
            (g, m) => g.set(m, t.setHeaders[m]),
            c
          )),
        t.setParams &&
          (h = Object.keys(t.setParams).reduce(
            (g, m) => g.set(m, t.setParams[m]),
            h
          )),
        new e(r, n, s, {
          params: h,
          headers: c,
          context: p,
          reportProgress: l,
          responseType: i,
          withCredentials: a,
          transferCache: o,
        })
      );
    }
  },
  Yn = (function (e) {
    return (
      (e[(e.Sent = 0)] = "Sent"),
      (e[(e.UploadProgress = 1)] = "UploadProgress"),
      (e[(e.ResponseHeader = 2)] = "ResponseHeader"),
      (e[(e.DownloadProgress = 3)] = "DownloadProgress"),
      (e[(e.Response = 4)] = "Response"),
      (e[(e.User = 5)] = "User"),
      e
    );
  })(Yn || {}),
  Lr = class {
    constructor(t, r = jo.Ok, n = "OK") {
      (this.headers = t.headers || new un()),
        (this.status = t.status !== void 0 ? t.status : r),
        (this.statusText = t.statusText || n),
        (this.url = t.url || null),
        (this.ok = this.status >= 200 && this.status < 300);
    }
  },
  Sl = class e extends Lr {
    constructor(t = {}) {
      super(t), (this.type = Yn.ResponseHeader);
    }
    clone(t = {}) {
      return new e({
        headers: t.headers || this.headers,
        status: t.status !== void 0 ? t.status : this.status,
        statusText: t.statusText || this.statusText,
        url: t.url || this.url || void 0,
      });
    }
  },
  Lo = class e extends Lr {
    constructor(t = {}) {
      super(t),
        (this.type = Yn.Response),
        (this.body = t.body !== void 0 ? t.body : null);
    }
    clone(t = {}) {
      return new e({
        body: t.body !== void 0 ? t.body : this.body,
        headers: t.headers || this.headers,
        status: t.status !== void 0 ? t.status : this.status,
        statusText: t.statusText || this.statusText,
        url: t.url || this.url || void 0,
      });
    }
  },
  Vo = class extends Lr {
    constructor(t) {
      super(t, 0, "Unknown Error"),
        (this.name = "HttpErrorResponse"),
        (this.ok = !1),
        this.status >= 200 && this.status < 300
          ? (this.message = `Http failure during parsing for ${
              t.url || "(unknown url)"
            }`)
          : (this.message = `Http failure response for ${
              t.url || "(unknown url)"
            }: ${t.status} ${t.statusText}`),
        (this.error = t.error || null);
    }
  },
  jo = (function (e) {
    return (
      (e[(e.Continue = 100)] = "Continue"),
      (e[(e.SwitchingProtocols = 101)] = "SwitchingProtocols"),
      (e[(e.Processing = 102)] = "Processing"),
      (e[(e.EarlyHints = 103)] = "EarlyHints"),
      (e[(e.Ok = 200)] = "Ok"),
      (e[(e.Created = 201)] = "Created"),
      (e[(e.Accepted = 202)] = "Accepted"),
      (e[(e.NonAuthoritativeInformation = 203)] =
        "NonAuthoritativeInformation"),
      (e[(e.NoContent = 204)] = "NoContent"),
      (e[(e.ResetContent = 205)] = "ResetContent"),
      (e[(e.PartialContent = 206)] = "PartialContent"),
      (e[(e.MultiStatus = 207)] = "MultiStatus"),
      (e[(e.AlreadyReported = 208)] = "AlreadyReported"),
      (e[(e.ImUsed = 226)] = "ImUsed"),
      (e[(e.MultipleChoices = 300)] = "MultipleChoices"),
      (e[(e.MovedPermanently = 301)] = "MovedPermanently"),
      (e[(e.Found = 302)] = "Found"),
      (e[(e.SeeOther = 303)] = "SeeOther"),
      (e[(e.NotModified = 304)] = "NotModified"),
      (e[(e.UseProxy = 305)] = "UseProxy"),
      (e[(e.Unused = 306)] = "Unused"),
      (e[(e.TemporaryRedirect = 307)] = "TemporaryRedirect"),
      (e[(e.PermanentRedirect = 308)] = "PermanentRedirect"),
      (e[(e.BadRequest = 400)] = "BadRequest"),
      (e[(e.Unauthorized = 401)] = "Unauthorized"),
      (e[(e.PaymentRequired = 402)] = "PaymentRequired"),
      (e[(e.Forbidden = 403)] = "Forbidden"),
      (e[(e.NotFound = 404)] = "NotFound"),
      (e[(e.MethodNotAllowed = 405)] = "MethodNotAllowed"),
      (e[(e.NotAcceptable = 406)] = "NotAcceptable"),
      (e[(e.ProxyAuthenticationRequired = 407)] =
        "ProxyAuthenticationRequired"),
      (e[(e.RequestTimeout = 408)] = "RequestTimeout"),
      (e[(e.Conflict = 409)] = "Conflict"),
      (e[(e.Gone = 410)] = "Gone"),
      (e[(e.LengthRequired = 411)] = "LengthRequired"),
      (e[(e.PreconditionFailed = 412)] = "PreconditionFailed"),
      (e[(e.PayloadTooLarge = 413)] = "PayloadTooLarge"),
      (e[(e.UriTooLong = 414)] = "UriTooLong"),
      (e[(e.UnsupportedMediaType = 415)] = "UnsupportedMediaType"),
      (e[(e.RangeNotSatisfiable = 416)] = "RangeNotSatisfiable"),
      (e[(e.ExpectationFailed = 417)] = "ExpectationFailed"),
      (e[(e.ImATeapot = 418)] = "ImATeapot"),
      (e[(e.MisdirectedRequest = 421)] = "MisdirectedRequest"),
      (e[(e.UnprocessableEntity = 422)] = "UnprocessableEntity"),
      (e[(e.Locked = 423)] = "Locked"),
      (e[(e.FailedDependency = 424)] = "FailedDependency"),
      (e[(e.TooEarly = 425)] = "TooEarly"),
      (e[(e.UpgradeRequired = 426)] = "UpgradeRequired"),
      (e[(e.PreconditionRequired = 428)] = "PreconditionRequired"),
      (e[(e.TooManyRequests = 429)] = "TooManyRequests"),
      (e[(e.RequestHeaderFieldsTooLarge = 431)] =
        "RequestHeaderFieldsTooLarge"),
      (e[(e.UnavailableForLegalReasons = 451)] = "UnavailableForLegalReasons"),
      (e[(e.InternalServerError = 500)] = "InternalServerError"),
      (e[(e.NotImplemented = 501)] = "NotImplemented"),
      (e[(e.BadGateway = 502)] = "BadGateway"),
      (e[(e.ServiceUnavailable = 503)] = "ServiceUnavailable"),
      (e[(e.GatewayTimeout = 504)] = "GatewayTimeout"),
      (e[(e.HttpVersionNotSupported = 505)] = "HttpVersionNotSupported"),
      (e[(e.VariantAlsoNegotiates = 506)] = "VariantAlsoNegotiates"),
      (e[(e.InsufficientStorage = 507)] = "InsufficientStorage"),
      (e[(e.LoopDetected = 508)] = "LoopDetected"),
      (e[(e.NotExtended = 510)] = "NotExtended"),
      (e[(e.NetworkAuthenticationRequired = 511)] =
        "NetworkAuthenticationRequired"),
      e
    );
  })(jo || {});
function El(e, t) {
  return {
    body: t,
    headers: e.headers,
    context: e.context,
    observe: e.observe,
    params: e.params,
    reportProgress: e.reportProgress,
    responseType: e.responseType,
    withCredentials: e.withCredentials,
    transferCache: e.transferCache,
  };
}
var Ol = (() => {
  let t = class t {
    constructor(n) {
      this.handler = n;
    }
    request(n, i, o = {}) {
      let s;
      if (n instanceof Fr) s = n;
      else {
        let c;
        o.headers instanceof un ? (c = o.headers) : (c = new un(o.headers));
        let h;
        o.params &&
          (o.params instanceof zt
            ? (h = o.params)
            : (h = new zt({ fromObject: o.params }))),
          (s = new Fr(n, i, o.body !== void 0 ? o.body : null, {
            headers: c,
            context: o.context,
            params: h,
            reportProgress: o.reportProgress,
            responseType: o.responseType || "json",
            withCredentials: o.withCredentials,
            transferCache: o.transferCache,
          }));
      }
      let a = S(s).pipe(It((c) => this.handler.handle(c)));
      if (n instanceof Fr || o.observe === "events") return a;
      let l = a.pipe(Ae((c) => c instanceof Lo));
      switch (o.observe || "body") {
        case "body":
          switch (s.responseType) {
            case "arraybuffer":
              return l.pipe(
                A((c) => {
                  if (c.body !== null && !(c.body instanceof ArrayBuffer))
                    throw new Error("Response is not an ArrayBuffer.");
                  return c.body;
                })
              );
            case "blob":
              return l.pipe(
                A((c) => {
                  if (c.body !== null && !(c.body instanceof Blob))
                    throw new Error("Response is not a Blob.");
                  return c.body;
                })
              );
            case "text":
              return l.pipe(
                A((c) => {
                  if (c.body !== null && typeof c.body != "string")
                    throw new Error("Response is not a string.");
                  return c.body;
                })
              );
            case "json":
            default:
              return l.pipe(A((c) => c.body));
          }
        case "response":
          return l;
        default:
          throw new Error(`Unreachable: unhandled observe type ${o.observe}}`);
      }
    }
    delete(n, i = {}) {
      return this.request("DELETE", n, i);
    }
    get(n, i = {}) {
      return this.request("GET", n, i);
    }
    head(n, i = {}) {
      return this.request("HEAD", n, i);
    }
    jsonp(n, i) {
      return this.request("JSONP", n, {
        params: new zt().append(i, "JSONP_CALLBACK"),
        observe: "body",
        responseType: "json",
      });
    }
    options(n, i = {}) {
      return this.request("OPTIONS", n, i);
    }
    patch(n, i, o = {}) {
      return this.request("PATCH", n, El(o, i));
    }
    post(n, i, o = {}) {
      return this.request("POST", n, El(o, i));
    }
    put(n, i, o = {}) {
      return this.request("PUT", n, El(o, i));
    }
  };
  (t.ɵfac = function (i) {
    return new (i || t)(P(Rr));
  }),
    (t.ɵprov = E({ token: t, factory: t.ɵfac }));
  let e = t;
  return e;
})();
function Rw(e, t) {
  return t(e);
}
function Lw(e, t, r) {
  return (n, i) => mt(r, () => t(n, (o) => e(o, i)));
}
var gh = new x(""),
  Vw = new x(""),
  jw = new x("");
var hh = (() => {
  let t = class t extends Rr {
    constructor(n, i) {
      super(),
        (this.backend = n),
        (this.injector = i),
        (this.chain = null),
        (this.pendingTasks = v(Hn));
      let o = v(jw, { optional: !0 });
      this.backend = o ?? n;
    }
    handle(n) {
      if (this.chain === null) {
        let o = Array.from(
          new Set([...this.injector.get(gh), ...this.injector.get(Vw, [])])
        );
        this.chain = o.reduceRight((s, a) => Lw(s, a, this.injector), Rw);
      }
      let i = this.pendingTasks.add();
      return this.chain(n, (o) => this.backend.handle(o)).pipe(
        qt(() => this.pendingTasks.remove(i))
      );
    }
  };
  (t.ɵfac = function (i) {
    return new (i || t)(P(Ro), P(Ee));
  }),
    (t.ɵprov = E({ token: t, factory: t.ɵfac }));
  let e = t;
  return e;
})();
var zw = /^\)\]\}',?\n/;
function Uw(e) {
  return "responseURL" in e && e.responseURL
    ? e.responseURL
    : /^X-Request-URL:/m.test(e.getAllResponseHeaders())
    ? e.getResponseHeader("X-Request-URL")
    : null;
}
var ph = (() => {
    let t = class t {
      constructor(n) {
        this.xhrFactory = n;
      }
      handle(n) {
        if (n.method === "JSONP") throw new M(-2800, !1);
        let i = this.xhrFactory;
        return (i.ɵloadImpl ? J(i.ɵloadImpl()) : S(null)).pipe(
          Ne(
            () =>
              new $((s) => {
                let a = i.build();
                if (
                  (a.open(n.method, n.urlWithParams),
                  n.withCredentials && (a.withCredentials = !0),
                  n.headers.forEach((_, D) =>
                    a.setRequestHeader(_, D.join(","))
                  ),
                  n.headers.has("Accept") ||
                    a.setRequestHeader(
                      "Accept",
                      "application/json, text/plain, */*"
                    ),
                  !n.headers.has("Content-Type"))
                ) {
                  let _ = n.detectContentTypeHeader();
                  _ !== null && a.setRequestHeader("Content-Type", _);
                }
                if (n.responseType) {
                  let _ = n.responseType.toLowerCase();
                  a.responseType = _ !== "json" ? _ : "text";
                }
                let l = n.serializeBody(),
                  c = null,
                  h = () => {
                    if (c !== null) return c;
                    let _ = a.statusText || "OK",
                      D = new un(a.getAllResponseHeaders()),
                      me = Uw(a) || n.url;
                    return (
                      (c = new Sl({
                        headers: D,
                        status: a.status,
                        statusText: _,
                        url: me,
                      })),
                      c
                    );
                  },
                  p = () => {
                    let {
                        headers: _,
                        status: D,
                        statusText: me,
                        url: fe,
                      } = h(),
                      Y = null;
                    D !== jo.NoContent &&
                      (Y =
                        typeof a.response > "u" ? a.responseText : a.response),
                      D === 0 && (D = Y ? jo.Ok : 0);
                    let Je = D >= 200 && D < 300;
                    if (n.responseType === "json" && typeof Y == "string") {
                      let Oe = Y;
                      Y = Y.replace(zw, "");
                      try {
                        Y = Y !== "" ? JSON.parse(Y) : null;
                      } catch (Mt) {
                        (Y = Oe),
                          Je && ((Je = !1), (Y = { error: Mt, text: Y }));
                      }
                    }
                    Je
                      ? (s.next(
                          new Lo({
                            body: Y,
                            headers: _,
                            status: D,
                            statusText: me,
                            url: fe || void 0,
                          })
                        ),
                        s.complete())
                      : s.error(
                          new Vo({
                            error: Y,
                            headers: _,
                            status: D,
                            statusText: me,
                            url: fe || void 0,
                          })
                        );
                  },
                  g = (_) => {
                    let { url: D } = h(),
                      me = new Vo({
                        error: _,
                        status: a.status || 0,
                        statusText: a.statusText || "Unknown Error",
                        url: D || void 0,
                      });
                    s.error(me);
                  },
                  m = !1,
                  w = (_) => {
                    m || (s.next(h()), (m = !0));
                    let D = { type: Yn.DownloadProgress, loaded: _.loaded };
                    _.lengthComputable && (D.total = _.total),
                      n.responseType === "text" &&
                        a.responseText &&
                        (D.partialText = a.responseText),
                      s.next(D);
                  },
                  O = (_) => {
                    let D = { type: Yn.UploadProgress, loaded: _.loaded };
                    _.lengthComputable && (D.total = _.total), s.next(D);
                  };
                return (
                  a.addEventListener("load", p),
                  a.addEventListener("error", g),
                  a.addEventListener("timeout", g),
                  a.addEventListener("abort", g),
                  n.reportProgress &&
                    (a.addEventListener("progress", w),
                    l !== null &&
                      a.upload &&
                      a.upload.addEventListener("progress", O)),
                  a.send(l),
                  s.next({ type: Yn.Sent }),
                  () => {
                    a.removeEventListener("error", g),
                      a.removeEventListener("abort", g),
                      a.removeEventListener("load", p),
                      a.removeEventListener("timeout", g),
                      n.reportProgress &&
                        (a.removeEventListener("progress", w),
                        l !== null &&
                          a.upload &&
                          a.upload.removeEventListener("progress", O)),
                      a.readyState !== a.DONE && a.abort();
                  }
                );
              })
          )
        );
      }
    };
    (t.ɵfac = function (i) {
      return new (i || t)(P(Zn));
    }),
      (t.ɵprov = E({ token: t, factory: t.ɵfac }));
    let e = t;
    return e;
  })(),
  mh = new x(""),
  Bw = "XSRF-TOKEN",
  $w = new x("", { providedIn: "root", factory: () => Bw }),
  Hw = "X-XSRF-TOKEN",
  Gw = new x("", { providedIn: "root", factory: () => Hw }),
  zo = class {},
  Ww = (() => {
    let t = class t {
      constructor(n, i, o) {
        (this.doc = n),
          (this.platform = i),
          (this.cookieName = o),
          (this.lastCookieString = ""),
          (this.lastToken = null),
          (this.parseCount = 0);
      }
      getToken() {
        if (this.platform === "server") return null;
        let n = this.doc.cookie || "";
        return (
          n !== this.lastCookieString &&
            (this.parseCount++,
            (this.lastToken = Ao(n, this.cookieName)),
            (this.lastCookieString = n)),
          this.lastToken
        );
      }
    };
    (t.ɵfac = function (i) {
      return new (i || t)(P(Se), P(Vt), P($w));
    }),
      (t.ɵprov = E({ token: t, factory: t.ɵfac }));
    let e = t;
    return e;
  })();
function qw(e, t) {
  let r = e.url.toLowerCase();
  if (
    !v(mh) ||
    e.method === "GET" ||
    e.method === "HEAD" ||
    r.startsWith("http://") ||
    r.startsWith("https://")
  )
    return t(e);
  let n = v(zo).getToken(),
    i = v(Gw);
  return (
    n != null &&
      !e.headers.has(i) &&
      (e = e.clone({ headers: e.headers.set(i, n) })),
    t(e)
  );
}
function vh(...e) {
  let t = [
    Ol,
    ph,
    hh,
    { provide: Rr, useExisting: hh },
    { provide: Ro, useExisting: ph },
    { provide: gh, useValue: qw, multi: !0 },
    { provide: mh, useValue: !0 },
    { provide: zo, useClass: Ww },
  ];
  for (let r of e) t.push(...r.ɵproviders);
  return zn(t);
}
var Al = class extends To {
    constructor() {
      super(...arguments), (this.supportsDOMEvents = !0);
    }
  },
  Nl = class e extends Al {
    static makeCurrent() {
      ih(new e());
    }
    onAndCancel(t, r, n) {
      return (
        t.addEventListener(r, n),
        () => {
          t.removeEventListener(r, n);
        }
      );
    }
    dispatchEvent(t, r) {
      t.dispatchEvent(r);
    }
    remove(t) {
      t.parentNode && t.parentNode.removeChild(t);
    }
    createElement(t, r) {
      return (r = r || this.getDefaultDocument()), r.createElement(t);
    }
    createHtmlDocument() {
      return document.implementation.createHTMLDocument("fakeTitle");
    }
    getDefaultDocument() {
      return document;
    }
    isElementNode(t) {
      return t.nodeType === Node.ELEMENT_NODE;
    }
    isShadowRoot(t) {
      return t instanceof DocumentFragment;
    }
    getGlobalEventTarget(t, r) {
      return r === "window"
        ? window
        : r === "document"
        ? t
        : r === "body"
        ? t.body
        : null;
    }
    getBaseHref(t) {
      let r = Kw();
      return r == null ? null : Yw(r);
    }
    resetBaseElement() {
      Vr = null;
    }
    getUserAgent() {
      return window.navigator.userAgent;
    }
    getCookie(t) {
      return Ao(document.cookie, t);
    }
  },
  Vr = null;
function Kw() {
  return (
    (Vr = Vr || document.querySelector("base")),
    Vr ? Vr.getAttribute("href") : null
  );
}
function Yw(e) {
  return new URL(e, document.baseURI).pathname;
}
var Qw = (() => {
    let t = class t {
      build() {
        return new XMLHttpRequest();
      }
    };
    (t.ɵfac = function (i) {
      return new (i || t)();
    }),
      (t.ɵprov = E({ token: t, factory: t.ɵfac }));
    let e = t;
    return e;
  })(),
  kl = new x(""),
  bh = (() => {
    let t = class t {
      constructor(n, i) {
        (this._zone = i),
          (this._eventNameToPlugin = new Map()),
          n.forEach((o) => {
            o.manager = this;
          }),
          (this._plugins = n.slice().reverse());
      }
      addEventListener(n, i, o) {
        return this._findPluginFor(i).addEventListener(n, i, o);
      }
      getZone() {
        return this._zone;
      }
      _findPluginFor(n) {
        let i = this._eventNameToPlugin.get(n);
        if (i) return i;
        if (((i = this._plugins.find((s) => s.supports(n))), !i))
          throw new M(5101, !1);
        return this._eventNameToPlugin.set(n, i), i;
      }
    };
    (t.ɵfac = function (i) {
      return new (i || t)(P(kl), P(ee));
    }),
      (t.ɵprov = E({ token: t, factory: t.ɵfac }));
    let e = t;
    return e;
  })(),
  Uo = class {
    constructor(t) {
      this._doc = t;
    }
  },
  Tl = "ng-app-id",
  Dh = (() => {
    let t = class t {
      constructor(n, i, o, s = {}) {
        (this.doc = n),
          (this.appId = i),
          (this.nonce = o),
          (this.platformId = s),
          (this.styleRef = new Map()),
          (this.hostNodes = new Set()),
          (this.styleNodesInDOM = this.collectServerRenderedStyles()),
          (this.platformIsServer = No(s)),
          this.resetHostNodes();
      }
      addStyles(n) {
        for (let i of n)
          this.changeUsageCount(i, 1) === 1 && this.onStyleAdded(i);
      }
      removeStyles(n) {
        for (let i of n)
          this.changeUsageCount(i, -1) <= 0 && this.onStyleRemoved(i);
      }
      ngOnDestroy() {
        let n = this.styleNodesInDOM;
        n && (n.forEach((i) => i.remove()), n.clear());
        for (let i of this.getAllStyles()) this.onStyleRemoved(i);
        this.resetHostNodes();
      }
      addHost(n) {
        this.hostNodes.add(n);
        for (let i of this.getAllStyles()) this.addStyleToHost(n, i);
      }
      removeHost(n) {
        this.hostNodes.delete(n);
      }
      getAllStyles() {
        return this.styleRef.keys();
      }
      onStyleAdded(n) {
        for (let i of this.hostNodes) this.addStyleToHost(i, n);
      }
      onStyleRemoved(n) {
        let i = this.styleRef;
        i.get(n)?.elements?.forEach((o) => o.remove()), i.delete(n);
      }
      collectServerRenderedStyles() {
        let n = this.doc.head?.querySelectorAll(`style[${Tl}="${this.appId}"]`);
        if (n?.length) {
          let i = new Map();
          return (
            n.forEach((o) => {
              o.textContent != null && i.set(o.textContent, o);
            }),
            i
          );
        }
        return null;
      }
      changeUsageCount(n, i) {
        let o = this.styleRef;
        if (o.has(n)) {
          let s = o.get(n);
          return (s.usage += i), s.usage;
        }
        return o.set(n, { usage: i, elements: [] }), i;
      }
      getStyleElement(n, i) {
        let o = this.styleNodesInDOM,
          s = o?.get(i);
        if (s?.parentNode === n) return o.delete(i), s.removeAttribute(Tl), s;
        {
          let a = this.doc.createElement("style");
          return (
            this.nonce && a.setAttribute("nonce", this.nonce),
            (a.textContent = i),
            this.platformIsServer && a.setAttribute(Tl, this.appId),
            n.appendChild(a),
            a
          );
        }
      }
      addStyleToHost(n, i) {
        let o = this.getStyleElement(n, i),
          s = this.styleRef,
          a = s.get(i)?.elements;
        a ? a.push(o) : s.set(i, { elements: [o], usage: 1 });
      }
      resetHostNodes() {
        let n = this.hostNodes;
        n.clear(), n.add(this.doc.head);
      }
    };
    (t.ɵfac = function (i) {
      return new (i || t)(P(Se), P(il), P(sl, 8), P(Vt));
    }),
      (t.ɵprov = E({ token: t, factory: t.ɵfac }));
    let e = t;
    return e;
  })(),
  Pl = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: "http://www.w3.org/1999/xhtml",
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/",
    math: "http://www.w3.org/1998/MathML/",
  },
  Rl = /%COMP%/g,
  _h = "%COMP%",
  Jw = `_nghost-${_h}`,
  Xw = `_ngcontent-${_h}`,
  eC = !0,
  tC = new x("", { providedIn: "root", factory: () => eC });
function nC(e) {
  return Xw.replace(Rl, e);
}
function rC(e) {
  return Jw.replace(Rl, e);
}
function Mh(e, t) {
  return t.map((r) => r.replace(Rl, e));
}
var yh = (() => {
    let t = class t {
      constructor(n, i, o, s, a, l, c, h = null) {
        (this.eventManager = n),
          (this.sharedStylesHost = i),
          (this.appId = o),
          (this.removeStylesOnCompDestroy = s),
          (this.doc = a),
          (this.platformId = l),
          (this.ngZone = c),
          (this.nonce = h),
          (this.rendererByCompId = new Map()),
          (this.platformIsServer = No(l)),
          (this.defaultRenderer = new jr(n, a, c, this.platformIsServer));
      }
      createRenderer(n, i) {
        if (!n || !i) return this.defaultRenderer;
        this.platformIsServer &&
          i.encapsulation === nt.ShadowDom &&
          (i = K(C({}, i), { encapsulation: nt.Emulated }));
        let o = this.getOrCreateRenderer(n, i);
        return (
          o instanceof Bo
            ? o.applyToHost(n)
            : o instanceof zr && o.applyStyles(),
          o
        );
      }
      getOrCreateRenderer(n, i) {
        let o = this.rendererByCompId,
          s = o.get(i.id);
        if (!s) {
          let a = this.doc,
            l = this.ngZone,
            c = this.eventManager,
            h = this.sharedStylesHost,
            p = this.removeStylesOnCompDestroy,
            g = this.platformIsServer;
          switch (i.encapsulation) {
            case nt.Emulated:
              s = new Bo(c, h, i, this.appId, p, a, l, g);
              break;
            case nt.ShadowDom:
              return new Fl(c, h, n, i, a, l, this.nonce, g);
            default:
              s = new zr(c, h, i, p, a, l, g);
              break;
          }
          o.set(i.id, s);
        }
        return s;
      }
      ngOnDestroy() {
        this.rendererByCompId.clear();
      }
    };
    (t.ɵfac = function (i) {
      return new (i || t)(
        P(bh),
        P(Dh),
        P(il),
        P(tC),
        P(Se),
        P(Vt),
        P(ee),
        P(sl)
      );
    }),
      (t.ɵprov = E({ token: t, factory: t.ɵfac }));
    let e = t;
    return e;
  })(),
  jr = class {
    constructor(t, r, n, i) {
      (this.eventManager = t),
        (this.doc = r),
        (this.ngZone = n),
        (this.platformIsServer = i),
        (this.data = Object.create(null)),
        (this.throwOnSyntheticProps = !0),
        (this.destroyNode = null);
    }
    destroy() {}
    createElement(t, r) {
      return r
        ? this.doc.createElementNS(Pl[r] || r, t)
        : this.doc.createElement(t);
    }
    createComment(t) {
      return this.doc.createComment(t);
    }
    createText(t) {
      return this.doc.createTextNode(t);
    }
    appendChild(t, r) {
      (wh(t) ? t.content : t).appendChild(r);
    }
    insertBefore(t, r, n) {
      t && (wh(t) ? t.content : t).insertBefore(r, n);
    }
    removeChild(t, r) {
      t && t.removeChild(r);
    }
    selectRootElement(t, r) {
      let n = typeof t == "string" ? this.doc.querySelector(t) : t;
      if (!n) throw new M(-5104, !1);
      return r || (n.textContent = ""), n;
    }
    parentNode(t) {
      return t.parentNode;
    }
    nextSibling(t) {
      return t.nextSibling;
    }
    setAttribute(t, r, n, i) {
      if (i) {
        r = i + ":" + r;
        let o = Pl[i];
        o ? t.setAttributeNS(o, r, n) : t.setAttribute(r, n);
      } else t.setAttribute(r, n);
    }
    removeAttribute(t, r, n) {
      if (n) {
        let i = Pl[n];
        i ? t.removeAttributeNS(i, r) : t.removeAttribute(`${n}:${r}`);
      } else t.removeAttribute(r);
    }
    addClass(t, r) {
      t.classList.add(r);
    }
    removeClass(t, r) {
      t.classList.remove(r);
    }
    setStyle(t, r, n, i) {
      i & (gt.DashCase | gt.Important)
        ? t.style.setProperty(r, n, i & gt.Important ? "important" : "")
        : (t.style[r] = n);
    }
    removeStyle(t, r, n) {
      n & gt.DashCase ? t.style.removeProperty(r) : (t.style[r] = "");
    }
    setProperty(t, r, n) {
      t != null && (t[r] = n);
    }
    setValue(t, r) {
      t.nodeValue = r;
    }
    listen(t, r, n) {
      if (
        typeof t == "string" &&
        ((t = _t().getGlobalEventTarget(this.doc, t)), !t)
      )
        throw new Error(`Unsupported event target ${t} for event ${r}`);
      return this.eventManager.addEventListener(
        t,
        r,
        this.decoratePreventDefault(n)
      );
    }
    decoratePreventDefault(t) {
      return (r) => {
        if (r === "__ngUnwrap__") return t;
        (this.platformIsServer ? this.ngZone.runGuarded(() => t(r)) : t(r)) ===
          !1 && r.preventDefault();
      };
    }
  };
function wh(e) {
  return e.tagName === "TEMPLATE" && e.content !== void 0;
}
var Fl = class extends jr {
    constructor(t, r, n, i, o, s, a, l) {
      super(t, o, s, l),
        (this.sharedStylesHost = r),
        (this.hostEl = n),
        (this.shadowRoot = n.attachShadow({ mode: "open" })),
        this.sharedStylesHost.addHost(this.shadowRoot);
      let c = Mh(i.id, i.styles);
      for (let h of c) {
        let p = document.createElement("style");
        a && p.setAttribute("nonce", a),
          (p.textContent = h),
          this.shadowRoot.appendChild(p);
      }
    }
    nodeOrShadowRoot(t) {
      return t === this.hostEl ? this.shadowRoot : t;
    }
    appendChild(t, r) {
      return super.appendChild(this.nodeOrShadowRoot(t), r);
    }
    insertBefore(t, r, n) {
      return super.insertBefore(this.nodeOrShadowRoot(t), r, n);
    }
    removeChild(t, r) {
      return super.removeChild(this.nodeOrShadowRoot(t), r);
    }
    parentNode(t) {
      return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(t)));
    }
    destroy() {
      this.sharedStylesHost.removeHost(this.shadowRoot);
    }
  },
  zr = class extends jr {
    constructor(t, r, n, i, o, s, a, l) {
      super(t, o, s, a),
        (this.sharedStylesHost = r),
        (this.removeStylesOnCompDestroy = i),
        (this.styles = l ? Mh(l, n.styles) : n.styles);
    }
    applyStyles() {
      this.sharedStylesHost.addStyles(this.styles);
    }
    destroy() {
      this.removeStylesOnCompDestroy &&
        this.sharedStylesHost.removeStyles(this.styles);
    }
  },
  Bo = class extends zr {
    constructor(t, r, n, i, o, s, a, l) {
      let c = i + "-" + n.id;
      super(t, r, n, o, s, a, l, c),
        (this.contentAttr = nC(c)),
        (this.hostAttr = rC(c));
    }
    applyToHost(t) {
      this.applyStyles(), this.setAttribute(t, this.hostAttr, "");
    }
    createElement(t, r) {
      let n = super.createElement(t, r);
      return super.setAttribute(n, this.contentAttr, ""), n;
    }
  },
  iC = (() => {
    let t = class t extends Uo {
      constructor(n) {
        super(n);
      }
      supports(n) {
        return !0;
      }
      addEventListener(n, i, o) {
        return (
          n.addEventListener(i, o, !1), () => this.removeEventListener(n, i, o)
        );
      }
      removeEventListener(n, i, o) {
        return n.removeEventListener(i, o);
      }
    };
    (t.ɵfac = function (i) {
      return new (i || t)(P(Se));
    }),
      (t.ɵprov = E({ token: t, factory: t.ɵfac }));
    let e = t;
    return e;
  })(),
  Ch = ["alt", "control", "meta", "shift"],
  oC = {
    "\b": "Backspace",
    "	": "Tab",
    "\x7F": "Delete",
    "\x1B": "Escape",
    Del: "Delete",
    Esc: "Escape",
    Left: "ArrowLeft",
    Right: "ArrowRight",
    Up: "ArrowUp",
    Down: "ArrowDown",
    Menu: "ContextMenu",
    Scroll: "ScrollLock",
    Win: "OS",
  },
  sC = {
    alt: (e) => e.altKey,
    control: (e) => e.ctrlKey,
    meta: (e) => e.metaKey,
    shift: (e) => e.shiftKey,
  },
  aC = (() => {
    let t = class t extends Uo {
      constructor(n) {
        super(n);
      }
      supports(n) {
        return t.parseEventName(n) != null;
      }
      addEventListener(n, i, o) {
        let s = t.parseEventName(i),
          a = t.eventCallback(s.fullKey, o, this.manager.getZone());
        return this.manager
          .getZone()
          .runOutsideAngular(() => _t().onAndCancel(n, s.domEventName, a));
      }
      static parseEventName(n) {
        let i = n.toLowerCase().split("."),
          o = i.shift();
        if (i.length === 0 || !(o === "keydown" || o === "keyup")) return null;
        let s = t._normalizeKey(i.pop()),
          a = "",
          l = i.indexOf("code");
        if (
          (l > -1 && (i.splice(l, 1), (a = "code.")),
          Ch.forEach((h) => {
            let p = i.indexOf(h);
            p > -1 && (i.splice(p, 1), (a += h + "."));
          }),
          (a += s),
          i.length != 0 || s.length === 0)
        )
          return null;
        let c = {};
        return (c.domEventName = o), (c.fullKey = a), c;
      }
      static matchEventFullKeyCode(n, i) {
        let o = oC[n.key] || n.key,
          s = "";
        return (
          i.indexOf("code.") > -1 && ((o = n.code), (s = "code.")),
          o == null || !o
            ? !1
            : ((o = o.toLowerCase()),
              o === " " ? (o = "space") : o === "." && (o = "dot"),
              Ch.forEach((a) => {
                if (a !== o) {
                  let l = sC[a];
                  l(n) && (s += a + ".");
                }
              }),
              (s += o),
              s === i)
        );
      }
      static eventCallback(n, i, o) {
        return (s) => {
          t.matchEventFullKeyCode(s, n) && o.runGuarded(() => i(s));
        };
      }
      static _normalizeKey(n) {
        return n === "esc" ? "escape" : n;
      }
    };
    (t.ɵfac = function (i) {
      return new (i || t)(P(Se));
    }),
      (t.ɵprov = E({ token: t, factory: t.ɵfac }));
    let e = t;
    return e;
  })();
function Eh(e, t) {
  return Xf(C({ rootComponent: e }, lC(t)));
}
function lC(e) {
  return {
    appProviders: [...hC, ...(e?.providers ?? [])],
    platformProviders: fC,
  };
}
function cC() {
  Nl.makeCurrent();
}
function uC() {
  return new pt();
}
function dC() {
  return af(document), document;
}
var fC = [
  { provide: Vt, useValue: lh },
  { provide: ol, useValue: cC, multi: !0 },
  { provide: Se, useFactory: dC, deps: [] },
];
var hC = [
  { provide: co, useValue: "root" },
  { provide: pt, useFactory: uC, deps: [] },
  { provide: kl, useClass: iC, multi: !0, deps: [Se, ee, Vt] },
  { provide: kl, useClass: aC, multi: !0, deps: [Se] },
  yh,
  Dh,
  bh,
  { provide: Er, useExisting: yh },
  { provide: Zn, useClass: Qw, deps: [] },
  [],
];
var xh = (() => {
  let t = class t {
    constructor(n) {
      this._doc = n;
    }
    getTitle() {
      return this._doc.title;
    }
    setTitle(n) {
      this._doc.title = n || "";
    }
  };
  (t.ɵfac = function (i) {
    return new (i || t)(P(Se));
  }),
    (t.ɵprov = E({ token: t, factory: t.ɵfac, providedIn: "root" }));
  let e = t;
  return e;
})();
var N = "primary",
  ti = Symbol("RouteTitle"),
  Ul = class {
    constructor(t) {
      this.params = t || {};
    }
    has(t) {
      return Object.prototype.hasOwnProperty.call(this.params, t);
    }
    get(t) {
      if (this.has(t)) {
        let r = this.params[t];
        return Array.isArray(r) ? r[0] : r;
      }
      return null;
    }
    getAll(t) {
      if (this.has(t)) {
        let r = this.params[t];
        return Array.isArray(r) ? r : [r];
      }
      return [];
    }
    get keys() {
      return Object.keys(this.params);
    }
  };
function tr(e) {
  return new Ul(e);
}
function gC(e, t, r) {
  let n = r.path.split("/");
  if (
    n.length > e.length ||
    (r.pathMatch === "full" && (t.hasChildren() || n.length < e.length))
  )
    return null;
  let i = {};
  for (let o = 0; o < n.length; o++) {
    let s = n[o],
      a = e[o];
    if (s.startsWith(":")) i[s.substring(1)] = a;
    else if (s !== a.path) return null;
  }
  return { consumed: e.slice(0, n.length), posParams: i };
}
function mC(e, t) {
  if (e.length !== t.length) return !1;
  for (let r = 0; r < e.length; ++r) if (!ut(e[r], t[r])) return !1;
  return !0;
}
function ut(e, t) {
  let r = e ? Bl(e) : void 0,
    n = t ? Bl(t) : void 0;
  if (!r || !n || r.length != n.length) return !1;
  let i;
  for (let o = 0; o < r.length; o++)
    if (((i = r[o]), !Ah(e[i], t[i]))) return !1;
  return !0;
}
function Bl(e) {
  return [...Object.keys(e), ...Object.getOwnPropertySymbols(e)];
}
function Ah(e, t) {
  if (Array.isArray(e) && Array.isArray(t)) {
    if (e.length !== t.length) return !1;
    let r = [...e].sort(),
      n = [...t].sort();
    return r.every((i, o) => n[o] === i);
  } else return e === t;
}
function Nh(e) {
  return e.length > 0 ? e[e.length - 1] : null;
}
function $t(e) {
  return Ts(e) ? e : an(e) ? J(Promise.resolve(e)) : S(e);
}
var vC = { exact: Fh, subset: Rh },
  kh = { exact: yC, subset: wC, ignored: () => !0 };
function Ih(e, t, r) {
  return (
    vC[r.paths](e.root, t.root, r.matrixParams) &&
    kh[r.queryParams](e.queryParams, t.queryParams) &&
    !(r.fragment === "exact" && e.fragment !== t.fragment)
  );
}
function yC(e, t) {
  return ut(e, t);
}
function Fh(e, t, r) {
  if (
    !fn(e.segments, t.segments) ||
    !Go(e.segments, t.segments, r) ||
    e.numberOfChildren !== t.numberOfChildren
  )
    return !1;
  for (let n in t.children)
    if (!e.children[n] || !Fh(e.children[n], t.children[n], r)) return !1;
  return !0;
}
function wC(e, t) {
  return (
    Object.keys(t).length <= Object.keys(e).length &&
    Object.keys(t).every((r) => Ah(e[r], t[r]))
  );
}
function Rh(e, t, r) {
  return Lh(e, t, t.segments, r);
}
function Lh(e, t, r, n) {
  if (e.segments.length > r.length) {
    let i = e.segments.slice(0, r.length);
    return !(!fn(i, r) || t.hasChildren() || !Go(i, r, n));
  } else if (e.segments.length === r.length) {
    if (!fn(e.segments, r) || !Go(e.segments, r, n)) return !1;
    for (let i in t.children)
      if (!e.children[i] || !Rh(e.children[i], t.children[i], n)) return !1;
    return !0;
  } else {
    let i = r.slice(0, e.segments.length),
      o = r.slice(e.segments.length);
    return !fn(e.segments, i) || !Go(e.segments, i, n) || !e.children[N]
      ? !1
      : Lh(e.children[N], t, o, n);
  }
}
function Go(e, t, r) {
  return t.every((n, i) => kh[r](e[i].parameters, n.parameters));
}
var Ut = class {
    constructor(t = new q([], {}), r = {}, n = null) {
      (this.root = t), (this.queryParams = r), (this.fragment = n);
    }
    get queryParamMap() {
      return (
        (this._queryParamMap ??= tr(this.queryParams)), this._queryParamMap
      );
    }
    toString() {
      return DC.serialize(this);
    }
  },
  q = class {
    constructor(t, r) {
      (this.segments = t),
        (this.children = r),
        (this.parent = null),
        Object.values(r).forEach((n) => (n.parent = this));
    }
    hasChildren() {
      return this.numberOfChildren > 0;
    }
    get numberOfChildren() {
      return Object.keys(this.children).length;
    }
    toString() {
      return Wo(this);
    }
  },
  dn = class {
    constructor(t, r) {
      (this.path = t), (this.parameters = r);
    }
    get parameterMap() {
      return (this._parameterMap ??= tr(this.parameters)), this._parameterMap;
    }
    toString() {
      return jh(this);
    }
  };
function CC(e, t) {
  return fn(e, t) && e.every((r, n) => ut(r.parameters, t[n].parameters));
}
function fn(e, t) {
  return e.length !== t.length ? !1 : e.every((r, n) => r.path === t[n].path);
}
function bC(e, t) {
  let r = [];
  return (
    Object.entries(e.children).forEach(([n, i]) => {
      n === N && (r = r.concat(t(i, n)));
    }),
    Object.entries(e.children).forEach(([n, i]) => {
      n !== N && (r = r.concat(t(i, n)));
    }),
    r
  );
}
var pc = (() => {
    let t = class t {};
    (t.ɵfac = function (i) {
      return new (i || t)();
    }),
      (t.ɵprov = E({ token: t, factory: () => new Zo(), providedIn: "root" }));
    let e = t;
    return e;
  })(),
  Zo = class {
    parse(t) {
      let r = new Hl(t);
      return new Ut(
        r.parseRootSegment(),
        r.parseQueryParams(),
        r.parseFragment()
      );
    }
    serialize(t) {
      let r = `/${Ur(t.root, !0)}`,
        n = EC(t.queryParams),
        i = typeof t.fragment == "string" ? `#${_C(t.fragment)}` : "";
      return `${r}${n}${i}`;
    }
  },
  DC = new Zo();
function Wo(e) {
  return e.segments.map((t) => jh(t)).join("/");
}
function Ur(e, t) {
  if (!e.hasChildren()) return Wo(e);
  if (t) {
    let r = e.children[N] ? Ur(e.children[N], !1) : "",
      n = [];
    return (
      Object.entries(e.children).forEach(([i, o]) => {
        i !== N && n.push(`${i}:${Ur(o, !1)}`);
      }),
      n.length > 0 ? `${r}(${n.join("//")})` : r
    );
  } else {
    let r = bC(e, (n, i) =>
      i === N ? [Ur(e.children[N], !1)] : [`${i}:${Ur(n, !1)}`]
    );
    return Object.keys(e.children).length === 1 && e.children[N] != null
      ? `${Wo(e)}/${r[0]}`
      : `${Wo(e)}/(${r.join("//")})`;
  }
}
function Vh(e) {
  return encodeURIComponent(e)
    .replace(/%40/g, "@")
    .replace(/%3A/gi, ":")
    .replace(/%24/g, "$")
    .replace(/%2C/gi, ",");
}
function $o(e) {
  return Vh(e).replace(/%3B/gi, ";");
}
function _C(e) {
  return encodeURI(e);
}
function $l(e) {
  return Vh(e)
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/%26/gi, "&");
}
function qo(e) {
  return decodeURIComponent(e);
}
function Sh(e) {
  return qo(e.replace(/\+/g, "%20"));
}
function jh(e) {
  return `${$l(e.path)}${MC(e.parameters)}`;
}
function MC(e) {
  return Object.entries(e)
    .map(([t, r]) => `;${$l(t)}=${$l(r)}`)
    .join("");
}
function EC(e) {
  let t = Object.entries(e)
    .map(([r, n]) =>
      Array.isArray(n)
        ? n.map((i) => `${$o(r)}=${$o(i)}`).join("&")
        : `${$o(r)}=${$o(n)}`
    )
    .filter((r) => r);
  return t.length ? `?${t.join("&")}` : "";
}
var xC = /^[^\/()?;#]+/;
function Ll(e) {
  let t = e.match(xC);
  return t ? t[0] : "";
}
var IC = /^[^\/()?;=#]+/;
function SC(e) {
  let t = e.match(IC);
  return t ? t[0] : "";
}
var OC = /^[^=?&#]+/;
function TC(e) {
  let t = e.match(OC);
  return t ? t[0] : "";
}
var PC = /^[^&#]+/;
function AC(e) {
  let t = e.match(PC);
  return t ? t[0] : "";
}
var Hl = class {
  constructor(t) {
    (this.url = t), (this.remaining = t);
  }
  parseRootSegment() {
    return (
      this.consumeOptional("/"),
      this.remaining === "" ||
      this.peekStartsWith("?") ||
      this.peekStartsWith("#")
        ? new q([], {})
        : new q([], this.parseChildren())
    );
  }
  parseQueryParams() {
    let t = {};
    if (this.consumeOptional("?"))
      do this.parseQueryParam(t);
      while (this.consumeOptional("&"));
    return t;
  }
  parseFragment() {
    return this.consumeOptional("#")
      ? decodeURIComponent(this.remaining)
      : null;
  }
  parseChildren() {
    if (this.remaining === "") return {};
    this.consumeOptional("/");
    let t = [];
    for (
      this.peekStartsWith("(") || t.push(this.parseSegment());
      this.peekStartsWith("/") &&
      !this.peekStartsWith("//") &&
      !this.peekStartsWith("/(");

    )
      this.capture("/"), t.push(this.parseSegment());
    let r = {};
    this.peekStartsWith("/(") &&
      (this.capture("/"), (r = this.parseParens(!0)));
    let n = {};
    return (
      this.peekStartsWith("(") && (n = this.parseParens(!1)),
      (t.length > 0 || Object.keys(r).length > 0) && (n[N] = new q(t, r)),
      n
    );
  }
  parseSegment() {
    let t = Ll(this.remaining);
    if (t === "" && this.peekStartsWith(";")) throw new M(4009, !1);
    return this.capture(t), new dn(qo(t), this.parseMatrixParams());
  }
  parseMatrixParams() {
    let t = {};
    for (; this.consumeOptional(";"); ) this.parseParam(t);
    return t;
  }
  parseParam(t) {
    let r = SC(this.remaining);
    if (!r) return;
    this.capture(r);
    let n = "";
    if (this.consumeOptional("=")) {
      let i = Ll(this.remaining);
      i && ((n = i), this.capture(n));
    }
    t[qo(r)] = qo(n);
  }
  parseQueryParam(t) {
    let r = TC(this.remaining);
    if (!r) return;
    this.capture(r);
    let n = "";
    if (this.consumeOptional("=")) {
      let s = AC(this.remaining);
      s && ((n = s), this.capture(n));
    }
    let i = Sh(r),
      o = Sh(n);
    if (t.hasOwnProperty(i)) {
      let s = t[i];
      Array.isArray(s) || ((s = [s]), (t[i] = s)), s.push(o);
    } else t[i] = o;
  }
  parseParens(t) {
    let r = {};
    for (
      this.capture("(");
      !this.consumeOptional(")") && this.remaining.length > 0;

    ) {
      let n = Ll(this.remaining),
        i = this.remaining[n.length];
      if (i !== "/" && i !== ")" && i !== ";") throw new M(4010, !1);
      let o;
      n.indexOf(":") > -1
        ? ((o = n.slice(0, n.indexOf(":"))), this.capture(o), this.capture(":"))
        : t && (o = N);
      let s = this.parseChildren();
      (r[o] = Object.keys(s).length === 1 ? s[N] : new q([], s)),
        this.consumeOptional("//");
    }
    return r;
  }
  peekStartsWith(t) {
    return this.remaining.startsWith(t);
  }
  consumeOptional(t) {
    return this.peekStartsWith(t)
      ? ((this.remaining = this.remaining.substring(t.length)), !0)
      : !1;
  }
  capture(t) {
    if (!this.consumeOptional(t)) throw new M(4011, !1);
  }
};
function zh(e) {
  return e.segments.length > 0 ? new q([], { [N]: e }) : e;
}
function Uh(e) {
  let t = {};
  for (let [n, i] of Object.entries(e.children)) {
    let o = Uh(i);
    if (n === N && o.segments.length === 0 && o.hasChildren())
      for (let [s, a] of Object.entries(o.children)) t[s] = a;
    else (o.segments.length > 0 || o.hasChildren()) && (t[n] = o);
  }
  let r = new q(e.segments, t);
  return NC(r);
}
function NC(e) {
  if (e.numberOfChildren === 1 && e.children[N]) {
    let t = e.children[N];
    return new q(e.segments.concat(t.segments), t.children);
  }
  return e;
}
function nr(e) {
  return e instanceof Ut;
}
function kC(e, t, r = null, n = null) {
  let i = Bh(e);
  return $h(i, t, r, n);
}
function Bh(e) {
  let t;
  function r(o) {
    let s = {};
    for (let l of o.children) {
      let c = r(l);
      s[l.outlet] = c;
    }
    let a = new q(o.url, s);
    return o === e && (t = a), a;
  }
  let n = r(e.root),
    i = zh(n);
  return t ?? i;
}
function $h(e, t, r, n) {
  let i = e;
  for (; i.parent; ) i = i.parent;
  if (t.length === 0) return Vl(i, i, i, r, n);
  let o = FC(t);
  if (o.toRoot()) return Vl(i, i, new q([], {}), r, n);
  let s = RC(o, i, e),
    a = s.processChildren
      ? Hr(s.segmentGroup, s.index, o.commands)
      : Gh(s.segmentGroup, s.index, o.commands);
  return Vl(i, s.segmentGroup, a, r, n);
}
function Ko(e) {
  return typeof e == "object" && e != null && !e.outlets && !e.segmentPath;
}
function qr(e) {
  return typeof e == "object" && e != null && e.outlets;
}
function Vl(e, t, r, n, i) {
  let o = {};
  n &&
    Object.entries(n).forEach(([l, c]) => {
      o[l] = Array.isArray(c) ? c.map((h) => `${h}`) : `${c}`;
    });
  let s;
  e === t ? (s = r) : (s = Hh(e, t, r));
  let a = zh(Uh(s));
  return new Ut(a, o, i);
}
function Hh(e, t, r) {
  let n = {};
  return (
    Object.entries(e.children).forEach(([i, o]) => {
      o === t ? (n[i] = r) : (n[i] = Hh(o, t, r));
    }),
    new q(e.segments, n)
  );
}
var Yo = class {
  constructor(t, r, n) {
    if (
      ((this.isAbsolute = t),
      (this.numberOfDoubleDots = r),
      (this.commands = n),
      t && n.length > 0 && Ko(n[0]))
    )
      throw new M(4003, !1);
    let i = n.find(qr);
    if (i && i !== Nh(n)) throw new M(4004, !1);
  }
  toRoot() {
    return (
      this.isAbsolute && this.commands.length === 1 && this.commands[0] == "/"
    );
  }
};
function FC(e) {
  if (typeof e[0] == "string" && e.length === 1 && e[0] === "/")
    return new Yo(!0, 0, e);
  let t = 0,
    r = !1,
    n = e.reduce((i, o, s) => {
      if (typeof o == "object" && o != null) {
        if (o.outlets) {
          let a = {};
          return (
            Object.entries(o.outlets).forEach(([l, c]) => {
              a[l] = typeof c == "string" ? c.split("/") : c;
            }),
            [...i, { outlets: a }]
          );
        }
        if (o.segmentPath) return [...i, o.segmentPath];
      }
      return typeof o != "string"
        ? [...i, o]
        : s === 0
        ? (o.split("/").forEach((a, l) => {
            (l == 0 && a === ".") ||
              (l == 0 && a === ""
                ? (r = !0)
                : a === ".."
                ? t++
                : a != "" && i.push(a));
          }),
          i)
        : [...i, o];
    }, []);
  return new Yo(r, t, n);
}
var Xn = class {
  constructor(t, r, n) {
    (this.segmentGroup = t), (this.processChildren = r), (this.index = n);
  }
};
function RC(e, t, r) {
  if (e.isAbsolute) return new Xn(t, !0, 0);
  if (!r) return new Xn(t, !1, NaN);
  if (r.parent === null) return new Xn(r, !0, 0);
  let n = Ko(e.commands[0]) ? 0 : 1,
    i = r.segments.length - 1 + n;
  return LC(r, i, e.numberOfDoubleDots);
}
function LC(e, t, r) {
  let n = e,
    i = t,
    o = r;
  for (; o > i; ) {
    if (((o -= i), (n = n.parent), !n)) throw new M(4005, !1);
    i = n.segments.length;
  }
  return new Xn(n, !1, i - o);
}
function VC(e) {
  return qr(e[0]) ? e[0].outlets : { [N]: e };
}
function Gh(e, t, r) {
  if (((e ??= new q([], {})), e.segments.length === 0 && e.hasChildren()))
    return Hr(e, t, r);
  let n = jC(e, t, r),
    i = r.slice(n.commandIndex);
  if (n.match && n.pathIndex < e.segments.length) {
    let o = new q(e.segments.slice(0, n.pathIndex), {});
    return (
      (o.children[N] = new q(e.segments.slice(n.pathIndex), e.children)),
      Hr(o, 0, i)
    );
  } else
    return n.match && i.length === 0
      ? new q(e.segments, {})
      : n.match && !e.hasChildren()
      ? Gl(e, t, r)
      : n.match
      ? Hr(e, 0, i)
      : Gl(e, t, r);
}
function Hr(e, t, r) {
  if (r.length === 0) return new q(e.segments, {});
  {
    let n = VC(r),
      i = {};
    if (
      Object.keys(n).some((o) => o !== N) &&
      e.children[N] &&
      e.numberOfChildren === 1 &&
      e.children[N].segments.length === 0
    ) {
      let o = Hr(e.children[N], t, r);
      return new q(e.segments, o.children);
    }
    return (
      Object.entries(n).forEach(([o, s]) => {
        typeof s == "string" && (s = [s]),
          s !== null && (i[o] = Gh(e.children[o], t, s));
      }),
      Object.entries(e.children).forEach(([o, s]) => {
        n[o] === void 0 && (i[o] = s);
      }),
      new q(e.segments, i)
    );
  }
}
function jC(e, t, r) {
  let n = 0,
    i = t,
    o = { match: !1, pathIndex: 0, commandIndex: 0 };
  for (; i < e.segments.length; ) {
    if (n >= r.length) return o;
    let s = e.segments[i],
      a = r[n];
    if (qr(a)) break;
    let l = `${a}`,
      c = n < r.length - 1 ? r[n + 1] : null;
    if (i > 0 && l === void 0) break;
    if (l && c && typeof c == "object" && c.outlets === void 0) {
      if (!Th(l, c, s)) return o;
      n += 2;
    } else {
      if (!Th(l, {}, s)) return o;
      n++;
    }
    i++;
  }
  return { match: !0, pathIndex: i, commandIndex: n };
}
function Gl(e, t, r) {
  let n = e.segments.slice(0, t),
    i = 0;
  for (; i < r.length; ) {
    let o = r[i];
    if (qr(o)) {
      let l = zC(o.outlets);
      return new q(n, l);
    }
    if (i === 0 && Ko(r[0])) {
      let l = e.segments[t];
      n.push(new dn(l.path, Oh(r[0]))), i++;
      continue;
    }
    let s = qr(o) ? o.outlets[N] : `${o}`,
      a = i < r.length - 1 ? r[i + 1] : null;
    s && a && Ko(a)
      ? (n.push(new dn(s, Oh(a))), (i += 2))
      : (n.push(new dn(s, {})), i++);
  }
  return new q(n, {});
}
function zC(e) {
  let t = {};
  return (
    Object.entries(e).forEach(([r, n]) => {
      typeof n == "string" && (n = [n]),
        n !== null && (t[r] = Gl(new q([], {}), 0, n));
    }),
    t
  );
}
function Oh(e) {
  let t = {};
  return Object.entries(e).forEach(([r, n]) => (t[r] = `${n}`)), t;
}
function Th(e, t, r) {
  return e == r.path && ut(t, r.parameters);
}
var Gr = "imperative",
  ge = (function (e) {
    return (
      (e[(e.NavigationStart = 0)] = "NavigationStart"),
      (e[(e.NavigationEnd = 1)] = "NavigationEnd"),
      (e[(e.NavigationCancel = 2)] = "NavigationCancel"),
      (e[(e.NavigationError = 3)] = "NavigationError"),
      (e[(e.RoutesRecognized = 4)] = "RoutesRecognized"),
      (e[(e.ResolveStart = 5)] = "ResolveStart"),
      (e[(e.ResolveEnd = 6)] = "ResolveEnd"),
      (e[(e.GuardsCheckStart = 7)] = "GuardsCheckStart"),
      (e[(e.GuardsCheckEnd = 8)] = "GuardsCheckEnd"),
      (e[(e.RouteConfigLoadStart = 9)] = "RouteConfigLoadStart"),
      (e[(e.RouteConfigLoadEnd = 10)] = "RouteConfigLoadEnd"),
      (e[(e.ChildActivationStart = 11)] = "ChildActivationStart"),
      (e[(e.ChildActivationEnd = 12)] = "ChildActivationEnd"),
      (e[(e.ActivationStart = 13)] = "ActivationStart"),
      (e[(e.ActivationEnd = 14)] = "ActivationEnd"),
      (e[(e.Scroll = 15)] = "Scroll"),
      (e[(e.NavigationSkipped = 16)] = "NavigationSkipped"),
      e
    );
  })(ge || {}),
  He = class {
    constructor(t, r) {
      (this.id = t), (this.url = r);
    }
  },
  Zr = class extends He {
    constructor(t, r, n = "imperative", i = null) {
      super(t, r),
        (this.type = ge.NavigationStart),
        (this.navigationTrigger = n),
        (this.restoredState = i);
    }
    toString() {
      return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
    }
  },
  hn = class extends He {
    constructor(t, r, n) {
      super(t, r), (this.urlAfterRedirects = n), (this.type = ge.NavigationEnd);
    }
    toString() {
      return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
    }
  },
  Le = (function (e) {
    return (
      (e[(e.Redirect = 0)] = "Redirect"),
      (e[(e.SupersededByNewNavigation = 1)] = "SupersededByNewNavigation"),
      (e[(e.NoDataFromResolver = 2)] = "NoDataFromResolver"),
      (e[(e.GuardRejected = 3)] = "GuardRejected"),
      e
    );
  })(Le || {}),
  Wl = (function (e) {
    return (
      (e[(e.IgnoredSameUrlNavigation = 0)] = "IgnoredSameUrlNavigation"),
      (e[(e.IgnoredByUrlHandlingStrategy = 1)] =
        "IgnoredByUrlHandlingStrategy"),
      e
    );
  })(Wl || {}),
  Bt = class extends He {
    constructor(t, r, n, i) {
      super(t, r),
        (this.reason = n),
        (this.code = i),
        (this.type = ge.NavigationCancel);
    }
    toString() {
      return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
    }
  },
  pn = class extends He {
    constructor(t, r, n, i) {
      super(t, r),
        (this.reason = n),
        (this.code = i),
        (this.type = ge.NavigationSkipped);
    }
  },
  Kr = class extends He {
    constructor(t, r, n, i) {
      super(t, r),
        (this.error = n),
        (this.target = i),
        (this.type = ge.NavigationError);
    }
    toString() {
      return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
    }
  },
  Qo = class extends He {
    constructor(t, r, n, i) {
      super(t, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.type = ge.RoutesRecognized);
    }
    toString() {
      return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  ql = class extends He {
    constructor(t, r, n, i) {
      super(t, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.type = ge.GuardsCheckStart);
    }
    toString() {
      return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Zl = class extends He {
    constructor(t, r, n, i, o) {
      super(t, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.shouldActivate = o),
        (this.type = ge.GuardsCheckEnd);
    }
    toString() {
      return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
    }
  },
  Kl = class extends He {
    constructor(t, r, n, i) {
      super(t, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.type = ge.ResolveStart);
    }
    toString() {
      return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Yl = class extends He {
    constructor(t, r, n, i) {
      super(t, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.type = ge.ResolveEnd);
    }
    toString() {
      return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Ql = class {
    constructor(t) {
      (this.route = t), (this.type = ge.RouteConfigLoadStart);
    }
    toString() {
      return `RouteConfigLoadStart(path: ${this.route.path})`;
    }
  },
  Jl = class {
    constructor(t) {
      (this.route = t), (this.type = ge.RouteConfigLoadEnd);
    }
    toString() {
      return `RouteConfigLoadEnd(path: ${this.route.path})`;
    }
  },
  Xl = class {
    constructor(t) {
      (this.snapshot = t), (this.type = ge.ChildActivationStart);
    }
    toString() {
      return `ChildActivationStart(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  ec = class {
    constructor(t) {
      (this.snapshot = t), (this.type = ge.ChildActivationEnd);
    }
    toString() {
      return `ChildActivationEnd(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  tc = class {
    constructor(t) {
      (this.snapshot = t), (this.type = ge.ActivationStart);
    }
    toString() {
      return `ActivationStart(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  nc = class {
    constructor(t) {
      (this.snapshot = t), (this.type = ge.ActivationEnd);
    }
    toString() {
      return `ActivationEnd(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  };
var Yr = class {},
  Qr = class {
    constructor(t) {
      this.url = t;
    }
  };
var rc = class {
    constructor() {
      (this.outlet = null),
        (this.route = null),
        (this.injector = null),
        (this.children = new rs()),
        (this.attachRef = null);
    }
  },
  rs = (() => {
    let t = class t {
      constructor() {
        this.contexts = new Map();
      }
      onChildOutletCreated(n, i) {
        let o = this.getOrCreateContext(n);
        (o.outlet = i), this.contexts.set(n, o);
      }
      onChildOutletDestroyed(n) {
        let i = this.getContext(n);
        i && ((i.outlet = null), (i.attachRef = null));
      }
      onOutletDeactivated() {
        let n = this.contexts;
        return (this.contexts = new Map()), n;
      }
      onOutletReAttached(n) {
        this.contexts = n;
      }
      getOrCreateContext(n) {
        let i = this.getContext(n);
        return i || ((i = new rc()), this.contexts.set(n, i)), i;
      }
      getContext(n) {
        return this.contexts.get(n) || null;
      }
    };
    (t.ɵfac = function (i) {
      return new (i || t)();
    }),
      (t.ɵprov = E({ token: t, factory: t.ɵfac, providedIn: "root" }));
    let e = t;
    return e;
  })(),
  Jo = class {
    constructor(t) {
      this._root = t;
    }
    get root() {
      return this._root.value;
    }
    parent(t) {
      let r = this.pathFromRoot(t);
      return r.length > 1 ? r[r.length - 2] : null;
    }
    children(t) {
      let r = ic(t, this._root);
      return r ? r.children.map((n) => n.value) : [];
    }
    firstChild(t) {
      let r = ic(t, this._root);
      return r && r.children.length > 0 ? r.children[0].value : null;
    }
    siblings(t) {
      let r = oc(t, this._root);
      return r.length < 2
        ? []
        : r[r.length - 2].children.map((i) => i.value).filter((i) => i !== t);
    }
    pathFromRoot(t) {
      return oc(t, this._root).map((r) => r.value);
    }
  };
function ic(e, t) {
  if (e === t.value) return t;
  for (let r of t.children) {
    let n = ic(e, r);
    if (n) return n;
  }
  return null;
}
function oc(e, t) {
  if (e === t.value) return [t];
  for (let r of t.children) {
    let n = oc(e, r);
    if (n.length) return n.unshift(t), n;
  }
  return [];
}
var Re = class {
  constructor(t, r) {
    (this.value = t), (this.children = r);
  }
  toString() {
    return `TreeNode(${this.value})`;
  }
};
function Jn(e) {
  let t = {};
  return e && e.children.forEach((r) => (t[r.value.outlet] = r)), t;
}
var Xo = class extends Jo {
  constructor(t, r) {
    super(t), (this.snapshot = r), mc(this, t);
  }
  toString() {
    return this.snapshot.toString();
  }
};
function Wh(e) {
  let t = UC(e),
    r = new he([new dn("", {})]),
    n = new he({}),
    i = new he({}),
    o = new he({}),
    s = new he(""),
    a = new rr(r, n, o, s, i, N, e, t.root);
  return (a.snapshot = t.root), new Xo(new Re(a, []), t);
}
function UC(e) {
  let t = {},
    r = {},
    n = {},
    i = "",
    o = new Jr([], t, n, i, r, N, e, null, {});
  return new es("", new Re(o, []));
}
var rr = class {
  constructor(t, r, n, i, o, s, a, l) {
    (this.urlSubject = t),
      (this.paramsSubject = r),
      (this.queryParamsSubject = n),
      (this.fragmentSubject = i),
      (this.dataSubject = o),
      (this.outlet = s),
      (this.component = a),
      (this._futureSnapshot = l),
      (this.title = this.dataSubject?.pipe(A((c) => c[ti])) ?? S(void 0)),
      (this.url = t),
      (this.params = r),
      (this.queryParams = n),
      (this.fragment = i),
      (this.data = o);
  }
  get routeConfig() {
    return this._futureSnapshot.routeConfig;
  }
  get root() {
    return this._routerState.root;
  }
  get parent() {
    return this._routerState.parent(this);
  }
  get firstChild() {
    return this._routerState.firstChild(this);
  }
  get children() {
    return this._routerState.children(this);
  }
  get pathFromRoot() {
    return this._routerState.pathFromRoot(this);
  }
  get paramMap() {
    return (
      (this._paramMap ??= this.params.pipe(A((t) => tr(t)))), this._paramMap
    );
  }
  get queryParamMap() {
    return (
      (this._queryParamMap ??= this.queryParams.pipe(A((t) => tr(t)))),
      this._queryParamMap
    );
  }
  toString() {
    return this.snapshot
      ? this.snapshot.toString()
      : `Future(${this._futureSnapshot})`;
  }
};
function gc(e, t, r = "emptyOnly") {
  let n,
    { routeConfig: i } = e;
  return (
    t !== null &&
    (r === "always" ||
      i?.path === "" ||
      (!t.component && !t.routeConfig?.loadComponent))
      ? (n = {
          params: C(C({}, t.params), e.params),
          data: C(C({}, t.data), e.data),
          resolve: C(C(C(C({}, e.data), t.data), i?.data), e._resolvedData),
        })
      : (n = {
          params: C({}, e.params),
          data: C({}, e.data),
          resolve: C(C({}, e.data), e._resolvedData ?? {}),
        }),
    i && Zh(i) && (n.resolve[ti] = i.title),
    n
  );
}
var Jr = class {
    get title() {
      return this.data?.[ti];
    }
    constructor(t, r, n, i, o, s, a, l, c) {
      (this.url = t),
        (this.params = r),
        (this.queryParams = n),
        (this.fragment = i),
        (this.data = o),
        (this.outlet = s),
        (this.component = a),
        (this.routeConfig = l),
        (this._resolve = c);
    }
    get root() {
      return this._routerState.root;
    }
    get parent() {
      return this._routerState.parent(this);
    }
    get firstChild() {
      return this._routerState.firstChild(this);
    }
    get children() {
      return this._routerState.children(this);
    }
    get pathFromRoot() {
      return this._routerState.pathFromRoot(this);
    }
    get paramMap() {
      return (this._paramMap ??= tr(this.params)), this._paramMap;
    }
    get queryParamMap() {
      return (
        (this._queryParamMap ??= tr(this.queryParams)), this._queryParamMap
      );
    }
    toString() {
      let t = this.url.map((n) => n.toString()).join("/"),
        r = this.routeConfig ? this.routeConfig.path : "";
      return `Route(url:'${t}', path:'${r}')`;
    }
  },
  es = class extends Jo {
    constructor(t, r) {
      super(r), (this.url = t), mc(this, r);
    }
    toString() {
      return qh(this._root);
    }
  };
function mc(e, t) {
  (t.value._routerState = e), t.children.forEach((r) => mc(e, r));
}
function qh(e) {
  let t = e.children.length > 0 ? ` { ${e.children.map(qh).join(", ")} } ` : "";
  return `${e.value}${t}`;
}
function jl(e) {
  if (e.snapshot) {
    let t = e.snapshot,
      r = e._futureSnapshot;
    (e.snapshot = r),
      ut(t.queryParams, r.queryParams) ||
        e.queryParamsSubject.next(r.queryParams),
      t.fragment !== r.fragment && e.fragmentSubject.next(r.fragment),
      ut(t.params, r.params) || e.paramsSubject.next(r.params),
      mC(t.url, r.url) || e.urlSubject.next(r.url),
      ut(t.data, r.data) || e.dataSubject.next(r.data);
  } else
    (e.snapshot = e._futureSnapshot),
      e.dataSubject.next(e._futureSnapshot.data);
}
function sc(e, t) {
  let r = ut(e.params, t.params) && CC(e.url, t.url),
    n = !e.parent != !t.parent;
  return r && !n && (!e.parent || sc(e.parent, t.parent));
}
function Zh(e) {
  return typeof e.title == "string" || e.title === null;
}
var vc = (() => {
    let t = class t {
      constructor() {
        (this.activated = null),
          (this._activatedRoute = null),
          (this.name = N),
          (this.activateEvents = new ve()),
          (this.deactivateEvents = new ve()),
          (this.attachEvents = new ve()),
          (this.detachEvents = new ve()),
          (this.parentContexts = v(rs)),
          (this.location = v(_o)),
          (this.changeDetector = v(ln)),
          (this.environmentInjector = v(Ee)),
          (this.inputBinder = v(yc, { optional: !0 })),
          (this.supportsBindingToComponentInputs = !0);
      }
      get activatedComponentRef() {
        return this.activated;
      }
      ngOnChanges(n) {
        if (n.name) {
          let { firstChange: i, previousValue: o } = n.name;
          if (i) return;
          this.isTrackedInParentContexts(o) &&
            (this.deactivate(), this.parentContexts.onChildOutletDestroyed(o)),
            this.initializeOutletWithName();
        }
      }
      ngOnDestroy() {
        this.isTrackedInParentContexts(this.name) &&
          this.parentContexts.onChildOutletDestroyed(this.name),
          this.inputBinder?.unsubscribeFromRouteData(this);
      }
      isTrackedInParentContexts(n) {
        return this.parentContexts.getContext(n)?.outlet === this;
      }
      ngOnInit() {
        this.initializeOutletWithName();
      }
      initializeOutletWithName() {
        if (
          (this.parentContexts.onChildOutletCreated(this.name, this),
          this.activated)
        )
          return;
        let n = this.parentContexts.getContext(this.name);
        n?.route &&
          (n.attachRef
            ? this.attach(n.attachRef, n.route)
            : this.activateWith(n.route, n.injector));
      }
      get isActivated() {
        return !!this.activated;
      }
      get component() {
        if (!this.activated) throw new M(4012, !1);
        return this.activated.instance;
      }
      get activatedRoute() {
        if (!this.activated) throw new M(4012, !1);
        return this._activatedRoute;
      }
      get activatedRouteData() {
        return this._activatedRoute ? this._activatedRoute.snapshot.data : {};
      }
      detach() {
        if (!this.activated) throw new M(4012, !1);
        this.location.detach();
        let n = this.activated;
        return (
          (this.activated = null),
          (this._activatedRoute = null),
          this.detachEvents.emit(n.instance),
          n
        );
      }
      attach(n, i) {
        (this.activated = n),
          (this._activatedRoute = i),
          this.location.insert(n.hostView),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.attachEvents.emit(n.instance);
      }
      deactivate() {
        if (this.activated) {
          let n = this.component;
          this.activated.destroy(),
            (this.activated = null),
            (this._activatedRoute = null),
            this.deactivateEvents.emit(n);
        }
      }
      activateWith(n, i) {
        if (this.isActivated) throw new M(4013, !1);
        this._activatedRoute = n;
        let o = this.location,
          a = n.snapshot.component,
          l = this.parentContexts.getOrCreateContext(this.name).children,
          c = new ac(n, l, o.injector);
        (this.activated = o.createComponent(a, {
          index: o.length,
          injector: c,
          environmentInjector: i ?? this.environmentInjector,
        })),
          this.changeDetector.markForCheck(),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.activateEvents.emit(this.activated.instance);
      }
    };
    (t.ɵfac = function (i) {
      return new (i || t)();
    }),
      (t.ɵdir = ce({
        type: t,
        selectors: [["router-outlet"]],
        inputs: { name: "name" },
        outputs: {
          activateEvents: "activate",
          deactivateEvents: "deactivate",
          attachEvents: "attach",
          detachEvents: "detach",
        },
        exportAs: ["outlet"],
        standalone: !0,
        features: [rn],
      }));
    let e = t;
    return e;
  })(),
  ac = class {
    constructor(t, r, n) {
      (this.route = t),
        (this.childContexts = r),
        (this.parent = n),
        (this.__ngOutletInjector = !0);
    }
    get(t, r) {
      return t === rr
        ? this.route
        : t === rs
        ? this.childContexts
        : this.parent.get(t, r);
    }
  },
  yc = new x("");
function BC(e, t, r) {
  let n = Xr(e, t._root, r ? r._root : void 0);
  return new Xo(n, t);
}
function Xr(e, t, r) {
  if (r && e.shouldReuseRoute(t.value, r.value.snapshot)) {
    let n = r.value;
    n._futureSnapshot = t.value;
    let i = $C(e, t, r);
    return new Re(n, i);
  } else {
    if (e.shouldAttach(t.value)) {
      let o = e.retrieve(t.value);
      if (o !== null) {
        let s = o.route;
        return (
          (s.value._futureSnapshot = t.value),
          (s.children = t.children.map((a) => Xr(e, a))),
          s
        );
      }
    }
    let n = HC(t.value),
      i = t.children.map((o) => Xr(e, o));
    return new Re(n, i);
  }
}
function $C(e, t, r) {
  return t.children.map((n) => {
    for (let i of r.children)
      if (e.shouldReuseRoute(n.value, i.value.snapshot)) return Xr(e, n, i);
    return Xr(e, n);
  });
}
function HC(e) {
  return new rr(
    new he(e.url),
    new he(e.params),
    new he(e.queryParams),
    new he(e.fragment),
    new he(e.data),
    e.outlet,
    e.component,
    e
  );
}
var Kh = "ngNavigationCancelingError";
function Yh(e, t) {
  let { redirectTo: r, navigationBehaviorOptions: n } = nr(t)
      ? { redirectTo: t, navigationBehaviorOptions: void 0 }
      : t,
    i = Qh(!1, Le.Redirect);
  return (i.url = r), (i.navigationBehaviorOptions = n), i;
}
function Qh(e, t) {
  let r = new Error(`NavigationCancelingError: ${e || ""}`);
  return (r[Kh] = !0), (r.cancellationCode = t), r;
}
function GC(e) {
  return Jh(e) && nr(e.url);
}
function Jh(e) {
  return !!e && e[Kh];
}
var WC = (() => {
  let t = class t {};
  (t.ɵfac = function (i) {
    return new (i || t)();
  }),
    (t.ɵcmp = G({
      type: t,
      selectors: [["ng-component"]],
      standalone: !0,
      features: [W],
      decls: 1,
      vars: 0,
      template: function (i, o) {
        i & 1 && b(0, "router-outlet");
      },
      dependencies: [vc],
      encapsulation: 2,
    }));
  let e = t;
  return e;
})();
function qC(e, t) {
  return (
    e.providers &&
      !e._injector &&
      (e._injector = Cl(e.providers, t, `Route: ${e.path}`)),
    e._injector ?? t
  );
}
function wc(e) {
  let t = e.children && e.children.map(wc),
    r = t ? K(C({}, e), { children: t }) : C({}, e);
  return (
    !r.component &&
      !r.loadComponent &&
      (t || r.loadChildren) &&
      r.outlet &&
      r.outlet !== N &&
      (r.component = WC),
    r
  );
}
function dt(e) {
  return e.outlet || N;
}
function ZC(e, t) {
  let r = e.filter((n) => dt(n) === t);
  return r.push(...e.filter((n) => dt(n) !== t)), r;
}
function ni(e) {
  if (!e) return null;
  if (e.routeConfig?._injector) return e.routeConfig._injector;
  for (let t = e.parent; t; t = t.parent) {
    let r = t.routeConfig;
    if (r?._loadedInjector) return r._loadedInjector;
    if (r?._injector) return r._injector;
  }
  return null;
}
var KC = (e, t, r, n) =>
    A(
      (i) => (
        new lc(t, i.targetRouterState, i.currentRouterState, r, n).activate(e),
        i
      )
    ),
  lc = class {
    constructor(t, r, n, i, o) {
      (this.routeReuseStrategy = t),
        (this.futureState = r),
        (this.currState = n),
        (this.forwardEvent = i),
        (this.inputBindingEnabled = o);
    }
    activate(t) {
      let r = this.futureState._root,
        n = this.currState ? this.currState._root : null;
      this.deactivateChildRoutes(r, n, t),
        jl(this.futureState.root),
        this.activateChildRoutes(r, n, t);
    }
    deactivateChildRoutes(t, r, n) {
      let i = Jn(r);
      t.children.forEach((o) => {
        let s = o.value.outlet;
        this.deactivateRoutes(o, i[s], n), delete i[s];
      }),
        Object.values(i).forEach((o) => {
          this.deactivateRouteAndItsChildren(o, n);
        });
    }
    deactivateRoutes(t, r, n) {
      let i = t.value,
        o = r ? r.value : null;
      if (i === o)
        if (i.component) {
          let s = n.getContext(i.outlet);
          s && this.deactivateChildRoutes(t, r, s.children);
        } else this.deactivateChildRoutes(t, r, n);
      else o && this.deactivateRouteAndItsChildren(r, n);
    }
    deactivateRouteAndItsChildren(t, r) {
      t.value.component &&
      this.routeReuseStrategy.shouldDetach(t.value.snapshot)
        ? this.detachAndStoreRouteSubtree(t, r)
        : this.deactivateRouteAndOutlet(t, r);
    }
    detachAndStoreRouteSubtree(t, r) {
      let n = r.getContext(t.value.outlet),
        i = n && t.value.component ? n.children : r,
        o = Jn(t);
      for (let s of Object.values(o)) this.deactivateRouteAndItsChildren(s, i);
      if (n && n.outlet) {
        let s = n.outlet.detach(),
          a = n.children.onOutletDeactivated();
        this.routeReuseStrategy.store(t.value.snapshot, {
          componentRef: s,
          route: t,
          contexts: a,
        });
      }
    }
    deactivateRouteAndOutlet(t, r) {
      let n = r.getContext(t.value.outlet),
        i = n && t.value.component ? n.children : r,
        o = Jn(t);
      for (let s of Object.values(o)) this.deactivateRouteAndItsChildren(s, i);
      n &&
        (n.outlet && (n.outlet.deactivate(), n.children.onOutletDeactivated()),
        (n.attachRef = null),
        (n.route = null));
    }
    activateChildRoutes(t, r, n) {
      let i = Jn(r);
      t.children.forEach((o) => {
        this.activateRoutes(o, i[o.value.outlet], n),
          this.forwardEvent(new nc(o.value.snapshot));
      }),
        t.children.length && this.forwardEvent(new ec(t.value.snapshot));
    }
    activateRoutes(t, r, n) {
      let i = t.value,
        o = r ? r.value : null;
      if ((jl(i), i === o))
        if (i.component) {
          let s = n.getOrCreateContext(i.outlet);
          this.activateChildRoutes(t, r, s.children);
        } else this.activateChildRoutes(t, r, n);
      else if (i.component) {
        let s = n.getOrCreateContext(i.outlet);
        if (this.routeReuseStrategy.shouldAttach(i.snapshot)) {
          let a = this.routeReuseStrategy.retrieve(i.snapshot);
          this.routeReuseStrategy.store(i.snapshot, null),
            s.children.onOutletReAttached(a.contexts),
            (s.attachRef = a.componentRef),
            (s.route = a.route.value),
            s.outlet && s.outlet.attach(a.componentRef, a.route.value),
            jl(a.route.value),
            this.activateChildRoutes(t, null, s.children);
        } else {
          let a = ni(i.snapshot);
          (s.attachRef = null),
            (s.route = i),
            (s.injector = a),
            s.outlet && s.outlet.activateWith(i, s.injector),
            this.activateChildRoutes(t, null, s.children);
        }
      } else this.activateChildRoutes(t, null, n);
    }
  },
  ts = class {
    constructor(t) {
      (this.path = t), (this.route = this.path[this.path.length - 1]);
    }
  },
  er = class {
    constructor(t, r) {
      (this.component = t), (this.route = r);
    }
  };
function YC(e, t, r) {
  let n = e._root,
    i = t ? t._root : null;
  return Br(n, i, r, [n.value]);
}
function QC(e) {
  let t = e.routeConfig ? e.routeConfig.canActivateChild : null;
  return !t || t.length === 0 ? null : { node: e, guards: t };
}
function or(e, t) {
  let r = Symbol(),
    n = t.get(e, r);
  return n === r ? (typeof e == "function" && !ed(e) ? e : t.get(e)) : n;
}
function Br(
  e,
  t,
  r,
  n,
  i = { canDeactivateChecks: [], canActivateChecks: [] }
) {
  let o = Jn(t);
  return (
    e.children.forEach((s) => {
      JC(s, o[s.value.outlet], r, n.concat([s.value]), i),
        delete o[s.value.outlet];
    }),
    Object.entries(o).forEach(([s, a]) => Wr(a, r.getContext(s), i)),
    i
  );
}
function JC(
  e,
  t,
  r,
  n,
  i = { canDeactivateChecks: [], canActivateChecks: [] }
) {
  let o = e.value,
    s = t ? t.value : null,
    a = r ? r.getContext(e.value.outlet) : null;
  if (s && o.routeConfig === s.routeConfig) {
    let l = XC(s, o, o.routeConfig.runGuardsAndResolvers);
    l
      ? i.canActivateChecks.push(new ts(n))
      : ((o.data = s.data), (o._resolvedData = s._resolvedData)),
      o.component ? Br(e, t, a ? a.children : null, n, i) : Br(e, t, r, n, i),
      l &&
        a &&
        a.outlet &&
        a.outlet.isActivated &&
        i.canDeactivateChecks.push(new er(a.outlet.component, s));
  } else
    s && Wr(t, a, i),
      i.canActivateChecks.push(new ts(n)),
      o.component
        ? Br(e, null, a ? a.children : null, n, i)
        : Br(e, null, r, n, i);
  return i;
}
function XC(e, t, r) {
  if (typeof r == "function") return r(e, t);
  switch (r) {
    case "pathParamsChange":
      return !fn(e.url, t.url);
    case "pathParamsOrQueryParamsChange":
      return !fn(e.url, t.url) || !ut(e.queryParams, t.queryParams);
    case "always":
      return !0;
    case "paramsOrQueryParamsChange":
      return !sc(e, t) || !ut(e.queryParams, t.queryParams);
    case "paramsChange":
    default:
      return !sc(e, t);
  }
}
function Wr(e, t, r) {
  let n = Jn(e),
    i = e.value;
  Object.entries(n).forEach(([o, s]) => {
    i.component
      ? t
        ? Wr(s, t.children.getContext(o), r)
        : Wr(s, null, r)
      : Wr(s, t, r);
  }),
    i.component
      ? t && t.outlet && t.outlet.isActivated
        ? r.canDeactivateChecks.push(new er(t.outlet.component, i))
        : r.canDeactivateChecks.push(new er(null, i))
      : r.canDeactivateChecks.push(new er(null, i));
}
function ri(e) {
  return typeof e == "function";
}
function eb(e) {
  return typeof e == "boolean";
}
function tb(e) {
  return e && ri(e.canLoad);
}
function nb(e) {
  return e && ri(e.canActivate);
}
function rb(e) {
  return e && ri(e.canActivateChild);
}
function ib(e) {
  return e && ri(e.canDeactivate);
}
function ob(e) {
  return e && ri(e.canMatch);
}
function Xh(e) {
  return e instanceof ft || e?.name === "EmptyError";
}
var Ho = Symbol("INITIAL_VALUE");
function ir() {
  return Ne((e) =>
    Ti(e.map((t) => t.pipe(ht(1), Rs(Ho)))).pipe(
      A((t) => {
        for (let r of t)
          if (r !== !0) {
            if (r === Ho) return Ho;
            if (r === !1 || r instanceof Ut) return r;
          }
        return !0;
      }),
      Ae((t) => t !== Ho),
      ht(1)
    )
  );
}
function sb(e, t) {
  return le((r) => {
    let {
      targetSnapshot: n,
      currentSnapshot: i,
      guards: { canActivateChecks: o, canDeactivateChecks: s },
    } = r;
    return s.length === 0 && o.length === 0
      ? S(K(C({}, r), { guardsResult: !0 }))
      : ab(s, n, i, e).pipe(
          le((a) => (a && eb(a) ? lb(n, o, e, t) : S(a))),
          A((a) => K(C({}, r), { guardsResult: a }))
        );
  });
}
function ab(e, t, r, n) {
  return J(e).pipe(
    le((i) => hb(i.component, i.route, r, t, n)),
    Xe((i) => i !== !0, !0)
  );
}
function lb(e, t, r, n) {
  return J(t).pipe(
    It((i) =>
      _n(
        ub(i.route.parent, n),
        cb(i.route, n),
        fb(e, i.path, r),
        db(e, i.route, r)
      )
    ),
    Xe((i) => i !== !0, !0)
  );
}
function cb(e, t) {
  return e !== null && t && t(new tc(e)), S(!0);
}
function ub(e, t) {
  return e !== null && t && t(new Xl(e)), S(!0);
}
function db(e, t, r) {
  let n = t.routeConfig ? t.routeConfig.canActivate : null;
  if (!n || n.length === 0) return S(!0);
  let i = n.map((o) =>
    Pi(() => {
      let s = ni(t) ?? r,
        a = or(o, s),
        l = nb(a) ? a.canActivate(t, e) : mt(s, () => a(t, e));
      return $t(l).pipe(Xe());
    })
  );
  return S(i).pipe(ir());
}
function fb(e, t, r) {
  let n = t[t.length - 1],
    o = t
      .slice(0, t.length - 1)
      .reverse()
      .map((s) => QC(s))
      .filter((s) => s !== null)
      .map((s) =>
        Pi(() => {
          let a = s.guards.map((l) => {
            let c = ni(s.node) ?? r,
              h = or(l, c),
              p = rb(h) ? h.canActivateChild(n, e) : mt(c, () => h(n, e));
            return $t(p).pipe(Xe());
          });
          return S(a).pipe(ir());
        })
      );
  return S(o).pipe(ir());
}
function hb(e, t, r, n, i) {
  let o = t && t.routeConfig ? t.routeConfig.canDeactivate : null;
  if (!o || o.length === 0) return S(!0);
  let s = o.map((a) => {
    let l = ni(t) ?? i,
      c = or(a, l),
      h = ib(c) ? c.canDeactivate(e, t, r, n) : mt(l, () => c(e, t, r, n));
    return $t(h).pipe(Xe());
  });
  return S(s).pipe(ir());
}
function pb(e, t, r, n) {
  let i = t.canLoad;
  if (i === void 0 || i.length === 0) return S(!0);
  let o = i.map((s) => {
    let a = or(s, e),
      l = tb(a) ? a.canLoad(t, r) : mt(e, () => a(t, r));
    return $t(l);
  });
  return S(o).pipe(ir(), ep(n));
}
function ep(e) {
  return xs(
    ue((t) => {
      if (nr(t)) throw Yh(e, t);
    }),
    A((t) => t === !0)
  );
}
function gb(e, t, r, n) {
  let i = t.canMatch;
  if (!i || i.length === 0) return S(!0);
  let o = i.map((s) => {
    let a = or(s, e),
      l = ob(a) ? a.canMatch(t, r) : mt(e, () => a(t, r));
    return $t(l);
  });
  return S(o).pipe(ir(), ep(n));
}
var ei = class {
    constructor(t) {
      this.segmentGroup = t || null;
    }
  },
  ns = class extends Error {
    constructor(t) {
      super(), (this.urlTree = t);
    }
  };
function Qn(e) {
  return Dn(new ei(e));
}
function mb(e) {
  return Dn(new M(4e3, !1));
}
function vb(e) {
  return Dn(Qh(!1, Le.GuardRejected));
}
var cc = class {
    constructor(t, r) {
      (this.urlSerializer = t), (this.urlTree = r);
    }
    lineralizeSegments(t, r) {
      let n = [],
        i = r.root;
      for (;;) {
        if (((n = n.concat(i.segments)), i.numberOfChildren === 0)) return S(n);
        if (i.numberOfChildren > 1 || !i.children[N]) return mb(t.redirectTo);
        i = i.children[N];
      }
    }
    applyRedirectCommands(t, r, n) {
      let i = this.applyRedirectCreateUrlTree(
        r,
        this.urlSerializer.parse(r),
        t,
        n
      );
      if (r.startsWith("/")) throw new ns(i);
      return i;
    }
    applyRedirectCreateUrlTree(t, r, n, i) {
      let o = this.createSegmentGroup(t, r.root, n, i);
      return new Ut(
        o,
        this.createQueryParams(r.queryParams, this.urlTree.queryParams),
        r.fragment
      );
    }
    createQueryParams(t, r) {
      let n = {};
      return (
        Object.entries(t).forEach(([i, o]) => {
          if (typeof o == "string" && o.startsWith(":")) {
            let a = o.substring(1);
            n[i] = r[a];
          } else n[i] = o;
        }),
        n
      );
    }
    createSegmentGroup(t, r, n, i) {
      let o = this.createSegments(t, r.segments, n, i),
        s = {};
      return (
        Object.entries(r.children).forEach(([a, l]) => {
          s[a] = this.createSegmentGroup(t, l, n, i);
        }),
        new q(o, s)
      );
    }
    createSegments(t, r, n, i) {
      return r.map((o) =>
        o.path.startsWith(":")
          ? this.findPosParam(t, o, i)
          : this.findOrReturn(o, n)
      );
    }
    findPosParam(t, r, n) {
      let i = n[r.path.substring(1)];
      if (!i) throw new M(4001, !1);
      return i;
    }
    findOrReturn(t, r) {
      let n = 0;
      for (let i of r) {
        if (i.path === t.path) return r.splice(n), i;
        n++;
      }
      return t;
    }
  },
  uc = {
    matched: !1,
    consumedSegments: [],
    remainingSegments: [],
    parameters: {},
    positionalParamSegments: {},
  };
function yb(e, t, r, n, i) {
  let o = Cc(e, t, r);
  return o.matched
    ? ((n = qC(t, n)),
      gb(n, t, r, i).pipe(A((s) => (s === !0 ? o : C({}, uc)))))
    : S(o);
}
function Cc(e, t, r) {
  if (t.path === "**") return wb(r);
  if (t.path === "")
    return t.pathMatch === "full" && (e.hasChildren() || r.length > 0)
      ? C({}, uc)
      : {
          matched: !0,
          consumedSegments: [],
          remainingSegments: r,
          parameters: {},
          positionalParamSegments: {},
        };
  let i = (t.matcher || gC)(r, e, t);
  if (!i) return C({}, uc);
  let o = {};
  Object.entries(i.posParams ?? {}).forEach(([a, l]) => {
    o[a] = l.path;
  });
  let s =
    i.consumed.length > 0
      ? C(C({}, o), i.consumed[i.consumed.length - 1].parameters)
      : o;
  return {
    matched: !0,
    consumedSegments: i.consumed,
    remainingSegments: r.slice(i.consumed.length),
    parameters: s,
    positionalParamSegments: i.posParams ?? {},
  };
}
function wb(e) {
  return {
    matched: !0,
    parameters: e.length > 0 ? Nh(e).parameters : {},
    consumedSegments: e,
    remainingSegments: [],
    positionalParamSegments: {},
  };
}
function Ph(e, t, r, n) {
  return r.length > 0 && Db(e, r, n)
    ? {
        segmentGroup: new q(t, bb(n, new q(r, e.children))),
        slicedSegments: [],
      }
    : r.length === 0 && _b(e, r, n)
    ? {
        segmentGroup: new q(e.segments, Cb(e, r, n, e.children)),
        slicedSegments: r,
      }
    : { segmentGroup: new q(e.segments, e.children), slicedSegments: r };
}
function Cb(e, t, r, n) {
  let i = {};
  for (let o of r)
    if (is(e, t, o) && !n[dt(o)]) {
      let s = new q([], {});
      i[dt(o)] = s;
    }
  return C(C({}, n), i);
}
function bb(e, t) {
  let r = {};
  r[N] = t;
  for (let n of e)
    if (n.path === "" && dt(n) !== N) {
      let i = new q([], {});
      r[dt(n)] = i;
    }
  return r;
}
function Db(e, t, r) {
  return r.some((n) => is(e, t, n) && dt(n) !== N);
}
function _b(e, t, r) {
  return r.some((n) => is(e, t, n));
}
function is(e, t, r) {
  return (e.hasChildren() || t.length > 0) && r.pathMatch === "full"
    ? !1
    : r.path === "";
}
function Mb(e, t, r, n) {
  return dt(e) !== n && (n === N || !is(t, r, e)) ? !1 : Cc(t, e, r).matched;
}
function Eb(e, t, r) {
  return t.length === 0 && !e.children[r];
}
var dc = class {};
function xb(e, t, r, n, i, o, s = "emptyOnly") {
  return new fc(e, t, r, n, i, s, o).recognize();
}
var Ib = 31,
  fc = class {
    constructor(t, r, n, i, o, s, a) {
      (this.injector = t),
        (this.configLoader = r),
        (this.rootComponentType = n),
        (this.config = i),
        (this.urlTree = o),
        (this.paramsInheritanceStrategy = s),
        (this.urlSerializer = a),
        (this.applyRedirects = new cc(this.urlSerializer, this.urlTree)),
        (this.absoluteRedirectCount = 0),
        (this.allowRedirects = !0);
    }
    noMatchError(t) {
      return new M(4002, `'${t.segmentGroup}'`);
    }
    recognize() {
      let t = Ph(this.urlTree.root, [], [], this.config).segmentGroup;
      return this.match(t).pipe(
        A((r) => {
          let n = new Jr(
              [],
              Object.freeze({}),
              Object.freeze(C({}, this.urlTree.queryParams)),
              this.urlTree.fragment,
              {},
              N,
              this.rootComponentType,
              null,
              {}
            ),
            i = new Re(n, r),
            o = new es("", i),
            s = kC(n, [], this.urlTree.queryParams, this.urlTree.fragment);
          return (
            (s.queryParams = this.urlTree.queryParams),
            (o.url = this.urlSerializer.serialize(s)),
            this.inheritParamsAndData(o._root, null),
            { state: o, tree: s }
          );
        })
      );
    }
    match(t) {
      return this.processSegmentGroup(this.injector, this.config, t, N).pipe(
        xt((n) => {
          if (n instanceof ns)
            return (this.urlTree = n.urlTree), this.match(n.urlTree.root);
          throw n instanceof ei ? this.noMatchError(n) : n;
        })
      );
    }
    inheritParamsAndData(t, r) {
      let n = t.value,
        i = gc(n, r, this.paramsInheritanceStrategy);
      (n.params = Object.freeze(i.params)),
        (n.data = Object.freeze(i.data)),
        t.children.forEach((o) => this.inheritParamsAndData(o, n));
    }
    processSegmentGroup(t, r, n, i) {
      return n.segments.length === 0 && n.hasChildren()
        ? this.processChildren(t, r, n)
        : this.processSegment(t, r, n, n.segments, i, !0).pipe(
            A((o) => (o instanceof Re ? [o] : []))
          );
    }
    processChildren(t, r, n) {
      let i = [];
      for (let o of Object.keys(n.children))
        o === "primary" ? i.unshift(o) : i.push(o);
      return J(i).pipe(
        It((o) => {
          let s = n.children[o],
            a = ZC(r, o);
          return this.processSegmentGroup(t, a, s, o);
        }),
        Fs((o, s) => (o.push(...s), o)),
        St(null),
        ks(),
        le((o) => {
          if (o === null) return Qn(n);
          let s = tp(o);
          return Sb(s), S(s);
        })
      );
    }
    processSegment(t, r, n, i, o, s) {
      return J(r).pipe(
        It((a) =>
          this.processSegmentAgainstRoute(
            a._injector ?? t,
            r,
            a,
            n,
            i,
            o,
            s
          ).pipe(
            xt((l) => {
              if (l instanceof ei) return S(null);
              throw l;
            })
          )
        ),
        Xe((a) => !!a),
        xt((a) => {
          if (Xh(a)) return Eb(n, i, o) ? S(new dc()) : Qn(n);
          throw a;
        })
      );
    }
    processSegmentAgainstRoute(t, r, n, i, o, s, a) {
      return Mb(n, i, o, s)
        ? n.redirectTo === void 0
          ? this.matchSegmentAgainstRoute(t, i, n, o, s)
          : this.allowRedirects && a
          ? this.expandSegmentAgainstRouteUsingRedirect(t, i, r, n, o, s)
          : Qn(i)
        : Qn(i);
    }
    expandSegmentAgainstRouteUsingRedirect(t, r, n, i, o, s) {
      let {
        matched: a,
        consumedSegments: l,
        positionalParamSegments: c,
        remainingSegments: h,
      } = Cc(r, i, o);
      if (!a) return Qn(r);
      i.redirectTo.startsWith("/") &&
        (this.absoluteRedirectCount++,
        this.absoluteRedirectCount > Ib && (this.allowRedirects = !1));
      let p = this.applyRedirects.applyRedirectCommands(l, i.redirectTo, c);
      return this.applyRedirects
        .lineralizeSegments(i, p)
        .pipe(le((g) => this.processSegment(t, n, r, g.concat(h), s, !1)));
    }
    matchSegmentAgainstRoute(t, r, n, i, o) {
      let s = yb(r, n, i, t, this.urlSerializer);
      return (
        n.path === "**" && (r.children = {}),
        s.pipe(
          Ne((a) =>
            a.matched
              ? ((t = n._injector ?? t),
                this.getChildConfig(t, n, i).pipe(
                  Ne(({ routes: l }) => {
                    let c = n._loadedInjector ?? t,
                      {
                        consumedSegments: h,
                        remainingSegments: p,
                        parameters: g,
                      } = a,
                      m = new Jr(
                        h,
                        g,
                        Object.freeze(C({}, this.urlTree.queryParams)),
                        this.urlTree.fragment,
                        Tb(n),
                        dt(n),
                        n.component ?? n._loadedComponent ?? null,
                        n,
                        Pb(n)
                      ),
                      { segmentGroup: w, slicedSegments: O } = Ph(r, h, p, l);
                    if (O.length === 0 && w.hasChildren())
                      return this.processChildren(c, l, w).pipe(
                        A((D) => (D === null ? null : new Re(m, D)))
                      );
                    if (l.length === 0 && O.length === 0)
                      return S(new Re(m, []));
                    let _ = dt(n) === o;
                    return this.processSegment(c, l, w, O, _ ? N : o, !0).pipe(
                      A((D) => new Re(m, D instanceof Re ? [D] : []))
                    );
                  })
                ))
              : Qn(r)
          )
        )
      );
    }
    getChildConfig(t, r, n) {
      return r.children
        ? S({ routes: r.children, injector: t })
        : r.loadChildren
        ? r._loadedRoutes !== void 0
          ? S({ routes: r._loadedRoutes, injector: r._loadedInjector })
          : pb(t, r, n, this.urlSerializer).pipe(
              le((i) =>
                i
                  ? this.configLoader.loadChildren(t, r).pipe(
                      ue((o) => {
                        (r._loadedRoutes = o.routes),
                          (r._loadedInjector = o.injector);
                      })
                    )
                  : vb(r)
              )
            )
        : S({ routes: [], injector: t });
    }
  };
function Sb(e) {
  e.sort((t, r) =>
    t.value.outlet === N
      ? -1
      : r.value.outlet === N
      ? 1
      : t.value.outlet.localeCompare(r.value.outlet)
  );
}
function Ob(e) {
  let t = e.value.routeConfig;
  return t && t.path === "";
}
function tp(e) {
  let t = [],
    r = new Set();
  for (let n of e) {
    if (!Ob(n)) {
      t.push(n);
      continue;
    }
    let i = t.find((o) => n.value.routeConfig === o.value.routeConfig);
    i !== void 0 ? (i.children.push(...n.children), r.add(i)) : t.push(n);
  }
  for (let n of r) {
    let i = tp(n.children);
    t.push(new Re(n.value, i));
  }
  return t.filter((n) => !r.has(n));
}
function Tb(e) {
  return e.data || {};
}
function Pb(e) {
  return e.resolve || {};
}
function Ab(e, t, r, n, i, o) {
  return le((s) =>
    xb(e, t, r, n, s.extractedUrl, i, o).pipe(
      A(({ state: a, tree: l }) =>
        K(C({}, s), { targetSnapshot: a, urlAfterRedirects: l })
      )
    )
  );
}
function Nb(e, t) {
  return le((r) => {
    let {
      targetSnapshot: n,
      guards: { canActivateChecks: i },
    } = r;
    if (!i.length) return S(r);
    let o = new Set(i.map((l) => l.route)),
      s = new Set();
    for (let l of o) if (!s.has(l)) for (let c of np(l)) s.add(c);
    let a = 0;
    return J(s).pipe(
      It((l) =>
        o.has(l)
          ? kb(l, n, e, t)
          : ((l.data = gc(l, l.parent, e).resolve), S(void 0))
      ),
      ue(() => a++),
      Mn(1),
      le((l) => (a === s.size ? S(r) : Pe))
    );
  });
}
function np(e) {
  let t = e.children.map((r) => np(r)).flat();
  return [e, ...t];
}
function kb(e, t, r, n) {
  let i = e.routeConfig,
    o = e._resolve;
  return (
    i?.title !== void 0 && !Zh(i) && (o[ti] = i.title),
    Fb(o, e, t, n).pipe(
      A(
        (s) => (
          (e._resolvedData = s), (e.data = gc(e, e.parent, r).resolve), null
        )
      )
    )
  );
}
function Fb(e, t, r, n) {
  let i = Bl(e);
  if (i.length === 0) return S({});
  let o = {};
  return J(i).pipe(
    le((s) =>
      Rb(e[s], t, r, n).pipe(
        Xe(),
        ue((a) => {
          o[s] = a;
        })
      )
    ),
    Mn(1),
    Ns(o),
    xt((s) => (Xh(s) ? Pe : Dn(s)))
  );
}
function Rb(e, t, r, n) {
  let i = ni(t) ?? n,
    o = or(e, i),
    s = o.resolve ? o.resolve(t, r) : mt(i, () => o(t, r));
  return $t(s);
}
function zl(e) {
  return Ne((t) => {
    let r = e(t);
    return r ? J(r).pipe(A(() => t)) : S(t);
  });
}
var rp = (() => {
    let t = class t {
      buildTitle(n) {
        let i,
          o = n.root;
        for (; o !== void 0; )
          (i = this.getResolvedTitleForRoute(o) ?? i),
            (o = o.children.find((s) => s.outlet === N));
        return i;
      }
      getResolvedTitleForRoute(n) {
        return n.data[ti];
      }
    };
    (t.ɵfac = function (i) {
      return new (i || t)();
    }),
      (t.ɵprov = E({ token: t, factory: () => v(Lb), providedIn: "root" }));
    let e = t;
    return e;
  })(),
  Lb = (() => {
    let t = class t extends rp {
      constructor(n) {
        super(), (this.title = n);
      }
      updateTitle(n) {
        let i = this.buildTitle(n);
        i !== void 0 && this.title.setTitle(i);
      }
    };
    (t.ɵfac = function (i) {
      return new (i || t)(P(xh));
    }),
      (t.ɵprov = E({ token: t, factory: t.ɵfac, providedIn: "root" }));
    let e = t;
    return e;
  })(),
  bc = new x("", { providedIn: "root", factory: () => ({}) }),
  Dc = new x(""),
  Vb = (() => {
    let t = class t {
      constructor() {
        (this.componentLoaders = new WeakMap()),
          (this.childrenLoaders = new WeakMap()),
          (this.compiler = v(bl));
      }
      loadComponent(n) {
        if (this.componentLoaders.get(n)) return this.componentLoaders.get(n);
        if (n._loadedComponent) return S(n._loadedComponent);
        this.onLoadStartListener && this.onLoadStartListener(n);
        let i = $t(n.loadComponent()).pipe(
            A(ip),
            ue((s) => {
              this.onLoadEndListener && this.onLoadEndListener(n),
                (n._loadedComponent = s);
            }),
            qt(() => {
              this.componentLoaders.delete(n);
            })
          ),
          o = new bn(i, () => new ne()).pipe(Cn());
        return this.componentLoaders.set(n, o), o;
      }
      loadChildren(n, i) {
        if (this.childrenLoaders.get(i)) return this.childrenLoaders.get(i);
        if (i._loadedRoutes)
          return S({ routes: i._loadedRoutes, injector: i._loadedInjector });
        this.onLoadStartListener && this.onLoadStartListener(i);
        let s = jb(i, this.compiler, n, this.onLoadEndListener).pipe(
            qt(() => {
              this.childrenLoaders.delete(i);
            })
          ),
          a = new bn(s, () => new ne()).pipe(Cn());
        return this.childrenLoaders.set(i, a), a;
      }
    };
    (t.ɵfac = function (i) {
      return new (i || t)();
    }),
      (t.ɵprov = E({ token: t, factory: t.ɵfac, providedIn: "root" }));
    let e = t;
    return e;
  })();
function jb(e, t, r, n) {
  return $t(e.loadChildren()).pipe(
    A(ip),
    le((i) =>
      i instanceof Ir || Array.isArray(i) ? S(i) : J(t.compileModuleAsync(i))
    ),
    A((i) => {
      n && n(e);
      let o,
        s,
        a = !1;
      return (
        Array.isArray(i)
          ? ((s = i), (a = !0))
          : ((o = i.create(r).injector),
            (s = o.get(Dc, [], { optional: !0, self: !0 }).flat())),
        { routes: s.map(wc), injector: o }
      );
    })
  );
}
function zb(e) {
  return e && typeof e == "object" && "default" in e;
}
function ip(e) {
  return zb(e) ? e.default : e;
}
var _c = (() => {
    let t = class t {};
    (t.ɵfac = function (i) {
      return new (i || t)();
    }),
      (t.ɵprov = E({ token: t, factory: () => v(Ub), providedIn: "root" }));
    let e = t;
    return e;
  })(),
  Ub = (() => {
    let t = class t {
      shouldProcessUrl(n) {
        return !0;
      }
      extract(n) {
        return n;
      }
      merge(n, i) {
        return n;
      }
    };
    (t.ɵfac = function (i) {
      return new (i || t)();
    }),
      (t.ɵprov = E({ token: t, factory: t.ɵfac, providedIn: "root" }));
    let e = t;
    return e;
  })(),
  Bb = new x("");
var $b = (() => {
  let t = class t {
    get hasRequestedNavigation() {
      return this.navigationId !== 0;
    }
    constructor() {
      (this.currentNavigation = null),
        (this.currentTransition = null),
        (this.lastSuccessfulNavigation = null),
        (this.events = new ne()),
        (this.transitionAbortSubject = new ne()),
        (this.configLoader = v(Vb)),
        (this.environmentInjector = v(Ee)),
        (this.urlSerializer = v(pc)),
        (this.rootContexts = v(rs)),
        (this.location = v(kr)),
        (this.inputBindingEnabled = v(yc, { optional: !0 }) !== null),
        (this.titleStrategy = v(rp)),
        (this.options = v(bc, { optional: !0 }) || {}),
        (this.paramsInheritanceStrategy =
          this.options.paramsInheritanceStrategy || "emptyOnly"),
        (this.urlHandlingStrategy = v(_c)),
        (this.createViewTransition = v(Bb, { optional: !0 })),
        (this.navigationId = 0),
        (this.afterPreactivation = () => S(void 0)),
        (this.rootComponentType = null);
      let n = (o) => this.events.next(new Ql(o)),
        i = (o) => this.events.next(new Jl(o));
      (this.configLoader.onLoadEndListener = i),
        (this.configLoader.onLoadStartListener = n);
    }
    complete() {
      this.transitions?.complete();
    }
    handleNavigationRequest(n) {
      let i = ++this.navigationId;
      this.transitions?.next(K(C(C({}, this.transitions.value), n), { id: i }));
    }
    setupNavigations(n, i, o) {
      return (
        (this.transitions = new he({
          id: 0,
          currentUrlTree: i,
          currentRawUrl: i,
          extractedUrl: this.urlHandlingStrategy.extract(i),
          urlAfterRedirects: this.urlHandlingStrategy.extract(i),
          rawUrl: i,
          extras: {},
          resolve: null,
          reject: null,
          promise: Promise.resolve(!0),
          source: Gr,
          restoredState: null,
          currentSnapshot: o.snapshot,
          targetSnapshot: null,
          currentRouterState: o,
          targetRouterState: null,
          guards: { canActivateChecks: [], canDeactivateChecks: [] },
          guardsResult: null,
        })),
        this.transitions.pipe(
          Ae((s) => s.id !== 0),
          A((s) =>
            K(C({}, s), {
              extractedUrl: this.urlHandlingStrategy.extract(s.rawUrl),
            })
          ),
          Ne((s) => {
            let a = !1,
              l = !1;
            return S(s).pipe(
              Ne((c) => {
                if (this.navigationId > s.id)
                  return (
                    this.cancelNavigationTransition(
                      s,
                      "",
                      Le.SupersededByNewNavigation
                    ),
                    Pe
                  );
                (this.currentTransition = s),
                  (this.currentNavigation = {
                    id: c.id,
                    initialUrl: c.rawUrl,
                    extractedUrl: c.extractedUrl,
                    trigger: c.source,
                    extras: c.extras,
                    previousNavigation: this.lastSuccessfulNavigation
                      ? K(C({}, this.lastSuccessfulNavigation), {
                          previousNavigation: null,
                        })
                      : null,
                  });
                let h =
                    !n.navigated ||
                    this.isUpdatingInternalState() ||
                    this.isUpdatedBrowserUrl(),
                  p = c.extras.onSameUrlNavigation ?? n.onSameUrlNavigation;
                if (!h && p !== "reload") {
                  let g = "";
                  return (
                    this.events.next(
                      new pn(
                        c.id,
                        this.urlSerializer.serialize(c.rawUrl),
                        g,
                        Wl.IgnoredSameUrlNavigation
                      )
                    ),
                    c.resolve(null),
                    Pe
                  );
                }
                if (this.urlHandlingStrategy.shouldProcessUrl(c.rawUrl))
                  return S(c).pipe(
                    Ne((g) => {
                      let m = this.transitions?.getValue();
                      return (
                        this.events.next(
                          new Zr(
                            g.id,
                            this.urlSerializer.serialize(g.extractedUrl),
                            g.source,
                            g.restoredState
                          )
                        ),
                        m !== this.transitions?.getValue()
                          ? Pe
                          : Promise.resolve(g)
                      );
                    }),
                    Ab(
                      this.environmentInjector,
                      this.configLoader,
                      this.rootComponentType,
                      n.config,
                      this.urlSerializer,
                      this.paramsInheritanceStrategy
                    ),
                    ue((g) => {
                      (s.targetSnapshot = g.targetSnapshot),
                        (s.urlAfterRedirects = g.urlAfterRedirects),
                        (this.currentNavigation = K(
                          C({}, this.currentNavigation),
                          { finalUrl: g.urlAfterRedirects }
                        ));
                      let m = new Qo(
                        g.id,
                        this.urlSerializer.serialize(g.extractedUrl),
                        this.urlSerializer.serialize(g.urlAfterRedirects),
                        g.targetSnapshot
                      );
                      this.events.next(m);
                    })
                  );
                if (
                  h &&
                  this.urlHandlingStrategy.shouldProcessUrl(c.currentRawUrl)
                ) {
                  let {
                      id: g,
                      extractedUrl: m,
                      source: w,
                      restoredState: O,
                      extras: _,
                    } = c,
                    D = new Zr(g, this.urlSerializer.serialize(m), w, O);
                  this.events.next(D);
                  let me = Wh(this.rootComponentType).snapshot;
                  return (
                    (this.currentTransition = s =
                      K(C({}, c), {
                        targetSnapshot: me,
                        urlAfterRedirects: m,
                        extras: K(C({}, _), {
                          skipLocationChange: !1,
                          replaceUrl: !1,
                        }),
                      })),
                    (this.currentNavigation.finalUrl = m),
                    S(s)
                  );
                } else {
                  let g = "";
                  return (
                    this.events.next(
                      new pn(
                        c.id,
                        this.urlSerializer.serialize(c.extractedUrl),
                        g,
                        Wl.IgnoredByUrlHandlingStrategy
                      )
                    ),
                    c.resolve(null),
                    Pe
                  );
                }
              }),
              ue((c) => {
                let h = new ql(
                  c.id,
                  this.urlSerializer.serialize(c.extractedUrl),
                  this.urlSerializer.serialize(c.urlAfterRedirects),
                  c.targetSnapshot
                );
                this.events.next(h);
              }),
              A(
                (c) => (
                  (this.currentTransition = s =
                    K(C({}, c), {
                      guards: YC(
                        c.targetSnapshot,
                        c.currentSnapshot,
                        this.rootContexts
                      ),
                    })),
                  s
                )
              ),
              sb(this.environmentInjector, (c) => this.events.next(c)),
              ue((c) => {
                if (((s.guardsResult = c.guardsResult), nr(c.guardsResult)))
                  throw Yh(this.urlSerializer, c.guardsResult);
                let h = new Zl(
                  c.id,
                  this.urlSerializer.serialize(c.extractedUrl),
                  this.urlSerializer.serialize(c.urlAfterRedirects),
                  c.targetSnapshot,
                  !!c.guardsResult
                );
                this.events.next(h);
              }),
              Ae((c) =>
                c.guardsResult
                  ? !0
                  : (this.cancelNavigationTransition(c, "", Le.GuardRejected),
                    !1)
              ),
              zl((c) => {
                if (c.guards.canActivateChecks.length)
                  return S(c).pipe(
                    ue((h) => {
                      let p = new Kl(
                        h.id,
                        this.urlSerializer.serialize(h.extractedUrl),
                        this.urlSerializer.serialize(h.urlAfterRedirects),
                        h.targetSnapshot
                      );
                      this.events.next(p);
                    }),
                    Ne((h) => {
                      let p = !1;
                      return S(h).pipe(
                        Nb(
                          this.paramsInheritanceStrategy,
                          this.environmentInjector
                        ),
                        ue({
                          next: () => (p = !0),
                          complete: () => {
                            p ||
                              this.cancelNavigationTransition(
                                h,
                                "",
                                Le.NoDataFromResolver
                              );
                          },
                        })
                      );
                    }),
                    ue((h) => {
                      let p = new Yl(
                        h.id,
                        this.urlSerializer.serialize(h.extractedUrl),
                        this.urlSerializer.serialize(h.urlAfterRedirects),
                        h.targetSnapshot
                      );
                      this.events.next(p);
                    })
                  );
              }),
              zl((c) => {
                let h = (p) => {
                  let g = [];
                  p.routeConfig?.loadComponent &&
                    !p.routeConfig._loadedComponent &&
                    g.push(
                      this.configLoader.loadComponent(p.routeConfig).pipe(
                        ue((m) => {
                          p.component = m;
                        }),
                        A(() => {})
                      )
                    );
                  for (let m of p.children) g.push(...h(m));
                  return g;
                };
                return Ti(h(c.targetSnapshot.root)).pipe(St(null), ht(1));
              }),
              zl(() => this.afterPreactivation()),
              Ne(() => {
                let { currentSnapshot: c, targetSnapshot: h } = s,
                  p = this.createViewTransition?.(
                    this.environmentInjector,
                    c.root,
                    h.root
                  );
                return p ? J(p).pipe(A(() => s)) : S(s);
              }),
              A((c) => {
                let h = BC(
                  n.routeReuseStrategy,
                  c.targetSnapshot,
                  c.currentRouterState
                );
                return (
                  (this.currentTransition = s =
                    K(C({}, c), { targetRouterState: h })),
                  (this.currentNavigation.targetRouterState = h),
                  s
                );
              }),
              ue(() => {
                this.events.next(new Yr());
              }),
              KC(
                this.rootContexts,
                n.routeReuseStrategy,
                (c) => this.events.next(c),
                this.inputBindingEnabled
              ),
              ht(1),
              ue({
                next: (c) => {
                  (a = !0),
                    (this.lastSuccessfulNavigation = this.currentNavigation),
                    this.events.next(
                      new hn(
                        c.id,
                        this.urlSerializer.serialize(c.extractedUrl),
                        this.urlSerializer.serialize(c.urlAfterRedirects)
                      )
                    ),
                    this.titleStrategy?.updateTitle(
                      c.targetRouterState.snapshot
                    ),
                    c.resolve(!0);
                },
                complete: () => {
                  a = !0;
                },
              }),
              Ls(
                this.transitionAbortSubject.pipe(
                  ue((c) => {
                    throw c;
                  })
                )
              ),
              qt(() => {
                !a &&
                  !l &&
                  this.cancelNavigationTransition(
                    s,
                    "",
                    Le.SupersededByNewNavigation
                  ),
                  this.currentTransition?.id === s.id &&
                    ((this.currentNavigation = null),
                    (this.currentTransition = null));
              }),
              xt((c) => {
                if (((l = !0), Jh(c)))
                  this.events.next(
                    new Bt(
                      s.id,
                      this.urlSerializer.serialize(s.extractedUrl),
                      c.message,
                      c.cancellationCode
                    )
                  ),
                    GC(c) ? this.events.next(new Qr(c.url)) : s.resolve(!1);
                else {
                  this.events.next(
                    new Kr(
                      s.id,
                      this.urlSerializer.serialize(s.extractedUrl),
                      c,
                      s.targetSnapshot ?? void 0
                    )
                  );
                  try {
                    s.resolve(n.errorHandler(c));
                  } catch (h) {
                    this.options.resolveNavigationPromiseOnError
                      ? s.resolve(!1)
                      : s.reject(h);
                  }
                }
                return Pe;
              })
            );
          })
        )
      );
    }
    cancelNavigationTransition(n, i, o) {
      let s = new Bt(n.id, this.urlSerializer.serialize(n.extractedUrl), i, o);
      this.events.next(s), n.resolve(!1);
    }
    isUpdatingInternalState() {
      return (
        this.currentTransition?.extractedUrl.toString() !==
        this.currentTransition?.currentUrlTree.toString()
      );
    }
    isUpdatedBrowserUrl() {
      return (
        this.urlHandlingStrategy
          .extract(this.urlSerializer.parse(this.location.path(!0)))
          .toString() !== this.currentTransition?.extractedUrl.toString() &&
        !this.currentTransition?.extras.skipLocationChange
      );
    }
  };
  (t.ɵfac = function (i) {
    return new (i || t)();
  }),
    (t.ɵprov = E({ token: t, factory: t.ɵfac, providedIn: "root" }));
  let e = t;
  return e;
})();
function Hb(e) {
  return e !== Gr;
}
var Gb = (() => {
    let t = class t {};
    (t.ɵfac = function (i) {
      return new (i || t)();
    }),
      (t.ɵprov = E({ token: t, factory: () => v(Wb), providedIn: "root" }));
    let e = t;
    return e;
  })(),
  hc = class {
    shouldDetach(t) {
      return !1;
    }
    store(t, r) {}
    shouldAttach(t) {
      return !1;
    }
    retrieve(t) {
      return null;
    }
    shouldReuseRoute(t, r) {
      return t.routeConfig === r.routeConfig;
    }
  },
  Wb = (() => {
    let t = class t extends hc {};
    (t.ɵfac = (() => {
      let n;
      return function (o) {
        return (n || (n = ot(t)))(o || t);
      };
    })()),
      (t.ɵprov = E({ token: t, factory: t.ɵfac, providedIn: "root" }));
    let e = t;
    return e;
  })(),
  op = (() => {
    let t = class t {};
    (t.ɵfac = function (i) {
      return new (i || t)();
    }),
      (t.ɵprov = E({ token: t, factory: () => v(qb), providedIn: "root" }));
    let e = t;
    return e;
  })(),
  qb = (() => {
    let t = class t extends op {
      constructor() {
        super(...arguments),
          (this.location = v(kr)),
          (this.urlSerializer = v(pc)),
          (this.options = v(bc, { optional: !0 }) || {}),
          (this.canceledNavigationResolution =
            this.options.canceledNavigationResolution || "replace"),
          (this.urlHandlingStrategy = v(_c)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || "deferred"),
          (this.currentUrlTree = new Ut()),
          (this.rawUrlTree = this.currentUrlTree),
          (this.currentPageId = 0),
          (this.lastSuccessfulId = -1),
          (this.routerState = Wh(null)),
          (this.stateMemento = this.createStateMemento());
      }
      getCurrentUrlTree() {
        return this.currentUrlTree;
      }
      getRawUrlTree() {
        return this.rawUrlTree;
      }
      restoredState() {
        return this.location.getState();
      }
      get browserPageId() {
        return this.canceledNavigationResolution !== "computed"
          ? this.currentPageId
          : this.restoredState()?.ɵrouterPageId ?? this.currentPageId;
      }
      getRouterState() {
        return this.routerState;
      }
      createStateMemento() {
        return {
          rawUrlTree: this.rawUrlTree,
          currentUrlTree: this.currentUrlTree,
          routerState: this.routerState,
        };
      }
      registerNonRouterCurrentEntryChangeListener(n) {
        return this.location.subscribe((i) => {
          i.type === "popstate" && n(i.url, i.state);
        });
      }
      handleRouterEvent(n, i) {
        if (n instanceof Zr) this.stateMemento = this.createStateMemento();
        else if (n instanceof pn) this.rawUrlTree = i.initialUrl;
        else if (n instanceof Qo) {
          if (
            this.urlUpdateStrategy === "eager" &&
            !i.extras.skipLocationChange
          ) {
            let o = this.urlHandlingStrategy.merge(i.finalUrl, i.initialUrl);
            this.setBrowserUrl(o, i);
          }
        } else
          n instanceof Yr
            ? ((this.currentUrlTree = i.finalUrl),
              (this.rawUrlTree = this.urlHandlingStrategy.merge(
                i.finalUrl,
                i.initialUrl
              )),
              (this.routerState = i.targetRouterState),
              this.urlUpdateStrategy === "deferred" &&
                (i.extras.skipLocationChange ||
                  this.setBrowserUrl(this.rawUrlTree, i)))
            : n instanceof Bt &&
              (n.code === Le.GuardRejected || n.code === Le.NoDataFromResolver)
            ? this.restoreHistory(i)
            : n instanceof Kr
            ? this.restoreHistory(i, !0)
            : n instanceof hn &&
              ((this.lastSuccessfulId = n.id),
              (this.currentPageId = this.browserPageId));
      }
      setBrowserUrl(n, i) {
        let o = this.urlSerializer.serialize(n);
        if (this.location.isCurrentPathEqualTo(o) || i.extras.replaceUrl) {
          let s = this.browserPageId,
            a = C(C({}, i.extras.state), this.generateNgRouterState(i.id, s));
          this.location.replaceState(o, "", a);
        } else {
          let s = C(
            C({}, i.extras.state),
            this.generateNgRouterState(i.id, this.browserPageId + 1)
          );
          this.location.go(o, "", s);
        }
      }
      restoreHistory(n, i = !1) {
        if (this.canceledNavigationResolution === "computed") {
          let o = this.browserPageId,
            s = this.currentPageId - o;
          s !== 0
            ? this.location.historyGo(s)
            : this.currentUrlTree === n.finalUrl &&
              s === 0 &&
              (this.resetState(n), this.resetUrlToCurrentUrlTree());
        } else
          this.canceledNavigationResolution === "replace" &&
            (i && this.resetState(n), this.resetUrlToCurrentUrlTree());
      }
      resetState(n) {
        (this.routerState = this.stateMemento.routerState),
          (this.currentUrlTree = this.stateMemento.currentUrlTree),
          (this.rawUrlTree = this.urlHandlingStrategy.merge(
            this.currentUrlTree,
            n.finalUrl ?? this.rawUrlTree
          ));
      }
      resetUrlToCurrentUrlTree() {
        this.location.replaceState(
          this.urlSerializer.serialize(this.rawUrlTree),
          "",
          this.generateNgRouterState(this.lastSuccessfulId, this.currentPageId)
        );
      }
      generateNgRouterState(n, i) {
        return this.canceledNavigationResolution === "computed"
          ? { navigationId: n, ɵrouterPageId: i }
          : { navigationId: n };
      }
    };
    (t.ɵfac = (() => {
      let n;
      return function (o) {
        return (n || (n = ot(t)))(o || t);
      };
    })()),
      (t.ɵprov = E({ token: t, factory: t.ɵfac, providedIn: "root" }));
    let e = t;
    return e;
  })(),
  $r = (function (e) {
    return (
      (e[(e.COMPLETE = 0)] = "COMPLETE"),
      (e[(e.FAILED = 1)] = "FAILED"),
      (e[(e.REDIRECTING = 2)] = "REDIRECTING"),
      e
    );
  })($r || {});
function Zb(e, t) {
  e.events
    .pipe(
      Ae(
        (r) =>
          r instanceof hn ||
          r instanceof Bt ||
          r instanceof Kr ||
          r instanceof pn
      ),
      A((r) =>
        r instanceof hn || r instanceof pn
          ? $r.COMPLETE
          : (
              r instanceof Bt
                ? r.code === Le.Redirect ||
                  r.code === Le.SupersededByNewNavigation
                : !1
            )
          ? $r.REDIRECTING
          : $r.FAILED
      ),
      Ae((r) => r !== $r.REDIRECTING),
      ht(1)
    )
    .subscribe(() => {
      t();
    });
}
function Kb(e) {
  throw e;
}
var Yb = {
    paths: "exact",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "exact",
  },
  Qb = {
    paths: "subset",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "subset",
  },
  os = (() => {
    let t = class t {
      get currentUrlTree() {
        return this.stateManager.getCurrentUrlTree();
      }
      get rawUrlTree() {
        return this.stateManager.getRawUrlTree();
      }
      get events() {
        return this._events;
      }
      get routerState() {
        return this.stateManager.getRouterState();
      }
      constructor() {
        (this.disposed = !1),
          (this.isNgZoneEnabled = !1),
          (this.console = v(So)),
          (this.stateManager = v(op)),
          (this.options = v(bc, { optional: !0 }) || {}),
          (this.pendingTasks = v(Hn)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || "deferred"),
          (this.navigationTransitions = v($b)),
          (this.urlSerializer = v(pc)),
          (this.location = v(kr)),
          (this.urlHandlingStrategy = v(_c)),
          (this._events = new ne()),
          (this.errorHandler = this.options.errorHandler || Kb),
          (this.navigated = !1),
          (this.routeReuseStrategy = v(Gb)),
          (this.onSameUrlNavigation =
            this.options.onSameUrlNavigation || "ignore"),
          (this.config = v(Dc, { optional: !0 })?.flat() ?? []),
          (this.componentInputBindingEnabled = !!v(yc, { optional: !0 })),
          (this.eventsSubscription = new ae()),
          (this.isNgZoneEnabled = v(ee) instanceof ee && ee.isInAngularZone()),
          this.resetConfig(this.config),
          this.navigationTransitions
            .setupNavigations(this, this.currentUrlTree, this.routerState)
            .subscribe({
              error: (n) => {
                this.console.warn(n);
              },
            }),
          this.subscribeToNavigationEvents();
      }
      subscribeToNavigationEvents() {
        let n = this.navigationTransitions.events.subscribe((i) => {
          try {
            let o = this.navigationTransitions.currentTransition,
              s = this.navigationTransitions.currentNavigation;
            if (o !== null && s !== null) {
              if (
                (this.stateManager.handleRouterEvent(i, s),
                i instanceof Bt &&
                  i.code !== Le.Redirect &&
                  i.code !== Le.SupersededByNewNavigation)
              )
                this.navigated = !0;
              else if (i instanceof hn) this.navigated = !0;
              else if (i instanceof Qr) {
                let a = this.urlHandlingStrategy.merge(i.url, o.currentRawUrl),
                  l = {
                    info: o.extras.info,
                    skipLocationChange: o.extras.skipLocationChange,
                    replaceUrl:
                      this.urlUpdateStrategy === "eager" || Hb(o.source),
                  };
                this.scheduleNavigation(a, Gr, null, l, {
                  resolve: o.resolve,
                  reject: o.reject,
                  promise: o.promise,
                });
              }
            }
            Xb(i) && this._events.next(i);
          } catch (o) {
            this.navigationTransitions.transitionAbortSubject.next(o);
          }
        });
        this.eventsSubscription.add(n);
      }
      resetRootComponentType(n) {
        (this.routerState.root.component = n),
          (this.navigationTransitions.rootComponentType = n);
      }
      initialNavigation() {
        this.setUpLocationChangeListener(),
          this.navigationTransitions.hasRequestedNavigation ||
            this.navigateToSyncWithBrowser(
              this.location.path(!0),
              Gr,
              this.stateManager.restoredState()
            );
      }
      setUpLocationChangeListener() {
        this.nonRouterCurrentEntryChangeSubscription ??=
          this.stateManager.registerNonRouterCurrentEntryChangeListener(
            (n, i) => {
              setTimeout(() => {
                this.navigateToSyncWithBrowser(n, "popstate", i);
              }, 0);
            }
          );
      }
      navigateToSyncWithBrowser(n, i, o) {
        let s = { replaceUrl: !0 },
          a = o?.navigationId ? o : null;
        if (o) {
          let c = C({}, o);
          delete c.navigationId,
            delete c.ɵrouterPageId,
            Object.keys(c).length !== 0 && (s.state = c);
        }
        let l = this.parseUrl(n);
        this.scheduleNavigation(l, i, a, s);
      }
      get url() {
        return this.serializeUrl(this.currentUrlTree);
      }
      getCurrentNavigation() {
        return this.navigationTransitions.currentNavigation;
      }
      get lastSuccessfulNavigation() {
        return this.navigationTransitions.lastSuccessfulNavigation;
      }
      resetConfig(n) {
        (this.config = n.map(wc)), (this.navigated = !1);
      }
      ngOnDestroy() {
        this.dispose();
      }
      dispose() {
        this.navigationTransitions.complete(),
          this.nonRouterCurrentEntryChangeSubscription &&
            (this.nonRouterCurrentEntryChangeSubscription.unsubscribe(),
            (this.nonRouterCurrentEntryChangeSubscription = void 0)),
          (this.disposed = !0),
          this.eventsSubscription.unsubscribe();
      }
      createUrlTree(n, i = {}) {
        let {
            relativeTo: o,
            queryParams: s,
            fragment: a,
            queryParamsHandling: l,
            preserveFragment: c,
          } = i,
          h = c ? this.currentUrlTree.fragment : a,
          p = null;
        switch (l) {
          case "merge":
            p = C(C({}, this.currentUrlTree.queryParams), s);
            break;
          case "preserve":
            p = this.currentUrlTree.queryParams;
            break;
          default:
            p = s || null;
        }
        p !== null && (p = this.removeEmptyProps(p));
        let g;
        try {
          let m = o ? o.snapshot : this.routerState.snapshot.root;
          g = Bh(m);
        } catch {
          (typeof n[0] != "string" || !n[0].startsWith("/")) && (n = []),
            (g = this.currentUrlTree.root);
        }
        return $h(g, n, p, h ?? null);
      }
      navigateByUrl(n, i = { skipLocationChange: !1 }) {
        let o = nr(n) ? n : this.parseUrl(n),
          s = this.urlHandlingStrategy.merge(o, this.rawUrlTree);
        return this.scheduleNavigation(s, Gr, null, i);
      }
      navigate(n, i = { skipLocationChange: !1 }) {
        return Jb(n), this.navigateByUrl(this.createUrlTree(n, i), i);
      }
      serializeUrl(n) {
        return this.urlSerializer.serialize(n);
      }
      parseUrl(n) {
        try {
          return this.urlSerializer.parse(n);
        } catch {
          return this.urlSerializer.parse("/");
        }
      }
      isActive(n, i) {
        let o;
        if (
          (i === !0 ? (o = C({}, Yb)) : i === !1 ? (o = C({}, Qb)) : (o = i),
          nr(n))
        )
          return Ih(this.currentUrlTree, n, o);
        let s = this.parseUrl(n);
        return Ih(this.currentUrlTree, s, o);
      }
      removeEmptyProps(n) {
        return Object.entries(n).reduce(
          (i, [o, s]) => (s != null && (i[o] = s), i),
          {}
        );
      }
      scheduleNavigation(n, i, o, s, a) {
        if (this.disposed) return Promise.resolve(!1);
        let l, c, h;
        a
          ? ((l = a.resolve), (c = a.reject), (h = a.promise))
          : (h = new Promise((g, m) => {
              (l = g), (c = m);
            }));
        let p = this.pendingTasks.add();
        return (
          Zb(this, () => {
            queueMicrotask(() => this.pendingTasks.remove(p));
          }),
          this.navigationTransitions.handleNavigationRequest({
            source: i,
            restoredState: o,
            currentUrlTree: this.currentUrlTree,
            currentRawUrl: this.currentUrlTree,
            rawUrl: n,
            extras: s,
            resolve: l,
            reject: c,
            promise: h,
            currentSnapshot: this.routerState.snapshot,
            currentRouterState: this.routerState,
          }),
          h.catch((g) => Promise.reject(g))
        );
      }
    };
    (t.ɵfac = function (i) {
      return new (i || t)();
    }),
      (t.ɵprov = E({ token: t, factory: t.ɵfac, providedIn: "root" }));
    let e = t;
    return e;
  })();
function Jb(e) {
  for (let t = 0; t < e.length; t++) if (e[t] == null) throw new M(4008, !1);
}
function Xb(e) {
  return !(e instanceof Yr) && !(e instanceof Qr);
}
var eD = new x("");
function sp(e, ...t) {
  return zn([
    { provide: Dc, multi: !0, useValue: e },
    [],
    { provide: rr, useFactory: tD, deps: [os] },
    { provide: Oo, multi: !0, useFactory: nD },
    t.map((r) => r.ɵproviders),
  ]);
}
function tD(e) {
  return e.routerState.root;
}
function nD() {
  let e = v($n);
  return (t) => {
    let r = e.get(qn);
    if (t !== r.components[0]) return;
    let n = e.get(os),
      i = e.get(rD);
    e.get(iD) === 1 && n.initialNavigation(),
      e.get(oD, null, L.Optional)?.setUpPreloading(),
      e.get(eD, null, L.Optional)?.init(),
      n.resetRootComponentType(r.componentTypes[0]),
      i.closed || (i.next(), i.complete(), i.unsubscribe());
  };
}
var rD = new x("", { factory: () => new ne() }),
  iD = new x("", { providedIn: "root", factory: () => 1 });
var oD = new x("");
var de = (() => {
  let t = class t {
    constructor() {
      (this.stateOfTranslation$ = new ne()),
        (this.translated = !1),
        this.stateOfTranslation$.subscribe((n) => {
          (this.translated = !this.translated), console.log(this.translated);
        });
    }
  };
  (t.ɵfac = function (i) {
    return new (i || t)();
  }),
    (t.ɵprov = E({ token: t, factory: t.ɵfac, providedIn: "root" }));
  let e = t;
  return e;
})();
function sD(e, t) {
  e & 1 && (f(0, "a", 2)(1, "button", 9), d(2, "Nachricht senden"), u()());
}
function aD(e, t) {
  e & 1 && (f(0, "a", 2)(1, "button", 9), d(2, "Let's talk"), u()());
}
var ap = (() => {
  let t = class t {
    constructor() {
      this.translateService = v(de);
    }
  };
  (t.ɵfac = function (i) {
    return new (i || t)();
  }),
    (t.ɵcmp = G({
      type: t,
      selectors: [["app-aot"]],
      standalone: !0,
      features: [W],
      decls: 22,
      vars: 1,
      consts: [
        [1, "container"],
        [1, "headline"],
        ["data-aos", "fade-up", "data-aos-duration", "700", "href", "#contact"],
        [1, "scroll-down"],
        [1, "email-link"],
        ["href", "mailto:mail@marcus-loosen.de"],
        [1, "scroll-arrow"],
        ["src", "assets/icons/arrow_down.png", "alt", ""],
        ["href", "#aboutMe"],
        [1, "btn"],
      ],
      template: function (i, o) {
        i & 1 &&
          (f(0, "section")(1, "div", 0)(2, "div", 1)(3, "h1"),
          d(4, "Frontend"),
          b(5, "br"),
          d(6, "Developer"),
          u(),
          f(7, "h2"),
          d(8, "Marcus Loosen"),
          u()(),
          k(9, sD, 3, 0, "a", 2)(10, aD, 3, 0),
          f(11, "div", 3)(12, "div", 4)(13, "a", 5),
          d(14, "mail@marcus-loosen.de"),
          u()(),
          f(15, "div", 6)(16, "div"),
          b(17, "img", 7),
          u(),
          f(18, "a", 8),
          d(19, "Scroll"),
          b(20, "br"),
          d(21, "Down"),
          u()()()()()),
          i & 2 && (y(9), V(9, o.translateService.translated ? 10 : 9));
      },
      styles: [
        `

*[_ngcontent-%COMP%] {
  margin: 0;
  padding: 0;
}
html[_ngcontent-%COMP%] {
  scroll-behavior: smooth;
}
body[_ngcontent-%COMP%] {
  background-color: #fffcf3;
}
a[_ngcontent-%COMP%] {
  text-decoration: none;
  color: black;
}
.btn[_ngcontent-%COMP%] {
  cursor: pointer;
  border-style: unset;
  border: 4px solid black;
  padding: 20px 60px;
  font-family: "Overpass", sans-serif;
  font-size: 23px;
  background-color: #fffcf3;
  transition: all 0.125s ease-in-out;
}
.btn[_ngcontent-%COMP%]:hover {
  padding: 20px 80px;
  font-weight: 700;
}
.btn[_ngcontent-%COMP%]:active {
  background-color: black;
  color: #fffcf3;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar {
  height: 10px;
  width: 5px;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-track {
  border-radius: 5px;
  background-color: #dfe9eb;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-track:hover {
  background-color: #b8c0c2;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-track:active {
  background-color: #b8c0c2;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: #5987ff;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:hover {
  background-color: #396eff;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:active {
  background-color: #396eff;
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 400;
  src: url("./media/syne-v22-latin-regular-6UTYI6IK.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 500;
  src: url("./media/syne-v22-latin-500-DLSUZYMP.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 600;
  src: url("./media/syne-v22-latin-600-2OMFULSK.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 700;
  src: url("./media/syne-v22-latin-700-7MWUTDCM.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 800;
  src: url("./media/syne-v22-latin-800-5SEF6UHE.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 100;
  src: url("./media/overpass-v13-latin-100-7H57N2W4.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 100;
  src: url("./media/overpass-v13-latin-100italic-TTK663FB.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 200;
  src: url("./media/overpass-v13-latin-200-MKKXNLZT.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 200;
  src: url("./media/overpass-v13-latin-200italic-UUSYSIGK.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 300;
  src: url("./media/overpass-v13-latin-300-Z3DUN6DK.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 300;
  src: url("./media/overpass-v13-latin-300italic-E7DYAHJT.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 400;
  src: url("./media/overpass-v13-latin-regular-ZK77XNQQ.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 400;
  src: url("./media/overpass-v13-latin-italic-CQLYFGT5.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 500;
  src: url("./media/overpass-v13-latin-500-5JQXFN7P.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 500;
  src: url("./media/overpass-v13-latin-500italic-HBJHAJTP.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 600;
  src: url("./media/overpass-v13-latin-600-43COUMYV.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 600;
  src: url("./media/overpass-v13-latin-600italic-XVZTHGMT.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 700;
  src: url("./media/overpass-v13-latin-700-EGTGNMPW.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 700;
  src: url("./media/overpass-v13-latin-700italic-37TJZGGR.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 800;
  src: url("./media/overpass-v13-latin-800-MNY6LLUS.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 800;
  src: url("./media/overpass-v13-latin-800italic-G2IFGHUZ.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 900;
  src: url("./media/overpass-v13-latin-900-DS3PFZN2.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 900;
  src: url("./media/overpass-v13-latin-900italic-HWYZS623.woff2") format("woff2");
}
h1[_ngcontent-%COMP%] {
  font-family: "Syne", sans-serif;
  font-size: 128px;
  font-weight: 800;
}
@media (max-width: 1140px) {
  h1[_ngcontent-%COMP%] {
    font-size: 96px;
  }
}
@media (max-width: 850px) {
  h1[_ngcontent-%COMP%] {
    font-size: 64px;
  }
}
@media (max-width: 580px) {
  h1[_ngcontent-%COMP%] {
    font-size: 56px;
  }
}
@media (max-width: 505px) {
  h1[_ngcontent-%COMP%] {
    font-size: 44px;
  }
}
h2[_ngcontent-%COMP%] {
  font-family: "Overpass", sans-serif;
  color: #5987ff;
  font-size: 48px;
  font-weight: 700;
  text-align: right;
}
@media (max-width: 850px) {
  h2[_ngcontent-%COMP%] {
    font-size: 32px;
  }
}
@media (max-width: 580px) {
  h2[_ngcontent-%COMP%] {
    font-size: 28px;
  }
}
@media (max-width: 505px) {
  h2[_ngcontent-%COMP%] {
    font-size: 23px;
  }
}
h2[_ngcontent-%COMP%]::before {
  content: "";
  display: inline-block;
  position: relative;
  background-color: black;
  width: 600px;
  height: 3px;
  text-align: center;
  margin: 0 8px 16px 0;
}
@media (max-width: 1140px) {
  h2[_ngcontent-%COMP%]::before {
    width: 400px;
  }
}
@media (max-width: 850px) {
  h2[_ngcontent-%COMP%]::before {
    width: 250px;
    margin: 0 8px 8px 0;
  }
}
@media (max-width: 580px) {
  h2[_ngcontent-%COMP%]::before {
    width: 232px;
  }
}
@media (max-width: 505px) {
  h2[_ngcontent-%COMP%]::before {
    width: 172px;
    margin: 0 8px 6px 0;
  }
}
section[_ngcontent-%COMP%] {
  width: 100%;
  height: 100vh;
  padding-top: 64px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0;
}
section[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%] {
  width: 90%;
  max-width: 1920px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 40px;
}
section[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%]   .headline[_ngcontent-%COMP%] {
  text-align: center;
}
section[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%]   .scroll-down[_ngcontent-%COMP%] {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 0;
  width: 100%;
  font-family: "Overpass", sans-serif;
  font-size: 23px;
  font-weight: 300;
}
section[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%]   .scroll-down[_ngcontent-%COMP%]   .email-link[_ngcontent-%COMP%] {
  display: flex;
  position: relative;
}
section[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%]   .scroll-down[_ngcontent-%COMP%]   .email-link[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {
  writing-mode: vertical-lr;
  transform: rotate(180deg);
}
.scroll-arrow[_ngcontent-%COMP%] {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 6px;
  height: 100%;
}
.scroll-arrow[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0;
  overflow: hidden;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.scroll-arrow[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {
  animation: _ngcontent-%COMP%_arrow-animation 1s infinite ease;
}
.btn[_ngcontent-%COMP%] {
  display: none;
}
@keyframes _ngcontent-%COMP%_arrow-animation {
  from {
    transform: translateY(-100px);
  }
  to {
    transform: translateY(96px);
  }
}
@media (max-width: 850px) {
  .btn[_ngcontent-%COMP%] {
    display: block;
    padding: 20px 80px;
    margin-top: 64px;
  }
  .btn[_ngcontent-%COMP%]:hover {
    padding: 20px 110px;
  }
}
@media (max-width: 430px) {
  h1[_ngcontent-%COMP%] {
    font-size: 36px;
  }
  .btn[_ngcontent-%COMP%] {
    display: block;
    padding: 20px 0;
    width: 276px;
  }
  .btn[_ngcontent-%COMP%]:hover {
    padding: 20px 0;
  }
  .btn[_ngcontent-%COMP%]:active {
    padding: 20px 0;
  }
  h2[_ngcontent-%COMP%] {
    font-size: 23px;
    padding-right: 16px;
  }
  h2[_ngcontent-%COMP%]::before {
    width: 120px;
    margin: 0 8px 8px 0;
  }
}`,
      ],
    }));
  let e = t;
  return e;
})();
function lD(e, t) {
  e & 1 && (f(0, "h1"), d(1, "\xDCber mich"), u());
}
function cD(e, t) {
  e & 1 && (f(0, "h1"), d(1, "About me"), u());
}
function uD(e, t) {
  e & 1 &&
    (f(0, "div"),
    d(
      1,
      " Ich bin ein Junior Frontend-Entwickler mit Sitz in Ahrensh\xF6ft, Deutschland. Dank meiner Erfahrung und Leidenschaft f\xFCr die Webentwicklung verwandle ich Designkonzepte und funktionale Anforderungen in ansprechende und benutzerfreundliche Webanwendungen. Mein Schwerpunkt liegt in der Entwicklung von Business-Applikationen, die ich mithilfe von HTML, CSS und TypeScript/JavaScript oder des Frontend-Frameworks Angular zum Leben erwecke. Auf der Suche nach neuen Herausforderungen strebe ich danach, meine Karriere als Junior-Webentwickler voranzutreiben. Wenn Sie oder Ihr Unternehmen Interesse an einem engagierten Teammitglied haben, das dazu beitr\xE4gt, Ihre Projekte erfolgreich umzusetzen, freue ich mich \xFCber eine Kontaktaufnahme! "
    ),
    u());
}
function dD(e, t) {
  e & 1 &&
    (f(0, "div"),
    d(
      1,
      " I am a Junior Frontend Developer based in Ahrensh\xF6ft, Germany. Thanks to my experience and passion for web development, I transform design concepts and functional requirements into appealing and user-friendly web applications. My focus lies in the development of business applications, which I bring to life using HTML, CSS, and TypeScript/JavaScript or the Angular frontend framework. In search of new challenges, I strive to advance my career as a Junior Web Developer. If you or your company are interested in a dedicated team member who contributes to successfully implementing your projects, I look forward to hearing from you! "
    ),
    u());
}
function fD(e, t) {
  e & 1 && (f(0, "a", 2)(1, "button", 6), d(2, "Nachricht senden"), u()());
}
function hD(e, t) {
  e & 1 && (f(0, "a", 2)(1, "button", 6), d(2, "Let's talk"), u()());
}
var lp = (() => {
  let t = class t {
    constructor() {
      this.translateService = v(de);
    }
  };
  (t.ɵfac = function (i) {
    return new (i || t)();
  }),
    (t.ɵcmp = G({
      type: t,
      selectors: [["app-about-me"]],
      standalone: !0,
      features: [W],
      decls: 13,
      vars: 3,
      consts: [
        [1, "content"],
        [1, "left"],
        ["href", "#contact", "data-aos", "fade-up", "data-aos-duration", "500"],
        [1, "image-container"],
        [
          "data-aos",
          "fade-in",
          "data-aos-delay",
          "50",
          "data-aos-duration",
          "1000",
          "src",
          "assets/img/photo-small.png",
          "alt",
          "",
        ],
        [1, "frame"],
        [1, "btn"],
      ],
      template: function (i, o) {
        i & 1 &&
          (f(0, "section")(1, "div"),
          k(2, lD, 2, 0, "h1")(3, cD, 2, 0),
          f(4, "div", 0)(5, "div", 1),
          k(6, uD, 2, 0, "div")(7, dD, 2, 0)(8, fD, 3, 0, "a", 2)(9, hD, 3, 0),
          u(),
          f(10, "div", 3),
          b(11, "img", 4)(12, "div", 5),
          u()()()()),
          i & 2 &&
            (y(2),
            V(2, o.translateService.translated ? 3 : 2),
            y(4),
            V(6, o.translateService.translated ? 7 : 6),
            y(2),
            V(8, o.translateService.translated ? 9 : 8));
      },
      styles: [
        `

*[_ngcontent-%COMP%] {
  margin: 0;
  padding: 0;
}
html[_ngcontent-%COMP%] {
  scroll-behavior: smooth;
}
body[_ngcontent-%COMP%] {
  background-color: #fffcf3;
}
a[_ngcontent-%COMP%] {
  text-decoration: none;
  color: black;
}
.btn[_ngcontent-%COMP%] {
  cursor: pointer;
  border-style: unset;
  border: 4px solid black;
  padding: 20px 60px;
  font-family: "Overpass", sans-serif;
  font-size: 23px;
  background-color: #fffcf3;
  transition: all 0.125s ease-in-out;
}
.btn[_ngcontent-%COMP%]:hover {
  padding: 20px 80px;
  font-weight: 700;
}
.btn[_ngcontent-%COMP%]:active {
  background-color: black;
  color: #fffcf3;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar {
  height: 10px;
  width: 5px;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-track {
  border-radius: 5px;
  background-color: #dfe9eb;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-track:hover {
  background-color: #b8c0c2;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-track:active {
  background-color: #b8c0c2;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: #5987ff;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:hover {
  background-color: #396eff;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:active {
  background-color: #396eff;
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 400;
  src: url("./media/syne-v22-latin-regular-6UTYI6IK.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 500;
  src: url("./media/syne-v22-latin-500-DLSUZYMP.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 600;
  src: url("./media/syne-v22-latin-600-2OMFULSK.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 700;
  src: url("./media/syne-v22-latin-700-7MWUTDCM.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 800;
  src: url("./media/syne-v22-latin-800-5SEF6UHE.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 100;
  src: url("./media/overpass-v13-latin-100-7H57N2W4.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 100;
  src: url("./media/overpass-v13-latin-100italic-TTK663FB.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 200;
  src: url("./media/overpass-v13-latin-200-MKKXNLZT.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 200;
  src: url("./media/overpass-v13-latin-200italic-UUSYSIGK.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 300;
  src: url("./media/overpass-v13-latin-300-Z3DUN6DK.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 300;
  src: url("./media/overpass-v13-latin-300italic-E7DYAHJT.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 400;
  src: url("./media/overpass-v13-latin-regular-ZK77XNQQ.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 400;
  src: url("./media/overpass-v13-latin-italic-CQLYFGT5.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 500;
  src: url("./media/overpass-v13-latin-500-5JQXFN7P.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 500;
  src: url("./media/overpass-v13-latin-500italic-HBJHAJTP.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 600;
  src: url("./media/overpass-v13-latin-600-43COUMYV.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 600;
  src: url("./media/overpass-v13-latin-600italic-XVZTHGMT.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 700;
  src: url("./media/overpass-v13-latin-700-EGTGNMPW.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 700;
  src: url("./media/overpass-v13-latin-700italic-37TJZGGR.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 800;
  src: url("./media/overpass-v13-latin-800-MNY6LLUS.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 800;
  src: url("./media/overpass-v13-latin-800italic-G2IFGHUZ.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 900;
  src: url("./media/overpass-v13-latin-900-DS3PFZN2.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 900;
  src: url("./media/overpass-v13-latin-900italic-HWYZS623.woff2") format("woff2");
}
h1[_ngcontent-%COMP%] {
  font-family: "Syne", sans-serif;
  font-size: 78px;
  font-weight: 800;
  color: black;
  transition: color 0.225s ease-in-out;
}
@media (max-width: 850px) {
  h1[_ngcontent-%COMP%] {
    font-size: 56px;
  }
}
@media (max-width: 580px) {
  h1[_ngcontent-%COMP%] {
    font-size: 48px;
  }
}
@media (max-width: 505px) {
  h1[_ngcontent-%COMP%] {
    font-size: 40px;
  }
}
h1[_ngcontent-%COMP%]:hover {
  color: #5987ff;
}
section[_ngcontent-%COMP%] {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0;
  padding-top: 96px;
}
section[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 52px;
  width: 90%;
  max-width: 1920px;
  margin-left: auto;
  margin-right: auto;
}
@media (max-width: 850px) {
  section[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {
    width: 80%;
    align-items: center;
  }
}
section[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%] {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 48px;
  font-size: 23px;
  font-family: "Overpass", sans-serif;
  width: 100%;
}
@media (max-width: 850px) {
  section[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%] {
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
}
section[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%]   .left[_ngcontent-%COMP%] {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 52px;
  max-width: calc(66% - 48px);
}
@media (max-width: 975px) {
  section[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%]   .left[_ngcontent-%COMP%] {
    max-width: calc(55% - 48px);
  }
}
@media (max-width: 850px) {
  section[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%]   .left[_ngcontent-%COMP%] {
    max-width: 100%;
  }
}
section[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%]   .left[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {
  line-height: 32px;
}
@media (max-width: 850px) {
  section[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%]   .left[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {
    text-align: center;
  }
}
section[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%]   .left[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {
  align-self: center;
}
@media (max-width: 850px) {
  section[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%]   .left[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {
    display: none;
  }
}
section[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%]   .image-container[_ngcontent-%COMP%] {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 0;
  width: 50%;
  height: auto;
  position: relative;
}
@media (max-width: 850px) {
  section[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%]   .image-container[_ngcontent-%COMP%] {
    width: 90%;
  }
}
section[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%]   .image-container[_ngcontent-%COMP%]   .frame[_ngcontent-%COMP%] {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 4px solid black;
  top: 16px;
  left: 16px;
  opacity: 0;
  transition: opacity 0.225s ease-in-out;
}
section[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%]   .image-container[_ngcontent-%COMP%]   .frame[_ngcontent-%COMP%]:hover {
  opacity: 1;
}
section[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%]   .image-container[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {
  object-fit: cover;
  width: 100%;
  height: auto;
  background-color: #ced0cf;
}
@media (max-width: 430px) {
  section[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {
    width: 80%;
  }
  section[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%] {
    flex-direction: column;
    align-items: center;
    gap: 64px;
  }
  section[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%]   .left[_ngcontent-%COMP%] {
    max-width: 100%;
  }
  section[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%]   .image-container[_ngcontent-%COMP%] {
    width: 90%;
    align-self: center;
  }
  h1[_ngcontent-%COMP%] {
    font-size: 38px;
    text-align: center;
  }
  .btn[_ngcontent-%COMP%] {
    display: none;
  }
}
@media (max-width: 390px) {
  section[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {
    width: 90%;
  }
}`,
      ],
    }));
  let e = t;
  return e;
})();
var pD = (e) => ({ mirror: e }),
  gD = (e) => ({ "start-arrow": e }),
  mD = (e) => ({ "start-shaft": e }),
  cp = (() => {
    let t = class t {
      constructor() {
        (this.left = !1), (this.animate = !1), (this.animationOver = !1);
      }
      startAnimation() {
        this.animate ? (this.animate = !1) : (this.animate = !0),
          setTimeout(() => {
            this.animationOver = !0;
          }, 250);
      }
    };
    (t.ɵfac = function (i) {
      return new (i || t)();
    }),
      (t.ɵcmp = G({
        type: t,
        selectors: [["app-arrow"]],
        inputs: { left: "left" },
        standalone: !0,
        features: [W],
        decls: 4,
        vars: 9,
        consts: [
          [3, "ngClass"],
          [
            "data-aos",
            "arrow-animation",
            "data-aos-delay",
            "50",
            "data-aos-duration",
            "1000",
            "data-aos-offset",
            "200",
            "src",
            "assets/icons/arrow_short.png",
            "alt",
            "",
            1,
            "arrow-short",
            3,
            "ngClass",
          ],
          [
            "data-aos",
            "shaft-animation",
            "data-aos-delay",
            "500",
            "data-aos-duration",
            "1000",
            "data-aos-offset",
            "200",
            1,
            "arrow-shaft",
            3,
            "ngClass",
          ],
        ],
        template: function (i, o) {
          i & 1 &&
            (f(0, "section", 0)(1, "div"), b(2, "img", 1)(3, "div", 2), u()()),
            i & 2 &&
              (Ie("ngClass", Dt(3, pD, o.left)),
              y(2),
              Ie("ngClass", Dt(5, gD, o.animate)),
              y(),
              Ie("ngClass", Dt(7, mD, o.animationOver)));
        },
        dependencies: [pe, Kn],
        styles: [
          `

*[_ngcontent-%COMP%] {
  margin: 0;
  padding: 0;
}
html[_ngcontent-%COMP%] {
  scroll-behavior: smooth;
}
body[_ngcontent-%COMP%] {
  background-color: #fffcf3;
}
a[_ngcontent-%COMP%] {
  text-decoration: none;
  color: black;
}
.btn[_ngcontent-%COMP%] {
  cursor: pointer;
  border-style: unset;
  border: 4px solid black;
  padding: 20px 60px;
  font-family: "Overpass", sans-serif;
  font-size: 23px;
  background-color: #fffcf3;
  transition: all 0.125s ease-in-out;
}
.btn[_ngcontent-%COMP%]:hover {
  padding: 20px 80px;
  font-weight: 700;
}
.btn[_ngcontent-%COMP%]:active {
  background-color: black;
  color: #fffcf3;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar {
  height: 10px;
  width: 5px;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-track {
  border-radius: 5px;
  background-color: #dfe9eb;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-track:hover {
  background-color: #b8c0c2;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-track:active {
  background-color: #b8c0c2;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: #5987ff;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:hover {
  background-color: #396eff;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:active {
  background-color: #396eff;
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 400;
  src: url("./media/syne-v22-latin-regular-6UTYI6IK.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 500;
  src: url("./media/syne-v22-latin-500-DLSUZYMP.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 600;
  src: url("./media/syne-v22-latin-600-2OMFULSK.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 700;
  src: url("./media/syne-v22-latin-700-7MWUTDCM.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 800;
  src: url("./media/syne-v22-latin-800-5SEF6UHE.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 100;
  src: url("./media/overpass-v13-latin-100-7H57N2W4.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 100;
  src: url("./media/overpass-v13-latin-100italic-TTK663FB.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 200;
  src: url("./media/overpass-v13-latin-200-MKKXNLZT.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 200;
  src: url("./media/overpass-v13-latin-200italic-UUSYSIGK.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 300;
  src: url("./media/overpass-v13-latin-300-Z3DUN6DK.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 300;
  src: url("./media/overpass-v13-latin-300italic-E7DYAHJT.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 400;
  src: url("./media/overpass-v13-latin-regular-ZK77XNQQ.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 400;
  src: url("./media/overpass-v13-latin-italic-CQLYFGT5.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 500;
  src: url("./media/overpass-v13-latin-500-5JQXFN7P.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 500;
  src: url("./media/overpass-v13-latin-500italic-HBJHAJTP.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 600;
  src: url("./media/overpass-v13-latin-600-43COUMYV.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 600;
  src: url("./media/overpass-v13-latin-600italic-XVZTHGMT.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 700;
  src: url("./media/overpass-v13-latin-700-EGTGNMPW.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 700;
  src: url("./media/overpass-v13-latin-700italic-37TJZGGR.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 800;
  src: url("./media/overpass-v13-latin-800-MNY6LLUS.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 800;
  src: url("./media/overpass-v13-latin-800italic-G2IFGHUZ.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 900;
  src: url("./media/overpass-v13-latin-900-DS3PFZN2.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 900;
  src: url("./media/overpass-v13-latin-900italic-HWYZS623.woff2") format("woff2");
}
.mirror[_ngcontent-%COMP%] {
  transform: scale(-1, 1);
}
section[_ngcontent-%COMP%] {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0;
  margin-top: 32px;
  padding-bottom: 16px;
}
section[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 0;
  width: 70%;
  width: 90%;
  max-width: 1920px;
  margin-left: auto;
  margin-right: auto;
  height: 240px;
  position: relative;
}
section[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]   .arrow-short[_ngcontent-%COMP%] {
  position: absolute;
  top: 0;
  right: 0;
}
section[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]   .arrow-shaft[_ngcontent-%COMP%] {
  position: absolute;
  background-color: black;
  width: 80px;
  height: 4px;
  top: 70px;
  right: 32px;
}
[data-aos=arrow-animation][_ngcontent-%COMP%] {
  top: 0;
  right: 0;
  transition-property: top, right;
}
[data-aos=arrow-animation].aos-animate[_ngcontent-%COMP%] {
  top: 53px !important;
  right: 53px !important;
}
[data-aos=shaft-animation][_ngcontent-%COMP%] {
  top: 70px;
  right: 32px;
  transform: rotate(-45deg);
  transition-property:
    transform,
    top,
    right;
}
[data-aos=shaft-animation].aos-animate[_ngcontent-%COMP%] {
  top: 120px !important;
  right: 82px !important;
}
.start-arrow[_ngcontent-%COMP%] {
  top: 53px !important;
  right: 53px !important;
}
.start-shaft[_ngcontent-%COMP%] {
  top: 120px !important;
  right: 82px !important;
}
@media (max-width: 430px) {
  .mirror[_ngcontent-%COMP%] {
    transform: scale(-1, 1) translateX(32px);
  }
}`,
        ],
      }));
    let e = t;
    return e;
  })();
var vD = (e) => ({ animate: e });
function yD(e, t) {
  if (
    (e & 1 && (f(0, "div", 2), b(1, "img", 3), f(2, "span"), d(3), u()()),
    e & 2)
  ) {
    let r = t.$implicit,
      n = t.$index,
      i = j();
    y(),
      Wn("src", "assets/icons/", r.path, "", jt),
      Ie("ngClass", Dt(4, vD, i.skills[n].animate)),
      y(2),
      at(r.name);
  }
}
var up = (() => {
  let t = class t {
    constructor() {
      (this.animate = !1),
        (this.skills = [
          { name: "Angular", path: "angular.png", animate: !1 },
          { name: "TypeScript", path: "ts.png", animate: !1 },
          { name: "JavaScript", path: "javascript.png", animate: !1 },
          { name: "HTML", path: "html.png", animate: !1 },
          { name: "CSS", path: "css.png", animate: !1 },
          { name: "SCSS", path: "sass.png", animate: !1 },
          { name: "Firebase", path: "firebase.png", animate: !1 },
          { name: "Git", path: "git.png", animate: !1 },
          { name: "Scrum", path: "scrum.png", animate: !1 },
          { name: "Rest Api", path: "api.png", animate: !1 },
          { name: "Bootstrap", path: "bootstrap.svg", animate: !1 },
          { name: "Material Design", path: "material_design.png", animate: !1 },
        ]);
    }
    startAnimation(n) {
      (this.skills[n].animate = !0),
        setTimeout(() => {
          this.skills[n].animate = !1;
        }, 500);
    }
  };
  (t.ɵfac = function (i) {
    return new (i || t)();
  }),
    (t.ɵcmp = G({
      type: t,
      selectors: [["app-my-skills"]],
      standalone: !0,
      features: [W],
      decls: 7,
      vars: 0,
      consts: [
        [1, "container"],
        [1, "skill-container"],
        [1, "single-skill"],
        ["alt", "", 1, "icon", 3, "ngClass", "src"],
      ],
      template: function (i, o) {
        i & 1 &&
          (f(0, "section")(1, "div", 0)(2, "h1"),
          d(3, "Skills"),
          u(),
          f(4, "div", 1),
          Eo(5, yD, 4, 6, "div", 2, Mo),
          u()()()),
          i & 2 && (y(5), xo(o.skills));
      },
      dependencies: [pe, Kn],
      styles: [
        `

*[_ngcontent-%COMP%] {
  margin: 0;
  padding: 0;
}
html[_ngcontent-%COMP%] {
  scroll-behavior: smooth;
}
body[_ngcontent-%COMP%] {
  background-color: #fffcf3;
}
a[_ngcontent-%COMP%] {
  text-decoration: none;
  color: black;
}
.btn[_ngcontent-%COMP%] {
  cursor: pointer;
  border-style: unset;
  border: 4px solid black;
  padding: 20px 60px;
  font-family: "Overpass", sans-serif;
  font-size: 23px;
  background-color: #fffcf3;
  transition: all 0.125s ease-in-out;
}
.btn[_ngcontent-%COMP%]:hover {
  padding: 20px 80px;
  font-weight: 700;
}
.btn[_ngcontent-%COMP%]:active {
  background-color: black;
  color: #fffcf3;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar {
  height: 10px;
  width: 5px;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-track {
  border-radius: 5px;
  background-color: #dfe9eb;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-track:hover {
  background-color: #b8c0c2;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-track:active {
  background-color: #b8c0c2;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: #5987ff;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:hover {
  background-color: #396eff;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:active {
  background-color: #396eff;
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 400;
  src: url("./media/syne-v22-latin-regular-6UTYI6IK.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 500;
  src: url("./media/syne-v22-latin-500-DLSUZYMP.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 600;
  src: url("./media/syne-v22-latin-600-2OMFULSK.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 700;
  src: url("./media/syne-v22-latin-700-7MWUTDCM.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 800;
  src: url("./media/syne-v22-latin-800-5SEF6UHE.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 100;
  src: url("./media/overpass-v13-latin-100-7H57N2W4.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 100;
  src: url("./media/overpass-v13-latin-100italic-TTK663FB.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 200;
  src: url("./media/overpass-v13-latin-200-MKKXNLZT.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 200;
  src: url("./media/overpass-v13-latin-200italic-UUSYSIGK.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 300;
  src: url("./media/overpass-v13-latin-300-Z3DUN6DK.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 300;
  src: url("./media/overpass-v13-latin-300italic-E7DYAHJT.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 400;
  src: url("./media/overpass-v13-latin-regular-ZK77XNQQ.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 400;
  src: url("./media/overpass-v13-latin-italic-CQLYFGT5.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 500;
  src: url("./media/overpass-v13-latin-500-5JQXFN7P.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 500;
  src: url("./media/overpass-v13-latin-500italic-HBJHAJTP.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 600;
  src: url("./media/overpass-v13-latin-600-43COUMYV.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 600;
  src: url("./media/overpass-v13-latin-600italic-XVZTHGMT.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 700;
  src: url("./media/overpass-v13-latin-700-EGTGNMPW.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 700;
  src: url("./media/overpass-v13-latin-700italic-37TJZGGR.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 800;
  src: url("./media/overpass-v13-latin-800-MNY6LLUS.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 800;
  src: url("./media/overpass-v13-latin-800italic-G2IFGHUZ.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 900;
  src: url("./media/overpass-v13-latin-900-DS3PFZN2.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 900;
  src: url("./media/overpass-v13-latin-900italic-HWYZS623.woff2") format("woff2");
}
h1[_ngcontent-%COMP%] {
  font-family: "Syne", sans-serif;
  display: block;
  font-size: 78px;
  font-weight: 800;
  z-index: 20;
  background-color: #fffcf3;
  padding: 0 16px;
}
h1[_ngcontent-%COMP%]:hover {
  color: #5987ff;
}
@media (max-width: 850px) {
  h1[_ngcontent-%COMP%] {
    font-size: 56px;
  }
}
@media (max-width: 580px) {
  h1[_ngcontent-%COMP%] {
    font-size: 48px;
  }
}
@media (max-width: 505px) {
  h1[_ngcontent-%COMP%] {
    font-size: 40px;
  }
}
@media (max-width: 380px) {
  h1[_ngcontent-%COMP%] {
    padding: 0 4px;
  }
}
section[_ngcontent-%COMP%] {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0;
  padding: 80px 0 80px 0;
  margin-top: 40px;
}
section[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%] {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0;
  width: 90%;
  max-width: 1920px;
  margin-left: auto;
  margin-right: auto;
}
@media (max-width: 850px) {
  section[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%] {
    width: 80%;
  }
}
@media (max-width: 380px) {
  section[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%] {
    width: 90%;
  }
}
section[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%]   .skill-container[_ngcontent-%COMP%] {
  box-sizing: border-box;
  padding: 161px 141px 141px 141px;
  border: 4px solid black;
  width: 100%;
  margin-top: -45px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 78px;
  flex-wrap: wrap;
}
@media (max-width: 850px) {
  section[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%]   .skill-container[_ngcontent-%COMP%] {
    padding: 120px 80px;
    margin-top: -32px;
  }
}
@media (max-width: 650px) {
  section[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%]   .skill-container[_ngcontent-%COMP%] {
    padding: 80px 48px;
  }
}
@media (max-width: 580px) {
  section[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%]   .skill-container[_ngcontent-%COMP%] {
    padding: 64px 32px;
    margin-top: -28px;
  }
}
@media (max-width: 505px) {
  section[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%]   .skill-container[_ngcontent-%COMP%] {
    margin-top: -24px;
  }
}
section[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%]   .skill-container[_ngcontent-%COMP%]   .single-skill[_ngcontent-%COMP%] {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  font-family: "Overpass", sans-serif;
  font-size: 16px;
  font-weight: 700;
  overflow: hidden;
}
section[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%]   .skill-container[_ngcontent-%COMP%]   .single-skill[_ngcontent-%COMP%]:hover {
  color: #5987ff;
}
section[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%]   .skill-container[_ngcontent-%COMP%]   .single-skill[_ngcontent-%COMP%]   .icon[_ngcontent-%COMP%] {
  width: 75px;
  height: 75px;
}
@media (max-width: 580px) {
  section[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%]   .skill-container[_ngcontent-%COMP%]   .single-skill[_ngcontent-%COMP%]   .icon[_ngcontent-%COMP%] {
    width: 56px;
    height: 56px;
  }
}
.animate[_ngcontent-%COMP%] {
  animation: _ngcontent-%COMP%_animation 0.5s ease-in-out;
  animation-iteration-count: 1;
}
@keyframes _ngcontent-%COMP%_animation {
  0% {
    transform: translateX(0) scale(1);
  }
  20% {
    transform: translateX(50px) scale(1);
  }
  30% {
    transform: translateX(80px) scale(1);
  }
  40% {
    transform: translateX(30px) scale(0.9);
  }
  50% {
    transform: translateX(0px) scale(0.8);
  }
  60% {
    transform: translateX(-30px) scale(0.9);
  }
  70% {
    transform: translateX(-80px) scale(1);
  }
  80% {
    transform: translateX(-50px) scale(1);
  }
  100% {
    transform: translateX(0) scale(1);
  }
}
@media (max-width: 430px) {
  h1[_ngcontent-%COMP%] {
    font-size: 36px;
    padding: 0 8px;
  }
  section[_ngcontent-%COMP%] {
    margin-top: 0;
    padding: 112px 0 0 0;
  }
  section[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%]   .skill-container[_ngcontent-%COMP%] {
    padding: 40px 32px;
    margin-top: -24px;
    gap: 48px;
  }
}`,
      ],
    }));
  let e = t;
  return e;
})();
function wD(e, t) {
  if ((e & 1 && (f(0, "p"), d(1), u()), e & 2)) {
    let r = j(2);
    y(), at(r.project.description);
  }
}
function CD(e, t) {
  if ((e & 1 && (f(0, "p"), d(1), u()), e & 2)) {
    let r = j(2);
    y(), at(r.project.description_english);
  }
}
function bD(e, t) {
  if (
    (e & 1 &&
      (f(0, "div", 5)(1, "span"),
      d(2),
      u(),
      f(3, "div", 6)(4, "h2"),
      d(5),
      u(),
      f(6, "div", 7),
      d(7),
      u(),
      k(8, wD, 2, 1, "p")(9, CD, 2, 1),
      f(10, "div", 8)(11, "a", 9)(12, "button", 10),
      d(13, "Github"),
      u()(),
      f(14, "a", 9)(15, "button", 10),
      d(16, "Live Test"),
      u()()()()()),
    e & 2)
  ) {
    let r = j();
    y(2),
      Io("0", r.index, "/0", r.amount, ""),
      y(3),
      at(r.project.name),
      y(2),
      Ar(" ", r.project.technologies, " "),
      y(),
      V(8, r.translateService.translated ? 9 : 8),
      y(3),
      Gn("href", r.project.github, jt),
      y(3),
      Gn("href", r.project.project, jt);
  }
}
function DD(e, t) {
  if ((e & 1 && (f(0, "p"), d(1), u()), e & 2)) {
    let r = j(2);
    y(), at(r.project.description);
  }
}
function _D(e, t) {
  if ((e & 1 && (f(0, "p"), d(1), u()), e & 2)) {
    let r = j(2);
    y(), at(r.project.description_english);
  }
}
function MD(e, t) {
  if (
    (e & 1 &&
      (f(0, "div", 11)(1, "span"),
      d(2),
      u(),
      f(3, "div", 6)(4, "h2"),
      d(5),
      u(),
      f(6, "div", 7),
      d(7),
      u(),
      k(8, DD, 2, 1, "p")(9, _D, 2, 1),
      f(10, "div", 8)(11, "a", 9)(12, "button", 10),
      d(13, "Github"),
      u()(),
      f(14, "a", 9)(15, "button", 10),
      d(16, "Live Test"),
      u()()()()()),
    e & 2)
  ) {
    let r = j();
    y(2),
      Io("0", r.index, "/0", r.amount, ""),
      y(3),
      at(r.project.name),
      y(2),
      Ar(" ", r.project.technologies, " "),
      y(),
      V(8, r.translateService.translated ? 9 : 8),
      y(3),
      Gn("href", r.project.github, jt),
      y(3),
      Gn("href", r.project.project, jt);
  }
}
var dp = (() => {
  let t = class t {
    constructor() {
      (this.reverse = !1), (this.translateService = v(de));
    }
  };
  (t.ɵfac = function (i) {
    return new (i || t)();
  }),
    (t.ɵcmp = G({
      type: t,
      selectors: [["app-project"]],
      inputs: {
        project: "project",
        index: "index",
        amount: "amount",
        reverse: "reverse",
      },
      standalone: !0,
      features: [W],
      decls: 8,
      vars: 7,
      consts: [
        [1, "container"],
        [
          "data-aos",
          "color-animation",
          "data-aos-duration",
          "1000",
          "data-aos-offset",
          "300",
          1,
          "left",
        ],
        ["alt", "", 1, "preview-img", 3, "src"],
        [1, "frame"],
        ["src", "assets/icons/arrow_frame.png", "alt", ""],
        [
          "data-aos",
          "fade-left",
          "data-aos-duration",
          "1000",
          "data-aos-offset",
          "400",
          1,
          "right",
        ],
        [1, "description"],
        [1, "technologies"],
        [1, "buttons"],
        ["target", "_blank", 3, "href"],
        [1, "btn"],
        [
          "data-aos",
          "fade-right",
          "data-aos-duration",
          "1000",
          "data-aos-offset",
          "400",
          1,
          "right",
        ],
      ],
      template: function (i, o) {
        i & 1 &&
          (f(0, "section")(1, "div", 0)(2, "div", 1),
          b(3, "img", 2),
          f(4, "div", 3),
          b(5, "img", 4),
          u()(),
          k(6, bD, 17, 7, "div", 5)(7, MD, 17, 7),
          u()()),
          i & 2 &&
            (y(),
            wt("row-reverse", o.index % 2 == 0),
            y(2),
            Wn("src", "assets/img/", o.project.img_path, "", jt),
            y(),
            wt("mirror", o.index % 2 == 0),
            y(2),
            V(6, o.index % 2 == 0 ? 6 : 7));
      },
      dependencies: [pe],
      styles: [
        `

*[_ngcontent-%COMP%] {
  margin: 0;
  padding: 0;
}
html[_ngcontent-%COMP%] {
  scroll-behavior: smooth;
}
body[_ngcontent-%COMP%] {
  background-color: #fffcf3;
}
a[_ngcontent-%COMP%] {
  text-decoration: none;
  color: black;
}
.btn[_ngcontent-%COMP%] {
  cursor: pointer;
  border-style: unset;
  border: 4px solid black;
  padding: 20px 60px;
  font-family: "Overpass", sans-serif;
  font-size: 23px;
  background-color: #fffcf3;
  transition: all 0.125s ease-in-out;
}
.btn[_ngcontent-%COMP%]:hover {
  padding: 20px 80px;
  font-weight: 700;
}
.btn[_ngcontent-%COMP%]:active {
  background-color: black;
  color: #fffcf3;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar {
  height: 10px;
  width: 5px;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-track {
  border-radius: 5px;
  background-color: #dfe9eb;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-track:hover {
  background-color: #b8c0c2;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-track:active {
  background-color: #b8c0c2;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: #5987ff;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:hover {
  background-color: #396eff;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:active {
  background-color: #396eff;
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 400;
  src: url("./media/syne-v22-latin-regular-6UTYI6IK.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 500;
  src: url("./media/syne-v22-latin-500-DLSUZYMP.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 600;
  src: url("./media/syne-v22-latin-600-2OMFULSK.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 700;
  src: url("./media/syne-v22-latin-700-7MWUTDCM.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 800;
  src: url("./media/syne-v22-latin-800-5SEF6UHE.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 100;
  src: url("./media/overpass-v13-latin-100-7H57N2W4.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 100;
  src: url("./media/overpass-v13-latin-100italic-TTK663FB.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 200;
  src: url("./media/overpass-v13-latin-200-MKKXNLZT.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 200;
  src: url("./media/overpass-v13-latin-200italic-UUSYSIGK.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 300;
  src: url("./media/overpass-v13-latin-300-Z3DUN6DK.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 300;
  src: url("./media/overpass-v13-latin-300italic-E7DYAHJT.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 400;
  src: url("./media/overpass-v13-latin-regular-ZK77XNQQ.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 400;
  src: url("./media/overpass-v13-latin-italic-CQLYFGT5.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 500;
  src: url("./media/overpass-v13-latin-500-5JQXFN7P.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 500;
  src: url("./media/overpass-v13-latin-500italic-HBJHAJTP.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 600;
  src: url("./media/overpass-v13-latin-600-43COUMYV.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 600;
  src: url("./media/overpass-v13-latin-600italic-XVZTHGMT.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 700;
  src: url("./media/overpass-v13-latin-700-EGTGNMPW.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 700;
  src: url("./media/overpass-v13-latin-700italic-37TJZGGR.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 800;
  src: url("./media/overpass-v13-latin-800-MNY6LLUS.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 800;
  src: url("./media/overpass-v13-latin-800italic-G2IFGHUZ.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 900;
  src: url("./media/overpass-v13-latin-900-DS3PFZN2.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 900;
  src: url("./media/overpass-v13-latin-900italic-HWYZS623.woff2") format("woff2");
}
section[_ngcontent-%COMP%] {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0;
}
@media (max-width: 850px) {
  section[_ngcontent-%COMP%] {
    overflow: hidden;
  }
}
section[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%] {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 48px;
  width: 100%;
}
section[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%]:hover   .frame[_ngcontent-%COMP%] {
  opacity: 1;
}
section[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%]:hover   .frame[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {
  transform: rotate(-135deg);
}
@media (max-width: 850px) {
  section[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%] {
    flex-direction: column;
  }
}
.left[_ngcontent-%COMP%] {
  filter: grayscale(1);
  width: 50%;
  max-width: 500px;
  align-self: flex-end;
  position: relative;
}
@media (max-width: 850px) {
  .left[_ngcontent-%COMP%] {
    width: 90%;
    max-width: 90%;
    align-self: center;
  }
}
.left[_ngcontent-%COMP%]   .preview-img[_ngcontent-%COMP%] {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
@media (max-width: 850px) {
  .left[_ngcontent-%COMP%]   .preview-img[_ngcontent-%COMP%] {
    width: 95%;
  }
}
@media (max-width: 505px) {
  .left[_ngcontent-%COMP%]   .preview-img[_ngcontent-%COMP%] {
    width: 90%;
  }
}
.left[_ngcontent-%COMP%]   .frame[_ngcontent-%COMP%] {
  display: flex;
  align-items: center;
  border: 4px solid black;
  position: absolute;
  top: 8px;
  left: 8px;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.225s ease-in-out;
}
@media (max-width: 850px) {
  .left[_ngcontent-%COMP%]   .frame[_ngcontent-%COMP%] {
    width: 95%;
  }
}
@media (max-width: 505px) {
  .left[_ngcontent-%COMP%]   .frame[_ngcontent-%COMP%] {
    width: 90%;
  }
}
.left[_ngcontent-%COMP%]   .frame[_ngcontent-%COMP%]    > img[_ngcontent-%COMP%] {
  position: absolute;
  right: -34px;
  width: 64px;
  height: 64px;
  transition: transform 0.25s ease-in-out;
}
.mirror[_ngcontent-%COMP%] {
  transform: scale(-1, 1);
}
[data-aos=color-animation][_ngcontent-%COMP%] {
  filter: grayscale(1);
  transition-property: filter;
}
[data-aos=color-animation].aos-animate[_ngcontent-%COMP%] {
  filter: grayscale(0);
}
.right[_ngcontent-%COMP%] {
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0;
}
@media (max-width: 850px) {
  .right[_ngcontent-%COMP%] {
    width: 100%;
  }
}
.right[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {
  font-family: "Syne", sans-serif;
  font-size: 48px;
  font-weight: 700;
  align-self: flex-end;
}
.right[_ngcontent-%COMP%]   .description[_ngcontent-%COMP%] {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 16px;
}
.right[_ngcontent-%COMP%]   .description[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {
  font-family: "Syne", sans-serif;
  font-size: 48px;
  font-weight: 800;
}
@media (max-width: 1100px) {
  .right[_ngcontent-%COMP%]   .description[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {
    font-size: 40px;
  }
}
@media (max-width: 580px) {
  .right[_ngcontent-%COMP%]   .description[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {
    font-size: 32px;
  }
}
.right[_ngcontent-%COMP%]   .description[_ngcontent-%COMP%]   .technologies[_ngcontent-%COMP%] {
  color: #5987ff;
  font-size: 23px;
  font-family: "overpass", sans-serif;
}
@media (max-width: 1100px) {
  .right[_ngcontent-%COMP%]   .description[_ngcontent-%COMP%]   .technologies[_ngcontent-%COMP%] {
    font-size: 20px;
  }
}
.right[_ngcontent-%COMP%]   .description[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {
  font-family: "overpass", sans-serif;
  font-size: 16px;
}
.right[_ngcontent-%COMP%]   .description[_ngcontent-%COMP%]   .buttons[_ngcontent-%COMP%] {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 24px;
}
@media (max-width: 850px) {
  .right[_ngcontent-%COMP%]   .description[_ngcontent-%COMP%]   .buttons[_ngcontent-%COMP%] {
    align-self: center;
  }
}
@media (max-width: 1150px) {
  .right[_ngcontent-%COMP%]   .description[_ngcontent-%COMP%]   .buttons[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%] {
    padding: 20px 32px;
  }
  .right[_ngcontent-%COMP%]   .description[_ngcontent-%COMP%]   .buttons[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%]:hover {
    padding: 20px 40px;
  }
  .right[_ngcontent-%COMP%]   .description[_ngcontent-%COMP%]   .buttons[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%]:active {
    padding: 20px 40px;
  }
}
@media (max-width: 580px) {
  .right[_ngcontent-%COMP%]   .description[_ngcontent-%COMP%]   .buttons[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%] {
    padding: 16px 24px;
  }
  .right[_ngcontent-%COMP%]   .description[_ngcontent-%COMP%]   .buttons[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%]:hover {
    padding: 16px 32px;
  }
  .right[_ngcontent-%COMP%]   .description[_ngcontent-%COMP%]   .buttons[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%]:active {
    padding: 16px 32px;
  }
}
.row-reverse[_ngcontent-%COMP%] {
  flex-direction: row-reverse !important;
}
@media (max-width: 850px) {
  .row-reverse[_ngcontent-%COMP%] {
    flex-direction: column !important;
  }
}
@media (max-width: 430px) {
  section[_ngcontent-%COMP%] {
    overflow: hidden;
    box-sizing: border-box;
    width: 100%;
  }
  section[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%] {
    flex-direction: column;
    width: 100%;
  }
  .left[_ngcontent-%COMP%] {
    width: 85%;
    align-self: center;
  }
  .left[_ngcontent-%COMP%]   .preview-img[_ngcontent-%COMP%] {
    height: auto;
  }
  .left[_ngcontent-%COMP%]   .frame[_ngcontent-%COMP%] {
    top: 4px;
    left: 4px;
    border-width: 2px;
  }
  .left[_ngcontent-%COMP%]   .frame[_ngcontent-%COMP%]    > img[_ngcontent-%COMP%] {
    width: 40px;
    height: 40px;
    right: -21px;
  }
  .right[_ngcontent-%COMP%] {
    width: 80%;
  }
  .right[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {
    font-size: 23px;
  }
  .right[_ngcontent-%COMP%]   .description[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {
    font-size: 28px;
  }
  .right[_ngcontent-%COMP%]   .description[_ngcontent-%COMP%]   .buttons[_ngcontent-%COMP%] {
    gap: 4px;
    width: 100%;
    justify-content: space-around;
  }
  .right[_ngcontent-%COMP%]   .description[_ngcontent-%COMP%]   .buttons[_ngcontent-%COMP%]    > a[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%] {
    padding: 12px 8px;
    font-size: 18px;
  }
  .right[_ngcontent-%COMP%]   .description[_ngcontent-%COMP%]   .buttons[_ngcontent-%COMP%]    > a[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%]:hover {
    padding: 12px 12px;
    font-weight: 400;
  }
  .right[_ngcontent-%COMP%]   .description[_ngcontent-%COMP%]   .buttons[_ngcontent-%COMP%]    > a[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%]:active {
    padding: 12px 12px;
    font-weight: 400;
  }
}`,
      ],
    }));
  let e = t;
  return e;
})();
function ED(e, t) {
  e & 1 &&
    (f(0, "span"),
    d(
      1,
      "Sieh dir ein paar meiner Projekte an und probiere sie aus, um meine F\xE4higkeiten zu testen."
    ),
    u());
}
function xD(e, t) {
  e & 1 &&
    (f(0, "span"),
    d(
      1,
      "Take a look at some of my projects and try them out to test my skills."
    ),
    u());
}
function ID(e, t) {
  if ((e & 1 && b(0, "app-project", 3), e & 2)) {
    let r = t.$implicit,
      n = t.$index,
      i = j();
    Ie("project", r)("index", n + 1)("amount", i.projects.length);
  }
}
var fp = (() => {
  let t = class t {
    constructor() {
      (this.translateService = v(de)),
        (this.projects = [
          {
            name: "Join",
            technologies: "Javascript | HTML | CSS ",
            description:
              "Vom Kanban-System inspirierter Aufgabenmanager. Erstellen und organisieren Sie Aufgaben mithilfe von Drag-and-Drop-Funktionen, weisen Sie Benutzer und Kategorien zu.",
            description_english:
              "Task manager inspired by the Kanban System. Create and organize tasks using drag and drop functions, assign useres and categories.",
            img_path: "portfolio-join.png",
            github: "https://github.com/MarcusLoo23/myJoin",
            project: "https://marcus-loosen.de/join/",
          },
          {
            name: "El pollo loco",
            technologies: "Javascript | HTML | CSS",
            description:
              "Ein einfaches Jump-and-Run-Spiel, das auf einem objektorientierten Ansatz basiert. Hilf Pepe, M\xFCnzen und Salsaflaschen zu finden, um gegen den gro\xDFen Endboss zu k\xE4mpfen.",
            description_english:
              "A simple jump and run game based on an object-oriented approach. Help pepe to find coins and salsa bottles to fight against the big endboss.",
            img_path: "portfolio-pollo-loco.png",
            github: "https://github.com/MarcusLoo23/el-pollo-loco",
            project: "https://marcus-loosen.de/el-pollo-loco/",
          },
        ]);
    }
  };
  (t.ɵfac = function (i) {
    return new (i || t)();
  }),
    (t.ɵcmp = G({
      type: t,
      selectors: [["app-portfolio"]],
      standalone: !0,
      features: [W],
      decls: 10,
      vars: 1,
      consts: [
        [1, "portfolio"],
        [1, "headline"],
        [1, "projects"],
        [3, "project", "index", "amount"],
      ],
      template: function (i, o) {
        i & 1 &&
          (f(0, "section")(1, "div", 0)(2, "div", 1)(3, "h1"),
          d(4, "Portfolio"),
          u(),
          k(5, ED, 2, 0, "span")(6, xD, 2, 0),
          u(),
          f(7, "div", 2),
          Eo(8, ID, 1, 3, "app-project", 3, Mo),
          u()()()),
          i & 2 &&
            (y(5),
            V(5, o.translateService.translated ? 6 : 5),
            y(3),
            xo(o.projects));
      },
      dependencies: [dp, pe],
      styles: [
        `

*[_ngcontent-%COMP%] {
  margin: 0;
  padding: 0;
}
html[_ngcontent-%COMP%] {
  scroll-behavior: smooth;
}
body[_ngcontent-%COMP%] {
  background-color: #fffcf3;
}
a[_ngcontent-%COMP%] {
  text-decoration: none;
  color: black;
}
.btn[_ngcontent-%COMP%] {
  cursor: pointer;
  border-style: unset;
  border: 4px solid black;
  padding: 20px 60px;
  font-family: "Overpass", sans-serif;
  font-size: 23px;
  background-color: #fffcf3;
  transition: all 0.125s ease-in-out;
}
.btn[_ngcontent-%COMP%]:hover {
  padding: 20px 80px;
  font-weight: 700;
}
.btn[_ngcontent-%COMP%]:active {
  background-color: black;
  color: #fffcf3;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar {
  height: 10px;
  width: 5px;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-track {
  border-radius: 5px;
  background-color: #dfe9eb;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-track:hover {
  background-color: #b8c0c2;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-track:active {
  background-color: #b8c0c2;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: #5987ff;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:hover {
  background-color: #396eff;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:active {
  background-color: #396eff;
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 400;
  src: url("./media/syne-v22-latin-regular-6UTYI6IK.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 500;
  src: url("./media/syne-v22-latin-500-DLSUZYMP.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 600;
  src: url("./media/syne-v22-latin-600-2OMFULSK.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 700;
  src: url("./media/syne-v22-latin-700-7MWUTDCM.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 800;
  src: url("./media/syne-v22-latin-800-5SEF6UHE.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 100;
  src: url("./media/overpass-v13-latin-100-7H57N2W4.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 100;
  src: url("./media/overpass-v13-latin-100italic-TTK663FB.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 200;
  src: url("./media/overpass-v13-latin-200-MKKXNLZT.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 200;
  src: url("./media/overpass-v13-latin-200italic-UUSYSIGK.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 300;
  src: url("./media/overpass-v13-latin-300-Z3DUN6DK.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 300;
  src: url("./media/overpass-v13-latin-300italic-E7DYAHJT.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 400;
  src: url("./media/overpass-v13-latin-regular-ZK77XNQQ.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 400;
  src: url("./media/overpass-v13-latin-italic-CQLYFGT5.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 500;
  src: url("./media/overpass-v13-latin-500-5JQXFN7P.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 500;
  src: url("./media/overpass-v13-latin-500italic-HBJHAJTP.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 600;
  src: url("./media/overpass-v13-latin-600-43COUMYV.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 600;
  src: url("./media/overpass-v13-latin-600italic-XVZTHGMT.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 700;
  src: url("./media/overpass-v13-latin-700-EGTGNMPW.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 700;
  src: url("./media/overpass-v13-latin-700italic-37TJZGGR.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 800;
  src: url("./media/overpass-v13-latin-800-MNY6LLUS.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 800;
  src: url("./media/overpass-v13-latin-800italic-G2IFGHUZ.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 900;
  src: url("./media/overpass-v13-latin-900-DS3PFZN2.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 900;
  src: url("./media/overpass-v13-latin-900italic-HWYZS623.woff2") format("woff2");
}
h1[_ngcontent-%COMP%] {
  font-family: "Syne", sans-serif;
  font-size: 78px;
  font-weight: 800;
}
h1[_ngcontent-%COMP%]:hover {
  color: #5987ff;
}
@media (max-width: 850px) {
  h1[_ngcontent-%COMP%] {
    font-size: 56px;
  }
}
@media (max-width: 580px) {
  h1[_ngcontent-%COMP%] {
    font-size: 48px;
  }
}
@media (max-width: 505px) {
  h1[_ngcontent-%COMP%] {
    font-size: 40px;
  }
}
section[_ngcontent-%COMP%] {
  padding-top: 104px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0;
}
section[_ngcontent-%COMP%]   .portfolio[_ngcontent-%COMP%] {
  width: 90%;
  max-width: 1920px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0;
}
@media (max-width: 850px) {
  section[_ngcontent-%COMP%]   .portfolio[_ngcontent-%COMP%] {
    width: 80%;
  }
}
section[_ngcontent-%COMP%]   .portfolio[_ngcontent-%COMP%]   .headline[_ngcontent-%COMP%] {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 40px;
}
section[_ngcontent-%COMP%]   .portfolio[_ngcontent-%COMP%]   .headline[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {
  font-family: "overpass", sans-serif;
  font-size: 23px;
}
@media (max-width: 850px) {
  section[_ngcontent-%COMP%]   .portfolio[_ngcontent-%COMP%]   .headline[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {
    text-align: center;
  }
}
section[_ngcontent-%COMP%]   .portfolio[_ngcontent-%COMP%]   .projects[_ngcontent-%COMP%] {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 96px;
  margin-top: 64px;
}
app-project[_ngcontent-%COMP%] {
  width: 100%;
}
@media (max-width: 430px) {
  h1[_ngcontent-%COMP%] {
    font-size: 36px;
  }
  section[_ngcontent-%COMP%]   .portfolio[_ngcontent-%COMP%] {
    width: 90%;
  }
  section[_ngcontent-%COMP%]   .portfolio[_ngcontent-%COMP%]   .headline[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {
    width: 90%;
  }
}`,
      ],
    }));
  let e = t;
  return e;
})();
var sr = (() => {
  let t = class t {
    constructor() {
      (this.headerDropDownState$ = new ne()),
        (this.headerAnimations$ = new ne()),
        (this.stateOfDropDown = !1),
        (this.onOtherPage = !1),
        (this.closeIconAnimation = !1),
        (this.menuIconAnimation = !1),
        this.headerDropDownState$.subscribe((n) => {
          this.stateOfDropDown = !this.stateOfDropDown;
        }),
        this.headerAnimations$.subscribe((n) => {
          (this.closeIconAnimation = !this.closeIconAnimation),
            this.closeIconAnimation ||
              ((this.menuIconAnimation = !this.menuIconAnimation),
              (this.closeIconAnimation = !this.closeIconAnimation));
        });
    }
  };
  (t.ɵfac = function (i) {
    return new (i || t)();
  }),
    (t.ɵprov = E({ token: t, factory: t.ɵfac, providedIn: "root" }));
  let e = t;
  return e;
})();
function SD(e, t) {
  e & 1 && (f(0, "a", 3)(1, "h1"), d(2, "\xDCber mich"), u()());
}
function OD(e, t) {
  e & 1 && (f(0, "a", 3)(1, "h1"), d(2, "About me"), u()());
}
function TD(e, t) {
  e & 1 && (f(0, "a", 5)(1, "h1"), d(2, "Skills"), u()());
}
function PD(e, t) {
  e & 1 && (f(0, "a", 5)(1, "h1"), d(2, "My skills"), u()());
}
function AD(e, t) {
  if (e & 1) {
    let r = $e();
    f(0, "img", 12),
      X("click", function () {
        oe(r);
        let i = j();
        return se(i.translatePage());
      }),
      u();
  }
}
function ND(e, t) {
  if (e & 1) {
    let r = $e();
    f(0, "img", 13),
      X("click", function () {
        oe(r);
        let i = j();
        return se(i.translatePage());
      }),
      u();
  }
}
var hp = (() => {
  let t = class t {
    constructor() {
      (this.headerDropDownService = v(sr)),
        (this.translateService = v(de)),
        (this.animate = !1);
    }
    closeDropDownMenu() {
      this.headerDropDownService.headerDropDownState$.next(!1),
        this.headerDropDownService.headerAnimations$.next(!1);
    }
    translatePage() {
      this.translateService.stateOfTranslation$.next(!0);
    }
  };
  (t.ɵfac = function (i) {
    return new (i || t)();
  }),
    (t.ɵcmp = G({
      type: t,
      selectors: [["app-dropdown-menu"]],
      standalone: !0,
      features: [W],
      decls: 23,
      vars: 3,
      consts: [
        [1, "menu"],
        [1, "top"],
        [
          "data-aos",
          "fade-right",
          "data-aos-duration",
          "1000",
          1,
          "link-container",
          3,
          "click",
        ],
        ["href", "#aboutMe"],
        [
          "data-aos",
          "fade-left",
          "data-aos-delay",
          "150",
          "data-aos-duration",
          "1000",
          1,
          "link-container",
          3,
          "click",
        ],
        ["href", "#mySkills"],
        [
          "data-aos",
          "fade-right",
          "data-aos-delay",
          "250",
          "data-aos-duration",
          "1000",
          1,
          "link-container",
          3,
          "click",
        ],
        ["href", "#portfolio"],
        [1, "bottom"],
        [
          "data-aos",
          "fade-up",
          "data-aos-delay",
          "300",
          "data-aos-duration",
          "1200",
          "data-aos-offset",
          "-200",
          3,
          "click",
        ],
        ["href", "#contact"],
        ["src", "assets/icons/flag_UK.svg", "alt", ""],
        ["src", "assets/icons/flag_UK.svg", "alt", "", 3, "click"],
        ["src", "assets/icons/flag_germany.svg", "alt", "", 3, "click"],
      ],
      template: function (i, o) {
        i & 1 &&
          (f(0, "section")(1, "div", 0)(2, "div", 1)(3, "div", 2),
          X("click", function () {
            return o.closeDropDownMenu();
          }),
          k(4, SD, 3, 0, "a", 3)(5, OD, 3, 0),
          b(6, "div"),
          u(),
          f(7, "div", 4),
          X("click", function () {
            return o.closeDropDownMenu();
          }),
          k(8, TD, 3, 0, "a", 5)(9, PD, 3, 0),
          b(10, "div"),
          u(),
          f(11, "div", 6),
          X("click", function () {
            return o.closeDropDownMenu();
          }),
          f(12, "a", 7)(13, "h1"),
          d(14, "Portfolio"),
          u()(),
          b(15, "div"),
          u()(),
          f(16, "div", 8)(17, "div", 9),
          X("click", function () {
            return o.closeDropDownMenu();
          }),
          f(18, "a", 10)(19, "h1"),
          d(20, "Say Hi!"),
          u()(),
          k(21, AD, 1, 0, "img", 11)(22, ND, 1, 0),
          u()()()()),
          i & 2 &&
            (y(4),
            V(4, o.translateService.translated ? 5 : 4),
            y(4),
            V(8, o.translateService.translated ? 9 : 8),
            y(13),
            V(21, o.translateService.translated ? 22 : 21));
      },
      styles: [
        `

*[_ngcontent-%COMP%] {
  margin: 0;
  padding: 0;
}
html[_ngcontent-%COMP%] {
  scroll-behavior: smooth;
}
body[_ngcontent-%COMP%] {
  background-color: #fffcf3;
}
a[_ngcontent-%COMP%] {
  text-decoration: none;
  color: black;
}
.btn[_ngcontent-%COMP%] {
  cursor: pointer;
  border-style: unset;
  border: 4px solid black;
  padding: 20px 60px;
  font-family: "Overpass", sans-serif;
  font-size: 23px;
  background-color: #fffcf3;
  transition: all 0.125s ease-in-out;
}
.btn[_ngcontent-%COMP%]:hover {
  padding: 20px 80px;
  font-weight: 700;
}
.btn[_ngcontent-%COMP%]:active {
  background-color: black;
  color: #fffcf3;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar {
  height: 10px;
  width: 5px;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-track {
  border-radius: 5px;
  background-color: #dfe9eb;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-track:hover {
  background-color: #b8c0c2;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-track:active {
  background-color: #b8c0c2;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: #5987ff;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:hover {
  background-color: #396eff;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:active {
  background-color: #396eff;
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 400;
  src: url("./media/syne-v22-latin-regular-6UTYI6IK.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 500;
  src: url("./media/syne-v22-latin-500-DLSUZYMP.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 600;
  src: url("./media/syne-v22-latin-600-2OMFULSK.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 700;
  src: url("./media/syne-v22-latin-700-7MWUTDCM.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 800;
  src: url("./media/syne-v22-latin-800-5SEF6UHE.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 100;
  src: url("./media/overpass-v13-latin-100-7H57N2W4.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 100;
  src: url("./media/overpass-v13-latin-100italic-TTK663FB.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 200;
  src: url("./media/overpass-v13-latin-200-MKKXNLZT.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 200;
  src: url("./media/overpass-v13-latin-200italic-UUSYSIGK.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 300;
  src: url("./media/overpass-v13-latin-300-Z3DUN6DK.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 300;
  src: url("./media/overpass-v13-latin-300italic-E7DYAHJT.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 400;
  src: url("./media/overpass-v13-latin-regular-ZK77XNQQ.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 400;
  src: url("./media/overpass-v13-latin-italic-CQLYFGT5.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 500;
  src: url("./media/overpass-v13-latin-500-5JQXFN7P.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 500;
  src: url("./media/overpass-v13-latin-500italic-HBJHAJTP.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 600;
  src: url("./media/overpass-v13-latin-600-43COUMYV.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 600;
  src: url("./media/overpass-v13-latin-600italic-XVZTHGMT.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 700;
  src: url("./media/overpass-v13-latin-700-EGTGNMPW.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 700;
  src: url("./media/overpass-v13-latin-700italic-37TJZGGR.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 800;
  src: url("./media/overpass-v13-latin-800-MNY6LLUS.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 800;
  src: url("./media/overpass-v13-latin-800italic-G2IFGHUZ.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 900;
  src: url("./media/overpass-v13-latin-900-DS3PFZN2.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 900;
  src: url("./media/overpass-v13-latin-900italic-HWYZS623.woff2") format("woff2");
}
section[_ngcontent-%COMP%] {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0;
}
section[_ngcontent-%COMP%]   .menu[_ngcontent-%COMP%] {
  position: relative;
  width: 100%;
  margin-top: 100px;
  height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0;
}
section[_ngcontent-%COMP%]   .menu[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {
  font-family: "Syne", sans-serif;
  font-size: 80px;
  font-weight: 700;
}
@media (max-width: 1100px) {
  section[_ngcontent-%COMP%]   .menu[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {
    font-size: 68px;
  }
}
@media (max-width: 660px) {
  section[_ngcontent-%COMP%]   .menu[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {
    font-size: 56px;
  }
}
section[_ngcontent-%COMP%]   .menu[_ngcontent-%COMP%]   .top[_ngcontent-%COMP%] {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 64px;
  text-align: center;
  flex: 1;
  position: relative;
  height: 300px;
  width: 100%;
  background-image: linear-gradient(#fffcf3, #fffcf3);
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - 5vw));
  z-index: 2;
}
.bottom[_ngcontent-%COMP%] {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  gap: 0;
  background-color: black;
  width: 100%;
  padding: 200px 0 24px 0;
  margin-top: -224px;
}
@media (max-width: 1100px) {
  .bottom[_ngcontent-%COMP%] {
    margin-top: -200px;
  }
}
@media (max-width: 660px) {
  .bottom[_ngcontent-%COMP%] {
    margin-top: -192px;
  }
}
.bottom[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 0;
  width: 90%;
  max-width: 1920px;
  margin-left: auto;
  margin-right: auto;
  z-index: 1;
}
.bottom[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {
  color: #fffcf3;
}
.bottom[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {
  font-weight: 800;
  font-size: 96px;
}
@media (max-width: 1100px) {
  .bottom[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {
    font-size: 78px;
  }
}
@media (max-width: 660px) {
  .bottom[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {
    font-size: 64px;
  }
}
@media (max-width: 540px) {
  .bottom[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {
    font-size: 56px;
  }
}
.bottom[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]:hover {
  color: #5987ff;
}
.bottom[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]    > img[_ngcontent-%COMP%] {
  cursor: pointer;
  width: 48px;
  align-self: flex-end;
  margin-bottom: 16px;
  filter: grayscale(1);
  transition: all 0.25s ease-in-out;
}
.bottom[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]    > img[_ngcontent-%COMP%]:hover {
  transform: scale(1.15);
  filter: grayscale(0);
}
.link-container[_ngcontent-%COMP%] {
  position: relative;
  width: 40vw;
  max-width: 500px;
}
@media (max-width: 930px) {
  .link-container[_ngcontent-%COMP%] {
    width: 55vh;
    max-width: 55vh;
  }
}
@media (max-width: 660px) {
  .link-container[_ngcontent-%COMP%] {
    width: 40vh;
    max-width: 40vh;
  }
}
@media (max-width: 540px) {
  .link-container[_ngcontent-%COMP%] {
    max-width: 35vh;
    width: 35vh;
  }
}
.link-container[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {
  border-left: 4px solid black;
  position: absolute;
  height: 40%;
  width: 7%;
  bottom: -22px;
  left: -32px;
  border-bottom: 4px solid black;
  transition: all 1s;
}
.link-container[_ngcontent-%COMP%]:hover   div[_ngcontent-%COMP%] {
  animation: _ngcontent-%COMP%_hoverInAnimation 0.6s 1;
  height: 0;
  width: 45%;
  left: 50%;
}
.hover-in-animation[_ngcontent-%COMP%] {
  animation: _ngcontent-%COMP%_hoverInAnimation 1s 1;
  animation-fill-mode: forwards;
}
@keyframes _ngcontent-%COMP%_hoverInAnimation {
  0% {
    height: 40%;
    width: 7%;
    left: -32px;
  }
  50% {
    height: 0px;
    width: 50%;
  }
  100% {
    height: 0px;
    width: 45%;
    left: 50%;
  }
}
@media (max-width: 430px) {
  section[_ngcontent-%COMP%]   .menu[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {
    font-size: 36px;
  }
  .bottom[_ngcontent-%COMP%] {
    margin-top: -160px;
  }
  .bottom[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {
    font-size: 40px;
  }
  .bottom[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]    > img[_ngcontent-%COMP%] {
    width: 32px;
    align-self: center;
  }
  .link-container[_ngcontent-%COMP%] {
    width: 55%;
  }
}
@media (max-height: 800px) {
  section[_ngcontent-%COMP%]   .menu[_ngcontent-%COMP%]   .top[_ngcontent-%COMP%] {
    justify-content: flex-start;
  }
}`,
      ],
    }));
  let e = t;
  return e;
})();
var bp = (() => {
    let t = class t {
      constructor(n, i) {
        (this._renderer = n),
          (this._elementRef = i),
          (this.onChange = (o) => {}),
          (this.onTouched = () => {});
      }
      setProperty(n, i) {
        this._renderer.setProperty(this._elementRef.nativeElement, n, i);
      }
      registerOnTouched(n) {
        this.onTouched = n;
      }
      registerOnChange(n) {
        this.onChange = n;
      }
      setDisabledState(n) {
        this.setProperty("disabled", n);
      }
    };
    (t.ɵfac = function (i) {
      return new (i || t)(Q(on), Q(Lt));
    }),
      (t.ɵdir = ce({ type: t }));
    let e = t;
    return e;
  })(),
  Dp = (() => {
    let t = class t extends bp {};
    (t.ɵfac = (() => {
      let n;
      return function (o) {
        return (n || (n = ot(t)))(o || t);
      };
    })()),
      (t.ɵdir = ce({ type: t, features: [ke] }));
    let e = t;
    return e;
  })(),
  xc = new x(""),
  kD = { provide: xc, useExisting: Ye(() => Ic), multi: !0 },
  Ic = (() => {
    let t = class t extends Dp {
      writeValue(n) {
        this.setProperty("checked", n);
      }
    };
    (t.ɵfac = (() => {
      let n;
      return function (o) {
        return (n || (n = ot(t)))(o || t);
      };
    })()),
      (t.ɵdir = ce({
        type: t,
        selectors: [
          ["input", "type", "checkbox", "formControlName", ""],
          ["input", "type", "checkbox", "formControl", ""],
          ["input", "type", "checkbox", "ngModel", ""],
        ],
        hostBindings: function (i, o) {
          i & 1 &&
            X("change", function (a) {
              return o.onChange(a.target.checked);
            })("blur", function () {
              return o.onTouched();
            });
        },
        features: [bt([kD]), ke],
      }));
    let e = t;
    return e;
  })(),
  FD = { provide: xc, useExisting: Ye(() => fs), multi: !0 };
function RD() {
  let e = _t() ? _t().getUserAgent() : "";
  return /android (\d+)/.test(e.toLowerCase());
}
var LD = new x(""),
  fs = (() => {
    let t = class t extends bp {
      constructor(n, i, o) {
        super(n, i),
          (this._compositionMode = o),
          (this._composing = !1),
          this._compositionMode == null && (this._compositionMode = !RD());
      }
      writeValue(n) {
        let i = n ?? "";
        this.setProperty("value", i);
      }
      _handleInput(n) {
        (!this._compositionMode ||
          (this._compositionMode && !this._composing)) &&
          this.onChange(n);
      }
      _compositionStart() {
        this._composing = !0;
      }
      _compositionEnd(n) {
        (this._composing = !1), this._compositionMode && this.onChange(n);
      }
    };
    (t.ɵfac = function (i) {
      return new (i || t)(Q(on), Q(Lt), Q(LD, 8));
    }),
      (t.ɵdir = ce({
        type: t,
        selectors: [
          ["input", "formControlName", "", 3, "type", "checkbox"],
          ["textarea", "formControlName", ""],
          ["input", "formControl", "", 3, "type", "checkbox"],
          ["textarea", "formControl", ""],
          ["input", "ngModel", "", 3, "type", "checkbox"],
          ["textarea", "ngModel", ""],
          ["", "ngDefaultControl", ""],
        ],
        hostBindings: function (i, o) {
          i & 1 &&
            X("input", function (a) {
              return o._handleInput(a.target.value);
            })("blur", function () {
              return o.onTouched();
            })("compositionstart", function () {
              return o._compositionStart();
            })("compositionend", function (a) {
              return o._compositionEnd(a.target.value);
            });
        },
        features: [bt([FD]), ke],
      }));
    let e = t;
    return e;
  })();
function Sc(e) {
  return (
    e == null || ((typeof e == "string" || Array.isArray(e)) && e.length === 0)
  );
}
function VD(e) {
  return e != null && typeof e.length == "number";
}
var cr = new x(""),
  _p = new x("");
function jD(e) {
  return Sc(e.value) ? { required: !0 } : null;
}
function zD(e) {
  return e.value === !0 ? null : { required: !0 };
}
function UD(e) {
  return (t) =>
    Sc(t.value) || !VD(t.value)
      ? null
      : t.value.length < e
      ? { minlength: { requiredLength: e, actualLength: t.value.length } }
      : null;
}
function BD(e) {
  if (!e) return Mc;
  let t, r;
  return (
    typeof e == "string"
      ? ((r = ""),
        e.charAt(0) !== "^" && (r += "^"),
        (r += e),
        e.charAt(e.length - 1) !== "$" && (r += "$"),
        (t = new RegExp(r)))
      : ((r = e.toString()), (t = e)),
    (n) => {
      if (Sc(n.value)) return null;
      let i = n.value;
      return t.test(i)
        ? null
        : { pattern: { requiredPattern: r, actualValue: i } };
    }
  );
}
function Mc(e) {
  return null;
}
function Mp(e) {
  return e != null;
}
function Ep(e) {
  return an(e) ? J(e) : e;
}
function xp(e) {
  let t = {};
  return (
    e.forEach((r) => {
      t = r != null ? C(C({}, t), r) : t;
    }),
    Object.keys(t).length === 0 ? null : t
  );
}
function Ip(e, t) {
  return t.map((r) => r(e));
}
function $D(e) {
  return !e.validate;
}
function Sp(e) {
  return e.map((t) => ($D(t) ? t : (r) => t.validate(r)));
}
function HD(e) {
  if (!e) return null;
  let t = e.filter(Mp);
  return t.length == 0
    ? null
    : function (r) {
        return xp(Ip(r, t));
      };
}
function Oc(e) {
  return e != null ? HD(Sp(e)) : null;
}
function GD(e) {
  if (!e) return null;
  let t = e.filter(Mp);
  return t.length == 0
    ? null
    : function (r) {
        let n = Ip(r, t).map(Ep);
        return As(n).pipe(A(xp));
      };
}
function Tc(e) {
  return e != null ? GD(Sp(e)) : null;
}
function pp(e, t) {
  return e === null ? [t] : Array.isArray(e) ? [...e, t] : [e, t];
}
function WD(e) {
  return e._rawValidators;
}
function qD(e) {
  return e._rawAsyncValidators;
}
function Ec(e) {
  return e ? (Array.isArray(e) ? e : [e]) : [];
}
function as(e, t) {
  return Array.isArray(e) ? e.includes(t) : e === t;
}
function gp(e, t) {
  let r = Ec(t);
  return (
    Ec(e).forEach((i) => {
      as(r, i) || r.push(i);
    }),
    r
  );
}
function mp(e, t) {
  return Ec(t).filter((r) => !as(e, r));
}
var ls = class {
    constructor() {
      (this._rawValidators = []),
        (this._rawAsyncValidators = []),
        (this._onDestroyCallbacks = []);
    }
    get value() {
      return this.control ? this.control.value : null;
    }
    get valid() {
      return this.control ? this.control.valid : null;
    }
    get invalid() {
      return this.control ? this.control.invalid : null;
    }
    get pending() {
      return this.control ? this.control.pending : null;
    }
    get disabled() {
      return this.control ? this.control.disabled : null;
    }
    get enabled() {
      return this.control ? this.control.enabled : null;
    }
    get errors() {
      return this.control ? this.control.errors : null;
    }
    get pristine() {
      return this.control ? this.control.pristine : null;
    }
    get dirty() {
      return this.control ? this.control.dirty : null;
    }
    get touched() {
      return this.control ? this.control.touched : null;
    }
    get status() {
      return this.control ? this.control.status : null;
    }
    get untouched() {
      return this.control ? this.control.untouched : null;
    }
    get statusChanges() {
      return this.control ? this.control.statusChanges : null;
    }
    get valueChanges() {
      return this.control ? this.control.valueChanges : null;
    }
    get path() {
      return null;
    }
    _setValidators(t) {
      (this._rawValidators = t || []),
        (this._composedValidatorFn = Oc(this._rawValidators));
    }
    _setAsyncValidators(t) {
      (this._rawAsyncValidators = t || []),
        (this._composedAsyncValidatorFn = Tc(this._rawAsyncValidators));
    }
    get validator() {
      return this._composedValidatorFn || null;
    }
    get asyncValidator() {
      return this._composedAsyncValidatorFn || null;
    }
    _registerOnDestroy(t) {
      this._onDestroyCallbacks.push(t);
    }
    _invokeOnDestroyCallbacks() {
      this._onDestroyCallbacks.forEach((t) => t()),
        (this._onDestroyCallbacks = []);
    }
    reset(t = void 0) {
      this.control && this.control.reset(t);
    }
    hasError(t, r) {
      return this.control ? this.control.hasError(t, r) : !1;
    }
    getError(t, r) {
      return this.control ? this.control.getError(t, r) : null;
    }
  },
  lr = class extends ls {
    get formDirective() {
      return null;
    }
    get path() {
      return null;
    }
  },
  ai = class extends ls {
    constructor() {
      super(...arguments),
        (this._parent = null),
        (this.name = null),
        (this.valueAccessor = null);
    }
  },
  cs = class {
    constructor(t) {
      this._cd = t;
    }
    get isTouched() {
      return !!this._cd?.control?.touched;
    }
    get isUntouched() {
      return !!this._cd?.control?.untouched;
    }
    get isPristine() {
      return !!this._cd?.control?.pristine;
    }
    get isDirty() {
      return !!this._cd?.control?.dirty;
    }
    get isValid() {
      return !!this._cd?.control?.valid;
    }
    get isInvalid() {
      return !!this._cd?.control?.invalid;
    }
    get isPending() {
      return !!this._cd?.control?.pending;
    }
    get isSubmitted() {
      return !!this._cd?.submitted;
    }
  },
  ZD = {
    "[class.ng-untouched]": "isUntouched",
    "[class.ng-touched]": "isTouched",
    "[class.ng-pristine]": "isPristine",
    "[class.ng-dirty]": "isDirty",
    "[class.ng-valid]": "isValid",
    "[class.ng-invalid]": "isInvalid",
    "[class.ng-pending]": "isPending",
  },
  CP = K(C({}, ZD), { "[class.ng-submitted]": "isSubmitted" }),
  Op = (() => {
    let t = class t extends cs {
      constructor(n) {
        super(n);
      }
    };
    (t.ɵfac = function (i) {
      return new (i || t)(Q(ai, 2));
    }),
      (t.ɵdir = ce({
        type: t,
        selectors: [
          ["", "formControlName", ""],
          ["", "ngModel", ""],
          ["", "formControl", ""],
        ],
        hostVars: 14,
        hostBindings: function (i, o) {
          i & 2 &&
            wt("ng-untouched", o.isUntouched)("ng-touched", o.isTouched)(
              "ng-pristine",
              o.isPristine
            )("ng-dirty", o.isDirty)("ng-valid", o.isValid)(
              "ng-invalid",
              o.isInvalid
            )("ng-pending", o.isPending);
        },
        features: [ke],
      }));
    let e = t;
    return e;
  })(),
  Tp = (() => {
    let t = class t extends cs {
      constructor(n) {
        super(n);
      }
    };
    (t.ɵfac = function (i) {
      return new (i || t)(Q(lr, 10));
    }),
      (t.ɵdir = ce({
        type: t,
        selectors: [
          ["", "formGroupName", ""],
          ["", "formArrayName", ""],
          ["", "ngModelGroup", ""],
          ["", "formGroup", ""],
          ["form", 3, "ngNoForm", ""],
          ["", "ngForm", ""],
        ],
        hostVars: 16,
        hostBindings: function (i, o) {
          i & 2 &&
            wt("ng-untouched", o.isUntouched)("ng-touched", o.isTouched)(
              "ng-pristine",
              o.isPristine
            )("ng-dirty", o.isDirty)("ng-valid", o.isValid)(
              "ng-invalid",
              o.isInvalid
            )("ng-pending", o.isPending)("ng-submitted", o.isSubmitted);
        },
        features: [ke],
      }));
    let e = t;
    return e;
  })();
var ii = "VALID",
  ss = "INVALID",
  ar = "PENDING",
  oi = "DISABLED";
function Pp(e) {
  return (hs(e) ? e.validators : e) || null;
}
function KD(e) {
  return Array.isArray(e) ? Oc(e) : e || null;
}
function Ap(e, t) {
  return (hs(t) ? t.asyncValidators : e) || null;
}
function YD(e) {
  return Array.isArray(e) ? Tc(e) : e || null;
}
function hs(e) {
  return e != null && !Array.isArray(e) && typeof e == "object";
}
function QD(e, t, r) {
  let n = e.controls;
  if (!(t ? Object.keys(n) : n).length) throw new M(1e3, "");
  if (!n[r]) throw new M(1001, "");
}
function JD(e, t, r) {
  e._forEachChild((n, i) => {
    if (r[i] === void 0) throw new M(1002, "");
  });
}
var us = class {
    constructor(t, r) {
      (this._pendingDirty = !1),
        (this._hasOwnPendingAsyncValidator = !1),
        (this._pendingTouched = !1),
        (this._onCollectionChange = () => {}),
        (this._parent = null),
        (this.pristine = !0),
        (this.touched = !1),
        (this._onDisabledChange = []),
        this._assignValidators(t),
        this._assignAsyncValidators(r);
    }
    get validator() {
      return this._composedValidatorFn;
    }
    set validator(t) {
      this._rawValidators = this._composedValidatorFn = t;
    }
    get asyncValidator() {
      return this._composedAsyncValidatorFn;
    }
    set asyncValidator(t) {
      this._rawAsyncValidators = this._composedAsyncValidatorFn = t;
    }
    get parent() {
      return this._parent;
    }
    get valid() {
      return this.status === ii;
    }
    get invalid() {
      return this.status === ss;
    }
    get pending() {
      return this.status == ar;
    }
    get disabled() {
      return this.status === oi;
    }
    get enabled() {
      return this.status !== oi;
    }
    get dirty() {
      return !this.pristine;
    }
    get untouched() {
      return !this.touched;
    }
    get updateOn() {
      return this._updateOn
        ? this._updateOn
        : this.parent
        ? this.parent.updateOn
        : "change";
    }
    setValidators(t) {
      this._assignValidators(t);
    }
    setAsyncValidators(t) {
      this._assignAsyncValidators(t);
    }
    addValidators(t) {
      this.setValidators(gp(t, this._rawValidators));
    }
    addAsyncValidators(t) {
      this.setAsyncValidators(gp(t, this._rawAsyncValidators));
    }
    removeValidators(t) {
      this.setValidators(mp(t, this._rawValidators));
    }
    removeAsyncValidators(t) {
      this.setAsyncValidators(mp(t, this._rawAsyncValidators));
    }
    hasValidator(t) {
      return as(this._rawValidators, t);
    }
    hasAsyncValidator(t) {
      return as(this._rawAsyncValidators, t);
    }
    clearValidators() {
      this.validator = null;
    }
    clearAsyncValidators() {
      this.asyncValidator = null;
    }
    markAsTouched(t = {}) {
      (this.touched = !0),
        this._parent && !t.onlySelf && this._parent.markAsTouched(t);
    }
    markAllAsTouched() {
      this.markAsTouched({ onlySelf: !0 }),
        this._forEachChild((t) => t.markAllAsTouched());
    }
    markAsUntouched(t = {}) {
      (this.touched = !1),
        (this._pendingTouched = !1),
        this._forEachChild((r) => {
          r.markAsUntouched({ onlySelf: !0 });
        }),
        this._parent && !t.onlySelf && this._parent._updateTouched(t);
    }
    markAsDirty(t = {}) {
      (this.pristine = !1),
        this._parent && !t.onlySelf && this._parent.markAsDirty(t);
    }
    markAsPristine(t = {}) {
      (this.pristine = !0),
        (this._pendingDirty = !1),
        this._forEachChild((r) => {
          r.markAsPristine({ onlySelf: !0 });
        }),
        this._parent && !t.onlySelf && this._parent._updatePristine(t);
    }
    markAsPending(t = {}) {
      (this.status = ar),
        t.emitEvent !== !1 && this.statusChanges.emit(this.status),
        this._parent && !t.onlySelf && this._parent.markAsPending(t);
    }
    disable(t = {}) {
      let r = this._parentMarkedDirty(t.onlySelf);
      (this.status = oi),
        (this.errors = null),
        this._forEachChild((n) => {
          n.disable(K(C({}, t), { onlySelf: !0 }));
        }),
        this._updateValue(),
        t.emitEvent !== !1 &&
          (this.valueChanges.emit(this.value),
          this.statusChanges.emit(this.status)),
        this._updateAncestors(K(C({}, t), { skipPristineCheck: r })),
        this._onDisabledChange.forEach((n) => n(!0));
    }
    enable(t = {}) {
      let r = this._parentMarkedDirty(t.onlySelf);
      (this.status = ii),
        this._forEachChild((n) => {
          n.enable(K(C({}, t), { onlySelf: !0 }));
        }),
        this.updateValueAndValidity({ onlySelf: !0, emitEvent: t.emitEvent }),
        this._updateAncestors(K(C({}, t), { skipPristineCheck: r })),
        this._onDisabledChange.forEach((n) => n(!1));
    }
    _updateAncestors(t) {
      this._parent &&
        !t.onlySelf &&
        (this._parent.updateValueAndValidity(t),
        t.skipPristineCheck || this._parent._updatePristine(),
        this._parent._updateTouched());
    }
    setParent(t) {
      this._parent = t;
    }
    getRawValue() {
      return this.value;
    }
    updateValueAndValidity(t = {}) {
      this._setInitialStatus(),
        this._updateValue(),
        this.enabled &&
          (this._cancelExistingSubscription(),
          (this.errors = this._runValidator()),
          (this.status = this._calculateStatus()),
          (this.status === ii || this.status === ar) &&
            this._runAsyncValidator(t.emitEvent)),
        t.emitEvent !== !1 &&
          (this.valueChanges.emit(this.value),
          this.statusChanges.emit(this.status)),
        this._parent && !t.onlySelf && this._parent.updateValueAndValidity(t);
    }
    _updateTreeValidity(t = { emitEvent: !0 }) {
      this._forEachChild((r) => r._updateTreeValidity(t)),
        this.updateValueAndValidity({ onlySelf: !0, emitEvent: t.emitEvent });
    }
    _setInitialStatus() {
      this.status = this._allControlsDisabled() ? oi : ii;
    }
    _runValidator() {
      return this.validator ? this.validator(this) : null;
    }
    _runAsyncValidator(t) {
      if (this.asyncValidator) {
        (this.status = ar), (this._hasOwnPendingAsyncValidator = !0);
        let r = Ep(this.asyncValidator(this));
        this._asyncValidationSubscription = r.subscribe((n) => {
          (this._hasOwnPendingAsyncValidator = !1),
            this.setErrors(n, { emitEvent: t });
        });
      }
    }
    _cancelExistingSubscription() {
      this._asyncValidationSubscription &&
        (this._asyncValidationSubscription.unsubscribe(),
        (this._hasOwnPendingAsyncValidator = !1));
    }
    setErrors(t, r = {}) {
      (this.errors = t), this._updateControlsErrors(r.emitEvent !== !1);
    }
    get(t) {
      let r = t;
      return r == null ||
        (Array.isArray(r) || (r = r.split(".")), r.length === 0)
        ? null
        : r.reduce((n, i) => n && n._find(i), this);
    }
    getError(t, r) {
      let n = r ? this.get(r) : this;
      return n && n.errors ? n.errors[t] : null;
    }
    hasError(t, r) {
      return !!this.getError(t, r);
    }
    get root() {
      let t = this;
      for (; t._parent; ) t = t._parent;
      return t;
    }
    _updateControlsErrors(t) {
      (this.status = this._calculateStatus()),
        t && this.statusChanges.emit(this.status),
        this._parent && this._parent._updateControlsErrors(t);
    }
    _initObservables() {
      (this.valueChanges = new ve()), (this.statusChanges = new ve());
    }
    _calculateStatus() {
      return this._allControlsDisabled()
        ? oi
        : this.errors
        ? ss
        : this._hasOwnPendingAsyncValidator || this._anyControlsHaveStatus(ar)
        ? ar
        : this._anyControlsHaveStatus(ss)
        ? ss
        : ii;
    }
    _anyControlsHaveStatus(t) {
      return this._anyControls((r) => r.status === t);
    }
    _anyControlsDirty() {
      return this._anyControls((t) => t.dirty);
    }
    _anyControlsTouched() {
      return this._anyControls((t) => t.touched);
    }
    _updatePristine(t = {}) {
      (this.pristine = !this._anyControlsDirty()),
        this._parent && !t.onlySelf && this._parent._updatePristine(t);
    }
    _updateTouched(t = {}) {
      (this.touched = this._anyControlsTouched()),
        this._parent && !t.onlySelf && this._parent._updateTouched(t);
    }
    _registerOnCollectionChange(t) {
      this._onCollectionChange = t;
    }
    _setUpdateStrategy(t) {
      hs(t) && t.updateOn != null && (this._updateOn = t.updateOn);
    }
    _parentMarkedDirty(t) {
      let r = this._parent && this._parent.dirty;
      return !t && !!r && !this._parent._anyControlsDirty();
    }
    _find(t) {
      return null;
    }
    _assignValidators(t) {
      (this._rawValidators = Array.isArray(t) ? t.slice() : t),
        (this._composedValidatorFn = KD(this._rawValidators));
    }
    _assignAsyncValidators(t) {
      (this._rawAsyncValidators = Array.isArray(t) ? t.slice() : t),
        (this._composedAsyncValidatorFn = YD(this._rawAsyncValidators));
    }
  },
  ds = class extends us {
    constructor(t, r, n) {
      super(Pp(r), Ap(n, r)),
        (this.controls = t),
        this._initObservables(),
        this._setUpdateStrategy(r),
        this._setUpControls(),
        this.updateValueAndValidity({
          onlySelf: !0,
          emitEvent: !!this.asyncValidator,
        });
    }
    registerControl(t, r) {
      return this.controls[t]
        ? this.controls[t]
        : ((this.controls[t] = r),
          r.setParent(this),
          r._registerOnCollectionChange(this._onCollectionChange),
          r);
    }
    addControl(t, r, n = {}) {
      this.registerControl(t, r),
        this.updateValueAndValidity({ emitEvent: n.emitEvent }),
        this._onCollectionChange();
    }
    removeControl(t, r = {}) {
      this.controls[t] &&
        this.controls[t]._registerOnCollectionChange(() => {}),
        delete this.controls[t],
        this.updateValueAndValidity({ emitEvent: r.emitEvent }),
        this._onCollectionChange();
    }
    setControl(t, r, n = {}) {
      this.controls[t] &&
        this.controls[t]._registerOnCollectionChange(() => {}),
        delete this.controls[t],
        r && this.registerControl(t, r),
        this.updateValueAndValidity({ emitEvent: n.emitEvent }),
        this._onCollectionChange();
    }
    contains(t) {
      return this.controls.hasOwnProperty(t) && this.controls[t].enabled;
    }
    setValue(t, r = {}) {
      JD(this, !0, t),
        Object.keys(t).forEach((n) => {
          QD(this, !0, n),
            this.controls[n].setValue(t[n], {
              onlySelf: !0,
              emitEvent: r.emitEvent,
            });
        }),
        this.updateValueAndValidity(r);
    }
    patchValue(t, r = {}) {
      t != null &&
        (Object.keys(t).forEach((n) => {
          let i = this.controls[n];
          i && i.patchValue(t[n], { onlySelf: !0, emitEvent: r.emitEvent });
        }),
        this.updateValueAndValidity(r));
    }
    reset(t = {}, r = {}) {
      this._forEachChild((n, i) => {
        n.reset(t ? t[i] : null, { onlySelf: !0, emitEvent: r.emitEvent });
      }),
        this._updatePristine(r),
        this._updateTouched(r),
        this.updateValueAndValidity(r);
    }
    getRawValue() {
      return this._reduceChildren(
        {},
        (t, r, n) => ((t[n] = r.getRawValue()), t)
      );
    }
    _syncPendingControls() {
      let t = this._reduceChildren(!1, (r, n) =>
        n._syncPendingControls() ? !0 : r
      );
      return t && this.updateValueAndValidity({ onlySelf: !0 }), t;
    }
    _forEachChild(t) {
      Object.keys(this.controls).forEach((r) => {
        let n = this.controls[r];
        n && t(n, r);
      });
    }
    _setUpControls() {
      this._forEachChild((t) => {
        t.setParent(this),
          t._registerOnCollectionChange(this._onCollectionChange);
      });
    }
    _updateValue() {
      this.value = this._reduceValue();
    }
    _anyControls(t) {
      for (let [r, n] of Object.entries(this.controls))
        if (this.contains(r) && t(n)) return !0;
      return !1;
    }
    _reduceValue() {
      let t = {};
      return this._reduceChildren(
        t,
        (r, n, i) => ((n.enabled || this.disabled) && (r[i] = n.value), r)
      );
    }
    _reduceChildren(t, r) {
      let n = t;
      return (
        this._forEachChild((i, o) => {
          n = r(n, i, o);
        }),
        n
      );
    }
    _allControlsDisabled() {
      for (let t of Object.keys(this.controls))
        if (this.controls[t].enabled) return !1;
      return Object.keys(this.controls).length > 0 || this.disabled;
    }
    _find(t) {
      return this.controls.hasOwnProperty(t) ? this.controls[t] : null;
    }
  };
var Pc = new x("CallSetDisabledState", {
    providedIn: "root",
    factory: () => Ac,
  }),
  Ac = "always";
function XD(e, t) {
  return [...t.path, e];
}
function Np(e, t, r = Ac) {
  kp(e, t),
    t.valueAccessor.writeValue(e.value),
    (e.disabled || r === "always") &&
      t.valueAccessor.setDisabledState?.(e.disabled),
    t_(e, t),
    r_(e, t),
    n_(e, t),
    e_(e, t);
}
function vp(e, t) {
  e.forEach((r) => {
    r.registerOnValidatorChange && r.registerOnValidatorChange(t);
  });
}
function e_(e, t) {
  if (t.valueAccessor.setDisabledState) {
    let r = (n) => {
      t.valueAccessor.setDisabledState(n);
    };
    e.registerOnDisabledChange(r),
      t._registerOnDestroy(() => {
        e._unregisterOnDisabledChange(r);
      });
  }
}
function kp(e, t) {
  let r = WD(e);
  t.validator !== null
    ? e.setValidators(pp(r, t.validator))
    : typeof r == "function" && e.setValidators([r]);
  let n = qD(e);
  t.asyncValidator !== null
    ? e.setAsyncValidators(pp(n, t.asyncValidator))
    : typeof n == "function" && e.setAsyncValidators([n]);
  let i = () => e.updateValueAndValidity();
  vp(t._rawValidators, i), vp(t._rawAsyncValidators, i);
}
function t_(e, t) {
  t.valueAccessor.registerOnChange((r) => {
    (e._pendingValue = r),
      (e._pendingChange = !0),
      (e._pendingDirty = !0),
      e.updateOn === "change" && Fp(e, t);
  });
}
function n_(e, t) {
  t.valueAccessor.registerOnTouched(() => {
    (e._pendingTouched = !0),
      e.updateOn === "blur" && e._pendingChange && Fp(e, t),
      e.updateOn !== "submit" && e.markAsTouched();
  });
}
function Fp(e, t) {
  e._pendingDirty && e.markAsDirty(),
    e.setValue(e._pendingValue, { emitModelToViewChange: !1 }),
    t.viewToModelUpdate(e._pendingValue),
    (e._pendingChange = !1);
}
function r_(e, t) {
  let r = (n, i) => {
    t.valueAccessor.writeValue(n), i && t.viewToModelUpdate(n);
  };
  e.registerOnChange(r),
    t._registerOnDestroy(() => {
      e._unregisterOnChange(r);
    });
}
function i_(e, t) {
  e == null, kp(e, t);
}
function o_(e, t) {
  if (!e.hasOwnProperty("model")) return !1;
  let r = e.model;
  return r.isFirstChange() ? !0 : !Object.is(t, r.currentValue);
}
function s_(e) {
  return Object.getPrototypeOf(e.constructor) === Dp;
}
function a_(e, t) {
  e._syncPendingControls(),
    t.forEach((r) => {
      let n = r.control;
      n.updateOn === "submit" &&
        n._pendingChange &&
        (r.viewToModelUpdate(n._pendingValue), (n._pendingChange = !1));
    });
}
function l_(e, t) {
  if (!t) return null;
  Array.isArray(t);
  let r, n, i;
  return (
    t.forEach((o) => {
      o.constructor === fs ? (r = o) : s_(o) ? (n = o) : (i = o);
    }),
    i || n || r || null
  );
}
var c_ = { provide: lr, useExisting: Ye(() => Nc) },
  si = Promise.resolve(),
  Nc = (() => {
    let t = class t extends lr {
      constructor(n, i, o) {
        super(),
          (this.callSetDisabledState = o),
          (this.submitted = !1),
          (this._directives = new Set()),
          (this.ngSubmit = new ve()),
          (this.form = new ds({}, Oc(n), Tc(i)));
      }
      ngAfterViewInit() {
        this._setUpdateStrategy();
      }
      get formDirective() {
        return this;
      }
      get control() {
        return this.form;
      }
      get path() {
        return [];
      }
      get controls() {
        return this.form.controls;
      }
      addControl(n) {
        si.then(() => {
          let i = this._findContainer(n.path);
          (n.control = i.registerControl(n.name, n.control)),
            Np(n.control, n, this.callSetDisabledState),
            n.control.updateValueAndValidity({ emitEvent: !1 }),
            this._directives.add(n);
        });
      }
      getControl(n) {
        return this.form.get(n.path);
      }
      removeControl(n) {
        si.then(() => {
          let i = this._findContainer(n.path);
          i && i.removeControl(n.name), this._directives.delete(n);
        });
      }
      addFormGroup(n) {
        si.then(() => {
          let i = this._findContainer(n.path),
            o = new ds({});
          i_(o, n),
            i.registerControl(n.name, o),
            o.updateValueAndValidity({ emitEvent: !1 });
        });
      }
      removeFormGroup(n) {
        si.then(() => {
          let i = this._findContainer(n.path);
          i && i.removeControl(n.name);
        });
      }
      getFormGroup(n) {
        return this.form.get(n.path);
      }
      updateModel(n, i) {
        si.then(() => {
          this.form.get(n.path).setValue(i);
        });
      }
      setValue(n) {
        this.control.setValue(n);
      }
      onSubmit(n) {
        return (
          (this.submitted = !0),
          a_(this.form, this._directives),
          this.ngSubmit.emit(n),
          n?.target?.method === "dialog"
        );
      }
      onReset() {
        this.resetForm();
      }
      resetForm(n = void 0) {
        this.form.reset(n), (this.submitted = !1);
      }
      _setUpdateStrategy() {
        this.options &&
          this.options.updateOn != null &&
          (this.form._updateOn = this.options.updateOn);
      }
      _findContainer(n) {
        return n.pop(), n.length ? this.form.get(n) : this.form;
      }
    };
    (t.ɵfac = function (i) {
      return new (i || t)(Q(cr, 10), Q(_p, 10), Q(Pc, 8));
    }),
      (t.ɵdir = ce({
        type: t,
        selectors: [
          ["form", 3, "ngNoForm", "", 3, "formGroup", ""],
          ["ng-form"],
          ["", "ngForm", ""],
        ],
        hostBindings: function (i, o) {
          i & 1 &&
            X("submit", function (a) {
              return o.onSubmit(a);
            })("reset", function () {
              return o.onReset();
            });
        },
        inputs: { options: [Me.None, "ngFormOptions", "options"] },
        outputs: { ngSubmit: "ngSubmit" },
        exportAs: ["ngForm"],
        features: [bt([c_]), ke],
      }));
    let e = t;
    return e;
  })();
function yp(e, t) {
  let r = e.indexOf(t);
  r > -1 && e.splice(r, 1);
}
function wp(e) {
  return (
    typeof e == "object" &&
    e !== null &&
    Object.keys(e).length === 2 &&
    "value" in e &&
    "disabled" in e
  );
}
var u_ = class extends us {
  constructor(t = null, r, n) {
    super(Pp(r), Ap(n, r)),
      (this.defaultValue = null),
      (this._onChange = []),
      (this._pendingChange = !1),
      this._applyFormState(t),
      this._setUpdateStrategy(r),
      this._initObservables(),
      this.updateValueAndValidity({
        onlySelf: !0,
        emitEvent: !!this.asyncValidator,
      }),
      hs(r) &&
        (r.nonNullable || r.initialValueIsDefault) &&
        (wp(t) ? (this.defaultValue = t.value) : (this.defaultValue = t));
  }
  setValue(t, r = {}) {
    (this.value = this._pendingValue = t),
      this._onChange.length &&
        r.emitModelToViewChange !== !1 &&
        this._onChange.forEach((n) =>
          n(this.value, r.emitViewToModelChange !== !1)
        ),
      this.updateValueAndValidity(r);
  }
  patchValue(t, r = {}) {
    this.setValue(t, r);
  }
  reset(t = this.defaultValue, r = {}) {
    this._applyFormState(t),
      this.markAsPristine(r),
      this.markAsUntouched(r),
      this.setValue(this.value, r),
      (this._pendingChange = !1);
  }
  _updateValue() {}
  _anyControls(t) {
    return !1;
  }
  _allControlsDisabled() {
    return this.disabled;
  }
  registerOnChange(t) {
    this._onChange.push(t);
  }
  _unregisterOnChange(t) {
    yp(this._onChange, t);
  }
  registerOnDisabledChange(t) {
    this._onDisabledChange.push(t);
  }
  _unregisterOnDisabledChange(t) {
    yp(this._onDisabledChange, t);
  }
  _forEachChild(t) {}
  _syncPendingControls() {
    return this.updateOn === "submit" &&
      (this._pendingDirty && this.markAsDirty(),
      this._pendingTouched && this.markAsTouched(),
      this._pendingChange)
      ? (this.setValue(this._pendingValue, {
          onlySelf: !0,
          emitModelToViewChange: !1,
        }),
        !0)
      : !1;
  }
  _applyFormState(t) {
    wp(t)
      ? ((this.value = this._pendingValue = t.value),
        t.disabled
          ? this.disable({ onlySelf: !0, emitEvent: !1 })
          : this.enable({ onlySelf: !0, emitEvent: !1 }))
      : (this.value = this._pendingValue = t);
  }
};
var d_ = { provide: ai, useExisting: Ye(() => kc) },
  Cp = Promise.resolve(),
  kc = (() => {
    let t = class t extends ai {
      constructor(n, i, o, s, a, l) {
        super(),
          (this._changeDetectorRef = a),
          (this.callSetDisabledState = l),
          (this.control = new u_()),
          (this._registered = !1),
          (this.name = ""),
          (this.update = new ve()),
          (this._parent = n),
          this._setValidators(i),
          this._setAsyncValidators(o),
          (this.valueAccessor = l_(this, s));
      }
      ngOnChanges(n) {
        if ((this._checkForErrors(), !this._registered || "name" in n)) {
          if (this._registered && (this._checkName(), this.formDirective)) {
            let i = n.name.previousValue;
            this.formDirective.removeControl({
              name: i,
              path: this._getPath(i),
            });
          }
          this._setUpControl();
        }
        "isDisabled" in n && this._updateDisabled(n),
          o_(n, this.viewModel) &&
            (this._updateValue(this.model), (this.viewModel = this.model));
      }
      ngOnDestroy() {
        this.formDirective && this.formDirective.removeControl(this);
      }
      get path() {
        return this._getPath(this.name);
      }
      get formDirective() {
        return this._parent ? this._parent.formDirective : null;
      }
      viewToModelUpdate(n) {
        (this.viewModel = n), this.update.emit(n);
      }
      _setUpControl() {
        this._setUpdateStrategy(),
          this._isStandalone()
            ? this._setUpStandalone()
            : this.formDirective.addControl(this),
          (this._registered = !0);
      }
      _setUpdateStrategy() {
        this.options &&
          this.options.updateOn != null &&
          (this.control._updateOn = this.options.updateOn);
      }
      _isStandalone() {
        return !this._parent || !!(this.options && this.options.standalone);
      }
      _setUpStandalone() {
        Np(this.control, this, this.callSetDisabledState),
          this.control.updateValueAndValidity({ emitEvent: !1 });
      }
      _checkForErrors() {
        this._isStandalone() || this._checkParentType(), this._checkName();
      }
      _checkParentType() {}
      _checkName() {
        this.options && this.options.name && (this.name = this.options.name),
          !this._isStandalone() && this.name;
      }
      _updateValue(n) {
        Cp.then(() => {
          this.control.setValue(n, { emitViewToModelChange: !1 }),
            this._changeDetectorRef?.markForCheck();
        });
      }
      _updateDisabled(n) {
        let i = n.isDisabled.currentValue,
          o = i !== 0 && Nr(i);
        Cp.then(() => {
          o && !this.control.disabled
            ? this.control.disable()
            : !o && this.control.disabled && this.control.enable(),
            this._changeDetectorRef?.markForCheck();
        });
      }
      _getPath(n) {
        return this._parent ? XD(n, this._parent) : [n];
      }
    };
    (t.ɵfac = function (i) {
      return new (i || t)(
        Q(lr, 9),
        Q(cr, 10),
        Q(_p, 10),
        Q(xc, 10),
        Q(ln, 8),
        Q(Pc, 8)
      );
    }),
      (t.ɵdir = ce({
        type: t,
        selectors: [
          ["", "ngModel", "", 3, "formControlName", "", 3, "formControl", ""],
        ],
        inputs: {
          name: "name",
          isDisabled: [Me.None, "disabled", "isDisabled"],
          model: [Me.None, "ngModel", "model"],
          options: [Me.None, "ngModelOptions", "options"],
        },
        outputs: { update: "ngModelChange" },
        exportAs: ["ngModel"],
        features: [bt([d_]), ke, rn],
      }));
    let e = t;
    return e;
  })(),
  Rp = (() => {
    let t = class t {};
    (t.ɵfac = function (i) {
      return new (i || t)();
    }),
      (t.ɵdir = ce({
        type: t,
        selectors: [["form", 3, "ngNoForm", "", 3, "ngNativeValidate", ""]],
        hostAttrs: ["novalidate", ""],
      }));
    let e = t;
    return e;
  })();
function f_(e) {
  return typeof e == "number" ? e : parseInt(e, 10);
}
var Fc = (() => {
  let t = class t {
    constructor() {
      this._validator = Mc;
    }
    ngOnChanges(n) {
      if (this.inputName in n) {
        let i = this.normalizeInput(n[this.inputName].currentValue);
        (this._enabled = this.enabled(i)),
          (this._validator = this._enabled ? this.createValidator(i) : Mc),
          this._onChange && this._onChange();
      }
    }
    validate(n) {
      return this._validator(n);
    }
    registerOnValidatorChange(n) {
      this._onChange = n;
    }
    enabled(n) {
      return n != null;
    }
  };
  (t.ɵfac = function (i) {
    return new (i || t)();
  }),
    (t.ɵdir = ce({ type: t, features: [rn] }));
  let e = t;
  return e;
})();
var h_ = { provide: cr, useExisting: Ye(() => ps), multi: !0 },
  p_ = { provide: cr, useExisting: Ye(() => Rc), multi: !0 },
  ps = (() => {
    let t = class t extends Fc {
      constructor() {
        super(...arguments),
          (this.inputName = "required"),
          (this.normalizeInput = Nr),
          (this.createValidator = (n) => jD);
      }
      enabled(n) {
        return n;
      }
    };
    (t.ɵfac = (() => {
      let n;
      return function (o) {
        return (n || (n = ot(t)))(o || t);
      };
    })()),
      (t.ɵdir = ce({
        type: t,
        selectors: [
          ["", "required", "", "formControlName", "", 3, "type", "checkbox"],
          ["", "required", "", "formControl", "", 3, "type", "checkbox"],
          ["", "required", "", "ngModel", "", 3, "type", "checkbox"],
        ],
        hostVars: 1,
        hostBindings: function (i, o) {
          i & 2 && sn("required", o._enabled ? "" : null);
        },
        inputs: { required: "required" },
        features: [bt([h_]), ke],
      }));
    let e = t;
    return e;
  })(),
  Rc = (() => {
    let t = class t extends ps {
      constructor() {
        super(...arguments), (this.createValidator = (n) => zD);
      }
    };
    (t.ɵfac = (() => {
      let n;
      return function (o) {
        return (n || (n = ot(t)))(o || t);
      };
    })()),
      (t.ɵdir = ce({
        type: t,
        selectors: [
          ["input", "type", "checkbox", "required", "", "formControlName", ""],
          ["input", "type", "checkbox", "required", "", "formControl", ""],
          ["input", "type", "checkbox", "required", "", "ngModel", ""],
        ],
        hostVars: 1,
        hostBindings: function (i, o) {
          i & 2 && sn("required", o._enabled ? "" : null);
        },
        features: [bt([p_]), ke],
      }));
    let e = t;
    return e;
  })();
var g_ = { provide: cr, useExisting: Ye(() => Lc), multi: !0 },
  Lc = (() => {
    let t = class t extends Fc {
      constructor() {
        super(...arguments),
          (this.inputName = "minlength"),
          (this.normalizeInput = (n) => f_(n)),
          (this.createValidator = (n) => UD(n));
      }
    };
    (t.ɵfac = (() => {
      let n;
      return function (o) {
        return (n || (n = ot(t)))(o || t);
      };
    })()),
      (t.ɵdir = ce({
        type: t,
        selectors: [
          ["", "minlength", "", "formControlName", ""],
          ["", "minlength", "", "formControl", ""],
          ["", "minlength", "", "ngModel", ""],
        ],
        hostVars: 1,
        hostBindings: function (i, o) {
          i & 2 && sn("minlength", o._enabled ? o.minlength : null);
        },
        inputs: { minlength: "minlength" },
        features: [bt([g_]), ke],
      }));
    let e = t;
    return e;
  })();
var m_ = { provide: cr, useExisting: Ye(() => Vc), multi: !0 },
  Vc = (() => {
    let t = class t extends Fc {
      constructor() {
        super(...arguments),
          (this.inputName = "pattern"),
          (this.normalizeInput = (n) => n),
          (this.createValidator = (n) => BD(n));
      }
    };
    (t.ɵfac = (() => {
      let n;
      return function (o) {
        return (n || (n = ot(t)))(o || t);
      };
    })()),
      (t.ɵdir = ce({
        type: t,
        selectors: [
          ["", "pattern", "", "formControlName", ""],
          ["", "pattern", "", "formControl", ""],
          ["", "pattern", "", "ngModel", ""],
        ],
        hostVars: 1,
        hostBindings: function (i, o) {
          i & 2 && sn("pattern", o._enabled ? o.pattern : null);
        },
        inputs: { pattern: "pattern" },
        features: [bt([m_]), ke],
      }));
    let e = t;
    return e;
  })();
var v_ = (() => {
  let t = class t {};
  (t.ɵfac = function (i) {
    return new (i || t)();
  }),
    (t.ɵmod = kt({ type: t })),
    (t.ɵinj = Nt({}));
  let e = t;
  return e;
})();
var Lp = (() => {
  let t = class t {
    static withConfig(n) {
      return {
        ngModule: t,
        providers: [{ provide: Pc, useValue: n.callSetDisabledState ?? Ac }],
      };
    }
  };
  (t.ɵfac = function (i) {
    return new (i || t)();
  }),
    (t.ɵmod = kt({ type: t })),
    (t.ɵinj = Nt({ imports: [v_] }));
  let e = t;
  return e;
})();
var Vp = (e) => ({ "disabled-btn": e });
function w_(e, t) {
  e & 1 &&
    (f(0, "span", 14), d(1, "Bitte gib mindestens 3 Buchstaben ein"), u());
}
function C_(e, t) {
  e & 1 &&
    (f(0, "span", 14), d(1, "Bitte gib eine g\xFCtlige Emailadresse ein"), u());
}
function b_(e, t) {
  e & 1 &&
    (f(0, "span", 14),
    d(1, "Bitte gib eine Nachricht mit mindestens 4 Zeichen ein"),
    u());
}
function D_(e, t) {
  e & 1 &&
    (f(0, "span", 14),
    d(
      1,
      "Bitte stimme den Datenschutzrichtlinien zu, indem du das K\xE4stchen ankreuzst. Danke!"
    ),
    u());
}
function __(e, t) {
  if (e & 1) {
    let r = $e();
    f(0, "h3"),
      d(1, "Du m\xF6chtest \xFCber ein neues Projekt sprechen?"),
      u(),
      f(2, "span"),
      d(3, "Sag hallo! Lass uns deine Ideen besprechen und sie verwirklichen"),
      u(),
      f(4, "form", 10, 0),
      X("ngSubmit", function () {
        oe(r);
        let i = Fe(5),
          o = j(2);
        return se(o.onSubmit(i));
      }),
      f(6, "div", 11)(7, "label", 12),
      d(8, "Dein Name"),
      u(),
      f(9, "input", 13, 1),
      ct("ngModelChange", function (i) {
        oe(r);
        let o = j(2);
        return Ct(o.contactData.name, i) || (o.contactData.name = i), se(i);
      }),
      u()(),
      k(12, w_, 2, 0, "span", 14),
      f(13, "div", 11)(14, "label", 15),
      d(15, "Deine Email"),
      u(),
      f(16, "input", 16, 2),
      ct("ngModelChange", function (i) {
        oe(r);
        let o = j(2);
        return Ct(o.contactData.email, i) || (o.contactData.email = i), se(i);
      }),
      u()(),
      k(18, C_, 2, 0, "span", 14),
      f(19, "div", 17)(20, "label", 18),
      d(21, "Deine Nachricht"),
      u(),
      f(22, "textarea", 19, 3),
      ct("ngModelChange", function (i) {
        oe(r);
        let o = j(2);
        return (
          Ct(o.contactData.message, i) || (o.contactData.message = i), se(i)
        );
      }),
      u()(),
      k(24, b_, 2, 0, "span", 14),
      f(25, "div", 20)(26, "label", 21),
      d(
        27,
        "Ich stimme der Erhebung, Verarbeitung und Nutzung meiner personenbezogenen Daten gem\xE4\xDF den "
      ),
      f(28, "a", 22),
      d(29, "Datenschutzrichtlinien"),
      u(),
      d(30, " zu."),
      u(),
      f(31, "input", 23, 4),
      ct("ngModelChange", function (i) {
        oe(r);
        let o = j(2);
        return (
          Ct(o.contactData.checked, i) || (o.contactData.checked = i), se(i)
        );
      }),
      u()(),
      k(33, D_, 2, 0, "span", 14),
      f(34, "div", 24),
      b(35, "input", 25, 5),
      u()();
  }
  if (e & 2) {
    let r = Fe(5),
      n = Fe(10),
      i = Fe(17),
      o = Fe(23),
      s = Fe(32),
      a = j(2);
    y(9),
      lt("ngModel", a.contactData.name),
      y(3),
      V(12, !n.valid && n.touched ? 12 : -1),
      y(4),
      lt("ngModel", a.contactData.email),
      y(2),
      V(18, !i.valid && i.touched ? 18 : -1),
      y(4),
      lt("ngModel", a.contactData.message),
      y(2),
      V(24, !o.valid && o.touched ? 24 : -1),
      y(7),
      lt("ngModel", a.contactData.checked),
      y(2),
      V(33, !s.valid && s.touched ? 33 : -1),
      y(2),
      Ie("ngClass", Dt(9, Vp, !r.valid));
  }
}
function M_(e, t) {
  e & 1 &&
    (f(0, "div", 26)(1, "h3"),
    d(2, "Vielen Dank, deine Anfrage wurde erfolgreich versendet"),
    u()());
}
function E_(e, t) {
  if ((e & 1 && (f(0, "div", 9), k(1, __, 37, 11)(2, M_, 3, 0), u()), e & 2)) {
    let r = j();
    y(), V(1, r.mailSend ? 2 : 1);
  }
}
function x_(e, t) {
  e & 1 && (f(0, "span", 14), d(1, "Please enter at least 3 letters."), u());
}
function I_(e, t) {
  e & 1 && (f(0, "span", 14), d(1, "Please enter a valid email address."), u());
}
function S_(e, t) {
  e & 1 &&
    (f(0, "span", 14),
    d(1, "Please enter a message with at least 4 letters."),
    u());
}
function O_(e, t) {
  e & 1 &&
    (f(0, "span", 14),
    d(1, "Please agree to the privacy policy by checking the box. Thank you!"),
    u());
}
function T_(e, t) {
  if (e & 1) {
    let r = $e();
    f(0, "h3"),
      d(1, "Would you like to talk about a new project?"),
      u(),
      f(2, "span"),
      d(3, "Say hello! Let's discuss your ideas and bring them to life."),
      u(),
      f(4, "form", 10, 0),
      X("ngSubmit", function () {
        oe(r);
        let i = Fe(5),
          o = j(2);
        return se(o.onSubmit(i));
      }),
      f(6, "div", 11)(7, "label", 12),
      d(8, "Your name"),
      u(),
      f(9, "input", 27, 1),
      ct("ngModelChange", function (i) {
        oe(r);
        let o = j(2);
        return Ct(o.contactData.name, i) || (o.contactData.name = i), se(i);
      }),
      u()(),
      k(12, x_, 2, 0, "span", 14),
      f(13, "div", 11)(14, "label", 15),
      d(15, "Your email"),
      u(),
      f(16, "input", 28, 2),
      ct("ngModelChange", function (i) {
        oe(r);
        let o = j(2);
        return Ct(o.contactData.email, i) || (o.contactData.email = i), se(i);
      }),
      u()(),
      k(18, I_, 2, 0, "span", 14),
      f(19, "div", 17)(20, "label", 18),
      d(21, "Your message"),
      u(),
      f(22, "textarea", 29, 3),
      ct("ngModelChange", function (i) {
        oe(r);
        let o = j(2);
        return (
          Ct(o.contactData.message, i) || (o.contactData.message = i), se(i)
        );
      }),
      u()(),
      k(24, S_, 2, 0, "span", 14),
      f(25, "div", 20)(26, "label", 21),
      d(
        27,
        "I agree to the collection, processing, and use of my personal data in accordance with the "
      ),
      f(28, "a", 22),
      d(29, "privacy policy"),
      u(),
      d(30, "."),
      u(),
      f(31, "input", 23, 4),
      ct("ngModelChange", function (i) {
        oe(r);
        let o = j(2);
        return (
          Ct(o.contactData.checked, i) || (o.contactData.checked = i), se(i)
        );
      }),
      u()(),
      k(33, O_, 2, 0, "span", 14),
      f(34, "div", 24),
      b(35, "input", 30, 5),
      u()();
  }
  if (e & 2) {
    let r = Fe(5),
      n = Fe(10),
      i = Fe(17),
      o = Fe(23),
      s = Fe(32),
      a = j(2);
    y(9),
      lt("ngModel", a.contactData.name),
      y(3),
      V(12, !n.valid && n.touched ? 12 : -1),
      y(4),
      lt("ngModel", a.contactData.email),
      y(2),
      V(18, !i.valid && i.touched ? 18 : -1),
      y(4),
      lt("ngModel", a.contactData.message),
      y(2),
      V(24, !o.valid && o.touched ? 24 : -1),
      y(7),
      lt("ngModel", a.contactData.checked),
      y(2),
      V(33, !s.valid && s.touched ? 33 : -1),
      y(2),
      Ie("ngClass", Dt(9, Vp, !r.valid));
  }
}
function P_(e, t) {
  e & 1 &&
    (f(0, "div", 26)(1, "h3"),
    d(2, "Thank you very much, your request has been successfully sent."),
    u()());
}
function A_(e, t) {
  if ((e & 1 && (f(0, "div", 9), k(1, T_, 37, 11)(2, P_, 3, 0), u()), e & 2)) {
    let r = j();
    y(), V(1, r.mailSend ? 2 : 1);
  }
}
var jp = (() => {
  let t = class t {
    constructor() {
      (this.http = v(Ol)),
        (this.translateService = v(de)),
        (this.mailSend = !1),
        (this.mailTest = !1),
        (this.post = {
          endPoint: "https://marcus-loosen.de/sendMail.php",
          body: (n) => JSON.stringify(n),
          options: {
            headers: { "Content-Type": "text/plain", responseType: "text" },
          },
        }),
        (this.contactData = { name: "", email: "", message: "", checked: !1 });
    }
    onSubmit(n) {
      n.submitted && n.form.valid && !this.mailTest
        ? this.http
            .post(this.post.endPoint, this.post.body(this.contactData))
            .subscribe({
              next: (i) => {
                (this.mailSend = !0), n.resetForm();
              },
              error: (i) => {
                console.error(i);
              },
              complete: () => {
                setTimeout(() => (this.mailSend = !1), 3e3);
              },
            })
        : n.submitted &&
          n.form.valid &&
          this.mailTest &&
          ((this.mailSend = !0),
          n.resetForm(),
          setTimeout(() => (this.mailSend = !1), 3e3));
    }
  };
  (t.ɵfac = function (i) {
    return new (i || t)();
  }),
    (t.ɵcmp = G({
      type: t,
      selectors: [["app-contact"]],
      standalone: !0,
      features: [W],
      decls: 8,
      vars: 1,
      consts: [
        ["contactForm", "ngForm"],
        ["name", "ngModel", "nameInput", ""],
        ["email", "ngModel"],
        ["message", "ngModel"],
        ["checkbox", "ngModel"],
        ["submit", ""],
        [1, "seperator"],
        [1, "container"],
        [
          "data-aos",
          "fade-right",
          "data-aos-duration",
          "1000",
          "data-aos-offset",
          "400",
          1,
          "say-hi",
        ],
        [1, "form-container"],
        [3, "ngSubmit"],
        [1, "input-container"],
        ["hidden", "", "for", "name"],
        [
          "data-aos",
          "fade-left",
          "data-aos-duration",
          "700",
          "data-aos-offset",
          "200",
          "type",
          "text",
          "id",
          "name",
          "name",
          "name",
          "placeholder",
          "Dein Name",
          "required",
          "",
          "minlength",
          "3",
          3,
          "ngModelChange",
          "ngModel",
        ],
        [1, "alert"],
        ["hidden", "", "for", "email"],
        [
          "data-aos",
          "fade-right",
          "data-aos-duration",
          "700",
          "data-aos-offset",
          "200",
          "data-aos-delay",
          "200",
          "type",
          "email",
          "id",
          "email",
          "name",
          "email",
          "placeholder",
          "Deine Email",
          "required",
          "",
          "pattern",
          "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$",
          3,
          "ngModelChange",
          "ngModel",
        ],
        [1, "textarea-container"],
        ["hidden", "", "for", "message"],
        [
          "data-aos",
          "fade-left",
          "data-aos-duration",
          "700",
          "data-aos-offset",
          "200",
          "data-aos-delay",
          "200",
          "name",
          "message",
          "id",
          "message",
          "cols",
          "50",
          "rows",
          "10",
          "placeholder",
          "Deine Nachricht",
          "required",
          "",
          "minlength",
          "4",
          3,
          "ngModelChange",
          "ngModel",
        ],
        [1, "checkbox-container"],
        ["for", "privacy"],
        ["href", "datenschutz", "target", "_blank"],
        [
          "name",
          "privacy",
          "id",
          "privacy",
          "type",
          "checkbox",
          "required",
          "",
          3,
          "ngModelChange",
          "ngModel",
        ],
        ["data-aos", "fade-up", "data-aos-duration", "700"],
        ["type", "submit", "value", "Nachricht senden", 3, "ngClass"],
        [
          "data-aos",
          "fade-up",
          "data-aos-duration",
          "600",
          1,
          "mailsend-container",
        ],
        [
          "data-aos",
          "fade-left",
          "data-aos-duration",
          "700",
          "data-aos-offset",
          "200",
          "type",
          "text",
          "id",
          "name",
          "name",
          "name",
          "placeholder",
          "Your name",
          "required",
          "",
          "minlength",
          "3",
          3,
          "ngModelChange",
          "ngModel",
        ],
        [
          "data-aos",
          "fade-right",
          "data-aos-duration",
          "700",
          "data-aos-offset",
          "200",
          "data-aos-delay",
          "200",
          "type",
          "email",
          "id",
          "email",
          "name",
          "email",
          "placeholder",
          "Your email",
          "required",
          "",
          "pattern",
          "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
          3,
          "ngModelChange",
          "ngModel",
        ],
        [
          "data-aos",
          "fade-left",
          "data-aos-duration",
          "700",
          "data-aos-offset",
          "200",
          "data-aos-delay",
          "200",
          "name",
          "message",
          "id",
          "message",
          "cols",
          "50",
          "rows",
          "10",
          "placeholder",
          "Your message",
          "required",
          "",
          "minlength",
          "4",
          3,
          "ngModelChange",
          "ngModel",
        ],
        ["type", "submit", "value", "Send", 3, "ngClass"],
      ],
      template: function (i, o) {
        i & 1 &&
          (f(0, "section"),
          b(1, "div", 6),
          f(2, "div", 7)(3, "div", 8)(4, "h1"),
          d(5, "Say Hi!"),
          u()(),
          k(6, E_, 3, 1, "div", 9)(7, A_, 3, 1),
          u()()),
          i & 2 && (y(6), V(6, o.translateService.translated ? 7 : 6));
      },
      dependencies: [pe, Kn, Lp, Rp, fs, Ic, Op, Tp, ps, Lc, Vc, Rc, kc, Nc],
      styles: [
        `

*[_ngcontent-%COMP%] {
  margin: 0;
  padding: 0;
}
html[_ngcontent-%COMP%] {
  scroll-behavior: smooth;
}
body[_ngcontent-%COMP%] {
  background-color: #fffcf3;
}
a[_ngcontent-%COMP%] {
  text-decoration: none;
  color: black;
}
.btn[_ngcontent-%COMP%] {
  cursor: pointer;
  border-style: unset;
  border: 4px solid black;
  padding: 20px 60px;
  font-family: "Overpass", sans-serif;
  font-size: 23px;
  background-color: #fffcf3;
  transition: all 0.125s ease-in-out;
}
.btn[_ngcontent-%COMP%]:hover {
  padding: 20px 80px;
  font-weight: 700;
}
.btn[_ngcontent-%COMP%]:active {
  background-color: black;
  color: #fffcf3;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar {
  height: 10px;
  width: 5px;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-track {
  border-radius: 5px;
  background-color: #dfe9eb;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-track:hover {
  background-color: #b8c0c2;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-track:active {
  background-color: #b8c0c2;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: #5987ff;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:hover {
  background-color: #396eff;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:active {
  background-color: #396eff;
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 400;
  src: url("./media/syne-v22-latin-regular-6UTYI6IK.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 500;
  src: url("./media/syne-v22-latin-500-DLSUZYMP.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 600;
  src: url("./media/syne-v22-latin-600-2OMFULSK.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 700;
  src: url("./media/syne-v22-latin-700-7MWUTDCM.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 800;
  src: url("./media/syne-v22-latin-800-5SEF6UHE.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 100;
  src: url("./media/overpass-v13-latin-100-7H57N2W4.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 100;
  src: url("./media/overpass-v13-latin-100italic-TTK663FB.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 200;
  src: url("./media/overpass-v13-latin-200-MKKXNLZT.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 200;
  src: url("./media/overpass-v13-latin-200italic-UUSYSIGK.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 300;
  src: url("./media/overpass-v13-latin-300-Z3DUN6DK.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 300;
  src: url("./media/overpass-v13-latin-300italic-E7DYAHJT.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 400;
  src: url("./media/overpass-v13-latin-regular-ZK77XNQQ.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 400;
  src: url("./media/overpass-v13-latin-italic-CQLYFGT5.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 500;
  src: url("./media/overpass-v13-latin-500-5JQXFN7P.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 500;
  src: url("./media/overpass-v13-latin-500italic-HBJHAJTP.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 600;
  src: url("./media/overpass-v13-latin-600-43COUMYV.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 600;
  src: url("./media/overpass-v13-latin-600italic-XVZTHGMT.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 700;
  src: url("./media/overpass-v13-latin-700-EGTGNMPW.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 700;
  src: url("./media/overpass-v13-latin-700italic-37TJZGGR.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 800;
  src: url("./media/overpass-v13-latin-800-MNY6LLUS.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 800;
  src: url("./media/overpass-v13-latin-800italic-G2IFGHUZ.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 900;
  src: url("./media/overpass-v13-latin-900-DS3PFZN2.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 900;
  src: url("./media/overpass-v13-latin-900italic-HWYZS623.woff2") format("woff2");
}
section[_ngcontent-%COMP%] {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0;
  background-color: black;
  margin-bottom: -1px;
}
section[_ngcontent-%COMP%]   .seperator[_ngcontent-%COMP%] {
  margin-top: -2px;
  height: 10vh;
  width: 100%;
  border: unset;
  background-image: linear-gradient(#fffcf3, #fffcf3);
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - 5vw));
}
section[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%] {
  width: 90%;
  max-width: 1920px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 64px;
}
section[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%]   .say-hi[_ngcontent-%COMP%] {
  align-self: flex-start;
  overflow: hidden;
}
.form-container[_ngcontent-%COMP%] {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 18px;
  color: #fffcf3;
  font-family: "Overpass", sans-serif;
  font-size: 23px;
  max-width: 60%;
  overflow: hidden;
}
.form-container[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {
  text-align: center;
}
h3[_ngcontent-%COMP%] {
  color: #5987ff;
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  font-family: "Overpass", sans-serif;
}
@media (max-width: 580px) {
  h3[_ngcontent-%COMP%] {
    font-size: 28px;
  }
}
form[_ngcontent-%COMP%] {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
  width: 100%;
}
.input-container[_ngcontent-%COMP%] {
  box-sizing: border-box;
  position: relative;
  background-color: black;
  border: 4px solid transparent;
  height: 50px;
  width: 100%;
}
.input-container[_ngcontent-%COMP%]    > input[_ngcontent-%COMP%] {
  box-sizing: border-box;
  font-size: 16px;
  font-family: "Overpass", sans-serif;
  color: #fffcf3;
  background-color: black;
  padding: 15px 25px;
  border-style: none;
  border-bottom: 2px solid #fffcf3;
  width: 100%;
}
.input-container[_ngcontent-%COMP%]    > input[_ngcontent-%COMP%]:hover {
  border: 4px solid #fffcf3;
}
.textarea-container[_ngcontent-%COMP%] {
  position: relative;
  height: 232px;
  width: 100%;
}
.input-container[_ngcontent-%COMP%]    > label[_ngcontent-%COMP%] {
  background-color: black;
  position: absolute;
  color: #fffcf3;
  top: -9px;
  left: 24px;
  font-size: 16px;
}
input[_ngcontent-%COMP%]:focus, textarea[_ngcontent-%COMP%]:focus {
  background-color: black;
  border: 2px solid #fffcf3;
  color: #fffcf3;
  outline: #fffcf3;
}
input[_ngcontent-%COMP%]:focus::placeholder, textarea[_ngcontent-%COMP%]:focus::placeholder {
  color: transparent;
}
textarea[_ngcontent-%COMP%] {
  resize: none;
  box-sizing: border-box;
  font-size: 16px;
  font-family: "Overpass", sans-serif;
  color: #fffcf3;
  background-color: black;
  padding: 15px 25px;
  border-style: none;
  border-bottom: 2px solid #fffcf3;
  width: 100%;
}
textarea[_ngcontent-%COMP%]:hover {
  border: 4px solid #fffcf3;
}
input[_ngcontent-%COMP%]::placeholder, textarea[_ngcontent-%COMP%]::placeholder {
  color: #fffcf3;
}
.checkbox-container[_ngcontent-%COMP%] {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: flex-start;
  gap: 32px;
}
.checkbox-container[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {
  color: #5987ff;
}
.checkbox-container[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {
  text-decoration: underline;
}
input[type=checkbox][_ngcontent-%COMP%] {
  appearance: none;
  -webkit-appearance: none;
  display: flex;
  align-content: center;
  justify-content: center;
  font-size: 2rem;
  padding: 0.1rem;
  border: 2px solid #fffcf3;
  width: 30px;
}
input[type=checkbox][_ngcontent-%COMP%]::before {
  content: "";
  width: 16px;
  height: 16px;
  clip-path: polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%);
  transform: scale(0);
  background-color: #fffcf3;
}
input[type=checkbox][_ngcontent-%COMP%]:checked::before {
  transform: scale(1);
}
input[type=checkbox][_ngcontent-%COMP%]:hover {
  color: black;
}
input[type=submit][_ngcontent-%COMP%] {
  cursor: pointer;
  border-style: unset;
  border: 4px solid #fffcf3;
  padding: 20px 60px 20px 60px;
  font-family: "Overpass", sans-serif;
  font-size: 23px;
  background-color: #000;
  color: #fffcf3;
  transition: all 0.225s ease-in-out;
}
input[type=submit][_ngcontent-%COMP%]:hover {
  padding: 20px 80px;
  font-weight: 700;
}
input[type=submit][_ngcontent-%COMP%]:active {
  background-color: #fffcf3;
  color: black;
}
input[type=submit][_ngcontent-%COMP%]:disabled {
  cursor: default;
  border-color: #a7a5a0;
  color: #a7a5a0;
}
.disabled-btn[_ngcontent-%COMP%] {
  cursor: default !important;
  border-style: unset;
  border: 4px solid #a7a5a0 !important;
  padding: 20px 60px 20px 60px;
  font-family: "Overpass", sans-serif;
  font-size: 23px;
  background-color: #000;
  color: #a7a5a0 !important;
  transition: padding 0.225s ease-in-out;
}
.disabled-btn[_ngcontent-%COMP%]:hover {
  padding: 20px 60px 20px 60px !important;
  font-weight: 400 !important;
}
.disabled-btn[_ngcontent-%COMP%]:active {
  background-color: #000 !important;
  color: #a7a5a0 !important;
}
h1[_ngcontent-%COMP%] {
  color: #fffcf3;
  font-family: "Syne", sans-serif;
  font-size: 78px;
  font-weight: 800;
}
h1[_ngcontent-%COMP%]:hover {
  color: #5987ff;
}
@media (max-width: 850px) {
  h1[_ngcontent-%COMP%] {
    font-size: 56px;
  }
}
@media (max-width: 505px) {
  h1[_ngcontent-%COMP%] {
    font-size: 40px;
  }
}
.alert[_ngcontent-%COMP%] {
  color: #cf0505;
  font-size: 16px;
}
@media (max-width: 580px) {
  h1[_ngcontent-%COMP%] {
    font-size: 48px;
  }
  input[type=submit][_ngcontent-%COMP%] {
    padding: 20px 28px;
  }
  input[type=submit][_ngcontent-%COMP%]:hover {
    padding: 20px 35px;
  }
  input[type=submit][_ngcontent-%COMP%]:active {
    padding: 20px 35px;
  }
  .disabled-btn[_ngcontent-%COMP%] {
    padding: 20px 28px !important;
  }
  .disabled-btn[_ngcontent-%COMP%]:hover {
    padding: 20px 28px !important;
  }
  .disabled-btn[_ngcontent-%COMP%]:active {
    padding: 20px 28px !important;
  }
  .form-container[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {
    font-size: 20px;
  }
  .checkbox-container[_ngcontent-%COMP%] {
    font-size: 20px;
  }
}
@media (max-width: 430px) {
  h1[_ngcontent-%COMP%] {
    font-size: 36px;
  }
  section[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%] {
    padding-top: 32px;
    overflow: hidden;
  }
  section[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%]   .say-hi[_ngcontent-%COMP%] {
    align-self: center;
  }
  .form-container[_ngcontent-%COMP%] {
    max-width: 90%;
  }
  .form-container[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {
    font-size: 23px;
  }
  .form-container[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {
    font-size: 18px;
  }
  .checkbox-container[_ngcontent-%COMP%] {
    font-size: 18px;
  }
  input[type=submit][_ngcontent-%COMP%] {
    padding: 12px 8px;
  }
  input[type=submit][_ngcontent-%COMP%]:hover {
    font-weight: 400;
    padding: 12px 8px;
  }
  input[type=submit][_ngcontent-%COMP%]:active {
    padding: 12px 8px;
  }
  .disabled-btn[_ngcontent-%COMP%] {
    padding: 12px 8x !important;
  }
  .disabled-btn[_ngcontent-%COMP%]:hover {
    padding: 12px 8px !important;
  }
  .disabled-btn[_ngcontent-%COMP%]:active {
    padding: 12px 8px !important;
  }
}`,
      ],
    }));
  let e = t;
  return e;
})();
function N_(e, t) {
  e & 1 &&
    (f(0, "div", 0),
    b(1, "app-aot", 1)(2, "app-about-me", 2)(3, "app-arrow")(
      4,
      "app-my-skills",
      3
    )(5, "app-arrow", 4)(
      6,
      "app-portfolio",
      5
    )(7, "app-arrow")(8, "app-contact", 6),
    u()),
    e & 2 && (y(5), Ie("left", !0));
}
function k_(e, t) {
  e & 1 && (f(0, "div", 0), b(1, "app-dropdown-menu"), u());
}
var zp = (() => {
  let t = class t {
    constructor() {
      this.headerDropDownService = v(sr);
    }
  };
  (t.ɵfac = function (i) {
    return new (i || t)();
  }),
    (t.ɵcmp = G({
      type: t,
      selectors: [["app-landing-page"]],
      standalone: !0,
      features: [W],
      decls: 2,
      vars: 1,
      consts: [
        [1, "container"],
        ["id", "aot"],
        ["id", "aboutMe"],
        ["id", "mySkills"],
        [3, "left"],
        ["id", "portfolio"],
        ["id", "contact"],
      ],
      template: function (i, o) {
        i & 1 && k(0, N_, 9, 1, "div", 0)(1, k_, 2, 0),
          i & 2 && V(0, o.headerDropDownService.stateOfDropDown ? 1 : 0);
      },
      dependencies: [pe, ap, lp, cp, up, fp, hp, jp],
      styles: [
        `

.container[_ngcontent-%COMP%] {
  display: flex;
  flex-direction: column;
}`,
      ],
    }));
  let e = t;
  return e;
})();
function F_(e, t) {
  e & 1 &&
    (f(0, "div", 0)(1, "div", 1)(2, "div")(3, "h1"),
    d(4, "Impressum"),
    u(),
    f(5, "div")(6, "p"),
    d(7, "Angaben gem\xE4\xDF \xA7 5 TMG"),
    u(),
    f(8, "p"),
    d(9, " Marcus Loosen "),
    b(10, "br"),
    d(11, " Meedeweg 2"),
    b(12, "br"),
    d(13, " 25853 Ahrensh\xF6ft "),
    b(14, "br"),
    u(),
    f(15, "p")(16, "strong"),
    d(17, "Vertreten durch: "),
    u(),
    b(18, "br"),
    d(19, " Marcus Loosen"),
    b(20, "br"),
    u(),
    f(21, "p")(22, "strong"),
    d(23, "Kontakt:"),
    u(),
    b(24, "br"),
    d(25, " Telefon: 0049-015146452030"),
    b(26, "br"),
    d(27, " E-Mail: "),
    f(28, "a", 2),
    d(29, "mail@marcus-loosen.de"),
    u(),
    b(30, "br"),
    u(),
    f(31, "p")(32, "strong"),
    d(33, "Haftungsausschluss: "),
    u()()()(),
    f(34, "div")(35, "h3"),
    d(36, "Haftung f\xFCr Inhalte"),
    u(),
    f(37, "p"),
    d(
      38,
      " Die Inhalte unserer Seiten wurden mit gr\xF6\xDFter Sorgfalt erstellt. F\xFCr die Richtigkeit, Vollst\xE4ndigkeit und Aktualit\xE4t der Inhalte k\xF6nnen wir jedoch keine Gew\xE4hr \xFCbernehmen. Als Diensteanbieter sind wir gem\xE4\xDF \xA7 7 Abs.1 TMG f\xFCr eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach \xA7\xA7 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, \xFCbermittelte oder gespeicherte fremde Informationen zu \xFCberwachen oder nach Umst\xE4nden zu forschen, die auf eine rechtswidrige T\xE4tigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unber\xFChrt. Eine diesbez\xFCgliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung m\xF6glich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen. "
    ),
    u()(),
    f(39, "div")(40, "h3"),
    d(41, "Haftung f\xFCr Links"),
    u(),
    f(42, "p"),
    d(
      43,
      " Unser Angebot enth\xE4lt Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb k\xF6nnen wir f\xFCr diese fremden Inhalte auch keine Gew\xE4hr \xFCbernehmen. F\xFCr die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf m\xF6gliche Rechtsverst\xF6\xDFe \xFCberpr\xFCft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen. "
    ),
    u()(),
    f(44, "div")(45, "h3"),
    d(46, "Urheberrecht"),
    u(),
    f(47, "p"),
    d(
      48,
      " Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielf\xE4ltigung, Bearbeitung, Verbreitung und jede Art der Verwertung au\xDFerhalb der Grenzen des Urheberrechtes bed\xFCrfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur f\xFCr den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen. "
    ),
    u()(),
    f(49, "div")(50, "h3"),
    d(51, "Datenschutz"),
    u(),
    f(52, "p"),
    d(
      53,
      " Die Nutzung unserer Webseite ist in der Regel ohne Angabe personenbezogener Daten m\xF6glich. Soweit auf unseren Seiten personenbezogene Daten (beispielsweise Name, Anschrift oder eMail-Adressen) erhoben werden, erfolgt dies, soweit m\xF6glich, stets auf freiwilliger Basis. Diese Daten werden ohne Ihre ausdr\xFCckliche Zustimmung nicht an Dritte weitergegeben. "
    ),
    b(54, "br"),
    d(
      55,
      " Wir weisen darauf hin, dass die Daten\xFCbertragung im Internet (z.B. bei der Kommunikation per E-Mail) Sicherheitsl\xFCcken aufweisen kann. Ein l\xFCckenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht m\xF6glich. "
    ),
    b(56, "br"),
    d(
      57,
      " Der Nutzung von im Rahmen der Impressumspflicht ver\xF6ffentlichten Kontaktdaten durch Dritte zur \xDCbersendung von nicht ausdr\xFCcklich angeforderter Werbung und Informationsmaterialien wird hiermit ausdr\xFCcklich widersprochen. Die Betreiber der Seiten behalten sich ausdr\xFCcklich rechtliche Schritte im Falle der unverlangten Zusendung von Werbeinformationen, etwa durch Spam-Mails, vor. "
    ),
    u()(),
    f(58, "p"),
    d(59, " Website Impressum von "),
    f(60, "a", 3),
    d(61, "impressum-generator.de"),
    u()()()());
}
function R_(e, t) {
  e & 1 &&
    (f(0, "div", 0)(1, "div", 1)(2, "div")(3, "h1"),
    d(4, "Inprint"),
    u(),
    f(5, "div")(6, "p"),
    d(7, "Information according to \xA7 5 TMG"),
    u(),
    f(8, "p"),
    d(9, " Marcus Loosen "),
    b(10, "br"),
    d(11, " Meedeweg 2"),
    b(12, "br"),
    d(13, " 25853 Ahrensh\xF6ft "),
    b(14, "br"),
    u(),
    f(15, "p")(16, "strong"),
    d(17, "Represented by: "),
    u(),
    b(18, "br"),
    d(19, " Marcus Loosen"),
    b(20, "br"),
    u(),
    f(21, "p")(22, "strong"),
    d(23, "contact:"),
    u(),
    u(),
    b(30, "br"),
    u(),
    f(31, "p")(32, "strong"),
    d(33, "Disclaimer: "),
    u()()()(),
    f(34, "div")(35, "h3"),
    d(36, "Liability for content"),
    u(),
    f(37, "p"),
    d(
      38,
      " The contents of our pages were created with the utmost care. However, we cannot guarantee the accuracy, completeness, and timeliness of the content. As a service provider, we are responsible for our own content on these pages in accordance with \xA7 7 para.1 TMG (German Telemedia Act) and general laws. According to \xA7\xA7 8 to 10 TMG, we are not obliged as a service provider to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity. Obligations to remove or block the use of information under general laws remain unaffected. However, liability in this regard is only possible from the time of knowledge of a specific infringement. Upon becoming aware of corresponding infringements, we will remove these contents immediately. "
    ),
    u()(),
    f(39, "div")(40, "h3"),
    d(41, "Liability for links"),
    u(),
    f(42, "p"),
    d(
      43,
      " Our offer contains links to external websites of third parties, on whose contents we have no influence. Therefore, we cannot assume any liability for these external contents. The respective provider or operator of the linked pages is always responsible for the contents of the linked pages. The linked pages were checked for possible legal violations at the time of linking. Illegal contents were not recognizable at the time of linking. However, permanent monitoring of the content of the linked pages is not reasonable without concrete evidence of a violation of the law. If we become aware of any infringements, we will remove such links immediately. "
    ),
    u()(),
    f(44, "div")(45, "h3"),
    d(46, "Copyright"),
    u(),
    f(47, "p"),
    d(
      48,
      " The content and works created by the site operators on these pages are subject to German copyright law. The reproduction, adaptation, distribution, and any kind of exploitation beyond the limits of copyright require the written consent of the respective author or creator. Downloads and copies of these pages are only permitted for private, non-commercial use. Insofar as the content on this site was not created by the operator, the copyrights of third parties are respected. In particular, third-party content is identified as such. If you become aware of a copyright infringement, please notify us accordingly. Upon becoming aware of any infringements, we will remove such content immediately. "
    ),
    u()(),
    f(49, "div")(50, "h3"),
    d(51, "Privacy policy"),
    u(),
    f(52, "p"),
    d(
      53,
      " The use of our website is usually possible without providing personal information. As far as personal data (for example, name, address, or email addresses) is collected on our pages, this is always done on a voluntary basis, if possible. This data will not be disclosed to third parties without your explicit consent. We would like to point out that data transmission over the Internet (for example, when communicating by email) can have security vulnerabilities. Complete protection of data from access by third parties is not possible. The use of contact data published within the scope of the imprint obligation by third parties for sending unsolicited advertising and information materials is hereby expressly prohibited. The operators of these pages expressly reserve the right to take legal action in the event of unsolicited sending of advertising information, such as spam emails. "
    ),
    u()(),
    f(54, "p"),
    d(55, " Website imprint from "),
    f(56, "a", 3),
    d(57, "impressum-generator.de"),
    u()()()());
}
var Up = (() => {
  let t = class t {
    constructor() {
      this.translationService = v(de);
    }
  };
  (t.ɵfac = function (i) {
    return new (i || t)();
  }),
    (t.ɵcmp = G({
      type: t,
      selectors: [["app-impressum"]],
      standalone: !0,
      features: [W],
      decls: 3,
      vars: 1,
      consts: [
        [1, "container"],
        [1, "impressum"],
        ["href", "mailto:mail@marcus-loosen.de"],
        ["href", "https://www.impressum-generator.de"],
      ],
      template: function (i, o) {
        i & 1 &&
          (f(0, "section"), k(1, F_, 62, 0, "div", 0)(2, R_, 58, 0), u()),
          i & 2 && (y(), V(1, o.translationService.translated ? 2 : 1));
      },
      styles: [
        `

*[_ngcontent-%COMP%] {
  margin: 0;
  padding: 0;
}
html[_ngcontent-%COMP%] {
  scroll-behavior: smooth;
}
body[_ngcontent-%COMP%] {
  background-color: #fffcf3;
}
a[_ngcontent-%COMP%] {
  text-decoration: none;
  color: black;
}
.btn[_ngcontent-%COMP%] {
  cursor: pointer;
  border-style: unset;
  border: 4px solid black;
  padding: 20px 60px;
  font-family: "Overpass", sans-serif;
  font-size: 23px;
  background-color: #fffcf3;
  transition: all 0.125s ease-in-out;
}
.btn[_ngcontent-%COMP%]:hover {
  padding: 20px 80px;
  font-weight: 700;
}
.btn[_ngcontent-%COMP%]:active {
  background-color: black;
  color: #fffcf3;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar {
  height: 10px;
  width: 5px;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-track {
  border-radius: 5px;
  background-color: #dfe9eb;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-track:hover {
  background-color: #b8c0c2;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-track:active {
  background-color: #b8c0c2;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: #5987ff;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:hover {
  background-color: #396eff;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:active {
  background-color: #396eff;
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 400;
  src: url("./media/syne-v22-latin-regular-6UTYI6IK.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 500;
  src: url("./media/syne-v22-latin-500-DLSUZYMP.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 600;
  src: url("./media/syne-v22-latin-600-2OMFULSK.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 700;
  src: url("./media/syne-v22-latin-700-7MWUTDCM.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 800;
  src: url("./media/syne-v22-latin-800-5SEF6UHE.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 100;
  src: url("./media/overpass-v13-latin-100-7H57N2W4.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 100;
  src: url("./media/overpass-v13-latin-100italic-TTK663FB.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 200;
  src: url("./media/overpass-v13-latin-200-MKKXNLZT.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 200;
  src: url("./media/overpass-v13-latin-200italic-UUSYSIGK.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 300;
  src: url("./media/overpass-v13-latin-300-Z3DUN6DK.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 300;
  src: url("./media/overpass-v13-latin-300italic-E7DYAHJT.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 400;
  src: url("./media/overpass-v13-latin-regular-ZK77XNQQ.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 400;
  src: url("./media/overpass-v13-latin-italic-CQLYFGT5.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 500;
  src: url("./media/overpass-v13-latin-500-5JQXFN7P.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 500;
  src: url("./media/overpass-v13-latin-500italic-HBJHAJTP.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 600;
  src: url("./media/overpass-v13-latin-600-43COUMYV.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 600;
  src: url("./media/overpass-v13-latin-600italic-XVZTHGMT.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 700;
  src: url("./media/overpass-v13-latin-700-EGTGNMPW.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 700;
  src: url("./media/overpass-v13-latin-700italic-37TJZGGR.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 800;
  src: url("./media/overpass-v13-latin-800-MNY6LLUS.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 800;
  src: url("./media/overpass-v13-latin-800italic-G2IFGHUZ.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 900;
  src: url("./media/overpass-v13-latin-900-DS3PFZN2.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 900;
  src: url("./media/overpass-v13-latin-900italic-HWYZS623.woff2") format("woff2");
}
section[_ngcontent-%COMP%] {
  margin-top: 160px;
  margin-bottom: 80px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  gap: 0;
  font-family: "Overpass", sans-serif;
}
.container[_ngcontent-%COMP%] {
  width: 90%;
  max-width: 1920px;
  margin-left: auto;
  margin-right: auto;
}
.container[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {
  font-family: "Syne", sans-serif;
  font-size: 48px;
  font-weight: 800;
}
@media (max-width: 530px) {
  .container[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {
    font-size: 36px;
  }
}
@media (max-width: 500px) {
  .container[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {
    font-size: 28px;
  }
}
.container[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]:hover {
  color: #5987ff;
}
.impressum[_ngcontent-%COMP%] {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 32px;
}
.impressum[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {
  font-size: 23px;
  font-family: "Syne", sans-serif;
  font-weight: 700;
}
@media (max-width: 530px) {
  .impressum[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {
    font-size: 20px;
  }
}
@media (max-width: 500px) {
  .impressum[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {
    font-size: 18px;
  }
}
.impressum[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 16px;
}
a[_ngcontent-%COMP%]:hover {
  color: #5987ff;
}`,
      ],
    }));
  let e = t;
  return e;
})();
var Bp = (() => {
  let t = class t {};
  (t.ɵfac = function (i) {
    return new (i || t)();
  }),
    (t.ɵcmp = G({
      type: t,
      selectors: [["app-datenschutz"]],
      standalone: !0,
      features: [W],
      decls: 480,
      vars: 0,
      consts: [
        [1, "container"],
        [1, "index"],
        [1, "index-link"],
        ["id", "m3"],
        ["href", "mailto:mail@marcus-loosen.de"],
        ["id", "mOverview"],
        ["id", "m2427"],
        ["id", "m27"],
        ["id", "m25"],
        ["id", "m24"],
        [
          "href",
          "https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection_en?prefLang=de",
          "target",
          "_blank",
        ],
        ["href", "https://www.dataprivacyframework.gov/", "target", "_blank"],
        [
          "href",
          "https://www.bj.admin.ch/bj/de/home/staat/datenschutz/internationales/anerkennung-staaten.html",
          "target",
          "_blank",
        ],
        ["id", "m12"],
        [1, "m-elements"],
        ["id", "m225"],
        [1, ""],
        ["id", "m134"],
        ["id", "m182"],
        ["id", "m264"],
        ["href", "https://www.youronlinechoices.eu", "target", "_blank"],
        ["href", "https://www.youradchoices.ca/choices", "target", "_blank"],
        ["href", "https://www.aboutads.info/choices", "target", "_blank"],
        ["href", "https://optout.aboutads.info", "target", "_blank"],
        ["id", "m136"],
        [
          "href",
          "https://www.linkedin.com/legal/privacy-policy",
          "target",
          "_blank",
        ],
        [
          "href",
          "https://legal.linkedin.com/pages-joint-controller-addendum",
          "target",
          "_blank",
        ],
        ["href", "https://www.linkedin.com", "target", "_blank"],
        [
          "href",
          "https://www.linkedin.com/psettings/guest-controls/retargeting-opt-out",
          "target",
          "_blank",
        ],
        [1, "seal"],
        [
          "href",
          "https://datenschutz-generator.de/",
          "title",
          "Rechtstext von Dr. Schwenke - f\xFCr weitere Informationen bitte anklicken.",
          "target",
          "_blank",
          "rel",
          "noopener noreferrer nofollow",
        ],
      ],
      template: function (i, o) {
        i & 1 &&
          (f(0, "section")(1, "div", 0)(2, "h1"),
          d(3, "Datenschutz-"),
          b(4, "br"),
          d(5, "erkl\xE4rung"),
          u(),
          f(6, "p"),
          d(7, "Stand: 1. August 2024"),
          u(),
          f(8, "h2"),
          d(9, "Inhalts\xFCbersicht"),
          u(),
          f(10, "ul", 1)(11, "li")(12, "a", 2),
          d(13, "Verantwortlicher"),
          u()(),
          f(14, "li")(15, "a", 2),
          d(16, "\xDCbersicht der Verarbeitungen"),
          u()(),
          f(17, "li")(18, "a", 2),
          d(19, "Ma\xDFgebliche Rechtsgrundlagen"),
          u()(),
          f(20, "li")(21, "a", 2),
          d(22, "Sicherheitsma\xDFnahmen"),
          u()(),
          f(23, "li")(24, "a", 2),
          d(25, "\xDCbermittlung von personenbezogenen Daten"),
          u()(),
          f(26, "li")(27, "a", 2),
          d(28, "Internationale Datentransfers"),
          u()(),
          f(29, "li")(30, "a", 2),
          d(
            31,
            "Allgemeine Informationen zur Datenspeicherung und L\xF6schung"
          ),
          u()(),
          f(32, "li")(33, "a", 2),
          d(34, "Bereitstellung des Onlineangebots und Webhosting"),
          u()(),
          f(35, "li")(36, "a", 2),
          d(37, "Einsatz von Cookies"),
          u()(),
          f(38, "li")(39, "a", 2),
          d(40, "Kontakt- und Anfrageverwaltung"),
          u()(),
          f(41, "li")(42, "a", 2),
          d(43, "Onlinemarketing"),
          u()(),
          f(44, "li")(45, "a", 2),
          d(46, "Pr\xE4senzen in sozialen Netzwerken (Social Media)"),
          u()()(),
          f(47, "h2", 3),
          d(48, "Verantwortlicher"),
          u(),
          f(49, "p"),
          d(50, "Marcus Loosen"),
          b(51, "br"),
          d(52, "Meedeweg 2"),
          b(53, "br"),
          d(54, "25853 Ahrensh\xF6ft, Deutschland"),
          u(),
          d(55, " E-Mail-Adresse: "),
          f(56, "a", 4),
          d(57, "mail@marcus-loosen.de"),
          u(),
          f(58, "h2", 5),
          d(59, "\xDCbersicht der Verarbeitungen"),
          u(),
          f(60, "p"),
          d(
            61,
            " Die nachfolgende \xDCbersicht fasst die Arten der verarbeiteten Daten und die Zwecke ihrer Verarbeitung zusammen und verweist auf die betroffenen Personen. "
          ),
          u(),
          f(62, "h3"),
          d(63, "Arten der verarbeiteten Daten"),
          u(),
          f(64, "ul")(65, "li"),
          d(66, "Bestandsdaten."),
          u(),
          f(67, "li"),
          d(68, "Besch\xE4ftigtendaten."),
          u(),
          f(69, "li"),
          d(70, "Kontaktdaten."),
          u(),
          f(71, "li"),
          d(72, "Inhaltsdaten."),
          u(),
          f(73, "li"),
          d(74, "Nutzungsdaten."),
          u(),
          f(75, "li"),
          d(76, "Meta-, Kommunikations- und Verfahrensdaten."),
          u(),
          f(77, "li"),
          d(78, "Protokolldaten."),
          u()(),
          f(79, "h3"),
          d(80, "Kategorien betroffener Personen"),
          u(),
          f(81, "ul")(82, "li"),
          d(83, "Besch\xE4ftigte."),
          u(),
          f(84, "li"),
          d(85, "Kommunikationspartner."),
          u(),
          f(86, "li"),
          d(87, "Nutzer."),
          u()(),
          f(88, "h3"),
          d(89, "Zwecke der Verarbeitung"),
          u(),
          f(90, "ul")(91, "li"),
          d(92, "Kommunikation."),
          u(),
          f(93, "li"),
          d(94, "Sicherheitsma\xDFnahmen."),
          u(),
          f(95, "li"),
          d(96, "Reichweitenmessung."),
          u(),
          f(97, "li"),
          d(98, "Tracking."),
          u(),
          f(99, "li"),
          d(100, "Zielgruppenbildung."),
          u(),
          f(101, "li"),
          d(102, "Organisations- und Verwaltungsverfahren."),
          u(),
          f(103, "li"),
          d(104, "Feedback."),
          u(),
          f(105, "li"),
          d(106, "Marketing."),
          u(),
          f(107, "li"),
          d(108, "Profile mit nutzerbezogenen Informationen."),
          u(),
          f(109, "li"),
          d(
            110,
            "Bereitstellung unseres Onlineangebotes und Nutzerfreundlichkeit."
          ),
          u(),
          f(111, "li"),
          d(
            112,
            "Begr\xFCndung und Durchf\xFChrung von Besch\xE4ftigungsverh\xE4ltnissen."
          ),
          u(),
          f(113, "li"),
          d(114, "Informationstechnische Infrastruktur."),
          u(),
          f(115, "li"),
          d(116, "\xD6ffentlichkeitsarbeit."),
          u(),
          f(117, "li"),
          d(118, "Gesch\xE4ftsprozesse und betriebswirtschaftliche Verfahren."),
          u()(),
          f(119, "h2", 6),
          d(120, "Ma\xDFgebliche Rechtsgrundlagen"),
          u(),
          f(121, "p")(122, "strong"),
          d(123, "Ma\xDFgebliche Rechtsgrundlagen nach der DSGVO: "),
          u(),
          d(
            124,
            "Im Folgenden erhalten Sie eine \xDCbersicht der Rechtsgrundlagen der DSGVO, auf deren Basis wir personenbezogene Daten verarbeiten. Bitte nehmen Sie zur Kenntnis, dass neben den Regelungen der DSGVO nationale Datenschutzvorgaben in Ihrem bzw. unserem Wohn- oder Sitzland gelten k\xF6nnen. Sollten ferner im Einzelfall speziellere Rechtsgrundlagen ma\xDFgeblich sein, teilen wir Ihnen diese in der Datenschutzerkl\xE4rung mit. "
          ),
          u(),
          f(125, "ul")(126, "li")(127, "strong"),
          d(128, "Einwilligung (Art. 6 Abs. 1 S. 1 lit. a) DSGVO)"),
          u(),
          d(
            129,
            " - Die betroffene Person hat ihre Einwilligung in die Verarbeitung der sie betreffenden personenbezogenen Daten f\xFCr einen spezifischen Zweck oder mehrere bestimmte Zwecke gegeben. "
          ),
          u(),
          f(130, "li")(131, "strong"),
          d(
            132,
            "Vertragserf\xFCllung und vorvertragliche Anfragen (Art. 6 Abs. 1 S. 1 lit. b) DSGVO)"
          ),
          u(),
          d(
            133,
            " - Die Verarbeitung ist f\xFCr die Erf\xFCllung eines Vertrags, dessen Vertragspartei die betroffene Person ist, oder zur Durchf\xFChrung vorvertraglicher Ma\xDFnahmen erforderlich, die auf Anfrage der betroffenen Person erfolgen. "
          ),
          u(),
          f(134, "li")(135, "strong"),
          d(136, "Rechtliche Verpflichtung (Art. 6 Abs. 1 S. 1 lit. c) DSGVO)"),
          u(),
          d(
            137,
            " - Die Verarbeitung ist zur Erf\xFCllung einer rechtlichen Verpflichtung erforderlich, der der Verantwortliche unterliegt. "
          ),
          u(),
          f(138, "li")(139, "strong"),
          d(140, "Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO)"),
          u(),
          d(
            141,
            " - die Verarbeitung ist zur Wahrung der berechtigten Interessen des Verantwortlichen oder eines Dritten notwendig, vorausgesetzt, dass die Interessen, Grundrechte und Grundfreiheiten der betroffenen Person, die den Schutz personenbezogener Daten verlangen, nicht \xFCberwiegen. "
          ),
          u(),
          f(142, "li")(143, "strong"),
          d(
            144,
            "Verarbeitung besonderer Kategorien personenbezogener Daten in Bezug auf Gesundheitswesen, Beruf und soziale Sicherheit (Art. 9 Abs. 2 lit. h) DSGVO)"
          ),
          u(),
          d(
            145,
            " - Die Verarbeitung ist f\xFCr Zwecke der Gesundheitsvorsorge oder der Arbeitsmedizin, f\xFCr die Beurteilung der Arbeitsf\xE4higkeit des Besch\xE4ftigten, f\xFCr die medizinische Diagnostik, die Versorgung oder Behandlung im Gesundheits- oder Sozialbereich oder f\xFCr die Verwaltung von Systemen und Diensten im Gesundheits- oder Sozialbereich auf der Grundlage des Unionsrechts oder des Rechts eines Mitgliedstaats oder aufgrund eines Vertrags mit einem Angeh\xF6rigen eines Gesundheitsberufs erforderlich. "
          ),
          u()(),
          f(146, "p")(147, "strong"),
          d(148, "Nationale Datenschutzregelungen in Deutschland: "),
          u(),
          d(
            149,
            "Zus\xE4tzlich zu den Datenschutzregelungen der DSGVO gelten nationale Regelungen zum Datenschutz in Deutschland. Hierzu geh\xF6rt insbesondere das Gesetz zum Schutz vor Missbrauch personenbezogener Daten bei der Datenverarbeitung (Bundesdatenschutzgesetz \u2013 BDSG). Das BDSG enth\xE4lt insbesondere Spezialregelungen zum Recht auf Auskunft, zum Recht auf L\xF6schung, zum Widerspruchsrecht, zur Verarbeitung besonderer Kategorien personenbezogener Daten, zur Verarbeitung f\xFCr andere Zwecke und zur \xDCbermittlung sowie automatisierten Entscheidungsfindung im Einzelfall einschlie\xDFlich Profiling. Ferner k\xF6nnen Landesdatenschutzgesetze der einzelnen Bundesl\xE4nder zur Anwendung gelangen. "
          ),
          u(),
          f(150, "p")(151, "strong"),
          d(
            152,
            "Ma\xDFgebliche Rechtsgrundlagen nach dem Deutschen Datenschutzgesetz: "
          ),
          u(),
          d(
            153,
            'Wenn Sie sich in Deutschland befinden, bearbeiten wir Ihre Daten auf Grundlage des Bundesgesetzes \xFCber den Datenschutz (kurz \u201EDeutschen DSG"). Anders als beispielsweise die DSGVO sieht das Deutschen DSG grunds\xE4tzlich nicht vor, dass eine Rechtsgrundlage f\xFCr die Bearbeitung der Personendaten genannt werden muss und die Bearbeitung von Personendaten nach Treu und Glauben durchgef\xFChrt wird, rechtm\xE4\xDFig und verh\xE4ltnism\xE4\xDFig ist (Art. 6 Abs. 1 und 2 des Deutschen DSG). Zudem werden Personendaten von uns nur zu einem bestimmten, f\xFCr die betroffene Person erkennbaren Zweck beschafft und nur so bearbeitet, wie es mit diesem Zweck vereinbar ist (Art. 6 Abs. 3 des Deutschen DSG). '
          ),
          u(),
          f(154, "p")(155, "strong"),
          d(156, "Hinweis auf Geltung DSGVO und Deutschen DSG: "),
          u(),
          d(
            157,
            'Diese Datenschutzhinweise dienen sowohl der Informationserteilung nach dem Deutschen DSG als auch nach der Datenschutzgrundverordnung (DSGVO). Aus diesem Grund bitten wir Sie zu beachten, dass aufgrund der breiteren r\xE4umlichen Anwendung und Verst\xE4ndlichkeit die Begriffe der DSGVO verwendet werden. Insbesondere statt der im Deutschen DSG verwendeten Begriffe \u201EBearbeitung" von \u201EPersonendaten", "\xFCberwiegendes Interesse" und "besonders sch\xFCtzenswerte Personendaten" werden die in der DSGVO verwendeten Begriffe \u201EVerarbeitung" von \u201Epersonenbezogenen Daten" sowie "berechtigtes Interesse" und "besondere Kategorien von Daten" verwendet. Die gesetzliche Bedeutung der Begriffe wird jedoch im Rahmen der Geltung des Deutschen DSG weiterhin nach dem Deutschen DSG bestimmt. '
          ),
          u(),
          f(158, "h2", 7),
          d(159, "Sicherheitsma\xDFnahmen"),
          u(),
          f(160, "p"),
          d(
            161,
            " Wir treffen nach Ma\xDFgabe der gesetzlichen Vorgaben unter Ber\xFCcksichtigung des Stands der Technik, der Implementierungskosten und der Art, des Umfangs, der Umst\xE4nde und der Zwecke der Verarbeitung sowie der unterschiedlichen Eintrittswahrscheinlichkeiten und des Ausma\xDFes der Bedrohung der Rechte und Freiheiten nat\xFCrlicher Personen geeignete technische und organisatorische Ma\xDFnahmen, um ein dem Risiko angemessenes Schutzniveau zu gew\xE4hrleisten. "
          ),
          u(),
          f(162, "p"),
          d(
            163,
            " Zu den Ma\xDFnahmen geh\xF6ren insbesondere die Sicherung der Vertraulichkeit, Integrit\xE4t und Verf\xFCgbarkeit von Daten durch Kontrolle des physischen und elektronischen Zugangs zu den Daten als auch des sie betreffenden Zugriffs, der Eingabe, der Weitergabe, der Sicherung der Verf\xFCgbarkeit und ihrer Trennung. Des Weiteren haben wir Verfahren eingerichtet, die eine Wahrnehmung von Betroffenenrechten, die L\xF6schung von Daten und Reaktionen auf die Gef\xE4hrdung der Daten gew\xE4hrleisten. Ferner ber\xFCcksichtigen wir den Schutz personenbezogener Daten bereits bei der Entwicklung bzw. Auswahl von Hardware, Software sowie Verfahren entsprechend dem Prinzip des Datenschutzes, durch Technikgestaltung und durch datenschutzfreundliche Voreinstellungen. "
          ),
          u(),
          f(164, "h2", 8),
          d(165, "\xDCbermittlung von personenbezogenen Daten"),
          u(),
          f(166, "p"),
          d(
            167,
            " Im Rahmen unserer Verarbeitung von personenbezogenen Daten kommt es vor, dass diese an andere Stellen, Unternehmen, rechtlich selbstst\xE4ndige Organisationseinheiten oder Personen \xFCbermittelt beziehungsweise ihnen gegen\xFCber offengelegt werden. Zu den Empf\xE4ngern dieser Daten k\xF6nnen z.\xA0B. mit IT-Aufgaben beauftragte Dienstleister geh\xF6ren oder Anbieter von Diensten und Inhalten, die in eine Website eingebunden sind. In solchen Fall beachten wir die gesetzlichen Vorgaben und schlie\xDFen insbesondere entsprechende Vertr\xE4ge bzw. Vereinbarungen, die dem Schutz Ihrer Daten dienen, mit den Empf\xE4ngern Ihrer Daten ab. "
          ),
          u(),
          f(168, "h2", 9),
          d(169, "Internationale Datentransfers"),
          u(),
          f(170, "p"),
          d(
            171,
            " Datenverarbeitung in Drittl\xE4ndern: Sofern wir Daten in einem Drittland (d.\xA0h., au\xDFerhalb der Europ\xE4ischen Union (EU), des Europ\xE4ischen Wirtschaftsraums (EWR)) verarbeiten oder die Verarbeitung im Rahmen der Inanspruchnahme von Diensten Dritter oder der Offenlegung bzw. \xDCbermittlung von Daten an andere Personen, Stellen oder Unternehmen stattfindet, erfolgt dies nur im Einklang mit den gesetzlichen Vorgaben. Sofern das Datenschutzniveau in dem Drittland mittels eines Angemessenheitsbeschlusses anerkannt wurde (Art. 45 DSGVO), dient dieser als Grundlage des Datentransfers. Im \xDCbrigen erfolgen Datentransfers nur dann, wenn das Datenschutzniveau anderweitig gesichert ist, insbesondere durch Standardvertragsklauseln (Art. 46 Abs. 2 lit. c) DSGVO), ausdr\xFCckliche Einwilligung oder im Fall vertraglicher oder gesetzlich erforderlicher \xDCbermittlung (Art. 49 Abs. 1 DSGVO). Im \xDCbrigen teilen wir Ihnen die Grundlagen der Drittland\xFCbermittlung bei den einzelnen Anbietern aus dem Drittland mit, wobei die Angemessenheitsbeschl\xFCsse als Grundlagen vorrangig gelten. Informationen zu Drittlandtransfers und vorliegenden Angemessenheitsbeschl\xFCssen k\xF6nnen dem Informationsangebot der EU-Kommission entnommen werden: "
          ),
          f(172, "a", 10),
          d(173, "link"),
          u()(),
          f(174, "p"),
          d(
            175,
            ' EU-US Trans-Atlantic Data Privacy Framework: Im Rahmen des sogenannten \u201EData Privacy Framework" (DPF) hat die EU-Kommission das Datenschutzniveau ebenfalls f\xFCr bestimmte Unternehmen aus den USA im Rahmen der Angemessenheitsbeschlusses vom 10.07.2023 als sicher anerkannt. Die Liste der zertifizierten Unternehmen als auch weitere Informationen zu dem DPF k\xF6nnen Sie der Website des Handelsministeriums der USA unter '
          ),
          f(176, "a", 11),
          d(177, "link"),
          u(),
          d(
            178,
            " (in Englisch) entnehmen. Wir informieren Sie im Rahmen der Datenschutzhinweise, welche von uns eingesetzten Diensteanbieter unter dem Data Privacy Framework zertifiziert sind. "
          ),
          u(),
          f(179, "p"),
          d(
            180,
            " Bekanntgabe von Personendaten ins Ausland: Gem\xE4\xDF dem Deutschen DSG geben wir personenbezogene Daten nur dann ins Ausland bekannt, wenn ein angemessener Schutz der betroffenen Personen gew\xE4hrleistet ist (Art. 16 Deutschen DSG). Sofern der Bundesrat keinen angemessenen Schutz festgestellt hat (Liste: "
          ),
          f(181, "a", 12),
          d(182, "Link"),
          u(),
          d(
            183,
            "), ergreifen wir alternative Sicherheitsma\xDFnahmen. Diese k\xF6nnen internationale Vertr\xE4ge, spezifische Garantien, Datenschutzklauseln in Vertr\xE4gen, von der Eidgen\xF6ssischen Datenschutz- und \xD6ffentlichkeitsbeauftragten (ED\xD6B) genehmigte Standarddatenschutzklauseln oder von ED\xD6B oder einer zust\xE4ndigen Datenschutzbeh\xF6rde eines anderen Landes vorab anerkannte unternehmensinterne Datenschutzvorschriften umfassen. "
          ),
          u(),
          f(184, "p"),
          d(
            185,
            " Laut Art. 16 des Deutschen DSG k\xF6nnen Ausnahmen f\xFCr die Bekanntgabe von Daten ins Ausland zugelassen werden, wenn bestimmte Bedingungen erf\xFCllt sind, einschlie\xDFlich Einwilligung der betroffenen Person, Vertragsabwicklung, \xF6ffentliches Interesse, Schutz von Leben oder k\xF6rperlicher Unversehrtheit, \xF6ffentlich gemachte Daten oder Daten aus einem gesetzlich vorgesehenen Register. Diese Bekanntgaben erfolgen stets im Einklang mit den gesetzlichen Anforderungen. "
          ),
          u(),
          f(186, "h2", 13),
          d(
            187,
            "Allgemeine Informationen zur Datenspeicherung und L\xF6schung"
          ),
          u(),
          f(188, "p"),
          d(
            189,
            " Wir l\xF6schen personenbezogene Daten, die wir verarbeiten, gem\xE4\xDF den gesetzlichen Bestimmungen, sobald die zugrundeliegenden Einwilligungen widerrufen werden oder keine weiteren rechtlichen Grundlagen f\xFCr die Verarbeitung bestehen. Dies betrifft F\xE4lle, in denen der urspr\xFCngliche Verarbeitungszweck entf\xE4llt oder die Daten nicht mehr ben\xF6tigt werden. Ausnahmen von dieser Regelung bestehen, wenn gesetzliche Pflichten oder besondere Interessen eine l\xE4ngere Aufbewahrung oder Archivierung der Daten erfordern. "
          ),
          u(),
          f(190, "p"),
          d(
            191,
            " Insbesondere m\xFCssen Daten, die aus handels- oder steuerrechtlichen Gr\xFCnden aufbewahrt werden m\xFCssen oder deren Speicherung notwendig ist zur Rechtsverfolgung oder zum Schutz der Rechte anderer nat\xFCrlicher oder juristischer Personen, entsprechend archiviert werden. "
          ),
          u(),
          f(192, "p"),
          d(
            193,
            " Unsere Datenschutzhinweise enthalten zus\xE4tzliche Informationen zur Aufbewahrung und L\xF6schung von Daten, die speziell f\xFCr bestimmte Verarbeitungsprozesse gelten. "
          ),
          u(),
          f(194, "p"),
          d(
            195,
            " Bei mehreren Angaben zur Aufbewahrungsdauer oder L\xF6schungsfristen eines Datums, ist stets die l\xE4ngste Frist ma\xDFgeblich. "
          ),
          u(),
          f(196, "p"),
          d(
            197,
            " Beginnt eine Frist nicht ausdr\xFCcklich zu einem bestimmten Datum und betr\xE4gt sie mindestens ein Jahr, so startet sie automatisch am Ende des Kalenderjahres, in dem das fristausl\xF6sende Ereignis eingetreten ist. Im Fall laufender Vertragsverh\xE4ltnisse, in deren Rahmen Daten gespeichert werden, ist das fristausl\xF6sende Ereignis der Zeitpunkt des Wirksamwerdens der K\xFCndigung oder sonstige Beendigung des Rechtsverh\xE4ltnisses. "
          ),
          u(),
          f(198, "p"),
          d(
            199,
            " Daten, die nicht mehr f\xFCr den urspr\xFCnglich vorgesehenen Zweck, sondern aufgrund gesetzlicher Vorgaben oder anderer Gr\xFCnde aufbewahrt werden, verarbeiten wir ausschlie\xDFlich zu den Gr\xFCnden, die ihre Aufbewahrung rechtfertigen. "
          ),
          u(),
          f(200, "p")(201, "strong"),
          d(
            202,
            "Weitere Hinweise zu Verarbeitungsprozessen, Verfahren und Diensten:"
          ),
          u()(),
          f(203, "ul", 14)(204, "li")(205, "strong"),
          d(206, "Aufbewahrung und L\xF6schung von Daten: "),
          u(),
          d(
            207,
            "Die folgenden allgemeinen Fristen gelten f\xFCr die Aufbewahrung und Archivierung nach deutschem Recht: "
          ),
          f(208, "ul")(209, "li"),
          d(
            210,
            " 10 Jahre - Aufbewahrungsfrist f\xFCr B\xFCcher und Aufzeichnungen, Jahresabschl\xFCsse, Inventare, Lageberichte, Er\xF6ffnungsbilanz sowie die zu ihrem Verst\xE4ndnis erforderlichen Arbeitsanweisungen und sonstigen Organisationsunterlagen, Buchungsbelege und Rechnungen (\xA7 147 Abs. 3 i. V. m. Abs. 1 Nr. 1, 4 und 4a AO, \xA7 14b Abs. 1 UStG, \xA7 257 Abs. 1 Nr. 1 u. 4, Abs. 4 HGB). "
          ),
          u(),
          f(211, "li"),
          d(
            212,
            " 6 Jahre - \xDCbrige Gesch\xE4ftsunterlagen: empfangene Handels- oder Gesch\xE4ftsbriefe, Wiedergaben der abgesandten Handels- oder Gesch\xE4ftsbriefe, sonstige Unterlagen, soweit sie f\xFCr die Besteuerung von Bedeutung sind, z.\xA0B. Stundenlohnzettel, Betriebsabrechnungsb\xF6gen, Kalkulationsunterlagen, Preisauszeichnungen, aber auch Lohnabrechnungsunterlagen, soweit sie nicht bereits Buchungsbelege sind und Kassenstreifen (\xA7 147 Abs. 3 i. V. m. Abs. 1 Nr. 2, 3, 5 AO, \xA7 257 Abs. 1 Nr. 2 u. 3, Abs. 4 HGB). "
          ),
          u(),
          f(213, "li"),
          d(
            214,
            " 3 Jahre - Daten, die erforderlich sind, um potenzielle Gew\xE4hrleistungs- und Schadensersatzanspr\xFCche oder \xE4hnliche vertragliche Anspr\xFCche und Rechte zu ber\xFCcksichtigen sowie damit verbundene Anfragen zu bearbeiten, basierend auf fr\xFCheren Gesch\xE4ftserfahrungen und \xFCblichen Branchenpraktiken, werden f\xFCr die Dauer der regul\xE4ren gesetzlichen Verj\xE4hrungsfrist von drei Jahren gespeichert (\xA7\xA7 195, 199 BGB). "
          ),
          u()(),
          d(215, " . "),
          u(),
          f(216, "li")(217, "strong"),
          d(218, "Aufbewahrung und L\xF6schung von Daten: "),
          u(),
          d(
            219,
            "Die folgenden allgemeinen Fristen gelten f\xFCr die Aufbewahrung und Archivierung nach dem Deutschen Recht: "
          ),
          f(220, "ul")(221, "li"),
          d(
            222,
            " 10 Jahre - Aufbewahrungsfrist f\xFCr B\xFCcher und Aufzeichnungen, Jahresabschl\xFCsse, Inventare, Lageberichte, Er\xF6ffnungsbilanzen, Buchungsbelege und Rechnungen sowie alle erforderlichen Arbeitsanweisungen und sonstigen Organisationsunterlagen (Art. 958f des Deutschenischen Obligationenrechts (OR)). "
          ),
          u(),
          f(223, "li"),
          d(
            224,
            " 10 Jahre - Daten, die zur Ber\xFCcksichtigung potenzieller Schadenersatzanspr\xFCche oder \xE4hnlicher vertraglicher Anspr\xFCche und Rechte notwendig sind, sowie f\xFCr die Bearbeitung damit verbundener Anfragen, basierend auf fr\xFCheren Gesch\xE4ftserfahrungen und den \xFCblichen Branchenpraktiken, werden f\xFCr den Zeitraum der gesetzlichen Verj\xE4hrungsfrist von zehn Jahren gespeichert, es sei denn, eine k\xFCrzere Frist von f\xFCnf Jahren ist ma\xDFgeblich, die in bestimmten F\xE4llen einschl\xE4gig ist (Art. 127, 130 OR). Mit Ablauf von f\xFCnf Jahren verj\xE4hren die Forderungen f\xFCr Miet-, Pacht- und Kapitalzinse sowie andere periodische Leistungen, aus Lieferung von Lebensmitteln, f\xFCr Bek\xF6stigung und f\xFCr Wirtsschulden, sowie aus Handwerksarbeit, Kleinverkauf von Waren, \xE4rztlicher Besorgung, Berufsarbeiten von Anw\xE4lten, Rechtsagenten, Prokuratoren und Notaren und aus dem Arbeitsverh\xE4ltnis von Arbeitnehmern (Art. 128 OR). "
          ),
          u()()()(),
          f(225, "h2", 15),
          d(226, "Bereitstellung des Onlineangebots und Webhosting"),
          u(),
          f(227, "p"),
          d(
            228,
            " Wir verarbeiten die Daten der Nutzer, um ihnen unsere Online-Dienste zur Verf\xFCgung stellen zu k\xF6nnen. Zu diesem Zweck verarbeiten wir die IP-Adresse des Nutzers, die notwendig ist, um die Inhalte und Funktionen unserer Online-Dienste an den Browser oder das Endger\xE4t der Nutzer zu \xFCbermitteln. "
          ),
          u(),
          f(229, "ul", 14)(230, "li")(231, "strong"),
          d(232, "Verarbeitete Datenarten:"),
          u(),
          d(
            233,
            " Nutzungsdaten (z. B. Seitenaufrufe und Verweildauer, Klickpfade, Nutzungsintensit\xE4t und -frequenz, verwendete Ger\xE4tetypen und Betriebssysteme, Interaktionen mit Inhalten und Funktionen); Meta-, Kommunikations- und Verfahrensdaten (z. B. IP-Adressen, Zeitangaben, Identifikationsnummern, beteiligte Personen). Protokolldaten (z.\xA0B. Logfiles betreffend Logins oder den Abruf von Daten oder Zugriffszeiten.). "
          ),
          u(),
          f(234, "li")(235, "strong"),
          d(236, "Betroffene Personen:"),
          u(),
          d(
            237,
            " Nutzer (z.\xA0B. Webseitenbesucher, Nutzer von Onlinediensten). "
          ),
          u(),
          f(238, "li")(239, "strong"),
          d(240, "Zwecke der Verarbeitung:"),
          u(),
          d(
            241,
            " Bereitstellung unseres Onlineangebotes und Nutzerfreundlichkeit; Informationstechnische Infrastruktur (Betrieb und Bereitstellung von Informationssystemen und technischen Ger\xE4ten (Computer, Server etc.).). Sicherheitsma\xDFnahmen. "
          ),
          u(),
          f(242, "li", 16)(243, "strong"),
          d(244, "Rechtsgrundlagen:"),
          u(),
          d(
            245,
            " Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO). "
          ),
          u()(),
          f(246, "p")(247, "strong"),
          d(
            248,
            "Weitere Hinweise zu Verarbeitungsprozessen, Verfahren und Diensten:"
          ),
          u()(),
          f(249, "ul", 14)(250, "li")(251, "strong"),
          d(252, "Erhebung von Zugriffsdaten und Logfiles: "),
          u(),
          d(
            253,
            'Der Zugriff auf unser Onlineangebot wird in Form von sogenannten "Server-Logfiles" protokolliert. Zu den Serverlogfiles k\xF6nnen die Adresse und der Name der abgerufenen Webseiten und Dateien, Datum und Uhrzeit des Abrufs, \xFCbertragene Datenmengen, Meldung \xFCber erfolgreichen Abruf, Browsertyp nebst Version, das Betriebssystem des Nutzers, Referrer URL (die zuvor besuchte Seite) und im Regelfall IP-Adressen und der anfragende Provider geh\xF6ren. Die Serverlogfiles k\xF6nnen zum einen zu Sicherheitszwecken eingesetzt werden, z.\xA0B. um eine \xDCberlastung der Server zu vermeiden (insbesondere im Fall von missbr\xE4uchlichen Angriffen, sogenannten DDoS-Attacken), und zum anderen, um die Auslastung der Server und ihre Stabilit\xE4t sicherzustellen; '
          ),
          f(254, "span", 16)(255, "strong"),
          d(256, "Rechtsgrundlagen:"),
          u(),
          d(
            257,
            " Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO). "
          ),
          u(),
          f(258, "strong"),
          d(259, "L\xF6schung von Daten:"),
          u(),
          d(
            260,
            " Logfile-Informationen werden f\xFCr die Dauer von maximal 30 Tagen gespeichert und danach gel\xF6scht oder anonymisiert. Daten, deren weitere Aufbewahrung zu Beweiszwecken erforderlich ist, sind bis zur endg\xFCltigen Kl\xE4rung des jeweiligen Vorfalls von der L\xF6schung ausgenommen. "
          ),
          u()(),
          f(261, "h2", 17),
          d(262, "Einsatz von Cookies"),
          u(),
          f(263, "p"),
          d(
            264,
            " Cookies sind kleine Textdateien bzw. sonstige Speichervermerke, die Informationen auf Endger\xE4ten speichern und aus ihnen auslesen. Zum Beispiel, um den Log-in-Status in einem Nutzerkonto, einen Warenkorbinhalt in einem E-Shop, die aufgerufenen Inhalte oder verwendete Funktionen eines Onlineangebots zu speichern. Cookies k\xF6nnen ferner in Bezug auf unterschiedliche Anliegen Einsatz finden, etwa zu Zwecken der Funktionsf\xE4higkeit, der Sicherheit und des Komforts von Onlineangeboten sowie der Erstellung von Analysen der Besucherstr\xF6me. "
          ),
          u(),
          f(265, "p")(266, "strong"),
          d(267, "Hinweise zur Einwilligung:\xA0"),
          u(),
          d(
            268,
            "Wir setzen Cookies im Einklang mit den gesetzlichen Vorschriften ein. Daher holen wir von den Nutzern eine vorhergehende Einwilligung ein, es sei denn, sie ist laut Gesetzeslage nicht gefordert. Eine Erlaubnis ist insbesondere nicht notwendig, wenn das Speichern und das Auslesen der Informationen, also auch von Cookies, unbedingt erforderlich sind, um den Nutzern einen von ihnen ausdr\xFCcklich gew\xFCnschten Telemediendienst (also unser Onlineangebot) zur Verf\xFCgung zu stellen. Die widerrufliche Einwilligung wird ihnen gegen\xFCber deutlich kommuniziert und enth\xE4lt die Informationen zur jeweiligen Cookie-Nutzung. "
          ),
          u(),
          f(269, "p")(270, "strong"),
          d(271, "Hinweise zu datenschutzrechtlichen Rechtsgrundlagen:\xA0"),
          u(),
          d(
            272,
            "Auf welcher datenschutzrechtlichen Grundlage wir die personenbezogenen Daten der Nutzer mithilfe von Cookies verarbeiten, h\xE4ngt davon ab, ob wir sie um eine Einwilligung bitten. Falls die Nutzer akzeptieren, ist die Rechtsgrundlage der Verwertung ihrer Daten die erkl\xE4rte Einwilligung. Andernfalls werden die mithilfe von Cookies verwerteten Daten auf Grundlage unserer berechtigten Interessen (z.\xA0B. an einem betriebswirtschaftlichen Betrieb unseres Onlineangebots und der Verbesserung seiner Nutzbarkeit) verarbeitet oder, falls dies im Rahmen der Erf\xFCllung unserer vertraglichen Pflichten erfolgt, wenn der Einsatz von Cookies erforderlich ist, um unseren vertraglichen Verpflichtungen nachzukommen. Zu welchen Zwecken die Cookies von uns verwertet werden, dar\xFCber kl\xE4ren wir im Laufe dieser Datenschutzerkl\xE4rung oder im Rahmen von unseren Einwilligungs- und Verarbeitungsprozessen auf. "
          ),
          u(),
          f(273, "p")(274, "strong"),
          d(275, "Speicherdauer:\xA0"),
          u(),
          d(
            276,
            "Im Hinblick auf die Speicherdauer werden die folgenden Arten von Cookies unterschieden: "
          ),
          u(),
          f(277, "ul")(278, "li")(279, "strong"),
          d(280, "Tempor\xE4re Cookies (auch: Session- oder Sitzungscookies):"),
          u(),
          d(
            281,
            " Tempor\xE4re Cookies werden sp\xE4testens gel\xF6scht, nachdem ein Nutzer ein Onlineangebot verlassen und sein Endger\xE4t (z.\xA0B. Browser oder mobile Applikation) geschlossen hat. "
          ),
          u(),
          f(282, "li")(283, "strong"),
          d(284, "Permanente Cookies:"),
          u(),
          d(
            285,
            " Permanente Cookies bleiben auch nach dem Schlie\xDFen des Endger\xE4ts gespeichert. So k\xF6nnen beispielsweise der Log-in-Status gespeichert und bevorzugte Inhalte direkt angezeigt werden, wenn der Nutzer eine Website erneut besucht. Ebenso k\xF6nnen die mithilfe von Cookies erhobenen Nutzerdaten zur Reichweitenmessung Verwendung finden. Sofern wir Nutzern keine expliziten Angaben zur Art und Speicherdauer von Cookies mitteilen (z.\xA0B. im Rahmen der Einholung der Einwilligung), sollten sie davon ausgehen, dass diese permanent sind und die Speicherdauer bis zu zwei Jahre betragen kann. "
          ),
          u()(),
          f(286, "p")(287, "strong"),
          d(
            288,
            "Allgemeine Hinweise zum Widerruf und Widerspruch (Opt-out):\xA0"
          ),
          u(),
          d(
            289,
            "Nutzer k\xF6nnen die von ihnen abgegebenen Einwilligungen jederzeit widerrufen und zudem einen Widerspruch gegen die Verarbeitung entsprechend den gesetzlichen Vorgaben, auch mittels der Privatsph\xE4re-Einstellungen ihres Browsers, erkl\xE4ren. "
          ),
          u(),
          f(290, "ul", 14)(291, "li")(292, "strong"),
          d(293, "Verarbeitete Datenarten:"),
          u(),
          d(
            294,
            " Meta-, Kommunikations- und Verfahrensdaten (z. B. IP-Adressen, Zeitangaben, Identifikationsnummern, beteiligte Personen). "
          ),
          u(),
          f(295, "li")(296, "strong"),
          d(297, "Betroffene Personen:"),
          u(),
          d(
            298,
            " Nutzer (z.\xA0B. Webseitenbesucher, Nutzer von Onlinediensten). "
          ),
          u(),
          f(299, "li", 16)(300, "strong"),
          d(301, "Rechtsgrundlagen:"),
          u(),
          d(
            302,
            " Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO). Einwilligung (Art. 6 Abs. 1 S. 1 lit. a) DSGVO). "
          ),
          u()(),
          f(303, "p")(304, "strong"),
          d(
            305,
            "Weitere Hinweise zu Verarbeitungsprozessen, Verfahren und Diensten:"
          ),
          u()(),
          f(306, "ul", 14)(307, "li")(308, "strong"),
          d(
            309,
            "Verarbeitung von Cookie-Daten auf Grundlage einer Einwilligung: "
          ),
          u(),
          d(
            310,
            "Wir setzen eine Einwilligungs-Management-L\xF6sung ein, bei der die Einwilligung der Nutzer zur Verwendung von Cookies oder zu den im Rahmen der Einwilligungs-Management-L\xF6sung genannten Verfahren und Anbietern eingeholt wird. Dieses Verfahren dient der Einholung, Protokollierung, Verwaltung und dem Widerruf von Einwilligungen, insbesondere bezogen auf den Einsatz von Cookies und vergleichbaren Technologien, die zur Speicherung, zum Auslesen und zur Verarbeitung von Informationen auf den Endger\xE4ten der Nutzer eingesetzt werden. Im Rahmen dieses Verfahrens werden die Einwilligungen der Nutzer f\xFCr die Nutzung von Cookies und die damit verbundenen Verarbeitungen von Informationen, einschlie\xDFlich der im Einwilligungs-Management-Verfahren genannten spezifischen Verarbeitungen und Anbieter, eingeholt. Die Nutzer haben zudem die M\xF6glichkeit, ihre Einwilligungen zu verwalten und zu widerrufen. Die Einwilligungserkl\xE4rungen werden gespeichert, um eine erneute Abfrage zu vermeiden und den Nachweis der Einwilligung gem\xE4\xDF der gesetzlichen Anforderungen f\xFChren zu k\xF6nnen. Die Speicherung erfolgt serverseitig und/oder in einem Cookie (sogenanntes Opt-In-Cookie) oder mittels vergleichbarer Technologien, um die Einwilligung einem spezifischen Nutzer oder dessen Ger\xE4t zuordnen zu k\xF6nnen. Sofern keine spezifischen Angaben zu den Anbietern von Einwilligungs-Management-Diensten vorliegen, gelten folgende allgemeine Hinweise: Die Dauer der Speicherung der Einwilligung betr\xE4gt bis zu zwei Jahre. Dabei wird ein pseudonymer Nutzer-Identifikator erstellt, der zusammen mit dem Zeitpunkt der Einwilligung, den Angaben zum Umfang der Einwilligung (z.\xA0B. betreffende Kategorien von Cookies und/oder Diensteanbieter) sowie Informationen \xFCber den Browser, das System und das verwendete Endger\xE4t gespeichert wird; "
          ),
          f(311, "span", 16)(312, "strong"),
          d(313, "Rechtsgrundlagen:"),
          u(),
          d(314, " Einwilligung (Art. 6 Abs. 1 S. 1 lit. a) DSGVO)."),
          u()()(),
          f(315, "h2", 18),
          d(316, "Kontakt- und Anfrageverwaltung"),
          u(),
          f(317, "p"),
          d(
            318,
            " Bei der Kontaktaufnahme mit uns (z.\xA0B. per Post, Kontaktformular, E-Mail, Telefon oder via soziale Medien) sowie im Rahmen bestehender Nutzer- und Gesch\xE4ftsbeziehungen werden die Angaben der anfragenden Personen verarbeitet, soweit dies zur Beantwortung der Kontaktanfragen und etwaiger angefragter Ma\xDFnahmen erforderlich ist. "
          ),
          u(),
          f(319, "ul", 14)(320, "li")(321, "strong"),
          d(322, "Verarbeitete Datenarten:"),
          u(),
          d(
            323,
            " Bestandsdaten (z.\xA0B. der vollst\xE4ndige Name, Wohnadresse, Kontaktinformationen, Kundennummer, etc.); Kontaktdaten (z.\xA0B. Post- und E-Mail-Adressen oder Telefonnummern); Inhaltsdaten (z. B. textliche oder bildliche Nachrichten und Beitr\xE4ge sowie die sie betreffenden Informationen, wie z. B. Angaben zur Autorenschaft oder Zeitpunkt der Erstellung); Nutzungsdaten (z. B. Seitenaufrufe und Verweildauer, Klickpfade, Nutzungsintensit\xE4t und -frequenz, verwendete Ger\xE4tetypen und Betriebssysteme, Interaktionen mit Inhalten und Funktionen). Meta-, Kommunikations- und Verfahrensdaten (z. B. IP-Adressen, Zeitangaben, Identifikationsnummern, beteiligte Personen). "
          ),
          u(),
          f(324, "li")(325, "strong"),
          d(326, "Betroffene Personen:"),
          u(),
          d(327, " Kommunikationspartner."),
          u(),
          f(328, "li")(329, "strong"),
          d(330, "Zwecke der Verarbeitung:"),
          u(),
          d(
            331,
            " Kommunikation; Organisations- und Verwaltungsverfahren; Feedback (z.\xA0B. Sammeln von Feedback via Online-Formular). Bereitstellung unseres Onlineangebotes und Nutzerfreundlichkeit. "
          ),
          u(),
          f(332, "li", 16)(333, "strong"),
          d(334, "Rechtsgrundlagen:"),
          u(),
          d(
            335,
            " Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO). Vertragserf\xFCllung und vorvertragliche Anfragen (Art. 6 Abs. 1 S. 1 lit. b) DSGVO). "
          ),
          u()(),
          f(336, "p")(337, "strong"),
          d(
            338,
            "Weitere Hinweise zu Verarbeitungsprozessen, Verfahren und Diensten:"
          ),
          u()(),
          f(339, "ul", 14)(340, "li")(341, "strong"),
          d(342, "Kontaktformular: "),
          u(),
          d(
            343,
            "Bei Kontaktaufnahme \xFCber unser Kontaktformular, per E-Mail oder anderen Kommunikationswegen, verarbeiten wir die uns \xFCbermittelten personenbezogenen Daten zur Beantwortung und Bearbeitung des jeweiligen Anliegens. Dies umfasst in der Regel Angaben wie Name, Kontaktinformationen und gegebenenfalls weitere Informationen, die uns mitgeteilt werden und zur angemessenen Bearbeitung erforderlich sind. Wir nutzen diese Daten ausschlie\xDFlich f\xFCr den angegebenen Zweck der Kontaktaufnahme und Kommunikation; "
          ),
          f(344, "span", 16)(345, "strong"),
          d(346, "Rechtsgrundlagen:"),
          u(),
          d(
            347,
            " Vertragserf\xFCllung und vorvertragliche Anfragen (Art. 6 Abs. 1 S. 1 lit. b) DSGVO), Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO)."
          ),
          u()()(),
          f(348, "h2", 19),
          d(349, "Onlinemarketing"),
          u(),
          f(350, "p"),
          d(
            351,
            ' Wir verarbeiten personenbezogene Daten zum Zweck des Onlinemarketings, worunter insbesondere die Vermarktung von Werbefl\xE4chen oder die Darstellung von werbenden und sonstigen Inhalten (zusammenfassend als \u201EInhalte" bezeichnet) anhand potenzieller Interessen der Nutzer sowie die Messung ihrer Effektivit\xE4t fallen k\xF6nnen. '
          ),
          u(),
          f(352, "p"),
          d(
            353,
            ' Zu diesen Zwecken werden sogenannte Nutzerprofile angelegt und in einer Datei (der sogenannte \u201ECookie") gespeichert oder \xE4hnliche Verfahren genutzt, mittels derer die f\xFCr die Darstellung der vorgenannten Inhalte relevanten Angaben zum Nutzer gespeichert werden. Hierzu k\xF6nnen beispielsweise betrachtete Inhalte, besuchte Websites, genutzte Onlinenetzwerke, aber auch Kommunikationspartner und technische Angaben geh\xF6ren, wie etwa der verwendete Browser, das benutzte Computersystem sowie Ausk\xFCnfte zu Nutzungszeiten und genutzten Funktionen. Sofern Nutzer in die Erhebung ihrer Standortdaten eingewilligt haben, k\xF6nnen auch diese verarbeitet werden. '
          ),
          u(),
          f(354, "p"),
          d(
            355,
            " Zudem werden die IP-Adressen der Nutzer gespeichert. Jedoch nutzen wir zur Verf\xFCgung stehende IP-Masking-Verfahren (d. h. Pseudonymisierung durch K\xFCrzung der IP-Adresse) zum Nutzerschutz. Generell werden im Rahmen des Onlinemarketingverfahrens keine Klardaten der Nutzer (wie z.\xA0B. E-Mail-Adressen oder Namen) gespeichert, sondern Pseudonyme. Das hei\xDFt, wir als auch die Anbieter der Onlinemarketingverfahren kennen nicht die tats\xE4chliche Nutzeridentit\xE4t, sondern nur die in deren Profilen gespeicherten Angaben. "
          ),
          u(),
          f(356, "p"),
          d(
            357,
            " Die Aussagen in den Profilen werden im Regelfall in den Cookies oder mittels \xE4hnlicher Verfahren gespeichert. Diese Cookies k\xF6nnen sp\xE4ter generell auch auf anderen Websites, die dasselbe Onlinemarketingverfahren einsetzen, ausgelesen und zum Zweck der Darstellung von Inhalten analysiert sowie mit weiteren Daten erg\xE4nzt und auf dem Server des Onlinemarketingverfahrensanbieters gespeichert werden. "
          ),
          u(),
          f(358, "p"),
          d(
            359,
            " Ausnahmsweise ist es m\xF6glich, Klardaten den Profilen zuzuordnen, vornehmlich dann, wenn die Nutzer zum Beispiel Mitglieder eines sozialen Netzwerks sind, dessen Onlinemarketingverfahren wir einsetzen und das Netzwerk die Nutzerprofile mit den vorgenannten Angaben verbindet. Wir bitten darum, zu beachten, dass Nutzer mit den Anbietern zus\xE4tzliche Abreden treffen k\xF6nnen, etwa durch Einwilligung im Rahmen der Registrierung. "
          ),
          u(),
          f(360, "p"),
          d(
            361,
            " Wir erhalten grunds\xE4tzlich nur Zugang zu zusammengefassten Informationen \xFCber den Erfolg unserer Werbeanzeigen. Jedoch k\xF6nnen wir im Rahmen sogenannter Konversionsmessungen pr\xFCfen, welche unserer Onlinemarketingverfahren zu einer sogenannten Konversion gef\xFChrt haben, d. h. beispielsweise zu einem Vertragsschluss mit uns. Die Konversionsmessung wird alleine zur Erfolgsanalyse unserer Marketingma\xDFnahmen verwendet. "
          ),
          u(),
          f(362, "p"),
          d(
            363,
            " Solange nicht anders angegeben, bitten wir Sie, davon auszugehen, dass eingesetzte Cookies f\xFCr einen Zeitraum von zwei Jahren gespeichert werden. "
          ),
          u(),
          f(364, "p")(365, "strong"),
          d(366, "Hinweise zu Rechtsgrundlagen:"),
          u(),
          d(
            367,
            " Sofern wir die Nutzer um deren Einwilligung in den Einsatz der Drittanbieter bitten, stellt die Rechtsgrundlage der Datenverarbeitung die Erlaubnis dar. Ansonsten werden die Daten der Nutzer auf Grundlage unserer berechtigten Interessen (d. h. Interesse an effizienten, wirtschaftlichen und empf\xE4ngerfreundlichen Leistungen) verarbeitet. In diesem Zusammenhang m\xF6chten wir Sie auch auf die Informationen zur Verwendung von Cookies in dieser Datenschutzerkl\xE4rung hinweisen. "
          ),
          u(),
          f(368, "p")(369, "strong"),
          d(370, "Hinweise zum Widerruf und Widerspruch:"),
          u()(),
          f(371, "p"),
          d(
            372,
            ' Wir verweisen auf die Datenschutzhinweise der jeweiligen Anbieter und die zu den Anbietern angegebenen Widerspruchsm\xF6glichkeiten (sog. "Opt-Out"). Sofern keine explizite Opt-Out-M\xF6glichkeit angegeben wurde, besteht zum einen die M\xF6glichkeit, dass Sie Cookies in den Einstellungen Ihres Browsers abschalten. Hierdurch k\xF6nnen jedoch Funktionen unseres Onlineangebotes eingeschr\xE4nkt werden. Wir empfehlen daher zus\xE4tzlich die folgenden Opt-Out-M\xF6glichkeiten, die zusammenfassend auf jeweilige Gebiete gerichtet angeboten werden: '
          ),
          u(),
          f(373, "p"),
          d(374, " a) Europa: "),
          f(375, "a", 20),
          d(376, "https://www.youronlinechoices.eu."),
          u()(),
          f(377, "p"),
          d(378, " b) Kanada: "),
          f(379, "a", 21),
          d(380, "link"),
          u()(),
          f(381, "p"),
          d(382, " c) USA: "),
          f(383, "a", 22),
          d(384, "https://www.aboutads.info/choices."),
          u()(),
          f(385, "p"),
          d(386, " d) Gebiets\xFCbergreifend: "),
          f(387, "a", 23),
          d(388, "https://optout.aboutads.info."),
          u()(),
          f(389, "ul", 14)(390, "li")(391, "strong"),
          d(392, "Verarbeitete Datenarten:"),
          u(),
          d(
            393,
            " Nutzungsdaten (z. B. Seitenaufrufe und Verweildauer, Klickpfade, Nutzungsintensit\xE4t und -frequenz, verwendete Ger\xE4tetypen und Betriebssysteme, Interaktionen mit Inhalten und Funktionen). Meta-, Kommunikations- und Verfahrensdaten (z. B. IP-Adressen, Zeitangaben, Identifikationsnummern, beteiligte Personen). "
          ),
          u(),
          f(394, "li")(395, "strong"),
          d(396, "Betroffene Personen:"),
          u(),
          d(
            397,
            " Nutzer (z.\xA0B. Webseitenbesucher, Nutzer von Onlinediensten). "
          ),
          u(),
          f(398, "li")(399, "strong"),
          d(400, "Zwecke der Verarbeitung:"),
          u(),
          d(
            401,
            " Reichweitenmessung (z.\xA0B. Zugriffsstatistiken, Erkennung wiederkehrender Besucher); Tracking (z.\xA0B. interessens-/verhaltensbezogenes Profiling, Nutzung von Cookies); Zielgruppenbildung; Marketing. Profile mit nutzerbezogenen Informationen (Erstellen von Nutzerprofilen). "
          ),
          u(),
          f(402, "li")(403, "strong"),
          d(404, "Sicherheitsma\xDFnahmen:"),
          u(),
          d(405, " IP-Masking (Pseudonymisierung der IP-Adresse). "),
          u()(),
          f(406, "h2", 24),
          d(407, "Pr\xE4senzen in sozialen Netzwerken (Social Media)"),
          u(),
          f(408, "p"),
          d(
            409,
            " Wir unterhalten Onlinepr\xE4senzen innerhalb sozialer Netzwerke und verarbeiten in diesem Rahmen Nutzerdaten, um mit den dort aktiven Nutzern zu kommunizieren oder Informationen \xFCber uns anzubieten. "
          ),
          u(),
          f(410, "p"),
          d(
            411,
            " Wir weisen darauf hin, dass dabei Nutzerdaten au\xDFerhalb des Raumes der Europ\xE4ischen Union verarbeitet werden k\xF6nnen. Hierdurch k\xF6nnen sich f\xFCr die Nutzer Risiken ergeben, weil so zum Beispiel die Durchsetzung der Nutzerrechte erschwert werden k\xF6nnte. "
          ),
          u(),
          f(412, "p"),
          d(
            413,
            " Ferner werden die Daten der Nutzer innerhalb sozialer Netzwerke im Regelfall f\xFCr Marktforschungs- und Werbezwecke verarbeitet. So k\xF6nnen beispielsweise anhand des Nutzungsverhaltens und sich daraus ergebender Interessen der Nutzer Nutzungsprofile erstellt werden. Letztere finden m\xF6glicherweise wiederum Verwendung, um etwa Werbeanzeigen innerhalb und au\xDFerhalb der Netzwerke zu schalten, die mutma\xDFlich den Interessen der Nutzer entsprechen. Daher werden im Regelfall Cookies auf den Rechnern der Nutzer gespeichert, in denen das Nutzungsverhalten und die Interessen der Nutzer gespeichert werden. Zudem k\xF6nnen in den Nutzungsprofilen auch Daten unabh\xE4ngig der von den Nutzern verwendeten Ger\xE4ten gespeichert werden (insbesondere, wenn sie Mitglieder der jeweiligen Plattformen und dort eingeloggt sind). "
          ),
          u(),
          f(414, "p"),
          d(
            415,
            " F\xFCr eine detaillierte Darstellung der jeweiligen Verarbeitungsformen und der Widerspruchsm\xF6glichkeiten (Opt-out) verweisen wir auf die Datenschutzerkl\xE4rungen und Angaben der Betreiber der jeweiligen Netzwerke. "
          ),
          u(),
          f(416, "p"),
          d(
            417,
            " Auch im Fall von Auskunftsanfragen und der Geltendmachung von Betroffenenrechten weisen wir darauf hin, dass diese am effektivsten bei den Anbietern geltend gemacht werden k\xF6nnen. Nur Letztere haben jeweils Zugriff auf die Nutzerdaten und k\xF6nnen direkt entsprechende Ma\xDFnahmen ergreifen und Ausk\xFCnfte geben. Sollten Sie dennoch Hilfe ben\xF6tigen, dann k\xF6nnen Sie sich an uns wenden. "
          ),
          u(),
          f(418, "ul", 14)(419, "li")(420, "strong"),
          d(421, "Verarbeitete Datenarten:"),
          u(),
          d(
            422,
            " Kontaktdaten (z.\xA0B. Post- und E-Mail-Adressen oder Telefonnummern); Inhaltsdaten (z. B. textliche oder bildliche Nachrichten und Beitr\xE4ge sowie die sie betreffenden Informationen, wie z. B. Angaben zur Autorenschaft oder Zeitpunkt der Erstellung). Nutzungsdaten (z. B. Seitenaufrufe und Verweildauer, Klickpfade, Nutzungsintensit\xE4t und -frequenz, verwendete Ger\xE4tetypen und Betriebssysteme, Interaktionen mit Inhalten und Funktionen). "
          ),
          u(),
          f(423, "li")(424, "strong"),
          d(425, "Betroffene Personen:"),
          u(),
          d(
            426,
            " Nutzer (z.\xA0B. Webseitenbesucher, Nutzer von Onlinediensten). "
          ),
          u(),
          f(427, "li")(428, "strong"),
          d(429, "Zwecke der Verarbeitung:"),
          u(),
          d(
            430,
            " Kommunikation; Feedback (z.\xA0B. Sammeln von Feedback via Online-Formular). \xD6ffentlichkeitsarbeit. "
          ),
          u(),
          f(431, "li", 16)(432, "strong"),
          d(433, "Rechtsgrundlagen:"),
          u(),
          d(
            434,
            " Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO). "
          ),
          u()(),
          f(435, "p")(436, "strong"),
          d(
            437,
            "Weitere Hinweise zu Verarbeitungsprozessen, Verfahren und Diensten:"
          ),
          u()(),
          f(438, "ul", 14)(439, "li")(440, "strong"),
          d(441, "LinkedIn: "),
          u(),
          d(
            442,
            'Soziales Netzwerk - Wir sind gemeinsam mit LinkedIn Irland Unlimited Company f\xFCr die Erhebung (jedoch nicht die weitere Verarbeitung) von Daten der Besucher, die zu Zwecken der Erstellung der \u201EPage-Insights" (Statistiken) unserer LinkedIn-Profile erstellt werden, verantwortlich. '
          ),
          b(443, "br"),
          d(
            444,
            "Zu diesen Daten geh\xF6ren Informationen zu den Arten von Inhalten, die Nutzer sich ansehen oder mit denen sie interagieren, oder die von ihnen vorgenommenen Handlungen sowie Informationen \xFCber die von den Nutzern genutzten Ger\xE4te (z.\xA0B. IP-Adressen, Betriebssystem, Browsertyp, Spracheinstellungen, Cookie-Daten) und Angaben aus dem Profil der Nutzer, wie Berufsfunktion, Land, Branche, Hierarchieebene, Unternehmensgr\xF6\xDFe und Besch\xE4ftigungsstatus. Datenschutzinformationen zur Verarbeitung von Daten der Nutzer durch LinkedIn k\xF6nnen den Datenschutzhinweisen von LinkedIn entnommen werden: "
          ),
          f(445, "a", 25),
          d(446, "link"),
          u(),
          b(447, "br"),
          d(
            448,
            'Wir haben mit LinkedIn Irland eine spezielle Vereinbarung abgeschlossen ("Page Insights Joint Controller Addendum (the \u201AAddendum\u2018)", '
          ),
          f(449, "a", 26),
          d(450, "https://legal.linkedin.com/pages-joint-controller-addendum"),
          u(),
          d(
            451,
            "), in der insbesondere geregelt wird, welche Sicherheitsma\xDFnahmen LinkedIn beachten muss und in der LinkedIn sich bereit erkl\xE4rt hat die Betroffenenrechte zu erf\xFCllen (d. h. Nutzer k\xF6nnen z.\xA0B. Ausk\xFCnfte oder L\xF6schungsanfragen direkt an LinkedIn richten). Die Rechte der Nutzer (insbesondere auf Auskunft, L\xF6schung, Widerspruch und Beschwerde bei zust\xE4ndiger Aufsichtsbeh\xF6rde), werden durch die Vereinbarungen mit LinkedIn nicht eingeschr\xE4nkt. Die gemeinsame Verantwortlichkeit beschr\xE4nkt sich auf die Erhebung der Daten durch und die \xDCbermittlung an die Ireland Unlimited Company, ein Unternehmen mit Sitz in der EU. Die weitere Verarbeitung der Daten obliegt ausschlie\xDFlich der Ireland Unlimited Company, was insbesondere die \xDCbermittlung der Daten an die Muttergesellschaft LinkedIn Corporation in den USA betrifft; "
          ),
          f(452, "strong"),
          d(453, "Dienstanbieter:"),
          u(),
          d(
            454,
            " LinkedIn Ireland Unlimited Company, Wilton Place, Dublin 2, Irland; "
          ),
          f(455, "span", 16)(456, "strong"),
          d(457, "Rechtsgrundlagen:"),
          u(),
          d(
            458,
            " Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO); "
          ),
          u(),
          f(459, "strong"),
          d(460, "Website:"),
          u(),
          f(461, "a", 27),
          d(462, "https://www.linkedin.com"),
          u(),
          d(463, "; "),
          f(464, "strong"),
          d(465, "Datenschutzerkl\xE4rung:"),
          u(),
          f(466, "a", 25),
          d(467, "link"),
          u(),
          d(468, "; "),
          f(469, "strong"),
          d(470, "Grundlage Drittlandtransfers:"),
          u(),
          d(
            471,
            " EU/EWR - Data Privacy Framework (DPF), Deutschland - Angemessenheitsbeschluss (Irland). "
          ),
          f(472, "strong"),
          d(473, "Widerspruchsm\xF6glichkeit (Opt-Out):"),
          u(),
          f(474, "a", 28),
          d(475, "link"),
          u(),
          d(476, ". "),
          u()(),
          f(477, "p", 29)(478, "a", 30),
          d(
            479,
            "Erstellt mit kostenlosem Datenschutz-Generator.de von Dr. Thomas Schwenke"
          ),
          u()()()());
      },
      styles: [
        `

*[_ngcontent-%COMP%] {
  margin: 0;
  padding: 0;
}
html[_ngcontent-%COMP%] {
  scroll-behavior: smooth;
}
body[_ngcontent-%COMP%] {
  background-color: #fffcf3;
}
a[_ngcontent-%COMP%] {
  text-decoration: none;
  color: black;
}
.btn[_ngcontent-%COMP%] {
  cursor: pointer;
  border-style: unset;
  border: 4px solid black;
  padding: 20px 60px;
  font-family: "Overpass", sans-serif;
  font-size: 23px;
  background-color: #fffcf3;
  transition: all 0.125s ease-in-out;
}
.btn[_ngcontent-%COMP%]:hover {
  padding: 20px 80px;
  font-weight: 700;
}
.btn[_ngcontent-%COMP%]:active {
  background-color: black;
  color: #fffcf3;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar {
  height: 10px;
  width: 5px;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-track {
  border-radius: 5px;
  background-color: #dfe9eb;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-track:hover {
  background-color: #b8c0c2;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-track:active {
  background-color: #b8c0c2;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: #5987ff;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:hover {
  background-color: #396eff;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:active {
  background-color: #396eff;
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 400;
  src: url("./media/syne-v22-latin-regular-6UTYI6IK.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 500;
  src: url("./media/syne-v22-latin-500-DLSUZYMP.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 600;
  src: url("./media/syne-v22-latin-600-2OMFULSK.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 700;
  src: url("./media/syne-v22-latin-700-7MWUTDCM.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 800;
  src: url("./media/syne-v22-latin-800-5SEF6UHE.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 100;
  src: url("./media/overpass-v13-latin-100-7H57N2W4.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 100;
  src: url("./media/overpass-v13-latin-100italic-TTK663FB.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 200;
  src: url("./media/overpass-v13-latin-200-MKKXNLZT.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 200;
  src: url("./media/overpass-v13-latin-200italic-UUSYSIGK.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 300;
  src: url("./media/overpass-v13-latin-300-Z3DUN6DK.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 300;
  src: url("./media/overpass-v13-latin-300italic-E7DYAHJT.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 400;
  src: url("./media/overpass-v13-latin-regular-ZK77XNQQ.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 400;
  src: url("./media/overpass-v13-latin-italic-CQLYFGT5.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 500;
  src: url("./media/overpass-v13-latin-500-5JQXFN7P.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 500;
  src: url("./media/overpass-v13-latin-500italic-HBJHAJTP.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 600;
  src: url("./media/overpass-v13-latin-600-43COUMYV.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 600;
  src: url("./media/overpass-v13-latin-600italic-XVZTHGMT.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 700;
  src: url("./media/overpass-v13-latin-700-EGTGNMPW.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 700;
  src: url("./media/overpass-v13-latin-700italic-37TJZGGR.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 800;
  src: url("./media/overpass-v13-latin-800-MNY6LLUS.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 800;
  src: url("./media/overpass-v13-latin-800italic-G2IFGHUZ.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 900;
  src: url("./media/overpass-v13-latin-900-DS3PFZN2.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 900;
  src: url("./media/overpass-v13-latin-900italic-HWYZS623.woff2") format("woff2");
}
section[_ngcontent-%COMP%] {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0;
  margin-top: 160px;
  font-family: "Overpass", sans-serif;
  margin-bottom: 80px;
}
section[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {
  font-size: 48px;
  font-family: "Syne", sans-serif;
  font-weight: 800;
  padding: 24px 0;
}
section[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]:hover {
  color: #5987ff;
}
@media (max-width: 630px) {
  section[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {
    font-size: 36px;
  }
}
@media (max-width: 460px) {
  section[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {
    font-size: 27px;
  }
}
@media (max-width: 360px) {
  section[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {
    font-size: 24px;
  }
}
section[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {
  font-size: 28px;
  padding: 16px 0;
}
@media (max-width: 630px) {
  section[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {
    font-size: 23px;
  }
}
@media (max-width: 460px) {
  section[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {
    font-size: 20px;
  }
}
section[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {
  font-size: 23px;
  padding: 14px 0;
}
@media (max-width: 630px) {
  section[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {
    font-size: 20px;
  }
}
@media (max-width: 460px) {
  section[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {
    font-size: 18px;
  }
}
section[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {
  text-decoration: underline;
}
section[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {
  color: #5987ff;
}
.container[_ngcontent-%COMP%] {
  width: 90%;
  max-width: 1920px;
  margin-left: auto;
  margin-right: auto;
}`,
      ],
    }));
  let e = t;
  return e;
})();
var $p = [
  { path: "", component: zp },
  { path: "impressum", title: "Marcus Loosen | Impressum", component: Up },
  { path: "datenschutz", title: "Marcus Loosen | Datenschutz", component: Bp },
];
var Hp = { providers: [sp($p), vh()] };
function L_(e, t) {
  if (e & 1) {
    let r = $e();
    f(0, "div", 5),
      X("click", function () {
        oe(r);
        let i = j();
        return i.toggleDropDown(), se(i.toggleMenuIcon());
      }),
      u();
  }
  if (e & 2) {
    let r = j();
    wt("change-to-close", r.headerDropDownService.closeIconAnimation)(
      "change-to-menu",
      r.headerDropDownService.menuIconAnimation
    );
  }
}
function V_(e, t) {
  if (e & 1) {
    let r = $e();
    f(0, "img", 8),
      X("click", function () {
        oe(r);
        let i = j(2);
        return se(i.closePage());
      }),
      u();
  }
}
function j_(e, t) {
  if (e & 1) {
    let r = $e();
    f(0, "img", 10),
      X("click", function () {
        oe(r);
        let i = j(3);
        return se(i.toggleFlag());
      }),
      u();
  }
}
function z_(e, t) {
  if (e & 1) {
    let r = $e();
    f(0, "img", 11),
      X("click", function () {
        oe(r);
        let i = j(3);
        return se(i.toggleFlag());
      }),
      u();
  }
}
function U_(e, t) {
  if (e & 1) {
    let r = $e();
    k(0, j_, 1, 0, "img", 9)(1, z_, 1, 0),
      f(2, "img", 8),
      X("click", function () {
        oe(r);
        let i = j(2);
        return se(i.closePage());
      }),
      u();
  }
  if (e & 2) {
    let r = j(2);
    V(0, r.translateService.translated ? 1 : 0);
  }
}
function B_(e, t) {
  if (
    (e & 1 && (f(0, "div", 6), k(1, V_, 1, 0, "img", 7)(2, U_, 3, 1), u()),
    e & 2)
  ) {
    let r = j();
    y(), V(1, r.pathName == "/datenschutz" ? 1 : 2);
  }
}
var Gp = (() => {
  let t = class t {
    constructor() {
      (this.headerDropDownService = v(sr)),
        (this.translateService = v(de)),
        (this.router = v(os)),
        (this.pathName = window.location.pathname);
    }
    ngOnInit() {
      (this.pathName == "/impressum" || this.pathName == "/datenschutz") &&
        (this.headerDropDownService.onOtherPage = !0);
    }
    toggleDropDown() {
      this.headerDropDownService.stateOfDropDown || window.scrollTo(0, 0),
        this.headerDropDownService.headerDropDownState$.next(!0);
    }
    toggleMenuIcon() {
      this.headerDropDownService.headerAnimations$.next(!0);
    }
    goToLandingPage() {
      this.router.navigateByUrl(""),
        (this.headerDropDownService.onOtherPage = !1);
    }
    toggleFlag() {
      this.translateService.stateOfTranslation$.next(!0);
    }
    closePage() {
      window.close();
    }
  };
  (t.ɵfac = function (i) {
    return new (i || t)();
  }),
    (t.ɵcmp = G({
      type: t,
      selectors: [["app-header"]],
      standalone: !0,
      features: [W],
      decls: 9,
      vars: 1,
      consts: [
        [1, "container"],
        [1, "pointer"],
        ["href", "#aot"],
        [1, "first-letter-logo", 3, "click"],
        [1, "menu", 3, "change-to-close", "change-to-menu"],
        [1, "menu", 3, "click"],
        [1, "flag-container"],
        [
          "src",
          "assets/icons/contact_back_arrow.png",
          "alt",
          "",
          1,
          "back-icon",
        ],
        [
          "src",
          "assets/icons/contact_back_arrow.png",
          "alt",
          "",
          1,
          "back-icon",
          3,
          "click",
        ],
        ["src", "assets/icons/flag_UK.svg", "alt", "", 1, "flag"],
        ["src", "assets/icons/flag_UK.svg", "alt", "", 1, "flag", 3, "click"],
        [
          "src",
          "assets/icons/flag_germany.svg",
          "alt",
          "",
          1,
          "flag",
          3,
          "click",
        ],
      ],
      template: function (i, o) {
        i & 1 &&
          (f(0, "header")(1, "div", 0)(2, "div", 1)(3, "a", 2)(4, "span", 3),
          X("click", function () {
            return o.goToLandingPage();
          }),
          d(5, "M"),
          u(),
          d(6, "arcus"),
          u()(),
          k(7, L_, 1, 4, "div", 4)(8, B_, 3, 1),
          u()()),
          i & 2 && (y(7), V(7, o.headerDropDownService.onOtherPage ? 8 : 7));
      },
      dependencies: [pe],
      styles: [
        `

*[_ngcontent-%COMP%] {
  margin: 0;
  padding: 0;
}
html[_ngcontent-%COMP%] {
  scroll-behavior: smooth;
}
body[_ngcontent-%COMP%] {
  background-color: #fffcf3;
}
a[_ngcontent-%COMP%] {
  text-decoration: none;
  color: black;
}
.btn[_ngcontent-%COMP%] {
  cursor: pointer;
  border-style: unset;
  border: 4px solid black;
  padding: 20px 60px;
  font-family: "Overpass", sans-serif;
  font-size: 23px;
  background-color: #fffcf3;
  transition: all 0.125s ease-in-out;
}
.btn[_ngcontent-%COMP%]:hover {
  padding: 20px 80px;
  font-weight: 700;
}
.btn[_ngcontent-%COMP%]:active {
  background-color: black;
  color: #fffcf3;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar {
  height: 10px;
  width: 5px;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-track {
  border-radius: 5px;
  background-color: #dfe9eb;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-track:hover {
  background-color: #b8c0c2;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-track:active {
  background-color: #b8c0c2;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: #5987ff;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:hover {
  background-color: #396eff;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:active {
  background-color: #396eff;
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 400;
  src: url("./media/syne-v22-latin-regular-6UTYI6IK.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 500;
  src: url("./media/syne-v22-latin-500-DLSUZYMP.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 600;
  src: url("./media/syne-v22-latin-600-2OMFULSK.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 700;
  src: url("./media/syne-v22-latin-700-7MWUTDCM.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 800;
  src: url("./media/syne-v22-latin-800-5SEF6UHE.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 100;
  src: url("./media/overpass-v13-latin-100-7H57N2W4.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 100;
  src: url("./media/overpass-v13-latin-100italic-TTK663FB.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 200;
  src: url("./media/overpass-v13-latin-200-MKKXNLZT.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 200;
  src: url("./media/overpass-v13-latin-200italic-UUSYSIGK.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 300;
  src: url("./media/overpass-v13-latin-300-Z3DUN6DK.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 300;
  src: url("./media/overpass-v13-latin-300italic-E7DYAHJT.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 400;
  src: url("./media/overpass-v13-latin-regular-ZK77XNQQ.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 400;
  src: url("./media/overpass-v13-latin-italic-CQLYFGT5.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 500;
  src: url("./media/overpass-v13-latin-500-5JQXFN7P.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 500;
  src: url("./media/overpass-v13-latin-500italic-HBJHAJTP.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 600;
  src: url("./media/overpass-v13-latin-600-43COUMYV.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 600;
  src: url("./media/overpass-v13-latin-600italic-XVZTHGMT.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 700;
  src: url("./media/overpass-v13-latin-700-EGTGNMPW.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 700;
  src: url("./media/overpass-v13-latin-700italic-37TJZGGR.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 800;
  src: url("./media/overpass-v13-latin-800-MNY6LLUS.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 800;
  src: url("./media/overpass-v13-latin-800italic-G2IFGHUZ.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 900;
  src: url("./media/overpass-v13-latin-900-DS3PFZN2.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 900;
  src: url("./media/overpass-v13-latin-900italic-HWYZS623.woff2") format("woff2");
}
header[_ngcontent-%COMP%] {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 50;
  background-color: #fffcf3;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0;
  font-family: "Syne", sans-serif;
  font-size: 30px;
  font-weight: 800;
}
header[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%] {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 0;
  width: 90%;
  max-width: 1920px;
  margin-left: auto;
  margin-right: auto;
  padding: 16px 0;
}
header[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%]   .flag-container[_ngcontent-%COMP%] {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 16px;
}
header[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%]   .first-letter-logo[_ngcontent-%COMP%] {
  color: #5987ff;
  font-size: 56px;
}
header[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%]   .pointer[_ngcontent-%COMP%] {
  cursor: pointer;
}
header[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%] {
  cursor: pointer;
  font-size: 40px;
  color: #ffffff;
  padding-bottom: 45x;
}
header[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%]   .flag[_ngcontent-%COMP%] {
  cursor: pointer;
  width: 64px;
}
header[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%]   .menu[_ngcontent-%COMP%] {
  cursor: pointer;
  background-image: url("./media/burger_menu1-FYNRMNXL.png");
  background-size: contain;
  background-position: center;
  height: 32px;
  width: 40px;
}
header[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%]   .back-icon[_ngcontent-%COMP%] {
  cursor: pointer;
  filter: brightness(0) saturate(100%) invert(69%) sepia(54%) saturate(7082%) hue-rotate(206deg) brightness(102%) contrast(101%);
}
header[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%]   .back-icon[_ngcontent-%COMP%]:hover {
  transform: scale(1.15);
}
.change-to-close[_ngcontent-%COMP%] {
  animation: _ngcontent-%COMP%_change-to-close-icon-animation 0.25s 1 forwards ease-in-out;
}
.change-to-menu[_ngcontent-%COMP%] {
  animation: _ngcontent-%COMP%_change-to-menu-icon-animation 0.25s 1 forwards ease-in-out;
}
.d-none[_ngcontent-%COMP%] {
  display: none;
}
@keyframes _ngcontent-%COMP%_change-to-menu-icon-animation {
  0% {
    background-image: url("./media/burger_menu5-DC2CLJSE.png");
  }
  25% {
    background-image: url("./media/burger_menu6-NSU6TOT6.png");
  }
  50% {
    background-image: url("./media/burger_menu7-QOCV3HJA.png");
  }
  75% {
    background-image: url("./media/burger_menu8-PMKNC7YN.png");
  }
  100% {
    background-image: url("./media/burger_menu1-FYNRMNXL.png");
  }
}
@keyframes _ngcontent-%COMP%_change-to-close-icon-animation {
  0% {
    background-image: url("./media/burger_menu1-FYNRMNXL.png");
  }
  20% {
    background-image: url("./media/burger_menu2-PMKNC7YN.png");
  }
  40% {
    background-image: url("./media/burger_menu3-QOCV3HJA.png");
  }
  60% {
    background-image: url("./media/burger_menu4-NSU6TOT6.png");
  }
  80% {
    background-image: url("./media/burger_menu5-DC2CLJSE.png");
  }
  100% {
    background-image: url("./media/burger_menu5-DC2CLJSE.png");
  }
}
@media (max-width: 540px) {
  .container[_ngcontent-%COMP%] {
    width: 95%;
  }
}`,
      ],
    }));
  let e = t;
  return e;
})();
function $_(e, t) {
  e & 1 && (f(0, "a", 11), d(1, "Impressum"), u());
}
function H_(e, t) {
  e & 1 && (f(0, "a", 11), d(1, "Imprint"), u());
}
var Wp = (() => {
  let t = class t {
    constructor() {
      this.translateService = v(de);
    }
  };
  (t.ɵfac = function (i) {
    return new (i || t)();
  }),
    (t.ɵcmp = G({
      type: t,
      selectors: [["app-footer"]],
      standalone: !0,
      features: [W],
      decls: 20,
      vars: 1,
      consts: [
        [1, "container"],
        [1, "left"],
        ["href", "#aot", 1, "logo"],
        [1, "first-letter-logo"],
        [1, "right"],
        ["href", "https://github.com/MarcusLoo23", "target", "_blank"],
        ["src", "assets/icons/github.png", "alt", ""],
        ["href", "mailto:mail@marcus-loosen.de", "target", "_blank"],
        ["src", "assets/icons/email.png", "alt", ""],
        [
          "href",
          "https://www.linkedin.com/in/marcus-loosen-5011292a4/",
          "target",
          "_blank",
        ],
        ["src", "assets/icons/linkedIn.png", "alt", ""],
        ["href", "impressum", "target", "_blank", 1, "link"],
      ],
      template: function (i, o) {
        i & 1 &&
          (f(0, "footer")(1, "div", 0)(2, "div")(3, "div", 1)(4, "a", 2)(
            5,
            "span",
            3
          ),
          d(6, "M"),
          u(),
          d(7, "arcus "),
          u(),
          f(8, "span"),
          d(9, "\xA9 Marcus Loosen 2024"),
          u()(),
          f(10, "div", 4)(11, "div")(12, "a", 5),
          b(13, "img", 6),
          u(),
          f(14, "a", 7),
          b(15, "img", 8),
          u(),
          f(16, "a", 9),
          b(17, "img", 10),
          u()()()(),
          k(18, $_, 2, 0, "a", 11)(19, H_, 2, 0),
          u()()),
          i & 2 && (y(18), V(18, o.translateService.translated ? 19 : 18));
      },
      styles: [
        `

*[_ngcontent-%COMP%] {
  margin: 0;
  padding: 0;
}
html[_ngcontent-%COMP%] {
  scroll-behavior: smooth;
}
body[_ngcontent-%COMP%] {
  background-color: #fffcf3;
}
a[_ngcontent-%COMP%] {
  text-decoration: none;
  color: black;
}
.btn[_ngcontent-%COMP%] {
  cursor: pointer;
  border-style: unset;
  border: 4px solid black;
  padding: 20px 60px;
  font-family: "Overpass", sans-serif;
  font-size: 23px;
  background-color: #fffcf3;
  transition: all 0.125s ease-in-out;
}
.btn[_ngcontent-%COMP%]:hover {
  padding: 20px 80px;
  font-weight: 700;
}
.btn[_ngcontent-%COMP%]:active {
  background-color: black;
  color: #fffcf3;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar {
  height: 10px;
  width: 5px;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-track {
  border-radius: 5px;
  background-color: #dfe9eb;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-track:hover {
  background-color: #b8c0c2;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-track:active {
  background-color: #b8c0c2;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: #5987ff;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:hover {
  background-color: #396eff;
}
*[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:active {
  background-color: #396eff;
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 400;
  src: url("./media/syne-v22-latin-regular-6UTYI6IK.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 500;
  src: url("./media/syne-v22-latin-500-DLSUZYMP.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 600;
  src: url("./media/syne-v22-latin-600-2OMFULSK.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 700;
  src: url("./media/syne-v22-latin-700-7MWUTDCM.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Syne";
  font-style: normal;
  font-weight: 800;
  src: url("./media/syne-v22-latin-800-5SEF6UHE.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 100;
  src: url("./media/overpass-v13-latin-100-7H57N2W4.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 100;
  src: url("./media/overpass-v13-latin-100italic-TTK663FB.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 200;
  src: url("./media/overpass-v13-latin-200-MKKXNLZT.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 200;
  src: url("./media/overpass-v13-latin-200italic-UUSYSIGK.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 300;
  src: url("./media/overpass-v13-latin-300-Z3DUN6DK.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 300;
  src: url("./media/overpass-v13-latin-300italic-E7DYAHJT.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 400;
  src: url("./media/overpass-v13-latin-regular-ZK77XNQQ.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 400;
  src: url("./media/overpass-v13-latin-italic-CQLYFGT5.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 500;
  src: url("./media/overpass-v13-latin-500-5JQXFN7P.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 500;
  src: url("./media/overpass-v13-latin-500italic-HBJHAJTP.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 600;
  src: url("./media/overpass-v13-latin-600-43COUMYV.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 600;
  src: url("./media/overpass-v13-latin-600italic-XVZTHGMT.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 700;
  src: url("./media/overpass-v13-latin-700-EGTGNMPW.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 700;
  src: url("./media/overpass-v13-latin-700italic-37TJZGGR.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 800;
  src: url("./media/overpass-v13-latin-800-MNY6LLUS.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 800;
  src: url("./media/overpass-v13-latin-800italic-G2IFGHUZ.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: normal;
  font-weight: 900;
  src: url("./media/overpass-v13-latin-900-DS3PFZN2.woff2") format("woff2");
}
@font-face {
  font-display: swap;
  font-family: "Overpass";
  font-style: italic;
  font-weight: 900;
  src: url("./media/overpass-v13-latin-900italic-HWYZS623.woff2") format("woff2");
}
footer[_ngcontent-%COMP%] {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0;
  background-color: black;
  padding-bottom: 32px;
}
footer[_ngcontent-%COMP%]   .link[_ngcontent-%COMP%] {
  color: #fffcf3;
  align-self: flex-end;
  font-family: "Overpass", sans-serif;
  position: relative;
}
footer[_ngcontent-%COMP%]   .link[_ngcontent-%COMP%]:after {
  content: "";
  background-color: #5987ff;
  display: flex;
  justify-content: flex-end;
  height: 2px;
  position: absolute;
  left: 0;
  right: 0;
  opacity: 0;
}
footer[_ngcontent-%COMP%]   .link[_ngcontent-%COMP%]:hover:after {
  animation: _ngcontent-%COMP%_link-animation 0.25s 1 forwards ease-in-out;
}
.link[_ngcontent-%COMP%]:hover:after {
  left: 0;
  right: unset;
  width: 50%;
}
.container[_ngcontent-%COMP%] {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0;
  width: 90%;
  max-width: 1920px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 32px;
}
.container[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0;
  width: 100%;
}
.left[_ngcontent-%COMP%] {
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 16px;
}
.left[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {
  align-self: flex-start;
}
.left[_ngcontent-%COMP%]   .first-letter-logo[_ngcontent-%COMP%] {
  color: #5987ff;
  font-size: 56px;
}
.left[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%] {
  cursor: pointer;
  font-size: 40px;
  color: #ffffff;
  padding-bottom: 45x;
}
.left[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {
  color: #fffcf3;
  font-family: "Overpass", sans-serif;
  font-size: 23px;
}
.right[_ngcontent-%COMP%] {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
  gap: 0;
}
.right[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 24px;
}
.right[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]    > a[_ngcontent-%COMP%] {
  display: flex;
  width: 30px;
  height: 30px;
  transform: translate(0, 0);
  transition: transform 0.25s ease-in-out;
}
.right[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]    > a[_ngcontent-%COMP%]:hover {
  transform: translate(0, -16px);
}
.right[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]    > a[_ngcontent-%COMP%]    > img[_ngcontent-%COMP%] {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
@keyframes _ngcontent-%COMP%_link-animation {
  0% {
    left: 0;
    width: 2%;
    right: unset;
    opacity: 0;
  }
  50% {
    left: 0;
    width: 100%;
    right: 0;
    opacity: 1;
  }
  100% {
    left: unset;
    width: 50%;
    right: 0;
    opacity: 1;
  }
}
@media (max-width: 430px) {
  footer[_ngcontent-%COMP%] {
    padding-top: 16px;
  }
  footer[_ngcontent-%COMP%]   .link[_ngcontent-%COMP%] {
    align-self: center;
  }
  .container[_ngcontent-%COMP%] {
    gap: 8px;
  }
  .container[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {
    flex-direction: column-reverse;
    align-items: center;
    gap: 16px;
  }
  .left[_ngcontent-%COMP%] {
    justify-content: center;
    align-items: center;
  }
  .left[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {
    align-self: center;
  }
}`,
      ],
    }));
  let e = t;
  return e;
})();
var qp = (() => {
  let t = class t {
    constructor() {
      this.title = "Marcus Loosen";
    }
  };
  (t.ɵfac = function (i) {
    return new (i || t)();
  }),
    (t.ɵcmp = G({
      type: t,
      selectors: [["app-root"]],
      standalone: !0,
      features: [W],
      decls: 3,
      vars: 0,
      template: function (i, o) {
        i & 1 && b(0, "app-header")(1, "router-outlet")(2, "app-footer");
      },
      dependencies: [pe, vc, Gp, Wp],
    }));
  let e = t;
  return e;
})();
Eh(qp, Hp).catch((e) => console.error(e));
