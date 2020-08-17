import React, { useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse'
import {categories} from '../const/const.js'

const Filters = (props) => {
    const [openCategories, setOpenCategories] = useState(true);
    const [openBrands, setOpenBrands] = useState(true);

    return (<>
        <Button
            onClick={() => setOpenCategories(!openCategories)}
            aria-controls="example-collapse-text"
            aria-expanded={openCategories}
        >
            Categories
        </Button>
        <Collapse in={openCategories}>
            <ListGroup variant="flush">
                {categories.map((category, index) => <ListGroup.Item key={index}>
                    <Form.Check
                        custom
                        type="checkbox"
                        id={"filter-category-" + category}
                        label={category}
                        onClick={() => props.updateCategoryFilters(category)}
                        defaultChecked={false}
                    />
                </ListGroup.Item>)}

            </ListGroup>
        </Collapse>
        <div className="my-2"></div>
        <Button
            onClick={() => setOpenBrands(!openBrands)}
            aria-controls="example-collapse-text"
            aria-expanded={openBrands}
        >
            Brands
        </Button>
        <Collapse in={openBrands}>
            <ListGroup variant="flush">
                {props.brands.map((brand, index) => <ListGroup.Item key={index}>
                    <Form.Check
                        custom
                        type="checkbox"
                        id={"filter-brand-" + brand}
                        label={brand}
                        onClick={() => props.updateBrandFilters(brand)}
                        defaultChecked={false}
                    />
                </ListGroup.Item>)}
            </ListGroup>
        </Collapse>
    </>
    )

}

export default Filters;
