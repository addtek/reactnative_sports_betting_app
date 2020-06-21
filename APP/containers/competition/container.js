import React from 'react'
import {connect} from 'react-redux'
import component from '../../components/competition'
import { errorHandler } from '../../utils'
import {
    BrowserRouter as Router,
    Route,
    Link,
    useRouteMatch,
    useParams
  } from "react-router-dom";
import {updateBrowserURL} from '../../common'

const mapStateToProps = (state, ownProps) => {
    return {
        sportsbook: state.sportsbook,
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return{
        // connectPreferenceToState() {
        //     let {type,viewmode, sport, region,competition,game}=useParams(),
        //       setableView = '0', setableType = 'Live', setableSport = null, setableRegion = null, setableCompetition = null, setableGame = null, setableBetSlip = { bets: {} }
        //     if (viewmode) {
        //       if (viewmode == 'eventview') {
        //         setableView = '0'
        //       }
        //       else if (viewmode == 'overview') {
        //         setableView = '1'
        //       }
        //       else if (viewmode == 'multiview') {
        //         setableView = '2'
        //       }
        //       else if (viewmode == 'calender') {
        //         setableView = '3'
        //       }
        //       else if (viewmode == 'results') {
        //         setableView = '4'
        //       }
        
        //     } else
        //       updateBrowserURL('view', 'eventview')
        //     if (type) {
        //       if (type == 1) {
        //         setableType = 'Live'
        //       }
        //       else if (type == 2) {
        //         setableType = 'Prematch'
        //       }
        //     } else
        //       if (setableView == '0')
        //         updateBrowserURL('type', 1)
        //     if (sport) {
        //       setableSport = sport
        //     }
        //     if (region) {
        //       setableRegion = region
        //     }
        //     if (competition) {
        //       setableCompetition = competition
        //     }
        //     if (game) {
        //       setableGame = game
        //     }
        
        //     this.setState({
        //       viewmode: setableView, game: setableGame, sport: setableSport, region: setableRegion, competition: setableCompetition, activeView: setableType,
        //       bookingNumber: setableBetSlip.bookingNumber || null
        //     })
        //   }
        dispatch:dispatch
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(component)