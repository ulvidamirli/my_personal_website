"use client";
import hljs from "highlight.js/lib/common";
import "highlight.js/styles/github-dark.css";
import { useEffect, memo } from "react";

type CodeHighlightedContentProps = {
  content: string;
};

const CodeHighlightedContent = ({ content }: CodeHighlightedContentProps) => {
  hljs.configure({
    cssSelector: "pre code, code",
  });

  useEffect(() => {
    hljs.highlightAll();
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: content }}></div>;
};

export default memo(CodeHighlightedContent);
