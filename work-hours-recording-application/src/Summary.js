import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TaskOfInterest from './TaskOfInterest';



// This is recordings list view, made during whole time
function Summary() {
    const today = new Date();
    today.setHours(0, 0, 0);
    const [observationStart, setObservationStart] = useState(today);
    const [observationEnd, setObservationEnd] = useState(new Date());
    const [recordingsList, setRecordingList] = useState([]);
    const [tasksTimes, setTasksTimes] = useState([]);
    const [tagsTimes, setTagsTimes] = useState([]);
    const [color, setColor] = useState('whitesmoke');
    const [visibility, setVisibility] = useState('hidden');
    // const [showTaskDetails, setShowTaskDetails] = useState(false);
    const [activityPeriods, setActivityPeriods] = useState([]);


    useEffect(() => {
        fetch('http://localhost:3010/records')
            .then(response => response.json())
            .then(data => setRecordingList(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        fetch('http://localhost:3010/settings')
            .then(response => response.json())
            .then(data => setColor(data.theme === 'light' ? 'black' : 'whitesmoke'))
            .catch(error => console.error('Error fetching data:', error));
    }, []);


    const handleObservationStart = (date) => {
        setObservationStart(date);
    };

    const handleObservationEnd = (date) => {
        setObservationEnd(date);
    };


    const showTasksAndTimes = () => {
        setVisibility('visible');
        setTasksTimes([]);
        let updatedTagsTimes = [];
        let periods = [];
        // let periodsStart = [];
        // let periodsEnd = []
        // let taskPeriods = [];
        const observationStartString = observationStart.toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
        const observationEndString = observationEnd.toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
        recordingsList.forEach((item, index) => {
            let totalTimeInSeconds = 0;
            const dateTime = new Date();
            const dateTimeString = dateTime.toLocaleString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            });
            for (let i = 0; i < item.start.length; i++) {
                if (item.end[i]) {
                    const startTime = new Date(item.start[i].replace(/(\d{2}).(\d{2}).(\d{4}), (\d{2}):(\d{2}):(\d{2})/, "$3-$2-$1T$4:$5:$6"));
                    const endTime = new Date(item.end[i].replace(/(\d{2}).(\d{2}).(\d{4}), (\d{2}):(\d{2}):(\d{2})/, "$3-$2-$1T$4:$5:$6"));

                    if (startTime >= observationStart && endTime <= observationEnd) {
                        totalTimeInSeconds += Math.floor((endTime - startTime) / 1000); // in minutes
                        // periodsStart.push(item.start[i]);
                        // periodsEnd.push(item.end[i]);
                        periods.push({ task: item.task, start: item.start[i], end: item.end[i] });

                    } else if (startTime >= observationStart && startTime <= observationEnd && endTime >= observationEnd) {
                        totalTimeInSeconds += Math.floor((observationEnd - startTime) / 1000);
                        // periodsStart.push(item.start[i]);
                        // periodsEnd.push(observationEndString);
                        periods.push({ task: item.task, start: item.start[i], end: observationEndString });

                    } else if (startTime <= observationStart && endTime >= observationStart && endTime <= observationEnd) {
                        totalTimeInSeconds += Math.floor((endTime - observationStart) / 1000);
                        // periodsStart.push(observationStartString);
                        // periodsEnd.push(item.end[i]);
                        periods.push({ task: item.task, start: observationStartString, end: item.end[i] });

                    } else if (startTime <= observationStart && endTime >= observationEnd) {
                        totalTimeInSeconds += Math.floor((observationEnd - observationStart) / 1000);
                        // periodsStart.push(observationStartString);
                        // periodsEnd.push(observationEndString);
                        periods.push({ task: item.task, start: observationStartString, end: observationEndString });
                    }

                } else {
                    const lastStartTime = new Date(item.start[i].replace(/(\d{2}).(\d{2}).(\d{4}), (\d{2}):(\d{2}):(\d{2})/, "$3-$2-$1T$4:$5:$6"));
                    if (lastStartTime <= observationStart && dateTime >= observationEnd) {
                        totalTimeInSeconds += Math.floor((observationEnd - observationStart) / 1000);
                        // periodsStart.push(observationStartString);
                        // periodsEnd.push(observationEndString);
                        periods.push({ task: item.task, start: observationStartString, end: observationEndString });

                    } else if (lastStartTime <= observationStart && dateTime >= observationStart && dateTime <= observationEnd) {
                        totalTimeInSeconds += Math.floor((dateTime - observationStart) / 1000);
                        // periodsStart.push(observationStartString);
                        // periodsEnd.push(dateTimeString);
                        periods.push({ task: item.task, start: observationStartString, end: dateTimeString });

                    } else if (lastStartTime >= observationStart && dateTime <= observationEnd) {
                        totalTimeInSeconds += Math.floor((dateTime - lastStartTime) / 1000);
                        // periodsStart.push(item.start[i]);
                        // periodsEnd.push(dateTimeString);
                        periods.push({ task: item.task, start: item.start[i], end: dateTimeString });

                    } else if (lastStartTime >= observationStart && lastStartTime <= observationEnd && dateTime >= observationEnd) {
                        totalTimeInSeconds += Math.floor((observationEnd - lastStartTime) / 1000);
                        // periodsStart.push(item.start[i]);
                        // periodsEnd.push(dateTimeString);
                        periods.push({ task: item.task, start: item.start[i], end: dateTimeString });
                    }
                }
            }
            const hours = Math.floor(totalTimeInSeconds / 3600);
            const minutes = Math.floor((totalTimeInSeconds % 3600) / 60);
            const seconds = totalTimeInSeconds % 60;
            const newTimeTotal = `${hours}:${minutes}:${seconds}`;
            const components = newTimeTotal.split(':');
            let formattedTime = components.map(component => component.padStart(2, '0'));
            formattedTime = formattedTime.join(':');
            setTasksTimes(prev => [...prev, { task: item.task, totalTime: formattedTime }]);


            item.tags.forEach(tag => {
                if (updatedTagsTimes.findIndex(obj => obj.tag === tag) !== -1) { // If there is same tag already
                    console.log(`${tag} already exists`);
                    const temp = [...updatedTagsTimes];
                    const index = temp.findIndex(obj => obj.tag === tag);
                    const [hours, minutes, seconds] = temp[index].totalTime.split(':').map(Number);
                    const oldTotalTime = hours * 3600 + minutes * 60 + seconds;
                    const newTagTotal = oldTotalTime + totalTimeInSeconds;
                    const h = Math.floor(newTagTotal / 3600);
                    const m = Math.floor((newTagTotal % 3600) / 60);
                    const s = newTagTotal % 60;
                    const newTimeTotal = `${h}:${m}:${s}`;
                    const components = newTimeTotal.split(':');
                    let formattedTime = components.map(component => component.padStart(2, '0'));
                    formattedTime = formattedTime.join(':');
                    temp[index] = { tag: tag, totalTime: formattedTime }
                    updatedTagsTimes = [...temp];
                } else {
                    updatedTagsTimes.push({ tag: tag, totalTime: formattedTime });
                }
            });
            setTagsTimes(updatedTagsTimes);
            setActivityPeriods(periods);
        })
    }



    return (
        <div>
            <p style={{ display: 'inline-block', marginRight: '40px', fontSize: '1.3rem', color: color }}>Observation interval:</p>
            <div style={{ display: 'inline-block', marginRight: '10px' }}>
                <p style={{ color: color }}>Start:</p>
                <DatePicker
                    selected={observationStart}
                    onChange={handleObservationStart}
                    showTimeSelect
                    dateFormat="dd.MM.yyyy,  HH:mm:ss"
                    timeFormat="HH:mm"
                />
            </div>
            <div style={{ display: 'inline-block' }}>
                <p style={{ color: color }}>End:</p>
                <DatePicker
                    selected={observationEnd}
                    onChange={handleObservationEnd}
                    showTimeSelect
                    dateFormat="dd.MM.yyyy,  HH:mm:ss"
                    timeFormat="HH:mm"
                />
            </div>
            <button className='apply-interval' onClick={showTasksAndTimes}>Apply</button>

            <p style={{ color: color, visibility: visibility, fontSize: '1.2rem' }}>Total active times for tasks:</p>
            {
                tasksTimes.map((item, index) => {
                    if (item.totalTime !== '00:00:00') {
                        return (
                            <TaskOfInterest
                                key={index}
                                task={item.task}
                                totalActiveTime={item.totalTime}
                                activityPeriods={activityPeriods}
                                recordingsList={recordingsList}
                            />
                        )
                    }
                    return null;
                })
            }

            <p style={{ color: color, visibility: visibility, fontSize: '1.2rem' }}>Total active times for tags:</p>
            {
                tagsTimes.map((item, index) => {
                    if (item.totalTime !== '00:00:00') {
                        return (
                            <div key={index} className='tag-of-interest'>
                                <p><b>Tag:</b> {item.tag}</p>
                                <p><b>Total active time:</b> {item.totalTime}</p>
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