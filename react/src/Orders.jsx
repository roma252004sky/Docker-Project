import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Container, Button, ListGroup, FormControl} from 'react-bootstrap';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [newOrder, setNewOrder] = useState({ buyerName: '', buyerEmail: '', selectedProducts: [] });
  const [editingOrder, setEditingOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const fetchOrders = () => {
    axios.get('http://localhost:8080/api/orders')
        .then(response => setOrders(response.data))
        .catch(error => console.error('Error fetching orders:', error));
  };

  const fetchProducts = () => {
    axios.get('http://localhost:8080/api/products')
        .then(response => setProducts(response.data))
        .catch(error => console.error('Error fetching products:', error));
  };

  const handleAdd = () => {
    axios.post('http://localhost:8080/api/orders', newOrder)
        .then(response => {
          setOrders([...orders, response.data]);
          setNewOrder({ buyerName: '', buyerEmail: '', selectedProducts: [] });
        })
        .catch(error => console.error('Error adding order:', error));
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8080/api/orders/${id}`)
        .then(response => {
          setOrders(orders.filter(order => order.id !== id));
        })
        .catch(error => console.error('Error deleting order:', error));
  };

  const handleEdit = (id) => {
    const orderToEdit = orders.find(order => order.id === id);
    setEditingOrder(orderToEdit);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editingOrder) {
      setEditingOrder({ ...editingOrder, [name]: value });
    } else {
      setNewOrder({ ...newOrder, [name]: value });
    }
  };

  const handleProductSelect = (e) => {
    const selectedProductIds = Array.from(e.target.selectedOptions, option => option.value);
    const selectedProducts = products.filter(product => selectedProductIds.includes(product.id));
    if (editingOrder) {
      setEditingOrder({ ...editingOrder, selectedProducts });
    } else {
      setNewOrder({ ...newOrder, selectedProducts });
    }
  };

  const handleSave = () => {
    if (editingOrder) {
      axios.put(`http://localhost:8080/api/orders/${editingOrder.id}`, editingOrder)
          .then(response => {
            setOrders(orders.map(order =>
                order.id === editingOrder.id ? response.data : order
            ));
            setEditingOrder(null);
          })
          .catch(error => console.error('Error updating order:', error));
    }
  };

  const handleCancel = () => {
    setEditingOrder(null);
  };

  const handleSearch = () => {
    axios.get(`http://localhost:8080/api/orders/search?query=${searchQuery}`)
        .then(response => setOrders(response.data))
        .catch(error => console.error('Error searching orders:', error));
  };

  return (
      <Container>
        <h4>Orders</h4>
        <div className="mb-2 d-flex align-items-center">
          <FormControl
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant="primary" onClick={handleSearch} className="ms-2">Search</Button>
        </div>
        <ListGroup>
          {orders.map(order => (
              <ListGroup.Item key={order.id}>
                {editingOrder && editingOrder.id === order.id ? (
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Buyer Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="buyerName"
                            value={editingOrder.buyerName}
                            onChange={handleChange}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Buyer Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="buyerEmail"
                            value={editingOrder.buyerEmail}
                            onChange={handleChange}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Selected Products</Form.Label>
                        <Form.Control
                            as="select"
                            multiple
                            name="selectedProducts"
                            value={editingOrder.selectedProducts.map(product => product.id)}
                            onChange={handleProductSelect}
                        >
                          {products.map(product => (
                              <option key={product.id} value={product.id}>{product.name}</option>
                          ))}
                        </Form.Control>
                      </Form.Group>
                      <div className="d-flex">
                        <Button variant="primary" className="me-2" onClick={handleSave}>Save</Button>
                        <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
                      </div>
                    </Form>
                ) : (
                    <div>
                      <p>{order.buyerName}</p>
                      <p>{order.buyerEmail}</p>
                      <ul>
                        {order.selectedProducts && order.selectedProducts.map(product => (
                            <li key={product.id}>{product.name}</li>
                        ))}
                      </ul>
                      <div>
                        <Button variant="primary" className="me-2" onClick={() => handleEdit(order.id)}>
                          Edit
                        </Button>
                        <Button variant="danger" onClick={() => handleDelete(order.id)}>
                          Delete
                        </Button>
                      </div>
                    </div>
                )}
              </ListGroup.Item>
          ))}
        </ListGroup>
        <div className="mt-4">
          <h5>Add Order</h5>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Buyer Name</Form.Label>
              <Form.Control
                  type="text"
                  name="buyerName"
                  value={newOrder.buyerName}
                  onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Buyer Email</Form.Label>
              <Form.Control
                  type="email"
                  name="buyerEmail"
                  value={newOrder.buyerEmail}
                  onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Selected Products</Form.Label>
              <Form.Control
                  as="select"
                  multiple
                  name="selectedProducts"
                  value={newOrder.selectedProducts.map(product => product.id)}
                  onChange={handleProductSelect}
              >
                {products.map(product => (
                    <option key={product.id} value={product.id}>{product.name}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button variant="primary" onClick={handleAdd}>
              Add
            </Button>
          </Form>
        </div>
      </Container>
  );
}

export default Orders;
