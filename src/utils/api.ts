import axios, { AxiosHeaders } from 'axios';

const axiosApi = (extraHeader: Partial<AxiosHeaders>) =>
  axios.create({
    baseURL: '/api',
    withCredentials: true,
    headers: {
      'Access-Control-Allow-Credentials': true,
      ...(extraHeader as AxiosHeaders),
    },
  });

export const API = {
  json: axiosApi({
    'Content-Type': 'application/json',
  }),
};
