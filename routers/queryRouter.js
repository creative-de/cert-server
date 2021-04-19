import express from "express";
import certModel from "../models/certModel.js";
const router = express.Router();

// everyone can get a certificate with query
router.get("/", async (req, res) => {
  try {
    const certificate = await certModel.findOne(req.query);
    res.status(200).json(certificate);
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: error });
  }
});

export default router;
