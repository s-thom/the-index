import { ButtonHTMLAttributes } from 'react';
import './index.css';

export default function TextButton({ children, className, ...props }: ButtonHTMLAttributes<{}>) {
  const classes = ['TextButton'];
  if (className) {
    classes.push(className);
  }

  return (
    <button className={classes.join(' ')} type="button" {...props}>
      <span className="TextButton-brace">[</span>
      {children}
      <span className="TextButton-brace">]</span>
    </button>
  );
}
