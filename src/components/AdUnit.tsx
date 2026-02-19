import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface AdUnitProps {
  slot: string;
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  className?: string;
  responsive?: boolean;
}

export default function AdUnit({
  slot,
  format = 'auto',
  className = '',
  responsive = true
}: AdUnitProps) {
  const { user } = useAuth();
  const adRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    checkPremiumStatus();
  }, [user]);

  useEffect(() => {
    if (!isPremium && !isLoaded) {
      loadAd();
    }
  }, [isPremium, isLoaded]);

  const checkPremiumStatus = async () => {
    if (!user) {
      setIsPremium(false);
      return;
    }

    try {
      const { data } = await supabase
        .from('premium_subscriptions')
        .select('status, expires_at')
        .eq('user_id', user.id)
        .maybeSingle();

      const premium = data &&
        data.status === 'active' &&
        new Date(data.expires_at) > new Date();

      setIsPremium(premium || false);
    } catch (error) {
      console.error('Error checking premium status:', error);
      setIsPremium(false);
    }
  };

  const loadAd = () => {
    if (isLoaded || isPremium) return;

    const adClient = import.meta.env.VITE_GOOGLE_ADSENSE_CLIENT;

    if (!adClient || adClient === '' || adClient === 'ca-pub-XXXXXXXXXXXXXXXX') {
      setIsLoaded(true);
      return;
    }

    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        (window.adsbygoogle as any[]).push({});
        setIsLoaded(true);
        recordImpression();
      } else {
        const script = document.createElement('script');
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
        script.async = true;
        script.setAttribute('data-ad-client', adClient);
        script.crossOrigin = 'anonymous';

        script.onload = () => {
          if (window.adsbygoogle) {
            (window.adsbygoogle as any[]).push({});
            setIsLoaded(true);
            recordImpression();
          }
        };

        script.onerror = () => {
          setIsLoaded(true);
        };

        document.head.appendChild(script);
      }
    } catch (error) {
      console.error('Error loading ad:', error);
      setIsLoaded(true);
    }
  };

  const recordImpression = async () => {
    try {
      await supabase.rpc('record_ad_impression', {
        p_campaign_id: null,
        p_ad_type: 'google_adsense',
        p_ad_unit_id: slot,
        p_viewer_id: user?.id || null,
        p_page_location: window.location.pathname
      });
    } catch (error) {
      console.error('Error recording impression:', error);
    }
  };

  if (isPremium) {
    return null;
  }

  const adClient = import.meta.env.VITE_GOOGLE_ADSENSE_CLIENT;

  if (!adClient || adClient === '' || adClient === 'ca-pub-XXXXXXXXXXXXXXXX') {
    return null;
  }

  return (
    <div className={`ad-container ${className}`} ref={adRef}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adClient}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}