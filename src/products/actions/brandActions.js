import ebazaar from "../../apis/ebazaar";
import {
  GET_BRANDS_LIST,
  GET_BRAND_PRODUCTS,
  GET_CATEGORIES_OF_BRAND_PRODUCTS,
  CLEAR_BRAND_PRODUCTS,
} from "./types";

export const getBrandsList = () => async (dispatch) => {
  try {
    const { data } = await ebazaar.get(`/brands/`);
    dispatch({
      type: GET_BRANDS_LIST,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: GET_BRANDS_LIST,
      payload: null,
    });
  }
};

export const getBrandProducts = (brand, params = "") => async (dispatch) => {
  try {
    const { data } = await ebazaar.get(`/brands/${brand}/?${params}`);
    dispatch({
      type: GET_BRAND_PRODUCTS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: GET_BRAND_PRODUCTS,
      payload: null,
    });
  }
};

export const getCategoriesOfBrandProducts = (brand) => async (dispatch) => {
  try {
    const { data } = await ebazaar.get(`/brands/${brand}/categories`);
    dispatch({
      type: GET_CATEGORIES_OF_BRAND_PRODUCTS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: GET_CATEGORIES_OF_BRAND_PRODUCTS,
      payload: null,
    });
  }
};

export const clearBrandProducts = () => async (dispatch) => {
  dispatch({
    type: CLEAR_BRAND_PRODUCTS,
  });
};
