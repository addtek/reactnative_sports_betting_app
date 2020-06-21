import {connect} from 'react-redux'
import component from '../../components/wallet'

const mapStateToProps = (state, ownProps) => {
    return {
        profile: state.profile,
        appState:state.appState,
        config:state.sportsbook.config
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return{
        ownProps,
        dispatch:dispatch
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(component)