import React from 'react';

export default function HighlightText({ text, highlight }) {
  if (!highlight) return <>{text}</>;

  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <mark key={i} style={{ backgroundColor: '#ffeb3b', padding: 0 }}>{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}
