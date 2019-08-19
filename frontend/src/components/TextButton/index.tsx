import React, { ButtonHTMLAttributes, DOMAttributes } from "react";
import "./index.css";
import { LinkDetail } from "../../types";

export default function TextButton(props: ButtonHTMLAttributes<{}>) {
  const propsClone = Object.assign({}, props);
  delete propsClone.children;
  delete propsClone.className;

  const classes = ["TextButton"];
  if (props.className) {
    classes.push(props.className);
  }

  return (
    <button className={classes.join(" ")} {...propsClone}>
      <span className="TextButton-brace">[</span>
      {props.children}
      <span className="TextButton-brace">]</span>
    </button>
  );
}
