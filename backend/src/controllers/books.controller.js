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
  const { title } = req.body;
  try {
    const allBooks = await Book.find().then((response)=>{
      let resultado = [];
      let memoria = [];
      const titulo = response.filter(res => res.title = title);
      if (titulo) resultado.push(titulo);
      let minuscula = title.toLowerCase();
      const fragmentacion = minuscula.split(" ");
      
      const filtro = () =>{
        fragmentacion.map(x => {
          if (x.length > 3) memoria.push(x);
        })
        //filter repeat words
        memoria = Array.from(new Set(memoria));

        //run array search matchs 
        memoria.map((x) => {
          let filtrador = new RegExp(x,"ig");
          const busqueda = response.filter(element => filtrador.test(element.title));
          console.log(busqueda)
          if (busqueda.length > 0 ) resultado.push(busqueda);
        });

        resultado = resultado.reduce((ccl, ob) => (ccl.concat(ob)), []);
        resultado = Array.from(new Set(resultado));
        
        if(resultado.length > 0 ) res.status(200).json({resultados:resultado})
        else res.status(200).json({resultados:"no hay resultados"})
        
      }
      filtro();
    })  
    .catch((err) => {console.log(err)});
    
  } catch (error) {
    console.log(error);
    res.status(500).json({erro:"in the request"})
  }


};

export const getBooks = async (req, res) => {
 
    const books = await Book.find()
    .then((response)=>{
      console.log("fine")
      res.json(response);
    })
    .catch(err => {
      console.log(err)
      res.status(500);
    })

  
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
