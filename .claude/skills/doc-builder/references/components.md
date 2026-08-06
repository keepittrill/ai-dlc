# 컴포넌트 카탈로그 (doc-builder 정본)

문서(위키) 트랙의 컴포넌트만 조합해 `doc-<slug>.html`을 만든다. **문서별 CSS/JS를 새로 쓰지 않는다** — 모든 컴포넌트는 `doc.css`에 있고 라이트/다크 두 테마에서 자동 동작한다. 색/폰트/radius는 하드코딩 금지, 항상 `wk-*` 클래스만 쓴다.

`doc.js`는 콘텐츠가 없는 공유 메커니즘이다. 마크업만 규약대로 두면 아래가 자동 처리된다:
- `.wk-body` 안의 `h2`/`h3` → **ToC 자동 생성**(`data-doc-toc` 자리표시자에 채움) + 헤딩 앵커 + **스크롤 스파이**
- `.wk-body` 안의 `<pre>` → **코드 복사 버튼** 자동 부착
- `data-doc-readtime` 요소 → **읽는 시간** 자동 계산
- `data-doc-theme-toggle` 버튼 → **라이트/다크 토글**(localStorage 기억)

---

## 0. 페이지 골격 (필수 규약)

```html
<html lang="ko" data-doc-theme="light">
  <link rel="stylesheet" href="doc.css" />
  <body>
    <header class="wk-topbar"> … 브랜드 + [data-doc-theme-toggle] 버튼 … </header>
    <div class="wk-shell">
      <nav class="wk-toc" data-doc-toc-wrap data-collapsed="false">
        <button class="wk-toc-toggle" data-doc-toc-toggle>ON THIS PAGE <span>▾</span></button>
        <p class="wk-toc-title">On this page</p>
        <div data-doc-toc></div>            <!-- 비워둠: doc.js가 채움 -->
      </nav>
      <main class="wk-main">
        <nav class="wk-breadcrumb"> … </nav>
        <header class="wk-page-header"> … h1 + .wk-meta + .wk-labels … </header>
        <article class="wk-body"> … 본문(h2/h3 + 컴포넌트) … </article>
      </main>
    </div>
    <script src="doc.js"></script>
  </body>
</html>
```
- 그리드는 `.wk-shell`(왼쪽 ToC + 오른쪽 본문). 모바일에서 ToC는 상단으로 접힌다.
- 본문 컨테이너는 반드시 `<article class="wk-body">` — ToC/앵커/코드복사가 이 안을 스캔한다.

## 1. 페이지 헤더

```html
<nav class="wk-breadcrumb" aria-label="위치">
  <a href="index.html">Home</a><span>/</span>
  <a href="docs.html">Docs Space</a><span>/</span>
  문서 제목
</nav>
<header class="wk-page-header">
  <h1>문서 제목</h1>
  <div class="wk-meta">
    <span><span class="wk-avatar">LK</span> 작성 <b>팀명</b></span>
    <span>🕒 최종 수정 2026-08-06</span>
    <span>⏱ 읽는 시간 <b data-doc-readtime>—</b></span>
    <span>버전 <span class="wk-status is-blue">v1.0</span></span>
  </div>
  <div class="wk-labels">
    <a class="wk-label" href="#">label</a>
  </div>
</header>
```
수정일은 **콘텐츠**이므로 페이지에 직접 적는다(오늘 날짜는 세션 컨텍스트의 currentDate 사용). 읽는 시간만 자동이다.

## 2. admonition 패널 (info · note · tip/success · warning · error)

```html
<div class="wk-panel is-info">
  <span class="wk-panel-icon">ℹ️</span>
  <div>
    <span class="wk-panel-title">제목(선택)</span>
    <p>본문. 강조는 <strong>…</strong>.</p>
  </div>
</div>
```
변형 클래스: `is-info`(기본, 파랑) · `is-note`(보라) · `is-tip`/`is-success`(초록) · `is-warning`(노랑) · `is-error`(빨강).
아이콘 이모지는 자유(예: ℹ️ 📝 💡 ⚠️ ⛔). 색바·배경은 클래스가 자동 처리한다.

