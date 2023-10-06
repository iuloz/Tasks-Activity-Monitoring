import { Link } from 'react-router-dom';
import './styles.css'


// This is main menu view, from where user can choose what to see.
function Menu() {

    return (
        <div className='menu'>
                <Link className='link' to='/make-recording'>Add task</Link>
                <Link className='link' to='/recordings'>See all recordings</Link>
                <Link className='link' to='/about'>About</Link>
        </div>
    )
}

export default Menu;