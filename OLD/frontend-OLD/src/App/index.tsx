import React from "react";
import "./index.css";
import { TokenContextProvider } from "../context/TokenContext";
import Header from "../components/Header";
import BodyArea from "../components/BodyArea";

export default function App() {
  return (
    <div className="App">
      <TokenContextProvider>
        <Header />
        <BodyArea />
      </TokenContextProvider>
    </div>
  );
}
