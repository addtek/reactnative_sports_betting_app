import React,{PureComponent} from 'react'
// import { SportListLoader, SportsbookSportItemLoading } from '../../components/loader'
// import Sport from '../../containers/sports'
// import Popular from '../../components/popular'
import { allActionDucer } from '../../actionCreator'
import { SPORTSBOOK_ANY, RIDS_PUSH, LIVE_DATA, APPREADY } from '../../actionReducers'
import { stringReplacer,viewStyles,gridStyles } from '../../common'
import { SportsbookSportItem } from '../../components/stateless'
import { View, FlatList,ScrollView,Text,RefreshControl,LayoutAnimation, Switch, TouchableNativeFeedback,Dimensions } from 'react-native'
import { CompetitionLive } from '../../components/competitionLive';
import { withNavigationFocus } from 'react-navigation';
import { Map } from 'immutable'
import Dialog from "react-native-dialog";
import {Input, Item } from 'native-base'
import { SportsbookSportItemLoading, SportListLoader } from '../../components/loader'
import CustomIcon from '../../components/customIcon';
import Controls from '../../containers/controls'
 const {width}= Dimensions.get('window')
 class LiveInPlay extends PureComponent {
   constructor(props){
     super(props)
     this.state={
      activeID:null,
      subid:null,
      activeMarket:null,
      refreshing:!1,
      loadingInitialData:false,
      isQuickBet:this.props.sportsbook.isQuickBet,
      stake:0,
      showQuickBetDialog:false
     }
     this.flatListRef= null
     this.sportsListRef= null
     this.setQuickBetStake = this.setQuickBetStake.bind(this)
     this.handleSave = this.handleSave.bind(this)
     this.handleCancel = this.handleCancel.bind(this)
     this.reloadData= this.reloadData.bind(this)
     this.useQuickBet= this.useQuickBet.bind(this)
     this.setQuickBetAmount= this.setQuickBetAmount.bind(this)
     this.navigatetoMarket=this.navigatetoMarket.bind(this)
     this.scrollToIndex= this.scrollToIndex.bind(this)
     this._renderItem= this._renderItem.bind(this)
     this.setSelectedSport= this.setSelectedSport.bind(this)
     this.getTotalGames= this.getTotalGames.bind(this)
     this.rids = {...this.props.sportsbook.rids}
   }
   componentDidMount() {
    let { sessionData } = this.props.sportsbook
    this.props.dispatch(allActionDucer(APPREADY, { activeView: 'Live'}))
    this.props.dispatch(allActionDucer(LIVE_DATA, {loadSports: true}))
    if (undefined !== sessionData.sid && !this.state.loadingInitialData) {
        this.loadSportsList()
        this.setState({ loadingInitialData: true, view: 'Live'})
    }
  }
  componentDidUpdate() {
    let { sessionData,liveSportListSid,subscriptions } = this.props.sportsbook,{activeView}=this.props.appState,{data}= this.props.liveData,{subid}=this.state
      if (undefined !== sessionData.sid && !this.state.loadingInitialData && !data.sport) {
        this.props.dispatch(allActionDucer(APPREADY, { activeView: 'Live'}))
        this.props.dispatch(allActionDucer(LIVE_DATA, {loadSports: true, data: {} }))
        this.loadSportsList()
        this.setState({ loadingInitialData: true, view: 'Live'})
      }else if (undefined !== sessionData.sid && data.sport && activeView!=='Live'&&this.props.isFocused ){
        this.props.dispatch(allActionDucer(APPREADY, { activeView: 'Live'}))
        this.props.dispatch(allActionDucer(LIVE_DATA, {loadSports: true, data: {} }))
        this.loadSportsList()
        this.setState({ loadingInitialData: true})
      }
      if(!this.props.isFocused && this.state.loadingInitialData){
        if (subid !== null)
          if (subscriptions[subid]) {
            this.props.unsubscribe(subid)
            delete subscriptions[subid]
            this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, {subscriptions:subscriptions, liveSportListSid: null}))
            this.setState({ subid: null,loadingInitialData:false})
          }
      }

  }
  componentWillUnmount(){
    // this.props.bulkUnsubscribe([], true)
    this.props.dispatch(allActionDucer(APPREADY, { activeView: ''}))
    this.props.dispatch(allActionDucer(LIVE_DATA, {loadSports: true, data: {} }))
  }
  loadLiveGames(id) {
    this.props.dispatch(allActionDucer(LIVE_DATA, {loadSports:true}))
    this.rids[7].request = {
      command: "get",
      params: {
        source: "betting",
        what: { sport: ["id", "name", "alias","order"], region: ["id", "name", "alias", "order"], competition: ["id", "order", "name"], game: [["id", "start_ts", "team1_name", "team2_name", "type", "info", "markets_count", "is_blocked" ,"video_id", "video_id2", "video_id3", "video_provider", "last_event", "is_stat_available", "team1_external_id", "team2_external_id", "game_external_id", "is_live"]], market: [["id", "name", "type", "base", "express_id", "market_type", "order", "main_order"]], event: ["id", "price", "type", "name","base","order"] },
        where: { market:{"@or":[{"type":{"@in":["P1P2","P1XP2","MatchResult","MatchWinner","1X12X2","BothTeamsToScore","DrawNoBet","EvenOddTotal","MatchOddEvenTotal","MatchTotal","TotalGamesOver/Under","TotalofSets"]}},{"type":"AsianHandicap","main_order":{"@in":[1,2,3,4]}},{"type":"MatchHandicap","main_order":{"@in":[1,2,3,4]}},{"type":"OverUnder","main_order":{"@in":[1,2,3,4]}}]}, sport: { type: { "@ne": 1 } }, game: { type: { "@in": this.props.sportsbook.Live } } },
        subscribe: true
      }, rid: 7
    }

    if(id){
      this.rids[7].request.params.where.sport.id=id
    }
    let newRid = {}
    newRid[7]=this.rids[7]
    this.props.dispatch(allActionDucer(RIDS_PUSH,newRid))
    this.props.sendRequest(this.rids[7].request)
    // updateBrowserURL('view', 'eventview')
  }
  loadSportsList(){
    let d = {
      source: 'betting',
      what: {
        sport: ['id', 'name', 'alias', 'type', 'order'],game:"@count"
      },
      where: {
        game: {
          // "@limit": this.props.sportsbook.gameLimit
        }
      },
    };
    d.where.sport = {
      type: {
        '@ne': 1,
      },
    };
   d.where.game.type=1;
  let id = 'liveGamesSportList',newRid = {[id]:{id:id,request:{}}};
  newRid[id].rid = id;
  newRid[id].request = {
        command: 'get',
        params: {...d, subscribe: true},
        rid: id,
      };
    newRid[id].callback=this.handleSportList.bind(this)
    this.rids[id]=newRid[id]
    this.props.dispatch(allActionDucer(RIDS_PUSH, newRid));
    this.props.dispatch(allActionDucer(LIVE_DATA, {loadLiveNow:true}));
    this.props.sendRequest(newRid[id].request);
  }
  handleSportList(data){
    const subid = data.data.subid,rid= data.rid,
    dataN = data.data.data
    if(Object.keys(dataN.sport).length){
    let sportData=[]
    Object.keys(dataN.sport).forEach((i)=>{
      let dataD = dataN.sport[i]
      sportData.push(dataD)
    })
    sportData.sort((a, b) => {
      if (a.order > b.order)
        return 1
      if (b.order > a.order)
        return -1
      return 0
    })
    const { liveSportListSid,subscriptions } = this.props.sportsbook,{activeID}=this.state;
    let firtitem =null!==activeID? activeID: sportData[0]
    this.loadLiveGames(firtitem.id)
    if (liveSportListSid !== null && liveSportListSid !== undefined)
    if (subscriptions[liveSportListSid]) {
      this.props.unsubscribe(liveSportListSid)
      delete subscriptions[liveSportListSid]
    }
    this.setState({activeID:firtitem,subid: subid})
    subscriptions[subid] = { subid: subid, callback: (data) => this.props.handleSportUpdate(data,'liveData',LIVE_DATA, 'liveSportListData'), subStateVarName: 'liveSportListSid',request:this.rids[rid].request  }
    this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, {subscriptions:subscriptions, liveSportListSid: subid}))
    this.props.dispatch(allActionDucer(LIVE_DATA, { liveSportListData: data.data.data, loadLiveNow: false }))
    }else this.props.dispatch(allActionDucer(LIVE_DATA, {loadLiveNow: false }))
  }
  reloadData(){
    this.props.dispatch(allActionDucer(LIVE_DATA, { loadSports: true,refreshing: true}))
    this.loadSportsList()
   }
    setSelectedSport = (sport,i) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
      if(sport.hasOwnProperty('id')){
        this.loadLiveGames(sport.id)
      }
      this.setState({activeID:{...sport,itemIndex:i}})
      this.sportsListRef.scrollTo({animated: true, x: i*(80),y:0})
    }
    navigatetoMarket(data) {
      this.props.navigation.navigate('game_view', data);
    }
    getTotalGames = (region) => {
      var size = 0;
      for (let reg in region) {
        if (null !== region[reg]) {

          var competition = region[reg].competition;
          for (let compete in competition) {
            // console.log(competition[compete].game)
            if (null !== competition[compete]) {
              if (null !== competition[compete].game)
                size += Object.keys(competition[compete].game).length;
            }
          }
        }
      }
      return size > 0 ? size : '';
    }
     _renderItem({index,item,sport,activeMarket}){
      const {
        oddType
      } = this.props.sportsbook,{competitionRegion}=this.props.liveData,{activeView}=this.props.appState,{betSelections}=this.props.betslip,{addEventToSelection}=this.props
      return (<CompetitionLive activeMarket={activeMarket} competitionRegion={competitionRegion} navigatetoMarket={this.navigatetoMarket} scrollToIndex={this.scrollToIndex} cIndex={index} region={item.region} cProps={{region:item.region, sport:{ id: sport.id, name: sport.name, alias: sport.alias } ,activeView:activeView,
      competition:item,addEventToSelection:addEventToSelection, betSelections:betSelections, oddType:oddType}}/>)
    
     }
     sortByGroups(groupID) {
      this.setState({activeMarket: groupID});
    }
    scrollToIndex = (ind) => {
      this.flatListRef.scrollToIndex({animated: true, index: ind,viewPosition:0.1});
    }
    useQuickBet(value) {
      const {isQuickBet,quickBetStake}= this.props.liveData
      quickBetStake<=0&&this.setState({showQuickBetDialog:value})
      this.props.dispatch(allActionDucer(LIVE_DATA,{ isQuickBet: !isQuickBet }))
    }
    setQuickBetAmount() {
      const {isQuickBet}= this.props.liveData
      this.setState(prev=>({showQuickBetDialog:true}))
      !isQuickBet&& this.props.dispatch(allActionDucer(LIVE_DATA,{ isQuickBet: true }))
    }
    render(){
      const { data,refreshing,liveSportListData,quickBetStake,isQuickBet,loadSports,loadLiveNow} = this.props.liveData,{betSelections}=this.props.betslip,
     {activeID,showQuickBetDialog,activeMarket}=this.state,{isFocused}=this.props, pg = [], pc = [],betlen = null !== betSelections && undefined !== betSelections ? Object.keys(betSelections).length : 0
   let initialData = {}, spItems = [], sport = data ? data.sport : {}
   if(liveSportListData.hasOwnProperty('sport')){
     const sport  = liveSportListData.sport
    Object.keys(sport).forEach((sp) => {
      if (void 0 !== sport[sp] && null !== sport[sp])
        spItems.push({ id: sport[sp].id, name: sport[sp].name, alias: sport[sp].alias,order:sport[sp].order,game: !isNaN(sport[sp].game)?sport[sp].game:0 })
    })
   }
   spItems.sort((a, b) => {
    if (a.order > b.order)
      return 1
    if (b.order > a.order)
      return -1
    return 0
  })
   if (data.sport) {
     if (activeID !== null && void 0 !== activeID) {
       if (typeof activeID === 'object' && null !== activeID) {
         initialData = sport[activeID.id] ? sport[activeID.id] : {}
       } else {
         initialData = sport[activeID] ? sport[activeID] : {}
       }
     } else {
       initialData = sport[Object.keys(sport)[0]]
     }
   }
   let region = [],totalgames=0
   if (initialData.hasOwnProperty('id')) {
    totalgames =  this.getTotalGames(initialData.region)
   for (let regionid in initialData.region) {
     if (null !== initialData.region[regionid])
       region.push(initialData.region[regionid]);
   }
 }
 region.sort((a, b) => {
   if (a.order > b.order) {
     return 1;
   }
   if (b.order > a.order) {
     return -1;
   }
   return 0;
 });
 let  regionTotalGames = 0, competitionArr = [],marketGroups=[];
  region.map((reg,ind)=>{
    const thisReg = reg
    let competition = thisReg.competition
    for (let compete in competition) {
      if (null !== competition[compete]) {
        let sortableMarket=[], c_games = competition[compete].game||{}    
        regionTotalGames += Object.keys(c_games).length    
        Object.keys(c_games).forEach((eachGame)=>{
          let eachGameMarket = c_games[eachGame]?.market||{}
          sortableMarket=[]
          Object.keys(eachGameMarket).forEach((mm)=>{
            eachGameMarket[mm] && sortableMarket.push(eachGameMarket[mm])
          })
          sortableMarket.sort((a,b)=>a.order-b.order)
          sortableMarket.map(mm1=>
            {if (!marketGroups.includes(mm1.market_type)) {
              marketGroups.push(mm1.market_type)
            }}
            )
            if(competition[compete].game[eachGame])competition[compete].game[eachGame].market={...sortableMarket}
        })
        competitionArr.push({...competition[compete],region:{id:thisReg.id,name:thisReg.name,alias:thisReg.alias}})
      }
    }
  })
 competitionArr.sort((a, b) => {
   if (a.order > b.order)
     return 1
   if (b.order > a.order)
     return -1
   return 0
 })
  return (
   <ScrollView
         scrollEnabled={false}
        contentContainerStyle={{flex:1}}
        >
        <View>
        <ScrollView ref={(e)=>this.sportsListRef=e} horizontal={true} contentContainerStyle={{paddingHorizontal:0,paddingVertical:0,marginVertical:0,marginHorizontal:0,backgroundColor:'#026775',margin:0,padding:0}} showsHorizontalScrollIndicator={false}>
        {loadLiveNow?
        <SportsbookSportItemLoading/>
        : spItems.map((s,i)=>{
            return <SportsbookSportItem key={s.id} s={s} i={i} is_live={true} activeID={null !== activeID ? activeID.id : activeID} onClick={(s)=>{this.setSelectedSport(s,i)}} />
          })}
          </ScrollView>
            <View style= {[viewStyles.sportHeader,{height:35},viewStyles[stringReplacer(initialData.alias ? initialData.alias : '', [/\s/g, /'/g, /\d.+?\d/g, /\(.+?\)/g], ['', '', '', '']).toLowerCase()],{padding: 10,margin:0}]}>
              <View style={[viewStyles.sportTitle, gridStyles.colsm10]}><Text style={[viewStyles.textWhite,viewStyles.textShow]}>{initialData.hasOwnProperty('id') ? initialData.name : activeID === 'TC' ? 'Top Competitions' : activeID === 'TG' ? 'Top Games' : ''}</Text></View>
              <View style={[viewStyles.sportAccord, gridStyles.colsm2]}><Text style={[viewStyles.textWhite]}>{this.getTotalGames(initialData.region)}</Text></View>
            </View>
            <View style={{height:40,flexDirection:'row',padding:10,justifyContent:'space-between',backgroundColor: '#F2F1F1',}}>
              <View style={{flexDirection:'row',alignItems:'center'}}>
              <View style={{flexDirection:'row',alignItems:'center'}}>
                <Text style={{fontSize:14}}>use Quick Bet</Text>
              </View>
              <Switch value={isQuickBet} onValueChange={this.useQuickBet}/>
              </View>
              <View style={{width:90,alignItems:'center',flexDirection:'row',justifyContent:'flex-start'}}>
              <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} onPress={this.setQuickBetAmount}>
                <View style={{flex:1,flexDirection:'row',alignItems:'center',height:'100%',justifyContent:'center'}}>
                  <Text style={{fontSize:15}}>{quickBetStake} GHS</Text>
                </View>
              </TouchableNativeFeedback>
              </View>
            </View>
            {marketGroups.length>0&&<ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[
                {paddingHorizontal:5,height:40}
              ]}>
              {marketGroups.map((group, id) => {
                return (
                  <TouchableNativeFeedback key={id}background={TouchableNativeFeedback.SelectableBackground()} onPress={() => { LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);activeMarket !== group && this.sortByGroups(group) }}>
                  <View
                    
                    {...{
                      style: [
                        viewStyles.eventsNavItem2
                      ]
                    }}>
                    <View style={[viewStyles.activeMarketType2,(activeMarket === group||(id===0&&null===activeMarket)) &&viewStyles.activeMarketTypeActive]}/>
                    <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center'}}><Text style={viewStyles.marketTypeName}>
                      {stringReplacer(group, [/([a-z])([A-Z])/g, /\b(\w*Period\w*)\b/g], ['$1 $2', ''])}
                    </Text>
                    </View>
                  </View>
                  </TouchableNativeFeedback>
                );
              })}
            </ScrollView>}
            </View>
        {/* <View style={{flex:3}}> */}
          {
            loadSports?
            <FlatList
            data={[1,2,3,4,5]}
            keyExtractor={(item,index)=>index.toString()}
            renderItem={({item,index})=><SportListLoader key={index} index={index} isLive={true}/>}
            />
            :
            <FlatList
              ref = {(e)=>this.flatListRef=e}
              contentContainerStyle={{paddingBottom:90}}
              data={competitionArr}
              extraData={Map({activeID:activeID,activeMarket:activeMarket,isQuickBet:isQuickBet,betSelections:betSelections})}
              keyExtractor={(item)=>item.id.toString()}
              renderItem={({item,index})=>this._renderItem({item:item,index:index,sport:{ id: initialData.id, name: initialData.name, alias: initialData.alias },activeMarket:activeMarket})}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={this.reloadData} tintColor={'#018da0'} colors={['#018da0']}/>}
              removeClippedSubviews={true}
              initialNumToRender={5}
              ListEmptyComponent={() => (
                <View style={viewStyles.sbIndicatorMessage}>
                  <View style={{flexDirection:'row'}}>
                    <CustomIcon name="sb-sports-list" size={20} />
                    <Text style={viewStyles.sbIndicatorMessageView}>
                      No games are available at the moment
                    </Text>
                  </View>
                </View>
              )}
            />}
        {isFocused&&<Controls navigate={this.props.navigation.navigate}/>}
        {/* </View> */}
         <Dialog.Container visible={showQuickBetDialog} onBackdropPress={this.handleCancel}>
          <Dialog.Title>Quick Bet</Dialog.Title>
          <Item>
            <Input placeholder={'Stake Amount'}
              keyboardType={'decimal-pad'}
              onChangeText={text=>this.setQuickBetStake(text)} 
            />
          </Item>
          <Dialog.Button label="Cancel" onPress={this.handleCancel}/>
          <Dialog.Button label="Save"  onPress={this.handleSave}/>
        </Dialog.Container>
        </ScrollView>
  )
 }
 setQuickBetStake(amount){
   amount >0 &&this.setState({stake:amount})
 }
 handleSave(){
   const {stake}= this.state,{isQuickBet,quickBetStake}= this.props.liveData;
   if(isNaN(stake)){
    this.props.dispatch(allActionDucer(LIVE_DATA, {isQuickBet:false }))
   }else{
    if(stake>0) {
      this.props.dispatch(allActionDucer(LIVE_DATA, {quickBetStake:stake }))
     }
     else this.props.dispatch(allActionDucer(LIVE_DATA, {isQuickBet:false,quickBetStake:0 }))
   }
   this.setState({showQuickBetDialog:false,stake:0})
 }
 handleCancel(){
  const {quickBetStake,isQuickBet} = this.props.liveData,{stake}= this.state;
   (quickBetStake <= 0 ||(stake <= 0 && isQuickBet)) &&this.props.dispatch(allActionDucer(LIVE_DATA, {isQuickBet:false,quickBetStake:0 }));
   this.setState({showQuickBetDialog:false,stake:0})
 }
}
export default withNavigationFocus(LiveInPlay)
 