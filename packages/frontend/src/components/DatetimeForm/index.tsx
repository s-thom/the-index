import { useState, useEffect } from 'react';
import { PlainInput } from '../PlainComponents';

interface DatetimeFormProps {
  date?: Date;
  onDateChange?: (date?: Date) => void;
  name?: string;
}

export default function DatetimeForm({ date, name, onDateChange }: DatetimeFormProps) {
  const [dateValue, setDateValue] = useState('');
  const [prefix] = useState(name || Math.floor(Math.random() * 100).toString());

  function onDateInputChange(event: React.FormEvent<HTMLInputElement>) {
    const { value } = event.currentTarget;
    if (!value) {
      setDateValue('');
      if (onDateChange) {
        onDateChange(undefined);
      }
    }

    const match = value.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (!match) {
      // eslint-disable-next-line no-console
      console.warn('Bad value for date input', value);
      return;
    }

    const year = parseInt(match[1]!, 10);
    const month = parseInt(match[2]!, 10) - 1;
    const day = parseInt(match[3]!, 10);

    setDateValue(value);
    if (onDateChange) {
      onDateChange(new Date(year, month, day));
    }
  }

  useEffect(() => {
    if (date) {
      // Set date and time values
      setDateValue(
        `${date.getFullYear().toString().padStart(4, '0')}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`,
      );
    }
  }, [date]);

  return (
    <div>
      <div>
        <PlainInput
          name={`${prefix}-date`}
          placeholder="Date"
          type="date"
          value={dateValue}
          onChange={onDateInputChange}
        />
      </div>
    </div>
  );
}
