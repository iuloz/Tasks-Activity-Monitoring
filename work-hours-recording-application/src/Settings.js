import { useEffect, useState } from "react";

function Settings() {
    const [theme, setTheme] = useState('');
    const [mode, setMode] = useState('');
    const [tasks, setTasks] = useState([]);




    useEffect(() => {
        fetch('/records')
            .then(response => response.json())
            .then(data => setTasks(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);


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


    const applySettings = async () => {
        const newTheme = document.getElementById('theme').value;
        const newMode = document.getElementById('mode').value;
        if (theme !== newTheme && newTheme !== 'default') {
            setTheme(newTheme);
            const body = document.getElementsByTagName('body')[0];
            body.style.backgroundColor = (newTheme === 'light') ? 'whitesmoke' : '#354657';
            body.style.color = (newTheme === 'light') ? 'black' : 'whitesmoke';
            await addToApi('theme', newTheme);
        }
        if (mode !== newMode) {
            setMode(newMode);
            await addToApi('mode', newMode);
            if (newMode === 'one') {
                let lastActive = null;
                for (const task of tasks) {
                    if (task.status === 'Active') {
                        lastActive = task;
                        await fetch(`/records/${task.id}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ status: 'Inactive' })
                        })
                            .then(resp => resp.json())
                            .then(() => console.log('Mode has been changed'))
                            .catch(error => {
                                console.error('Error:', error);
                            });
                    }
                    await new Promise(resolve => setTimeout(resolve, 200));
                }
                if (lastActive !== null) {
                    await new Promise(resolve => setTimeout(resolve, 200));
                    await fetch(`/records/${lastActive.id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status: 'Active' })
                    })
                        .then(resp => resp.json())
                        .then(() => console.log('Mode has been changed'))
                        .catch(error => {
                            console.error('Error:', error);
                        });
                }
            }
        }
    }


    return (
        <div className='settings'>
            <label htmlFor='theme' style={{ marginRight: '20px', fontSize: '1.2rem' }}>Color theme: </label>
            <select id='theme' name='theme' style={{ marginRight: '30px' }} defaultValue={'default'}>
                <option disabled value='default'>Select Theme</option>
                <option id='light' value='light'>Light</option>
                <option id='dark' value='dark'>Dark</option>
            </select>
            <br />
            <label htmlFor='mode' style={{ marginRight: '20px', fontSize: '1.2rem' }}>Number of active tasks at a time: </label>
            <select id='mode' name='mode' defaultValue={'default'}>
                <option disabled value='default'>Select Mode</option>
                <option value='multiple'>Multiple</option>
                <option value='one'>One</option>
            </select>
            <br />
            <button id='apply_settings' onClick={applySettings}>Apply</button>
        </div>
    );
}


export default Settings;