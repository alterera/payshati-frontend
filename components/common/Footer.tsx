"use client"

import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { label: "Mobile Recharge", href: "/recharge" },
      { label: "Electricity Bill", href: "/recharge" },
      { label: "DTH Recharge", href: "/recharge" },
      { label: "FasTag Recharge", href: "/recharge" },
    ],
    legal: [
      { label: "Terms of Use", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Refund Policy", href: "/refund" },
    ],
    company: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Career", href: "/career" },
      { label: "FAQs", href: "/faqs" },
      { label: "Blog", href: "/blog" },
    ],
    tools: [
      { label: "EMI Calculator", href: "/tools/emi-calculator" },
      { label: "Currency Converter", href: "/tools/currency-converter" },
      { label: "IFSC Code Finder", href: "/tools/ifsc-finder" },
      { label: "FD Calculator", href: "/tools/fd-calculator" },
    ],
  };

  const socialLinks = [
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
  ];

  return (
    <section className="w-full bg-[#111A27]">
      <div className="max-w-7xl mx-auto py-12 md:py-16 lg:py-20 px-4 md:px-6">
        {/* Main Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 lg:gap-8 mb-10 md:mb-12">
          {/* Services */}
          <div>
            <h4 className="font-bold text-[#738EB9] text-sm md:text-lg uppercase mb-4">
              Services
            </h4>
            <ul className="font-medium text-white space-y-2 md:space-y-3">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm md:text-base hover:text-[#738EB9] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-[#738EB9] text-sm md:text-lg uppercase mb-4">
              Legal
            </h4>
            <ul className="font-medium text-white space-y-2 md:space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm md:text-base hover:text-[#738EB9] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-[#738EB9] text-sm md:text-lg uppercase mb-4">
              Company
            </h4>
            <ul className="font-medium text-white space-y-2 md:space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm md:text-base hover:text-[#738EB9] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Financial Tools */}
          <div>
            <h4 className="font-bold text-[#738EB9] text-sm md:text-lg uppercase mb-4">
              Financial Tools
            </h4>
            <ul className="font-medium text-white space-y-2 md:space-y-3">
              {footerLinks.tools.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm md:text-base hover:text-[#738EB9] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Logo, Social & Address */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 md:gap-6 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <Link href="/">
              <Image
                src={"/logo-white.png"}
                height={100}
                width={150}
                alt="Payshati logo"
                className="h-16 w-auto md:h-20 object-contain"
              />
            </Link>
            <div className="flex gap-4 text-white">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#738EB9] transition-colors duration-200"
                    aria-label={social.label}
                  >
                    <Icon className="h-5 w-5 md:h-6 md:w-6" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="text-xs md:text-sm text-white text-center md:text-right">
            <p className="mb-1">447 Sutter St, Ste 405 PMB 49</p>
            <p className="mb-2">Morigaon, Assam, 782127 India</p>
            <p className="text-[#738EB9]">
              © {currentYear} Payshati LLP. All rights reserved.
            </p>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="flex flex-col gap-4 md:gap-5 mt-12 md:mt-16 pt-8 border-t border-gray-700">
          <p className="text-xs text-gray-400 leading-relaxed">
            Payshati LLP is not responsible for the products, services, availability, or accuracy of information provided by third-party service providers, including but not limited to mobile operators, DTH providers, utility companies, and billers. Payshati does not control and is not liable for the operations, service interruptions, or policy changes of these third-party providers.
          </p>
          <p className="text-xs text-gray-400 leading-relaxed">
            By registering with Payshati, you agree to Payshati's Terms of Service, Privacy Policy, and Commission Policy.
          </p>
          <p className="text-xs text-gray-400 leading-relaxed">
            *Payshati may charge a convenience or service fee on certain recharges or bill payments. Commission rates, offers, and earnings are subject to change at any time without prior notice. Earnings are credited only for successful and confirmed transactions.
          </p>
          <p className="text-xs text-gray-400 leading-relaxed">
            **Referral and commission earnings are dependent on the activity of referred users and are governed by Payshati's referral program rules. Any misuse, fraudulent activity, or violation of terms may result in suspension or termination of the account and forfeiture of earnings.
          </p>
          <p className="text-xs text-gray-400 leading-relaxed">
            ***Cashback, discounts, and promotional benefits are subject to availability from respective service providers. Please consult the operator or biller for applicable offers and validity.
          </p>
          <p className="text-xs text-gray-400 leading-relaxed">
            Payshati LLP is a registered entity and operates as a digital recharge and bill payment facilitation platform. Payshati does not provide banking or financial advisory services.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Footer;
