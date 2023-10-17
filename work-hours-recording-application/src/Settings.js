import { useEffect, useState } from "react";

function Settings() {
    const [theme, setTheme] = useState('light');
    const [mode, setMode] = useState('multiple');

    useEffect(() => {
        const body = document.getElementsByTagName('body')[0];
            body.style.backgroundColor = (theme === 'light') ? 'whitesmoke' : 'darkgray';
    }, [theme, mode]);

    const applySettings = () => {
        const newTheme = document.getElementById('theme').value;
        const newMode = document.getElementById('mode').value;
        if (theme !== newTheme) {
            setTheme(newTheme);
        }
        if (mode !== newMode) {
            setMode(newMode);
        }
    }


    return (
        <div className='settings'>
            <label htmlFor='theme' style={{ marginRight: '20px' }}>Color theme: </label>
            <select id='theme' name='theme'>
                <option id='light' value='light'>Light</option>
                <option id='dark' value='dark'>Dark</option>
            </select>
            <br />
            <label htmlFor='mode' style={{ marginRight: '20px' }}>Number of active tasks at a time: </label>
            <select id='mode' name='mode'>
                <option value='all'>Multiple</option>
                <option value='one'>One</option>
            </select>
            <br />
            <button id='apply_settings' onClick={applySettings}>Apply</button>
        </div>
    );
}


export default Settings;