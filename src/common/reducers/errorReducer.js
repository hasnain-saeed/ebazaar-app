import { CLEAR_ERRORS, GET_ERRORS } from "../actions/types";

export default (state = {}, action) => {
  switch (action.type) {
    case GET_ERRORS:
      return action.payload;

    case CLEAR_ERRORS:
      return {};

    default:
      return state;
  }
};
