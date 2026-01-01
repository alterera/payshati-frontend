import Image from "next/image";
import React from "react";
import { Button } from "./ui/Button";

const Hero = () => {
  return (
    <section className="w-full h-screen">
      <div className="max-w-6xl mx-auto h-full">
        <h2 className="scroll-m-20 pt-20 text-5xl font-semibold leading-15 tracking-tight first:mt-0 text-center">
          Pay by credit card. <br /> Vendors get paid the way they want.
        </h2>

        <p className="leading-7 mt-6 text-center max-w-4xl mx-auto">
          Payshati gives you the flexibility to pay by credit card — even when
          your vendors don't accept them. Plastiq sends your payments to your
          vendor as a domestic or international wire, same-day ACH transfer, or
          overnight check — all in one place.
        </p>
        <div className="flex py-5 gap-5 justify-center">
            <Button>Get Started</Button>
            <Button variant="outline">Watch Video</Button>
        </div>
        <div className="flex items-center justify-center mt-10" >
          <Image src={"/hero.png"} height={100} width={800} alt="hero" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
