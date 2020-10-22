import ebazaar from "../../apis/ebazaar";
import { GET_ERRORS } from "../../common/actions/types";
import {
  GET_FEATURED_PRODUCTS,
  GET_GENDER_PRODUCTS,
  GET_PRODUCT_DETAIL,
  GET_GENDER_BRANDS_CATEGORIES,
  CLEAR_PRODUCT_DETAIL,
  UPDATE_PRODUCT_STATUS,
  GET_FEATURED_BRANDS_CATEGORIES,
  SUBSCRIBE_PRODUCT,
} from "./types";

export const getFeaturedProducts = (params = "") => async (dispatch) => {
  try {
    const { data } = await ebazaar.get(`/featured/?${params}`);
    dispatch({
      type: GET_FEATURED_PRODUCTS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: GET_FEATURED_PRODUCTS,
      payload: null,
    });
  }
};

export const getGenderProducts = (gender, params = "") => async (dispatch) => {
  try {
    const { data } = await ebazaar.get(`/genders/${gender}?${params}`);
    dispatch({
      type: GET_GENDER_PRODUCTS,
      payload: { data, gender },
    });
  } catch (err) {
    dispatch({
      type: GET_GENDER_PRODUCTS,
      payload: { data: null, gender },
    });
  }
};

export const getProductDetail = (retailer_sku) => async (dispatch) => {
  try {
    const { data } = await ebazaar.get(`/products/${retailer_sku}/`);

    dispatch({
      type: GET_PRODUCT_DETAIL,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: GET_PRODUCT_DETAIL,
      payload: null,
    });
  }
};

export const getGenderBrandsCategories = (gender) => async (dispatch) => {
  try {
    const { data } = await ebazaar.get(`/genders/${gender}/brands-categories`);
    dispatch({
      type: GET_GENDER_BRANDS_CATEGORIES,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: GET_GENDER_BRANDS_CATEGORIES,
      payload: null,
    });
  }
};

export const getFeaturedBrandsCategories = () => async (dispatch) => {
  try {
    const { data } = await ebazaar.get("/featured/brands-categories");
    dispatch({
      type: GET_FEATURED_BRANDS_CATEGORIES,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: GET_FEATURED_BRANDS_CATEGORIES,
      payload: null,
    });
  }
};

export const clearProductDetail = () => async (dispatch) => {
  dispatch({
    type: CLEAR_PRODUCT_DETAIL,
  });
};

export const updateProductStatus = (retailer_sku, status) => async (
  dispatch
) => {
  try {
    ebazaar.patch(`/products/${retailer_sku}/`, status);
    dispatch({
      type: UPDATE_PRODUCT_STATUS,
    });
  } catch (err) {
    dispatch({
      type: UPDATE_PRODUCT_STATUS,
    });
  }
};

export const subscribeProduct = (email, retailer_sku) => (dispatch) => {
  const formdata = new FormData();
  formdata.append("email", email);
  ebazaar
    .post(`/products/${retailer_sku}/subscribe`, formdata)
    .then((response) => {
      dispatch({
        type: SUBSCRIBE_PRODUCT,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};
