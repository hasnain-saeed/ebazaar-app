import React, { Component } from "react";
import { connect } from "react-redux";

import { getCategoryList } from "../actions/categoryActions";
import Spinner from "../../common/components/Spinner";
import isEmpty from "../../common/utils/isEmpty";
import ProductCategoryItem from "../components/ProductCategoryItem";

class CategoryList extends Component {
  componentDidMount() {
    this.props.getCategoryList();
  }

  renderCategories() {
    const { results } = this.props.categories;
    return results.map((category) => {
      return (
        <ProductCategoryItem
          key={category.name}
          to={`categories/${category.name}`}
          imageUrl={category.image}
          name={category.name}
        />
      );
    });
  }

  render() {
    if (isEmpty(this.props.categories)) {
      return <Spinner />;
    }
    return (
      <div className="col">
        <div className="row">{this.renderCategories()}</div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    categories: state.category.categoriesList,
  };
};

export default connect(mapStateToProps, { getCategoryList })(CategoryList);
