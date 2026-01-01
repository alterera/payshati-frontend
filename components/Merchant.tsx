import Image from "next/image";
import React from "react";
import { Button } from "./ui/Button";

const Merchant = () => {
  return (
    <section className="w-full">
      <div className="max-w-6xl mx-auto py-20">
        <div className="flex gap-20">
          <Image
            src={"/freecharge.png"}
            height={500}
            width={500}
            alt="freecharge"
          />
          <div className="">
            <div className="flex gap-5 items-center">
              <div className="border rounded-xl py-2 px-4">
                <Image src={'/logo-pink.png'} height={100} width={100} alt="logo-pink" />
              </div>
              <h4 className="font-semibold">Payshati Merchant</h4>
            </div>
            <div className="flex flex-col gap-5">
              <h2 className="font-semibold text-5xl pt-5">
                A one-stop solution for your business
              </h2>
              <p>
                Receive online and in-store payments, manage your business and a
                lot more!
              </p>

              <ul className="list-disc pl-4">
                <li>Accept payments via all-in-one QR</li>
                <li>Track and analyse payments: transactions, settlements & refunds</li>
              </ul>

              <Button variant="outline" className="w-fit">Know More</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Merchant;
