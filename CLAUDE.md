# CLAUDE.md

## 프로젝트 개요

AI-Native Software Engineering 세미나용 정적 사이트입니다.

- 순수 HTML/CSS/JavaScript — 빌드 도구·외부 라이브러리 없음
- `main` 브랜치 루트에서 GitHub Pages로 바로 배포됨
- `index.html`(선택 화면) → `seminar.html`(기존판) / `seminar-field.html`(Field Edition), 공용 `styles.css` + `app.js`

## 커밋 규칙 (`/commit-guide`)

- Conventional Commits 형식을 따른다.
- 학습 커밋 타입: `learn:`, `practice:`, `docs:`
- **`Co-Authored-By` 라인은 절대 추가하지 않는다.**
- 커밋 메시지에 Claude/AI 관련 내용을 포함하지 않는다.
- 커밋 작성자는 이 저장소의 local git 설정(LK)을 그대로 사용한다.

## 코드 규칙

- 코드·문서에도 Claude/AI 생성 관련 표기를 남기지 않는다.
- `app.js`는 세 페이지가 공유하는 단일 IIFE — 요소가 없는 페이지에서도 동작하도록 null 가드(옵셔널 체이닝) 패턴을 유지한다.
- 새 UI 컴포넌트 스타일은 기존 테마 CSS 변수(`--accent`, `--line`, `--surface` 등)를 사용해 3개 테마 모두에서 동작하게 한다.
