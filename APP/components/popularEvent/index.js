import React from 'react'
import {stringReplacer} from '../../common'
import moment from 'moment-timezone'
export default class PopularEvent extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isSelected: false,
      };
      this.selectCompetition = this.selectCompetition.bind(this)
    }
  
    selectCompetition() {
      this.setState(prevState => ({ isSelected: !prevState.isSelected }))
    }
    render() {
      const {
        props: { loadGames, data,type },
        state: { isSelected }
      } = this
      return (
        data.map((ev, k) => {
          let games=[]

          if(type !== 1){
              Object.keys(ev.game).forEach((gID,ind)=>{
                games.push({...ev.game[gID]})
              })
          }
          return (
            type === 1?
            <li key={k} className={`competition-block ${isSelected ? 'active' : ''}`} onClick={() => { loadGames(ev.competition, ev.region, ev.sport) }}>

            <div className="header popular-league">
              <span {...{ className: `sport-avatar ${stringReplacer(ev.sport.alias, [/\s/g, /\d.+?\d/g, /\(.+?\)/g], ['', '', ''])}` }}></span>
              <span className='match-league-title-text'>{ev.competition.name}</span>
              <span {...{ className: `region-icon flag-icon flag-${ev.region.alias ? ev.region.alias.replace(/\s/g, '').replace(/'/g, '').toLowerCase() : ''}` }}></span>
            </div>

          </li>
          :
          games.map((game,ik)=>{
            return(
              <li key={ik} className={`competition-block ${isSelected ? 'active' : ''}`} onClick={() => { loadGames(ev.competition, ev.region, ev.sport,game) }}>

            <div className="header popular-league">
              <span {...{ className: `sport-avatar ${stringReplacer(ev.sport.alias, [/\s/g, /\d.+?\d/g, /\(.+?\)/g], ['', '', ''])}` }}></span>
              <span className='match-league-title-text' title={game.team1_name+' - '+game.team2_name}><span>{game.team1_name} - {game.team2_name}</span><span>{moment.unix(game.start_ts).format('H:mm')}</span></span>
              <span {...{ className: `region-icon flag-icon flag-${ev.region.alias ? ev.region.alias.replace(/\s/g, '').replace(/'/g, '').toLowerCase() : ''}` }}></span>
            </div>

          </li>
            )
          })
          )
        })
  
  
      )
    }
  }