import "highlight.js/styles/github-dark.css";
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";

type CodeHighlightedContentProps = {
  // Trusted HTML. `content` MUST be GitHub's rendered discussion `bodyHTML`,
  // which GitHub sanitizes server-side. We deliberately do not run
  // rehype-sanitize here: it would strip the highlight.js class names this
  // pipeline adds (breaking syntax colours) without adding protection over
  // GitHub's own sanitization. Never pass arbitrary/user HTML to this prop.
  content: string;
};

// Server Component: code blocks are highlighted at render time, so highlight.js
// is never shipped to the browser and there is no flash of unhighlighted code.
const CodeHighlightedContent = async ({
  content,
}: CodeHighlightedContentProps) => {
  const file = await unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeHighlight, { detect: true, ignoreMissing: true })
    .use(rehypeStringify)
    .process(content);

  return <div dangerouslySetInnerHTML={{ __html: String(file) }} />;
};

export default CodeHighlightedContent;
