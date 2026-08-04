# AI-Native Software Engineering Seminar

GitHub Pages에 바로 배포할 수 있는 순수 HTML/CSS/JavaScript 세미나 사이트입니다. 기존 이론 중심 세미나와 이론에서 실무로 확장되는 Field Edition을 모두 포함합니다.

## 구성

- `index.html` — 기존 버전과 Field Edition 선택 화면
- `seminar.html` — 실사례 3개(Amazon Bedrock 76일 · 사내 팀 실화 · 고객지원 Copilot 핸즈온)가 뼈대인 설득형 세미나. AI-DLC 해부, 실패 시나리오 탐험기, O/X 퀴즈, 준비도 진단 포함
- `seminar-field.html` — 이론 → Living Spec.md → Evolvable Design → System-Level Validation → End-to-End Control 확장판
- `styles.css` — 세 가지 테마와 반응형 스타일
- `app.js` — 테마 전환, 슬라이드 모드, 요구사항 빌더, 준비도 진단, 실패 시나리오 탐험, 변경 영향 시뮬레이션

## GitHub Pages 배포

1. 이 폴더의 파일 여섯 개를 GitHub 저장소 루트에 업로드합니다.
2. 저장소의 **Settings → Pages**로 이동합니다.
3. **Deploy from a branch**를 선택합니다.
4. `main` 브랜치와 `/ (root)` 폴더를 선택하고 저장합니다.
5. 표시되는 GitHub Pages 주소를 엽니다.

빌드 도구나 외부 라이브러리가 필요하지 않습니다.

## 조작법

- 기존 버전 상단의 `01`, `02`, `03`: 디자인 전환
- `T`: 다음 디자인
- `P`: 슬라이드 모드 — 한 화면에 한 장면, 방향키로 이동
- `?`: 키보드 도움말
- `Esc`: 열린 창 닫기

Field Edition에서는 명세 파일 탐색, 변경 영향 시뮬레이션, 전체 변경 통제 루프를 직접 조작할 수 있습니다.
