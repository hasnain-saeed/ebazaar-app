import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import TextField from "../common/components/TextField";
import { loginUser } from "./actions/authActions";
import { clearErrors } from "../common/actions/errorActions";
import isEmpty from "../common/utils/isEmpty";

class Login extends Component {
  state = {
    username: "",
    password: "",
    errors: {
      username: "",
      password: "",
    },
  };

  componentDidMount() {
    if (this.props.isVerified) {
      this.props.history.push("/");
    }
    this.props.clearErrors();
  }

  componentDidUpdate() {
    if (this.props.isVerified) {
      this.props.history.push("/");
    }
  }

  onInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  validateInputs = (username, password) => {
    let isValid = true;
    const errors = {
      username: "",
      password: "",
    };

    if (isEmpty(username)) {
      errors.username = "Username cannot be empty";
      isValid = false;
    }

    if (isEmpty(password)) {
      errors.password = "Password cannot be empty";
      isValid = false;
    }

    return [isValid, errors];
  };
  onFormSubmit = (event) => {
    event.preventDefault();
    const { username, password } = this.state;
    const [isValid, errors] = this.validateInputs(username, password);
    this.setState({ errors });

    if (isValid) {
      const user = { username, password };
      this.props.loginUser(user, this.props.history);
    }
  };

  render() {
    const { username, password, errors } = this.state;
    const authErrors = this.props.errors;
    const invalidCredentials = authErrors.non_field_errors
      ? authErrors.non_field_errors.toString()
      : "";
    return (
      <div className="login">
        <div className="container">
          <div className="row">
            <div className="col-md-7 mx-auto">
              <p className="h1 display-6 border-bottom">Login</p>
              <p className="lead">Sign in to your eBazaar Staff account</p>
              <form onSubmit={this.onFormSubmit}>
                <TextField
                  placeholder="Username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={this.onInputChange}
                  error={errors.username}
                />
                <TextField
                  placeholder="Password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={this.onInputChange}
                  error={errors.password}
                />
                <div className="text-danger">{invalidCredentials}</div>
                <input
                  type="submit"
                  className="btn btn-outline-info btn-block mt-4"
                />
              </form>

              <div className="border-top pt-3 mt-4">
                <small className="text-muted">
                  Don't have an account?{" "}
                  <Link className="ml-2" to="/register">
                    Register
                  </Link>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isVerified: state.isVerified,
    errors: state.errors,
  };
};

export default connect(mapStateToProps, { loginUser, clearErrors })(Login);
