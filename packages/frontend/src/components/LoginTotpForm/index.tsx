import { useState } from 'react';

interface LoginTotpFormProps {
  onSubmit: (code: string) => void;
}

export default function LoginTotpForm({ onSubmit }: LoginTotpFormProps) {
  const [code, setCode] = useState('');

  function onInputChange(event: React.FormEvent<HTMLInputElement>) {
    setCode(event.currentTarget.value);
  }

  function onInputKeyPress(event: React.KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      onSubmit(code);
    }
  }

  return (
    <div>
      <h4>Enter a code from your authenticator app</h4>
      <input
        id="LoginTotpForm-code"
        name="LoginTotpForm-code"
        placeholder="Code"
        value={code}
        onChange={onInputChange}
        onKeyPress={onInputKeyPress}
        autoComplete="off"
      />
    </div>
  );
}
