import {connect} from 'react-redux'
import component from '../../components/modal'

const mapStateToProps = (state, ownProps) => {
    return {
        sportsbook: state.sportsbook,
        appState: state.appState,
        sb_modal:state.sb_modal,
        profile:state.profile
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return{
        dispatch:dispatch
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(component)