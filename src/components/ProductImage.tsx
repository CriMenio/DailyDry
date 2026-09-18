import { useEffect, useMemo, useState } from 'react';
import { fallbackImage } from '../data/media';
import { resolveProductImagePath } from '../utils/productImagePath';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export default function ProductImage({
  src,
  alt,
  className = '',
  loading = 'lazy',
}: ProductImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const resolvedSrc = useMemo(() => resolveProductImagePath(src), [src]);
  const imageSrc = error ? fallbackImage : resolvedSrc || fallbackImage;

  useEffect(() => {
    setLoaded(false);
    setError(false);
  }, [resolvedSrc]);

  return (
    <div className={`product-image-wrap ${loaded ? 'loaded' : ''} ${className}`}>
      {!loaded && <div className="image-shimmer" aria-hidden="true" />}
      <img
        src={imageSrc}
        alt={alt}
        className="product-image"
        loading={loading}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setError(true);
          setLoaded(true);
        }}
      />
    </div>
  );
}
