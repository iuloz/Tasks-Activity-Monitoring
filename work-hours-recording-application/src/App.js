import Menu from './Menu';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Tasks from './Tasks';
import About from './About';
import AllRecordings from './AllRecordings';

function App() {
    return (
        <BrowserRouter>
            <Menu />
            <Routes>
                <Route path='/' element={null}/>
                <Route path='/make-recording' element={<Tasks/>}/>
                <Route path='/about' element={<About/>}/>
                <Route path='/recordings' element={<AllRecordings/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
