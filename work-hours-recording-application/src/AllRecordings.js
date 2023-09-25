import { useState, useEffect } from "react";

// This is recordings list view, made during whole time
function AllRecordings(){
    const [recordingsList, setRecordingList] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3010/records')
          .then(response => response.json())
          .then(data => setRecordingList(data))
          .catch(error => console.error('Error fetching data:', error));
      }, []);



    return(
        <>
            <h2>All recordings</h2>
            <div style={{paddingTop:"30px"}}></div>
            <table id="table">
                <tbody>
                    <tr>
                        <th>Date</th>
                        <th>Start time</th>
                        <th>End time</th>
                        <th>Hours</th>
                    </tr>
                {
                    recordingsList.map((data, index) =>
                    <tr key={index}>
                        <td>{data.date}</td>
                        <td>{data.start}</td>
                        <td>{data.end}</td>
                        <td>{data.hours}</td>
                    </tr>)
                }
                </tbody>
            </table>
        </>
    );
}


export default AllRecordings;