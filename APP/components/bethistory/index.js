import React, {PureComponent} from 'react'

import  moment from 'moment-timezone'
import {BetHistoryLoader} from '../../components/loader'
import DateTimePicker from '@react-native-community/datetimepicker'
import { allActionDucer } from '../../actionCreator'
import { SPORTSBOOK_ANY, RIDS_PUSH, BETSLIP, BETHISTORY, LOAD_BET_HISTORY } from '../../actionReducers'
import  CashoutDialog  from '../../components/cashoutdialog'
import { View, Text, TextInput, TouchableOpacity,TouchableNativeFeedback, LayoutAnimation, FlatList, Modal} from 'react-native'
import { Item, Picker, Icon,Label,Tab, Tabs, TabHeading } from 'native-base'
import CustomIcon from '../customIcon'
import Controls from '../../containers/controls'
import { viewStyles, stringReplacer, dataStorage } from '../../common'
import { withNavigationFocus } from 'react-navigation'
class BetHistory extends PureComponent {
    constructor(props) {
      super(props)
      this.state = {
        openedBet: null,
        loadingInitialData:false,
        showCashoutDailog:false,
        reloadHistory:false,
        openCashout: false,
        cashingOut: null,
        showFilterInputs:true,
        outcome: -1,
        tabView:1,
        bet_type: -1,
        bet_id: '',
        period: 24,
        periodType: 1,
        datepickerF: moment().toDate(),
        datepickerT: moment().toDate(),
        activeBets:[],
        opened_bet:null,
        showDatePickerT:false,
        showDatePickerF:false
      }
      this.upcomingGamesPeriods = [1, 2, 3, 6, 12, 24, 48, 72]
      this.betState = { 0: "Unsettled", 1: "Lost", 2: "Returned", 3: "Won", 5: "Cashed out" }
      this.betStateIconName = { 0: {name:"unsettled1",color:'#333'}, 1: {name:"lost",color:'#f24436'}, 2: {name:"returned",color:'#f24436'}, 3: {name:"win",color:'#299e77'}, 5: {name:"cashout",color:'#299e77'} }
      this.betType = { 1: "Single", 2: "Multiple", 3: "System", 4: "Chain" }
      this.openSelection = this.openSelection.bind(this)
      this.searchBetHistoryResult = this.searchBetHistoryResult.bind(this)
      this.searchBetHistoryResultOpen = this.searchBetHistoryResultOpen.bind(this)
      this.getBetHistory = this.getBetHistory.bind(this)
      this.onDateChangeF = this.onDateChangeF.bind(this)
      this.onDateChangeT = this.onDateChangeT.bind(this)
      this.cancelAutoCashOutRule = this.cancelAutoCashOutRule.bind(this)
      this.doCashout = this.doCashout.bind(this)
      this.getBetAutoCashout = this.getBetAutoCashout.bind(this)
      this.createAutoCashOutRule = this.createAutoCashOutRule.bind(this)
      this.backToMenuModal = this.backToMenuModal.bind(this)
      this.showFilter = this.showFilter.bind(this)
      this.showDatePickerT = this.showDatePickerT.bind(this)
      this.showDatePickerF = this.showDatePickerF.bind(this)
      this.onChangeTab = this.onChangeTab.bind(this)
      this._renderItem = this._renderItem.bind(this)
      this._renderSelectionItem = this._renderSelectionItem.bind(this)
       this.rids = this.props.sportsbook.rids
       this.livePreviewSwiper=null
    }
    componentDidMount() {
      const{sessionData}=this.props.sportsbook
      if (undefined !== sessionData.sid && !this.state.loadingInitialData) {
        this.getBetHistoryOpen()
        this.getBetHistory()
        this.setState({ loadingInitialData: true})  
      }
    }
    componentDidUpdate() {
      const{sessionData}=this.props.sportsbook,{bets_history,openBetHistory}=this.props.betHistoryData
      if (undefined !== sessionData.sid && !this.state.loadingInitialData && (void 0 ===bets_history.bets||void 0 ===openBetHistory.bets)) {
        this.getBetHistoryOpen()
        this.getBetHistory()
        this.setState({ loadingInitialData: true})  
      }  
       if(this.state.reloadHistory) {
        const { datepickerF, datepickerT, bet_id, outcome,bet_type,period,periodType} = this.state;
        let p={ from_date: periodType?(moment().unix() - 3600 * period): moment(datepickerF).startOf('day').unix(), to_date: periodType?moment().unix():moment(datepickerT).endOf('day').unix()};
        if(null !==bet_id && bet_id.length>0 )p.bet_id =bet_id;
         if(outcome!=='-1')p.outcome=outcome;
          if(bet_type!=='-1')p.bet_type = bet_type;
        this.getBetHistory(p);
       }
    }
    onChangeTab(){
      this.setState({ tabView: this.state.tabView===1?2:1 })
    }
   backToMenuModal() {
        this.setState({opened_bet:null,activeBets:[]})
      }
    reloadHistory() {
      this.setState({ reloadHistory: !0 })
    }
    attemptCashout(bet = null) {
      this.setState(prevState => ({ showCashoutDailog: !prevState.showCashoutDailog, cashable_bet: bet }))
    }
    getBetHistory(where = null) {
      this.setState({ reloadHistory: !1 })
      this.props.dispatch(allActionDucer(LOAD_BET_HISTORY,{ loadingHistory: true }))
      this.rids[14].request = {
        command: "bet_history",
        params: {
          where: {
            from_date: moment().unix() - 3600 * 24,
            to_date: moment().unix(),
          }
        }, rid: 14
      }
      if (null !== where) {
        this.rids[14].request.params.where = where
      }
      let newRid = {}
      newRid[14]=this.rids[14]
      this.props.dispatch(allActionDucer(RIDS_PUSH,newRid))
      this.props.sendRequest(this.rids[14].request)
      
    }
    getBetHistoryOpen(where = null) {
      this.setState({ reloadOpenHistory: !1 })
      this.props.dispatch(allActionDucer(LOAD_BET_HISTORY,{ loadingOpenHistory: true }))
      this.rids['14.5'].request = {
        command: "bet_history",
        params: {
          where: {
            from_date: moment().unix() - 3600 * 24,
            to_date: moment().unix(),
            outcome:0,
          }
        }, rid: '14.5'
      }
      if (null !== where) {
        this.rids['14.5'].request.params.where = where
      }
      let newRid = {}
      newRid['14.5']=this.rids['14.5']
      this.props.dispatch(allActionDucer(RIDS_PUSH,newRid))
      this.props.sendRequest(this.rids['14.5'].request)
    }
    onDateChangeF(e,value) {
      if(e.type==='set'){
        let val = value, mDate = moment(val), datepickerT = this.state.datepickerT?this.state.datepickerT:moment().format('YYYY-MM-DD')
      if (moment(moment(val).format('YYYY-MM-DD')).isAfter(moment(datepickerT).format('YYYY-MM-DD')) || mDate.diff(moment(datepickerT), 'days') < 0 || mDate.diff(moment(datepickerT), 'days') > 30) {
        var incrDate = moment(val).add(1, 'days')
        if (moment(moment(incrDate).format('YYYY-MM-DD')).isAfter(moment(val).endOf('month').format('YYYY-MM-DD')))
          incrDate = moment(val).endOf('month')
        datepickerT = incrDate.toDate()
      }
      this.setState({datepickerF: val, datepickerT: datepickerT,showDatePickerF:!this.state.showDatePickerF,periodType:0})
      }
      else this.setState({showDatePickerF:!this.state.showDatePickerF})
      
     
    }
    showDatePickerF() {
      this.setState({showDatePickerF:!this.state.showDatePickerF})
    }
    showDatePickerT() {
      this.setState({showDatePickerT:!this.state.showDatePickerT})
    }
    onDateChangeT(e,value) {
      if(e.type==='set'){
        let  val = value, mDate = moment(val), datepickerF = this.state.datepickerF?this.state.datepickerF:moment().format('YYYY-MM-DD')
      if (moment(moment(val).format('YYYY-MM-DD')).isAfter(moment(val).format('YYYY-MM-DD')) || mDate.diff(moment(datepickerF), 'days') > 30 || mDate.diff(moment(datepickerF), 'days') < 0) {
        var decrDate = moment(val).subtract(1, 'days')
        if (moment(moment(decrDate).format('YYYY-MM-DD')).isBefore(moment(datepickerF).startOf('month').format('YYYY-MM-DD')))
          decrDate = moment(datepickerF).startOf('month')
        datepickerF = decrDate.toDate()
      }
      this.setState({datepickerT: val, datepickerF: datepickerF,showDatePickerT:!this.state.showDatePickerT,periodType:0})
      }
      else this.setState({showDatePickerT:!this.state.showDatePickerT})
      
    }
    searchBetHistoryResult() {
      const { datepickerF, datepickerT, bet_id, outcome, bet_type, period, periodType,tabView } = this.state;
      let p = { from_date: periodType ? (moment().unix() - 3600 * period) : moment(datepickerF).startOf('day').unix(), to_date: periodType ? moment().unix() : moment(datepickerT).endOf('day').unix() };
      if (null !== bet_id && bet_id.length > 0) p.bet_id = bet_id;
      if (outcome !== -1) p.outcome = outcome;
      if (bet_type !== -1) p.bet_type = bet_type;
      this.getBetHistory(p);
      this.setState({showFilterInputs:!this.state.showFilterInputs})
    }
    searchBetHistoryResultOpen() {
      const { datepickerF, datepickerT, bet_id, outcome, bet_type, period, periodType,tabView } = this.state;
      let p = { from_date: periodType ? (moment().unix() - 3600 * period) : moment(datepickerF).startOf('day').unix(), to_date: periodType ? moment().unix() : moment(datepickerT).endOf('day').unix() };
      if (null !== bet_id && bet_id.length > 0) p.bet_id = bet_id;
      p.outcome=0;
      if (bet_type !== -1) p.bet_type = bet_type;
      this.getBetHistoryOpen(p);
      this.setState({showFilterInputs:!this.state.showFilterInputs})
    }
    openSelection(id,sele) {
       let bet= {...id}
       delete bet.events
       this.setState({ opened_bet: bet,activeBets:sele })
    }
    showCashoutPanel(data) {
      data && this.setState({ openCashout: true, cashingOut: data })
    }
    setBetID(text) {
      this.setState({ bet_id: text })
    }
    setBetType(val) {
      this.setState({ bet_type: val })
    }
    setOutcome(val) {
      this.setState({ outcome: val })
    }
    setPeriod(val) {
      this.setState({periodType: 1, period: val })
    }
    clearDateRange(id){
      // $("#"+id).datepicker('setDate', null);
      //   id = id.substr(0, id.length-1)
      //   var obj={periodType: 1} 
      //  obj[id]='' 
      //  this.setState(obj)
    }
    doCashout(data, callback) {
      let ridStart = parseInt(Object.keys(this.rids)[Object.keys(this.rids).length - 1]) + 1
      this.rids[ridStart] = {
        rid: ridStart, callback: (d) => { callback(d, this.reloadHistory.bind(this)) }, id: data.id, request: {
          command: "cashout",
          params: {
            bet_id: data.id,
            price: data.cash_out,
            mode: data.incaseAmountChange
          }, rid: ridStart
        }
      }
      "partial" === data.auto && (this.rids[ridStart].request.params.partial_price = data.partial_amount)
      let newRid = {}
      newRid[ridStart]=this.rids[ridStart]
      this.props.dispatch(allActionDucer(RIDS_PUSH,newRid))
      this.props.sendRequest(this.rids[ridStart].request)
    }
    getBetAutoCashout(data, callback) {
  
      let ridStart = parseInt(Object.keys(this.rids)[Object.keys(this.rids).length - 1]) + 1
      this.rids[ridStart] = {
        rid: ridStart, callback: (d) => { callback(d) }, id: data.id, request: {
          command: "get_bet_auto_cashout",
          params: {
            bet_id: data.id
          }, rid: ridStart
        }
      }
      let newRid = {}
      newRid[ridStart]=this.rids[ridStart]
      this.props.dispatch(allActionDucer(RIDS_PUSH,newRid))
      this.props.sendRequest(this.rids[ridStart].request)
    }
    createAutoCashOutRule(data, callback) {
      let ridStart = parseInt(Object.keys(this.rids)[Object.keys(this.rids).length - 1]) + 1
      this.rids[ridStart] = {
        rid: ridStart, callback: (d) => { callback(d) }, id: data.id, request: {
          command: "set_bet_auto_cashout",
          params: {
            bet_id: data.id,
            min_amount: data.valueReaches
          }, rid: ridStart
        }
      }
      "partial" === data.auto && (this.rids[ridStart].request.params.partial_amount = data.partial_amount);
      let newRid = {}
      newRid[ridStart]=this.rids[ridStart]
      this.props.dispatch(allActionDucer(RIDS_PUSH,newRid))
      this.props.sendRequest(this.rids[ridStart].request)
    }
    cancelAutoCashOutRule(data, callback) {
      let ridStart = parseInt(Object.keys(this.rids)[Object.keys(this.rids).length - 1]) + 1
      this.rids[ridStart] = {
        rid: ridStart, callback: (d) => { callback(d) }, id: data.id, request: {
          command: "cancel_bet_auto_cashout",
          params: {
            bet_id: data.id
          }, rid: ridStart
        }
      }
      let newRid = {}
      newRid[ridStart]=this.rids[ridStart]
      this.props.dispatch(allActionDucer(RIDS_PUSH,newRid))
      this.props.sendRequest(this.rids[ridStart].request)
    }
    showFilter(){
      LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
      this.setState(prevState=>({showFilterInputs: !prevState.showFilterInputs}))
    }
    handleRebetData(data){
       let Ddata= data.data.data
      if(Ddata!==null && Ddata.hasOwnProperty('sport')){
        let {
          selectionSub
          } = this.props.sportsbook,dispatch=this.props.dispatch,betSelectionsClone = {}, spData = Ddata.sport, stateData = {}, betSlen= 0,conflicts = []

        Object.keys(spData).forEach((sp)=>{
          let eachSport = spData[sp],sportdata={id:eachSport.id,name:eachSport.name,alias:eachSport.alias},spCompetition= eachSport.competition
          Object.keys(spCompetition).forEach((c)=>{
            let eachCompetition=spCompetition[c],competition={id:eachCompetition.id,name:eachCompetition.name},games=eachCompetition.game
            Object.keys(games).forEach((g)=>{
              let eachGame=games[g],game={id:eachGame.id,team1_name:eachGame.team1_name,team2_name:eachGame.team2_name,is_started:eachGame.is_started,start_ts:eachGame.start_ts},gameMarket=eachGame.market
              Object.keys(gameMarket).forEach((gm)=>{
                let eachMarket=gameMarket[gm],market={id:eachMarket.id, name:eachMarket.name, type:eachMarket.type, express_id:eachMarket.express_id, base:eachMarket.base, display_key:eachMarket.display_key, cashout:eachMarket.cashout},marketEvent=eachMarket.event
                Object.keys(marketEvent).forEach((me)=>{
                  let eachEvent=marketEvent[me],event={id:eachEvent.id, name:eachEvent.name, price:eachEvent.price, base:eachEvent.base}
                      betSelectionsClone[market.id] = {
                        order: betSlen + 1, banker: false, betterPrice: 15, blocked: false, conflicts: conflicts, deleted: false,
                        displayKey: market.display_key, eachWay: false, eventBases: null, eventId: event.id, ewAllowed: false, expMinLen: 1, gameId: game.id, suspended: 0,
                        gamePointer: { game: game.id, competition: competition, type: "0", region: null, sport: sportdata, isLive: game.is_started }, hasCashout: market.cashout, incInSysCalc: true, isLive: game.is_started,
                        marketId: market.id, marketName: market.name, marketType: market.type,expressID:void 0!==market.express_id?market.express_id:1, oddType: "odd", pick: event.name, price: event.price, priceChange: null, priceInitial: event.price, processing: false,
                        singlePosWin: betSelectionsClone[market.id] && betSelectionsClone[market.id].singleStake !== "" ? event.price * betSelectionsClone[market.id].singleStake : 0, singleStake: "", start_ts: game.start_ts, team1Name: game.team1_name, flag: 0
                      };
                      betSelectionsClone[market.id].title = game.team1_name + `${game.team2_name ? ' - ' + game.team2_name : ''}`;
                      if (game.team2_name) betSelectionsClone[market.id].team2Name = game.team2_name;
                      if (market.base) betSelectionsClone[market.id].marketBase = event.base
                })
              })
            })
          })
        })
        betSlen = Object.keys(betSelectionsClone).length
          if(betSlen > 1) 
            stateData.betMode = 2
          else if (betSlen < 1)stateData.betStake = 0;else stateData.betMode = 1
    
          if (selectionSub) {
            this.props.unsubscribe(selectionSub)
            dispatch(allActionDucer(SPORTSBOOK_ANY, {selectionSub:null}))
          }
          stateData.betSelections = betSelectionsClone
          stateData.isBetSlipOpen = true
          dispatch(allActionDucer(BETSLIP, stateData))
          dataStorage('betSlip', betSelectionsClone)
          betSlen > 0 && this.props.subscribeToSelection(betSelectionsClone);
          this.props.getBetslipFreebets()
      }
    }
    rebet(id,selections){
      let opts = { gameIDs: [], eventIDs: [], marketIDs: [] }
      for (const sel in selections) {
        opts.gameIDs.push(selections[sel].game_id)
          opts.eventIDs.push(selections[sel].selection_id)
          opts.marketIDs.push(selections[sel].market_name)
      }

      let newRid = {[id]:{request:null,rid:null,callback:null}}
      newRid[id].rid=id
      newRid[id].callback=this.handleRebetData.bind(this)
      newRid[id].request= {
        command: "get",
        params: {
          source: "betting",
          what: { sport:["id","name","alias"],competition:["id","name"],game:["id","team1_name","team2_name","is_started","start_ts"],market:["id","name","type","express_id","base","display_key","cashout"],event: ["id","name","price","base"] },
          where: {
            game: {
              id: { "@in": opts.gameIDs }
            },
            market: { name: { "@in": opts.marketIDs } },
            event: { id: { "@in": opts.eventIDs } }
          }
        }, rid: id
      }

      this.props.dispatch(allActionDucer(RIDS_PUSH,newRid))
      this.props.sendRequest(newRid[id].request)
    }
    _renderItem({item,index}){
      const {config}= this.props.sportsbook,selections = []
      Object.keys(item.events).forEach((evt) => {
       selections.push(item.events[evt])
     })
       return(
         <TouchableNativeFeedback useForeground={TouchableNativeFeedback.canUseNativeForeground()} onPress={()=>this.openSelection(item,selections)}>
         <View style={{flex:1,marginTop:2,marginBottom:2,backgroundColor:index%2===0?'#f1f1f1':'#e8e8ec'}}>
           <View style={{flex:1,marginTop:5,marginBottom:5,marginLeft:15,marginRight:15,borderBottomColor:'#026775',borderBottomWidth:1}}>
             <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
               <View style={{flexDirection:'row',alignItems:'center'}}><CustomIcon name={this.betType[item.type].toLowerCase()} size={20}/><View style={{marginLeft:5}}><Text>{this.betType[item.type]}</Text></View></View>
               <View style={{flexDirection:'row',alignItems:'center'}}><CustomIcon name={this.betStateIconName[item.outcome].name} color={this.betStateIconName[item.outcome].color} size={20}/><View style={{marginLeft:10}}><Text>{this.betState[item.outcome]}</Text></View></View>
             </View>
             <View>
               <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}><View><Text>ID</Text></View><View><Text>{item.id}</Text></View></View>
               <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}><View><Text>Date</Text></View><View><Text>{moment.unix(item.date_time).format('ddd, D MMM YYYY')}</Text></View></View>
             </View>
           </View >
           <View style={[{flex:1,marginTop:5,marginBottom:5,marginLeft:15,marginRight:15},(item.outcome === 0 ||item.payout > 0)&&{borderBottomColor:'#026775',borderBottomWidth:1}]}>
               <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}><View><Text>Stake</Text></View><View><Text>{item.amount}  {config.currency}</Text></View></View>
               <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}><View><Text>Odd</Text></View><View><Text>{item.k}</Text></View></View>
           </View>
          {(item.outcome === 0 ||item.payout > 0) && <View style={{flex:1,marginTop:5,marginBottom:5,marginLeft:15,marginRight:15}}>
          <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}><View><Text>{item.outcome===0?'Possible Win: ':'Win: '}</Text></View><View><Text>{item.payout > 0 ? item.payout :item.possible_win}  {config.currency}</Text></View></View></View>}
           {item.hasOwnProperty('cash_out') &&<View style={{flex:1,marginTop:5,marginBottom:5,marginLeft:15,marginRight:15}}><TouchableNativeFeedback useForeground={TouchableNativeFeedback.canUseNativeForeground()} onPress={() =>  this.attemptCashout(item)}>
             <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'space-between',backgroundColor:'#299e77',paddingTop:5,paddingBottom:5}}>
               <View><Text style={viewStyles.textWhite}> Cashout</Text></View><View><Text style={[{ paddingLeft: 5,paddingRight:5, marginRight: 5 },viewStyles.textWhite]}>{item.cash_out} {config.currency}</Text></View> 
           </View></TouchableNativeFeedback></View>}
         </View>
         </TouchableNativeFeedback>
       )
     }
    _renderSelectionItem({item,index}){
       return(
        //  <TouchableNativeFeedback useForeground={TouchableNativeFeedback.canUseNativeForeground()} onPress={()=>this.openSelection(item,selections)}>
         <View style={{flex:1,backgroundColor:index%2===0?'#f1f1f1':'#e8e8ec'}}>
           <View style={{flex:1,marginTop:5,marginBottom:5,marginLeft:15,marginRight:15}}>
             <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
               <View style={{flexDirection:'row',alignItems:'center',flex:1}}><View style={{flex:1}}><Text ellipsizeMode="tail" numberOfLines={1}>{item.game_name}</Text></View></View>
               <View style={{flexDirection:'row',alignItems:'center'}}><CustomIcon name={this.betStateIconName[item.outcome].name} color={this.betStateIconName[item.outcome].color} size={15}/><View style={{marginLeft:5}}><Text ellipsizeMode="tail" numberOfLines={1}>{this.betState[item.outcome]}</Text></View></View>
             </View>
             <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
               <View style={{flexDirection:'row',alignItems:'center'}}><View><Text ellipsizeMode="tail" numberOfLines={1}>{item.match_info}</Text></View></View>
               <View style={{flexDirection:'row',alignItems:'center'}}><View><Text>{moment.unix(item.game_start_date).format('ddd, D MMM YYYY H:mm')}</Text></View></View>
             </View>
             <View>
          <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}><View style={{flexDirection:'row',alignItems:'center'}}><CustomIcon name={stringReplacer(item.sport_name==='Football'?'Soccer':item.sport_name, [/\s/g, /\d.+?\d/g, /\(.+?\)/g], ['', '', ''])} size={15}/><View style={{marginLeft:5}}><Text>{item.competition_name}</Text></View></View></View>
             </View>
           </View >
           <View style={[{flex:1,marginTop:5,marginBottom:5,marginLeft:15,marginRight:15}]}>
               <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}><View><Text>{item.market_name}</Text></View><View><Text></Text></View></View>
              <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}><View><Text>Pick: {item.event_name}</Text></View><View><Text>Odd: {item.coeficient}</Text></View></View>
           </View>
         </View>
        //  </TouchableNativeFeedback>
       )
     }
    hasLostSelection(selection){
      let canRebet=false
      for (const key in selection) {
        if (selection[key].outcome===1) {
          canRebet= true

        }
      }
      return canRebet
    }
    render() {
      const  {config} = this.props.sportsbook,{bets_history,loadingHistory,openBetHistory,loadingOpenHistory, reloadOpenHistory}=this.props.betHistoryData,isBetSlipOpen=this.props.isBetSlipOpen,{cashable_bet, outcome, bet_type, bet_id,datepickerF,datepickerT,showCashoutDailog,showDatePickerT,showDatePickerF,showFilterInputs,activeBets,opened_bet }= this.state,{isFocused}=this.props
      let  bets = [],openbets=[]

      if (bets_history.bets) {
        Object.keys(bets_history.bets).forEach((key) => {
            bets.push(bets_history.bets[key])
        })
      }
      if (openBetHistory.bets) {
        Object.keys(openBetHistory.bets).forEach((key) => {
            openbets.push(openBetHistory.bets[key])
        })
      }
      return (

            <View style={{flex:1}}>
             {cashable_bet&& <CashoutDialog 
                  onCancelRule={this.cancelAutoCashOutRule}
                  onCashout={this.doCashout}
                  showCashoutDailog={showCashoutDailog}
                  cashable_bet={cashable_bet}
                  onGetCashoutRule={this.getBetAutoCashout}
                  onAttemptCashout={this.attemptCashout.bind(this)}
                  onSetAutoCashout={this.createAutoCashOutRule}
                  onUserInteraction={this.closeBetHistory}
                  config={config} /> }
              <Modal
               visible={null!==opened_bet}
               animationType="slide" 
               transparent={true} 
               onRequestClose={this.backToMenuModal}
              >
              <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.5)'}}>
              <View style={{height:60,width:'100%',flexDirection:'row',alignItems:'center',justifyContent:'flex-end',paddingRight:10}}>
                <TouchableOpacity onPress={this.backToMenuModal}>
                  <CustomIcon name="close" color="#fff" size={15}/>
                </TouchableOpacity>
              </View>
              <View style={{flex:1,borderTopLeftRadius:30,borderTopRightRadius:30,backgroundColor:'#e8e8ec'}}>
                {
                  null!== opened_bet &&
                  <View style={{flex:1}}>
                    <FlatList
                      data={activeBets}
                      keyExtractor={(item,index)=>index.toString()}
                      renderItem={this._renderSelectionItem}
                      ItemSeparatorComponent={()=><View style={{backgroundColor:'#065863',flex:1,height:2}}></View>}
                      ListHeaderComponent={()=> <View style={{flex:1,marginBottom:2,backgroundColor:'#065863',borderTopLeftRadius:30,borderTopRightRadius:30}}>
                      <View style={{flex:1,marginTop:5,marginBottom:5,marginLeft:15,marginRight:15,borderBottomColor:'#11c9e3',borderBottomWidth:1}}>
                        <View>
                          <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}><View><Text style={viewStyles.textWhite}>ID</Text></View><View><Text style={viewStyles.textWhite}>{opened_bet.id}</Text></View></View>
                          <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}><View><Text style={viewStyles.textWhite}>Date</Text></View><View><Text style={viewStyles.textWhite}>{moment.unix(opened_bet.date_time).format('ddd, D MMM YYYY')}</Text></View></View>
                        </View>
                      </View >
                      <View style={[{flex:1,marginTop:5,marginBottom:5,marginLeft:15,marginRight:15},(opened_bet.outcome === 0 ||opened_bet.payout > 0)&&{borderBottomColor:'#11c9e3',borderBottomWidth:1}]}>
                          <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}><View><Text style={viewStyles.textWhite}>Stake</Text></View><View><Text style={viewStyles.textWhite}>{opened_bet.amount}  {config.currency}</Text></View></View>
                          <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}><View><Text style={viewStyles.textWhite}>Odd</Text></View><View><Text style={viewStyles.textWhite}>{opened_bet.k}</Text></View></View>
                      </View>
                       {(opened_bet.outcome === 0 &&this.hasLostSelection(activeBets)) &&<View style={{flex:1,marginTop:5,marginBottom:5,marginLeft:15,marginRight:15,paddingLeft:5,paddingRight:5}}><TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} onPress={() =>  this.rebet(opened_bet.id,activeBets)}>
                       <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:"space-between",backgroundColor:'#299e77',padding:5}} >
                        <View><Text style={viewStyles.textWhite}> Rebet</Text></View><CustomIcon name="rebet" size={20} color="#fff"/> 
                    </View></TouchableNativeFeedback></View>}
                     {(opened_bet.outcome === 0 ||opened_bet.payout > 0) && <View style={{flex:1,marginTop:5,marginBottom:5,marginLeft:15,marginRight:15}}>
                     <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}><View><Text style={viewStyles.textWhite}>{opened_bet.outcome===0?'Possible Win: ':'Win: '}</Text></View><View><Text style={viewStyles.textWhite}>{opened_bet.payout > 0 ? opened_bet.payout :opened_bet.possible_win}  {config.currency}</Text></View></View></View>}
                     {opened_bet.hasOwnProperty('cash_out') &&<View style={{flex:1,marginTop:5,marginBottom:5,marginLeft:15,marginRight:15}}><TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} onPress={() =>  this.attemptCashout(opened_bet)}>
                       <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:"space-between",backgroundColor:'#299e77',paddingTop:5,paddingBottom:5}} >
                        <View><Text style={viewStyles.textWhite}> Cashout</Text></View><View><Text style={[{ paddingLeft: 5, marginRight: 5 },viewStyles.textWhite]}>{opened_bet.cash_out} {config.currency}</Text></View> 
                    </View></TouchableNativeFeedback></View>}
                    </View>}
                    />
                  </View>
                }
              </View>
              </View>
              </Modal>
              <Tabs tabBarUnderlineStyle={{backgroundColor:'#11c9e3'}} onChangeTab={this.onChangeTab}>
                <Tab heading={ <TabHeading style={{backgroundColor:'#eee'}}><Text>Open Bets</Text></TabHeading>}>
                  <View style={{flex:1}}>
                  {/* <View style={[showFilterInputs&&{flex:1}]}> */}
                       <TouchableNativeFeedback useForeground={TouchableNativeFeedback.canUseNativeForeground()} onPress={this.showFilter}>
                         <View style={{flexDirection:'row',alignItems:'center',justifyContent:"space-between",marginTop:10,height:40,backgroundColor:'#018da0',paddingLeft:10,paddingRight:10}}>
                            <View>
                              <Text style={{color:'#fff'}}>Filter</Text>
                            </View>
                            <CustomIcon name={`${showFilterInputs? 'arrow-up':'arrow-down'}`} size={15} color="#11c9e3"/>
                         </View>
                       </TouchableNativeFeedback>
                        <View style={{flex:1,display:showFilterInputs?'flex':'none'}}>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                              <Item style={{flex:1}}>
                                <TextInput autoComplete="off" placeholder="Bet ID" placeholderTextColor="#194b51" value={bet_id} onChangeText={this.setBetID} ref={(el) => this.partialInput = el}  style={{flex:1}}/>
                              </Item>
                          <Item picker style={{flex:1}}>
                          <Label style={{color:'#194b51',fontSize:10}}  children="Bet Type" />
                            <Picker
                              mode="dropdown"
                              
                              iosIcon={<Icon name="arrow-down" />}
                              placeholder="Bet Type"
                              placeholderStyle={{ color: "#194b51" }}
                              placeholderIconColor="#007aff"
                              selectedValue={bet_type}
                              onValueChange={this.setBetType.bind(this)}
                            >
                              <Picker.Item  label="All" value={-1} />
                              <Picker.Item  label="Single" value={1} />
                              <Picker.Item  label="Multiple" value={2} />
                              <Picker.Item  label="System" value={3} />
                              <Picker.Item  label="Chain" value={4} />
                              
                            </Picker>
                          </Item>
                          
                          
                          </View>
                          <View >
                          </View>
                          <View style={{flexDirection:'row'}}>
                            <View style={{flex:1,margin:5}}>
                            <TouchableOpacity onPress={this.showDatePickerF}>
                              <View style={{height:30,borderRadius:10,borderColor:'#eee',borderWidth:1,flexDirection:'row',alignItems:'center',paddingLeft:5,padd :5}}>
                              <CustomIcon name="calendar" size={25} color="#11c9e3"/>
                               <View style={{marginLeft:5}}><Text style={{fontSize:15}}>{moment(datepickerF).format('D MMM YYYY')}</Text></View>
                              </View>
                            </TouchableOpacity>
                            {showDatePickerF&&<DateTimePicker
                                maximumDate={new Date()}
                                timeZoneOffsetInMinutes={0}
                                value={datepickerF}
                                mode={'date'}
                                display="default"
                                onChange={this.onDateChangeF}
                              />}
                             
                            </View>
                            <View style={{flexDirection:'row', alignItems:'center',justifyContent:'center'}}>
                              <Text style={{fontSize:25}}>-</Text>
                            </View>
                            <View style={{flex:1,margin:5}}>
                            <TouchableOpacity onPress={this.showDatePickerT}>
                              <View style={{height:30,borderRadius:10,borderColor:'#eee',borderWidth:1,flexDirection:'row',alignItems:'center',paddingLeft:5,padd :5}}>
                               <CustomIcon name="calendar" size={25} color="#11c9e3"/>
                               <View style={{marginLeft:5}}><Text style={{fontSize:15}}>{moment(datepickerT).format('D MMM YYYY')}</Text></View>
                              </View>
                            </TouchableOpacity>
                            { showDatePickerT&&   <DateTimePicker
                                 timeZoneOffsetInMinutes={0}
                                  value={datepickerT}
                                  maximumDate={new Date()}
                                  mode={'date'}
                                  display="default"
                                  onChange={this.onDateChangeT}
                                />
                            }    
                            </View>
                          </View>
                          <View style={{flex:1,margin:5}}>
                            <TouchableNativeFeedback useForeground={TouchableNativeFeedback.canUseNativeForeground()} onPress={this.searchBetHistoryResultOpen}>
                              <View style={{height:40,borderRadius:10,backgroundColor:'#11c9e3',flexDirection:'row',alignItems:'center',justifyContent:'center'}}><Text style={{color:'#fff'}}>Search</Text></View></TouchableNativeFeedback>
                          </View>
                        </View>
                        {/* </View> */}
                        <View style={{flex:2}}>
                        <FlatList
                          data={openbets}
                          keyExtractor={(item)=>item.id.toString()}
                          renderItem={this._renderItem}
                          ListEmptyComponent={()=><View style={{height:50,flexDirection:'row',alignItems:'center',justifyContent:'space-around'}}><Text>There is nothing to show at the moment</Text></View>}
                        />
                        </View>
                  </View>
                </Tab>
                <Tab heading={ <TabHeading style={{backgroundColor:'#eee'}}><Text>History</Text></TabHeading>}>
                  <View style={{flex:1}}>
                  {/* <View style={[showFilterInputs&&{flex:1}]}> */}
                  <TouchableNativeFeedback useForeground={TouchableNativeFeedback.canUseNativeForeground()} onPress={this.showFilter}>
                         <View style={{flexDirection:'row',alignItems:'center',justifyContent:"space-between",marginTop:10,height:40,backgroundColor:'#018da0',paddingLeft:10,paddingRight:10}}>
                            <View>
                              <Text style={{color:'#fff'}}>Filter</Text>
                            </View>
                            <CustomIcon name={`${showFilterInputs? 'arrow-up':'arrow-down'}`} size={15} color="#11c9e3"/>
                         </View>
                       </TouchableNativeFeedback>
                        <View style={{flex:1,display:showFilterInputs?'flex':'none'}}>
                        <View >
                          <View style={{marginBottom:5,marginLeft:5,marginRight:5}}>
                            <View>
                              <Item>
                                <TextInput autoComplete="off" placeholder="Bet ID"  placeholderTextColor="#194b51" value={bet_id} onChangeText={this.setBetID} ref={(el) => this.partialInput = el}  style={{flex:1}}/>
                              </Item>
                            </View>
                          </View>
                          
                          </View>
                          <View style={{flexDirection:'row',alignItems:'center'}}>
                          <View style={{margin:5,flex:1}}>
                          <Item picker>
                          <Label style={{color:'#194b51',fontSize:10}}  children="Bet Type" />
                            <Picker
                              mode="dropdown"
                              style={{height:30}}
                              iosIcon={<Icon name="arrow-down" />}
                              placeholder="Bet Type"
                              placeholderStyle={{ color: "#bfc6ea" }}
                              placeholderIconColor="#007aff"
                              selectedValue={bet_type}
                              onValueChange={this.setBetType.bind(this)}
                            >
                              <Picker.Item  label="All" value={-1} />
                              <Picker.Item  label="Single" value={1} />
                              <Picker.Item  label="Multiple" value={2} />
                              <Picker.Item  label="System" value={3} />
                              <Picker.Item  label="Chain" value={4} />
                              
                            </Picker>
                          </Item>
                          
                          </View>
                          <View style={{margin:5,flex:1}}>
                          <Item picker>
                          <Label style={{color:'#194b51',fontSize:10}}  children="Outcome" />
                            <Picker
                              mode="dropdown"
                              style={{height:30}}
                              iosIcon={<Icon name="arrow-down" />}
                              placeholder="Outcome"
                              placeholderStyle={{ color: "#bfc6ea" }}
                              placeholderIconColor="#007aff"
                              selectedValue={outcome}
                              onValueChange={this.setOutcome.bind(this)}
                            >
                              <Picker.Item  label="All" value={-1} />
                              <Picker.Item  label="Open" value={0} />
                              <Picker.Item  label="Lost" value={1} />
                              <Picker.Item  label="Returned" value={2} />
                              <Picker.Item  label="Won" value={3} />
                              <Picker.Item  label="Cashed Out" value={5} />
                              
                            </Picker>
                          </Item>
                          
                          </View>
                            {/* <View style={{margin:5}}>
                              <Item picker>
                              <Label style={{color:'#194b51'}}  children="Time Period" />
                                  <Picker
                                    mode="dropdown"
                                    iosIcon={<Icon name="arrow-down" />}
                                    style={{ width: undefined,height:30 }}
                                    placeholder="Time Period"
                                    placeholderStyle={{ color: "#bfc6ea" }}
                                    placeholderIconColor="#007aff"
                                    selectedValue={period}
                                    onValueChange={this.setPeriod.bind(this)}
                                  >
                                    {
                                    this.upcomingGamesPeriods.map((range, i) => {
                                      return <Picker.Item key={i} label={`${range} ${range > 1 ? 'Hours' : 'Hour'}`} value={range} />
                                    })
                                  }
                                  
                                  </Picker>
                                </Item>
                            </View> */}
                          </View>
                          <View style={{flexDirection:'row'}}>
                            <View style={{flex:1,margin:5}}>
                            <TouchableOpacity onPress={this.showDatePickerF}>
                              <View style={{height:30,borderRadius:10,borderColor:'#eee',borderWidth:1,flexDirection:'row',alignItems:'center',paddingLeft:5,padd :5}}>
                              <CustomIcon name="calendar" size={25} color="#11c9e3"/>
                                <View style={{marginLeft:5}}><Text style={{fontSize:15}}>{moment(datepickerF).format('D MMM YYYY')}</Text></View>
                              </View>
                            </TouchableOpacity>
                            {showDatePickerF&&<DateTimePicker
                                maximumDate={new Date()}
                                timeZoneOffsetInMinutes={0}
                                value={datepickerF}
                                mode={'date'}
                                display="default"
                                onChange={this.onDateChangeF}
                              />}
                             
                            </View>
                            <View style={{flexDirection:'row', alignItems:'center',justifyContent:'center'}}>
                              <Text style={{fontSize:25}}>-</Text>
                            </View>
                            <View style={{flex:1,margin:5}}>
                            <TouchableOpacity onPress={this.showDatePickerT}>
                              <View style={{height:30,borderRadius:10,borderColor:'#eee',borderWidth:1,flexDirection:'row',alignItems:'center',paddingLeft:5,padd :5}}>
                               <CustomIcon name="calendar" size={25} color="#11c9e3"/>
                               <View style={{marginLeft:5}}><Text style={{fontSize:15}}>{moment(datepickerT).format('D MMM YYYY')}</Text></View>
                              </View>
                            </TouchableOpacity>
                            { showDatePickerT&&   <DateTimePicker
                                 maximumDate={new Date()}
                                 timeZoneOffsetInMinutes={0}
                                  value={datepickerT}
                                  mode={'date'}
                                  is24Hour={true}
                                  display="default"
                                  onChange={this.onDateChangeT}
                                />
                            }    
                            </View>
                          </View>
                          <View style={{flex:1,margin:5}}>
                            <TouchableNativeFeedback useForeground={TouchableNativeFeedback.canUseNativeForeground()} onPress={() => { this.searchBetHistoryResult() }}>
                              <View style={{height:40,borderRadius:10,backgroundColor:'#11c9e3',flexDirection:'row',alignItems:'center',justifyContent:'center'}}><Text style={{color:'#fff'}}>Search</Text></View></TouchableNativeFeedback>
                          </View>
                        </View>
                        {/* </View> */}
                        <View style={{flex:1.5}}>
                        <FlatList
                          data={bets}
                          keyExtractor={(item)=>item.id.toString()}
                          renderItem={this._renderItem}
                          ListEmptyComponent={()=><View style={{height:50,flexDirection:'row',alignItems:'center',justifyContent:'space-around'}}><Text>There is nothing to show at the moment</Text></View>}
                        />
                        </View>
                  </View>
                </Tab>
              </Tabs>
              {isBetSlipOpen&&isFocused&&<Controls navigate={this.props.navigation.navigate}/>}
            </View>

      )
    }
  }
  export default withNavigationFocus(BetHistory)