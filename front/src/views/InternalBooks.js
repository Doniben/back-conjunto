import React, { useEffect, useState } from "react";

// reactstrap components
import {
  Button,
  Collapse,
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

import { ToastContainer, toast } from "react-toastify";

// core components
import PanelHeader from "components/PanelHeader/PanelHeader.js";
import axios from "axios";
``;
function InternalBooks() {
  //search on internal dataBase
  const [resultadosInternos, setResultadosInternos] = useState([]);

  // function take all books internal db
  const busquedaInterna = async () => {
    const url_Int = "http://localhost:4000/api/books";

    try {
      const dataInterna = await axios.get(url_Int).then((response) => {
        setResultadosInternos(response.data);
        console.log(response.data);
      });
    } catch (error) {
      alert("some thing was happened");
    }
  };

  //hooks values
  const [mainText, setMainText] = useState("");
  const [Autor, setAutor] = useState("");
  const [Category, setCategory] = useState("");
  const [PublishDate, setPublishDate] = useState("");

  //handlers values fields filters
  const handleTitleOrIsbnInput = ({ target }) => {
    setMainText(target.value);
  };
  const handleAutorInput = ({ target }) => {
    setAutor(target.value);
  };
  const handleCategoryInput = ({ target }) => {
    setCategory(target.value);
  };
  const handlePublishDateInput = ({ target }) => {
    setPublishDate(target.value);
  };

  //hooks for control fields filters
  const [isOpenAutor, setIsOpenAutor] = useState(false);
  const openAutor = () => setIsOpenAutor(!isOpenAutor);

  const [isFecha, setIsFecha] = useState(false);
  const openFecha = () => setIsFecha(!isFecha);

  const [isCategoria, setIsCategoria] = useState(false);
  const openCategoria = () => setIsCategoria(!isCategoria);

  const [field_isbn, setField_isbn] = useState(false);
  const handleIsbn = () => {
    titulo();
    setField_isbn(!field_isbn);
  };

  const [isOpen, setIsOpen] = useState(false);

  const titulo = () => {
    setIsOpen(!isOpen);
    setIsOpenAutor(false);
    setIsCategoria(false);
    setIsFecha(false);
  };

  const toggle = () => {
    titulo();
  };

  //funtion Filter books
  const busquedaGeneral = async () => {
    //prevent open filters when search
    setIsOpen(false);
    setIsOpenAutor(false);
    setIsCategoria(false);
    setIsFecha(false);

    //Request internal DB
    const url_Int = "http://localhost:4000/api/books/titulo"; //URI server
    let body = {};

    if (
      (field_isbn == "") &
      (Autor == "") &
      (Category == "") &
      (PublishDate == "")
    ) {
      busquedaInterna();
    } else {
      if (field_isbn) {
        body = { isbn: mainText };
      } else {
        if (Autor != "") body.autor = Autor;
        if (Category != "") body.category = Category;
        if (PublishDate != "") body.publicationDate = PublishDate;
      }
      try {
        const dataInterna = await axios({
          method: "POST",
          headers: { "content-type": "application/json" },
          data: JSON.stringify(body), // <---- This step it is important
          url: url_Int,
        }).then((response) => {
          setResultadosInternos(response.data);
          console.log(response.data);
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  //hooks for control modal component
  const [modal, setModal] = useState(false);
  const [infoModal, setInfomodal] = useState({});

  //function delete book
  const deletebook = async () => {
    const url = "http://localhost:4000/api/books/" + infoModal["_id"];
    try {
      const peticionEliminacion = await axios({
        method: "DELETE",
        headers: {
          "x-access-token":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxYjliY2Y4NDc3ZTQxMTg0Y2QyYTRmYyIsImlhdCI6MTYzOTU3Njc3NywiZXhwIjoxNjM5NjYzMTc3fQ.2xdvkQGlZFRSP06bAp_NwB_FOoHEw9VKaADD-osKAoY",
        }, // <---- This step it is important
        url: url,
      }).then((response) => {
        const notify = () => toast("El libro fue eliminado correctamente");
        notify();
        setModal(false);
        busquedaInterna();
      });
    } catch (error) {
      console.log(error);
      alert("someThing was happened");
    }
  };

  //hook for edition mode

  const [Edition_title, setEdition_title] = useState("");
  const [Edition_description, setEdition_description] = useState("");
  const [Edition_autor, setEdition_autor] = useState("");
  const [Edition_publish_date, setEdition_publish_date] = useState("");
  const [Edition_editorial, setEdition_editorial] = useState("");
  const [Edition_categorias, setEdition_categorias] = useState("");

  const handle_edit_title = ({ target }) => {
    setEdition_title(target.value);
  };

  const handle_edit_description = ({ target }) => {
    setEdition_description(target.value);
  };

  const [Edition_mode, setEdition_mode] = useState(false);
  const handle_edition_mode = () => {
    infoModal.title
      ? setEdition_title(infoModal.title)
      : setEdition_title("No hay titulo");

    infoModal.description
      ? setEdition_description(infoModal.description)
      : setEdition_description("No hay nada");

    infoModal.autor
      ? setEdition_autor(infoModal.autor)
      : setEdition_autor("No hay titulo");

    infoModal.publicationDate
      ? setEdition_publish_date(infoModal.publicationDate)
      : setEdition_publish_date("No hay fecha");

    infoModal.publicationDate
      ? setEdition_editorial(infoModal.editor)
      : setEdition_editorial("No hay editor");

    infoModal.publicationDate
      ? setEdition_categorias(infoModal.category)
      : setEdition_categorias("No hay categorias");

    setEdition_mode(!Edition_mode);
  };

  //function that search more information and display modal
  const handleModal = async (prop) => {
    setEdition_mode(false);
    setInfomodal(prop);
    setModal(!modal);
  };

  const guardado = async () => {
    const urlInt = "http://localhost:4000/api/books/";
    let body = {
      title: Edition_title,
      description: Edition_description,
      autor: Edition_autor,
      editor: Edition_editorial,
      publicationDate: Edition_publish_date,
      category: Edition_categorias,
    };
    const tokenAccess =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxYTliZjU2ZDZhYjhlOGEzYTI3NTNlMyIsImlhdCI6MTY0MDI2MzIwNiwiZXhwIjoxNjQwMzQ5NjA2fQ.GLUilPihwoNg6VrVKA5x77TPnvfGPqjuk501dRTb3nU";
    try {
      const peticion_de_actualizcion = await axios({
        method: "PUT",
        headers: {
          "content-type": "application/json",
          "x-access-token": tokenAccess,
        },
        data: JSON.stringify(body), // <---- This step it is important
        url: urlInt + "/" + infoModal._id,
      }).then((response) => {
        const notify = () => toast("El libro fue actulizado correctamente");
        notify();
        setModal(false);
        busquedaInterna();
      });
    } catch (error) {
      console.log(error);
    }
  };

  //funtion call books
  useEffect(() => {
    busquedaInterna();
  }, []);

  return (
    <>
      <PanelHeader size="sm" />
      <div className="content">
        <Row>
          <Col md={12}>
            <Card>
              <CardHeader>
                <InputGroup className="no-border">
                  <Input
                    placeholder={
                      field_isbn
                        ? "Buscar por numero ISBN"
                        : "Buscar por titulo"
                    }
                    value={mainText}
                    onChange={handleTitleOrIsbnInput}
                  />
                  <InputGroupAddon addonType="append">
                    <InputGroupText onClick={busquedaGeneral}>
                      <a>
                        <i className="now-ui-icons ui-1_zoom-bold" />
                      </a>
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                <div>
                  <Button
                    color="primary"
                    onClick={toggle}
                    style={{ marginBottom: "1rem" }}
                  >
                    Filtros
                  </Button>
                  <Collapse isOpen={isOpen}>
                    <Card>
                      <CardBody>
                        {field_isbn ? (
                          <Button onClick={handleIsbn}>Titulo</Button>
                        ) : (
                          <div>
                            <Button onClick={handleIsbn}>ISBN</Button>
                            <Button onClick={openAutor}>Autor</Button>
                            <Button onClick={openCategoria}>Categoria</Button>
                            <Button onClick={openFecha}>
                              Fecha de publicion
                            </Button>
                          </div>
                        )}
                      </CardBody>
                    </Card>
                  </Collapse>
                </div>

                <Collapse isOpen={isOpenAutor}>
                  <Card>
                    <CardBody>
                      <InputGroup>
                        <Input value={Autor} onChange={handleAutorInput} />
                      </InputGroup>
                      <p>Escriba el autor</p>
                    </CardBody>
                  </Card>
                </Collapse>

                <Collapse isOpen={isCategoria}>
                  <Card>
                    <CardBody>
                      <InputGroup>
                        <Input
                          value={Category}
                          onChange={handleCategoryInput}
                        />
                      </InputGroup>
                      <p>Escriba categoria</p>
                    </CardBody>
                  </Card>
                </Collapse>

                <Collapse isOpen={isFecha}>
                  <Card>
                    <CardBody>
                      <InputGroup>
                        <Input
                          value={PublishDate}
                          onChange={handlePublishDateInput}
                        />
                      </InputGroup>
                      <p>Escriba la fecha</p>
                    </CardBody>
                  </Card>
                </Collapse>

                <h5 className="title">Encuentra tu libro</h5>
                <p className="category">
                  Recuerda que es una base de datos libre{" "}
                  <a href="https://nucleoapp.com/?ref=1712">Library</a>
                </p>
              </CardHeader>
              <CardBody className="all-icons">
                <Row>
                  {resultadosInternos ? (
                    resultadosInternos.map((prop, key) => {
                      return (
                        <Col
                          lg={2}
                          md={3}
                          sm={4}
                          xs={6}
                          className="font-icon-list"
                          key={key}
                        >
                          <div className="font-icon-detail">
                            {/*Function handler empty field isbn */}
                            <p>Fuente Interna</p>
                            <br />
                            {prop.image ? (
                              <img src={prop.image} height={"150px"} />
                            ) : (
                              <p>"No image"</p>
                            )}
                            <p>titulo: {prop.title}</p>
                            <p>
                              nombre/s autore/s:{" "}
                              {prop.autor ? prop.autor[0] : "anonimo"}
                            </p>
                            <p>
                              fecha de publicacion:{" "}
                              {prop.publicationDate
                                ? prop.publicationDate[0]
                                : "No hay fecha"}
                            </p>
                            <Button
                              color="info"
                              onClick={() => {
                                handleModal(prop);
                              }}
                            >
                              Visualizar
                            </Button>
                          </div>
                        </Col>
                      );
                    })
                  ) : (
                    <h3>NO HAY RESULTADOS</h3>
                  )}
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <div>
          <Modal isOpen={modal} toggle={handleModal}>
            {Edition_mode ? (
              <Input value={Edition_title} onChange={handle_edit_title} />
            ) : (
              <ModalHeader toggle={handleModal}>{infoModal.title}</ModalHeader>
            )}
            <ModalBody>
              {infoModal.image ? (
                <img src={infoModal.image} />
              ) : (
                <img src="https://image.freepik.com/foto-gratis/libro-lupa_127657-11249.jpg" />
              )}
              <br />
              <h4>Descripcion</h4>
              {Edition_mode ? (
                <Input
                  type="textarea"
                  value={Edition_description}
                  onChange={handle_edit_description}
                />
              ) : infoModal.description ? (
                infoModal.description
              ) : (
                "no hay descripcion alguna"
              )}
              <br />
              <br />

              <p>
                Autor :{" "}
                {Edition_mode ? (
                  <Input
                    type="textarea"
                    value={Edition_autor}
                    onChange={handleAutorInput}
                  />
                ) : infoModal.autor ? (
                  infoModal.autor + " "
                ) : (
                  "No hay autor"
                )}
              </p>

              <p>
                Fecha de publicacion:{" "}
                {Edition_mode ? (
                  <Input
                    type="textarea"
                    value={Edition_publish_date}
                    onChange={handleAutorInput}
                  />
                ) : infoModal.publicationDate ? (
                  infoModal.publicationDate[0]
                ) : (
                  "No hay fecha de publicacion"
                )}
              </p>

              <p>
                Editorial:{" "}
                {Edition_mode ? (
                  <Input
                    type="textarea"
                    value={Edition_editorial}
                    onChange={handleAutorInput}
                  />
                ) : infoModal.editor ? (
                  infoModal.editor[0]
                ) : (
                  "No hay registro de editorial"
                )}
              </p>

              <p>
                categorias:{" "}
                {Edition_mode ? (
                  <Input
                    type="textarea"
                    value={Edition_categorias}
                    onChange={handleAutorInput}
                  />
                ) : infoModal.category ? (
                  infoModal.category + " "
                ) : (
                  "No hay categorias"
                )}
              </p>
            </ModalBody>

            <ModalFooter>
              {Edition_mode ? (
                <Button color="success" onClick={guardado}>
                  guardar
                </Button>
              ) : (
                ""
              )}
              <Button color="info" onClick={handle_edition_mode}>
                {Edition_mode ? "cerrar edicion" : "Editar"}
              </Button>
              <Button color="danger" onClick={deletebook}>
                Eliminar
              </Button>{" "}
              <Button color="secondary" onClick={handleModal}>
                Cerrar
              </Button>
            </ModalFooter>
          </Modal>
        </div>
        <ToastContainer />
      </div>
    </>
  );
}

export default InternalBooks;
