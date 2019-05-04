import React from "react";
class Autocomplete extends React.Component {
  constructor(props) {
    super(props);
    
    const params = new URLSearchParams(window.location.search);
    let fullAddress = ''
    if(params.get('full_address') && params.get('full_address')!== '')
      fullAddress = params.get('full_address')

    this.state = {
      fullAddress
    }

    this.autocompleteInput = React.createRef();
    this.autocomplete = null;
    this.handlePlaceChanged = this.handlePlaceChanged.bind(this);
  }

  componentDidMount() {
    this.autocomplete = new window.google.maps.places.Autocomplete(
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
        type="text"
        className="location-input form-control"
        ref={this.autocompleteInput}
        defaultValue={this.state.fullAddress}
        id="search_bar"
        placeholder="Where are you going?"

      />
    );
  }
}

export default Autocomplete;
