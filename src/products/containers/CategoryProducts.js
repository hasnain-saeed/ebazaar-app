import React, { Component } from "react";
import { connect } from "react-redux";
import queryString from "query-string";

import {
  getCategoryProducts,
  getBrandsOfCategoryProducts,
  clearCategoryProducts,
} from "../actions/categoryActions";
import CheckBoxList from "../../common/components/CheckBoxList";
import ProductList from "../components/ProductList";

class CategoryProducts extends Component {
  state = {
    selectedBrands: [],
  };

  componentDidMount() {
    const { categoryName } = this.props.match.params;
    this.props.getCategoryProducts(categoryName);
    this.props.getBrandsOfCategoryProducts(categoryName);
  }

  componentWillUnmount() {
    this.props.clearCategoryProducts();
  }

  fetchCategoryProducts = (page = "") => {
    let params = "";
    if (page) params = `page=${page}&`;
    const { selectedBrands } = this.state;
    params += queryString.stringify({
      brand: selectedBrands,
    });
    this.props.getCategoryProducts(
      this.props.match.params.categoryName,
      params
    );
  };

  onBrandInputClick = (brand) => {
    const { selectedBrands } = this.state;
    if (selectedBrands.includes(brand)) {
      this.setState(
        {
          selectedBrands: selectedBrands.filter((b) => b !== brand),
        },
        this.fetchCategoryProducts
      );
    } else {
      this.setState(
        { selectedBrands: [...selectedBrands, brand] },
        this.fetchCategoryProducts
      );
    }
  };

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12 col-sm-3">
            <CheckBoxList
              title="Brands"
              options={this.props.brands}
              onClick={this.onBrandInputClick}
            />
          </div>

          <ProductList
            products={this.props.products}
            onPageClick={this.fetchCategoryProducts}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    products: state.category.categoryProducts,
    brands: state.category.brands,
  };
};

export default connect(mapStateToProps, {
  getCategoryProducts,
  getBrandsOfCategoryProducts,
  clearCategoryProducts,
})(CategoryProducts);
