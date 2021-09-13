const cloudinary = require("cloudinary").v2;
const fs = require("fs");

async function uploadToCloudinary(files, callback) {
  try {
    let promises = [];

    for (let i = 0; i < files.length; i++) {
      let imagePath = `uploads/${files[i].filename}`;

      let uploadPromise = cloudinary.uploader.upload(imagePath);
      promises.push(uploadPromise);
    }

    const data = await Promise.all([...promises]);
    const pictures = data.map((resolvedPromise) => resolvedPromise.url);

    deteleFiles(files);

    callback(pictures);
  } catch (error) {
    console.log(error);
  }
}

function deteleFiles(files) {
  for (let i = 0; i < files.length; i++)
    fs.unlink(`uploads/${files[i].filename}`, () => {});
}

module.exports = uploadToCloudinary;
