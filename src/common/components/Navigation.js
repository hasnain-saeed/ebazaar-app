import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

class Navigation extends Component {
  render() {
    return (
      <div>
        <header className="site-header mb-4">
          <nav className="navbar navbar-expand-md navbar-dark bg-dark">
            <div className="container">
              <Link className="title navbar-brand ml-4" to="/">
                eBazaar
              </Link>
              <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarsExampleDefault"
                aria-controls="navbarsExampleDefault"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon" />
              </button>

              <div
                className="col-md-9 collapse navbar-collapse justify-content-start"
                id="navbarsExampleDefault"
              >
                <ul className="navbar-nav mr-auto">
                  <li className="nav-item">
                    <Link className="nav-link" to="/">
                      <i className="icon fa fa-home" />
                      Home
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/featured">
                      <i className="icon fa fa-star" />
                      Featured
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/brands">
                      Brand
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/categories">
                      Category
                    </Link>
                  </li>
                  <li className="nav-item dropdown">
                    <Link
                      className="nav-link dropdown-toggle"
                      to="#"
                      id="navbarDropdown"
                      role="button"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      Gender
                    </Link>
                    <div
                      className="dropdown-menu"
                      aria-labelledby="navbarDropdown"
                    >
                      <Link className="dropdown-item" to="/genders/men">
                        Men
                      </Link>
                      <Link className="dropdown-item" to="/genders/women">
                        Women
                      </Link>
                      <Link className="dropdown-item" to="/genders/girls">
                        Girls
                      </Link>
                      <Link className="dropdown-item" to="/genders/boys">
                        Boys
                      </Link>
                      <Link className="dropdown-item" to="/genders/unisex">
                        Unisex
                      </Link>
                    </div>
                  </li>
                </ul>
                {this.props.isVerified && (
                  <div className="navbar-nav">
                    <Link className="nav-item nav-link" to="/logout">
                      <i className="icon fa fa-sign-out-alt" />
                      Logout
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </nav>
        </header>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isVerified: state.isVerified,
  };
};

export default connect(mapStateToProps, {})(Navigation);
