import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, PenLine } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { posts, getPost } from "./posts/index.js";

export function BlogIndex() {
  useEffect(() => { document.title = "Writing — Saket Mundhada"; }, []);
  return (
    <section className="section">
      <h2 className="section-title"><PenLine size={20} /><span>Writing</span></h2>
      <p className="blog-intro">Notes on what I'm building and learning — agents, forward-deployed work, and the messy realities of shipping AI.</p>
      {posts.length === 0 ? (
        <p>No posts yet — check back soon.</p>
      ) : (
        <div className="blog-list">
          {posts.map((p) => (
            <article key={p.slug} className="blog-card">
              <Link to={`/blog/${p.slug}`} className="blog-card-title">{p.title}</Link>
              {p.date && <p className="blog-card-date">{p.date}</p>}
              {p.summary && <p className="blog-card-summary">{p.summary}</p>}
              {p.tags.length > 0 && (
                <div className="tags">{p.tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export function BlogPost() {
  const { slug } = useParams();
  const post = getPost(slug);

  useEffect(() => {
    document.title = post ? `${post.title} — Saket Mundhada` : "Not found — Saket Mundhada";
  }, [post]);

  if (!post) {
    return (
      <section className="section">
        <p>Post not found. <Link to="/blog">Back to writing →</Link></p>
      </section>
    );
  }

  return (
    <article className="section blog-post">
      <div className="blog-back-row">
        <Link to="/blog" className="blog-back"><ArrowLeft size={15} /> All writing</Link>
        <Link to="/" className="blog-back">Home</Link>
      </div>
      <h1 className="blog-post-title">{post.title}</h1>
      {post.date && <p className="blog-post-date">{post.date}</p>}
      {post.tags.length > 0 && (
        <div className="tags blog-post-tags">{post.tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>
      )}
      <div className="md blog-md">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
      </div>
    </article>
  );
}
