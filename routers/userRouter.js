import express from "express";
import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const router = express.Router();

//signup
router.post("/", async (req, res) => {
  try {
    //destructruing the body

    const { username, password } = req.body;

    //validate if all fields are not blank

    if (!username || !password) {
      return res.status(404).json("Please enter all fields");
    }

    // check if there exist already such a username in database with findone

    const userExist = await userModel.findOne({ username: username });
    if (userExist) {
      return res
        .status(400)
        .json({ errorMessage: "user already already exists" });
    }

    // hashing: generate salt with bcrypt, then hash the password with salt, in database hash is stored only

    const saltedPassword = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, saltedPassword);

    //save user to database using schema-models we created. and save() it

    const savedUser = await userModel({
      username: username,
      passwordHash: passwordHash,
    }).save();

    // sign the token using jwt package, create an ancrypted token according to the userId,
    //we get the userId from the database, when we saved the user to the server, we created a variable,
    //user id exists in that variable, and we created a password in .env file.

    const token = jwt.sign(
      {
        userId: savedUser._id,
      },
      process.env.JWT_KEY
    );

    // send the token we just created to the client, server gets this token via httpOnly
    // on httponly javascript cannot work, so it somehow secure. res.cookie().send()

    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .send();
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

//login

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    //validate

    if (!username || !password) {
      return res.status(400).json("Please enter all fields");
    }

    const userExist = await userModel.findOne({ username: username });

    //status(400) is bad request. status(401) is unauthorized request 401 is more secure. doesnt let in

    if (!userExist) {
      return res
        .status(401)
        .json("No such user exist on database, please try again");
    }

    // check if password is correct

    const passwordCorrect = await bcrypt.compare(
      password,
      userExist.passwordHash
    );

    if (!passwordCorrect) {
      return res.status(401).json("Wrong username or password");
    }

    // sign in token

    const token = jwt.sign(
      {
        userId: userExist._id,
      },
      process.env.JWT_KEY
    );

    // send the cookie to the browser (httponly)

    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .json(userExist)
      .send();
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

//logout

router.get("/logout", (req, res) => {
  res
    .cookie("token", " ", {
      httpOnly: true,
      expires: new Date(0),
    })
    .send();
});

//check if am I logged in, since cookies are sent through httponly, so in order to check the token
// we must send an http request to check if there is a valid token
router.get("/loggedin", (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json(false);
    }

    jwt.verify(token, process.env.JWT_KEY);
    res.send(true);
  } catch (error) {
    console.error(error);
    res.json(false);
  }
});

// everyone can get a certificate with query
router.get("/query", async (req, res) => {
  const { serial } = req.query;
  try {
    const certificate = await certModel.findOne(req.query);
    res.status(200).json(certificate);
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: error });
  }
});

export default router;
