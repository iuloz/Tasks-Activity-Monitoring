import { Link } from 'react-router-dom';
import './styles.css'



function Menu() {

    return (
        <div className='menu'>
            <Link className='link' to='/tasks'>See all tasks</Link>
            <Link className='link' to='/summary'>Summary</Link>
            <Link className='link' to='/about'>About</Link>
            <Link id='settings_link' className='link' to='/settings'>Settings</Link>
        </div>
    )
}

export default Menu;