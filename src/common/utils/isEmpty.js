const isEmpty = (data) => {
  if (data === undefined || data === null) {
    return true;
  }
  if (typeof data === "object" && Object.keys(data).length === 0) {
    return true;
  }
  if (typeof data === "string" && data.trim().length === 0) {
    return true;
  }
};
export default isEmpty;
