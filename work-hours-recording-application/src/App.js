import Menu from "./Menu";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import HoursRecordings from "./HoursRecordings";
import About from "./About";
import AllRecordings from "./AllRecordings";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Menu/>}/>
                <Route path="/make-recording" element={<HoursRecordings/>}/>
                <Route path="/about" element={<About/>}/>
                <Route path="/recordings" element={<AllRecordings/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
