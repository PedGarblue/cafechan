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
  const { response } = error;
  console.error('Request Failed:', error.config);
  if (response) {
    console.error('Status:', response.status);
    console.error('Data:', response.data);
    console.error('Headers:', response.headers);
  } else {
    console.error('Error Message:', error.message);
  }

  return Promise.reject(response ? response.data : error);
};

const request = options => {
  return client(options)
    .then(onSuccess)
    .catch(onError);
};

export default request;
