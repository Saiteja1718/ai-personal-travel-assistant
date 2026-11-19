
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownContentProps {
  content: string;
}

function MarkdownContent({
  content,
}: MarkdownContentProps) {

  // Normalize common LLM line-break artifacts.
  // ReactMarkdown does not interpret raw HTML by default.
  const normalizedContent = content.replace(
    /<br\s*\/?>/gi,
    "\n"
  );

  return (
    <div className="space-y-3 break-words text-sm leading-7 text-slate-200">

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{

          // Main title
          h1: ({ children }) => (
            <h1 className="mb-5 text-2xl font-bold text-white">
              {children}
            </h1>
          ),

          // Section headings
          h2: ({ children }) => (
            <h2 className="mb-4 mt-8 border-b border-slate-800 pb-3 text-xl font-semibold text-blue-300">
              {children}
            </h2>
          ),

          // Day headings
          h3: ({ children }) => (
            <h3 className="mb-4 mt-6 text-lg font-semibold text-blue-300">
              {children}
            </h3>
          ),

          // Paragraphs
          p: ({ children }) => (
            <p className="my-3 leading-7 text-slate-300">
              {children}
            </p>
          ),

          // Numbered recommendations
          ol: ({ children }) => (
            <ol className="my-4 list-decimal space-y-5 pl-6">
              {children}
            </ol>
          ),

          // Bullet-point activities
          ul: ({ children }) => (
            <ul className="my-4 list-disc space-y-3 pl-6">
              {children}
            </ul>
          ),

          li: ({ children }) => (
            <li className="pl-1 leading-7 text-slate-300">
              {children}
            </li>
          ),

          // Bold labels
          strong: ({ children }) => (
            <strong className="font-semibold text-white">
              {children}
            </strong>
          ),

          // Italic text
          em: ({ children }) => (
            <em className="text-slate-400">
              {children}
            </em>
          ),

          // Markdown tables (when valid)
          table: ({ children }) => (
            <div className="my-5 overflow-x-auto rounded-lg border border-slate-700">
              <table className="w-full min-w-[420px] border-collapse text-left text-sm">
                {children}
              </table>
            </div>
          ),

          thead: ({ children }) => (
            <thead className="bg-slate-800 text-white">
              {children}
            </thead>
          ),

          th: ({ children }) => (
            <th className="border-b border-slate-700 px-4 py-3 font-semibold">
              {children}
            </th>
          ),

          td: ({ children }) => (
            <td className="border-b border-slate-800 px-4 py-3 align-top text-slate-300">
              {children}
            </td>
          ),

          hr: () => (
            <hr className="my-6 border-slate-700" />
          ),

        }}
      >
        {normalizedContent}
      </ReactMarkdown>

    </div>
  );
}

export default MarkdownContent;
