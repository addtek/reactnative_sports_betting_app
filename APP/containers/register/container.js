import {connect} from 'react-redux'
import component from '../../components/register'

const mapStateToProps = (state, ownProps) => {
    return {
        appState: state.appState,
        sb_modal:state.sb_modal,
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return{
        dispatch:dispatch,
        ownProps
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(component)