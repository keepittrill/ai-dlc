# CLAUDE.md

## 프로젝트 개요

AI-Native Software Engineering **멀티 세미나 플랫폼**(정적 사이트)입니다.

- 순수 HTML/CSS/JavaScript — 빌드 도구·외부 라이브러리 없음
- `main` 브랜치 루트에서 GitHub Pages로 바로 배포됨
- `index.html`(허브) → `seminar-*.html`(세미나들), 공용 `styles.css` + `app.js` + 5개 테마
- 구조·유지보수 규칙은 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), 컴포넌트는 [docs/COMPONENTS.md](docs/COMPONENTS.md)

## 새 세미나 추가

- 자료(md/txt/폴더)로 새 세미나를 만들 때는 **seminar-builder 스킬**을 사용한다(`.claude/skills/seminar-builder/`).
- 핵심 규칙: **`styles.css`·`app.js`는 수정하지 않는다.** 세미나 = 자급자족형 `seminar-<slug>.html` 1개 + 허브 마크영역 등록.
- 세미나별 CSS 금지, 색/폰트/radius 하드코딩 금지(테마 변수 사용), 인터랙션 데이터는 페이지 인라인 JSON.

## 커밋 규칙 (`/commit-guide`)

- Conventional Commits 형식을 따른다.
- 학습 커밋 타입: `learn:`, `practice:`, `docs:`
- **`Co-Authored-By` 라인은 절대 추가하지 않는다.**
- 커밋 메시지에 Claude/AI 관련 내용을 포함하지 않는다.
- 커밋 작성자는 이 저장소의 local git 설정(LK)을 그대로 사용한다.

## 코드 규칙

- 코드·문서에도 Claude/AI 생성 관련 표기를 남기지 않는다.
- `app.js`는 모든 페이지가 공유하는 단일 IIFE로 **메커니즘만** 담는다(세미나 콘텐츠·데이터 금지). 요소가 없는 페이지에서도 동작하도록 null 가드(옵셔널 체이닝) 패턴을 유지한다.
- 새 UI 컴포넌트 스타일은 기존 테마 CSS 변수(`--accent`, `--line`, `--surface` 등)를 사용해 5개 테마 모두에서 동작하게 한다. 세미나별 전용 CSS는 만들지 않는다.
- 인터랙션 데이터(탭·탐험기 등)는 각 페이지의 `<script type="application/json">` 인라인 JSON에 둔다. app.js의 범용 위젯(detail-group/impact-group/myth-card)이 읽는다.
