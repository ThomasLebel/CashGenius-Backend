var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/User");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/signup", async (req, res) => {
  try {
    if (!checkBody(req.body, ["firstname", "lastname", "email", "password"])) {
      return res
        .status(400)
        .json({ result: false, error: "Missing or empty fields" });
    } else {
      const userAlreadyExist = await User.findOne({ email: req.body.email });
      if (userAlreadyExist) {
        return res
          .status(409)
          .json({ result: false, error: "Email already exist" });
      } else {
        const hash = bcrypt.hashSync(req.body.password, 10);
        let referralCode;
        let codeAlreadyUse = true;
        while (codeAlreadyUse) {
          referralCode = crypto.randomBytes(3).toString("hex").toUpperCase();
          const codeAlreadyExist = await User.findOne({
            referralCode: referralCode,
          });

          if (!codeAlreadyExist) {
            codeAlreadyUse = false;
          }
        }

        const newUser = new User({
          token: uid2(32),
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          password: hash,
          referralCode: referralCode,
          referralClicks: 0,
        });

        const userAdded = await newUser.save();
        res.status(200).json({
          result: true,
          userInfos: {
            firstname: userAdded.firstname,
            lastname: userAdded.lastname,
            email: userAdded.email,
            token: userAdded.token,
            referralCode: userAdded.referralCode,
            referralClicks: userAdded.referralClicks,
            referredUsersInfos: userAdded.referredUsers,
          },
        });
      }
    }
  } catch (error) {
    res.status(500).json({ result: false, error: error.message });
  }
});

router.post("/signin", async (req, res) => {
  try {
    if (!checkBody(req.body, ["email", "password"])) {
      return res
        .status(400)
        .json({ result: false, error: "Missing or empty fields" });
    } else {
      const user = await User.findOne({ email: req.body.email }).populate(
        "referredUsers.referredUserInfos"
      );
      if (!user) {
        return res
          .status(409)
          .json({ result: false, error: "Account not found" });
      } else {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          res.status(200).json({
            result: true,
            userInfos: {
              firstname: user.firstname,
              lastname: user.lastname,
              email: user.email,
              token: user.token,
              referralCode: user.referralCode,
              referralClicks: user.referralClicks,
              referredUsersInfos: user.referredUsers,
            },
          });
        } else {
          return res
            .status(409)
            .json({ result: false, error: "Wrong password" });
        }
      }
    }
  } catch (error) {
    res.status(500).json({ result: false, error: error.message });
  }
});

router.put("/changeReferralCode", async (req, res) => {
  try {
    if (!checkBody(req.body, ["token", "newReferralCode"])) {
      return res
        .status(400)
        .json({ result: false, error: "Missing or empty fields" });
    } else {
      const user = await User.findOne({ token: req.body.token });
      if (!user) {
        return res
          .status(409)
          .json({ result: false, error: "Account not found" });
      } else {
        user.referralCode = req.body.newReferralCode;
        const userUpdated = user.save();
        res.status(200).json({ result: true });
      }
    }
  } catch (error) {
    res.status(500).json({ result: false, error: error.message });
  }
});

router.post("/addClick", async (req, res) => {
  try {
    if (!checkBody(req.body, ["referralCode"])) {
      res.status(400).json({ result: false, error: "missing or empty fields" });
    } else {
      const user = await User.findOne({ referralCode: req.body.referralCode });
      if (user) {
        user.referralClicks += 1;
        await user.save();
        res.status(200).json({ result: true });
      } else {
        res
          .status(409)
          .json({ result: false, error: "Referral code not found" });
      }
    }
  } catch (error) {
    res.status(500).json({ result: false, error: error.message });
  }
});

router.get("/:userToken", async (req, res) => {
  try {
      const user = await User.findOne({token: req.params.userToken}).populate(
        "referredUsers.referredUserInfos")
      if (!user){
        res.status(409).json({result: false, error: "User not found"})
      } else {
        res.status(200).json({result: true, referralClicks : user.referralClicks, referredUsers : user.referredUsers})
      }
  } catch (error) {
    res.status(500).json({ result: false, error: error.message });
  }
});

module.exports = router;
