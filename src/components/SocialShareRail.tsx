'use client';

import React, { useState, useEffect } from 'react';

interface SocialLinkItem {
  id: string;
  name: string;
  icon: string;
  bg_color: string;
  text_color?: string;
  share_type: string;
  url_template?: string;
  is_active?: boolean;
  order?: number;
}

const DEFAULT_SOCIALS: SocialLinkItem[] = [
  { id: 'facebook', name: 'Facebook', icon: 'f', bg_color: '#1877f2', text_color: '#ffffff', share_type: 'template', url_template: 'https://www.facebook.com/sharer/sharer.php?u={url}' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'in', bg_color: '#0a66c2', text_color: '#ffffff', share_type: 'template', url_template: 'https://www.linkedin.com/sharing/share-offsite/?url={url}' },
  { id: 'twitter', name: 'X (Twitter)', icon: '𝕏', bg_color: '#0f172a', text_color: '#ffffff', share_type: 'template', url_template: 'https://twitter.com/intent/tweet?url={url}&text={title}' },
  { id: 'email', name: 'Email', icon: '✉', bg_color: '#ea4335', text_color: '#ffffff', share_type: 'email', url_template: 'mailto:?subject={title}&body={url}' },
  { id: 'copy', name: 'Copy Link', icon: '🔗', bg_color: '#475569', text_color: '#ffffff', share_type: 'copy', url_template: '' },
];

export default function SocialShareRail() {
  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>(DEFAULT_SOCIALS);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadSocialLinks() {
      try {
        const res = await fetch('/api/social-links', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data.data) && data.data.length > 0) {
            setSocialLinks(data.data);
          }
        }
      } catch (err) {
        // graceful fallback to default socials
      }
    }
    loadSocialLinks();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleShare = (item: SocialLinkItem) => {
    const url = typeof window !== 'undefined' ? window.location.href : '/';
    const title = 'SUNCASA Kigali NbS Impact Platform';

    if (item.share_type === 'copy') {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
      return;
    }

    if (item.share_type === 'email') {
      const mailto = item.url_template
        ? item.url_template.replace(/\{url\}/g, encodeURIComponent(url)).replace(/\{title\}/g, encodeURIComponent(title))
        : `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`;
      window.location.href = mailto;
      return;
    }

    if (item.url_template) {
      const shareUrl = item.url_template
        .replace(/\{url\}/g, encodeURIComponent(url))
        .replace(/\{title\}/g, encodeURIComponent(title));
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    // Default fallback: copy link
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (socialLinks.length === 0) {
    return null;
  }

  return (
    <div className="mypeg-social-share-rail" aria-label="Social Share Rail">
      <div className="share-rail-label">SHARE:</div>
      <div className="share-rail-buttons">
        {socialLinks.map((item) => (
          <button
            key={item.id}
            type="button"
            className="share-btn"
            style={{
              backgroundColor: item.bg_color || '#0284c7',
              color: item.text_color || '#ffffff',
            }}
            onClick={() => handleShare(item)}
            title={`Share on ${item.name}`}
            aria-label={`Share on ${item.name}`}
          >
            {item.icon || '🔗'}
          </button>
        ))}
      </div>
      {copied && <div className="share-rail-copied-toast">Copied!</div>}
    </div>
  );
}
