import { Button, Col, Input, Row } from "reactstrap";
import "./style_ingreso.css";

export default function Ingreso() {
  return (
    <div className="contenedor">
      <Row>
        <Col className="left">
          {/* <img src="https://i.imgur.com/jHRx5Mb.jpg" /> */}
          <div className="imagen"></div>
        </Col>
        <Col>
          <h1>Bienvenido ingrese su correo y clave para ingresar</h1>
          <div className="campos_texto">
            <Input type="text" />
            <Input type="password" />
          </div>
          <Button color="info">Ingresar</Button>
        </Col>
      </Row>
    </div>
  );
}
