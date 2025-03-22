import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Issuer from "./Issuer";
import Verifier from "./Verifier";
import Home from "./Home";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="container">
        
        <nav className="fixed-top body-tertiary" >
          <Link className="ref" to="/">Home</Link>
          <Link className="ref" to="/issuer">Issuer</Link>
          <Link className="ref" to="/verifier">Verifier</Link>
        </nav>
       
        
          <Routes>
            <Route path="/issuer" element={<Issuer />} />
            <Route path="/verifier" element={<Verifier />} />
            <Route path="/" element={<Home />} />
          </Routes>
        
          </div>
    </Router>
    
  );
};

export default App;
