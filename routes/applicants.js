var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");
const Applicant = require("../models/Applicant");
const User = require("../models/User")
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

// Récupérer le contenu du template html
const htmlUserPath = path.resolve("public/templates/RegistrationConfirmation.html")
const htmlNotificationPath = path.resolve("public/templates/RegistrationNotification.html")

router.post("/signup", async (req, res) => {
  try {
    if (!checkBody(req.body, ["firstname", "lastname", "email"])) {
      res.status(400).json({ result: false, error: "Missing or empty fields" });
      return;
    }

    const { firstname, lastname, email, phone, sponsorship } = req.body;
    const emailAlreadyExist = await Applicant.findOne({ email: email });

    if (emailAlreadyExist) {
      res.status(409).json({ result: false, error: "Email already exist" });
      return;
    } else {
      const applicantToAdd = new Applicant(req.body);
      

      if (req.body.sponsorship){
        const affiliate = await User.findOne({referralCode : req.body.sponsorship})
        if (affiliate){
          affiliate.referredUsers.push({referredUserInfos : applicantToAdd._id})
          await affiliate.save()
          const applicantAdded = await applicantToAdd.save();
        } else {
          return res.status(409).json({result: false, error: "Ce code de parrainage n'existe pas"})
        }
      } else {
        const applicantAdded = await applicantToAdd.save()
      }

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_MAIL,
          pass: process.env.GMAIL_PASSWORD,
        },
      });
      // Envoi du mail de confirmation au client
      const htmlUserContent = fs
        .readFileSync(htmlUserPath, "utf-8")
        .replace("{{firstname}}", firstname);

      const userMailOptions = {
        from: "Cash Genius contact@cash-genius.com",
        to: email,
        subject: "Confirmation d'inscription au Genius Programme",
        html: htmlUserContent,
      };

      transporter.sendMail(userMailOptions, (error, info) => {
        if (error) {
          res.status(400).json({ result: false, error: error });
          return;
        }
      });
      // Envoi de la notification d'inscription
      const htmlNotificationContent = fs
        .readFileSync(htmlNotificationPath, "utf-8")
        .replace("{{firstname}}", firstname)
        .replace("{{lastname}}", lastname)
        .replace("{{email}}", email)
        .replace("{{phone}}", phone)
        .replace("{{referal}}", sponsorship)


      const notificationMailOption = {
        from: "Cash Genius contact@cash-genius.com",
        to: process.env.GMAIL_MAIL,
        subject: "Nouvelle inscription au Genius Programme",
        html: htmlNotificationContent,
      };

      transporter.sendMail(notificationMailOption, (error, info) => {
        if (error) {
          res.status(400).json({ result: false, error: error });
          return;
        } else {
            res.status(200).json({result : true})
        }
      });
    }
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
});

module.exports = router;
