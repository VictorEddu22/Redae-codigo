import { useEffect, useRef, useState } from 'react';

const SCRIPT_ID = 'google-identity-services';

function ensureGoogleScript() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) return resolve(window.google);
    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      existing.addEventListener('load', () => resolve(window.google), { once: true });
      existing.addEventListener('error', reject, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export default function GoogleSignInButton({ onCredential, disabled = false }) {
  const containerRef = useRef(null);
  const [available, setAvailable] = useState(Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID));

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || disabled) return undefined;

    let active = true;
    ensureGoogleScript()
      .then((google) => {
        if (!active || !containerRef.current) return;
        google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => onCredential(response.credential),
          ux_mode: 'popup',
        });
        containerRef.current.innerHTML = '';
        google.accounts.id.renderButton(containerRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'rectangular',
          width: Math.min(containerRef.current.clientWidth || 420, 420),
          logo_alignment: 'left',
        });
        setAvailable(true);
      })
      .catch(() => setAvailable(false));

    return () => {
      active = false;
    };
  }, [disabled, onCredential]);

  if (!import.meta.env.VITE_GOOGLE_CLIENT_ID || !available) return null;

  return (
    <div className="google-auth-block">
      <div className="auth-divider"><span>ou</span></div>
      <div ref={containerRef} className="google-auth-button" aria-label="Continuar com Google" />
    </div>
  );
}
