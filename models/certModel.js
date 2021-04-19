import mongoose from "mongoose";

const certSchema = new mongoose.Schema({
  serial: {
    type: String,
    required: true,
  },
  info: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: new Date(),
  },
});

export default mongoose.model("certModel", certSchema);
