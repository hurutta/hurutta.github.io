const themeStorageKey = "aj-theme";
const langStorageKey = "aj-lang";
let currentLang = "en";
let cachedViewCount = null;
const root = document.documentElement;
const systemPrefersLight = window.matchMedia("(prefers-color-scheme: light)");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

// Liquid Glass motion: re-run the materialize animation on freshly swapped
// content — the glass "lenses in" instead of snapping into place.
function lgMaterialize(el) {
  if (!el || prefersReducedMotion.matches) return;
  el.classList.remove("lg-materialize");
  void el.offsetWidth;
  el.classList.add("lg-materialize");
  el.addEventListener("animationend", () => el.classList.remove("lg-materialize"), { once: true });
}

// Droplet travel: the glass thumb behaves like a water drop in motion —
// it elongates along the travel axis as it tears away, then squashes and
// settles on arrival. Runs as a `scale` animation so it composes with the
// spring-eased `translate` doing the actual travel.
function lgDropletTravel(thumb, axis) {
  if (!thumb || prefersReducedMotion.matches) return;
  const cls = axis === "x" ? "lg-drop-x" : "lg-drop-y";
  thumb.classList.remove("lg-drop-x", "lg-drop-y");
  void thumb.offsetWidth;
  thumb.classList.add(cls);
  thumb.addEventListener("animationend", () => thumb.classList.remove(cls), { once: true });
}

const socialSprites = {
  github: `
    <svg viewBox="0 0 24 24" role="img" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6"></circle>
      <path d="M8.2 14.7c-.5 1.6-2 1.6-2.5 0m10.1 0c.5 1.6 2 1.6 2.5 0" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"></path>
      <path d="M8.5 13.3a3.5 3.5 0 0 1 7 0v2.4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"></path>
    </svg>
  `,
  linkedin: `
    <svg viewBox="0 0 24 24" role="img" aria-hidden="true" focusable="false">
      <rect x="3.25" y="8.5" width="4.2" height="11.5" rx="1.2" ry="1.2" fill="none" stroke="currentColor" stroke-width="1.8"></rect>
      <circle cx="5.35" cy="5.3" r="2" fill="none" stroke="currentColor" stroke-width="1.8"></circle>
      <path
        d="M10.5 8.5H14a4 4 0 0 1 4 4v7.5h-4.2v-6.2c0-1.2-.7-2.1-2-2.1s-2 .9-2 2.1v6.2H10.5Z"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linejoin="round"
      ></path>
    </svg>
  `,
  email: `
    <svg viewBox="0 0 24 24" role="img" aria-hidden="true" focusable="false">
      <rect x="3" y="6" width="18" height="12" rx="2.2" ry="2.2" fill="none" stroke="currentColor" stroke-width="1.8"></rect>
      <path d="m5 8 7 5 7-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>
  `,
};

const navItems = [
  {
    id: "home",
    label: "Home",
    subtitle: "Profile & Work",
    href: "index.html",
  },
  {
    id: "blog",
    label: "Blog",
    subtitle: "Tech & Travel",
    href: "blog.html",
  },
  {
    id: "chat",
    label: "TinyJawad",
    subtitle: "On-device chat",
    href: "chat.html",
  },
];

const homeContentSections = [
  { id: "about", label: "About" },
  { id: "portrait", label: "Portrait" },
  { id: "askgpt", label: "AskGPT" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "credentials", label: "Credentials" },
  { id: "skills", label: "Skills" },
];

function buildLeftNav() {
  return `
    <nav>
      ${navItems
        .map(
          (item) => `
        <a class="nav-button" href="${item.href}" data-shell-link data-shell-target="${item.id}">
          <span>${item.label}</span>
          <small>${item.subtitle}</small>
        </a>
      `
        )
        .join("")}
    </nav>
  `;
}

function buildLeftPanel() {
  return `
    <div class="brand">
      <div class="avatar">
        <img src="assets/images/avatar.jpeg" alt="Portrait of Abid Jawad" loading="lazy" />
      </div>
      <h1>Abid Jawad</h1>
      <p>Researcher • Engineer • Developer</p>
    </div>
    ${buildLeftNav()}
    <div class="left-footer">
      <div class="social">
        <a href="https://github.com/hurutta" target="_blank" rel="noreferrer" data-icon="github">GitHub</a>
        <a href="https://www.linkedin.com/in/abidjawad" target="_blank" rel="noreferrer" data-icon="linkedin">LinkedIn</a>
        <a href="mailto:abidmohammadjawad@gmail.com" data-icon="email">Email</a>
      </div>
      <button class="theme-toggle" type="button" aria-pressed="false" aria-label="Toggle color theme">
        <span class="toggle-track" aria-hidden="true">
          <span class="toggle-icon">☾</span>
          <span class="toggle-icon">☀︎</span>
          <span class="toggle-thumb"></span>
        </span>
        <span class="sr-only">Toggle color theme</span>
      </button>
    </div>
  `;
}

function buildContentMap() {
  return `
    <div class="content-map" aria-label="On this page">
      <span class="content-map-label">On this page</span>
      <div class="content-map-links">
        ${homeContentSections
          .map(
            (section) => `<a href="#${section.id}">${section.label}</a>`
          )
          .join("")}
        <a href="#top" class="content-map-link-top" aria-label="Back to top">Top ↑</a>
      </div>
    </div>
  `;
}

function buildRightPanel(page = "home") {
  const map = page === "home" ? buildContentMap() : "";
  return `
    ${map}
    <div class="project-stats">
      <h3>LeetCode</h3>
      <div class="embed-wrapper">
        <img src="https://leetcard.jacoblin.cool/hurutta?theme=catppuccinMocha&font=Monda&ext=contest" alt="LeetCode stats" />
      </div>
    </div>
    <div class="project-stats">
      <h3>CodeForces</h3>
      <div class="embed-wrapper">
        <img src="https://codeforces-readme-stats.vercel.app/api/card?username=hurutta&theme=monokai&disable_animations=false&show_icons=true&force_username=true" alt="CodeForces stats" />
      </div>
    </div>
    <div class="project-embed medium-card">
      <h3>LinkedIn</h3>
      <div class="embed-wrapper medium">
        <img src="assets/images/linkedin-cover.svg" alt="LinkedIn post cover" />
        <div>
          <p class="medium-title">Abid Jawad on LinkedIn</p>
          <a href="https://www.linkedin.com/feed/update/urn:li:share:7358686570813575172" target="_blank" rel="noreferrer">View on LinkedIn →</a>
        </div>
      </div>
    </div>
    <div class="project-embed medium-card">
      <h3>Medium</h3>
      <div class="embed-wrapper medium">
        <img src="https://miro.medium.com/v2/resize:fit:1400/format:webp/0*foLbFYZbBg6bZPWM" alt="Medium article cover" />
        <div>
          <p class="medium-title">Convert your old desktop/laptop to a web server</p>
          <a href="https://medium.com/@abid-jawad/convert-your-old-desktop-laptop-to-a-web-server-5dcfa9350382" target="_blank" rel="noreferrer">Read on Medium →</a>
        </div>
      </div>
    </div>
  `;
}

function renderPartials() {
  document.querySelectorAll("[data-partial='left']").forEach((container) => {
    container.innerHTML = buildLeftPanel();
  });
  renderRightPanels();
  decorateSocialLinks();
  initSiteFooter();
}

// --- Site footer ------------------------------------------------------------
function initSiteFooter() {
  if (document.querySelector(".site-footer")) return;
  const shell = document.querySelector("main.shell");
  if (!shell) return;
  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `
    <span class="footer-item">© ${new Date().getFullYear()} Abid Mohammad Jawad</span>
    <span class="footer-sep" aria-hidden="true">·</span>
    <span class="footer-item">Server time <time id="footerClock" title="Asia/Dhaka (UTC+6)"></time> <abbr class="footer-tz" title="Asia/Dhaka">UTC+6</abbr></span>
    <span class="footer-sep footer-deploy-sep" aria-hidden="true" hidden>·</span>
    <span class="footer-item footer-deploy" hidden>Last updated <time id="footerDeploy"></time> <a class="footer-build" id="footerBuild" target="_blank" rel="noreferrer" title="Deployed commit"></a></span>
  `;
  shell.insertAdjacentElement("afterend", footer);
  startFooterClock();
  loadFooterDeployTime();
}

function startFooterClock() {
  const clock = document.getElementById("footerClock");
  if (!clock) return;
  const format = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dhaka",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const tick = () => {
    clock.textContent = format.format(new Date());
  };
  tick();
  setInterval(tick, 1000);
}

function loadFooterDeployTime() {
  const target = document.getElementById("footerDeploy");
  if (!target) return;
  const show = ({ iso, sha }) => {
    const when = new Date(iso);
    if (Number.isNaN(when.getTime())) return;
    target.dateTime = iso;
    target.textContent = new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(when);
    if (sha) {
      const build = document.getElementById("footerBuild");
      build.textContent = sha.slice(0, 7);
      build.href = `https://github.com/hurutta/hurutta.github.io/commit/${sha}`;
    }
    document.querySelector(".footer-deploy").hidden = false;
    document.querySelector(".footer-deploy-sep").hidden = false;
  };
  // The newest commit on main is what GitHub Pages deploys, so its date is
  // the site's last-updated time and its short hash is the live "version".
  // Cached per session to spare the API quota.
  let cached = null;
  try {
    cached = JSON.parse(sessionStorage.getItem("site-deploy-info"));
  } catch (_) {
    /* stale/invalid cache — refetch below */
  }
  if (cached?.iso) {
    show(cached);
    return;
  }
  fetch("https://api.github.com/repos/hurutta/hurutta.github.io/commits?per_page=1")
    .then((res) => (res.ok ? res.json() : Promise.reject(new Error(res.status))))
    .then((commits) => {
      const iso = commits?.[0]?.commit?.committer?.date;
      const sha = commits?.[0]?.sha;
      if (!iso) return;
      const info = { iso, sha };
      sessionStorage.setItem("site-deploy-info", JSON.stringify(info));
      show(info);
    })
    .catch(() => {
      /* offline or rate-limited — footer simply omits the line */
    });
}

function renderRightPanels(pageOverride) {
  document.querySelectorAll("[data-partial='right']").forEach((container) => {
    const page = pageOverride || container.dataset.page || document.body.dataset.page || "home";
    container.innerHTML = buildRightPanel(page);
  });
}

function normalizeShellPage(page) {
  if (page === "post") return "blog";
  return page || "home";
}

function setActiveShellNav(page) {
  const target = normalizeShellPage(page);
  document.querySelectorAll(".nav-button[data-shell-target]").forEach((link) => {
    link.classList.toggle("active", link.dataset.shellTarget === target);
  });
}

function refreshThemeToggleButtons() {
  themeToggleButtons = Array.from(document.querySelectorAll(".theme-toggle"));
  themeToggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextTheme = root.dataset.theme === "light" ? "dark" : "light";
      lgDropletTravel(button.querySelector(".toggle-thumb"), "y");
      liquidThemeSwitch(nextTheme, button);
    });
  });
}

function decorateSocialLinks() {
  document.querySelectorAll(".social a[data-icon]").forEach((link) => {
    if (link.querySelector(".social-icon")) return;
    const iconName = link.dataset.icon;
    const span = document.createElement("span");
    span.className = "social-icon";
    span.setAttribute("aria-hidden", "true");
    const sprite = socialSprites[iconName];
    if (sprite) {
      span.innerHTML = sprite;
    } else {
      span.textContent = link.dataset.icon?.charAt(0).toUpperCase() || "•";
    }
    link.prepend(span);
  });
}

renderPartials();
let themeToggleButtons = [];
refreshThemeToggleButtons();
setActiveShellNav(document.body.dataset.page || "home");

function applyTheme(theme, persist = true) {
  root.dataset.theme = theme;
  if (persist) {
    localStorage.setItem(themeStorageKey, theme);
  }
  syncThemeButtons(theme);
}

// Theme switch as a liquid lens sweep: the new theme floods the page in a
// circular wave radiating from the toggle, via the View Transitions API.
// Engines without it (or with reduced motion) switch instantly, as before.
let themeTransitionActive = false;
function liquidThemeSwitch(theme, sourceEl) {
  if (typeof document.startViewTransition !== "function" || prefersReducedMotion.matches) {
    applyTheme(theme);
    return;
  }
  // One sweep at a time: if a wipe is still playing, flip instantly rather
  // than stacking a second transition (which snaps and reads as a double
  // blink). The wipe is only 0.6s, so this is rarely hit.
  if (themeTransitionActive) {
    applyTheme(theme);
    return;
  }
  const rect = sourceEl.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  const radius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );
  root.style.setProperty("--lg-wipe-x", `${x}px`);
  root.style.setProperty("--lg-wipe-y", `${y}px`);
  root.style.setProperty("--lg-wipe-r", `${Math.ceil(radius)}px`);
  root.classList.add("lg-theme-wipe");
  themeTransitionActive = true;
  const transition = document.startViewTransition(() => applyTheme(theme));
  let cleaned = false;
  const cleanup = () => {
    if (cleaned) return;
    cleaned = true;
    root.classList.remove("lg-theme-wipe");
    themeTransitionActive = false;
  };
  // Never abort mid-animation — that snap is the double-blink. Just clean up
  // when the sweep finishes (or if the engine rejects, on the same promise).
  transition.finished.then(cleanup, cleanup);
  // Fallback only: if `finished` never settles (flaky engine), release the
  // guard after the sweep would have ended. applyTheme already ran inside the
  // callback, so this only tidies the class — it can't cause a visual jump.
  setTimeout(cleanup, 900);
}

function syncThemeButtons(theme) {
  themeToggleButtons.forEach((button) => {
    button.setAttribute("aria-pressed", theme === "light");
  });
}

const storedTheme = localStorage.getItem(themeStorageKey);
const initialTheme = storedTheme || (systemPrefersLight.matches ? "light" : "dark");
applyTheme(initialTheme, Boolean(storedTheme));

systemPrefersLight.addEventListener("change", (event) => {
  if (!localStorage.getItem(themeStorageKey)) {
    applyTheme(event.matches ? "light" : "dark", false);
  }
});

// --- Blog browser logic ----------------------------------------------------
const blogData = [
  {
    id: "tech",
    name: "Tech",
    description: "Systems, DX, architecture notes",
    posts: [
      {
        slug: "convert-old-pc-to-web-server",
        title: "Convert your old desktop/laptop to a Web Server",
        date: "Jul 03, 2024",
        readingTime: "6 min read",
        summary:
          "Skip the credit-card hosting tiers — repurpose that dusty machine with an HTTP tunnel. From a local Flask app to a public URL with Ngrok, browser-warning workarounds, and free static domains.",
      },
    ],
  },
  {
    id: "travel",
    name: "Travel",
    description: "Journeys, itineraries, wandering notes",
    posts: [
      {
        slug: "travel/thailand-2026",
        title: "Thailand Tour 2026",
        date: "Jun 15, 2026",
        readingTime: "12 min read",
        summary:
          "A 9-day run from Bangkok down to Krabi, Railay, Koh Phi Phi, and Phuket—overnight buses, island-hopping boats, limestone cliffs, hidden lagoons, and Bangkok's markets and temples to finish.",
      },
      {
        slug: "travel/srilanka-2025",
        title: "Sri Lanka Tour 2025",
        date: "Nov 17, 2025",
        readingTime: "10 min read",
        summary:
          "An 8-day loop from Colombo to Kandy, Ella, and the southern coast—sunrise hikes, scenic trains, and beach towns included.",
      },
      {
        slug: "travel/nepal-2025",
        title: "Nepal Tour 2025",
        date: "Jan 03, 2025",
        readingTime: "5 min read",
        summary:
          "A 7-day adventure from Kathmandu to Manang and Pokhara—Himalayan villages, mountain lakes, and vibrant capital streets.",
      },
    ],
  },
];

