'use client';

import { useState } from 'react';

export function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for environments without clipboard API
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500">Share:</span>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs px-3 py-1.5 rounded-full bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] text-gray-400 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-200"
      >
        &#x1D54F;
      </a>
      <a
        href={`https://linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs px-3 py-1.5 rounded-full bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] text-gray-400 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-200 font-semibold"
      >
        in
      </a>
      <button
        onClick={copyLink}
        className="text-xs px-3 py-1.5 rounded-full bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] text-gray-400 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-200 cursor-pointer"
      >
        {copied ? 'Copied!' : '\uD83D\uDD17'}
      </button>
    </div>
  );
}
