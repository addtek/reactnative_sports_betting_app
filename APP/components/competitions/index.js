import React, {PureComponent} from 'react'
import {stringReplacer, viewStyles,gridStyles, flagPath} from '../../common'
import moment from 'moment-timezone'
import { allActionDucer } from '../../actionCreator'
import { SPORTSBOOK_ANY, COMPETITIONS_DATA } from '../../actionReducers'
import { View, SectionList, TouchableNativeFeedback, Image } from 'react-native'
import { Text} from 'native-base'

import LiveBtn from '../liveBtn'
import { RefreshControl } from 'react-native'
import CustomIcon from '../customIcon'
import Controls from '../../containers/controls'
import { withNavigationFocus } from 'react-navigation'
import { SportsbookSportItemLoading } from '../loader'

 class Competitions extends PureComponent{
    constructor(props){
        super(props)
        this.state={
            loadingInitialData:false,
            sport: {},
            competition: {},
            region: {},
            game: {},
            data:[],
            hidden:[]
        }
        this.flatListRef=null
        this.loadGames = this.loadGames.bind(this)
        this.toggleList = this.toggleList.bind(this)
        this.goBack = this.goBack.bind(this)
        this.navigatetoMarket = this.navigatetoMarket.bind(this)
    }

    componentDidMount() {
        let data = this.props.navigation.state.params
          // this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { loadCompetition: true,activeView: newState.activeView, activeSport: newState.sport, activeGame: newState.game, activeRegion: newState.region, activeCompetition: newState.competition, }))
          // if (void 0 !== sessionData.sid && !this.state.loadingInitialData) {
            this.setState({ loadingInitialData: true,data:data})
            this.loadGames(data)
          // }
    }

    componentWillUnmount() {
        this.props.screenProps.unsubscribe(this.props.sportsbook.inviewGamesubid, 'inviewGamesubid')
        this.props.dispatch(allActionDucer(COMPETITIONS_DATA, {competitionData:{},loadCompetition: false}))
    }
     goBack(){
      this.props.dispatch(allActionDucer(COMPETITIONS_DATA, { loadCompetition: false, competitionData:{} }))
      this.props.history.goBack()
     }
    loadGames(competition, region, sport = null) {
        const {Prematch } = this.props.sportsbook
        let type =Prematch
        let request = {
          command: "get",
          params: {
            source: "betting",
            what: {sport:['id','name','alias'],region:['name','alias'],competition:['name','id','order'],game: [[]], event: [], market: [] },
            where: {
              competition: { id: {"@in":competition} },
              game: {
                type: { "@in": type }
              },
              market: { display_key: "WINNER", display_sub_key: "MATCH" }
            },
            subscribe: true
          }, rid: 8
        }
        this.props.screenProps.sendRequest(request)
      }
      sortDateByDayASC (a, b){
  
        if (moment(a.date).isAfter(b.date, 'day')) {
          return 1;
        }
        if (moment(a.date).isBefore(b.date, 'day')) {
          return -1;
        }
        return 0;
      }
      sortDateByTimeASC(a, b) {
        var anewDate = moment.unix(a.start_ts).format('YYYY-MM-DD H:mm');
        var bnewDate = moment.unix(b.start_ts).format('YYYY-MM-DD H:mm');
        if (moment(anewDate).isAfter(bnewDate)) {
          return 1;
        }
        if (moment(anewDate).isBefore(bnewDate)) {
          return -1;
        }
        return 0;
      }
      sortDateDESC(a, b) {
        if (a.date > b.date) {
          return -1;
        }
        if (b.date > a.date) {
          return 1;
        }
        return 0;
      }
      navigatetoMarket(data) {
        this.props.navigation.navigate('game_view', data);
      }
    _renderItem({item,index,section:{title}}){
      const {
        oddType,
      } = this.props.sportsbook,{betSelections}=this.props.betslip,{addEventToSelection}=this.props.screenProps,{sport,region,competition}=this.state,game=item
          game.data.sort(this.sortDateByTimeASC)
          var eventsName = []
          for (const eventD in game.data) {
            if (Object.keys(game.data[eventD].market).length > 0) {
             if(game.data[eventD].market[Object.keys(game.data[eventD].market)[0]]!==null){
              for (const ev in game.data[eventD].market[Object.keys(game.data[eventD].market)[0]].event) {

                eventsName.push(game.data[eventD].market[Object.keys(game.data[eventD].market)[0]].event[ev])
              }

              break
             }
            }
          }
          eventsName.sort((a, b) => {
            if (a.order > b.order)
              return 1
            if (b.order > a.order)
              return -1
            return 0
          })
          return (
            this.state.hidden.includes(title.competition.id)?
            null:
            <View style={{...viewStyles.competitionGame}} key={index}>
              <View style={[viewStyles.gameDate ,gridStyles.colsm12]}>
                <Text numberOfLines={1} ellipsizeMode='tail' style={[viewStyles.date, gridStyles.colsm6,{paddingLeft:3}]}>
                  {moment(game.date).format('dddd, D MMMM YYYY')}
                </Text>
                <View style={[viewStyles.events, gridStyles.colsm6]}>
                  {eventsName.map((en, enk) => {
                    return (
                      <View style={{flex:1,flexDirection:'row',alignItems:'center'}}key={enk}><Text  style={[viewStyles[en.name.toLowerCase()],viewStyles.eventText]}>{stringReplacer(en.type, [/P/g], [''])}</Text></View>
                    )
                  })}

                </View>
              </View>
              {
                game.data.map((eachgame, ind) => {
                  let market = [], game = { ...eachgame }, marketEvent = [], evtmarket;
                  delete game.market
                  // market.push(eachgame.market[0].event)
                  // let currentSet = eachgame !== null && eachgame.info && eachgame.info.current_game_state ? convertSetName()(eachgame.info.current_game_state, stringReplacer(sport.alias, [/\s/g], [''])) : '';
                  for (const mark in eachgame.market) {
                    var cmarket = eachgame.market[mark]
                    if (cmarket && cmarket.type == "P1XP2" && cmarket.event) {
                      evtmarket = { ...cmarket }
                      delete evtmarket.event
                      Object.keys(cmarket.event).forEach((eventItem, ind) => {
                        if (null !== cmarket.event[eventItem])
                          marketEvent.push(cmarket.event[eventItem])
                      })
                      break;
                    } else if (cmarket && cmarket.type == "P1P2" && cmarket.event) {
                      evtmarket = { ...cmarket }
                      delete evtmarket.event
                      Object.keys(cmarket.event).forEach((eventItem, ind) => {
                        if (null !== cmarket.event[eventItem])
                          marketEvent.push(cmarket.event[eventItem])
                      })
                      break;
                    }
                  }
                  marketEvent.sort((a, b) => {
                    if (a.order > b.order) {
                      return 1;
                    }
                    if (b.order > a.order) {
                      return -1;
                    }
                    return 0;
                  })
                  return (
            <View key={ind} style={[viewStyles.sbAccordionItem]}>
            <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} onPress={() =>this.navigatetoMarket({game:eachgame, sport:item.sport, region:region, competition:competition})}>
            <View style={[marketEvent.length>0?gridStyles.colsm6:gridStyles.colsm12,viewStyles.sbAccordionTitle,viewStyles.sbAccordionTitleMatchTitle]}>
              <View style={viewStyles.matchTitleText}>
                <Text  numberOfLines={1} ellipsizeMode='tail'style={[gridStyles.colsm10,{padding:3}]}>{eachgame.team1_name}</Text>
              </View>
              <View style={[viewStyles.matchTitleText,viewStyles.matchTitleTextx2]}>
                <Text numberOfLines={1} ellipsizeMode='tail' style={[gridStyles.colsm10,{padding:3}]}>{eachgame.team2_name}</Text>
              </View>
              <View style={viewStyles.hiddenIcons}>
                <View style={[{flexDirection:'row',width:marketEvent.length>0?'80%':'90%'}]}>
                  <View style={viewStyles.matchTimeInfo}>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={{padding:3,color: "#1ba573",fontWeight:'700',fontSize:12}}>{moment.unix(eachgame.start_ts).format('H:mm')}</Text>
                  </View>
                  {/* <View  className="goal-alert-msg">Goal!!!</View> */}
                </View>
                  <View style={[viewStyles.addToFavorite]}>
                  <Text style={[{color:'rgba(230,180,79,.99)',flex:1,fontSize:12}]}>+{eachgame.markets_count}</Text>
                  </View>
              </View>
            </View>
            </TouchableNativeFeedback>
            <View style={[gridStyles.colsm6, viewStyles.sbAccordionContent, viewStyles.matchContent]}>
                <View style={viewStyles.sbAccordionContentMatchContentInner}>
                  <View style={[viewStyles.sbGameBetBlockWrapper, gridStyles.colsm12]}>
                    <View style={viewStyles.sbGameBetBlock}>
                      {
                      (marketEvent.length > 0) ?
                      
                        marketEvent.map((evnt, k) => {
                          return (
                            <LiveBtn key={k} e={evnt} betSelections={betSelections} game={game} eventMarket={evtmarket} addEventToSelection={addEventToSelection} oddType={oddType} competition={competition} sport={sport} />
                          )
                        })
                      
                        :
                        eventsName.map((e,i)=>{
                          return(
                            <View key={i} style={viewStyles.sbGameBetBlockInner}><View style={{flex:1,display:'flex',justifyContent:'center',flexDirection:'row',paddingHorizontal:0,paddingVertical:0,margin:0,padding:0,alignItems:'center'}}><View style={viewStyles.sbGameBetCoeficiente}><Text>-</Text></View></View></View>
                          )
                        })
                      }
                    </View>
                  </View>
                </View>
               
              </View>
                      
              </View>
                  )
                })

              }

            </View>)
    }
    toggleList=(id)=>{
      let hidden = [...this.state.hidden], exists = hidden.includes(id)
      if(exists){
        let index = hidden.indexOf(id)
        hidden.splice(index, 1);
      }else hidden.push(id)
      this.setState({hidden:hidden})
    }
    _renderSectionHeader({competition,region,sport}){
      let hidden = this.state.hidden
      return (
        <View {...{ style: [viewStyles.competitionName,{paddingLeft:3,marginTop:1}]}}>
          <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} onPress={() =>this.toggleList(competition.id)}> 
          <>
          <CustomIcon color="#fff" name={stringReplacer(sport.alias, [/\s/g, /\d.+?\d/g, /\(.+?\)/g], ['', '', ''])} size={20} style={{marginRight:5}}/>
          <View style={{flexDirection:'row',alignItems:'center',borderStyle:'solid',borderWidth:1,borderColor:'#d5d5da',backgroundColor:'#fff',width:22,height:22,borderRadius:11}}>
          <Image
              style={{width:20,height:20}}
              source={flagPath[region.alias.replace(/\s/g, '-').replace(/'/g, '').toLowerCase()]}
            />
          </View>
          <View style={[gridStyles.colsm7,{textAlign: "center",
            alignItems: "center",
            justifyContent:'center',flexDirection:'row'}]}><Text numberOfLines={1} ellipsizeMode='tail' style={[viewStyles.regionName,{padding:5,opacity:1,color:'#fff'}]}>{competition.name} </Text>
          </View>
          <View style={[gridStyles.colsm2,{ alignItems: "center",justifyContent:'flex-end',flexDirection:'row'}]}>
              <CustomIcon color="#fff" name={hidden.includes(competition.id)?'arrow-down':'arrow-up'} size={14}/>
          </View>
        </>
        </TouchableNativeFeedback>
        </View>
      )
    }

    reloadData() {
      this.props.dispatch(
        allActionDucer(SPORTSBOOK_ANY, {loadCompetition: true, refreshing: true}),
      );
      this.loadGames(this.state.data)
    }
    render(){
         const {competitionData,loadCompetition,refreshing}=this.props.competitionData,{betSelections}=this.props.betslip,{isFocused}=this.props,betlen = null !== betSelections && undefined !== betSelections ? Object.keys(betSelections).length : 0;
         let competitionArr=[]
         Object.keys(competitionData).forEach((sport, ind) => {
           let this_sport = competitionData[sport],all_region = this_sport.region
            Object.keys(all_region).forEach((region)=>{
              let this_region= all_region[region],reg_competition = this_region.competition
              Object.keys(reg_competition).forEach((competition)=>{
                let gamesData = {},this_competition = reg_competition[competition],competition_games= this_competition.game
                Object.keys(competition_games).forEach((game)=>{
                  let this_game = competition_games[game]
                  if (null !== this_game) {
                    var date = moment.unix(this_game.start_ts).format('YYYY-MM-DD');
                    if (void 0 !==gamesData[date]) {
                      gamesData[date].push(this_game)
                    }
                    else
                      gamesData[date] = [this_game]
                  }
                })
              let data=[]
               Object.keys(gamesData).forEach((dategame, key) => {
                 if (null !== gamesData[dategame])
                   data.push({key:key, date: dategame, data: gamesData[dategame],sport:{id:this_sport.id,alias:this_sport.alias,name:this_sport.name} })
               })
               data.sort(this.sortDateByDayASC)
                competitionArr.push({title:{sport:{alias:this_sport.alias,name:this_sport.name},
                  region:{name:this_region.name,alias:this_region.alias},
                  competition:{name:this_competition.name,id:this_competition.id,order:this_competition.order}},data:data
                })
              })
            })
         })
         competitionArr.sort((a, b) => {
          if (a.title.competition.order > b.title.competition.order)
            return 1
          if (b.title.competition.order > a.title.competition.order)
            return -1
          return 0
        })
         return(
            <View style={{flex:1}}>
            {
              loadCompetition?<SportsbookSportItemLoading/>
            :
            <SectionList
              sections={competitionArr}
              contentContainerStyle={{paddingBottom:90}}
              keyExtractor={({key}) => key}
              extraData={{hidden:this.state.hidden}}
              renderItem={this._renderItem.bind(this)}
              renderSectionHeader={({ section: { title } }) => this._renderSectionHeader(title)}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={this.reloadData.bind(this)}
                  tintColor={'#018da0'}
                  colors={['#018da0']}
                />
              }
              stickySectionHeadersEnabled={true}
              initialNumToRender={7}
            />
            }
           {isFocused&&<Controls navigate={this.props.navigation.navigate}/>}
           </View>
        )
    }
}
export default withNavigationFocus(Competitions)