import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { noop } from '../../util/functions';

export type ChallengeTypes = 'totp';

export interface LoginFormValues {
  name: string;
  code?: string;
}

interface LoginFormProps {
  onSubmit?: (values: LoginFormValues) => void;
  challenge?: ChallengeTypes;
}

export default function LoginForm({ onSubmit = noop, challenge }: LoginFormProps) {
  const { register, handleSubmit } = useForm<LoginFormValues>({
    defaultValues: {
      name: '',
    },
  });

  const submitHandler = useMemo(() => handleSubmit(onSubmit), [handleSubmit, onSubmit]);
  const onInputKeyPress = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        event.stopPropagation();
        submitHandler();
      }
    },
    [submitHandler],
  );

  return (
    <form onSubmit={submitHandler}>
      <div>
        <input
          name="name"
          placeholder="Name"
          ref={register({ required: true })}
          onKeyPress={onInputKeyPress}
          autoComplete="username"
        />
      </div>
      {challenge === 'totp' && (
        <div>
          <h4>Enter a code from your authenticator app</h4>
          <input
            name="code"
            placeholder="Code"
            ref={register({ required: true })}
            onKeyPress={onInputKeyPress}
            autoComplete="one-time-code"
          />
        </div>
      )}
    </form>
  );
}
