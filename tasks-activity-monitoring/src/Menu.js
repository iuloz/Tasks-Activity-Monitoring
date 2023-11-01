import { Link } from 'react-router-dom';
import './styles.css'



function Menu() {
    // const navigate = useNavigate();

    return (
        <div className='menu'>
            {/* <Link className='link' to='/make-recording'>Add task</Link> */}
            <Link className='link' to='/recordings'>See all tasks</Link>
            <Link className='link' to='/summary'>Summary</Link>
            <Link className='link' to='/about'>About</Link>
            <Link id='settings_link' className='link' to='/settings'>Settings</Link>
        </div>
    )
}

export default Menu;