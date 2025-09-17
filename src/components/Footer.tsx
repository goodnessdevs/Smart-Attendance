import { Phone, Mail, MapPin } from "lucide-react";
import { Separator } from "./ui/separator";

function Footer() {
  return (
    <footer className="bg-black text-white afacad-flux md:ml-60 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 md:py-16 flex flex-col md:flex-row md:justify-between gap-10">
        {/* Logo and Title */}
        <div className="flex flex-col items-center md:items-start space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14">
              <img
                src="/funaab.png"
                alt="funaab"
                className="object-cover w-full"
              />
            </div>
            <h2 className="text-2xl font-semibold">Smart Attendance</h2>
          </div>
        </div>

        <Separator className="md:hidden" />

        {/* Contact Info */}
        <div className="flex flex-col items-center md:items-start space-y-2">
          <h3 className="text-lg font-semibold">Contact Us</h3>
          <div className="flex items-center gap-2 text-sm hover:text-green-400 transition-colors">
            <Phone size={16} />
            <a href="tel:+2348012345678">+234 801 234 5678</a>
          </div>
          <div className="flex items-center gap-2 text-sm hover:text-green-400 transition-colors">
            <Mail size={16} />
            <a href="mailto:info@smartattendance.com">
              info@smartattendance.com
            </a>
          </div>
        </div>

        <Separator className="md:hidden" />

        {/* Location Info */}
        <div className="flex flex-col items-center md:items-start space-y-2">
          <h3 className="text-lg font-semibold">Location</h3>
          <div className="flex items-center gap-2 text-sm">
            <MapPin size={16} />
            <span>FUNAAB, Abeokuta, Ogun State, Nigeria</span>
          </div>
        </div>
      </div>

      {/* Copyright at the bottom */}
      <div className="border-t border-gray-700 mt-4 py-6 text-center text-sm">
        &copy; 2025, Smart Attendance. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
