import axios from 'axios';

const client = axios.create({
  baseURL: process.env.SITE_URL,
  headers: {},
});

const onSuccess = function(response) {
  console.debug('Request Successful!', response);
  return response.data;
};

const onError = function(error) {
  console.error('Request Failed:', error.config);
  if (error.response) {
    console.error('Status:', error.response.status);
    console.error('Data:', error.response.data);
    console.error('Headers:', error.response.headers);
  } else {
    console.error('Error Message:', error.message);
  }

  return Promise.reject(error.response || error.message);
};

const request = options => {
  return client(options)
    .then(onSuccess)
    .catch(onError);
};

export default request;
