'use client';

import { useState } from 'react';

export default function TruncatedText({ text, maxLength }) {
  const [isTruncated, setIsTruncated] = useState(true);

  if (text.length <= maxLength) {
    return <p>{text}</p>;
  }

  const toggleTruncate = () => {
    setIsTruncated(!isTruncated);
  };

  return (
    <div>
      <p>
        {isTruncated ? `${text.slice(0, maxLength)}...` : text}
      </p>
      <button className="btn btn-link btn-sm" onClick={toggleTruncate}>
        {isTruncated ? 'Read more' : 'Read less'}
      </button>
    </div>
  );
}
