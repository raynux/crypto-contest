import React from 'react'
// import {Link} from 'react-router-dom'
import {connect} from 'react-redux'

import {
  Container,
  Input
} from 'semantic-ui-react'

class Dashboard extends React.Component {
  // constructor(props) {
  //   super(props)
  // }
  //
  // componentDidMount() {
  // }

  render() {
    return (
      <Container>
        hi
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  web3js: state.web3js
})
export default connect(mapStateToProps)(Dashboard)
