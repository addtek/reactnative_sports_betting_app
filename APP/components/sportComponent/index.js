import React, { useState, useEffect } from 'react'
import { SportListLoader, SportsbookSportItemLoading } from '../loader'
import Sport from '../../containers/sports'
import Popular from '../popular'
import { allActionDucer } from '../../actionCreator'
import { SPORTSBOOK_ANY } from '../../actionReducers'
import { dataStorage, stringReplacer } from '../../common'
import { withRouter, Switch, Route } from 'react-router-dom'
import Competitions from '../../containers/competitions'
import { SportsbookSportItem } from '../stateless'
export const SportsComponent = (props) => {
  const [activeID, setActiveID] = useState(props.location.state ? props.location.state.sport : null),
    addToMultiViewGames = (game) => {
      let multiviewGames = [...props.sportsbook.multiviewGames]
      if (!multiviewGames.includes(game)) {
        multiviewGames.push(game)
        props.dispatch(allActionDucer(SPORTSBOOK_ANY, { multiviewGames: multiviewGames }))
        dataStorage('multiviewGames', multiviewGames)
      }
    },
    setSelectedSport = (sport) => {
      props.history.push(`${props.match.url}/${sport.alias}`, { sport: sport.id })
      setActiveID(sport.id)
    }, openGameToView = (competition, region, sport) => {
      // this.props.history.push(`/sports/prematch/${sport.alias}/${region.name}/${competition.id}`,{sport:sport,region:region,competition:competition})
      props.history.push(`${props.match.url}/${sport.alias}/${region.name}/${competition.id}`, { sport: sport, region: region, competition: competition })
    }, loadMarkets = (data) => {
      console.log(data)
    },
    getTotalGames = (region) => {
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
      return size > 0 ? size : '';
    }, { data, loadSports, activeView, popularcompetitionData, populargamesData } = props.sportsbook,
    { multiview, addEventToSelection, loadGames, history, sendRequest, bulkUnsubscribe } = props, pg = [], pc = []
  let initialData = {}, spItems = [], sport = data ? data.sport : {}
  if (data.sport) {
    Object.keys(sport).forEach((sp) => {
      if (void 0 !== sport[sp] && null !== sport[sp])
        spItems.push({ id: sport[sp].id, name: sport[sp].name, alias: sport[sp].alias })
    })
    if (activeID !== null && void 0 !== activeID) {
      if (typeof activeID === 'object' && null !== activeID) {
        initialData = sport[activeID.id] ? sport[activeID.id] : {}
      } else {
        initialData = sport[activeID] ? sport[activeID] : {}
      }
    } else {
      initialData = sport[Object.keys(sport)[0]]
      !props.location.state && props.history.push(`${props.match.url}/${initialData.alias}`, { sport: initialData.id })
    }
  }

  Object.keys(popularcompetitionData).forEach((c) => {

    if (null !== popularcompetitionData[c])
      pc.push(popularcompetitionData[c])

  })
  Object.keys(populargamesData).forEach((g) => {
    if (null !== populargamesData[g])
      pg.push(populargamesData[g])
  })
  useEffect(()=>{
     setActiveID(props.location.state ? props.location.state.sport : null) 
  },[])
  return (
    <div className={`sports col-sm-12 sports-list-container`}>
      <div className={`sports-list ${loadSports ? 'loading-view' : ''}`}>
        {
        !loadSports ?
        <div className=" scroll-area hidden-horizontal-scroll-container">
          <div className="sports-list mobile hidden-horizontal-scroll-area">
            {
              props.match.params.view === 'prematch' && <React.Fragment>
                {pc.length>0 &&<div className="sport-item" >
                  <SportsbookSportItem s={{ id: 'TC', alias: 'topleagues', name: 'Top Leagues' }} i={100} activeID={typeof activeID === 'object' && null !== activeID ? activeID.id : activeID} onClick={(s)=>{setSelectedSport(s)}} />
                </div>}
                {pg.length>0 &&<div className="sport-item" >
                  <SportsbookSportItem s={{ id: 'TG', alias: 'topgames', name: 'Top Games' }} i={101} activeID={typeof activeID === 'object' && null !== activeID ? activeID.id : activeID} onClick={(s)=>{setSelectedSport(s)}} />
                </div>}
              </React.Fragment>
            }
            {
              spItems.map((s, i) => {
                return (
                  <div className="sport-item" key={s.id}>
                    <SportsbookSportItem s={s} i={i} activeID={typeof activeID === 'object' && null !== activeID ? activeID.id : activeID} onClick={(s)=>{setSelectedSport(s)}} />
                  </div>
                )
              })
            }
          </div>
        </div>:
        <SportsbookSportItemLoading />
        }
        <div {...{ className: `sport-header ${stringReplacer(initialData.alias ? initialData.alias : '', [/\s/g, /'/g, /\d.+?\d/g, /\(.+?\)/g], ['', '', '', '']).toLowerCase()} select `, style: { height: '40px' } }}>
          <div className="sport-title col-sm-10"><span>{initialData.hasOwnProperty('id') ? initialData.name : activeID === 'TC' ? 'Top Competitions' : activeID === 'TG' ? 'Top Games' : ''}</span></div>
          <div className="sport-accord col-sm-2"><span {...{ className: `text text-show` }}>{getTotalGames(initialData.region)}</span></div>
        </div>
        <Switch>
          <Route exact path={`${props.match.path}/:sport?`}>

            {
              !loadSports ?
                <React.Fragment>
                  {
                    initialData.hasOwnProperty('id') ?
                      <Sport multiview={multiview} history={history} key={initialData.id} sport={initialData} loadGames={loadGames} loadMarkets={loadMarkets} addEventToSelection={addEventToSelection}
                        addToMultiViewGames={(id) => addToMultiViewGames(id)} />
                      :
                      <Popular history={history} data={activeID === 'TC' ? pc : pg} loadGames={openGameToView} loadSports={loadSports}
                        type={activeID === 'TC' ? 1 : 2} loadMarkets={loadMarkets}
                      />
                  }
                </React.Fragment>
                :
                <SportListLoader live={(activeView === "Live")} />
            }
          </Route>
          <Route exact path={`${props.match.path}/:sport/:region/:competition`} render={(props) => <Competitions {...props} addEventToSelection={addEventToSelection} sendRequest={sendRequest} bulkUnsubscribe={bulkUnsubscribe} />} />
        </Switch>
      </div>
    </div>
  )
}

export default withRouter(SportsComponent)