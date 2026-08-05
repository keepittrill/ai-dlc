# 컴포넌트 카탈로그

세미나 페이지를 구성하는 범용 컴포넌트 목록이다. 전체 스니펫·필드 규약·검증 체크리스트는 **정본**인 스킬 레퍼런스에 있다:

➡️ [`.claude/skills/seminar-builder/references/components.md`](../.claude/skills/seminar-builder/references/components.md)

이 문서는 사람이 빠르게 훑는 요약이다. 실제 페이지를 조립할 때는 위 정본을 사용한다.

## 정적 컴포넌트 (JS 불필요)
- **chapter-head / section-number / stage-takeaway** — 장면 골격과 소제목·한 줄 정리
- **case-intro** — 사례/스토리 카드 (배지 + 본문)
- **case-link** — 📎 콜아웃 (사례 연결·안내)
- **role-boundary** — 3열 카드
- **two-paths** — 2열 비교
- **test-split** — 2열 리스트 비교
- **era-track** — 4열 타임라인
- **quality-checks** — 칩 목록(+설명)
- **aidlc-dialog** — 대화 재현
- **roadmap** — 3열 실행 계획
- **traceability** — 연결 체인
- **final-statement** — 클로징
- **source-grid** — 출처 그리드

## 인터랙티브 (자동 배선 / 인라인 JSON)
- **myth-card** — O/X 퀴즈. 자동 배선(코드 추가 불필요).
- **detail-group** — 버튼 그룹 → 상세 패널. 데이터는 `<script data-detail-json="GROUP">` 인라인 JSON. 탭 콘솔·클릭 목록·실패 탐험기에 두루 사용.
- **impact-group** — 다이어그램 모듈 하이라이트. `<script data-impact-json="GROUP">`.

## 피해야 할 것 (특정 세미나 전용)
`prompt-lab`, GWT 빌더, `readiness` 체크리스트, `change-trace` 애니메이션 — 고유 동작에 묶여 재사용이 어렵다. 유사 효과는 위 범용 컴포넌트로.

## 원칙
- 세미나별 CSS 금지 · 색/폰트/radius 하드코딩 금지 (테마 변수 사용)
- 새 컴포넌트는 `styles.css`에 범용 클래스로 1회 추가 후 정본 카탈로그에 등재

전체 구조 규칙은 [ARCHITECTURE.md](ARCHITECTURE.md) 참고.
