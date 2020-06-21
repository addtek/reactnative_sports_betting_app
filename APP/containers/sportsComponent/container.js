import {connect} from 'react-redux'
import SportsComponent from '../../components/sportComponent'

const mapStateToProps = (state, ownProps) => {
    return {
        sportsbook: state.sportsbook
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return{
        dispatch:dispatch
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(SportsComponent)