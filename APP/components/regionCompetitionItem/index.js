import React from 'react';
import OverviewCompetition from '../overviewCompetitions'
export default class RegionCompetitionItem extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        opened: true,
        hover: false
      };
      this.showCompetition = this.showCompetition.bind(this)
      this.toggleHover = this.toggleHover.bind(this)
    }
    showCompetition() {
  
      this.setState(prevState => ({ opened: !prevState.opened, ignoreActiveRegion: true }))
  
    }
    toggleHover() {
      this.setState({ hover: !this.state.hover })
  
    }
    componentDidMount() {
      // this.props.competitionRegion.id == this.props.region.id ? this.setState(prevState => ({ opened: true, ignoreActiveRegion: true })) : null
    }
    render() {
      const {
        props: { region, loadGames,routerHistory, gameSets, competition, currentCompetition, sport, activeView, loadMarkets, competitionData, addEventToSelection, betSelections, activeGame, setActiveGame, oddType }
        ,
        state: { opened, hover }
      } = this
  
  
      return (
  
        <li>
  
          <div {...{ className: `region-header overview`, onClick: () => { this.showCompetition() } }} onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover}>
            <span {...{ className: `region-icon flag-icon flag-${region.alias ? region.alias.replace(/\s/g, '').replace(/'/g, '').toLowerCase() : ''}` }}></span><span className="region-name">{competition.name} </span><span {...{ className: `total-games text` }}>
              <span {...{ className: `icon-icon-arrow-down icon icon-show ${opened ? 'icon-up' : ""}` }}>
              </span></span>
  
          </div>
  
          <div className={`region-competition ${opened ? 'show' : 'hide'}`} style={{ display: opened ? 'block' : 'none' }}>
            <ul className={`competition-list `} >
              <OverviewCompetition routerHistory={routerHistory} setActiveGame={setActiveGame} loadMarkets={loadMarkets} region={region} sport={{ id: sport.id, name: sport.name, alias: sport.alias }} activeView={activeView}
                currentCompetition={currentCompetition} activeGame={activeGame} gameSets={gameSets} competitionData={competitionData} oddType={oddType} competition={competition} loadGames={loadGames} addEventToSelection={addEventToSelection} betSelections={betSelections} />
  
            </ul>
          </div>
  
        </li>
      )
    }
  }