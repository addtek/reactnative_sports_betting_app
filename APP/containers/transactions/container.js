
import {connect} from 'react-redux'
import component from '../../components/transaction'

const mapStateToProps = (state, ownProps) => {
    return {
        config: state.sportsbook.config,
        profile:state.profile,
        appState:state.appState
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return{
        dispatch:dispatch,
        ownProps
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(component)