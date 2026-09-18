import React from 'react';

const ImageReport = ({ images }) => {
  const maxImagesPerRow = 2; // Número máximo de imagens por linha

  const rows = [];
  let currentRow = [];

  images.forEach((image, index) => {
    currentRow.push(image);

    if (currentRow.length === maxImagesPerRow || index === images.length - 1) {
      rows.push(currentRow);
      currentRow = [];
    }
  });

  return (
    <div className="image-report">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((image, imageIndex) => (
            <div key={imageIndex} className="image-container">
              <img src={image.src} alt={image.alt} />
              <h3>{image.title}</h3>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ImageReport;