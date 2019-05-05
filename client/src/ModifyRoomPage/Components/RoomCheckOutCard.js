import React from 'react'
import { Table } from 'reactstrap';

// {this.state.verifyCheckout ? <div className="room-page-verify-checkout"> Unable to checkout </div> : null}
// {this.state.verifyRooms ? <div className="room-page-verify-checkout"> Please select a room </div> : null}
// {this.state.verifyGuests ? <div className="room-page-verify-checkout"> Please select enough rooms to accomodate all guests </div> : null}
// <td> $ {this.handleRoomPrice()}</td>

class RoomCheckOutCard extends React.Component {

  render() {
    return (
      <div className="modify-room-page-checkout-description">

        <Table borderless>
          <thead>
            <tr>
              <th>Room Type</th>
              <th>Capacity</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>

          {
            <tbody>
              {
                 this.props.roomData.map((eachRoomResult, index) => {
                  if (eachRoomResult.desired_quantity > 0) {
                    return (

                      <tr key={index}>
                        <td>{eachRoomResult.bed_type}</td>
                        <td>{eachRoomResult.capacity}</td>
                        <td>${eachRoomResult.price.toFixed(2)}</td>
                        <td>{eachRoomResult.desired_quantity} </td>
                        <td>$ {(eachRoomResult.desired_quantity * eachRoomResult.price).toFixed(2)}</td>
                      </tr>
                    )
                  }

                  else {
                    return (
                      <tr key={index}>
                      </tr>
                    )
                  }
                })
              }
              <tr className="hr-row">
                <td><hr></hr> </td>
                <td><hr></hr> </td>
                <td><hr></hr> </td>
                <td><hr></hr> </td>
                <td><hr></hr> </td>
              </tr>
              <tr>
                <td> </td>
                <td> </td>
                <td> </td>
                <td><strong> Estimated Total </strong></td>
              </tr>

            </tbody>
          }
        </Table>

        <p className="room-page-submit-button btn btn-primary py-3 px-5 mb-5" style={{ cursor: "pointer" }} onClick={() => this.props.onClick()}>Modify</p>
      </div>
    );
  }
}

export default RoomCheckOutCard