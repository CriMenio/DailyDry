import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import { usePageSeo } from '../seo/syncPageSeo';
import {
  STATIC_PAGE_SEO,
  isProductDetailPath,
  shouldNoIndex,
} from '../seo/staticPages';

/**
 * Sets title, description, and self-referencing canonical for layout routes.
 * Product detail pages set their own SEO in ProductDetail.
 */
export default function SiteSeo() {
  const { pathname } = useLocation();

  const config = useMemo(() => {
    if (isProductDetailPath(pathname)) {
      return {
        title: 'Product',
        pathname,
        noIndex: false,
      };
    }

    const staticMeta = STATIC_PAGE_SEO[pathname];
    if (staticMeta) {
      return {
        ...staticMeta,
        pathname,
        noIndex: false,
      };
    }

    if (shouldNoIndex(pathname)) {
      return {
        title: 'Daily Dry',
        pathname,
        noIndex: true,
      };
    }

    return {
      title: 'Daily Dry',
      pathname,
      noIndex: false,
    };
  }, [pathname]);

  usePageSeo(config);

  return null;
}
