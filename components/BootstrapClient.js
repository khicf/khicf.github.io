'use client';

import { useEffect } from 'react';

export default function BootstrapClient() {
  useEffect(() => {
    // Only load Bootstrap JavaScript on client-side
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  return null;
}