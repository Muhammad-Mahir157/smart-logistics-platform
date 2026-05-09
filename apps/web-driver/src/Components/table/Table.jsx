import "./table.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const List = () => {
  const rows = [
    {
      id: 1143155,
      Driver_Name: "Talha Ahmad",
      img: "https://i.dailymail.co.uk/1s/2019/04/01/17/11723940-6873499-Another_Pakistani_man_featured_in_the_series_is_Zaki_Arshad_a_th-a-100_1554137746764.jpg",
      Shipper_Name: "John Smith",
      date: "1 January",
      amount: 7800,
      method: "Cash",
      status: "Approved",
    },
    {
      id: 2235235,
      Driver_Name: "Talha Ahmad",
      img: "https://i.dailymail.co.uk/1s/2019/04/01/17/11723940-6873499-Another_Pakistani_man_featured_in_the_series_is_Zaki_Arshad_a_th-a-100_1554137746764.jpg",
      Shipper_Name: "Michael Doe",
      date: "1 January",
      amount: 900,
      method: "Online Payment",
      status: "Pending",
    },
    {
      id: 2342353,
      Driver_Name: "Talha Ahmad",
      img: "https://i.dailymail.co.uk/1s/2019/04/01/17/11723940-6873499-Another_Pakistani_man_featured_in_the_series_is_Zaki_Arshad_a_th-a-100_1554137746764.jpg",
      Shipper_Name: "John Smith",
      date: "1 January",
      amount: 350,
      method: "Cash",
      status: "Approved",
    },
    {
      id: 2357741,
      Driver_Name: "Talha Ahmad",
      img: "https://i.dailymail.co.uk/1s/2019/04/01/17/11723940-6873499-Another_Pakistani_man_featured_in_the_series_is_Zaki_Arshad_a_th-a-100_1554137746764.jpg",
      Shipper_Name: "Jane Smith",
      date: "1 January",
      amount: 920,
      method: "Online",
      status: "Approved",
    },
    {
      id: 2342355,
      Driver_Name: "Talha Ahmad",
      img: "https://i.dailymail.co.uk/1s/2019/04/01/17/11723940-6873499-Another_Pakistani_man_featured_in_the_series_is_Zaki_Arshad_a_th-a-100_1554137746764.jpg",
      Shipper_Name: "Harold Carol",
      date: "1 January",
      amount: 2000,
      method: "Online",
      status: "Approved",
    },
  ];
  return (
    <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="tableCell">Tracking ID</TableCell>
            <TableCell className="tableCell">Driver_Name</TableCell>
            <TableCell className="tableCell">Shipper_Name</TableCell>
            <TableCell className="tableCell">Date</TableCell>
            <TableCell className="tableCell">Amount</TableCell>
            <TableCell className="tableCell">Payment Method</TableCell>
            <TableCell className="tableCell">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="tableCell">{row.id}</TableCell>
              <TableCell className="tableCell">
                <div className="cellWrapper">
                  <img src={row.img} alt="" className="image" />
                  {row.Driver_Name}
                </div>
              </TableCell>
              <TableCell className="tableCell">{row.Shipper_Name}</TableCell>
              <TableCell className="tableCell">{row.date}</TableCell>
              <TableCell className="tableCell">{row.amount}</TableCell>
              <TableCell className="tableCell">{row.method}</TableCell>
              <TableCell className="tableCell">
                <span className={`status ${row.status}`}>{row.status}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default List;