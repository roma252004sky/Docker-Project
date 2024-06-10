import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, ListGroup, FormControl, InputGroup } from 'react-bootstrap';
import { PencilSquare, Trash } from 'react-bootstrap-icons';

function Sellers() {
  const [sellers, setSellers] = useState([]);
  const [newSeller, setNewSeller] = useState({ name: '', email: '', phone: '' });
  const [editingSeller, setEditingSeller] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchSellers();
  }, [searchQuery]); 

  const fetchSellers = () => {
    let url = 'http://localhost:8080/api/sellers';
    if (searchQuery) {
      url += `?query=${searchQuery}`;
    }
    axios.get(url)
      .then(response => {
        setSellers(response.data);
      })
      .catch(error => console.error('Error fetching sellers:', error));
  };

  const handleAdd = () => {
    axios.post('http://localhost:8080/api/sellers', newSeller)
      .then(response => {
        setSellers(prevSellers => [...prevSellers, response.data]);
        setNewSeller({ name: '', email: '', phone: '' });
      })
      .catch(error => console.error('Error adding seller:', error));
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8080/api/sellers/${id}`)
.then(() => {
  setSellers(prevSellers => prevSellers.filter(seller => seller.id !== id));
})
    .catch(error => console.error('Error deleting seller:', error));
};

const handleEdit = (id) => {
  const sellerToEdit = sellers.find(seller => seller.id === id);
  setEditingSeller(sellerToEdit);
};

const handleChange = (e) => {
  const { name, value } = e.target;
  if (editingSeller) {
    setEditingSeller({ ...editingSeller, [name]: value });
  } else {
    setNewSeller({ ...newSeller, [name]: value });
  }
};

const handleSave = () => {
  if (editingSeller) {
    axios.put(`http://localhost:8080/api/sellers/${editingSeller.id}`, editingSeller)
        .then(response => {
          setSellers(prevSellers => prevSellers.map(seller =>
              seller.id === editingSeller.id ? response.data : seller
          ));
          setEditingSeller(null);
        })
        .catch(error => console.error('Error updating seller:', error));
  }
};

const handleCancel = () => {
  setEditingSeller(null);
};

const handleSearch = () => {
  fetchSellers();
};

const handleResetSearch = () => {
  setSearchQuery('');
  fetchSellers();
};

return (
    <Container>
      <h4>Продавцы</h4>
      <InputGroup className="mb-3">
        <FormControl
            placeholder="Поиск по имени или номеру телефона"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button variant="outline-primary" onClick={handleSearch}>Поиск</Button>
        <Button variant="outline-secondary" onClick={handleResetSearch}>Сбросить</Button>
      </InputGroup>
      <ListGroup>
        {sellers.map(seller => (
            <ListGroup.Item key={seller.id} className="d-flex align-items-center">
              {editingSeller && editingSeller.id === seller.id ? (
                  <div style={{ width: '100%' }}>
                    <Form.Control
                        type="text"
                        name="name"
                        value={editingSeller.name}
                        onChange={handleChange}
                        placeholder="Имя"
                        className="mb-2"
                    />
                    <Form.Control
                        type="email"
                        name="email"
                        value={editingSeller.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="mb-2"
                    />
                    <Form.Control
                        type="text"
                        name="phone"
                        value={editingSeller.phone}
                        onChange={handleChange}
                        placeholder="Телефон"
                        className="mb-2"
                    />
                    <Button variant="primary" onClick={handleSave} className="me-1">Сохранить</Button>
                    <Button variant="secondary" onClick={handleCancel}>Отмена</Button>
                  </div>
              ) : (
                  <div style={{ width: '100%' }}>
                    <span>{seller.name} - {seller.email} - {seller.phone}</span>
                    <Button variant="outline-primary" onClick={() => handleEdit(seller.id)} className="ms-auto me-1">
                      <PencilSquare />
                    </Button>
                    <Button variant="outline-danger" onClick={() => handleDelete(seller.id)}>
                      <Trash />
                    </Button>
                  </div>
              )}
            </ListGroup.Item>
        ))}
      </ListGroup>
      <div className="mt-3">
        <h5>Добавить / Изменить Продавца</h5>
        <Form>
          <Form.Control
              type="text"
              name="name"
              value={editingSeller ? editingSeller.name : newSeller.name}
              onChange={handleChange}
              placeholder="Имя"
              className="mb-2"
          />
          <Form.Control
              type="email"
              name="email"
              value={editingSeller ? editingSeller.email : newSeller.email}
              onChange={handleChange}
              placeholder="Email"
              className="mb-2"
          />
          <Form.Control
              type="text"
              name="phone"
              value={editingSeller ? editingSeller.phone : newSeller.phone}
              onChange={handleChange}
              placeholder="Телефон"
              className="mb-2"
          />
          {editingSeller ? (
              <>
                <Button variant="primary" onClick={handleSave} className="me-1">Сохранить</Button>
                <Button variant="secondary" onClick={handleCancel}>Отмена</Button>
              </>
          ) : (
              <Button variant="primary" onClick={handleAdd}>Добавить</Button>
          )}
        </Form>
      </div>
    </Container>
);
}

export default Sellers;