import React, { useEffect } from "react";
import Client from "../client";
import { Link } from "react-router-dom";
import "./index.css";

export default function Sidebar(props) {
  let clients = props.clients;
  useEffect(() => {}, [clients]);

  function renderClients() {
    return clients.map(client => {
      return (
        <Link to={"/client/" + client.id} className="client-link link">
          <Client name={client.name} id={client.id}></Client>
        </Link>
      );
    });
  }
  return (
    <div className="sidebar">
      <h1>Clients</h1>
      {clients && clients.length > 0 && <div>{renderClients()}</div>}
      {!clients && <p>Loading</p>}
    </div>
  );
}
