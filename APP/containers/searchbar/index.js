
import {connect} from 'react-redux'
import {SearchBar} from '../../components/searchBar'

const mapStateToProps = (state, ownProps) => {
    return {
        sendRequest: state.appState.screenProps.sendRequest,
        appState:state.appState
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return{
        dispatch:dispatch
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(SearchBar)