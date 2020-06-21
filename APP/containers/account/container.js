import {connect} from 'react-redux'
import component from '../../components/account'

const mapStateToProps = (state, ownProps) => {
    return {
        profile: state.profile,
        appState:state.appState,
        dispatchLogOut:state.appState.screenProps.dispatchLogOut,
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return{
        ownProps,
        dispatch:dispatch
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(component)