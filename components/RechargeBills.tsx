import Image from "next/image";
import React from "react";
import { Button } from "./ui/Button";

const RechargeBills = () => {
  return (
    <section className="w-full bg-[#F7F9FC] p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-5">
          <div className="bg-white w-3/4 p-10 rounded-xl">
            <h2 className="text-xl font-bold pb-10">
              Recharge & Bill Payments
            </h2>
            <div className="flex justify-between">
              <div className="flex flex-col items-center justify-center">
                <Image
                  src={"/icons/mobile.png"}
                  height={60}
                  width={60}
                  alt="icon"
                />
                <h4>Mobile Recharge</h4>
              </div>
              <div className="flex flex-col items-center justify-center">
                <Image
                  src={"/icons/dth.png"}
                  height={60}
                  width={60}
                  alt="icon"
                />
                <h4>DTH Recharge</h4>
              </div>
              <div className="flex flex-col items-center justify-center">
                <Image
                  src={"/icons/fastag.png"}
                  height={60}
                  width={60}
                  alt="icon"
                />
                <h4>FasTag Rechagre</h4>
              </div>
              <div className="flex flex-col items-center justify-center">
                <Image
                  src={"/icons/bulb.png"}
                  height={60}
                  width={60}
                  alt="icon"
                />
                <h4>Electricity Bill</h4>
              </div>
              <div className="flex flex-col items-center justify-center">
                <Image
                  src={"/icons/emi.png"}
                  height={60}
                  width={60}
                  alt="icon"
                />
                <h4>Loan EMI Payment</h4>
              </div>
              <div className="flex flex-col items-center justify-center">
                <Image
                  src={"/icons/more.png"}
                  height={60}
                  width={60}
                  alt="icon"
                />
                <h4>View All Services</h4>
              </div>
            </div>
          </div>
          <div className="w-1/4 bg-blue-300 rounded-xl p-8">
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-semibold">
                Get Detailed Spend Summary
              </h2>
              <p>Lorem ipsum dolor sit amet consectetur.</p>
              <Button className="rounded-full flex items-center">
                Download Our App Now{" "}
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

        <div className="flex gap-5 justify-between py-5">
          <div className="flex-1 flex gap-5 items-center bg-blue-300 p-2 rounded-full justify-between">
            <div className="flex gap-4">
              <div className="rounded-full">
                <Image
                  src={"/icons/bulb.png"}
                  height={50}
                  width={50}
                  alt="offer"
                  className="rounded-full"
                />
              </div>

              <div>
                <h2 className="font-semibold text-lg">
                  Do Mobile Recharge and Earn Upto ₹1000
                </h2>
                <p>Lorem ipsum dolor sit amet.</p>
              </div>
            </div>
            <Button variant="outline" className="rounded-full">
              Recharge Now
            </Button>
          </div>
          <div className="flex-1 flex gap-5 items-center bg-blue-300 p-2 rounded-full justify-between">
            <div className="flex gap-4">
              <div className="rounded-full">
                <Image
                  src={"/icons/bulb.png"}
                  height={50}
                  width={50}
                  alt="offer"
                  className="rounded-full"
                />
              </div>

              <div>
                <h2 className="font-semibold text-lg">
                  Do Mobile Recharge and Earn Upto ₹1000
                </h2>
                <p>Lorem ipsum dolor sit amet.</p>
              </div>
            </div>
            <Button variant="outline" className="rounded-full">
              Recharge Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RechargeBills;
