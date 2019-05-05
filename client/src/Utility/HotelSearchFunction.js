import axios from 'axios'

export const HotelSearchFunction = temp_fields => {
	// console.log(temp_fields)
	return axios.get('/api/search/hotels', {
		params: temp_fields

	}).then(response => {
		if (response.status === 200) {
		}
		return response.data
	})
}

export const extractFromAddress = (address, type) => {
	switch (type) {
		case 'city':
			type = "locality"
			break;
		case 'state':
			type = "region"
			break;
		default:
			type = "street-address" // default street address
	}

	let addressComponent = ''
	if (address.includes(type)) {
		addressComponent = address.substring(address.lastIndexOf(type) + type.length + 2)
		addressComponent = addressComponent.substr(0, addressComponent.indexOf('<'))
	}
	return addressComponent // returns empty string when there's no street address

}

export const getHotelInfoWithTransactionID = transactionIDQuery => {
	return axios.get('/api/transaction/roominfo', {
		params: transactionIDQuery
	}).then(response => {
		if (response.status === 200)
			return response
	})
}