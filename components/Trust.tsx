import Image from "next/image";
import React from "react";

const Trust = () => {
  return (
    <section className="w-full bg-gray-100" style={{backgroundImage: "/bg-pattern.svg"}}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col justify-center items-center py-15 gap-5">
          <h2 className="font-bold text-5xl">Trusted, Safe & Secure</h2>
          <p>Bank Grade Security, Fully Encrypted, 24X7 Customer Support</p>
          <div className="bg-white rounded-xl py-2 px-5 flex items-center gap-15 justify-between">
            <Image src={'/trust/pci.svg'} height={69} width={69} alt="pci" />
            <Image src={'/trust/secure.svg'} height={69} width={69} alt="pci" />
            <Image src={'/trust/iso.svg'} height={69} width={69} alt="pci" />
            <Image src={'/trust/encr.svg'} height={69} width={69} alt="pci" />
            <Image src={'/trust/axis.svg'} height={100} width={100} alt="pci" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Trust;
