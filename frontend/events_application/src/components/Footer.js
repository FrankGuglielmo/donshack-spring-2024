import { Container, Row, Col, Stack, Image, Nav, NavLink } from "react-bootstrap"
import Logo from '../imgs/clixz_logo.png';

export default function Footer() {
    return (
        <footer className="footer mt-2 text-white" style={{ backgroundColor: "#C4D6E6" }}>
            <Container fluid>
                <Row>
                    <Col>
                        <div className='credits pt-3'>
                            <p>&copy; 2025 Clixz <img
                                src={Logo}
                                alt="logo"
                                style={{ height: '30px', p: '2%', justifyContent: 'center', alignItems: 'center' }}
                            />
                            All rights reserved.</p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}

