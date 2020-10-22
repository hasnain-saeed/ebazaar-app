import React, { Component } from "react";
import { connect } from "react-redux";
import queryString from "query-string";

import {
  getFeaturedBrandsCategories,
  getFeaturedProducts,
} from "../actions/productActions";
import CheckBoxList from "../../common/components/CheckBoxList";
import ProductList from "../components/ProductList";
import isEmpty from "../../common/utils/isEmpty";

class FeaturedProducts extends Component {
  state = {
    selectedBrands: [],
    selectedCategories: [],
  };

  componentDidMount() {
    this.props.getFeaturedBrandsCategories();
    this.props.getFeaturedProducts();
  }

  fetchFeaturedProducts = (page = "") => {
    let params = "";
    if (page) params = `page=${page}&`;
    const { selectedBrands, selectedCategories } = this.state;
    params += queryString.stringify({
      brand: selectedBrands,
      category: selectedCategories,
    });
    this.props.getFeaturedProducts(params);
  };

  onBrandInputClick = (brand) => {
    const { selectedBrands } = this.state;
    if (selectedBrands.includes(brand)) {
      this.setState(
        {
          selectedBrands: selectedBrands.filter((b) => b !== brand),
        },
        this.fetchFeaturedProducts
      );
    } else {
      this.setState(
        { selectedBrands: [...selectedBrands, brand] },
        this.fetchFeaturedProducts
      );
    }
  };

  onCategoryInputClick = (category) => {
    const { selectedCategories } = this.state;
    if (selectedCategories.includes(category)) {
      this.setState(
        {
          selectedCategories: selectedCategories.filter((c) => c !== category),
        },
        this.fetchFeaturedProducts
      );
    } else {
      this.setState(
        { selectedCategories: [...selectedCategories, category] },
        this.fetchFeaturedProducts
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
            <CheckBoxList
              title="Categories"
              options={this.props.categories}
              onClick={this.onCategoryInputClick}
            />
          </div>
          <div className="col">
            <ProductList
              products={this.props.products}
              onPageClick={this.fetchFeaturedProducts}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  let brands, categories;
  const { featuredBrandsCategories } = state.product;

  if (!isEmpty(featuredBrandsCategories)) {
    brands = featuredBrandsCategories.brands;
    categories = featuredBrandsCategories.categories;
  }
  return {
    brands,
    categories,
    products: state.product.featured,
  };
};

export default connect(mapStateToProps, {
  getFeaturedBrandsCategories,
  getFeaturedProducts,
})(FeaturedProducts);
