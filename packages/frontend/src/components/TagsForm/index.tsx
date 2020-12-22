import { useCallback, useState } from 'react';
import { useQuery } from 'react-query';
import { getTags } from '../../api-types';
import { noop } from '../../util/functions';
import TextButton from '../TextButton';
import './index.css';

interface TagsFormProps {
  tags: string[];
  onTagsChange?: (tags: string[]) => void;
}

export default function TagsForm({ tags, onTagsChange = noop }: TagsFormProps) {
  const [inputVal, setInputVal] = useState('');

  const { data: commonTags } = useQuery(['tags', tags], async () => {
    const response = await getTags({ queryParams: { excludeTags: tags } });
    return response.tags;
  });

  const pushTag = useCallback(
    (tag: string) => {
      if (!tags.includes(tag)) {
        onTagsChange([...tags, tag].sort());
      }
    },
    [onTagsChange, tags],
  );

  const addInputAsTag = useCallback(() => {
    pushTag(inputVal);
  }, [inputVal, pushTag]);

  const addTag = useCallback(
    (tag: string) => {
      pushTag(tag);
    },
    [pushTag],
  );

  const removeTag = useCallback(
    (tag: string) => {
      const filtered = tags.filter((t) => t !== tag);
      if (onTagsChange) {
        onTagsChange(filtered.sort());
      }
    },
    [onTagsChange, tags],
  );

  const onInputChange = useCallback((event: React.FormEvent<HTMLInputElement>) => {
    setInputVal(event.currentTarget.value);
  }, []);

  const onInputKeyPress = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        addInputAsTag();
        setInputVal('');
      }
    },
    [addInputAsTag],
  );

  return (
    <div className="TagsForm">
      <div className="TagsForm-input-container">
        <input
          className="TagsForm-input"
          id="add-tag"
          name="add-tag"
          placeholder="Add tag"
          value={inputVal}
          onChange={onInputChange}
          onKeyPress={onInputKeyPress}
        />
      </div>
      <ul className="TagsForm-tag-list">
        {tags.map((tag) => (
          <li className="TagsForm-tag" key={tag}>
            <TextButton onClick={() => removeTag(tag)} title="Remove" aria-label={`Remove ${tag}`}>
              -
            </TextButton>{' '}
            {tag}
          </li>
        ))}
      </ul>
      {commonTags && (
        <ul className="TagsForm-common-tags">
          {commonTags.map((tag) => (
            <li className="TagsForm-tag" key={tag}>
              <TextButton
                type="button"
                onClick={() => {
                  addTag(tag);
                }}
                title="Add"
                aria-label={`Add ${tag}`}
              >
                +
              </TextButton>{' '}
              {tag}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
