import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop({ loading }) {
  const { pathname } = useLocation();
  useEffect(() => {
    const { hash } = window.location;
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  useEffect(() => {
    const { hash } = window.location;
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ block: 'start', behavior: 'smooth' });
      }
    }
  }, [loading]);

  return (null);
}

export default ScrollToTop;
