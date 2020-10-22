import React from "react";

import isEmpty from "../utils/isEmpty";
import Spinner from "./Spinner";

class CheckBoxList extends React.Component {
  render() {
    const { title, options, onClick } = this.props;
    if (isEmpty(options)) return <Spinner />;

    return (
      <div className="card bg-light mb-3">
        <div className="card-header bg-dark text-white text-uppercase">
          <i className="fa fa-list"></i> {title}
        </div>
        <ol className="list-group category_block">
          {options.map((option) => {
            return (
              <li className="list-group-item" key={option}>
                <div className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id={option}
                    onClick={() => onClick(option)}
                  />
                  <label className="custom-control-label" htmlFor={option}>
                    {option}
                  </label>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    );
  }
}

export default CheckBoxList;
