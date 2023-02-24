const express = require("express");
const userModel = require("./usermodel");
const followModel = require("./followmodel");
const postModel = require("./postmodel")
const commentModel = require("./commentmodel")
const reportModel = require("./reportmodel")
const middleware = require("./middleware");
const app = express();
const bcrypt = require("bcryptjs");
const SubGreddiit = require("./subgreddiitmodel");

app.post("/getfollowers", middleware, async (req, res) => {

  try {
    const id = await userModel.findOne({_id: req.user.id});
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
    const id = await userModel.findOne({_id: req.user.id});
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
    const user = await userModel.findOne({_id: req.user.id});
    const find = await followModel.findOne({from: follower._id, to: user._id});

    if (!user)
      return res.status(401).send({error: "No such user"});

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
    const user = await userModel.findOne({_id: req.user.id});
    const find = await followModel.findOne({from: user._id, to: following._id});

    if (!user)
      return res.status(401).send({error: "No such user"});

    if (user.uname === following.uname) return res.status(401).send({error: "Can't follow yourself"});

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
    const uid = await userModel.findOne({_id: req.user.id});
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
    const uid = await userModel.findOne({_id: req.user.id});
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

app.get("/getusers", middleware, async (req, res) => {
  const check = await userModel.find({_id: req.user.id})
  if (!check) return res.status(401).send({error: "No Access"})

  const users = await userModel.find({});
  try {
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/editprofile", middleware, async (req, res) => {
    
  try {
      const olduser = await userModel.findOne({_id: req.user.id})

      if (!olduser) return res.status(401).send({error: "No edit access"});

      const user = new userModel(req.body);
      const u = await userModel.findOne({uname: req.body.uname, _id: {$ne: req.body._id}})
      const e = await userModel.findOne({email: req.body.email, _id: {$ne: req.body._id}})
      if (u)
        return res.status(401).send({error: "Username already taken!"});
      
      if (e)
        return res.status(401).send({error: "Email ID already taken!"});
    
      res.send(user);
      
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
      const id = await userModel.findOne({_id: req.user.id})
      if (f)
        return res.status(401).send({error: "A SubGreddiit with this title already exists!"});
      if (!id)
        return res.status(401).send({error: "No such user"});
      subg.followers[0] = id._id;
      subg.mod = id._id;
      subg.date = subg._id.getTimestamp()

      if (!req.body.tags) req.body.tags = "";
      var arr2 = req.body.tags.split(",")
      for(var i=0; i<arr2.length; i++)
      {
        var str = arr2[i].trim()
        if (str.split(" ").length > 1) return res.status(401).send({error: "Tags should be single word only"})
        if (str.toLowerCase() !== str) return res.status(401).send({error: "Tags should be lowercase only"})
      }
      var arr = req.body.tags.split(",").map(item => item.trim());
      arr = arr.filter((e) => {return (e != "")})
      if (req.body.tags)
        subg.tags = arr;

      if (!req.body.banned) req.body.banned = "";
      arr2 = req.body.banned.split(",")
      for(var i=0; i<arr2.length; i++)
      {
        var str = arr2[i].trim()
        if (str.split(" ").length > 1) return res.status(401).send({error: "Banned Keywords should be single word only"})
      }
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
      const id = await userModel.findOne({_id: req.user.id})
      
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
    const uid = await userModel.findOne({_id: req.user.id});
    const subg = await SubGreddiit.findOneAndDelete({mod: uid._id, title: req.body.title})
    
    if (!subg) return res.status(401).send({error: "No such SubGreddiit or no access"});
    for(var i=0; i<subg.posts.length; i++)
    {
      const post = await postModel.findOne({_id: subg.posts[i]})
      for(var j=0; j<post.comments.length; j++)
      {
        await commentModel.findOneAndDelete({_id: post.comments[j]})
      }
      await postModel.deleteOne({_id: subg.posts[i]})
    }
    for(var i=0; i<subg.reports.length; i++)
    {
      await reportModel.findOneAndDelete({_id: subg.reports[i]})
    }

    res.send(deletion);
  }
  catch (error) {
    res.status(500).send(error);
    return;
  }
});

app.post("/subgreddiits/check", middleware, async (req, res) => {

  try {
    const user = await userModel.findOne({_id: req.user.id})
    if (!user) return res.status(401).send({error: "No such User"});

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

// resume from here

app.post("/subgreddiits/checkjoin", middleware, async (req, res) => {

  try {
    const check = await SubGreddiit.findOne({title: req.body.title})
    const id = await userModel.findOne({_id: req.user.id})
    
    if (!check) return res.status(401).send({error: "No such SubGreddiit"});
    if (!id) return res.status(401).send({error: "No such User"});
    
    const index = check.followers.indexOf(id._id)
    if (index === -1) return res.send(401).send({error: "Not a follower"})
  }
  catch (error) {
    res.status(500).send(error);
    return;
  }
});

app.post("/subgreddiits/upvotepost", middleware, async (req, res) => {

  try {
    const post = await postModel.findOne({_id: req.body.postid})
    const id = await userModel.findOne({_id: req.user.id})
    
    if (!post) return res.status(401).send({error: "No such Post"});
    if (!id) return res.status(401).send({error: "No such User"});
    const subg = await SubGreddiit.findOne({_id: post.subgreddiit})
    if (!subg.followers.includes(id._id)) return res.status(401).send({error: "No access"})
    
    const index = post.upvotes.indexOf(id._id)
    const index2 = post.downvotes.indexOf(id._id)
    
    if (index != -1) 
    {
      post.upvotes.splice(index, 1)
      await post.updateOne(post);
      res.send(post)
      return
    }
    if (index2 != -1) post.downvotes.splice(index2, 1)

    post.upvotes.push(id._id)
    await post.updateOne(post);
    res.send(post)
  }
  catch (error) {
    res.status(500).send(error);
    return;
  }
});

app.post("/subgreddiits/downvotepost", middleware, async (req, res) => {

  try {
    const post = await postModel.findOne({_id: req.body.postid})
    const id = await userModel.findOne({_id: req.user.id})
    
    if (!post) return res.status(401).send({error: "No such Post"});
    if (!id) return res.status(401).send({error: "No such User"});
    const subg = await SubGreddiit.findOne({_id: post.subgreddiit})
    if (!subg.followers.includes(id._id)) return res.status(401).send({error: "No access"})
    
    const index = post.upvotes.indexOf(id._id)
    const index2 = post.downvotes.indexOf(id._id)
    
    if (index2 != -1)
    {
      post.downvotes.splice(index2, 1)
      await post.updateOne(post);
      res.send(post)
      return;
    }
    if (index != -1) post.upvotes.splice(index, 1)
    
    post.downvotes.push(id._id)
    await post.updateOne(post);
    res.send(post)
  }
  catch (error) {
    res.status(500).send(error);
    return;
  }
});

app.post("/subgreddiits/createpost", middleware, async (req, res) => {

  try {
    const check = await SubGreddiit.findOne({title: req.body.title})
    const id = await userModel.findOne({_id: req.user.id})
    
    if (!check) return res.status(401).send({error: "No such SubGreddiit"});
    if (!id) return res.status(401).send({error: "No such User"});
    if (!check.followers.includes(id._id)) return res.status(401).send({error: "No access"})
    var flag = 0;
    
    const post = new postModel({text: req.body.text, user: id._id, subgreddiit: check._id, upvotes: [id._id], downvotes: []})
    for(var i=0; i<check.banned.length; i++)
    {
      var str = new RegExp(check.banned[i], 'ig')
      var temp = post.text.replaceAll(str, "*".repeat(check.banned[i].length))
      if (temp !== post.text) flag = 1;

      post.text = temp
    }
    check.posts.push(post._id)
    await check.updateOne(check);
    if (flag) res.send({error: "Your text has some banned keywords and they have been censored"})
    else res.send({error: ""})
    await post.save();
  }
  catch (error) {
    res.status(500).send(error);
    return;
  }
});

app.post("/subgreddiits/savepost", middleware, async (req, res) => {

  try {
    const post = await postModel.findOne({_id: req.body.postid})
    const id = await userModel.findOne({_id: req.user.id})
    const subg = await SubGreddiit.findOne({_id: post.subgreddiit})

    if (!subg.followers.includes(id._id)) return res.status(401).send({error: "You have not joined this subgreddiit"});
    
    if (!post) return res.status(401).send({error: "No such Post"});
    if (!id) return res.status(401).send({error: "No such User"});

    const index = id.savedposts.indexOf(req.body.postid)
    if (index != -1) return res.status(401).send({error: "Post saved already"});
    
    id.savedposts.push(req.body.postid)
    await id.updateOne(id);
    res.send(id)
  }
  catch (error) {
    res.status(500).send(error);
    return;
  }
});

app.post("/subgreddiits/unsavepost", middleware, async (req, res) => {

  try {
    const post = await postModel.findOne({_id: req.body.postid})
    const id = await userModel.findOne({_id: req.user.id})
    
    if (!post) return res.status(401).send({error: "No such Post"});
    if (!id) return res.status(401).send({error: "No such User"});

    var index = id.savedposts.indexOf(req.body.postid)
    if (index === -1) return res.status(401).send({error: "No such post"});
    id.savedposts.splice(index, 1)

    await id.updateOne(id);
    res.send(id)
  }
  catch (error) {
    res.status(500).send(error);
    return;
  }
});

app.post("/getsavedposts", middleware, async (req, res) => {

  try {
    const id = await userModel.findOne({_id: req.user.id})
    
    if (!id) return res.status(401).send({error: "No such User"});

    var p = []

    for(var i=0; i<id.savedposts.length; i++)
    {
      var postid = id.savedposts[i]
      const data = await postModel.findOne({_id: postid})
      const newid = await userModel.findOne({_id: data.user})
      data.user = newid.uname
      const subg = await SubGreddiit.findOne({_id: data.subgreddiit})
      if (subg.blockedusers.includes(newid._id)) data.user = "Blocked User"
      data.subgreddiit = subg.title
      p.push(data)
    }
    res.send(p)
  }
  catch (error) {
    res.status(500).send(error);
    return;
  }
});

app.post("/subgreddiits/getallposts", middleware, async (req, res) => {

  try {
    const check = await SubGreddiit.findOne({title: req.body.title})
    const id = await userModel.findOne({_id: req.user.id})
    
    if (!check) return res.status(401).send({error: "No such SubGreddiit"});
    if (!id) return res.status(401).send({error: "No such User"});
    if (!check.followers.includes(id._id)) return res.status(401).send({error: "No access"})

    var p = []
    for(var i=0; i<check.posts.length; i++)
    {
      var postid = check.posts[i]
      const data = await postModel.findOne({_id: postid})
      const newid = await userModel.findOne({_id: data.user})
      data.user = newid.uname
      if (check.blockedusers.includes(newid._id)) data.user = "Blocked User"
      p.push(data)
    }
    res.send(p)
  }
  catch (error) {
    res.status(500).send(error);
    return;
  }
});

app.post("/subgreddiits/posts/getcomments", middleware, async (req, res) => {

  try {
    const check = await postModel.findOne({_id: req.body.postid})
    const id = await userModel.findOne({_id: req.user.id})

    if (!check) return res.status(401).send({error: "No such Post"});
    const subg = await SubGreddiit.findOne({_id: check.subgreddiit})
    if (!subg.followers.includes(id._id)) return res.status(401).send({error: "No access"})

    var p = []
    for(var i=0; i<check.comments.length; i++)
    {
      const comment = await commentModel.findOne({_id: check.comments[i]})
      const data = await userModel.findOne({_id: comment.user})
      comment.user = data.uname
      const subg = await SubGreddiit.findOne({_id: check.subgreddiit})
      if (subg.blockedusers.includes(data._id)) comment.user = "Blocked User"
      p.push(comment)
    }
    res.send(p)
  }
  catch (error) {
    res.status(500).send(error);
    return;
  }
});

app.post("/subgreddiits/posts/addcomment", middleware, async (req, res) => {

  try {
    const user = await userModel.findOne({_id: req.user.id})
    
    const check = await postModel.findOne({_id: req.body.postid})
    
    if (!check) return res.status(401).send({error: "No such Post"});
    const subg = await SubGreddiit.findOne({_id: check.subgreddiit})
    if (!subg.followers.includes(user._id)) return res.status(401).send({error: "No access"})

    const comment = new commentModel({user: user._id, text: req.body.text, postid: req.body.postid})
    check.comments.push(comment._id)
    await check.updateOne(check)
    await comment.save()
    res.send(comment)
  }
  catch (error) {
    res.status(500).send(error);
    return;
  }
});

app.post("/subgreddiits/posts/addreport", middleware, async (req, res) => {

  try {
    const user = await userModel.findOne({_id: req.user.id})
    
    const check = await postModel.findOne({_id: req.body.postid})
    
    if (!check) return res.status(401).send({error: "No such Post"});
    const subg = await SubGreddiit.findOne({_id: check.subgreddiit})
    if (!subg.followers.includes(user._id)) return res.status(401).send({error: "No access"})

    const rep = new reportModel({reportedby: user._id, reporteduser: check.user, concern: req.body.text, post: req.body.postid, status: 1})
    rep.date = rep._id.getTimestamp()
    // const subg = await SubGreddiit.findOne({_id: check.subgreddiit})
    subg.reports.push(rep._id)

    await subg.updateOne(subg)
    await rep.save()
    res.send(rep)
  }
  catch (error) {
    res.status(500).send(error);
    return;
  }
});

app.post("/subgreddiits/getreports", middleware, async (req, res) => {

  try {
    const subg = await SubGreddiit.findOne({title: req.body.title, mod: req.user.id})
    
    if (!subg) return res.status(401).send({error: "No such SubGreddiit or no access"});

    var p = []
    var del = []
    for(var i=0; i<subg.reports.length; i++)
    {
      var date = new Date()
      const rep = await reportModel.findOne({_id: subg.reports[i]})
      const repby = await userModel.findOne({_id: rep.reportedby})
      const repuser = await userModel.findOne({_id: rep.reporteduser})
      rep.reportedby = repby.uname
      rep.reporteduser = repuser.uname
      const post = await postModel.findOne({_id: rep.post})
      rep.post = post.text
      // var diff = (date.getTime() - rep.date.getTime())/60000.0 // for 1 min
      var diff = (date.getTime() - rep.date.getTime())/(60000.0 * 60 * 24) // days

      if (diff > 10)
      {
        // delete report
        del.push(rep)
      }
      else p.push(rep);
    }
    for(var i=0; i<del.length; i++)
    {
      const index = subg.reports.indexOf(del[i]._id)
      subg.reports.splice(index, 1)
      await reportModel.deleteOne({_id: del[i]._id})
    }
    await subg.updateOne(subg)
    res.send(p)
  }
  catch (error) {
    res.status(500).send(error);
    return;
  }
});

app.post("/subgreddiits/reports/setstatus", middleware, async (req, res) => {

  try {
    const rep = await reportModel.findOne({_id: req.body.reportid})
    if (!rep) return res.status(401).send({error: "No such Report"});

    const post = await postModel.findOne({_id: rep.post, mod: req.user.id})
    if (!post) return res.status(401).send({error: "No Access"});

    rep.status = req.body.status

    await rep.updateOne(rep)
    console.log(rep)
    res.send(rep)
  }
  catch (error) {
    res.status(500).send(error);
    return;
  }
});

app.post("/subgreddiits/reports/deletepost", middleware, async (req, res) => {

  try {
    const rep = await reportModel.findOne({_id: req.body.reportid})
    if (!rep) return res.status(401).send({error: "No such Report"});

    const post = await postModel.findOne({_id: rep.post, mod: req.user.id})
    if (!post) return res.status(401).send({error: "No Access, or already deleted"});

    const del = await postModel.findOneAndDelete({_id: post._id})
    const subg = await SubGreddiit.findOne({_id: post.subgreddiit})

    for(var i=0; i<del.comments.length; i++)
    {
      await commentModel.deleteOne({_id: del.comments[i]})
    }

    var p = []
    for(var i=0; i<subg.reports.length; i++)
    {
      const repp = await reportModel.findOne({_id: subg.reports[i]})
      if (repp.post != post._id)
      {
        p.push(subg.reports[i])
      }
      else
      {
        await reportModel.deleteOne({_id: repp._id})
      }
    }
    subg.reports = p
    const index = subg.posts.indexOf(post._id)
    subg.posts.splice(index, 1)

    const sp = await userModel.find({})
    for(var i=0; i< sp.length; i++)
    {
      if (sp[i].savedposts.includes(post._id))
      {
        const ind = sp[i].savedposts.indexOf(post._id)
        sp[i].savedposts.splice(ind, 1)
        await sp[i].updateOne(sp[i])
      }
    }

    await subg.updateOne(subg)
    res.send(p)
  }
  catch (error) {
    res.status(500).send(error);
    return;
  }
});

app.post("/subgreddiits/reports/blockuser", middleware, async (req, res) => {

  try {
    const rep = await reportModel.findOne({_id: req.body.reportid})
    if (!rep) return res.status(401).send({error: "No such Report"});

    const post = await postModel.findOne({_id: rep.post, mod: req.user.id})
    if (!post) return res.status(401).send({error: "No Access"});

    const subg = await SubGreddiit.findOne({_id: post.subgreddiit})

    if (rep.reporteduser === subg.mod) return res.status(401).send({error: "You can't block yourself lol"})
    if (subg.blockedusers.includes(rep.reporteduser)) return res.status(401).send({error: "User already blocked!"})
    
    subg.blockedusers.push(rep.reporteduser);

    await subg.updateOne(subg)
    res.send(rep)
  }
  catch (error) {
    res.status(500).send(error);
    return;
  }
});

app.post("/subgreddiits/getusers", middleware, async (req, res) => {

  try {
    const users = await SubGreddiit.findOne({title: req.body.title, mod: req.user.id})
    
    if (!users) return res.status(401).send({error: "No such SubGreddiit or no access"});

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
      const id = await userModel.findOne({_id: req.user.id})
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
      const subg = await SubGreddiit.findOne({title: req.body.title, mod: req.user.id})
      if (!subg)
        return res.status(401).send({error: "SubGreddiit not present or no access!"});
      const id = await userModel.findOne({uname: req.body.uname})
      if (!id)
        return res.status(401).send({error: "User not present!"});
        
      var index = subg.requests.indexOf(id._id)
      subg.requests.splice(index, 1)
      index = subg.followers.indexOf(id._id)
      if (index == -1)
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
      const subg = await SubGreddiit.findOne({title: req.body.title, mod: req.user.id})
      
      if (!subg)
        return res.status(401).send({error: "SubGreddiit not present or no access!"});
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

app.post("/subgreddiits/search", middleware, async (req, res) => {

  try {
    const find = await SubGreddiit.find({})
    const id = await userModel.findOne({_id: req.user.id})
    if (!id) return res.status(401).send({error: "No such user"})
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

app.post("/subgreddiits/leave", middleware, async (req, res) => {

  try {
    const find = await SubGreddiit.findOne({title: req.body.title})
    const id = await userModel.findOne({_id: req.user.id})
    if (!id) return res.status(401).send({error: "No such user"})

    const index = find.followers.indexOf(id._id);
    find.followers.splice(index, 1);
    const index2 = find.blockedusers.indexOf(id._id);
    find.blockedusers.splice(index2, 1);
    find.left.push(id._id)
    await find.updateOne(find)
    res.send(find)
  }
  catch (error) {
    res.status(500).send(error);
    return;
  }
});

app.get("/subgreddiits/getalltags", middleware, async (req, res) => {

  try {
    const id = await userModel.findOne({_id: req.user.id})
    if (!id) return res.status(401).send({error: "No such user"})

    var p = []
    const subg = await SubGreddiit.find({})
    for(var i=0; i<subg.length; i++)
    {
      for(var j=0; j<subg[i].tags.length; j++)
      {
        if (!p.includes(subg[i].tags[j]))
        {
          p.push(subg[i].tags[j])
        }
      }
    }
    res.send(p)
  }
  catch (error) {
    res.status(500).send(error);
    return;
  }
});

module.exports = app;