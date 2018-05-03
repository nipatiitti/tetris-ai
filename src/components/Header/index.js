import React, {Component} from 'react'
import PropTypes from 'prop-types'

class Header extends Component {
  render () {
    return (
      <div>
        SAMPLE PROJECT
      </div>
    )
  }
}

Header.propTypes = {
  location: PropTypes.object.isRequired,
}

export default Header
