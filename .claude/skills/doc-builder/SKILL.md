---
name: doc-builder
description: >-
  Turn source material (md/txt files, a docs folder, or pasted notes) into a
  Confluence/wiki-style TECHNICAL DOCUMENT in this repo's docs track — sticky
  table of contents, breadcrumb, page metadata (author/date/reading-time/labels),
  info/note/warning/tip/error panels, expand macros, copyable code blocks, tables,
  status lozenges, light/dark. Use when the user wants a READABLE reference doc /
  위키 문서 / Confluence 느낌 문서 / 기술 문서 rather than a presentation deck. Reuses
  doc.css + doc.js unchanged; writes one self-contained doc-<slug>.html and registers
  it in the docs hub (docs.html). This is the docs counterpart to seminar-builder.
---

# doc-builder

이 저장소의 **문서(위키) 트랙** 포맷으로, 자료를 받아 Confluence 느낌의 **읽는 기술 문서**를 생성한다.
발표용 슬라이드 덱이 필요하면 대신 `seminar-builder` 스킬을 쓴다 — 이 스킬은 **읽고·검색하고·링크로 공유하는 참조 문서**를 만든다.

핵심 계약: **`doc.css`와 `doc.js`는 절대 수정하지 않는다.** 또한 세미나 트랙(`styles.css`·`app.js`·기존 `seminar-*.html`·`index.html`)도 건드리지 않는다.
산출물은 자급자족형 `doc-<slug>.html` 1개 + 문서 허브(`docs.html`) 등록뿐이다.

먼저 `references/components.md`(컴포넌트 카탈로그)와 `references/page-template.html`(페이지 골격)을 읽고, 예시 문서 `doc-ai-dlc.html`을 참고한다.

## 1. 입력 수집

- 파일 경로 하나/여럿: `*.md`, `*.txt`, `*.markdown`
- 폴더 경로: 안의 md/txt 모두 읽기
- 대화에 붙여넣은 텍스트
- `.docx`/`.pdf`: 텍스트로 변환 후 진행하거나 사용자에게 텍스트를 요청

읽은 뒤 **불명확하면 질문**(AskUserQuestion, 최대 2개): 제목, slug(파일명), 브레드크럼 경로, 라벨. 자료에서 유추되면 묻지 말고 진행하고 결과에 명시한다.

## 2. 콘텐츠 추출 (자료 → 문서 구조)

문서는 "설득 아크"가 아니라 **참조용 정보 구조**다. 아래로 뽑는다:
- **제목 + 한 줄 요약**(브레드크럼 마지막 노드)
- **개요**(문서가 답하는 질문 1~2문장)
- **섹션 h2/h3 트리**(ToC가 여기서 자동 생성됨 — 목차를 잘 짓는다는 건 h2/h3를 잘 나눈다는 뜻)
- **패널 소재**: 반드시 알아야 할 것(info) / 참고(note) / 주의(warning) / 팁(tip) / 금지(error)
- **표 소재**: 비교·매트릭스·체크리스트
- **코드/명령어**: 코드블록(복사 지원)
- **접어둘 상세**: expand 매크로 소재
- **상태값**: status 로젠지(예: 필수/권장/조건부)

**사실 규율**: 출처 있는 실수치는 출처와 함께, 지어낸 예시는 "문서용 예시"로 표기, 없는 사실은 만들지 않는다.

## 3. 페이지 생성

1. `references/page-template.html`을 `doc-<slug>.html`로 복사하고 플레이스홀더를 치환한다:
   `{{TITLE}}`, `{{DESC}}`, `{{BREADCRUMB}}`, `{{META}}`(작성자·수정일·라벨), `{{BODY}}`(본문).
2. 본문은 `references/components.md`의 컴포넌트만 조합한다. **문서별 CSS/JS를 새로 쓰지 않는다.**
3. **ToC·읽는시간·코드 복사·헤딩 앵커·스크롤 스파이는 `doc.js`가 자동 처리**한다 — 마크업만 규약대로 두면 된다:
   - 본문 컨테이너는 `<article class="wk-body">`. 그 안의 `h2`/`h3`가 ToC가 된다.
   - ToC 자리표시자는 `<div data-doc-toc></div>`(내용 비움). 읽는시간은 `<b data-doc-readtime>—</b>`.
   - 테마 토글 버튼은 `data-doc-theme-toggle`.
4. 라이트/다크는 `<html data-doc-theme="light">`가 기본이며 사용자가 토글로 바꾸면 기억된다(코드 수정 불필요).

## 4. 허브 등록

`docs.html`의 `<!-- DOCS:START/END -->` 마크 영역 안에 **문서 행 하나**를 추가한다(포맷 고정):
```html
<!-- DOCS:START -->
<a class="wk-doc-row" href="doc-<slug>.html">
  <span class="wk-doc-icon">📘</span>
  <div>
    <h3>문서 제목</h3>
    <p>한 줄 설명 · 핵심 키워드</p>
  </div>
  <span class="wk-doc-go">→</span>
</a>
<!-- DOCS:END -->
```
아이콘 이모지 1개 / `<h3>` 제목 / `<p>` 한 줄 / `→` 4요소 구조를 지킨다.

## 5. 검증 (필수)

`references/components.md`의 "검증 체크리스트" 실행. 특히:
- `node --check doc.js` (수정 안 했으니 통과해야 함) — `doc.css`/`doc.js`는 절대 수정 금지
- `id` 중복 없음(수동 지정한 경우), 네비/앵커가 있으면 대상 존재
- 브라우저로 열어 ToC 자동생성·스크롤 스파이·코드 복사·라이트/다크 토글·패널 5종 표시 확인
- 모바일 폭에서 ToC 접힘 토글 동작

## 6. 커밋

`CLAUDE.md` 규약 준수: Conventional Commits, **`Co-Authored-By` 금지**, Claude/AI 언급 금지.
예: `docs: add <topic> reference doc in docs track`.

## 절대 규칙
- `doc.css`·`doc.js` 수정 금지. 세미나 트랙(`styles.css`·`app.js`·`seminar-*.html`·`index.html`) 및 기존 `seminar-builder` 스킬도 건드리지 않는다.
- 문서별 전용 CSS/JS 금지 — `doc.css` 토큰 기반 기존 클래스(`wk-*`)만 사용. 색/폰트/radius 하드코딩 금지.
- 새 외형이 꼭 필요하면 사용자에게 알리고 `doc.css`에 범용 `wk-*` 클래스로 1회 추가한 뒤 `references/components.md`에 등재.
- 실수치엔 출처, 예시엔 "문서용 예시" 표기.
