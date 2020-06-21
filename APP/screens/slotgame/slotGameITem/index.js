import React, {PureComponent} from 'react'
import { Modal,View, TouchableOpacity, Switch, ActivityIndicator,Text } from 'react-native'
import WebView from 'react-native-webview'
import CustomIcon from '../../../components/customIcon'
export default class GamePlayMode extends PureComponent {
    constructor(props){
        super(props)
        this.state={
            fullscreenMode:false,
            loading:true,
            isFullScreen:false
        }
        this.iframeRef = React.createRef()
    }

     closeGame(){
        this.props.onClose()
     }

    render(){
        const {game,togglePlayForReal,visible}=this.props,{fullscreenMode,isFullScreen,loading}=this.state; let url=`https://games.somedomain.com/authorization.php?partnerId=${851}&token=${game.token}&gameId=${game.extearnal_game_id}&language=en&openType=${game.playtype}&tech=H5&devicetypeid=1&platformType=1&exitURL=${encodeURIComponent('https://www.Your Company.com/slot-games')}&devicetypeid=2&isMobile=true`
        return(
            <Modal 
            visible={visible} 
            animationType="slide" 
            onRequestClose={this.closeGame.bind(this)}
            >  
            <View style={{width:'100%',height:40,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingLeft:10,paddingRight:10,backgroundColor:'#026775'}}>
                {/* <TouchableOpacity className="icon-delete refresh" >
                    <CustomIcon   name={isFullScreen?'minimize':'maximize'}/>  
                </TouchableOpacity> */}
                <View style={{flexDirection:'row',alignItems:'center'}}>
                <View style={{flexDirection:'row',alignItems:'center',paddingLeft:5,paddingStart:5}}>
                <Text style={{fontSize:14,color:'#fff'}}>Play for Real</Text>
                </View>
                <Switch value={game.playtype==='real'} onChange={togglePlayForReal} trackColor="#ffa200" thumbColor="#fff"/>
                </View>
                <TouchableOpacity onPress={this.closeGame.bind(this)}><CustomIcon name="close" size={20} color="#fff"/></TouchableOpacity>
            </View>
            <WebView ref={this.iframeRef} 
            startInLoadingState={true}
            renderLoading={()=><ActivityIndicator size="large" color="#11c9e3" />}
                source={ {uri:url}}  
                />          
            </Modal>
        )
    }
}