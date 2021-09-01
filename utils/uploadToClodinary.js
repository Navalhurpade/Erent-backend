const cloudinary = require("cloudinary").v2;

async function uploadToCloudinary(files, callback) {
  let pictures = [];

  for (let i = 0; i < files.length; i++) {
    let uploadedImage = await cloudinary.uploader.upload(
      `uploads/${files[i].filename}`
    );
    pictures.push(uploadedImage.url);
  }

  callback(pictures);
}

module.exports = uploadToCloudinary;
