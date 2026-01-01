import Image from 'next/image'

const HowItWorks = () => {
  return (
    <section className='w-full bg-[#111A27]'>
        <div className='max-w-7xl mx-auto py-20 px-4'>
            <div>
                <p className='font-semibold text-[#738EB9] text-lg uppercase'>How It Works</p>
                <h2 className='text-4xl text-[#DEE9FA] font-bold py-4'>Simplify your invoices & extend cash flow at same time</h2>
                <p className='text-[#DEE9FA] max-w-3xl'>Your vendors get paid on time, the way they get paid today. You can leverage your existing cards, short-term financing, or link your bank account to defer repayment to the last minute or your next card statement.</p>
            </div>

            <div className='flex md:flex-row flex-col justify-between gap-10 mt-10'>
                <div>
                    <Image src={'/icons/check.svg'} height={80} width={80} alt='icon' />
                    <h2 className='font-bold text-[#BBCFEE] text-xl py-2'>Join Payshati</h2>
                    <p className='text-white'>Sign up on Payshati in just a few minutes and get your unique referral code. Once registered, you're ready to start recharging and earning. No complicated setup, no hidden steps.</p>
                </div>
                <div>
                    <Image src={'/icons/wallet.svg'} height={80} width={80} alt='icon' />
                    <h2 className='font-bold text-[#BBCFEE] text-xl py-2'>Recharge & pay bills</h2>
                    <p className='text-white'>Use Payshati to do mobile recharges, DTH recharges, and bill payments. For every successful order you place, you earn a commission directly in your wallet.</p>
                </div>
                <div>
                    <Image src={'/icons/reward.svg'} height={80} width={80} alt='icon' />
                    <h2 className='font-bold text-[#BBCFEE] text-xl py-2'>Refer & multiply your earnings.</h2>
                    <p className='text-white'>Share your referral code with friends and family. When they join Payshati and place any recharge or bill payment, you earn commission on their orders too.</p>
                </div>
            </div>
        </div>
    </section>
  )
}

export default HowItWorks