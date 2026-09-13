import { Play } from 'lucide-react';
import { heroMedia } from '../data/media';
import { ScrollReveal } from '../hooks/useScrollReveal';

export default function VideoShowcase() {
  return (
    <section className="video-showcase">
      <div className="container">
        <ScrollReveal className="video-showcase-inner">
          <div className="video-showcase-content">
            <span className="section-eyebrow">Our Process</span>
            <h2>From Farm to Your Table</h2>
            <p>
              Every batch is carefully sourced, sorted, and packed in food-grade
              packaging. Watch how we bring premium dry fruits straight to your
              pantry.
            </p>
            <ul className="video-features">
              <li>Handpicked at peak freshness</li>
              <li>Zero artificial preservatives</li>
              <li>Lab-tested for quality</li>
            </ul>
          </div>
          <div className="video-showcase-player">
            <video
              autoPlay
              muted
              loop
              playsInline
              poster={heroMedia.poster}
              className="showcase-video"
            >
              <source src={heroMedia.video} type="video/mp4" />
            </video>
            <div className="video-play-badge">
              <Play size={20} fill="currentColor" />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
