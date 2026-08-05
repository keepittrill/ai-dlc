---
name: seminar-builder
description: >-
  Turn source material (md/txt files, a docs folder, or pasted notes) into a new
  persuasive, interactive seminar page in this repo's format — 5 themes, slide mode,
  quizzes, and data-driven widgets. Use when the user says "make a seminar / 세미나 만들어 /
  세미나로 만들어줘 / 발표자료 만들어" and points at material, or asks to add another seminar to
  the hub. Reuses styles.css + app.js unchanged; writes one self-contained seminar-<slug>.html
  and registers it in the hub.
---

# seminar-builder

이 저장소(정적 세미나 사이트)의 포맷으로 **자료(md/txt/폴더/붙여넣은 노트)를 받아 새 세미나 페이지를 생성**한다.
핵심 계약: **`styles.css`와 `app.js`는 절대 수정하지 않는다.** 산출물은 자급자족형 `seminar-<slug>.html` 1개 + 허브(`index.html`) 등록뿐이다.

먼저 `references/components.md`(컴포넌트 카탈로그)와 `references/page-template.html`(페이지 골격)을 읽고, 이 저장소의 `docs/ARCHITECTURE.md`(구조 규칙)를 확인한다.

## 1. 입력 수집 (md/docs 자동 처리)

입력은 다음 어떤 형태든 받는다:
- 파일 경로 하나 또는 여러 개: `*.md`, `*.txt`, `*.markdown`
- 폴더 경로: 폴더 안의 md/txt를 모두 읽는다(예: `docs/topics/.../<topic>/`의 index·notes·resources·questions·practice).
- 대화에 붙여넣은 텍스트.
- `.docx`/`.pdf`: 텍스트 추출이 필요하면 먼저 변환(가능한 도구로)하거나, 사용자에게 텍스트/마크다운으로 달라고 요청.

읽은 뒤 다음이 **불명확하면 질문**(AskUserQuestion, 최대 2개): 제목, slug(파일명), 분량(분)·대상 청중, 톤. 자료에서 충분히 유추되면 묻지 말고 진행하고 결과에 명시한다.

## 2. 콘텐츠 추출 (자료 → 구조화)

자료를 정독하고 아래 스키마로 뽑는다. **사실 규율**: 출처가 있는 실수치는 출처와 함께 유지, 지어낸 예시 수치는 “세미나용 예시”로 표기, 없는 사실은 만들지 않는다.
- **핵심 주장 1문장** (세미나가 청중을 설득하려는 단 하나의 명제)
- **실사례**: 이름·수치·출처. 강력한 것부터. (설득의 뼈대)
- **대비쌍**: Before/After, 안티패턴/정석, 통념/사실
- **오해(myth)**: O/X 퀴즈로 만들 소재
- **단계/절차**: 탭 콘솔·타임라인·로드맵 소재
- **실습/시뮬레이션**: 청중이 눌러볼 상호작용 소재
- **출처 목록**: sources 장면용

## 3. 설득 아크 설계 (6~9 장면)

기본 골격(자료에 맞게 가감):
1. **Hero(약속)** — 무엇을 얻어 가는지 첫 문장에 약속
2. **WHY(공감)** — 청중의 현재 문제/통념 (era-track, contrast, myth-card)
3. **CASE(증거)** — 가장 강한 실사례 (case-intro + role-boundary 수치 + 반론 퀴즈)
4. **METHOD(방법)** — 개념 해부 (role-boundary, aidlc-dialog, two-paths, test-split, quality-checks)
5. **HANDS-ON(적용)** — 러닝 케이스 시뮬레이션 (detail-group 탭 콘솔, 실패 탐험 그리드)
6. **CHECKPOINT** — 표준/역량 등 보조 안전망 (필요 시)
7. **ACTION(행동 요청)** — 로드맵 + 클로징 (roadmap, stage-takeaway, final-statement)
8. **SOURCES** — source-grid

각 장면은 하나의 메시지만. 무겁지 않게 — 한 장면이 슬라이드 모드에서 한 화면에 들어오도록.

## 4. 페이지 생성

1. `references/page-template.html`을 읽어 `seminar-<slug>.html`로 만든다. 플레이스홀더 치환:
   - `{{TITLE}}`, `{{DESC}}`, `{{NAV_LINKS}}`(`<a href="#id">LABEL</a>` 반복, 데스크톱·모바일 동일), `{{AGENDA_ITEMS}}`(`<li><b>10분</b> …</li>`), `{{SECTIONS}}`(본문 장면들)
2. 본문은 `references/components.md`의 컴포넌트만 사용해 조립. 상호작용은 **정적 컴포넌트 + 자동 배선 myth-card** 우선, 탭/탐험기가 필요할 때만 `detail-group`(인라인 JSON) 사용.
3. **테마 선택.** `<body data-theme="…">`로 기본 테마를 주제에 맞게 지정한다 — SW·엔지니어링이면 `blueprint`, 밝은 문서형이면 `paper`, 몰입형이면 `flow`, 다크 콘솔이면 `command`, 고가독 편집형이면 `editorial`. 기본적으로 5테마 전환(스위처 + `T`)은 그대로 유지한다.
4. **테마 고정(선택).** 특정 디자인에 잠그려면 `<body>`에 `data-lock-theme` 속성만 추가한다(app.js의 `fixedDesign`가 인식 — 코드 수정 불필요). 그러면 스위처·`T`·URL 테마가 모두 무시되고 지정 테마로 고정된다.

## 5. 허브 등록

`index.html`의 `<nav class="seminar-menu">` 안, `<!-- SEMINARS:START/END -->` 마크 영역에 **컴팩트 메뉴 행** 하나를 추가한다(별도 라벨·큰 카드 금지 — 모든 세미나가 동일한 행 포맷):
```html
<!-- SEMINARS:START -->
<a class="seminar-card" href="seminar-<slug>.html">
  <span>TAG · 한 단어 분류</span>
  <h2>세미나 제목</h2>
  <p>한 줄 설명 · 핵심 키워드 · 분량 · 대상</p>
  <b>시작 →</b>
</a>
<!-- SEMINARS:END -->
```
`<span>`(모노 태그)/`<h2>`(제목)/`<p>`(한 줄)/`<b>`(화살표) 4개 직계 자식 구조를 지킨다. 허브는 “제목 위주” 메뉴이므로 카드 안에 큰 비주얼을 넣지 않는다.

## 6. 검증 (필수)

`references/components.md`의 “검증 체크리스트” 실행. 특히:
- `node --check app.js` (수정 안 했으니 통과해야 함)
- 모든 인라인 JSON `JSON.parse` 통과 + 모든 `data-detail` 버튼 키가 JSON에 존재
- `id` 중복 없음, `data-scene` 순번, `.reveal` 부착, 네비 앵커 ↔ `id` 일치
- 브라우저로 열어 5테마(T)·슬라이드 모드(P)·위젯 클릭 확인(가능하면)

## 7. 커밋

`CLAUDE.md` 규약 준수: Conventional Commits, **`Co-Authored-By` 금지**, Claude/AI 언급 금지. 예: `feat: add <topic> seminar generated from <source>`.

## 절대 규칙
- `styles.css`·`app.js` 수정 금지. 새 외형이 꼭 필요하면 사용자에게 알리고 `styles.css`에 범용 클래스로 1회 추가 후 `references/components.md`에 등재.
- 색/폰트/radius 하드코딩 금지 — 테마 변수 기반 기존 클래스만.
- 실수치엔 출처, 예시엔 “예시” 표기.
