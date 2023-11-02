import { useEffect, useState, useRef } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
    const [startEditing, setStartEditing] = useState(null);
    const [endEditing, setEndEditing] = useState(null);
    const taskIndexInApi = props.recordingsList.findIndex(obj => obj.id === props.id);
    const [showIntervals, setShowIntervals] = useState(false);
    const buttonRefDetails = useRef();
    const buttonRefAddButton = useRef();
    const buttonRefAddInput = useRef();
    const intervalStartRefs = useRef([]);
    const intervalEndRefs = useRef([]);
    const intervalRemoveRefs = useRef([]);
    const intervalStartEditRefs = useRef([]);
    const intervalEndEditRefs = useRef([]);



    useEffect(() => {
        let starts = [];
        let ends = [];
        let intervals = [];
        activityPeriods.forEach((interval, index) => {
            if (interval.task === props.task) {
                starts.push(interval.start);
                ends.push(interval.end);
                intervals.push({ start: interval.start, end: interval.end });
            }
        });
        setTaskIntervals(intervals);
        setStartTimes(starts);
        setEndTimes(ends);
    }, [activityPeriods, props.task]);


    const addToApi = async (key, value) => {
        const requestBody = { [key]: value };
        await fetch(`http://localhost:3010/records/${props.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        })
            .then(resp => resp.json())
            .then(data => {
                console.log(`${key} changed to '${value}'`);
            });
    }



    const showPeriods = async () => {
        setShowIntervals(true);
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
        })
        setActivityPeriods(periods);
    }







    const addPeriod = async () => {
        const regex = /^\d{2}\.\d{2}\.\d{4}, \d{2}:\d{2}:\d{2} - \d{2}.\d{2}.\d{4}, \d{2}:\d{2}:\d{2}$/;
        if (regex.test(newPeriod)) {
            let [periodStart, periodEnd] = newPeriod.split(' - ');
            let overlaps = false;
            const startDate = new Date(periodStart.replace(/(\d{2}).(\d{2}).(\d{4}), (\d{2}):(\d{2}):(\d{2})/, "$3-$2-$1T$4:$5:$6"));
            const endDate = new Date(periodEnd.replace(/(\d{2}).(\d{2}).(\d{4}), (\d{2}):(\d{2}):(\d{2})/, "$3-$2-$1T$4:$5:$6"));
            if (startDate < endDate) {
                if (endDate <= observationEnd && startDate >= observationStart) {
                    for (const interval of taskIntervals) {
                        const start = new Date(interval.start.replace(/(\d{2}).(\d{2}).(\d{4}), (\d{2}):(\d{2}):(\d{2})/, "$3-$2-$1T$4:$5:$6"));
                        const end = new Date(interval.end.replace(/(\d{2}).(\d{2}).(\d{4}), (\d{2}):(\d{2}):(\d{2})/, "$3-$2-$1T$4:$5:$6"));
                        if ((startDate >= start && startDate <= end) || (endDate >= start && endDate <= end) || (startDate <= start && endDate >= end)) {
                            overlaps = true;
                            alert('New interval must not overlap with other intervals');
                            return;
                        }
                    }
                    if (!overlaps) {
                        let tempStarts = [...startTimes, periodStart];
                        let tempEnds = [...endTimes, periodEnd];
                        let intervals = [...taskIntervals, { start: periodStart, end: periodEnd }];
                        setNewPeriod('');
                        const activityStartDates = tempStarts.map(date => {
                            const periodStartDate = new Date(date.replace(/(\d{2}).(\d{2}).(\d{4}), (\d{2}):(\d{2}):(\d{2})/, "$3-$2-$1T$4:$5:$6"));
                            return periodStartDate;
                        });
                        const activityEndDates = tempEnds.map(date => {
                            const periodEndDate = new Date(date.replace(/(\d{2}).(\d{2}).(\d{4}), (\d{2}):(\d{2}):(\d{2})/, "$3-$2-$1T$4:$5:$6"));
                            return periodEndDate;
                        });
                        const intervalsDates = intervals.map(interval => {
                            const intervalStartDate = new Date(interval.start.replace(/(\d{2}).(\d{2}).(\d{4}), (\d{2}):(\d{2}):(\d{2})/, "$3-$2-$1T$4:$5:$6"));
                            const intervalEndDate = new Date(interval.end.replace(/(\d{2}).(\d{2}).(\d{4}), (\d{2}):(\d{2}):(\d{2})/, "$3-$2-$1T$4:$5:$6"));
                            return {
                                start: intervalStartDate,
                                end: intervalEndDate
                            };
                        });
                        const sortedStartDates = activityStartDates.sort((a, b) => a - b);
                        const sortedEndDates = activityEndDates.sort((a, b) => a - b);
                        const sortedIntervalsDates = intervalsDates.sort((a, b) => a.start - b.start);
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
                        const sortedIntervals = sortedIntervalsDates.map(interval => {
                            const intervalStartString = interval.start.toLocaleString('ru-RU', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                            });
                            const intervalEndString = interval.end.toLocaleString('ru-RU', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                            });
                            return {
                                start: intervalStartString,
                                end: intervalEndString
                            };
                        });


                        let intervalStartApi = [...props.recordingsList[taskIndexInApi].start, periodStart];
                        const intervalStartApiDates = intervalStartApi.map(start => {
                            const intervalStart = new Date(start.replace(/(\d{2}).(\d{2}).(\d{4}), (\d{2}):(\d{2}):(\d{2})/, "$3-$2-$1T$4:$5:$6"));
                            return intervalStart;
                        });
                        const sortedIntervalStartApi = intervalStartApiDates.sort((a, b) => a - b);
                        const sortedIntervalStartApiString = sortedIntervalStartApi.map(start => {
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


                        let intervalEndApi = [...props.recordingsList[taskIndexInApi].end, periodEnd];
                        const intervalEndApiDates = intervalEndApi.map(end => {
                            const intervalEnd = new Date(end.replace(/(\d{2}).(\d{2}).(\d{4}), (\d{2}):(\d{2}):(\d{2})/, "$3-$2-$1T$4:$5:$6"));
                            return intervalEnd;
                        });
                        const sortedIntervalEndApi = intervalEndApiDates.sort((a, b) => a - b);
                        const sortedIntervalEndApiString = sortedIntervalEndApi.map(start => {
                            const endString = start.toLocaleString('ru-RU', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                            });
                            return endString;
                        });

                        await addToApi('start', sortedIntervalStartApiString);
                        await addToApi('end', sortedIntervalEndApiString);
                        setStartTimes(sortedStarts);
                        setEndTimes(sortedEnds);
                        setTaskIntervals(sortedIntervals);
                        setAddingPeriod(false);
                        props.updateTotalTime();
                    }
                } else {
                    alert('Stop date must not be later than end and earlier than start of task details interval');
                }
            } else {
                alert('Start date must be earlier than end date');
            }
        } else if (newPeriod === '') {
            return;
        } else {
            alert('Please type interval in correct format');
        }
    }



    const handleStartEdit = (index, editedStart) => {
        const updatedStarts = [...startTimes];
        updatedStarts[index] = editedStart;
        setStartTimes(updatedStarts);
    }

    const editStart = async (index, editedStart) => {
        let allStartsApi = props.recordingsList[taskIndexInApi].start;
        let allEndsApi = props.recordingsList[taskIndexInApi].end;
        const regex = /^\d{2}\.\d{2}\.\d{4}, \d{2}:\d{2}:\d{2}$/;
        if (regex.test(editedStart)) {
            const updatedStarts = [...startTimes];
            const editedStartDate = new Date(editedStart.replace(/(\d{2}).(\d{2}).(\d{4}), (\d{2}):(\d{2}):(\d{2})/, "$3-$2-$1T$4:$5:$6"));
            const endDate = new Date(endTimes[index].replace(/(\d{2}).(\d{2}).(\d{4}), (\d{2}):(\d{2}):(\d{2})/, "$3-$2-$1T$4:$5:$6"));
            if (endTimes[index - 1]) {
                const prevEndDate = new Date(endTimes[index - 1].replace(/(\d{2}).(\d{2}).(\d{4}), (\d{2}):(\d{2}):(\d{2})/, "$3-$2-$1T$4:$5:$6"));
                if (editedStartDate >= prevEndDate && editedStartDate <= endDate) {
                    let intervals = [...taskIntervals];
                    updatedStarts[index] = editedStart;
                    intervals[index].start = editedStart;
                    const startTaskIndexInApi = allEndsApi.findIndex(time => time === endTimes[index]);
                    allStartsApi[startTaskIndexInApi] = editedStart;
                    await addToApi('start', allStartsApi);
                    setStartTimes(updatedStarts);
                    setTaskIntervals(intervals);
                    setStartEditing(null);
                    props.updateTotalTime();
                } else {
                    alert('Date must be after previous stop time and before this stop time');
                }
            } else {
                if (editedStartDate <= endDate) {
                    let intervals = [...taskIntervals];
                    updatedStarts[index] = editedStart;
                    intervals[index].start = editedStart;
                    const startTaskIndexInApi = allEndsApi.findIndex(time => time === endTimes[index]);
                    allStartsApi[startTaskIndexInApi] = editedStart;
                    await addToApi('start', allStartsApi);
                    setStartTimes(updatedStarts);
                    setTaskIntervals(intervals);
                    setStartEditing(null);
                    props.updateTotalTime();
                } else {
                    alert('Date must be before stop time');
                }
            }
        } else {
            alert('Please, mind initial format');
        }
    }



    const handleEndEdit = (index, editedEnd) => {
        const updatedEnds = [...endTimes];
        updatedEnds[index] = editedEnd;
        setEndTimes(updatedEnds);
    }

    const editEnd = async (index, editedEnd) => {
        let allStartsApi = props.recordingsList[taskIndexInApi].start;
        let allEndsApi = props.recordingsList[taskIndexInApi].end;
        const regex = /^\d{2}\.\d{2}\.\d{4}, \d{2}:\d{2}:\d{2}$/;
        if (regex.test(editedEnd)) {
            const updatedEnds = [...endTimes];
            const editedEndDate = new Date(editedEnd.replace(/(\d{2}).(\d{2}).(\d{4}), (\d{2}):(\d{2}):(\d{2})/, "$3-$2-$1T$4:$5:$6"));
            const startDate = new Date(startTimes[index].replace(/(\d{2}).(\d{2}).(\d{4}), (\d{2}):(\d{2}):(\d{2})/, "$3-$2-$1T$4:$5:$6"));
            if (startTimes[index + 1]) {
                const nextStartDate = new Date(startTimes[index + 1].replace(/(\d{2}).(\d{2}).(\d{4}), (\d{2}):(\d{2}):(\d{2})/, "$3-$2-$1T$4:$5:$6"));
                if (editedEndDate >= startDate && editedEndDate <= nextStartDate) {
                    let intervals = [...taskIntervals];
                    intervals[index].end = editedEnd;
                    updatedEnds[index] = editedEnd;
                    const endTaskIndexInApi = allStartsApi.findIndex(time => time === startTimes[index]);
                    allEndsApi[endTaskIndexInApi] = editedEnd;
                    await addToApi('end', allEndsApi);
                    setEndTimes(updatedEnds);
                    setTaskIntervals(intervals);
                    setEndEditing(null);
                    props.updateTotalTime();
                } else {
                    alert('Date must be after start time and before next start time');
                }
            } else {
                if (editedEndDate >= startDate) {
                    let intervals = [...taskIntervals];
                    intervals[index].end = editedEnd;
                    updatedEnds[index] = editedEnd;
                    const endTaskIndexInApi = allStartsApi.findIndex(time => time === startTimes[index]);
                    allEndsApi[endTaskIndexInApi] = editedEnd;
                    await addToApi('end', allEndsApi);
                    setEndTimes(updatedEnds);
                    setTaskIntervals(intervals);
                    setEndEditing(null);
                    props.updateTotalTime();
                } else {
                    alert('Date must be after start time');
                }
            }
        } else {
            alert('Please, mind initial format');
        }
    }



    const deletePeriod = async index => {
        let allStartsApi = props.recordingsList[taskIndexInApi].start;
        let allEndsApi = props.recordingsList[taskIndexInApi].end;
        const startTaskIndexInApi = allStartsApi.findIndex(time => time === startTimes[index]);
        const endTaskIndexInApi = allEndsApi.findIndex(time => time === endTimes[index]);
        allStartsApi.splice(startTaskIndexInApi, 1);
        allEndsApi.splice(endTaskIndexInApi, 1);
        await addToApi('start', allStartsApi);
        await addToApi('end', allEndsApi);
        let updatedStarts = [...startTimes];
        let updatedEnds = [...endTimes];
        let intervals = [...taskIntervals];
        updatedStarts.splice(index, 1);
        updatedEnds.splice(index, 1);
        intervals.splice(index, 1);
        setStartTimes(updatedStarts);
        setEndTimes(updatedEnds);
        setTaskIntervals(intervals);
        props.updateTotalTime();
    }


    const handleKeyDown = (e, buttonRef) => {
        if (buttonRef.current && (e.key === ' ' || e.key === 'Spacebar')) {
            e.preventDefault();
            buttonRef.current.click();
        }
    };


    const handleKeyDownAddEnter = (e, buttonRef) => {
        if (buttonRef.current && (e.key === 'Enter')) {
            e.preventDefault();
            buttonRef.current.blur();
        }
    };

    const handleKeyDownInterval = (e, index, refs) => {
        if (refs.current[index] && (e.key === ' ' || e.key === 'Spacebar')) {
            e.preventDefault();
            refs.current[index].click();
        }
    };


    const handleKeyDownIntervalEdit = (e, index, refs) => {
        if (refs.current[index] && (e.key === 'Enter')) {
            e.preventDefault();
            refs.current[index].blur();
        }
    };




    return (
        <div className='task-of-interest'>
            <p><b>Task:</b> {props.task}</p>
            <p><b>Total active time:</b> {props.totalActiveTime}</p>
            <p
                tabIndex={0}
                ref={buttonRefDetails}
                onKeyDown={e => handleKeyDown(e, buttonRefDetails)}
                className='task-details'
                onClick={() => setShowTaskDetails(!showTaskDetails)}
            >Details</p>
            {
                showTaskDetails ? (
                    <div>
                        <br /><br /><br />
                        <p>Task details interval:</p>
                        <DatePicker
                            className='date-picker'
                            selected={observationStart}
                            onChange={date => setObservationStart(date)}
                            showTimeSelect
                            dateFormat="dd.MM.yyyy,  HH:mm:ss"
                            timeFormat="HH:mm"
                        />
                        <DatePicker
                            className='date-picker'
                            selected={observationEnd}
                            onChange={date => setObservationEnd(date)}
                            showTimeSelect
                            dateFormat="dd.MM.yyyy,  HH:mm:ss"
                            timeFormat="HH:mm"
                        />
                        <button className='apply-interval' onClick={showPeriods}>Apply</button>
                        {
                            !showIntervals ? null : (
                                <div>
                                    <p>Activity periods:</p>
                                    {
                                        startTimes.map((time, index) => {
                                            return (
                                                <div key={index}>
                                                    {
                                                        (startEditing !== index) ? (
                                                            <p
                                                                tabIndex={0}
                                                                className='interval'
                                                                onClick={() => setStartEditing(index)}
                                                                ref={ref => intervalStartRefs.current[index] = ref}
                                                                onKeyDown={e => handleKeyDownInterval(e, index, intervalStartRefs)}
                                                            >{time}</p>
                                                        ) : (
                                                            <input
                                                                type='text'
                                                                value={time}
                                                                onChange={e => handleStartEdit(index, e.target.value)}
                                                                onBlur={e => editStart(index, e.target.value)}
                                                                autoFocus
                                                                ref={ref => intervalStartEditRefs.current[index] = ref}
                                                                onKeyDown={e => handleKeyDownIntervalEdit(e, index, intervalStartEditRefs)}
                                                            />
                                                        )
                                                    }
                                                    <span> - </span>
                                                    {
                                                        (endEditing !== index) ? (
                                                            <p
                                                                tabIndex={0}
                                                                className='interval'
                                                                onClick={() => setEndEditing(index)}
                                                                ref={ref => intervalEndRefs.current[index] = ref}
                                                                onKeyDown={e => handleKeyDownInterval(e, index, intervalEndRefs)}
                                                            >{endTimes[index]}</p>
                                                        ) : (
                                                            <input
                                                                type='text'
                                                                value={endTimes[index]}
                                                                onChange={e => handleEndEdit(index, e.target.value)}
                                                                onBlur={e => editEnd(index, e.target.value)}
                                                                autoFocus
                                                                ref={ref => intervalEndEditRefs.current[index] = ref}
                                                                onKeyDown={e => handleKeyDownIntervalEdit(e, index, intervalEndEditRefs)}
                                                            />
                                                        )
                                                    }

                                                    <span
                                                        tabIndex={0}
                                                        onClick={() => deletePeriod(index)}
                                                        className='delete-interval'
                                                        ref={ref => intervalRemoveRefs.current[index] = ref}
                                                        onKeyDown={e => handleKeyDownInterval(e, index, intervalRemoveRefs)}
                                                    >⤬</span>
                                                </div>
                                            );
                                        })}
                                    <p
                                        tabIndex={0}
                                        ref={buttonRefAddButton}
                                        onKeyDown={e => handleKeyDown(e, buttonRefAddButton)}
                                        className='add-interval'
                                        onClick={() => setAddingPeriod(!addingPeriod)}
                                    >+</p>
                                </div>
                            )

                        }

                        {
                            !addingPeriod ? null : (
                                <input
                                    placeholder='DD:MM:YYYY, HH:mm:ss - DD:MM:YYYY, HH:mm:ss'
                                    style={{ width: '100%' }}
                                    onChange={e => setNewPeriod(e.target.value)}
                                    onBlur={addPeriod}
                                    autoFocus
                                    ref={buttonRefAddInput}
                                    onKeyDown={e => handleKeyDownAddEnter(e, buttonRefAddInput)}
                                />
                            )
                        }
                    </div>
                ) : null
            }
        </div>
    )
}

export default TaskOfInterest;