"use client";

import React, { useState, useEffect } from 'react';
import { BookOpen, User, Calendar, Clock, ArrowLeft } from 'lucide-react';
import { DigiDb, Blog } from '@/lib/db';

export default function BlogsSection() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    setBlogs(DigiDb.getBlogs());
  }, []);

  const categories = ['All', 'Home Loan', 'CIBIL Tips', 'Business Loan', 'General'];

  const filteredBlogs = blogs.filter(blog => {
    return activeCategory === 'All' || blog.category.toLowerCase() === activeCategory.toLowerCase();
  });

  if (selectedBlog) {
    return (
      <section className="py-16 max-w-3xl mx-auto px-4 sm:px-6 w-full animate-fade-in">
        <button
          onClick={() => setSelectedBlog(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-white mb-8 text-sm font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles</span>
        </button>

        {/* Blog Post Details */}
        <article className="space-y-6">
          <div className="space-y-3">
            <span className="px-3 py-1 rounded bg-primary/10 text-primary dark:bg-accent/10 dark:text-accent text-xs font-bold uppercase">
              {selectedBlog.category}
            </span>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white leading-tight">
              {selectedBlog.title}
            </h1>
            
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-semibold pt-2">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                {selectedBlog.author}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(selectedBlog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {selectedBlog.readTime}
              </span>
            </div>
          </div>

          {/* Banner Graphic Placeholder */}
          <div className="w-full h-64 sm:h-96 rounded-2xl overflow-hidden relative border border-slate-200/50 dark:border-slate-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedBlog.image}
              alt={selectedBlog.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="font-sans text-slate-700 dark:text-slate-350 leading-relaxed text-sm sm:text-base space-y-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
            {selectedBlog.content.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {/* Local SEO metadata footer */}
          {selectedBlog.seoTitle && (
            <div className="p-4 bg-slate-100/50 dark:bg-slate-800/30 rounded-xl mt-12 text-[10px] text-slate-400 font-semibold">
              <span className="uppercase block font-bold text-slate-500 mb-1">SEO Info</span>
              <span>Title: {selectedBlog.seoTitle}</span>
              <span className="block mt-0.5">Description: {selectedBlog.seoDescription}</span>
            </div>
          )}
        </article>
      </section>
    );
  }

  return (
    <section className="py-20" id="blogs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-primary dark:text-accent uppercase tracking-wider">
            Blogs & Insights
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white mt-2">
            Stay Updated with Financial Advice
          </h2>
          <p className="font-sans text-slate-500 dark:text-slate-400 mt-2">
            Expert financial guides compiled by our senior advisory team.
          </p>
        </div>

        {/* Category Toggles */}
        <div className="flex flex-wrap justify-center gap-1.5 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-primary dark:bg-accent text-white dark:text-slate-950 font-bold'
                  : 'bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-350'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blogs Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog) => (
              <div
                key={blog.id}
                onClick={() => setSelectedBlog(blog)}
                className="rounded-2xl glass-card overflow-hidden cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="h-48 overflow-hidden relative border-b border-slate-200/50 dark:border-slate-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-slate-900/80 text-[10px] font-bold text-white uppercase tracking-wider">
                      {blog.category}
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="font-display font-extrabold text-base text-slate-900 dark:text-white line-clamp-2 hover:text-primary dark:hover:text-accent transition-colors">
                      {blog.title}
                    </h3>
                    <p className="font-sans text-xs text-slate-500 dark:text-slate-400 line-clamp-3">
                      {blog.content}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-3 border-t border-slate-200/40 dark:border-slate-800/40 flex items-center justify-between text-[10px] font-semibold text-slate-400">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    Read Article
                  </span>
                  <span>{blog.readTime}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-slate-400">
              No blogs found in this category.
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
