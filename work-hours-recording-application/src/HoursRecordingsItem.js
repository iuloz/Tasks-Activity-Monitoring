import "./styles.css"

function HoursRecordingsItem(props){

    return (
        <>
            <div style={{paddingTop:"30px"}}></div>
            <table id="table">
                <tbody>
                    <tr>
                        <th>№</th>
                        <th>Date</th>
                        <th>Start time</th>
                        <th>End time</th>
                        <th>Hours</th>
                    </tr>
                {
                    props.hoursRecords.map((record, index) =>
                    <tr key={index}>
                        <td>{index+1}.</td>
                        <td>{record.date}</td>
                        <td>{record.start}</td>
                        <td>{record.end}</td>
                        <td>{record.hours}</td>
                    </tr>)
                }
                </tbody>
            </table>
        </>
    );
}
export default HoursRecordingsItem;