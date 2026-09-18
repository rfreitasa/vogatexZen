import React from 'react';
import PropTypes from 'prop-types';

const ImageReport = ({ images }) => {
  const maxImagesPerRow = 2;

  const rows = [];
  let currentRow = [];

  images.forEach((image, index) => {
    currentRow.push(image);

    if (
      currentRow.length === maxImagesPerRow ||
      index === images.length - 1
    ) {
      rows.push(currentRow);
      currentRow = [];
    }
  });

  return (
    <div className="image-report">
      {rows.map((row, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className="image-report-row"
        >
          {row.map((image, imageIndex) => (
            <div
              key={`image-${rowIndex}-${imageIndex}`}
              className="image-report-item"
            >
              <div className="image-report-image-container">
                <img
                  src={image.src}
                  alt={image.alt || image.title || 'Imagem'}
                  className="image-report-image"
                />
              </div>

              {image.title && (
                <h3 className="image-report-title">
                  {image.title}
                </h3>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

ImageReport.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string.isRequired,
      alt: PropTypes.string,
      title: PropTypes.string,
    }),
  ).isRequired,
};

export default ImageReport;