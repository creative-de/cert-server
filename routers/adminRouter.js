import express from "express";
import certModel from "../models/certModel.js";
import middleware from "./middleware.js";
const router = express.Router();

//create a new certificate on path /admin/
router.post("/", middleware, async (req, res) => {
  const uploaded = req.body;

  try {
    const certExist = await certModel.findOne({ serial: uploaded.serial });
    if (certExist) {
      return res
        .status(400)
        .json({ errorMessage: "user already already exists" });
    }

    const newCert = new certModel(uploaded);
    const savedCert = await newCert.save();
    res.status(201).json(savedCert);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
});

router.delete("/delete", middleware, async (req, res) => {
  try {
    await certModel.findOneAndRemove(req.body);
    res.json({ message: "post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
});

export default router;
