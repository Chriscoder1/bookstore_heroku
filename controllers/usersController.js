const User = require("../models/User");
const createError = require("http-errors");
const { validationResult } = require("express-validator");
/* const { find } = require("../models/User"); */
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config(); 

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select("-password -__v")
      .sort("lastName")
      .limit(5);
    res.status(200).send(users);
  } catch (e) {
    next(e);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password -__v");
    if (!user) throw new createError.NotFound();
    res.status(200).send(user);
  } catch (e) {
    next(e);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) throw new createError.NotFound();
    res.status(200).json({messege: "Deleded", user:user});
  } catch (e) {
    next(e);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!user) throw new createError.NotFound();
    res.status(200).send(user);
  } catch (e) {
    next(e);
  }
};

exports.addUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    User.find({email:req.body.email}).exec().then(result => {
      if (result.length > 0){
        res.status(409).json({userMessage:"User allready in DB"})
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) =>{
          if (err){
            return res.status(500).json({error : err})
          } else {
             const user = new User({
             firstName: req.body.firstName,
             lastName: req.body.lastName,
             email: req.body.email,
             password: hash,
           });
            const userAddress = {
              street: req.body.street,
              city: req.body.city,
            }
            user.address.push(userAddress);
            user.save();
            res.status(200).send(user); 
          }
        })
      }
    }).catch(err => {     //Key :  Value Pair
      res.status(500).json({error : err, msg: "I hate It"})
    })


    
  } catch (e) {
    next(e);
  }
};

 exports.userLogin = (req, res, next) => {
  User.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length < 1) {
            return res.status(401).json({
                message: 'Auth failed'
            });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    message: 'Auth failed'
                })
            }
            if (result) {
                const token = jwt.sign(
                    {
                        email: user[0].email,
                        userId: user[0]._id
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: '1h'
                    }
                );
                return res.status(200).json({
                    message: 'Auth successful',
                    token: token
                });
            }
            return res.status(401).json({
                message: 'Auth failed'
            });
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};


exports.getLogin = (req, res, next) => {
  res.render("login")
}