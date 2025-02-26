import { useState, useEffect } from "react";

function About() {
  const [color, setColor] = useState('whitesmoke');

  // Fetching theme to set the color
  useEffect(() => {
    fetch('http://localhost:3010/settings')
      .then(response => response.json())
      .then(data => setColor(data.theme === 'light' ? 'black' : 'whitesmoke'))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div id='about' style={{ color: color, fontSize: '1.1rem' }}>
      <p>Author: Iurii Lozhkin</p>
      <p>
        This application allows to make time recordings for different tasks. When application is launched, a user can see main page with three different links. First link - "See all tasks" - leads to the view where the user can add new tasks and tags via form and see all exiting tags and filter them. Besides, it is possible to edit task, edit/remove/add tags, change status of the task and delete whole task component. Second link - "Summary" - contains information about task activity time and activity periods. Third link - "About" - shows this page. Fourth link - "Settings" - allows to change color theme and mode of displaying active tasks (multiple or one at a time).
      </p>
      <p>
        To add a new task the user needs to type task and tag for this task in corresponding input fields and after that press 'Add' button by clicking it or hitting 'Enter' button on keyboard.
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
        Order of task elements can be changed by dragging and dropping. To drop one task element to the left side of another element dropping should be done on left half of second element, to drop to the right side - on right half.
      </p>
      <p>
        "Summary" view specifies start and end of observation interval and, when button 'Apply' is pushed, shows tasks and tags, which were active within the interval. Tasks and tags there contain information about their total active time within observation interval. Tasks have 'Details' button, which, when clicked, allows to specify start and end of task details interval, within which user can see all task activity periods. There it is possible to edit activity intervals by clicking them, remove them (clicking 'x') or add new (click '+').
      </p>
      <p>
        Using of the app is possible as well with keyboard only (besides mouse or touchpad and such). To navigate between buttons, elements inside task components, tasks of interest, input fields in the form 'Tab' button is used ('Tab' to move forward, 'Shift' + 'Tab' to move back). To perform click behavior 'Spacebar' is used. Input fields inside task elements and tasks of interest are confirmed by pressing 'Enter'. Form (adding of a new task element) is submitted by pressing 'Enter' key.
      </p>
      <p>Most difficult for me was implementing a behavior for single active task at a time mode in Module L, where previous active task must become inactive automatically and this change is seen on UI right away. Also Module J took a lot of time.</p>
    </div>
  )
}

export default About;