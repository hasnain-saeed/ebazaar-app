import React, { Component, createRef } from "react";
import { connect } from "react-redux";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import { Modal } from "react-bootstrap";
import {
  getProductDetail,
  clearProductDetail,
  updateProductStatus,
  subscribeProduct,
} from "../actions/productActions";
import { clearErrors } from "../../common/actions/errorActions";
import ImageCarousel from "../../common/components/ImageCarousel";
import Select from "../../common/components/Select";
import Spinner from "../../common/components/Spinner";
import Table from "../../common/components/Table";
import isEmpty from "../../common/utils/isEmpty";
import TextField from "../../common/components/TextField";

export class ProductDetail extends Component {
  modal = createRef();
  state = {
    email: "",
    showModal: false,
    errors: {
      email: "",
    },
  };

  componentDidMount() {
    this.props.getProductDetail(this.props.match.params.id);
  }
  componentWillUnmount() {
    this.props.clearProductDetail();
    this.props.clearErrors();
  }

  onFeaturedStatusChange = (checked) => {
    this.props.updateProductStatus(this.props.retailer_sku, {
      is_featured: checked,
    });
  };

  onActiveStatusChange = (checked) => {
    this.props.updateProductStatus(this.props.retailer_sku, {
      is_active: checked,
    });
  };

  onStockStatusChange = (checked) => {
    this.props.updateProductStatus(this.props.retailer_sku, {
      is_out_of_stock: checked,
    });
  };

  handleClose = () => {
    this.setState({ showModal: false });
  };

  handleShow = () => {
    this.setState({ showModal: true });
  };

  onInputChange = (event) => {
    this.setState({ email: event.target.value });
  };

  validateInputs = (email) => {
    let isValid = true;
    const errors = {
      email: "",
    };

    if (isEmpty(email)) {
      errors.email = "Email cannot be empty";
      isValid = false;
    }

    return [isValid, errors];
  };

  onSubscribeSubmit = (event) => {
    event.preventDefault();
    const { email } = this.state;
    const [isValid, errors] = this.validateInputs(email);
    this.setState({ errors });

    if (isValid) {
      this.props.subscribeProduct(email, this.props.retailer_sku);
      this.handleClose();
    }
  };

  render() {
    if (isEmpty(this.props.name)) {
      return <Spinner />;
    }

    const {
      name,
      price,
      currency,
      images,
      sizes,
      moreInfo,
      description,
      is_out_of_stock,
      errors,
    } = this.props;
    const invalidEmail = errors.non_field_errors
      ? errors.non_field_errors.toString()
      : "";

    return (
      <div className="container">
        <div className="card">
          <div className="row">
            <div className="col-md-6">
              <ImageCarousel
                id="productDetailCarousel"
                images={images}
                alt="Product"
              />
            </div>
            <div className="col-md-6 pl-5 mt-3">
              <div className="row col-11">
                <h3>
                  <strong>{name}</strong>
                </h3>
              </div>
              <div className="row col-11">
                <h5>
                  <strong>Price:</strong> {currency}&nbsp;
                  {price}
                </h5>
              </div>
              <div className="row col-11">
                <p>{description}</p>
              </div>
              {is_out_of_stock && !this.props.isVerified && (
                <div>
                  <div className="row col-11 space-between mb-2">
                    <label className="badge badge-pill badge-warning">
                      Out of Stock
                    </label>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={this.handleShow}
                    >
                      Subscribe
                    </button>
                  </div>

                  <Modal show={this.state.showModal} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                      <Modal.Title>Subscribe</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <p>
                        Product is out of stock right now but we will let you
                        know as soon as it is available.
                      </p>
                      <TextField
                        name="email"
                        placeholder="Email"
                        type="email"
                        value={this.state.email}
                        onChange={this.onInputChange}
                        error={this.state.errors.email}
                      />
                    </Modal.Body>
                    <Modal.Footer>
                      <button
                        className="btn btn-secondary"
                        onClick={this.handleClose}
                      >
                        Close
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={this.onSubscribeSubmit}
                      >
                        Subscribe
                      </button>
                    </Modal.Footer>
                  </Modal>
                  {invalidEmail && (
                    <div className="row pl-3 mr-4 pr-2">
                      <div className="alert alert-danger alert-dismissible col-11 mt-1">
                        {invalidEmail}
                        <button
                          type="button"
                          className="close"
                          data-dismiss="alert"
                          aria-label="Close"
                        >
                          <span aria-hidden="true">x</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="row col-11">
                <Select options={sizes} defaultValue="Choose your Size" />
              </div>
              <div className="row col-11">
                <Table table={moreInfo} />
              </div>
              {this.props.isVerified && (
                <div className="row">
                  <div className="mr-2">
                    <BootstrapSwitchButton
                      checked={this.props.is_out_of_stock}
                      onlabel="Out of Stock"
                      onstyle="warning"
                      offlabel="In Stock"
                      offstyle="success"
                      width={140}
                      onChange={this.onStockStatusChange}
                    />
                  </div>
                  <div className="mr-2">
                    <BootstrapSwitchButton
                      checked={this.props.is_active}
                      offlabel="Inactive"
                      offstyle="warning"
                      onlabel="Active"
                      onstyle="success"
                      width={140}
                      onChange={this.onActiveStatusChange}
                    />
                  </div>
                  <div className="mr-2">
                    <BootstrapSwitchButton
                      checked={this.props.is_featured}
                      offlabel="Not Featured"
                      offstyle="warning"
                      onlabel="Featured"
                      onstyle="success"
                      width={140}
                      onChange={this.onFeaturedStatusChange}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { productDetail } = state.product;
  let name,
    price,
    currency,
    sizes,
    images,
    description,
    retailer_sku,
    is_active,
    is_featured,
    is_out_of_stock,
    moreInfo = {};

  if (!isEmpty(productDetail)) {
    name = productDetail.name;
    retailer_sku = productDetail.retailer_sku;
    is_active = productDetail.is_active;
    is_featured = productDetail.is_featured;
    is_out_of_stock = productDetail.is_out_of_stock;

    if (!isEmpty(productDetail.skus)) {
      price = productDetail.skus[0].price;
      currency = productDetail.skus[0].currency;
      sizes = productDetail.skus.map((sku) => sku.size);
    }

    if (!isEmpty(productDetail.images))
      images = productDetail.images.map((image) => image.image_file);

    description = productDetail.description.split("|");

    if (!isEmpty(description)) {
      for (let i = 1; i < description.length / 2 + 1; i++) {
        moreInfo[description[i]] = description[i + 1];
      }
      description = description[0];
    }
  }

  return {
    isVerified: state.isVerified,
    errors: state.errors,
    name,
    retailer_sku,
    price,
    currency,
    sizes,
    images,
    description,
    moreInfo,
    is_featured,
    is_active,
    is_out_of_stock,
  };
};

export default connect(mapStateToProps, {
  getProductDetail,
  clearProductDetail,
  updateProductStatus,
  subscribeProduct,
  clearErrors,
})(ProductDetail);
