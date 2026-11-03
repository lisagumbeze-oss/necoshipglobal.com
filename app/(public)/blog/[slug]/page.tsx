import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Card } from "@/components/design-system/ui";
import { BRAND } from "@/lib/brand";
import { blogPosts, getPostBySlug, getRelatedPosts } from "@/lib/blog-posts";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export default function BlogArticlePage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const related = getRelatedPosts(post.relatedSlugs);

  return (
    <main className="min-h-screen bg-brand-surface px-4 py-10 md:px-8">
      <article className="mx-auto max-w-3xl">
        <p className="text-xs text-slate-500">
          <Link href="/blog" className="text-brand-blue underline">
            Resource Center
          </Link>{" "}
          / {post.category}
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold text-brand-navy">{post.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-600">
          <Badge tone="default">{post.category}</Badge>
          <span>{post.readMinutes} min read</span>
          <span>·</span>
          <time dateTime={post.publishedAt}>{post.publishedAt}</time>
        </div>

        <Card className="mt-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-navy text-sm font-bold text-white">
              {post.author.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <p className="font-semibold text-brand-navy">{post.author.name}</p>
              <p className="text-xs text-slate-500">{post.author.role}</p>
            </div>
          </div>
          <p className="text-sm text-slate-600">{post.excerpt}</p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="font-medium text-slate-500">Share:</span>
            <button type="button" className="text-brand-blue underline">
              LinkedIn
            </button>
            <button type="button" className="text-brand-blue underline">
              X
            </button>
            <button type="button" className="text-brand-blue underline">
              Copy link
            </button>
          </div>
        </Card>

        <nav className="mt-10 rounded-card border border-slate-200 bg-white p-4" aria-label="Table of contents">
          <p className="text-sm font-semibold text-brand-navy">Table of contents</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-brand-blue">
            {post.headings.map((h) => (
              <li key={h}>
                <a href={`#${h.replace(/\s+/g, "-").toLowerCase()}`} className="hover:underline">
                  {h}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="prose prose-slate mt-8 max-w-none">
          {post.headings.map((h, i) => (
            <section key={h} id={h.replace(/\s+/g, "-").toLowerCase()} className="mb-8">
              <h2 className="font-display text-2xl font-bold text-brand-navy">{h}</h2>
              <p className="mt-3 text-slate-700">{post.body[i]}</p>
            </section>
          ))}
        </div>

        <section className="mt-12">
          <h3 className="font-display text-xl font-bold text-brand-navy">Related articles</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {related.map((r) => (
              <Card key={r.slug}>
                <Link href={`/blog/${r.slug}`} className="font-semibold text-brand-navy hover:text-brand-blue">
                  {r.title}
                </Link>
                <p className="mt-1 text-xs text-slate-500">{r.category}</p>
              </Card>
            ))}
          </div>
        </section>

        <p className="mt-10 text-center text-sm text-slate-500">
          More questions?{" "}
          <Link href="/contact" className="font-semibold text-brand-blue underline">
            Contact {BRAND.name}
          </Link>
        </p>
      </article>
    </main>
  );
}
