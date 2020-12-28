import userEvent from '@testing-library/user-event';
import Pagination from '..';
import { render, screen } from '../../../util/test-utils';

describe('Pagination', () => {
  it('should render', () => {
    render(<Pagination page={3} numPages={5} />);
    const first = screen.getByTitle('First');
    expect(first).toBeInTheDocument();
    expect(first).toBeEnabled();
    const prev = screen.getByTitle('Previous');
    expect(prev).toBeInTheDocument();
    expect(prev).toBeEnabled();
    const next = screen.getByTitle('Next');
    expect(next).toBeInTheDocument();
    expect(next).toBeEnabled();
    const last = screen.getByTitle('Last');
    expect(last).toBeInTheDocument();
    expect(last).toBeEnabled();

    const one = screen.getByTitle('1');
    expect(one).toBeInTheDocument();
    expect(one).toBeEnabled();
    const two = screen.getByTitle('2');
    expect(two).toBeInTheDocument();
    expect(two).toBeEnabled();
    const three = screen.getByTitle('3');
    expect(three).toBeInTheDocument();
    expect(three).toBeEnabled();
    const four = screen.getByTitle('4');
    expect(four).toBeInTheDocument();
    expect(four).toBeEnabled();
    const five = screen.getByTitle('5');
    expect(five).toBeInTheDocument();
    expect(five).toBeEnabled();
  });

  it('should disable buttons when at the limit of the pagination', () => {
    render(<Pagination page={1} numPages={1} />);
    const first = screen.getByTitle('First');
    expect(first).toBeInTheDocument();
    expect(first).toBeDisabled();
    const prev = screen.getByTitle('Previous');
    expect(prev).toBeInTheDocument();
    expect(prev).toBeDisabled();
    const next = screen.getByTitle('Next');
    expect(next).toBeInTheDocument();
    expect(next).toBeDisabled();
    const last = screen.getByTitle('Last');
    expect(last).toBeInTheDocument();
    expect(last).toBeDisabled();

    const one = screen.getByTitle('1');
    expect(one).toBeInTheDocument();
    expect(one).toBeEnabled();
  });

  it('should call the callbacks', () => {
    const onChange = jest.fn();

    render(<Pagination page={3} numPages={5} onPageSelect={onChange} />);
    const first = screen.getByTitle('First');
    const prev = screen.getByTitle('Previous');
    const next = screen.getByTitle('Next');
    const last = screen.getByTitle('Last');

    const one = screen.getByTitle('1');
    const two = screen.getByTitle('2');
    const three = screen.getByTitle('3');
    const four = screen.getByTitle('4');
    const five = screen.getByTitle('5');

    userEvent.click(first);
    expect(onChange).toHaveBeenLastCalledWith(1);
    userEvent.click(prev);
    expect(onChange).toHaveBeenLastCalledWith(2);
    userEvent.click(next);
    expect(onChange).toHaveBeenLastCalledWith(4);
    userEvent.click(last);
    expect(onChange).toHaveBeenLastCalledWith(5);
    userEvent.click(one);
    expect(onChange).toHaveBeenLastCalledWith(1);
    userEvent.click(two);
    expect(onChange).toHaveBeenLastCalledWith(2);
    userEvent.click(three);
    expect(onChange).toHaveBeenLastCalledWith(3);
    userEvent.click(four);
    expect(onChange).toHaveBeenLastCalledWith(4);
    userEvent.click(five);
    expect(onChange).toHaveBeenLastCalledWith(5);

    expect(onChange).toHaveBeenCalledTimes(9);
  });
});
