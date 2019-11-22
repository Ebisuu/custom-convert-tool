import React from "react";
import "../App.css";
import Sidebar from "../components/sidebar";

export default function HomePage(props) {
  let clients = props.clients;
  return (
    <div className="app">
      <Sidebar clients={clients} />
      <div className="main-content">
        <h1>Select a Client To begin</h1>
      </div>
    </div>
  );
}
