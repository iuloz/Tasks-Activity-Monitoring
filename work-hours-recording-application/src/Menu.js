import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './styles.css'



function Menu() {
    const navigate = useNavigate();

    useEffect(() => {
        const body = document.getElementsByTagName('body')[0];
        fetch('/settings')
            .then(response => response.json())
            .then(data => {
                body.style.backgroundColor = (data.theme === 'dark') ? '#354657' : 'whitesmoke';
                body.style.color = (data.theme === 'dark') ? 'whitesmoke' : 'black';
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);





    return (
        <div className='menu'>
            <Link className='link' to='/make-recording'>Add task</Link>
            <Link className='link' to='/recordings'>See all tasks</Link>
            <Link className='link' to='/about'>About</Link>
            <button className='settings-btn' onClick={() => navigate('/settings')}>Settings</button>
        </div>
    )
}

export default Menu;