import React, { useState, useEffect } from "react";
import axios from "axios";
import Routes from "./Routes";

function App() {
  const [clients, setClients] = useState([]);

  function sortClientsAlphabetically(clients) {
    return clients.sort(function(a, b) {
      var textA = a.name.toUpperCase();
      var textB = b.name.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
  }

  async function getClients() {
    try {
      const res = await axios.get("http://localhost:5000/projects");
      setClients(sortClientsAlphabetically(JSON.parse(res.data)));
    } catch (err) {
      console.log("error caught", err);
    }
  }

  useEffect(() => {
    getClients();
  }, []);

  return(
    <Routes clients={clients}/>
  )
  
}

export default App;
