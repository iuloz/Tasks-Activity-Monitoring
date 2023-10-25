import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';



// This is recordings list view, made during whole time
function Summary() {
    const [observationStart, setObservationStart] = useState(new Date());
    const [observationEnd, setObservationEnd] = useState(new Date());
    const [recordingsList, setRecordingList] = useState([]);
    const [tasksTimes, setTasksTimes] = useState([]);


    useEffect(() => {
        fetch('/records')
            .then(response => response.json())
            .then(data => setRecordingList(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);


    const handleObservationStart = (date) => {
        setObservationStart(date);
    };

    const handleObservationEnd = (date) => {
        setObservationEnd(date);
    };

    const showTasksAndTimes = () => {
        recordingsList.forEach((item, index) => {
            let totalTimeInMinutes = 0;
            for (let i = 0; i < item.start.length; i++) {
                if (new Date(item.start[i]) >= observationStart && new Date(item.end[i]) <= observationEnd) {
                    const differenceInMinutes = Math.floor((new Date(item.end[i]) - new Date(item.start[i])) / 60000);
                    totalTimeInMinutes += differenceInMinutes;
                }
            }
        })
    }



    return (
        <div>
            <p>Observation interval:</p>
            <div style={{ display: 'inline-block' }}>
                <p>Start:</p>
                <DatePicker
                    selected={observationStart}
                    onChange={handleObservationStart}
                    showTimeSelect
                    dateFormat="dd.MM.yyyy,  HH:mm"
                    timeFormat="HH:mm"
                />
            </div>
            <div style={{ display: 'inline-block' }}>
                <p>End:</p>
                <DatePicker
                    selected={observationEnd}
                    onChange={handleObservationEnd}
                    showTimeSelect
                    dateFormat="dd.MM.yyyy,  HH:mm"
                    timeFormat="HH:mm"
                />
            </div>
            <button id='apply_interval' onClick={showTasksAndTimes}>Apply</button>
            <p>Total active times for tasks:</p>
            <p style={{ display: 'inline-block' }}>Task: </p>
            <span style={{ display: 'inline-block' }}> Total active time</span>

            <p>Total active times for tags:</p>
            <p style={{ display: 'inline-block' }}>Tag: </p>
            <span style={{ display: 'inline-block' }}> Total active time</span>

        </div>
    )
}


export default Summary;