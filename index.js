var express = require("express");
var bodyParser = require("body-parser");
var nforce = require("nforce");
const cors = require("cors");


var app = express();
app.use(cors());
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

//nforce setup - change clientId, clientSecret, redirectUri(for not username/password flow) as per your org/app
var org = nforce.createConnection({
  clientId: "3MVG9kBt168mda_95Y.3Re3isgTYvQlBLQ8fYqWmaSvnVOa877LkLz87J5siJNiZdj628Mg6TMTWJ5JUiz3L8",
  clientSecret: "BF94C6C8B6EA8E23DC09E2DF850CB6805E14945D408E24A98937EA694B1401A3",
  redirectUri: "https://albertdanl-dev-ed.lightning.force.com",
  apiVersion: "v37.0",
  environment: "production",
  mode: "single"
});

// Initialize the app.
var server = app.listen(process.env.PORT || 8080, function () {
  var port = server.address().port;
  console.log("App now running on port", port);
});

// CONTACTS API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

/*  "/contacts"
 *    GET: finds all contacts
 *    POST: creates a new contact
 */

//change username, password+securitytoken as per your org
app.get("/contacts", function(req, res) {
  org.authenticate({ username: 'a.danielqz@gmail.com.dev', password: /*pass*/ }, function(err, oauth){
    if(err) {
      console.log('Error: ' + err.message);
    } else {
      console.log('Access Token: ' + oauth.access_token);
      org.query({query:"select id,firstName,lastName from contact"}, function (err, resp) {
        if(err) throw err;
        if(resp.records && resp.records.length){
          res.send(resp.records);
        }
      });
    }
  });
});

app.get("/Opportunities", function(req, res) {
  org.authenticate({ username: 'a.danielqz@gmail.com.dev', password: /*pass*/ }, function(err, oauth){
    if(err) {
      console.log('Error: ' + err.message);
    } else {
      console.log('Access Token: ' + oauth.access_token);
      org.query({query:"select id, LastModifiedDate, Name, Amount, StageName from Opportunity"}, function (err, resp) {
        if(err) throw err;
        if(resp.records && resp.records.length){
          res.send(resp.records);
        }
      });
    }
  });
});

app.get("/Products", function(req, res) {
  org.authenticate({ username: 'a.danielqz@gmail.com.dev', password: /*pass*/ }, function(err, oauth){
    if(err) {
      console.log('Error: ' + err.message);
    } else {
      console.log('Access Token: ' + oauth.access_token);
      org.query({query:"select id, LastModifiedDate, Name, Image_Product__c from Product2"}, function (err, resp) {
        if(err) throw err;
        if(resp.records && resp.records.length){
          res.send(resp.records);
        }
      });
    }
  });
});

app.post("/contacts", function(req, res) {
  var newContact = req.body;

  if (!(req.body.lastname)) {
    handleError(res, "Invalid user input", "Must provide a last name.", 400);
  }

  console.log('Attempting to insert contact');
  var ct = nforce.createSObject('Contact', newContact);
  org.insert({ sobject: ct }, function(err, resp) {
    if(err) {
      console.error('--> unable to insert contact');
      console.error('--> ' + JSON.stringify(err));
    } else {
      console.log('--> contact inserted');
      res.send(resp);
    }
  });

});

/*  "/contacts/:id"
 *    GET: find contact by id
 *    PUT: update contact by id
 *    DELETE: deletes contact by id
 */

app.get("/contacts/:id", function(req, res) {
  console.log('attempting to get the contact');
  org.getRecord({ type: 'contact', id: req.params.id }, function(err, ct) {
    if(err) {
      console.error('--> unable to retrieve lead');
      console.error('--> ' + JSON.stringify(err));
    } else {
      console.log('--> contact retrieved');
      res.status(201).send(ct);
    }
  });
});

app.put("/contacts/:id", function(req, res) {
  var contact = req.body;

  if (!(req.body.lastname)) {
    handleError(res, "Invalid user input", "Must provide a last name.", 400);
  }

  console.log('Attempting to update contact');
  var ct = nforce.createSObject('Contact', {
    id : req.params.id,
    firstname : contact.firstname,
    lastname : contact.lastname,
    email : contact.email,
    mobilephone : contact.mobilephone,
    phone : contact.phone,
    mailingstreet : contact.mailingstreet,
    twitter_handle__c : contact.twitter_handle__c
  });
  org.update({ sobject: ct }, function(err, resp) {
    if(err) {
      console.error('--> unable to update contact');
      console.error('--> ' + JSON.stringify(err));
    } else {
      console.log('--> contact updated');
      res.status(204).end();
    }
  });
});

app.delete("/contacts/:id", function(req, res) {
  var contactId = req.params.id;
  console.log('this is' + req.params.id);
  var ct = nforce.createSObject('Contact', {
    id : contactId
  });
  org.delete({sobject : ct}, function(err, ct) {
    if(err) {
      console.error('--> unable to retrieve lead');
      console.error('--> ' + JSON.stringify(err));
    } else {
      console.log('--> contact deleted');
      res.status(204).end();
    }
  });
});