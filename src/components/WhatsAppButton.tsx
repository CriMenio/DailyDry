import { MessageCircle } from 'lucide-react';
import { STORE_WHATSAPP_URL } from '../config/commerce';

export default function WhatsAppButton() {
  return (
    <a
      href={STORE_WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-btn"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={28} />
    </a>
  );
}
