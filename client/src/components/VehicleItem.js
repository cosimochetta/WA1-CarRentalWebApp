import React from 'react';

const VehicleItem = (props) => {
    let vehicle = props.vehicle;

	return <tr id={"vehicle" + vehicle.id} className="w-100">
		<td>{vehicle.model}</td>
		<td>{vehicle.brand}</td>
        <td>{vehicle.category}</td>
	</tr>
}

export default VehicleItem;