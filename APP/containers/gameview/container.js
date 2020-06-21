
import {connect} from 'react-redux'
import component from '../../components/gameview'

const mapStateToProps = (state, ownProps) => {
    return {
        sportsbook: state.sportsbook,
        screenProps:state.appState.screenProps,
        gameViewData:state.gameViewData,
        activeView:state.appState.activeView,
        betSelections:state.betslip.betSelections
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return{
        dispatch:dispatch,
        ownProps
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(component)