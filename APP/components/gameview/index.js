import React, {PureComponent} from 'react';
import {MarketLoader} from '../loader';
import {
  stringReplacer,
  EventIDToNameMap,
  viewStyles,
  gridStyles,
  flagPath,
  convertSetName,
} from '../../common';
import moment from 'moment'
import Market from '../market';
import {allActionDucer} from '../../actionCreator';
import {SPORTSBOOK_ANY, RIDS_PUSH, GAME_VIEW} from '../../actionReducers';
import LiveGamePreview from '../livePreview'
import {View, Text, ScrollView, FlatList,TouchableNativeFeedback,LayoutAnimation, ImageBackground, Image, ActivityIndicator, TouchableWithoutFeedback} from 'react-native';
import CustomIcon from '../customIcon';
import Controls from '../../containers/controls';
import { withNavigationFocus } from 'react-navigation';
import { StatsBannerSoccer, StatsBannerBasketBall, StatsBannerTennis, StatsBannerGeneric } from '../statsBanner';
import { Tabs, Tab, TabHeading, Content, Container } from 'native-base';
import { Modal } from 'react-native';

class GameView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      opened: false,
      loadingRelated: false,
      activeNav: 0,
      activeSportView: 0,
      showPreview: true,
      loadingInitialData: false,
      view: null,
      sport: {},
      competition: {},
      region: {},
      game: {},
      relatedGames: [],
      relatedSubid:null
    };
    this.banner_image={
      1:'https://static.betconstruct.me/assets/addon/sportsbook/images/stats-banner-soccer-bg.jpg',
      3:'https://static.betconstruct.me/assets/addon/sportsbook/images/stats-banner-basketball-bg.jpg',
      4:'https://static.betconstruct.me/assets/addon/sportsbook/images/stats-banner-tennis-bg.jpg',
      5:'https://static.betconstruct.me/assets/addon/sportsbook/images/stats-banner-volleyball-bg.jpg',
    }
    this.rids = {...this.props.sportsbook.rids};
    this.goBack = this.goBack.bind(this);
    this._renderItem = this._renderItem.bind(this);
    this.changeGame = this.changeGame.bind(this)
    this.unsubscribeRelatedGames = this.unsubscribeRelatedGames.bind(this);
    this.relatedGames = this.relatedGames.bind(this);
  }
  componentDidMount() {
    let data = this.props.navigation.state.params,{sessionData}=this.props.sportsbook;
    this.props.dispatch(allActionDucer(GAME_VIEW, {loadMarket: true}));
    if (void 0 !== sessionData.sid) {
      this.loadMarkets(data.game);
      this.setState({loadingInitialData: true, ...data});
    }
  }

  componentDidUpdate(prevProps, prevState) {
    let data = this.props.navigation.state.params,{sessionData}=this.props.sportsbook,{loadingInitialData}=this.state;
    if (!loadingInitialData &&void 0 !== sessionData.sid && prevProps.navigation.state.params.game.id !== this.props.navigation.state.params.game.id && this.props.isFocused) {
      this.props.dispatch(allActionDucer(GAME_VIEW, {loadMarket: true}));
      this.loadMarkets(data.game);
      this.setState({loadingInitialData: true, ...data});
    }
    if(!this.props.isFocused&& loadingInitialData) this.setState({loadingInitialData: false});
  }
  componentWillUnmount() {
    this.props.screenProps.unsubscribe(
      this.props.sportsbook.inviewMarketsubid,
      'inviewMarketsubid',
    );
    this.props.dispatch(
      allActionDucer(GAME_VIEW, {marketData: {}, activeGame: null,showRelated:false,game:null}),
    );
  }
  loadMarkets(game) {
    if (game) {
      let request = {
        command: 'get',
        params: {
          source: 'betting',
          what: {
            game: [],
            market: [
              'id',
              'type',
              'express_id',
              'name',
              'base',
              'display_key',
              'display_sub_key',
              'main_order',
              'order',
              'col_count',
              'cashout',
              'group_id',
              'group_name',
            ],
            event: ['id', 'price', 'type', 'name', 'order', 'base'],
          },
          where: {game: {id: game.id}},
          subscribe: true,
        },
        rid: 9,
      };
      let newRid = {};
      newRid[9] = this.rids[9];
      newRid.request = request;
      this.props.dispatch(allActionDucer(RIDS_PUSH, newRid));
      this.props.screenProps.sendRequest(request);
    }
  }
  getRelatedGames({sport, region, competition, game}) {
    if (game) {
      this.setState({loadingRelated:true})
      let request = {
        command: 'get',
        params: {
          source: 'betting',
          what: {
            competition:["id","name","order"],
            game: [
              'id',
              'team1_name',
              'team2_name',
              'team1_id',
              'team2_id',
              'order',
              'start_ts',
              'markets_count',
              'is_blocked',
              'info'
            ],
          },
          where: {
            sport: {id: sport.id},
            game: {id: {'@ne': game.id}, is_live: 1},
          },
          subscribe: true,
        },
        rid: 'r-c-game',
      };
      let newRid = {};
      newRid['r-c-game'] = {
        rid: 'r-c-game',
        callback: this.relatedGames,
        request: request,
      };
      this.props.dispatch(allActionDucer(RIDS_PUSH, newRid));
      this.props.screenProps.sendRequest(request);
    }
  }
  relatedGames(data) {
    data = data.data;
    let games=[]
    if (data.data.hasOwnProperty('competition')) {
      let data1 = data.data;
      Object.keys(data1.competition).forEach((compt)=>
      {
      const game = data1.competition[compt].game
      Object.keys(game).forEach(gameId => {
        games.push({competition_id:data1.competition[compt].id,competition_name:data1.competition[compt].name,competition_order:data1.competition[compt].order,...game[gameId]});
      })
      }
      )
    }
    this.setState({relatedGames: games,loadingRelated:false,relatedSubid:data.subid});
  }
  changeGame(data){
    this.unsubscribeRelatedGames()
    this.setState({loadingInitialData: true,showRelated:false, ...data,relatedGames:[]});
    this.props.dispatch(allActionDucer(GAME_VIEW, {loadMarket: true}));
    this.props.screenProps.unsubscribe(
      this.props.sportsbook.inviewMarketsubid,
      'inviewMarketsubid',
    );
    this.loadMarkets(data.game);
  }
  unsubscribeRelatedGames(){
    this.props.dispatch(allActionDucer(GAME_VIEW,{showRelated:false}))
    this.props.screenProps.unsubscribe(
      this.state.relatedSubid
    );
    this.setState({relatedGames:[],relatedSubid:null})
    
  }
  sortByGroups(groupID) {
    this.setState({activeNav: groupID});
  }
  goBack() {
    this.props.dispatch(
      allActionDucer(GAME_VIEW, {
        loadMarket: false,
        game: null,
        marketData: {},
      }),
    );
    this.props.history.goBack();
  }
  _renderItem({item, index}) {
    const {
      addEventToSelection,
      clearUpdate,
      activeGameSuspended,
      }=this.props.screenProps,
      {
        oddType 
      }= this.props.sportsbook,
      {loadMarket,
        activeGame}=this.props.gameViewData,betSelections=this.props.betSelections,
      {
        sport,
        competition
      }=this.state;
    let elRef = React.createRef();
    return (
      <Market
        ref={elRef}
        marketIndex={index}
        activeGameSuspended={activeGameSuspended}
        activeGame={activeGame}
        market={item}
        addEventToSelection={addEventToSelection}
        loadMarket={loadMarket}
        betSelections={betSelections}
        clearUpdate={clearUpdate}
        oddType={oddType}
        sport={sport}
        competition={competition}
      />
    );
  }
  render() {
    const {activeNav,sport,competition,region,game,loadingRelated,relatedGames} = this.state,{isFocused}=this.props,
    activeView= this.props.activeView,
    {loadMarket,activeGame,marketData,showRelated}=this.props.gameViewData,betSelections=this.props.betSelections,betlen = null !== betSelections && undefined !== betSelections ? Object.keys(betSelections).length : 0

    let marketDataArr = [],activeSport=sport,
      marketDataGrouping = [],
      marketGroups = []
    for (let data in marketData) {
      if (marketData[data]) {
        let name = marketData[data].name,
          groupID = marketData[data].group_id;
        if (!marketGroups[groupID]) {
          marketGroups[groupID] = {
            id: marketData[data].group_id,
            name: marketData[data].group_name,
          };
        }
        if (activeNav !== 0) {
          if (activeNav === groupID) {
            if (marketDataGrouping[name]) {
              marketDataGrouping[name].push(marketData[data]);
            } else marketDataGrouping[name] = [marketData[data]];
          }
        } else {
          if (marketDataGrouping[name]) {
            marketDataGrouping[name].push(marketData[data]);
          } else
            name !== void 0 && (marketDataGrouping[name] = [marketData[data]]);
          // marketDataArr.push(marketData[data])
        }
      }
    }

    Object.keys(marketDataGrouping).forEach((name, key) => {
      name !== void 0 &&
        marketDataArr.push({name: name, data: marketDataGrouping[name]});
    });
    marketDataArr.sort((a, b) => {
      if (a.data[0].order > b.data[0].order) return 1;

      if (b.data[0].order > a.data[0].order) return -1;

      return 0;
    });

    return (
      <View style={{flex:1}}>
      <Container>
        <Content>
        {loadMarket?
         <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center',alignSelf:'center',minHeight:200}}>
           <ActivityIndicator size="large" animating={loadMarket}/>
         </View>
        :
        <View
          style={[
            viewStyles.market,
            gridStyles.colsm12,
            viewStyles[activeView.toLowerCase()]
          ]}>
            <Modal
              visible={showRelated}
              animationType="slide"
              transparent={true}
              onShow={()=>this.getRelatedGames({
                sport: activeSport,
                region: region,
                competition: competition,
                game: game,
              })}
              onDismiss={this.unsubscribeRelatedGames}
              onRequestClose={this.unsubscribeRelatedGames}
            >
             <TouchableWithoutFeedback onPress={this.unsubscribeRelatedGames}>
                <View style={{flex:1,position:'relative',backgroundColor:'rgba(0,0,0,0.5)'}}>
                    <View style={{position:'absolute',left:0,right:0,top:55,backgroundColor:'#fff',minHeight:200,maxHeight:400}}>
                      {
                        loadingRelated?
                        <View style={{flex:1,alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                        <ActivityIndicator animating={loadingRelated} size="large" hidesWhenStopped={true}/>
                        </View>
                        :
                        <FlatList
                          data={relatedGames}
                          contentContainerStyle={{flex:1}}
                          keyExtractor={(item,index)=>index.toString()}
                          renderItem={({item})=>{
                            let currentSet = item !== null && item.info && item.info.current_game_state ? convertSetName()(item.info.current_game_state, stringReplacer(activeSport.alias, [/\s/g], [''])) : '';
                          return (<View style={{display:'flex',flex:1}}>
                          <View style={[viewStyles.sbAccordionItem]}>
                            <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} onPress={() =>this.changeGame({competition:{id:item.competition_id,name:item.competition_name},game:{...item}})} >
                            <View style={[gridStyles.colsm12,viewStyles.sbAccordionTitle,viewStyles.sbAccordionTitleMatchTitle]}>
                              <View style={viewStyles.matchTitleText}>
                                <Text  numberOfLines={1} ellipsizeMode='tail'style={[gridStyles.colsm10,{padding:3,color:'#11c9e3'}]}>{item.competition_name}</Text>
                              </View>
                              <View style={viewStyles.matchTitleText}>
                                <Text  numberOfLines={1} ellipsizeMode='tail'style={[gridStyles.colsm11,{padding:3},viewStyles.themeTextColor]}>{item.team1_name}</Text>
                                <Text style={[gridStyles.colsm1,{color:'rgba(230,180,79,.99)'}]}>{item.info ? item.info.score1 : ''}</Text>
                              </View>
                              <View style={[viewStyles.matchTitleText,viewStyles.matchTitleTextx2]}>
                                <Text numberOfLines={1} ellipsizeMode='tail' style={[gridStyles.colsm11,{padding:3},viewStyles.themeTextColor]}>{item.team2_name}</Text>
                                <Text style={[gridStyles.colsm1,{color:'rgba(230,180,79,.99)'}]}>{item.info ? item.info.score2 : ''}</Text>
                              </View>
                              <View style={viewStyles.hiddenIcons}>
                                <View style={[gridStyles.colsm10,{flexDirection:'row'}]}>
                                  <View style={viewStyles.matchTimeInfo}>
                                    <Text numberOfLines={1} ellipsizeMode='tail' style={{padding:3,color: "#1ba573",fontWeight:'700',fontSize:12}}>{item.info ? currentSet !== 'notstarted' ? currentSet : moment.unix(item.start_ts).format('D MMMM YYYY H:mm') : null} {item.info ? item.info.current_game_time : null}</Text>
                                  </View>
                                  {/* <View  className="goal-alert-msg">Goal!!!</View> */}
                                </View>
                              </View>
                              
                            </View>
                        </TouchableNativeFeedback>
                        </View>
                        </View>)}}
                        ListEmptyComponent={()=><View style={{flex:1,alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                        <View style={{flex:1}}><Text>No games available</Text></View>
                        </View>}
                      />}
                    </View>
                </View>
                </TouchableWithoutFeedback>
            </Modal>
          <View
            style={[{flex:1},
              viewStyles.marketContainer,
              (loadMarket || !activeGame) && viewStyles.marketLoading,
            ]}>
              <View style={{flexDirection:'row',padding:10}}>
                <View style={{flexDirection:'row'}}>
                <CustomIcon style={[viewStyles[`${stringReplacer(sport.alias, [/\s/g, /\d.+?\d/g, /\(.+?\)/g], ['', '', '']).toLowerCase()}_text`]]} name={stringReplacer(sport.alias, [/\s/g, /\d.+?\d/g, /\(.+?\)/g], ['', '', ''])} size={20}/>
                 <View style={{paddingLeft:5,paddingRight:5}}><Text ellipsizeMode="tail" numberOfLines={1}>{sport.name}</Text></View>
                </View>
                <View style={{flexDirection:'row'}}>
                {region.hasOwnProperty('alias')&&<Image
                    style={{width:20,height:20}}
                    source={flagPath[region.alias.replace(/\s/g, '-').replace(/'/g, '').toLowerCase()]}
                  />}
                  <View style={{paddingLeft:5,paddingRight:5}}><Text ellipsizeMode="tail" numberOfLines={1}>{region.name}</Text></View>
                </View>
                <View style={{flexDirection:'row',paddingLeft:5,paddingRight:5}}><Text ellipsizeMode="tail" numberOfLines={1}>{competition.name}</Text></View>
              </View>
              <>
              {
                activeGame &&activeGame.type ===1&& activeGame.hasOwnProperty('stats')&&activeGame.hasOwnProperty('info')?
                activeSport.id == 1 ?
                <StatsBannerSoccer activeSport={activeSport} activeGame={activeGame} loadMarket={loadMarket} />
                : activeSport.id == 3 ?
                  <StatsBannerBasketBall activeSport={activeSport} activeGame={activeGame} loadMarket={loadMarket} />
                  : activeSport.id == 4 ?
                    <StatsBannerTennis activeSport={activeSport} activeGame={activeGame} loadMarket={loadMarket} />
                    : <StatsBannerGeneric activeSport={activeSport} activeGame={activeGame} loadMarket={loadMarket}/>
                    :null
              }
              <>
                  {activeGame &&activeGame.type ===1&&activeSport.id === 1 && (
                    <View style={[viewStyles.gameinfoContainer]}>
                        <View
                          style={[
                            viewStyles.timeLineContainer,
                            viewStyles.timeLineContainerShow,
                          ]}>
                          <View style={[viewStyles.timeLine]}>
                            <View
                              style={[
                                viewStyles.curTime,
                                {
                                  right: activeGame
                                    ? activeGame.info
                                      ? activeGame.info.current_game_state ===
                                        'Half Time'
                                        ? '50%'
                                        : 100 -
                                          (activeGame.info.current_game_time /
                                            90) *
                                            100 +
                                          '%'
                                      : 0
                                    : 0
                                }
                              ]}/>

                            <View
                              style={[
                                activeGame &&
                                  activeGame.info &&
                                  (activeGame.info.current_game_time > 0 ||
                                    activeGame.info.current_game_state ===
                                      'Half Time') &&
                                      viewStyles.active,
                              ]}>
                            </View>
                            <View style={[viewStyles.curTimeChild,viewStyles.curTimeChildNotHalf,viewStyles.active]}/>
                            <View style={[viewStyles.curTimeChild,viewStyles.curTimeChildNotHalf,viewStyles.active]}/>
                            <View
                              style={[
                                activeGame &&
                                  activeGame.info &&
                                  (activeGame.info.current_game_time >= 15 ||
                                    activeGame.info.current_game_state ===
                                      'Half Time') &&
                                  viewStyles.active,
                              ]}>
                            </View>
                            <View style={[viewStyles.curTimeChild,viewStyles.curTimeChildNotHalf,viewStyles.active]}/>
                            <View style={[viewStyles.curTimeChild,viewStyles.curTimeChildNotHalf,viewStyles.active]}/>
                            <View
                              style={[
                                activeGame &&
                                  activeGame.info &&
                                  (activeGame.info.current_game_time >= 30 ||
                                    activeGame.info.current_game_state ===
                                      'Half Time') &&
                                  viewStyles.active,
                              ]}>
                            </View>
                            <View style={[viewStyles.curTimeChild,viewStyles.curTimeChildNotHalf,viewStyles.active]}/>
                            <View style={[viewStyles.curTimeChild,viewStyles.curTimeChildNotHalf,viewStyles.active]}/>
                            <View
                              style={[
                                viewStyles.curTimeChild,
                                viewStyles.active,
                                viewStyles.halfTime,
                                {zIndex:2}
                              ]}>
                              <View style={viewStyles.fullHalfBefore}></View>
                              <Text style={{position:'absolute',top:12}}>HT</Text>
                              <View style={viewStyles.fullHalfAfter}></View>
                            </View>
                            <View style={[viewStyles.curTimeChild,viewStyles.curTimeChildNotHalf,viewStyles.active]}/>
                            <View style={[viewStyles.curTimeChild,viewStyles.curTimeChildNotHalf,viewStyles.active]}/>
                            <View
                              style={[
                                activeGame &&
                                  activeGame.info &&
                                  activeGame.info.current_game_time &&
                                  activeGame.info.current_game_time >= 60 &&
                                  viewStyles.active,
                              ]}>
                            </View>
                            <View style={[viewStyles.curTimeChild,viewStyles.curTimeChildNotHalf,viewStyles.active]}/>
                            <View style={[viewStyles.curTimeChild,viewStyles.curTimeChildNotHalf,viewStyles.active]}/>
                            <View
                              style={[
                                activeGame &&
                                  activeGame.info &&
                                  activeGame.info.current_game_time &&
                                  activeGame.info.current_game_time >= 75 &&
                                  viewStyles.active,
                              ]}>
                            </View>
                            <View style={[viewStyles.curTimeChild,viewStyles.curTimeChildNotHalf,viewStyles.active]}/>
                          
                            <View
                              style={[
                                activeGame &&
                                  activeGame.info &&
                                  activeGame.info.current_game_time &&
                                  activeGame.info.current_game_time >= 90 &&
                                  viewStyles.active,
                                  viewStyles.curTimeChild,{zIndex:2,flexDirection:'row',justifyContent:'flex-end',width:'5.56666666667%'},
                                  viewStyles.fullTime
                              ]}>
                              <View style={viewStyles.fullHalfBefore}></View>
                              <Text style={{position:'absolute',top:12}}>FT</Text>
                              <View style={[viewStyles.fullAfter]}></View>
                            </View>
                            <View style={viewStyles.timeLineAfter}></View>
                          </View>
                        </View>
                    </View>
                  )}
                </>
                {activeGame &&activeGame.type ===1 ?
                              <>
                              {(activeSport.id === 3||activeSport.id === 1||activeSport.id === 4)&&<Tabs tabBarUnderlineStyle={{backgroundColor:'#11c9e3'}}>
                              <Tab  heading={ <TabHeading style={{backgroundColor:'#eee'}}><Text>Pitch</Text></TabHeading>}>
                               {activeGame && activeGame.last_event &&<LiveGamePreview activeGame={activeGame} activeSport={activeSport} activeView={activeView}currentLiveEventTeamName ={ activeGame !== null && activeGame.last_event !== undefined && activeView === 'Live' ? activeGame.last_event.side === '1' ? activeGame.team1_name : activeGame.last_event.side === '2' ? activeGame.team2_name : '' : ''} currentLiveEventName = {activeGame !== null && void 0 !==activeSport.alias && activeGame.last_event !== void 0 && activeGame.last_event !== null && activeGame &&activeGame.type ===1 ? stringReplacer(EventIDToNameMap[activeSport.id===3&&activeGame.last_event.type_id==="327"?parseInt(activeGame.last_event.type_id)+(activeGame.last_event.event_value-1):activeGame.last_event.type_id], [/([a-z])([A-Z])/g, /\b(\w*Period\w*)\b/g], ['$1 $2', '']) : ''}/>}
                              </Tab>
                                <Tab  heading={ <TabHeading style={{backgroundColor:'#eee'}}><Text>Stats</Text></TabHeading>}>
                                {
                                  activeGame && activeGame.hasOwnProperty('stats')&& activeGame.hasOwnProperty('info') &&
                                  <View>
                                  <View style={[statsStyles.gameContainer]}>
                                      <View style={[statsStyles.gameStatistics, statsStyles.soccer]}>
                                          <View style={[statsStyles.stScheme]}>
                                              <View style={[statsStyles.stSchemeInner]}>
                                                  {activeSport.id === 1 && (
                                                    <>
                                                      <View style={[statsStyles.stContainer]}>
                                                          <View style={[statsStyles.stBlock]}>
                                                             <View style={{marginTop:10,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                                             <View style={[statsStyles.value]}>
                                                                  <Text>
                                                                      {activeGame
                                                                          ? activeGame.stats.dangerous_attack
                                                                              ? activeGame.stats.dangerous_attack
                                                                                  .team1_value
                                                                              : '-'
                                                                          : '-'}
                                                                  </Text>
                                                              </View>
                                                              <View style={[statsStyles.stType]}>
                                                                  <Text>Dangerous Attack</Text>
                                                              </View>
                                                              <View style={[statsStyles.value]}>
                                                                  <Text>
                                                                      {activeGame
                                                                          ? activeGame.stats.dangerous_attack
                                                                              ? activeGame.stats.dangerous_attack
                                                                                  .team2_value
                                                                              : '-'
                                                                          : '-'}
                                                                  </Text>
                                                              </View>
                                                             </View>
                                                              <View style={statsStyles.statsContainer}>         
                                                              <View
                                                                  style={[{width:
                                                                      activeGame
                                                                          ? activeGame.stats.dangerous_attack
                                                                              ?Math.round(
                                                                                  (activeGame.stats.dangerous_attack.team1_value /
                                                                                      (activeGame.stats.dangerous_attack.team2_value +
                                                                                          activeGame.stats.dangerous_attack.team1_value)) *
                                                                                  100,
                                                                              )+ '%'
                                                                              : '50%'
                                                                          : '50%'
                                                                        }, {
                                                                      backgroundColor: activeGame
                                                                          ? activeGame.info.shirt1_color !==
                                                                              '000000'
                                                                              ? '#' + activeGame.info.shirt1_color
                                                                              : 'rgb(59, 189, 189)'
                                                                          : '',
                                                                      
                                                                      height: 8,
                                                                      borderTopLeftRadius:8,
                                                                      borderBottomLeftRadius:8,
                                                                  },activeGame.stats.dangerous_attack&&activeGame.stats.dangerous_attack.team2_value===0&&{borderTopRightRadius:8,
                                                                    borderBottomRightRadius:8,}]}>
                                                                  
                                                              </View>
                                                              <View
                                                                  style={[{width:
                                                                      activeGame
                                                                          ? activeGame.stats.dangerous_attack
                                                                              ?Math.round(
                                                                                  (activeGame.stats.dangerous_attack.team2_value /
                                                                                      (activeGame.stats.dangerous_attack.team2_value +
                                                                                          activeGame.stats
                                                                                              .dangerous_attack.team1_value)) *
                                                                                  100,
                                                                              )+ '%'
                                                                              : '50%'
                                                                          : '50%'
                                                                        }, {
                                                                      backgroundColor: activeGame
                                                                          ? activeGame.info.shirt2_color !==
                                                                              '000000'
                                                                              ? '#' + activeGame.info.shirt2_color
                                                                              : 'rgb(165, 28, 210)'
                                                                          : '',
                                                                      
                                                                      height: 8,
                                                                      borderTopRightRadius:8,
                                                                      borderBottomRightRadius:8,
                                                                  },activeGame.stats.dangerous_attack&&activeGame.stats.dangerous_attack.team1_value===0&&{borderTopLeftRadius:8,
                                                                    borderBottomLeftRadius:8,}]}>
                                                                  
                                                              </View>
                                                              </View>
                                                            
                                                          </View>
                                                          
                                                      </View>
                                                      <View style={[statsStyles.stContainer]}>
                                                          <View style={[statsStyles.stBlock]}>
                                                             <View style={{marginTop:10,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                                             <View style={[viewStyles.value]}>
                                                                  <Text>
                                                                      {activeGame
                                                                          ? activeGame.stats.shot_on_target
                                                                              ? activeGame.stats.shot_on_target
                                                                                  .team1_value
                                                                              : '-'
                                                                          : '-'}
                                                                  </Text>
                                                              </View>
                                                              <View style={[statsStyles.stType]}>
                                                                  <Text>Shot On Target</Text>
                                                              </View>
                                                              <View style={[statsStyles.value]}>
                                                                  <Text>
                                                                      {activeGame
                                                                          ? activeGame.stats.shot_on_target
                                                                              ? activeGame.stats.shot_on_target
                                                                                  .team2_value
                                                                              : '-'
                                                                          : '-'}
                                                                  </Text>
                                                              </View>
                                                             </View>
                                                              <View style={statsStyles.statsContainer}>         
                                                              <View
                                                                  style={[{width:
                                                                      activeGame
                                                                          ? activeGame.stats.shot_on_target
                                                                              ?Math.round(
                                                                                  (activeGame.stats.shot_on_target.team1_value /
                                                                                      (activeGame.stats.shot_on_target.team2_value +
                                                                                          activeGame.stats.shot_on_target.team1_value)) *
                                                                                  100,
                                                                              )+ '%'
                                                                              : '50%'
                                                                          : '50%'
                                                                        }, {
                                                                      backgroundColor: activeGame
                                                                          ? activeGame.info.shirt1_color !==
                                                                              '000000'
                                                                              ? '#' + activeGame.info.shirt1_color
                                                                              : 'rgb(59, 189, 189)'
                                                                          : '',
                                                                      
                                                                      height: 8,
                                                                      borderTopLeftRadius:8,
                                                                      borderBottomLeftRadius:8,
                                                                  },activeGame.stats.shot_on_target && activeGame.stats.shot_on_target.team2_value===0&&{borderTopRightRadius:8,
                                                                    borderBottomRightRadius:8,}]}>
                                                                  
                                                              </View>
                                                              <View
                                                                  style={[{width:
                                                                      activeGame
                                                                          ? activeGame.stats.shot_on_target
                                                                              ?Math.round(
                                                                                  (activeGame.stats.shot_on_target.team2_value /
                                                                                      (activeGame.stats.shot_on_target.team2_value +
                                                                                          activeGame.stats.shot_on_target.team1_value)) *
                                                                                  100,
                                                                              )+ '%'
                                                                              : '50%'
                                                                          : '50%'
                                                                        }, {
                                                                      backgroundColor: activeGame
                                                                          ? activeGame.info.shirt2_color !==
                                                                              '000000'
                                                                              ? '#' + activeGame.info.shirt2_color
                                                                              : 'rgb(165, 28, 210)'
                                                                          : '',
                                                                      
                                                                      height: 8,
                                                                      borderTopRightRadius:8,
                                                                      borderBottomRightRadius:8,
                                                                  },activeGame.stats.shot_on_target&&activeGame.stats.shot_on_target.team1_value===0&&{borderTopLeftRadius:8,
                                                                    borderBottomLeftRadius:8,}]}>
                                                                  
                                                              </View>
                                                              </View>
                                                            
                                                          </View>
                                                          
                                                      </View>
                                                      <View style={[statsStyles.stContainer]}>
                                                          <View style={[statsStyles.stBlock]}>
                                                             <View style={{marginTop:10,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                                             <View style={[statsStyles.value]}>
                                                                  <Text>
                                                                      {activeGame
                                                                          ? activeGame.stats.shot_off_target
                                                                              ? activeGame.stats.shot_off_target
                                                                                  .team1_value
                                                                              : '-'
                                                                          : '-'}
                                                                  </Text>
                                                              </View>
                                                              <View style={[statsStyles.stType]}>
                                                                  <Text>Shot Off Target</Text>
                                                              </View>
                                                              <View style={[statsStyles.value]}>
                                                                  <Text>
                                                                      {activeGame
                                                                          ? activeGame.stats.shot_off_target
                                                                              ? activeGame.stats.shot_off_target
                                                                                  .team2_value
                                                                              : '-'
                                                                          : '-'}
                                                                  </Text>
                                                              </View>
                                                             </View>
                                                              <View style={statsStyles.statsContainer}>         
                                                              <View
                                                                  style={[{width:
                                                                      activeGame
                                                                          ? activeGame.stats.shot_off_target
                                                                              ?Math.round(
                                                                                  (activeGame.stats.shot_off_target.team1_value /
                                                                                      (activeGame.stats.shot_off_target.team2_value +
                                                                                          activeGame.stats.shot_off_target.team1_value)) *
                                                                                  100,
                                                                              )+ '%'
                                                                              : '50%'
                                                                          : '50%'
                                                                        }, {
                                                                      backgroundColor: activeGame
                                                                          ? activeGame.info.shirt1_color !==
                                                                              '000000'
                                                                              ? '#' + activeGame.info.shirt1_color
                                                                              : 'rgb(59, 189, 189)'
                                                                          : '',
                                                                      
                                                                      height: 8,
                                                                      borderTopLeftRadius:8,
                                                                      borderBottomLeftRadius:8,
                                                                  },activeGame.stats.shot_off_target&&activeGame.stats.shot_off_target.team2_value===0&&{borderTopRightRadius:8,
                                                                    borderBottomRightRadius:8,}]}>
                                                                  
                                                              </View>
                                                              <View
                                                                  style={[{width:
                                                                      activeGame
                                                                          ? activeGame.stats.shot_off_target
                                                                              ?Math.round(
                                                                                  (activeGame.stats.shot_off_target.team2_value /
                                                                                      (activeGame.stats.shot_off_target.team2_value +
                                                                                          activeGame.stats.shot_off_target.team1_value)) *
                                                                                  100,
                                                                              )+ '%'
                                                                              : '50%'
                                                                          : '50%'
                                                                        }, {
                                                                      backgroundColor: activeGame
                                                                          ? activeGame.info.shirt2_color !==
                                                                              '000000'
                                                                              ? '#' + activeGame.info.shirt2_color
                                                                              : 'rgb(165, 28, 210)'
                                                                          : '',
                                                                      
                                                                      height: 8,
                                                                      borderTopRightRadius:8,
                                                                      borderBottomRightRadius:8,
                                                                  },activeGame.stats.shot_off_target&&activeGame.stats.shot_off_target.team1_value===0&&{borderTopLeftRadius:8,
                                                                    borderBottomLeftRadius:8,}]}>
                                                                  
                                                              </View>
                                                              </View>
                                                            
                                                          </View>
                                                          
                                                      </View>
                                                      <View style={[statsStyles.stContainer]}>
                                                          <View style={[statsStyles.stBlock]}>
                                                             <View style={{marginTop:10,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                                             <View style={[statsStyles.value]}>
                                                                  <Text>
                                                                      {activeGame
                                                                          ? activeGame.stats.corner
                                                                              ? activeGame.stats.corner
                                                                                  .team1_value
                                                                              : '-'
                                                                          : '-'}
                                                                  </Text>
                                                              </View>
                                                              <View style={[statsStyles.stType]}>
                                                                  <Text>Corner Kick</Text>
                                                              </View>
                                                              <View style={[statsStyles.value]}>
                                                                  <Text>
                                                                      {activeGame
                                                                          ? activeGame.stats.corner
                                                                              ? activeGame.stats.corner
                                                                                  .team2_value
                                                                              : '-'
                                                                          : '-'}
                                                                  </Text>
                                                              </View>
                                                             </View>
                                                              <View style={statsStyles.statsContainer}>         
                                                              <View
                                                                  style={[{width:
                                                                      activeGame
                                                                          ? activeGame.stats.corner
                                                                              ?Math.round(
                                                                                  (activeGame.stats.corner.team1_value /
                                                                                      (activeGame.stats.corner.team2_value +
                                                                                          activeGame.stats.corner.team1_value)) *
                                                                                  100,
                                                                              )+ '%'
                                                                              : '50%'
                                                                          : '50%'
                                                                        }, {
                                                                      backgroundColor: activeGame
                                                                          ? activeGame.info.shirt1_color !==
                                                                              '000000'
                                                                              ? '#' + activeGame.info.shirt1_color
                                                                              : 'rgb(59, 189, 189)'
                                                                          : '',
                                                                      
                                                                      height: 8,
                                                                      borderTopLeftRadius:8,
                                                                      borderBottomLeftRadius:8,
                                                                  },activeGame.stats.corner&&activeGame.stats.corner.team2_value===0&&{ borderTopRightRadius:8,
                                                                    borderBottomRightRadius:8,}]}>
                                                                  
                                                              </View>
                                                              <View
                                                                  style={[{width:
                                                                      activeGame
                                                                          ? activeGame.stats.corner
                                                                              ?Math.round(
                                                                                  (activeGame.stats.corner.team2_value /
                                                                                      (activeGame.stats.corner.team2_value +
                                                                                          activeGame.stats.corner.team1_value)) *
                                                                                  100,
                                                                              )+ '%'
                                                                              : '50%'
                                                                          : '50%'
                                                                        }, {
                                                                      backgroundColor: activeGame
                                                                          ? activeGame.info.shirt2_color !==
                                                                              '000000'
                                                                              ? '#' + activeGame.info.shirt2_color
                                                                              : 'rgb(165, 28, 210)'
                                                                          : '',
                                                                      
                                                                      height: 8,
                                                                      borderTopRightRadius:8,
                                                                      borderBottomRightRadius:8,
                                                                  },activeGame.stats.corner&&activeGame.stats.corner.team1_value===0&&{ borderTopLeftRadius:8,
                                                                    borderBottomLeftRadius:8,}]}>
                                                                  
                                                              </View>
                                                              </View>
                                                            
                                                          </View>
                                                          
                                                      </View>
                                                      <View style={[statsStyles.stContainer]}>
                                                          <View style={[statsStyles.stBlock]}>
                                                             <View style={{marginTop:10,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                                             <View style={[statsStyles.value]}>
                                                                  <Text>
                                                                      {activeGame
                                                                          ? activeGame.stats.yellow_card
                                                                              ? activeGame.stats.yellow_card
                                                                                  .team1_value
                                                                              : '-'
                                                                          : '-'}
                                                                  </Text>
                                                              </View>
                                                              <View style={[statsStyles.stType]}>
                                                                  <Text>Yellow Card</Text>
                                                              </View>
                                                              <View style={[statsStyles.value]}>
                                                                  <Text>
                                                                      {activeGame
                                                                          ? activeGame.stats.yellow_card
                                                                              ? activeGame.stats.yellow_card
                                                                                  .team2_value
                                                                              : '-'
                                                                          : '-'}
                                                                  </Text>
                                                              </View>
                                                             </View>
                                                              <View style={statsStyles.statsContainer}>         
                                                              <View
                                                                  style={[{width:
                                                                      activeGame
                                                                          ? activeGame.stats.yellow_card
                                                                              ?Math.round(
                                                                                  (activeGame.stats.yellow_card.team1_value /
                                                                                      (activeGame.stats.yellow_card.team2_value +
                                                                                          activeGame.stats.yellow_card.team1_value)) *
                                                                                  100,
                                                                              )+ '%'
                                                                              : '50%'
                                                                          : '50%'
                                                                        }, {
                                                                      backgroundColor: activeGame
                                                                          ? activeGame.info.shirt1_color !==
                                                                              '000000'
                                                                              ? '#' + activeGame.info.shirt1_color
                                                                              : 'rgb(59, 189, 189)'
                                                                          : '',
                                                                      
                                                                      height: 8,
                                                                      borderTopLeftRadius:8,
                                                                      borderBottomLeftRadius:8,
                                                                  },activeGame.stats.yellow_card&&activeGame.stats.yellow_card.team2_value===0 &&{borderTopRightRadius:8,
                                                                    borderBottomRightRadius:8,}]}>
                                                                  
                                                              </View>
                                                              <View
                                                                  style={[{width:
                                                                      activeGame
                                                                          ? activeGame.stats.yellow_card
                                                                              ?Math.round(
                                                                                  (activeGame.stats.yellow_card.team2_value /
                                                                                      (activeGame.stats.yellow_card.team2_value +
                                                                                          activeGame.stats.yellow_card.team1_value)) *
                                                                                  100,
                                                                              )+ '%'
                                                                              : '50%'
                                                                          : '50%'
                                                                        }, {
                                                                      backgroundColor: activeGame
                                                                          ? activeGame.info.shirt2_color !==
                                                                              '000000'
                                                                              ? '#' + activeGame.info.shirt2_color
                                                                              : 'rgb(165, 28, 210)'
                                                                          : '',
                                                                      
                                                                      height: 8,
                                                                      borderTopRightRadius:8,
                                                                      borderBottomRightRadius:8,
                                                                  },activeGame.stats.yellow_card&&activeGame.stats.yellow_card.team1_value===0 &&{borderTopLeftRadius:8,
                                                                    borderBottomLeftRadius:8,}]}>
                                                                  
                                                              </View>
                                                              </View>
                                                            
                                                          </View>
                                                          
                                                      </View>
                                                      <View style={[statsStyles.stContainer]}>
                                                          <View style={[statsStyles.stBlock]}>
                                                             <View style={{marginTop:10,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                                             <View style={[statsStyles.value]}>
                                                                  <Text>
                                                                      {activeGame
                                                                          ? activeGame.stats.red_card
                                                                              ? activeGame.stats.red_card
                                                                                  .team1_value
                                                                              : '-'
                                                                          : '-'}
                                                                  </Text>
                                                              </View>
                                                              <View style={[statsStyles.stType]}>
                                                                  <Text>Red Card</Text>
                                                              </View>
                                                              <View style={[statsStyles.value]}>
                                                                  <Text>
                                                                      {activeGame
                                                                          ? activeGame.stats.red_card
                                                                              ? activeGame.stats.red_card
                                                                                  .team2_value
                                                                              : '-'
                                                                          : '-'}
                                                                  </Text>
                                                              </View>
                                                             </View>
                                                              <View style={statsStyles.statsContainer}>         
                                                              <View
                                                                  style={[{width:
                                                                      activeGame
                                                                          ? activeGame.stats.red_card
                                                                              ?Math.round(
                                                                                  (activeGame.stats.red_card.team1_value /
                                                                                      (activeGame.stats.red_card.team2_value +
                                                                                          activeGame.stats.red_card.team1_value)) *
                                                                                  100,
                                                                              )+ '%'
                                                                              : '50%'
                                                                          : '50%'
                                                                        }, {
                                                                      backgroundColor: activeGame
                                                                          ? activeGame.info.shirt1_color !==
                                                                              '000000'
                                                                              ? '#' + activeGame.info.shirt1_color
                                                                              : 'rgb(59, 189, 189)'
                                                                          : '',
                                                                      
                                                                      height: 8,
                                                                      borderTopLeftRadius:8,
                                                                      borderBottomLeftRadius:8,
                                                                  },activeGame.stats.red_card&&activeGame.stats.red_card.team2_value===0&&{ borderTopRightRadius:8,
                                                                    borderBottomRightRadius:8,}]}>
                                                                  
                                                              </View>
                                                              <View
                                                                  style={[{width:
                                                                      activeGame
                                                                          ? activeGame.stats.red_card
                                                                              ?Math.round(
                                                                                  (activeGame.stats.red_card.team2_value /
                                                                                      (activeGame.stats.red_card.team2_value +
                                                                                          activeGame.stats.red_card.team1_value)) *
                                                                                  100,
                                                                              )+ '%'
                                                                              : '50%'
                                                                          : '50%'
                                                                        }, {
                                                                      backgroundColor: activeGame
                                                                          ? activeGame.info.shirt2_color !==
                                                                              '000000'
                                                                              ? '#' + activeGame.info.shirt2_color
                                                                              : 'rgb(165, 28, 210)'
                                                                          : '',
                                                                      
                                                                      height: 8,
                                                                      borderTopRightRadius:8,
                                                                      borderBottomRightRadius:8,
                                                                  },activeGame.stats.red_card&& activeGame.stats.red_card.team1_value===0 &&{borderTopLeftRadius:8,
                                                                    borderBottomLeftRadius:8,}]}>
                                                                  
                                                              </View>
                                                              </View>
                                                            
                                                          </View>
                                                          
                                                      </View>
                                                      </>
                                                  )}

                                                  {activeSport.id === 3 ? (
                                                    <>
                                                      <View style={[statsStyles.stContainer]}>
                                                          <View style={[statsStyles.stBlock]}>
                                                             <View style={{marginTop:10,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                                             <View style={[statsStyles.value]}>
                                                                  <Text>
                                                                      {activeGame
                                                                          ? activeGame.stats.foul
                                                                              ? activeGame.stats.foul
                                                                                  .team1_value
                                                                              : '-'
                                                                          : '-'}
                                                                  </Text>
                                                              </View>
                                                              <View style={[statsStyles.stType]}>
                                                                  <Text>Foul</Text>
                                                              </View>
                                                              <View style={[statsStyles.value]}>
                                                                  <Text>
                                                                      {activeGame
                                                                          ? activeGame.stats.foul
                                                                              ? activeGame.stats.foul
                                                                                  .team2_value
                                                                              : '-'
                                                                          : '-'}
                                                                  </Text>
                                                              </View>
                                                             </View>
                                                              <View style={statsStyles.statsContainer}>         
                                                              <View
                                                                  style={[{width:
                                                                      activeGame
                                                                          ? activeGame.stats.foul
                                                                              ?Math.round(
                                                                                  (activeGame.stats.foul.team1_value /
                                                                                      (activeGame.stats.foul.team2_value +
                                                                                          activeGame.stats.foul.team1_value)) *
                                                                                  100,
                                                                              )+ '%'
                                                                              : '50%'
                                                                          : '50%'
                                                                        }, {
                                                                      backgroundColor: activeGame
                                                                          ? activeGame.info.shirt1_color !==
                                                                              '000000'
                                                                              ? '#' + activeGame.info.shirt1_color
                                                                              : 'rgb(59, 189, 189)'
                                                                          : '',
                                                                      
                                                                      height: 8,
                                                                      borderTopLeftRadius:8,
                                                                      borderBottomLeftRadius:8,
                                                                  },activeGame.stats.foul&&activeGame.stats.foul.team2_value===0 &&{borderTopRightRadius:8,
                                                                    borderBottomRightRadius:8,}]}>
                                                                  
                                                              </View>
                                                              <View
                                                                  style={[{width:
                                                                      activeGame
                                                                          ? activeGame.stats.foul
                                                                              ?Math.round(
                                                                                  (activeGame.stats.foul.team2_value /
                                                                                      (activeGame.stats.foul.team2_value +
                                                                                          activeGame.stats.foul.team1_value)) *
                                                                                  100,
                                                                              )+ '%'
                                                                              : '50%'
                                                                          : '50%'
                                                                        }, {
                                                                      backgroundColor: activeGame
                                                                          ? activeGame.info.shirt2_color !==
                                                                              '000000'
                                                                              ? '#' + activeGame.info.shirt2_color
                                                                              : 'rgb(165, 28, 210)'
                                                                          : '',
                                                                      
                                                                      height: 8,
                                                                      borderTopRightRadius:8,
                                                                      borderBottomRightRadius:8,
                                                                  },activeGame.stats.foul&&activeGame.stats.foul.team1_value===0 &&{borderTopLeftRadius:8,
                                                                    borderBottomLeftRadius:8,}]}>
                                                                  
                                                              </View>
                                                              </View>
                                                            
                                                          </View>
                                                          
                                                      </View>
                                                      </>
                                                  ) : null}
                                                  {activeSport.id === 4 ? (
                                                    <>
                                                     <View style={[statsStyles.stContainer]}>
                                                          <View style={[statsStyles.stBlock]}>
                                                             <View style={{marginTop:10,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                                             <View style={[statsStyles.value]}>
                                                                  <Text>
                                                                      {activeGame
                                                                          ? activeGame.stats.yellow_card
                                                                              ? activeGame.stats.yellow_card
                                                                                  .team1_value
                                                                              : '-'
                                                                          : '-'}
                                                                  </Text>
                                                              </View>
                                                              <View style={[statsStyles.stType]}>
                                                                  <Text>Aces</Text>
                                                              </View>
                                                              <View style={[statsStyles.value]}>
                                                                  <Text>
                                                                      {activeGame
                                                                          ? activeGame.stats.yellow_card
                                                                              ? activeGame.stats.yellow_card
                                                                                  .team2_value
                                                                              : '-'
                                                                          : '-'}
                                                                  </Text>
                                                              </View>
                                                             </View>
                                                              <View style={statsStyles.statsContainer}>         
                                                              <View
                                                                  style={[{width:
                                                                      activeGame
                                                                          ? activeGame.stats.aces
                                                                              ?Math.round(
                                                                                  (activeGame.stats.aces.team1_value /
                                                                                      (activeGame.stats.aces.team2_value +
                                                                                          activeGame.stats.aces.team1_value)) *
                                                                                  100,
                                                                              )+ '%'
                                                                              : '50%'
                                                                          : '50%'
                                                                        }, {
                                                                      backgroundColor: activeGame
                                                                          ? activeGame.info.shirt1_color !==
                                                                              '000000'
                                                                              ? '#' + activeGame.info.shirt1_color
                                                                              : 'rgb(59, 189, 189)'
                                                                          : '',
                                                                      
                                                                      height: 8,
                                                                      borderTopLeftRadius:8,
                                                                      borderBottomLeftRadius:8,
                                                                  },activeGame.stats.aces&&activeGame.stats.aces.team2_value===0 &&{borderTopRightRadius:8,
                                                                    borderBottomRightRadius:8,}]}>
                                                                  
                                                              </View>
                                                              <View
                                                                  style={[{width:
                                                                      activeGame
                                                                          ? activeGame.stats.aces
                                                                              ?Math.round(
                                                                                  (activeGame.stats.aces.team2_value /
                                                                                      (activeGame.stats.aces.team2_value +
                                                                                          activeGame.stats.aces.team1_value)) *
                                                                                  100,
                                                                              )+ '%'
                                                                              : '50%'
                                                                          : '50%'
                                                                        }, {
                                                                      backgroundColor: activeGame
                                                                          ? activeGame.info.shirt2_color !==
                                                                              '000000'
                                                                              ? '#' + activeGame.info.shirt2_color
                                                                              : 'rgb(165, 28, 210)'
                                                                          : '',
                                                                      
                                                                      height: 8,
                                                                      borderTopRightRadius:8,
                                                                      borderBottomRightRadius:8,
                                                                  },activeGame.stats.aces&&activeGame.stats.aces.team1_value===0 &&{borderTopLeftRadius:8,
                                                                    borderBottomLeftRadius:8,}]}>
                                                                  
                                                              </View>
                                                              </View>
                                                            
                                                          </View>
                                                          
                                                      </View>
                                                      <View style={[statsStyles.stContainer]}>
                                                          <View style={[statsStyles.stBlock]}>
                                                             <View style={{marginTop:10,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                                             <View style={[statsStyles.value]}>
                                                                  <Text>
                                                                      {activeGame
                                                                          ? activeGame.stats.yellow_card
                                                                              ? activeGame.stats.yellow_card
                                                                                  .team1_value
                                                                              : '-'
                                                                          : '-'}
                                                                  </Text>
                                                              </View>
                                                              <View style={[statsStyles.stType]}>
                                                                  <Text>Double Fault</Text>
                                                              </View>
                                                              <View style={[statsStyles.value]}>
                                                                  <Text>
                                                                      {activeGame
                                                                          ? activeGame.stats.double_fault
                                                                              ? activeGame.stats.double_fault
                                                                                  .team2_value
                                                                              : '-'
                                                                          : '-'}
                                                                  </Text>
                                                              </View>
                                                             </View>
                                                              <View style={statsStyles.statsContainer}>         
                                                              <View
                                                                  style={[{width:
                                                                      activeGame
                                                                          ? activeGame.stats.double_fault
                                                                              ?Math.round(
                                                                                  (activeGame.stats.double_fault.team1_value /
                                                                                      (activeGame.stats.double_fault.team2_value +
                                                                                          activeGame.stats.double_fault.team1_value)) *
                                                                                  100,
                                                                              )+ '%'
                                                                              : '50%'
                                                                          : '50%'
                                                                        }, {
                                                                      backgroundColor: activeGame
                                                                          ? activeGame.info.shirt1_color !==
                                                                              '000000'
                                                                              ? '#' + activeGame.info.shirt1_color
                                                                              : 'rgb(59, 189, 189)'
                                                                          : '',
                                                                      
                                                                      height: 8,
                                                                      borderTopLeftRadius:8,
                                                                      borderBottomLeftRadius:8,
                                                                  },activeGame.stats.double_fault&&activeGame.stats.double_fault.team2_value===0 &&{borderTopRightRadius:8,
                                                                    borderBottomRightRadius:8,}]}>
                                                                  
                                                              </View>
                                                              <View
                                                                  style={[{width:
                                                                      activeGame
                                                                          ? activeGame.stats.double_fault
                                                                              ?Math.round(
                                                                                  (activeGame.stats.double_fault.team2_value /
                                                                                      (activeGame.stats.double_fault.team2_value +
                                                                                          activeGame.stats.double_fault.team1_value)) *
                                                                                  100,
                                                                              )+ '%'
                                                                              : '50%'
                                                                          : '50%'
                                                                        }, {
                                                                      backgroundColor: activeGame
                                                                          ? activeGame.info.shirt2_color !==
                                                                              '000000'
                                                                              ? '#' + activeGame.info.shirt2_color
                                                                              : 'rgb(165, 28, 210)'
                                                                          : '',
                                                                      
                                                                      height: 8,
                                                                      borderTopRightRadius:8,
                                                                      borderBottomRightRadius:8,
                                                                  },activeGame.stats.double_fault&&activeGame.stats.double_fault.team1_value===0 &&{borderTopLeftRadius:8,
                                                                    borderBottomLeftRadius:8,}]}>
                                                                  
                                                              </View>
                                                              </View>
                                                            
                                                          </View>
                                                          
                                                      </View>
                                                      </>
                                                  ) : null}
                                              </View>
                                          </View>
                                      </View>
                                  </View>
                              </View>
                                }
                                </Tab>
                                <Tab  heading={ <TabHeading style={{backgroundColor:'#eee'}}><Text>Events</Text></TabHeading>}>

                                
                                </Tab>
                              </Tabs>}
                                </>:
                              <ImageBackground source={{uri:void 0 !==this.banner_image[activeSport.id]?this.banner_image[activeSport.id]:'https://static.betconstruct.me/assets/addon/sportsbook/images/stats-banner-default-bg.jpg'}} style={viewStyles.gameInfo}>
                                <View style={{flex:1,width:'100%',backgroundColor:'rgba(0,0,0,.4)',padding:30}}>
                                <View style={{flex:1}}>
                                <View style={[viewStyles.gameInfoChild,viewStyles.gameInfoGameDateTime]}>
                                  <View style={viewStyles.gameInfoGameDateTimeChild}><Text style={viewStyles.gameInfoGameDateTimeChildText}>{activeGame ? moment.unix(activeGame.start_ts).format('dddd, D MMMM YYYY') : null}</Text></View>
                                  <View style={viewStyles.gameInfoGameDateTimeChild}><Text style={viewStyles.gameInfoGameDateTimeChildText}>{activeGame ? moment.unix(activeGame.start_ts).format('H:mm') : null}</Text></View>
                                </View>
                                <View style={[viewStyles.gameInfoChild,viewStyles.gameInfoLastChild,viewStyles.gameInfoGameTeamscompetition]}>
                                  <View style={viewStyles.gameInfoGameTeamscompetitionChild}>
                                  <View><Text style={viewStyles.gameInfoGameTeamscompetitionTeams}>{activeGame ? activeGame.team1_name : null}</Text></View>
                                  <View><Text style={viewStyles.gameInfoGameTeamscompetitionTeamsvs}>{activeGame ? activeGame.team2_name ? "vs" : '' : null}</Text></View>
                                  <View><Text style={viewStyles.gameInfoGameTeamscompetitionTeams}>{activeGame ? activeGame.team2_name : null}</Text></View>
                                </View>
                              </View>
                                </View>
                                </View>
                              </ImageBackground>
                              }

                <View style={{flex:1}}>
                  {activeGame &&activeGame.type ===1 ? (
                    <View style={viewStyles.sbGameMarketsGameInfo}>
                      <CustomIcon name="info-outline" size={15} />
                      <View style={viewStyles.gameInfoText}>
                        <Text>
                          {activeGame && activeGame.text_info}
                          { activeGame && activeGame.add_info_name
                            ? ' | ' + activeGame.add_info_name
                            : ''}
                        </Text>
                      </View>
                    </View>
                  ) : null}

                    <ScrollView
                      horizontal={true}
                      style={[
                        viewStyles.eventsNav,
                        viewStyles.mobileMarketscrollArea,
                      ]}>
                      <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} onPress={() => { LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);activeNav !== 0 && this.sortByGroups(0) }}>
                      <View
                        {...{
                          style: [
                            viewStyles.eventsNavItem,
                            activeNav === 0 && viewStyles.eventsNavItemActive,
                          ]
                        }}>
                        <View style={[viewStyles.activeMarketType,activeNav===0 &&viewStyles.activeMarketTypeActive]}/>
                        <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center'}}><Text style={viewStyles.marketTypeName}>All</Text></View>
                      </View>
                      </TouchableNativeFeedback>
                      {marketGroups.map((group, id) => {
                        return (
                          <TouchableNativeFeedback key={group.id}background={TouchableNativeFeedback.SelectableBackground()} onPress={() => { LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);activeNav !== group.id && this.sortByGroups(group.id) }}>
                          <View
                            
                            {...{
                              style: [
                                viewStyles.eventsNavItem,
                                activeNav === group.id && viewStyles.eventsNavItemActive,
                              ]
                            }}>
                            <View style={[viewStyles.activeMarketType,activeNav===group.id &&viewStyles.activeMarketTypeActive]}/>
                            <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center'}}><Text style={viewStyles.marketTypeName}>
                              {group.name}
                            </Text>
                            </View>
                          </View>
                          </TouchableNativeFeedback>
                        );
                      })}
                    </ScrollView>

                    <FlatList
                      data={marketDataArr}
                      renderItem={this._renderItem}
                      contentContainerStyle={{paddingBottom:90}}
                      keyExtractor={(item,index)=>item.data[0].id + '' + index}
                      ListFooterComponent={() => (
                        <View style={viewStyles.sbIndicatorMessage}>
                          <Text style={viewStyles.sbIndicatorMessageView}>
                            The time display shown within live betting serves as
                            an indicator. The company takes no responsibility
                            for the correctness and currentness of the displayed
                            information like score or time.
                          </Text>
                        </View>
                      )}
                      ListEmptyComponent={() => (
                        <View style={viewStyles.sbIndicatorMessage}>
                          <View style={{flexDirection:'row'}}>
                            <CustomIcon name="lock" size={20} />
                            <Text style={viewStyles.sbIndicatorMessageView}>
                              We are not acceptting bets at the moment
                            </Text>
                          </View>
                        </View>
                      )}
                      removeClippedSubviews={true}
                      initialNumToRender={7}
                    />
                  </View>
              </>
           
          </View>
        </View>}
        </Content>
      </Container>
      {isFocused&&<Controls navigate={this.props.navigation.navigate}/>}
      </View>
    );
  }
}
 const statsStyles={
  statsContainer:{flexDirection:'row',alignItems:'center',width:'100%',marginLeft:5,marginRight:5,borderRadius:8,borderWidth:1,borderColor:'#11c9e3'},
  stScheme: {
    padding: 10
  },
  stSchemeInner: {
    width: "100%",
    display: "flex",
  },
  stContainer: {
    flex: 1
  },
  stBlock: {
    alignItems: "center",
    justifyContent: "center"
  },
  stCircle: {
    position: "relative",
    width: "30%",
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 80
  },
  stCircleAfter: {
    position: "absolute",
    top: 8,
    bottom: 8,
    left: 8,
    right: 8,
    borderRadius: 200
  },
  stType: {
    marginT: 5,
    paddingLeft: 5,
    paddingRight: 5,
    fontSize: 10,
    flexDirection:'row',
    alignItems:'center',
    justifyContent: "center",
    width:'90%'
  },
  slice: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
    // clipPath: [{polygon:[50% 0, 100% 0, 100% 100%, 50% 100%]}];
  },
 }
export default withNavigationFocus(GameView)