import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { registerUser } from "./actions/authActions";
import { clearErrors } from "../common/actions/errorActions";
import TextField from "../common/components/TextField";
import isEmpty from "../common/utils/isEmpty";

class Register extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    errors: {
      username: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  };

  componentDidMount() {
    if (this.props.isVerified) {
      this.props.history.push("/");
    }
    this.props.clearErrors();
  }

  onInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  validateInputs = (username, email, password, confirm_password) => {
    let isValid = true;
    const errors = {
      username: "",
      email: "",
      password: "",
      confirm_password: "",
    };

    if (isEmpty(username)) {
      errors.username = "Username cannot be empty";
      isValid = false;
    }

    if (isEmpty(email)) {
      errors.email = "Email cannot be empty";
      isValid = false;
    }

    if (isEmpty(password)) {
      errors.password = "Password cannot be empty";
      isValid = false;
    }

    if (isEmpty(confirm_password)) {
      errors.confirm_password = "Password cannot be empty";
      isValid = false;
    }

    if (!isEmpty(password) && !isEmpty(confirm_password)) {
      if (password !== confirm_password) {
        errors.password = errors.confirm_password = "Passwords do not match";
        isValid = false;
      }
    }

    return [isValid, errors];
  };

  onFormSubmit = (event) => {
    event.preventDefault();
    const { username, email, password, confirm_password } = this.state;
    const [isValid, errors] = this.validateInputs(
      username,
      email,
      password,
      confirm_password
    );
    this.setState({ errors });

    if (isValid) {
      const user = { username, email, password, password2: confirm_password };
      this.props.registerUser(user, this.props.history);
    }
  };

  render() {
    const { username, email, password, confirm_password, errors } = this.state;
    const authErrors = this.props.errors;
    const usernameError = authErrors.username
      ? authErrors.username.toString()
      : "";

    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-7 m-auto">
              <p className="h1 display-6 border-bottom">Join Today</p>
              <p className="lead">Create your eBazaar Staff account</p>
              <form onSubmit={this.onFormSubmit}>
                <TextField
                  placeholder="Username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={this.onInputChange}
                  error={errors.username || usernameError}
                />
                <TextField
                  placeholder="Email Address"
                  type="email"
                  name="email"
                  value={email}
                  onChange={this.onInputChange}
                  error={errors.email}
                />
                <TextField
                  placeholder="Password"
                  type="password"
                  name="password"
                  value={password}
                  onChange={this.onInputChange}
                  error={errors.password}
                />
                <TextField
                  placeholder="Confirm Password"
                  type="password"
                  name="confirm_password"
                  value={confirm_password}
                  onChange={this.onInputChange}
                  error={errors.confirm_password}
                />
                <input
                  type="submit"
                  className="btn btn-outline-info btn-block mt-4"
                />
              </form>
              <div className="border-top pt-3 mt-4">
                <small className="text-muted">
                  Already have an account?{" "}
                  <Link className="ml-2" to="/login">
                    Login
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

export default connect(mapStateToProps, { registerUser, clearErrors })(
  Register
);
