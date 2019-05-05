import React from 'react'


class RoominfoCard extends React.Component {
  
  createAvailableRooms = (index) => {
    let options = []
    for (let i = 0; i <= this.props.roomData[0].quantity; i++) {
      options.push(<option key={i}>{i}</option>)
    }
  
    return options
  }

  

  render() {
    return (
      <div className="room-page-container">
        <div className="room-page-rooms-container">
          <div>
            {
              this.props.roomData.length > 0 ?
                <div>
                  <hr></hr>
                  <div className="col-lg-12 room-page-rooms custom-row container">
                    {
                      this.props.roomData.map((eachRoomResult, index) => {
                        return (
                          <div className="room-page-room-item col-lg-4 mb-5" key={index}>
                            <div className={(this.props.roomInfoFromTransaction[index]) ? "room-card-active block-34" : "room-card-inactive block-34"}>

                              <div className="room-page-image">
                                <img src={eachRoomResult.images} alt={index + 123} />
                              </div>

                              <div className="text">
                                <h2>{eachRoomResult.bed_type}</h2>
                                <div className="price"><sup className="room-page-room-price">$</sup><span className="room-page-room-price">{eachRoomResult.price.toFixed(2)}</span><sub>/per night</sub></div>
                                <ul className="specs">
                                  <li><strong>Ammenities:</strong> Closet with hangers, HD flat-screen TV, Telephone</li>
                                  <li><strong>Capacity Per Room:</strong> {eachRoomResult.capacity}</li>
                                </ul>
                                <div >
                                  <strong># Of Rooms </strong>
                                  <select className="room-page-room-quantity-dropdown" type="text" name={index} list="numbers" value={eachRoomResult.THIS_IS_A_PLACEHOLDER} onChange={this.props.handleQuantity()}>
                                    {this.createAvailableRooms({ index })}
                                  </select>
                                </div>
                              </div>

                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                </div> :
                <div>no result</div>
            }

            <hr></hr>
          </div>
        </div>
      </div>
    );
  }
}

export default RoominfoCard