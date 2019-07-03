class dbHandler {
  constructor(model) {
    this.model = model;
  }

  createOne(data, clbk) {
    const schema = this.model["schema"]["obj"];
    const schemaKeys = Object.keys(schema);
    console.log("------------------------------");
    let newDocument = {};
    schemaKeys.forEach(key => {
      newDocument[key] = data[key];
    });

    this.model
      .create(newDocument)
      .then(dbres => {
        console.log("this seems to be working and the result is " + dbres);
        if (clbk) clbk(dbres);
      })
      .catch(err => console.log("this is not working :", err));
  }

  getOne(data, clbk) {
    this.model
      .findOne(data)
      .populate("steps")
      .then(res => clbk(res))
      .catch(err => console.log(err));
  }

  getOneById(id, clbk) {
    this.model
      .findById(id)
      .then(res => {
        clbk(res);
      })
      .catch(err => console.log(err));
  }

  getAll(clbk) {
    this.model
      .find({})
      .then(res => clbk(res))
      .catch(err => console.log(err));
  }

  filter(field, value, clbk) {
    const filterObject = {};
    filterObject[field] = value;
    this.model
      .find(filterObject)
      .then(res => {
        clbk(res);
      })
      .catch(err => console.log(err));
  }

  updateOne(filterObject, data, clbk) {
    this.model
      .findOneAndUpdate(filterObject, data)
      .then(dbres => {
        clbk(dbres);
        console.log("patching");
      })
      .catch(err => console.log(err));
  }

  deleteOne(filterObject, clbk) {
    console.log(filterObject);
    this.model
      .findOneAndRemove(filterObject)
      .then(res => {
        clbk(res);
      })
      .catch(err => console.log(err));
  }
}

module.exports = dbHandler;
