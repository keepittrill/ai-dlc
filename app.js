(() => {
  const body = document.body;
  const themeOrder = ["command", "editorial", "flow", "paper", "blueprint"];
  const fixedDesign = body.classList.contains("field-seminar") || body.classList.contains("dev-seminar");
  const params = new URLSearchParams(location.search);
  const requestedTheme = params.get("theme");
  if (!fixedDesign && themeOrder.includes(requestedTheme)) body.dataset.theme = requestedTheme;

  const themeButtons = [...document.querySelectorAll("[data-set-theme]")];
  function setTheme(theme, announce = true) {
    if (fixedDesign || !themeOrder.includes(theme)) return;
    body.dataset.theme = theme;
    themeButtons.forEach(button => button.classList.toggle("active", button.dataset.setTheme === theme));
    try { localStorage.setItem("ai-native-theme", theme); } catch (_) {}
    if (announce) showToast({ command: "01 · Command Center", editorial: "02 · Swiss Editorial", flow: "03 · Evidence Flow", paper: "04 · Docs Light", blueprint: "05 · Engineering Blueprint" }[theme]);
  }
  setTheme(body.dataset.theme || "flow", false);
  themeButtons.forEach(button => button.addEventListener("click", () => setTheme(button.dataset.setTheme)));

  const toast = document.getElementById("toast");
  let toastTimer;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
  }

  const progressBar = document.getElementById("progressBar");
  function updateProgress() {
    if (!progressBar) return;
    const scrollable = document.documentElement.scrollHeight - innerHeight;
    progressBar.style.width = `${scrollable > 0 ? (scrollY / scrollable) * 100 : 0}%`;
  }
  addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("visible"); });
    }, { threshold: .12, rootMargin: "0px 0px -5%" });
    revealItems.forEach(item => revealObserver.observe(item));
  } else revealItems.forEach(item => item.classList.add("visible"));

  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...document.querySelectorAll(".desktop-nav a")];
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`));
    }, { threshold: [0.25,.45,.65] });
    sections.forEach(section => sectionObserver.observe(section));
  }

  const scenes = [...document.querySelectorAll("main .scene")];
  const slideCounter = document.createElement("div");
  slideCounter.className = "slide-counter";
  if (scenes.length) document.body.appendChild(slideCounter);
  function nearestScene() {
    return scenes.reduce((best, scene) => Math.abs(scene.getBoundingClientRect().top) < Math.abs(best.getBoundingClientRect().top) ? scene : best, scenes[0]);
  }
  function updateSlideCounter() {
    if (!scenes.length || !body.classList.contains("presenter")) return;
    slideCounter.textContent = `${String(scenes.indexOf(nearestScene()) + 1).padStart(2, "0")} / ${String(scenes.length).padStart(2, "0")}`;
  }
  addEventListener("scroll", updateSlideCounter, { passive: true });

  const menuButton = document.getElementById("menuButton");
  const mobileMenu = document.getElementById("mobileMenu");
  menuButton?.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("open");
    mobileMenu.setAttribute("aria-hidden", String(!open));
  });
  mobileMenu?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    mobileMenu.classList.remove("open"); mobileMenu.setAttribute("aria-hidden", "true");
  }));

  document.querySelectorAll("[data-open-dialog]").forEach(button => button.addEventListener("click", () => {
    document.getElementById(button.dataset.openDialog)?.showModal();
  }));
  document.querySelectorAll("[data-close-dialog]").forEach(button => button.addEventListener("click", () => button.closest("dialog")?.close()));
  document.querySelectorAll("dialog").forEach(dialog => dialog.addEventListener("click", event => {
    if (event.target === dialog) dialog.close();
  }));

  const presentButton = document.getElementById("presentButton");
  function togglePresenter() {
    body.classList.toggle("presenter");
    presentButton?.classList.toggle("active", body.classList.contains("presenter"));
    if (body.classList.contains("presenter")) {
      nearestScene()?.scrollIntoView();
      updateSlideCounter();
      showToast("슬라이드 모드 ON · 방향키로 이동");
    } else {
      showToast("슬라이드 모드 OFF");
    }
  }
  presentButton?.addEventListener("click", togglePresenter);

  document.querySelectorAll(".myth-card").forEach(card => {
    const button = card.querySelector("button");
    const answer = card.querySelector("[data-quiz-answer]");
    if (!button || !answer) return;
    button.addEventListener("click", () => {
      const willShow = answer.hidden;
      answer.hidden = !willShow;
      button.textContent = willShow ? "다시 닫기" : "정답 확인";
    });
  });

  // Generic detail-panel widget — reusable across seminars, data lives in each page's
  // inline JSON (<script type="application/json" data-detail-json="GROUP">). Keeps app.js
  // content-free: shared mechanism only. See docs/COMPONENTS.md.
  document.querySelectorAll("[data-detail-group]").forEach(group => {
    const key = group.dataset.detailGroup;
    const dataEl = document.querySelector(`script[data-detail-json="${key}"]`);
    const target = group.querySelector("[data-detail-target]") || document.getElementById(group.dataset.detailTarget);
    if (!dataEl || !target) return;
    let data; try { data = JSON.parse(dataEl.textContent); } catch (_) { return; }
    const buttons = [...group.querySelectorAll("[data-detail]")];
    buttons.forEach(button => button.addEventListener("click", () => {
      const entry = data[button.dataset.detail];
      if (!entry) return;
      buttons.forEach(b => b.classList.remove("active"));
      button.classList.add("active");
      let html = "";
      if (entry.label) html += `<span>${entry.label}</span>`;
      if (entry.head) html += `<b>${entry.head}</b>`;
      if (entry.title) html += `<h3>${entry.title}</h3>`;
      if (entry.copy) html += `<p>${entry.copy}</p>`;
      if (entry.tags) html += `<div class="case-tags">${entry.tags.map(t => `<b>${t}</b>`).join("")}</div>`;
      if (entry.columns) html += `<div class="f-grid">${entry.columns.map(c => `<div><span>${c.head}</span><p>${c.body}</p></div>`).join("")}</div>`;
      if (entry.code) html += `<div><span>${entry.name || ""}</span><b>${entry.badge || "LIVE"}</b></div><pre><code>${entry.code}</code></pre>`;
      target.innerHTML = html;
      if (entry.toast) showToast(entry.toast);
    }));
  });

  const promptLab = document.querySelector(".prompt-lab");
  const transformButton = document.getElementById("transformPrompt");
  transformButton?.addEventListener("click", () => {
    promptLab.classList.toggle("transformed");
    transformButton.querySelector("b").textContent = promptLab.classList.contains("transformed") ? "✓" : "→";
    showToast(promptLab.classList.contains("transformed") ? "모호한 요청을 검증 가능한 명세로 전환했습니다." : "원래 프롬프트로 돌아갑니다.");
  });

  const requirementInputs = ["givenInput","whenInput","thenInput"].map(id => document.getElementById(id));
  const requirementOutput = document.getElementById("requirementOutput");
  function updateRequirement() {
    if (!requirementOutput || requirementInputs.some(input => !input)) return;
    requirementOutput.textContent = `Given ${requirementInputs[0].value}, When ${requirementInputs[1].value}, Then ${requirementInputs[2].value}.`;
  }
  requirementInputs.forEach(input => input?.addEventListener("input", updateRequirement));
  updateRequirement();
  document.getElementById("copyRequirement")?.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(requirementOutput.textContent); showToast("요구사항을 복사했습니다."); }
    catch (_) { showToast("브라우저에서 복사를 허용하지 않았습니다."); }
  });

  const checklist = document.getElementById("readinessChecklist");
  const scoreNumber = document.getElementById("scoreNumber");
  const scoreLabel = document.getElementById("scoreLabel");
  const scoreBar = document.getElementById("scoreBar");
  function updateScore() {
    if (!checklist) return;
    const score = checklist.querySelectorAll("input:checked").length;
    scoreNumber.textContent = score;
    scoreBar.style.width = `${score / 8 * 100}%`;
    scoreLabel.textContent = score <= 2 ? "개인 실험 단계 · 기준부터 만드세요" : score <= 5 ? "팀 표준화 단계 · 추적성과 자동화를 강화하세요" : score <= 7 ? "운영 준비 단계 · 고위험 통제를 점검하세요" : "AI-Native Engineering Ready";
  }
  checklist?.addEventListener("change", updateScore);

  // Impact-map widget — highlight affected modules for a change type. Data in inline JSON
  // (<script type="application/json" data-impact-json="GROUP">). Content-free mechanism.
  document.querySelectorAll("[data-impact-group]").forEach(group => {
    const dataEl = document.querySelector(`script[data-impact-json="${group.dataset.impactGroup}"]`);
    const map = document.getElementById(group.dataset.impactTarget);
    const message = document.getElementById(group.dataset.impactMessage);
    if (!dataEl || !map) return;
    let data; try { data = JSON.parse(dataEl.textContent); } catch (_) { return; }
    const buttons = [...group.querySelectorAll("[data-impact]")];
    buttons.forEach(button => button.addEventListener("click", () => {
      const change = data[button.dataset.impact];
      if (!change) return;
      buttons.forEach(b => b.classList.remove("active"));
      button.classList.add("active");
      map.querySelectorAll("[data-module]").forEach(module => module.classList.toggle("affected", change.modules.includes(module.dataset.module)));
      if (message && change.message) message.innerHTML = `<b>${change.message[0]}</b>${change.message[1] || ""}`;
      if (change.toast) showToast(change.toast);
    }));
  });

  // Field edition: step through an end-to-end change control loop.
  const runChange = document.getElementById("runChange");
  const changeTrace = document.getElementById("changeTrace");
  let changeTimers = [];
  runChange?.addEventListener("click", () => {
    changeTimers.forEach(clearTimeout); changeTimers = [];
    const steps = [...changeTrace.querySelectorAll("li")];
    steps.forEach((step,index) => {
      step.classList.remove("active","done");
      step.querySelector("small").textContent = "WAITING";
      changeTimers.push(setTimeout(() => {
        steps.forEach(item => item.classList.remove("active"));
        step.classList.add("active");
        step.querySelector("small").textContent = "RUNNING";
        if (index > 0) {
          steps[index - 1].classList.add("done");
          steps[index - 1].querySelector("small").textContent = "EVIDENCE ✓";
        }
        if (index === steps.length - 1) {
          changeTimers.push(setTimeout(() => {
            step.classList.remove("active"); step.classList.add("done");
            step.querySelector("small").textContent = "RELEASE READY ✓";
            runChange.querySelector("b").textContent = "✓";
            showToast("변경 영향과 출시 증거가 끝까지 연결되었습니다.");
          }, 800));
        }
      }, index * 850));
    });
    runChange.querySelector("b").textContent = "…";
  });

  // Developer edition: artefact chain from the AI-DLC method definition paper (Section III.1).
  const artefacts = {
    intent: ["INTENT", "달성해야 할 것에 대한 상위 수준의 진술",
      "비즈니스 목표든 기능이든 기술적 결과(예: 성능 확장)든, AI가 실행 가능한 작업으로 분해하기 시작하는 출발점입니다. 사람의 목표와 AI가 만든 계획을 정렬시키는 기준점 역할을 합니다.",
      "오늘의 사례 → “상품군·국가별 환불 정책을 지원한다”"],
    unit: ["UNIT", "Intent에서 파생된, 측정 가능한 가치를 전달하는 자족적 작업 단위",
      "DDD의 서브도메인, Scrum의 에픽에 대응합니다. Unit들은 느슨하게 결합되어 자율적으로 개발하고 독립적으로 배포할 수 있어야 합니다. 분해는 AI가 하고 개발자·Product Owner가 검증·조정합니다.",
      "오늘의 사례 → ① 정책 저장·조회 ② 판정 엔진 교체 ③ 응답 계약 확장"],
    bolt: ["BOLT", "AI-DLC의 가장 작은 반복 — Sprint의 개명",
      "논문 Principle 7의 설명: Sprint는 AI 이전 시대에 보통 4~6주였습니다. AI-DLC의 반복은 시간·일 단위로 연속적이므로 “의도적으로 개명”했습니다. 하나의 Unit은 하나 이상의 Bolt로, 병렬 또는 순차로 실행됩니다.",
      "오늘의 사례 → KR·US 배포가 Bolt 1, EU DST 수정이 Bolt 2"],
    domain: ["DOMAIN DESIGN", "인프라와 무관하게 업무 로직만 모델링",
      "AI가 DDD 원칙으로 애그리게이트·값 객체·엔티티·도메인 이벤트·리포지토리·팩토리를 만듭니다. 기술 선택이 아직 등장하지 않는 단계라는 점이 중요합니다.",
      "오늘의 사례 → RefundPolicy(값 객체) · RefundPolicyEvaluator(순수 함수)"],
    logical: ["LOGICAL DESIGN", "NFR을 만족시키는 아키텍처 패턴을 입히고 ADR로 남긴다",
      "Domain Design을 확장해 비기능 요구사항을 충족시킵니다. CQRS, 서킷 브레이커 같은 패턴을 선택하고 AI가 ADR(아키텍처 결정 기록)을 작성하면 개발자가 검증합니다.",
      "오늘의 사례 → ADR-011 정책·LLM 분리 · 캐시 세대 무효화 · 배제 제약"],
    code: ["CODE + UNIT TESTS", "Logical Design에서 코드와 유닛 테스트를 생성",
      "AI 에이전트가 코드를 생성하고 유닛 테스트를 실행하며 결과를 분석해 수정안을 개발자에게 제시합니다. 논문은 이 단계에서도 실행 주체는 AI, 판정 주체는 사람이라고 못 박습니다.",
      "오늘의 사례 → 6장의 diff와 7장 01 UNIT 층"],
    deploy: ["DEPLOYMENT UNIT", "기능·보안·NFR·위험이 검증된 운영 산출물",
      "패키징된 실행 코드(컨테이너 이미지·서버리스 함수), 설정(Helm), 인프라(Terraform/CFN)를 포함합니다. AI가 기능·정적/동적 보안·부하 테스트를 생성하고, 사람이 시나리오를 조정한 뒤 AI가 실행·분석하며 실패 지점을 코드·설정·의존성 변경과 상관 짓습니다.",
      "오늘의 사례 → 9장 릴리스 증거 패키지와 Canary 워크플로"]
  };
  const artefactDetail = document.getElementById("artefactDetail");
  document.querySelectorAll("[data-artefact]").forEach(button => button.addEventListener("click", () => {
    document.querySelectorAll("[data-artefact]").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    const [label, title, copy, map] = artefacts[button.dataset.artefact];
    if (artefactDetail) artefactDetail.innerHTML = `<span>${label}</span><h3>${title}</h3><p>${copy}</p><b class="artefact-map">${map}</b>`;
  }));

  // Developer edition: clarifying-question accordion (Inception / Mob Elaboration).
  const questionButtons = [...document.querySelectorAll("[data-question]")];
  questionButtons.forEach(button => button.addEventListener("click", () => {
    const answer = button.nextElementSibling;
    if (!answer) return;
    const willShow = answer.hidden;
    answer.hidden = !willShow;
    button.classList.toggle("open", willShow);
  }));
  document.getElementById("revealAllQuestions")?.addEventListener("click", event => {
    const expand = questionButtons.some(button => button.nextElementSibling?.hidden);
    questionButtons.forEach(button => {
      if (button.nextElementSibling) button.nextElementSibling.hidden = !expand;
      button.classList.toggle("open", expand);
    });
    event.currentTarget.textContent = expand ? "전부 접기" : "전부 펼치기";
  });

  const missingList = document.getElementById("missingList");
  document.getElementById("revealMissing")?.addEventListener("click", event => {
    if (!missingList) return;
    missingList.hidden = false;
    missingList.classList.add("visible");
    event.currentTarget.remove();
    showToast("AI 목록 10개 + 사람이 찾은 6개 = 16개 파일");
  });

  // Developer edition: before / after / diff switch.
  document.querySelectorAll("[data-diff-view]").forEach(button => button.addEventListener("click", () => {
    const viewer = button.closest(".diff-viewer");
    if (!viewer) return;
    viewer.querySelectorAll("[data-diff-view]").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    viewer.querySelectorAll("[data-diff-pane]").forEach(pane => {
      pane.classList.toggle("active", pane.dataset.diffPane === button.dataset.diffView);
    });
  }));

  // Developer edition: validation ladder — each layer shows the actual command and output.
  const ladder = {
    unit: ["01 · UNIT", "정책 계산이 맞는가 — 빠르고 좁은 피드백",
      `$ ./gradlew :refund:test --tests '*RefundPolicyEvaluatorTest*'

