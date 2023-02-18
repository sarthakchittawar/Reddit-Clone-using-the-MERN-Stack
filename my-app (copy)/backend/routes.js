const express = require("express");
const userModel = require("./usermodel");
const followModel = require("./followmodel");
const middleware = require("./middleware");
const app = express();
const bcrypt = require("bcryptjs");
const SubGreddiit = require("./subgreddiitmodel");

app.post("/getfollowers", middleware, async (req, res) => {

  try {
    const id = await userModel.findOne({uname: req.body.uname});
    if (!id) return res.status(401).send({error: "No such uname"});

    const followers = await followModel.find({to: id._id});
    res.send(followers);
  }
  catch (error) {
    res.status(500).send(error);
    return;
  }
});

app.post("/getfollowing", middleware, async (req, res) => {

  try {
    const id = await userModel.findOne({uname: req.body.uname});
    if (!id) return res.status(401).send({error: "No such uname"});

    const following = await followModel.find({from: id._id});
    res.send(following);
  }
  catch (error) {
    res.status(500).send(error);
    return;
  }
});

app.post("/followeridtouname", middleware, async (req, res) => {

  try {
    const uname = await userModel.findOne({_id: req.body.from});
    if (!uname) return res.status(401).send({error: "No such id"});

    res.send(uname)
  }
  catch (error) {
    res.status(500).send(error);
    return;
  } 
})

app.post("/followingidtouname", middleware, async (req, res) => {

  try {
    const uname = await userModel.findOne({_id: req.body.to});
    if (!uname) return res.status(401).send({error: "No such id"});

    res.send(uname)
  }
  catch (error) {
    res.status(500).send(error);
    return;
  } 
})

app.post("/addfollower", middleware, async (req, res) => {

  try {
    const follower = await userModel.findOne({uname: req.body.funame});
    const user = await userModel.findOne({uname: req.body.uname});
    const find = await followModel.findOne({from: follower._id, to: user._id});

    if (find)
      return res.status(401).send({error: "Already a follower"});
    const follow = new followModel({from: follower._id, to: user._id});
    res.send(follow);
    await follow.save();
  }
  catch (error) {
    res.status(500).send(error);
    return;
  }
});

app.post("/addfollowing", middleware, async (req, res) => {

  try {
    const following = await userModel.findOne({uname: req.body.funame});
    const user = await userModel.findOne({uname: req.body.uname});
    const find = await followModel.findOne({from: user._id, to: following._id});

    if (find)
      return res.status(401).send({error: "Already following"});
    const follow = new followModel({from: user._id, to: following._id});
    res.send(follow);
    await follow.save();
  }
  catch (error) {
    res.status(500).send(error);
    return;
  }
});

app.post("/deletefollower", middleware, async (req, res) => {

  try {
    const fid = await userModel.findOne({uname: req.body.funame});
    const uid = await userModel.findOne({uname: req.body.uname});
    if (!fid || !uid) return res.status(401).send({error: "No such uname"});

    const follow = await followModel.deleteOne({from: fid._id, to: uid._id})
    res.send(follow);
  }
  catch (error) {
    res.status(500).send(error);
    return;
  }
});

app.post("/deletefollowing", middleware, async (req, res) => {

  try {
    const fid = await userModel.findOne({uname: req.body.funame});
    const uid = await userModel.findOne({uname: req.body.uname});
    if (!fid || !uid) return res.status(401).send({error: "No such uname"});

    const follow = await followModel.deleteOne({from: uid._id, to: fid._id})
    res.send(follow);
  }
  catch (error) {
    res.status(500).send(error);
    return;
  }
});

app.post("/signup", async (req, res) => {
    
    try {
        const user = new userModel(req.body);
        const u = await userModel.findOne({uname: req.body.uname})
        const e = await userModel.findOne({email: req.body.email})
        if (u)
          return res.status(401).send({error: "Username already exists!"});
        
        if (e)
          return res.status(401).send({error: "Email ID already exists!"});
      
        const salt = await bcrypt.genSalt();
        user.passwd = await bcrypt.hash(user.passwd, salt);
        res.send(user);
        await user.save();
    }
    catch (error) {
        res.status(500).send(error);
        return;
    }
});

