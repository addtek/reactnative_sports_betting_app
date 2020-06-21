import {connect} from 'react-redux'
import component from '../../components/settings'
const mapStateToProps = (state, ownProps) => {
    return {
        appState: state.appState,
        sportsbook: state.sportsbook,
        acceptMode:state.betslip.acceptMode
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return{
      dispatch:dispatch,
      ...ownProps
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(component)