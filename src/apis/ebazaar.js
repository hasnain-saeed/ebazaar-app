import axios from "axios";

export default axios.create({
  baseURL: "https://ebazaar-app.herokuapp.com/api",
});