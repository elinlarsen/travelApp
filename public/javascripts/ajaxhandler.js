console.log("AJAX Handler initialized");

class ajaxHandler {
  constructor(baseUrl, endpoint) {
    this.BASE_URL = baseUrl;
    this.instance = axios.create({ baseURL: this.BASE_URL });
    this.endpoint = endpoint;
    this.result = null;
  }

  getAll(clbk) {
    this.instance
      .get(this.endpoint)
      .then(serverRes => clbk(serverRes.data))
      .catch(serverErr => console.log("No data retrieved"));
  }

  getOne(id, clbk) {
    console.log("contacting endpoint " + this.endpoint + "/" + id);
    this.instance.get(this.endpoint + "/" + id).then(serverRes => {
      clbk(serverRes.data);
    });
  }
  //.catch(serverErr => console.log("No data retrieved"));

  createOne(data, clbk) {
    this.instance
      .post(this.endpoint, data)
      .then(serverRes => {
        clbk(serverRes.data);
        console.log(serverRes.data);
      })
      .catch(serverErr => console.log("no data retrieved"));
  }

  deleteOne(id, clbk1, clbk2) {
    this.instance
      .delete(this.endpoint + id)
      .then(serverRes => clbk1(serverRes))
      .catch(serverErr => {
        console.log("No data deleted");
        clbk2(serverErr);
      });
  }

  updateOne(id, data, clbk) {
    this.instance
      .patch(this.endpoint + id, data)
      .then(serverRes => clbk(serverRes.data))
      .catch(serverErr => console.log("No data patched"));
  }
}

/* getFullList(clbk) {

    this.instance.get("/characters").then(serverRes => {
      clbk(serverRes.data);

    }).catch(serverErr => console.log("No data retrieved"));

  }

  getOneRegister(id, clbk) {

    this.instance.get("/characters/" + id).then(serverRes => clbk(serverRes.data)).catch(serverErr => console.log("No data retrieved"));

  }

  createOneRegister(data, clbk) {

    this.instance.post("/characters", data).then(serverRes => clbk(serverRes.data)).catch(serverErr => console.log("No data posted"));

  }

  updateOneRegister(id, data, clbk) {


    this.instance.patch("characters/" + id, data).then(serverRes => clbk(serverRes.data)).catch(serverErr => console.log("No data patched"));

  }

  deleteOneRegister(id, clbk1, clbk2) {

    this.instance.delete("characters/" + id).then(serverRes => clbk1(serverRes)).catch(serverErr => { console.log("No data deleted"); clbk2(serverErr) });

  }
}

 updateOneRegister(id, attribute, value) {
   //const payload = {};
   //payload[attribute] = value;
   this.instance.patch("characters/" + id, { [attribute]: value }).then(serverRes => console.log(serverRes.data)).catch(serverErr => console.log("No data patched"));
 } 

*/
