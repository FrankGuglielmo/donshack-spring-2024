import Button from "react-bootstrap/Button";
import NavbarMain from "../components/Navbar";
import Footer from "../components/Footer";

function NewEvent() {
  return (
    <main>
      <header>
        <NavbarMain />
      </header>
      <h1> Welcome to creating a new event!</h1>
      <footer>
        <Footer />
      </footer>
    </main>
  );
}

export default NewEvent;
