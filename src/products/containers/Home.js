import React, { Component } from "react";
import { connect } from "react-redux";

import {
  getFeaturedProducts,
  getGenderProducts,
} from "../actions/productActions";
import ProductCategorySection from "../components/ProductCategorySection";

class Home extends Component {
  componentDidMount() {
    this.props.getFeaturedProducts();
    this.props.getGenderProducts("men");
    this.props.getGenderProducts("women");
  }
  render() {
    const { featured, men, women } = this.props;
    return (
      <div className="container">
        <ProductCategorySection
          title="Featured Products"
          products={featured}
          to="featured"
        />
        <ProductCategorySection title="men" products={men} to="genders/men" />
        <ProductCategorySection
          title="women"
          products={women}
          to="genders/women"
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { featured, men, women } = state.product;
  return {
    featured,
    men,
    women,
  };
};

export default connect(mapStateToProps, {
  getFeaturedProducts,
  getGenderProducts,
})(Home);
