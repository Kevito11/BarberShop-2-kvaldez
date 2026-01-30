import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Gallery from './components/Gallery';

import Contact from './components/Contact';
import HelpButton from './components/HelpButton';
import './App.css';

function App() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Services />
      <Gallery />
      <Contact />
      <HelpButton />
    </main>
  );
}

export default App;
