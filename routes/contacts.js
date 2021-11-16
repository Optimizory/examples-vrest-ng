var db = require("../lib/db"),
  _ = require('underscore');

var sendError = function(res, error){
  res.status(400);
  res.json({
    'error': error
  });
};

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDBIfNotExists = function(next){
  db.listRecords(function(err, result){
    if(!result || result.length === 0){
      populateDB(next);
    } else if(next){
      next(result);
    }
  });
};

var populateDB = function (next) {
  db.createRecords(sampleData, function(err, result){
    if(!err) console.log("Sample data inserted.");
    if (next) {
      next(err, result);
    }
  })
};

var sampleData = [
  {
    _id: "5de0bf804e576dc4e5f4b984",
    name: "Dheeraj Kumar Aggarwal",
    email: "dheeraj.aggarwal@optimizory.com",
    designation: "Engineering Manager",
    organization: "Optimizory Technologies Pvt. Ltd.",
    country: "India",
    aboutMe: "Passionate to learn and innovate new ideas and do every piece of work with a degree of excellence and try best to bring ideas into life. My hobbies are Yoga and Kalaripayattu. I am currently working on vREST NG (https://vrest.io).",
    linkedInId: "aggarwaldheeraj",
    githubId: "dheerajaggarwal",
    facebookId: "dheeraj.aggarwal",
    twitterId: "dheerajaggarwal",
    createdOn: "2020-01-03T10:35:11.122Z"
  },
  {
    _id: "5de0bf804e5461ede5f4b681",
    name: "Lindsey Okelley",
    email: "lindsey.okelley@example.com",
    designation: "Product Evangelist",
    organization: "Example.com",
    country: "India",
    aboutMe: "This is about me section ...",
    linkedInId: "lindsey.okelley",
    githubId: "lindsey.okelley",
    facebookId: "lindsey.okelley",
    twitterId: "lindsey.okelley",
    createdOn: new Date()
  },
  {
    _id: "5de0bf804e577dc5e5e4b082",
    name: "Lorette Cuffie",
    email: "lorette.cuffie@example.com",
    designation: "Software Engineer",
    organization: "Example.com",
    country: "US",
    aboutMe: "This is about me section ...",
    githubId: "",
    facebookId: "lorette.cuffie",
    twitterId: "lorette.cuffie",
    createdOn: new Date()
  },
  {
    _id: "5de0bf804e5c11c425f3b578",
    name: "Nila Ready",
    email: "nila.ready@example.com",
    designation: "Sr. Software Engineer",
    organization: "Example.com",
    country: "India",
    aboutMe: "About me Section ...",
    githubId: "nila.ready",
    facebookId: "",
    twitterId: "nila.ready",
    createdOn: new Date()
  }
];

populateDBIfNotExists();

exports.rePopulateDB = function (req, res) {
  db.clearDB(function(err){
    if (!err) {
      populateDB(function (err, result) {
        if (err) {
          sendError(res, 'An error has occurred');
        } else {
          res.json(result);
        }
      });
    } else {
      sendError(res, 'An error has occurred');
    }
  });
};

exports.findById = function (req, res) {
  var id = req.params.id;
  console.log('Retrieving contact: ' + id);
  db.readRecord(id, function(err, item){
    if (err) {
      sendError(res, 'An error has occurred');
    } else {
      if (item) {
        res.json(item);
      } else {
        sendError(res, 'Contact with id "' + id + '" not found.');
      }
    }
  });
};

exports.findAll = function (req, res) {
  db.listRecords(function(err, items){
    if (err) {
      sendError(res, 'An error has occurred');
    } else {
      res.json(items);
    }
  });
};

var isValidContact = function (contact) {
  var errors = {},
    lengthLimit = 35,
    i, count, field;

  var requiredFields = ['name'],
    limitedLengthFields = ['name', 'designation', 'country', 'organization'];

  for (i = 0, count = requiredFields.length; i < count; i++) {
    if (!contact[requiredFields[i]]) {
      errors[requiredFields[i]] = "required field";
    }
  }

  for (i = 0, count = limitedLengthFields.length; i < count; i++) {
    field = limitedLengthFields[i];
    if (!errors[field] && contact[field] && contact[field].length > lengthLimit) {
      errors[field] = "field length cannot be greater than " + lengthLimit;
    }
  }

  if(contact.email){
    if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(contact.email)){
      errors["email"] = "Email Id is not valid.";
    }
  }

  if (_.isEmpty(errors)) {
    return true;
  }
  return errors;
};

exports.addcontact = function (req, res) {
  var contact = req.body;
  contact.createdOn = new Date();
  
  var isValid = isValidContact(contact);
  if (isValid === true) {
    db.createRecord(contact, function(err, result){
      if (err) {
        sendError(res, 'An error has occurred');
      } else {
        res.send(result);
      }
    });    
  } else {
    res.status(400);
    res.json({
      errors: isValid
    });
  }
};

exports.updatecontact = function (req, res) {
  var id = req.params.id;
  var contact = req.body;
  delete contact._id;
  console.log('Updating contact: ' + id);
  var isValid = isValidContact(contact);
  if (isValid === true) {
    db.updateRecord(id, contact, function(err, result){
      if (err) {
        sendError(res, 'An error has occurred');
      } else {
        if (result) {
          res.json(result);
        } else {
          sendError(res, 'Contact with id "' + id + '" not found.');
        }
      }
    });
  } else {
    res.status(400);
    res.json({
      errors: isValid
    });
  }
};

exports.deletecontact = function (req, res) {
  var id = req.params.id;
  console.log('Deleting contact: ' + id);
  db.deleteRecord(id, function(err, result){
    if (err) {
      sendError(400, 'An error has occurred - ' + err);
    } else {
      if (result) {
        console.log('Document deleted');
        res.send({});
      } else {
        sendError(res, 'Contact with id "' + id + '" not found.');
      }
    }
  });
};