import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function DiscussionBody({
  discussion,
  bodyMarkdown,
}: {
  discussion?: { bodyMarkdown: string };
  bodyMarkdown?: string;
}) {
  const content = discussion?.bodyMarkdown ?? bodyMarkdown ?? "";

  return (
    <div className="discussion-body">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
