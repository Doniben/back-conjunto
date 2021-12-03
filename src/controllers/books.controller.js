import Book from "../models/Book";

export const createBook = async (req, res) => {
  const { idbn, title, subtitle, autor, category, publicationDate, editor, description, image, } = req.body;

  try {
    const newBook = new Book({
      idbn, 
      title, 
      subtitle, 
      autor, 
      category, 
      publicationDate, 
      editor, 
      description, 
      image,
    });

    const bookSaved = await newBook.save();

    res.status(201).json(bookSaved);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const getBookById = async (req, res) => {
  const { bookId } = req.params;

  const book = await Book.findById(bookId);
  res.status(200).json(book);
};

export const getBooks = async (req, res) => {
  const books = await Book.find();
  return res.json(books);
};

export const updateBookById = async (req, res) => {
  const updatedBook = await Book.findByIdAndUpdate(
    req.params.bookId,
    req.body,
    {
      new: true,
    }
  );
  res.status(204).json(updatedBook);
};

export const deleteBookById = async (req, res) => {
  const { bookId } = req.params;

  await Book.findByIdAndDelete(bookId);

  // code 200 is ok too
  res.status(204).json();
};
