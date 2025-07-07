import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop({ scrollTargetRef }) {
  const { pathname } = useLocation();

  useEffect(() => {
    if (scrollTargetRef && scrollTargetRef.current) {
      scrollTargetRef.current.scrollTo({ top: 0, behavior: 'auto' });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, scrollTargetRef]);

  return null;
} 