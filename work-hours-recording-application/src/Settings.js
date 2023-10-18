import { useState } from "react";

function Settings() {
    const [theme, setTheme] = useState('');
    const [mode, setMode] = useState('');


    const addToApi = async (key, value) => {
        const requestBody = { [key]: value };
        await fetch('/settings', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        })
            .then(resp => resp.json())
            .then(data => {
                console.log(`${key} changed to '${value}'`);
            });
    }


    const applySettings = () => {
        const newTheme = document.getElementById('theme').value;
        const newMode = document.getElementById('mode').value;
        if (theme !== newTheme) {
            setTheme(newTheme);
            const body = document.getElementsByTagName('body')[0];
            body.style.backgroundColor = (newTheme === 'light') ? 'whitesmoke' : '#354657';
            body.style.color = (newTheme === 'light') ? 'black' : 'whitesmoke';
            addToApi('theme', newTheme);
        }
        if (mode !== newMode) {
            setMode(newMode);
        }
    }


    return (
        <div className='settings'>
            <label htmlFor='theme' style={{ marginRight: '20px' }}>Color theme: </label>
            <select id='theme' name='theme' style={{ marginRight: '30px' }} defaultValue={'default'}>
                <option disabled value='default'>Select Theme</option>
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