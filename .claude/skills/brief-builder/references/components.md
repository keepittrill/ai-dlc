# 컴포넌트 카탈로그 (brief-builder 정본)

브리프는 **두 레이어를 겹쳐** 만든다:
- **읽는 구조** = `doc.css`의 `wk-*` (본문 타이포·패널·표·expand·코드·ToC). 카탈로그는 `doc-builder/references/components.md` 참조.
- **화려함** = `brief.css`의 `br-*` (아래).

`doc.js`(ToC·테마·코드복사·읽는시간)와 `brief.js`(리빌·카운트업·진행바)는 콘텐츠 없는 공유 메커니즘이다. 마크업만 규약대로 두면 자동 동작한다. **네 파일 모두 수정 금지.** 색/폰트/radius 하드코딩 금지.

---

## 0. 골격 (필수)

```html
<html lang="ko" data-doc-theme="light">   <!-- 기본 밝은 배경(라이트). doc.js가 토글·기억 -->
  <link rel="stylesheet" href="doc.css" />
  <link rel="stylesheet" href="brief.css" />   <!-- 순서 고정: doc → brief -->
  <body>
    <div class="br-progress" data-br-progress><i></i></div>   <!-- 읽기 진행 바 -->
    <header class="wk-topbar"> … [data-doc-theme-toggle] … </header>
    <section class="br-hero"> … 풀블리드 히어로 … </section>
    <div class="wk-shell">
      <nav class="wk-toc" data-doc-toc-wrap><div data-doc-toc></div></nav>
      <main class="wk-main">
        <nav class="wk-breadcrumb"> … </nav>
        <article class="wk-body"> … 헤딩·산문·인라인 화려함 요소 … </article>
      </main>
    </div>
    <section class="br-section"><div class="br-cta"> … </div></section>   <!-- 풀블리드 CTA -->
    <script src="doc.js"></script>
    <script src="brief.js"></script>   <!-- 순서 고정: doc → brief -->
  </body>
</html>
```
**규칙:** 본문 헤딩(h2/h3)은 **하나의 `.wk-body`** 안에 둔다 → ToC·읽는시간 정확. 풀블리드는 히어로·CTA만.

---

## 1. 히어로 (br-hero) — 풀블리드

```html
<section class="br-hero">
  <div class="br-hero-inner">
    <p class="br-eyebrow" data-reveal>Technical Brief · 2026</p>
    <h1 data-reveal data-reveal-delay="80">핵심 메시지<br /><em>강조 문장.</em></h1>
    <p class="br-hero-lead" data-reveal data-reveal-delay="160">리드 문단.</p>
    <div class="br-hero-meta" data-reveal data-reveal-delay="220">
      <span class="br-chip"><b>대상</b> …</span>
      <span class="br-chip"><b>읽는 시간</b> <span data-doc-readtime>—</span></span>
    </div>
    <div class="br-cta-row" data-reveal data-reveal-delay="280">
      <a class="br-btn" href="#roadmap">주요 CTA <span>↓</span></a>
      <a class="br-btn is-ghost" href="…">보조 CTA</a>
    </div>
  </div>
</section>
```
`<h1>`의 `<em>`은 그라데이션 텍스트로 강조된다.

## 2. 스탯 타일 (br-stats) — 카운트업

```html
<div class="br-stats" data-reveal>
  <div class="br-stat"><b><span data-count="90" data-suffix="일">0</span></b><span>라벨</span><small>출처/주석(선택)</small></div>
</div>
```
`data-count`=목표값, `data-suffix`/`data-prefix` 선택, 소수는 `data-count="4.5"`. `brief.js`가 뷰포트 진입 시 0→목표로 애니메이션.

## 3. 피처 그리드 (br-grid / br-feature)

```html
<div class="br-grid" data-reveal>
  <article class="br-feature">
    <span class="br-num">01</span><span class="br-ico">📜</span>
    <h3>제목</h3><p>설명</p>
  </article>
</div>
```

## 4. 풀쿼트 (br-quote)

```html
<div class="br-quote" data-reveal>
  <blockquote>“문장 <em>강조</em>.”</blockquote>
  <cite>— 출처</cite>
</div>
```

## 5. 단계 (br-steps / br-step) — 번호 자동

```html
<div class="br-steps" data-reveal>
  <div class="br-step"><div><h3>제목 · 기간</h3><p>설명</p></div></div>
</div>
```
`::before` 카운터가 01, 02 … 자동 부여(빈 첫 자식 div 불필요 — 바로 내용 div 하나만).

## 6. CTA 밴드 (br-cta) — 풀블리드

```html
<section class="br-section">
  <div class="br-cta" data-reveal>
    <h2>맺음 제목</h2><p>한 문장.</p>
    <a class="br-btn" href="…">다음 걸음 <span>→</span></a>
  </div>
</section>
```

## 7. 스크롤 등장 (data-reveal) — 어디에나

임의 요소에 `data-reveal`을 붙이면 뷰포트 진입 시 페이드+슬라이드. 옵션:
- `data-reveal="left"` 또는 `data-reveal="zoom"` — 방향/스케일 변형
- `data-reveal-delay="120"` — 지연(ms), 그리드 내 순차 등장에 사용

## 8. 읽기 진행 바 (br-progress)

`<div class="br-progress" data-br-progress><i></i></div>` 한 줄이면 `brief.js`가 스크롤 %로 채운다.

---

## 읽는 구조(wk-*)는 doc-builder 카탈로그 그대로

패널(`wk-panel is-info|note|tip|warning|error`), 표(`wk-table-wrap`), expand(`wk-expand`), 코드(`wk-code`/bare `<pre>`), status 로젠지(`wk-status`), 카드(`wk-cards`), 브레드크럼·메타·라벨은 `doc-builder/references/components.md`를 따른다. 모두 `.wk-body` 안에서 브리프의 산문과 섞어 쓴다.

---

## 검증 체크리스트
- [ ] `node --check doc.js` · `node --check brief.js` 통과 (넷 다 수정 금지)
- [ ] 링크 순서 `doc.css`→`brief.css`, 스크립트 `doc.js`→`brief.js`
- [ ] 본문 헤딩이 **단일 `.wk-body`** 안 → ToC/읽는시간 정상
- [ ] `data-doc-toc`(비움)·`data-doc-readtime`·`data-doc-theme-toggle`·`data-br-progress` 존재
- [ ] `data-count` 값 숫자, `data-reveal` 남용 아님(핵심 블록에만), `id` 중복 없음
- [ ] 실수치엔 출처, 예시엔 "문서용 예시" 표기
- [ ] `docs.html` 마크영역에 등록됨
- [ ] 세미나 트랙·doc.css/doc.js·seminar-builder·doc-builder 무변경
