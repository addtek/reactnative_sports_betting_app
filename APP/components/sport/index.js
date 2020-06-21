import React from "react";
import ReactDOM from "react-dom";
import Region from "../region";
import { stringReplacer } from "../../common";
import { Transition, Spring } from "react-spring/renderprops";
export default class Sport extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      opened: false,
      hover: false,
      ignoreActiveSport: false
    };
    this.toggleHover = this.toggleHover.bind(this);
    this.openSport = this.openSport.bind(this);
    this.competitionRef = null;
  }

  toggleHover() {
    this.setState({ hover: !this.state.hover });
  }
  openSport() {
    if (this.state.ignoreActiveSport === false)
      this.setState(prevState => ({
        opened: !prevState.opened,
        ignoreActiveSport: true
      }));
    else this.setState(prevState => ({ opened: !prevState.opened }));
    if (!this.state.opened && this.competitionRef !== null) {
      let el = ReactDOM.findDOMNode(this.competitionRef);
      el.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest"
      });
    }
  }
  getTotalGames(region) {
    var size = 0;
    for (let reg in region) {
      if (null !== region[reg]) {
        var competition = region[reg].competition;
        for (let compete in competition) {
          // console.log(competition[compete].game)
          if (null !== competition[compete]) {
            if (null !== competition[compete].game)
              size += Object.keys(competition[compete].game).length;
          }
        }
      }
    }
    return size;
  }
  componentDidMount() {
    const { activeSport } = this.props.sportsbook;
    if (activeSport.name === this.props.sport.name)
      this.setState(prevState => ({ opened: true, ignoreActiveSport: true }));
  }
  render() {
    const {
        competitionData,
        competition,
        competitionRegion,
        activeView,
        betSelections,
        gameSets,
        activeGame,
        multiviewGames,
        oddType
      } = this.props.sportsbook,
      {
        multiview,
        addEventToSelection,
        loadMarkets,
        sport,
        loadGames,
        addToMultiViewGames,
        removeMultiViewGame
      } = this.props;

    var region = [],
      totalgames = sport ? this.getTotalGames(sport.region) : 0;
    if (sport) {
      for (let regionid in sport.region) {
        if (null !== sport.region[regionid])
          region.push(sport.region[regionid]);
      }
    }
    region.sort((a, b) => {
      if (a.order > b.order) {
        return 1;
      }
      if (b.order > a.order) {
        return -1;
      }
      return 0;
    });
    return totalgames > 0 ? (
      <div className="" style={{ fontSize: "12px" }}>
        
        {
          <div
            {...{ className: "region-block-open" }}
            style={{ display: "block", height: "auto" }}
          >

                <ul className="sports-region-list" style={{height:'auto'}}>
                  
                  {region.map((currentRegion, regId) => {
                    return (
                      <Region
                        ref={e => {
                          this.competitionRef = e;
                        }}
                        regIndex={regId}
                        multiview={multiview}
                        addEventToSelection={addEventToSelection}
                        sport={sport}
                        competitionData={competitionData}
                        activeView={activeView}
                        loadMarkets={loadMarkets}
                        region={currentRegion}
                        key={currentRegion.id}
                        loadGames={loadGames}
                        currentCompetition={competition}
                        competitionRegion={competitionRegion}
                        betSelections={betSelections}
                        gameSets={gameSets}
                        activeGame={activeGame}
                        multiviewGames={multiviewGames}
                        addToMultiViewGames={addToMultiViewGames}
                        oddType={oddType}
                      />
                    );
                  })}
                </ul>
          
          </div>
        }
      </div>
    ) : null;
  }
}
