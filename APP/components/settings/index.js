import React ,{useState} from 'react'
import { OddsType, OddsSettings } from '../stateless'
import { dataStorage } from '../../common'
import { ScrollView, Switch,View,Text } from 'react-native'
import { ListItem, Left ,Right,Body} from 'native-base'
import CustomIcon from '../customIcon';
import { allActionDucer } from '../../actionCreator'
import { SPORTSBOOK_ANY, BETSLIP } from '../../actionReducers'
const Settings = (props)=>{
   const {oddType}= props.sportsbook,acceptMode=props.acceptMode
   onOddsSettingsChange=(e)=> {
    let acceptMode = props.acceptMode,mode = e
    if (mode !== acceptMode)
    props.dispatch(allActionDucer(BETSLIP,{ acceptMode: parseInt(mode) }))
  },
  onOddsTypeChange=(e)=> {
    let oddType = props.sportsbook.oddType,type = e
    if (type !== oddType)
    {props.dispatch(allActionDucer(SPORTSBOOK_ANY,{ oddType: type }))
    dataStorage('odds_format',type)}
  }
    return(
        <ScrollView contentContainerStyle={{backgroundColor:'#e8e8ec'}}>
            <View style={{flex:1,position: 'relative',overflow: 'hidden'}} >
            <View style={{overflow:'hidden',marginTop:20,backgroundColor:'#fff'}}>
                    <ListItem style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:"space-between",paddingLeft:10,marginLeft:0}}>
                     <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                     <Left><Text>Odds Type</Text></Left>
                     <View style={{flex:1}}><OddsType onChange={onOddsTypeChange} value={oddType} /></View>
                     </View>
                     </ListItem>
                </View>
                <View style={{overflow:'hidden',backgroundColor:'#fff',marginTop:20}}>
                    <ListItem icon>
                     <Left><CustomIcon name="bell" size={20} color="#026775"/></Left>
                     <Body>
                         <View><Text>Notification Bar</Text></View>
                         <View><Text style={{fontSize:11,color:'#026775'}}>show quick actions on notification bar</Text></View>
                     </Body>
                     <Right>
                         <Switch />
                     </Right>
                    </ListItem>
                </View>
               
                <View style={{overflow:'hidden',marginTop:20,backgroundColor:'#fff'}}>
                    <ListItem style={{marginLeft:0,paddingLeft:10}}>
                      <View style={{flex:1}}>
                      <OddsSettings onChange={onOddsSettingsChange} value={acceptMode} title={'Automatically accept odds.'} />
                      </View>
                    </ListItem>
                </View>
            </View>
        </ScrollView>
    )
}
 export default Settings