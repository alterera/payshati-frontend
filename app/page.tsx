'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/context/AuthContext';
import Header from '@/components/common/Header';
import Hero from '@/components/Hero';
import RechargeBills from '@/components/RechargeBills';
import Merchant from '@/components/Merchant';
import About from '@/components/About';
import HowItWorks from '@/components/HowItWorks';
import Trust from '@/components/Trust';
import Footer from '@/components/common/Footer';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="">
      {/* <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div> */}
      <Header />
      <Hero />
      <HowItWorks />
      <RechargeBills />
      <Merchant />
      <About />
      <Trust />
      <Footer />
    </div>
  );
}
