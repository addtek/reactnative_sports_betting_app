import {connect} from 'react-redux'
import component from '../../components/userprofile'

const mapStateToProps = (state, ownProps) => {
    return {
        profile: state.profile
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return{
        ownProps,
        dispatch:dispatch
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(component)