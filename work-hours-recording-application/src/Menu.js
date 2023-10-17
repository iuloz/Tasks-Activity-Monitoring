import { Link, useNavigate } from 'react-router-dom';
import './styles.css'


// This is main menu view, from where user can choose what to see.
function Menu() {
    const navigate = useNavigate();

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