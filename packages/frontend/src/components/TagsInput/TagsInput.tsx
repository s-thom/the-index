import { PropsWithRef, useCallback, useState } from 'react';
import styled from 'styled-components';
import { noop } from '../../util/functions';
import { PlainInput } from '../PlainComponents';
import TagChip from './TagChip';

const Wrapper = styled.div``;

const InputWrapper = styled.div`
  border: 0.5px solid ${({ theme }) => theme.colors.outline};
  border-radius: 1px;
  padding: 2px;
`;

const TagInput = styled(PlainInput)`
  &,
  &:focus {
    border: none;
  }

  ${InputWrapper}.has-items > & {
    border: 0.5px solid ${({ theme }) => theme.colors.outline};
  }
`;

const ChipList = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 2px;
  gap: 2px;
`;

interface TagsInputProps {
  name?: string;
  id?: string;
  value: string[];
  suggestions?: string[];
  onChange?: (value: string[]) => void;
  className?: string;
}

export default function TagsInput({
  name,
  id,
  value,
  suggestions,
  onChange = noop,
  className,
}: PropsWithRef<TagsInputProps>) {
  const [inputVal, setInputVal] = useState('');
  const onInputChange = useCallback((event: React.FormEvent<HTMLInputElement>) => {
    setInputVal(event.currentTarget.value);
  }, []);

  const pushTag = useCallback(
    (newTag: string) => {
      if (!value.includes(newTag)) {
        onChange([...value, newTag]);
      }
    },
    [onChange, value],
  );

  const removeTag = useCallback(
    (oldTag: string) => {
      if (value.includes(oldTag)) {
        onChange(value.filter((tag) => tag !== oldTag));
      }
    },
    [onChange, value],
  );

  const onInputKeyPress = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        pushTag(event.currentTarget.value);
        setInputVal('');
      }
    },
    [pushTag],
  );

  return (
    <Wrapper className={className}>
      <InputWrapper className={value.length > 0 ? 'has-items' : undefined}>
        <TagInput name={name} id={id} value={inputVal} onChange={onInputChange} onKeyPress={onInputKeyPress} />
        {value.length > 0 && (
          <ChipList>
            {value.map((tag) => (
              <TagChip key={tag} value={tag} action="-" onAction={() => removeTag(tag)} />
            ))}
          </ChipList>
        )}
      </InputWrapper>
      {suggestions && (
        <ChipList>
          {suggestions.map((tag) => (
            <TagChip key={tag} value={tag} action="+" onAction={() => pushTag(tag)} />
          ))}
        </ChipList>
      )}
    </Wrapper>
  );
}
