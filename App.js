import React, { PureComponent } from 'react';
import {View, Image, Text, UIManager, Platform} from 'react-native'
import moment from 'moment-timezone';
import SplashScreen from 'react-native-splash-screen';
import { allActionDucer, appStateActionDucer } from './APP/actionCreator';
import { APPREADY, AUTHENTICATED, LOGIN, PARTNER_CONFIG, SPORT_COMPETITION, SPORTSBOOK_ANY, RIDS_PUSH, LOGOUT, PROFILE, MODAL, PROFILE_EMPTY, LANG, SCREEN_FN, GAME_VIEW, COMPETITIONS_DATA, BETSLIP, PREMATCH_DATA, LIVE_DATA, HOME_DATA, SPORT, BETHISTORY } from './APP/actionReducers';
import * as appConfig from './appconfig.json';
import NetInfo from "@react-native-community/netinfo";
import { dataStorage, scrollToBottom, setBetStakeInputVal, updateBrowserHistoryState } from './APP/common';
import WS from './APP/services/WS';
import API from './APP/services/api';
import  {calcMD5} from './APP/utils/jsmd5'
import {makeText} from './APP/utils/index'
import DrawerNav from './APP/navigation'
import { enableScreens } from 'react-native-screens';

enableScreens();
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}
const $api = API.getInstance()
export default class App extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      authUser: {},
      isInternetAvail:true,
      windowActive: true,
      inactiveTimedout:false,
      canResubscribe:false
    }
    
    this.lang = props.appState.lang
    this.language_cookie = null
    this.socket = null
    this.reconnectInterval = null
    this.resubscribe = this.resubscribe.bind(this)
    this.socketOpen = this.socketOpen.bind(this)
    this.socketMessage = this.socketMessage.bind(this)
    this.socketClose = this.socketClose.bind(this)
    this.socketError = this.socketError.bind(this)
    this.receiveParseJSON = this.receiveParseJSON.bind(this)
    this.sendRequest = this.sendRequest.bind(this)
    this.unsubscribe = this.unsubscribe.bind(this)
    this.addEventToSelection = this.addEventToSelection.bind(this)
    this.loginUser = this.loginUser.bind(this)
    this.clearSearch = this.clearSearch.bind(this)
    this.connectSocket = this.connectSocket.bind(this)
 
    this.bulkUnsubscribe = this.bulkUnsubscribe.bind(this)
    this.handleRequestSessionResponse = this.handleRequestSessionResponse.bind(this)
    this.setAuthenticated = this.setAuthenticated.bind(this)
    this.promotedGames = this.promotedGames.bind(this)
    this.popularCompetitions = this.popularCompetitions.bind(this)
    this.handleSportData = this.handleSportData.bind(this)
    this.handleSportDataPrematch = this.handleSportDataPrematch.bind(this)
    this.handleGameData = this.handleGameData.bind(this)
    this.handleMarketData = this.handleMarketData.bind(this)
    this.handleEventData = this.handleEventData.bind(this)
    this.handleBetResponse = this.handleBetResponse.bind(this)
    this.sportCompetitionList = this.sportCompetitionList.bind(this)
    this.validate = this.validate.bind(this)
    this.retrieve = this.retrieve.bind(this)
    this.getEvents = this.getEvents.bind(this)
    this.getBetHistory = this.getBetHistory.bind(this)
    this.clearSearch = this.clearSearch.bind(this)
    this.getUserBalanceMain = this.getUserBalanceMain.bind(this)
    this.autoGetBalance = this.autoGetBalance.bind(this)
    this.rids = { ...props.sportsbook.rids }
    this.subscriptions = {}
    this.swarmErrors = {
      '-1': 'Fialed',
      0: 'No error',
      1: 'Bad Request',
      2: 'Invalid Command',
      3: 'Service Unavailable',
      4: 'Request Timeout',
      5: 'No Session',
      6: 'Subscription not found',
      7: 'Not subscribed',
      10: 'Invalid Level',
      11: 'Invalid Field',
      12: 'Invalid Credentials',
      20: 'Not enough balance for operation',
      21: 'Operation not allowed',
      22: 'Limit reached',
      23: 'Service temporary is down',
      99: 'Unknown Error',
      1000: 'Internal Error',
      1001: 'User not found',
      1002: 'Wrong Login/Password',
      1003: 'User blocked',
      1004: 'User dismissed',
      1005: 'Incorrect old password',
      1008: 'Logging in the page is not possible, since user is not activated or verified',
      1009: 'Such a verification code does not exist',
      1012: 'Incorrect phone number',
      1013: 'Password is too short',
      1014: 'Failed to send verification SMS',
      1023: 'User is not verified via email',
      1099: 'Fork exception',
      1100: 'Game is already started',
      1102: 'Game start time is already past',
      1103: 'Bet editing time is already past',
      1104: 'Bet is payed',
      1105: 'Bet status not fixed',
      1106: 'Bet lose',
      1107: 'Bet is online',
      1108: 'Wrong value for coefficient',
      1109: 'Wrong value for amount (in case of system bet - amount is less than minimum allowed)',
      1021: 'Pass should contain at least 8 chars: upper and lowercase English letters, at least one digit and no space',
      1112: 'Request is already paid!',
      1113: 'Request is already stored!',
      1117: 'Wrong login or E-mail',
      1118: 'Duplicate Login',
      1119: 'Duplicate EMail',
      1120: 'Duplicate nickname',
      1122: 'Duplicate personal Id',
      1123: 'Duplicate doc number',
      1124: 'Amount is not in valid range',
      1125: 'Bet type error',
      1126: 'Bet declined by SKKS',
      1127: 'Duplicate phone number',
      1150: 'You yet are not allowed to bet on the given event yet',
      1151: 'Duplicate Facebook ID',
      1170: 'Card lot blocked',
      1171: 'Scratch card already activated',
      1172: 'Scratch card blocked',
      1174: 'Wrong scratch card currency (not supported for user currency)',
      1200: 'Wrong value exception',
      1273: 'Wrong scratch card number',
      1300: 'Double value exception',
      1400: 'Double event exception',
      1500: 'Limit exception',
      1550: 'The sum exceeds maximum allowable limit',
      1560: 'The sum is less than minimum allowable limit',
      1600: 'There is going the correction of coefficient.',
      1700: 'Wrong access exception',
      1800: 'Odds changed from %s to %s',
      1900: 'The events can be included only in the express',
      2000: 'Odds restriction exception',
      2003: 'Bet state error',
      2005: 'Cashdesk not found',
      2006: 'Cashdesk not registered',
      2007: 'Currency mismatch',
      2008: 'Client excluded',
      2009: 'Client locked',
      2018: 'Email should not be an empty',
      2020: 'First name should not be an empty',
      2024: 'Invalid email',
      2033: 'Market suspended',
      2036: 'Game suspended',
      2048: 'Wrong region',
      2051: 'Partner api access not activated',
      2052: 'Partner api Client Balance Error',
      2053: 'Partner api client limit error',
      2054: 'Partner api empty method',
      2055: 'Partner api empty request body',
      2056: 'Partner api max allowable limit',
      2057: 'Partner api min allowable limit',
      2058: 'Partner api PassToken error',
      2059: 'Partner api timestamp expired',
      2060: 'Partner api token expired',
      2061: 'Partner api user blocked',
      2062: 'Partner api wrong hash',
      2063: 'Partner api wrong login email',
      2064: 'Partner api wrong access',
      2065: 'Partner not found',
      2066: 'Partner commercial fee not found',
      2072: 'Reset code expired',
      2074: 'Same password and login',
      2075: 'Selection not found',
      2076: 'Selection count mismatch',
      2077: 'Event suspended',
      2078: 'Sport mismatch',
      2080: 'Sport not supported for the partner',
      2091: 'Password expired',
      2093: 'Username already exist',
      2098: 'Wrong currency code',
      2100: 'Payment restriction exception',
      2200: 'Client limit exception',
      2302: 'Terminal balance exception',
      2400: 'Insufficient balance',
      2403: 'Pending withdrawal requests',
      2404: 'Cash out not allowed',
      2405: 'Bonus not found',
      2406: 'Partner bonus not found',
      2407: 'Client has active bonus',
      2408: 'Invalid client verification step',
      2409: 'Partner setting not allow this type of self exclusion',
      2410: 'Invalid self exclusion type',
      2411: 'Invalid client limit type',
      2412: 'Invalid client bonus',
      2413: 'Client restricted for action',
      2414: 'Selection singles only',
      2415: 'Partner not supported test client',
      2416: 'Partner not using loyalty program',
      2417: 'Point exchange range exceed',
      2418: 'Client not using loyalty program',
      2419: 'Partner limit amount exceed',
      2420: 'Client has accepted bonus',
      2421: 'Partner api error',
      2422: 'Team not found',
      2423: 'Invalid client verification step state',
      2424: 'Partner sports book currency setting',
      2425: 'Client bet min stake limit error',
      2426: 'Max deposit request sum',
      2427: 'Email wrong hash',
      2428: 'Client already self excluded',
      2429: 'Transaction amount exceeds frozen money',
      2430: 'Wrong hash',
      2431: 'Partner Mismatch',
      2432: 'Match Not Visible',
      2433: 'Loyalty Level Not Found',
      2434: 'Max withdrawal amount',
      2436: 'Selection suspended before start time',
      2437: 'Bonus not allowed for super bet',
      3000: 'Too many invalid login attempts',
      3001: 'Currency not supported',
      3015: 'Negative amount',
      3019: 'Bet selections cannot be chained together',
      50000: 'Failed to place bet, please try again later'
    }
    this.clearBetSelectionsTimeout=null
    this.rids[1].callback = this.handleRequestSessionResponse
    this.rids[2].callback = this.setAuthenticated
    this.rids[3].callback = this.handleProfileData.bind(this)
    this.rids[4].callback = this.handlePartner.bind(this)
    this.rids[5].callback = this.userBonusData
    this.rids[6].callback = this.userSearchGamesData.bind(this)
    this.rids[6.5].callback = this.userSearchCompetitionData.bind(this)
    this.rids[7].callback = this.handleSportData
    this.rids["7.5"].callback = this.handleSportDataPrematch
    this.rids[8].callback = this.handleGameData
    this.rids[9].callback = this.handleMarketData
    this.rids[10].callback = this.handleEventData.bind(this)
    this.rids[11].callback = this.sportCompetitionList
    this.rids[12].callback = this.handleBetResponse
    this.rids[13].callback = this.gameResultsData.bind(this)
    this.rids[14].callback = this.betHistoryData.bind(this)
    this.rids['14.5'].callback = this.betHistoryDataOpen.bind(this)
    this.rids[15].callback = this.promotedGames
    this.rids[16].callback = this.popularCompetitions
    this.rids[17].callback = this.bettingRules.bind(this)
    this.rids[18].callback = this.currencyConfig.bind(this)
    this.rids[19].callback = this.handleLiveNow.bind(this)
    this.rids[20].callback = this.handleUpcoming.bind(this)
    this.rids[21].callback = this.userFreeBets.bind(this)
    props.dispatch(appStateActionDucer(RIDS_PUSH, { ...this.rids }))
    
  }
  componentDidMount() {
    this.unsubscribeNetInfo = NetInfo.addEventListener(state => {
      this.props.dispatch(allActionDucer(APPREADY, {hasInternetConnection:state.isConnected }))
    });
    this.props.loadApp()
    .then(hasLoginState=>{
      const activeView = this.props.sportsbook.activeView,socketState = null!== this.socket ?this.socket.getReadyState():10
      if(activeView ==='Live' ||activeView ==='Prematch' ||activeView ==='Home'|| this.props.modalOpen)
      if(socketState !== WebSocket.OPEN && socketState!== WebSocket.CONNECTING && !this.state.inactiveTimedout)this.connectSocket()
      if(hasLoginState){
        this.props.dispatch(appStateActionDucer(LOGIN, { isLoggedIn: true }))
        const {id,AuthToken,mobile}= hasLoginState
        this.props.dispatch(appStateActionDucer(PROFILE, {uid:id,AuthToken:AuthToken,mobilenumber:mobile }))
      }
      
    }).then(this.props.dispatchAppReady)
    this.props.dispatch(allActionDucer(SCREEN_FN,{loadHomeData:this.loadHomeData.bind(this),
      getEvents:this.getEvents,
      dispatchLogOut:this.logoutUser.bind(this),
      addEventToSelection:this.addEventToSelection, sendRequest:this.sendRequest, unsubscribe:this.unsubscribe,
      subscribeToSelection:this.subscribeToSelection.bind(this), handleBetResponse:this.handleBetResponse,
      retrieve:this.getEvents, getBetslipFreebets:this.getBetslipFreebets.bind(this),handleSportUpdate:this.handleSportUpdate.bind(this),
      bulkUnsubscribe:this.bulkUnsubscribe,popularInSportsBook:this.popularInSportsBook.bind(this) }))
      SplashScreen.hide()
    }
  componentDidUpdate(){
     const activeView = this.props.appState.activeView,socketState = null!== this.socket ?this.socket.getReadyState():10
    if(activeView ==='Live' ||activeView ==='Prematch' ||activeView ==='Home'){
      if(socketState !== WebSocket.OPEN && socketState!== WebSocket.CONNECTING && !this.state.inactiveTimedout)this.connectSocket()
    }else{
      if((socketState === WebSocket.OPEN || socketState=== WebSocket.CONNECTING) && (socketState!==WebSocket.CLOSED &&socketState!==WebSocket.CLOSING)){null !==this.socket &&this.socket.close();this.props.dispatch(allActionDucer(SPORTSBOOK_ANY,{sessionData:{}}))}
    }
    if(!this.props.appState.isLoggedIn){
      dataStorage('loginState',{},0)
      .then(userData=>{
        if(userData)
        {userData = JSON.parse(userData)
        if (userData.id && userData.AuthToken) {
          this.props.dispatch(appStateActionDucer(LOGIN, { isLoggedIn: true }))
          this.getUserBalanceMain()
        }}
      })
    }
  }
  componentWillUnmount() {
    clearInterval(this.reconnectInterval)
    clearInterval(this.getBalanceInterval)
    clearInterval(this.webPing)
    clearInterval(this.visiblewindowInterval)
    clearInterval(this.reloadpageAfterTimeout)
    clearTimeout(this.unsubscribeTimeout)
    clearTimeout(this.logoutTimeout)
    clearTimeout(this.changingOutcomeTimeout)
    clearTimeout(this.isQuickBetStakeZeroTimeout)
    clearTimeout(this.betPlacedTimeout)
    clearTimeout(this.betFailedTimeout)
    clearTimeout(this.clearBetSelectionsTimeout)
    null !==this.socket && this.socket.getReadyState() === WebSocket.OPEN && this.socket.close()
    this.unsubscribeNetInfo();
  }

  getUserBalanceMain(){
    dataStorage('loginState',{},0)
    .then(userData=>{
      if(userData){
         userData= JSON.parse(userData)
        const {id,AuthToken,mobile} = userData,$time = moment().format('YYYY-MM-DD H:mm:ss'),hash=
        calcMD5(`AuthToken${AuthToken}uid${id}mobile${mobile}time${$time}${this.props.appState.$publicKey}`)
        $api.getBalance({uid:id,AuthToken:AuthToken,mobile:mobile,time:$time,hash:hash},this.afterBalance.bind(this))
        $api.getUserInfo({uid:id,AuthToken:AuthToken,mobile:mobile,time:$time,hash:hash},this.afterBalance.bind(this))
        this.getBalanceInterval = setInterval(()=>{this.autoGetBalance()},5000)
        this.loginUser()
      }
    })
    
  }
  autoGetBalance(){
    dataStorage('loginState',{},0)
    .then(userData=>{
      if(userData){
        userData = JSON.parse(userData)
        const {id,AuthToken,mobile} = userData,$time = moment().format('YYYY-MM-DD H:mm:ss'),hash=
        calcMD5(`AuthToken${AuthToken}uid${id}mobile${mobile}time${$time}${this.props.appState.$publicKey}`)
        $api.getBalance({uid:id,AuthToken:AuthToken,mobile:mobile,time:$time,hash:hash},this.afterBalance.bind(this))
      }
    })
   
  }
  afterBalance({data}){
    const res =data.data
     if(res.hasOwnProperty("balance")){
      const {balance,bonus}=this.props.profile
      if(balance!==res.balance || bonus!==res.bonus)
      this.props.dispatch(appStateActionDucer(PROFILE, { ...data.data }))
      else return true
     }else{
      this.props.dispatch(appStateActionDucer(PROFILE, { ...data.data }))
     }
  }
  socketOpen(e) {
    // this.props.dispatch(appStateActionDucer(APPREADY, { isReady: true }))
    clearInterval(this.reconnectInterval)
    this.rids[1].request = {
      command: "request_session",
      params: {
        site_id: appConfig.config.partnerID,
        language: this.lang,
        source: 1
      },
      rid: 1
    }
    this.sendRequest(this.rids[1].request);

    this.interval = setInterval(() => {
      if (this.props.appState.isLoggedIn) {
        this.getClientBalance()
      }
    }, 30000)
  }
  socketMessage(event) {
    let data = this.receiveParseJSON(event)
    // if (data.code !== 0) {
    //    console.log(JSON.stringify(data))
    //   makeText('An error occured whiles trying to fetch data')
    // }
    if (data.data === null || data === null) {
      return;
    }
    let rids = this.props.sportsbook.rids
    switch (data.rid) {
      case 1: //session
      case 2: //authentication
      case 3: //use profile
      case 4: //partner data
      case 5: //user bonuses
      case 6: //user  game search
      case 6.5: //user  game search
      case 11: // sports comopetitions list
      case 12: // bet or booking
      case 13: //results games
      case 14: //bet history
      case "14.5": //open bets history
      case 15: //popular competitions
      case 16: //popular games
      case 17: //betting rules
      case 18: //currency configuration
      case 21: //free bets
        rids[data.rid].callback(data)
        break;
      case 7: // sports data
      case "7.5": // sports data
      case 8: // games data
      case 9: //markets data
      case 10: //events data 
      case 19: //live now
      case 20: //upcoming
      case "0":
        this.handleSubscriptionResponse(data)
        break;
      case 2000:
        // console.log(data)
        break;
      case 2001:
        this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { site_recaptch_key: data.data.result }));
        break;
      default:
        if (rids[data.rid]) rids[data.rid].callback(data)
        else console.warn('Got second response for request or invalid rid:', data);
        break;
    }

  }
  socketClose(event) {
    // console.warn('Socket is closed. Reconnect will be attempted in 3 second.');
  }
  socketError(event) {
    // console.warn('Socket encountered error: ', event);
    this.socket.close()
    this.reconnectInterval = setInterval(() => {
      this.connectSocket();
    }, 5000);
  }
  connectSocket() {
    this.socket = new WS("wss://eu-swarm-ws.betconstruct.com/")
    this.language_cookie = null
    if (this.language_cookie) {
      if (this.language_cookie === "fr-fr")
      {  this.lang = "fra"
      moment.locale('fr'); // 'fr'
    }
      else if (this.language_cookie === "en-gb")
     {   this.lang = "eng"
      moment.locale('en'); // 'en'
    }
     else if(this.language_cookie === "zh-cn"){
      this.lang = "zhh"
      moment.locale('zh'); // 'chinese'
     }
    }
    this.props.dispatch(allActionDucer(LANG, { lang: this.lang }));
    this.socket.onSocketOpen(this.socketOpen)
    // Listen for messages
    this.socket.onSocketMessage(this.socketMessage)
    this.socket.onSocketClose(this.socketClose)
    this.socket.onSocketError(this.socketError)
  }
  handleRequestSessionResponse(data) {
    if(data.data){
    this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { sessionData: data.data }));
    // this.sendRequest({
    //   "command": "get_captcha_info",
    //   "params": {},
    //   rid: 2000
    // }
    // );
    this.sendRequest({ command: 'recaptcha_sitekey', params: {}, rid: 2001 });
    this.getConfig()
    // self.sendRequest({command:"get_partner_sport_group",params:{},rid:125})
    // self.sendRequest({command:"get_bet_shops",params:{},rid:125})
    // self.sendRequest({command:"get_captcha_url",params:{},rid:125})
    this.rids[17].request = { command: "get_sport_bonus_rules", params: {}, rid: 17 }
    this.sendRequest(this.rids[17].request)
    this.loginUser()}
    if(this.state.canResubscribe){
      this.resubscribe()
    }

      dataStorage('betSlip',{},0)
      .then((betSlip)=>{
        if(betSlip){
          let storeBetSlip = JSON.parse(betSlip)
          if (null !== storeBetSlip && undefined !== storeBetSlip ) {
            if (moment(storeBetSlip.expires).isAfter(moment())) {
              if (Object.keys(storeBetSlip.bets).length) {
                this.props.dispatch(allActionDucer(BETSLIP, { betSelections: storeBetSlip.bets }))
                this.subscribeToSelection(storeBetSlip.bets)
              }
            } else {
              dataStorage('betSlip', {}, 2)
            }
          }
          
        }
      })

  }
  sendRequest(request) {
    //        console.log('WS.sendRequest', request);
    try {
      let sendingDataText = JSON.stringify(request);
      this.socket.send(sendingDataText);
    } catch (reason) {
      console.warn(reason);
    }

  }
  receiveParseJSON(message) {
    try {
      return JSON.parse(message.data);
    } catch (e) {
      console.warn('cannot parse websocket response:', message.data, e);
      return null;
    }
  }
  loginUser() {
    dataStorage('loginState',{},0).then(userData=>{
     if(userData){
      userData = JSON.parse(userData)
      const id= userData.id,
      AuthToken= userData.AuthToken
    if (id !== null && AuthToken !== null) {
      this.rids[2].request = {
        command: "restore_login",
        params: {
          user_id: parseInt(id),
          auth_token: AuthToken
        }, rid: 2
      }
      this.sendRequest(this.rids[2].request)
    }
     }
    })

  }
  logoutUser(type=null) {
    clearInterval(this.getBalanceInterval)
    dataStorage('loginState',{},0)
    .then(userData=>{
      if(userData){
        userData = JSON.parse(userData)
        id= userData.id,
        AuthToken= userData.AuthToken
      if (id !== null && AuthToken !== null)
       { 
        dataStorage('loginState',{},2)
        this.sendRequest({
          command: "logout",
          params: {}
        })
        type && (this.logoutTimeout = setTimeout(()=>{this.props.dispatch(allActionDucer(MODAL,{accVerifyOpen:true,formType:'login'}))},3000))
  
      }
      this.props.dispatch(appStateActionDucer(LOGOUT, { }))
      this.props.dispatch(appStateActionDucer(PROFILE_EMPTY, { }))
      }
    })
     
  }
  setAuthenticated(user) {
    const dispatch=this.props.dispatch
    dispatch(allActionDucer(SPORTSBOOK_ANY, { authUser: { ...user.data }}))
    dispatch(allActionDucer(BETSLIP, {betSlipMode: 2 }))
    if(this.props.appState.isLoggedIn){
      this.getClientProfile()
      this.getClientBalance()
      this.getClientBonus(2)}
  }
  getClientBalance() {
    this.rids[3].request = {
      command: "get_balance", rid: 3
    }
    this.sendRequest(this.rids[3].request)
  }
  getClientProfile() {
    this.rids[3].request = {
      command: "get_user",
      params: {
      }, rid: 3
    }
    this.sendRequest(this.rids[3].request)
  }
  userFreeBets(data) {
    data.data.details && data.data.details.length && this.props.dispatch(allActionDucer(BETSLIP, { freeBets: data.data.details, freeBetStake: data.data.details[0] }))
  }
  getBetslipFreebets() {
    if(this.props.sportsbook.authUser.has_freebets){
      let selectionArr = [], {betSelections,betMode,acceptMode} = this.props.betslip
      Object.keys(betSelections).forEach((selected) => {
        selectionArr.push({ event_id: betSelections[selected].eventId, price: betSelections[selected].price })
      })
  
      let params = {
        command: "get_freebets_for_betslip",
        params: {
          type: betMode,
          source: 1,
          is_offer: 0,
          mode: acceptMode,
          each_way: false,
          bets: selectionArr
          // "is_live":true
        }, rid: 21,
      }
      this.sendRequest(params)
    }
  }
  getClientBonus(type) {
    this.rids[5].request = {
      command: "get_bonus_details",
      params: {
        free_bonuses: type === 1 ? false : true
      }, rid: 5
    }
    this.sendRequest(this.rids[5].request)
  }
  gameResultsData(data) {
    void 0 !== data.data.games && this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { resultsGames: data.data.games.game, loadResultsGames: false }))
  }

  bettingRules(data) {
    data.data.details !==void 0 && this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { sportsbettingRules: data.data.details }))
  }
  betHistoryData(data) {
    void 0 !== data.data &&this.props.dispatch(allActionDucer(BETHISTORY, { bets_history: data.data, loadingHistory: false, reloadHistory: !1 }))
  }
  betHistoryDataOpen(data) {
    let dispatch=this.props.dispatch;
    // let {openBetsSubid} = this.props.betslip
    // if (openBetsSubid !== null && openBetsSubid !== undefined)
    //   if (subscriptions[openBetsSubid]) {
    //     this.unsubscribe(openBetsSubid)
    //     delete subscriptions[openBetsSubid]
    //   }
    // subscriptions[data.subid] = { subid: data.subid, callback: (data) => this.handleOpenBetsUpdate(data), subStateVarName: 'openBetsSubid',request:this.rids[data.rid].request }
    // this.subscriptions = subscriptions
    //  console.log(data);
    void 0 !== data.data &&dispatch(allActionDucer(BETHISTORY, { openBetHistory: data.data, loadingOpenHistory: false, reloadOpenHistory: !1,openBetsSubid:data.subid }))
  }
  handleOpenBetsUpdate(data){
    if (data === null || data === undefined)
    return 
  let openBetHistory = { ...this.props.betsHistoryData.openBetHistory.bets};
  // Object.keys(openBetHistory).forEach((gameID) => {
  //   if (void 0 !== data.bets[openBetHistory[gameID].eventId] && null !== data.event[openBetHistory[gameID].eventId]) {
  //     if (openBetHistory[gameID].price !== data.event[openBetHistory[gameID].eventId].price) {
  //       openBetHistory[gameID].initialPrice = openBetHistory[gameID].price
  //       openBetHistory[gameID].price = data.event[openBetHistory[gameID].eventId].price
  //       if (openBetHistory[gameID].suspended) openBetHistory[gameID].suspended = 0
  //     }
  //   } else if (null === data.event[openBetHistory[gameID].eventId]) {
  //     openBetHistory[gameID].suspended = 1
  //   }
  // })
  // this.props.dispatch(allActionDucer(BETSLIP, { betSelections: betSelections }))
  }
  handleProfileData(data) {
    try {
      let { authUser } = this.props.sportsbook,dispatch=this.props.dispatch,{isLoggedIn}=this.props.appState
      if (authUser.user_id && data.data.auth_token) {
        authUser = { ...authUser, ...data.data }
       isLoggedIn && this.getBetslipFreebets()
        dispatch(allActionDucer(AUTHENTICATED, { ...authUser }))
      }
      else if (authUser.user_id && data.data.data.profile) {
        authUser = { ...authUser, ...data.data.data.profile[authUser.user_id] }
        dispatch(allActionDucer(AUTHENTICATED, { ...authUser }))
      }

    } catch (error) {
      console.log(error)
    }
  }
  handlePartner(data) {
    this.props.dispatch(allActionDucer(PARTNER_CONFIG, { ...data.data.data.partner[appConfig.config.partnerID] }))
    this.rids[18].request = {
      command: "get",
      params: {
        source: "config.currency",
        what: { currency: [] },
        where:
          { currency: { name: data.data.data.partner[appConfig.config.partnerID].currency } }
      }, rid: 18
    }
    this.sendRequest(this.rids[18].request)
  }
  handleBetResponse(data) {

    if (data.data.result === 'OK' || 0 === data.data.result)
      this.betSuccess(data)
    else { this.betFailed(data.data.details ? data.data.details.hasOwnProperty('api_code')?data.data.details.api_code : data.data.result? data.data.result: 50000:50000)}
  }
  sportCompetitionList(data) {
    data.data.details  && Array.isArray(data.data.details)&& this.props.dispatch(allActionDucer(SPORT_COMPETITION, { data: data.data.details }))
  }
  userSearchGamesData(data) {
    this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { searchData: data.data.data, searching: false }))
  }
  userSearchCompetitionData(data) {
    this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { searchDataC: data.data.data, searching: false }))
  }
  currencyConfig(data) {
    // console.log(data)
  }

  userBonusData(data) {
    // console.log(data)
  }
  promotedGames(data) {
    this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { populargamesData: data.data.data.sport,pgSID:data.data.sid }))
  }
  popularCompetitions(data) {
    this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { popularcompetitionData: data.data.data.sport,pcSID:data.data.sid }))
  }
  handleSportData(data) {
    let subscriptions = this.subscriptions,dispatch=this.props.dispatch;
    let {sportsubid} = this.props.liveData
    if (sportsubid !== null && sportsubid !== undefined)
      if (subscriptions[sportsubid]) {
        this.unsubscribe(sportsubid)
        delete subscriptions[sportsubid]
      }
    subscriptions[data.subid] = { subid: data.subid, callback: (data) => this.handleSportUpdate(data,'liveData',LIVE_DATA, 'data'), subStateVarName: 'sportsubid',request:this.rids[data.rid].request }
    this.subscriptions = subscriptions
    if(data.data &&Object.keys(data.data.sport).length){
      dispatch(allActionDucer(SPORTSBOOK_ANY, {sportsubid: data.subid, subscriptions: subscriptions }))
      dispatch(allActionDucer(LIVE_DATA, {data: data.data, loadSports: false,refreshing:false}))
    }else {
      dispatch(allActionDucer(SPORTSBOOK_ANY, { sportsubid: data.subid,subscriptions: subscriptions}))
      dispatch(allActionDucer(LIVE_DATA, {data: [],loadSports: false,refreshing:false }))
    }

  }
  handleSportDataPrematch(data) {
    let subscriptions = this.subscriptions,dispatch=this.props.dispatch;
    let {sportsubid} = this.props.prematchData
    if (sportsubid !== null && sportsubid !== undefined)
      if (subscriptions[sportsubid]) {
        this.unsubscribe(sportsubid)
        delete subscriptions[sportsubid]
      }
    subscriptions[data.subid] = { subid: data.subid, callback: (data) => this.handleSportUpdate(data,'prematchData',PREMATCH_DATA, 'data'), subStateVarName: 'sportsubid',request:this.rids[data.rid].request }
    this.subscriptions = subscriptions
    if(data.data &&Object.keys(data.data.sport).length){
      dispatch(allActionDucer(SPORTSBOOK_ANY, {sportsubid: data.subid, subscriptions: subscriptions }))
      dispatch(allActionDucer(PREMATCH_DATA, {data: data.data, loadSports: false,refreshing:false}))
    }else {
      dispatch(allActionDucer(SPORTSBOOK_ANY, { sportsubid: data.subid,subscriptions: subscriptions}))
      dispatch(allActionDucer(PREMATCH_DATA, {data: [],loadSports: false,refreshing:false }))
    }

  }
  handleGameData(data) {
    let subscriptions = this.subscriptions;
    let { inviewGamesubid} = this.props.sportsbook
    if (inviewGamesubid !== null && inviewGamesubid !== undefined)
      if (subscriptions[inviewGamesubid]) {
        this.unsubscribe(inviewGamesubid)
        delete subscriptions[inviewGamesubid]
      }
    subscriptions[data.subid] = { subid: data.subid, callback: this.handleGameUpdate.bind(this), subStateVarName: 'inviewGamesubid',request:this.rids[data.rid].request }
    this.subscriptions = subscriptions
    this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { inviewGamesubid: data.subid}))
    this.props.dispatch(allActionDucer(COMPETITIONS_DATA, { competitionData: data.data.sport, loadCompetition: false,refreshing:false }))

  }
  handleMarketData(data) {
    let subscriptions = this.subscriptions;
    const { inviewMarketsubid } = this.props.sportsbook
    if (inviewMarketsubid !== null && inviewMarketsubid !== undefined)
      if (subscriptions[inviewMarketsubid]) {
        this.unsubscribe(inviewMarketsubid)
        delete subscriptions[inviewMarketsubid]
      }
    subscriptions[data.subid] = { subid: data.subid, callback: this.handleMarketUpdate.bind(this), subStateVarName: 'inviewMarketsubid',request:this.rids[data.rid].request }
    this.subscriptions = subscriptions
    let activeGame = data.data.game[Object.keys(data.data.game)[0]],marketData = activeGame && activeGame.market?{...activeGame.market}:{}
    activeGame && delete activeGame.market
    this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { inviewMarketsubid: data.subid}))
    this.props.dispatch(allActionDucer(GAME_VIEW, {marketData: marketData,activeGame:activeGame, loadMarket: false }))
  }
  handleEventData(data) {
    let subscriptions = this.subscriptions;
    let { selectionSub } = this.props.sportsbook,{betSelections}=this.props.betslip
    if (selectionSub !== null && selectionSub !== undefined) {
      if (subscriptions[selectionSub]) {
        this.unsubscribe(selectionSub)
        delete subscriptions[selectionSub]
      }
    }
    subscriptions[data.subid] = { subid: data.subid, callback: this.handleEventUpdate.bind(this), subStateVarName: 'selectedSub',request:this.rids[data.rid].request }
    this.subscriptions = subscriptions
    if (data === null || data === undefined)
      return
    betSelections = { ...betSelections };
    Object.keys(betSelections).forEach((gameID) => {
      if (data.data.event[betSelections[gameID].eventId] && null !== data.data.event[betSelections[gameID].eventId]) {
        if (betSelections[gameID].price !== data.data.event[betSelections[gameID].eventId].price) {
          betSelections[gameID].initialPrice = betSelections[gameID].price
          betSelections[gameID].price = data.data.event[betSelections[gameID].eventId].price
          if (betSelections[gameID].suspended) betSelections[gameID].suspended = 0
        }
      } else if (null === data.data.event[betSelections[gameID].eventId] || undefined === data.data.event[betSelections[gameID].eventId]) {
        betSelections[gameID].suspended = 1
      }
    })
    dataStorage('betSlip', {}, 0)
    .then(storeSlip=>{
      if (storeSlip) {storeSlip =JSON.parse(storeSlip); storeSlip.bets = betSelections; dataStorage('betSlip', storeSlip.bets) }
    })

    this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, {selectionSub: data.subid }))
    this.props.dispatch(allActionDucer(BETSLIP, { betSelections: betSelections}))

  }
  handleSubscriptionResponse(response) {
    let code = response.code, { swarmResCode,subscriptions } = this.props.sportsbook;
    this.subscriptions = {...this.subscriptions,...subscriptions}
    code = code === undefined ? response.data.code : code;
    if (code === swarmResCode.OK) {        //everything is ok
      if (response.data.hasOwnProperty('subid')) {
        if(response.data.subid=== "14.7") console.log(response)
        this.rids[response.rid].callback({...response.data,rid:response.rid})
      }
      else {
        Object.keys(response.data).forEach((subid) => {
          if (this.subscriptions[subid]) this.subscriptions[subid].callback(response.data[subid])
        })
      }
    } else if (code === swarmResCode.SESSION_LOST) {
      //Config.env.authorized = false;
      // session = null;
      // this.resubscribe();

      // checkLoggedInState();
    } else {                              // unknown error
      console.log(response);
    }
  }
  unsubscribe(subid,subIdName=null) {
    this.sendRequest({
      command: "unsubscribe",
      params: {
        subid: subid
      }
    })
    null !== subIdName  && this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, {[subIdName]:null}))
  }
  resubscribe(type=null) {
    if(type==='*'){
    this.subscriptions.forEach((subData, subId) => {

      // Zergling.subscribe(subData.request, subData.callback).then(function (response) {
      //   subData.callback(response.data);
      // });
      // //delete subscriptions[subId];   //clear previous data because we'll receive full data when resubscribing
    });
  }else{
    const {activeView,marketData,competitionData}=this.props.sportsbook, sidname=[]
    if(activeView ==='Live'||activeView ==='Prematch')
     {
       sidname.push('sportsubid')
       if(Object.keys(competitionData).length)
         sidname.push('inviewGamesubid')
       if(Object.keys(marketData).length)
         sidname.push('inviewMarketsubid')
      }
       else if(activeView ==='Home'){
          // sidname.push('pgSID')
          sidname.push('liveNowSubId')
          sidname.push('upcomingSubId')
          // sidname.push('pcSID')
       }
       for(let id in sidname){
         const subid = this.props.sportsbook[sidname[id]]
         void 0 !== this.props.sportsbook.subscriptions[subid] && this.sendRequest(this.props.sportsbook.subscriptions[subid].request)
       }
  }
  this.setState({canResubscribe:false})
  }
  bulkUnsubscribe(subsArr, base = false) {
    let subs = [], subsStates = {},individaulSub={}, data = base ? this.subscriptions : subsArr
    Object.keys(data).forEach((sub) => {
      // subsStates[data[sub].subStateVarName] = null
      // individaulSub[data[sub]]=null
      subs.push(data[sub].subid)
      // delete this.subscriptions[sub]
      
    })
    this.sendRequest({
      command: "unsubscribe_bulk",
      params: {
        subids: subs
      }
    })
    // base && (individaulSub = {inviewMarketsubid:null,
    //   subid:null,
    //   inviewGamesubid:null,
    //   sportsubid:null,
    //   upcomingSubId:null,
    //   liveNowSubId:null,})
    this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, {subscriptions:this.subscriptions,...subsStates}))
  }
  handleLiveNow(data) {
    let subscriptions = this.subscriptions;
    const { liveNowSubId } = this.props.sportsbook
    if (liveNowSubId !== null && liveNowSubId !== undefined)
      if (subscriptions[liveNowSubId]) {
        this.unsubscribe(liveNowSubId)
        delete subscriptions[liveNowSubId]
      }
    subscriptions[data.subid] = { subid: data.subid, callback: (data) => this.handleSportUpdate(data,'homeData',HOME_DATA, 'liveNowData'), subStateVarName: 'liveNowSubId',request:this.rids[data.rid].request  }
    this.subscriptions = subscriptions
    this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { liveNowSubId: data.subid}))
    this.props.dispatch(allActionDucer(HOME_DATA, {liveNowData: data.data, loadLiveNow: false }))
  }
  handleUpcoming(data) {

    let subscriptions = this.subscriptions;
    const { upcomingSubId } = this.props.sportsbook
    if (upcomingSubId !== null && upcomingSubId !== undefined)
      if (subscriptions[upcomingSubId]) {
        this.unsubscribe(upcomingSubId)
        delete subscriptions[upcomingSubId]
      }
    subscriptions[data.subid] = { subid: data.subid, callback: (data) => this.handleSportUpdate(data,'homeData',HOME_DATA, 'upcomingData'), subStateVarName: 'upcomingSubId' ,request:this.rids[data.rid].request }
    this.subscriptions = subscriptions
    this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { upcomingSubId: data.subid}))
    this.props.dispatch(allActionDucer(HOME_DATA, {upcomingData: data.data, loadUpcomingEvents: false }))
  }
  isLowBalance(){
    clearTimeout(this.isLowBalanceTimeout)
    this.isLowBalanceTimeout = setTimeout(()=>{this.props.dispatch(allActionDucer(SPORTSBOOK_ANY,{lowBalance:false}))},5000)
  }
  addEventToSelection(game, market, event,extra) { 
    let {activeView,isLoggedIn}=this.props.appState, {betSelections}=this.props.betslip,{selectionSub} = this.props.sportsbook,{isQuickBet,quickBetStake}=this.props.liveData,dispatch=this.props.dispatch,betSelectionsClone = { ...betSelections }
      let stateData = {}, betSlen = Object.keys(betSelectionsClone).length;
      if(isQuickBet && activeView==='Live'){
          if(!isLoggedIn){
            makeText('You must login first in order to use quick bet')
            return
          }
          if (quickBetStake > 0) {
            const profile = this.props.profile
            let isLowBalance= (profile.bonus === '0.00' && parseFloat(profile.balance).toFixed(2)<quickBetStake)||(parseFloat(profile.bonus)>0 &&parseFloat(profile.games.split(',').includes('1')?profile.bonus:'0').toFixed(2) < quickBetStake) ? true : false,state = {}
            if(isLowBalance){
              state.showBetSlipNoty= isLowBalance
              state.lowBalance = isLowBalance
              state.betSlipNotyMsg= profile.bonus === '0.00'?<View><Text trans="">Insufficient balance <Text >Deposit</Text></Text></View>:<View><Text>Insufficient bonus balance, consume bonus in order to use main balance</Text></View>
              state.betSlipNotyType='warning'
                clearTimeout(this.isLowBalanceTimeout)
                this.isLowBalanceTimeout = setTimeout(()=>{this.props.dispatch(allActionDucer(BETSLIP,{lowBalance:false,showBetSlipNoty:false,betSlipNotyMsg:'',betSlipNotyType:''}))},8000)
              
            }else{
              clearTimeout(this.isLowBalanceTimeout)
              state.betInprogress=true
              this.placeQuickBet({ event_id: event.id, price: event.price })
            }
            
            this.props.dispatch(allActionDucer(BETSLIP, state))
            
          } else {
            this.props.dispatch(allActionDucer(BETSLIP, { isQuickBetStakeZero: true,showBetSlipNoty: true,betSlipNotyType:'error', betSlipNotyMsg:'Stake is required for bet' }))
            clearTimeout(this.isQuickBetStakeZeroTimeout)
            this.isQuickBetStakeZeroTimeout = setTimeout(() => {
              dispatch(allActionDucer(BETSLIP, { isQuickBetStakeZero: false,betInprogress:false }))
            }, 5000)
          }
        
        return
      }
      if (betSelectionsClone[market.id] && betSelectionsClone[market.id].eventId === event.id) {
          Object.keys(betSelectionsClone).forEach((sID,k)=>{
          if(parseInt(sID,10)!==market.id){
            let newconflicts=betSelectionsClone[sID].conflicts.slice(0)
            for(let conflict in newconflicts){
             if(newconflicts[conflict].marketId ===market.id){
              betSelectionsClone[sID].conflicts.splice(parseInt(conflict),1)
             }
          }
        }
      })
        delete betSelectionsClone[market.id]
        betSlen = Object.keys(betSelectionsClone).length
      } else {
        let conflicts = []
        if (betSelectionsClone[market.id]) {
          stateData.changingOutcome = true
          stateData.showBetSlipNoty = true
          stateData.betSlipNotyMsg = 'Selection outcome has changed'
          stateData.betSlipNotyType = 'warning'
          clearTimeout(this.changingOutcomeTimeout)
          this.changingOutcomeTimeout = setTimeout(() => {
            dispatch(allActionDucer(SPORTSBOOK_ANY,{ changingOutcome: false }));
          }, 5000);
        }else{
          const mExpressID = void 0!==market.express_id?market.express_id:1
          Object.keys(betSelectionsClone).forEach((sID,k)=>{
              if(betSelectionsClone[sID].gameId === game.id && betSelectionsClone[sID].expressID===mExpressID){
                conflicts= conflicts.filter(data=>data.marketId !== betSelectionsClone[sID].marketId)
                conflicts.push({marketId:betSelectionsClone[sID].marketId,gameId:betSelectionsClone[sID].gameId,eventId:betSelectionsClone[sID].eventId,expressID:betSelectionsClone[sID].expressID})
                betSelectionsClone[sID].conflicts = betSelectionsClone[sID].conflicts.filter(data=>data.marketId !== market.id)
                betSelectionsClone[sID].conflicts.push({marketId:market.id,gameId:game.id,eventId:event.id,expressID:mExpressID})
              }
          })
        }
        betSelectionsClone[market.id] = {
          order: betSlen + 1, banker: false, betterPrice: 15, blocked: false, conflicts: conflicts, deleted: false,
          displayKey: market.display_key, eachWay: false, eventBases: null, eventId: event.id, ewAllowed: false, expMinLen: 1, gameId: game.id, suspended: 0,
          gamePointer: { game: game.id, competition: extra.competition, type: "0", region: null, sport: extra.sport, isLive: game.is_started }, hasCashout: market.cashout, incInSysCalc: true, isLive: game.is_started,
          marketId: market.id, marketName: market.name, marketType: market.type,expressID:void 0!==market.express_id?market.express_id:1, oddType: "odd", pick: event.name, price: event.price, priceChange: null, priceInitial: event.price, processing: false,
          singlePosWin: betSelectionsClone[market.id] && betSelectionsClone[market.id].singleStake !== "" ? event.price * betSelectionsClone[market.id].singleStake : 0, singleStake: "", start_ts: game.start_ts, team1Name: game.team1_name, flag: 0
        };
        betSelectionsClone[market.id].title = game.team1_name + `${game.team2_name ? ' - ' + game.team2_name : ''}`;
        if (game.team2_name) betSelectionsClone[market.id].team2Name = game.team2_name;
        if (market.base) betSelectionsClone[market.id].marketBase = event.base
      }
      betSlen = Object.keys(betSelectionsClone).length
      if(betSlen > 1) 
        stateData.betMode = 2
      else if (betSlen < 1)
          stateData.betStake = 0
      else{stateData.betMode = 1;stateData.showFirsttime =true}

      if (selectionSub) {
        this.unsubscribe(selectionSub)
        dispatch(allActionDucer(SPORTSBOOK_ANY, {selectionSub:null}))
      }
      stateData.betSelections = betSelectionsClone
      dispatch(allActionDucer(BETSLIP, stateData))
      dataStorage('betSlip', betSelectionsClone)
      betSlen > 0 && this.subscribeToSelection(betSelectionsClone)
      this.props.appState.isLoggedIn && this.getBetslipFreebets()
    
  }
  subscribeToSelection(betSelections) {
    let opts = { gameIDs: [], eventIDs: [], marketIDs: [] }
    Object.keys(betSelections).forEach((sel) => {
      if (typeof betSelections[sel] === 'object') {
        opts.gameIDs.push(betSelections[sel].gamePointer.game)
        opts.eventIDs.push(betSelections[sel].eventId)
        opts.marketIDs.push(betSelections[sel].marketId)
      }
    })

    this.rids[10].request = {
      command: "get",
      params: {
        source: "betting",
        what: { event: [] },
        where: {
          game: {
            id: { "@in": opts.gameIDs }
          },
          market: { id: { "@in": opts.marketIDs } },
          event: { id: { "@in": opts.eventIDs } }
        },
        subscribe: true
      }, rid: 10
    }
    let newRid = {}
    newRid[10]=this.rids[10]
    this.props.dispatch(allActionDucer(RIDS_PUSH,newRid))
    this.sendRequest(this.rids[10].request)
  }
  handleSportUpdate(data,store_name,store_id, data_name) {
    if (data === null || data === undefined)
      return
    let sportData = this.props[store_name][data_name]
    if (sportData.sport) {
      null!==data.sport  && void 0 !== data.sport && Object.keys(data.sport).forEach((gameID) => {
        if (sportData.sport[gameID]) {
          if (null !== data.sport[gameID]) {
            Object.keys(data.sport[gameID]).forEach((gameItem) => {
              if (sportData.sport[gameID][gameItem]) {
                if (!(data.sport[gameID][gameItem] instanceof Object)) {
                  if (data.sport[gameID][gameItem] !== sportData.sport[gameID][gameItem]) {
                    sportData.sport[gameID][gameItem] = data.sport[gameID][gameItem]
                  }
                }
                else {
                  Object.keys(data.sport[gameID][gameItem]).forEach((marketEventId) => {
                    if (sportData.sport[gameID][gameItem][marketEventId]) {
                      if (!(data.sport[gameID][gameItem][marketEventId] instanceof Object)) {

                        if (data.sport[gameID][gameItem][marketEventId] !== sportData.sport[gameID][gameItem][marketEventId]) {
                          sportData.sport[gameID][gameItem][marketEventId] = data.sport[gameID][gameItem][marketEventId]
                        }
                      } else {
                        Object.keys(data.sport[gameID][gameItem][marketEventId]).forEach((EventId) => {
                          if (sportData.sport[gameID][gameItem][marketEventId][EventId]) {
                            if (!(data.sport[gameID][gameItem][marketEventId][EventId] instanceof Object)) {

                              if (data.sport[gameID][gameItem][marketEventId][EventId] !== sportData.sport[gameID][gameItem][marketEventId][EventId]) {
                                sportData.sport[gameID][gameItem][marketEventId][EventId] = data.sport[gameID][gameItem][marketEventId][EventId]
                              }
                            } else {
                              Object.keys(data.sport[gameID][gameItem][marketEventId][EventId]).forEach((eventKey) => {
                                if (sportData.sport[gameID][gameItem][marketEventId][EventId][eventKey]) {
                                  if (!(data.sport[gameID][gameItem][marketEventId][EventId][eventKey] instanceof Object)) {

                                    if (data.sport[gameID][gameItem][marketEventId][EventId][eventKey] !== sportData.sport[gameID][gameItem][marketEventId][EventId][eventKey]) {
                                      sportData.sport[gameID][gameItem][marketEventId][EventId][eventKey] = data.sport[gameID][gameItem][marketEventId][EventId][eventKey]
                                    }
                                  } else {
                                    Object.keys(data.sport[gameID][gameItem][marketEventId][EventId][eventKey]).forEach((eventKey1) => {
                                      if (sportData.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1]) {
                                        if (!(data.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1] instanceof Object)) {

                                          if (data.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1] !== sportData.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1]) {
                                            sportData.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1] = data.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1]
                                          }
                                        } else {
                                          Object.keys(data.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1]).forEach((eventKey2) => {
                                            if (sportData.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2]) {
                                              if (!(data.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2] instanceof Object)) {
                                                if (null === data.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2]) {
                                                  // toDo : load new live game

                                                  if (this.state.activeGame && eventKey2 === this.state.activeGame.id) {

                                                    this.setState({ activeGameSuspended: true })
                                                  }
                                                }
                                                if (data.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2] !== sportData.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2]) {
                                                  sportData.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2] = data.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2]

                                                  if (this.state.activeGame && (eventKey2 === this.state.activeGame.id && this.state.activeGameSuspended)) {
                                                    this.setState({ activeGameSuspended: false })
                                                  }
                                                }
                                              } else {
                                                Object.keys(data.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2]).forEach((eventKey3) => {
                                                  if (sportData.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3]) {
                                                    if (!(data.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3] instanceof Object)) {

                                                      if (data.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3] !== sportData.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3]) {
                                                        sportData.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3] = data.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3]
                                                      }
                                                    } else {

                                                      Object.keys(data.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3]).forEach((eventKey4) => {
                                                        if (sportData.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4]) {
                                                          if (!(data.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4] instanceof Object)) {

                                                            if (data.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4] !== sportData.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4]) {
                                                              sportData.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4] = data.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4]
                                                            }
                                                          } else {
                                                            Object.keys(data.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4]).forEach((eventKey5) => {
                                                              if (sportData.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4][eventKey5]) {
                                                                if (!(data.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4][eventKey5] instanceof Object)) {

                                                                  if (data.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4][eventKey5] !== sportData.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4][eventKey5]) {
                                                                    sportData.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4][eventKey5] = data.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4][eventKey5]
                                                                  }
                                                                } else {
                                                                  Object.keys(data.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4][eventKey5]).forEach((eventKey6) => {
                                                                    if (sportData.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4][eventKey5][eventKey6]) {
                                                                      if (!(data.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4][eventKey5][eventKey6] instanceof Object)) {

                                                                        if (data.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4][eventKey5][eventKey6] !== sportData.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4][eventKey5][eventKey6]) {
                                                                          sportData.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4][eventKey5][eventKey6] = data.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4][eventKey5][eventKey6]
                                                                        }
                                                                      } else {
                                                                        Object.keys(data.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4][eventKey5][eventKey6]).forEach((eventKey7) => {
                                                                          if (sportData.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4][eventKey5][eventKey6][eventKey7]) {
                                                                            if (!(data.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4][eventKey5][eventKey6][eventKey7] instanceof Object)) {

                                                                              if (data.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4][eventKey5][eventKey6][eventKey7] !== sportData.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4][eventKey5][eventKey6][eventKey7]) {
                                                                                sportData.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4][eventKey5][eventKey6].initialPrice = sportData.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4][eventKey5][eventKey6][eventKey7]
                                                                                sportData.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4][eventKey5][eventKey6][eventKey7] = data.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4][eventKey5][eventKey6][eventKey7]
                                                                              }
                                                                            } else {
                                                                              Object.keys(data.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4][eventKey5][eventKey6][eventKey7]).forEach((eventKey8) => {
                                                                                if (sportData.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4][eventKey5][eventKey6][eventKey7][eventKey8]) {
                                                                                  if (!(data.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4][eventKey5][eventKey6][eventKey7][eventKey8] instanceof Object)) {

                                                                                    if (data.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4][eventKey5][eventKey6][eventKey7][eventKey8] !== sportData.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4][eventKey5][eventKey6][eventKey7][eventKey8]) {
                                                                                      sportData.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4][eventKey5][eventKey6][eventKey7][eventKey8] = data.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4][eventKey5][eventKey6][eventKey7][eventKey8]
                                                                                    }
                                                                                  } else {
                                                                                    Object.keys(data.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4][eventKey5][eventKey6][eventKey7][eventKey8]).forEach((eventKey9) => {
                                                                                      if (sportData.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4][eventKey5][eventKey6][eventKey7][eventKey8][eventKey9]) {
                                                                                        if (!(data.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4][eventKey5][eventKey6][eventKey7][eventKey8][eventKey9] instanceof Object)) {

                                                                                          if (data.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4][eventKey5][eventKey6][eventKey7][eventKey8][eventKey9] !== sportData.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4][eventKey5][eventKey6][eventKey7][eventKey8][eventKey9]) {
                                                                                            sportData.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4][eventKey5][eventKey6][eventKey7][eventKey8][eventKey9] = data.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4][eventKey5][eventKey6][eventKey7][eventKey8][eventKey9]
                                                                                          }
                                                                                        } else {
                                                                                          sportData.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4][eventKey5][eventKey6][eventKey7][eventKey8][eventKey9][Object.keys(sportData.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4][eventKey5][eventKey6][eventKey7][eventKey8][eventKey9])[0]] =
                                                                                            data.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4][eventKey5][eventKey6][eventKey7][eventKey8][eventKey9][Object.keys(data.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4][eventKey5][eventKey6][eventKey7][eventKey8][eventKey9])[0]]
                                                                                        }
                                                                                      } else sportData.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4][eventKey5][eventKey6][eventKey7][eventKey8][eventKey9] = data.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4][eventKey5][eventKey6][eventKey7][eventKey8][eventKey9]
                                                                                    })
                                                                                  }
                                                                                } else sportData.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4][eventKey5][eventKey6][eventKey7][eventKey8] = data.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4][eventKey5][eventKey6][eventKey7][eventKey8]
                                                                              })
                                                                            }
                                                                          } else sportData.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4][eventKey5][eventKey6][eventKey7] = data.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4][eventKey5][eventKey6][eventKey7]
                                                                        })
                                                                      }
                                                                    } else sportData.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4][eventKey5][eventKey6] = data.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4][eventKey5][eventKey6]
                                                                  })
                                                                }
                                                              } else sportData.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4][eventKey5] = data.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4][eventKey5]
                                                            })
                                                          }
                                                        } else sportData.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4] = data.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3][eventKey4]
                                                      })

                                                    }
                                                  } else sportData.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3] = data.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3]
                                                })
                                              }
                                            } else sportData.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2] = data.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2]
                                          })
                                        }
                                      } else sportData.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1] = data.sport[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1]
                                    })
                                  }
                                } else sportData.sport[gameID][gameItem][marketEventId][EventId][eventKey] = data.sport[gameID][gameItem][marketEventId][EventId][eventKey]
                              })
                            }
                          } else sportData.sport[gameID][gameItem][marketEventId][EventId] = data.sport[gameID][gameItem][marketEventId][EventId]
                        })
                      }
                    } else sportData.sport[gameID][gameItem][marketEventId] = data.sport[gameID][gameItem][marketEventId]
                  })
                }
              } else sportData.sport[gameID][gameItem] = data.sport[gameID][gameItem]
            })
          } else sportData.sport[gameID] = data.sport[gameID]
        } else sportData.sport[gameID] = data.sport[gameID]
      })
      let newSPData = {}
      newSPData[data_name] = sportData
      this.props.dispatch(allActionDucer(store_id, newSPData))
    }
  }
  handleGameUpdate(data) {
    if (data === null || data === void 0)
      return

    let gameData = { ...this.props.sportsbook.competitionData }
    data.hasOwnProperty('sport') && Object.keys(data.sport).forEach((gameID) => {
       const sport=data.sport[gameID]
      if (sport) {
        if (null !== gameData[gameID] && void 0 !== gameData[gameID])
          Object.keys(sport).forEach((gameItem) => {
            if (gameData[gameID][gameItem]) {
              if (!(sport[gameItem] instanceof Object)) {
                if (sport[gameItem] !== gameData[gameID][gameItem]) {
                  gameData[gameID][gameItem] = sport[gameItem]
                }
              }
              else {
                Object.keys(sport[gameItem]).forEach((marketEventId) => {
                  if (gameData[gameID][gameItem][marketEventId]) {
                    if (!(sport[gameItem][marketEventId] instanceof Object)) {
                      if (sport[gameItem][marketEventId] !== gameData[gameID][gameItem][marketEventId]) {
                        gameData[gameID][gameItem][marketEventId] = sport[gameItem][marketEventId]

                      }
                    } else {
                      Object.keys(sport[gameItem][marketEventId]).forEach((EventId) => {
                        if (gameData[gameID][gameItem][marketEventId][EventId]) {
                          if (!(sport[gameItem][marketEventId][EventId] instanceof Object)) {
                            if (sport[gameItem][marketEventId][EventId] !== gameData[gameID][gameItem][marketEventId][EventId]) {
                              gameData[gameID][gameItem][marketEventId][EventId] = sport[gameItem][marketEventId][EventId]

                            }
                          } else {
                            Object.keys(sport[gameItem][marketEventId][EventId]).forEach((eventKey) => {
                              if (gameData[gameID][gameItem][marketEventId][EventId][eventKey]) {
                                if (!(sport[gameItem][marketEventId][EventId][eventKey] instanceof Object)) {
                                  if (sport[gameItem][marketEventId][EventId][eventKey] !== gameData[gameID][gameItem][marketEventId][EventId][eventKey]) {
                                    gameData[gameID][gameItem][marketEventId][EventId][eventKey] = sport[gameItem][marketEventId][EventId][eventKey]

                                  }
                                } else {
                                  Object.keys(sport[gameItem][marketEventId][EventId][eventKey]).forEach((eventKey1) => {
                                    if (gameData[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1]) {
                                      if (!(sport[gameItem][marketEventId][EventId][eventKey][eventKey1] instanceof Object)) {
                                        if (sport[gameItem][marketEventId][EventId][eventKey][eventKey1] !== gameData[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1]) {
                                          gameData[gameID][gameItem][marketEventId][EventId][eventKey].initialPrice = gameData[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1]
                                          gameData[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1] = sport[gameItem][marketEventId][EventId][eventKey][eventKey1]

                                        }
                                      } else {
                                        Object.keys(sport[gameItem][marketEventId][EventId][eventKey][eventKey1]).forEach((eventKey2) => {
                                          if (gameData[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2]) {
                                            if (!(sport[gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2] instanceof Object)) {
                                              if (sport[gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2] !== gameData[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2]) {
                                                gameData[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2] = sport[gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2]

                                              }
                                            } else {
                                              Object.keys(sport[gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2]).forEach((eventKey3) => {
                                                if (gameData[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3]) {
                                                  if (!(sport[gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3] instanceof Object)) {
                                                    if (sport[gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3] !== gameData[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3]) {

                                                      gameData[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3] = sport[gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3]

                                                    }
                                                  } else {
                                                    gameData[gameID][gameItem][marketEventId][EventId][eventKey][Object.keys(gameData[gameID][gameItem][marketEventId][EventId][eventKey])[0]] = sport[gameItem][marketEventId][EventId][eventKey][Object.keys(sport[gameItem][marketEventId][EventId][eventKey])[0]]

                                                  }
                                                } else gameData[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3] = sport[gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2][eventKey3]
                                              })
                                            }
                                          } else gameData[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2] = sport[gameItem][marketEventId][EventId][eventKey][eventKey1][eventKey2]
                                        })
                                      }
                                    } else gameData[gameID][gameItem][marketEventId][EventId][eventKey][eventKey1] = sport[gameItem][marketEventId][EventId][eventKey][eventKey1]
                                  })
                                }
                              } else gameData[gameID][gameItem][marketEventId][EventId][eventKey] = sport[gameItem][marketEventId][EventId][eventKey]
                            })
                          }
                        }
                        else gameData[gameID][gameItem][marketEventId][EventId] = sport[gameItem][marketEventId][EventId]
                      })
                    }
                  } else
                    gameData[gameID][gameItem][marketEventId] =  sport[gameItem][marketEventId]
                })
              }
            } else
              gameData[gameID][gameItem] = sport[gameItem]
          })
        else gameData[gameID] = sport
      } else gameData[gameID] = sport
    })
    this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { competitionData: gameData }))

  }
  handleMarketUpdate(data) {
    if (data === null || data === void 0)
     { 
      return 
      }
    data = data && data.hasOwnProperty('game')?data.game[Object.keys(data.game)[0]]:{}
    let  marketData = {...this.props.gameViewData.marketData},activeGame={...this.props.gameViewData.activeGame},dataclone = {...data};
    delete dataclone.market
    if (null !== activeGame) {
      dataclone && Object.keys(dataclone).forEach((gameDataKey) => {
        if (null !== dataclone[gameDataKey]) {
          if (activeGame[gameDataKey]) {
            if (!( dataclone[gameDataKey] instanceof Object)) {
              if (dataclone[gameDataKey] !== activeGame[gameDataKey]) {
                activeGame[gameDataKey] = dataclone[gameDataKey]
              }
            }else{
              Object.keys(dataclone[gameDataKey]).forEach((gameDataSubKey1) => {
                if (activeGame[gameDataKey][gameDataSubKey1]) {
                  if (!( dataclone[gameDataKey][gameDataSubKey1] instanceof Object)) {
                    if (dataclone[gameDataKey][gameDataSubKey1] !== activeGame[gameDataKey][gameDataSubKey1]) {
                      activeGame[gameDataKey][gameDataSubKey1] = dataclone[gameDataKey][gameDataSubKey1]
                    }
                  }else{
                    Object.keys(dataclone[gameDataKey][gameDataSubKey1]).forEach((gameDataSubKey2) => {
                      if (activeGame[gameDataKey][gameDataSubKey1][gameDataSubKey2]) {
                        if (!( dataclone[gameDataKey][gameDataSubKey1][gameDataSubKey2] instanceof Object)) {
                          if (dataclone[gameDataKey][gameDataSubKey1][gameDataSubKey2] !== activeGame[gameDataKey][gameDataSubKey1][gameDataSubKey2]) {
                            activeGame[gameDataKey][gameDataSubKey1][gameDataSubKey2] = dataclone[gameDataKey][gameDataSubKey1][gameDataSubKey2]
                          }
                        }else{
                          Object.keys(dataclone[gameDataKey][gameDataSubKey1][gameDataSubKey2]).forEach((gameDataSubKey3) => {
                            if (activeGame[gameDataKey][gameDataSubKey1][gameDataSubKey2][gameDataSubKey3]) {
                              if (!( dataclone[gameDataKey][gameDataSubKey1][gameDataSubKey2][gameDataSubKey3] instanceof Object)) {
                                if (dataclone[gameDataKey][gameDataSubKey1][gameDataSubKey2][gameDataSubKey3] !== activeGame[gameDataKey][gameDataSubKey1][gameDataSubKey2][gameDataSubKey3]) {
                                  activeGame[gameDataKey][gameDataSubKey1][gameDataSubKey2][gameDataSubKey3] = dataclone[gameDataKey][gameDataSubKey1][gameDataSubKey2][gameDataSubKey3]
                                }
                              }else{
                                Object.keys(dataclone[gameDataKey][gameDataSubKey1][gameDataSubKey2][gameDataSubKey3]).forEach((gameDataSubKey4) => {
                                  if (activeGame[gameDataKey][gameDataSubKey1][gameDataSubKey2][gameDataSubKey3][gameDataSubKey4]) {
                                    if (!( dataclone[gameDataKey][gameDataSubKey1][gameDataSubKey2][gameDataSubKey3][gameDataSubKey4] instanceof Object)) {
                                      if (dataclone[gameDataKey][gameDataSubKey1][gameDataSubKey2][gameDataSubKey3][gameDataSubKey4] !== activeGame[gameDataKey][gameDataSubKey1][gameDataSubKey2][gameDataSubKey3][gameDataSubKey4]) {
                                        activeGame[gameDataKey][gameDataSubKey1][gameDataSubKey2][gameDataSubKey3][gameDataSubKey4] = dataclone[gameDataKey][gameDataSubKey1][gameDataSubKey2][gameDataSubKey3][gameDataSubKey4]
                                      }
                                    }else{
                                      Object.keys(dataclone[gameDataKey][gameDataSubKey1][gameDataSubKey2][gameDataSubKey3][gameDataSubKey4]).forEach((gameDataSubKey5) => {
                                        if (activeGame[gameDataKey][gameDataSubKey1][gameDataSubKey2][gameDataSubKey3][gameDataSubKey4][gameDataSubKey5]) {
                                          if (!( dataclone[gameDataKey][gameDataSubKey1][gameDataSubKey2][gameDataSubKey3][gameDataSubKey4][gameDataSubKey5] instanceof Object)) {
                                            if (dataclone[gameDataKey][gameDataSubKey1][gameDataSubKey2][gameDataSubKey3][gameDataSubKey4][gameDataSubKey5] !== activeGame[gameDataKey][gameDataSubKey1][gameDataSubKey2][gameDataSubKey3][gameDataSubKey4][gameDataSubKey5]) {
                                              activeGame[gameDataKey][gameDataSubKey1][gameDataSubKey2][gameDataSubKey3][gameDataSubKey4][gameDataSubKey5] = dataclone[gameDataKey][gameDataSubKey1][gameDataSubKey2][gameDataSubKey3][gameDataSubKey4][gameDataSubKey5]
                                            }
                                          }
                                        }
                                      })
                                    }
                                  }
                                })
                              }
                            }
                          })
                        }
                      }
                    })
                  }
                }
              })
            }
          }
          else activeGame[gameDataKey] = dataclone[gameDataKey]
        }
        else activeGame[gameDataKey] = dataclone[gameDataKey]
      })
      this.props.dispatch(allActionDucer(GAME_VIEW, {activeGame:activeGame}))
      }
    if(data && data.hasOwnProperty('market') && data.market!==null){
       Object.keys(data.market).forEach((marketID) => {
      if (marketData[marketID]) {
        if (null !== data.market[marketID]) {
          Object.keys(data.market[marketID]).forEach((marketItem) => {
            if (marketData[marketID][marketItem]) {
              if (!(data.market[marketID][marketItem] instanceof Object)) {
                if (data.market[marketID][marketItem] !== marketData[marketID][marketItem]) {
                  marketData[marketID][marketItem] = data.market[marketID][marketItem]
                }
              } else {
                Object.keys(data.market[marketID][marketItem]).forEach((marketEventId) => {
                  if (marketData[marketID][marketItem][marketEventId]) {
                    if (!(data.market[marketID][marketItem][marketEventId] instanceof Object)) {
                      if (data.market[marketID][marketItem][marketEventId] !== marketData[marketID][marketItem][marketEventId]) {
                        marketData[marketID][marketItem][marketEventId] = data.market[marketID][marketItem][marketEventId]
                      }
                    } else {
                      Object.keys(data.market[marketID][marketItem][marketEventId]).forEach((EventId) => {
                        if (marketData[marketID][marketItem][marketEventId][EventId]) {
                          if (!(data.market[marketID][marketItem][marketEventId][EventId] instanceof Object)) {
                            if (data.market[marketID][marketItem][marketEventId][EventId] !== marketData[marketID][marketItem][marketEventId][EventId]) {
                              marketData[marketID][marketItem][marketEventId].initialPrice = marketData[marketID][marketItem][marketEventId][EventId]
                              marketData[marketID][marketItem][marketEventId][EventId] = data.market[marketID][marketItem][marketEventId][EventId]
                            }
                          } else {
                            Object.keys(data.market[marketID][marketItem][marketEventId][EventId]).forEach((eventKey) => {
                              if (marketData[marketID][marketItem][marketEventId][EventId][eventKey]) {
                                if (!(data.market[marketID][marketItem][marketEventId][EventId][eventKey] instanceof Object)) {
                                  if (data.market[marketID][marketItem][marketEventId][EventId][eventKey] !== marketData[marketID][marketItem][marketEventId][EventId][eventKey]) {
                                    marketData[marketID][marketItem][marketEventId][EventId][eventKey] = data.market[marketID][marketItem][marketEventId][EventId][eventKey]
                                  }
                                } else {
                                  Object.keys(data.market[marketID][marketItem][marketEventId][EventId][eventKey]).forEach((eventKey1) => {
                                    if (marketData[marketID][marketItem][marketEventId][EventId][eventKey][eventKey1]) {
                                      if (!(data.market[marketID][marketItem][marketEventId][EventId][eventKey][eventKey1] instanceof Object)) {
                                        if (data.market[marketID][marketItem][marketEventId][EventId][eventKey][eventKey1] !== marketData[marketID][marketItem][marketEventId][EventId][eventKey][eventKey1]) {
                                          marketData[marketID][marketItem][marketEventId][EventId][eventKey][eventKey1] = data.market[marketID][marketItem][marketEventId][EventId][eventKey][eventKey1]
                                        }
                                      }
                                    } else marketData[marketID][marketItem][marketEventId][EventId][eventKey][eventKey1] = data.market[marketID][marketItem][marketEventId][EventId][eventKey][eventKey1]
                                  })
                                }
                              } else marketData[marketID][marketItem][marketEventId][EventId][eventKey] = data.market[marketID][marketItem][marketEventId][EventId][eventKey]
                            })
                          }
                        } else marketData[marketID][marketItem][marketEventId][EventId] = data.market[marketID][marketItem][marketEventId][EventId]
                      })
                    }
                  } else marketData[marketID][marketItem][marketEventId] = data.market[marketID][marketItem][marketEventId]
                })
              }
            } else marketData[marketID][marketItem] = data.market[marketID][marketItem]
          })
        } else marketData[marketID] = data.market[marketID]
      } else marketData[marketID] = data.market[marketID]
    })
    this.props.dispatch(allActionDucer(GAME_VIEW, { marketData: marketData}))
    }
  }
  handleEventUpdate(data) {
    if (data === null || data === undefined)
      return 
    let betSelections = { ...this.props.betslip.betSelections };
    Object.keys(betSelections).forEach((gameID) => {
      if (void 0 !== data.event[betSelections[gameID].eventId] && null !== data.event[betSelections[gameID].eventId]) {
        if (betSelections[gameID].price !== data.event[betSelections[gameID].eventId].price) {
          betSelections[gameID].initialPrice = betSelections[gameID].price
          betSelections[gameID].price = data.event[betSelections[gameID].eventId].price
          if (betSelections[gameID].suspended) betSelections[gameID].suspended = 0
        }
      } else if (null === data.event[betSelections[gameID].eventId]) {
        betSelections[gameID].suspended = 1
      }
    })
    dataStorage('betSlip', {}, 0)
    .then(storeSlip=>{
      if (storeSlip) {storeSlip =JSON.parse(storeSlip); storeSlip.bets = betSelections; dataStorage('betSlip', storeSlip.bets) }
    })
    
    this.props.dispatch(allActionDucer(BETSLIP, { betSelections: betSelections }))
  }

  getConfig() {
    this.rids[4].request = {
      command: "get",
      params: {
        source: "partner.config",
        what: { partner: [] },
        subscribe: true
      }, rid: 4
    }
    this.sendRequest(this.rids[4].request)
  }
  placeQuickBet(data) {
    let params = {
      command: "do_bet",
      params: {
        source:1,
        type: 1,
        mode: this.props.betslip.acceptMode,
        amount: this.props.betslip.quickBetStake,
        bets: [data]
      }, rid: 12
    }
    this.rids[12].request = params
    this.sendRequest(params)
  }
  betSuccess(data) {
     let rid = data.rid;
     data = data.data
    const { selectionSub} = this.props.sportsbook,{betSlipMode }=this.props.betslip,dispatch=this.props.dispatch
    if (betSlipMode === 2) {
      dispatch(allActionDucer(BETSLIP, {showBetSlipNoty: true,betSlipNotyType:'success', betSlipNotyMsg:'Your bet is accepted' , betPlaced: true, betInprogress: false }))
      clearTimeout(this.betPlacedTimeout)
      this.betPlacedTimeout = setTimeout(() => {
        dispatch(allActionDucer(BETSLIP, { betPlaced: false,betSelections: {} }));
        dataStorage('betSlip', {}, 2)
      }, 5000);
      this.props.dispatch(allActionDucer(BETSLIP, {betMode: 1, betStake: 0 }))
      selectionSub && this.unsubscribe(selectionSub) && dispatch(allActionDucer(SPORTSBOOK_ANY, { selectionSub: null }))
    } else {
      dispatch(allActionDucer(BETSLIP, { betInprogress: false }))
      this.showBookingID(data,rid)
    }
  }
  betFailed(code) {

    let stateData = {showBetSlipNoty: true, betFailed: true,betSlipNotyMsg: this.swarmErrors[code], betInprogress: false },dispatch=this.props.dispatch
    switch (code) {
      case 1800:
        stateData.isOddChange = true;
        break;

      default:
        break;
    }
    dispatch(allActionDucer(BETSLIP, {...stateData,betSlipNotyType:stateData.isOddChange?'warning':'error'}))

    if(!stateData.isOddChange) {
    clearTimeout(this.betFailedTimeout)
    this.betFailedTimeout = setTimeout(() => {
      dispatch(allActionDucer(BETSLIP, { betFailed: false}));
    }, 5000);}

  }
  showBookingID(data,rid) {
    let dispatch=this.props.dispatch
      dispatch(allActionDucer(BETSLIP, { bookingNumber: data.details.number }))
      // dataStorage('bookingNumber', data.details.number)
  }
  clearSearch() {
    this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { searchData: {}, searching: false }))
  }
  validate(e, r, callback) {
    this.checkBetTicket(e, r, callback)
  }

  popularInSportsBook(type, event = false) {
    let request = {
      command: "get",
      params: {
        source: "betting",
        what: { sport: ["id", "name", "alias", "order"], region: ["id", "name", "alias", "order"], competition: ["id", "order", "name"] },
        where: {},
        subscribe: true
      }
    }
    switch (type) {
      case 'game':
        request.rid = 15; request.params.what.game = "id team1_id team2_id team1_name team2_name type order start_ts favorite_order is_live type".split(" "); request.params.where.game = { type: { "@in": [0, 2] }, promoted: !0 }
        if (event) {
          request.params.what.market = []
          request.params.what.event = []
          request.params.where.market = { display_key: "WINNER", display_sub_key: "MATCH" }
        }

        this.rids[15].request = request
        break;
      case 'competition':
        request.rid = 16; request.params.what.competition.push("favorite_order"); request.params.where.competition = { favorite: !0 }
        this.rids[16].request = request
        break;

      default:
        break;
    }
    let newRid = {}
    newRid[16]=this.rids[16]
    this.props.dispatch(allActionDucer(RIDS_PUSH,newRid))
    this.sendRequest(request)
  }

  loadHomeData() {
    this.popularInSportsBook('game', true)
    // this.popularInSportsBook('competition')
    this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { viewmode: 0 }))
    // this.rids[7].request = {
    //   "command": "get",
    //   "params": {
    //     "source": "betting",
    //     "what": { "sport": [], "region": [], "competition": [], "game": [] },
    //     "where": { "sport": { "type": { "@ne": 1 } }, "game": { "type": { "@in": this.props.sportsbook.Prematch } } },
    //     "subscribe": true
    //   }, rid: 7
    // }
    // this.sendRequest(this.rids[7].request)
  }

  checkBetTicket(id, googleAuthKey, callback) {
    let ridStart = parseInt(Object.keys(this.rids)[Object.keys(this.rids).length - 1]) + 1, ticketNumber = parseInt(id, 10)
    this.rids[ridStart] = {
      rid: ridStart, callback: callback, request: {
        command: "check_bet_status",
        params: {
          g_recaptcha_response: googleAuthKey
        }, rid: ridStart
      }
    }
    15 > id.length ? this.rids[ridStart].request.params.bet_id = ticketNumber : this.rids[ridStart].request.params.ticket_number = ticketNumber
    let newRid = {}
      newRid[ridStart]=this.rids[ridStart]
      this.props.dispatch(allActionDucer(RIDS_PUSH,newRid))
    this.sendRequest(this.rids[ridStart].request)
  }
  formatRetrivalRs(data, callback) {
    let betSelections = {}
    data = data.data
    data.data && data.data.sport &&
      Object.keys(data.data.sport).forEach((sp, i) => {
        let reg = data.data.sport[sp].region
        reg !== null && Object.keys(reg).forEach((rg, i) => {
          let sreg = reg[rg]
          sreg !== null && Object.keys(sreg.competition).forEach((c) => {
            let scom = sreg.competition[c]
            scom.game !== null && Object.keys(scom.game).forEach((g) => {
              let sg = scom.game[g]
              if (sg.market) {
                //  delete emarket.event
                sg.market !== null && Object.keys(sg.market).forEach((sm) => {
                  let emarket = { ...sg.market[sm] }
                  delete emarket.event
                  sg.market[sm] && Object.keys(sg.market[sm].event).forEach((ev) => {
                    let sev = sg.market[sm].event[ev]
                    if (sev) {
                      betSelections[sg.id] = {
                        order: Object.keys(betSelections).length + 1, banker: false, betterPrice: 15, blocked: false, conflicts: [], deleted: false,
                        displayKey: emarket.display_key, eachWay: false, eventBases: null, eventId: sev.id, ewAllowed: false, expMinLen: 1, gameId: sg.id, suspended: 0,
                        gamePointer: { game: sg.id, sport: data.data.sport[sp].id, competition: null, type: "0", region: null, alias: data.data.sport[sp].alias, isLive: sg.is_started }, hasCashout: emarket.cashout, incInSysCalc: true, isLive: sg.is_started,
                        marketId: emarket.id, marketName: emarket.name, marketType: emarket.type, oddType: "odd", pick: sev.name, price: sev.price, priceChange: null, priceInitial: sev.price, processing: false,
                        singlePosWin: betSelections[sg.id] && betSelections[sg.id].singleStake !== "" ? sev.price * betSelections[sg.id].singleStake : 0, singleStake: "", start_ts: sg.start_ts, team1Name: sg.team1_name, flag: 0
                      };
                      betSelections[sg.id].title = sg.team1_name + `${sg.team2_name ? ' - ' + sg.team2_name : ''}`
                      if (sg.team2_name) betSelections[sg.id].team2Name = sg.team2_name
                      if (emarket.base) betSelections[sg.id].marketBase = sev.base
                    }
                  })
                })
              }
            })
          })
        })
      })
    if (Object.keys(betSelections).length > 0) {
      this.props.dispatch(allActionDucer(BETSLIP, { betSelections: betSelections }))
      this.subscribeToSelection(betSelections) && scrollToBottom()
      dataStorage('betSlip', betSelections)
      callback()
    }

  }
  retrieve(data, callbackFn) {
    if (data.data.details && data.data.details.selection_ids) {
      const { selectionSub } = this.props.sportsbook
      this.props.dispatch(allActionDucer(BETSLIP, { betSelections: {}, betMode: 1, betStake: 0 }))
      dataStorage('betSlip', {}, 2)
      selectionSub && this.unsubscribe(selectionSub) && this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { selectionSub: null }))
      let ridStart = parseInt(Object.keys(this.rids)[Object.keys(this.rids).length - 1]) + 1
      let newRid = {}
      newRid[ridStart]= {
        rid: ridStart, callback: (d) => { this.formatRetrivalRs(d, () => data.data.details.amount > 0 && this.props.dispatch(allActionDucer(BETSLIP, { betStake: nudata.data.details.amountll }))) }, request: {
          command: "get",
          params: {
            source: "betting",
            what: {
              sport: ["id", "name", "alias", "order"],
              competition: ["id", "order", "name"],
              region: ["id", "name", "alias"],
              game: "id start_ts team1_id team1_name team2_id team2_name type".split(" "),
              market: ["base", "type", "name", "express_id", "id"],
              event: []
            },
            where: {
              event: {
                id: {
                  "@in": data.data.details.selection_ids
                }
              }
            }
          }, rid: ridStart
        }
      }
      this.props.dispatch(allActionDucer(RIDS_PUSH,newRid))
      this.sendRequest(newRid[ridStart].request)
      callbackFn({ details: { state: null, reason: 'Booking Found',betType: data.data.details.bet_type} })
    } else callbackFn({ details: { state: 1, reason: typeof data.data === 'string' ? data.data : 'Booking not found'} })
  }
  getEvents(id, callback) {
    let ridStart = parseInt(Object.keys(this.rids)[Object.keys(this.rids).length - 1]) + 1,newRid = {}
    newRid[ridStart] = {
      rid: ridStart, callback: (data) => { this.retrieve(data, callback) }, request: {
        "command": "get_events_by_booking_id",
        "params": {
          "booking_id": parseInt(id, 10)
        }, rid: ridStart
      }
    }
    this.props.dispatch(allActionDucer(RIDS_PUSH,newRid))
    this.sendRequest(newRid[ridStart].request)
  }

  getBetHistory(where = null) {
    this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { loadingHistory: true }))
    this.rids[14].request = {
      "command": "bet_history",
      "params": {
        "where": {
          // use case 1
          "from_date": moment().unix() - 3600 * 24,
          "to_date": moment().unix(),
          // "outcome":0,
          // "bet_type":1,
          // "bet_id": 910891367,
          // "cashoutable": true,
          // "only_counts": true
        }
      }, rid: 14
    }
    if (null !== where) {
      this.rids[14].request.params.where = where
    }
    this.sendRequest(this.rids[14].request)
  }
  _splashScreen(){
    return(
      <View style={{flex:1,justifyContent:'center',alignItems:'center',position:'relative'}}>
        <Image source={require('./APP/images/splashScreen.png')} style={{width:300,height:300}}/>
        <View style={{position:'absolute',bottom:10}}>
          <Text style={{fontStyle:'italic',fontSize:14,color:'#0e5362'}}>www.Your Company.com</Text>
        </View>
      </View>
    )
  }
  _appView(){
    return(
          <DrawerNav />
    )
  }
  render() {
    return (
      <>
      {this._appView()}
      </>
    );
  }
}
