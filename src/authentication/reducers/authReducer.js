import { SET_USER_VERIFIED } from "../actions/types";

export default (state = false, action) => {
  switch (action.type) {
    case SET_USER_VERIFIED:
      return action.payload;

    default:
      return state;
  }
};
