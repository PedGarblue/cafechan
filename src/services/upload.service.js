const path = require('path');
const sharp = require('sharp');
const config = require('../config/envConfig');

const StorageClients = {
  LOCAL: {
    upload: (postfile, options) =>
      new Promise(resolve => {
        const { storagePath } = options;
        const uploadPath = path.join(__dirname, `../../public`, storagePath);
        const postPath = `${uploadPath}/${postfile.name}`;
        const postURL = `${config.site_url}${storagePath}/${postfile.name}`;
        const thumbPath = `${uploadPath}/thumb-${postfile.name}`;
        const thumbURL = `${config.site_url}${storagePath}/thumb-${postfile.name}`;

        postfile.mv(postPath);
        sharp(postfile.data)
          .resize(150)
          .toFile(thumbPath, err => {
            if (err) throw err;
          });
        resolve({
          name: postfile.name,
          mimeType: postfile.mimetype,
          size: postfile.size,
          thumbnailUrl: thumbURL,
          url: postURL,
        });
      }),
  },
  FILESTACK: {},
};

const uploadFile = async (file, options) => {
  const client = StorageClients[config.storage_client];
  const uploadData = await client.upload(file, options);
  return uploadData;
};

module.exports = {
  uploadFile,
};
