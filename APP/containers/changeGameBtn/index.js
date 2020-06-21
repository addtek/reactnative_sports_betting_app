import React from 'react';
import {connect} from 'react-redux'
import {View,Text,TouchableNativeFeedback} from 'react-native'
import CustomIcon from '../../components/customIcon';
import { allActionDucer } from '../../actionCreator';
import { GAME_VIEW } from '../../actionReducers';
const ComponentBtn = (props)=>{
    return (
        props.activeGame && props.activeGame.type ===1?
        <View style={{flex:1,height:'100%'}}>
            <TouchableNativeFeedback useForeground={TouchableNativeFeedback.canUseNativeForeground()} onPress={()=>props.dispatch(allActionDucer(GAME_VIEW, {showRelated:!props.showRelated }))}>
                <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding:5}}>
                <View style={{marginLeft:10,marginRight:5}}>
                    <Text ellipsizeMode="tail" numberOfLines={1} style={{color:'#fff'}}>Change</Text>
                </View>
                <CustomIcon  name={props.showRelated? 'arrow-up':'arrow-down'} size={10} color="#fff" style={{marginLeft:5,marginRight:10}}/>
                </View>
            </TouchableNativeFeedback>
        </View>
        :null
    )
}
const mapStateToProps = (state, ownProps) => {
    return {
        showRelated:state.gameViewData.showRelated,
        activeGame:state.gameViewData.activeGame,
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return{
        dispatch:dispatch
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(ComponentBtn)