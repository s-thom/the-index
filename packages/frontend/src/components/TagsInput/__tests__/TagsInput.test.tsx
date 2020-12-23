import userEvent from '@testing-library/user-event';
import TagsInput from '..';
import { render, screen } from '../../../util/test-utils';

describe('TagsInput', () => {
  it('should allow a user to add a tag by typing', () => {
    const onChange = jest.fn();

    render(<TagsInput value={[]} name="example" onChange={onChange} />);

    const input = screen.getByRole('textbox');
    userEvent.type(input, 'test');
    userEvent.type(input, ' ');

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith(['test']);
    expect(input).toHaveValue('');
  });

  it('should allow a user to add a tag by selecting a suggestion', () => {
    const onChange = jest.fn();

    render(<TagsInput value={[]} name="example" suggestions={['test']} onChange={onChange} />);

    const addButton = screen.getByRole('button');
    userEvent.click(addButton);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith(['test']);
  });

  it('should allow a user to remove a tag by selecting a present value', () => {
    const onChange = jest.fn();

    render(<TagsInput value={['test']} name="example" onChange={onChange} />);

    const removeButton = screen.getByRole('button');
    userEvent.click(removeButton);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith([]);
  });
});
