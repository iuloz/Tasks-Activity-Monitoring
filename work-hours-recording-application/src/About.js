function About() {
    return (
        <div id='about'>
            <p>Author: Iurii Lozhkin</p>
            <p>
                This application allows to make time recordings for different tasks. When application is launched (using "npm start"), user can see main page with three different links. First link - "See all tasks" - leads to the view where user can add new tasks via form and see all exiting tags and filter them. Second link - "About" - shows this page, third link - "Settings" - allows to change color theme and mode of displaying active tasks (multiple or one at a time).
            </p>
            <p>
                Using the app is quite simple. To add a new task user needs to type task and tag for this task in corresponding input fields and after that press 'Add' button by clicking it or hitting 'Enter' button on keyboard.
            </p>
            <p>
                Each task element contains:
            </p>
            <ul>
                <li>task element creation date</li>
                <li>task description, which can be edited any time</li>
                <li>close button (looks like X in upper right part of the element), which deletes whole task element from the view</li>
                <li>tags, which can be edited (click on tag) and deleted (click 'x' on the right from each tag). It is possible to add new tag as well, pressing '+' sign at the bottom of tag list and writing new tag or selecting it from existing tags. To select existing tag user must click on input field or press arrow down key.</li>
                <li>total activity time (hh:mm:ss), shows only time till last paused</li>
                <li>status button. Can be 'Active'(green background of task element) or 'Inactive' (red background). Status can be changed by clicking the button. When status changed to inactive, total activity time is updated</li>
            </ul>
            <p>
                Filtering is done by clicking 'Filter by Tags' button, then the list of all unique tags opens, where user can check necessary tags boxes. When tags are chosen, need to click 'Apply' button. To see again all task elements, user needs to press 'Reset Filter' button.
            </p>
            <p>
                Using of the app is possible as well with keyboard only (besides mouse or touchpad and such). To navigate between buttons, elements inside task component, input fields in the form 'Tab' button is used ('Tab' to move forward, 'Shift' + 'Tab' to move back). To perform click behavior 'Spacebar' is used. Input fields inside task elements are confirmed by pressing 'Enter'. Form (adding of a new task element) is submitted by pressing 'Enter' key.
            </p>
            <p>Approximately 150 hours were spend on this application.</p>
            <p>Most difficult for me was implementing a behavior for single active task at a time mode, where previous active task must become inactive.</p>
        </div>
    )
}

export default About;