RefundPolicyEvaluatorTest
  ✓ 배송완료일_당일_요청은_허용된다
  ✓ KST_7일째_23시59분_요청은_허용된다
  ✓ KST_8일째_00시00분_요청은_거절된다
  ✓ EU는_Europe_Berlin_자정으로_계산된다
  ✓ 정책버전이_결정에_그대로_실린다

BUILD SUCCESSFUL in 3s  ·  5 tests, 0 failures`,
      "이 층이 덮는 위험: 계산 로직. <b>덮지 못하는 위험:</b> 어떤 정책이 조회되는지, 응답이 어떻게 직렬화되는지, 캐시가 언제 갱신되는지. 1장의 사고는 이 층에서 <b>잡을 수 있었지만</b> — 경계 시각 테스트를 아무도 쓰지 않았습니다.", "pass"],
    contract: ["02 · CONTRACT", "기존 모바일 앱이 그대로 동작하는가",
      `$ ./gradlew :refund:contractTest

MobileV1ContractTest
  ✓ 필수필드_eligible_deadline_이_그대로_존재한다
  ✓ 신규필드가_추가되어도_v1_파서는_성공한다
  ✗ v1_클라이언트는_알수없는_enum값에서_실패하지_않는다

    expected: no exception
    but was : JsonMappingException — Cannot deserialize value of type
              ReasonCode from String "WITHIN_RETURN_WINDOW"
              at MobileV1Response.reasonCode (generated, app 4.12.0)

