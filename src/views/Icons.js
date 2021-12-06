/*!

=========================================================
* Now UI Dashboard React - v1.5.0
=========================================================

* Product Page: https://www.creative-tim.com/product/now-ui-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/now-ui-dashboard-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
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
  ButtonGroup,
  Form,
} from "reactstrap";

// core components
import PanelHeader from "components/PanelHeader/PanelHeader.js";
import axios from "axios";

function Icons() {
  //search on exernal dataBase
  const [resultadosExternos, setResultadosExternos] = useState([]);
  const [resultadosInternos, setResultadosInternos] = useState([]);
  const [texto, setTexto] = useState("");
  const busquedaExterna = async () => {
    if (texto != "") {
      const url_Int = "http://localhost:4000/api/books/titulo";
      const body = { title: texto };

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

      const url_Ext = "http://openlibrary.org/search.json?q=";
      const uri_Ext = url_Ext + texto;

      console.log(texto);
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

  //handler value input text
  const handleInpuntChange = ({ target }) => {
    setTexto(target.value);
  };

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

  const [modal, setModal] = useState(false);
  const [infoModal, setInfomodal] = useState({});
  const [descripcion, setDescripcion] = useState("");
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
            setDescripcion(
              response["ISBN:" + prop.isbn[0]].details.description
            );
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
                    placeholder="Search..."
                    value={texto}
                    onChange={handleInpuntChange}
                  />
                  <InputGroupAddon addonType="append">
                    <InputGroupText onClick={busquedaExterna}>
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
                        <Button>idbn</Button>
                        <Button onClick={openAutor}>Autor</Button>
                        <Button onClick={titulo}>Titulo</Button>
                        <Button onClick={openCategoria}>Categoria</Button>
                        <Button onClick={openFecha}>Fecha de publicion</Button>
                      </CardBody>
                    </Card>
                  </Collapse>
                </div>

                <Collapse isOpen={isOpenAutor}>
                  <Card>
                    <CardBody>
                      <InputGroup>
                        <Input />
                      </InputGroup>
                      <p>Escriba el autor</p>
                    </CardBody>
                  </Card>
                </Collapse>

                <Collapse isOpen={isCategoria}>
                  <Card>
                    <CardBody>
                      <InputGroup>
                        <Input />
                      </InputGroup>
                      <p>Escriba categoria</p>
                    </CardBody>
                  </Card>
                </Collapse>

                <Collapse isOpen={isFecha}>
                  <Card>
                    <CardBody>
                      <InputGroup>
                        <Input />
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
                        <div className="font-icon-detail">
                          {/*Function handler empty field isbn */}
                          <p>Fuente externa</p>
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
                            <p>"No image"</p>
                          )}
                          <p>titulo: {prop.title}</p>
                          <p>
                            nombre/s autore/s:{" "}
                            {prop.author_name
                              ? prop.author_name + " "
                              : "anonimo"}
                          </p>
                          <p>
                            fecha de publicacion:{" "}
                            {prop.publish_date
                              ? prop.publish_date[0] + " "
                              : "No hay fecha"}
                          </p>
                          <Button
                            color="danger"
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
              {descripcion}
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
              <Button color="primary" onClick={handleModal}>
                Agregar a base de datos
              </Button>{" "}
              <Button color="secondary" onClick={handleModal}>
                Cerrar
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      </div>
    </>
  );
}

export default Icons;
