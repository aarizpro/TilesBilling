import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react'
import BillProduct from '../components/BillProduct';
import DataTable from 'react-data-table-component';
import { toast } from 'react-toastify';
import logo from '../assets/headlogo.png';
import { numberToWords } from 'number-to-words';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Billing = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [invoiceNo, setInvoiceNo] = useState('');
 //const url="http://localhost:3000/"
 const url ="https://tilesapi.onrender.com/"
  const [shopDetails, setShopDetails] = useState([]);
  const [customerDetails, setCustomerDetails] = useState([]);
  const [custMobile, setCustMobile] = useState('');
  const [custName, setCustName] = useState('');
  const [custAddr, setCustAddr] = useState('');
  const [custPincode, setCustPincode] = useState('');
  const [custGstNo, setCustGstNo] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [showModal1, setShowModal1] = useState(false);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [totalInvoice, setTotalInvoice] = useState(0);
  const [billValue, setBillValue] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const printRef = useRef();
  const [words, setWords] = useState('');
  const saveCustomer = async () => {
    try {
      // Fetch the invoice based on the invoice number
      const response = await axios.get(`${url}api/customer/search?field[]=custMobile&value[]=${custMobile}`);
      
      // Check if the invoice already exists in the database
      if (response.data.length === 0) { // Assuming response.data contains the search result
        const newInvoice = {
          custName: custName,
          custMobile: custMobile,
          custGstNo: custGstNo,
          custAddr:custAddr,
          custPincode:custPincode,
          custEmail:custEmail,
          custDesc:"new Cust"
        };
        
        // Save the new invoice
        await axios.post(`${url}api/customer`, newInvoice);
      } 
      
    } catch (error) {
      console.log(error);
      
    }
  };
 
  const saveInvoice = async () => {
    if(billValue===0||gstAmount===0||totalInvoice===0){
      alert("First Add Product and Generate Invoice");
    }else{

   
    try {
      // Fetch the invoice based on the invoice number
      const response = await axios.get(`${url}api/invoice/search?field[]=invNumber&value[]=${invoiceNo}`);
      
      // Check if the invoice already exists in the database
      if (response.data.length === 0) { // Assuming response.data contains the search result
        const newInvoice = {
          custName: custName,
          custMobile: custMobile,
          custGstNo: custGstNo,
          invDate: date,
          invNumber: invoiceNo,
          billValue: billValue,
          gstAmount: gstAmount,
          totalAmount: totalInvoice
        };
        
        // Save the new invoice
        await axios.post(`${url}api/invoice`, newInvoice);
        toast.success('Invoice added successfully');
        
        // Proceed to download the image
        await saveCustomer();
        await downloadImage();
      } else {
        // If the invoice already exists
        toast.info('Invoice already saved');
        
        // Download image if needed for existing invoice
        await downloadImage();
      }
      
    } catch (error) {
      console.log(error);
      toast.error('Failed to add Invoice');
    }
  }
  };
  const downloadImage = async() => {
    if (printRef.current) {
      try {
      
        const canvas = await html2canvas(printRef.current);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save('Invoice.pdf');

        toast.success('Downloaded');
      } catch (error) {
        console.error('Failed to generate PDF:', error);
        toast.error('Failed to download the PDF');
      }
    }
    
  }
  
  const handleConvert = () => {
    const numericAmount = parseFloat(totalInvoice);
    if (!isNaN(numericAmount)) {
      setWords(` Rupees ${numberToWords.toWords(numericAmount)}  Only.`);
    } else {
      setWords('Invalid input');
    }
  };
  // const generateInvoiceNo = async() => {
  //  const prefix = 'INV';
  //   const randomNumber = Math.floor(100000 + Math.random() * 900000);
  //   return `${prefix}-${randomNumber}`;
  // };
  const generateInvoiceNo = async () => {
    let maxInv = 0; 
    try {
        const response = await axios.get(`${url}api/invoice`); 
        let invoices = response.data;
        invoices.forEach(invoice => {
            if (invoice.invNumber > maxInv) {
                maxInv = invoice.invNumber; 
            }
        });
        setInvoiceNo(formatNumber(maxInv+1));
    } catch (error) {
        console.log(error); // Handle errors
    }

    return maxInv; // Return the maximum invNumber
};
const formatNumber = (num) => {
  // Define the total length of the string you want, e.g., 5 characters
  const length = 5;
  return num.toString().padStart(length, '0');
};

  const fetchData = async () => {
    try {
      const response = await axios.get(`${url}api/profile/66db12a6c3e7636aba3cc685`);
      setShopDetails(response.data);
      //console.log(shopGstNo);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    }
  };
  const clearCustomerDetails = () => {
    setCustName("");
    setCustAddr("");
    setCustPincode("");
    setCustEmail("");
    setCustGstNo("");
  };
  const fetchData1 = async (mobileNo) => {
    try {
      const response = await axios.get(`${url}api/customer/search`, {
        params: {
          'field[]': 'custMobile',
          'value[]': mobileNo,
        },
      });
  
      const data = response.data;
  
      if (data.length > 0) {
        const customer = data[0];
        setCustName(customer.custName || "");
        setCustAddr(customer.custAddr || "");
        setCustPincode(customer.custPincode || "");
        setCustEmail(customer.custEmail || "");
        setCustGstNo(customer.custGstNo || "");
        setCustomerDetails(customer);
      } else {
        clearCustomerDetails(); // Call the function to clear details
      }
    } catch (error) {
      clearCustomerDetails(); // Clear in case of an error
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch customer data');
    }
  };
  const handleMobno = (e) => {
    const mobileNo = e.target.value;
    setCustMobile(mobileNo);
    
    if (mobileNo.length === 10) {
      fetchData1(mobileNo);
    }else {
     
      setCustName("");
      setCustAddr("");
      setCustPincode("");
      setCustEmail("");
      setCustGstNo("");
    }

  }
  useEffect(() => {
    fetchData();
   generateInvoiceNo();

  }, []);
  useEffect(() => {
    handleConvert();
  }, [totalInvoice, billValue, gstAmount]);
  const AddProduct = () => {

    if (custMobile === "" || custName === "" || custAddr === "" || custPincode === "" || custEmail === "" || custGstNo === "") {
      alert("Enter All Details");
    } else {
      setShowModal1(true);
      fetchData2(invoiceNo);

    }

  }
  const handleClose = () => {
    setShowModal1(false);
    fetchData2(invoiceNo);


  };
  const deleteAirway = async (id) => {
    try {
      await axios.delete(`${url}api/billing/${id}`);
      toast.success('Deleted Successfully');
      fetchData();
      fetchData2(invoiceNo);

    } catch (error) {
      toast.error('Failed to delete');
      console.log(error);
    }
  };
  const fetchData2 = async (inno) => {
    try {
      const response = await axios.get(`${url}api/billing/search?field[]=invoiceNo&value[]=${inno}`);
      const data = response.data;

      const totalBillValue = data.reduce((sum, item) => sum + parseFloat(item.billValue || 0), 0);
      const totalGstValue = data.reduce((sum, item) => sum + parseFloat(item.gstValue || 0), 0);
      const totalInvoiceValue = data.reduce((sum, item) => sum + parseFloat(item.invoiceValue || 0), 0);
      setData(data);
      setBillValue(totalBillValue.toFixed(2));
      setGstAmount(totalGstValue.toFixed(2));
      setTotalInvoice(totalInvoiceValue.toFixed(2));

    } catch (error) {
      console.error('Error fetching data:', error);
      // toast.error('Failed to fetch data');
    }
  };

  const filteredData = data.filter(row =>
    row.productName.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      name: 'Date',
      selector: row => row.invoiceDate,
    },
    {
      name: 'Invoice No',
      selector: row => row.invoiceNo,
    },
    {
      name: 'Cust Name',
      selector: row => row.custName,
    },
    {
      name: 'Product Name',
      selector: row => row.productName,
    },
    {
      name: 'Unit Price',
      selector: row => row.unitPrice,
    },
    {
      name: 'Count',
      selector: row => row.billCount,
    },
    {
      name: 'Bill Value',
      selector: row => row.billValue,
    },
    {
      name: 'Gst',
      selector: row => row.gstValue,
    },
    {
      name: 'Invoice Value',
      selector: row => row.invoiceValue,
    },
    {
      name: 'Action',
      cell: row => (
        <div className="d-flex justify-content-between p-2">
          <div className='p-2'>
            <button
              onClick={() => deleteAirway(row._id)}
              class="btn btn-danger"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      ),
    },
  ];

  const columns1 = [

    {
      name: 'Product Name',
      selector: row => row.productName,
    },
    {
      name: 'Unit Price',
      selector: row => row.unitPrice,
      right: true
    },
    {
      name: 'Count',
      selector: row => row.billCount,
      center: true
    },
    {
      name: 'Bill Value',
      selector: row => row.billValue,
      right: true
    },
    {
      name: 'Gst Value',
      selector: row => row.gstValue,
      right: true
    },
    {
      name: 'Invoice Value',
      selector: row => row.invoiceValue,
      right: true
    }
  ];
  const handleInvoice = (e) => {
    const a = e.target.value.toUpperCase();
    setInvoiceNo(a);
    fetchData2(a);

  }

  return (
    <div className="container p-1 w-75">
      <div className="row mb-2">
        <div className="input-group col-md-2">
          <span class="input-group-text">Date:</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="form-control"
          />

          <span class="input-group-text">Invoice No:</span>

          <input
            type="text"
            value={invoiceNo}
            onChange={handleInvoice}
            className="form-control"
          />
          <button className="btn btn-secondary" onClick={() => setInvoiceNo(generateInvoiceNo())}>
            <i class="bi bi-joystick"></i>
          </button>
          <span class="input-group-text">GST No:</span>

          <input
            type="text"
            value={shopDetails.shopGstNo}
            onChange={(e) => setShopGstNo(e.target.value.toUpperCase())}
            className="form-control"
          />
        </div>
      </div>
      <div className="row mb-2">
        <div className="input-group col-md-2">
          <span class="input-group-text">Mobile No:</span>

          <input
            type="text"
            value={custMobile}
            onChange={handleMobno}
            className="form-control"
            placeholder='Enter Customer Mobile No'
          />
          <span class="input-group-text">Customer Name:</span>

          <input
            type="text"
            value={custName}
            onChange={(e) => setCustName(e.target.value.toUpperCase())}
            className="form-control"
            placeholder='Enter Customer Name'
          />
        </div>
      </div>
      <div className="row mb-2">
        <div className="input-group col-md-2">
          <span class="input-group-text">Address:</span>

          <textarea
            type="text"
            value={custAddr}
            onChange={(e) => setCustAddr(e.target.value.toUpperCase())}
            className="form-control"
            placeholder='Enter Customer Address'
          />

        </div>
      </div>
      <div className="row mb-2">
        <div className="input-group col-md-2">
          <span class="input-group-text">Pincode:</span>
          <input
            type="number"
            value={custPincode}
            onChange={(e) => setCustPincode(e.target.value)}
            className="form-control"
            placeholder='Enter Pincode'
          />

          <span class="input-group-text">Email ID:</span>

          <input
            type="text"
            value={custEmail}
            onChange={(e) => setCustEmail(e.target.value)}
            className="form-control"
            placeholder='Enter Email ID'
          />
          <span class="input-group-text">Customer GST No:</span>

          <input
            type="text"
            value={custGstNo}
            onChange={(e) => setCustGstNo(e.target.value.toUpperCase())}
            className="form-control"
            placeholder='Enter Customer GST No'
          />
        </div>
      </div>
      <div className="row mb-2">
        <div className="input-group col-md-2">
          <span class="input-group-text">Bill Value: </span>
          <input
            type="text"
            value={billValue}
            onChange={(e) => setBillValue(e.target.value.toUpperCase())}
            className="form-control"
            placeholder='0.00'
            style={{ textAlign: 'right' }}
          />
          <span class="input-group-text">Gst Amount: </span>
          <input
            type="text"
            value={gstAmount}
            onChange={(e) => setGstAmount(e.target.value.toUpperCase())}
            className="form-control"
            placeholder='0.00'
            style={{ textAlign: 'right' }}

          />
          <span class="input-group-text">Total Invoice Value: </span>
          <input
            type="text"
            value={totalInvoice}
            onChange={(e) => setTotalInvoice(e.target.value.toUpperCase())}
            className="form-control"
            placeholder='0.00'
            style={{ textAlign: 'right' }}
          />
          <button className='btn btn-primary' onClick={saveInvoice}><i class="bi bi-key-fill"></i> Genrate Invoice</button>
          <button className='btn btn-success' onClick={AddProduct}><i class="bi bi-cart-plus-fill"></i> Add Item</button>
        </div>
      </div>

      <div className='w-1/1 pt-4 pl-4 rounded flex flex-col'>
        <div className="flex-grow">
          <DataTable
            columns={columns}
            data={filteredData}
            selectableRows
            fixedHeader
            pagination
          />
        </div>
      </div>
      <BillProduct
        show={showModal1}
        shopDet={shopDetails}
        custName={custName}
        custAddr={custAddr}
        custEmail={custEmail}
        custMobile={custMobile}
        custPincode={custPincode}
        custGstNo={custGstNo}
        invoiceNo={invoiceNo}
        invDate={date}
        handleClose={handleClose}
      />
      {/* <div ref={printRef} className="my-4 border border-dark">
        <div className="row mb-2">
          <div className="col-md-12 p-2 d-flex justify-content-center align-items-center w-100">
            <img src={logo} alt="Agency Logo" className="img-fluid w-75" style={{ height: '100%', objectFit: 'cover' }} />
          </div>

        </div>
        <div className="row mb-2">
          <div className="col-md-6 p-2 d-flex justify-content-start align-items-center border border-dark">
            <p>Date:</p>
          </div>
          <div className="col-md-6 p-2 d-flex justify-content-end align-items-center border border-dark">
            <p>GST No:</p>
          </div>
        </div>
      </div> */}
      <div ref={printRef} className="my-4 border border-dark" style={{ overflow: 'hidden' }}>
        <div className='p-4'>
        <div className="row mb-2">
          <div className="col-md-12 p-2 d-flex justify-content-center align-items-center w-100">
            <img src={logo} alt="Agency Logo" className="img-fluid w-100" style={{ objectFit: 'contain' }} />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12  d-flex justify-content-center align-items-center border border-dark">
            <p className='fw-bold'>INVOICE</p>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6  d-flex justify-content-start align-items-center border border-dark">
            <p className='px-2'>Date: {date}</p>
          </div>
          <div className="col-md-6 d-flex justify-content-end align-items-center border border-dark">
            <p>GST No: {shopDetails.shopGstNo}</p>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 d-flex flex-column justify-content-start align-items-start border border-dark">
            <p className="px-2 fw-bold mb-2">Ship/Bill To:</p>
            <p className="px-2 mb-2">{custName}</p>
            <p className="px-2 mb-2">{custAddr}</p>
            <p className="px-2 mb-2">{custPincode}</p>
            <p className="px-2 mb-2">{custMobile}</p>
            <p className="px-2 mb-2">{custEmail}</p>
            <p className="px-2 mb-2">{custGstNo}</p>
          </div>
          <div className="col-md-6 d-flex flex-column justify-content-start align-items-end border border-dark">
            <p className="mb-2">Invoice No: {invoiceNo}</p>
            <p className="mb-2">Invoice Date: {date}</p>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12  d-flex justify-content-center align-items-center border border-dark">
            <DataTable
              columns={columns1}
              data={filteredData}
              fixedHeader
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6  d-flex justify-content-start align-items-start border border-dark">
            <p className='fw-bold p-2'>Amount in Words: </p>
            <p className='p-2'>{words}</p>
          </div>
          <div className="col-md-6 d-flex flex-column justify-content-start align-items-end border border-dark">
            <p className="mb-2 fw-bold">Bill Amount : {billValue}</p>
            <p className="mb-2 fw-bold">GST Amount: {gstAmount}</p>
            <p className="mb-2 fw-bold">Total Invoice Amount: {totalInvoice}</p>
          </div>
        </div>
        <div className="row">
        <div className="col-md-12 d-flex flex-column justify-content-start align-items-end border border-dark">
            <p className="mb-5">For Kailash Tiles</p>
            <p className="mb-2">Authorised Signature </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Billing