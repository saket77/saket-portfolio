// Blog posts, loaded from the .md files in this folder at build time.
// Each post starts with a YAML-ish frontmatter block delimited by --- lines:
//
//   ---
//   title: My Post
//   date: 2026-06-20
//   slug: my-post
//   summary: One-line teaser.
//   tags: webgpt, agents
//   ---
//   ...markdown body...
//
// To publish a new post, just drop a new .md file here, commit, and deploy.

const modules = import.meta.glob("./*.md", { query: "?raw", import: "default", eager: true });

function parseFrontmatter(raw) {
  const meta = {};
  let body = raw;
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (match) {
    body = match[2];
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
  return { meta, body: body.trim() };
}

function slugFromPath(path) {
  return path.replace(/^\.\//, "").replace(/\.md$/, "");
}

export const posts = Object.entries(modules)
  .map(([path, raw]) => {
    const { meta, body } = parseFrontmatter(raw);
    return {
      slug: meta.slug || slugFromPath(path),
      title: meta.title || slugFromPath(path),
      date: meta.date || "",
      summary: meta.summary || "",
      tags: meta.tags ? meta.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      body
    };
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1)); // newest first

export function getPost(slug) {
  return posts.find((p) => p.slug === slug);
}
