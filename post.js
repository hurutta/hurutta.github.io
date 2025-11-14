const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

const titleEl = document.getElementById("postTitle");
const metaEl = document.getElementById("postMeta");
const contentEl = document.getElementById("postContent");
const categoryEl = document.getElementById("postCategory");

async function loadPost() {
  if (!slug) {
    renderError("No post specified.", "Use the blog browser to pick a story.");
    return;
  }

  try {
    const response = await fetch(`posts/${slug}.md`);
    if (!response.ok) throw new Error("Post not found");
    const text = await response.text();
    const { frontmatter, body } = parseFrontMatter(text);
    populateFrontmatter(frontmatter);
    contentEl.innerHTML = markdownToHtml(body);
  } catch (error) {
    renderError("Unable to load that post.", error.message);
  }
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

function populateFrontmatter(meta) {
  titleEl.textContent = meta.title || "Untitled";
  metaEl.textContent = [meta.date, meta.reading_time].filter(Boolean).join(" · ") || "";
  categoryEl.textContent = meta.category || "Journal";
}

function markdownToHtml(markdown) {
  const lines = markdown.split(/\r?\n/);
  let html = "";
  let buffer = [];
  let inList = false;

  const flushParagraph = () => {
    if (buffer.length) {
      html += `<p>${inlineMarkdown(buffer.join(" "))}</p>`;
      buffer = [];
    }
  };

  const closeList = () => {
    if (inList) {
      html += "</ul>";
      inList = false;
    }
  };

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed === "") {
      flushParagraph();
      closeList();
      return;
    }

    const headingMatch = trimmed.match(/^(#{1,3})\s+(.*)$/);
    if (headingMatch) {
      flushParagraph();
      closeList();
      const level = headingMatch[1].length;
      html += `<h${level}>${inlineMarkdown(headingMatch[2])}</h${level}>`;
      return;
    }

    if (/^[-*+]\s+/.test(trimmed)) {
      flushParagraph();
      if (!inList) {
        html += "<ul>";
        inList = true;
      }
      const item = trimmed.replace(/^[-*+]\s+/, "");
      html += `<li>${inlineMarkdown(item)}</li>`;
      return;
    }

    buffer.push(trimmed);
  });

  flushParagraph();
  closeList();
  return html;
}

function inlineMarkdown(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>");
}

function renderError(title, message) {
  titleEl.textContent = title;
  metaEl.textContent = "";
  categoryEl.textContent = "Error";
  contentEl.innerHTML = `<p>${message}</p>`;
}

loadPost();
