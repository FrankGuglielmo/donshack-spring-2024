import React from 'react';
import NavbarMain from '../components/Navbar';


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
        </main>
    );
}

export default HomePage;
