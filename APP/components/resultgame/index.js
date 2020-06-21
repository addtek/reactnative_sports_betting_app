import React from 'react'
import moment from 'moment-timezone'
import {GameResultsLoder} from '../loader'
export default class ResultsGame extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        opened: false
      }
    }
    handleClick(gameID) {
      this.setState(prevState => ({ opened: !prevState.opened }))
      this.props.onOpen(gameID)
    }
    render() {
      const { props: { data, resultsGame, loadResultsGame }, state: { opened } } = this
      return (
        <div className="game" onClick={() => { this.handleClick(data.game_id) }}>
          <div className="game-header">
            <div className="date col-sm-2"><span>{moment.unix(data.date).format("MMM DD YYYY H:mm")}</span></div>
            <div className="competition col-sm-3"><span className={`region-icon flag-icon flag-${data.region_name.replace(/\s/g, '').replace(/'/g, '').toLowerCase()}`} style={{height:'22px'}}></span><span>{data.competition_name}</span></div>
            <div className="event col-sm-5"><span>{data.game_name}</span></div>
            <div className="score col-sm-1"><span>{data.scores} {data.scores1}</span></div>
            <div className="arrow col-sm-1"><span className="total-games text"><span className={`icon-icon-arrow-down icon icon-show ${opened ? 'icon-up' : ''}`}></span></span></div>
          </div>
          <div className={`game-result ${opened ? 'open' : ''}`}>
            {
              !loadResultsGame || resultsGame.length > 0 ?
                resultsGame.map((result, k) => {
                  var events = ''
                  result.events.event_name.forEach((evt) => {
                    events += " " + evt
                  })
                  return (
                    <div key={k} className="market-events">
                      <span>{result.line_name}: </span>
                      <span> {events}</span>
                    </div>
                  )
                })
                : opened && loadResultsGame ? <GameResultsLoder/> : null
            }
          </div>
        </div>
      )
    }
  }