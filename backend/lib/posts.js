const fs = require("fs");
const path = require("path");

// Reads blog post metadata from the same markdown files the frontend renders
// (frontend/src/posts/*.md), so Ask-Saket can reference and recommend Saket's
// writing. Only the frontmatter is parsed here — the bot needs title/summary, not
// the full body.

const POSTS_DIR = path.join(__dirname, "..", "..", "frontend", "src", "posts");

function parseFrontmatter(raw) {
  const meta = {};
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---/);
  if (match) {
    for (const line of match[1].split("\n")) {
      const idx = line.indexOf(":");
      if (idx === -1) continue;
      const key = line.slice(0, idx).trim();
      let val = line.slice(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      meta[key] = val;
    }
  }
  return meta;
}

function list() {
  let files = [];
  try {
    files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
  } catch {
    return [];
  }
  return files
    .map((file) => {
      let raw = "";
      try { raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8"); } catch { return null; }
      const meta = parseFrontmatter(raw);
      return {
        slug: meta.slug || file.replace(/\.md$/, ""),
        title: meta.title || file.replace(/\.md$/, ""),
        summary: meta.summary || "",
        date: meta.date || ""
      };
    })
    .filter(Boolean)
    .sort((a, b) => (a.date < b.date ? 1 : -1)); // newest first
}

module.exports = { list };
