import React from "react";
import ReactDOM from "react-dom";
import LinkDetailPage from ".";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<LinkDetailPage />, div);
  ReactDOM.unmountComponentAtNode(div);
});
