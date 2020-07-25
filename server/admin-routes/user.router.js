const express = require("express");
const router = express.Router();
// const bcrypt = require("bcryptjs");
const passport = require('../modules/passport')
// const { rejectUnauthenticated } = require('../modules/authentication-middleware')
const User = require("../schemas/userSchema");

//Login
// router.post("/login",passport.authenticate("local", { failureRedirect: "/get-started" }), (req, res) => {
//   console.log(req);
//   res.sendStatus(200);
// }
// );


//register




//getList
router.get("/", (req, res) => {
  console.log("User list backend hit")
  // these conditionals manually put required values into the query 
  // that aren't passed in from the react-admin getMany method
  if(req.query.sort === undefined){
    req.query.sort = JSON.stringify(["id","ASC"])
  }
  if(req.query.range === undefined){
    req.query.range = JSON.stringify([0,9])
  }
  console.log("req.query: ", req.query)
  console.log("req.query.sort: ", req.query.sort)
  const sortQuery = JSON.parse(req.query.sort);
  console.log("made sortQuery: ", sortQuery)
  let sort = {};
  sort[sortQuery[0]] = sortQuery[1] === "ASC" ? 1 : -1;
  console.log("query: ", req.query, " end query");
  console.log(sortQuery);
  console.log("sort", sort);

  User.find()
    .sort(sort)
    .then((users) => {
      res.set("content-range", JSON.stringify(users.length));
      //  each object needs to have an 'id' field in order for
      //  reactAdmin to parse
      users = JSON.parse(JSON.stringify(users).split('"_id":').join('"id":'));
      // console.log("parsed users: ", users)
      res.json(users);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("no users found");
    });
});

//getOne
router.get("/:id", (req, res) => {
  console.log("getOne user hit. Id: ", req.params.id)
  User.findOne({_id: req.params.id})
  .then((user) => {
    user = JSON.parse(JSON.stringify(user).split('"_id":').join('"id":'));
    console.log("parsed user: ", user)
    res.json(user)
  }).catch(err => {
    console.log("error: ", err)
    res.status(500).send("user not found.")
  })
})


//https://marmelab.com/react-admin/doc/2.8/DataProviders.html
//getMany

//getManyReference


//update
router.put("/:id", async (req, res) => {
  console.log("update hit")
  console.log(req.params.id)
  console.log(req.body)
  User.updateOne({_id: req.params.id}, req.body)
  .then((user) => {
    user = JSON.parse(JSON.stringify(user).split('"_id":').join('"id":'));
    res.json(user)
  }).catch(err => {
    console.log(err)
    res.status(500).send("Failed to update.")
  })
})

//updateMany
router.put("/", async (req, res) => {
  console.log("updateMany hit")
  console.log(req.query.ids)
  let users = []
  for(let i = 0; i < req.query.ids.length; i++){
    User.updateOne({_id: req.query.ids[i]}, req.body)
    .then((user) => {
      users.push(user)
      console.log("pushed: ", user)
    }).catch(err => {
      console.log(err)
      res.status(500).send("Failed to update all items.")
    })
  }
  res.set("content-range", JSON.stringify(updatedUsers.length));
  updatedUsers = JSON.parse(JSON.stringify(users).split('"_id":').join('"id":'));
  res.status(200).json(updatedUsers);
})

//create
router.post("/", async (req, res) => {
  User.create(req.body.body)
  .then(newUser => {
    console.log(newUser)
    newUser = JSON.parse(JSON.stringify(newUser).split('"_id":').join('"id":'));
    res.status(200).json(newUser)
  }).catch(err => {
    console.log(err)
    res.status(500).send("Creation failed.")
  })
})

//delete
router.delete("/:id", async (req, res) => {
  User.deleteOne({_id: req.params.id})
  .then(res => {
    console.log(res)
    res.status(200).send("item deleted")
  }).catch(err => {
    console.log(err)
    res.status(500).send("Deletion failed!")
  })
})

//deleteMany
router.delete("/", async (req, res) => {
  console.log("deleteMany hit.")
  console.log(req.query.ids)
  for(let i = 0; i < req.query.ids.length; i++){
    await User.deleteOne({_id: req.params.id})
    .then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
      res.status(500).send("Not all items were deleted")
    })
  }
  res.status(200).send("items deleted.")
})



module.exports = router;