import ebazaar from "../../apis/ebazaar";
import {
  GET_CATEGORIES_LIST,
  GET_CATEGORY_PRODUCTS,
  GET_BRANDS_OF_CATEGORY_PRODUCTS,
  CLEAR_CATEGORY_PRODUCTS,
} from "./types";

export const getCategoryList = () => async (dispatch) => {
  try {
    const { data } = await ebazaar.get(`/categories/`);
    dispatch({
      type: GET_CATEGORIES_LIST,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: GET_CATEGORIES_LIST,
      payload: null,
    });
  }
};

export const getCategoryProducts = (category, params = "") => async (
  dispatch
) => {
  try {
    const { data } = await ebazaar.get(`/categories/${category}?${params}`);
    dispatch({
      type: GET_CATEGORY_PRODUCTS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: GET_CATEGORY_PRODUCTS,
      payload: null,
    });
  }
};

export const getBrandsOfCategoryProducts = (category) => async (dispatch) => {
  try {
    const { data } = await ebazaar.get(`/categories/${category}/brands`);
    dispatch({
      type: GET_BRANDS_OF_CATEGORY_PRODUCTS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: GET_BRANDS_OF_CATEGORY_PRODUCTS,
      payload: null,
    });
  }
};

export const clearCategoryProducts = () => async (dispatch) => {
  dispatch({
    type: CLEAR_CATEGORY_PRODUCTS,
  });
};