function initBlogBrowser() {
  const categoryList = document.getElementById("categoryList");
  const postList = document.getElementById("postList");
  const articlePreview = document.getElementById("articlePreview");
  const categoryPanel = document.querySelector("[data-stage='categories']");
  const postsPanel = document.querySelector("[data-stage='posts']");
  const previewPanel = document.querySelector("[data-stage='preview']");
  const backToCategories = document.getElementById("backToCategories");
  const backToPosts = document.getElementById("backToPosts");
  const categoryLabel = document.getElementById("activeCategoryLabel");

  if (!categoryList || !postList || !articlePreview) return;

  // Header stats, computed from the registry so they stay honest
  const statsEl = document.getElementById("blogStats");
  if (statsEl) {
    const storyCount = blogData.reduce((sum, cat) => sum + cat.posts.length, 0);
    statsEl.innerHTML = [
      `<span class="blog-stat"><strong>${storyCount}</strong> stories</span>`,
      `<span class="blog-stat"><strong>${blogData.length}</strong> categories</span>`,
      `<span class="blog-stat"><strong>2</strong> languages</span>`,
    ].join("");
  }

  let activeCategory = null;
  let activePost = null;

  // Liquid navigation: deeper stages flow in from the right, going back flows
  // from the left — the direction is read by CSS to pick the flow keyframe.
  const stageOrder = { categories: 0, posts: 1, preview: 2 };
  let currentStage = "categories";

  const goToStage = (stage) => {
    const flow = stageOrder[stage] >= stageOrder[currentStage] ? "forward" : "back";
    currentStage = stage;
    [categoryPanel, postsPanel, previewPanel].forEach((panel) => {
      if (!panel) return;
      const active = panel.dataset.stage === stage;
      panel.hidden = !active;
      if (active) panel.dataset.flow = flow;
    });
  };

  const renderCategories = () => {
    categoryList.innerHTML = "";

    blogData.forEach((category, i) => {
      const li = document.createElement("li");
      li.style.setProperty("--i", i);
      const button = document.createElement("button");
      button.type = "button";
      button.classList.toggle("active", category.id === activeCategory);
      button.innerHTML = `
        <span>${category.name}</span>
        <small>${category.posts.length} posts · ${category.description}</small>
      `;
      button.addEventListener("click", () => {
        activeCategory = category.id;
        activePost = null;
        renderCategories();
        renderPosts();
        goToStage("posts");
      });
      li.appendChild(button);
      categoryList.appendChild(li);
    });
  };

  const renderPosts = () => {
    postList.innerHTML = "";
    const category = blogData.find((cat) => cat.id === activeCategory);

    if (!category) {
      if (categoryLabel) categoryLabel.textContent = "—";
      return;
    }

    if (categoryLabel) categoryLabel.textContent = category.name;

    category.posts.forEach((post, i) => {
      const li = document.createElement("li");
      li.style.setProperty("--i", i);
      const button = document.createElement("button");
      button.type = "button";
      button.classList.toggle("active", post.slug === activePost);
      button.innerHTML = `
        <span>${post.title}</span>
        <small>${post.date} · ${post.readingTime}</small>
      `;
      button.addEventListener("click", () => {
        activePost = post.slug;
        renderPosts();
        renderPreview();
        goToStage("preview");
      });
      li.appendChild(button);
      postList.appendChild(li);
    });
  };

  const renderPreview = () => {
    const category = blogData.find((cat) => cat.id === activeCategory);
    const post = category?.posts.find((entry) => entry.slug === activePost);

    if (!post) {
      articlePreview.innerHTML = `
        <h3>Select a post</h3>
        <p>The first few paragraphs appear here so you can decide what to dive into.</p>
      `;
      return;
    }

    articlePreview.innerHTML = `
      <h3>${post.title}</h3>
      <time>${post.date} · ${post.readingTime}</time>
      <p>${post.summary}</p>
      <a class="ghost-link" href="post.html?slug=${post.slug}" data-shell-link>Continue reading →</a>
    `;
  };

  backToCategories?.addEventListener("click", () => {
    activePost = null;
    goToStage("categories");
  });

  backToPosts?.addEventListener("click", () => {
    goToStage("posts");
  });

  goToStage("categories");
  renderCategories();
}

