<<<<<<< HEAD
/* global google */

import React from "react";
=======
import React from "react";

>>>>>>> implemented 3 features: autocomplete for address search bar, airbnb style datepicker and google map on search result page
class Autocomplete extends React.Component {
  constructor(props) {
    super(props);
    this.autocompleteInput = React.createRef();
    this.autocomplete = null;
    this.handlePlaceChanged = this.handlePlaceChanged.bind(this);
  }

  componentDidMount() {
<<<<<<< HEAD
    this.autocomplete = new google.maps.places.Autocomplete(
=======
    this.autocomplete = new window.google.maps.places.Autocomplete(
>>>>>>> implemented 3 features: autocomplete for address search bar, airbnb style datepicker and google map on search result page
      this.autocompleteInput.current,
      { types: ["geocode"] }
    );
    this.autocomplete.addListener("place_changed", this.handlePlaceChanged);
  }

  handlePlaceChanged() {
    const place = this.autocomplete.getPlace();
    this.props.onPlaceChanged(place);
  }

  render() {
    return (
      <input
<<<<<<< HEAD
        ref={this.autocompleteInput}
        id="autocomplete"
        placeholder="Enter your address"
        type="text"
=======
        type="text"
        className="location-input form-control"
        ref={this.autocompleteInput}
        id="search_bar"
        placeholder="Where are you going?"

>>>>>>> implemented 3 features: autocomplete for address search bar, airbnb style datepicker and google map on search result page
      />
    );
  }
}

export default Autocomplete;
<<<<<<< HEAD
=======

>>>>>>> implemented 3 features: autocomplete for address search bar, airbnb style datepicker and google map on search result page
