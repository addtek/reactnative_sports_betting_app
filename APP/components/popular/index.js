import React from 'react'
import PopularEvent from '../popularEvent'
import { Transition } from 'react-spring/renderprops';
export default class Popular extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: true,
      hover: false,
      ignoreActiveSport: false
    };
    this.toggleHover = this.toggleHover.bind(this)
    this.openSport = this.openSport.bind(this)
  }

  toggleHover() {
    this.setState({ hover: !this.state.hover })
  }
  openSport() {
    if (this.state.ignoreActiveSport === false)
      this.setState(prevState => ({ opened: !prevState.opened }))
    else
      this.setState(prevState => ({ opened: !prevState.opened }))
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

  }
  render() {
    const {
      props: { data, loadGames, activeView, loadMarkets, type, activeGame }
      ,
      state: { opened }
    } = this;

    return (

      <div className="sports-container">
        {

              opened &&
                <div {...{ className: 'region-block-open' }} style={{ display: 'block', height:'auto' }}>
                  <ul className="sports-region-list">
                    {

                      data.map((sport, sID) => {
                        let reg = [], compete = [], game = []
                        Object.keys(sport.region).forEach((reg) => {
                          var thisRegion = sport.region[reg]
                          Object.keys(thisRegion.competition).forEach((c) => {
                            var cData = { competition: { name: thisRegion.competition[c].name, id: thisRegion.competition[c].id, order: thisRegion.competition[c].favorite_order ? thisRegion.competition[c].favorite_order : thisRegion.competition[c].order } }
                            if (thisRegion.competition[c].game)
                              cData.game = { ...thisRegion.competition[c].game }

                            cData.region = { ...thisRegion }
                            cData.sport = { name: sport.name, alias: sport.alias, id: sport.id }
                            compete.push(cData)
                          })
                        })

                        return (
                          <PopularEvent data={compete} activeView={activeView} loadMarkets={loadMarkets}
                            key={sID}
                            loadGames={loadGames} activeGame={activeGame} type={type}

                          />
                        )
                      })
                    }
                  </ul>
                </div>
                // )
            }
          {/* </Transition> */}
        {/* } */}
      </div>

    )
  }
}