import Image from 'next/image'
import React from 'react'

const About = () => {
  return (
    <section className='w-full bg-[#004ED6]'>
        <div className='max-w-6xl mx-auto p-10'>
            <div className='flex gap-10 items-center'>
                <div className='flex-1'>
                    <h2 className='text-6xl font-bold bg-linear-to-b from-[#FFDF00] to-danger bg-clip-text text-[#F9A230]'>From recharge to digital financial inclusion</h2>
                    <p className='text-white pt-5'>Payshati was founded with the mission to create a digital ecosystem of financial services accessible to anyone. Having reached 99% pincodes of digital India, that mission has grown into a vision of bringing digital financial inclusion to a billion Indians.</p>
                </div>

                <Image src={'/freecharge.png'} height={500} width={500} alt='freecharge' />
            </div>
        </div>
    </section>
  )
}

export default About