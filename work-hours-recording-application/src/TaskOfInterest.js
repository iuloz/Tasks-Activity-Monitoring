import { useState } from "react"

function TaskOfInterest(props) {
    // const [task, setTask] = useState(props.task);
    // const [totalTime, setTotalTime] = useState(props.totalActiveTime);
    // const [activityPeriods, setActivityPeriods] = useState(props.activityPeriods);
    const [showTaskDetails, setShowTaskDetails] = useState(false);



    return (
        <div className='task-of-interest'>
            <p><b>Task:</b> {props.task}</p>
            <p><b>Total active time:</b> {props.totalActiveTime}</p>
            <p className='task-details' onClick={() => setShowTaskDetails(!showTaskDetails)}>Details</p>
            {
                showTaskDetails ? (
                    <div>
                        <br/><br/><br/>
                        {props.activityPeriods.map((period, index) => {
                            if (period.task === props.task) {
                                return <p key={index}>{period.start} - {period.end}</p>
                            }
                            return null;
                        })}
                    </div>
                ) : null
            }
        </div>
    )
}

export default TaskOfInterest;