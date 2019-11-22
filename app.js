const CryptoJS = require("crypto");
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const PORT = 5000;
//config
var convertApplicationID = "Add your convert Application ID";
var convertSecret = "add your convert secret key";
const host = "api.convert.com/api/v1/";
let app = express();

app.use(cors());

//Create the request options passed in the axios requests
function createRequestOptions(urlEndpoint, requestType, data) {
  var hashDetails = createConvertHash(
    "https://" + host + urlEndpoint,
    JSON.stringify(data)
  );
  var options = {
    url: "https://" + host + urlEndpoint,
    port: 443,
    method: requestType,
    headers: {
      Authorization: "Convert-HMAC-SHA256 Signature=" + hashDetails.hash,
      Expires: hashDetails.timeStamp,
      "Convert-Application-ID": convertApplicationID
    }
  };
  if (typeof data != "undefined") {
    options.data = data;
  }
  return options;
}

//Create the convert hash needed to authenticate and requests
function createConvertHash(url, RequestBody) {
  var RequestBody = RequestBody || "";
  var ExpiresTimestamp = new Date().getTime() / 1000 + 300; // 5 minutes from now
  var SignString =
    convertApplicationID +
    "\n" +
    ExpiresTimestamp +
    "\n" +
    url +
    "\n" +
    RequestBody;

  var hash = CryptoJS.createHmac("sha256", convertSecret)
    .update(SignString)
    .digest("hex");

  return { timeStamp: ExpiresTimestamp, hash: hash };
}

//---------------------------- GET List of Client's (PROJECTS) ------------------------
app.use("/projects", function(req, res) {
  let endpoint = "projects/";
  var options = createRequestOptions(endpoint, "GET");
  const request = axios(options)
    .then(data => {
      console.log(data.data);
      var simple = [];
      var projectsJSON = JSON.parse(JSON.stringify(data.data));
      for (var i = 0; i < projectsJSON.length; i++) {
        console.log(projectsJSON[i].name, projectsJSON[i].id);
        simple.push({
          name: projectsJSON[i].name,
          id: projectsJSON[i].id
        });
      }
      // res.json(data.data)
      res.json(JSON.stringify(simple));
    })
    .catch(error => {
      console.error("Get Projects/Client Error:", error.response.data);
    });
});

//---------------------- GET Audiences for a Client ---------------
app.use("/audiences/:id", function(req, res) {
  console.log("get audiences for :", req.params.id);
  //project id
  var id = req.params.id;
  let endpoint = "audiences/" + id;
  var options = createRequestOptions(endpoint, "POST");
  const request = axios(options)
    .then(data => {
      // console.log(`statusCode: ${res.statusCode}`)
      console.log(data.data);
      res.json(data.data);
    })
    .catch(error => {
      console.error("Get Audience Error:", error.response.data);
    });
});

//----------------------------- Create a new audience for a client --------------------------
app.post("/createAudience/:projectid", (req, res) => {
  console.log("try to create audience");
  let endpoint = "audiences/add/" + req.params.projectid;

  //make this section dynamic aka retrieve create audience object either from query values, or body of request
  var newAudience = {
    audience_name: "Luke Test Audience",
    is_segment: false
  };
  options = createRequestOptions(endpoint, "POST", newAudience);
  axios(options)
    .then(response => {
      console.log("New audience response:", response.data);
      res.json(response.data);
    })
    .catch(error => {
      // console.error("Create audience error:", error.response.data)
      console.error("Create audience error:", error.response);
    });
});

//---------------------------------- CLONE Audience ---------------------------------------
app.post("/clone/:projectid/:audienceid", function(req, res) {
  let endpoint =
    "audiences/get/" + req.params.projectid + "/" + req.params.audienceid;
  var options = createRequestOptions(endpoint, "GET");

  //Retrieve the original audience
  axios(options)
    .then(response => {
      cloneAudience(response.data);
    })
    .catch(error => {
      console.error("Retrieving audience to clone error:", error.response.data);
      res.json(error.response.data);
    });

  const cloneAudience = original => {
    let endpoint = "/audiences/add/" + req.params.projectid;
    //remove the existing audience id
    delete original.audience_id;
    //Add clone to the name of the audience
    original.audience_name += " clone";
    // console.log("audience to send to convert", original);
    console.log(
      "audience to send to convert",
      JSON.stringify(original.firing_rule)
    );
    //change options to have new URL and a post request as we are going to create a new audience
    options = createRequestOptions(endpoint, "POST", original);
    return axios(options)
      .then(response => {
        console.log("Clone audience response:", response.data);
        res.json(response.data);
      })
      .catch(error => {
        console.error("Cloning original audience error:", error.response.data);
        res.json(error.response.data);
      });
  };
});

//--------------------------------------------------- GET CONVERSIONS ---------------------------------------------------
app.use("/goals/:project_id/", (req, res) => {
  let endpoint = "/goals/" + req.params.project_id + "";
  let options = createRequestOptions(endpoint, "POST");
  axios(options)
    .then(response => {
      //If someone gives test number then filter conversions in that client for specified test
      if (typeof req.query.testNumber != "undefined") {
        let testNumberRegex = new RegExp(".*_" + req.query.testNumber, "g");
        return res.json(
          response.data.filter(conv => conv.goal_name.match(testNumberRegex))
        );
      }
      //otherwise return all conversions in a client
      else {
        return res.json(response.data);
      }
    })
    .catch(error => {
      console.log("Get Conversions Error:", error.response.data);
    });
});

app.listen(PORT, () => console.log("sucessfully connected to server: ", PORT));
