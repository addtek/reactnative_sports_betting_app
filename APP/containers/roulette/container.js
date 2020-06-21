
import {connect} from 'react-redux'
import component from '../../screens/roulette'


const mapStateToProps = (state, ownProps) => {
    return {
        appState:state.appState,
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return{
        dispatch:dispatch,
        ownProps
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(component)