// --- ChatGPT-style section -------------------------------------------------
function initChatSection() {
  const chatWindow = document.getElementById("chatWindow");
  if (!chatWindow) return;

  const entries = [
    {
      question: "What did you study?",
      answer: "BSc in Computer Science & Engineering · BRAC University.",
    },
    {
      question: "Summarize your work experience.",
      answer:
        "4+ years at bKash — Software Engineer to Senior Engineer, Advanced Research. Shipped AVA (the in-app AI assistant), merchant backend microservices, and the QR engine behind Bangladesh's largest payment network.",
    },
    {
      question: "Key skills you bring?",
      answer:
        "AI research to production: LLMs, NLP & deep learning (PyTorch, Transformers, LangChain) · backend at scale (Java, Python, Spring WebFlux, FastAPI) · k8s, AWS, Vertex AI.",
    },
  ];

  let index = 0;
  const typingDelay = 45;
  const holdDelay = 2500;

  const createBubble = (type) => {
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${type}`;
    bubble.textContent = "";
    return bubble;
  };

  const createTypingIndicator = () => {
    const container = document.createElement("div");
    container.className = "chat-bubble answer";
    const dots = document.createElement("div");
    dots.className = "typing-indicator";
    dots.innerHTML = "<span></span><span></span><span></span>";
    container.appendChild(dots);
    return container;
  };

  const typeText = (node, text, cb, withCursor = false) => {
    let i = 0;
    node.innerHTML = "";
    const textContainer = document.createElement("span");
    textContainer.style.display = "inline";
    textContainer.style.whiteSpace = "pre-wrap";
    node.appendChild(textContainer);
    let cursor;
    if (withCursor) {
      cursor = document.createElement("span");
      cursor.className = "typing-cursor";
      node.appendChild(cursor);
    }

    const type = () => {
      if (i < text.length) {
        textContainer.textContent = text.slice(0, ++i);
        ensureScroll();
        setTimeout(type, typingDelay);
      } else {
        cursor?.remove();
        ensureScroll();
        cb?.();
      }
    };
    type();
  };

  const ensureScroll = () => {
    requestAnimationFrame(() => {
      chatWindow.scrollTop = chatWindow.scrollHeight;
      const maxChildren = 8;
      while (chatWindow.children.length > maxChildren) {
        chatWindow.removeChild(chatWindow.firstChild);
      }
    });
  };

  const runConversation = () => {
    const { question, answer } = entries[index];

    const questionBubble = createBubble("question");
    chatWindow.appendChild(questionBubble);
    ensureScroll();

    typeText(
      questionBubble,
      question,
      () => {
        const typing = createTypingIndicator();
        chatWindow.appendChild(typing);
        ensureScroll();

        setTimeout(() => {
          typing.remove();
          const answerBubble = createBubble("answer");
          chatWindow.appendChild(answerBubble);
          ensureScroll();
          typeText(answerBubble, answer, () => {
            setTimeout(() => {
              index = (index + 1) % entries.length;
              runConversation();
            }, holdDelay);
          });
        }, 900);
      },
      true
    );
  };

  runConversation();
}

// --- Post renderer --------------------------------------------------------
async function hydratePostPage() {
  cachedViewCount = null;
  const titleEl = document.getElementById("postTitle");
  const metaEl = document.getElementById("postMeta");
  const contentEl = document.getElementById("postContent");
  const categoryEl = document.getElementById("postCategory");

  if (!titleEl || !metaEl || !contentEl || !categoryEl) return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  if (!slug) {
    renderPostError(titleEl, metaEl, categoryEl, contentEl, "Use the blog browser to pick a story.");
    return;
  }

  // Clean up any stale toggle from SPA navigation
  const staleToggle = document.getElementById("langToggle");
  if (staleToggle) staleToggle.remove();

  try {
    const response = await fetch(`posts/${slug}.md`);
    if (!response.ok) throw new Error("Post not found");
    const text = await response.text();
    const { frontmatter, body } = parseFrontMatter(text);
    populatePostFrontmatter(frontmatter, titleEl, metaEl, categoryEl);
    contentEl.innerHTML = markdownToHtml(body);
    appendMediumCard(contentEl, frontmatter.medium);
    highlightCodeBlocks();
    injectPostContentMap();
    initJourneyMaps();
    fetchViewCount();
    initReactions(slug);
    initComments(slug);

    // Check if Bengali version exists
    try {
      const bnCheck = await fetch(`posts/${slug}.bn.md`, { method: "HEAD" });
      if (bnCheck.ok) {
        const toggleHtml = `<div class="lang-toggle" id="langToggle" role="radiogroup" aria-label="Language">
  <button class="lang-option active" data-lang="en" role="radio" aria-checked="true">EN</button>
  <button class="lang-option" data-lang="bn" role="radio" aria-checked="false">বাং</button>
  <span class="lang-thumb"></span>
</div>`;
        contentEl.insertAdjacentHTML("beforebegin", toggleHtml);

        const toggle = document.getElementById("langToggle");
        toggle.addEventListener("click", (e) => {
          const btn = e.target.closest(".lang-option");
          if (!btn || btn.classList.contains("active")) return;
          const lang = btn.dataset.lang;
          switchPostLanguage(slug, lang, titleEl, metaEl, categoryEl, contentEl);
        });

        // Auto-switch to Bengali if stored preference says so
        const storedLang = localStorage.getItem(langStorageKey);
        if (storedLang === "bn") {
          switchPostLanguage(slug, "bn", titleEl, metaEl, categoryEl, contentEl);
        }
      }
    } catch (_) {
      // No Bengali version — toggle not shown
    }
  } catch (error) {
    renderPostError(titleEl, metaEl, categoryEl, contentEl, error.message || "Unknown error");
  }
}

async function switchPostLanguage(slug, lang, titleEl, metaEl, categoryEl, contentEl) {
  const file = lang === "bn" ? `posts/${slug}.bn.md` : `posts/${slug}.md`;
  try {
    const response = await fetch(file);
    if (!response.ok) return;
    const text = await response.text();
    const { frontmatter, body } = parseFrontMatter(text);
    populatePostFrontmatter(frontmatter, titleEl, metaEl, categoryEl);
    contentEl.innerHTML = markdownToHtml(body);
    appendMediumCard(contentEl, frontmatter.medium);
    highlightCodeBlocks();
    lgMaterialize(contentEl);
    injectPostContentMap();
    initJourneyMaps();
    currentLang = lang;
    localStorage.setItem(langStorageKey, lang);

    // Update toggle active state
    const toggle = document.getElementById("langToggle");
    if (toggle) {
      toggle.querySelectorAll(".lang-option").forEach((btn) => {
        const isActive = btn.dataset.lang === lang;
        btn.classList.toggle("active", isActive);
        btn.setAttribute("aria-checked", isActive);
      });
      lgDropletTravel(toggle.querySelector(".lang-thumb"), "x");
      toggle.style.setProperty("--lang-thumb-offset", lang === "bn" ? "1" : "0");
    }

    // Set data attribute for Bengali font CSS
    const postPanel = contentEl.closest(".post-panel");
    if (postPanel) {
      postPanel.setAttribute("data-lang-active", lang);
    }
  } catch (_) {
    // Silently fail — keep current language
  }
}

// Syntax highlighting for fenced code blocks — highlight.js, lazy-loaded from
// CDN only when a rendered post actually contains code. Token colors are the
// Dracula palette, defined in style.css. Fails soft: if the CDN is
// unreachable, code simply stays monochrome.
let hljsLoader = null;
function highlightCodeBlocks() {
  if (!document.querySelector(".md-code pre code")) return;
  const run = () => {
    if (!window.hljs) return;
    document.querySelectorAll(".md-code pre code:not(.hljs)").forEach((el) => {
      window.hljs.highlightElement(el);
    });
  };
  if (window.hljs) {
    run();
    return;
  }
  if (!hljsLoader) {
    hljsLoader = new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js";
      script.onload = resolve;
      script.onerror = resolve;
      document.head.appendChild(script);
    });
  }
  hljsLoader.then(run);
}

// Posts with a `medium:` frontmatter URL get a branded card at the end of the
// article inviting readers to the original story on Medium.
function appendMediumCard(contentEl, mediumUrl) {
  if (!mediumUrl || !/^https:\/\/medium\.com\//.test(mediumUrl)) return;
  contentEl.insertAdjacentHTML(
    "beforeend",
    `<a class="medium-cta" href="${mediumUrl}" target="_blank" rel="noreferrer">
      <span class="medium-logo" aria-hidden="true">
        <svg viewBox="0 0 1043.63 592.71" fill="currentColor" role="img"><g>
          <ellipse cx="296.35" cy="296.35" rx="296.35" ry="296.35"></ellipse>
          <ellipse cx="767.84" cy="296.35" rx="141.72" ry="277.29"></ellipse>
          <ellipse cx="1001.61" cy="296.35" rx="42.02" ry="249.57"></ellipse>
        </g></svg>
      </span>
      <span class="medium-cta-text">
        <strong>Originally published on Medium</strong>
        <small>Enjoyed this? Read the original story, leave some claps, and follow me there.</small>
      </span>
      <span class="medium-cta-btn">Read on Medium →</span>
    </a>`
  );
}

function populatePostFrontmatter(meta, titleEl, metaEl, categoryEl) {
  titleEl.textContent = meta.title || "Untitled";
  const metaParts = [meta.date, meta.reading_time].filter(Boolean).join(" · ");
  const countDisplay = cachedViewCount !== null ? cachedViewCount : "—";
  metaEl.innerHTML = metaParts ? `${metaParts} · <span id="viewCount">${countDisplay}</span> unique visitors` : "";
  categoryEl.textContent = meta.category || "Journal";
}

function fetchViewCount() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");
  if (!slug) return;
  // Clean path: post/travel/srilanka-2025 — no query string, no encoding issues
  const cleanPath = "post/" + slug;
  const url = "https://hurutta.goatcounter.com/counter/" + cleanPath + ".json?_=" + Date.now();
  const r = new XMLHttpRequest();
  r.addEventListener("load", function () {
    if (r.status === 200) {
      cachedViewCount = JSON.parse(this.responseText).count;
      const el = document.getElementById("viewCount");
      if (el) el.textContent = cachedViewCount;
    }
  });
  r.open("GET", url);
  r.send();
}

// Reactions are powered by Lyket's REST API directly (no widget). We render
// our own markup so we fully control the look, and toggle "like" buttons via
// PUT .../press. The publishable token is safe in client code by design.
const LYKET_API = "https://api.lyket.dev/v1";
const LYKET_KEY = "pt_2ea4d4d2c171e2ad0133096676a6cc";
const LYKET_NS = "hurutta-blog";

const REACTIONS = [
  { key: "fire", emoji: "🔥", label: "Fire" },
  { key: "love", emoji: "❤️", label: "Love" },
  { key: "laugh", emoji: "😂", label: "Funny" },
  { key: "wow", emoji: "😮", label: "Wow" },
  { key: "thumb", emoji: "👍", label: "Thumbs up" },
];

// Stable per-visitor id so Lyket can enforce one like per reaction.
function getLyketSession() {
  let s = localStorage.getItem("lyket-session-id");
  if (!s) {
    s =
      Math.random().toString(36).slice(2) +
      Math.random().toString(36).slice(2);
    localStorage.setItem("lyket-session-id", s);
  }
  return s;
}

function lyketHeaders() {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: "Bearer " + LYKET_KEY,
    "x-session-id": getLyketSession(),
  };
}

async function lyketRequest(id, method) {
  const suffix = method === "PUT" ? "/press" : "";
  const url = `${LYKET_API}/like-buttons/${LYKET_NS}/${encodeURIComponent(
    id
  )}${suffix}`;
  try {
    const res = await fetch(url, { method, headers: lyketHeaders() });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data.attributes; // { total_likes, user_has_liked, ... }
  } catch (e) {
    return null;
  }
}

function paintReaction(item, attrs) {
  if (!attrs) return;
  const total = attrs.total_likes || 0;
  const liked = !!attrs.user_has_liked;
  const countEl = item.querySelector(".reaction-count");
  countEl.textContent = total;
  countEl.classList.toggle("has-count", total > 0);
  item.classList.toggle("is-active", liked);
  item.setAttribute("aria-pressed", liked ? "true" : "false");
}

function initReactions(slug) {
  const container = document.getElementById("reactionsContainer");
  if (!container) return;

  const safeSlug = slug.replace(/\//g, "-");
  container.innerHTML = REACTIONS.map(
    (r) => `
      <button type="button" class="reaction-item" data-id="${safeSlug}-${r.key}"
              title="${r.label}" aria-label="${r.label}" aria-pressed="false">
        <span class="reaction-emoji" aria-hidden="true">${r.emoji}</span>
        <span class="reaction-count">0</span>
      </button>
    `
  ).join("");

  container.querySelectorAll(".reaction-item").forEach((item) => {
    const id = item.dataset.id;

    // Load current count + whether this visitor already reacted.
    lyketRequest(id, "GET").then((attrs) => paintReaction(item, attrs));

    item.addEventListener("click", async () => {
      if (item.dataset.busy) return;
      item.dataset.busy = "1";
      item.classList.remove("is-popping");
      void item.offsetWidth; // restart the pop animation
      item.classList.add("is-popping");
      const attrs = await lyketRequest(id, "PUT");
      paintReaction(item, attrs);
      delete item.dataset.busy;
    });
  });
}

// Comments are powered by GraphComment (hosted, free, ad-free, social login).
// The widget renders into #graphcomment; the post slug is the thread uid so
// each post keeps its own thread even if the URL changes. The loader script is
// injected once, then re-run in place on SPA navigation between posts.
const GRAPHCOMMENT_ID = "hurutta";

function initComments(slug) {
  const container = document.getElementById("graphcomment");
  if (!container) return;

  window.__semio__params = {
    graphcommentId: GRAPHCOMMENT_ID,
    behaviour: { uid: slug },
  };

  // Loader already present (navigating to another post): re-render in place.
  if (typeof window.__semio__gc_graphlogin === "function") {
    container.innerHTML = "";
    window.__semio__gc_graphlogin(window.__semio__params);
    return;
  }

  // First load: inject the GraphComment loader a single time.
  const gc = document.createElement("script");
  gc.type = "text/javascript";
  gc.async = true;
  gc.defer = true;
  gc.onload = function () {
    if (typeof window.__semio__gc_graphlogin === "function") {
      window.__semio__gc_graphlogin(window.__semio__params);
    }
  };
  gc.src = "https://integration.graphcomment.com/gc_graphlogin.js?" + Date.now();
  document.head.appendChild(gc);
}

// Journey maps are rendered with Leaflet (vendored locally) over OpenStreetMap
// tiles. The library is lazy-loaded only when a post actually contains a
// ```journey block, so regular pages pay zero cost.
let leafletLoader = null;

function loadLeaflet() {
  if (window.L) return Promise.resolve();
  if (leafletLoader) return leafletLoader;
  leafletLoader = new Promise((resolve, reject) => {
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "assets/vendor/leaflet/leaflet.css";
    document.head.appendChild(css);
    const script = document.createElement("script");
    script.src = "assets/vendor/leaflet/leaflet.js";
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return leafletLoader;
}

// Basemaps (free, no API key). Default is a satellite hybrid — Esri World
// Imagery with a CARTO place-label overlay — with a per-map toggle to a
// street style (CARTO Voyager / Dark Matter, following the site theme).
const JOURNEY_BASEMAPS = {
  satellite: {
    layers: () => [
      ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", "Imagery &copy; <a href=\"https://www.esri.com/\">Esri</a>, Maxar, Earthstar Geographics"],
      ["https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png", '&copy; <a href="https://carto.com/attributions">CARTO</a>'],
    ],
    button: "🗺️",
    title: "Switch to street map",
  },
  // Stadia tiles authenticate by domain: localhost is always allowed, and
  // hurutta.github.io must be whitelisted in the Stadia dashboard (free plan).
  streets: {
    layers: () => [
      [
        "https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png",
        '&copy; <a href="https://www.stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      ],
    ],
    button: "🛰️",
    title: "Switch to satellite view",
  },
};
const JOURNEY_MODES = {
  bus: { emoji: "🚌", weight: 4, opacity: 0.9 },
  boat: { emoji: "🚤", weight: 3, opacity: 0.9, dashArray: "7 9" },
  train: { emoji: "🚆", weight: 4, opacity: 0.9, dashArray: "2 8", lineCap: "round" },
};
const journeyBasemapKey = "journeyBasemap";
const journeyMapRegistry = [];

function journeyBasemapStyle() {
  const stored = localStorage.getItem(journeyBasemapKey);
  return JOURNEY_BASEMAPS[stored] ? stored : "streets";
}

// Reliable street fallback (keyless CARTO) if the primary street tiles keep
// failing — e.g. transient Stadia throttling or a regional CDN hiccup.
const JOURNEY_STREET_FALLBACK = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

// Leaflet never retries a failed tile, so one throttled burst leaves gray
// holes until the next zoom. This wrapper retries each failed tile up to 3
// times with backoff, and if too many tiles stay dead it swaps the layer to
// the fallback URL so the reader never sits on a gray map.
function resilientTileLayer(url, options, fallbackUrl) {
  const layer = window.L.tileLayer(url, options);
  const attempts = new Map();
  let deadTiles = 0;
  let fellBack = false;
  layer.on("tileload", (e) => {
    if (e.coords) attempts.delete(`${e.coords.x}:${e.coords.y}:${e.coords.z}`);
  });
  layer.on("tileerror", (e) => {
    if (fellBack || !e.coords || !e.tile) return;
    const key = `${e.coords.x}:${e.coords.y}:${e.coords.z}`;
    const n = (attempts.get(key) || 0) + 1;
    attempts.set(key, n);
    if (n <= 3) {
      const base = e.tile.src.split(/[?&]retry=/)[0];
      const sep = base.includes("?") ? "&" : "?";
      setTimeout(() => {
        if (e.tile.isConnected) e.tile.src = `${base}${sep}retry=${n}`;
      }, 500 * n * n); // 0.5s, 2s, 4.5s
      return;
    }
    deadTiles += 1;
    if (fallbackUrl && deadTiles >= 5) {
      fellBack = true;
      attempts.clear();
      layer.setUrl(fallbackUrl);
    }
  });
  return layer;
}

function applyJourneyBasemap(entry) {
  const styleKey = journeyBasemapStyle();
  const style = JOURNEY_BASEMAPS[styleKey];
  entry.layers.forEach((layer) => entry.map.removeLayer(layer));
  entry.layers = style.layers().map(([url, attribution, extra], i) => {
    // updateWhenZooming:false skips fetching tiles for every intermediate
    // zoom level mid-flight — far fewer bursty requests (throttling trigger)
    // and lower credit burn. keepBuffer keeps recently-seen tiles around for
    // the looping animation to reuse.
    const options = { maxZoom: 18, attribution, updateWhenZooming: false, keepBuffer: 4, ...(extra || {}) };
    const fallback = styleKey === "streets" && i === 0 ? JOURNEY_STREET_FALLBACK : null;
    return resilientTileLayer(url, options, fallback).addTo(entry.map);
  });
  entry.btn.textContent = style.button;
  entry.btn.title = style.title;
}

function initJourneyMaps() {
  const containers = document.querySelectorAll(".journey-map[data-stops]");
  if (!containers.length) return;
  // Lazy-init: Leaflet and map tiles only load once the reader actually
  // scrolls the map into view — readers who never reach it cost zero tiles.
  const boot = (el) => {
    loadLeaflet()
      .then(() => {
        renderJourneyMap(el);
      })
      .catch(() => {
        el.style.display = "none"; // Leaflet unavailable — drop the placeholder
      });
  };
  if (!("IntersectionObserver" in window)) {
    containers.forEach(boot);
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        boot(entry.target);
      });
    },
    { rootMargin: "300px 0px" }
  );
  containers.forEach((el) => observer.observe(el));
}

async function renderJourneyMap(el) {
  if (el.dataset.ready) return;
  el.dataset.ready = "1";
  let stops;
  try {
    stops = JSON.parse(decodeURIComponent(el.dataset.stops));
  } catch (_) {
    return;
  }

  // Precomputed geometry: actual roads (OSRM), rail corridor, sea arcs.
  // Falls back to straight lines between stops if the file is missing.
  let segments = null;
  if (el.dataset.route) {
    try {
      const res = await fetch(el.dataset.route);
      if (res.ok) segments = (await res.json()).segments;
    } catch (_) {
      /* fall back below */
    }
  }
  if (!segments || !segments.length) {
    segments = [{ mode: "bus", coords: stops.map((s) => [s.lat, s.lng]) }];
  }

  const L = window.L;
  // zoomSnap: 0 permits fractional zoom levels — without it the chase-cam's
  // flyTo transitions quantize to whole zoom steps and look jittery.
  const map = L.map(el, { scrollWheelZoom: false, zoomSnap: 0 });

  // Basemap + the satellite/streets toggle control (Google-Maps style)
  const basemapBtn = L.DomUtil.create("button", "journey-map-btn journey-basemap-btn");
  basemapBtn.type = "button";
  const registryEntry = { map, layers: [], btn: basemapBtn };
  journeyMapRegistry.push(registryEntry);
  applyJourneyBasemap(registryEntry);
  basemapBtn.addEventListener("click", () => {
    localStorage.setItem(journeyBasemapKey, journeyBasemapStyle() === "satellite" ? "streets" : "satellite");
    journeyMapRegistry.forEach(applyJourneyBasemap);
  });
  const BasemapControl = L.Control.extend({
    onAdd() {
      L.DomEvent.disableClickPropagation(basemapBtn);
      return basemapBtn;
    },
  });
  new BasemapControl({ position: "topright" }).addTo(map);

  // One leg per hop between consecutive stops. When the precomputed geometry
  // doesn't line up with the stop list, fall back to straight hops.
  let legs;
  if (segments.length === stops.length - 1) {
    legs = segments.map((seg, i) => ({ mode: seg.mode, coords: seg.coords, from: stops[i], to: stops[i + 1] }));
  } else {
    legs = stops.slice(1).map((s, i) => ({
      mode: "bus",
      coords: [
        [stops[i].lat, stops[i].lng],
        [s.lat, s.lng],
      ],
      from: stops[i],
      to: s,
    }));
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const allCoords = [];
  const routeLines = []; // every polyline with its authored stroke, for zoom compensation
  const trackLine = (line, mode) => {
    const style = JOURNEY_MODES[mode] || JOURNEY_MODES.bus;
    routeLines.push({ line, weight: style.weight, dash: style.dashArray ? style.dashArray.split(" ").map(Number) : null });
    return line;
  };
  legs.forEach((leg) => {
    // Future (not yet traveled) path is faded; a progress line is painted
    // over it as the traveler advances — Google-Maps-navigation style.
    trackLine(L.polyline(leg.coords, journeyLineOptions(leg.mode, !reducedMotion)).addTo(map), leg.mode);
    if (!reducedMotion) leg.progressLine = trackLine(L.polyline([], journeyLineOptions(leg.mode, false)).addTo(map), leg.mode);
    allCoords.push(...leg.coords);
  });

  // Merge stops that share coordinates (e.g. a return to the starting city)
  // into a single marker whose popup lists every visit.
  const merged = new Map();
  stops.forEach((s, idx) => {
    const key = `${s.lat},${s.lng}`;
    if (merged.has(key)) {
      if (s.note) merged.get(key).notes.push(s.note);
    } else {
      merged.set(key, { name: s.name, lat: s.lat, lng: s.lng, order: idx + 1, notes: s.note ? [s.note] : [] });
    }
  });
  merged.forEach((s) => {
    const icon = L.divIcon({
      className: "journey-stop",
      html: `<span class="journey-stop-pin">${s.order}</span>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });
    const notesHtml = s.notes.map((n) => `<div class="journey-pop-note">${n}</div>`).join("");
    L.marker([s.lat, s.lng], { icon }).addTo(map).bindPopup(`<div class="journey-pop"><strong>${s.name}</strong>${notesHtml}</div>`);
  });

  const overviewBounds = L.latLngBounds(allCoords);
  map.fitBounds(overviewBounds, { padding: [36, 36] });

  // During zoom animations Leaflet CSS-scales the vector pane by 2^Δzoom and
  // only redraws the paths at the end — momentarily fattening the strokes.
  // Counter-scale stroke width and dash pattern every animation frame so the
  // lines keep a constant on-screen width throughout the flight.
  let renderZoom = map.getZoom();
  let strokeScaled = false;
  const resetStrokes = () => {
    renderZoom = map.getZoom();
    if (!strokeScaled) return;
    strokeScaled = false;
    routeLines.forEach(({ line, weight, dash }) => line.setStyle({ weight, dashArray: dash ? dash.join(" ") : null }));
  };
  map.on("zoom", () => {
    const scale = map.getZoomScale(map.getZoom(), renderZoom);
    if (scale === 1) return;
    strokeScaled = true;
    routeLines.forEach(({ line, weight, dash }) =>
      line.setStyle({ weight: weight / scale, dashArray: dash ? dash.map((n) => n / scale).join(" ") : null })
    );
  });
  map.on("zoomend viewreset", resetStrokes);

  if (!reducedMotion) startJourneyTraveler(map, legs, stops, overviewBounds);
}

// --- Journey tile prefetch --------------------------------------------------
// The journey is deterministic: each leg's path and camera zoom are known
// before the camera gets there. While leg N plays, leg N+1's tile corridor is
// quietly warmed into the browser's HTTP cache (gently, 4 at a time), so the
// chase cam almost never reveals an unloaded tile. Cache hits never reach the
// tile server, so a prefetched tile is paid for once.

// Tiles the viewport will sweep over along `coords` at the camera zoom.
// Leaflet renders fractional zooms with tiles from Math.round(zoom) — the
// grid here must match that exactly or the whole prefetch warms the wrong
// cache.
function journeyCorridorTiles(coords, zoom, sizePx) {
  const tz = Math.round(zoom);
  const n = Math.pow(2, tz);
  const scale = Math.pow(2, tz - zoom); // tile-zoom pixels per screen pixel
  const halfW = (sizePx.x / 2) * scale + 32;
  const halfH = (sizePx.y / 2) * scale + 32;
  const seen = new Set();
  const tiles = [];
  coords.forEach(([lat, lng]) => {
    const px = ((lng + 180) / 360) * 256 * n;
    const latR = (lat * Math.PI) / 180;
    const py = ((1 - Math.log(Math.tan(latR) + 1 / Math.cos(latR)) / Math.PI) / 2) * 256 * n;
    const x0 = Math.floor((px - halfW) / 256);
    const x1 = Math.floor((px + halfW) / 256);
    const y0 = Math.floor((py - halfH) / 256);
    const y1 = Math.floor((py + halfH) / 256);
    for (let x = x0; x <= x1; x += 1) {
      for (let y = y0; y <= y1; y += 1) {
        if (y < 0 || y >= n) continue;
        const wx = ((x % n) + n) % n;
        const key = `${wx}:${y}`;
        if (!seen.has(key)) {
          seen.add(key);
          tiles.push({ x: wx, y, z: tz });
        }
      }
    }
  });
  return tiles;
}

// Build the exact URL Leaflet will request for this tile — same template,
// same retina token, same subdomain formula. One character of drift means a
// cache miss and the tile gets paid for twice. (layer._url is technically
// private but stable across Leaflet 1.x, and is authoritative after setUrl.)
function journeyPrefetchUrl(layer, tile) {
  const subs = layer.options.subdomains || "";
  return window.L.Util.template(
    layer._url,
    window.L.Util.extend(
      {
        r: window.L.Browser.retina ? "@2x" : "",
        s: subs.length ? subs[Math.abs(tile.x + tile.y) % subs.length] : "",
        x: tile.x,
        y: tile.y,
        z: tile.z,
      },
      layer.options
    )
  );
}

function journeyLineOptions(mode, future) {
  const style = JOURNEY_MODES[mode] || JOURNEY_MODES.bus;
  return {
    className: `journey-route journey-route-${mode}${future ? " journey-route-future" : ""}`,
    weight: style.weight,
    opacity: style.opacity,
    dashArray: style.dashArray || null,
    lineCap: style.lineCap || "butt",
    interactive: false,
  };
}

// A little vehicle replays the whole trip on loop: it travels each leg with
// the camera following (zoomed to that leg), pauses at every checkpoint with
// a name bubble, and paints the traveled path in full color while the road
// ahead stays faded. Dragging or zooming hands the camera back to the reader;
// the 🎥 control re-engages the chase cam or pops back to the overview.
function startJourneyTraveler(map, legs, stops, overviewBounds) {
  const L = window.L;

  legs.forEach((leg) => {
    const d = [0];
    for (let i = 1; i < leg.coords.length; i++) {
      const dLat = leg.coords[i][0] - leg.coords[i - 1][0];
      const dLng = (leg.coords[i][1] - leg.coords[i - 1][1]) * Math.cos((leg.coords[i][0] * Math.PI) / 180);
      d.push(d[i - 1] + Math.sqrt(dLat * dLat + dLng * dLng));
    }
    leg.dist = d;
    leg.total = d[d.length - 1] || 1e-9;
    const km = leg.total * 111;
    leg.duration = 2600 + Math.min(4800, km * 9);
    leg.zoom = Math.max(5, Math.min(13, map.getBoundsZoom(L.latLngBounds(leg.coords).pad(0.4))));
  });

  const icons = {};
  const iconFor = (mode) => {
    if (!icons[mode]) {
      const emoji = (JOURNEY_MODES[mode] || JOURNEY_MODES.bus).emoji;
      icons[mode] = L.divIcon({
        className: "journey-traveler",
        html: `<span>${emoji}</span>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });
    }
    return icons[mode];
  };

  const marker = L.marker(legs[0].coords[0], { icon: iconFor(legs[0].mode), interactive: false, keyboard: false, zIndexOffset: 500 }).addTo(map);
  const tip = L.tooltip({ direction: "top", offset: [0, -16], className: "journey-stop-tip", interactive: false });

  let follow = true;
  let programmatic = false;
  let flying = false; // a flyTo transition is in progress — hands off the camera

  // Camera moves come in two flavours: panCam is the cheap per-frame pan at a
  // FIXED zoom (travel), flyCam/flyOverview are single smooth animated
  // transitions used only while the vehicle is paused — zoom never changes
  // mid-travel, which is what keeps the chase cam judder-free.
  function panCam(center, zoom) {
    programmatic = true;
    map.setView(center, zoom, { animate: false });
    programmatic = false;
  }
  function flyCam(center, zoom) {
    flying = true;
    programmatic = true;
    map.flyTo(center, zoom, { duration: 1.1 });
    programmatic = false;
  }
  function flyOverview() {
    flying = true;
    programmatic = true;
    map.flyToBounds(overviewBounds, { padding: [36, 36], duration: 1.3 });
    programmatic = false;
  }
  map.on("moveend", () => {
    flying = false;
  });

  const followBtn = L.DomUtil.create("button", "journey-map-btn journey-follow-btn is-on");
  followBtn.type = "button";
  followBtn.textContent = "🎥";
  const setFollow = (v) => {
    follow = v;
    followBtn.classList.toggle("is-on", v);
    followBtn.title = v ? "Following the journey — click for full-route view" : "Click to follow the journey";
  };
  setFollow(true);
  followBtn.addEventListener("click", () => {
    if (follow) {
      setFollow(false);
      flyOverview();
    } else {
      setFollow(true);
      flyCam(marker.getLatLng(), legs[legIndex].zoom);
    }
  });
  const FollowControl = L.Control.extend({
    onAdd() {
      L.DomEvent.disableClickPropagation(followBtn);
      return followBtn;
    },
  });
  new FollowControl({ position: "topright" }).addTo(map);
  map.on("dragstart", () => setFollow(false));
  map.on("zoomstart", () => {
    if (!programmatic) setFollow(false);
  });

  const DWELL_MS = 2100;
  const FINALE_MS = 3400; // longer pause on the completed route overview
  let legIndex = 0;
  let phase = "dwell"; // open by introducing the first stop
  let phaseStart = null;
  let pendingReset = false;

  // One-leg-ahead tile prefetch (see journeyCorridorTiles). Deduped across
  // the whole session so loop replays and repeated triggers cost nothing.
  const prefetchedUrls = new Set();
  function prefetchLeg(idx) {
    if (!follow || idx >= legs.length) return;
    const entry = journeyMapRegistry.find((e) => e.map === map);
    if (!entry) return;
    let tiles = journeyCorridorTiles(legs[idx].coords, legs[idx].zoom, map.getSize());
    if (tiles.length > 120) tiles = tiles.slice(0, 120); // volume backstop
    const queue = [];
    entry.layers.forEach((layer) => {
      if (!layer._url || layer._url.indexOf("{x}") === -1) return;
      tiles.forEach((tile) => {
        const url = journeyPrefetchUrl(layer, tile);
        if (!prefetchedUrls.has(url)) {
          prefetchedUrls.add(url);
          queue.push(url);
        }
      });
    });
    let active = 0;
    const pump = () => {
      if (!map._loaded || !map._container.isConnected || !follow) return;
      while (active < 4 && queue.length) {
        const img = new Image();
        active += 1;
        img.onload = img.onerror = () => {
          active -= 1;
          pump();
        };
        img.src = queue.shift();
      }
    };
    pump();
  }

  const showStopTip = (stop) => {
    const note = stop.note ? `<span class="journey-tip-note">${stop.note}</span>` : "";
    tip.setContent(`<strong>${stop.name}</strong>${note}`).setLatLng([stop.lat, stop.lng]).addTo(map);
  };

  const resetLoop = () => {
    legs.forEach((leg) => leg.progressLine.setLatLngs([]));
    legIndex = 0;
    marker.setLatLng(legs[0].coords[0]);
    marker.setIcon(iconFor(legs[0].mode));
  };

  function frame(now) {
    if (!map._loaded || !map._container.isConnected) return; // map torn down (SPA nav)
    if (phaseStart === null) {
      phaseStart = now;
      showStopTip(stops[0]);
      if (follow) flyCam([stops[0].lat, stops[0].lng], legs[0].zoom);
      prefetchLeg(0); // warm the first leg's corridor during the opening pause
    }

    if (phase === "dwell") {
      if (now - phaseStart >= (pendingReset ? FINALE_MS : DWELL_MS)) {
        tip.remove();
        if (pendingReset) {
          pendingReset = false;
          resetLoop();
          phaseStart = now;
          showStopTip(stops[0]);
          if (follow) flyCam(legs[0].coords[0], legs[0].zoom);
        } else {
          phase = "travel";
          phaseStart = now;
          marker.setIcon(iconFor(legs[legIndex].mode));
          prefetchLeg(legIndex + 1); // warm the next leg while this one plays
        }
      }
      requestAnimationFrame(frame);
      return;
    }

    const leg = legs[legIndex];
    const t = Math.min(1, (now - phaseStart) / leg.duration);
    const dTarget = t * leg.total;
    let i = 1;
    while (i < leg.dist.length - 1 && leg.dist[i] < dTarget) i++;
    const f = (dTarget - leg.dist[i - 1]) / (leg.dist[i] - leg.dist[i - 1] || 1);
    const lat = leg.coords[i - 1][0] + (leg.coords[i][0] - leg.coords[i - 1][0]) * f;
    const lng = leg.coords[i - 1][1] + (leg.coords[i][1] - leg.coords[i - 1][1]) * f;
    marker.setLatLng([lat, lng]);
    leg.progressLine.setLatLngs([...leg.coords.slice(0, i), [lat, lng]]);

    // Constant-zoom pan only; zoom reframing happened during the dwell pause
    if (follow && !flying) panCam([lat, lng], leg.zoom);

    if (t >= 1) {
      leg.progressLine.setLatLngs(leg.coords);
      const arrived = stops[legIndex + 1];
      showStopTip(arrived);
      if (legIndex === legs.length - 1) {
        pendingReset = true;
        if (follow) flyOverview(); // journey complete — pull back to see it all
      } else {
        legIndex += 1;
        // reframe for the upcoming leg while the vehicle is parked
        if (follow) flyCam([arrived.lat, arrived.lng], legs[legIndex].zoom);
      }
      phase = "dwell";
      phaseStart = now;
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function parseFrontMatter(source) {
  if (source.startsWith("---")) {
    const end = source.indexOf("\n---", 3);
    if (end !== -1) {
      const raw = source.slice(3, end).trim();
      const body = source.slice(end + 4).trim();
      const frontmatter = {};
      raw.split("\n").forEach((line) => {
        const [key, ...rest] = line.split(":");
        if (!key || rest.length === 0) return;
        frontmatter[key.trim()] = rest.join(":").trim().replace(/^"|"$/g, "");
      });
      return { frontmatter, body };
    }
  }
  return { frontmatter: {}, body: source };
}

function markdownToHtml(markdown) {
  const lines = markdown.split(/\r?\n/);
  let html = "";
  let buffer = [];
  let inList = false;
  let imageBuffer = [];

  const flushImages = () => {
    if (!imageBuffer.length) return;
    if (imageBuffer.length === 1) {
      const { alt, src, caption } = imageBuffer[0];
      html += `<figure class="md-image"><img src="${src}" alt="${alt}" loading="lazy" />`;
      if (caption) html += `<figcaption>${caption}</figcaption>`;
      html += "</figure>";
    } else {
      const extraCount = imageBuffer.length > 3 ? imageBuffer.length - 3 : 0;
      html += `<div class="md-image-grid">`;
      imageBuffer.forEach(({ alt, src, caption }, i) => {
        const isExtra = i >= 3;
        const isLastVisible = i === 2 && extraCount > 0;
        const cls = isExtra ? "md-image md-image-extra" : "md-image";
        const moreAttr = isLastVisible ? ` data-more="${extraCount}" onclick="this.closest('.md-image-grid').classList.add('expanded')"` : "";
        html += `<figure class="${cls}"${moreAttr}><img src="${src}" alt="${alt}" loading="lazy" />`;
        if (caption) html += `<figcaption>${caption}</figcaption>`;
        html += "</figure>";
      });
      html += `</div>`;
    }
    imageBuffer = [];
  };

  const flushParagraph = () => {
    if (buffer.length) {
      const joined = buffer.join(" ");
      // Route line: paragraph that is purely italic with arrow characters
      const routeMatch = joined.match(/^\*([^*]+→[^*]+)\*$/);
      if (routeMatch) {
        const stops = routeMatch[1].split("→").map((s) => s.trim()).filter(Boolean);
        const stopsHtml = stops
          .map((stop, idx) => {
            let h = `<span class="md-route-stop">${stop}</span>`;
            if (idx < stops.length - 1) h += `<span class="md-route-arrow">→</span>`;
            return h;
          })
          .join("");
        html += `<div class="md-route"><span class="md-route-icon"></span>${stopsHtml}</div>`;
      } else {
        html += `<p>${inlineMarkdown(joined)}</p>`;
      }
      buffer = [];
    }
  };

  const closeList = () => {
    if (inList) {
      html += "</ul>";
      inList = false;
    }
  };

  const isTableRow = (line) => /^\|.*\|$/.test(line);
  const isTableDivider = (line) => /^\s*\|?(?:\s*:?-+:?\s*\|)+\s*:?-+:?\s*\|?\s*$/.test(line);
  const parseTableRow = (line) =>
    line
      .replace(/^\||\|$/g, "")
      .split("|")
      .map((cell) => inlineMarkdown(cell.trim()));

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === "") {
      flushParagraph();
      closeList();
      flushImages();
      continue;
    }

    // Horizontal rules
    if (/^---+$/.test(trimmed)) {
      flushParagraph();
      closeList();
      flushImages();
      html += `<div class="md-divider"><span class="md-divider-ornament"></span></div>`;
      continue;
    }

    // Fenced code blocks: ```lang ... ``` (journey fences handled below)
    const fenceMatch = trimmed.match(/^```(\w*)$/);
    if (fenceMatch && trimmed !== "```journey") {
      flushParagraph();
      closeList();
      flushImages();
      const lang = fenceMatch[1] || "code";
      const codeLines = [];
      while (i + 1 < lines.length && lines[i + 1].trim() !== "```") {
        i += 1;
        codeLines.push(lines[i]);
      }
      if (i + 1 < lines.length) i += 1; // consume closing fence
      const escaped = codeLines
        .join("\n")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      const langClass = fenceMatch[1] ? ` class="language-${fenceMatch[1]}"` : "";
      html +=
        `<figure class="md-code"><figcaption><span class="md-code-lang">${lang}</span>` +
        `<button type="button" class="md-code-copy" onclick="navigator.clipboard.writeText(this.closest('.md-code').querySelector('code').innerText);this.textContent='Copied ✓';setTimeout(()=>{this.textContent='Copy'},1400)">Copy</button>` +
        `</figcaption><pre><code${langClass}>${escaped}</code></pre></figure>`;
      continue;
    }

    // Journey map block: ```journey ... ``` with one "Name | lat, lng | note"
    // per line, plus an optional "route: <geometry file>" line pointing at
    // precomputed road/sea geometry in assets/routes/.
    if (trimmed === "```journey") {
      flushParagraph();
      closeList();
      flushImages();
      const stops = [];
      let routeFile = "";
      while (i + 1 < lines.length && lines[i + 1].trim() !== "```") {
        i += 1;
        const entry = lines[i].trim();
        const routeMatch = entry.match(/^route:\s*(.+)$/);
        if (routeMatch) {
          routeFile = routeMatch[1];
          continue;
        }
        const parts = entry.split("|").map((p) => p.trim());
        if (parts.length < 2) continue;
        const coords = parts[1].split(",").map(Number);
        if (coords.length !== 2 || coords.some(Number.isNaN)) continue;
        stops.push({ name: parts[0], lat: coords[0], lng: coords[1], note: parts[2] || "" });
      }
      if (i + 1 < lines.length) i += 1; // consume closing fence
      if (stops.length >= 2) {
        const routeAttr = routeFile ? ` data-route="${routeFile}"` : "";
        html += `<div class="journey-map" data-stops="${encodeURIComponent(JSON.stringify(stops))}"${routeAttr}></div>`;
      }
      continue;
    }

    // Blockquotes
    if (/^>\s?/.test(trimmed)) {
      flushParagraph();
      closeList();
      flushImages();
      const quoteLines = [trimmed.replace(/^>\s?/, "")];
      while (i + 1 < lines.length && /^>\s?/.test(lines[i + 1].trim())) {
        i += 1;
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ""));
      }
      const quoteText = quoteLines.join(" ");
      const hashtags = quoteText.match(/#\w+/g);
      if (hashtags) {
        const prefix = inlineMarkdown(quoteText.replace(/#\w+/g, "").trim());
        const tagsHtml = hashtags.map((tag) => `<span class="md-tag">${tag}</span>`).join("");
        html += `<blockquote class="md-quote"><span class="md-quote-icon"></span><div class="md-quote-body">${prefix}<div class="md-tags">${tagsHtml}</div></div></blockquote>`;
      } else {
        html += `<blockquote class="md-quote"><span class="md-quote-icon"></span><div class="md-quote-body">${inlineMarkdown(quoteText)}</div></blockquote>`;
      }
      continue;
    }

    const imageMatch = trimmed.match(/^!\[(.*?)\]\((.*?)(?:\s+"(.*?)")?\)$/);
    if (imageMatch) {
      flushParagraph();
      closeList();
      const [, alt = "", src = "", title = ""] = imageMatch;
      const caption = title || alt;
      imageBuffer.push({ alt, src, caption });
      continue;
    }

    if (isTableRow(trimmed) && isTableDivider(lines[i + 1]?.trim() || "")) {
      flushParagraph();
      closeList();
      flushImages();
      const headerCells = parseTableRow(trimmed);
      i += 1; // skip divider
      const rows = [];
      while (i + 1 < lines.length && isTableRow(lines[i + 1].trim())) {
        rows.push(parseTableRow(lines[i + 1].trim()));
        i += 1;
      }
      // Plain-text header labels ride along on every cell so narrow layouts
      // can restack each row as a labelled card instead of crushing columns
      const headerLabels = headerCells.map((cell) =>
        cell.replace(/<[^>]*>/g, "").replace(/"/g, "&quot;").trim()
      );

      // Itinerary tables (Day | Destination | Highlights | Overnight) become
      // a journey rail: numbered day nodes on a glowing timeline, each card
      // linking to that day's section. Generic tables keep the table layout.
      const isItinerary =
        headerLabels[0]?.toLowerCase() === "day" &&
        headerCells.length >= 3 &&
        rows.length > 0 &&
        rows.every((row) => /^\d+$/.test((row[0] || "").replace(/<[^>]*>/g, "").trim()));
      if (isItinerary) {
        html += `<div class="md-itinerary">`;
        rows.forEach((row) => {
          const dayNum = (row[0] || "").replace(/<[^>]*>/g, "").trim();
          const dest = row[1] || "";
          const notes = row[2] || "";
          const night = (row[3] || "").trim();
          html +=
            `<a class="iti-item" href="#day-${dayNum}">` +
            `<span class="iti-node">${dayNum}</span>` +
            `<span class="iti-card">` +
            `<span class="iti-head"><span class="iti-dest">${dest}</span>` +
            (night ? `<span class="iti-night"><span class="iti-night-icon">☾</span>${night}</span>` : "") +
            `</span>` +
            (notes ? `<span class="iti-notes">${notes}</span>` : "") +
            `</span></a>`;
        });
        html += `</div>`;
        continue;
      }

      html += "<div class=\"md-table\"><table><thead><tr>";
      headerCells.forEach((cell) => {
        html += `<th>${cell}</th>`;
      });
      html += "</tr></thead><tbody>";
      rows.forEach((row) => {
        html += "<tr>";
        row.forEach((cell, cellIndex) => {
          html += `<td data-label="${headerLabels[cellIndex] || ""}">${cell}</td>`;
        });
        html += "</tr>";
      });
      html += "</tbody></table></div>";
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      flushParagraph();
      closeList();
      flushImages();
      const level = Math.min(6, headingMatch[1].length);
      // Day heading detection: ## Day N: Title
      if (level === 2) {
        const dayMatch = headingMatch[2].match(/^Day\s+(\d+)(?:\s*@\s*([^:]+?))?\s*:\s*(.*?)(?:\s*\|\s*(.+))?$/);
        if (dayMatch) {
          const [, dayNum, dayLoc, dayTitle, dayDate] = dayMatch;
          const dateHtml = dayDate ? `<span class="md-day-date">${dayDate.trim()}</span>` : "";
          const locAttr = dayLoc ? ` data-loc="${dayLoc.trim()}"` : "";
          html += `<h2 class="md-day-heading" id="day-${dayNum}" data-day="${dayNum}"${locAttr}><span class="md-day-badge">Day ${dayNum}</span>${dateHtml}<span class="md-day-title">${inlineMarkdown(dayTitle)}</span></h2>`;
          continue;
        }
      }
      html += `<h${level}>${inlineMarkdown(headingMatch[2])}</h${level}>`;
      continue;
    }

    if (/^[-*+]\s+/.test(trimmed)) {
      flushParagraph();
      flushImages();
      if (!inList) {
        html += "<ul>";
        inList = true;
      }
      const item = trimmed.replace(/^[-*+]\s+/, "");
      html += `<li>${inlineMarkdown(item)}</li>`;
      continue;
    }

    flushImages();
    buffer.push(trimmed);
  }

  flushParagraph();
  closeList();
  flushImages();
  return html;
}

function inlineMarkdown(text) {
  return text
    .replace(/(?<!!)\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>");
}

function buildPostContentMap() {
  const headings = document.querySelectorAll("#postContent .md-day-heading");
  if (!headings.length) return "";
  const links = Array.from(headings).map((h) => {
    const day = h.dataset.day;
    const loc = h.dataset.loc;
    return `<a href="#day-${day}">Day ${day}${loc ? `: ${loc}` : ""}</a>`;
  }).join("");
  return `
    <div class="content-map" aria-label="On this page">
      <span class="content-map-label">On this page</span>
      <div class="content-map-links">
        ${links}
        <a href="#top" class="content-map-link-top" aria-label="Back to top">Top ↑</a>
      </div>
    </div>
  `;
}

function injectPostContentMap() {
  const rightPanel = document.querySelector(".right-panel[data-page='post']");
  if (!rightPanel) return;
  // Remove any existing post content map
  const existing = rightPanel.querySelector(".content-map");
  if (existing) existing.remove();
  const mapHtml = buildPostContentMap();
  if (mapHtml) {
    rightPanel.insertAdjacentHTML("afterbegin", mapHtml);
  }
}

function renderPostError(titleEl, metaEl, categoryEl, contentEl, message) {
  titleEl.textContent = "Unable to load that post.";
  metaEl.textContent = "";
  categoryEl.textContent = "Error";
  contentEl.innerHTML = `<p>${message}</p>`;
}

// --- ASCII portrait ---------------------------------------------------------
// Colored ASCII self-portrait (72 cols x 48 rows). Each row is [glyphs, colors]
// where colors is the concatenated 6-digit hex for every non-space glyph.
const ASCII_PORTRAIT_ROWS = [
  ["########***#####*****#####################********###############*******", "b1dbe2b3dbe3b7dee5bbdee7bbe0e8b4dbe4aed7e0abd2dca7ced9a7ced9a5d0dea9d5e0aad6e0aad6dfa7d3dca9d5dea5d1d9a2cfd59fccd2a0ced4a7d2d9acd7deafdae1add8e0aed8e1b0d7e1b2d8e1b2d7dfb6dbe3b1d6deb8dde5c2e6eec0e3eabbdde4b9dde4b7dbe3abd1d9b5dbe3c0e3eac2e3eabedfe6b3d6ddabd0d6a3c9cda6ced19ec8cb9cc3c7aacfd3aad0d4aad0d5add2d8afd4dab2d6ddbae1e7c0e2e9bddfe6bfe2e7c2e5e9c4e4e9c0dfe4bedee3c0e0e5c0e0e5c1e1e6badadfafcfd4a1c4c99abfc39dc4c79dc8cb9ac5c99bc6c8"],
  ["*+**######*******++**##******#***+++++*###########*****####**###########", "8fb7be8ab5bc90bdc39fd0d4a8d6deacd9e5add7e6abd4e1afd8e6b2dbe9a3cedaa1cdd6a6d2da9ec8d19bc4cd9ec7d098c3cb8ab6bd87b5bb91bdc4a0cad2acd7deb0dbe39ecad393bfc89ecad3a6d0d8a8d0d7a7ced6abd3daa5d2d894c4c987bbbd7eb2b475a9ac6ea5a973a8ad83b2b89ec5cbbddfe6c5e4ecc6e6eec2e2e9c3e1e7c0dfe5bcdde2bbdfe3b9dee2b5dadeaed2d7a3c8cea1c5cca5c9cfa9ccd3a5cbd1afd2d8c1dee5bfdee3b2d3d8a1c3c8a4c4c9b0d0d5b7d7dcb5d5dab4d5dabddee3bfe3e7c0e5e9bde2e6b9dee2badbe1b6dbdf"],
  ["*########*###**##******#######******++=++++**######################**###", "a9cfddaed3e1b0d3e2b2d7e5b6dae8b4d8e4b1d5dfaed3dcadd1dba6cbd4acd3ddb3dae4afd6e0a9d0daa9cfdab4dae4b0d6e0a9d0daa7ced8a7ced8a6ced7a6cfdaa6d1dda8d3deabd5e0afd9e4b2dde6b1dbe1abd4d9aad2d5a4ccd19cc7cb98c6ca9ac7cb95c7cb8dc3c87cb8bb69a8a961a0a064a4a463a4a26aa7a679b2b398c3c5a8d1d4b0d7dab6dadebbdde2c0e1e6c3e3e8c5e7ebc4e4e8bfdfe3b7dbdfb3d6dab4d4d9b4d4d9b6d5dbbedee3bedee3bddde2c1e1e6c2e2e7c2e6eac2e7ebb8dde1aad2d7a0c7cdaaced4b6dae0c0e1e8bbdfe5"],
  ["*#####################**##***+**+++====++++*+==+++++++++*######**++==+++", "9dc2cbacd1d9b8dbe4c0e2ecbee1eac2e1ebc5e3eec7e3eec1e1e9b6d7deb6dce4badfe8b8dce6b6dbe7b8ddeab5dce8b4dce8b6dfebb3dde7aed9e1b0dde3abd9df99c7cea2ced4afd8deafd5dc9fc6cd9cc6cb92bec387b5b992c2c697c9cc86b8ba71abab66a5a45ca09e579e9b559c99579e9b6ab1ad73b6b472b2b179b5b48cc4c36da9a7599b97599d9b68a7a57db8b481bcb682b7b27aaca977a6a380b4b480b2b385b4b59ec7cab4d6dbc7e6ecc3e2e8bbdbe1b7d9deb0d4d89ec9ce93c0c483b2b670a1a45d9798639c9d7badaf86b6b979aaad"],
  ["+****###*****+++**+++++***########******+++****++++++++++++*************", "85abb390b5bd9cbfc8a6c9d2a9ccd5b2d1dbb9dae4b4d8e1abd1d7a9cfd4a9d0d5a5cfd496c3c97dabb171a0a57fb0b489bbbe88bbbc7bb0b26ea4a767a3a56fa8ab7aafb28dbbc09fcacfa8cfd5b1d6dcbbe0e6b9dfe5b1d8ddb6dbe1bbe0e6bee2e9b2d3d8aacfd3a2ccce97c7c892c5c593c6c588bcbc73a8aa7aacaf83b2b58fbbbda1cdd09eccce88bcbc79b2b16faaa868a3a170a9a781b6b587b8b887b8b979adad75aaaa7bb1b082b5b68bb6b99dc3c7a2c9cca3c8cca7cacea7c9d0a7c9d0a2c7cda3c9cfabcfd5abcfd6aacfd5a9cbd2a0c4ca"],
  ["++++++++++*******##***+++++**#######***########**********++*************", "6b9fa376a8ad86b6bc84b4b87eacb080acb085b1b681afb37dabaf88b5b99bc5c7a3cccfa2cccfa1cacea2cdd4a0cfd6a3d3dba6d7dea5d7de9ed2d898c7cd8abbc177acb06ba5a666a2a369a3a476a8ab8ab8bca3cfd4b1dce0b0dadcafd7dab2d7dabcdde2bcdee2afd3d7a4c8cca3c9ccaaced3add1d5b0d5d9b5dadeb4d9ddb7dee0bbdbdfb1d4d7abd3d5a9d2d4a4cfd19dc8cb9bc7c99bc6c89bc6c89bc3c697c2c490c0c189babb84b2b487b1b498c0c4a5cbd1a9cdd3a6c9cfa8ccd2acd0d6aaced4a1c6ce97bdc597bdc5a4cad2a6ccd49ec3ca"],
  ["**********##******++++*#***+++++*#*+*###*############***********###*****", "95c4ca96c6cb92c0c68db9be97c4c999c9cd91c1c498c6caa1ced2a0cdd1a7d4d9a8d6daa3d0d49fcfd29dcdd39bccd196c9d088bdc47fb7bc7ab4b87db6b882b8bb8dbfc1a7d4d7a2cbcf94bfc38cbec183b9ba7db1b385b8b985b6b784b2b4a0cbcdb0d8daa1c6c98db1b4a1c5c7b5d6d8bbdbdfb1d4d7a5c7ccb2d3d7b4d6dabadfe1b2d7d9afd0d3b4d4d6bddde0c3e4e9bddfe3b6d9ddb6dadeb4d8dcabcbd1a1c3c8a6cacfa7cfd2a8ced3a0c4c89dc0c59dbfc6a1c4cba0c5cba6cad1afd2d9b2d5dcafd4dba5cbd39fc4cca0c5cda8ced5a7cbd3"],
  ["+++**+*++++****+++++++++**+-:::::...::::----==++******#*#*****++++******", "7cafb17aacaf84b4b88dbbc191bec489b6bc8ab7bd88b4ba7fabb17fabb188b5bb94c0c79dc9cf9fcbd296c5cb84b8bd74adb171acb171abb06ca6ab6eaaab6da7a870abaa7cadaf8eb8ba96b8bd849ea651667043556044525e414c5838424e38404c3135402e313d3438433d404c4549534f545e50555c53565e595c645c5f6861656e6b737c83919886989c8ea5a7a0bcc0adcacfabcbd0a8cacea6caceadd0d7b0d3daadd0d7b1d1d8afcfd6aeced5accbd2a6c5cd97bac18cb0b784aeb587b1b88cb5bc8fb8bd96bfc49bc5ca9ec6cba4cacfa8cdd3"],
  ["###****************+++=:-.\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0...\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0..:::-=+**##############*****+", "b7dae1b3d7ddacd1d79fc4cd99bec895b9c49bc0ca9bc2cc9ac1cb9bc2cca2c7d1a3c8d3a4cbd5a7d2dba1cdd691bcc58bb7c08fbcc38bbbbf7fb0b274a4a37ea4a8627f843d505b5e6c792733400d1424090d1f0d11230e12240c0d220f102517182d1e1f322425382122351617280f11210d0f1f1113230c0e1e0b0d1d1c1e2d2c2a363c3b453c3b424a4a5053565b70777c9aa9ad9ab4ba9ebcc3aed2dabbdce3c2e2e9bedee5bcdce3bfdfe6c0e0e7bedfe6bddee5bedee5c0dee6bcdbe5bad9e3b5d4deadcad5a9c8d2a5c9d19cc3ca8fb7be85b3ba"],
  ["#####**#####*****++==-.\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0...::--=*##################**", "bcdde7badce6b6dae4b4d9e3acd1dba9cdd8abd0daaed5dfb0d7e1b0d7e1acd3dda9d2dca5cfd9a7cfd8a6ccd6a2c6d19dbec889a4ac7e969c778c926a7a824f5b652128331113230f1424090f1f080d1e090d1f090d1f0a0d1f0d0e210c0d200d0e210c0d200c0d200c0d200b0d1e0a0c1c0a0c1c121424100f201211221a19292f2d3c201e2a2e2c3641404741404758585e66676d7a858ab0c6cabfdde0c1e1e8b8d8dfb4d5dcb4d4dbbbdbe2bddde4b3d4dbb1d3dabadae1bfdde5c5e4eec5e4eec2e2ebc4e1ecc2e1ebbadee6b1d7dfa7d0d79cc9d0"],
  ["**************+++=-...\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0.....::::=***#####**++*++++++", "a9cfd9a6ccd79ec5cf93bec78db9c28cb6bf95bcc6a0c7d2a6cedaa6cfdda6d1e1a4d0dda4d0db96c3ce8ab2bb88aab1849ea375868a646f75282c341e212e1b1d2b1013220c0f1e0d0e1f0c0d200a0c1f090d1f090d1f090d1e0c0e1e0d0f1f1214241113230b0d1d0b0d1d161625171625100f1e1514231918271817261918272725341d1b292826333736412c2b33403f4549474c4644494b4c50767d809fb2b7b0c8cdacc9d0bbd9e1c0dee6c4e2eac5e6ecbee1e5acd0d49cc0c490b2b990b3ba8fb5bb82acb17ba8ac83b1b583b4b779abae78abae"],
  ["***************+=-...\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0...\u00a0\u00a0..:..\u00a0...::=+##########***##*", "95c3ca94c1c897c3cb9bc7cf9fcad2a0cad3a2cad4a4ccd79fc8d495c0cb8ebcc88dbec791c1c996c3ca90b6bb7f9ea1798b90535b6031323b1d1c251d1c2a1413220f0f1f0d0f1f0e11210e10220a0d1f090d1e090c1e0a0c1d0c0e1e0c0e1e0b0d1c0b0e1e0d0f1f0d112010121f1616211b1b272f2f3a25243116152318172622202f2e2c3a3c3a4836344129283412111b2120292021282c2a314542475255597882878da1a6b4cfd6bfdde5c5e3ebc0e0e6bbdee2b9dce0b8dce0badae1b8d8dfb2d3daadced5abccd3acd0d6b4d8deb3d9dea8d2d6"],
  ["+=++++++++=======-:..\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0.:.::...\u00a0\u00a0\u00a0.\u00a0\u00a0\u00a0\u00a0..:-+*##############", "68a2a6659ca26a9da36ea1a873a6ad75a9b079abb382b3be7fb2bb70a6a9609c9d5899985d9b9c629b9c6998996f929366797b5158604445512727361a1b2c1718281213230d10220b0f200a0e20080e1f070f1f080e1d09101d0d0f1d0b0d1b0c0e1c0b0d1d0b0d1b191520362d33473d403a313440383b4d484b322e3527242d201e2d1a18271614231c1a292a28371614230f0d1c100e1c1614221e1c2a2d2c37373a3d64717396aeb3adcaceb1d0d5b9dbdfbee0e4c5e5eac8e6ecc8e3eac7e2e9c3dee5c7e3e9c7e2e9c2e0e6b7d8dcb1d4d8b0d5d8"],
  ["+++++++====+++**=:.\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0..::---::....\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0.:-=+##***#########", "6ba2a874a7af80b2bd83b4be85b6bf81b4bd73aab1639ea45994995995995e9c9f71adb07fb8bb82b9bb95c3c5a3c4c973838b3f46522c2d3c1518280e12210e0f200e0e210a10210b10200d0f1e0e0d1d12101f1715241413220f102010101e13101c291d23413032573f3c5b403b7056507d6460725b5a564448493c41352b31271f292b243126202f1c182418152117152113121f0e0e1a0f0f1b14131f27242c4a4b515b6065788d8d92afb0bbdce0afd2d794b8bc99bdc1a4c7cbb3d3d8b4d4d9bbdbe0c1e4e8c3e4e8c6e1e8c8e3eac6e7ebc6e8eb"],
  ["+********+**+++=:..\u00a0\u00a0\u00a0\u00a0.......:::-----------::::....::--=+********###***", "85b6be93c2cb94c1cc90bdcb94c3d0a0d0dd9fd3de92ccd388c3c97bb6bb82bbbe83bbbe7ab3b670acad80b5b4688f933e525b272d3c1d1d300a0d1f0e0e1f10101e181724231e282721292e242b35282d392c2f3c2f324134364a3738543c3b694947764f4a7b534b855a4f885d5190665b855e55714c467b5a578164616f57556b56525f4a485a45465a464849373a4130333d2f333f33393b303643383d4f474a5755565c5c5d6e7a7c8da3a69cbbc09dc1c6a4c8cca3c7cba5c9cda8c8cdabcbd0accdd2b3d4d9badadfb1d3d8a0c2c69fc2c5a0c2c5"],
  ["****+=++========..\u00a0\u00a0\u00a0..:::::::---------==--=+==----------+*#************", "8dbdc79acbd39ecfd698cbd179b0b45e9b9d6aabac68adab529a974e9a974c9b974e9c98539d9a509c965a9e995c83872c3b471d223416172a0e0d2213121e28212d40313b46353c4b373a513c3c553e3c58403d5b423e614440724d4581594e885c4d9063528b5d4d8657498d60538b5e548d5f57926660996f6c8f65618e6561a57f7aae8780a37c74926c648d675d8d665d79534d74504d6c504e6a5457625457675b5e756b6d6d6a6c889094b1cdd0b7dbdfaccfd397babe94b6bb99c1c496bdc093babd91bcbe98c1c49ec4c8a3c7cca3c6cca0c7c9"],
  ["+++++++++++++++=.....:::::::::--=-------====+++=====---=-=+**+++++++++++", "7caeaf7aafb077b1b272afaf6ba9a667a6a36caba86faeab6fb0ab6cafab6aa8a767a3a373aeae6fafac70adaa63868a2e3a45262b391e202c2726313a31394b3c425944495940435e42445f41405d3f3b5d3e3862403a6b423d7b4d438a5a4b986453915e4f88554687544788574a905f5591615994635d976761a3726da87872a97a70b48479b68678b88576ae7b6da36f629e6c5ca06f62946c6289675f79605f7f6b6b807072756a6d70747685a4a28cb7b78db7ba87b1b484aeb181acae7ca9ab71a1a26d9fa073a4a572a2a471a0a274a1a47ea9ac"],
  ["******######***=..:-:::::::::::--------====+++++=+++======*##########**#", "a0cacf9ac3c899c3c89fc9cea9d0d5aad0d5add2d7b0d8dbadd4d8acd4d8aed9dbb3dee0a5d0d297c3c799c4c67b939934384135363d403d435953575d4e535d4a4d5e484a5a41425a403e5b3e3a5a3d385d3b365f3e36673f3774473c8353478856488552458451448754478857498b5a4d9662589f6a609b665c9a665aa97568bc8677c48a79c48773c0826cbc7e68ba7c66c98a75c68977b68270ac7f6ea27c71947670897371827577808285b1c7c8b2d4d6b8d8dcbddce0c0dfe4c5e1e7c6e2e8c7e1e8c3dee5c5e0e7bfdde2aeced3add0d4b4d7da"],
  ["**#*###########+::----::::::::-------====++++++++*+++++==+##############", "a5d0d4aad0d5b2d3d8accad0b9d7ddc4e2e8c6e5eac0e0e5c2e1e6cbebf0c8eaeec0e4e8b8dde1b8dbdfb9d9e095aab03e4147524f555954577166677261626a51526348465e44415c413c5c403b5a3e385a3b365d39356b423c7b504588594d8d5b4f8a594f8b5a4e8c5a4d936053a06c60a470629e695aab7665bd8675c88f7fbf8774c38772c4836cc7846acd896ddb9778e29d7fda977fc88d74c7937db98c7da9867ba186818f7e7d8d9597bfdadfbfdbdfc1dee4c2e0e6c6e4eac9e8eccae9edc9e8ecc7e6eac6e2e7c3dee3c1dde2bedde2bedbdf"],
  ["*##############+:--=--:::::::--=-=====++***#*******+*++++****###########", "aacfd5b2d6dcbadce0bfdfe4c4e2e8c7e5ebc7e5ebcae6edcde8efc5e1e8c4e3e8c2e3e7bddfe3bbdbe0bfdce29cafb35253585a575b615c5c7b706f7966656d52516548455d423f5a403b5e413c5d423a5f433b69483f7850488f6153976657945f519d685b9f695baa7364a96f61b87c6ec78c7dd29787da9e8eeab1a0eeb8a7eeb9a6f0b6a0eeaf97eda992efa88fefa78ceba286e29b82d4947cdaa18acb9b86b78f7fb89a909e908eaab8b9abcccfa6c5cab0ced4bbd9dfbad8deb1d0d4b4d3d7b8d7dbbddadfbcd7dcbbd2d9bdd4dbbdd6ddbbd6da"],
  ["******#####****+---==--:::::::----=====+++***********++++*****##***#####", "94c1c590bdc193c0c494bfc38fb7bc99c0c5add2d8b3d7ddaed2d9b5dae0afd5dba4c9cf9abfc59bc0c595bbbd8ca2a55c63666161616d6767877b7b816b6e70585b6c515365494b644849644849654b4b5f4644563d3b5c413e76524d815852875a51906056996458a26759ab6e60b37668bb7b6dc88879d1917fd79885db9e8ae9ae9aedb29ee1a491e9ad99f2b59eefb098eaa78ae4a084dc9a81dd9f88c18f77b48d7ab7998ca29893b3c6c8a9c8d0aacacfa7c6ccaeccd2bbd7ddb5d3d9a6c4ca9dbbc1a9c7cdb7d5dbc1dfe5bedce2bbd9debdd9de"],
  ["+++**+++++**###*+++=---..\u00a0\u00a0\u00a0.....::------::-++++++****+++*#######*******", "7fb4b67eb2b481b5b788b8bc8bbbbf86b4b983b2b681b1b483b1b589b6ba93c0c4a3cbd0afd4d9b6dae0bde2e7a7c8cd98aeb49eadad9fa29d8c857c7a6c69736a6d59545e32303c201e2a14142014121f1917231f1e2a2728312f2c32332b314133395e404071453f824d418851438a52448b50438f594c774a43603833613b35886058b08980ba968bba958bb68d84b6877dc39084daa08fe7aa94e7a98fdca58ebe9383ae9186a09995b8cbceb8d5ddb4d3d9b9d6dcb6d6dbb6d6dbb3d2d8b0cfd5a7c6cc9fbec39ebcc29fbec3a2c1c7a2c3c8a6c6ca"],
  ["+++++++******=-+-====:.\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0.:-----.\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0...-+********************", "77adaf81b5b77dafb286b4b986b3b983b0b688b5bc94c0c79dc7ce9fc8d0a6d1daaacfd6a4b7bb7c747771656aa2a2a767666b8077788877758b756e8475725951561c1b281918271211200c0e1c090c1a070c19060b18050a17070a170809160a0a153320266b464581534a80564b835d53895e5378504a432f3218101e0d0c1f0e0c1b0e0d1a0f0e1a12111c1d1a2729243039303b665659b69c94d1a496dda792d1a999bfaea3bdbfbcb4cdd0acced4a8ccd0a7cacea9cdd1a6c9cda1c1c6a0c0c5a3c3c8a4c4c9a4c4c9a9c9ceabcbd0a8c7cca6c4c8"],
  ["*###########*==--===-:\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0-:::-:\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0..:+***###***##########", "a5d0d5a8d4d8add9dfaedce1b0dae1acd6dfa9d5deafd7e0badfe7bfe0e6bfe1e8bedfe4bebcbda36459a961567a4a44715a578474718a746f91766f76615e534e511917250e0b1c0b0a1b0a091a0b0d1d070c1c030917020a17010918010a16040b151f161785615873463c7040396d4038895d545d3f380e081009091a070a19080b190909180a09180c0c1b10111f18162428243040313c513c40b39388d6a892d4ac9ccfb4aae4c7bff4d4cedbc5bfa5b9ba9ababe9fc2c6add1d4b3d6ddb9dae0b7d7dcb3d3d8b6d6dbb8d6dcbad6dcbed9dfc5e0e5"],
  ["############*---===--:\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0:--=-:-\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0..::++*++=+#############", "bee2ebbce1eab4dae4b0d8e5b2d9e7b1d8e3b0dae4b4dce5b5d9e1b9d9dfbfdee4c6e0e5b9acae9a4b45a8514791574d8e6e658e776f8970697f645e715d58585255181524141223131222111021131224100f22090b1b070a1a060919060816060611564447734f467f4a43ab7f778d625a6c40367a635b110c14080819090b1b0c111e0a0e1b0a0b19100e1e1b1626241e2c2f263443353f533e42b29287c19485d3a594c28c7acf7662d25642d07567cfd2d6add0daaed3dcb2d6e0b3d8e0b7dbe2b8dbe2bedee4c2e2e7c3e1e7c2dfe5c2dde3c4dfe4"],
  ["############*==--==---:.....\u00a0\u00a0\u00a0\u00a0.::=##-:.\u00a0\u00a0\u00a0\u00a0\u00a0.:---=++*++-+#############", "a9d4dbadd7deb2dce3b0dae2b0d9e2b9dfe6c1e5ecc4e6ecc3e3e8c3e2e7c1e0e4bfdde2babebf9b6960a76053955c50896860917a738b70697f615b7558536e5e5c413b3f29292e2b2c3026262e21202a1d1b2617162014131c11111a0e0d154030355b393764362cae7064e8bdafe5bcb18f595470474238242b140d1f120c20151123140f1e180f1d24192349394171595f7c60647e605f8e7069c29b8cc39381d7a591d59784dd8c72c24f3acb877bbfd5d7b1d6ddb4dbe1b7dee5b3d7ddb1d6dcb5dae0b8dde4b9dde3b5dae0b2d8deb1d8deafd8dd"],
  ["#############=::-==-----:::....::-++*##=-:::-======+***++=*******+++++++", "bee1e6bbdee3c1e3e9c1e1e6c2e0e5c5e5e9c1e1e5bedfe3bddfe2bddfe3bddfe1bee1e1cde1e294817c72352d7238388465609379728f736a8869607e5d57785a5478615965534a5947404c3c354335313e31313d31333d2f334031324c3b395a3d388f5d54c17d73d38a7de4b5a6f7d9caf7b4aaae72677c5551594042523f43604c517c65688c7476957c7e987d7e9175728a6c68906d66bb9384d1a189e9b59ae5aa92cc8370d57c67ce755fc9b9b0a9cccda5cccda5ced09cc6c893bec08ebabb8bb7b88ab6b785b3b482b1b27daeae7aaaab75a5a4"],
  ["#######*#*###+-:-===----::::::::----=+***++**+++*******=+*****+++++++++*", "c1e1e5c1e1e5c4e5e7caebedc1e2e3b7d9dab0d3d3add1d0b0d3d3a7cacab4d3d5b6d9d9bfd9d99d9192935e5c6f3d3f795a588f736d93776b9071648f665b89594c854e4081483b7d46377d4638784333734131714134683a3163322f77453c884e428b50408b4a379d5740b8705cce8676eb9683f7ac99e4aa96c78c7cc69284d9a89bd4a89fc79a90c0948ac2968ccca296d1a193d49c88e8af94f2b998e8b093dba489c17562d7816dddab9bb2c0c09fc5c69bc4c28db9b980afaf79a8a873a2a277a6a680acad84b3b384b4b47eafaf88b6b790bfbf"],
  ["#############+=-:====------:::....:---:-===--=+==+****+**#***********+**", "b7d9dab6d8d9b6d8d9bcdeddc0e2e0c4e5e3bfe0dec2e2e0cbeae9cbe8e7cce7e7c4dfdfc7e2e2a3a2a392676a7d5858644a4b896b64957a6a9d776a996f5d91624f8a5440884f3b874e3a844c387d473570403361393156322c4c2522572b2a542324512022733b339c5a47a15f478e55457139328a413ab2655aa96b5e9e665a965d50985b4dac695ac78171b6725fb8745ec9896fe6a889edb191ecb291e5ac8ed09680d7a38fedb4a0d8c2baa1bfbe99c3c197c3c195c2c297c3c498c1c295bdbf97bdc09dc1c399c0bf8eb8b688b3b195bdbca2c4c6"],
  ["#############*--:-====----:::...\u00a0\u00a0\u00a0...:=*+===--==+****+*##**############", "c3e4e5c8eaebc1e3e4badad9c6e5e4bedddcbedddcc9e6e5cae5e5c4dfdfcce7e7c6e1e1cbe6e6b2b3b0895f5e77534f5e45437059508f71629877669b725c996951955f458f59398a53387f473568372c59312a50302f462d2d392527271a1d160f130e0b1312080e2d181c351a1f43293263494ca0827cd5aca8cb9c96af8077a476669a6756955c4b9e5e48a8664cbc795ccf9070db9d7de1a584e6ac8bdea688c38d75ddaa96f8d6c7d5d2cfaecdceaacacab0d1d2b5d5d9b8d8dcb8d8dcbad9ddbbd9ddb9dbdcb9d9dbbbdadcc0dddfc4dfe1c0dadd"],
  ["###%#########%#+-:--==---:...::::::---:==+==---==++++++*#########*****##", "c5e6e7c5e5e6c9e7e9d0ebeccee9e9c0dbdbc6e1e1c2ddddbed9d9c6e1e1cee9e9cee9e9cbe6e6d6e9e6cdd3cf9d9b95685a5661474474564b89655590685196684d976245905a378451346f402d44231f3418193d211c5030295a332c6338326838346c3735723d3a7c46427f46447e4441773e37a97069a97769b88879ab7c6e91665b81554c8c5a4c9a6046aa6a4dbc7c5fc38769d09574d49a7bd59a7dcf937bb7826fe3b4a8e3cec6c6d3d8b9d3dbbad5dbbbd6dcbdd7debdd8debcdbddb8d7d9aecdcfa7c8c9a2c4c59ebdbfa6c5c7b2d2d3bad7da"],
  ["%###############=::::----:.......:::::::::::::-==++++=+#################", "d0ededcce8e9cde8e9cfeaebcfeaeacee9e9cde8e8cbe6e6c9e4e4c8e3e3c8e4e2c6e4e2c2e1dfbfdddbc5e3e0c1dbd77d828151403f5a3d3c6549406948377d53408e5c43905a3b865439693c2d4a252045221f48231f4b201f4e1e21561f255e212b6627306b2c3470323974343b78383f7e3f43793b3d793c3f7942437241406037345a2d2d76433b9c634aab6c50b67a5dc08367c2886dc0896ec18d72a87a6a9d8d84c8d0ccc9deddc5e2e1c4e0dfc4e0e1c2dfe2c0dde0bedbdebfdee0c1e1e2c1e2e3bfe1e2bbdddebad9dbbbdbdcbedddec4e1e3"],
  ["##############%#+-::.:::-::::-----------==----======-=+################*", "c3dedebcd7d7b9d4d4bad5d5c5e0e0cde8e8cee9e9cce7e7c4dfdfc3dedeccece8ceece8cde9e6cdeae7d1eceacae2e09da5a75e54564e36384b323548302b53332c6a41327a48318252386e432e5a312460372d6e43327a4c3b81523c85513f864d40864a4086483f87483f8d4f4591554a94594c9a60519f66579a66558c5d4b7a5241764a3c8656459d6951af775fad7a60a46f58a16d5b9d6b59916250907369a0aaa9b7daddb1d4d7b3d4d9bbdbe0bddce1c2e0e5c3e2e6c4e3e7bedde1bedde1bedee2badcddb9dbdcbad9dbb5d5d6b2d2d2b1ced0"],
  ["%%%%%%%##%#####=::....::::.:::-::...:------==--------=##################", "ceeeead4f0edd4ecebd3ebead2ebead3eeecceeceac8e8e7c8e8e9cdeceecceaeac8e8e7c7e9e7cce8e9c6dcdd6f7d7e404648453e43402f35402a2e41272b48292956322d6b3e3272463b55322a4e2b2659332c693f317547347b4b3977493664382c532b2538171c431f216439327e4c408c56438f5c44935f4994604994604a9a6855986654915d4c915f4c92614e9263538c5e50875a4e885c518763588f8883bcd3cdbcdddcbfe1e0c0e1e1bfdfe1c0e0e2c1e1e3bddddfbcdcdec3e1e3c1e1e2bcdedfbfe2dec2e3dfc5e2dfcbe6e5cde7e7c6e0df"],
  ["#############*=.\u00a0:....:::....::.....:------===---::--##########*########", "c9eae8c2e6e4c0e5e2c3e5e5c2e4e4c3e6e6c2e6e7c1e5e6c1e4e6bee2e5bce0e4b9dce1bddde29cb1b8808d962f343d0f0f164840463e2d333621263d23264b2c2c5b3834603b335734304229273923263923244228225032284f32274c2e244c2c29371f1f2b18213521265d413d78524a7e4f438b5c4b8e604f8a5d4b9063509c6d59a0705d9a6a588c5c4b88594c7d4f467347416b464271504d6b5753cdd9d7c4e3dcc6e2dcc6e1dbc4dfdac6e1dec3dedbbfdad7bcd7d4b4cfccacccc7b2d1cbbad5d1c1dbd8c5dedbc5dfdcc3dddbc4dedcc7e1df"],
  ["############+-.\u00a0.--....:...........::--===-==---::::+####**#############", "bde1e2bce0e1bbdfe0bce0e1c0e4e5bee2e3bfe3e4c0e4e5c6e9eac8ebecc9e8ebb6d3d88ca1a9636e7a2b2f3c07081126222775635f6550492d1a1e2d1b1e2f1b1b432c2b543a373f2929291b1f2a2024271c1e241a1c291d2031202339272a3b272b3623263a282e4735385c4845745a558a6860946d63946b6190685d8b6358906a5e8f675c855b51855b507e564e6c4745553435533839553f408f8f89c7dcd5b9d2cfb7d3cfb8d3cfb2ccc9b5cecbbed6d3c7e0ddcae4e1cce6e3cae5e2cbe5e2cbe5e2cae4e1cbe4e1c9e2dfc7e1dec6e2dec6e1de"],
  ["##########+=-=..:---.\u00a0\u00a0\u00a0.\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0......::::::::-:.::--=*##########**######", "c1e4e1c6e5e2c3e3e1c2e4e3c3e5e4c4e5e4c4e5e3c2e3e3c7e6e8cce8eb96aeb86e808e617080777f8f2829351f1c23544545826258865f527c5a4c482e2c2817191d131720171c201d1f1919191a1a1b19191b1a181b1917191c191b2420232a2528292326312b2e322d2f382e304a3a3c5b44445e4342624444644646563939523c395b3f3e6a4f4c6044444c2f305134335131307c5a586852498e8e7ba4b6aacee5e2c4e1dfc3dddcc4dcdac9e2e0cae4e1c5e0ddbedbd7b6d5d1b2d0cdb1cfccb1d0ccb3d0ccb6d2cfbcd8d6bfdbdac0ddddc5e1e1"],
  ["######*++-:+=-..:-----:.\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0.\u00a0\u00a0......:=+=-+*####%%############", "c8e0dac1dfd7bcddd6bbdad4bcdad5bcd9d7b0ccce96afb481969e61737c425762869aa87b8c9d5f677633313d231c234c38367b57468658468d544485563f79524452383227181a1511131211181212191113181010160e0e140f0f161010171112190e0e160c0b130e0d1511101917171f1f1d231c191e160f15221c21231d222d2426392f313226273a24205e3e37a07a6fba918799716e866a5fa2a18bb2bdb1d6e8e7c4deddc6e1e0cce7e7d3edecd3ecebcfe7e8c7e0e1c2dedebad9d8bddcdbbcdbdabedbdac3dedebed9dbb8d6d8b8d8d8bbd9db"],
  ["**#*=:..==-++-.\u00a0.:------:.\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0....:-=+++:-++#%################", "a3bbb7aac3c2bed7d8aec6ca6d858a344c521d323a2435436577886577815a6a748a99a486939e656e7626262f0d0c152a1c2165423683503b86523886533986533d84513e7e503e623f333b24221d1115120e140d10180d0f1a0e0f180e0e170e0e170d0d160c0c150b0b140d0c16100f180e0d1617151e1d1b22211f272a27303b3235573e3b7a564ca47461bc8167d39274c7907d5736326a5d579fa2929ea295c6ccc6dbebe9c5dfe1c6e1e2c4dfdfc2ddddc4dfdfc5e0e0c5e0e0c5e0e0c3dedebedadab9d8d9bad7d6b6d5d3b6d7d4b8d8d5b8d6d4"],
  [":==..-:-=....=:\u00a0\u00a0.:--------:\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0...:-===+++=#%%#+*###############", "3b536473899c6f83992b3b4e1522334e5e6e39485a5c6b807c8d9d192e2f202e2f212f31293638747c8253535c090811150d153f27236d41347a4a387f4b33874f348b51328a4f2d88533685563c764f3e4c342c1f15140e0d140f0f1710101911111b0d0d160c0c150b0c151010191b1b221a19201d1c22201c1f2a1a1a5b413d8a6158966554a87158b57b5cc48466da9777d7987f8b6866cfc6c8fafbfaf2f6f2c5c8c4a1aba5b8cdc8c1dcd9bfdcddbfdedfc1dcdcbfdadac4dfdfc8e4e4c7e2e2c4dfdfc0dfe0b8dddac3e1e0cbe2e1cae2e1cbe5e4"],
  [".---==---\u00a0\u00a0.-==:\u00a0\u00a0.::----------::....:--=-=====+++*%%%%##+*#############", "1d324646596d56647a646f866d778f6e7890545e74606a7a5c686f111f1f0f211c152220575e607c7e83828388494a4f0b091022141846272362382c71432f7c492f854d328b50328e54358f55369056359058388a583b875a4179503c6a46335c3d2c4930273b282238251f41291f593b2d7c54438e624e95675097654c9a65489c6748a56e4fa97052b3795ac18366d39175c18979bba5a3f1f1f0e1e5e5e7ebece9eeeddae0ded1d8d69eaca7b8ccc6c0d7d3c6dddcc5dedec3dedec7e2e1c7e1dfc8e0e0c7e1dfc8e2dfcce5e2cde6e3cde6e3cde7e4"],
  [":-:::.\u00a0..\u00a0\u00a0.-+=\u00a0.\u00a0..:::--------=======-=========+-+*%#*+#+=#%%#++#######", "323b51586075444c5e4047593a4153282f40141c2a2d363d2832330e1a1813201c262f2e6b71739092977172771b1c21242329140d13281b1a432722593426693d2978442c834c318a5236905535935934955b349a5e369d5f369e6039a2643ba6673ca76a41a56840a46742a56945a267449c64409d66439f65459e66469d67469c6642a16947a96f4fae7054b3775ac185737b574c948e82abada3e5e9e3d9dcd0a9ae9d9ca18cdcdfd0999c96868a8ac8cdcbe0e6e5e0e8e7c5cfcf8796969faeaecbd9d9d1e3dfcbe1dbc5ded7c8e1dbcce3dfcce5e1"],
  [".-=---:.-:\u00a0.=-.\u00a0\u00a0\u00a0\u00a0..:::-------=========-----===:=*%#*++++*#+=*##=--*###", "1b2036656b7f6b7282626b7958626f4d57644c5661222b325a64664b5553101b183139397c82845d6467171e220d14170a0f130e0d12130f1129181a3f241f533025643a2874432e7d4a318852358f5734955b369a5e379e613a9f633ba4653ba7663ba8683ba8683da96841a66742a365429f64419d65449b63449662419462419662439862449c64489d674c9a6c555e3e2f7c7764bebfb3f0f2ebe1e3e1b1b5aa959c7f909a749ca38c90938ebebfc2dde1df979d98838985a7adaad5dadccbd0d2797e805c6065636c6fa8b5b7ccdeddc8dcd8bed3d0"],
  ["..\u00a0\u00a0\u00a0:-.:=-::..\u00a0\u00a0..\u00a0\u00a0.:::------======----------:**++*%#+*#%==*%*%*+--=+#", "252f3c212b3810192606101c040d19474e5a565e682834383e484a6c74746b70713e4644333f3b1f2d2a1724240912150b0f132f30321e1e200d0b0d2516153e2321543026653b2a71442d7c4a2f8752338e5835965b369c5d36a06239a3653aa5683ba86a41a96b43a76942a165419f62409a603f94603d945f3e915f40905f42925f4593614c91614d7a574a5c4741b6b2adb9bfb98f938b9fa19cc3c4c3eff1efd6d9d2959b89bbc1b5d9dedee2e7e9898e88767972adb0aaebececc4c5c8e6e7e8bec0be9b9c9d5e616460656b6b737a99a4a5cad6d5"],
  ["..\u00a0\u00a0\u00a0---.\u00a0\u00a0.::..---:\u00a0\u00a0.:::------===-----------*+=#%%%%%*%%+-=#====#%---+", "2f3641222a350f1722070e160c12196872785c676d4e5b5e242e300c14150f1515212a29414d4a3b4a451a27251b23245c5f626c6b6e5b5c5d464a4b100b0c2515153f241f58342968412674482a805034895635925a36995c379e6039a0623aa4663da56941a36841a0633e9d603f976041926041925d408c5a408958408758428b5a4980584a7f6663c3bcbd9da09981867ec8cfcbf3f8f9f0f4f8f1f5fbfbfbfdeef0efbfc0c2e1e5e6f2f6f99297955c6257858b80ced3d0787e797d8270818677767b71d4d4d3fbfbfd64676e62676f545a5e949a9b"],
  ["::---:----.=-:..---.:\u00a0\u00a0.::----------------::-===***%%%##%%=-=+==+###+:-:", "363a454b5059676c736b717560666a50565a666c7162687062696b5e66651e23267d8282696b693a3b392728263637356666635d5c585d5d5930302c3c3b39110c0b1d111339231e5832246d412e7c4b33885538915936965a35995d389c5f3aa0623c9f623c9c603b995e3b965e3b925d3e8d5d3e875a41805543734c3d6a473b5d3c34675a528584807a7a73888a7eadafa3adafa5babcbae2e5e6eef3f6e4e7e6c4c8c4c8cccaf2f7f7e3e8ea797f7c676e637f887d9aa2996f7a6678846c8e9889d7ddd9dadcdbc6c7c89ca1a3484d535d616d43484f"],
  [".\u00a0\u00a0:=.:--=-:::-:\u00a0:::..\u00a0\u00a0.::--------------::--=-:.-+*++++*****#==**+*=:::", "32363c10131a0d11164045496e74771d21243f4347686d726d7175777b7e646a694f504f464643504d4966635e4c48431b18154a49464a49463b3a372e2e2c3434321414121d120d3e211d59362b6f4431824f378b5638915737925836945b38965c38945d38935d38945e39925d3a8d5d3f8a5c3f835c457353425c4238483530635f586b6c647d7f7861635d40413a21221c64665f9fa19cb5b7b3a9aba7a3a59ea3a79e9aa198acb1afabb0b1b8bdbfa9afafc0c7c5d2dad36d7769787f75b0b6b2a9aeaea2a4a3b9bbba878a8743474b474b57424752"],
  ["==:\u00a0:=-.:::-:----.\u00a0-::....::-------------+===.\u00a0\u00a0::..=#%%%+-*%+%#+#+%+:.-", "767b7d7176773f434516171b4040457b7b806d6d6f3233314d4e4c4647443c3c3966645f58524b5e574e686159746e656e6a642f2e2c1514126463624c4c4a4444422c2c2a2b272833262844302a603c2e754734804f3888523886543987553a88573b8a593b8b5a3c8c5b3d8e5c418c5f498b614c8360507d665a988d878988868788888b8c8d292a2d09080d16161a4443484443482e2f3433343974757ad8dadbf5f8f8f6fbfbe1e6e6969b9a636867adb2b1e1e6e68d9194e8edf0c3c8c9999ea0d5dadf909292eaeceb9d9f9c44474b202330575c67"],
];

function initAsciiPortrait() {
  const host = document.getElementById("asciiPortrait");
  if (!host || host.dataset.ready) return;
  host.dataset.ready = "1";
  const esc = { "&": "&amp;", "<": "&lt;", ">": "&gt;" };
  const html = ASCII_PORTRAIT_ROWS.map(([glyphs, colors]) => {
    let out = "";
    let run = "";
    let runColor = null;
    let ci = 0;
    const flush = () => {
      if (!run) return;
      out += runColor ? `<span style="color:#${runColor}">${run}</span>` : run;
      run = "";
    };
    for (const ch of glyphs) {
      const color = ch === " " ? runColor : colors.slice(ci, (ci += 6));
      if (color !== runColor) {
        flush();
        runColor = color;
      }
      run += esc[ch] || ch;
    }
    flush();
    return out;
  }).join("\n");
  host.innerHTML = html;
  renderBioReadout();
  armPortraitReveal();
}

// Palette swatches sampled from the portrait's own dominant colors.
const BIO_PALETTE = [
  ["090d1f", "0c0d20", "3d2f33", "414047", "5a3d38", "644849", "61656e", "865439"],
  ["875447", "90665b", "7eb2b4", "8fb7be", "9bc6c8", "aad0d5", "b0d7e1", "cee9e9"],
];

function bioUptime() {
  // Production start: bKash, June 2022.
  const start = new Date(2022, 5, 1);
  const now = new Date();
  let months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  if (months < 0) months = 0;
  const y = Math.floor(months / 12);
  const m = months % 12;
  const plural = (n, unit) => `${n} ${unit}${n === 1 ? "" : "s"}`;
  const parts = [];
  if (y) parts.push(plural(y, "year"));
  if (m || !y) parts.push(plural(m, "month"));
  return `${parts.join(", ")} in production`;
}

function bioReadoutLines() {
  return [
    ["OS", "Human · Dhaka Edition 🇧🇩"],
    ["Host", "bKash Limited · Advanced Research"],
    ["Kernel", "B.Sc. CSE — BRAC University"],
    ["Uptime", bioUptime()],
    ["Shell", "Python · Java · C++"],
    ["Packages", "PyTorch, Transformers, LangChain (+16)"],
    ["Resolution", "Research → Production-grade systems"],
    ["DE", "FastAPI · Spring WebFlux · Django"],
    ["WM", "Kubernetes · Docker"],
    ["Terminal", "ICPC Regional '18, '21 · Codeforces · LeetCode"],
    ["CPU", "Problem Solving (competitive clock speed)"],
    ["GPU", "Deep Learning · NLP · LLMs"],
    ["Memory", "Research ideas at 87% and climbing"],
    ["Disk", "CogniJot · Bangla News MCP (mounted)"],
    ["Locale", "bn_BD · en_US"],
  ];
}

function renderBioReadout() {
  const host = document.getElementById("bioReadout");
  if (!host || host.dataset.ready) return;
  host.dataset.ready = "1";
  const escapeText = (s) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const handle = "hurutta@dhaka";
  const rows = [];
  rows.push(
    `<div class="readout-header"><p class="readout-line readout-handle"><span class="readout-user">${handle}</span></p><p class="readout-line readout-rule" aria-hidden="true">${"─".repeat(handle.length)}</p></div>`
  );
  bioReadoutLines().forEach(([key, value]) => {
    rows.push(
      `<p class="readout-line"><span class="readout-key">${escapeText(key)}</span><span class="readout-punct">:</span> ${escapeText(value)}</p>`
    );
  });
  const swatchRows = BIO_PALETTE.map(
    (row) =>
      `<span class="readout-swatch-row">${row
        .map((c) => `<i style="background:#${c}"></i>`)
        .join("")}</span>`
  ).join("");
  rows.push(`<p class="readout-line readout-swatches" aria-hidden="true">${swatchRows}</p>`);
  host.innerHTML = rows.join("");
  host.querySelectorAll(".readout-line").forEach((line, i) => {
    line.style.setProperty("--line-index", i);
  });
}

function armPortraitReveal() {
  const windowEl = document.querySelector(".term-window");
  if (!windowEl || windowEl.dataset.armed) return;
  windowEl.dataset.armed = "1";
  if (!("IntersectionObserver" in window)) {
    windowEl.classList.add("is-live");
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        entry.target.classList.add("is-live");
      });
    },
    { threshold: 0.25 }
  );
  observer.observe(windowEl);
}

function hydrateShellContent() {
  initBlogBrowser();
  initChatSection();
  initAsciiPortrait();
  initTinyChat();
  hydratePostPage();
  renderRightPanels(document.body.dataset.page || "home");
}

// --- TinyJawad on-device chat ------------------------------------------------
// Minimal, safe markdown for finished answers: HTML is escaped first, then
// fenced code, inline code, bold, italics, bullet and numbered lists and
// paragraphs are rebuilt. Streaming text stays plain until the answer is
// complete, so half-open fences never render as garbage.
function renderChatMarkdown(text) {
  const esc = (t) => t.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const blocks = [];
  let src = text.replace(/```(\w+)?\n?([\s\S]*?)(?:```|$)/g, (_, lang, code) => {
    blocks.push(`<pre><code${lang ? ` data-lang="${esc(lang)}"` : ""}>${esc(code.replace(/\n$/, ""))}</code></pre>`);
    return `\u0000${blocks.length - 1}\u0000`;
  });
  const inline = (t) =>
    esc(t)
      .replace(/`([^`\n]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[\s(])\*(\S(?:[^*\n]*?\S)?)\*(?=[\s).,;:!?]|$)/g, "$1<em>$2</em>");
  const lines = src.split("\n");
  const out = [];
  let list = null; // { tag, items }
  let para = [];
  const flushPara = () => { if (para.length) { out.push(`<p>${inline(para.join(" "))}</p>`); para = []; } };
  const flushList = () => { if (list) { out.push(`<${list.tag}>${list.items.map((i) => `<li>${inline(i)}</li>`).join("")}</${list.tag}>`); list = null; } };
  for (const raw of lines) {
    const line = raw.trim();
    const block = line.match(/^\u0000(\d+)\u0000$/);
    if (block) { flushPara(); flushList(); out.push(blocks[Number(block[1])]); continue; }
    const ol = line.match(/^(\d+)[.)]\s+(.*)$/);
    const ul = line.match(/^[-*•]\s+(.*)$/);
    if (ol || ul) {
      flushPara();
      const tag = ol ? "ol" : "ul";
      if (!list || list.tag !== tag) { flushList(); list = { tag, items: [] }; }
      list.items.push(ol ? ol[2] : ul[1]);
      continue;
    }
    if (!line) { flushPara(); flushList(); continue; }
    flushList();
    para.push(line);
  }
  flushPara(); flushList();
  // inline numbered steps the model writes on one line: "1. Foo 2. Bar 3. Baz"
  const html = out.join("");
  return html.replace(/\u0000(\d+)\u0000/g, (_, i) => blocks[Number(i)]);
}
const chatMarkdownIsRich = (html) => /<(pre|ol|ul|strong|em|code)\b/.test(html) || (html.match(/<p>/g) || []).length > 1;

