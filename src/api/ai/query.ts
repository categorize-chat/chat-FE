import aiApi from './api';
import { TAiSummaryRequest } from './type';

export const aiQueryKeys = {
  summary: 'aiSummary',
};

export const AiSummaryQuery = () => ({
  mutationKey: [aiQueryKeys.summary],
  mutationFn: async (req: TAiSummaryRequest) => {
    const { result } = await aiApi.getSummary(req);

    return result;
  },
  refetchOnWindowFocus: false,
});
