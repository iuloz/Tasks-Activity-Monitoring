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
    const [tagsTimes, setTagsTimes] = useState([]);


    useEffect(() => {
        fetch('http://localhost:3010/records')
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
        setTasksTimes([]);
        let updatedTagsTimes = [];
        recordingsList.forEach(item => {
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
            const days = Math.floor(totalTimeInSeconds / (3600 * 24));
            const hours = Math.floor(totalTimeInSeconds / 3600);
            const minutes = Math.floor((totalTimeInSeconds % 3600) / 60);
            const seconds = totalTimeInSeconds % 60;
            let newTimeTotal = new Date();
            newTimeTotal.setHours(hours, minutes, seconds);
            newTimeTotal = newTimeTotal.toTimeString().slice(0, 8);
            // newTimeTotal = `${days} day(s), ${newTimeTotal}`;
            setTasksTimes(prev => [...prev, { task: item.task, totalTime: newTimeTotal, days: days }]);


            item.tags.forEach(tag => {
                const index = updatedTagsTimes.findIndex(obj => obj.tag === tag);
                if (index !== -1) {
                    console.log(`COINCIDENCE on ${tag}`);
                    const temp = [...updatedTagsTimes];
                    const index = temp.findIndex(obj => obj.tag === tag);
                    const [hours, minutes, seconds] = temp[index].totalTime.split(':').map(Number);
                    const oldTotalTime = hours * 3600 + minutes * 60 + seconds;
                    const newTagTotal = oldTotalTime + totalTimeInSeconds;
                    const d = Math.floor(newTagTotal / (3600 * 24));
                    const h = Math.floor(newTagTotal / 3600);
                    const m = Math.floor((newTagTotal % 3600) / 60);
                    const s = newTagTotal % 60;
                    let newTimeTotal = new Date();
                    newTimeTotal.setHours(h, m, s);
                    newTimeTotal = newTimeTotal.toTimeString().slice(0, 8);
                    const totalDays = d + temp[index].days;
                    // newTimeTotal = `${d} day(s), ${newTimeTotal}`;
                    // const newTimeTotal = `${h}:${m}:${s}`;

                    temp[index] = { tag: tag, totalTime: newTimeTotal , days: totalDays}
                    updatedTagsTimes = [...temp];
                } else {
                    updatedTagsTimes.push({ tag: tag, totalTime: newTimeTotal, days: days });
                }
            });
            setTagsTimes(updatedTagsTimes);
        })
    }


    // const calculateTagTimes = (oldTime, newTime) => {
    //     const [hours, minutes, seconds] = oldTime.split(':').map(Number);
    //     const oldTotalTime = hours * 3600 + minutes * 60 + seconds;
    //     const newTagTotal = oldTotalTime + newTime;
    //     const h = Math.floor(newTagTotal / 3600);
    //     const m = Math.floor((newTagTotal % 3600) / 60);
    //     const s = newTagTotal % 60;
    //     const newTimeTotal = `${h}:${m}:${s}`;
    //     return newTimeTotal;
    // }



    return (
        <div>
            <p style={{ display: 'inline-block', marginRight: '40px', fontSize: '1.3rem' }}>Observation interval:</p>
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
                        return (
                            <div key={index} className='task-of-interest'>
                                <p><b>Task:</b> {item.task}</p>
                                <p><b>Total active time: </b>{item.days} day(s), {item.totalTime}</p>
                            </div>
                        )
                    }
                    return null;
                })
            }

            <p><b>Total active times for tags:</b></p>
            {
                tagsTimes.map((item, index) => {
                    if (item.totalTime !== '00:00:00') {
                        return (
                            <div key={index} className='tag-of-interest'>
                                <p><b>Tag:</b> {item.tag}</p>
                                <p><b>Total active time: </b> {item.days} day(s), {item.totalTime}</p>
                            </div>
                        )
                    }
                    return null;
                })
            }

        </div>
    )
}


export default Summary;