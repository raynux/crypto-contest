import _ from 'lodash'
// import numeral from 'numeral'
import React from 'react'
// import {Link} from 'react-router-dom'
import {connect} from 'react-redux'

import {
  Dimmer,
  Loader,
  Container,
  Divider,
  Message,
  Card,
  Button,
  Input
} from 'semantic-ui-react'

import Ballot from '../models/Ballot'

class BallotView extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      index: this.props.match.params.index,
      selectedOptionIndex: null,
      betAmount: 10
    }

    this.selectOption = (e, {name}) => {
      this.setState({selectedOptionIndex: _.toNumber(name)})
    }

    this.onVoteClick = async () => {
      const {cryptoContest} = this.props
      const {index, selectedOptionIndex, betAmount} = this.state
      await cryptoContest.vote({
        ballotIndex: index,
        bet: betAmount,
        optionIndex: selectedOptionIndex
      })
    }

    this.onBetAmountChange = (e, {value}) => {
      this.setState({betAmount: value})
    }
  }

  componentDidMount() {
    this.fetchBallot()
  }

  componentWillReceiveProps(nextProps) {
    this.fetchBallot(nextProps)
  }

  async fetchBallot(targetProps) {
    const {cryptoContest, web3} = (targetProps || this.props)
    const {index} = this.state
    if(!cryptoContest) { return }

    const addr = await cryptoContest.ballot(index)
    const ballot = await Ballot.at(addr, web3)
    const ballotInfo = await ballot.info()
    this.setState({ballot, ballotInfo})
  }

  cardItems() {
    const {selectedOptionIndex, ballotInfo} = this.state
    const {options} = ballotInfo
    return _.map(options, (o, i) => {
      const isActive = (selectedOptionIndex === i)
      return (
        <Card key={`option-${i}`}>
          <Card.Content>
            <Card.Header>{o.name}</Card.Header>
            <Card.Meta>Total Bet : {o.betAmount}</Card.Meta>

            <Card.Description>
              <Button name={i} onClick={this.selectOption}
                active={isActive} primary={isActive}>Select</Button>
            </Card.Description>
          </Card.Content>
        </Card>
      )
    })
  }

  render() {
    const {ballotInfo, selectedOptionIndex, betAmount} = this.state
    if(!ballotInfo) {
      return (
        <Dimmer active>
          <Loader size='large' content='Loading' />
        </Dimmer>
      )
    }

    const voteControl = _.isNull(selectedOptionIndex) ?
      null :
      <div>
        <Input type='number' placeholder='Bet Amount' value={betAmount} onChange={this.onBetAmountChange}/>
        <Button content='Vote' onClick={this.onVoteClick} />
      </div>

    const {title, description} = ballotInfo
    return (
      <Container>
        <Message>
          <Message.Header>{title}</Message.Header>
          <p>{description}</p>
        </Message>

        <Card.Group>{this.cardItems()}</Card.Group>
        <Divider hidden />

        {voteControl}
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  web3: state.web3,
  cryptoContest: state.cryptoContest
})
export default connect(mapStateToProps)(BallotView)
