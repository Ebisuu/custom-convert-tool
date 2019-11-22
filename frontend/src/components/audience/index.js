import React, { useState, useEffect } from "react";
import "./index.css";

export default function Audience(props) {
  const [showDetails, setShowDetails] = useState(false);
  const [audienceDetails, setAudienceDetails] = useState([]);

  function renderAudienceDetails() {
    return (
      audienceDetails.length > 0 &&
      audienceDetails.map(item => {
        console.log("render audinces looop", item);

        return (
          <p className="audience-rule">
            <strong>{item.rule_type}:</strong> {item.rule_name}{" "}
            <span className="spacer" /> {item.matches} -{" "}
            <strong>{item.value}</strong>
          </p>
        );
      })
    );
  }
  function getAudienceInfo() {
    var audienceRules = [];
    props.settings.forEach(element => {
      element.OR_WHEN.forEach(rule => {
        var audienceInfo = {};
        if (typeof rule.rule_type != "undefined") {
          audienceInfo.rule_type = rule.rule_type;
        }
        if (typeof rule.name != "undefined") {
          audienceInfo.rule_name = rule.name;
        }
        if (typeof rule.matching != "undefined") {
          if (rule.matching.negated) {
            audienceInfo.matches = "NOT(" + rule.matching.match_type + ")";
          } else {
            audienceInfo.matches = rule.matching.match_type;
          }
        }
        if (typeof rule.value != "undefined") {
          audienceInfo.value = rule.value;
        }
        audienceRules.push(audienceInfo);
      });
    });
    setAudienceDetails([...audienceDetails, ...audienceRules]);
  }
  useEffect(() => {
    getAudienceInfo();
  }, []);

  return (
    <div className="audience">
      <div className="audience-info">
        <p className="audience-name">{props.name}</p>
        <p className="audience-id">Audience ID: {props.id}</p>
        <div className="audience-actions">
          <i
            className="audience-icon fa fa-info-circle"
            onClick={() => setShowDetails(!showDetails)}
          ></i>
          <i
            className="audience-icon far fa-clone"
            onClick={() => props.clone(props.clientId, props.id)}
          ></i>
        </div>
      </div>
      {showDetails && (
        <div className="audience-details">
          {audienceDetails.length > 0 && renderAudienceDetails()}
        </div>
      )}
    </div>
  );
}
