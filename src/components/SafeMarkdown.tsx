import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { ComponentProps } from 'react';

type ReactMarkdownProps = ComponentProps<typeof ReactMarkdown>;

export function SafeMarkdown(props: ReactMarkdownProps) {
  return (
    <ReactMarkdown
      {...props}
      components={{
        p: ({ node, children, ...rest }) => {
          return <div {...rest}>{children}</div>;
        },
        ...props.components,
      }}
    />
  );
}
