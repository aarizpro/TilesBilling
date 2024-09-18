import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import DataTable from 'react-data-table-component';
import { CSVLink } from 'react-csv';

const BillDetails = () => {
  const [data, setData] = useState([]);
  const [searchAwb, setSearchAwb] = useState("");
  const [searchMobile, setSearchMobile] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
 //const url="http://localhost:3000/"
 const url ="https://tilesapi.onrender.com/"
  
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${url}api/billing?sortBy[]=createdAt&sortOrder[]=desc`);
      console.log(response.data); // Log data to check structure
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    }
  };
  const filterDataByDate = () => {
    const filteredData = data.filter(row => {
      const rowDate = new Date(row.createdAt);
      const start = fromDate ? new Date(fromDate) : new Date("1900-01-01");
      const end = toDate ? new Date(toDate) : new Date();
  
      // Set end date time to the end of the day to include entries on that date
      end.setHours(23, 59, 59, 999);
  
      return rowDate >= start && rowDate <= end;
    });
    setData(filteredData);
  };
  const filteredData = data.filter(row => 
    (searchAwb === "" || row.invoiceNo.toLowerCase().includes(searchAwb.toLowerCase()))
  );

  console.log("Filtered Data:", filteredData); // Log filtered data

  const columns = [
    { name: 'Date', selector: row => row.invoiceDate, sortable: true, csvKey: 'invoiceDate' },
    { name: 'Name', selector: row => row.custName, sortable: true, csvKey: 'custName' },
    { name: 'Address', selector: row => row.custAddr, sortable: true, csvKey: 'custAddr' },
    { name: 'Mobile', selector: row => row.custMobile, sortable: true, csvKey: 'custMobile' },
    { name: 'Email', selector: row => row.custEmail, sortable: true, csvKey: 'custEmail' },
    { name: 'Pincode', selector: row => row.custPincode, sortable: true, csvKey: 'custPincode' },
    { name: 'GST No', selector: row => row.custGstNo, sortable: true, csvKey: 'custGstNo' },
    { name: 'Invoice No', selector: row => row.invoiceNo, sortable: true, csvKey: 'invoiceNo' },
    { name: 'P-code', selector: row => row.productCode, sortable: true, csvKey: 'productCode' },
    { name: 'Product', selector: row => row.productName, sortable: true, csvKey: 'productName' },
    { name: 'Unit Price', selector: row => row.unitPrice, sortable: true, csvKey: 'unitPrice' },
    { name: 'Quantity', selector: row => row.billCount, sortable: true, csvKey: 'billCount' },
    { name: 'Bill Amount', selector: row => row.billValue, sortable: true, csvKey: 'billValue' },
    { name: 'GST Amount', selector: row => row.gstValue, sortable: true, csvKey: 'gstValue' },
    { name: 'Invoice Amount', selector: row => row.invoiceValue, sortable: true, csvKey: 'invoiceValue' },
    {
      name: 'Action',
      cell: row => (
        <div>
          <button
            onClick={() => deleteAirway(row._id)}
            className='btn btn-danger'
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const csvHeaders = columns
    .filter(col => col.csvKey) // Filter out columns that don't have a `csvKey`
    .map(col => ({ label: col.name, key: col.csvKey }));

  const deleteAirway = async (id) => {
    try {
      await axios.delete(`${url}api/billing/${id}`);
      toast.success('Deleted Successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete');
      console.log(error);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
    <div className="bg-white shadow-lg p-4 rounded-lg container">
      <h1 className="text-center font-weight-bold mb-3">
        Billing Details
      </h1>
      <div className="d-flex justify-content-end mb-3">
        <CSVLink
          data={filteredData}
          headers={csvHeaders}
          filename={"billing-report.csv"}
          className="btn btn-primary"
        >
          Download CSV
        </CSVLink>
      </div>
      <div className="row g-3 mb-3">
        <div className="col-auto">
          <label className="form-label">From Date:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="col-auto">
          <label className="form-label">To Date:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="col-auto align-self-end">
          <button
            onClick={filterDataByDate}
            className="btn btn-primary"
          >
            Show Data
          </button>
        </div>
        <div className="col-auto align-self-end">
          <input
            type="text"
            placeholder="Search by Invoice No"
            value={searchAwb}
            onChange={(e) => setSearchAwb(e.target.value)}
            className="form-control"
          />
        </div>
       
      </div>
      <div className="flex-grow-1">
        <DataTable
          columns={columns}
          data={filteredData}
          fixedHeader
          pagination
          paginationPerPage={5}
          paginationRowsPerPageOptions={[5]}
          responsive
          highlightOnHover
          striped
          customStyles={{
            headCells: {
              style: {
                fontSize: '16px',
                fontWeight: 'bold',
                backgroundColor: '#f5f5f5',
                textAlign: 'center',
              },
            },
            cells: {
              style: {
                fontSize: '14px',
                textAlign: 'center',
              },
            },
            rows: {
              style: {
                minHeight: '56px',
              },
            },
          }}
        />
      </div>
    </div>
  </div>
  
  );
};

export default BillDetails;
