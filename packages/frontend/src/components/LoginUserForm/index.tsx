import { useState } from 'react';
import './index.css';

interface LoginUserFormProps {
  onSubmit: (name: string) => void;
}

export default function LoginUserForm({ onSubmit }: LoginUserFormProps) {
  const [name, setName] = useState('');

  function onInputChange(event: React.FormEvent<HTMLInputElement>) {
    setName(event.currentTarget.value);
  }

  function onInputKeyPress(event: React.KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      onSubmit(name);
    }
  }

  return (
    <div className="LoginUserForm">
      <input
        className="LoginUserForm-name-input"
        id="LoginUserForm-user"
        name="LoginUserForm-user"
        placeholder="Name"
        value={name}
        onChange={onInputChange}
        onKeyPress={onInputKeyPress}
      />
    </div>
  );
}
