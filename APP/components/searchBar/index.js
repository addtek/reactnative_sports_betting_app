import React, { useState } from 'react'
import {View,TextInput,TouchableNativeFeedback, Modal,Platform} from 'react-native'
import { Icon } from 'native-base'
import SearchResult from '../../containers/search'
import { allActionDucer } from '../../actionCreator'
import { SEARCHING_GAME } from '../../actionReducers'
import CustomIcon from '../customIcon'
export const SearchBar = (props)=>{
    const [wantToSearch,setWantToSearch] = useState(false),[searchText,setSearchText] = useState(''),
    searchGame = (text) => {
        setSearchText(text)
        let d = {}, type = [0,1,2]
        if (text.length > 2) {
            d[props.appState.lang] = text
            props.dispatch(allActionDucer(SEARCHING_GAME, {searchDataC:{}, searchData: {}, searching: true }))
            props.sendRequest({
                command: "get",
                params: {
                    source: "betting",
                    what: { sport: ["id", "name", "alias"], region: ["id","name","alias"], competition: [], game: "type start_ts team1_name team1_id team2_name team2_id id".split(" ") },
                    where: {
                        sport: { type: { "@ne": 1 } }, game: {
                                type: { "@in": type }, "@or": [{
                                    team1_name: {
                                        "@like": d
                                    }
                                }, {
                                    team2_name: {
                                        "@like": d
                                    }
                                }]
                            }
                    },
                    subscribe: false
                }, rid: 6

            })
            let s = {
                source: "betting",
                what: {
                    competition: [],
                    region: ["alias","name","id"],
                    sport: ["id", "name", "alias"]
                },
                where: {
                    competition: {
                        name: {
                            "@like": d
                        }
                    }
                }
            };
            props.sendRequest({
                command: "get",
                params: s, rid: "6.5"

            })
        } else {
            props.dispatch(allActionDucer(SEARCHING_GAME, {searchDataC:{}, searchData: {},searchDataC:{}, searching: false }))
        }
    }
    return(
      <View style={[{backgroundColor:'#026775',height:60,}]}> 
  
      <Modal animationType="slide" visible={wantToSearch} onRequestClose={()=>{props.dispatch(allActionDucer(SEARCHING_GAME, {searchDataC:{}, searchData: {}, searching: false }));setSearchText('');setWantToSearch(!wantToSearch)}}>
        <View style={{flex:1,backgroundColor:'#fff'}}>
        <View style={{height:60,flexDirection:'row',justifyContent:'center',alignItems:'center',paddingLeft:5,paddingRight:5,zIndex:20,backgroundColor:'#fff',borderBottomColor:'#eee',borderBottomWidth:1}}>
           
           <View style={{flex:1,flexDirection:'row',borderRadius:20,borderWidth:1,borderColor:'#026775',paddingLeft:0,paddingRight:0,overflow:'hidden'}}>
           <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} onPress={()=>{props.dispatch(allActionDucer(SEARCHING_GAME, {searchDataC:{}, searchData: {}, searching: false }));setSearchText('');setWantToSearch(!wantToSearch)}}>
           <View style={{width:'10%',flexDirection:'row',alignItems:'center',justifyContent:'center',marginRight:5}}>
                <CustomIcon name={"ios-arrow-left"} size={20} color="#026775"/>
           </View>
           </TouchableNativeFeedback> 
                <TextInput value={searchText} autoFocus={true} style={{height:40,color:'#194b51',fontSize:16}} onChangeText={(text)=>searchGame(text)} placeholder="search games/competitions"/>   
            </View> 
        </View>
        <SearchResult onRefresh={()=>searchGame(searchText)} onOpenEvent={()=>{props.dispatch(allActionDucer(SEARCHING_GAME, {searchDataC:{}, searchData: {}, searching: false }));setSearchText('');setWantToSearch(!wantToSearch)}} navigation={props.navigation}/>
        </View>
        </Modal>
        
        <View style={{height:60,flexDirection:'row',justifyContent:'space-between',alignItems:'center',zIndex:20}}>
        {
            props.headerLeft()
        }
        {
            props.headerRight({setWantToSearch:setWantToSearch,wantToSearch:wantToSearch,isLoggedIn:props.appState.isLoggedIn})
        }
        </View>
        
    </View>
    )
}