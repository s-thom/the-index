import React from "react";
import ReactDOM from "react-dom";
import LinkDetailPage from ".";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<LinkDetailPage id="1" />, div);
  ReactDOM.unmountComponentAtNode(div);
});
