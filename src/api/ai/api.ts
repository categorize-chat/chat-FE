import { API, defaultAxiosErrorHandler, defaultResponseHandler } from '../api';
import { TAiSummaryRequest, TAiSummaryResponse } from './type';

const aiApi = {
  async getSummary(req: TAiSummaryRequest) {
    return await API.json
      .post('/chat/summary', req)
      .then(defaultResponseHandler<TAiSummaryResponse>)
      .catch(defaultAxiosErrorHandler);
  },
};

export default aiApi;
