import { Container, Row, Col, Stack, Image, Nav, NavLink } from "react-bootstrap"

export default function Footer() {
    return (
        <footer className="footer mt-2 text-white" style={{backgroundColor:"#C4D6E6"}}>
            <Container fluid>
                <Row>
                    <Col>
                        <div className='credits pt-3'>
                            <p>&copy; 2024 Clixz All rights reserved.</p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}

