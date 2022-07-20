const header = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: '',
};

// var IP = 'http://172.20.10.4:3000/';
var IP = 'http://localhost:3000/';

function APIGet(url: any) {
  url = IP + url;
  return fetch(url).then((response) => response.json());
}

function APIPost(url: any, params: any) {
  url = IP + url;
  return fetch(url, {
    method: 'POST',
    headers: header,
    body: JSON.stringify(params),
  }).then((response) => response.json());
}

function APIPut(url: any, params: any) {
  url = IP + url;
  return fetch(url, {
    method: 'PUT',
    headers: header,
    body: JSON.stringify(params),
  }).then((response) => response.json());
}

const HandleApi = {
  APIGet,
  APIPost,
  APIPut,
};

export default HandleApi;
