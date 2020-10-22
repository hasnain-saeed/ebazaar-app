import React from "react";
import PropTypes from "prop-types";

const Select = ({ options, defaultValue }) => {
  return (
    <select className="custom-select" defaultValue={defaultValue}>
      {defaultValue && (
        <option disabled value={defaultValue}>
          {defaultValue}
        </option>
      )}
      {options &&
        options.map((option, i) => {
          return (
            <option key={i} value={option}>
              {option}
            </option>
          );
        })}
    </select>
  );
};

Select.propTypes = {
  options: PropTypes.array.isRequired,
  defaultValue: PropTypes.string.isRequired,
};

export default Select;
