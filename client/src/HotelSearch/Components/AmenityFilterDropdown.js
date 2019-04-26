import React from 'react';

import Select from 'react-select';
import { amenityOptions } from '../../Utility/DataForMenu';

class AmenityFilterDropdown extends React.Component {
  render() {
    return (
      <Select
        isMulti
        name="Amenities"
        options={amenityOptions}
        defaultValue={this.props.value}
        placeholder="Choose amenities"
        onChange={this.props.handleFilterDropdown}
        className="basic-multi-select"
        classNamePrefix="select"
      />
    );
  }
}

export default AmenityFilterDropdown


