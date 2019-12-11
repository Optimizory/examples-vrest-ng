var mongo = require('mongodb'),
  _ = require('underscore');

var Server = mongo.Server,
  Db = mongo.Db,
  ObjectID = mongo.ObjectID;

var server = new Server('localhost', 27017, {
  auto_reconnect: true
});
var dbName = process.env.DB || 'contactdb';
db = new Db(dbName, server, {
  safe: true
});

db.open(function (err, db) {
  if (!err) {
    console.log("Connected to '" + dbName + "' database");
    db.listCollections({name: 'contacts'}).next(function (err, collection) {
      if (!collection) {
        console.log("The 'contacts' collection doesn't exist. Creating it with sample data...");
        populateDB();
      }
    });
  }
});

exports.rePopulateDB = function (req, res) {
  db.dropDatabase(function (err, done) {
    if (!err) {
      populateDB(function (err, result) {
        if (err) {
          res.send(400, {
            'error': 'An error has occurred'
          });
        } else {
          res.json(result);
        }
      });
    } else {
      res.send(400, {
        'error': 'An error has occurred'
      });
    }
  });
};

exports.findById = function (req, res) {
  var id = req.params.id;
  console.log('Retrieving contact: ' + id);
  db.collection('contacts').findOne({
    '_id': new ObjectID(id)
  }, function (err, item) {
    if (err) {
      res.send(400, {
        'error': 'An error has occurred'
      });
    } else {
      if (item) {
        res.json(item);
      } else {
        res.send(400, {
          'error': 'Contact with id "' + id + '" not found.'
        });
      }
    }
  });
};

exports.findAll = function (req, res) {
  db.collection('contacts', function (err, collection) {
    collection.find().sort({
      'createdOn': 1
    }).toArray(function (err, items) {
      res.json(items);
    });
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

  if (_.isEmpty(errors)) {
    return true;
  }
  return errors;
};

exports.addcontact = function (req, res) {
  var contact = req.body;
  contact.createdOn = new Date();
  console.log('Adding contact: ' + JSON.stringify(contact));
  db.collection('contacts', function (err, collection) {
    var isValid = isValidContact(contact);
    if (isValid === true) {
      collection.insert(contact, {
        safe: true
      }, function (err, result) {
        if (err) {
          res.send(400, {
            'error': 'An error has occurred'
          });
        } else {
          console.log('Success: ' + JSON.stringify(result.ops[0]));
          res.send(result.ops[0]);
        }
      });
    } else {
      res.send(400, {
        errors: isValid
      });
    }
  });
}

exports.updatecontact = function (req, res) {
  var id = req.params.id;
  var contact = req.body;
  delete contact._id;
  console.log('Updating contact: ' + id);
  db.collection('contacts', function (err, collection) {
    var isValid = isValidContact(contact);
    if (isValid === true) {
      collection.update({
        '_id': new ObjectID(id)
      }, contact, function (err, result) {
        if (err) {
          console.log('Error updating contact: ' + err);
          res.send(400, {
            'error': 'An error has occurred'
          });
        } else {
          if (result && result.result && result.result.n) {
            console.log('' + result + ' document(s) updated');
            res.send(contact);
          } else {
            res.send(400, {
              'error': 'Contact with id "' + id + '" not found.'
            });
          }
        }
      });
    } else {
      res.send(400, {
        errors: isValid
      });
    }
  });
}

exports.deletecontact = function (req, res) {
  var id = req.params.id;
  console.log('Deleting contact: ' + id);
  db.collection('contacts', function (err, collection) {
    collection.remove({
      '_id': new ObjectID(id)
    }, function (err, result) {
      if (err) {
        res.send(400, {
          'error': 'An error has occurred - ' + err
        });
      } else {
        if (result && result.result && result.result.n) {
          console.log('' + result + ' document(s) deleted');
          res.send(req.body);
        } else {
          res.send(400, {
            'error': 'Contact with id "' + id + '" not found.'
          });
        }
      }
    });
  });
}

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function (next) {

  var contacts = [{
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

  db.collection('contacts', function (err, collection) {
    collection.insert(contacts, {
      safe: true
    }, function (err, result) {
      if(!err) console.log("Sample data inserted.");
      if (next) {
        next(err, result);
      }
    });
  });

};