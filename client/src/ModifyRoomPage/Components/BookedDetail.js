import React, { Component } from 'react';
import { Container, Row, Col, CardBody, Card, CardTitle, CardSubtitle, CardText } from 'reactstrap';

class BookedDetail extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Container >
        <Row style={{ height: "30vh" }}>
          <Col xs="5" style={{ backgroundImage: `url(https://t-ec.bstatic.com/images/hotel/max1024x768/573/57335203.jpg)` }}>
          </Col>

          <Col xs="5">
            <Card>
              <CardBody>
                <CardTitle><h2 className="heading">Hotel Name</h2></CardTitle>
                <CardSubtitle>
                  <div className="room-page-item-rating">
                    <span className="fa fa-star hotel-search-item-rating-checked"></span>
                    <span className="fa fa-star hotel-search-item-rating-checked"></span>
                    <span className="fa fa-star hotel-search-item-rating-checked"></span>
                    <span className="fa fa-star hotel-search-item-rating-checked"></span>
                    <span className="fa fa-star"></span>
                  </div>
                </CardSubtitle>
                <CardText>Some quick example text to build on the card title and make up the bulk of the card's content.</CardText>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default BookedDetail
