import {connect} from 'react-redux'
import component from '../../components/sport'

const mapStateToProps = (state, ownProps) => {
    return {
        sportsbook: state.sportsbook
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return{
        ownProps,
        dispatch:dispatch
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(component)