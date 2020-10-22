import ebazaar from "../../apis/ebazaar";
import { SET_USER_VERIFIED } from "./types";
import { GET_ERRORS } from "../../common/actions/types";

export const registerUser = (user, history) => (dispatch) => {
  ebazaar
    .post(`/register/`, user)
    .then((response) => {
      history.push("/login");
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const loginUser = (user) => (dispatch) => {
  ebazaar
    .post("/login/", user)
    .then((response) => {
      let { token } = response.data;
      token = `Token ${token}`;
      localStorage.setItem("jwtToken", token);
      setToken(token);
      dispatch(setUserVerified(true));
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const setToken = (token) => {
  if (token) {
    ebazaar.defaults.headers.common["Authorization"] = token;
  } else {
    delete ebazaar.defaults.headers.common["Authorization"];
  }
};

export const setUserVerified = (isVerified) => {
  return {
    type: SET_USER_VERIFIED,
    payload: isVerified,
  };
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("jwtToken");
  setToken(false);
  dispatch(setUserVerified(false));
};
