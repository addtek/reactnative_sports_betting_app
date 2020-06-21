import React from 'react'
import RegionCompetitionItem from '../regionCompetitionItem'
export default class RegionCompetition extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        opened: true,
        ignoreActiveRegion: false,
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
        props: { region, loadGames, gameSets, currentCompetition, competitionRegion, sport, activeView, loadMarkets,routerHistory, competitionData, addEventToSelection, betSelections, activeGame, setActiveGame, oddType }
        ,
        state: { opened, hover, ignoreActiveRegion }
      } = this
  
      var competition = region.competition, regionTotalGames = 0, competitionArr = [];
      for (let compete in competition) {
        if (null !== competition[compete]) {
          regionTotalGames += Object.keys(competition[compete].game).length
          competitionArr.push(competition[compete])
        }
      }
      competitionArr.sort((a, b) => {
        if (a.order > b.order)
          return 1
        if (b.order > a.order)
          return -1
        return 0
      })
      return (
  
        regionTotalGames > 0 ?
          competitionArr.map((competition, competeID) => {
            return (
              <RegionCompetitionItem routerHistory={routerHistory} key={competeID} region={{ alias: region.alias, id: region.id, name: region.name }} loadGames={loadGames} gameSets={gameSets} competition={competition} currentCompetition={currentCompetition} sport={sport}
                activeView={activeView} loadMarkets={loadMarkets} competitionData={competitionData} addEventToSelection={addEventToSelection} betSelections={betSelections} activeGame={activeGame} setActiveGame={setActiveGame} oddType={oddType} />
            )
          })
          : null
  
      )
  
    }
  }