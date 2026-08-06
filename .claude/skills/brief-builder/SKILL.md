---
name: brief-builder
description: >-
  Turn source material into a "Tech Brief" — a HYBRID page that sits between a
  seminar deck and a wiki doc: moderately flashy (gradient hero, count-up stat
  tiles, feature grid, pull quote, numbered steps, CTA band, scroll-reveal) yet
  readable (sticky ToC, prose sections, info/note/warning/tip/error panels, tables,
  expand, code, light/dark). Use when the user wants something "적당히 화려하고
  적당하게 글도 있는" / 브리프 / 리포트 / 한 장 요약 / 랜딩형 문서 — richer than a plain
  doc but lighter than a full presentation. Reuses doc.css + doc.js AND brief.css +
  brief.js unchanged; writes one self-contained brief-<slug>.html and registers it
  in the docs hub (docs.html). This is the integrated middle track between
  seminar-builder (deck) and doc-builder (wiki).
---

# brief-builder

세미나 덱(화려함)과 위키 문서(읽는 구조)의 **중간 형식** — "테크 브리프"를 만든다.
_적당히 화려하고, 적당히 글도 있는_ 한 장짜리 설득형 문서. 발표가 필요하면 `seminar-builder`, 순수 참조 문서면 `doc-builder`를 쓴다.

## 통합 방식 (핵심)

브리프는 **두 레이어를 겹쳐** 만든다. 네 파일 모두 **수정하지 않고 재사용**한다:
- `doc.css` + `doc.js` — 읽는 구조: 본문 타이포, ToC 자동생성·스크롤스파이, 패널·표·expand·코드복사, 읽는시간, 라이트/다크 토글.
- `brief.css` + `brief.js` — 화려함: 히어로, 스탯 카운트업, 피처 그리드, 풀쿼트, 단계, CTA 밴드, 스크롤 등장, 읽기 진행 바.

로드 순서 고정: `doc.css` → `brief.css`, `doc.js` → `brief.js`.
산출물은 자급자족형 `brief-<slug>.html` 1개 + 허브(`docs.html`) 등록뿐이다.

먼저 `references/components.md`(카탈로그)와 `references/page-template.html`(골격)을 읽고, 예시 `brief-ai-native.html`을 참고한다.

## 1. 입력 수집

`*.md`/`*.txt`/폴더/붙여넣은 텍스트/변환한 docx·pdf. 불명확하면 질문(AskUserQuestion, 최대 2개): 제목, slug, 핵심 주장 1문장, 대상. 유추되면 진행하고 결과에 명시.

## 2. 콘텐츠 추출 (브리프 = 설득형 요약)

브리프는 위에서 아래로 읽는 **한 편의 설득 흐름**이다:
- **히어로 한 문장**: 브리프가 남길 단 하나의 메시지(제목의 `<em>`으로 강조)
- **스탯 3~4개**: 숫자로 말하는 핵심(카운트업). 실수치엔 출처, 예시엔 "문서용 예시".
- **왜(문제) → 무엇(핵심 3기둥, 피처 그리드) → 어떻게(단계/로드맵)**
- **패널**: 반드시 알 것(info)/주의(warning)/팁(tip)/금지(error)
- **표·풀쿼트·expand(반론 대응 등)**
- **CTA**: 독자가 취할 다음 한 걸음

## 3. 페이지 생성

1. `references/page-template.html`을 `brief-<slug>.html`로 복사하고 플레이스홀더 치환:
   `{{TITLE}}`, `{{DESC}}`, `{{EYEBROW}}`, `{{HERO_H1}}`, `{{LEAD}}`, `{{HERO_META}}`, `{{BREADCRUMB}}`, `{{BODY}}`, `{{CTA}}`.
2. **읽는 구조를 위한 규약(그대로 두면 doc.js가 자동 처리):**
   - 본문 헤딩은 **하나의 `<article class="wk-body">` 안에** 둔다 → ToC·읽는시간이 정확해진다.
   - ToC 자리표시자 `<div data-doc-toc></div>`(비움), 읽는시간 `<span data-doc-readtime>—</span>`, 테마 버튼 `data-doc-theme-toggle`.
   - **히어로와 CTA 밴드만 풀블리드**(`.wk-shell` 밖). 스탯·피처그리드·풀쿼트·단계는 본문 컬럼 안에 인라인으로 둔다.
3. **화려함 규약:**
   - 등장시킬 요소에 `data-reveal`(옵션 `data-reveal-delay="120"`, `data-reveal="left|zoom"`).
   - 카운트업 숫자는 `<span data-count="90" data-suffix="일">0</span>`(옵션 `data-prefix`).
   - 읽기 진행 바는 `<div class="br-progress" data-br-progress><i></i></div>`.
4. 라이트/다크는 `<html data-doc-theme="light">` 기본, 토글은 doc.js가 기억한다(코드 수정 불필요).

## 4. 허브 등록

`docs.html`의 `<!-- DOCS:START/END -->` 안에 문서 행 하나 추가(브리프는 🚀/📈 등 아이콘으로 구분 가능):
```html
<a class="wk-doc-row" href="brief-<slug>.html">
  <span class="wk-doc-icon">🚀</span>
  <div><h3>브리프 제목</h3><p>한 줄 설명 · Brief</p></div>
  <span class="wk-doc-go">→</span>
</a>
```

## 5. 검증 (필수)

- `node --check doc.js` · `node --check brief.js` (둘 다 수정 금지)
- 링크 순서: `doc.css`→`brief.css`, `doc.js`→`brief.js`
- 본문 헤딩이 **단일 `.wk-body`** 안에 있어 ToC/읽는시간이 잡히는지
- `data-count`/`data-reveal`/`data-doc-*` 훅 존재, `id` 중복 없음
- 브라우저: 히어로 등장·카운트업·진행 바·ToC 스파이·코드복사·라이트/다크·패널 표시

## 6. 커밋
Conventional Commits, **`Co-Authored-By` 금지**, Claude/AI 언급 금지. 예: `docs: add <topic> tech brief`.

## 절대 규칙
- `doc.css`·`doc.js`·`brief.css`·`brief.js` 수정 금지. 세미나 트랙(`styles.css`·`app.js`·`seminar-*.html`·`index.html`)과 기존 스킬(`seminar-builder`·`doc-builder`)도 건드리지 않는다.
- 브리프별 전용 CSS/JS 금지 — 기존 `wk-*`/`br-*` 클래스만. 색/폰트/radius 하드코딩 금지.
- 새 외형이 꼭 필요하면 사용자에게 알리고 `brief.css`에 범용 `br-*` 클래스로 1회 추가 후 `references/components.md`에 등재.
- 실수치엔 출처, 예시엔 "문서용 예시" 표기.