app.post("/login", async (req, res) => {
    
  try {
      const user = await userModel.findOne({uname: req.body.uname});

      if (!user)
        return res.status(401).send({error: "Username doesn't exist!"});
      if (await user.validatePasswd(req.body.passwd))
      {
        const token = user.generateToken();
        return res.send({token});
      }
      return res.status(401).send({error: "Incorrect Password!"});
  }
  catch (error) {
      res.status(500).send(error);
      return;
  }
});

app.get("/getcreds", middleware, async (req, res) => {
    const users = await userModel.find({_id: req.user.id});
    try {
      res.send(users);
    } catch (error) {
      res.status(500).send(error);
    }
});

app.get("/getusers", async (req, res) => {
  const users = await userModel.find({});
  try {
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

// verify that ID is yours
app.post("/editprofile", middleware, async (req, res) => {
    
  try {
      const user = new userModel(req.body);
      const u = await userModel.findOne({uname: req.body.uname, _id: {$ne: req.body._id}})
      const e = await userModel.findOne({email: req.body.email, _id: {$ne: req.body._id}})
      if (u)
        return res.status(401).send({error: "Username already taken!"});
      
      if (e)
        return res.status(401).send({error: "Email ID already taken!"});
    
      res.send(user);
      const olduser = await userModel.findOne({_id: req.body._id})
      await olduser.updateOne(user);
  }
  catch (error) {
      res.status(500).send(error);
      return;
  }
});

app.post("/createsubgreddiit", middleware, async (req, res) => {
  try {
      const subg = new SubGreddiit(req.body);
      const f = await SubGreddiit.findOne({title: req.body.title})
      const id = await userModel.findOne({uname: req.body.mod})
      if (f)
        return res.status(401).send({error: "A SubGreddiit with this title already exists!"});
      if (!id)
        return res.status(401).send({error: "No such user"});
      subg.followers[0] = id._id;
      subg.mod = id._id;

      if (!req.body.tags) req.body.tags = "";
      var arr = req.body.tags.split(",").map(item => item.trim());
      arr = arr.filter((e) => {return (e != "")})
      if (req.body.tags)
        subg.tags = arr;

      if (!req.body.banned) req.body.banned = "";
      arr = req.body.banned.split(",").map(item => item.trim());
      arr = arr.filter((e) => {return (e != "")})
      if (req.body.banned)
        subg.banned = arr;
      res.send(subg);
      await subg.save();
  }
  catch (error) {
      res.status(500).send(error);
      return;
  }
});

app.post("/getsubgreddiits", middleware, async (req, res) => {
    
  try {
      const id = await userModel.findOne({uname: req.body.mod})
      
      if (!id) return res.status(401).send({error: "No such user"});

      const subg = await SubGreddiit.find({mod: id._id});

      if (!subg) return res.status(401).send({error: "You have no subgreddiits"});

      res.send(subg);

  }
  catch (error) {
      res.status(500).send(error);
      return;
  }
});

app.post("/deletesubgreddiit", middleware, async (req, res) => {

  try {
    const uid = await userModel.findOne({uname: req.body.mod});
    const deletion = await SubGreddiit.deleteOne({mod: uid._id, title: req.body.title})
    
    if (!deletion) return res.status(401).send({error: "No such SubGreddiit"});

    res.send(deletion);
  }
  catch (error) {
    res.status(500).send(error);
    return;
  }
});

app.post("/subgreddiits/check", middleware, async (req, res) => {

  try {
    const check = await SubGreddiit.findOne({title: req.body.title})
    
    if (!check) return res.status(401).send({error: "No such SubGreddiit"});
    const u = await userModel.findOne({_id: check.mod})
    check.mod = u.uname;
    res.send(check);
  }
  catch (error) {
    res.status(500).send(error);
    return;
  }
});

app.post("/subgreddiits/getusers", async (req, res) => {

  try {
    const users = await SubGreddiit.findOne({title: req.body.title})
    
    if (!users) return res.status(401).send({error: "No such SubGreddiit"});

    const l = users.followers.length;
    for(var i = 0; i<l; i++)
    {
      const u = await userModel.findOne({_id: users.followers[i]})
      users.followers[i] = u.uname
    }
    const p = users.blockedusers.length;
    for(var i = 0; i<p; i++)
    {
      const u = await userModel.findOne({_id: users.blockedusers[i]})
      users.blockedusers[i] = u.uname
    }
    const u = await userModel.findOne({_id: users.mod})

    const q = users.requests.length;
    for(var i = 0; i<q; i++)
    {
      const u = await userModel.findOne({_id: users.requests[i]})
      users.requests[i] = u.uname
    }
    users.mod = u.uname
    res.send(users);
  }
  catch (error) {
    res.status(500).send(error);
    return;
  }
});

app.post("/subgreddiits/request", middleware, async (req, res) => {
    
  try {
      const id = await userModel.findOne({uname: req.body.uname})
      const subg = await SubGreddiit.findOne({title: req.body.title})
      if (!id)
        return res.status(401).send({error: "Username not present!"});
      
      if (!subg)
        return res.status(401).send({error: "SubGreddiit not present!"});
      if (subg.followers.includes(id._id))
        return res.status(401).send({error: "You are already added to this SubGreddiit!"});
      if (subg.requests.includes(id._id))
        return res.status(401).send({error: "You have already requested to be added to this SubGreddiit!"});
      
      if (subg.left.includes(id._id))
        return res.status(401).send({error: "You have already left this SubGreddiit!"})
      
      subg.requests.push(id._id)
      res.send(subg);
      await subg.updateOne(subg);
  }
  catch (error) {
      res.status(500).send(error);
      return;
  }
});

app.post("/subgreddiits/acceptrequest", middleware, async (req, res) => {
    
  try {
      const subg = await SubGreddiit.findOne({title: req.body.title})
      
      if (!subg)
        return res.status(401).send({error: "SubGreddiit not present!"});
      const id = await userModel.findOne({uname: req.body.uname})
      if (!id)
        return res.status(401).send({error: "User not present!"});
      
      const index = subg.requests.indexOf(id._id)
      subg.requests.splice(index, 1)
      subg.followers.push(id._id)
      res.send(subg);
      await subg.updateOne(subg);
  }
  catch (error) {
      res.status(500).send(error);
      return;
  }
});

app.post("/subgreddiits/rejectrequest", middleware, async (req, res) => {
    
  try {
      const subg = await SubGreddiit.findOne({title: req.body.title})
      
      if (!subg)
        return res.status(401).send({error: "SubGreddiit not present!"});
      const id = await userModel.findOne({uname: req.body.uname})
      if (!id)
        return res.status(401).send({error: "User not present!"});
      
      const index = subg.requests.indexOf(id._id)
      subg.requests.splice(index, 1)
      
      res.send(subg);
      await subg.updateOne(subg);
  }
  catch (error) {
      res.status(500).send(error);
      return;
  }
});

app.post("/subgreddiits/search", async (req, res) => {

  try {
    const find = await SubGreddiit.find({})
    const id = await userModel.findOne({uname: req.body.uname})
    var x = []
    var x1 = []
    for(var i=0; i<find.length; i++)
    {
      var y = find[i].title;
      var z = find[i].title.toLowerCase();
      var k = await userModel.findOne({_id: find[i].mod})
      find[i].mod = k.uname;
      if (z.split(' ').includes(req.body.search.trim().toLowerCase()))
      {
        if (find[i].followers.includes(id._id))
          x.push(find[i])
        else
          x1.push(find[i])
      }
      else if (req.body.search.trim() === "")
      {
        if (find[i].followers.includes(id._id))
          x.push(find[i])
        else
          x1.push(find[i])
      }
    }
    
    res.send([x, x1])
  }
  catch (error) {
    res.status(500).send(error);
    return;
  }
});

app.post("/subgreddiits/leave", async (req, res) => {

  try {
    const find = await SubGreddiit.findOne({title: req.body.title})
    const id = await userModel.findOne({uname: req.body.uname})
    
    const index = find.followers.indexOf(id._id);
    find.followers.splice(index, 1);
    find.left.push(id._id)
    await find.updateOne(find)
    res.send(find)
  }
  catch (error) {
    res.status(500).send(error);
    return;
  }
});

module.exports = app;