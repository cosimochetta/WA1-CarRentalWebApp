import React, { useState } from 'react';
import Table from "react-bootstrap/Table"
import VehicleItem from "./VehicleItem"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import Filters from "./Filters"
import Alert from "react-bootstrap/Alert"
export default function Browse(props) {

  const [categoryFilters, setCategoryFilters] = useState([]);
  const [brandFilters, setBrandFilters] = useState([]);



  const getBrands = (vehicles) => {
    return [...new Set(vehicles.map((vehicle) => {
      if (vehicle.brand)
        return vehicle.brand;
      else
        return null;
    }))];
  }


  const updateCategoryFilters = (category) => {
    if (categoryFilters.includes(category))
      setCategoryFilters(categoryFilters.filter((c) => c.localeCompare(category) !== 0));
    else
      setCategoryFilters([...categoryFilters, category]);
  }

  const updateBrandFilters = (brand) => {
    if (brandFilters.includes(brand))
      setBrandFilters(brandFilters.filter((b) => b.localeCompare(brand) !== 0));
    else
      setBrandFilters([...brandFilters, brand]);
  }

  const getFilteredVehicles = (vehicles) => {
    if (categoryFilters.length === 0 && brandFilters.length === 0)
      return vehicles;
    if (categoryFilters.length === 0)
      return vehicles.filter((v) => brandFilters.includes(v.brand));
    if (brandFilters.length === 0)
      return vehicles.filter((v) => categoryFilters.includes(v.category));
    return vehicles.filter((v) => categoryFilters.includes(v.category) && brandFilters.includes(v.brand));
  }


  return (
    <Row>
      <Col sm={3} bg="light" id="filter-list">
        <Filters brands={getBrands(props.vehicles)} updateBrandFilters={updateBrandFilters} updateCategoryFilters={updateCategoryFilters} />
      </Col>
      <Col sm={9} bg="light" id="filter-list">
        <VehicleList vehicles={[...getFilteredVehicles(props.vehicles)]}></VehicleList>
      </Col>
    </Row>
  )
}

const VehicleList = (props) => {

  return (
    <>
      <h5><strong>Vehicles</strong></h5>
      {props.vehicles.length === 0 &&
        <Alert variant="secondary">
          No vehicles with categories/brands selected
          </Alert>
      }
      <Table>
        <thead>
          <tr>
            <th>Model</th>
            <th>Brand</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {props.vehicles.sort((a, b) => a.id - b.id).map((vehicle) => (<VehicleItem key={vehicle.id} vehicle={vehicle} />))}
        </tbody>
      </Table>
    </>
  )
}