
import {connect} from 'react-redux'
import component from '../../components/controls'

const mapStateToProps = (state, ownProps) => {
    return {
        appState: state.appState,
        profile: state.profile,
        sportsbook: state.sportsbook,
        ...state.appState.screenProps,
        betslip:state.betslip
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return{
      dispatch:dispatch,
      ownProps
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(component)