## 3. 코드 블록 (복사 자동)

작성자 헤드가 있는 형태 — 언어 라벨 + 복사 버튼:
```html
<div class="wk-code">
  <div class="wk-code-head"><span>bash</span><button class="wk-copy" type="button">복사</button></div>
  <pre><code>npm test</code></pre>
</div>
```
또는 본문에 **맨 <pre>만** 둬도 `doc.js`가 감싸고 복사 버튼을 붙인다. 언어 라벨은 `data-lang` 속성:
```html
<pre data-lang="bash">git checkout -b feat/x
npm test</pre>
```
인라인 코드는 `<code>…</code>`.

## 4. expand 매크로 (네이티브 details — JS 불필요)

```html
<details class="wk-expand">
  <summary>자세히: 제목 (펼쳐 보기)</summary>
  <div class="wk-expand-body">
    <p>접혀 있던 상세 내용.</p>
  </div>
</details>
```

## 5. 표

```html
<div class="wk-table-wrap">
  <table>
    <thead><tr><th>열</th><th>열</th></tr></thead>
    <tbody>
      <tr><td>값</td><td>값</td></tr>
    </tbody>
  </table>
</div>
```
`.wk-table-wrap`이 가로 스크롤·테두리를 담당한다. `.wk-body table`은 자동 스타일된다.

## 6. status 로젠지 (인라인 상태 뱃지)

```html
<span class="wk-status is-green">CI 통과</span>
```
색: `is-blue` · `is-green` · `is-yellow` · `is-red` · `is-purple` · (무색 기본). 표 셀·리스트 항목·메타에 인라인으로 넣는다.

## 7. 정의/키-값 카드

```html
<div class="wk-cards">
  <div class="wk-card"><b>제목</b><span>설명</span></div>
  <div class="wk-card"><b>제목</b><span>설명</span></div>
</div>
```
`auto-fit`으로 자동 열 배치된다.

## 8. blockquote / 리스트 / 구분선

`.wk-body` 안에서 표준 `<blockquote>`, `<ul>/<ol>`, `<hr>`을 그대로 쓰면 문서 타이포가 적용된다.

## 9. 푸터 / 관련 문서

```html
<footer class="wk-footer">
  <div>맺음말.</div>
  <div class="wk-related">
    <a href="docs.html">← Docs Space</a>
    <a href="doc-other.html">관련 문서</a>
  </div>
</footer>
```

---

## 허브 등록 (docs.html)

`<!-- DOCS:START/END -->` 안에 `.wk-doc-row` 한 줄 추가(이모지/`h3`/`p`/`→` 4요소):
```html
<a class="wk-doc-row" href="doc-<slug>.html">
  <span class="wk-doc-icon">📘</span>
  <div><h3>문서 제목</h3><p>한 줄 설명</p></div>
  <span class="wk-doc-go">→</span>
</a>
```

---

## 검증 체크리스트 (생성 후 필수)
- [ ] `node --check doc.js` 통과 — `doc.css`/`doc.js`는 수정 금지
- [ ] `<article class="wk-body">` 존재, 그 안에 `h2`/`h3` 최소 2개(ToC용)
- [ ] `<div data-doc-toc></div>` 자리표시자는 **비어 있음**(doc.js가 채움)
- [ ] `data-doc-theme-toggle` 버튼과 `data-doc-readtime` 슬롯 존재
- [ ] 패널·표·코드·expand·status가 규약 클래스 사용, 하드코딩 색 없음
- [ ] 실수치엔 출처, 예시엔 "문서용 예시" 표기
- [ ] `docs.html` 마크영역에 문서 행 등록됨
- [ ] 세미나 트랙(styles.css/app.js/seminar-*.html/index.html) 및 seminar-builder 스킬은 변경 없음
