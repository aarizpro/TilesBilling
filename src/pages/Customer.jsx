import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import DataTable from 'react-data-table-component';
import AddCustomer from '../components/AddCustomer';
import EditCustomer from '../components/EditCustomer';
const Customer = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedClients, setSelectedClients] = useState(null);
  const [showModal1, setShowModal1] = useState(false);
  const [custName, setCustName] = useState("");
  const [custAddr, setCustAddr] = useState("");
  const [custEmail, setCustEmail] = useState("");
  const [custMob, setCustMob] = useState("");
  const [custCode, setCustCode] = useState("");
  const [custPincode, setCustPincode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [data, setData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  //const url="http://localhost:3000/"
  const url ="https://tilesapi.onrender.com/"
 
  
  useEffect(() => {
    fetchData();
  }, []);
  const handleAdd = () => {
    setShowModal1(true);
};
const handleClose = () => {
  setShowModal1(false);
  setShowModal(false);
  setSelectedClients(null);
  fetchData();
 };
 const handleEdit = (clients) => {
  setSelectedClients(clients);
  setShowModal(true);
  fetchData();
};
  const fetchMobno = async () => {
    try {
      const response = await axios.get(`${url}api/customer/search?field=custMob&value=${custMob}`);
      if (response.data.length > 0) {
      
        setIsButtonVisible(false);
        toast.error('Customer detail already added');
      } else {
      
        setIsButtonVisible(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (custMob.length === 10) {
      fetchMobno();
    } else {
     
      setIsButtonVisible(false);
    }
  }, [custMob]);

  const handleCustMob = (e) => {
    setCustMob(e.target.value);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${url}api/customer`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    }
  };

  const filteredData = data.filter(row => 
    row.custName.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
        name: 'Mobile No',
        selector: row => row.custMobile,
      },
    {
      name: 'Name',
      selector: row => row.custName,
    },
    {
      name: 'Address',
      selector: row => row.custAddr,
    },
    {
      name: 'Pincode',
      selector: row => row.custPincode,
    },
    {
      name: 'Email',
      selector: row => row.custEmail,
    },
    {
      name: 'GST No',
      selector: row => row.custGstNo,
    },
    {
        name: 'Description',
        selector: row => row.custDesc,
      },
    {
      name: 'Action',
      cell: row => (
        <div className="d-flex justify-content-between p-2">
            <div className='p-2'> 
          <button
            onClick={() => editAirway(row)}
            class="btn btn-success"
          >
           <i class="bi bi-pencil-square"></i> 
          </button>
          </div>

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

 

  const editAirway = (row) => {
   
    handleEdit(row);
  };

  const deleteAirway = async (id) => {
    try {
      await axios.delete(`${url}api/customer/${id}`);
      toast.success('Deleted Successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete');
      console.log(error);
    }
  };

  return (
    <div className='flex'>
      <div className='w-1/2 max-w-lg bg-white shadow-lg p-7 rounded mt-2'>
        <h2 className='font-semibold  mb-2 block text-center'>
         Customer Details
        </h2>
        
      </div>

      <div className='w-1/1 pt-4 pl-4 rounded flex flex-col'>
      <div className="d-flex justify-content-between mb-2 p-2">
        <div className='p-2'>
        <input 
          type="text" 
          placeholder="Search by Customer Name" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className='mb-4 p-2 border border-gray-300 rounded'
        />
        </div>
        <div className='p-2'>
        <button type="button" class="btn btn-success" onClick={handleAdd}><i class="bi bi-person-plus-fill"></i></button>
        </div>
        </div>
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
      {selectedClients && (
                <EditCustomer
                    show={showModal}
                    handleClose={handleClose}
                    clients={selectedClients}
                    
                />
            )}
      <AddCustomer
                show={showModal1}
                handleClose={handleClose}
       />
    </div>
  );
}

export default Customer;
