import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import agencyImgurl from '../assets/headlogo.png'

const Profile = () => {
    //const url="http://localhost:3000/"
    const url ="https://tilesapi.onrender.com/"
    const [shopName, setShopName] = useState('');
    const [shopOwner, setShopOwner] = useState('');
    const [shopMobile, setShopMobile] = useState('');
    const [shopAddr, setShopAddr] = useState('');
    const [shopEmail, setShopEmail] = useState('');
    const [shopPincode, setShopPincode] = useState('');
    const [shopGstNo, setShopGstNo] = useState('');
    const [shopGstPer, setShopGstPer] = useState('');
    
    const fetchData = async () => {
        try {
          const response = await axios.get(`${url}api/profile/66db12a6c3e7636aba3cc685`);
          setShopName(response.data.shopName);
          setShopOwner(response.data.shopOwner);
          setShopMobile(response.data.shopMobile);
          setShopAddr(response.data.shopAddr);
          setShopEmail(response.data.shopEmail);
          setShopGstNo(response.data.shopGstNo);
          setShopGstPer(response.data.shopGstPer);
          setShopPincode(response.data.shopPincode);
        } catch (error) {
          console.error('Error fetching data:', error);
          toast.error('Failed to fetch data');
        }
      };
      useEffect(() => {
        fetchData();
      }, []);
    const saveShop = async(e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`${url}api/profile/66db12a6c3e7636aba3cc685`,{
                shopName:shopName,
                shopOwner:shopOwner,
                shopAddr:shopAddr,
                shopMobile:shopMobile,
                shopEmail:shopEmail,
                shopPincode:shopPincode,
                shopGstNo:shopGstNo,
                shopGstPer:shopGstPer
            });
            toast.success("Updated Successfully...")
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }
    return (
        <div className='w-50 align-center'>
            <div className="max-w-lg shadow-lg mx-auto p-2 rounded " style={{ backgroundColor: "gray" }}>
                <div className="mb-2">
                    <img src={agencyImgurl} className="img-fluid rounded w-100" alt="Agency Logo" />
                </div>
                <form onSubmit={saveShop}>
                    <div className="input-group mb-3">
                    <span class="input-group-text">Shop Name</span>
                        <input
                            type="text"
                            value={shopName}
                            onChange={(e) => setShopName(e.target.value.toUpperCase())}
                            className="form-control"
                        />
                    </div>
                    <div className="input-group mb-3">
                    <span class="input-group-text">Owner Name</span>
                        <input
                            type="text"
                            value={shopOwner}
                            onChange={(e) => setShopOwner(e.target.value.toUpperCase())}
                            className="form-control"
                        />
                      <span class="input-group-text">Mobile</span>
                        <input
                            type="number"
                            value={shopMobile}
                            onChange={(e) => setShopMobile(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <div className="input-group mb-3">
                    <span class="input-group-text">Address</span>
                    <textarea class="form-control" 
                     value={shopAddr}
                     onChange={(e) => setShopAddr(e.target.value.toUpperCase())}
                    >

                    </textarea>
                    </div>
                    <div className="input-group mb-3">
                    <span class="input-group-text">Pincode</span>
                        <input
                            type="number"
                            value={shopPincode}
                            onChange={(e) => setShopPincode(e.target.value)}
                            className="form-control"
                        />
                      <span class="input-group-text">Email</span>
                        <input
                            type="text"
                            value={shopEmail}
                            onChange={(e) => setShopEmail(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <div className="input-group mb-3">
                    <span class="input-group-text">GST No:</span>
                        <input
                            type="text"
                            value={shopGstNo}
                            onChange={(e) => setShopGstNo(e.target.value.toUpperCase())}
                            className="form-control"
                        />
                      <span class="input-group-text">Gst %:</span>
                        <input
                            type="number"
                            value={shopGstPer}
                            onChange={(e) => setShopGstPer(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <button className='btn btn-primary w-100'>Save</button>
                </form>
                
            </div>
        </div>
    )
}

export default Profile