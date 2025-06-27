import React from 'react';
import ReactMarkdown from 'react-markdown';

interface Props {
  text: string;
}

const MarkdownMessage = ({ text }: Props) => {
  return (
    <div className="prose prose-sm prose-blue max-w-none">
      <ReactMarkdown>{text}</ReactMarkdown>
    </div>
  );
};

export default MarkdownMessage;
