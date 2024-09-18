import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddProduct = ({show, handleClose}) => {
    // const url="http://localhost:3000/"
     const url ="https://tilesapi.onrender.com/"
     const [productName, setProductName] = useState('');
    const [productCode, setProductCode] = useState('');
    const [productDesc, setProductDesc] = useState('');
    const [productUnitPrice, setProductUnitPrice] = useState('');
    const [productGstPrice, setProductGstPrice] = useState('');
    const handleSave = async () => {
        try {
            const newTeacher = {
                productName:productName,
                productDesc:productDesc,
                productCode:productCode,
                productUnitPrice:productUnitPrice,
                productGstPrice:productGstPrice
            };

            await axios.post(`${url}api/product`, newTeacher);
            toast.success('Product added successfully');
           
           
        } catch (error) {
           toast.error('Failed to add Product');
            console.error(error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Product</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form>
                    <Form.Group>
                        <Form.Label>Product Name</Form.Label>
                        <Form.Control type="text" value={productName}  onChange={(e) => setProductName(e.target.value)}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Product Code</Form.Label>
                        <Form.Control type="text" value={productCode} onChange={(e) => setProductCode(e.target.value)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Unit Price</Form.Label>
                        <Form.Control type="number" value={productUnitPrice} onChange={(e) => setProductUnitPrice(e.target.value)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>GST % </Form.Label>
                        <Form.Control type="number" value={productGstPrice} onChange={(e) => setProductGstPrice(e.target.value)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Description"
                            value={productDesc}
                            onChange={(e) => setProductDesc(e.target.value)}
                        />
                    </Form.Group>
                   
                   
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSave}>
                   Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddProduct;
