# AI-Native Software Engineering Seminar

GitHub Pages에 바로 배포할 수 있는 순수 HTML/CSS/JavaScript **멀티 세미나 플랫폼**입니다. 허브(`index.html`)에서 여러 세미나를 고르고, 각 세미나는 5개 테마와 슬라이드 모드를 공유합니다. 자료(md/txt)만 주면 같은 포맷의 새 세미나를 생성하는 스킬(`seminar-builder`)이 포함되어 있습니다.

## 구성

- `index.html` — 세미나 허브(선택 화면). 새 세미나는 `<!-- SEMINARS -->` 마크 영역에 등록됩니다.
- `seminar.html` — 실사례 3개(Amazon Bedrock 76일 · 사내 팀 실화 · 고객지원 Copilot 핸즈온)가 뼈대인 설득형 세미나
- `seminar-field.html` — 이론 → 명세 → 설계 → 시스템 검증 → 통제 확장판
- `seminar-dev.html` — 개발자 실무 버전
- `styles.css` — 5개 테마와 범용 컴포넌트 라이브러리, 반응형
- `app.js` — 공유 메커니즘(테마·슬라이드·reveal·nav·dialog·퀴즈·범용 데이터 위젯). 세미나별 콘텐츠는 담지 않음
- `docs/` — [ARCHITECTURE.md](docs/ARCHITECTURE.md)(구조·유지보수 규칙), [COMPONENTS.md](docs/COMPONENTS.md)(컴포넌트 카탈로그)
- `.claude/skills/seminar-builder/` — 자료→세미나 생성 스킬

## 새 세미나 만들기

자료(md/txt 파일 또는 폴더)를 주고 `seminar-builder` 스킬을 실행하면, 자료를 읽어 설득 아크로 구성한 `seminar-<slug>.html`을 생성하고 허브에 등록합니다. 공유 파일(`styles.css`/`app.js`)은 수정하지 않습니다. 구조와 규칙은 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) 참고.

## 5개 테마

`01` Command Center(다크) · `02` Swiss Editorial(라이트) · `03` Evidence Flow(인디고, 기본) · `04` Docs Light(밝은 문서) · `05` Engineering Blueprint(설계도면). 상단 스위처 또는 `T` 키로 전환.

## GitHub Pages 배포

1. 이 폴더의 HTML/CSS/JS 파일을 GitHub 저장소 루트에 업로드합니다.
2. 저장소의 **Settings → Pages**로 이동합니다.
3. **Deploy from a branch**를 선택합니다.
4. `main` 브랜치와 `/ (root)` 폴더를 선택하고 저장합니다.
5. 표시되는 GitHub Pages 주소를 엽니다.

빌드 도구나 외부 라이브러리가 필요하지 않습니다.

## 조작법

- 상단의 `01`~`05`: 디자인(테마) 전환
- `T`: 다음 디자인
- `P`: 슬라이드 모드 — 한 화면에 한 장면, 방향키로 이동
- `?`: 키보드 도움말
- `Esc`: 열린 창 닫기

Field Edition에서는 명세 파일 탐색, 변경 영향 시뮬레이션, 전체 변경 통제 루프를 직접 조작할 수 있습니다.
