import React from "react";
import ReactDOM from "react-dom";
import LoadingPage from ".";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<LoadingPage />, div);
  ReactDOM.unmountComponentAtNode(div);
});
