const mongoose =require('mongoose');
var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.post('/add',(req,res,next) =>{
    const user = new User(req.body);
    console.log(user);
    const promise = user.save();

    promise.then((data)=>{
      res.json(data);
    }).catch((err)=>{
      res.json(err);
    });
});

module.exports = router;