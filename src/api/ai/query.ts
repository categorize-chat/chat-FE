import { API } from '../api';
import { TAiSummaryRequest, TAiSummaryResponse } from './type';

export const AiSummaryQuery = () => ({
  mutationKey: [`AI summary`],
  mutationFn: async (req: TAiSummaryRequest) => {
    const response = await API.json
      .post('/chat/summary', req)
      .then(res => res.data as TAiSummaryResponse)
      .then(({ code, message, result }) => {
        if (code !== 200) {
          throw new Error(message);
        }

        return result;
      });

    return response;
  },
  refetchOnWindowFocus: false,
});
