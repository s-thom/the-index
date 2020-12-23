import { useQuery } from 'react-query';
import { getTags } from '../api-types';

export default function useSuggestedTags(tags: string[]): string[] {
  const { data: suggestedTags } = useQuery(
    ['tags', tags],
    async () => {
      const response = await getTags({ queryParams: { excludeTags: tags } });
      return response.tags;
    },
    { keepPreviousData: true },
  );

  return suggestedTags ?? [];
}
