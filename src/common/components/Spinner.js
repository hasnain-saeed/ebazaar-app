import React from "react";
import spinner from "../../images/spinner.gif";

export default function Spinner() {
  return (
    <div className="container">
      <img
        src={spinner}
        alt="Loading..."
        style={{
          width: "200px",
          margin: "auto",
          display: "block",
        }}
      />
    </div>
  );
}
