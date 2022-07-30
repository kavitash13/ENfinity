import NavBar from "./components/Navbar";
import ChooseFile from "./pages/ChooseFile";
//import LoginPage from "./pages/LoginPage";
import "bootstrap/dist/css/bootstrap.min.css";
//import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SummaryOfColumn from "./pages/SummaryOfColumn";
import { Container } from "react-bootstrap";
import Visualizer from "./pages/Visualizer";
import GetExistingFiles from "./pages/GetExistingFiles"

function App() {
  return (
    <>
      {" "}
      <Router>
        <NavBar />
        <Container>
          <Routes>
            <Route exact path="/" element={<ChooseFile />} />
            <Route exact path="/login" element={<LoginPage />} />
            <Route
              exact
              path="/SummaryOfColumn"
              element={<SummaryOfColumn />}
            />
            <Route
              exact
              path="/visualizer"
              element={<Visualizer />}
            />
            <Route
              exact
              path="/get-existing-files"
              element={<GetExistingFiles />}
            />
            {/* <Route path="/" element={<Navigate replace to="/" />} /> */}
          </Routes>
        </Container>
      </Router>
    </>
  );
}

export default App;
