import {connect} from 'react-redux'
import component from '../../components/accVerifyModal'

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
        dispatch:dispatch,
        ownProps
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(component)