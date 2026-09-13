import { Outlet, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [localSearch, setLocalSearch] = useState(searchParams.get('q') || '');

  useEffect(() => {
    setLocalSearch(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearchChange = (query: string) => {
    setLocalSearch(query);
    const params = new URLSearchParams();
    if (query.trim()) {
      params.set('q', query);
    }
    navigate(`/shop${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <>
      <Header searchQuery={localSearch} onSearchChange={handleSearchChange} />
      <main key={location.pathname} className="page-enter">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
