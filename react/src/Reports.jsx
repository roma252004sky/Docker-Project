import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ListGroup } from 'react-bootstrap';

function Reports() {
    const [averagePriceBySeller, setAveragePriceBySeller] = useState([]);
    const [productCountBySeller, setProductCountBySeller] = useState([]);
    const [priceRange, setPriceRange] = useState({});

    useEffect(() => {
        fetchAveragePriceBySeller();
        fetchProductCountBySeller();
        fetchProductPriceRange();
    }, []);

    const fetchAveragePriceBySeller = () => {
        axios.get('http://localhost:8080/api/reports/average-price-by-seller')
            .then(response => setAveragePriceBySeller(response.data))
            .catch(error => console.error('Error fetching average price by seller:', error));
    };

    const fetchProductCountBySeller = () => {
        axios.get('http://localhost:8080/api/reports/product-count-by-seller')
            .then(response => setProductCountBySeller(response.data))
            .catch(error => console.error('Error fetching product count by seller:', error));
    };

    const fetchProductPriceRange = () => {
        axios.get('http://localhost:8080/api/reports/product-price-range')
            .then(response => setPriceRange(response.data))
            .catch(error => console.error('Error fetching product price range:', error));
    };

    return (
        <div>
            <h4>Отчеты</h4>

            <h5>Средняя цена по продавцу</h5>
            <ListGroup>
                {averagePriceBySeller.map(item => (
                    <ListGroup.Item key={item.sellerId}>
                        Seller ID: {item.sellerId}, Average Price: {item.averagePrice}
                    </ListGroup.Item>
                ))}
            </ListGroup>

            <h5>Количество товаров по продавцу</h5>
            <ListGroup>
                {productCountBySeller.map(item => (
                    <ListGroup.Item key={item.sellerId}>
                        Seller ID: {item.sellerId}, Product Count: {item.productCount}
                    </ListGroup.Item>
                ))}
            </ListGroup>

            <h5>Диапазон цен товаров</h5>
            <p>
                Минимальная цена: {priceRange.minPrice}, Максимальная цена: {priceRange.maxPrice}
            </p>
        </div>
    );
}

export default Reports;
