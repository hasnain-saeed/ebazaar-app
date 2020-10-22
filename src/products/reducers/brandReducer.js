import {
  GET_BRANDS_LIST,
  GET_BRAND_PRODUCTS,
  GET_CATEGORIES_OF_BRAND_PRODUCTS,
  CLEAR_BRAND_PRODUCTS,
} from "../actions/types";

export default (state = {}, { type, payload }) => {
  switch (type) {
    case GET_BRANDS_LIST:
      return { ...state, brandsList: payload };
    case GET_BRAND_PRODUCTS:
      return { ...state, brandProducts: payload };
    case GET_CATEGORIES_OF_BRAND_PRODUCTS:
      return { ...state, categories: payload };
    case CLEAR_BRAND_PRODUCTS:
      return { ...state, brandProducts: null, categories: null };
    default:
      return state;
  }
};
