import React from "react";
import { Link } from "react-router-dom";

const ProductCategoryItem = ({ to, imageUrl, name }) => {
  return (
    <div className="col-12 col-md-6 col-lg-3 d-flex align-items-stretch">
      <Link to={to} title={name}>
        <div className="card m-1">
          <img className="card-img-top" src={imageUrl} alt={name} />
          <div className="card-body">
            <p className="card-title">
              <strong>{name.toUpperCase()}</strong>
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCategoryItem;
