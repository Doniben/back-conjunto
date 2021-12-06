import { Schema, model } from "mongoose";

const bookSchema = new Schema(
  {
    isbn: String,
    title: String,
    subtitle: Array,
    autor: Array,
    category: Array,
    publicationDate: Array,
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
