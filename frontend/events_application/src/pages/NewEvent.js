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
      <div
        style={{
          textAlign: "left",
        }}
      >
        TODO:
        <ul>
          <li>html form input types (i.e. dropdown for state)</li>
          <li>required fields</li>
          <li> idk j make it look good smh</li>
        </ul>
      </div>
      <div>
        <form>
          <label for="fname">Event title:</label>
          <br></br>
          <input type="text" id="fname" name="fname"></input>
          <br></br>
          <label for="fname">Date:</label>
          <br></br>
          <input type="text" id="fname" name="fname"></input>
          <br></br>
          <label for="fname">Time:</label>
          <br></br>
          <input type="text" id="fname" name="fname"></input>
          <br></br>
          <p>Location:</p>
          <label for="fname">City:</label>
          <br></br>
          <input type="text" id="fname" name="fname"></input>
          <br></br>
          <label for="fname">State:</label>
          <br></br>
          <input type="text" id="fname" name="fname"></input>
          <br></br>
          <label for="lname">Description:</label>
          <br></br>
          <input type="text" id="lname" name="lname"></input>
        </form>
      </div>
      <footer>
        <Footer />
      </footer>
    </main>
  );
}

export default NewEvent;
