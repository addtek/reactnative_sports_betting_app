import {connect} from 'react-redux'
import component from '../../screens/prematch'

const mapStateToProps = (state, ownProps) => {
    return {
        sportsbook: state.sportsbook,
        sendRequest:state.appState.screenProps.sendRequest,
        popularInSportsBook:state.appState.screenProps.popularInSportsBook,
        unsubscribe:state.appState.screenProps.unsubscribe,
        handleSportUpdate:state.appState.screenProps.handleSportUpdate,
        prematchData:state.prematchData,
        betslip:state.betslip,
        appState:state.appState
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return{
        ownProps,
        dispatch:dispatch
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(component)