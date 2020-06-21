import React, {PureComponent} from 'react'
import {View,TouchableNativeFeedback,Text, SectionList, RefreshControl} from 'react-native'
import { allActionDucer } from '../../actionCreator';
import { SPORTSBOOK_ANY } from '../../actionReducers';
export default class SearchResult extends PureComponent {
    constructor(props){
        super(props)
        this.state={
            showFullInput:false
        }

    }
    openSearchedGame(competition,region,sport,game=null){

        if(game!==null) this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, {activeView:game.type=== 1?'Live':'Prematch'}));
        const historyState=null!==game ?{sport:sport,region:region,competition:competition,game:game}: [competition.id]
        this.props.onOpenEvent(false)
        this.props.navigation.navigate(`${null!==game? 'game_view':'c'}`,historyState)
    }
    clearSearch() {
        if (this.searchInput) {
            this.searchInput.value = ''
            this.setState({showFullInput:false})
            this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { searchData: {},searchDataC:{}, searching: false }))
        }
    }
    _renderSectionHeader({name,count}){
        return(
            <View style={{paddingLeft:10,paddingRight:10,paddingBottom:6,paddingTop:6,backgroundColor:'#e8e8ec',flexDirection:'row',alignItems:'center'}}>
                <View style={{flex:1}}><Text style={{fontSize:15,fontWeight:'700'}}>{name}</Text></View>
            </View>
        )
    }
    _renderItem({item, index,section}){
            let region = []
            Object.keys(item.region).forEach((reg) => {
                region.push(item.region[reg])
            })
            return (
                <View key={index+`${index===0?'games':'competitions'}`+item.id}>
                    <View style={{paddingLeft:10,paddingRight:10,paddingBottom:6,paddingTop:6,backgroundColor:'#f7f7f9'}}>
                        <Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:11,color: 'rgba(51,51,51,.65)'}}>{item.name}</Text>
                    </View>
                    <View>
                        {
                            section.title.name==='Games'?
                            region.map((reg) => {
                                let competition = [], games = []
                                Object.keys(reg.competition).forEach((compete => {
                                    competition.push(reg.competition[compete])
                                }))
                                return (
                                    competition.map((c) => {
                                        var games = []
                                        Object.keys(c.game).forEach((g) => {
                                            games.push(c.game[g])
                                        })
                                        return (

                                                games.map((game,key) => {
                                                    return (
                                                        <TouchableNativeFeedback useForeground={TouchableNativeFeedback.canUseNativeForeground()} onPress={()=>this.openSearchedGame(c,{id:reg.id,name:reg.name,alias:reg.alias},{id:item.id,name:item.name,alias:item.alias},{id:game.id,type:game.type})}>
                                                            <View style={{paddingLeft:10,paddingRight:10,paddingBottom:4,paddingTop:4,borderTopColor:'#e6e6e6',borderTopWidth:1,borderStyle:'solid',backgroundColor:'#fff'}} key={game.id+''+c.id+''+reg.id} onClick={() => { this.openSearchedGame(c, reg, item, game); this.clearSearch() }}>
                                                                <View style={{flex:1,flexDirection:'row',alignItems:'center'}}><Text numberOfLines={1} ellipsizeMode="tail" style={{marginBottom:3,fontSize:15}}>{game.team1_name}{game.team2_name ? ' - ' + game.team2_name : ''}</Text></View>
                                                                <View style={{flex:1,flexDirection:'row',alignItems:'center'}}><Text numberOfLines={1} ellipsizeMode="tail"  style={{color:'rgba(51,51,51,.7)',fontSize:12}}>{c.name}</Text></View>
                                                            </View>
                                                        </TouchableNativeFeedback>
                                                    )
                                                })

                                        )
                                    })
                                )
                            }):
                                region.map((reg) => {
                                    let competition = [], games = []
                                    Object.keys(reg.competition).forEach((compete => {
                                        competition.push(reg.competition[compete])
                                    }))
                                    return (
                                        competition.map((c,key) => {
                                            return (
                                                <TouchableNativeFeedback useForeground={TouchableNativeFeedback.canUseNativeForeground()} onPress={()=>this.openSearchedGame(c,{id:reg.id,name:reg.name,alias:reg.alias},{id:item.id,name:item.name,alias:item.alias})}>
                                                    <View style={{paddingLeft:10,paddingRight:10,paddingBottom:10,paddingTop:10,borderTopColor:'#e6e6e6',borderTopWidth:1,borderStyle:'solid',backgroundColor:'#fff'}} key={c.id} onClick={() => { this.openSearchedGame(c, reg, item); this.clearSearch() }}>
                                                        <View style={{flex:1,flexDirection:'row',alignItems:'center'}}><Text numberOfLines={1} ellipsizeMode="tail"  style={{fontSize:15}}>{reg.alias} - {c.name}</Text></View>
                                                    </View>
                                              </TouchableNativeFeedback>  
                                            )
                                        })
                                    )
                                })
                        }
                    </View>
                </View>
            )

    }

    render(){
        const {searchDataC, searchData, searching, activeView, Prematch, Live,config,oddType } = this.props.sportsbook,{onRefresh}=this.props
        let searchResult={game:[],competition:[]},hasGameResult = Object.keys(searchData).length > 0 && Object.keys(searchData.sport).length > 0,hasCompetionsResult=Object.keys(searchDataC).length > 0 && Object.keys(searchDataC.sport).length > 0,
        emptyResult=(Object.keys(searchData).length > 0 && Object.keys(searchData.sport).length < 1 || Object.keys(searchDataC).length > 0 && Object.keys(searchDataC.sport).length < 1)

        let searchArr = []
        if (hasGameResult) {
            searchResult.game=[]
            Object.keys(searchData.sport).forEach((sport) => {
                searchResult.game.push(searchData.sport[sport])
            })
            searchArr.push({title:{name:'Games',count:searchResult.game.length},data:searchResult.game})
        }
        if (hasCompetionsResult) {
            searchResult.competition=[]
            Object.keys(searchDataC.sport).forEach((sport) => {
                searchResult.competition.push(searchDataC.sport[sport])
            })
            searchArr.push({title:{name:'Competitions',count:searchResult.competition.length},data:searchResult.competition})
        }
        return(
          <SectionList
            sections={searchArr}
            keyExtractor={(item,index) => index.toString()}
            renderItem={this._renderItem.bind(this)}
            renderSectionHeader={({ section: { title } }) => this._renderSectionHeader(title)}
            refreshControl={
              <RefreshControl
                refreshing={searching}
                onRefresh={()=>onRefresh()}
                tintColor={'#018da0'}
                colors={['#018da0']}
                removeClippedSubviews={true}
              />
            }
            ListEmptyComponent={()=><View style={{flex:1,height:40,backgroundColor:'#fff',flexDirection:'row',alignItems:'center',justifyContent:'center'}}><Text>No search results</Text></View>}
            stickySectionHeadersEnabled={true}
            />
        )
    }
}