import {
  GET_CATEGORIES_LIST,
  GET_CATEGORY_PRODUCTS,
  GET_BRANDS_OF_CATEGORY_PRODUCTS,
  CLEAR_CATEGORY_PRODUCTS,
} from "../actions/types";

export default (state = {}, { type, payload }) => {
  switch (type) {
    case GET_CATEGORIES_LIST:
      return { ...state, categoriesList: payload };
    case GET_CATEGORY_PRODUCTS:
      return { ...state, categoryProducts: payload };
    case GET_BRANDS_OF_CATEGORY_PRODUCTS:
      return { ...state, brands: payload };
    case CLEAR_CATEGORY_PRODUCTS:
      return { ...state, categoryProducts: null, brands: null };
    default:
      return state;
  }
};
