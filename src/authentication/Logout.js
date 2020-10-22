import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "./actions/authActions";

const Logout = ({ logout }) => {
  useEffect(() => {
    logout();
  }, [logout]);
  return (
    <div>
      <p className="h3">You have been logged out.</p>
      <div className="border-top pt-3">
        <small className="text-muted">
          Already have an account? <Link to="/login">Login Again</Link>
        </small>
      </div>
    </div>
  );
};

export default connect(null, { logout })(Logout);
