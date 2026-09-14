import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail } from 'lucide-react';
import Logo from './Logo';
import { STORE_PHONE_DISPLAY, STORE_PHONE_TEL, STORE_ADDRESS, STORE_EMAIL, STORE_EMAIL_MAILTO } from '../config/commerce';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <Logo variant="footer" linkClassName="footer-logo" />
            <p className="footer-desc">
              Handpicked premium dry fruits & nuts for a healthier you. 100% natural,
              hygienically packed, and delivered fresh to your doorstep.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Facebook"><Facebook size={18} /></a>
              <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
              <a href="#" aria-label="Twitter"><Twitter size={18} /></a>
              <a href="#" aria-label="Youtube"><Youtube size={18} /></a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/shop">Shop</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Customer Service</h4>
            <ul>
              <li><Link to="/track-order">Track Order</Link></li>
              <li><Link to="/contact">Shipping & Delivery</Link></li>
              <li><Link to="/contact">Returns & Refunds</Link></li>
              <li><Link to="/contact">FAQ</Link></li>
              <li><Link to="/contact">Privacy Policy</Link></li>
              <li><Link to="/admin/login">Admin</Link></li>
            </ul>
          </div>

          <div className="footer-col footer-contact">
            <h4>Contact Us</h4>
            <ul className="footer-contact-list">
              <li className="footer-contact-item">
                <span className="footer-contact-icon" aria-hidden>
                  <Phone size={18} strokeWidth={1.75} />
                </span>
                <a href={STORE_PHONE_TEL}>{STORE_PHONE_DISPLAY}</a>
              </li>
              <li className="footer-contact-item">
                <span className="footer-contact-icon" aria-hidden>
                  <Mail size={18} strokeWidth={1.75} />
                </span>
                <a href={STORE_EMAIL_MAILTO}>{STORE_EMAIL}</a>
              </li>
              <li className="footer-contact-item">
                <span className="footer-contact-icon" aria-hidden>
                  <MapPin size={18} strokeWidth={1.75} />
                </span>
                <span className="footer-contact-text">{STORE_ADDRESS}</span>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Newsletter</h4>
            <p style={{ fontSize: '0.9rem' }}>Subscribe to get updates on new arrivals & offers.</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Your email" required />
              <button type="submit" className="btn btn-gold btn-sm">Join</button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Daily Dry. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
