import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Container, ListGroup, ListGroupItem, FormControl, InputGroup } from 'react-bootstrap';
import { FaTrash, FaEdit } from 'react-icons/fa';

function Products() {
  const [products, setProducts] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', sellerId: '' });
  const [editingProduct, setEditingProduct] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchSellers();
  }, [sortOrder]);

  const fetchProducts = () => {
    let url = 'http://localhost:8080/api/products';
    if (sortOrder) {
      url += `?sortBy=price&order=${sortOrder}`;
    }
    axios.get(url)
        .then(response => setProducts(response.data))
        .catch(error => console.error('Error fetching products:', error));
  };

  const fetchSellers = () => {
    axios.get('http://localhost:8080/api/sellers')
        .then(response => setSellers(response.data))
        .catch(error => console.error('Error fetching sellers:', error));
  };

  const handleAdd = () => {
    axios.post('http://localhost:8080/api/products', newProduct)
        .then(response => {
          setProducts([...products, response.data]);
          setNewProduct({ name: '', price: '', description: '', sellerId: '' });
        })
        .catch(error => console.error('Error adding product:', error));
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8080/api/products/${id}`)
        .then(() => {
          setProducts(products.filter(product => product.id !== id));
        })
        .catch(error => console.error('Error deleting product:', error));
  };

  const handleEdit = (id) => {
    const productToEdit = products.find(product => product.id === id);
    setEditingProduct(productToEdit);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, [name]: value });
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };

  const handleSave = () => {
    if (editingProduct) {
      axios.put(`http://localhost:8080/api/products/${editingProduct.id}`, editingProduct)
          .then(response => {
            setProducts(products.map(product =>
                product.id === editingProduct.id ? response.data : product
            ));
            setEditingProduct(null);
          })
          .catch(error => console.error('Error updating product:', error));
    }
  };

  const handleCancel = () => {
    setEditingProduct(null);
  };

  const handleSort = (order) => {
    setSortOrder(order);
  };

  const handleResetSort = () => {
    setSortOrder(null);
  };

  return (
      <Container>
        <h4>Products</h4>
        <div className="mb-2">
          <Button variant="outline-primary" className="me-1" onClick={() => handleSort('asc')}>Sort by Price: Low to High</Button>
          <Button variant="outline-primary" className="me-1" onClick={() => handleSort('desc')}>Sort by Price: High to Low</Button>
          <Button variant="outline-primary" onClick={handleResetSort}>Reset Sort</Button>
        </div>
        <ListGroup>
          {products.map(product => (
              <ListGroupItem key={product.id} className="d-flex align-items-center mb-2">
                {editingProduct && editingProduct.id === product.id ? (
                    <div style={{ width: '100%' }}>
                      <FormControl
                          type="text"
                          name="name"
                          value={editingProduct.name}
                          onChange={handleChange}
                          placeholder="Name"
                          className="mb-2"
                      />
                      <FormControl
                          type="text"
                          name="price"
                          value={editingProduct.price}
                          onChange={handleChange}
                          placeholder="Price"
                          className="mb-2"
                      />
                      <FormControl
                          type="text"
                          name="description"
                          value={editingProduct.description}
                          onChange={handleChange}
                          placeholder="Description"
                          className="mb-2"
                      />
                      <FormControl
                          as="select"
                          name="sellerId"
                          value={editingProduct.sellerId}
                          onChange={handleChange}
                          className="mb-2"
                      >
                        <option value="">Select Seller</option>
                        {sellers.map(seller => (
                            <option key={seller.id} value={seller.id}>{seller.name}</option>
                        ))}
                      </FormControl>
                      <div>
                        <Button variant="primary" className="me-1" onClick={handleSave}>Save</Button>
                        <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
                      </div>
                    </div>
                ) : (
                    <>
                      <div className="flex-grow-1">
                        <p className="m-0">{product.name} - {product.price} - {product.description} - {product.sellerId}</p>
                      </div>
                      <div>
                        <Button variant="outline-primary" className="me-1">
                          <FaEdit onClick={() => handleEdit(product.id)} />
                        </Button>
                        <Button variant="outline-danger" onClick={() => handleDelete(product.id)}>
                          <FaTrash />
                        </Button>
                      </div>
                    </>
                )}
              </ListGroupItem>
          ))}
        </ListGroup>
        <div className="mt-3">
          <h5>Add Product</h5>
          <FormControl
              type="text"
              name="name"
              value={newProduct.name}
              onChange={handleChange}
              placeholder="Name"
              className="mb-2"
          />
          <FormControl
              type="text"
              name="price"
              value={newProduct.price}
              onChange={handleChange}
              placeholder="Price"
              className="mb-2"
          />
          <FormControl
              type="text"
              name="description"
              value={newProduct.description}
              onChange={handleChange}
              placeholder="Description"
              className="mb-2"
          />
          <FormControl
              as="select"
              name="sellerId"
              value={newProduct.sellerId}
              onChange={handleChange}
              className="mb-2"
          >
            <option value="">Select Seller</option>
            {sellers.map(seller => (
                <option key={seller.id} value={seller.id}>{seller.name}</option>
            ))}
          </FormControl>
          <Button variant="primary" onClick={handleAdd}>Add</Button>
        </div>
      </Container>
  );
}

export default Products;
