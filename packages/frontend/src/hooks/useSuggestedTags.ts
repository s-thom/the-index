import { useQuery } from 'react-query';
import { getV2Tags } from '../api-types';

export default function useSuggestedTags(tags: string[]): string[] {
  const { data: suggestedTags } = useQuery(
    ['tags', tags],
    async () => {
      const response = await getV2Tags({ queryParams: { exclude: tags } });
      return response.tags;
    },
    { keepPreviousData: true },
  );

  return suggestedTags ?? [];
}