let tinyChatWorker = null;

function initTinyChat() {
  const windowEl = document.getElementById("tinyChatWindow");
  if (!windowEl || windowEl.dataset.ready) return;
  windowEl.dataset.ready = "1";

  const statusText = document.getElementById("tinyStatusText");
  const deviceBadge = document.getElementById("tinyDeviceBadge");
  const progress = document.getElementById("tinyProgress");
  const progressFill = document.getElementById("tinyProgressFill");
  const form = document.getElementById("tinyChatForm");
  const input = document.getElementById("tinyChatInput");
  const send = document.getElementById("tinyChatSend");

  const history = [];
  let streamBubble = null;
  let streamTarget = null; // inner span once a retry has split the bubble

  // Stick to the bottom while content grows — tokens, the final markdown
  // render, the fade-in transform — unless the visitor has scrolled up to
  // read something earlier. A MutationObserver catches every change, and
  // the scroll runs after layout so the measurement is never stale.
  let stickToBottom = true;
  const nearBottom = () => windowEl.scrollHeight - windowEl.scrollTop - windowEl.clientHeight < 48;
  windowEl.addEventListener("scroll", () => { stickToBottom = nearBottom(); }, { passive: true });
  const pinToBottom = (force = false) => {
    if (force) stickToBottom = true;
    if (!stickToBottom) return;
    requestAnimationFrame(() => { windowEl.scrollTop = windowEl.scrollHeight; });
  };
  new MutationObserver(() => pinToBottom()).observe(windowEl, { childList: true, subtree: true, characterData: true });
  // the fade-in animation shifts the last bubble by a few pixels as it ends
  windowEl.addEventListener("animationend", () => pinToBottom(), true);

  const addBubble = (type, text) => {
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${type}`;
    bubble.textContent = text;
    windowEl.appendChild(bubble);
    pinToBottom(true); // a new message always brings the view back down
    return bubble;
  };

  let generating = false;
  const setBusy = (on) => {
    generating = on;
    input.disabled = on;
    // While generating, the button stays live and becomes Stop.
    send.disabled = false;
    send.textContent = on ? "Stop" : "Send";
    send.classList.toggle("is-stop", on);
    if (!on) input.focus();
  };

  const requestStop = () => {
    if (generating) tinyChatWorker.postMessage({ type: "stop" });
  };

  if (!("Worker" in window)) {
    statusText.textContent = "This browser can't run the model (no worker support).";
    return;
  }

  // Cache-busting timestamp: browsers cache worker scripts aggressively and
  // a stale worker silently serves old behavior even through hard refreshes.
  // A unique URL per page load guarantees the current worker always runs
  // (the heavy model files inside it keep their own long-lived HTTP cache).
  tinyChatWorker = new Worker(`chat-worker.js?t=${Date.now()}`, { type: "module" });
  statusText.textContent = "Downloading model (one-time, ~96 MB)…";

  let modelReady = false;
  // Monotonic phase machine: percent only rises, and once the "preparing"
  // phase starts it never falls back to "downloading" — stray or duplicate
  // progress events can't make the status flicker.
  let maxPct = 0;
  let preparing = false;
  tinyChatWorker.onmessage = (event) => {
    const msg = event.data;
    if (msg.type === "progress" && msg.total && !modelReady && !preparing) {
      const pct = Math.min(100, Math.round((msg.loaded / msg.total) * 100));
      if (pct <= maxPct && pct < 100) return;
      maxPct = Math.max(maxPct, pct);
      progressFill.style.width = `${maxPct}%`;
      if (maxPct >= 100) {
        // Download done, but session compilation + router load still run —
        // switch to an indeterminate bar so the UI never looks frozen.
        preparing = true;
        statusText.textContent = "Preparing the model (one-time setup)…";
        progressFill.style.width = ""; // let the sweep animation's width rule
        progress.classList.add("indeterminate");
      } else {
        statusText.textContent = `Downloading model (one-time, ~96 MB)… ${maxPct}%`;
      }
    } else if (msg.type === "ready") {
      modelReady = true;
      progress.hidden = true;
      progress.classList.remove("indeterminate");
      statusText.textContent = "Running locally on";
      deviceBadge.textContent =
        (msg.device === "webgpu" ? "WebGPU" : "CPU · WASM") +
        (msg.build ? ` · ${msg.build}` : "");
      deviceBadge.hidden = false;
      setBusy(false);
      addBubble(
        "answer",
        "Hello. I'm Jawad's portfolio assistant, a small model running on your machine. Ask me about his work, education or projects."
      );
    } else if (msg.type === "token") {
      if (streamBubble) {
        streamBubble.classList.remove("pending");
        (streamTarget || streamBubble).textContent = msg.text;
        pinToBottom();
      }
    } else if (msg.type === "restart") {
      // The guard cut the first draft. Keep it visible but struck through,
      // say so, and stream the second attempt underneath — never overwrite.
      if (streamBubble) {
        streamBubble.classList.remove("pending");
        const draft = document.createElement("s");
        draft.className = "chat-draft";
        draft.textContent = (streamTarget || streamBubble).textContent || msg.draft || "";
        const note = document.createElement("span");
        note.className = "chat-restart-note";
        note.textContent = "Discarded: that draft was inaccurate. Revised answer:";
        streamTarget = document.createElement("span");
        streamTarget.className = "chat-retry";
        streamBubble.classList.add("has-retry");
        streamBubble.replaceChildren(draft, note, streamTarget);
        pinToBottom();
      }
    } else if (msg.type === "done") {
      if (streamBubble) {
        streamBubble.classList.remove("pending");
        const target = streamTarget || streamBubble;
        const html = renderChatMarkdown(msg.text);
        if (chatMarkdownIsRich(html)) {
          target.innerHTML = html;
          streamBubble.classList.add("rich");
        } else {
          target.textContent = msg.text;
        }
        streamBubble.classList.remove("streaming");
        streamBubble = null;
        streamTarget = null;
        pinToBottom();
      }
      if (history.length) history[history.length - 1].a = msg.text;
      while (history.length > 3) history.shift();
      setBusy(false);
    } else if (msg.type === "error") {
      statusText.textContent = `Model error: ${msg.message}`;
      if (streamBubble) {
        streamBubble.remove();
        streamBubble = null;
      }
      setBusy(false);
    }
  };

  tinyChatWorker.onerror = () => {
    statusText.textContent = "Couldn't start the model worker.";
  };

  tinyChatWorker.postMessage({ type: "load" });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (generating) {
      requestStop();
      return;
    }
    const q = input.value.trim();
    if (!q || input.disabled) return;
    input.value = "";
    addBubble("question", q);
    history.push({ q, a: null });
    streamBubble = addBubble("answer streaming pending", "");
    // Three pulsing dots until the first token; the token handler swaps
    // them for text so nothing is ever overwritten mid-read.
    const dots = document.createElement("span");
    dots.className = "typing-indicator";
    dots.setAttribute("aria-label", "thinking");
    dots.append(...[0, 1, 2].map(() => document.createElement("span")));
    streamBubble.replaceChildren(dots);
    setBusy(true);
    tinyChatWorker.postMessage({ type: "generate", history: [...history] });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") requestStop();
  });
}

hydrateShellContent();

// --- Shell navigation -----------------------------------------------------
const shellSupportsSPA = "pushState" in window.history && typeof window.fetch === "function";
let isShellNavigating = false;
let pendingShellNav = null;
let currentShellUrl = window.location.pathname + window.location.search;

if (shellSupportsSPA) {
  initShellNavigation();
}

function initShellNavigation() {
  document.addEventListener("click", handleShellLinkClick);
  // "On this page" + itinerary anchors: scroll explicitly — native fragment
  // navigation races the SPA router and silently fails on some browsers
  document.addEventListener("click", (event) => {
    const link = event.target.closest(".content-map a[href^='#'], .md-itinerary a[href^='#']");
    if (!link) return;
    event.preventDefault();
    const id = link.getAttribute("href").slice(1);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    window.history.replaceState(window.history.state, "", "#" + id);
  });
  window.addEventListener("popstate", () => {
    const current = window.location.pathname + window.location.search;
    // Hash-only traversal (e.g. "On this page" anchors) — the document is
    // already rendered; let the browser handle the scroll natively.
    if (current === currentShellUrl) return;
    // force: by the time popstate fires the browser has already updated the
    // location, so the same-URL guard in navigateShell would always bail.
    navigateShell(current, false, true);
  });
  window.history.replaceState({ url: window.location.pathname + window.location.search }, "", window.location.pathname + window.location.search);
}

function handleShellLinkClick(event) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return;
  }
  const link = event.target.closest("a[data-shell-link]");
  if (!link) return;
  if (link.target && link.target !== "_self") return;
  const href = link.getAttribute("href");
  if (!href) return;
  const targetUrl = new URL(href, window.location.href);
  if (targetUrl.origin !== window.location.origin) return;
  if (targetUrl.hash && targetUrl.pathname === window.location.pathname && targetUrl.search === window.location.search) {
    return;
  }
  event.preventDefault();
  navigateShell(targetUrl, true);
}

async function navigateShell(url, push = true, force = false) {
  if (isShellNavigating) {
    // e.g. two quick back presses: remember the newest target and run it
    // once the in-flight swap finishes, instead of silently dropping it
    pendingShellNav = { url, push, force };
    return;
  }
  const targetUrl = typeof url === "string" ? new URL(url, window.location.href) : url;
  if (!force && targetUrl.pathname === window.location.pathname && targetUrl.search === window.location.search) return;

  isShellNavigating = true;
  document.body.classList.add("is-shell-loading");

  try {
    const response = await fetch(targetUrl.pathname + targetUrl.search, {
      headers: { "X-Requested-With": "shell-navigation" },
    });
    if (!response.ok) throw new Error(`Failed to load ${targetUrl.pathname}`);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const nextMiddle = doc.querySelector(".middle-panel");
    if (!nextMiddle) throw new Error("No middle panel in response");

    swapMiddlePanel(nextMiddle);

    const nextPage = doc.body?.dataset.page || doc.querySelector("[data-partial='left']")?.dataset.page || "home";
    document.body.dataset.page = nextPage;
    setActiveShellNav(nextPage);
    document.title = doc.title;
    currentShellUrl = targetUrl.pathname + targetUrl.search;
    if (push) {
      const stateUrl = targetUrl.pathname + targetUrl.search;
      window.history.pushState({ url: stateUrl }, "", stateUrl);
    }
    hydrateShellContent();
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Track SPA page view in GoatCounter
    if (window.goatcounter && window.goatcounter.count) {
      const targetPath = targetUrl.pathname === '/post.html'
        ? '/post/' + (targetUrl.searchParams?.get('slug') || '')
        : targetUrl.pathname + targetUrl.search;
      window.goatcounter.count({ path: targetPath });
    }
  } catch (error) {
    console.error(error);
    window.location.href = targetUrl.href;
  } finally {
    document.body.classList.remove("is-shell-loading");
    isShellNavigating = false;
    if (pendingShellNav) {
      const next = pendingShellNav;
      pendingShellNav = null;
      navigateShell(next.url, next.push, next.force);
    }
  }
}

function swapMiddlePanel(nextPanel) {
  const current = document.querySelector(".middle-panel");
  if (!current) return;
  current.replaceWith(nextPanel);
  lgMaterialize(nextPanel);
}

// --- Liquid Glass refraction lens -------------------------------------------
// Genuine edge refraction for the floating glass elements: a per-element SVG
// displacement map (convex squircle lens profile) warps the backdrop near the
// edges, applied via backdrop-filter: url(#lg-lens-*). Only Chromium supports
// SVG filters in backdrop-filter; other engines keep the CSS frosted material.
(() => {
  const LENS_SELECTORS = [".content-map", ".theme-toggle", ".lang-toggle", ".toggle-thumb", ".lang-thumb"];
  const isChromium = typeof window.chrome !== "undefined";
  const reducedTransparency =
    window.matchMedia && window.matchMedia("(prefers-reduced-transparency: reduce)").matches;
  if (!isChromium || reducedTransparency || typeof document.createElementNS !== "function") return;

  const SVG_NS = "http://www.w3.org/2000/svg";
  let defsSvg = null;
  let lensSeq = 0;
  const lenses = []; // { el, filterEl, feImage, feMap, w, h }

  function ensureDefs() {
    if (defsSvg && defsSvg.isConnected) return defsSvg;
    defsSvg = document.createElementNS(SVG_NS, "svg");
    defsSvg.setAttribute("width", "0");
    defsSvg.setAttribute("height", "0");
    defsSvg.setAttribute("aria-hidden", "true");
    defsSvg.style.cssText = "position:fixed;left:-9999px;top:0;pointer-events:none;";
    document.body.appendChild(defsSvg);
    return defsSvg;
  }

  // Signed distance to a rounded-rect boundary; negative inside.
  function roundedRectSDF(x, y, w, h, r) {
    const qx = Math.abs(x - w / 2) - (w / 2 - r);
    const qy = Math.abs(y - h / 2) - (h / 2 - r);
    const ax = Math.max(qx, 0);
    const ay = Math.max(qy, 0);
    return Math.hypot(ax, ay) + Math.min(Math.max(qx, qy), 0) - r;
  }

  // Displacement map: R = x-offset, G = y-offset, 128 = neutral. Pixels within
  // the bezel sample the backdrop outward along the surface normal, strongest
  // at the edge — light bending through the curved rim of the glass.
  function buildDisplacementMap(w, h, radius, bezel) {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    const img = ctx.createImageData(w, h);
    const data = img.data;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const px = x + 0.5;
        const py = y + 0.5;
        const d = roundedRectSDF(px, py, w, h, radius);
        let r = 128;
        let g = 128;
        if (d < 0 && d > -bezel) {
          const t = -d / bezel; // 0 at the edge → 1 at the bezel's inner limit
          // convex squircle profile: displacement peaks at the rim, melts inward
          const m = Math.pow(1 - t, 2.2);
          const gx =
            roundedRectSDF(px + 1, py, w, h, radius) - roundedRectSDF(px - 1, py, w, h, radius);
          const gy =
            roundedRectSDF(px, py + 1, w, h, radius) - roundedRectSDF(px, py - 1, w, h, radius);
          const len = Math.hypot(gx, gy) || 1;
          r = Math.round(128 + (gx / len) * m * 127);
          g = Math.round(128 + (gy / len) * m * 127);
        }
        const i = (y * w + x) * 4;
        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = 128;
        data[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    return canvas.toDataURL();
  }

  function elementRadius(el, w, h) {
    const raw = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 20;
    return Math.min(raw, w / 2, h / 2);
  }

  function refreshLens(entry) {
    const rect = entry.el.getBoundingClientRect();
    const w = Math.round(rect.width);
    const h = Math.round(rect.height);
    if (w < 24 || h < 24) return;
    if (Math.abs(w - entry.w) < 2 && Math.abs(h - entry.h) < 2) return;
    entry.w = w;
    entry.h = h;
    const radius = elementRadius(entry.el, w, h);
    const bezel = Math.max(8, Math.min(22, Math.round(Math.min(w, h) * 0.28)));
    entry.feImage.setAttribute("href", buildDisplacementMap(w, h, radius, bezel));
    entry.feImage.setAttribute("width", w);
    entry.feImage.setAttribute("height", h);
    entry.feMap.setAttribute("scale", Math.min(30, Math.round(bezel * 1.4)));
    // Small droplets (toggle thumbs) are clear lenses: the content beneath
    // must refract through them, not frost over. Big sheets keep heavy blur.
    const isDroplet = Math.min(w, h) < 44;
    entry.el.style.backdropFilter = isDroplet
      ? `url(#${entry.filterEl.id}) blur(1.5px) saturate(1.5) brightness(1.12)`
      : `url(#${entry.filterEl.id}) blur(14px) saturate(1.75)`;
  }

  const sizeObserver = new ResizeObserver((entries) => {
    for (const resized of entries) {
      const entry = lenses.find((l) => l.el === resized.target);
      if (entry) refreshLens(entry);
    }
  });

  function attachLens(el) {
    if (lenses.some((l) => l.el === el)) return;
    const svg = ensureDefs();
    const filterEl = document.createElementNS(SVG_NS, "filter");
    filterEl.id = `lg-lens-${++lensSeq}`;
    filterEl.setAttribute("x", "0");
    filterEl.setAttribute("y", "0");
    filterEl.setAttribute("width", "100%");
    filterEl.setAttribute("height", "100%");
    filterEl.setAttribute("color-interpolation-filters", "sRGB");
    const feImage = document.createElementNS(SVG_NS, "feImage");
    feImage.setAttribute("x", "0");
    feImage.setAttribute("y", "0");
    feImage.setAttribute("preserveAspectRatio", "none");
    feImage.setAttribute("result", "lg_map");
    const feMap = document.createElementNS(SVG_NS, "feDisplacementMap");
    feMap.setAttribute("in", "SourceGraphic");
    feMap.setAttribute("in2", "lg_map");
    feMap.setAttribute("xChannelSelector", "R");
    feMap.setAttribute("yChannelSelector", "G");
    filterEl.appendChild(feImage);
    filterEl.appendChild(feMap);
    svg.appendChild(filterEl);
    const entry = { el, filterEl, feImage, feMap, w: 0, h: 0 };
    lenses.push(entry);
    sizeObserver.observe(el);
    refreshLens(entry);
  }

  function scanLenses() {
    for (let i = lenses.length - 1; i >= 0; i--) {
      if (!lenses[i].el.isConnected) {
        sizeObserver.unobserve(lenses[i].el);
        lenses[i].filterEl.remove();
        lenses.splice(i, 1);
      }
    }
    document.querySelectorAll(LENS_SELECTORS.join(",")).forEach(attachLens);
  }

  let scanTimer = null;
  const domObserver = new MutationObserver(() => {
    clearTimeout(scanTimer);
    scanTimer = setTimeout(scanLenses, 150);
  });
  domObserver.observe(document.body, { childList: true, subtree: true });
  scanLenses();
})();
