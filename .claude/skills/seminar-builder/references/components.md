# 컴포넌트 카탈로그 (seminar-builder 정본)

새 세미나는 이 카탈로그의 컴포넌트만 조합해 만든다. **세미나별 CSS를 새로 쓰지 않는다** — 모든 컴포넌트는 `styles.css`에 이미 있고 5개 테마에서 자동 동작한다. 새 컴포넌트가 꼭 필요하면 `styles.css`에 범용 클래스로 1회 추가하고 이 문서에 등재한다.

색상·폰트·radius는 절대 하드코딩하지 않는다 — 항상 테마 변수(`var(--accent)` 등)를 쓰는 기존 클래스를 사용한다.

---

## 0. 페이지 골격 (필수 규약)

- 각 장면은 `<section class="scene chapter" id="ID" data-scene="NN">`. `data-scene`은 `00`부터 순번, 허브·네비 앵커와 `id` 일치.
- 첫 장면(히어로)은 `<section class="hero scene" id="top" data-scene="00">`.
- 소제목 블록: `<div class="chapter-head reveal"><p class="eyebrow">KICKER</p><h2>제목<br /><em>강조</em></h2><p>리드문</p></div>`
- 화면 등장 애니메이션이 필요한 모든 블록에 `class="... reveal"`을 붙인다(IntersectionObserver가 자동 처리).
- 장 번호 라벨: `<div class="section-number">03 / THE METHOD</div>`
- 한 줄 강조 정리: `<p class="stage-takeaway reveal"><b>라벨:</b> 문장.</p>`

---

## 1. 정적 컴포넌트 (JS 불필요 — 우선 사용)

### case-intro — 사례/스토리 카드
```html
<div class="case-intro reveal">
  <div class="case-intro-badge"><span>CASE 01</span><b>📖</b></div>
  <div>
    <h3>제목</h3>
    <p>본문. 강조는 <strong>…</strong>.</p>
  </div>
</div>
```

### case-link — 📎 콜아웃 (사례 연결·안내)
```html
<div class="case-link reveal"><span>📎</span><p><b>라벨</b> — 문장. 링크는 <a href="...">텍스트</a>.</p></div>
```

### role-boundary — 3열 카드 (역할/장치/포인트)
```html
<div class="role-boundary reveal">
  <div><b>제목</b><p>설명</p></div>
  <div><b>제목</b><p>설명</p></div>
  <div><b>제목</b><p>설명</p></div>
</div>
```

### two-paths — 2열 비교 (선택지·경로)
```html
<div class="two-paths reveal">
  <article><span>LABEL</span><h3>제목</h3><p>설명</p><b>하단 강조</b></article>
  <article><span>LABEL</span><h3>제목</h3><p>설명</p><b>하단 강조</b></article>
</div>
```

### test-split — 2열 리스트 비교 (대비쌍)
```html
<div class="test-split reveal">
  <article><span>LABEL</span><h3>제목</h3><p>부제</p><ul><li>항목</li><li>항목</li></ul></article>
  <article><span>LABEL</span><h3>제목</h3><p>부제</p><ul><li>항목</li><li>항목</li></ul></article>
</div>
```

### era-track — 4열 타임라인 (역사·발전 단계)
```html
<div class="era-track reveal" aria-label="…">
  <article><span>~1990s · A</span><h4>제목</h4><p>줄1<br />해법: <b>강조</b></p></article>
  <!-- 4개 권장, 마지막 article이 accent 강조됨 -->
</div>
```

### quality-checks — 칩 목록 (+ 선택 설명)
```html
<div class="quality-checks reveal">
  <h3>제목</h3>
  <div>
    <span>칩<small>설명(선택)</small></span>
    <span>칩<small>설명(선택)</small></span>
  </div>
  <p>마무리 문장.</p>
</div>
```

### aidlc-dialog — 대화 재현 (AI 대화·상호작용 시연)
```html
<div class="aidlc-dialog reveal">
  <div class="window-bar"><span></span><span></span><span></span><b>제목</b></div>
  <ol>
    <li class="user"><span>나</span><p>발화</p></li>
    <li><span>AI · 계획</span><p>발화<small>부연(선택)</small></p></li>
  </ol>
</div>
```

### roadmap — 3열 실행 계획
```html
<div class="roadmap reveal">
  <article><span>DAY 01–30</span><h3>제목</h3><ul><li>항목</li></ul></article>
  <article><span>DAY 31–60</span><h3>제목</h3><ul><li>항목</li></ul></article>
  <article><span>DAY 61–90</span><h3>제목</h3><ul><li>항목</li></ul></article>
</div>
```

