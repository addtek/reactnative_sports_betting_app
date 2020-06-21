import {connect} from 'react-redux'
import component from '../../screens/inplay'

const mapStateToProps = (state, ownProps) => {
    return {
        sportsbook: state.sportsbook,
        sendRequest:state.appState.screenProps.sendRequest,
        handleSportUpdate:state.appState.screenProps.handleSportUpdate,
        unsubscribe:state.appState.screenProps.unsubscribe,
        addEventToSelection:state.appState.screenProps.addEventToSelection,
        liveData:state.liveData,
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