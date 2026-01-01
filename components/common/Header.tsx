"use client"

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Navbar } from "../Navbar";
import { Button } from "../ui/Button";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="flex max-w-6xl mx-auto justify-between items-center h-16 px-4 md:px-6">
        <Image 
          src={"/logo-black.png"} 
          height={100} 
          width={150} 
          alt="logo" 
          className="h-10 w-auto"
        />
        <div className="hidden md:block flex-1 px-8">
          <Navbar />
        </div>
        <div className="flex items-center gap-3 md:gap-5">
          <div className="hidden md:flex gap-5">
            <Button variant="outline">Login</Button>
            <Button>Signup</Button>
          </div>
          <div className="md:hidden">
            <Button variant="outline" size="sm">Login</Button>
          </div>
          <div className="md:hidden">
            <Navbar />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
