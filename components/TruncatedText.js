'use client';

export default function TruncatedText({ text, maxLength }) {
  if (text.length <= maxLength) {
    return <span>{text}</span>;
  }

  return <span>{`${text.slice(0, maxLength)}...`}</span>;
}
