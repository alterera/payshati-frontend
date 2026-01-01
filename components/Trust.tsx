"use client"

import Image from "next/image";
import React from "react";

const Trust = () => {
  const certifications = [
    { src: '/trust/pci.svg', alt: 'PCI DSS Certified', width: 69, height: 69 },
    { src: '/trust/secure.svg', alt: 'Secure', width: 69, height: 69 },
    { src: '/trust/iso.svg', alt: 'ISO Certified', width: 69, height: 69 },
    { src: '/trust/encr.svg', alt: 'Encrypted', width: 69, height: 69 },
    { src: '/trust/axis.svg', alt: 'Axis Bank', width: 100, height: 100 },
  ]

  return (
    <section 
      className="w-full bg-gray-100 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/bg-pattern.svg')" }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-14 lg:py-16">
        <div className="flex flex-col justify-center items-center gap-6 md:gap-8">
          <h2 className="font-bold text-3xl md:text-4xl lg:text-5xl text-gray-900 text-center">
            Trusted, Safe & Secure
          </h2>
          <p className="text-base md:text-lg text-gray-700 text-center max-w-2xl">
            Bank Grade Security, Fully Encrypted, 24X7 Customer Support
          </p>
          
          <div className="bg-white rounded-xl py-6 md:py-8 px-4 md:px-6 lg:px-8 w-full max-w-4xl shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-6 md:gap-8 lg:gap-12">
              {certifications.map((cert, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center"
                >
                  <Image 
                    src={cert.src} 
                    height={cert.height} 
                    width={cert.width} 
                    alt={cert.alt}
                    className="h-12 w-12 md:h-16 md:w-16 lg:h-20 lg:w-20 object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Trust;
