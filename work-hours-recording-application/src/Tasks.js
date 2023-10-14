import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import TasksItem from './TasksItem';
import Form from './Form';

function Tasks() {
    const [taskList, setTaskList] = useState([]);
    const [task, setTask] = useState({ id: '', date: '', status: 'Inactive', task: '', tags: [], start: [], end: [], timeTotal: '00:00:00' });
    const [uniqueTags, setUniqueTags] = useState([]);
    const [updateTags, setUpdateTags] = useState(false);


    useEffect(() => {
        fetch('/records')
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
        await fetch('/records', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
        })
            .then(resp => resp.json())
            .then(data => {
                console.log(data);
            });
    }

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
        setTask(prev => ({ ...prev, task: '', tags: [] }));
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
                        uniqueTagsUpdate={newTagsFromTaskItem}
                    />)
            }
        </>
    );
}

export default Tasks;