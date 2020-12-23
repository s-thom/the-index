import styled from 'styled-components';
import { noop } from '../../util/functions';
import TextButton from '../TextButton';

const Wrapper = styled.div`
  border: 0.5px solid ${({ theme }) => theme.colors.outline};
  border-radius: 1px;
  padding: 2px;
  display: flex;
  gap: 2px;
  align-items: center;
  opacity: 0.85;

  &:hover {
    opacity: 1;
  }
`;

const TagText = styled.span`
  display: inline-block;
  overflow-wrap: anywhere;
`;

interface TagChipProps {
  value: string;
  action?: string;
  onAction?: () => void;
  className?: string;
}

export default function TagChip({ value, action, onAction = noop, className }: TagChipProps) {
  return (
    <Wrapper className={className}>
      {action && <TextButton onClick={onAction}>{action}</TextButton>}
      <TagText>{value}</TagText>
    </Wrapper>
  );
}
