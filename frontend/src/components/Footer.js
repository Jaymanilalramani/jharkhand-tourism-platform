import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>© {new Date().getFullYear()} Jharkhand Tourism</div>
        <div>
          Built for demo • Contact: <a href="tel:7972297448">7972297448</a> • 
          Email: <a href="mailto:jayramani74@gmail.com">jayramani74@gmail.com</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;