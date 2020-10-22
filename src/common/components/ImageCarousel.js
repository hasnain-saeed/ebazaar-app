import React from "react";
import PropTypes from "prop-types";

const ImageCarousel = ({ id, images, alt }) => {
  return (
    <div>
      {images && (
        <div id={id} className="carousel slide" data-ride="carousel">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img className="d-block h-200 w-100" src={images[0]} alt={alt} />{" "}
            </div>
            {images.slice(1).map((image, i) => {
              return (
                <div key={i} className="carousel-item">
                  <img className="d-block h-200 w-100" src={image} alt={alt} />
                </div>
              );
            })}
          </div>
          <a
            className="carousel-control-prev"
            href={`#${id}`}
            role="button"
            data-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="sr-only">Previous</span>
          </a>
          <a
            className="carousel-control-next"
            href={`#${id}`}
            role="button"
            data-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="sr-only">Next</span>
          </a>
        </div>
      )}
    </div>
  );
};

ImageCarousel.propTypes = {
  id: PropTypes.string.isRequired,
  images: PropTypes.array.isRequired,
  alt: PropTypes.string.isRequired,
};

export default ImageCarousel;
