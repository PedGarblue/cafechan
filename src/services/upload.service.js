const path = require('path');
const sharp = require('sharp');
const filestack = require('filestack-js');

const config = require('../config/envConfig');

const makeThumbnail = fileBuffer => {
  return sharp(fileBuffer).resize(150);
};

const StorageClients = {
  LOCAL: {
    upload: async (postfile, options) => {
      const { storagePath } = options;
      const uploadPath = path.join(__dirname, `../../public`, storagePath);
      const postPath = `${uploadPath}/${postfile.name}`;
      const postURL = `${config.site_url}${storagePath}/${postfile.name}`;
      const thumbPath = `${uploadPath}/thumb_${postfile.name}`;
      const thumbURL = `${config.site_url}${storagePath}/thumb_${postfile.name}`;

      postfile.mv(postPath);
      await makeThumbnail(postfile.data).toFile(thumbPath);

      return {
        name: postfile.name,
        mimeType: postfile.mimetype,
        size: postfile.size,
        thumbnailUrl: thumbURL,
        url: postURL,
      };
    },
  },
  FILESTACK: {
    upload: async postfile => {
      const client = filestack.init(config.storage_client_api_key);
      const fileUpload = await client.upload(postfile.data);
      const thumbData = await makeThumbnail(postfile.data).toBuffer();
      const thumbUpload = await client.upload(thumbData);
      return {
        name: postfile.name,
        mimeType: fileUpload.mimetype,
        size: fileUpload.size,
        url: fileUpload.url,
        thumbnailUrl: thumbUpload.url,
      };
    },
  },
};

const uploadFile = async (file, options) => {
  const client = StorageClients[config.storage_client];
  const uploadData = await client.upload(file, options);
  return uploadData;
};

module.exports = {
  uploadFile,
};
