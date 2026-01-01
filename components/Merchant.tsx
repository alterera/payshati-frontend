"use client"

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/Button";

const Merchant = () => {
  return (
    <section className="w-full bg-white">
      <div className="max-w-7xl mx-auto py-12 md:py-20 px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-20 items-center">
          {/* Image Section */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
            <div className="relative w-full max-w-md lg:max-w-lg">
              <Image
                src={"/freecharge.png"}
                height={500}
                width={500}
                alt="Merchant solution"
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="flex flex-wrap gap-3 md:gap-5 items-center mb-6">
              <div className="border border-gray-200 rounded-lg py-2 px-3 md:px-4 bg-gray-50">
                <Image 
                  src={'/logo-pink.png'} 
                  height={80} 
                  width={100} 
                  alt="Payshati logo" 
                  className=""
                />
              </div>
              <h4 className="font-semibold text-lg md:text-xl text-gray-800">
                Payshati Platform
              </h4>
            </div>
            
            <div className="flex flex-col gap-4 md:gap-6">
              <h2 className="font-bold text-3xl md:text-4xl lg:text-5xl leading-tight text-gray-900">
                A one-stop solution for your bill payments
              </h2>
              
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                Receive online and in-store payments, manage your business and a
                lot more!
              </p>

              <ul className="list-disc list-inside space-y-2 md:space-y-3 text-gray-700 text-sm md:text-base pl-2">
                <li>Accept payments via all-in-one QR</li>
                <li>Track and analyse payments: transactions, settlements & refunds</li>
              </ul>

              <div className="pt-2">
                <Link href="/merchant">
                  <Button className="w-fit sm:w-fit border border-[#FF0096] bg-transparent hover:bg-[#ff0095d0] hover:text-white hover:cursor-pointer font-semibold text-[#FF0096]">
                    Know More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Merchant;
