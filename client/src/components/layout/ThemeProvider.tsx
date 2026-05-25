"use client";

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ThemeProvider() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    document.body.classList.remove('theme-farmer', 'theme-business', 'theme-admin');
    
    if (pathname?.includes('business')) {
      document.body.classList.add('theme-business');
    } else if (pathname?.includes('admin')) {
      document.body.classList.add('theme-admin');
    } else {
      document.body.classList.add('theme-farmer');
    }
  }, [pathname]);

  if (!mounted) return null;
  return null;
}