### traceability — 연결 체인
```html
<div class="traceability reveal">
  <div class="trace-title"><span>LABEL</span><h3>제목</h3></div>
  <div class="trace-flow"><span>A<br /><b>A-01</b></span><i>→</i><span>B<br /><b>B-02</b></span></div>
</div>
```

### final-statement — 클로징
```html
<div class="final-statement reveal">
  <p>PRINCIPLE</p>
  <h2>핵심 한 문장<br /><em>강조</em></h2>
  <a class="primary-button" href="#sources">참고자료 <span>↓</span></a>
</div>
```

### source-grid — 출처/참고 (마지막 sources 장면)
```html
<div class="source-grid reveal">
  <a href="URL" target="_blank" rel="noreferrer"><span>TAG</span><b>제목</b><small>부제 ↗</small></a>
</div>
```

---

## 2. 인터랙티브 — 자동 배선 (JS 코드 추가 불필요)

### myth-card — O/X 퀴즈 (자동 배선)
버튼과 `[data-quiz-answer]`만 있으면 app.js가 자동으로 토글한다. 페이지에 몇 개든 가능.
```html
<div class="myth-card reveal">
  <div><span>QUIZ</span><h3>“질문?”</h3></div>
  <button type="button">정답 확인</button>
  <p data-quiz-answer hidden><strong>결론.</strong> 해설.</p>
</div>
```

### detail-group — 상세 패널 (버튼 그룹 → 패널 렌더)
탭 콘솔·클릭형 목록·단계 탐험기에 모두 쓰는 범용 위젯. **데이터는 인라인 JSON**. 스크립트는 그룹 div 바로 뒤, 그룹 **밖**에 둔다.
```html
<div class="detail-group" data-detail-group="GROUP" data-detail-target="PANEL_ID">
  <div class="case-console">           <!-- 트리거 컨테이너는 자유 (탭/그리드/라디오 등) -->
    <button type="button" data-detail="key1">탭1</button>
    <button type="button" data-detail="key2">탭2</button>
    <div class="case-content" id="PANEL_ID">초기 내용(선택)</div>
  </div>
</div>
<script type="application/json" data-detail-json="GROUP">
{
  "key1": {"label":"소라벨","title":"제목","copy":"본문","tags":["칩"]},
  "key2": {"head":"굵은 제목","columns":[{"head":"열제목","body":"내용"}]}
}
</script>
```
엔트리 필드(있는 것만 순서대로 렌더): `label`→`<span>`, `head`→`<b>`, `title`→`<h3>`, `copy`→`<p>`, `tags[]`→칩, `columns[{head,body}]`→3열 그리드, `code`(+`name`,`badge`)→코드 블록, `toast`→토스트 문구.
- 패널 대상 지정: 그룹에 `data-detail-target="ID"`(getElementById) 또는 패널 요소에 빈 `data-detail-target` 속성.
- 컨테이너 클래스로 외형 결정: `case-console`(탭), `framework-stack`(스택), `capability-radar`(방사형), `failure-scenarios`(버튼 그리드+상세) 등 기존 클래스 재사용.

### impact-group — 모듈 하이라이트 (다이어그램 영향 표시)
```html
<div class="change-simulator" data-impact-group="GROUP" data-impact-target="MAP_ID" data-impact-message="MSG_ID">
  <div class="change-controls">
    <button type="button" data-impact="model">변경 A</button>
    <div id="MSG_ID">초기 메시지</div>
  </div>
  <div class="architecture-map" id="MAP_ID">
    <article data-module="ai">…</article>
  </div>
</div>
<script type="application/json" data-impact-json="GROUP">
{ "model": {"modules":["ai"],"message":["굵게","나머지"],"toast":"…"} }
</script>
```

---

## 3. Bespoke (특정 세미나 전용 — 새 세미나에서는 피한다)

`prompt-lab`(프롬프트 변환 토글), Given–When–Then 빌더, `readiness` 체크리스트 점수, `change-trace` 순차 애니메이션. 고유 DOM/동작에 묶여 있어 재사용이 어렵다. 유사 효과는 위 범용 컴포넌트로 대체한다.

---

## 검증 체크리스트 (생성 후 필수)
- [ ] `node --check app.js`는 손대지 않았으니 통과 — app.js/styles.css는 수정 금지
- [ ] 모든 `<script type="application/json">` 블록이 `JSON.parse` 통과
- [ ] 모든 `data-detail` 버튼 키가 해당 그룹 JSON에 존재
- [ ] `id` 중복 없음, `data-scene` 00부터 순번
- [ ] 실수치엔 출처 명기, 예시수치엔 “세미나용 예시” 표기
- [ ] 등장 블록에 `.reveal` 부착, 네비 앵커 ↔ 섹션 `id` 일치
