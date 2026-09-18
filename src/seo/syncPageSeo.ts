import { useLayoutEffect } from 'react';
import { SITE_NAME, canonicalUrl, DEFAULT_META_DESCRIPTION } from '../config/site';

export type PageSeoConfig = {
  title: string;
  description?: string;
  /** Pathname only (no query string), e.g. `/shop` or `/product/abc`. */
  pathname: string;
  noIndex?: boolean;
};

function setMeta(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function clearMeta(name: string) {
  document.querySelector(`meta[name="${name}"]`)?.remove();
}

function setCanonical(href: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = href;
}

export function applyPageSeo(config: PageSeoConfig) {
  const description = config.description ?? DEFAULT_META_DESCRIPTION;
  const documentTitle = config.title.includes(SITE_NAME)
    ? config.title
    : `${config.title} | ${SITE_NAME}`;

  document.title = documentTitle;
  setMeta('description', description);
  setCanonical(canonicalUrl(config.pathname));

  if (config.noIndex) {
    setMeta('robots', 'noindex, nofollow');
  } else {
    clearMeta('robots');
  }
}

export function usePageSeo(config: PageSeoConfig | null) {
  useLayoutEffect(() => {
    if (!config) return;
    applyPageSeo(config);
  }, [config?.title, config?.description, config?.pathname, config?.noIndex]);
}
