import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'


import Header from '../components/Header'

const mapStateToProps = (state, props) => {
  return {
    location: props.location
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

const HeaderContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Header))

export default HeaderContainer
