'use client';

import React, { useState } from 'react';

export default function SocialShareRail() {
  const [copied, setCopied] = useState(false);

  const handleShare = (platform: string) => {
    const url = typeof window !== 'undefined' ? window.location.href : 'https://www.mypeg.ca/';
    const title = 'SUNCASA Kigali NbS & MyPeg Impact Platform';

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        if (navigator.clipboard) {
          navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
        break;
    }
  };

  return (
    <div className="mypeg-social-share-rail" aria-label="Social Share Rail">
      <div className="share-rail-label">SHARE THIS:</div>
      <div className="share-rail-buttons">
        <button
          type="button"
          className="share-btn share-facebook"
          onClick={() => handleShare('facebook')}
          title="Share on Facebook"
          aria-label="Share on Facebook"
        >
          f
        </button>

        <button
          type="button"
          className="share-btn share-linkedin"
          onClick={() => handleShare('linkedin')}
          title="Share on LinkedIn"
          aria-label="Share on LinkedIn"
        >
          in
        </button>

        <button
          type="button"
          className="share-btn share-twitter"
          onClick={() => handleShare('twitter')}
          title="Share on X / Twitter"
          aria-label="Share on X / Twitter"
        >
          𝕏
        </button>

        <button
          type="button"
          className="share-btn share-email"
          onClick={() => handleShare('email')}
          title="Share via Email"
          aria-label="Share via Email"
        >
          ✉
        </button>
      </div>
      {copied && <div className="share-rail-copied-toast">Copied!</div>}
    </div>
  );
}