3 tests, 1 failure`,
      "Q6의 “필드 추가는 안전하다”는 <b>가정이었고, 여기서 깨졌습니다.</b> 구형 앱(4.12.0)이 enum을 strict로 파싱합니다. 대응은 두 가지 — ① reasonCode를 free string으로 내거나 ② v2 Accept 헤더에만 포함. 9장에서 ②를 택합니다.", "fail"],
    integration: ["03 · INTEGRATION", "마이그레이션·조회·제약이 실제 DB에서 동작하는가",
      `$ ./gradlew :refund:integrationTest

Creating container for image: postgres:16-alpine
Container started in PT2.184S
Flyway: Successfully applied 1 migration (V024)

RefundPolicyRepositoryIT
  ✓ 주문시점_기준_정책이_조회된다              (Q3)
  ✓ 정책이_없으면_LEGACY로_폴백하고_카운터가_증가한다  (Q4)
  ✓ 기간이_겹치는_정책_INSERT는_거부된다        (Q7)
      → PSQLException: conflicting key value violates
        exclusion constraint "refund_policy_no_overlap"
  ✓ effective_to를_닫고_새행을_여는_트랜잭션이_원자적이다

12 tests, 0 failures  ·  BUILD SUCCESSFUL in 41s`,
      "Testcontainers로 <b>실제 PostgreSQL 16</b>을 띄웁니다. H2나 목으로는 <code>EXCLUDE USING gist</code>가 존재하지 않아 Q7의 결정이 검증되지 않습니다. <b>제약을 DB에 뒀다면 테스트도 DB에서 해야 합니다.</b>", "pass"],
    e2e: ["04 · STAGE / E2E", "주문부터 고객이 읽는 문장까지",
      `$ npm run e2e -- --env stage --grep refund

  주문 → 배송완료 → 환불 조회 → 설명 생성
    ✓ KR 전자제품 14일 정책이 적용된다            (4.1s)
    ✓ 변경 이전 주문은 LEGACY 7일로 판정된다       (3.8s)
    ✓ 설명 문장에 정책 버전과 마감일이 포함된다     (5.2s)
    ✓ 설명이 판정과 모순되지 않는다 (LLM 평가)      (6.7s)

  4 passing (19.8s)  ·  stage run #77`,
      "여기서만 잡히는 것: <b>판정과 설명의 불일치</b>. 판정은 “불가”인데 설명이 “환불 가능하십니다”로 나오는 사고는 유닛·통합 어디에도 안 걸립니다. ADR-011로 구조를 분리해도 <b>문장 수준의 모순은 별도로 평가해야 합니다.</b>", "pass"],
    perf: ["05 · PERFORMANCE", "DB·Redis·LLM을 다 포함한 지연과 처리량",
      `$ k6 run test/refund-policy.k6.js

     http_req_duration..............: p(95)=2.71s
       { endpoint:eligibility }......: p(95)=118ms   ✓
       { endpoint:explanation }......: p(95)=2.59s   ⚠
     http_req_failed................: 0.42%

     ✓ thresholds on 'http_req_duration'  (< 3000ms)
     ✗ thresholds on 'checks{type:deadline}'  0.992 < 0.999`,
      "전체 예산 3초 중 <b>LLM이 2.59초</b>를 씁니다. 판정 경로에 별도 임계값(400ms)을 걸어두지 않았다면 이 사실이 영원히 안 보입니다. 그리고 실패한 것은 성능이 아니라 <b>정확도 체크</b> — 8장에서 원인을 봅니다.", "warn"],
    resilience: ["06 · RESILIENCE · AI EVAL", "의존성이 죽고 모델이 흔들릴 때",
      `$ ./ops/chaos.sh --target redis --action stop --duration 120s

  refund.policy.cache.miss ......... 100%
  refund.policy.fallback ........... 0        ← DB 직행, 정책은 유지
  http_req_duration p(95) .......... 341ms    ← 판정 경로 정상
  circuit[redis] ................... OPEN → HALF_OPEN(60s) → CLOSED

$ ./ops/eval.sh --suite refund-explanation --n 300

  근거 없는 단정 ................... 2 / 300   (0.67%)
  판정과 모순되는 설명 ............. 0 / 300
  정책 버전 누락 ................... 5 / 300   (1.67%)  ⚠`,
      "Redis가 죽어도 <b>정책 판정은 계속 정확합니다</b> — 캐시는 속도용이지 진실의 원천이 아니기 때문입니다. 폴백이 “전부 허용”이 아니라 “DB 직행”인 것이 fail-safe와 fail-open의 차이입니다. AI 평가에서는 <b>정책 버전 누락 1.67%</b>가 남았고, 이건 9장 잔여 위험으로 기록됩니다.", "warn"]
  };
  const ladderPane = document.getElementById("ladderPane");
  function renderLadder(key) {
    if (!ladderPane) return;
    const [label, title, output, note, state] = ladder[key];
    ladderPane.className = `ladder-pane ${state}`;
    ladderPane.innerHTML = `<div class="lp-head"><span>${label}</span><h3>${title}</h3></div>` +
      `<pre><code>${output.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>` +
      `<p class="lp-note">${note}</p>`;
  }
  document.querySelectorAll("[data-ladder]").forEach(button => button.addEventListener("click", () => {
    document.querySelectorAll("[data-ladder]").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    renderLadder(button.dataset.ladder);
  }));
  if (ladderPane) renderLadder("unit");

  // Developer edition: failure injection scenarios.
  const chaos = {
    redis: ["🧱 Redis 다운", "./ops/chaos.sh --target redis --action stop --duration 120s",
      "캐시 미스 100%. 정책 조회가 DB로 직행하고 판정은 그대로 정확합니다. 서킷 브레이커가 OPEN → HALF_OPEN(60s) → CLOSED로 복귀합니다. P95는 118ms → 341ms로 올라가지만 임계값 안입니다.",
      "폴백이 <b>“전부 허용”이 아니라 “DB 직행”</b>이라는 점이 핵심입니다. 캐시 장애 시 환불을 전부 승인해버리는 fail-open 설계는 금전 사고로 직결됩니다. 캐시는 속도의 원천이지 진실의 원천이 아닙니다."],
    llm: ["🐌 LLM 타임아웃", "./ops/chaos.sh --target bedrock --latency 8000ms",
      "설명 생성이 5초 타임아웃에 걸리고, 판정 응답은 118ms에 그대로 반환됩니다. 설명 필드는 정적 템플릿(“정책 KR-ELECTRONICS-2026-08-01에 따라 …”)으로 대체되고 <code>explanation.degraded=true</code>가 기록됩니다.",
      "ADR-011의 배당금이 여기서 나옵니다. <b>LLM 장애가 기능 장애가 아니라 문구 품질 저하로 격리</b>됩니다. 3장 동적 모델에서 “타임아웃 없는 동기 호출”을 발견하지 못했다면 이 시나리오는 전체 API 장애였을 겁니다."],
    policy: ["🕳️ 정책 행 누락", "psql -c \"DELETE FROM refund_policy WHERE jurisdiction='US'\"",
      "US 요청이 LEGACY 7일 정책으로 판정되고 <code>refund.policy.fallback</code> 카운터가 초당 증가합니다. 알람이 60초 내 발화합니다. 고객 응답은 계속 200이고 서비스는 중단되지 않습니다.",
      "Q4의 결정 — <b>실패시키지 않되 조용히 넘어가지도 않는다</b>. 두 선택지 중 하나만 고르는 팀이 많습니다. 예외를 던지면 고객이 화면을 못 보고, 그냥 기본값을 쓰면 아무도 모릅니다. <b>동작 + 계측</b>이 답입니다."],
    dst: ["🕰️ DST 전환", "TZ=Europe/Berlin ./gradlew :refund:test --tests '*Dst*'",
      "3월 마지막 일요일 02:00 CET → 03:00 CEST. 그 주에 배송완료된 EU 주문의 마감이 한 시간 어긋나 287건이 경계에서 갈립니다. <code>LocalTime.MAX</code>를 쓰고 있어 존재하지 않는 시각 문제는 없지만, <b>오프셋 전환일의 하루가 23시간</b>이라는 사실이 남습니다.",
      "8장 k6의 정확도 실패 0.8%의 정체입니다. <b>부하 테스트에 기능 체크를 같이 걸었기 때문에</b> 잡혔습니다. 순수 성능 테스트만 돌렸다면 “P95 통과”만 보고 배포했을 것입니다. 9장에서 EU를 이번 배포 범위에서 제외하는 근거가 됩니다."]
  };
  const chaosDetail = document.getElementById("chaosDetail");
  document.querySelectorAll("[data-chaos]").forEach(button => button.addEventListener("click", () => {
    document.querySelectorAll("[data-chaos]").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    const [title, command, observed, insight] = chaos[button.dataset.chaos];
    if (chaosDetail) chaosDetail.innerHTML = `<b>${title}</b>` +
      `<pre class="chaos-cmd"><code>$ ${command.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>` +
      `<div class="f-grid"><div><span>관측된 동작</span><p>${observed}</p></div><div><span>설계 근거</span><p>${insight}</p></div></div>`;
  }));

  // Developer edition: copy a prompt from Appendix A.
  document.querySelectorAll("[data-copy]").forEach(button => button.addEventListener("click", async () => {
    const source = document.getElementById(button.dataset.copy);
    if (!source) return;
    try { await navigator.clipboard.writeText(source.innerText.trim()); showToast("프롬프트를 복사했습니다."); }
    catch (_) { showToast("브라우저에서 복사를 허용하지 않았습니다."); }
  }));

  function moveScene(direction) {
    if (!body.classList.contains("presenter") || !scenes.length) return;
    const index = scenes.indexOf(nearestScene());
    scenes[Math.min(scenes.length - 1, Math.max(0, index + direction))]?.scrollIntoView({ behavior: "smooth" });
  }

  addEventListener("keydown", event => {
    const tag = document.activeElement?.tagName;
    if (["INPUT","TEXTAREA","SELECT"].includes(tag)) return;
    if (event.key.toLowerCase() === "t") setTheme(themeOrder[(themeOrder.indexOf(body.dataset.theme) + 1) % themeOrder.length]);
    if (event.key.toLowerCase() === "p") togglePresenter();
    if (event.key === "?") document.getElementById("keyboardDialog")?.showModal();
    if (["ArrowDown","PageDown","ArrowRight"].includes(event.key)) { moveScene(1); if (body.classList.contains("presenter")) event.preventDefault(); }
    if (["ArrowUp","PageUp","ArrowLeft"].includes(event.key)) { moveScene(-1); if (body.classList.contains("presenter")) event.preventDefault(); }
  });
})();
