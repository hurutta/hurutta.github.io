const themeStorageKey = "aj-theme";
const langStorageKey = "aj-lang";
let currentLang = "en";
let cachedViewCount = null;
const root = document.documentElement;
const systemPrefersLight = window.matchMedia("(prefers-color-scheme: light)");

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
];

const homeContentSections = [
  { id: "about", label: "About" },
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
      applyTheme(nextTheme);
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
        slug: "shipping-edge-functions",
        title: "Shipping edge functions without fear",
        date: "May 02, ****",
        readingTime: "7 min read",
        summary:
          "To be filled soon ***",
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

  const goToStage = (stage) => {
    if (categoryPanel) categoryPanel.hidden = stage !== "categories";
    if (postsPanel) postsPanel.hidden = stage !== "posts";
    if (previewPanel) previewPanel.hidden = stage !== "preview";
  };

  const renderCategories = () => {
    categoryList.innerHTML = "";

    blogData.forEach((category) => {
      const li = document.createElement("li");
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

    category.posts.forEach((post) => {
      const li = document.createElement("li");
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
      html += "<div class=\"md-table\"><table><thead><tr>";
      headerCells.forEach((cell) => {
        html += `<th>${cell}</th>`;
      });
      html += "</tr></thead><tbody>";
      rows.forEach((row) => {
        html += "<tr>";
        row.forEach((cell) => {
          html += `<td>${cell}</td>`;
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
        const dayMatch = headingMatch[2].match(/^Day\s+(\d+)\s*:\s*(.*?)(?:\s*\|\s*(.+))?$/);
        if (dayMatch) {
          const [, dayNum, dayTitle, dayDate] = dayMatch;
          const dateHtml = dayDate ? `<span class="md-day-date">${dayDate.trim()}</span>` : "";
          html += `<h2 class="md-day-heading" id="day-${dayNum}" data-day="${dayNum}"><span class="md-day-badge">Day ${dayNum}</span>${dateHtml}<span class="md-day-title">${inlineMarkdown(dayTitle)}</span></h2>`;
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
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>");
}

function buildPostContentMap() {
  const headings = document.querySelectorAll("#postContent .md-day-heading");
  if (!headings.length) return "";
  const links = Array.from(headings).map((h) => {
    const day = h.dataset.day;
    const titleEl = h.querySelector(".md-day-title");
    const label = titleEl ? titleEl.textContent.trim() : `Day ${day}`;
    // Shorten long titles for the nav
    const short = label.length > 28 ? label.slice(0, 26) + "…" : label;
    return `<a href="#day-${day}">Day ${day}: ${short}</a>`;
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

function hydrateShellContent() {
  initBlogBrowser();
  initChatSection();
  hydratePostPage();
  renderRightPanels(document.body.dataset.page || "home");
}

hydrateShellContent();

// --- Shell navigation -----------------------------------------------------
const shellSupportsSPA = "pushState" in window.history && typeof window.fetch === "function";
let isShellNavigating = false;
let pendingShellNav = null;

if (shellSupportsSPA) {
  initShellNavigation();
}

function initShellNavigation() {
  document.addEventListener("click", handleShellLinkClick);
  window.addEventListener("popstate", (event) => {
    const target = event.state?.url || window.location.pathname + window.location.search;
    // force: by the time popstate fires the browser has already updated the
    // location, so the same-URL guard in navigateShell would always bail.
    navigateShell(target, false, true);
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
}
