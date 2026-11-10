import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { ComponentProps } from 'react';
import { parseYouTubeEmbedUrl } from '../utils/youtube';

type ReactMarkdownProps = ComponentProps<typeof ReactMarkdown>;

export function SafeMarkdown(props: ReactMarkdownProps) {
  return (
    <ReactMarkdown
      {...props}
      components={{
        p: ({ node, children, ...rest }) => {
          return <div {...rest}>{children}</div>;
        },
        a: ({ href, children, ...rest }) => {
          const isYouTube = href && (href.includes('youtube.com/watch') || href.includes('youtu.be/') || href.includes('youtube.com/shorts') || href.includes('youtube.com/embed/'));
          if (isYouTube) {
            const embed = parseYouTubeEmbedUrl(href);
            if (embed) {
              return (
                <div className="my-3 block">
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-200 bg-black shadow-md">
                    <iframe
                      src={embed}
                      title="Embedded YouTube Video"
                      className="absolute top-0 left-0 w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="text-xs text-red-600 hover:underline font-bold mt-1 inline-flex items-center gap-1">
                    ▶ {children || href}
                  </a>
                </div>
              );
            }
          }
          return <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>{children}</a>;
        },
        ...props.components,
      }}
    />
  );
}
