import {FaTwitter, FaInstagram, FaYoutube, FaGoogle} from 'react-icons/fa'

import './index.css'

const Footer = () => (
  <div className="footer-card">
    <div className="contact-icon-container">
      <FaGoogle className="contact-icon" />
      <FaTwitter className="contact-icon" />
      <FaInstagram className="contact-icon" />
      <FaYoutube className="contact-icon" />
    </div>
    <p className="contact-text">Contact us</p>
    <p className="contact-text">Designed by Maha Lakshmi</p>
  </div>
)

export default Footer
