import React from 'react';
import NavbarMain from '../components/Navbar';
import Footer from '../components/Footer';

function HomePage() {
    
    return (
        <main>
            <header>
                <NavbarMain/>
            </header>
            <section className="aboutSection">
                <h2>Our App, blah blah blah </h2>
            </section>
            <section>
                <p> filter: </p>
                <p> create event button</p>
            </section>
            <section>
            <p> LOTs of Stuff </p>
            </section>
            <section>
            <p> LOTs of Stuff </p>
            </section>
            <section>
                <p> LOTs of Stuff </p>
            </section>
            <footer>
                <Footer/>
            </footer>
        </main>
    );
}

export default HomePage;