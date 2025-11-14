const panels = document.querySelectorAll(".panel");
const themeStorageKey = "aj-theme";
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

function buildLeftNav(page) {
  if (page === "blog") {
    return `
      <nav>
        <a class="nav-button" href="index.html">
          <span>Home</span>
          <small>Profile & Work</small>
        </a>
        <button class="nav-button active" data-target="blog">
          <span>Blog</span>
          <small>Tech & Travel</small>
        </button>
      </nav>
    `;
  }

  if (page === "post") {
    return `
      <nav>
        <a class="nav-button" href="index.html">
          <span>Home</span>
          <small>Profile & Work</small>
        </a>
        <a class="nav-button active" href="blog.html">
          <span>Blog</span>
          <small>Tech & Travel</small>
        </a>
      </nav>
    `;
  }

  return `
    <nav>
      <button class="nav-button active" data-target="home">
        <span>Home</span>
        <small>Profile & Work</small>
      </button>
      <a class="nav-button" href="blog.html">
        <span>Blog</span>
        <small>Tech & Travel</small>
      </a>
    </nav>
  `;
}

function buildLeftPanel(page) {
  return `
    <div class="brand">
      <div class="avatar">
        <img src="assets/images/avatar.jpeg" alt="Portrait of Abid Jawad" loading="lazy" />
      </div>
      <h1>Abid Jawad</h1>
      <p>Researcher • Engineer • Developer</p>
    </div>
    ${buildLeftNav(page)}
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

function buildRightPanel() {
  return `
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
    <div class="project-embed">
      <h3>LinkedIn</h3>
      <div class="embed-wrapper">
        <iframe src="https://www.linkedin.com/embed/feed/update/urn:li:share:7358686570813575172" height="686" width="504" frameborder="0" allowfullscreen="" title="Embedded post"></iframe>
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
    const page = container.dataset.page || "home";
    container.innerHTML = buildLeftPanel(page);
  });
  document.querySelectorAll("[data-partial='right']").forEach((container) => {
    container.innerHTML = buildRightPanel();
  });
  decorateSocialLinks();
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

const buttons = document.querySelectorAll(".nav-button[data-target]");
const themeToggleButtons = document.querySelectorAll(".theme-toggle");

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

themeToggleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "light" ? "dark" : "light";
    applyTheme(nextTheme);
  });
});

systemPrefersLight.addEventListener("change", (event) => {
  if (!localStorage.getItem(themeStorageKey)) {
    applyTheme(event.matches ? "light" : "dark", false);
  }
});

function showPanel(id) {
  panels.forEach((panel) => {
    panel.hidden = panel.id !== id;
  });
  buttons.forEach((button) => {
    button.classList.toggle("active", button.dataset.target === id);
  });
}

buttons.forEach((button) => {
  button.addEventListener("click", () => showPanel(button.dataset.target));
});

function injectPartials() {}

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
    description: "To be filled soon ***",
    posts: [
      {
        slug: "tromso-auroras",
        title: "To be filled soon ***",
        date: "Feb 17, ****",
        readingTime: "6 min read",
        summary:
          "To be filled soon ***",
      },
    ],
  },
];

(function initBlogBrowser() {
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
      <a class="ghost-link" href="post.html?slug=${post.slug}">Continue reading →</a>
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
})();

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
        "To be filled soon ***.",
    },
    {
      question: "Key skills you bring?",
      answer:
        "To be filled soon ***.",
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

initChatSection();
