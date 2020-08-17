import React from 'react';
import { kmPerDay } from '../const/const'


const delete_icon = <svg className="bi bi-trash m-1" width="1.2em" height="1.2em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
	<path d="M5.5 5.5A.5.5 0 016 6v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm2.5 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm3 .5a.5.5 0 00-1 0v6a.5.5 0 001 0V6z" />
	<path fillRule="evenodd" d="M14.5 3a1 1 0 01-1 1H13v9a2 2 0 01-2 2H5a2 2 0 01-2-2V4h-.5a1 1 0 01-1-1V2a1 1 0 011-1H6a1 1 0 011-1h2a1 1 0 011 1h3.5a1 1 0 011 1v1zM4.118 4L4 4.059V13a1 1 0 001 1h6a1 1 0 001-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" clipRule="evenodd" />
</svg>


const RentItem = (props) => {
	let rent = props.rent;

	return <tr id={"rent" + rent.id} className="w-100">
		<th>{rent.vehicle.model}</th>
		<th>{rent.vehicle.brand}</th>
		<th>{rent.category}</th>
		<th>{rent.starting_day}</th>
		<th>{rent.end_day}</th>
		<th>{rent.cost.toFixed(2)}</th>
		<th>{kmPerDay[rent.km]}</th>
		<th>{rent.driver_age}</th>
		<th>{rent.extra_driver}</th>
		<th>{rent.extra_insurance ? "YES" : "NO"}</th>
		{props.isFuture && 
		<th onClick={() => { props.deleteRent(rent.id) }}>{delete_icon}</th>}
	</tr>
}


export default RentItem;