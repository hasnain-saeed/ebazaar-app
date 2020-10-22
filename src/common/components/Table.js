import React from "react";
import PropTypes from "prop-types";

const Table = ({ table }) => {
  return (
    <table className="table">
      <tbody>
        {Object.entries(table).map(([key, value], i) => {
          return (
            <tr key={i}>
              <td>{key}</td>
              <td>{value}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
Table.propTypes = {
  table: PropTypes.object.isRequired,
};

export default Table;
