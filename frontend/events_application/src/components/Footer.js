import { Container, Row, Col, Stack, Image, Nav, NavLink } from "react-bootstrap"

function Footer() {
    return (
        <footer>
            <Container fluid>
                <Row className="bg-primary text-white">
                    <Col > Column1 </Col>
                    <Col> Column2 </Col>
                    <Col> Column3 </Col>
                </Row>
            </Container>
        </footer>
    );
}

export default Footer;