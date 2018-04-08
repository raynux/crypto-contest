import _ from 'lodash'
import React from 'react'
// import {Link} from 'react-router-dom'
import {connect} from 'react-redux'

import {
  Form,
  Loader,
  Dimmer,
  Message
} from 'semantic-ui-react'

const MAX_OPTIONS = 6
const DEFAULT_STATE = {
  isCreating: false,
  title: '',
  description: '',
  options: [
    {name: '', imageUrl: ''},
    {name: '', imageUrl: ''}
  ]
}

class BallotNew extends React.Component {
  constructor(props) {
    super(props)

    this.state = Object.assign(_.cloneDeep(DEFAULT_STATE), {
      createdBallotAddress: null,
      createdBallotIndex: null
    })

    this.addOption = () => {
      const {options} = this.state
      options.push({name: '', imageUrl: ''})
      this.setState({options})
    }

    this.removeOptions = (index) => () => {
      const {options} = this.state
      _.pullAt(options, index)
      this.setState({options})
    }

    this.onBaseChange = (e, {value}) => {
      switch(e.target.name) {
        case 'title':
          this.setState({title: value})
          break
        case 'description':
          this.setState({description: value})
          break
        default:
      }
    }

    this.onOptionChange = (index) => (e, {value}) => {
      const {options} = this.state
      switch(e.target.name) {
        case 'name':
          options[index].name = value
          break
        case 'imageUrl':
          options[index].imageUrl = value
          break
        default:
      }
      this.setState({options})
    }

    this.createBallot = async () => {
      const {cryptoContest} = this.props
      const {title, description, options} = this.state

      const ballotParams = _.transform(options, (res, o) => {
        res.optionNames.push(o.name)
        res.optionImageUrls.push(o.imageUrl)
        return res
      }, {title, description, optionNames: [], optionImageUrls: []})

      this.setState({isCreating: true}, async () => {
        const {index, address} = await cryptoContest.createBallot(ballotParams)
        this.setState(Object.assign(_.cloneDeep(DEFAULT_STATE), {
          createdBallotAddress: address,
          createdBallotIndex: index
        }))
      })
    }
  }

  optionForms() {
    const {options} = this.state

    return _.map(options, (o, i) => (
      <Form.Group key={`options${i}`} widths='3'>
        <Form.Input name='name' placeholder={`OPTION ${i+1}`}
          value={options[i].name} onChange={this.onOptionChange(i)} />
        <Form.Input name='imageUrl' placeholder='Image URL'
          value={options[i].imageUrl} onChange={this.onOptionChange(i)}/>
        <Form.Button primary icon='minus' onClick={this.removeOptions(i)} />
      </Form.Group>
    ))
  }

  isValidOptions() {
    const {title, description, options} = this.state

    if(_.isEmpty(title) || _.isEmpty(description)) { return false }

    if(options.length < 2) { return false }
    for(const o of options) {
      if(_.isEmpty(o.name)) { return false }
    }
    return true
  }

  messageBox() {
    const {createdBallotAddress, createdBallotIndex} = this.state
    if(createdBallotAddress) {
      return (
        <Message color='teal'>
          <Message.Header>The ballot is successfully created!</Message.Header>
          <p>The contract address is {createdBallotAddress} at index {createdBallotIndex}</p>
        </Message>
      )
    }
    return null
  }

  render() {
    const {isCreating, title, description, options} = this.state
    const isMaxOptions = (options.length >= MAX_OPTIONS)

    return (
      <div>
        <Dimmer active={isCreating}>
          <Loader size='large' content='Confirm on METAMASK' />
        </Dimmer>

        {this.messageBox()}
        <Form>
          <Form.Group widths='3'>
            <Form.Input label='Title' placeholder='Which one is your favorite?'
              name='title' value={title} onChange={this.onBaseChange} />
            <Form.Input label='Description' placeholder='blah blah blah blah and blah.'
              name='description' value={description} onChange={this.onBaseChange} />
          </Form.Group>

          {this.optionForms()}

          <Form.Group widths='3'>
            <Form.Button secondary icon='plus' content='ADD OPTION'
              onClick={this.addOption} disabled={isMaxOptions} />
            <Form.Button primary icon='send' content='CREATE BALLOT' floated='right'
              onClick={this.createBallot} disabled={!this.isValidOptions()} />
          </Form.Group>
        </Form>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  // cryptoContest: state.cryptoContest
})
export default connect(mapStateToProps)(BallotNew)
