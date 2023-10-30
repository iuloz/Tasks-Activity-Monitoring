import { useEffect, useState } from "react";
import DatePicker from 'react-datepicker';

function TaskOfInterest(props) {
    const [showTaskDetails, setShowTaskDetails] = useState(false);
    const today = new Date();
    today.setHours(0, 0, 0);
    const [observationStart, setObservationStart] = useState(today);
    const [observationEnd, setObservationEnd] = useState(new Date());
    const [activityPeriods, setActivityPeriods] = useState([]);
    const [addingPeriod, setAddingPeriod] = useState(false);
    const [newPeriod, setNewPeriod] = useState('');
    const [taskIntervals, setTaskIntervals] = useState([]); // [{start: ..., end: ...}]
    const [startTimes, setStartTimes] = useState([]); // ['','','','']
    const [endTimes, setEndTimes] = useState([]); // ['','','','']


    useEffect(() => {
        let starts = [];
        let ends = [];
        let intervals = activityPeriods.map((interval, index) => {
            if (interval.task === props.task) {
                starts.push(interval.start);
                ends.push(interval.end);
                return {
                    start: interval.start,
                    end: interval.end
                }
            }
            return null;
        });
        setTaskIntervals(intervals);
        setStartTimes(starts);
        setEndTimes(ends);
    }, [activityPeriods, props.task]);


    const showPeriods = () => {
        let periods = [];
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
        const dateTime = new Date();
        const dateTimeString = dateTime.toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
        props.recordingsList.forEach((item, index) => {
            for (let i = 0; i < item.start.length; i++) {
                if (item.end[i]) {
                    const startTime = new Date(item.start[i].replace(/(\d{2}).(\d{2}).(\d{4}), (\d{2}):(\d{2}):(\d{2})/, "$3-$2-$1T$4:$5:$6"));
                    const endTime = new Date(item.end[i].replace(/(\d{2}).(\d{2}).(\d{4}), (\d{2}):(\d{2}):(\d{2})/, "$3-$2-$1T$4:$5:$6"));

                    if (startTime >= observationStart && endTime <= observationEnd) {
                        periods.push({ task: item.task, start: item.start[i], end: item.end[i] });

                    } else if (startTime >= observationStart && startTime <= observationEnd && endTime >= observationEnd) {
                        periods.push({ task: item.task, start: item.start[i], end: observationEndString });

                    } else if (startTime <= observationStart && endTime >= observationStart && endTime <= observationEnd) {
                        periods.push({ task: item.task, start: observationStartString, end: item.end[i] });

                    } else if (startTime <= observationStart && endTime >= observationEnd) {
                        periods.push({ task: item.task, start: observationStartString, end: observationEndString });
                    }

                } else {
                    const lastStartTime = new Date(item.start[i].replace(/(\d{2}).(\d{2}).(\d{4}), (\d{2}):(\d{2}):(\d{2})/, "$3-$2-$1T$4:$5:$6"));
                    if (lastStartTime <= observationStart && dateTime >= observationEnd) {
                        periods.push({ task: item.task, start: observationStartString, end: observationEndString });

                    } else if (lastStartTime <= observationStart && dateTime >= observationStart && dateTime <= observationEnd) {
                        periods.push({ task: item.task, start: observationStartString, end: dateTimeString });

                    } else if (lastStartTime >= observationStart && dateTime <= observationEnd) {
                        periods.push({ task: item.task, start: item.start[i], end: dateTimeString });

                    } else if (lastStartTime >= observationStart && lastStartTime <= observationEnd && dateTime >= observationEnd) {
                        periods.push({ task: item.task, start: item.start[i], end: dateTimeString });
                    }
                }
            }
            setActivityPeriods(periods);
        })
    }

    const deletePeriod = index => {
        // let updatedPeriods = [...activityPeriods];
        // updatedPeriods.splice(index, 1);
        // setActivityPeriods(updatedPeriods);
        let updatedStarts = [...startTimes];
        let updatedEnds = [...endTimes];
        updatedStarts.splice(index, 1);
        updatedEnds.splice(index, 1);
        setStartTimes(updatedStarts);
        setEndTimes(updatedEnds);
    }

    const addPeriod = () => {
        const [periodStart, periodEnd] = newPeriod.split(' - ');
        let tempStarts = [...startTimes, periodStart];
        console.log(tempStarts);
        let tempEnds = [...endTimes, periodEnd];
        console.log(tempEnds);
        setNewPeriod('');

        const activityStartDates = tempStarts.map(date => {
            const periodStartDate = new Date(date.replace(/(\d{2}).(\d{2}).(\d{4}), (\d{2}):(\d{2}):(\d{2})/, "$3-$2-$1T$4:$5:$6"));
            return periodStartDate;
        });

        const activityEndDates = tempEnds.map(date => {
            const periodEndDate = new Date(date.replace(/(\d{2}).(\d{2}).(\d{4}), (\d{2}):(\d{2}):(\d{2})/, "$3-$2-$1T$4:$5:$6"));
            return periodEndDate;
        });

        const sortedStartDates = activityStartDates.sort((a, b) => a - b);
        const sortedEndDates = activityEndDates.sort((a, b) => a - b);
        const sortedStarts = sortedStartDates.map(start => {
            const startString = start.toLocaleString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            });
            return startString;
        });

        const sortedEnds = sortedEndDates.map(end => {
            const endString = end.toLocaleString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            });
            return endString;
        });
        setStartTimes(sortedStarts);
        setEndTimes(sortedEnds);
        setAddingPeriod(false);
    }



    return (
        <div className='task-of-interest'>
            <p><b>Task:</b> {props.task}</p>
            <p><b>Total active time:</b> {props.totalActiveTime}</p>
            <p className='task-details' onClick={() => setShowTaskDetails(!showTaskDetails)}>Details</p>
            {
                showTaskDetails ? (
                    <div>
                        <br /><br /><br />
                        <DatePicker
                            selected={observationStart}
                            onChange={date => setObservationStart(date)}
                            showTimeSelect
                            dateFormat="dd.MM.yyyy,  HH:mm:ss"
                            timeFormat="HH:mm"
                        />
                        <DatePicker
                            selected={observationEnd}
                            onChange={date => setObservationEnd(date)}
                            showTimeSelect
                            dateFormat="dd.MM.yyyy,  HH:mm:ss"
                            timeFormat="HH:mm"
                        />
                        <button className='apply-interval' onClick={showPeriods}>Apply</button>
                        {
                            startTimes.map((time, index) => {
                                return (
                                    <div key={index}>
                                        <p style={{ display: 'inline-block', cursor: 'pointer' }}>{time}</p>
                                        <span> - </span>
                                        <p style={{ display: 'inline-block', cursor: 'pointer' }}>{endTimes[index]}</p>
                                        <span onClick={() => deletePeriod(index)} style={{ color: 'red', cursor: 'pointer', marginLeft: '15px' }}>⤬</span>
                                    </div>
                                );
                            })
                        }
                        <p onClick={() => setAddingPeriod(!addingPeriod)} style={{ color: 'green', cursor: 'pointer' }}>+</p>
                        {
                            !addingPeriod ? null : (
                                <input
                                    placeholder='DD:MM:YYYY, HH:mm:ss - DD:MM:YYYY, HH:mm:ss'
                                    style={{ width: '100%' }}
                                    onChange={e => setNewPeriod(e.target.value)}
                                    onBlur={addPeriod}
                                    autoFocus
                                >
                                </input>
                            )
                        }
                    </div>
                ) : null
            }
        </div>
    )
}

export default TaskOfInterest;