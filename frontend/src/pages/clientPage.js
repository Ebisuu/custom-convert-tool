import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import Sidebar from "../components/sidebar/sidebar";
import Audience from "../components/audience";
import Loader from "../components/loader/loader";

export default function ClientPage(props) {
  let { clientId } = useParams();
  let clients = props.clients;
  let client = clients.find(client => client.id == clientId);

  const [audiences, setAudiences] = useState([]);
  const [loaded, setLoaded] = useState(false);

  async function clientAudiences() {
    try {
      const res = await axios.get(
        "http://localhost:5000/audiences/" + clientId
      );
      setAudiences(res.data);
      setLoaded(true);
    } catch (err) {
      console.log("error caught", err);
    }
  }
  useEffect(() => {
    setLoaded(false);
    clientAudiences();
  }, [clientId]);

  function renderAudiences() {
    return audiences.map(audience => (
      <Audience
        key={audience.audience_id}
        clientId={clientId}
        name={audience.audience_name}
        id={audience.audience_id}
        settings={audience.firing_rule.OR[0].AND}
        clone={clone}
      ></Audience>
    ));
  }
  async function clone(clientId, audienceId) {
    try {
      const cloneRequest = await axios.post(
        "http://localhost:5000/clone/" + clientId + "/" + audienceId + "/"
      );
      setAudiences([...audiences, cloneRequest.data]);
    } catch (err) {
      console.log(
        "Err happened trying to clone",
        "http://localhost:5000/clone/" + clientId + "/" + audienceId,
        err
      );
    }
  }
  return (
    <div className="app">
      <Sidebar clients={clients} />
      {client && clients && loaded && (
        <div className="main-content">
          <Fragment>
            <h1>
              {client.name} - <span className="client-id">{client.id}</span>
            </h1>
            <div className="content-container">{renderAudiences()}</div>
          </Fragment>
        </div>
      )}
      {!loaded && <Loader />}
    </div>
  );
}
