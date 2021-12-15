import React, { useState } from "react";
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

function BusquedaLibros() {
  //search on exernal dataBase
  const [resultadosExternos, setResultadosExternos] = useState([]);
  const [resultadosInternos, setResultadosInternos] = useState([]);

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

  //funtion search and set values internals and external
  const busquedaGeneral = async () => {
    //prevent open filters when search
    setIsOpen(false);
    setIsOpenAutor(false);
    setIsCategoria(false);
    setIsFecha(false);

    //Request internal DB
    const url_Int = "https://api-books-tp.herokuapp.com/api/books/titulo"; //URI server
    let body = {};
    if (mainText != "") {
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

      //Request external DB
      const url_Ext = "https://openlibrary.org/search.json?q=";
      const uri_Ext = url_Ext + mainText;

      console.log(mainText);

      try {
        const data = await axios.get(uri_Ext).then((response) => {
          response = response.data;
          console.log(response);
          setResultadosExternos(response.docs);
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  //hooks for control modal component
  const [modal, setModal] = useState(false);
  const [infoModal, setInfomodal] = useState({});
  const [descripcion, setDescripcion] = useState("");

  //function that search more information and display modal
  const handleModal = async (prop) => {
    setInfomodal(prop);
    if (prop.isbn) {
      const urlDescripcion =
        "https://openlibrary.org/api/books?bibkeys=ISBN:" +
        prop.isbn[0] +
        "&jscmd=details&format=json";
      try {
        const data = await axios.get(urlDescripcion).then((response) => {
          response = response.data;

          if (response["ISBN:" + prop.isbn[0]].details.description) {
            if (response["ISBN:" + prop.isbn[0]].details.description.value) {
              setDescripcion(
                response["ISBN:" + prop.isbn[0]].details.description.value
              );
            } else if (response["ISBN:" + prop.isbn[0]].details.description) {
              setDescripcion(
                response["ISBN:" + prop.isbn[0]].details.description
              );
            }
          } else {
            setDescripcion("No hay descripcion");
          }
        });
      } catch (error) {
        console.log(error);
      }
    }

    setModal(!modal);
  };

  //function that get values of modal and placed in db internal
  const passOutInt = async () => {
    const urlInt = "http://localhost:4000/api/books/";
    const body = {
      isbn: infoModal.isbn ? infoModal.isbn[0] : "no hay isbn",
      title: infoModal.title ? infoModal.title : "error",
      subtitle: infoModal.language ? infoModal.language : ["no info"],
      autor: infoModal.author_name ? [infoModal.author_name] : ["No hay autor"],
      category: infoModal.subject
        ? [infoModal.subject[0]]
        : ["no hay categoria"],
      publicationsDate: infoModal.publish_date
        ? [infoModal.publish_date[0]]
        : ["No hay fecha"],
      editor: infoModal.publisher_facet
        ? [infoModal.publisher_facet[0]]
        : ["no hay info editor"],
      description: descripcion,
      image:
        "http://covers.openlibrary.org/b/isbn/" + infoModal.isbn[0] + ".jpg",
    };
    try {
      const peticionGuardado = await axios({
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-access-token":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxYTliZjU2ZDZhYjhlOGEzYTI3NTNlMyIsImlhdCI6MTYzODczNzg3NiwiZXhwIjoxNjM4ODI0Mjc2fQ.Fvu-DitH251KHfvIYprka_6pXH7omDpWmULVSrntnsY",
        },
        data: JSON.stringify(body), // <---- This step it is important
        url: urlInt,
      }).then((response) => {
        const notify = () =>
          toast("El libro fue agregado a la base interna correctamente");
        notify();
        setModal(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  //hooks of filter
  const [field_isbn, setField_isbn] = useState(false);
  const handleIsbn = () => {
    titulo();
    setField_isbn(!field_isbn);
  };

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
                  {resultadosInternos.map((prop, key) => {
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
                            {prop.autor ? prop.autor + " " : "anonimo"}
                          </p>
                          <p>
                            fecha de publicacion:{" "}
                            {prop.publicationDate
                              ? prop.publicationDate + " "
                              : "No hay fecha"}
                          </p>
                          <Button>Visualizar</Button>
                        </div>
                      </Col>
                    );
                  })}

                  {resultadosExternos.map((prop, key) => {
                    return (
                      <Col
                        lg={2}
                        md={3}
                        sm={4}
                        xs={6}
                        className="font-icon-list"
                        key={key}
                      >
                        <div className="font-icon-detail moditify">
                          {/*Function handler empty field isbn */}
                          <p style={{ color: "black" }}>Fuente externa</p>
                          <br />
                          {prop.isbn ? (
                            <img
                              src={
                                "http://covers.openlibrary.org/b/isbn/" +
                                prop.isbn[0] +
                                ".jpg"
                              }
                              height={"150px"}
                            />
                          ) : (
                            <p style={{ color: "black" }}>"No image"</p>
                          )}
                          <p style={{ color: "black" }}>titulo: {prop.title}</p>
                          <p style={{ color: "black" }}>
                            nombre/s autore/s:{" "}
                            {prop.author_name
                              ? prop.author_name + " "
                              : "anonimo"}
                          </p>
                          <p style={{ color: "black" }}>
                            fecha de publicacion:{" "}
                            {prop.publish_date
                              ? prop.publish_date[0] + " "
                              : "No hay fecha"}
                          </p>
                          <Button
                            color="info"
                            onClick={() => {
                              handleModal(prop);
                            }}
                          >
                            {" "}
                            ver Detalles{" "}
                          </Button>
                        </div>
                      </Col>
                    );
                  })}
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <div>
          <Modal isOpen={modal} toggle={handleModal}>
            <ModalHeader toggle={handleModal}>{infoModal.title}</ModalHeader>
            <ModalBody>
              {infoModal.isbn ? (
                <img
                  src={
                    "http://covers.openlibrary.org/b/isbn/" +
                    infoModal.isbn[0] +
                    ".jpg"
                  }
                />
              ) : (
                <img src="https://image.freepik.com/foto-gratis/libro-lupa_127657-11249.jpg" />
              )}
              <br />
              <h4>Descripcion</h4>
              {descripcion ? descripcion : "no hay descripcion"}
              <br />
              <p>
                Fecha de publicacion:{" "}
                {infoModal.publish_date
                  ? infoModal.publish_date[0]
                  : "No hay fecha de publicacion"}
              </p>
              <p>
                Editorial:{" "}
                {infoModal.publisher
                  ? infoModal.publisher[0]
                  : "No hay registro de editorial"}
              </p>
              <p>
                Genero:{" "}
                {infoModal.subject
                  ? infoModal.subject[0]
                  : "No hay registro de editorial"}
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={passOutInt}>
                Agregar a base de datos
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

export default BusquedaLibros;
