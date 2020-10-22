import React from "react";
import { withRouter } from "react-router-dom";

const ProductItem = ({ product, history }) => {
  const onProductClick = (retailer_sku) => {
    history.push(`/products/${retailer_sku}`);
  };

  const { retailer_sku, name, images, is_out_of_stock } = product;
  return (
    <div className="product-item col-12 col-md-6 col-lg-3 d-flex align-items-stretch">
      <div className="card m-1" onClick={() => onProductClick(retailer_sku)}>
        <img
          className="card-img-top"
          src={images[0].image_file}
          alt="Product"
        />
        <div className="card-body">
          <p className="card-title">{name}</p>
          {is_out_of_stock && (
            <span className="badge badge-pill badge-warning mb-2">
              Out of Stock
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default withRouter(ProductItem);
