"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Button } from './ui/Button'

const HowItWorks = () => {
  const steps = [
    {
      icon: '/icons/check.svg',
      title: 'Join Payshati',
      description: 'Sign up on Payshati in just a few minutes and get your unique referral code. Once registered, you\'re ready to start recharging and earning. No complicated setup, no hidden steps.',
      link: '/register'
    },
    {
      icon: '/icons/wallet.svg',
      title: 'Recharge & pay bills',
      description: 'Use Payshati to do mobile recharges, DTH recharges, and bill payments. For every successful order you place, you earn a commission directly in your wallet.',
      link: '/recharge'
    },
    {
      icon: '/icons/reward.svg',
      title: 'Refer & multiply your earnings',
      description: 'Share your referral code with friends and family. When they join Payshati and place any recharge or bill payment, you earn commission on their orders too.',
      link: '/dashboard'
    }
  ]

  return (
    <section className='w-full bg-[#111A27]'>
      <div className='max-w-7xl mx-auto py-12 md:py-20 px-4 md:px-6'>
        {/* Header Section */}
        <div className='text-center md:text-left mb-10 md:mb-12'>
          <p className='font-semibold text-[#738EB9] text-sm md:text-lg uppercase tracking-wide'>
            How It Works
          </p>
          <h2 className='text-2xl md:text-3xl lg:text-4xl text-[#DEE9FA] font-bold py-3 md:py-4 leading-tight'>
            Simplify your invoices & extend cash flow at same time
          </h2>
          <p className='text-[#DEE9FA] text-sm md:text-base max-w-3xl mx-auto md:mx-0 leading-relaxed'>
            Your vendors get paid on time, the way they get paid today. You can leverage your existing cards, short-term financing, or link your bank account to defer repayment to the last minute or your next card statement.
          </p>
        </div>

        {/* Steps Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-10'>
          {steps.map((step, index) => (
            <div 
              key={index}
              className='flex flex-col md:items-start md:text-left'
            >
              <div className='mb-2'>
                <Image 
                  src={step.icon} 
                  height={80} 
                  width={80} 
                  alt={step.title}
                  className=''
                />
              </div>
              <h3 className='font-bold text-[#BBCFEE] text-lg md:text-xl py-2 md:py-3'>
                {step.title}
              </h3>
              <p className='text-white text-sm leading-relaxed mb-4'>
                {step.description}
              </p>
              {/* <Link href={step.link}>
                <Button 
                  variant="outline" 
                  className='w-full sm:w-fit text-white border-white hover:bg-white hover:text-[#111A27]'
                >
                  Learn More
                </Button>
              </Link> */}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks