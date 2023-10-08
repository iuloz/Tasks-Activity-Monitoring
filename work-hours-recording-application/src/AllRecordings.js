import { useState, useEffect } from 'react';
import TasksItem from './TasksItem';

// This is recordings list view, made during whole time
function AllRecordings(){
    const [recordingsList, setRecordingList] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:3010/records')
          .then(response => response.json())
          .then(data => setRecordingList(data))
          .catch(error => console.error('Error fetching data:', error));
      }, []);



    return(
        <div>
            {
                recordingsList.map((item, index) =>
                    <TasksItem key={index}
                            id={item.id}
                            date={item.date}
                            status={item.status}
                            task={item.task}
                            tags={item.tags}
                            start={item.start}
                            end={item.end}
                            hours={item.hours} />)
            }
        </div>
    );
}


export default AllRecordings;