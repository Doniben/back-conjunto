import Book from "../models/Book";

export const createBook = async (req, res) => {
  const {
    idbn,
    title,
    subtitle,
    autor,
    category,
    publicationDate,
    editor,
    description,
    image,
  } = req.body;

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

export const getBookBytitle = async (req, res) => {
  const { title, isbn, subtitle, autor, category, publicationDate, editor } =
    req.body;
  try {
    const allBooks = await Book.find()
      .then((response) => {
        let resultado = [];

        if (isbn) {
          const serial = response.filter((res) => res.isbn == isbn);
          if (serial > 0) resultado.push(serial);
        } else {
          let controlador = [];

          if (title) controlador.push("title");
          if (subtitle) controlador.push("subtitle");
          if (autor) controlador.push("autor");
          if (category) controlador.push("category");
          if (publicationDate) controlador.push("publicationDate");
          if (editor) controlador.push("editor");

          let contador = 0;

          //cicle that creator of a filter secuential
          controlador.forEach((atributo) => {
            let memoria = [];
            let minuscula = "";

            contador += 1;

            switch (atributo) {
              case "title":
                minuscula = title;
                break;
              case "subtitle":
                minuscula = subtitle;
                break;
              case "autor":
                minuscula = autor;
                break;
              case "category":
                minuscula = category;
                break;
              case "publicationDate":
                minuscula = publicationDate;
                break;
              case "editor":
                minuscula = editor;
                break;
            }

            minuscula = minuscula.toLowerCase();
            const fragmentacion = minuscula.split(" ");
            fragmentacion.map((x) => {
              if (x.length > 3) memoria.push(x);
            });
            //filter repeat words
            memoria = Array.from(new Set(memoria));

            const sub_proceso = (x, element, atributo) => {
              let filtrador = new RegExp(x, "ig");
              let analisis = filtrador.test(element[atributo]);
              if (analisis) return analisis;
            };

            //run array search matchs based count
            memoria.map((x) => {
              let busqueda = null;
              if ((resultado.length == 0) & (contador == 1)) {
                busqueda = response.filter((element) =>
                  sub_proceso(x, element, atributo)
                );
                resultado.push(busqueda);
              } else {
                busqueda = resultado.filter((element) =>
                  sub_proceso(x, element, atributo)
                );
                resultado = [];
                resultado.push(busqueda);
              }
            });

            //unidimencional array and clear repeat elements
            resultado = resultado.reduce((ccl, ob) => ccl.concat(ob), []);
            resultado = Array.from(new Set(resultado));

            const titulo = response.filter((res) => res.title == title);
            if (titulo > 0) resultado.push(titulo);

            //response based results
            res.status(200).json(resultado);
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ erro: "in the request" });
  }
};

export const getBooks = async (req, res) => {
  const books = await Book.find()
    .then((response) => {
      console.log("fine");
      res.json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500);
    });
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

export const deleteBookByList = async (req, res) => {
  const { booksIds } = req.body;
  console.log(booksIds);

  booksIds.map(async (x) => {
    await Book.findOneAndDelete(x);
  });

  // code 200 is ok too
  res.status(204).json();
};
