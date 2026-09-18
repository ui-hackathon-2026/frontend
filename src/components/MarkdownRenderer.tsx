"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

export interface MarkdownRendererProps {
  content: string;
  className?: string;
  isUser?: boolean;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = "",
  isUser = false,
}) => {
  return (
    <div
      className={`markdown-content text-xs leading-relaxed font-sans ${
        isUser ? "text-white" : "text-slate-800"
      } ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          p: ({ children }) => (
            <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
          ),
          strong: ({ children }) => (
            <strong
              className={`font-bold ${
                isUser ? "text-white font-extrabold" : "text-slate-900 font-bold"
              }`}
            >
              {children}
            </strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          ul: ({ children }) => (
            <ul className="my-1.5 list-disc pl-4 space-y-1 last:mb-0">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="my-1.5 list-decimal pl-4 space-y-1 last:mb-0">{children}</ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          h1: ({ children }) => (
            <h1 className="text-sm font-extrabold text-slate-900 mt-3 mb-1.5 font-heading">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xs font-bold text-slate-900 mt-2.5 mb-1 font-heading">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xs font-semibold text-slate-800 mt-2 mb-1 font-heading">
              {children}
            </h3>
          ),
          blockquote: ({ children }) => (
            <blockquote
              className={`border-l-2 pl-3 py-1 my-2 italic rounded-r-lg text-xs ${
                isUser
                  ? "border-white/60 bg-white/10 text-white"
                  : "border-[#001299] bg-blue-50/60 text-slate-700"
              }`}
            >
              {children}
            </blockquote>
          ),
          code: ({ className: codeClassName, children, ...props }) => {
            const isBlock = Boolean(codeClassName) || (typeof children === "string" && children.includes("\n"));
            if (isBlock) {
              return (
                <div className="my-2 rounded-xl bg-slate-900 text-slate-100 p-3 overflow-x-auto border border-slate-800 text-[11px] font-mono leading-normal shadow-2xs">
                  <code {...props}>{children}</code>
                </div>
              );
            }
            return (
              <code
                className={`px-1.5 py-0.5 rounded font-mono text-[11px] ${
                  isUser
                    ? "bg-white/20 text-white"
                    : "bg-slate-200/80 text-slate-800 border border-slate-300/60"
                }`}
                {...props}
              >
                {children}
              </code>
            );
          },
          table: ({ children }) => (
            <div className="my-2 overflow-x-auto rounded-xl border border-slate-200/90 shadow-2xs">
              <table className="w-full border-collapse text-left text-xs">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-800 font-bold">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="p-2 border border-slate-200/70 font-semibold">{children}</th>
          ),
          td: ({ children }) => (
            <td className="p-2 border border-slate-200/70 text-slate-700">{children}</td>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`underline font-medium hover:opacity-80 transition-opacity ${
                isUser ? "text-white underline" : "text-[#001299]"
              }`}
            >
              {children}
            </a>
          ),
          hr: () => (
            <hr
              className={`my-3 border-t ${
                isUser ? "border-white/20" : "border-slate-200/80"
              }`}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
export default MarkdownRenderer;
