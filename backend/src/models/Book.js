import { Schema, model } from "mongoose";

const bookSchema = new Schema(
  {
    idbn: String,
    title: String,
    subtitle: String,
    autor: Array,
    category: Array,
    publicationDate: Number,
    editor: Array,
    description: String,
    image: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Book", bookSchema);
