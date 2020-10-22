import {
  GET_FEATURED_PRODUCTS,
  GET_GENDER_PRODUCTS,
  GET_PRODUCT_DETAIL,
  GET_GENDER_BRANDS_CATEGORIES,
  CLEAR_PRODUCT_DETAIL,
  GET_FEATURED_BRANDS_CATEGORIES,
} from "../actions/types";

export default (state = {}, { type, payload }) => {
  switch (type) {
    case GET_FEATURED_PRODUCTS:
      return { ...state, featured: payload };
    case GET_GENDER_PRODUCTS:
      return { ...state, [payload.gender]: payload.data };
    case GET_PRODUCT_DETAIL:
      return { ...state, productDetail: payload };
    case GET_GENDER_BRANDS_CATEGORIES:
      return { ...state, genderBrandsCategories: payload };
    case CLEAR_PRODUCT_DETAIL:
      return { ...state, productDetail: null };
    case GET_FEATURED_BRANDS_CATEGORIES:
      return { ...state, featuredBrandsCategories: payload };
    default:
      return state;
  }
};
