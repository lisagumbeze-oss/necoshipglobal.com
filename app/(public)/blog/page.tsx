"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge, Card } from "@/components/design-system/ui";
import { BRAND } from "@/lib/brand";
import { blogPosts, type BlogCategory } from "@/lib/blog-posts";

const categories: (BlogCategory | "All")[] = ["All", "Shipping Tips", "Customs Guides", "Industry News", "Company Updates"];

export default function BlogPage() {
  const [filter, setFilter] = useState<(typeof categories)[number]>("All");

  const filtered = useMemo(() => {
    if (filter === "All") return blogPosts;
    return blogPosts.filter((p) => p.category === filter);
  }, [filter]);

  return (
    <main className="min-h-screen bg-brand-surface px-4 py-10 md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="max-w-3xl">
          <h1 className="font-display text-4xl font-bold text-brand-navy">Blog & Resource Center</h1>
          <p className="mt-2 text-slate-600">Practical guides for teams shipping with {BRAND.name}.</p>
        </header>

        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Article categories">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={filter === c}
              className={`focus-ring rounded-full px-4 py-2 text-sm font-medium ${
                filter === c ? "bg-brand-navy text-white" : "bg-white text-slate-700 ring-1 ring-slate-200"
              }`}
              onClick={() => setFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <Card key={post.slug} className="flex flex-col">
              <Badge tone="default" className="w-fit">
                {post.category}
              </Badge>
              <Link href={`/blog/${post.slug}`} className="mt-3 font-semibold text-brand-navy hover:text-brand-blue">
                {post.title}
              </Link>
              <p className="mt-2 flex-1 text-sm text-slate-600">{post.excerpt}</p>
              <p className="mt-3 text-xs text-slate-500">
                {post.readMinutes} min read · {post.publishedAt}
              </p>
            </Card>
          ))}
        </div>

        {filtered.length === 0 ? <p className="text-sm text-slate-600">No articles in this category yet.</p> : null}
      </div>
    </main>
  );
}
