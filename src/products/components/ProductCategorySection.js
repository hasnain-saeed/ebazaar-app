import React from "react";
import { Link } from "react-router-dom";

import ProductItem from "./ProductItem";
import Spinner from "../../common/components/Spinner";
import isEmpty from "../../common/utils/isEmpty";

const ProductCategorySection = ({ title, products, to }) => {
  const renderProductList = () => {
    if (isEmpty(products)) return <Spinner />;

    return (
      <div className="col mb-4">
        <div className="row">
          {products.results.slice(0, 8).map((product) => {
            return <ProductItem key={product.retailer_sku} product={product} />;
          })}
        </div>
        {products.count > 8 && (
          <div className="mt-4 mb-4">
            <Link to={to}>
              <button className="btn btn-outline-dark col-12">See More</button>
            </Link>
          </div>
        )}
      </div>
    );
  };
  return (
    <div className="container">
      <div className="vaimo_cms row ">
        <div className=" col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <div className="widget widget-static-block">
            <h2>
              <span>{title}</span>
            </h2>
          </div>
        </div>
      </div>
      {renderProductList()}
    </div>
  );
};

export default ProductCategorySection;
