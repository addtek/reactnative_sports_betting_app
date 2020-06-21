
import {connect} from 'react-redux'
import component from '../../components/bethistory'

const mapStateToProps = (state, ownProps) => {
    return {
        sportsbook: state.sportsbook,
        betHistoryData:state.betHistoryData,
        isBetSlipOpen:state.betslip.isBetSlipOpen,
        sendRequest:state.appState.screenProps.sendRequest,
        subscribeToSelection:state.appState.screenProps.subscribeToSelection,
        getBetslipFreebets:state.appState.screenProps.getBetslipFreebets,
        unsubscribe:state.appState.screenProps.unsubscribe
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return{
        dispatch:dispatch,
        ownProps
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(component)