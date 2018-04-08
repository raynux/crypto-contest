import React from 'react'
import {connect} from 'react-redux'

import {
} from 'semantic-ui-react'

class Dashboard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    return (
      <div>
        Dashboard
      </div>
    )
  }
}

const mapStateToProps = state => ({
  web3: state.web3,
  cryptoContest: state.cryptoContest,
  accountStatus: state.accountStatus
})
export default connect(mapStateToProps)(Dashboard)
