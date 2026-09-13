import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { blogPosts } from '../data/media';
import ProductImage from './ProductImage';
import { ScrollReveal } from '../hooks/useScrollReveal';

export default function BlogSection() {
  return (
    <section className="blog-section">
      <div className="container">
        <ScrollReveal>
          <div className="section-header-row">
            <h2 className="section-title-left">From the Blog</h2>
            <Link to="/shop" className="link-arrow">
              View all <ArrowRight size={14} />
            </Link>
          </div>
        </ScrollReveal>
        <div className="blog-grid">
          {blogPosts.map((post, i) => (
            <ScrollReveal key={post.id} delay={i * 80}>
              <article className="blog-card">
                <div className="blog-card-img">
                  <ProductImage src={post.image} alt={post.title} />
                </div>
                <div className="blog-card-body">
                  <time>{post.date}</time>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <Link to="/shop" className="link-arrow">
                    Read more <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
