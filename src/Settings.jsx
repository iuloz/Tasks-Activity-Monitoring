import { useEffect, useState } from "react";

function Settings() {
  const [theme, setTheme] = useState('');
  const [mode, setMode] = useState('');
  const [tasks, setTasks] = useState([]);



  // Fetching all tasks objects from db.json
  useEffect(() => {
    fetch('http://localhost:3010/tasks')
      .then(response => response.json())
      .then(data => setTasks(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Updating db.json settings content
  const addToApi = async (key, value) => {
    const requestBody = { [key]: value };
    await fetch('http://localhost:3010/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    })
      .then(resp => resp.json())
      .then(data => {
        console.log(`${key} changed to '${value}'`);
      });
  }

  // Applying settings
  const applySettings = async () => {
    const newTheme = document.getElementById('theme').value;
    const newMode = document.getElementById('mode').value;

    if (theme !== newTheme && newTheme !== 'default') {
      setTheme(newTheme);
      const body = document.getElementsByTagName('body')[0];
      body.style.backgroundColor = (newTheme === 'light') ? 'whitesmoke' : '#354657';
      await addToApi('theme', newTheme);
    }

    // Checks the mode. If it is 'single active task' mode, all active tasks become inactive except last one
    // and status is changed in db.json
    if (mode !== newMode && newMode !== 'default') {
      setMode(newMode);
      await addToApi('mode', newMode);
      if (newMode === 'one') {
        let lastActive = null;
        for (const task of tasks) {
          if (task.status === 'Active') {
            lastActive = task;
            await fetch(`http://localhost:3010/tasks/${task.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'Inactive' })
            })
              .then(resp => resp.json())
              .catch(error => {
                console.error('Error:', error);
              });
          }
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        if (lastActive !== null) {
          await fetch(`http://localhost:3010/tasks/${lastActive.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'Active' })
          })
            .then(resp => resp.json())
            .then(() => console.log('Mode has been changed'))
            .catch(error => {
              console.error('Error:', error);
            });
          console.log('Disabled all tasks but one');
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }
    }
  }


  return (
    <div className='settings'>
      <label className='settings-label' htmlFor='theme' style={{ marginRight: '20px', fontSize: '1.1rem' }}>Theme: </label>
      <select id='theme' name='theme' defaultValue={'default'}>
        <option disabled value='default'>Select Theme</option>
        <option id='light' value='light'>Light</option>
        <option id='dark' value='dark'>Dark</option>
      </select>
      <br />
      <label className='settings-label' htmlFor='mode' style={{ marginRight: '20px', fontSize: '1.1rem' }}>Show active tasks at a time: </label>
      <select id='mode' name='mode' defaultValue={'default'}>
        <option disabled value='default'>Select Mode</option>
        <option value='multiple'>Multiple</option>
        <option value='one'>One</option>
      </select>
      <br />
      <br />
      <button id='apply_settings' onClick={applySettings}>Apply</button>
    </div>
  );
}


export default Settings;