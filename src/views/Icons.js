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
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Form,
} from "reactstrap";

// core components
import PanelHeader from "components/PanelHeader/PanelHeader.js";
import axios from "axios";

function Icons() {
  //search on exernal dataBase
  const [resultado, setResultados] = useState([]);
  const [texto, setTexto] = useState("");
  const busqueda = async () => {
    const url = "http://openlibrary.org/search.json?q=";
    const uri = url + texto;
    console.log(texto);
    try {
      const data = await axios.get(uri).then((response) => {
        response = response.data;
        console.log(response);
        setResultados(response.docs);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const editorial = async (clave) => {
    const direccion = "https://openlibrary.org/books/" + clave + ".json";
    try {
      const consulta = await axios(direccion)
        .then((r) => {
          r = r.date;
        })
        .then((r) => {
          return r.publisher;
        });
    } catch (error) {
      return "no found";
    }
  };

  //handler value input text
  const handleInpuntChange = ({ target }) => {
    setTexto(target.value);
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
                    <InputGroupText onClick={busqueda}>
                      <i className="now-ui-icons ui-1_zoom-bold" />
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>

                <h5 className="title">Encuentra tu libro</h5>
                <p className="category">
                  Recuerda que es una base de datos libre{" "}
                  <a href="https://nucleoapp.com/?ref=1712">Library</a>
                </p>
              </CardHeader>
              <CardBody className="all-icons">
                <Row>
                  {resultado.map((prop, key) => {
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
                              ? prop.publish_date + " "
                              : "No hay fecha"}
                          </p>
                          {/* map request from other map request experimental */}
                          {/* <p>
                            Editorial:{" "}
                            {prop.edition_key
                              ? prop.edition_key.map((clave) =>
                                  editorial(clave)
                                )
                              : "No hay fecha"}
                          </p> */}
                          <p>{prop.isbn ? prop.isbn[0] : "Don't isbn"}</p>
                        </div>
                      </Col>
                    );
                  })}
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Icons;
