"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Twitter, Linkedin, MapPin, Mail, Phone, Heart, ExternalLink, ChevronRight } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { name: "About", href: "#about" },
    { name: "Schedule", href: "#schedule" },
    { name: "Events", href: "#events" },
  ];

  const developers = [
    {
      name: "Shubham Shokeen",
      linkedin: "https://www.linkedin.com/in/shubham-shokeen-425b2b30a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
    },
    {
      name: "Rudraksh Sharma",
      linkedin: "https://www.linkedin.com/in/rudraksh-dev?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
    }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="pt-12 sm:pt-16 pb-8 sm:pb-12">
          {/* Logo and Title Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <div className="inline-flex items-center justify-center gap-3 mb-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-xl">
                <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-2">
              Bhartiya Yuva Manch
            </h2>
            <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto px-4">
              Empowering youth through education, innovation, and community engagement
            </p>
          </motion.div>

          {/* Navigation Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 sm:mb-12"
          >
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8">
              {footerLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="group flex items-center gap-2 text-sm sm:text-base text-gray-300 hover:text-white transition-colors duration-300"
                >
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Address Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8 sm:mb-12"
          >
            <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-700/50 max-w-4xl mx-auto">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="bg-purple-500/20 p-2.5 sm:p-3 rounded-xl shrink-0">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2">Our Location</h3>
                  <p className="text-xs sm:text-sm lg:text-base text-gray-300 leading-relaxed">
                    Bharati Vidyapeeth's Institute of Computer Applications and Management
                  </p>
                  <p className="text-xs sm:text-sm lg:text-base text-gray-400 mt-2 leading-relaxed">
                    A-4, Paschim Vihar, Opp. Paschim Vihar (East) Metro Station, Rohtak Road, New Delhi, Delhi 110063
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Developers Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8 sm:mb-12"
          >
            {/* <div className="text-center mb-6">
              <p className="text-sm sm:text-base text-gray-400 mb-4 flex items-center justify-center gap-2">
                Designed and Developed with
                <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
                by
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
                {developers.map((dev, index) => (
                  <a
                    key={index}
                    href={dev.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 hover:from-purple-600/30 hover:to-indigo-600/30 border border-purple-500/30 hover:border-purple-500/50 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 transition-all duration-300 w-full sm:w-auto max-w-xs"
                  >
                    <div className="bg-purple-500 p-2 rounded-lg">
                      <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <span className="text-sm sm:text-base font-semibold text-white group-hover:text-purple-300 transition-colors">
                      {dev.name}
                    </span>
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-purple-400 ml-auto" />
                  </a>
                ))}
              </div>
            </div> */}
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="border-t border-gray-800 pt-8 sm:pt-10"
          >
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Get In Touch</h3>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                <div className="flex items-center gap-3 text-sm sm:text-base text-gray-300">
                  <div className="bg-green-500/20 p-2 rounded-lg">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                  </div>
                  <span>Contact us for more info</span>
                </div>
                <div className="flex items-center gap-3 text-sm sm:text-base text-gray-300">
                  <div className="bg-blue-500/20 p-2 rounded-lg">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                  </div>
                  <span>info@bvicam.edu</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-xs sm:text-sm text-gray-400"
            >
              &copy; {currentYear} BVICAM. All Rights Reserved.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex items-center gap-4"
            >
              <Link
                href="#"
                className="text-gray-400 hover:text-purple-400 transition-colors text-xs sm:text-sm"
              >
                Privacy Policy
              </Link>
              <span className="text-gray-700">|</span>
              <Link
                href="#"
                className="text-gray-400 hover:text-purple-400 transition-colors text-xs sm:text-sm"
              >
                Terms of Service
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600"></div>
    </footer>
  );
};

export default Footer;