const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

let collName = "contacts";

db.defaults({ contacts: [] })
  .write();

module.exports = {
  _generateId(){
    return [...Array(10)].map(i=>(~~(Math.random()*36)).toString(36)).join('');
  },

  listRecords(next){
    db.read(); //re-sync the data from file system
    let collection = db.get(collName)
      .sortBy("createdOn")
      .value();
    next(null, collection);
  },

  createRecords(records, next){
    db.read(); //re-sync the data from file system
    for(let record of records){
      if(!record._id){
        record._id = this._generateId();
      }
    }
    db.set(collName, records)
      .write();
    next(null, records);
  },

  createRecord(record, next){
    db.read(); //re-sync the data from file system
    record._id = this._generateId();
    db.get(collName)
      .push(record)
      .write();
    next(null, record);
  },

  updateRecord(id, changes, next){
    db.read(); //re-sync the data from file system
    let record = db.get(collName)
      .find({_id: id})
      .value();
    if(record){
      db.get(collName)
      .find({_id: id})
      .assign(changes)
      .write();
    }
    next(null, record);
  },

  readRecord(id, next){
    db.read(); //re-sync the data from file system
    let record = db.get(collName)
      .find({_id: id})
      .value();
    return next(null, record);
  },

  deleteRecord(id, next){
    db.read(); //re-sync the data from file system
    let record = db.get(collName)
      .find({_id: id})
      .value();
    if(record){
      db.get(collName)
        .remove({_id: id})
        .write();
    }
    next(null, record);
  },

  clearDB(next){
    db.read(); //re-sync the data from file system
    db.get(collName)
      .remove({})
      .write();
    next(null);
  }
}