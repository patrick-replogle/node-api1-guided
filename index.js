const express = require("express");
const db = require("./data/hubs-model.js");

const server = express();

server.use(express.json());

server.listen(4000, () => {
  console.log("*** listening on port 4000 ***");
});

//hello world server response
server.get("/", (req, res) => {
  res.send("hello world");
});

//how send date back to user
server.get("/now", (req, res) => {
  res.send(new Date().toISOString());
});

//retrieve info from the database
server.get("/hubs", (req, res) => {
  db.find()
    .then(hubs => {
      res.status(200).json(hubs);
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        message: err
      });
    });
});

//get hub by id
server.get("/hubs/:id", (req, res) => {
  const { id } = req.params;

  db.findById(id)
    .then(hub => {
      if (hub) {
        res.status(200).json(hub);
      }
    })
    .catch(err => {
      res.status(500).json({ success: false, message: err });
    });
});

//post new hub
server.post("/hubs", (req, res) => {
  const newHub = req.body;

  if (!newHub.name) {
    res.status(400).json({ errMessage: "pleace provide a hub name" });
  } else {
    db.add(newHub)
      .then(hub => {
        res.status(201).json({ success: true, hub });
      })
      .catch(err => {
        res.status(500).json({ success: false, err });
      });
  }
});

//delete hub
server.delete("/hubs/:id", (req, res) => {
  const { id } = req.params;

  db.remove(id)
    .then(deletedHub => {
      if (deletedHub) {
        res.status(204).end();
      } else {
        res.status(404).json({ message: "hub id not found" });
      }
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        message: err
      });
    });
});

//update hub
server.put("/hubs/:id", (req, res) => {
  const { id } = req.params;
  const updatedHub = req.body;

  db.update(id, updatedHub)
    .then(updated => {
      if (updated) {
        res.status(200).json({ success: true, updated });
      } else {
        res.status(404).json({ success: false, message: "id not found" });
      }
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        message: err
      });
    });
});
