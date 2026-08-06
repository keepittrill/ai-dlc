/* ==========================================================================
   doc.js — 문서 트랙 공유 메커니즘 (콘텐츠 없음)
   --------------------------------------------------------------------------
   모든 doc-*.html 과 docs.html 이 공유하는 단일 IIFE. 어떤 문서의 문구·데이터도
   담지 않는다. 요소가 없는 페이지에서도 안전하게 동작하도록 null 가드를 유지한다.
   기능: (1) 라이트/다크 테마 토글+기억  (2) 본문 h2/h3 로 ToC 자동생성
        (3) 스크롤 스파이  (4) 코드블록 복사 버튼  (5) 읽는시간 자동계산
   ========================================================================== */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement;

  /* ---- 1. theme (light | dark) ------------------------------------------- */
  var THEME_KEY = "doc-theme";
  function applyTheme(t) {
    root.setAttribute("data-doc-theme", t);
    doc.querySelectorAll("[data-doc-theme-toggle]").forEach(function (b) {
      b.textContent = t === "dark" ? "☀" : "☾";
      b.setAttribute("aria-label", t === "dark" ? "라이트 모드" : "다크 모드");
    });
  }
  var saved = null;
  try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
  if (saved !== "light" && saved !== "dark") {
    // 저장된 선택이 없으면 페이지가 지정한 기본값(밝은 배경 등)을 우선한다.
    var preset = root.getAttribute("data-doc-theme");
    if (preset === "light" || preset === "dark") {
      saved = preset;
    } else {
      var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      saved = prefersDark ? "dark" : "light";
    }
  }
  applyTheme(saved);
  doc.addEventListener("click", function (e) {
    var btn = e.target.closest && e.target.closest("[data-doc-theme-toggle]");
    if (!btn) return;
    var next = root.getAttribute("data-doc-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch (err) {}
  });

  /* ---- 2. slugify -------------------------------------------------------- */
  var seen = {};
  function slugify(text) {
    var base = (text || "section").trim().toLowerCase()
      .replace(/[^\w가-힣\s-]/g, "")   // keep word chars, Hangul, space, dash
      .replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || "section";
    var slug = base, n = 2;
    while (seen[slug]) { slug = base + "-" + n++; }
    seen[slug] = true;
    return slug;
  }

  /* ---- 3. ToC autobuild + heading anchors -------------------------------- */
  var body = doc.querySelector(".wk-body");
  var tocNav = doc.querySelector("[data-doc-toc]");
  var headings = [];
  if (body) {
    headings = Array.prototype.slice.call(body.querySelectorAll("h2, h3"));
    headings.forEach(function (h) {
      if (!h.id) h.id = slugify(h.textContent);
      // clickable anchor affordance
      h.classList.add("wk-heading-link");
      var a = doc.createElement("a");
      a.className = "wk-anchor"; a.href = "#" + h.id; a.textContent = "#";
      a.setAttribute("aria-hidden", "true");
      h.insertBefore(a, h.firstChild);
    });
  }
  if (tocNav && headings.length) {
    var ul = doc.createElement("ul");
    headings.forEach(function (h) {
      var li = doc.createElement("li");
      var link = doc.createElement("a");
      link.href = "#" + h.id;
      link.textContent = h.textContent.replace(/^#/, "").trim();
      if (h.tagName === "H3") link.classList.add("is-sub");
      link.setAttribute("data-toc-for", h.id);
      li.appendChild(link);
      ul.appendChild(li);
    });
    tocNav.appendChild(ul);
  } else if (tocNav) {
    var empty = doc.createElement("p");
    empty.className = "wk-toc-empty";
    empty.textContent = "목차 없음";
    tocNav.appendChild(empty);
  }

  /* mobile ToC collapse toggle */
  var tocToggle = doc.querySelector("[data-doc-toc-toggle]");
  if (tocToggle) {
    tocToggle.addEventListener("click", function () {
      var wrap = tocToggle.closest("[data-doc-toc-wrap]") || tocToggle.parentElement;
      if (!wrap) return;
      var collapsed = wrap.getAttribute("data-collapsed") === "true";
      wrap.setAttribute("data-collapsed", collapsed ? "false" : "true");
    });
  }

  /* ---- 4. scroll spy ----------------------------------------------------- */
  if (tocNav && headings.length && "IntersectionObserver" in window) {
    var links = {};
    tocNav.querySelectorAll("a[data-toc-for]").forEach(function (a) {
      links[a.getAttribute("data-toc-for")] = a;
    });
    var visible = {};
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { visible[en.target.id] = en.isIntersecting; });
      var current = null;
      for (var i = 0; i < headings.length; i++) {
        if (visible[headings[i].id]) { current = headings[i].id; break; }
      }
      Object.keys(links).forEach(function (id) { links[id].classList.toggle("is-active", id === current); });
    }, { rootMargin: "-72px 0px -70% 0px", threshold: 0 });
    headings.forEach(function (h) { spy.observe(h); });
  }

  /* ---- 5. code copy buttons --------------------------------------------- */
  function wrapCode(pre) {
    if (pre.closest(".wk-code")) return;  // already wrapped
    var wrap = doc.createElement("div");
    wrap.className = "wk-code";
    var head = doc.createElement("div");
    head.className = "wk-code-head";
    var name = doc.createElement("span");
    name.textContent = pre.getAttribute("data-lang") || "";
    var copy = doc.createElement("button");
    copy.type = "button"; copy.className = "wk-copy"; copy.textContent = "복사";
    head.appendChild(name); head.appendChild(copy);
    pre.parentNode.insertBefore(wrap, pre);
    wrap.appendChild(head); wrap.appendChild(pre);
    copy.addEventListener("click", function () {
      var text = pre.innerText;
      var done = function () {
        copy.textContent = "복사됨"; copy.classList.add("is-done");
        setTimeout(function () { copy.textContent = "복사"; copy.classList.remove("is-done"); }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, done);
      } else {
        try {
          var ta = doc.createElement("textarea"); ta.value = text; doc.body.appendChild(ta);
          ta.select(); doc.execCommand("copy"); doc.body.removeChild(ta); done();
        } catch (e) {}
      }
    });
  }
  if (body) {
    // wrap bare <pre> blocks; leave author-made .wk-code alone but still wire its copy button
    body.querySelectorAll("pre").forEach(wrapCode);
  }
  // author-provided .wk-code blocks with a .wk-copy button
  doc.querySelectorAll(".wk-code .wk-copy").forEach(function (copy) {
    if (copy.getAttribute("data-wired")) return;
    var pre = copy.closest(".wk-code").querySelector("pre");
    if (!pre) return;
    copy.setAttribute("data-wired", "1");
    copy.addEventListener("click", function () {
      var done = function () {
        copy.textContent = "복사됨"; copy.classList.add("is-done");
        setTimeout(function () { copy.textContent = "복사"; copy.classList.remove("is-done"); }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(pre.innerText).then(done, done);
    });
  });

  /* ---- 6. reading time (auto) ------------------------------------------- */
  var slot = doc.querySelector("[data-doc-readtime]");
  if (slot && body) {
    var text = body.innerText || "";
    var hangul = (text.match(/[가-힣]/g) || []).length;
    var words = (text.trim().match(/[A-Za-z0-9]+/g) || []).length;
    // ~500 Hangul chars/min, ~230 words/min
    var mins = Math.max(1, Math.round(hangul / 500 + words / 230));
    slot.textContent = mins + "분";
  }
})();
