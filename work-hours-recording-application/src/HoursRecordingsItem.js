function HoursRecordingsItem(props){
    let date = (new Date()).toLocaleDateString("fi-FI", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

    return (
        <>
            <div style={{paddingTop:"30px"}}></div>
            <table id="table">
                <tbody>
                    <tr>
                        <th>#</th>
                        <th style={{padding:"0px 20px"}}>Date</th>
                        <th style={{padding:"0px 20px"}}>Start time</th>
                        <th style={{padding:"0px 20px"}}>End time</th>
                        <th>Hours</th>
                    </tr>
                {
                    props.hoursRecords.map((record, index) =>
                    <tr key={index}>
                        <td>{index+1}.</td>
                        <td style={{padding:"0px 20px"}}>{date}</td>
                        <td style={{padding:"0px 20px"}}>{record.start}</td>
                        <td style={{padding:"0px 20px"}}>{record.end}</td>
                    </tr>)
                }
                </tbody>
            </table>
        </>
    );
}
export default HoursRecordingsItem;