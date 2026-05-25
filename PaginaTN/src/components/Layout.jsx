import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import Navbar from './Navbar';
import Footer from './Footer';
import Chatbot, { ChatFab } from './Chatbot';
import AdminPreviewBar from './admin/AdminPreviewBar';
import { isAdminPreviewSession } from '../utils/adminPreview';

export default function Layout() {
  const { site, ui } = useLanguage();
  const [chatOpen, setChatOpen] = useState(false);
  const { pathname, hash } = useLocation();
  const isHome = pathname === '/';
  const adminPreview = isAdminPreviewSession();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const timer = window.setTimeout(() => {
        const target = document.getElementById(id);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        }
      }, 120);
      return () => window.clearTimeout(timer);
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    return undefined;
  }, [pathname, hash]);

  return (
    <div className={`layout${isHome ? ' layout--home' : ''}${adminPreview ? ' layout--admin-preview' : ''}`}>
      {site.showDevBanner && (
        <div className="prototype-banner">{ui.common.devBanner}</div>
      )}
      <AdminPreviewBar />
      <Navbar onOpenChat={() => setChatOpen(true)} />
      <main className={`main-content main-content--site${isHome ? ' main-content--home' : ''}`}>
        <Outlet />
      </main>
      <Footer />
      <ChatFab onOpen={() => setChatOpen(true)} />
      <Chatbot open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}

