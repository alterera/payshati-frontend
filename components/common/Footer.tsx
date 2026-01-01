import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import Image from "next/image";
import React from "react";

const Footer = () => {
  return (
    <section className="w-full bg-[#111A27]">
      <div className="max-w-6xl mx-auto py-20">
        <div className="flex justify-between">
          <div>
            <h4 className="font-bold text-[#738EB9] text-lg uppercase">
              Services
            </h4>
            <ul className="font-medium text-white mt-4">
              <li>Mobile Recharge</li>
              <li>Electricity Bill</li>
              <li>DTH Recharge</li>
              <li>FasTag Recharge</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#738EB9] text-lg uppercase">
              Legal
            </h4>
            <ul className="font-medium text-white mt-4">
              <li>Terms of Use</li>
              <li>Privacy Policy</li>
              <li>Refund Policy</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#738EB9] text-lg uppercase">
              Company
            </h4>
            <ul className="font-medium text-white mt-4">
              <li>About</li>
              <li>Contact</li>
              <li>Career</li>
              <li>FAQs</li>
              <li>Blog</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#738EB9] text-lg uppercase">
              Financial Tools
            </h4>
            <ul className="font-medium text-white mt-4">
              <li>EMI Calculator</li>
              <li>Currency Converter</li>
              <li>IFSC Code Finder</li>
              <li>FD Calculator</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-between mt-10">
          <div className="flex items-center gap-10">
            <Image src={"/logo-white.png"} height={100} width={150} alt="logo" />
            <div className="flex gap-2 text-white">
              <Linkedin />
              <Facebook />
              <Instagram />
              <Youtube />
            </div>
          </div>

          <div className="text-xs text-white text-right">
            <p>447 Sutter St, Ste 405 PMB 49</p>
            <p>Morigaon, Assam, 782127 India</p>

            <p>© 2025 Payshati LLP. All rights reserved.</p>
          </div>
        </div>

        <div className="flex flex-col gap-5 mt-20 text-xs text-white">
            <p>Payshati LLP is not responsible for the products, services, availability, or accuracy of information provided by third-party service providers, including but not limited to mobile operators, DTH providers, utility companies, and billers. Payshati does not control and is not liable for the operations, service interruptions, or policy changes of these third-party providers.</p>
            <p>By registering with Payshati, you agree to Payshati's Terms of Service, Privacy Policy, and Commission Policy.</p>
            <p>*Payshati may charge a convenience or service fee on certain recharges or bill payments. Commission rates, offers, and earnings are subject to change at any time without prior notice. Earnings are credited only for successful and confirmed transactions.</p>
            <p>**Referral and commission earnings are dependent on the activity of referred users and are governed by Payshati's referral program rules. Any misuse, fraudulent activity, or violation of terms may result in suspension or termination of the account and forfeiture of earnings.</p>
            <p>***Cashback, discounts, and promotional benefits are subject to availability from respective service providers. Please consult the operator or biller for applicable offers and validity.</p>
            <p>Payshati LLP is a registered entity and operates as a digital recharge and bill payment facilitation platform. Payshati does not provide banking or financial advisory services.</p>
        </div>
      </div>
    </section>
  );
};

export default Footer;
