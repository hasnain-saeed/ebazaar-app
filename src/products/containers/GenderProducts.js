import React, { Component } from "react";
import { connect } from "react-redux";
import queryString from "query-string";

import {
  getGenderBrandsCategories,
  getGenderProducts,
} from "../actions/productActions";
import CheckBoxList from "../../common/components/CheckBoxList";
import ProductList from "../components/ProductList";
import isEmpty from "../../common/utils/isEmpty";

class GenderProducts extends Component {
  state = {
    gender: "",
    selectedBrands: [],
    selectedCategories: [],
  };

  componentDidMount() {
    const { gender } = this.props.match.params;
    this.props.getGenderBrandsCategories(gender);
    this.props.getGenderProducts(gender);
    this.setState({ gender: gender });
  }

  componentDidUpdate() {
    const { gender } = this.props.match.params;
    if (gender !== this.state.gender) {
      this.props.getGenderBrandsCategories(gender);
      this.props.getGenderProducts(gender);
      this.setState({ gender: gender });
    }
  }

  fetchGenderProducts = (page = "") => {
    let params = "";
    if (page) params = `page=${page}&`;
    const { gender, selectedBrands, selectedCategories } = this.state;
    params += queryString.stringify({
      brand: selectedBrands,
      category: selectedCategories,
    });
    this.props.getGenderProducts(gender, params);
  };

  onBrandInputClick = (brand) => {
    const { selectedBrands } = this.state;
    if (selectedBrands.includes(brand)) {
      this.setState(
        {
          selectedBrands: selectedBrands.filter((b) => b !== brand),
        },
        this.fetchGenderProducts
      );
    } else {
      this.setState(
        { selectedBrands: [...selectedBrands, brand] },
        this.fetchGenderProducts
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
        this.fetchGenderProducts
      );
    } else {
      this.setState(
        { selectedCategories: [...selectedCategories, category] },
        this.fetchGenderProducts
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
              onPageClick={this.fetchGenderProducts}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  let brands, categories;
  const { genderBrandsCategories } = state.product;

  if (!isEmpty(genderBrandsCategories)) {
    brands = genderBrandsCategories.brands;
    categories = genderBrandsCategories.categories;
  }

  return {
    brands,
    categories,
    products: state.product[props.match.params.gender],
  };
};

export default connect(mapStateToProps, {
  getGenderBrandsCategories,
  getGenderProducts,
})(GenderProducts);
