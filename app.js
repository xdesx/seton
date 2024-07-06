const express = require("express");
const app = express();
const port = 3000;

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

let resHandler = null;
function triggerResHandler(val) {
  if(null !== resHandler) {
    resHandler.send(val);
  }
}

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/api/", function (req, res) {
  db.all("select rowid, * from notes", (err, rows) => {
    res.send({'notes': rows});
  });
});

app.get("/api/:id", function (req, res) {
  const id = req.params.id;
  db.get("select * from notes where rowid=?", id, (err, row) => {
    if(row) {
      res.send({'note': row});
    } else {
      res.status(404);
      res.send('Not Found');
    }
  });
});

app.delete("/api/:id", function (req, res) {
  const id = req.params.id;
  db.run("delete from notes where rowid=?", id, function(err) {
    res.send({'result': {'changes': this.changes}});
  });
});

app.put("/api/", function(req, res) {
  db.serialize(() => {
    const title = req.body.title?? 'No title';
    const content = req.body.content?? '';
    resHandler = res;
    db.run("insert into notes(dateCreated, dateUpdated, title, content) values (datetime('now'), datetime('now'), ?, ?)",
      title, content, function(err){
        res.send({'result': {'id': this.lastID}});
      });
  });
});

app.post("/api/:id", function(req, res) {
  db.serialize(() => {
    let query = "update notes set tag=? where rowid=?";
    db.run(query, req.body.tag?? null, req.params.id, function(err){
      res.send({'result': {'changes': this.changes}});
    });
  });
});

app.patch("/api/:id", function(req, res) {
  db.serialize(() => {
    let query = "update notes set dateUpdated=datetime('now')";
    const qd = [];
    if(req.body.title) {
      query += ", title=?";
      qd.push(req.body.title);
    }
    if(req.body.content) {
      query += ", content=?";
      qd.push(req.body.content);
    }
    query += " where rowid=?";
    qd.push(req.params.id);
    db.run(query, qd, function(err){
      res.send({'result': {'changes': this.changes}});
    });
  });
});

app.listen(port, function () {
  db.serialize(() => {
    db.run("create table notes(dateCreated, dateUpdated, title, content, tag)");
  });

  console.log(`Example app listening on port ${port}!`);
});
