(() => {
  const body = document.body;
  const themeOrder = ["command", "editorial", "flow"];
  const params = new URLSearchParams(location.search);
  const requestedTheme = params.get("theme");
  if (themeOrder.includes(requestedTheme)) body.dataset.theme = requestedTheme;

  const themeButtons = [...document.querySelectorAll("[data-set-theme]")];
  function setTheme(theme, announce = true) {
    if (!themeOrder.includes(theme)) return;
    body.dataset.theme = theme;
    themeButtons.forEach(button => button.classList.toggle("active", button.dataset.setTheme === theme));
    try { localStorage.setItem("ai-native-theme", theme); } catch (_) {}
    if (announce) showToast({ command: "01 · Command Center", editorial: "02 · Swiss Editorial", flow: "03 · Evidence Flow" }[theme]);
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
    showToast(body.classList.contains("presenter") ? "발표 집중 모드 ON" : "발표 집중 모드 OFF");
  }
  presentButton?.addEventListener("click", togglePresenter);

  const answerButton = document.getElementById("revealAnswer");
  const mythAnswer = document.getElementById("mythAnswer");
  answerButton?.addEventListener("click", () => {
    const willShow = mythAnswer.hidden;
    mythAnswer.hidden = !willShow;
    answerButton.textContent = willShow ? "다시 닫기" : "정답 확인";
  });

  const layers = {
    governance: ["ORGANIZATION", "AI를 누가, 어떤 원칙과 책임으로 관리하는가?", "ISO/IEC 42001은 정책, 역할, 책임, 지속개선을 조직 관리체계로 연결합니다."],
    risk: ["RISK & IMPACT", "어떤 실패가 누구에게 어떤 피해를 주는가?", "ISO/IEC 23894와 NIST AI RMF를 이용해 위험을 식별·측정·우선순위화·대응합니다."],
    quality: ["QUALITY & SECURITY", "작동을 넘어 얼마나 신뢰할 수 있는가?", "ISO/IEC 25010의 품질특성과 NIST SSDF의 보안개발 활동을 CI/CD에 내장합니다."],
    requirements: ["SPEC & TEST", "완료와 실패를 어떻게 판정할 것인가?", "ISO/IEC/IEEE 29148로 요구사항을 만들고 29119 기반 테스트와 증거로 연결합니다."],
    lifecycle: ["LIFECYCLE", "처음부터 운영·변경·폐기까지 어떻게 관리할 것인가?", "일반 SW는 ISO/IEC/IEEE 12207, AI 시스템은 ISO/IEC 5338의 AI 고유 활동을 추가합니다."],
    execution: ["DAILY EXECUTION", "AI와 사람이 매일 어떻게 일할 것인가?", "AI-DLC·Agile·DevSecOps는 AI의 계획·구현 속도와 사람의 승인 게이트를 실제 흐름으로 만듭니다."]
  };
  const layerDetail = document.getElementById("layerDetail");
  document.querySelectorAll("[data-layer]").forEach(button => button.addEventListener("click", () => {
    document.querySelectorAll("[data-layer]").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    const [label,title,copy] = layers[button.dataset.layer];
    layerDetail.innerHTML = `<span>${label}</span><h3>${title}</h3><p>${copy}</p>`;
  }));

  const capabilities = {
    problem: ["PROBLEM FRAMING", "문제를 기술보다 먼저 정의합니다.", "사용자, 가치, 현재의 불편, 성공과 실패, 해결하지 않을 범위를 명확히 합니다."],
    context: ["CONTEXT ENGINEERING", "AI가 판단할 근거를 설계합니다.", "관련 코드·문서·규칙·예시를 제공하고, 불필요하거나 오래된 맥락은 제거합니다."],
    system: ["SYSTEMS THINKING", "한 기능의 변경이 전체에 미치는 영향을 봅니다.", "데이터, API, 권한, 비용, 장애, 운영자와 사용자의 상호작용을 함께 판단합니다."],
    requirement: ["REQUIREMENTS", "의도를 검증 가능한 약속으로 바꿉니다.", "기능뿐 아니라 품질, 경계, 예외, 제약, 인수 기준과 추적성을 정의합니다."],
    verification: ["VERIFICATION MINDSET", "AI의 자신감 대신 증거를 요구합니다.", "테스트 명령, 입력, 예상 결과, 실제 결과, 로그, 보안 검사와 승인 기록을 확인합니다."],
    risk: ["RISK JUDGMENT", "틀렸을 때의 피해를 기준으로 통제 수준을 정합니다.", "개인정보, 인증, 금전, 안전, 법적 영향이 크면 독립 검토와 사람의 승인을 강화합니다."]
  };
  const capabilityDetail = document.getElementById("capabilityDetail");
  document.querySelectorAll("[data-capability]").forEach(button => button.addEventListener("click", () => {
    document.querySelectorAll("[data-capability]").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    const [label,title,copy] = capabilities[button.dataset.capability];
    capabilityDetail.innerHTML = `<span>${label}</span><h3>${title}</h3><p>${copy}</p>`;
  }));

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

  const vvContent = {
    verification: ["Verification 예시", "승인된 요구사항이 코드·설정·테스트에 빠짐없이 반영되었는지 확인합니다."],
    validation: ["Validation 예시", "실제 고객과 상담원이 이 서비스를 사용해 응답시간을 줄이면서도 위험한 오답을 통제할 수 있는지 확인합니다."]
  };
  const vvExplanation = document.getElementById("vvExplanation");
  document.querySelectorAll("[data-vv]").forEach(button => button.addEventListener("click", () => {
    document.querySelectorAll("[data-vv]").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    const [title,copy] = vvContent[button.dataset.vv];
    vvExplanation.innerHTML = `<b>${title}</b><p>${copy}</p>`;
  }));

  const cases = {
    intent: ["BUSINESS INTENT", "반복 문의 응답시간을 줄이되, 고위험 문의는 사람이 책임진다.", "기술을 먼저 고르지 않고 고객·상담원·법무·보안의 성공과 실패 조건을 정의합니다.", ["사용자","가치","경계","위험"]],
    spec: ["VERIFIABLE SPEC", "기능·품질·데이터·안전·인수 기준을 하나의 명세로 만든다.", "승인된 지식만 검색하고, 근거를 표시하며, 고위험 질문은 반드시 이관하도록 정의합니다.", ["FR","NFR","DATA","AC"]],
    build: ["AI-ASSISTED BUILD", "AI가 계획·코드·테스트 초안을 만들고 사람이 핵심 결정을 승인한다.", "작은 변경 단위, 버전관리, CI, 코드리뷰와 보안검사를 통해 속도를 통제 가능한 흐름으로 바꿉니다.", ["PLAN","CODE","CI","REVIEW"]],
    evidence: ["RELEASE EVIDENCE", "골든셋·E2E·보안·부하 테스트가 임계값을 통과한다.", "요구사항별 테스트 결과와 예외, 잔여 위험, 승인자를 릴리스 증거 패키지로 남깁니다.", ["GOLDEN SET","E2E","SECURITY","SIGN-OFF"]],
    operate: ["CONTINUOUS OPERATION", "품질·비용·드리프트·사고를 관찰하고 필요하면 즉시 롤백한다.", "모델·프롬프트·지식베이스 변경도 코드 변경처럼 버전과 영향, 재검증 결과를 관리합니다.", ["SLO","DRIFT","INCIDENT","ROLLBACK"]]
  };
  const caseContent = document.getElementById("caseContent");
  document.querySelectorAll("[data-case]").forEach(button => button.addEventListener("click", () => {
    document.querySelectorAll("[data-case]").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    const [label,title,copy,tags] = cases[button.dataset.case];
    caseContent.innerHTML = `<span>${label}</span><h3>${title}</h3><p>${copy}</p><div class="case-tags">${tags.map(tag => `<b>${tag}</b>`).join("")}</div>`;
  }));

  document.querySelectorAll(".failure-scenarios button").forEach(button => button.addEventListener("click", () => {
    button.classList.toggle("active");
    showToast(button.classList.contains("active") ? `테스트에 추가: ${button.textContent}` : `테스트에서 제거: ${button.textContent}`);
  }));

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

  // Field edition: repository-based living specification explorer.
  const specFiles = {
    product: ["product-requirements.md", `<em># 고객지원 Copilot</em>\n\n<strong>## Outcome</strong>\n반복 문의 응답시간 30% 단축\n\n<strong>## Boundary</strong>\n- 승인된 지식만 사용\n- 결제·환불 판단은 사람에게 이관\n\n<strong>## Acceptance</strong>\n- 근거 표시율 ≥ 98%\n- 고위험 오답률 &lt; 1%\n- P95 응답시간 ≤ 3초`],
    acceptance: ["acceptance-criteria.md", `<em># Acceptance Criteria</em>\n\n<strong>## AC-07 · 고위험 질문</strong>\nGiven 결제·환불 판단이 필요한 질문\nWhen AI가 신뢰 가능한 근거를 찾지 못하면\nThen 추측하지 않고 상담원에게 이관한다\n\n<strong>## Evidence</strong>\n- E2E: TC-044\n- Golden set: GS-HIGH-RISK`],
    architecture: ["architecture.md", `<em># Architecture Boundary</em>\n\n<strong>## Stable Core</strong>\nChannel → API Contract → Domain Rules\n\n<strong>## Replaceable Edge</strong>\n- Model Adapter\n- Prompt & Retrieval\n- Safety Filter\n\n<strong>## Principle</strong>\n모델 변경이 업무 규칙을 흔들지 않는다.`],
    nonfunctional: ["non-functional.md", `<em># Non-Functional Requirements</em>\n\n<strong>## Performance</strong>\n- P95 latency ≤ 3s\n- 300 concurrent users\n\n<strong>## Reliability</strong>\n- AI provider timeout: 5s\n- Fallback response available\n\n<strong>## Cost</strong>\n- 평균 요청 비용 ≤ ₩18`],
    decision: ["decisions/ADR-004.md", `<em># ADR-004 · 정책과 모델 분리</em>\n\n<strong>## Decision</strong>\n환불 규칙은 Domain 계층에서 관리한다.\nLLM은 정책을 결정하지 않고 설명만 한다.\n\n<strong>## Why</strong>\n- 정책 변경을 즉시 반영\n- 결과를 결정론적으로 테스트\n- 모델 교체 영향 최소화`]
  };
  const specDocument = document.getElementById("specDocument");
  document.querySelectorAll("[data-spec-file]").forEach(button => button.addEventListener("click", () => {
    document.querySelectorAll("[data-spec-file]").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    const [name,content] = specFiles[button.dataset.specFile];
    if (specDocument) specDocument.innerHTML = `<div><span>${name}</span><b>LIVE</b></div><pre><code>${content}</code></pre>`;
    showToast(`${name} · 실행 기준 확인`);
  }));

  // Field edition: visualize how modular boundaries contain requirement changes.
  const changes = {
    model: { modules:["ai"], message:["모델 어댑터","만 교체하고 골든셋을 재실행합니다."] },
    policy: { modules:["domain","api"], message:["도메인 규칙과 API 계약","을 수정하고 정책 회귀 시나리오를 검증합니다."] },
    channel: { modules:["channel","api"], message:["채널과 API 계약","만 확장하고 핵심 업무 규칙은 그대로 유지합니다."] }
  };
  const architectureMap = document.getElementById("architectureMap");
  const changeMessage = document.getElementById("changeMessage");
  document.querySelectorAll("[data-change]").forEach(button => button.addEventListener("click", () => {
    document.querySelectorAll("[data-change]").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    const change = changes[button.dataset.change];
    architectureMap?.querySelectorAll("[data-module]").forEach(module => module.classList.toggle("affected", change.modules.includes(module.dataset.module)));
    if (changeMessage) changeMessage.innerHTML = `<b>${change.message[0]}</b>${change.message[1]}`;
    showToast(`변경 영향: ${change.modules.length}개 경계`);
  }));

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

  function moveScene(direction) {
    if (!body.classList.contains("presenter") || !sections.length) return;
    const current = sections.reduce((best, section) => Math.abs(section.getBoundingClientRect().top) < Math.abs(best.getBoundingClientRect().top) ? section : best, sections[0]);
    const index = sections.indexOf(current);
    sections[Math.min(sections.length - 1, Math.max(0, index + direction))]?.scrollIntoView({ behavior: "smooth" });
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
