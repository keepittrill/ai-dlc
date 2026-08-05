# 아키텍처 & 유지보수 규칙

AI-Native SE 세미나 사이트의 구조와 “오래 유지보수 가능하게” 지키는 규칙을 정리한다. 새 세미나를 추가하거나 손볼 때 이 문서를 먼저 본다.

## 큰 그림 — 메커니즘 vs 콘텐츠

```
/ (GitHub Pages 루트)
├── index.html            ← 허브. 세미나 목록은 <!-- SEMINARS:START/END --> 안에서만 관리
├── styles.css            ← 디자인 시스템: 테마 변수 + 범용 컴포넌트 라이브러리
├── app.js                ← 공유 메커니즘만 (테마·슬라이드·reveal·nav·dialog·quiz·범용 위젯)
├── seminar-<slug>.html   ← 세미나 1개 = 파일 1개. 콘텐츠 + 인라인 JSON 자급자족
├── docs/                 ← 이 문서들
└── .claude/skills/seminar-builder/  ← 자료→세미나 생성 스킬
```

**한 문장 원칙:** *공유 파일은 “어떻게 동작하는가”(메커니즘)만 담고, 각 세미나 HTML은 “무엇을 말하는가”(콘텐츠+데이터)를 자급자족한다.*

- `app.js`에는 어떤 세미나의 문구·수치·데이터도 없다. 인터랙션 데이터는 각 페이지의 `<script type="application/json">`에 인라인으로 들어간다.
- `styles.css`에는 세미나별 전용 스타일이 없다. 모든 컴포넌트는 범용 클래스이고 5개 테마 변수로 렌더된다.
- 따라서 **새 세미나 추가 = `seminar-<slug>.html` 1개 생성 + 허브 마크영역 편집.** 공유 파일은 건드리지 않는다.

## 파일 책임 경계

| 파일 | 담는 것 | 담지 않는 것 |
|---|---|---|
| `app.js` | 이벤트 배선, 범용 위젯 로직 | 세미나 문구·데이터 |
| `styles.css` | 테마 변수, 범용 컴포넌트 | 세미나 전용 스타일, 하드코딩 색상 |
| `seminar-*.html` | 콘텐츠, 인라인 JSON 데이터 | 새 CSS/JS |
| `index.html` | 허브·테마 갤러리·세미나 목록 | — |

## 테마 (5종)

`styles.css`의 `[data-theme="…"]` 변수 블록만 추가하면 전 컴포넌트에 자동 적용된다.
`command`(다크 콘솔) · `editorial`(스위스 라이트) · `flow`(인디고, 기본) · `paper`(문서 라이트) · `blueprint`(설계도면 라이트).
새 테마 추가법: (1) 변수 블록 추가, (2) 라이트/다크면 `::before` 격자색·`.ambient` opacity 보정, (3) `app.js`의 `themeOrder`·토스트 맵에 키 추가, (4) 세미나 헤더 스위처 버튼·허브 갤러리 프리뷰 추가. 세미나를 특정 디자인에 고정하려면 `<body class="…-seminar">`로 잠근다(app.js의 `fixedDesign`).

## 인터랙티브 위젯 (데이터는 페이지에)

- **myth-card** O/X 퀴즈 — 자동 배선. 마크업만 있으면 됨.
- **detail-group** 상세 패널(탭/목록/탐험기) — 버튼 `data-detail` + `<script data-detail-json="GROUP">` 인라인 JSON.
- **impact-group** 모듈 하이라이트 — `data-impact` + `<script data-impact-json="GROUP">`.
자세한 규약과 필드는 [COMPONENTS.md](COMPONENTS.md) / 스킬의 `references/components.md`.

## 유지보수 규칙 (지킬 것)

1. **세미나별 CSS 금지.** 필요한 외형은 이미 있는 범용 클래스로. 없으면 `styles.css`에 범용 클래스로 1회 추가하고 카탈로그에 등재.
2. **공유 파일에 콘텐츠 금지.** 세미나 데이터는 항상 그 페이지의 인라인 JSON.
3. **색/폰트/radius 하드코딩 금지.** 테마 변수 사용.
4. **허브 목록은 마크영역 안에서만.** 드리프트 방지.
5. **사실 규율.** 실수치엔 출처, 예시엔 “세미나용 예시”.
6. **커밋 규약.** Conventional Commits, `Co-Authored-By` 금지 (CLAUDE.md).

## 새 세미나 만들기

자료(md/txt/폴더)가 있으면 **seminar-builder 스킬**을 쓴다: `/seminar-builder <자료 경로>`. 스킬이 자료를 읽어 설득 아크로 구성하고 `seminar-<slug>.html`을 생성한 뒤 허브에 등록한다. 수동으로 만들 때도 `references/page-template.html` 골격 + `COMPONENTS.md` 컴포넌트만 사용한다.
