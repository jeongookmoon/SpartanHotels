import React from 'react'
import { Collapse, Button } from 'reactstrap';

class HotelInfoCard extends React.Component {

  render() {
    if (!this.props.hotelData) {
      return (
        <div className="hotel-search-container"> Loading </div>
      )
    }

    else {
      const imageURLS = this.props.hotelData.images;
      let imageArray = []
      if (imageURLS) {
        imageArray = imageURLS.split(",");
      }
      return (
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="">
                <article className="">
                  <div className="blog-img" style={{ cursor: "pointer", backgroundImage: `url(${imageArray[0]})` }}></div>
                  <div className="desc">
                    <h2>{this.props.hotelData.name}</h2>
                    <div className="meta">
                      <p>
                        <span>{`${this.props.hotelData.address}, ${this.props.hotelData.city}, ${this.props.hotelData.state}, ${this.props.hotelData.zipcode} `}</span>
                        <span style={{ color: `#4586FF` }}>{this.props.hotelData.phone_number}</span>
                      </p>
                    </div>
                    <Collapse isOpen={this.props.collapseFlag}>
                      <p>
                        {this.props.hotelData.description}
                      </p>
                    </Collapse>
                  </div>
                  <Button outline color="primary" onClick={this.props.onCollapse()} style={{ marginTop: '1rem' }}>Read More</Button>
                </article>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
}

export default HotelInfoCard