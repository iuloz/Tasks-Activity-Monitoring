function Settings() {
    return (
        <div className='settings'>
            <label htmlFor='theme' style={{marginRight:'20px'}}>Color theme: </label>
            <select id='theme' name='theme'>
                <option value='light'>Light</option>
                <option value='dark'>Dark</option>
            </select>
            <br/>
            <label htmlFor='task_display' style={{marginRight:'20px'}}>Number of active tasks at a time: </label>
            <select id='task_display' name='task_display'>
                <option value='all'>Multiple</option>
                <option value='one'>One</option>
            </select>
        </div>
    );
}


export default Settings;