import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import TasksItem from './TasksItem';
import Form from './Form';

function Tasks() {
    const [taskList, setTaskList] = useState([]);
    const [task, setTask] = useState({ id: '', date: '', status: 'Inactive', task: '', tags: [], start: [], end: [], timeTotal: '' });
    const [uniqueTags, setUniqueTags] = useState([]);
    const [updateTags, setUpdateTags] = useState(false);


    useEffect(() => {
        fetch('http://localhost:3010/records')
            .then(response => response.json())
            .then(data => {
                const tagsSet = new Set();
                data.forEach(item => {
                    item.tags.forEach(tag => tagsSet.add(tag));
                });
                setUniqueTags(Array.from(tagsSet));
            })
            .catch(error => console.error('Error fetching data:', error));
    }, [updateTags]);




    const addToApi = async () => {
        await fetch('http://localhost:3010/records', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
        })
            .then(resp => resp.json())
            .then(data => {
                console.log(data);
            });
    }


    // const timeDifference = () => {
    //     const [hoursStart, minutesStart] = task.start.split(':').map(Number);
    //     const [hoursEnd, minutesEnd] = task.end.split(':').map(Number);
    //     if (minutesStart > 59 || minutesStart < 0 || hoursStart > 23 || hoursStart < 0
    //         || minutesEnd > 59 || minutesEnd < 0 || hoursEnd > 23 || hoursEnd < 0) {
    //         alert(`Please, provide time in correct format: 'hh:mm'`);
    //         return;

    //     } else {
    //         const dateStart = new Date(0, 0, 0, hoursStart, minutesStart);
    //         const dateEnd = new Date(0, 0, 0, hoursEnd, minutesEnd);
    //         const timeDifference = Math.abs(dateEnd < dateStart ? dateEnd - dateStart + 24 * 1000 * 60 * 60 : dateEnd - dateStart);
    //         const hoursDifference = (timeDifference / (1000 * 60 * 60)).toFixed(1);
    //         setTaskList(prev => [...prev, { ...task, timeTotal: hoursDifference }]);
    //     }
    // }


    const recordTask = async (event) => {
        await event.preventDefault();
        if (task.task === '' || task.tags.length < 1) {
            return;
        } else {
            // timeDifference();
            setTaskList([...taskList, task]);
            addToApi();
            setUpdateTags(!updateTags);
        }

        // Setting empty fields for start and end to make input fields empty after form submit
        setTask(prev => ({ ...prev, task: '', tags: []}));
    }

    const inputChanged = (event) => {
        const date = (new Date()).toLocaleDateString('fi-FI', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
        let key = event.target.name;
        let value = event.target.value;
        setTask({ ...task, id: uuidv4(), date: date, [key]: key === 'tags' ? [value] : value });
    }

    const newTagsFromTaskItem = () => {
        setUpdateTags(!updateTags);
    }


    return (
        <>
            <Form task={task} inputChanged={inputChanged} recordTask={recordTask} />
            {
                taskList.map((item, index) =>
                    <TasksItem
                        key={index}
                        id={item.id}
                        date={item.date}
                        status={item.status}
                        task={item.task}
                        tags={item.tags}
                        startTimes={item.start}
                        endTimes={item.end}
                        timeTotal={item.timeTotal}
                        existingTags={uniqueTags}
                        uniqueTagsUpdate={newTagsFromTaskItem} />)
            }
        </>
    );
}

export default Tasks;