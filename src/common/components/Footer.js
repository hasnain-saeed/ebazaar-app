import React from "react";

const Footer = () => {
  return (
    <div>
      <footer className="bg-dark text-white text-center">
        <div className="container-fluid py-3">
          <div className="row">
            <div className="col-md-3">
              <h5 className="title">eBazaar</h5>
              Copyright &copy; {new Date().getFullYear()} eBazaar Inc.
            </div>
            <div className="col-md-3"></div>
            <div className="col-md-3"></div>
            <div className="col-md-3"></div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
