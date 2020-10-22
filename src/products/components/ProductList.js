import React from "react";
import queryString from "query-string";

import Spinner from "../../common/components/Spinner";
import isEmpty from "../../common/utils/isEmpty";
import ProductItem from "./ProductItem";

const ProductList = ({ products, onPageClick }) => {
  if (isEmpty(products)) return <Spinner />;

  const { previous, next } = products;

  const previousBtn = () => {
    if (previous) {
      const page = queryString.parseUrl(previous).query.page;
      return (
        <div
          className="btn btn-outline-dark mb-4 mr-2"
          onClick={() => {
            onPageClick(page);
          }}
        >
          Previous
        </div>
      );
    } else {
      return (
        <div className="btn btn-outline-dark mb-4 mr-2 disabled">Previous</div>
      );
    }
  };

  const nextBtn = () => {
    if (next) {
      const page = queryString.parseUrl(next).query.page;
      return (
        <div
          className="btn btn-outline-dark mb-4"
          onClick={() => {
            onPageClick(page);
          }}
        >
          Next
        </div>
      );
    } else {
      return <div className="btn btn-outline-dark mb-4 disabled">Next</div>;
    }
  };

  return (
    <div className="col">
      <div className="row">
        {products.results.map((product) => {
          return <ProductItem key={product.retailer_sku} product={product} />;
        })}
      </div>

      {(previous || next) && (
        <div className="mt-4 ml-1">
          {previousBtn()}
          {nextBtn()}
        </div>
      )}
    </div>
  );
};

export default ProductList;
