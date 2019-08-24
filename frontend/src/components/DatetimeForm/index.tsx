import React, { useState, useEffect } from "react";
import "./index.css";
import { deduplicate } from "../../util/array";
import TextButton from "../TextButton";

interface DatetimeFormProps {
  date?: Date;
  onDateChange?: (date?: Date) => void;
  name?: string;
}

export default function DatetimeForm({
  date,
  name,
  onDateChange
}: DatetimeFormProps) {
  const [timeValue, setTimeValue] = useState("");
  const [dateValue, setDateValue] = useState("");
  const [prefix] = useState(name || Math.floor(Math.random() * 100).toString());

  function onDateInputChange(event: React.FormEvent<HTMLInputElement>) {
    setDateValue(event.currentTarget.value);

    if (timeValue && onDateChange) {
      onDateChange(new Date(`${event.currentTarget.value}T${timeValue}`));
    }
  }

  function onTimeInputChange(event: React.FormEvent<HTMLInputElement>) {
    setTimeValue(event.currentTarget.value);

    if (dateValue && onDateChange) {
      onDateChange(new Date(`${dateValue}T${event.currentTarget.value}`));
    }
  }

  useEffect(() => {
    if (date) {
      // Set date and time values
      setDateValue(
        date
          .getFullYear()
          .toString()
          .padStart(4, "0") +
          "-" +
          (date.getMonth() + 1).toString().padStart(2, "0") +
          "-" +
          date
            .getDate()
            .toString()
            .padStart(2, "0")
      );
      setTimeValue(
        date
          .getHours()
          .toString()
          .padStart(2, "0") +
          ":" +
          date
            .getMinutes()
            .toString()
            .padStart(2, "0") +
          ":" +
          date
            .getSeconds()
            .toString()
            .padStart(2, "0")
      );
    }
  }, [date]);

  return (
    <div className="DatetimeForm">
      <div className="DatetimeForm-input-container">
        <input
          className="DatetimeForm-input"
          name={`${prefix}-date`}
          placeholder="Date"
          type="date"
          value={dateValue}
          onChange={onDateInputChange}
        />
      </div>
      <div className="DatetimeForm-input-container">
        <input
          className="DatetimeForm-input"
          name={`${prefix}-time`}
          placeholder="Time"
          type="time"
          value={timeValue}
          onChange={onTimeInputChange}
        />
      </div>
    </div>
  );
}
