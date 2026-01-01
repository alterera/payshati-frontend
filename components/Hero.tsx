"use client"

import Image from "next/image";
import React from "react";
import { Button } from "./ui/Button";
// import Aurora from "./ui/Aurora";

const Hero = () => {
  return (
    <section className="relative w-full min-h-screen -mt-16 pt-16">
      {/* Aurora Background - Absolute positioned behind everything */}
      {/* <div className="absolute inset-0 top-0 w-full h-full z-0">
        <Aurora
          colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div> */}
      
      {/* Content - Relative positioning with z-index */}
      <div className="relative z-10 max-w-6xl mx-auto h-full flex flex-col justify-center px-4 md:px-6 py-20">
        <h2 className="scroll-m-20 text-4xl md:text-5xl font-semibold leading-tight tracking-tight first:mt-0 text-center">
        Recharge Smart. <br /> Earn Every Time. With Payshati.
        </h2>

        <p className="leading-7 mt-6 text-center max-w-4xl mx-auto text-base md:text-lg">
        Payshati turns your everyday mobile recharges and bill payments into a real earning opportunity. Recharge for yourself, refer others, and earn commissions on every successful order - yours and your network's. Simple, transparent, and built to help you earn daily from payments you already make.
        </p>
        <div className="flex py-5 gap-5 justify-center items-center">
          <Button className="w-fit hover:cursor-pointer">Get Started</Button>
          <Button variant="outline" className="w-fit hover:cursor-pointer">Watch Video</Button>
        </div>
        <div className="flex items-center justify-center mt-10">
          <Image 
            src={"/hero.png"} 
            height={100} 
            width={800} 
            alt="hero" 
            className="w-full h-auto max-w-4xl"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
