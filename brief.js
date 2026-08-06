/* ==========================================================================
   brief.js — 테크 브리프 화려함 레이어의 메커니즘 (콘텐츠 없음)
   --------------------------------------------------------------------------
   doc.js 와 함께 로드된다(doc.js: ToC/테마/코드복사/읽는시간 담당).
   brief.js 는 프레젠테이션 동작만 담당한다:
     (1) [data-reveal] 스크롤 등장  (2) [data-count] 숫자 카운트업
     (3) .br-progress 읽기 진행 바
   요소가 없는 페이지에서도 안전하게 동작하도록 null 가드를 유지한다.
   ========================================================================== */
(function () {
  "use strict";
  var doc = document;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- 1. scroll reveal -------------------------------------------------- */
  var revealables = Array.prototype.slice.call(doc.querySelectorAll("[data-reveal]"));
  if (revealables.length) {
    if (reduce || !("IntersectionObserver" in window)) {
      revealables.forEach(function (el) { el.classList.add("is-in"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          var el = en.target;
          var delay = parseInt(el.getAttribute("data-reveal-delay") || "0", 10);
          if (delay > 0) setTimeout(function () { el.classList.add("is-in"); }, delay);
          else el.classList.add("is-in");
          io.unobserve(el);
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: .12 });
      revealables.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---- 2. count-up ------------------------------------------------------- */
  // <b data-count="76" data-suffix="일">0</b>  →  0→76 애니메이션
  var counters = Array.prototype.slice.call(doc.querySelectorAll("[data-count]"));
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    if (isNaN(target)) return;
    var prefix = el.getAttribute("data-prefix") || "";
    var suffix = el.getAttribute("data-suffix") || "";
    var decimals = (String(el.getAttribute("data-count")).split(".")[1] || "").length;
    if (reduce) { el.textContent = prefix + target.toFixed(decimals) + suffix; return; }
    var dur = 1100, start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = prefix + target.toFixed(decimals) + suffix;
    }
    requestAnimationFrame(step);
  }
  if (counters.length) {
    if (!("IntersectionObserver" in window)) {
      counters.forEach(animateCount);
    } else {
      var co = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          animateCount(en.target); co.unobserve(en.target);
        });
      }, { threshold: .5 });
      counters.forEach(function (el) { co.observe(el); });
    }
  }

  /* ---- 3. reading progress bar ------------------------------------------ */
  var bar = doc.querySelector("[data-br-progress]");
  if (bar) {
    var fill = bar.querySelector("i") || bar;
    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var h = doc.documentElement;
        var max = (h.scrollHeight - h.clientHeight) || 1;
        var pct = Math.min(100, Math.max(0, (h.scrollTop || window.pageYOffset) / max * 100));
        fill.style.width = pct + "%";
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
  }
})();
