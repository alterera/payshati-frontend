"use client"

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/Button";

interface Service {
  icon: string;
  title: string;
  titleLine1: string;
  titleLine2: string;
  href: string;
}

const services: Service[] = [
  {
    icon: "/icons/mobile.png",
    title: "Mobile Recharge",
    titleLine1: "Mobile",
    titleLine2: "Recharge",
    href: "/recharge",
  },
  {
    icon: "/icons/dth.png",
    title: "DTH Recharge",
    titleLine1: "DTH",
    titleLine2: "Recharge",
    href: "/recharge",
  },
  {
    icon: "/icons/fastag.png",
    title: "FasTag Recharge",
    titleLine1: "FasTag",
    titleLine2: "Recharge",
    href: "/recharge",
  },
  {
    icon: "/icons/bulb.png",
    title: "Electricity Bill",
    titleLine1: "Electricity",
    titleLine2: "Bill",
    href: "/recharge",
  },
  {
    icon: "/icons/emi.png",
    title: "Loan EMI Payment",
    titleLine1: "Loan EMI",
    titleLine2: "Payment",
    href: "/recharge",
  },
  {
    icon: "/icons/more.png",
    title: "View All Services",
    titleLine1: "View All",
    titleLine2: "Services",
    href: "/recharge",
  },
];

const RechargeBills = () => {
  return (
    <section className="w-full bg-[#F7F9FC] p-4 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Main Content - Responsive Layout */}
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Recharge & Bill Payments Section */}
          <div className="bg-white w-full lg:w-3/4 p-6 md:p-10 rounded-xl order-1">
            <h2 className="text-xl font-bold pb-6 md:pb-10">
              Recharge & Bill Payments
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
              {services.map((service, index) => (
                <Link
                  key={index}
                  href={service.href}
                  className="flex flex-col items-center justify-center p-4 rounded-lg transition-all duration-300 hover:bg-gray-50 hover:shadow-md hover:scale-105 group"
                >
                  <div className="mb-3 transition-transform duration-300 group-hover:scale-110">
                    <Image
                      src={service.icon}
                      height={60}
                      width={60}
                      alt={service.title}
                      className="object-contain"
                    />
                  </div>
                  <h4 className="text-sm md:text-base font-medium text-center leading-tight">
                    <span className="block">{service.titleLine1}</span>
                    <span className="block">{service.titleLine2}</span>
                  </h4>
                </Link>
              ))}
            </div>
          </div>

          {/* Get Detailed Spend Summary Section */}
          <div className="w-full lg:w-1/4 bg-blue-300 rounded-xl p-6 md:p-8 order-2 lg:order-2">
            <div className="flex flex-col gap-4">
              <h2 className="text-xl md:text-2xl font-semibold">
                Get Detailed Spend Summary
              </h2>
              <p className="text-sm md:text-base">
                Lorem ipsum dolor sit amet consectetur.
              </p>
              <Button className="rounded-full flex items-center justify-center gap-2 w-full">
                Download Our App Now
                <Image
                  src={"/icons/playstore.svg"}
                  height={15}
                  width={15}
                  alt="playstore"
                />
              </Button>
            </div>
          </div>
        </div>

        {/* Offers Section - Order 3 on mobile */}
        {/* <div className="flex flex-col md:flex-row gap-5 justify-between py-5 order-3">
          <div className="flex-1 flex flex-col sm:flex-row gap-4 sm:gap-5 items-center bg-blue-300 p-4 sm:p-2 rounded-full sm:justify-between">
            <div className="flex gap-4 items-center">
              <div className="rounded-full shrink-0">
                <Image
                  src={"/icons/bulb.png"}
                  height={50}
                  width={50}
                  alt="offer"
                  className="rounded-full"
                />
              </div>
              <div className="text-center sm:text-left">
                <h2 className="font-semibold text-base sm:text-lg">
                  Do Mobile Recharge and Earn Upto ₹1000
                </h2>
                <p className="text-sm">Lorem ipsum dolor sit amet.</p>
              </div>
            </div>
            <Button variant="outline" className="rounded-full w-full sm:w-auto">
              Recharge Now
            </Button>
          </div>
          <div className="flex-1 flex flex-col sm:flex-row gap-4 sm:gap-5 items-center bg-blue-300 p-4 sm:p-2 rounded-full sm:justify-between">
            <div className="flex gap-4 items-center">
              <div className="rounded-full shrink-0">
                <Image
                  src={"/icons/bulb.png"}
                  height={50}
                  width={50}
                  alt="offer"
                  className="rounded-full"
                />
              </div>
              <div className="text-center sm:text-left">
                <h2 className="font-semibold text-base sm:text-lg">
                  Do Mobile Recharge and Earn Upto ₹1000
                </h2>
                <p className="text-sm">Lorem ipsum dolor sit amet.</p>
              </div>
            <Button variant="outline" className="rounded-full w-fit sm:w-auto">
              Recharge Now
            </Button>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default RechargeBills;
