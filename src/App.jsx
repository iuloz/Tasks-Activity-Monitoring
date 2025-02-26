import Menu from './Menu.jsx';
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import About from './About.jsx';
import AllRecordings from './AllRecordings.jsx';
import Settings from './Settings.jsx';
import Summary from './Summary.jsx';


function App() {

  // Fetching theme to set the colors when app is launched
  useEffect(() => {
    const body = document.getElementsByTagName('body')[0];
    fetch('http://localhost:3010/settings')
      .then(response => response.json())
      .then(data => {
        body.style.backgroundColor = (data.theme === 'dark') ? '#354657' : 'whitesmoke';
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);


  return (
    <BrowserRouter>
      <Menu />
      <Routes>
        <Route path='/' element={null} />
        <Route path='/about' element={<About />} />
        <Route path='/tasks' element={<AllRecordings />} />
        <Route path='/summary' element={<Summary />} />
        <Route path='/settings' element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
