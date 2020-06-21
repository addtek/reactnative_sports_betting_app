import { connect } from 'react-redux'
import { LOGOUT, BETSLIP } from '../../actionReducers';
import component from '../../components/drawer-menu';
import { AsyncStorage } from 'react-native';
import api from '../../services/api';
import { allActionDucer } from '../../actionCreator';

const mapStateToProps = (state, ownProps) => {
    return {
        profile: state.profile,
        isLoggedIn: state.appState.isLoggedIn,
        dispatchLogOut:state.appState.screenProps.dispatchLogOut,
    }
}
const dispatcher = (type) => ({ type })
const mapDispatchToProps = (dispatch, { navigation }) => {
    return {
        showBetSlip:()=>{
            navigation.toggleDrawer()
            dispatch(allActionDucer(BETSLIP,{isBetSlipOpen:true}))
        },
        logout: () => {
            api.getInstance()
                .logout()
            AsyncStorage.multiRemove(['profile', 'loginState'])
            dispatch(dispatcher(LOGOUT))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(component)