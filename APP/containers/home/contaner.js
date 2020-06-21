import {connect} from 'react-redux'
import component from '../../screens/home'
const mapStateToProps = (state, ownProps) => {
    return {
        appState: state.appState,
        sportsbook: state.sportsbook,
        homeData:state.homeData,
        ...state.appState.screenProps,
        liveData:state.liveData,
        prematchData:state.prematchData,
        betslip:state.betslip
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return{
      dispatch:dispatch,
      ...ownProps
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(component)