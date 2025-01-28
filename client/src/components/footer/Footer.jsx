import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      className="bg-gray-900 text-white py-10 relative bg-cover bg-center"
      style={{ backgroundImage: 'url("../../src/assets/img/footer/bg.jpg")' }}
    >
      {/* Overlay for background image with reduced opacity */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      <div className="relative z-10 container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl p-4">
        {/* About Us */}
        <div>
          <h4 className="text-xl text-white font-semibold mb-4">About Us</h4>
          <p className="text-white">
            PNY Careers offers students the opportunity to explore diverse
            career paths and empower their futures in the IT sector.
          </p>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-xl text-white font-semibold mb-4">
            Contact Info
          </h4>
          <ul className="text-white space-y-2">
            <li>
              Address: Office 1, Level #14, Arfa Software Technology Park,
              Ferozepur Road, Lahore
            </li>
            <li>Phone: +92 309 7779401</li>
            <li>Email: info@pnytrainings.com</li>
          </ul>
        </div>

        {/* Important Links */}
      

        {/* Social Media Icons */}
        <div>
          <h4 className="text-xl text-white font-semibold mb-4">Follow Us</h4>
          <p className="text-white mb-4">Connect with us on social media:</p>
          <div className="flex space-x-4">
            <a
              href="https://www.facebook.com/PNY.Trainings"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-pink-500"
            >
              <FaFacebookF size={24} />
            </a>

            <a
              href="https://x.com/PnyTrainings"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-pink-500"
            >
              <FaTwitter size={24} />
            </a>

            <a
              href="https://www.linkedin.com/company/pny-trainings/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-pink-500"
            >
              <FaLinkedin size={24} />
            </a>

            <a
              href="https://www.instagram.com/pny.trainings?igsh=MWM4ZGh4Y290ZHQzdw=="
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-pink-500"
            >
              <FaInstagram size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
