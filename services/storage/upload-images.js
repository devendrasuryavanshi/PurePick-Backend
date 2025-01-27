import googleDriveService from './google-drive.js';

const uploadImages = async (buffer, productDetails) => {
  try {
    const imageUrl = await googleDriveService.uploadImage(
      buffer,
      `${productDetails.productName}_front.jpg`,
      productDetails.productType
    );

    return { imageUrl };
  } catch (error) {
    throw error;
  }
};

export { uploadImages };