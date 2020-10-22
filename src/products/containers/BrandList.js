import React, { Component } from "react";
import { connect } from "react-redux";

import { getBrandsList } from "../actions/brandActions";
import Spinner from "../../common/components/Spinner";
import isEmpty from "../../common/utils/isEmpty";
import ProductCategoryItem from "../components/ProductCategoryItem";

class BrandList extends Component {
  componentDidMount() {
    this.props.getBrandsList();
  }

  renderBrands() {
    const { results } = this.props.brands;
    return results.map((brand) => {
      return (
        <ProductCategoryItem
          key={brand.name}
          to={`brands/${brand.name}`}
          imageUrl={brand.image}
          name={brand.name}
        />
      );
    });
  }

  render() {
    if (isEmpty(this.props.brands)) {
      return <Spinner />;
    }
    return (
      <div className="col">
        <div className="row">{this.renderBrands()}</div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    brands: state.brand.brandsList,
  };
};

export default connect(mapStateToProps, { getBrandsList })(BrandList);
