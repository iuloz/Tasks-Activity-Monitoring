import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';



// This is recordings list view, made during whole time
function Summary() {
    const today = new Date();
    today.setHours(0, 0, 0);
    const [observationStart, setObservationStart] = useState(today);
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
        recordingsList.forEach(async item => {
            let totalTimeInSeconds = 0;
            const dateTime = new Date();
            for (let i = 0; i < item.start.length; i++) {
                if (item.end[i]) {
                    const startTime = new Date(item.start[i].replace(/(\d{2}).(\d{2}).(\d{4}), (\d{2}):(\d{2}):(\d{2})/, "$3-$2-$1T$4:$5:$6"));
                    const endTime = new Date(item.end[i].replace(/(\d{2}).(\d{2}).(\d{4}), (\d{2}):(\d{2}):(\d{2})/, "$3-$2-$1T$4:$5:$6"));
                    if (startTime >= observationStart && endTime <= observationEnd) {
                        totalTimeInSeconds += Math.floor((endTime - startTime) / 1000); // in minutes
                    } else if (startTime >= observationStart && startTime <= observationEnd && endTime >= observationEnd) {
                        totalTimeInSeconds += Math.floor((observationEnd - startTime) / 1000);
                    } else if (startTime <= observationStart && endTime >= observationStart && endTime <= observationEnd) {
                        totalTimeInSeconds += Math.floor((endTime - observationStart) / 1000);
                    } else if (startTime <= observationStart && endTime >= observationEnd) {
                        totalTimeInSeconds += Math.floor((observationEnd - observationStart) / 1000);
                    }
                } else {
                    const lastStartTime = new Date(item.start[i].replace(/(\d{2}).(\d{2}).(\d{4}), (\d{2}):(\d{2}):(\d{2})/, "$3-$2-$1T$4:$5:$6"));
                    if (lastStartTime <= observationStart && dateTime >= observationEnd) {
                        totalTimeInSeconds += Math.floor((observationEnd - observationStart) / 1000);
                    } else if (lastStartTime <= observationStart && dateTime >= observationStart && dateTime <= observationEnd) {
                        totalTimeInSeconds += Math.floor((dateTime - observationStart) / 1000);
                    } else if (lastStartTime >= observationStart && dateTime <= observationEnd) {
                        totalTimeInSeconds += Math.floor((dateTime - lastStartTime) / 1000);
                    } else if (lastStartTime >= observationStart && lastStartTime <= observationEnd && dateTime >= observationEnd) {
                        totalTimeInSeconds += Math.floor((observationEnd - lastStartTime) / 1000);
                    }
                }
            }
            const hours = Math.floor(totalTimeInSeconds / 3600);
            const minutes = Math.floor((totalTimeInSeconds % 3600) / 60);
            const seconds = totalTimeInSeconds % 60;
            let newTimeTotal = new Date();
            newTimeTotal.setHours(hours, minutes, seconds);
            newTimeTotal = newTimeTotal.toTimeString().slice(0, 8);
            await setTasksTimes(prev => [...prev, { task: item.task, totalTime: newTimeTotal }]);
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
                    dateFormat="dd.MM.yyyy,  HH:mm:ss"
                    timeFormat="HH:mm"
                />
            </div>
            <div style={{ display: 'inline-block' }}>
                <p>End:</p>
                <DatePicker
                    selected={observationEnd}
                    onChange={handleObservationEnd}
                    showTimeSelect
                    dateFormat="dd.MM.yyyy,  HH:mm:ss"
                    timeFormat="HH:mm"
                />
            </div>
            <button id='apply_interval' onClick={showTasksAndTimes}>Apply</button>

            <p><b>Total active times for tasks:</b></p>
            {
                tasksTimes.map((item, index) => {
                    if (item.totalTime !== '00:00:00') {
                        return <p key={index}>{item.task}: {item.totalTime}</p>;
                    }
                    return null;
                })
            }

            <p><b>Total active times for tags:</b></p>
            <p style={{ display: 'inline-block' }}>Tag: </p>
            <span style={{ display: 'inline-block' }}> Total active time</span>

        </div>
    )
}


export default Summary;