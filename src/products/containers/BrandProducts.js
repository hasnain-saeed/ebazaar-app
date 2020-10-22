import React, { Component } from "react";
import { connect } from "react-redux";
import queryString from "query-string";

import {
  getBrandProducts,
  getCategoriesOfBrandProducts,
  clearBrandProducts,
} from "../actions/brandActions";
import CheckBoxList from "../../common/components/CheckBoxList";
import ProductList from "../components/ProductList";

class BrandProducts extends Component {
  state = {
    selectedCategories: [],
  };

  componentDidMount() {
    const { brandName } = this.props.match.params;
    this.props.getBrandProducts(brandName);
    this.props.getCategoriesOfBrandProducts(brandName);
  }

  componentWillUnmount() {
    this.props.clearBrandProducts();
  }

  fetchBrandProducts = (page = "") => {
    let params = "";
    if (page) params = `page=${page}&`;
    const { selectedCategories } = this.state;
    params += queryString.stringify({
      category: selectedCategories,
    });
    this.props.getBrandProducts(this.props.match.params.brandName, params);
  };

  onCategoryInputClick = (category) => {
    const { selectedCategories } = this.state;
    if (selectedCategories.includes(category)) {
      this.setState(
        {
          selectedCategories: selectedCategories.filter((c) => c !== category),
        },
        this.fetchBrandProducts
      );
    } else {
      this.setState(
        { selectedCategories: [...selectedCategories, category] },
        this.fetchBrandProducts
      );
    }
  };

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12 col-sm-3">
            <CheckBoxList
              title="Categories"
              options={this.props.categories}
              onClick={this.onCategoryInputClick}
            />
          </div>
          <ProductList
            products={this.props.products}
            onPageClick={this.fetchBrandProducts}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    products: state.brand.brandProducts,
    categories: state.brand.categories,
  };
};

export default connect(mapStateToProps, {
  getBrandProducts,
  getCategoriesOfBrandProducts,
  clearBrandProducts,
})(BrandProducts);
