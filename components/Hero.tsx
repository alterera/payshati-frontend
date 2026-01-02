"use client";

import Image from "next/image";
import React from "react";
import { Button } from "./ui/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const TRUSTED_USERS = [
  {
    src: "https://github.com/shadcn.png",
    alt: "shadcn",
    fallback: "CN",
  },
  {
    src: "https://github.com/maxleiter.png",
    alt: "maxleiter",
    fallback: "LR",
  },
  {
    src: "https://github.com/evilrabbit.png",
    alt: "evilrabbit",
    fallback: "ER",
  },
];

const Hero = () => {
  return (
    <section className="relative w-full min-h-screen -mt-16 pt-16 pb-12 md:pb-16">
      <div className="relative z-10 max-w-6xl mx-auto h-full flex flex-col justify-center px-4 md:px-6 lg:px-8 pt-20 md:pt-24">
        {/* Trusted by section */}
        <div className="flex justify-center mb-8 md:mb-10">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-background/80 backdrop-blur-sm border border-border rounded-full">
            <div className="flex -space-x-2">
              {TRUSTED_USERS.map((user, index) => (
                <Avatar
                  key={`${user.alt}-${index}`}
                  className="ring-2 ring-background hover:ring-primary/20 transition-all duration-200 hover:scale-110"
                >
                  <AvatarImage src={user.src} alt={user.alt} />
                  <AvatarFallback className="text-xs font-medium">
                    {user.fallback}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            <p className="text-sm md:text-base font-medium text-muted-foreground">
              Trusted by <span className="text-foreground font-semibold">35K+</span> users
            </p>
          </div>
        </div>

        {/* Main heading */}
        <h1 className="scroll-m-20 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-center mb-6 md:mb-8 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Recharge Smart.
          <br />
          <span className="bg-linear-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Earn Every Time
          </span>
          {" "}With Payshati.
        </h1>

        {/* Description */}
        <p className="text-base md:text-lg lg:text-xl leading-relaxed text-center max-w-4xl mx-auto text-muted-foreground mb-8 md:mb-10 lg:mb-12">
          Payshati turns your everyday mobile recharges and bill payments into a
          real earning opportunity. Recharge for yourself, refer others, and
          earn commissions on every successful order - yours and your network&apos;s.
          Simple, transparent, and built to help you earn daily from payments
          you already make.
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center items-center">
          <Button size="lg" className="w-fit hover:cursor-pointer">
            Get Started
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-fit hover:cursor-pointer"
          >
            Watch Video
          </Button>
        </div>

        {/* Hero Image */}
        <div className="flex items-center justify-center relative w-full">
          <div className="relative w-full max-w-4xl aspect-video md:aspect-16/10">
            <Image
              src="/hero.png"
              fill
              alt="Payshati platform dashboard showing recharge and earning features"
              className="object-contain"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
