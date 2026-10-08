const Q = "http://www.w3.org/2000/svg";
class st {
  svg = null;
  container = null;
  width = 0;
  height = 0;
  elementId = 0;
  defs = null;
  init(t, e, i) {
    this.container = t, this.width = e, this.height = i, this.svg?.remove(), this.svg = null, this.svg = document.createElementNS(Q, "svg"), this.svg.setAttribute("width", String(e)), this.svg.setAttribute("height", String(i)), this.svg.setAttribute("viewBox", `0 0 ${e} ${i}`), this.svg.style.display = "block", this.svg.style.width = "100%", this.svg.style.height = "100%", this.svg.style.overflow = "visible", this.defs = document.createElementNS(Q, "defs"), this.svg.appendChild(this.defs), this.container.appendChild(this.svg);
  }
  clear() {
    if (this.svg) {
      const t = Array.from(this.svg.childNodes);
      for (const e of t)
        e !== this.defs && this.svg.removeChild(e);
      if (this.defs)
        for (; this.defs.firstChild; )
          this.defs.removeChild(this.defs.firstChild);
    }
  }
  createElement(t, e = {}) {
    const i = document.createElementNS(Q, t);
    for (const [s, n] of Object.entries(e))
      i.setAttribute(s, String(n));
    return this.svg?.appendChild(i), i;
  }
  generateId() {
    return `sc-${++this.elementId}`;
  }
  wrapElement(t) {
    return {
      id: t.id || this.generateId(),
      type: t.tagName,
      setAttribute: (e, i) => t.setAttribute(e, String(i)),
      removeAttribute: (e) => t.removeAttribute(e),
      setStyle: (e, i) => {
        t.style[e] = i;
      },
      addEventListener: (e, i) => t.addEventListener(e, i),
      removeEventListener: (e, i) => t.removeEventListener(e, i),
      appendChild: (e) => {
        "_element" in e && t.appendChild(e._element);
      },
      removeChild: (e) => {
        "_element" in e && t.removeChild(e._element);
      },
      destroy: () => t.remove(),
      _element: t
    };
  }
  line(t, e, i, s, n = {}) {
    const r = this.createElement("line", {
      x1: t,
      y1: e,
      x2: i,
      y2: s,
      stroke: n.stroke ?? "currentColor",
      "stroke-width": n.strokeWidth ?? 1,
      "stroke-dasharray": n.strokeDasharray ? Array.isArray(n.strokeDasharray) ? n.strokeDasharray.join(",") : n.strokeDasharray : "none",
      "stroke-linecap": n.strokeLinecap ?? "butt",
      "stroke-linejoin": n.strokeLinejoin ?? "miter",
      fill: n.fill ?? "none",
      opacity: n.opacity ?? 1
    });
    return this.wrapElement(r);
  }
  rect(t, e, i, s, n = {}) {
    const r = this.createElement("rect", {
      x: t,
      y: e,
      width: Math.max(0, i),
      height: Math.max(0, s),
      fill: n.fill ?? "none",
      stroke: n.stroke ?? "none",
      "stroke-width": n.strokeWidth ?? 1,
      rx: n.rx ?? 0,
      ry: n.ry ?? 0,
      opacity: n.opacity ?? 1
    });
    return this.wrapElement(r);
  }
  circle(t, e, i, s = {}) {
    const n = this.createElement("circle", {
      cx: t,
      cy: e,
      r: Math.max(0, i),
      fill: s.fill ?? "none",
      stroke: s.stroke ?? "none",
      "stroke-width": s.strokeWidth ?? 1,
      opacity: s.opacity ?? 1
    });
    return this.wrapElement(n);
  }
  path(t, e = {}) {
    const i = this.createElement("path", {
      d: t,
      fill: e.fill ?? "none",
      stroke: e.stroke ?? "none",
      "stroke-width": e.strokeWidth ?? 1,
      "stroke-dasharray": e.strokeDasharray ? Array.isArray(e.strokeDasharray) ? e.strokeDasharray.join(",") : e.strokeDasharray : "none",
      opacity: e.opacity ?? 1
    });
    return this.wrapElement(i);
  }
  text(t, e, i, s = {}) {
    const n = this.createElement("text", {
      x: t,
      y: e,
      fill: s.fill ?? "currentColor",
      "font-size": s.fontSize ?? 12,
      "font-family": s.fontFamily ?? '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      "font-weight": s.fontWeight ?? "normal",
      "text-anchor": s.textAnchor ?? "start",
      "dominant-baseline": s.dominantBaseline ?? "alphabetic",
      opacity: s.opacity ?? 1
    });
    return n.textContent = i, s.rotate ? n.setAttribute("transform", `rotate(${s.rotate} ${t} ${e})`) : s.transform && n.setAttribute("transform", s.transform), this.wrapElement(n);
  }
  group(t = []) {
    const e = this.createElement("g", {});
    for (const i of t)
      "_element" in i && e.appendChild(i._element);
    return this.wrapElement(e);
  }
  createGradient(t, e, i = "0%", s = "0%", n = "100%", r = "0%") {
    if (!this.defs) return t;
    const a = this.createElement("linearGradient", {
      id: t,
      x1: i,
      y1: s,
      x2: n,
      y2: r
    });
    for (const o of e) {
      const l = this.createElement("stop", {
        offset: `${o.offset * 100}%`,
        "stop-color": o.color,
        "stop-opacity": o.opacity ?? 1
      });
      a.appendChild(l);
    }
    return this.defs.appendChild(a), `url(#${t})`;
  }
  createRadialGradient(t, e, i = "50%", s = "50%", n = "50%") {
    if (!this.defs) return t;
    const r = this.createElement("radialGradient", {
      id: t,
      cx: i,
      cy: s,
      r: n
    });
    for (const a of e) {
      const o = this.createElement("stop", {
        offset: `${a.offset * 100}%`,
        "stop-color": a.color,
        "stop-opacity": a.opacity ?? 1
      });
      r.appendChild(o);
    }
    return this.defs.appendChild(r), `url(#${t})`;
  }
  destroy() {
    this.svg && (this.svg.remove(), this.svg = null), this.container = null, this.defs = null;
  }
  getSVG() {
    return this.svg;
  }
  getWidth() {
    return this.width;
  }
  getHeight() {
    return this.height;
  }
}
class it {
  canvas = null;
  ctx = null;
  container = null;
  width = 0;
  height = 0;
  dpr = 1;
  elements = [];
  elementId = 0;
  gradients = /* @__PURE__ */ new Map();
  init(t, e, i) {
    this.container = t, this.width = e, this.height = i, this.dpr = window.devicePixelRatio || 1, this.canvas?.remove(), this.canvas = null, this.ctx = null, this.canvas = document.createElement("canvas"), this.canvas.width = e * this.dpr, this.canvas.height = i * this.dpr, this.canvas.style.width = `${e}px`, this.canvas.style.height = `${i}px`, this.canvas.style.display = "block", this.ctx = this.canvas.getContext("2d"), this.ctx.scale(this.dpr, this.dpr), this.container.appendChild(this.canvas), this.elements = [];
  }
  clear() {
    this.ctx && this.ctx.clearRect(0, 0, this.width, this.height), this.elements = [];
  }
  generateId() {
    return `cc-${++this.elementId}`;
  }
  createRenderElement(t, e, i) {
    this.ctx && t(this.ctx);
    const s = {
      id: this.generateId(),
      type: e,
      setAttribute: () => {
      },
      removeAttribute: () => {
      },
      setStyle: () => {
      },
      addEventListener: () => {
      },
      removeEventListener: () => {
      },
      appendChild: () => {
      },
      removeChild: () => {
      },
      destroy: () => {
        const n = this.elements.indexOf(s);
        n !== -1 && this.elements.splice(n, 1);
      },
      _draw: t,
      _type: e,
      _bounds: i
    };
    return this.elements.push(s), s;
  }
  line(t, e, i, s, n = {}) {
    return this.createRenderElement(
      (r) => {
        if (r.beginPath(), r.moveTo(t, e), r.lineTo(i, s), r.strokeStyle = n.stroke ?? "#000", r.lineWidth = n.strokeWidth ?? 1, n.strokeDasharray) {
          let a;
          Array.isArray(n.strokeDasharray) ? a = n.strokeDasharray.filter((o) => typeof o == "number") : a = typeof n.strokeDasharray == "number" ? [n.strokeDasharray] : [], a.length > 0 && r.setLineDash(a);
        }
        r.lineCap = n.strokeLinecap ?? "butt", r.lineJoin = n.strokeLinejoin ?? "miter", r.globalAlpha = n.opacity ?? 1, r.stroke(), r.setLineDash([]), r.globalAlpha = 1;
      },
      "line",
      { x: Math.min(t, i), y: Math.min(e, s), width: Math.abs(i - t), height: Math.abs(s - e) }
    );
  }
  rect(t, e, i, s, n = {}) {
    const r = Math.max(0, i), a = Math.max(0, s);
    return this.createRenderElement(
      (o) => {
        o.beginPath();
        const l = n.rx ?? 0, c = n.ry ?? 0;
        if (l > 0 || c > 0) {
          const d = Math.min(l, c, r / 2, a / 2);
          o.moveTo(t + d, e), o.lineTo(t + r - d, e), o.quadraticCurveTo(t + r, e, t + r, e + d), o.lineTo(t + r, e + a - d), o.quadraticCurveTo(t + r, e + a, t + r - d, e + a), o.lineTo(t + d, e + a), o.quadraticCurveTo(t, e + a, t, e + a - d), o.lineTo(t, e + d), o.quadraticCurveTo(t, e, t + d, e);
        } else
          o.rect(t, e, r, a);
        n.fill && (o.fillStyle = n.fill, o.globalAlpha = n.opacity ?? 1, o.fill()), n.stroke && (o.strokeStyle = n.stroke, o.lineWidth = n.strokeWidth ?? 1, o.globalAlpha = n.opacity ?? 1, o.stroke()), o.globalAlpha = 1;
      },
      "rect",
      { x: t, y: e, width: r, height: a }
    );
  }
  circle(t, e, i, s = {}) {
    const n = Math.max(0, i);
    return this.createRenderElement(
      (r) => {
        r.beginPath(), r.arc(t, e, n, 0, Math.PI * 2), s.fill && (r.fillStyle = s.fill, r.globalAlpha = s.opacity ?? 1, r.fill()), s.stroke && (r.strokeStyle = s.stroke, r.lineWidth = s.strokeWidth ?? 1, r.globalAlpha = s.opacity ?? 1, r.stroke()), r.globalAlpha = 1;
      },
      "circle",
      { x: t - n, y: e - n, width: n * 2, height: n * 2 }
    );
  }
  path(t, e = {}) {
    return this.createRenderElement(
      (i) => {
        const s = new Path2D(t);
        if (e.fill && (i.fillStyle = e.fill, i.globalAlpha = e.opacity ?? 1, i.fill(s)), e.stroke) {
          if (i.strokeStyle = e.stroke, i.lineWidth = e.strokeWidth ?? 1, e.strokeDasharray) {
            let n;
            Array.isArray(e.strokeDasharray) ? n = e.strokeDasharray.filter((r) => typeof r == "number") : n = typeof e.strokeDasharray == "number" ? [e.strokeDasharray] : [], n.length > 0 && i.setLineDash(n);
          }
          i.globalAlpha = e.opacity ?? 1, i.stroke(s), i.setLineDash([]);
        }
        i.globalAlpha = 1;
      },
      "path",
      { x: 0, y: 0, width: this.width, height: this.height }
    );
  }
  text(t, e, i, s = {}) {
    const n = s.fontSize ?? 12, r = s.fontFamily ?? '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', a = s.fontWeight ?? "normal", o = (l) => {
      switch (l) {
        case "top":
        case "text-top":
        case "hanging":
          return "top";
        case "middle":
        case "central":
        case "mathematical":
          return "middle";
        case "bottom":
        case "text-bottom":
        case "ideographic":
        case "alphabetic":
        default:
          return "alphabetic";
      }
    };
    return this.createRenderElement(
      (l) => {
        l.font = `${a} ${n}px ${r}`, l.fillStyle = s.fill ?? "#000", l.textAlign = s.textAnchor === "middle" ? "center" : s.textAnchor === "end" ? "right" : "left", l.textBaseline = o(s.dominantBaseline), l.globalAlpha = s.opacity ?? 1, s.rotate ? (l.save(), l.translate(t, e), l.rotate(s.rotate * Math.PI / 180), l.fillText(i, 0, 0), l.restore()) : l.fillText(i, t, e), l.globalAlpha = 1;
      },
      "text",
      { x: t - 50, y: e - n, width: 100, height: n * 2 }
    );
  }
  group(t = []) {
    const e = t;
    return this.createRenderElement(
      (i) => {
        for (const s of e)
          s._draw(i);
      },
      "group",
      { x: 0, y: 0, width: this.width, height: this.height }
    );
  }
  render() {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.width, this.height);
      for (const t of this.elements)
        t._draw(this.ctx);
    }
  }
  destroy() {
    this.canvas && (this.canvas.remove(), this.canvas = null), this.ctx = null, this.container = null, this.elements = [];
  }
  getCanvas() {
    return this.canvas;
  }
  getContext() {
    return this.ctx;
  }
  getWidth() {
    return this.width;
  }
  getHeight() {
    return this.height;
  }
  createGradient(t, e, i = "0%", s = "0%", n = "100%", r = "0%") {
    if (!this.ctx) return t;
    const a = (l, c) => l.endsWith("%") ? parseFloat(l) / 100 * c : parseFloat(l), o = this.ctx.createLinearGradient(
      a(i, this.width),
      a(s, this.height),
      a(n, this.width),
      a(r, this.height)
    );
    for (const l of e)
      o.addColorStop(l.offset, l.color);
    return this.gradients.set(t, o), t;
  }
  createRadialGradient(t, e, i = "50%", s = "50%", n = "50%") {
    if (!this.ctx) return t;
    const r = (o, l) => o.endsWith("%") ? parseFloat(o) / 100 * l : parseFloat(o), a = this.ctx.createRadialGradient(
      r(i, this.width),
      r(s, this.height),
      0,
      r(i, this.width),
      r(s, this.height),
      r(n, Math.max(this.width, this.height))
    );
    for (const o of e)
      a.addColorStop(o.offset, o.color);
    return this.gradients.set(t, a), t;
  }
}
class Z {
  domain = [0, 1];
  range = [0, 1];
  originalDomain = [0, 1];
  originalRange = [0, 1];
  constructor(t) {
    t.domain && (this.domain = t.domain, this.originalDomain = [...t.domain]), this.range = t.range, this.originalRange = [...t.range], (t.min !== void 0 || t.max !== void 0) && (this.domain = this.applyMinMax(t.min, t.max));
  }
  applyMinMax(t, e) {
    const [i, s] = this.domain;
    return [t !== void 0 ? t : i, e !== void 0 ? e : s];
  }
  setRange(t) {
    this.range = t, this.originalRange = [...t];
  }
  setDomain(t, e = !1) {
    this.domain = t, e && (this.originalDomain = [...t]);
  }
  getDomain() {
    return this.domain;
  }
  getRange() {
    return this.range;
  }
  zoom(t, e, i) {
    const [s, n] = this.range, r = e ?? (s + n) / 2, a = r - (r - s) * t, o = r + (n - r) * t;
    this.range = [a, o];
  }
  pan(t, e) {
    const i = t !== 0 ? t : e;
    this.range = [this.range[0] + i, this.range[1] + i];
  }
  reset() {
    this.domain = [...this.originalDomain], this.range = [...this.originalRange];
  }
  lerp(t, e, i) {
    return t + (e - t) * i;
  }
  clamp(t, e, i) {
    return Math.max(e, Math.min(i, t));
  }
}
class Mt extends Z {
  niceDomain = !1;
  constructor(t) {
    super(t), this.niceDomain = t.nice ?? !1, this.niceDomain && (this.domain = this.nice(this.domain));
  }
  convert(t) {
    const e = typeof t == "number" ? t : Number(t), [i, s] = this.domain, [n, r] = this.range;
    if (s === i) return n;
    const a = (e - i) / (s - i);
    return this.lerp(n, r, a);
  }
  invert(t) {
    const [e, i] = this.domain, [s, n] = this.range;
    if (n === s) return e;
    const r = (t - s) / (n - s);
    return this.lerp(e, i, r);
  }
  getTicks(t = 10) {
    const [e, i] = this.domain, s = i - e;
    if (s <= 0 || !Number.isFinite(s)) return [{ value: e, label: String(e) }];
    const n = this.niceStep(s / t);
    if (!Number.isFinite(n) || n <= 0) return [{ value: e, label: String(e) }];
    const r = Math.ceil(e / n) * n, a = [], o = Math.min(200, Math.max(t * 4, 20));
    for (let l = r; l <= i + n * 0.5 && a.length < o; l += n)
      a.push({ value: l, label: this.formatTick(l) });
    return a;
  }
  niceStep(t) {
    const e = Math.floor(Math.log10(t)), i = t / Math.pow(10, e);
    let s;
    return i <= 1 ? s = 1 : i <= 2 ? s = 2 : i <= 5 ? s = 5 : s = 10, s * Math.pow(10, e);
  }
  nice(t) {
    const [e, i] = t;
    if (e === i) return [e - 1, i + 1];
    const s = this.niceStep((i - e) / 10);
    return [
      Math.floor(e / s) * s,
      Math.ceil(i / s) * s
    ];
  }
  formatTick(t) {
    return Math.abs(t) >= 1e6 || Math.abs(t) < 1e-3 && t !== 0 ? t.toExponential(1) : t.toString();
  }
}
class kt extends Z {
  convert(t) {
    const i = (t instanceof Date ? t : new Date(t)).getTime(), [s, n] = this.domain, [r, a] = this.range, o = s.getTime(), l = n.getTime();
    if (l === o) return r;
    const c = (i - o) / (l - o);
    return this.lerp(r, a, c);
  }
  invert(t) {
    const [e, i] = this.domain, [s, n] = this.range, r = e.getTime(), a = i.getTime();
    if (n === s) return e;
    const o = (t - s) / (n - s), l = this.lerp(r, a, o);
    return new Date(l);
  }
  getTicks(t = 10) {
    const [e, i] = this.domain, s = i.getTime() - e.getTime();
    if (s <= 0) return [{ value: e, label: this.formatDate(e) }];
    const n = [
      { unit: "millisecond", step: 1 },
      { unit: "second", step: 1e3 },
      { unit: "minute", step: 60 * 1e3 },
      { unit: "hour", step: 60 * 60 * 1e3 },
      { unit: "day", step: 24 * 60 * 60 * 1e3 },
      { unit: "week", step: 7 * 24 * 60 * 60 * 1e3 },
      { unit: "month", step: 30 * 24 * 60 * 60 * 1e3 },
      { unit: "year", step: 365 * 24 * 60 * 60 * 1e3 }
    ], r = s / t;
    let a = n[n.length - 1];
    for (const h of n)
      if (h.step >= r) {
        a = h;
        break;
      }
    const o = a.step, l = new Date(Math.ceil(e.getTime() / o) * o), c = [], d = Math.min(200, Math.max(t * 2, 20));
    for (let h = l.getTime(); h <= i.getTime() + o * 0.5 && c.length < d; h += o) {
      const u = new Date(h);
      c.push({ value: u, label: this.formatDate(u) });
    }
    return c;
  }
  formatDate(t) {
    return t.toLocaleDateString(void 0, {
      month: "short",
      day: "numeric",
      year: "2-digit"
    });
  }
}
class Et extends Z {
  categories = [];
  bandWidth = 0;
  constructor(t) {
    super(t), t.domain && (this.categories = t.domain), this.updateBandWidth();
  }
  convert(t) {
    const e = String(t), i = this.categories.indexOf(e);
    if (i === -1) return this.range[0];
    const [s, n] = this.range, r = (n - s) / this.categories.length;
    return s + i * r + r / 2;
  }
  invert(t) {
    const [e, i] = this.range;
    if (i === e) return this.categories[0] ?? "";
    const s = (t - e) / (i - e), n = Math.floor(s * this.categories.length), r = this.clamp(n, 0, this.categories.length - 1);
    return this.categories[r] ?? "";
  }
  setDomain(t, e = !1) {
    super.setDomain(t, e), this.categories = t, this.updateBandWidth();
  }
  setRange(t) {
    super.setRange(t), this.updateBandWidth();
  }
  updateBandWidth() {
    const [t, e] = this.range;
    this.bandWidth = this.categories.length > 0 ? (e - t) / this.categories.length : 0;
  }
  getBandWidth() {
    return this.bandWidth;
  }
  getCategories() {
    return [...this.categories];
  }
  getTicks() {
    return this.categories.map((t) => ({ value: t, label: t }));
  }
}
class $t extends Z {
  logBase = 10;
  constructor(t) {
    if (super(t), this.logBase = t.logBase ?? 10, t.domain && (this.domain = this.logDomain(t.domain)), t.min !== void 0 || t.max !== void 0) {
      const [e, i] = this.domain, s = (a) => {
        const o = a instanceof Date ? a.getTime() : a;
        return o > 0 ? Math.log(o) / Math.log(this.logBase) : NaN;
      };
      let n = e, r = i;
      if (t.min !== void 0) {
        const a = s(t.min);
        Number.isFinite(a) && (n = a);
      }
      if (t.max !== void 0) {
        const a = s(t.max);
        Number.isFinite(a) && (r = a);
      }
      Number.isFinite(n) && Number.isFinite(r) && r > n && (this.domain = [n, r]);
    }
  }
  logDomain(t) {
    const [e, i] = t;
    return e <= 0 || i <= 0 ? [1, this.logBase] : [Math.log(e) / Math.log(this.logBase), Math.log(i) / Math.log(this.logBase)];
  }
  convert(t) {
    const e = typeof t == "number" ? t : Number(t);
    if (e <= 0) return this.range[0];
    const i = Math.log(e) / Math.log(this.logBase), [s, n] = this.domain, [r, a] = this.range;
    if (n === s) return r;
    const o = (i - s) / (n - s);
    return this.lerp(r, a, o);
  }
  invert(t) {
    const [e, i] = this.domain, [s, n] = this.range;
    if (n === s) return Math.pow(this.logBase, e);
    const r = (t - s) / (n - s), a = this.lerp(e, i, r);
    return Math.pow(this.logBase, a);
  }
  getTicks(t = 10) {
    const [e, i] = this.domain, s = [], n = Math.ceil(e), r = Math.floor(i);
    for (let a = n; a <= r; a++) {
      const o = Math.pow(this.logBase, a);
      s.push({ value: o, label: this.formatTick(o) });
    }
    if (s.length > t) {
      const a = Math.ceil(s.length / t);
      return s.filter((o, l) => l % a === 0);
    }
    return s;
  }
  formatTick(t) {
    return t >= 1e6 ? (t / 1e6).toFixed(0) + "M" : t >= 1e3 ? (t / 1e3).toFixed(0) + "K" : t.toString();
  }
}
const Ct = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', F = {
  fontFamily: Ct,
  title: { fontSize: 16, fontWeight: 600, lineHeight: 1.25 },
  subtitle: { fontSize: 13, fontWeight: 400, lineHeight: 1.4 },
  axis: { fontSize: 11, fontWeight: 400, lineHeight: 1.2 },
  legend: { fontSize: 12, fontWeight: 500, lineHeight: 1.3 },
  tooltip: { fontSize: 12, fontWeight: 400, lineHeight: 1.3 }
}, I = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32
}, J = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  full: 9999
}, X = {
  durationFast: 200,
  durationNormal: 400,
  durationSlow: 600,
  easing: "cubic-bezier(0.16, 1, 0.3, 1)"
}, K = {
  colors: {
    background: {
      canvas: "#ffffff",
      plot: "#ffffff",
      surface: "#f8fafc",
      elevated: "#ffffff"
    },
    text: {
      primary: "#0f172a",
      secondary: "#475569",
      muted: "#94a3b8",
      disabled: "#cbd5e1"
    },
    axis: {
      line: "#cbd5e1",
      label: "#64748b",
      tick: "#94a3b8"
    },
    grid: {
      major: "#f1f5f9",
      minor: "#f8fafc"
    },
    tooltip: {
      background: "#0f172a",
      border: "#334155",
      text: "#f8fafc"
    },
    series: [
      "#2563eb",
      // Blue
      "#10b981",
      // Emerald
      "#f59e0b",
      // Amber
      "#8b5cf6",
      // Violet
      "#ef4444",
      // Red
      "#06b6d4",
      // Cyan
      "#ec4899",
      // Pink
      "#6366f1"
      // Indigo
    ],
    semantic: {
      positive: "#10b981",
      negative: "#ef4444",
      warning: "#f59e0b",
      info: "#3b82f6",
      bullish: "#10b981",
      bearish: "#ef4444",
      neutral: "#64748b"
    }
  },
  typography: F,
  spacing: I,
  radius: J,
  shadows: {
    none: "none",
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
  },
  borders: {
    width: 1,
    style: "solid",
    color: "#e2e8f0"
  },
  animation: X
}, Pt = {
  colors: {
    background: {
      canvas: "#0f172a",
      plot: "#0f172a",
      surface: "#1e293b",
      elevated: "#1e293b"
    },
    text: {
      primary: "#f8fafc",
      secondary: "#cbd5e1",
      muted: "#64748b",
      disabled: "#475569"
    },
    axis: {
      line: "#334155",
      label: "#94a3b8",
      tick: "#475569"
    },
    grid: {
      major: "#1e293b",
      minor: "#172033"
    },
    tooltip: {
      background: "#1e293b",
      border: "#334155",
      text: "#f8fafc"
    },
    series: [
      "#3b82f6",
      "#34d399",
      "#fbbf24",
      "#a78bfa",
      "#f87171",
      "#22d3ee",
      "#f472b6",
      "#818cf8"
    ],
    semantic: {
      positive: "#34d399",
      negative: "#f87171",
      warning: "#fbbf24",
      info: "#60a5fa",
      bullish: "#34d399",
      bearish: "#f87171",
      neutral: "#94a3b8"
    }
  },
  typography: F,
  spacing: I,
  radius: J,
  shadows: {
    none: "none",
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.5)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.4)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.4)"
  },
  borders: {
    width: 1,
    style: "solid",
    color: "#1e293b"
  },
  animation: X
}, At = {
  colors: {
    background: {
      canvas: "#090d16",
      plot: "#090d16",
      surface: "#0f172a",
      elevated: "#17223b"
    },
    text: {
      primary: "#e2e8f0",
      secondary: "#94a3b8",
      muted: "#475569",
      disabled: "#334155"
    },
    axis: {
      line: "#1e293b",
      label: "#64748b",
      tick: "#334155"
    },
    grid: {
      major: "#141d30",
      minor: "#0e1524"
    },
    tooltip: {
      background: "#0f172a",
      border: "#1e293b",
      text: "#f8fafc"
    },
    series: [
      "#60a5fa",
      "#4ade80",
      "#facc15",
      "#c084fc",
      "#fb7185",
      "#38bdf8",
      "#f472b6",
      "#a5b4fc"
    ],
    semantic: {
      positive: "#4ade80",
      negative: "#fb7185",
      warning: "#facc15",
      info: "#60a5fa",
      bullish: "#4ade80",
      bearish: "#fb7185",
      neutral: "#64748b"
    }
  },
  typography: F,
  spacing: I,
  radius: J,
  shadows: {
    none: "none",
    sm: "0 1px 3px rgba(0,0,0,0.6)",
    md: "0 4px 8px rgba(0,0,0,0.5)",
    lg: "0 12px 24px rgba(0,0,0,0.5)"
  },
  borders: {
    width: 1,
    style: "solid",
    color: "#1e293b"
  },
  animation: X
}, Dt = {
  colors: {
    background: {
      canvas: "#ffffff",
      plot: "#ffffff",
      surface: "#fafafa",
      elevated: "#ffffff"
    },
    text: {
      primary: "#171717",
      secondary: "#525252",
      muted: "#a3a3a3",
      disabled: "#d4d4d4"
    },
    axis: {
      line: "#e5e5e5",
      label: "#737373",
      tick: "#d4d4d4"
    },
    grid: {
      major: "#f5f5f5",
      minor: "transparent"
    },
    tooltip: {
      background: "#171717",
      border: "#262626",
      text: "#fafafa"
    },
    series: [
      "#171717",
      "#525252",
      "#737373",
      "#a3a3a3",
      "#404040",
      "#262626"
    ],
    semantic: {
      positive: "#171717",
      negative: "#737373",
      warning: "#525252",
      info: "#404040",
      bullish: "#171717",
      bearish: "#737373",
      neutral: "#a3a3a3"
    }
  },
  typography: {
    ...F,
    title: { fontSize: 15, fontWeight: 500, lineHeight: 1.2 },
    subtitle: { fontSize: 12, fontWeight: 400, lineHeight: 1.3 }
  },
  spacing: I,
  radius: {
    none: 0,
    sm: 2,
    md: 4,
    lg: 6,
    full: 9999
  },
  shadows: {
    none: "none",
    sm: "none",
    md: "0 1px 3px rgba(0,0,0,0.06)",
    lg: "0 2px 6px rgba(0,0,0,0.08)"
  },
  borders: {
    width: 1,
    style: "solid",
    color: "#e5e5e5"
  },
  animation: X
}, Tt = {
  colors: {
    background: {
      canvas: "#ffffff",
      plot: "#fbfcfd",
      surface: "#f1f5f9",
      elevated: "#ffffff"
    },
    text: {
      primary: "#091e42",
      secondary: "#253858",
      muted: "#6b778c",
      disabled: "#a5b2c6"
    },
    axis: {
      line: "#dfe1e6",
      label: "#5e6c84",
      tick: "#c1c7d0"
    },
    grid: {
      major: "#ebecf0",
      minor: "#f4f5f7"
    },
    tooltip: {
      background: "#091e42",
      border: "#172b4d",
      text: "#ffffff"
    },
    series: [
      "#0052cc",
      "#00875a",
      "#ff991f",
      "#de350b",
      "#5243aa",
      "#00b8d9",
      "#403294"
    ],
    semantic: {
      positive: "#00875a",
      negative: "#de350b",
      warning: "#ff991f",
      info: "#0052cc",
      bullish: "#00875a",
      bearish: "#de350b",
      neutral: "#6b778c"
    }
  },
  typography: F,
  spacing: I,
  radius: {
    none: 0,
    sm: 3,
    md: 6,
    lg: 8,
    full: 9999
  },
  shadows: {
    none: "none",
    sm: "0 1px 2px rgba(9, 30, 66, 0.08)",
    md: "0 3px 6px rgba(9, 30, 66, 0.12)",
    lg: "0 8px 16px rgba(9, 30, 66, 0.15)"
  },
  borders: {
    width: 1,
    style: "solid",
    color: "#dfe1e6"
  },
  animation: X
}, Lt = {
  colors: {
    background: {
      canvas: "#131722",
      plot: "#131722",
      surface: "#1e222d",
      elevated: "#2a2e39"
    },
    text: {
      primary: "#d1d4dc",
      secondary: "#b2b5be",
      muted: "#787b86",
      disabled: "#50535e"
    },
    axis: {
      line: "#2a2e39",
      label: "#787b86",
      tick: "#363a45"
    },
    grid: {
      major: "#1e222d",
      minor: "#161922"
    },
    tooltip: {
      background: "#1e222d",
      border: "#363a45",
      text: "#d1d4dc"
    },
    series: [
      "#2962ff",
      "#26a69a",
      "#ef5350",
      "#ff9800",
      "#ab47bc",
      "#00bcd4",
      "#ffeb3b"
    ],
    semantic: {
      positive: "#26a69a",
      negative: "#ef5350",
      warning: "#ff9800",
      info: "#2962ff",
      bullish: "#26a69a",
      bearish: "#ef5350",
      neutral: "#787b86"
    }
  },
  typography: {
    ...F,
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
    axis: { fontSize: 10, fontWeight: 500, lineHeight: 1.1 }
  },
  spacing: I,
  radius: {
    none: 0,
    sm: 2,
    md: 4,
    lg: 6,
    full: 9999
  },
  shadows: {
    none: "none",
    sm: "0 2px 4px rgba(0,0,0,0.5)",
    md: "0 4px 8px rgba(0,0,0,0.6)",
    lg: "0 8px 16px rgba(0,0,0,0.7)"
  },
  borders: {
    width: 1,
    style: "solid",
    color: "#2a2e39"
  },
  animation: X
}, Rt = {
  colors: {
    background: {
      canvas: "rgba(255, 255, 255, 0.75)",
      plot: "rgba(255, 255, 255, 0.45)",
      surface: "rgba(255, 255, 255, 0.85)",
      elevated: "#ffffff"
    },
    text: {
      primary: "#1e293b",
      secondary: "#475569",
      muted: "#64748b",
      disabled: "#94a3b8"
    },
    axis: {
      line: "rgba(148, 163, 184, 0.35)",
      label: "#475569",
      tick: "rgba(148, 163, 184, 0.5)"
    },
    grid: {
      major: "rgba(226, 232, 240, 0.6)",
      minor: "rgba(241, 245, 249, 0.4)"
    },
    tooltip: {
      background: "rgba(15, 23, 42, 0.85)",
      border: "rgba(255, 255, 255, 0.2)",
      text: "#ffffff"
    },
    series: [
      "#6366f1",
      "#06b6d4",
      "#10b981",
      "#f59e0b",
      "#ec4899",
      "#3b82f6"
    ],
    semantic: {
      positive: "#10b981",
      negative: "#f43f5e",
      warning: "#f59e0b",
      info: "#6366f1",
      bullish: "#10b981",
      bearish: "#f43f5e",
      neutral: "#64748b"
    }
  },
  typography: F,
  spacing: I,
  radius: {
    none: 0,
    sm: 6,
    md: 12,
    lg: 16,
    full: 9999
  },
  shadows: {
    none: "none",
    sm: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
    md: "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.05)",
    lg: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
  },
  borders: {
    width: 1,
    style: "solid",
    color: "rgba(255, 255, 255, 0.6)"
  },
  animation: X
}, Bt = {
  colors: {
    background: {
      canvas: "#ffffff",
      plot: "#fafafa",
      surface: "#f4f6f8",
      elevated: "#ffffff"
    },
    text: {
      primary: "#1c2536",
      secondary: "#4f5e74",
      muted: "#637381",
      disabled: "#919eab"
    },
    axis: {
      line: "#e0e6ed",
      label: "#637381",
      tick: "#c4cdd5"
    },
    grid: {
      major: "#edf2f7",
      minor: "#f8fafc"
    },
    tooltip: {
      background: "#1c2536",
      border: "#2d3b51",
      text: "#ffffff"
    },
    series: [
      "#0284c7",
      // Sky Blue
      "#0d9488",
      // Teal
      "#d97706",
      // Amber
      "#dc2626",
      // Red
      "#4f46e5",
      // Indigo
      "#059669",
      // Emerald
      "#7c3aed"
      // Purple
    ],
    semantic: {
      positive: "#059669",
      negative: "#dc2626",
      warning: "#d97706",
      info: "#0284c7",
      bullish: "#059669",
      bearish: "#dc2626",
      neutral: "#637381"
    }
  },
  typography: F,
  spacing: I,
  radius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 10,
    full: 9999
  },
  shadows: {
    none: "none",
    sm: "0 1px 3px rgba(0,0,0,0.08)",
    md: "0 4px 12px rgba(0,0,0,0.08)",
    lg: "0 12px 24px rgba(0,0,0,0.1)"
  },
  borders: {
    width: 1,
    style: "solid",
    color: "#e0e6ed"
  },
  animation: X
};
function z(f, t) {
  return {
    name: f,
    background: t.colors.background.canvas,
    text: t.colors.text.primary,
    grid: t.colors.grid.major,
    axis: t.colors.axis.label,
    primary: t.colors.series[0] ?? "#2563eb",
    secondary: t.colors.text.secondary,
    accent: t.colors.series[2] ?? "#f59e0b",
    success: t.colors.semantic.positive,
    warning: t.colors.semantic.warning,
    danger: t.colors.semantic.negative,
    tooltipBackground: t.colors.tooltip.background,
    tooltipColor: t.colors.tooltip.text,
    crosshairColor: t.colors.axis.tick,
    seriesColors: [...t.colors.series],
    fontFamily: t.typography.fontFamily,
    fontSize: t.typography.axis.fontSize,
    tokens: t
  };
}
const W = z("light", K), tt = z("dark", Pt), ot = z("midnight", At), at = z("minimal", Dt), lt = z("professional", Tt), ct = z("financial", Lt), ht = z("glass", Rt), dt = z("enterprise", Bt), j = {
  default: W,
  light: W,
  dark: tt,
  midnight: ot,
  minimal: at,
  professional: lt,
  financial: ct,
  glass: ht,
  enterprise: dt
};
function ft() {
  return typeof window < "u" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? tt : W;
}
function ut(f) {
  const e = (f.name && j[f.name] ? j[f.name] : W)?.tokens ?? K, i = {
    colors: {
      ...e.colors,
      ...f.tokens?.colors ?? {}
    },
    typography: {
      ...e.typography,
      ...f.tokens?.typography ?? {}
    },
    spacing: {
      ...e.spacing,
      ...f.tokens?.spacing ?? {}
    },
    radius: {
      ...e.radius,
      ...f.tokens?.radius ?? {}
    },
    shadows: {
      ...e.shadows,
      ...f.tokens?.shadows ?? {}
    },
    borders: {
      ...e.borders,
      ...f.tokens?.borders ?? {}
    },
    animation: {
      ...e.animation,
      ...f.tokens?.animation ?? {}
    }
  }, s = z(f.name ?? "custom", i);
  return {
    ...s,
    ...f,
    seriesColors: f.seriesColors ?? f.tokens?.colors?.series ?? s.seriesColors,
    tokens: i
  };
}
function Wt(f, t) {
  const e = typeof f == "string" ? f === "system" ? ft() : j[f] ?? W : f, i = e.tokens ?? K, s = {
    colors: {
      ...i.colors,
      ...t.tokens?.colors ?? {}
    },
    typography: {
      ...i.typography,
      ...t.tokens?.typography ?? {}
    },
    spacing: {
      ...i.spacing,
      ...t.tokens?.spacing ?? {}
    },
    radius: {
      ...i.radius,
      ...t.tokens?.radius ?? {}
    },
    shadows: {
      ...i.shadows,
      ...t.tokens?.shadows ?? {}
    },
    borders: {
      ...i.borders,
      ...t.tokens?.borders ?? {}
    },
    animation: {
      ...i.animation,
      ...t.tokens?.animation ?? {}
    }
  };
  return ut({
    ...e,
    ...t,
    tokens: s
  });
}
function mt(f) {
  return f ? typeof f == "string" ? f === "system" ? ft() : j[f] ?? W : f : W;
}
class zt {
  events = /* @__PURE__ */ new Map();
  on(t, e) {
    this.events.has(t) || this.events.set(t, /* @__PURE__ */ new Set()), this.events.get(t).add(e);
  }
  off(t, e) {
    const i = this.events.get(t);
    i && i.delete(e);
  }
  emit(t, e) {
    const i = this.events.get(t);
    if (i)
      for (const s of i)
        try {
          s(e);
        } catch (n) {
          console.error(`Error in event listener for "${t}":`, n);
        }
  }
  removeAllListeners(t) {
    t ? this.events.delete(t) : this.events.clear();
  }
  listenerCount(t) {
    return this.events.get(t)?.size ?? 0;
  }
}
class Yt {
  static compute(t, e) {
    const i = t.getBoundingClientRect(), s = typeof e.width == "number" ? e.width : i.width || 800, n = typeof e.height == "number" ? e.height : i.height || 400, r = {
      top: e.margin?.top ?? 20,
      right: e.margin?.right ?? 20,
      bottom: e.margin?.bottom ?? 40,
      left: e.margin?.left ?? 60
    }, a = {
      top: e.padding?.top ?? 10,
      right: e.padding?.right ?? 10,
      bottom: e.padding?.bottom ?? 10,
      left: e.padding?.left ?? 10
    };
    let o, l = 0;
    e.title?.text && (l = (e.title.fontSize ?? 16) + (e.title.padding ?? 16), o = {
      x: r.left,
      y: r.top,
      width: Math.max(0, s - r.left - r.right),
      height: l
    });
    let c, d = 0, h = 0;
    if (e.legend?.enabled !== !1 && e.legend?.position) {
      const b = e.legend.position;
      b === "top" || b === "bottom" ? d = 30 : h = 80;
    }
    const u = e.direction === "rtl";
    let g = r.left + a.left;
    const p = r.top + a.top + l;
    let m = s - r.left - r.right - a.left - a.right - h, x = n - r.top - r.bottom - a.top - a.bottom - l - d;
    u && (g = r.right + a.right), m = Math.max(0, m), x = Math.max(0, x);
    const y = {
      x: g,
      y: p,
      width: m,
      height: x
    };
    if (e.legend?.enabled !== !1 && e.legend?.position) {
      const b = e.legend.position;
      b === "bottom" ? c = {
        x: g,
        y: p + x + a.bottom + 10,
        width: m,
        height: d
      } : b === "top" && (c = {
        x: g,
        y: r.top + l,
        width: m,
        height: d
      });
    }
    const v = {
      x: 0,
      y: 0,
      width: s,
      height: n,
      margins: r,
      padding: a,
      plot: y
    };
    return {
      chart: { x: 0, y: 0, width: s, height: n },
      title: o,
      legend: c,
      axes: {
        bottom: { x: g, y: p + x, width: m, height: r.bottom },
        left: { x: 0, y: p, width: r.left, height: x },
        top: { x: g, y: r.top, width: m, height: r.top },
        right: { x: g + m, y: p, width: r.right, height: x }
      },
      plot: y,
      bounds: v
    };
  }
}
function Y(f, t = 2) {
  return Number.isFinite(f) ? isNaN(f) ? "0" : Math.abs(f) >= 1e9 ? `${(f / 1e9).toFixed(t)}B` : Math.abs(f) >= 1e6 ? `${(f / 1e6).toFixed(t)}M` : Math.abs(f) >= 1e3 ? `${(f / 1e3).toFixed(t)}k` : Number.isInteger(f) ? f.toString() : f.toFixed(t) : String(f);
}
function H(f) {
  return f.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
class Ft {
  element = null;
  container;
  config;
  theme;
  visible = !1;
  constructor(t, e, i) {
    this.container = t, this.config = e, this.theme = i, this.config.enabled !== !1 && this.init();
  }
  init() {
    this.element || (this.element = document.createElement("div"), this.element.className = "charteex-tooltip", this.element.style.position = "absolute", this.element.style.display = "none", this.element.style.pointerEvents = "none", this.element.style.zIndex = "9999", this.element.style.transition = "opacity 0.15s cubic-bezier(0.16, 1, 0.3, 1), transform 0.1s ease-out", this.element.style.padding = `${this.config.padding ?? 8}px 12px`, this.element.style.borderRadius = `${this.config.borderRadius ?? this.theme.tokens?.radius?.md ?? 6}px`, this.element.style.fontSize = `${this.config.fontSize ?? 12}px`, this.element.style.fontFamily = this.config.fontFamily ?? this.theme.fontFamily, this.element.style.boxShadow = "0 4px 14px -1px rgba(0,0,0,0.18), 0 2px 6px -1px rgba(0,0,0,0.12)", this.element.style.backdropFilter = "blur(8px)", this.updateThemeStyles(), getComputedStyle(this.container).position === "static" && (this.container.style.position = "relative"), this.container.appendChild(this.element));
  }
  updateThemeStyles() {
    if (!this.element) return;
    const t = this.config.theme === "dark" || this.config.theme !== "light" && this.theme.name !== "light" && this.theme.name !== "minimal", e = t ? "#1e293b" : "#ffffff", i = t ? "#f8fafc" : "#0f172a", s = t ? "#334155" : "#e2e8f0";
    this.element.style.backgroundColor = this.config.background ?? this.theme.tooltipBackground ?? e, this.element.style.color = this.config.color ?? this.theme.tooltipColor ?? i, this.element.style.border = `1px solid ${this.theme.tokens?.colors?.tooltip?.border ?? s}`;
  }
  show(t, e, i) {
    if (!this.element || this.config.enabled === !1) return;
    if (this.config.render) {
      const o = this.config.render(i);
      typeof o == "string" ? this.element.innerHTML = o : o instanceof HTMLElement && (this.element.innerHTML = "", this.element.appendChild(o));
    } else if (this.config.formatter)
      this.element.innerHTML = this.config.formatter(i.dataPoint, i);
    else {
      const o = H(i.series.name ?? "Series"), l = i.dataPoint, c = l.x !== void 0 ? H(String(l.x)) : l.time !== void 0 ? H(String(l.time)) : "", d = l.y !== void 0 ? Y(l.y) : l.value !== void 0 ? Y(l.value) : "";
      let h = "";
      l.open !== void 0 && l.close !== void 0 && (h = `<div style="font-size:11px;opacity:0.85;margin-top:4px;display:flex;gap:8px;"><span>O: <b>${Y(l.open)}</b></span> <span>H: <b>${Y(l.high ?? 0)}</b></span> <span>L: <b>${Y(l.low ?? 0)}</b></span> <span>C: <b>${Y(l.close)}</b></span></div>`);
      const u = i.series.color ?? "#2563eb";
      this.element.innerHTML = `
        <div style="display:flex;align-items:center;gap:6px;font-weight:600;margin-bottom:2px;">
          <span style="width:8px;height:8px;border-radius:50%;background:${u};display:inline-block;"></span>
          <span>${o}</span>
        </div>
        ${c ? `<div style="font-size:11px;opacity:0.75;margin-bottom:2px;">${c}</div>` : ""}
        ${d ? `<div style="font-weight:600;font-size:13px;">${d}</div>` : ""}
        ${h}
      `;
    }
    this.element.style.display = "block", this.element.style.opacity = "1";
    const s = this.container.getBoundingClientRect(), n = this.element.getBoundingClientRect();
    let r = t + 15, a = e - n.height / 2;
    r + n.width > s.width && (r = t - n.width - 15), a < 6 && (a = 6), a + n.height > s.height && (a = s.height - n.height - 6), this.element.style.left = `${r}px`, this.element.style.top = `${a}px`, this.visible = !0;
  }
  hide() {
    !this.element || !this.visible || (this.element.style.display = "none", this.element.style.opacity = "0", this.visible = !1);
  }
  destroy() {
    this.element && (this.element.remove(), this.element = null);
  }
}
class It {
  config;
  theme;
  renderer;
  bounds;
  vLine = null;
  hLine = null;
  constructor(t, e, i, s) {
    this.renderer = t, this.bounds = e, this.config = i, this.theme = s;
  }
  updateBounds(t) {
    this.bounds = t;
  }
  show(t, e) {
    if (this.config.enabled === !1) return;
    const { plot: i } = this.bounds, s = Math.max(i.x, Math.min(i.x + i.width, t)), n = Math.max(i.y, Math.min(i.y + i.height, e)), r = this.config.color ?? this.theme.crosshairColor ?? "#9ca3af", a = this.config.dash ?? [3, 3], o = this.config.lineWidth ?? 1;
    this.hide(), this.config.vertical !== !1 && (this.vLine = this.renderer.line(s, i.y, s, i.y + i.height, {
      stroke: r,
      strokeWidth: o,
      strokeDasharray: a
    })), this.config.horizontal && (this.hLine = this.renderer.line(i.x, n, i.x + i.width, n, {
      stroke: r,
      strokeWidth: o,
      strokeDasharray: a
    }));
  }
  hide() {
    this.vLine && (this.vLine.destroy(), this.vLine = null), this.hLine && (this.hLine.destroy(), this.hLine = null);
  }
  destroy() {
    this.hide();
  }
}
class Xt {
  container;
  chart;
  zoomConfig;
  panConfig;
  isDragging = !1;
  startX = 0;
  startY = 0;
  initialPinchDist = 0;
  constructor(t, e, i = {}, s = {}) {
    this.container = t, this.chart = e, this.zoomConfig = i, this.panConfig = s, this.bindEvents();
  }
  onWheel = (t) => {
    if (!this.zoomConfig.enabled || this.zoomConfig.wheel === !1) return;
    t.preventDefault();
    const e = this.container.getBoundingClientRect(), i = t.clientX - e.left, s = t.clientY - e.top, r = t.deltaY > 0 ? 0.9 : 1.1;
    this.chart.zoom(r, i, s);
  };
  onPointerDown = (t) => {
    !this.panConfig.enabled || this.panConfig.drag === !1 || (this.isDragging = !0, this.startX = t.clientX, this.startY = t.clientY, this.container.setPointerCapture?.(t.pointerId));
  };
  onPointerMove = (t) => {
    if (!this.isDragging) return;
    const e = t.clientX - this.startX, i = t.clientY - this.startY;
    this.startX = t.clientX, this.startY = t.clientY, this.chart.pan(e, i);
  };
  onPointerUp = (t) => {
    this.isDragging && (this.isDragging = !1, this.container.releasePointerCapture?.(t.pointerId));
  };
  onTouchStart = (t) => {
    if (t.touches.length === 2 && this.zoomConfig.enabled && this.zoomConfig.pinch !== !1) {
      const e = t.touches[0], i = t.touches[1];
      e && i && (this.initialPinchDist = Math.hypot(e.clientX - i.clientX, e.clientY - i.clientY));
    }
  };
  onTouchMove = (t) => {
    if (t.touches.length === 2 && this.zoomConfig.enabled && this.zoomConfig.pinch !== !1) {
      t.preventDefault();
      const e = t.touches[0], i = t.touches[1];
      if (!e || !i) return;
      const s = Math.hypot(e.clientX - i.clientX, e.clientY - i.clientY);
      if (this.initialPinchDist > 0) {
        const n = s / this.initialPinchDist, r = this.container.getBoundingClientRect(), a = (e.clientX + i.clientX) / 2 - r.left, o = (e.clientY + i.clientY) / 2 - r.top;
        this.chart.zoom(n, a, o), this.initialPinchDist = s;
      }
    }
  };
  bindEvents() {
    this.container.addEventListener("wheel", this.onWheel, { passive: !1 }), this.container.addEventListener("pointerdown", this.onPointerDown), this.container.addEventListener("pointermove", this.onPointerMove), this.container.addEventListener("pointerup", this.onPointerUp), this.container.addEventListener("pointercancel", this.onPointerUp), this.container.addEventListener("touchstart", this.onTouchStart, { passive: !0 }), this.container.addEventListener("touchmove", this.onTouchMove, { passive: !1 });
  }
  destroy() {
    this.container.removeEventListener("wheel", this.onWheel), this.container.removeEventListener("pointerdown", this.onPointerDown), this.container.removeEventListener("pointermove", this.onPointerMove), this.container.removeEventListener("pointerup", this.onPointerUp), this.container.removeEventListener("pointercancel", this.onPointerUp), this.container.removeEventListener("touchstart", this.onTouchStart), this.container.removeEventListener("touchmove", this.onTouchMove);
  }
}
class Ot {
  container;
  options;
  srElement = null;
  constructor(t, e) {
    this.container = t, this.options = e, this.apply();
  }
  apply() {
    if (this.options.accessibility?.enabled === !1) return;
    const t = this.options.accessibility?.label ?? (this.options.title?.text || `${this.options.type} chart`), e = this.options.accessibility?.description;
    this.container.setAttribute("role", "img"), this.container.setAttribute("aria-roledescription", "chart"), this.container.setAttribute("aria-label", t), this.srElement || (this.srElement = document.createElement("div"), this.srElement.className = "smart-chart-sr-only", this.srElement.style.position = "absolute", this.srElement.style.width = "1px", this.srElement.style.height = "1px", this.srElement.style.padding = "0", this.srElement.style.margin = "-1px", this.srElement.style.overflow = "hidden", this.srElement.style.clip = "rect(0, 0, 0, 0)", this.srElement.style.whiteSpace = "nowrap", this.srElement.style.border = "0", this.container.appendChild(this.srElement));
    const i = this.options.data.series ?? [];
    let s = `<p>${H(t)}${e ? `: ${H(e)}` : ""}</p>`;
    if (i.length > 0) {
      s += "<ul>";
      for (const n of i)
        s += `<li>${H(n.name ?? "Series")}: ${n.data.length} data points</li>`;
      s += "</ul>";
    }
    this.srElement.innerHTML = s;
  }
  destroy() {
    this.srElement && (this.srElement.remove(), this.srElement = null), this.container.removeAttribute("role"), this.container.removeAttribute("aria-roledescription"), this.container.removeAttribute("aria-label");
  }
}
function B(f) {
  if (f == null) return 0;
  if (typeof f == "number") return isNaN(f) ? 0 : f;
  if (f instanceof Date) {
    const t = f.getTime();
    return isNaN(t) ? 0 : t;
  }
  if (typeof f == "string") {
    const t = Date.parse(f);
    if (!isNaN(t)) return t;
    const e = Number(f);
    return isNaN(e) ? 0 : e;
  }
  return 0;
}
function fe(f, t = "auto") {
  const e = new Date(f);
  if (isNaN(e.getTime())) return "";
  const i = (c) => c < 10 ? `0${c}` : `${c}`, s = i(e.getHours()), n = i(e.getMinutes()), r = i(e.getSeconds()), a = i(e.getDate()), o = i(e.getMonth() + 1), l = e.getFullYear();
  return t === "time" ? `${s}:${n}:${r}` : t === "date" ? `${l}-${o}-${a}` : t === "datetime" ? `${l}-${o}-${a} ${s}:${n}` : t === "year" ? `${l}` : `${o}/${a} ${s}:${n}`;
}
class q {
  static normalize(t) {
    const e = t.categories ? [...t.categories] : [];
    let i = [];
    if (t.series && Array.isArray(t.series) ? i = t.series.map((s, n) => ({
      ...s,
      name: s.name ?? `Series ${n + 1}`,
      data: this.normalizePoints(s.data)
    })) : t.data && Array.isArray(t.data) && (i = [
      {
        name: "Series 1",
        data: this.normalizePoints(t.data)
      }
    ]), e.length === 0) {
      const s = i[0];
      if (s && s.data.length > 0)
        for (const n of s.data)
          n.category ? e.push(n.category) : typeof n.x == "string" && e.push(n.x);
    }
    return { series: i, categories: e };
  }
  static normalizePoints(t) {
    return Array.isArray(t) ? t.filter((e) => e != null && typeof e == "object").map((e, i) => {
      const s = { ...e };
      return typeof s.y == "number" ? s.y = isNaN(s.y) || !isFinite(s.y) ? 0 : s.y : typeof s.value == "number" && (s.value = isNaN(s.value) || !isFinite(s.value) ? 0 : s.value, s.y = s.value), s.x === void 0 && s.category ? s.x = s.category : s.x === void 0 && (s.x = i), s.open !== void 0 && (s.open = Number(s.open) || 0), s.high !== void 0 && (s.high = Number(s.high) || 0), s.low !== void 0 && (s.low = Number(s.low) || 0), s.close !== void 0 && (s.close = Number(s.close) || 0), s.volume !== void 0 && (s.volume = Number(s.volume) || 0), s.time !== void 0 && (s.time = B(s.time)), s;
    }) : [];
  }
  /**
   * Largest-Triangle-Three-Buckets (LTTB) decimation algorithm for high-performance large datasets
   */
  static decimateLTTB(t, e) {
    if (e >= t.length || e <= 2)
      return t;
    const i = [], s = (t.length - 2) / (e - 2);
    let n = 0;
    const r = t[n];
    if (!r) return t;
    i.push(r);
    for (let o = 0; o < e - 2; o++) {
      let l = 0, c = 0;
      const d = Math.floor((o + 1) * s) + 1;
      let h = Math.floor((o + 2) * s) + 1;
      h = h < t.length ? h : t.length;
      const u = h - d;
      for (let b = d; b < h; b++) {
        const w = t[b];
        w && (l += w.x, c += w.y);
      }
      l /= u, c /= u;
      const g = Math.floor(o * s) + 1, p = Math.floor((o + 1) * s) + 1, m = t[n];
      if (!m) continue;
      let x = -1, y = g;
      for (let b = g; b < p; b++) {
        const w = t[b];
        if (!w) continue;
        const S = Math.abs(
          (m.x - l) * (w.y - m.y) - (m.x - w.x) * (c - m.y)
        ) * 0.5;
        S > x && (x = S, y = b);
      }
      const v = t[y];
      v && i.push(v), n = y;
    }
    const a = t[t.length - 1];
    return a && i.push(a), i;
  }
}
class O extends Error {
  constructor(t) {
    super(`ChartError: ${t}`), this.name = "ChartError";
  }
}
class ue extends Error {
  constructor(t) {
    super(`ScaleError: ${t}`), this.name = "ScaleError";
  }
}
class me extends Error {
  constructor(t) {
    super(`RendererError: ${t}`), this.name = "RendererError";
  }
}
class ge extends Error {
  constructor(t) {
    super(`DataError: ${t}`), this.name = "DataError";
  }
}
class pe extends Error {
  constructor(t) {
    super(`ConfigurationError: ${t}`), this.name = "ConfigurationError";
  }
}
class D {
  container;
  options;
  renderer;
  bounds;
  scales = /* @__PURE__ */ new Map();
  plugins = [];
  eventEmitter;
  animationFrame = null;
  isDestroyed = !1;
  resizeObserver = null;
  theme;
  tooltip = null;
  crosshair = null;
  zoomPan = null;
  a11y = null;
  constructor(t) {
    this.options = this.mergeOptions(t), this.container = this.resolveContainer(this.options.container), this.theme = this.resolveTheme(this.options.theme), this.eventEmitter = new zt();
    const e = q.normalize(this.options.data);
    this.options.data.series = e.series, e.categories.length > 0 && !this.options.data.categories && (this.options.data.categories = e.categories), this.renderer = this.createRenderer(this.options.renderer), this.bounds = this.calculateBounds(), this.initializeScales(), this.initializePlugins(), this.setupResizeObserver(), this.renderer.init(this.container, this.bounds.width, this.bounds.height), this.applyContainerStyle(), this.setupInteractions(), this.setupA11y();
  }
  applyContainerStyle() {
    const t = this.options.containerStyle;
    t && (t.background && (this.container.style.backgroundColor = t.background), t.borderRadius !== void 0 && (this.container.style.borderRadius = `${t.borderRadius}px`), t.padding !== void 0 && (this.container.style.padding = `${t.padding}px`), t.border && (this.container.style.border = typeof t.border == "string" ? t.border : `1px solid ${this.theme.grid}`), t.shadow && (this.container.style.boxShadow = typeof t.shadow == "string" ? t.shadow : "0 4px 6px -1px rgba(0, 0, 0, 0.1)"));
  }
  mergeOptions(t) {
    return {
      ...t,
      type: t.type,
      data: t.data ?? { series: [] },
      container: t.container,
      width: t.width ?? "100%",
      height: t.height ?? 400,
      renderer: t.renderer ?? "auto",
      theme: t.theme ?? "light",
      direction: t.direction ?? "ltr",
      margin: t.margin ?? {},
      padding: t.padding ?? {},
      responsive: t.responsive ?? !0,
      animation: t.animation ?? { enabled: !0, duration: 600, easing: "easeOut" },
      axis: t.axis ?? {},
      tooltip: t.tooltip ?? { enabled: !0, mode: "nearest" },
      crosshair: t.crosshair ?? { enabled: !1 },
      zoom: t.zoom ?? { enabled: !1 },
      pan: t.pan ?? { enabled: !1 },
      legend: t.legend ?? { enabled: !0, position: "bottom" },
      title: t.title ?? {},
      accessibility: t.accessibility ?? { enabled: !0 },
      plugins: t.plugins ?? []
    };
  }
  resolveContainer(t) {
    if (typeof t == "string") {
      const e = document.querySelector(t);
      if (!e)
        throw new O(`Container element "${t}" was not found.`);
      return e;
    }
    return t;
  }
  resolveTheme(t) {
    return mt(t);
  }
  createRenderer(t) {
    if (t === "canvas")
      return new it();
    if (t === "svg")
      return new st();
    let e = 0;
    for (const i of this.options.data.series ?? [])
      e += i.data?.length ?? 0;
    return e > 2500 ? new it() : new st();
  }
  calculateBounds() {
    return Yt.compute(this.container, this.options).bounds;
  }
  initializeScales() {
    const { axis: t } = this.options;
    this.scales.set("x", this.createScale("x", t?.x ?? { type: "linear" })), this.scales.set("y", this.createScale("y", t?.y ?? { type: "linear" })), t?.y2 && this.scales.set("y2", this.createScale("y2", t.y2));
  }
  createScale(t, e) {
    const i = e ?? {}, s = i.type ?? "linear", n = i.domain, r = i.range ?? this.getDefaultRange(t);
    switch (s) {
      case "time":
        return new kt({ domain: n, range: r, min: i.min, max: i.max });
      case "category":
        return new Et({ domain: n, range: r, min: i.min, max: i.max });
      case "log":
        return new $t({ domain: n, range: r, min: i.min, max: i.max, logBase: i.logBase });
      default:
        return new Mt({ domain: n, range: r, min: i.min, max: i.max, nice: i.nice });
    }
  }
  getDefaultRange(t) {
    return t === "x" ? [this.bounds.plot.x, this.bounds.plot.x + this.bounds.plot.width] : [this.bounds.plot.y + this.bounds.plot.height, this.bounds.plot.y];
  }
  initializePlugins() {
    for (const t of this.options.plugins ?? [])
      this.use(t);
  }
  setupResizeObserver() {
    if (!this.options.responsive || typeof ResizeObserver > "u") return;
    let t = 0;
    this.resizeObserver = new ResizeObserver(() => {
      t && cancelAnimationFrame(t), t = requestAnimationFrame(() => {
        t = 0, this.resize();
      });
    }), this.resizeObserver.observe(this.container);
  }
  setupInteractions() {
    this.options.tooltip?.enabled !== !1 && (this.tooltip = new Ft(this.container, this.options.tooltip ?? {}, this.theme)), this.options.crosshair?.enabled && (this.crosshair = new It(this.renderer, this.bounds, this.options.crosshair, this.theme)), (this.options.zoom?.enabled || this.options.pan?.enabled) && (this.zoomPan = new Xt(
      this.container,
      this,
      this.options.zoom,
      this.options.pan
    )), this.container.addEventListener("pointermove", this.handlePointerMove), this.container.addEventListener("pointerleave", this.handlePointerLeave), this.container.addEventListener("click", this.handleClick);
  }
  setupA11y() {
    this.options.accessibility?.enabled !== !1 && (this.a11y = new Ot(this.container, this.options));
  }
  handlePointerMove = (t) => {
    if (this.isDestroyed) return;
    const e = this.container.getBoundingClientRect(), i = t.clientX - e.left, s = t.clientY - e.top, { plot: n } = this.bounds;
    if (!(i >= n.x && i <= n.x + n.width && s >= n.y && s <= n.y + n.height)) {
      this.tooltip?.hide(), this.crosshair?.hide();
      return;
    }
    this.crosshair?.show(i, s);
    const a = this.findNearestDataPoint(i, s);
    a && this.tooltip ? (this.tooltip.show(i, s, a.context), this.emit("hover", {
      series: a.context.series.name,
      seriesIndex: a.seriesIndex,
      dataIndex: a.dataIndex,
      value: a.context.yValue,
      x: i,
      y: s,
      originalEvent: t
    })) : this.tooltip?.hide();
  };
  handlePointerLeave = () => {
    this.tooltip?.hide(), this.crosshair?.hide();
  };
  handleClick = (t) => {
    if (this.isDestroyed) return;
    const e = this.container.getBoundingClientRect(), i = t.clientX - e.left, s = t.clientY - e.top, n = this.findNearestDataPoint(i, s);
    n && this.emit("click", {
      series: n.context.series.name,
      seriesIndex: n.seriesIndex,
      dataIndex: n.dataIndex,
      value: n.context.yValue,
      x: i,
      y: s,
      originalEvent: t
    });
  };
  findNearestDataPoint(t, e) {
    const i = this.options.data.series ?? [];
    if (["pie", "donut", "gauge", "heatmap", "funnel"].includes(this.options.type)) return null;
    const s = this.scales.get("x"), n = this.scales.get("y");
    if (!s || !n || i.length === 0) return null;
    let r = 1 / 0, a = null;
    for (let o = 0; o < i.length; o++) {
      const l = i[o];
      if (!l || l.visible === !1 || !Array.isArray(l.data)) continue;
      const c = l.data.length > 2e3 ? Math.ceil(l.data.length / 2e3) : 1;
      for (let d = 0; d < l.data.length; d += c) {
        const h = l.data[d];
        if (!h) continue;
        const u = h.x ?? h.time ?? h.category ?? d, g = s.convert(u), p = n.convert(h.y ?? h.close ?? h.value ?? 0);
        if (!Number.isFinite(g) || !Number.isFinite(p)) continue;
        const m = Math.hypot(t - g, e - p);
        m < r && m < 60 && (r = m, a = {
          seriesIndex: o,
          dataIndex: d,
          context: {
            series: l,
            dataIndex: d,
            dataPoint: h,
            xValue: h.x ?? h.time ?? d,
            yValue: h.y ?? h.close ?? h.value ?? 0
          }
        });
      }
    }
    return a;
  }
  render() {
    this.isDestroyed || (this.renderer.clear(), this.renderTitle(), this.renderLegend(), this.emit("render", { chart: this }));
  }
  renderTitle() {
    const t = this.options.title;
    if (!t?.text) return;
    const e = t.fontSize ?? 16, i = t.fontWeight ?? "600", s = t.color ?? this.theme.text, n = this.bounds.margins.left, r = this.bounds.margins.top + e;
    this.renderer.text(n, r, t.text, {
      fill: s,
      fontSize: e,
      fontWeight: i,
      fontFamily: this.theme.fontFamily,
      textAnchor: "start",
      dominantBaseline: "alphabetic"
    });
  }
  renderLegend() {
    const t = this.options.legend;
    if (t?.enabled === !1) return;
    const e = this.options.data.series ?? [];
    if (e.length <= 1 && !this.options.data.categories) return;
    const i = t?.position ?? "bottom", s = this.bounds.plot.x, n = i === "bottom" ? this.bounds.plot.y + this.bounds.plot.height + 25 : this.bounds.margins.top + 10;
    let r = s;
    const a = 20;
    e.forEach((o, l) => {
      const c = o.visible !== !1, d = o.color ?? this.theme.seriesColors[l % this.theme.seriesColors.length] ?? "#2563eb", h = c ? d : "#94a3b8", u = o.name ?? `Series ${l + 1}`, g = 20 + u.length * 7;
      if (this.renderer.circle(r + 6, n, 4, {
        fill: h,
        opacity: c ? 1 : 0.4
      }), this.renderer.text(r + 16, n, u, {
        fill: c ? this.theme.text : "#94a3b8",
        fontSize: 12,
        fontFamily: this.theme.fontFamily,
        dominantBaseline: "middle",
        opacity: c ? 1 : 0.5
      }), t?.interactive !== !1) {
        const p = this.renderer.rect(r, n - 10, g, 20, {
          fill: "transparent"
        });
        p.addEventListener("click", () => {
          o.visible = o.visible === !1, t?.onSeriesClick?.(l, o.visible), this.emit("legendclick", { seriesIndex: l, visible: o.visible }), this.render();
        }), p.addEventListener("pointerenter", () => {
          t?.onSeriesHover?.(l), this.emit("legendhover", { seriesIndex: l });
        }), p.addEventListener("pointerleave", () => {
          t?.onSeriesHover?.(null), this.emit("legendhover", { seriesIndex: null });
        });
      }
      r += g + a;
    });
  }
  resize() {
    if (this.isDestroyed || this.container.clientWidth === 0 || this.container.clientHeight === 0) return;
    const t = this.calculateBounds(), e = t.width !== this.bounds.width, i = t.height !== this.bounds.height;
    if (!(!e && !i)) {
      this.bounds = t, this.renderer.init(this.container, this.bounds.width, this.bounds.height);
      for (const [s, n] of this.scales)
        n.setRange(this.getDefaultRange(s));
      this.crosshair?.updateBounds(this.bounds), (e || i) && this.emit("resize", { chart: this, bounds: this.bounds }), this.render();
    }
  }
  setData(t) {
    const e = q.normalize(t);
    this.options.data = {
      ...t,
      series: e.series,
      categories: e.categories.length > 0 ? e.categories : t.categories
    }, this.updateScalesFromData(), this.a11y?.apply(), this.render(), this.emit("datachange", { chart: this, data: this.options.data });
  }
  update(t) {
    if (this.options = { ...this.options, ...t }, t.theme && (this.theme = this.resolveTheme(t.theme)), t.data) {
      const e = q.normalize(t.data);
      this.options.data = {
        ...t.data,
        series: e.series,
        categories: e.categories.length > 0 ? e.categories : t.data.categories
      };
    }
    (t.margin || t.padding || t.width || t.height || t.title || t.legend) && (this.bounds = this.calculateBounds(), this.renderer.init(this.container, this.bounds.width, this.bounds.height), this.crosshair?.updateBounds(this.bounds)), (t.axis || t.data) && (t.axis && this.initializeScales(), this.updateScalesFromData()), this.a11y?.apply(), this.render(), this.emit("update", { chart: this, options: t });
  }
  appendData(t, e = 0) {
    const i = this.options.data.series;
    if (i && i[e]) {
      const s = q.normalizePoints([t])[0];
      s && (i[e].data.push(s), this.updateScalesFromData(), this.render(), this.emit("dataappend", { chart: this, point: s, seriesIndex: e }));
    }
  }
  removeData(t, e = 0) {
    if (t <= 0) return;
    const i = this.options.data.series;
    if (i && i[e]) {
      const s = i[e].data;
      s.splice(Math.max(0, s.length - t), t), this.updateScalesFromData(), this.render(), this.emit("dataremove", { chart: this, count: t, seriesIndex: e });
    }
  }
  updateScalesFromData() {
  }
  zoom(t, e, i) {
    const { zoom: s } = this.options;
    if (!s?.enabled) return;
    const n = s.minZoom ?? 0.1, r = s.maxZoom ?? 10, a = Math.max(n, Math.min(r, t));
    for (const o of this.scales.values())
      o.zoom(a, e, i);
    this.render(), this.emit("zoom", { chart: this, factor: a });
  }
  pan(t, e) {
    const { pan: i } = this.options;
    if (i?.enabled) {
      for (const s of this.scales.values())
        s.pan(t, e);
      this.render(), this.emit("pan", { chart: this, deltaX: t, deltaY: e });
    }
  }
  resetZoom() {
    for (const t of this.scales.values())
      t.reset();
    this.render(), this.emit("zoomreset", { chart: this });
  }
  async export(t) {
    return t === "svg" ? this.exportSVG() : this.exportPNG();
  }
  exportSVG() {
    const t = this.container.querySelector("svg");
    if (t)
      return new XMLSerializer().serializeToString(t);
    throw new O("SVG export not available for current renderer");
  }
  async exportPNG() {
    const t = this.container.querySelector("canvas");
    if (t)
      return new Promise((i, s) => {
        t.toBlob((n) => {
          n ? i(n) : s(new O("PNG export failed"));
        }, "image/png");
      });
    const e = this.container.querySelector("svg");
    if (e)
      return new Promise((i, s) => {
        const n = new XMLSerializer().serializeToString(e), r = new Image(), a = new Blob([n], { type: "image/svg+xml;charset=utf-8" }), o = window.URL || window.webkitURL || window, l = o.createObjectURL(a);
        r.onload = () => {
          const c = document.createElement("canvas");
          c.width = this.bounds.width, c.height = this.bounds.height;
          const d = c.getContext("2d");
          d ? (d.drawImage(r, 0, 0), c.toBlob((h) => {
            o.revokeObjectURL(l), h ? i(h) : s(new O("PNG export failed"));
          }, "image/png")) : (o.revokeObjectURL(l), s(new O("Canvas context unavailable")));
        }, r.onerror = () => {
          o.revokeObjectURL(l), s(new O("Failed to load SVG for export"));
        }, r.src = l;
      });
    throw new O("PNG export not available");
  }
  on(t, e) {
    return this.eventEmitter.on(t, e), () => this.off(t, e);
  }
  off(t, e) {
    this.eventEmitter.off(t, e);
  }
  emit(t, e) {
    this.eventEmitter.emit(t, { type: t, target: this, data: e });
  }
  use(t) {
    t.install(this), this.plugins.push(t);
  }
  destroy() {
    if (!this.isDestroyed) {
      this.isDestroyed = !0, this.container.removeEventListener("pointermove", this.handlePointerMove), this.container.removeEventListener("pointerleave", this.handlePointerLeave), this.container.removeEventListener("click", this.handleClick), this.animationFrame && cancelAnimationFrame(this.animationFrame), this.resizeObserver && this.resizeObserver.disconnect(), this.tooltip?.destroy(), this.crosshair?.destroy(), this.zoomPan?.destroy(), this.a11y?.destroy();
      for (const t of this.plugins)
        t.destroy?.(this);
      this.renderer.destroy(), this.eventEmitter.removeAllListeners(), this.container.innerHTML = "";
    }
  }
  getBounds() {
    return this.bounds;
  }
  getScale(t) {
    return this.scales.get(t);
  }
  getTheme() {
    return this.theme;
  }
  getOptions() {
    return { ...this.options };
  }
}
function Nt(f) {
  const { scale: t, bounds: e, theme: i, config: s, renderer: n } = f, r = [], a = s.position ?? "bottom", o = s.grid ?? !0, l = t.getTicks(s.ticks), c = Vt(a, e, i, n);
  c && r.push(c);
  for (const h of l) {
    const u = Ht(t, h, a, e, i, s, n, o);
    r.push(...u);
  }
  const d = qt(s.label, a, e, i, n);
  return d && r.push(d), r;
}
function Vt(f, t, e, i) {
  const { plot: s } = t;
  let n, r, a, o;
  switch (f) {
    case "top":
      n = s.x, r = s.y, a = s.x + s.width, o = s.y;
      break;
    case "bottom":
      n = s.x, r = s.y + s.height, a = s.x + s.width, o = s.y + s.height;
      break;
    case "left":
      n = s.x, r = s.y, a = s.x, o = s.y + s.height;
      break;
    case "right":
      n = s.x + s.width, r = s.y, a = s.x + s.width, o = s.y + s.height;
      break;
    default:
      return null;
  }
  return i.line(n, r, a, o, {
    stroke: e.axis,
    strokeWidth: 1
  });
}
function Ht(f, t, e, i, s, n, r, a) {
  const o = [], { plot: l } = i, c = f.convert(t.value);
  let d = 0, h = 0, u = 0, g = 0, p = 0, m = 0, x = 0, y = 0;
  const v = e === "top" || e === "bottom", b = e === "left" || e === "right";
  v ? (d = c, h = e === "bottom" ? l.y + l.height : l.y, u = c, g = e === "bottom" ? l.y + l.height + 8 : l.y - 8, p = c, m = l.y, x = c, y = l.y + l.height) : b && (d = e === "left" ? l.x : l.x + l.width, h = c, u = e === "left" ? l.x - 8 : l.x + l.width + 8, g = c, p = l.x, m = c, x = l.x + l.width, y = c);
  const w = 6;
  let S = d, M = h, k = d, E = h;
  e === "bottom" ? (M = h, E = h + w) : e === "top" ? (M = h - w, E = h) : e === "left" ? (S = d - w, k = d) : e === "right" && (S = d, k = d + w);
  const $ = r.line(S, M, k, E, {
    stroke: s.axis,
    strokeWidth: 1
  });
  if (o.push($), a && n.grid !== !1) {
    const L = r.line(p, m, x, y, {
      stroke: n.gridColor ?? s.grid,
      strokeWidth: 1,
      strokeDasharray: n.gridDash ?? [4, 4]
    });
    o.push(L);
  }
  const C = v ? "middle" : e === "left" ? "end" : "start", T = b ? "middle" : e === "bottom" ? "hanging" : "alphabetic", P = r.text(u, g, t.label, {
    fill: s.text,
    fontSize: 11,
    fontFamily: s.fontFamily,
    textAnchor: C,
    dominantBaseline: T
  });
  return o.push(P), o;
}
function qt(f, t, e, i, s) {
  if (!f) return null;
  const { plot: n } = e;
  let r = 0, a = 0, o = 0;
  const l = "middle", c = "middle";
  switch (t) {
    case "bottom":
      r = n.x + n.width / 2, a = n.y + n.height + 35;
      break;
    case "top":
      r = n.x + n.width / 2, a = n.y - 25;
      break;
    case "left":
      r = n.x - 40, a = n.y + n.height / 2, o = -90;
      break;
    case "right":
      r = n.x + n.width + 40, a = n.y + n.height / 2, o = 90;
      break;
  }
  return s.text(r, a, f, {
    fill: i.text,
    fontSize: 12,
    fontFamily: i.fontFamily,
    fontWeight: "500",
    textAnchor: l,
    dominantBaseline: c,
    rotate: o
  });
}
class A {
  scale;
  config;
  elements = [];
  constructor(t, e) {
    this.scale = t, this.config = e;
  }
  render(t) {
    return this.elements = Nt({
      scale: this.scale,
      bounds: t.bounds,
      theme: t.theme,
      config: this.config,
      renderer: t.renderer
    }), this.elements;
  }
  getScale() {
    return this.scale;
  }
  getConfig() {
    return this.config;
  }
  destroy() {
    for (const t of this.elements)
      t.destroy();
    this.elements = [];
  }
}
class Gt extends D {
  lineOptions;
  axisX = null;
  axisY = null;
  seriesElements = /* @__PURE__ */ new Map();
  constructor(t) {
    super(t), this.lineOptions = {
      smooth: t.line?.smooth ?? !0,
      showPoints: t.line?.showPoints ?? !0,
      pointRadius: t.line?.pointRadius ?? 4,
      pointHoverRadius: t.line?.pointHoverRadius ?? 6,
      fill: t.line?.fill ?? !1,
      fillOpacity: t.line?.fillOpacity ?? 0.1,
      strokeWidth: t.line?.strokeWidth ?? 2
    }, this.updateScalesFromData();
  }
  updateScalesFromData() {
    const t = this.options.data;
    if (!t || !t.series) return;
    const e = [];
    for (const a of t.series)
      e.push(...a.data);
    if (e.length === 0) return;
    const i = e.map((a) => {
      const o = a.x;
      return typeof o == "number" ? o : o instanceof Date ? o.getTime() : typeof o == "string" ? new Date(o).getTime() : 0;
    }), s = e.map((a) => a.y ?? 0), n = this.getScale("x"), r = this.getScale("y");
    if (n) {
      const a = Math.min(...i), o = Math.max(...i);
      n.setDomain([a, o]);
    }
    if (r) {
      const a = Math.min(...s), o = Math.max(...s), l = (o - a) * 0.1;
      r.setDomain([a - l, o + l]);
    }
  }
  render() {
    super.render();
    const { renderer: t, bounds: e, theme: i } = this.getRenderContext();
    this.renderAxes(t, e, i), this.renderSeries(t, e, i);
  }
  getRenderContext() {
    return {
      renderer: this.renderer,
      bounds: this.getBounds(),
      theme: this.getTheme()
    };
  }
  renderAxes(t, e, i) {
    const s = this.getScale("x"), n = this.getScale("y");
    s && this.options.axis?.x && (this.axisX = new A(s, this.options.axis.x), this.axisX.render({ bounds: e, theme: i, renderer: t })), n && this.options.axis?.y && (this.axisY = new A(n, this.options.axis.y), this.axisY.render({ bounds: e, theme: i, renderer: t }));
  }
  renderSeries(t, e, i) {
    const s = this.options.data;
    if (!s || !s.series) return;
    const n = this.getScale("x"), r = this.getScale("y");
    if (!n || !r) return;
    const a = i.seriesColors;
    for (let o = 0; o < s.series.length; o++) {
      const l = s.series[o];
      if (!l || !l.visible && l.visible !== void 0 || !l.data || l.data.length === 0) continue;
      const c = l.color ?? a[o % a.length], d = this.transformPoints(l.data, n, r);
      if (d.length === 0) continue;
      const h = this.renderLineSeries(t, d, c, i, o);
      this.seriesElements.set(o, h);
    }
  }
  transformPoints(t, e, i) {
    return t.map((s, n) => ({
      x: e.convert(s.x ?? n),
      y: i.convert(s.y ?? 0),
      original: s
    }));
  }
  renderLineSeries(t, e, i, s, n) {
    const r = [], a = this.lineOptions ?? {}, { smooth: o = !0, showPoints: l = !0, pointRadius: c = 4, fill: d = !1, fillOpacity: h = 0.1, strokeWidth: u = 2 } = a;
    if (e.length < 2) return r;
    const g = o ? this.createSmoothPath(e) : this.createStraightPath(e), p = t.path(g, {
      stroke: i,
      strokeWidth: u,
      fill: "none"
    });
    if (r.push(p), d) {
      const m = this.createFillPath(e, g), x = `fill-gradient-${n}-${Date.now()}`, y = t.createGradient(x, [
        { offset: 0, color: i, opacity: h },
        { offset: 1, color: i, opacity: 0 }
      ]), v = t.path(m, {
        fill: y,
        stroke: "none"
      });
      r.push(v);
    }
    if (l)
      for (const m of e) {
        const x = t.circle(m.x, m.y, c, {
          fill: i,
          stroke: s.background,
          strokeWidth: 2
        });
        r.push(x);
      }
    return r;
  }
  createStraightPath(t) {
    const e = t[0];
    if (!e) return "";
    let i = `M ${e.x} ${e.y}`;
    for (let s = 1; s < t.length; s++) {
      const n = t[s];
      n && (i += ` L ${n.x} ${n.y}`);
    }
    return i;
  }
  createSmoothPath(t) {
    if (t.length < 3) return this.createStraightPath(t);
    const e = t[0];
    if (!e) return "";
    let i = `M ${e.x} ${e.y}`;
    for (let s = 0; s < t.length - 1; s++) {
      const n = t[s > 0 ? s - 1 : s], r = t[s], a = t[s + 1], o = t[s + 2 < t.length ? s + 2 : s + 1];
      if (!n || !r || !a || !o) continue;
      const l = r.x + (a.x - n.x) / 6, c = r.y + (a.y - n.y) / 6, d = a.x - (o.x - r.x) / 6, h = a.y - (o.y - r.y) / 6;
      i += ` C ${l} ${c} ${d} ${h} ${a.x} ${a.y}`;
    }
    return i;
  }
  createFillPath(t, e) {
    const { plot: i } = this.getBounds(), s = i.y + i.height, n = t[0], r = t[t.length - 1];
    return !n || !r ? e : `${e} L ${r.x} ${s} L ${n.x} ${s} Z`;
  }
  destroy() {
    for (const t of this.seriesElements.values())
      for (const e of t)
        e.destroy();
    this.seriesElements.clear(), this.axisX?.destroy(), this.axisY?.destroy(), super.destroy();
  }
}
class jt extends D {
  barOptions;
  axisX = null;
  axisY = null;
  renderedElements = [];
  constructor(t) {
    super(t);
    const e = t.type === "column" ? "vertical" : t.bar?.orientation ?? "vertical";
    this.barOptions = {
      orientation: e,
      mode: t.bar?.mode ?? "grouped",
      borderRadius: t.bar?.borderRadius ?? 4,
      gap: t.bar?.gap ?? 0.2
    }, this.updateScalesFromData();
  }
  updateScalesFromData() {
    const t = this.options.data;
    if (!t || !t.series || t.series.length === 0) return;
    const e = this.barOptions.orientation === "horizontal", i = this.barOptions.mode === "stacked", s = Math.max(...t.series.map((d) => d.data.length), 1);
    let n = 0, r = 0;
    if (i)
      for (let d = 0; d < s; d++) {
        let h = 0, u = 0;
        for (const g of t.series) {
          const p = g.data[d]?.y ?? g.data[d]?.value ?? 0;
          p >= 0 ? h += p : u += p;
        }
        h > r && (r = h), u < n && (n = u);
      }
    else
      for (const d of t.series)
        for (const h of d.data) {
          const u = h.y ?? h.value ?? 0;
          u > r && (r = u), u < n && (n = u);
        }
    r === 0 && n === 0 && (r = 10);
    const a = (r - n) * 0.1 || 1, o = [n < 0 ? n - a : 0, r + a], l = e ? this.getScale("x") : this.getScale("y"), c = e ? this.getScale("y") : this.getScale("x");
    l && l.setDomain(o), c && c.setDomain([0, s]);
  }
  render() {
    super.render();
    const t = this.getBounds(), e = this.getTheme(), i = this.renderer;
    this.renderAxes(i, t, e), this.renderBars(i, t, e);
  }
  renderAxes(t, e, i) {
    const s = this.getScale("x"), n = this.getScale("y");
    s && this.options.axis?.x && (this.axisX = new A(s, this.options.axis.x), this.axisX.render({ bounds: e, theme: i, renderer: t })), n && this.options.axis?.y && (this.axisY = new A(n, this.options.axis.y), this.axisY.render({ bounds: e, theme: i, renderer: t }));
  }
  renderBars(t, e, i) {
    const s = this.options.data;
    if (!s || !s.series || s.series.length === 0) return;
    const n = this.barOptions.orientation === "horizontal", r = this.barOptions.mode === "stacked", a = s.series.filter((m) => m.visible !== !1);
    if (a.length === 0) return;
    const o = Math.max(...a.map((m) => m.data.length), 1), { plot: l } = e, c = n ? l.height / o : l.width / o, d = this.barOptions.gap ?? 0.2, h = c * (1 - d), u = n ? this.getScale("x") : this.getScale("y");
    if (!u) return;
    const g = u.convert(0), p = i.seriesColors;
    if (r)
      for (let m = 0; m < o; m++) {
        let x = g, y = g;
        const v = n ? l.y + m * c + c * d / 2 : l.x + m * c + c * d / 2;
        a.forEach((b, w) => {
          const S = b.data[m]?.y ?? b.data[m]?.value ?? 0, M = b.color ?? p[w % p.length], k = u.convert(S);
          let E = 0, $ = 0, C = 0, T = 0;
          if (n) {
            const P = Math.abs(k - g);
            S >= 0 ? (E = x, C = P, x += P) : (E = y - P, C = P, y -= P), $ = v, T = h;
          } else {
            const P = Math.abs(k - g);
            S >= 0 ? ($ = x - P, T = P, x -= P) : ($ = y, T = P, y += P), E = v, C = h;
          }
          if (C > 0 && T > 0) {
            const P = t.rect(E, $, C, T, {
              fill: M,
              rx: this.barOptions.borderRadius,
              ry: this.barOptions.borderRadius
            });
            this.renderedElements.push(P);
          }
        });
      }
    else {
      const m = h / a.length;
      for (let x = 0; x < o; x++) {
        const y = n ? l.y + x * c + c * d / 2 : l.x + x * c + c * d / 2;
        a.forEach((v, b) => {
          const w = v.data[x]?.y ?? v.data[x]?.value ?? 0, S = v.color ?? p[b % p.length], M = u.convert(w);
          let k = 0, E = 0, $ = 0, C = 0;
          if (n ? (E = y + b * m, C = m - 2, w >= 0 ? (k = g, $ = Math.max(0, M - g)) : (k = M, $ = Math.max(0, g - M))) : (k = y + b * m, $ = m - 2, w >= 0 ? (E = M, C = Math.max(0, g - M)) : (E = g, C = Math.max(0, M - g))), $ > 0 && C > 0) {
            const T = t.rect(k, E, $, C, {
              fill: S,
              rx: this.barOptions.borderRadius,
              ry: this.barOptions.borderRadius
            });
            this.renderedElements.push(T);
          }
        });
      }
    }
  }
  destroy() {
    for (const t of this.renderedElements)
      t.destroy();
    this.renderedElements = [], this.axisX?.destroy(), this.axisY?.destroy(), super.destroy();
  }
}
class Ut extends D {
  areaOptions;
  axisX = null;
  axisY = null;
  renderedElements = [];
  constructor(t) {
    super(t), this.areaOptions = {
      smooth: t.area?.smooth ?? !0,
      fillOpacity: t.area?.fillOpacity ?? 0.25,
      strokeWidth: t.area?.strokeWidth ?? 2,
      showPoints: t.area?.showPoints ?? !1,
      stacked: t.area?.stacked ?? !1
    }, this.updateScalesFromData();
  }
  updateScalesFromData() {
    const t = this.options.data;
    if (!t || !t.series || t.series.length === 0) return;
    const e = [];
    for (const a of t.series)
      e.push(...a.data);
    if (e.length === 0) return;
    const i = e.map((a, o) => typeof a.x == "number" ? a.x : o), s = e.map((a) => a.y ?? 0), n = this.getScale("x"), r = this.getScale("y");
    if (n) {
      const a = Math.min(...i), o = Math.max(...i);
      n.setDomain([a, o]);
    }
    if (r) {
      const a = Math.min(0, Math.min(...s)), o = Math.max(...s), l = (o - a) * 0.1 || 1;
      r.setDomain([a, o + l]);
    }
  }
  render() {
    super.render();
    const t = this.getBounds(), e = this.getTheme(), i = this.renderer;
    this.renderAxes(i, t, e), this.renderAreas(i, t, e);
  }
  renderAxes(t, e, i) {
    const s = this.getScale("x"), n = this.getScale("y");
    s && this.options.axis?.x && (this.axisX = new A(s, this.options.axis.x), this.axisX.render({ bounds: e, theme: i, renderer: t })), n && this.options.axis?.y && (this.axisY = new A(n, this.options.axis.y), this.axisY.render({ bounds: e, theme: i, renderer: t }));
  }
  renderAreas(t, e, i) {
    const s = this.options.data;
    if (!s || !s.series) return;
    const n = this.getScale("x"), r = this.getScale("y");
    if (!n || !r) return;
    const a = i.seriesColors, o = r.convert(0);
    s.series.forEach((l, c) => {
      if (l.visible === !1 || !l.data || l.data.length < 2) return;
      const d = l.color ?? a[c % a.length] ?? "#2563eb", h = l.data.map((w, S) => ({
        x: n.convert(typeof w.x == "number" ? w.x : S),
        y: r.convert(w.y ?? 0)
      })), u = this.areaOptions.smooth ? this.createSmoothPath(h) : this.createStraightPath(h), g = h[0], p = h[h.length - 1];
      if (!g || !p) return;
      const m = `${u} L ${p.x} ${o} L ${g.x} ${o} Z`, x = `area-gradient-${c}-${Date.now()}`, y = t.createGradient(
        x,
        [
          { offset: 0, color: d, opacity: this.areaOptions.fillOpacity ?? 0.3 },
          { offset: 1, color: d, opacity: 0.02 }
        ],
        "0%",
        "0%",
        "0%",
        "100%"
      ), v = t.path(m, { fill: y, stroke: "none" });
      this.renderedElements.push(v);
      const b = t.path(u, {
        stroke: d,
        strokeWidth: this.areaOptions.strokeWidth ?? 2,
        fill: "none"
      });
      this.renderedElements.push(b), this.areaOptions.showPoints && h.forEach((w) => {
        const S = t.circle(w.x, w.y, 3.5, { fill: d, stroke: i.background, strokeWidth: 1.5 });
        this.renderedElements.push(S);
      });
    });
  }
  createStraightPath(t) {
    const e = t[0];
    if (!e) return "";
    let i = `M ${e.x} ${e.y}`;
    for (let s = 1; s < t.length; s++) {
      const n = t[s];
      n && (i += ` L ${n.x} ${n.y}`);
    }
    return i;
  }
  createSmoothPath(t) {
    if (t.length < 3) return this.createStraightPath(t);
    const e = t[0];
    if (!e) return "";
    let i = `M ${e.x} ${e.y}`;
    for (let s = 0; s < t.length - 1; s++) {
      const n = t[s > 0 ? s - 1 : s], r = t[s], a = t[s + 1], o = t[s + 2 < t.length ? s + 2 : s + 1];
      if (!n || !r || !a || !o) continue;
      const l = r.x + (a.x - n.x) / 6, c = r.y + (a.y - n.y) / 6, d = a.x - (o.x - r.x) / 6, h = a.y - (o.y - r.y) / 6;
      i += ` C ${l} ${c} ${d} ${h} ${a.x} ${a.y}`;
    }
    return i;
  }
  destroy() {
    for (const t of this.renderedElements)
      t.destroy();
    this.renderedElements = [], this.axisX?.destroy(), this.axisY?.destroy(), super.destroy();
  }
}
function R(f, t, e, i) {
  return {
    x: f + e * Math.cos(i),
    y: t + e * Math.sin(i)
  };
}
function U(f) {
  const { cx: t, cy: e, innerRadius: i, outerRadius: s, startAngle: n, endAngle: r } = f;
  if (!Number.isFinite(t) || !Number.isFinite(e) || !Number.isFinite(s) || s <= 0 || r - n <= 1e-3) return "";
  if (Math.abs(r - n) >= Math.PI * 1.9999)
    return i <= 0 ? `M ${t - s} ${e} A ${s} ${s} 0 1 0 ${t + s} ${e} A ${s} ${s} 0 1 0 ${t - s} ${e} Z` : [
      `M ${t - s} ${e}`,
      `A ${s} ${s} 0 1 0 ${t + s} ${e}`,
      `A ${s} ${s} 0 1 0 ${t - s} ${e}`,
      `M ${t - i} ${e}`,
      `A ${i} ${i} 0 1 1 ${t + i} ${e}`,
      `A ${i} ${i} 0 1 1 ${t - i} ${e}`,
      "Z"
    ].join(" ");
  const o = r - n > Math.PI ? 1 : 0, l = R(t, e, s, n), c = R(t, e, s, r);
  if (i <= 0)
    return [
      `M ${t} ${e}`,
      `L ${l.x} ${l.y}`,
      `A ${s} ${s} 0 ${o} 1 ${c.x} ${c.y}`,
      "Z"
    ].join(" ");
  const d = R(t, e, i, r), h = R(t, e, i, n);
  return [
    `M ${l.x} ${l.y}`,
    `A ${s} ${s} 0 ${o} 1 ${c.x} ${c.y}`,
    `L ${d.x} ${d.y}`,
    `A ${i} ${i} 0 ${o} 0 ${h.x} ${h.y}`,
    "Z"
  ].join(" ");
}
function nt(f) {
  if (f.length === 0)
    return { min: 0, q1: 0, median: 0, q3: 0, max: 0, outliers: [] };
  const t = [...f].filter((u) => typeof u == "number" && !isNaN(u)).sort((u, g) => u - g);
  if (t.length === 0)
    return { min: 0, q1: 0, median: 0, q3: 0, max: 0, outliers: [] };
  const e = (u) => {
    const g = (t.length - 1) * u, p = Math.floor(g), m = Math.ceil(g), x = g - p, y = t[p] ?? 0, v = t[m] ?? 0;
    return y + (v - y) * x;
  }, i = e(0.25), s = e(0.5), n = e(0.75), r = n - i, a = i - 1.5 * r, o = n + 1.5 * r, l = t.filter((u) => u >= a && u <= o), c = t.filter((u) => u < a || u > o), d = l.length > 0 ? l[0] ?? t[0] ?? 0 : t[0] ?? 0, h = l.length > 0 ? l[l.length - 1] ?? t[t.length - 1] ?? 0 : t[t.length - 1] ?? 0;
  return { min: d, q1: i, median: s, q3: n, max: h, outliers: c };
}
class gt extends D {
  innerRadiusRatio = 0;
  padAngle = 0.02;
  showLabels = !0;
  renderedElements = [];
  constructor(t) {
    super(t), t.pie && (t.pie.innerRadiusRatio !== void 0 && (this.innerRadiusRatio = t.pie.innerRadiusRatio), t.pie.padAngle !== void 0 && (this.padAngle = t.pie.padAngle), t.pie.showLabels !== void 0 && (this.showLabels = t.pie.showLabels));
  }
  render() {
    super.render();
    const t = this.getBounds(), e = this.getTheme(), i = this.renderer;
    this.renderSlices(i, t.plot, e);
  }
  renderSlices(t, e, i) {
    const s = this.options.data, r = s.series?.[0]?.data ?? s.data ?? [];
    if (r.length === 0) return;
    const a = r.reduce((g, p) => g + Math.max(0, p.y ?? p.value ?? 0), 0);
    if (a <= 0) return;
    const o = e.x + e.width / 2, l = e.y + e.height / 2, c = Math.min(e.width, e.height) / 2 * 0.85, d = c * this.innerRadiusRatio;
    let h = -Math.PI / 2;
    const u = i.seriesColors;
    r.forEach((g, p) => {
      const m = Math.max(0, g.y ?? g.value ?? 0), x = m / a * Math.PI * 2, y = h + x;
      if (x > 1e-3) {
        const v = U({
          cx: o,
          cy: l,
          innerRadius: d,
          outerRadius: c,
          startAngle: h + this.padAngle / 2,
          endAngle: y - this.padAngle / 2
        }), b = g.color ?? u[p % u.length] ?? "#2563eb", w = t.path(v, {
          fill: b,
          stroke: i.background,
          strokeWidth: 2
        });
        if (this.renderedElements.push(w), this.showLabels && x > 0.15) {
          const S = h + x / 2, M = c * 0.7, k = R(o, l, M, S), E = `${(m / a * 100).toFixed(1)}%`, $ = t.text(k.x, k.y, E, {
            fill: "#ffffff",
            fontSize: 11,
            fontWeight: "bold",
            textAnchor: "middle",
            dominantBaseline: "middle"
          });
          this.renderedElements.push($);
        }
      }
      h = y;
    });
  }
  destroy() {
    for (const t of this.renderedElements)
      t.destroy();
    this.renderedElements = [], super.destroy();
  }
}
class Zt extends gt {
  centerText;
  centerSubtext;
  constructor(t) {
    const e = {
      ...t,
      type: "pie",
      pie: {
        innerRadiusRatio: t.donut?.innerRadiusRatio ?? 0.6,
        padAngle: t.donut?.padAngle ?? 0.03,
        showLabels: t.donut?.showLabels ?? !0
      }
    };
    super(e), this.innerRadiusRatio = t.donut?.innerRadiusRatio ?? 0.6, this.centerText = t.donut?.centerText, this.centerSubtext = t.donut?.centerSubtext;
  }
  render() {
    if (super.render(), this.centerText || this.centerSubtext) {
      const t = this.getBounds(), e = this.getTheme(), i = this.renderer, s = t.plot.x + t.plot.width / 2, n = t.plot.y + t.plot.height / 2;
      this.centerText && i.text(s, this.centerSubtext ? n - 6 : n, this.centerText, {
        fill: e.text,
        fontSize: 18,
        fontWeight: "bold",
        textAnchor: "middle",
        dominantBaseline: "middle"
      }), this.centerSubtext && i.text(s, n + 14, this.centerSubtext, {
        fill: "#6b7280",
        fontSize: 12,
        textAnchor: "middle",
        dominantBaseline: "middle"
      });
    }
  }
}
class _t extends D {
  radarOptions;
  renderedElements = [];
  constructor(t) {
    super(t), this.radarOptions = {
      levels: t.radar?.levels ?? 4,
      showPoints: t.radar?.showPoints ?? !0,
      fillOpacity: t.radar?.fillOpacity ?? 0.25
    };
  }
  render() {
    super.render();
    const t = this.getBounds(), e = this.getTheme(), i = this.renderer, { plot: s } = t, r = this.options.data.series ?? [];
    if (r.length === 0) return;
    const a = r[0];
    if (!a || a.data.length < 3) return;
    const o = a.data.length, l = s.x + s.width / 2, c = s.y + s.height / 2, d = Math.min(s.width, s.height) / 2 * 0.8;
    let h = 0;
    r.forEach((m) => {
      m.data.forEach((x) => {
        const y = x.y ?? x.value ?? 0;
        y > h && (h = y);
      });
    }), h <= 0 && (h = 100);
    const u = Math.PI * 2 / o, g = this.radarOptions.levels ?? 4;
    for (let m = 1; m <= g; m++) {
      const x = d * m / g;
      let y = "";
      for (let b = 0; b < o; b++) {
        const w = -Math.PI / 2 + b * u, S = R(l, c, x, w);
        y += b === 0 ? `M ${S.x} ${S.y}` : ` L ${S.x} ${S.y}`;
      }
      y += " Z";
      const v = i.path(y, {
        stroke: e.grid,
        strokeWidth: 1,
        fill: "none"
      });
      this.renderedElements.push(v);
    }
    for (let m = 0; m < o; m++) {
      const x = -Math.PI / 2 + m * u, y = R(l, c, d, x), v = i.line(l, c, y.x, y.y, {
        stroke: e.axis,
        strokeWidth: 1
      });
      this.renderedElements.push(v);
      const b = R(l, c, d + 16, x), w = a.data[m]?.category || a.data[m]?.x || `Axis ${m + 1}`, S = i.text(b.x, b.y, w, {
        fill: e.text,
        fontSize: 11,
        textAnchor: "middle",
        dominantBaseline: "middle"
      });
      this.renderedElements.push(S);
    }
    const p = e.seriesColors;
    r.forEach((m, x) => {
      if (m.visible === !1) return;
      const y = m.color ?? p[x % p.length] ?? "#2563eb";
      let v = "";
      const b = [];
      for (let M = 0; M < o; M++) {
        const k = -Math.PI / 2 + M * u, E = m.data[M]?.y ?? m.data[M]?.value ?? 0, $ = Math.max(0, E) / h * d, C = R(l, c, $, k);
        b.push(C), v += M === 0 ? `M ${C.x} ${C.y}` : ` L ${C.x} ${C.y}`;
      }
      v += " Z";
      const w = i.path(v, {
        fill: y,
        stroke: y,
        strokeWidth: 2,
        opacity: this.radarOptions.fillOpacity ?? 0.25
      });
      this.renderedElements.push(w);
      const S = i.path(v, {
        fill: "none",
        stroke: y,
        strokeWidth: 2
      });
      this.renderedElements.push(S), this.radarOptions.showPoints && b.forEach((M) => {
        const k = i.circle(M.x, M.y, 3.5, {
          fill: y,
          stroke: e.background,
          strokeWidth: 1.5
        });
        this.renderedElements.push(k);
      });
    });
  }
  destroy() {
    for (const t of this.renderedElements)
      t.destroy();
    this.renderedElements = [], super.destroy();
  }
}
class Qt extends D {
  renderedElements = [];
  constructor(t) {
    super(t);
  }
  render() {
    super.render();
    const t = this.getBounds(), e = this.getTheme(), i = this.renderer, { plot: s } = t, n = this.options.data, a = n.series?.[0]?.data ?? n.data ?? [];
    if (a.length === 0) return;
    const o = s.x + s.width / 2, l = s.y + s.height / 2, c = Math.min(s.width, s.height) / 2 * 0.85;
    let d = 0;
    a.forEach((m) => {
      const x = m.y ?? m.value ?? 0;
      x > d && (d = x);
    }), d <= 0 && (d = 100);
    const h = 4;
    for (let m = 1; m <= h; m++) {
      const x = c * m / h, y = i.circle(o, l, x, {
        fill: "none",
        stroke: e.grid,
        strokeWidth: 1
      });
      this.renderedElements.push(y);
    }
    const u = a.length, g = Math.PI * 2 / u, p = e.seriesColors;
    a.forEach((m, x) => {
      const v = Math.max(0, m.y ?? m.value ?? 0) / d * c, b = -Math.PI / 2 + x * g, w = b + g, S = U({
        cx: o,
        cy: l,
        innerRadius: 0,
        outerRadius: v,
        startAngle: b + 0.02,
        endAngle: w - 0.02
      }), M = m.color ?? p[x % p.length] ?? "#2563eb", k = i.path(S, {
        fill: M,
        stroke: e.background,
        strokeWidth: 1.5,
        opacity: 0.85
      });
      this.renderedElements.push(k);
    });
  }
  destroy() {
    for (const t of this.renderedElements)
      t.destroy();
    this.renderedElements = [], super.destroy();
  }
}
class Jt extends D {
  axisX = null;
  axisY = null;
  renderedElements = [];
  constructor(t) {
    super(t), this.updateScalesFromData();
  }
  updateScalesFromData() {
    const t = this.options.data;
    if (!t?.series || t.series.length === 0) return;
    let e = 1 / 0, i = -1 / 0, s = 1 / 0, n = -1 / 0;
    for (const c of t.series)
      for (const d of c.data) {
        const h = typeof d.x == "number" ? d.x : 0, u = d.y ?? 0;
        h < e && (e = h), h > i && (i = h), u < s && (s = u), u > n && (n = u);
      }
    e === 1 / 0 && (e = 0, i = 10, s = 0, n = 10);
    const r = (i - e) * 0.08 || 1, a = (n - s) * 0.08 || 1, o = this.getScale("x"), l = this.getScale("y");
    o && o.setDomain([e - r, i + r]), l && l.setDomain([s - a, n + a]);
  }
  render() {
    super.render();
    const t = this.getBounds(), e = this.getTheme(), i = this.renderer, s = this.getScale("x"), n = this.getScale("y");
    if (s && this.options.axis?.x && (this.axisX = new A(s, this.options.axis.x), this.axisX.render({ bounds: t, theme: e, renderer: i })), n && this.options.axis?.y && (this.axisY = new A(n, this.options.axis.y), this.axisY.render({ bounds: t, theme: e, renderer: i })), !s || !n) return;
    const r = this.options.data.series ?? [], a = e.seriesColors, o = 5;
    r.forEach((l, c) => {
      if (l.visible === !1) return;
      const d = l.color ?? a[c % a.length] ?? "#2563eb";
      for (const h of l.data) {
        const u = typeof h.x == "number" ? h.x : 0, g = h.y ?? 0, p = s.convert(u), m = n.convert(g), x = i.circle(p, m, o, {
          fill: d,
          stroke: e.background,
          strokeWidth: 1.5,
          opacity: 0.8
        });
        this.renderedElements.push(x);
      }
    });
  }
  destroy() {
    for (const t of this.renderedElements)
      t.destroy();
    this.renderedElements = [], this.axisX?.destroy(), this.axisY?.destroy(), super.destroy();
  }
}
class Kt extends D {
  axisX = null;
  axisY = null;
  renderedElements = [];
  constructor(t) {
    super(t), this.updateScalesFromData();
  }
  updateScalesFromData() {
    const t = this.options.data;
    if (!t?.series || t.series.length === 0) return;
    let e = 1 / 0, i = -1 / 0, s = 1 / 0, n = -1 / 0;
    for (const c of t.series)
      for (const d of c.data) {
        const h = typeof d.x == "number" ? d.x : 0, u = d.y ?? 0;
        h < e && (e = h), h > i && (i = h), u < s && (s = u), u > n && (n = u);
      }
    e === 1 / 0 && (e = 0, i = 100, s = 0, n = 100);
    const r = (i - e) * 0.1 || 1, a = (n - s) * 0.1 || 1, o = this.getScale("x"), l = this.getScale("y");
    o && o.setDomain([e - r, i + r]), l && l.setDomain([s - a, n + a]);
  }
  render() {
    super.render();
    const t = this.getBounds(), e = this.getTheme(), i = this.renderer, s = this.getScale("x"), n = this.getScale("y");
    if (s && this.options.axis?.x && (this.axisX = new A(s, this.options.axis.x), this.axisX.render({ bounds: t, theme: e, renderer: i })), n && this.options.axis?.y && (this.axisY = new A(n, this.options.axis.y), this.axisY.render({ bounds: t, theme: e, renderer: i })), !s || !n) return;
    const r = this.options.data.series ?? [], a = e.seriesColors, o = 4, l = 24;
    let c = 1 / 0, d = -1 / 0;
    r.forEach((h) => {
      h.data.forEach((u) => {
        const g = u.size ?? u.value ?? 10;
        g < c && (c = g), g > d && (d = g);
      });
    }), c === 1 / 0 && (c = 1, d = 10), r.forEach((h, u) => {
      if (h.visible === !1) return;
      const g = h.color ?? a[u % a.length] ?? "#2563eb";
      for (const p of h.data) {
        const m = typeof p.x == "number" ? p.x : 0, x = p.y ?? 0, y = p.size ?? p.value ?? 10, v = d === c ? 0.5 : (y - c) / (d - c), b = o + v * (l - o), w = s.convert(m), S = n.convert(x), M = i.circle(w, S, b, {
          fill: g,
          stroke: e.background,
          strokeWidth: 1.5,
          opacity: 0.65
        });
        this.renderedElements.push(M);
      }
    });
  }
  destroy() {
    for (const t of this.renderedElements)
      t.destroy();
    this.renderedElements = [], this.axisX?.destroy(), this.axisY?.destroy(), super.destroy();
  }
}
class te extends D {
  binCount = 10;
  axisX = null;
  axisY = null;
  renderedElements = [];
  constructor(t) {
    super(t), t.histogram?.binCount && (this.binCount = t.histogram.binCount), this.updateScalesFromData();
  }
  computeBins() {
    const e = this.options.data.series?.[0];
    if (!e || e.data.length === 0) return [];
    const i = [];
    for (const l of e.data) {
      const c = l.y ?? l.value ?? (typeof l.x == "number" ? l.x : 0);
      i.push(c);
    }
    const s = Math.min(...i), a = (Math.max(...i) - s || 1) / this.binCount, o = Array.from({ length: this.binCount }, (l, c) => ({
      x0: s + c * a,
      x1: s + (c + 1) * a,
      count: 0
    }));
    for (const l of i) {
      const c = Math.min(this.binCount - 1, Math.floor((l - s) / a)), d = o[c];
      d && d.count++;
    }
    return o;
  }
  updateScalesFromData() {
    const t = this.computeBins();
    if (t.length === 0) return;
    const e = t[0], i = t[t.length - 1];
    if (!e || !i) return;
    const s = e.x0, n = i.x1, r = Math.max(...t.map((l) => l.count)), a = this.getScale("x"), o = this.getScale("y");
    a && a.setDomain([s, n]), o && o.setDomain([0, r * 1.1 || 1]);
  }
  render() {
    super.render();
    const t = this.getBounds(), e = this.getTheme(), i = this.renderer, s = this.getScale("x"), n = this.getScale("y");
    if (s && this.options.axis?.x && (this.axisX = new A(s, this.options.axis.x), this.axisX.render({ bounds: t, theme: e, renderer: i })), n && this.options.axis?.y && (this.axisY = new A(n, this.options.axis.y), this.axisY.render({ bounds: t, theme: e, renderer: i })), !s || !n) return;
    const r = this.computeBins(), a = n.convert(0), o = this.options.data.series?.[0]?.color ?? e.seriesColors[0] ?? "#2563eb";
    r.forEach((l) => {
      const c = s.convert(l.x0), d = s.convert(l.x1), h = n.convert(l.count), u = Math.max(1, d - c - 1), g = Math.max(0, a - h), p = i.rect(c, h, u, g, {
        fill: o,
        rx: 2,
        ry: 2
      });
      this.renderedElements.push(p);
    });
  }
  destroy() {
    for (const t of this.renderedElements)
      t.destroy();
    this.renderedElements = [], this.axisX?.destroy(), this.axisY?.destroy(), super.destroy();
  }
}
class ee extends D {
  renderedElements = [];
  constructor(t) {
    super(t);
  }
  interpolateColor(t, e, i) {
    const s = (d) => {
      const h = d.replace("#", "");
      return {
        r: parseInt(h.substring(0, 2), 16) || 0,
        g: parseInt(h.substring(2, 4), 16) || 0,
        b: parseInt(h.substring(4, 6), 16) || 0
      };
    }, n = s(t), r = s(e), a = Math.round(n.r + i * (r.r - n.r)), o = Math.round(n.g + i * (r.g - n.g)), l = Math.round(n.b + i * (r.b - n.b)), c = (d) => d.toString(16).padStart(2, "0");
    return `#${c(a)}${c(o)}${c(l)}`;
  }
  render() {
    super.render();
    const t = this.getBounds(), e = this.getTheme(), i = this.renderer, { plot: s } = t, n = this.options.data, a = n.series?.[0]?.data ?? n.data ?? [];
    if (a.length === 0) return;
    const o = Array.from(new Set(a.map((m) => String(m.x)))), l = Array.from(new Set(a.map((m) => String(m.y))));
    let c = 1 / 0, d = -1 / 0;
    a.forEach((m) => {
      m.value < c && (c = m.value), m.value > d && (d = m.value);
    }), c === 1 / 0 && (c = 0, d = 100), c === d && (d = c + 1);
    const h = s.width / o.length, u = s.height / l.length;
    o.forEach((m, x) => {
      i.text(s.x + x * h + h / 2, s.y + s.height + 15, m, {
        fill: e.text,
        fontSize: 11,
        textAnchor: "middle",
        dominantBaseline: "hanging"
      });
    }), l.forEach((m, x) => {
      i.text(s.x - 10, s.y + x * u + u / 2, m, {
        fill: e.text,
        fontSize: 11,
        textAnchor: "end",
        dominantBaseline: "middle"
      });
    });
    const g = "#e0f2fe", p = "#1d4ed8";
    a.forEach((m) => {
      const x = o.indexOf(String(m.x)), y = l.indexOf(String(m.y));
      if (x === -1 || y === -1) return;
      const v = Math.max(0, Math.min(1, (m.value - c) / (d - c))), b = this.interpolateColor(g, p, v), w = s.x + x * h + 1, S = s.y + y * u + 1, M = Math.max(0, h - 2), k = Math.max(0, u - 2), E = i.rect(w, S, M, k, { fill: b, rx: 3, ry: 3 });
      this.renderedElements.push(E);
      const $ = i.text(w + M / 2, S + k / 2, String(Math.round(m.value)), {
        fill: v > 0.5 ? "#ffffff" : "#1e293b",
        fontSize: 11,
        fontWeight: "bold",
        textAnchor: "middle",
        dominantBaseline: "middle"
      });
      this.renderedElements.push($);
    });
  }
  destroy() {
    for (const t of this.renderedElements)
      t.destroy();
    this.renderedElements = [], super.destroy();
  }
}
class se extends D {
  min = 0;
  max = 100;
  unit = "%";
  renderedElements = [];
  constructor(t) {
    super(t), t.gauge?.min !== void 0 && (this.min = t.gauge.min), t.gauge?.max !== void 0 && (this.max = t.gauge.max), t.gauge?.unit !== void 0 && (this.unit = t.gauge.unit);
  }
  render() {
    super.render();
    const t = this.getBounds(), e = this.getTheme(), i = this.renderer, { plot: s } = t, n = this.options.data.series?.[0]?.data?.[0]?.value ?? this.options.data.series?.[0]?.data?.[0]?.y ?? 65, r = Math.max(this.min, Math.min(this.max, n)), a = (r - this.min) / (this.max - this.min || 1), o = s.x + s.width / 2, l = s.y + s.height * 0.65, c = Math.min(s.width, s.height * 1.3) / 2 * 0.85, d = c * 0.72, h = Math.PI * 0.8, u = Math.PI * 2.2, g = u - h, p = U({
      cx: o,
      cy: l,
      innerRadius: d,
      outerRadius: c,
      startAngle: h,
      endAngle: u
    }), m = i.path(p, { fill: e.grid, opacity: 0.5 });
    this.renderedElements.push(m);
    const x = h + a * g;
    if (a > 1e-3) {
      const E = U({
        cx: o,
        cy: l,
        innerRadius: d,
        outerRadius: c,
        startAngle: h,
        endAngle: x
      }), $ = a < 0.5 ? "#10b981" : a < 0.8 ? "#f59e0b" : "#ef4444", C = i.path(E, { fill: $ });
      this.renderedElements.push(C);
    }
    const y = R(o, l, d - 8, x), v = R(o, l, 10, x - Math.PI / 2), b = R(o, l, 10, x + Math.PI / 2), w = `M ${v.x} ${v.y} L ${y.x} ${y.y} L ${b.x} ${b.y} Z`, S = i.path(w, { fill: e.text });
    this.renderedElements.push(S);
    const M = i.circle(o, l, 6, { fill: e.text });
    this.renderedElements.push(M);
    const k = i.text(o, l + 28, `${Y(r)}${this.unit}`, {
      fill: e.text,
      fontSize: 22,
      fontWeight: "bold",
      textAnchor: "middle",
      dominantBaseline: "middle"
    });
    this.renderedElements.push(k);
  }
  destroy() {
    for (const t of this.renderedElements)
      t.destroy();
    this.renderedElements = [], super.destroy();
  }
}
class ie extends D {
  renderedElements = [];
  constructor(t) {
    super(t);
  }
  render() {
    super.render();
    const t = this.getBounds(), e = this.getTheme(), i = this.renderer, { plot: s } = t, n = this.options.data, a = n.series?.[0]?.data ?? n.data ?? [];
    if (a.length === 0) return;
    const o = Math.max(...a.map((m) => m.value ?? m.y ?? 0), 1), l = a.length, c = 4, d = (s.height - (l - 1) * c) / l, h = e.seriesColors, u = s.x + s.width / 2, g = s.width * 0.42, p = g * 0.2;
    a.forEach((m, x) => {
      const y = m.value ?? m.y ?? 0, v = x < l - 1 ? a[x + 1]?.value ?? a[x + 1]?.y ?? y * 0.7 : y * 0.8, b = y / o, w = v / o, S = p + (g - p) * b, M = p + (g - p) * w, k = s.y + x * (d + c), E = k + d, $ = `M ${u - S} ${k} L ${u + S} ${k} L ${u + M} ${E} L ${u - M} ${E} Z`, C = m.color ?? h[x % h.length] ?? "#2563eb", T = i.path($, { fill: C, opacity: 0.9 });
      this.renderedElements.push(T);
      const P = m.category || m.x || `Stage ${x + 1}`, L = k + d / 2, N = i.text(u, L, `${P}: ${Y(y)}`, {
        fill: "#ffffff",
        fontSize: 12,
        fontWeight: "bold",
        textAnchor: "middle",
        dominantBaseline: "middle"
      });
      this.renderedElements.push(N);
    });
  }
  destroy() {
    for (const t of this.renderedElements)
      t.destroy();
    this.renderedElements = [], super.destroy();
  }
}
class ne extends D {
  axisX = null;
  axisY = null;
  renderedElements = [];
  constructor(t) {
    super(t), this.updateScalesFromData();
  }
  updateScalesFromData() {
    const e = this.options.data.series ?? [];
    if (e.length === 0) return;
    let i = 1 / 0, s = -1 / 0;
    e.forEach((l) => {
      l.data.forEach((c) => {
        const d = Array.isArray(c.values) ? c.values : typeof c.y == "number" ? [c.y] : [];
        if (d.length > 0) {
          const h = nt(d);
          h.min < i && (i = h.min), h.max > s && (s = h.max);
          for (const u of h.outliers)
            u < i && (i = u), u > s && (s = u);
        } else typeof c.min == "number" && typeof c.max == "number" && (c.min < i && (i = c.min), c.max > s && (s = c.max));
      });
    }), i === 1 / 0 && (i = 0, s = 100);
    const n = (s - i) * 0.1 || 1, r = Math.max(...e.map((l) => l.data.length), 1), a = this.getScale("x"), o = this.getScale("y");
    a && a.setDomain([0, r]), o && o.setDomain([i - n, s + n]);
  }
  render() {
    super.render();
    const t = this.getBounds(), e = this.getTheme(), i = this.renderer, s = this.getScale("x"), n = this.getScale("y");
    if (s && this.options.axis?.x && (this.axisX = new A(s, this.options.axis.x), this.axisX.render({ bounds: t, theme: e, renderer: i })), n && this.options.axis?.y && (this.axisY = new A(n, this.options.axis.y), this.axisY.render({ bounds: t, theme: e, renderer: i })), !s || !n) return;
    const { plot: r } = t, a = this.options.data.series?.[0];
    if (!a || a.data.length === 0) return;
    const o = a.data.length, l = r.width / o, c = l * 0.5, d = a.color ?? e.seriesColors[0] ?? "#2563eb";
    a.data.forEach((h, u) => {
      let g;
      if (typeof h.min == "number" && typeof h.max == "number") {
        const P = h.min, L = h.max, N = typeof h.q1 == "number" ? h.q1 : P, V = typeof h.q3 == "number" ? h.q3 : L, _ = typeof h.median == "number" ? h.median : (P + L) / 2;
        g = { min: P, q1: N, median: _, q3: V, max: L, outliers: [] };
      } else {
        const P = Array.isArray(h.values) ? h.values : [10, 25, 50, 75, 90];
        g = nt(P);
      }
      const p = r.x + u * l + l / 2, m = n.convert(g.min), x = n.convert(g.q1), y = n.convert(g.median), v = n.convert(g.q3), b = n.convert(g.max), w = i.line(p, v, p, b, { stroke: d, strokeWidth: 1.5 }), S = i.line(p, x, p, m, { stroke: d, strokeWidth: 1.5 });
      this.renderedElements.push(w, S);
      const M = i.line(p - c * 0.25, b, p + c * 0.25, b, { stroke: d, strokeWidth: 1.5 }), k = i.line(p - c * 0.25, m, p + c * 0.25, m, { stroke: d, strokeWidth: 1.5 });
      this.renderedElements.push(M, k);
      const E = Math.max(1, Math.abs(x - v)), $ = Math.min(x, v), C = i.rect(p - c / 2, $, c, E, {
        fill: d,
        opacity: 0.35,
        stroke: d,
        strokeWidth: 1.5,
        rx: 2,
        ry: 2
      });
      this.renderedElements.push(C);
      const T = i.line(p - c / 2, y, p + c / 2, y, {
        stroke: d,
        strokeWidth: 2
      });
      this.renderedElements.push(T), g.outliers.forEach((P) => {
        const L = n.convert(P), N = i.circle(p, L, 3, { fill: "#ef4444" });
        this.renderedElements.push(N);
      });
    });
  }
  destroy() {
    for (const t of this.renderedElements)
      t.destroy();
    this.renderedElements = [], this.axisX?.destroy(), this.axisY?.destroy(), super.destroy();
  }
}
class re extends D {
  upColor = "#10b981";
  downColor = "#ef4444";
  wickWidth = 1;
  candleWidthRatio = 0.7;
  axisX = null;
  axisY = null;
  renderedElements = [];
  constructor(t) {
    super(t), t.candlestick && (t.candlestick.upColor && (this.upColor = t.candlestick.upColor), t.candlestick.downColor && (this.downColor = t.candlestick.downColor), t.candlestick.wickWidth && (this.wickWidth = t.candlestick.wickWidth), t.candlestick.candleWidthRatio && (this.candleWidthRatio = t.candlestick.candleWidthRatio)), this.updateScalesFromData();
  }
  updateScalesFromData() {
    const t = this.options.data, i = t.series?.[0]?.data ?? t.data ?? [];
    if (i.length === 0) return;
    let s = 1 / 0, n = -1 / 0;
    const r = [];
    i.forEach((c, d) => {
      const h = c.open ?? c.y ?? 0, u = c.high ?? Math.max(h, c.close ?? h), g = c.low ?? Math.min(h, c.close ?? h), p = c.time !== void 0 ? B(c.time) : typeof c.x == "number" ? c.x : d;
      r.push(p), g < s && (s = g), u > n && (n = u);
    }), s === 1 / 0 && (s = 100, n = 110);
    const a = (n - s) * 0.05 || 1, o = this.getScale("x"), l = this.getScale("y");
    if (o) {
      const c = Math.min(...r), d = Math.max(...r), u = (d - c || 1) * 0.02;
      o.setDomain([c - u, d + u]);
    }
    l && l.setDomain([s - a, n + a]);
  }
  render() {
    super.render();
    const t = this.getBounds(), e = this.getTheme(), i = this.renderer, s = this.getScale("x"), n = this.getScale("y");
    if (s && this.options.axis?.x && (this.axisX = new A(s, this.options.axis.x), this.axisX.render({ bounds: t, theme: e, renderer: i })), n && this.options.axis?.y && (this.axisY = new A(n, this.options.axis.y), this.axisY.render({ bounds: t, theme: e, renderer: i })), !s || !n) return;
    const r = this.options.data, o = r.series?.[0]?.data ?? r.data ?? [];
    if (o.length === 0) return;
    const l = o.length, c = t.plot.width / l, d = Math.max(2, c * this.candleWidthRatio);
    o.forEach((h, u) => {
      const g = h.open ?? h.y ?? 0, p = h.high ?? Math.max(g, h.close ?? g), m = h.low ?? Math.min(g, h.close ?? g), x = h.close ?? g, y = h.time !== void 0 ? B(h.time) : typeof h.x == "number" ? h.x : u, v = s.convert(y), b = n.convert(g), w = n.convert(p), S = n.convert(m), M = n.convert(x), E = x >= g ? this.upColor : this.downColor, $ = i.line(v, w, v, S, {
        stroke: E,
        strokeWidth: this.wickWidth
      });
      this.renderedElements.push($);
      const C = Math.min(b, M), T = Math.max(1, Math.abs(b - M)), P = i.rect(v - d / 2, C, d, T, {
        fill: E,
        stroke: E,
        strokeWidth: 1
      });
      this.renderedElements.push(P);
    });
  }
  destroy() {
    for (const t of this.renderedElements)
      t.destroy();
    this.renderedElements = [], this.axisX?.destroy(), this.axisY?.destroy(), super.destroy();
  }
}
class oe extends D {
  upColor = "#10b981";
  downColor = "#ef4444";
  axisX = null;
  axisY = null;
  renderedElements = [];
  constructor(t) {
    super(t), t.ohlc && (t.ohlc.upColor && (this.upColor = t.ohlc.upColor), t.ohlc.downColor && (this.downColor = t.ohlc.downColor)), this.updateScalesFromData();
  }
  updateScalesFromData() {
    const t = this.options.data, i = t.series?.[0]?.data ?? t.data ?? [];
    if (i.length === 0) return;
    let s = 1 / 0, n = -1 / 0;
    const r = [];
    i.forEach((c, d) => {
      const h = c.open ?? c.y ?? 0, u = c.high ?? Math.max(h, c.close ?? h), g = c.low ?? Math.min(h, c.close ?? h), p = c.time !== void 0 ? B(c.time) : typeof c.x == "number" ? c.x : d;
      r.push(p), g < s && (s = g), u > n && (n = u);
    }), s === 1 / 0 && (s = 100, n = 110);
    const a = (n - s) * 0.05 || 1, o = this.getScale("x"), l = this.getScale("y");
    if (o) {
      const c = Math.min(...r), d = Math.max(...r), h = d - c || 1;
      o.setDomain([c - h * 0.02, d + h * 0.02]);
    }
    l && l.setDomain([s - a, n + a]);
  }
  render() {
    super.render();
    const t = this.getBounds(), e = this.getTheme(), i = this.renderer, s = this.getScale("x"), n = this.getScale("y");
    if (s && this.options.axis?.x && (this.axisX = new A(s, this.options.axis.x), this.axisX.render({ bounds: t, theme: e, renderer: i })), n && this.options.axis?.y && (this.axisY = new A(n, this.options.axis.y), this.axisY.render({ bounds: t, theme: e, renderer: i })), !s || !n) return;
    const r = this.options.data, o = r.series?.[0]?.data ?? r.data ?? [];
    if (o.length === 0) return;
    const l = Math.max(3, t.plot.width / o.length * 0.35);
    o.forEach((c, d) => {
      const h = c.open ?? c.y ?? 0, u = c.high ?? Math.max(h, c.close ?? h), g = c.low ?? Math.min(h, c.close ?? h), p = c.close ?? h, m = c.time !== void 0 ? B(c.time) : typeof c.x == "number" ? c.x : d, x = s.convert(m), y = n.convert(h), v = n.convert(u), b = n.convert(g), w = n.convert(p), M = p >= h ? this.upColor : this.downColor, k = i.line(x, v, x, b, { stroke: M, strokeWidth: 1.5 }), E = i.line(x - l, y, x, y, { stroke: M, strokeWidth: 1.5 }), $ = i.line(x, w, x + l, w, { stroke: M, strokeWidth: 1.5 });
      this.renderedElements.push(k, E, $);
    });
  }
  destroy() {
    for (const t of this.renderedElements)
      t.destroy();
    this.renderedElements = [], this.axisX?.destroy(), this.axisY?.destroy(), super.destroy();
  }
}
class ae extends D {
  upColor = "#10b981";
  downColor = "#ef4444";
  axisX = null;
  axisY = null;
  renderedElements = [];
  constructor(t) {
    super(t), t.volume?.upColor && (this.upColor = t.volume.upColor), t.volume?.downColor && (this.downColor = t.volume.downColor), this.updateScalesFromData();
  }
  updateScalesFromData() {
    const t = this.options.data, i = t.series?.[0]?.data ?? t.data ?? [];
    if (i.length === 0) return;
    let s = 0;
    const n = [];
    i.forEach((o, l) => {
      const c = o.volume ?? o.y ?? 0, d = o.time !== void 0 ? B(o.time) : typeof o.x == "number" ? o.x : l;
      n.push(d), c > s && (s = c);
    }), s === 0 && (s = 1e3);
    const r = this.getScale("x"), a = this.getScale("y");
    if (r) {
      const o = Math.min(...n), l = Math.max(...n), c = l - o || 1;
      r.setDomain([o - c * 0.02, l + c * 0.02]);
    }
    a && a.setDomain([0, s * 1.15]);
  }
  render() {
    super.render();
    const t = this.getBounds(), e = this.getTheme(), i = this.renderer, s = this.getScale("x"), n = this.getScale("y");
    if (s && this.options.axis?.x && (this.axisX = new A(s, this.options.axis.x), this.axisX.render({ bounds: t, theme: e, renderer: i })), n && this.options.axis?.y && (this.axisY = new A(n, this.options.axis.y), this.axisY.render({ bounds: t, theme: e, renderer: i })), !s || !n) return;
    const r = this.options.data, o = r.series?.[0]?.data ?? r.data ?? [];
    if (o.length === 0) return;
    const l = Math.max(2, t.plot.width / o.length * 0.7), c = n.convert(0);
    o.forEach((d, h) => {
      const u = d.volume ?? d.y ?? 0, g = d.open ?? 0, x = (d.close ?? g) >= g ? this.upColor : this.downColor, y = d.time !== void 0 ? B(d.time) : typeof d.x == "number" ? d.x : h, v = s.convert(y), b = n.convert(u), w = Math.max(0, c - b), S = i.rect(v - l / 2, b, l, w, {
        fill: x,
        opacity: 0.8,
        rx: 1,
        ry: 1
      });
      this.renderedElements.push(S);
    });
  }
  destroy() {
    for (const t of this.renderedElements)
      t.destroy();
    this.renderedElements = [], this.axisX?.destroy(), this.axisY?.destroy(), super.destroy();
  }
}
function pt(f, t) {
  const e = [];
  if (t <= 0 || f.length === 0) return e;
  let i = 0;
  for (let s = 0; s < f.length; s++) {
    const n = f[s] ?? 0;
    i += n, s >= t && (i -= f[s - t] ?? 0), s >= t - 1 ? e.push(i / t) : e.push(null);
  }
  return e;
}
function G(f, t) {
  const e = [];
  if (t <= 0 || f.length === 0) return e;
  const i = 2 / (t + 1);
  let s = null, n = 0;
  for (let r = 0; r < f.length; r++) {
    const a = f[r] ?? 0;
    r < t - 1 ? (n += a, e.push(null)) : r === t - 1 ? (n += a, s = n / t, e.push(s)) : s !== null ? (s = (a - s) * i + s, e.push(s)) : e.push(null);
  }
  return e;
}
function xe(f, t) {
  const e = [];
  if (t <= 0 || f.length === 0) return e;
  const i = t * (t + 1) / 2;
  for (let s = 0; s < f.length; s++) {
    if (s < t - 1) {
      e.push(null);
      continue;
    }
    let n = 0;
    for (let r = 0; r < t; r++) {
      const a = r + 1, o = f[s - t + 1 + r] ?? 0;
      n += o * a;
    }
    e.push(n / i);
  }
  return e;
}
function ye(f, t = 14) {
  const e = [];
  if (t <= 0 || f.length <= t)
    return f.map(() => null);
  const i = [], s = [];
  for (let l = 1; l < f.length; l++) {
    const c = (f[l] ?? 0) - (f[l - 1] ?? 0);
    i.push(c > 0 ? c : 0), s.push(c < 0 ? -c : 0);
  }
  e.push(null);
  let n = 0, r = 0;
  for (let l = 0; l < t; l++)
    n += i[l] ?? 0, r += s[l] ?? 0, l < t - 1 && e.push(null);
  n /= t, r /= t;
  const a = r === 0 ? 100 : n / r, o = r === 0 ? 100 : 100 - 100 / (1 + a);
  e.push(o);
  for (let l = t; l < i.length; l++) {
    const c = i[l] ?? 0, d = s[l] ?? 0;
    if (n = (n * (t - 1) + c) / t, r = (r * (t - 1) + d) / t, r === 0)
      e.push(100);
    else {
      const h = n / r;
      e.push(100 - 100 / (1 + h));
    }
  }
  return e;
}
function be(f, t = 12, e = 26, i = 9) {
  const s = G(f, t), n = G(f, e), r = [], a = [], o = [];
  for (let h = 0; h < f.length; h++) {
    const u = s[h], g = n[h];
    if (u != null && g !== null && g !== void 0) {
      const p = u - g;
      r.push(p), a.push(p), o.push(h);
    } else
      r.push(null);
  }
  const l = G(a, i), c = new Array(f.length).fill(null), d = new Array(f.length).fill(null);
  for (let h = 0; h < l.length; h++) {
    const u = o[h];
    if (u !== void 0) {
      const g = l[h] ?? null;
      c[u] = g;
      const p = r[u];
      p != null && g !== null && (d[u] = p - g);
    }
  }
  return {
    macd: r,
    signal: c,
    histogram: d
  };
}
function le(f, t = 20, e = 2) {
  const i = pt(f, t), s = [], n = [], r = [];
  for (let a = 0; a < f.length; a++) {
    const o = i[a] ?? null;
    if (n.push(o), o === null || a < t - 1) {
      s.push(null), r.push(null);
      continue;
    }
    let l = 0;
    for (let d = 0; d < t; d++) {
      const u = (f[a - t + 1 + d] ?? 0) - o;
      l += u * u;
    }
    const c = Math.sqrt(l / t);
    s.push(o + e * c), r.push(o - e * c);
  }
  return { upper: s, middle: n, lower: r };
}
function ve(f) {
  const t = [];
  let e = 0, i = 0;
  for (const s of f) {
    const n = (s.high + s.low + s.close) / 3, r = s.volume || 0;
    e += n * r, i += r, i === 0 ? t.push(n) : t.push(e / i);
  }
  return t;
}
class rt extends D {
  indicators = [];
  volumePanel = !0;
  axisX = null;
  axisY = null;
  axisYVol = null;
  renderedElements = [];
  constructor(t) {
    super(t), t.indicators && (this.indicators = t.indicators), t.volumePanel !== void 0 && (this.volumePanel = t.volumePanel), this.updateScalesFromData();
  }
  addIndicator(t) {
    this.indicators.push(t), this.render();
  }
  updateScalesFromData() {
    const t = this.options.data, i = t.series?.[0]?.data ?? t.data ?? [];
    if (i.length === 0) return;
    let s = 1 / 0, n = -1 / 0;
    const r = [];
    i.forEach((c, d) => {
      const h = c.open ?? c.y ?? 0, u = c.high ?? Math.max(h, c.close ?? h), g = c.low ?? Math.min(h, c.close ?? h);
      c.volume;
      const p = c.time !== void 0 ? B(c.time) : typeof c.x == "number" ? c.x : d;
      r.push(p), g < s && (s = g), u > n && (n = u);
    }), s === 1 / 0 && (s = 100, n = 110);
    const a = (n - s) * 0.05 || 1, o = this.getScale("x"), l = this.getScale("y");
    if (o) {
      const c = Math.min(...r), d = Math.max(...r), h = d - c || 1;
      o.setDomain([c - h * 0.02, d + h * 0.02]);
    }
    l && l.setDomain([s - a, n + a]);
  }
  render() {
    super.render();
    const t = this.getBounds(), e = this.getTheme(), i = this.renderer, s = this.getScale("x"), n = this.getScale("y");
    if (s && this.options.axis?.x && (this.axisX = new A(s, this.options.axis.x), this.axisX.render({ bounds: t, theme: e, renderer: i })), n && this.options.axis?.y && (this.axisY = new A(n, this.options.axis.y), this.axisY.render({ bounds: t, theme: e, renderer: i })), !s || !n) return;
    const r = this.options.data, o = r.series?.[0]?.data ?? r.data ?? [];
    if (o.length === 0) return;
    const { plot: l } = t, c = this.volumePanel ? l.height * 0.75 : l.height, d = l.y + c, h = l.height - c, u = o.length, g = l.width / u, p = Math.max(2, g * 0.7), m = Math.max(...o.map((y) => y.volume ?? 0), 1e3);
    if (o.forEach((y, v) => {
      const b = y.open ?? y.y ?? 0, w = y.high ?? Math.max(b, y.close ?? b), S = y.low ?? Math.min(b, y.close ?? b), M = y.close ?? b, k = y.volume ?? 0, E = y.time !== void 0 ? B(y.time) : typeof y.x == "number" ? y.x : v, $ = s.convert(E), C = n.convert(b), T = n.convert(w), P = n.convert(S), L = n.convert(M), V = M >= b ? "#10b981" : "#ef4444", _ = i.line($, T, $, P, { stroke: V, strokeWidth: 1 }), yt = Math.max(1, Math.abs(C - L)), bt = Math.min(C, L), vt = i.rect($ - p / 2, bt, p, yt, {
        fill: V,
        stroke: V,
        strokeWidth: 1
      });
      if (this.renderedElements.push(_, vt), this.volumePanel) {
        const et = k / m * (h - 8), wt = d + h - et, St = i.rect($ - p / 2, wt, p, et, {
          fill: V,
          opacity: 0.45
        });
        this.renderedElements.push(St);
      }
    }), this.volumePanel) {
      const y = i.line(l.x, d, l.x + l.width, d, {
        stroke: e.grid,
        strokeWidth: 1,
        strokeDasharray: [3, 3]
      }), v = i.text(l.x + 6, d + 12, "Volume", {
        fill: "#9ca3af",
        fontSize: 10,
        fontFamily: e.fontFamily
      });
      this.renderedElements.push(y, v);
    }
    const x = o.map((y) => y.close ?? y.y ?? 0);
    this.indicators.forEach((y) => {
      const v = y.period ?? 14;
      if (y.type === "sma") {
        const b = pt(x, v);
        this.renderIndicatorLine(s, n, o, b, y.color ?? "#f59e0b", `SMA (${v})`, i);
      } else if (y.type === "ema") {
        const b = G(x, v);
        this.renderIndicatorLine(s, n, o, b, y.color ?? "#3b82f6", `EMA (${v})`, i);
      } else if (y.type === "bollinger") {
        const b = le(x, v);
        this.renderIndicatorLine(s, n, o, b.upper, "#8b5cf6", "BB Upper", i), this.renderIndicatorLine(s, n, o, b.middle, "#6366f1", "BB Mid", i), this.renderIndicatorLine(s, n, o, b.lower, "#8b5cf6", "BB Lower", i);
      }
    });
  }
  renderIndicatorLine(t, e, i, s, n, r, a) {
    let o = "", l = !1;
    if (s.forEach((c, d) => {
      if (c == null) return;
      const h = i[d];
      if (!h) return;
      const u = h.time !== void 0 ? B(h.time) : typeof h.x == "number" ? h.x : d, g = t.convert(u), p = e.convert(c);
      l ? o += ` L ${g} ${p}` : (o = `M ${g} ${p}`, l = !0);
    }), o) {
      const c = a.path(o, { stroke: n, strokeWidth: 1.5, fill: "none" });
      this.renderedElements.push(c);
    }
  }
  destroy() {
    for (const t of this.renderedElements)
      t.destroy();
    this.renderedElements = [], this.axisX?.destroy(), this.axisY?.destroy(), this.axisYVol?.destroy(), super.destroy();
  }
}
function ce(f) {
  return {
    "--charteex-font-family": f.typography.fontFamily,
    "--charteex-bg-canvas": f.colors.background.canvas,
    "--charteex-bg-plot": f.colors.background.plot,
    "--charteex-bg-surface": f.colors.background.surface,
    "--charteex-text-primary": f.colors.text.primary,
    "--charteex-text-secondary": f.colors.text.secondary,
    "--charteex-text-muted": f.colors.text.muted,
    "--charteex-axis-line": f.colors.axis.line,
    "--charteex-axis-label": f.colors.axis.label,
    "--charteex-grid-major": f.colors.grid.major,
    "--charteex-grid-minor": f.colors.grid.minor,
    "--charteex-tooltip-bg": f.colors.tooltip.background,
    "--charteex-tooltip-border": f.colors.tooltip.border,
    "--charteex-tooltip-text": f.colors.tooltip.text,
    "--charteex-radius-sm": `${f.radius.sm}px`,
    "--charteex-radius-md": `${f.radius.md}px`,
    "--charteex-radius-lg": `${f.radius.lg}px`,
    "--charteex-shadow-sm": f.shadows.sm,
    "--charteex-shadow-md": f.shadows.md,
    "--charteex-semantic-positive": f.colors.semantic.positive,
    "--charteex-semantic-negative": f.colors.semantic.negative
  };
}
function we(f) {
  return {
    name: "watermark",
    install(t) {
      const e = t;
      e.on("render", () => {
        const i = e.getBounds(), s = e.renderer, n = i.plot.x + i.plot.width / 2, r = i.plot.y + i.plot.height / 2;
        s.text(n, r, f.text, {
          fill: f.color ?? "#6b7280",
          fontSize: f.fontSize ?? 28,
          opacity: f.opacity ?? 0.12,
          textAnchor: "middle",
          dominantBaseline: "middle",
          fontWeight: "bold",
          rotate: -20
        });
      });
    }
  };
}
function Se(f) {
  return {
    name: "threshold-line",
    install(t) {
      const e = t;
      e.on("render", () => {
        const i = e.getScale("y");
        if (!i) return;
        const s = i.convert(f.yValue), n = e.getBounds(), r = e.renderer;
        r.line(n.plot.x, s, n.plot.x + n.plot.width, s, {
          stroke: f.color ?? "#ef4444",
          strokeWidth: 1.5,
          strokeDasharray: f.dash ?? [4, 4]
        }), f.label && r.text(n.plot.x + n.plot.width - 5, s - 5, f.label, {
          fill: f.color ?? "#ef4444",
          fontSize: 10,
          textAnchor: "end"
        });
      });
    }
  };
}
function xt(f, t) {
  const e = {
    ...t,
    container: f
  };
  switch (e.type) {
    case "line":
      return new Gt(e);
    case "bar":
    case "column":
      return new jt(e);
    case "area":
      return new Ut(e);
    case "pie":
      return new gt(e);
    case "donut":
      return new Zt(e);
    case "radar":
      return new _t(e);
    case "polar":
      return new Qt(e);
    case "scatter":
      return new Jt(e);
    case "bubble":
      return new Kt(e);
    case "histogram":
      return new te(e);
    case "heatmap":
      return new ee(e);
    case "gauge":
      return new se(e);
    case "funnel":
      return new ie(e);
    case "boxplot":
      return new ne(e);
    case "financial":
      return new rt(e);
    case "candlestick":
      return e.indicators || e.volumePanel ? new rt(e) : new re(e);
    case "ohlc":
      return new oe(e);
    case "volume":
      return new ae(e);
    default:
      return new D(e);
  }
}
const he = xt, de = {
  default: W,
  light: W,
  dark: tt,
  midnight: ot,
  minimal: at,
  professional: lt,
  financial: ct,
  glass: ht,
  enterprise: dt
}, Me = {
  createChart: xt,
  createCharteex: he,
  createTheme: ut,
  extendTheme: Wt,
  resolveTheme: mt,
  exportCssVariables: ce,
  themes: de
};
export {
  Ot as A11yManager,
  Ut as AreaChart,
  jt as BarChart,
  ne as BoxPlotChart,
  Kt as BubbleChart,
  re as CandlestickChart,
  it as CanvasRenderer,
  Et as CategoryScale,
  D as Chart,
  O as ChartError,
  Me as Charteex,
  pe as ConfigurationError,
  It as Crosshair,
  tt as DarkTheme,
  ge as DataError,
  Zt as DonutChart,
  dt as EnterpriseTheme,
  rt as FinancialChart,
  ct as FinancialTheme,
  ie as FunnelChart,
  se as GaugeChart,
  ht as GlassTheme,
  ee as HeatmapChart,
  te as HistogramChart,
  Yt as LayoutEngine,
  W as LightTheme,
  Gt as LineChart,
  Mt as LinearScale,
  $t as LogScale,
  ot as MidnightTheme,
  at as MinimalTheme,
  oe as OHLCChart,
  gt as PieChart,
  Qt as PolarChart,
  lt as ProfessionalTheme,
  _t as RadarChart,
  me as RendererError,
  st as SVGRenderer,
  ue as ScaleError,
  Jt as ScatterChart,
  kt as TimeScale,
  Ft as Tooltip,
  ae as VolumeChart,
  Xt as ZoomPanController,
  le as calculateBollingerBands,
  G as calculateEMA,
  be as calculateMACD,
  ye as calculateRSI,
  pt as calculateSMA,
  ve as calculateVWAP,
  xe as calculateWMA,
  nt as computeBoxPlotStats,
  xt as createChart,
  he as createCharteex,
  ut as createTheme,
  Se as createThresholdPlugin,
  we as createWatermarkPlugin,
  U as describeArc,
  H as escapeHtml,
  ce as exportCssVariables,
  Wt as extendTheme,
  fe as formatDate,
  Y as formatNumber,
  ft as getSystemTheme,
  R as polarToCartesian,
  mt as resolveTheme,
  j as themeRegistry,
  de as themes,
  B as toTimestamp
};
//# sourceMappingURL=index.js.map
