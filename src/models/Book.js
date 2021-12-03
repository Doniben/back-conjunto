import { Schema, model } from "mongoose";

const bookSchema = new Schema(
  {
    idbn: String,
    title: String,
    subtitle: String,
    autor: String,
    category: String,
    publicationDate: String,
    editor: String,
    description: String,
    image: String,
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default model("Book", bookSchema);
