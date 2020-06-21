import React, {PureComponent} from 'react'
import { BetSlipNotification, OddsType, OddsSettings } from '../stateless'
import { oddConvert, dataStorage, viewStyles, gridStyles} from '../../common'
import { SPORTSBOOK_ANY, MODAL, RIDS_PUSH, BETSLIP, LIVE_DATA } from '../../actionReducers'
import { allActionDucer } from '../../actionCreator'
import { View,FlatList,Text,TouchableNativeFeedback,TouchableOpacity, Modal,ActivityIndicator,TextInput, KeyboardAvoidingView, ScrollView,Clipboard, TouchableWithoutFeedback } from 'react-native'
import { Fab, Badge, Item, Picker, Icon, CheckBox,Form, Input} from 'native-base'
import CustomIcon from '../customIcon'
import { makeText } from '../../utils'
import { Share } from 'react-native'
export default class Controls extends PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      config: this.props.sportsbook.config,
      showFirsttime:true,
      showMatchDetails:false,
      details: {},
      matchInfoRef:null,
      isBetSlipOpen:false
    }
    this.betselectionRef=null;
    this.sys_bet = []    
    this.sys_bet_result = { win: 0, options: 0 }
    this.rids = this.props.sportsbook.rids
    this.placeBet = this.placeBet.bind(this)
    this.shareToSocialMedia = this.shareToSocialMedia.bind(this)
    this.bookBet = this.bookBet.bind(this)
    this.onOddsTypeChange = this.onOddsTypeChange.bind(this)
    this.setSingleBetStake = this.setSingleBetStake.bind(this)
    this.setBetStake = this.setBetStake.bind(this)
    this.cannotPlaceBet = this.cannotPlaceBet.bind(this)
    this.onFocus = this.onFocus.bind(this)
    this.onFocusLost = this.onFocusLost.bind(this)
    this.onClear = this.onClear.bind(this)
    this.onClearSingle = this.onClearSingle.bind(this)
    this.onOddsSettingsChange = this.onOddsSettingsChange.bind(this)
    this.betslipToggleView = this.betslipToggleView.bind(this)
    this.openBetslipSettings = this.openBetslipSettings.bind(this)
    this.hideNoty = this.hideNoty.bind(this)
    this.showMatchDetails = this.showMatchDetails.bind(this)
    this.hideMatchDetails = this.hideMatchDetails.bind(this)
    this._renderItem = this._renderItem.bind(this)
    this.betslipbody= null
    this.searchTicketInput= null
    this.recaptchaValue= null
    this.recaptch_value= null
    this.retrieveBookingInput= null
    this.notifyTimeout= null
    this.isLowBalanceTimeout= null
  }
  componentDidMount() {
    const {betSelections,betMode,sys_bet_variant} = this.props.betslip
    if (Object.keys(betSelections).length === 1 && betMode !== 1)
      this.changeBetMode(1, true)
    if (Object.keys(betSelections).length > 1 && Object.keys(betSelections).length < 3 && betMode === 3)
      this.changeBetMode(2, true)
    if (Object.keys(betSelections).length > 16 && betMode === 3)
      this.changeBetMode(2, true)
    if (null === sys_bet_variant && this.sys_bet.length > 0) {
      if (JSON.stringify(sys_bet_variant) !== JSON.stringify(this.sys_bet[0]))
        this.setSysBetVariant(JSON.stringify(this.sys_bet[0]))
    }

  }
 componentWillUnmount(){
  clearTimeout(this.notifyTimeout)
  clearTimeout(this.isLowBalanceTimeout)
  clearTimeout(this.animationTimeout)
  clearTimeout(this.minBetStakesTimeout)
  clearTimeout(this.maxOddForMultiBetTimeout)
  clearTimeout(this.maxSelectionForMultiBetTimeout)
 }
  componentDidUpdate() {
    const {betSelections,
      betMode,showBetSlipNoty,isOddChange,lowBalance,
      sys_bet_variant} = this.props.betslip
    if (Object.keys(betSelections).length === 1 && betMode !== 1)
      this.changeBetMode(1, true)
    if (Object.keys(betSelections).length > 1 && Object.keys(betSelections).length < 3 && betMode === 3)
      this.changeBetMode(2, true)
    if (Object.keys(betSelections).length > 16 && betMode === 3)
      this.changeBetMode(2, true)
    if (null === sys_bet_variant && this.sys_bet.length > 0) {
      if (JSON.stringify(sys_bet_variant) !== JSON.stringify(this.sys_bet[0]))
        this.setSysBetVariant(JSON.stringify(this.sys_bet[0]))
    }
    if(showBetSlipNoty &&!lowBalance && !isOddChange && !this.notifyTimeout){ 
      this.notifyTimeout = setTimeout(()=>{ this.notifyTimeout=null;this.props.dispatch(allActionDucer(BETSLIP,{showBetSlipNoty:false,betSlipNotyMsg:'',betSlipNotyType:''}))},5000)
    }
    // if(Object.keys(betSelections).length>3 && this.betselectionRef!==null)this.betselectionRef.scrollToEnd({animated:true})
  }
  showMatchDetails(e,d){
     let viewportOffset =document.getElementById(e.target.id).getBoundingClientRect(),top = viewportOffset.top,left = (viewportOffset.left-viewportOffset.right)+75 ;
    this.setState({matchInfoRef:e,showMatchDetails:true,details:{match:d,top:top,left:left}})
  }
  hideMatchDetails(){
    this.setState({matchInfoRef:null,showMatchDetails:false,details:{}})
  }
  isLowBalance(){
    clearTimeout(this.isLowBalanceTimeout)
    this.isLowBalanceTimeout = setTimeout(()=>{this.props.dispatch(allActionDucer(BETSLIP,{lowBalance:false}))},7000)
  }
  hideNoty(){
    this.props.dispatch(allActionDucer(BETSLIP,{showBetSlipNoty:false,betSlipNotyMsg:'',betSlipNotyType:''}))
    clearTimeout(this.notifyTimeout)
    this.notifyTimeout=null
  }
  onFocus(e){
    let el =document.querySelector(`#${e.target.id}`).closest(".keyboard-close")
    el.classList.add('open-keyboard-style')
  }
  onFocusLost(e){
    let el =document.querySelector(`#${e.target.id}`).closest(".keyboard-close")
    el.classList.remove('open-keyboard-style')
  }
  validate() {
    if (this.searchTicketInput && this.recaptchaValue) {
      this.setState({ searchingTicket: true })
      let val = this.searchTicketInput.value, rval = this.recaptchaValue.value
      if (val !== '' && rval !== '') {
        this.props.validate(val, rval, this.showCheckResult.bind(this))
        this.searchTicketInput.value = ''
        this.recaptchaValue.value = ''
      }
    }
  }
  shareToSocialMedia(opt){
    Share.share({
      title: opt.title,
      message: opt.message.toString(),
      url:opt.url
  }, { dialogTitle: 'Share Your Company Booking ID' }).catch(err => null)
  }
  closeBookingResult() {
    if (this.retrieveBookingInput) {
      this.props.dispatch(allActionDucer(BETSLIP,{ retrieveBooking: null, retrieveBookingLoading: false }))
    }
  }
  showCheckResult(data) {
    this.props.dispatch(allActionDucer(BETSLIP,{ checkResult: data.data.details ? data.data.details : { StateName: 'Ticket number not found' }, searchingTicket: false }))
  }
  checkBookingResult(data) {
    if(data.details.state ===null){
      this.changeBetMode({ target: { value: data.details.betType } })
      this.changeBetSlipMode(1)
    }
    this.retrieveBookingInput.value = ''
    data.details ? this.props.dispatch(allActionDucer(BETSLIP,{ retrieveBooking: data.details, retrieveBookingLoading: false })) : this.props.dispatch(allActionDucer(SPORTSBOOK_ANY,{ retrieveBookingLoading: false }))
  }
  changeBetMode(itemValue, manual = false) { 
    let betSelections = {...this.props.betslip.betSelections},{isLoggedIn} = this.props.appState
    if (Object.keys(betSelections).length > 0) {
      Object.keys(betSelections).forEach((betsele) => {
        if (betSelections[betsele].hasOwnProperty('booking_id'))
          delete betSelections[betsele].booking_id
      })
    dataStorage('betSlip', betSelections)
    }
    dataStorage('bookingNumber', null)
    this.props.dispatch(allActionDucer(BETSLIP,{ betMode: manual ? itemValue : parseInt(itemValue), betStake: 0, bookingNumber: null,enableFreebet:false }))
    this.props.sportsbook.sessionData.sid !== undefined && isLoggedIn && this.props.getBetslipFreebets()
    // betModeChange('betStake')
  }
  changeBetSlipMode(mode) {
    if (mode !== this.props.betslip.betSlipMode) {
      let {isLoggedIn} = this.props.appState
      this.props.sportsbook.sessionData.sid !== undefined && isLoggedIn && this.props.getBetslipFreebets()
      this.props.dispatch(allActionDucer(BETSLIP,{ betSlipMode: parseInt(mode),enableFreebet:false }))
    }
  }
  openBetslipSettings() {
    this.props.dispatch(allActionDucer(BETSLIP,{ isBetSlipOpen:false }))
    this.props.navigate('settings')
  }
  useQuickBet(e) {
    this.props.dispatch(allActionDucer(LIVE_DATA,{ isQuickBet: e.target.checked }))
  }
  useFreeBet(e) {
    let params = { enableFreebet: e.target.checked }
    // if(!e.target.checked) params.freeBetStake= null
    this.props.dispatch(allActionDucer(BETSLIP,params))
  }
  setFreeBetStake(e){   
    let {freeBetStake,freeBets} = this.props.betslip,stake = e
    if (freeBets[parseInt(stake)].id !== freeBetStake.id)
    this.props.dispatch(allActionDucer(BETSLIP,{ freeBetStake: freeBets[parseInt(stake)] }))
  }
  setSingleBetStake(gameId, event) {
    const {betSelections,lowBalance,betSlipMode} = this.props.betslip
    const stake = parseFloat(`${event}`).toFixed(2)
    if (stake > 0) {
      if (betSelections[gameId]) {
        betSelections[gameId].singleStake = stake
        betSelections[gameId].singlePosWin = stake * betSelections[gameId].price
      }
    } else {
      if (betSelections[gameId]){
        betSelections[gameId].singleStake = ""
        betSelections[gameId].singlePosWin = 0
        
      }

    }
     const profile = this.props.profile
     let state = { betSelections: betSelections, betStake: ""}
    if(betSlipMode !==1){
      let isLowBalance= (profile.bonus === '0.00' && parseFloat(profile.balance).toFixed(2)<stake)||(parseFloat(profile.bonus)>0 &&parseFloat(profile.games.split(',').includes('1')?profile.bonus:'0').toFixed(2) < stake) ? true : false
      if(isLowBalance && !lowBalance && this.props.appState.isLoggedIn){
        state.showBetSlipNoty= isLowBalance
        state.lowBalance = isLowBalance
        state.betSlipNotyMsg= profile.bonus === '0.00'?<View><Text trans="">Insufficient balance <Text 
         onPress={this.deposit.bind(this)} trans="">Deposit</Text></Text></View>:<View><Text trans="">Insufficient bonus balance, consume bonus in order to use main balance</Text></View>
        state.betSlipNotyType='warning'
        this.isLowBalance()
      }
      else{
        clearTimeout(this.notifyTimeout)
      }
    }

    this.props.dispatch(allActionDucer(BETSLIP,state))
    dataStorage('betSlip', betSelections)
    dataStorage('betStake', isNaN(stake) ? 0 : stake)
  }
  onClearSingle(gameId){
    const {betSelections,lowBalance,betSlipMode,betStake} = this.props.betslip
    if (betSelections[gameId]) {
      let oldStake = betSelections[gameId].singleStake,stake=isNaN(oldStake) ? 0 : oldStake,stakeString=stake.toString()
       stakeString = stakeString.substr(0,stakeString.length-1)
       if(stakeString!==''){
         stake = parseFloat(stakeString)
       }
    if (stake > 0) {
        betSelections[gameId].singleStake = stake
        betSelections[gameId].singlePosWin = stake * betSelections[gameId].price
      } else {
        betSelections[gameId].singleStake = ""
        betSelections[gameId].singlePosWin = 0
        
      }
      const profile = this.props.profile
      let state = { betSelections: betSelections, betStake: isNaN(stake) ? 0 : stake}
      if(betSlipMode !==1){
        let isLowBalance= (profile.bonus === '0.00' && parseFloat(profile.balance).toFixed(2)<stake)||(parseFloat(profile.bonus)>0 &&parseFloat(profile.games.split(',').includes('1')?profile.bonus:'0').toFixed(2) < stake) ? true : false
        if(isLowBalance && !lowBalance){
          state.showBetSlipNoty= isLowBalance
          state.lowBalance = isLowBalance
          state.betSlipNotyMsg= profile.bonus === '0.00'?<View><Text trans="">Insufficient balance <Text onPress={this.deposit.bind(this)} trans="">Deposit</Text></Text></View>:<View><Text trans="">Insufficient bonus balance, consume bonus in order to use main balance</Text></View>
          state.betSlipNotyType='warning'
          this.isLowBalance()
        }
        else{
          clearTimeout(this.notifyTimeout)
        }
      }
      
      this.props.dispatch(allActionDucer(BETSLIP,state))
      dataStorage('betSlip', betSelections)
      dataStorage('betStake', isNaN(stake) ? 0 : stake)
    }
  }
  setSysBetVariant(event) {
    this.props.dispatch(allActionDucer(BETSLIP,{ sys_bet_variant:JSON.parse(event) }))
  }

  placeBet() {
    let selectionArr = [], {betSelections,enableFreebet,freeBetStake,betMode,acceptMode,betStake,sys_bet_variant} = this.props.betslip,{config}=this.props.sportsbook, totalOdd = 0,dispatch=this.props.dispatch
    if (Object.keys(betSelections).length > 0) {
      dispatch(allActionDucer(BETSLIP,{ betInprogress: true,betSuccess:false,betFailed: false, isOddChange: false }))
      Object.keys(betSelections).forEach((selected) => {
        selectionArr.push({ event_id: betSelections[selected].eventId, price: betSelections[selected].price,stake:betSelections[selected].singleStake })
        totalOdd *= betSelections[selected].price
      })
      if (selectionArr.length) {
        let params = {
          command: "do_bet",
          params: {
            type: betMode,
            mode:acceptMode,
            amount: betStake,
            source: 1},rid:12}

        if (betMode === 1) {
          selectionArr.map((sele) => {
            if (sele.stake >= config.min_bet_stakes[config.currency] || enableFreebet) {
             params.params.amount= enableFreebet ? freeBetStake.amount:sele.stake;
             params.params.bets= [sele]

              if(enableFreebet){params.params.bonus_id = freeBetStake.id;params.params.wallet_type= 2}
              this.rids[12].request = params
              this.props.sendRequest(this.rids[12].request)
            }
            else {
              dispatch(allActionDucer(BETSLIP,{ showBetSlipNoty: true,betSlipNotyType:'warning', betSlipNotyMsg: 'Bet Amount is less than minimum ' + config.min_bet_stakes[config.currency], betInprogress: false }))

              clearTimeout(this.minBetStakesTimeout)
              this.minBetStakesTimeout = setTimeout(() => {
                dispatch(allActionDucer(BETSLIP,{ showBetSlipNoty: false }));
              }, 5000);
            }
             return true
          })
          return
        }
       params.params.amount= betStake;
       params.params.bets= selectionArr
        if(enableFreebet) {params.params.amount = freeBetStake.amount;params.params.bonus_id = freeBetStake.id;params.params.wallet_type= 2}
        if (betMode === 3) {
          params.params.sys_bet = sys_bet_variant.variant
          params.params.amount = Number.parseFloat(betStake * sys_bet_variant.bets).toFixed(2)
        }
        this.rids[12].request = params
        if ((betMode === 2 && totalOdd > config.max_odd_for_multiple_bet) || selectionArr.length > config.max_selections_in_multiple_bet) {
          if (totalOdd > config.max_odd_for_multiple_bet) {
            dispatch(allActionDucer(BETSLIP,{ showBetSlipNoty: true,betSlipNotyType:'warning', betSlipNotyMsg: 'Maximun odds for bet multiple bet (' + config.max_odd_for_multiple_bet + ') reached ', betInprogress: false }))

            clearTimeout(this.maxOddForMultiBetTimeout)
            this.maxOddForMultiBetTimeout = setTimeout(() => {
              dispatch(allActionDucer(BETSLIP,{ showBetSlipNoty: false }));
            }, 5000);
          }
          if (selectionArr.length > config.max_selections_in_multiple_bet) {
            dispatch(allActionDucer(BETSLIP,{ showBetSlipNoty: true,betSlipNotyType:'warning', betSlipNotyMsg: 'Maximum selection for Multiple bet is ' + config.max_selections_in_multiple_bet, betInprogress: false }))

            clearTimeout(this.maxSelectionForMultiBetTimeout)
            this.maxSelectionForMultiBetTimeout = setTimeout(() => {
              dispatch(allActionDucer(BETSLIP,{ showBetSlipNoty: false }));
            }, 5000);

          }
          return
        }
        if (enableFreebet || betStake >= config.min_bet_stakes[config.currency]) {
        let newRid = {};
        newRid[12]=this.rids[12];
        this.props.dispatch(allActionDucer(RIDS_PUSH,newRid));
        this.props.sendRequest(params)}
        else {
          dispatch(allActionDucer(BETSLIP,{ showBetSlipNoty: true,betSlipNotyType:'warning', betSlipNotyMsg: 'Bet Amount is less than minimum ' + config.min_bet_stakes[config.currency], betInprogress: false }))

          clearTimeout(this.minBetStakesTimeout)
          this.minBetStakesTimeout = setTimeout(() => {
            dispatch(allActionDucer(BETSLIP,{ showBetSlipNoty: false }));
          }, 5000);
        }
      }
    }
  }
  bookBet() {
    let selectionArr = [], {betSelections,betMode,betStake,sys_bet_variant}= this.props.betslip
    if (Object.keys(betSelections).length > 0) {
      this.props.dispatch(allActionDucer(BETSLIP,{ betInprogress: true }))
      Object.keys(betSelections).forEach((selected) => {
        selectionArr.push({ event_id: betSelections[selected].eventId, price: betSelections[selected].price,marketId:betSelections[selected].marketId })
      })
      if (selectionArr.length) {
        let params = {
          command: "book_bet",
          params: {
            type: betMode,
            source: 1,
            amount: betStake,
          }, rid: 12
        }
        if (selectionArr.length > 1 && betMode === 1) {
            selectionArr.map((sele) => {
              params.params.bets=[sele]
              params.rid = sele.marketId
              let newRid = {};
              newRid[sele.marketId]={rid:sele.marketId,callback:this.props.handleBetResponse,request:params}
              this.props.dispatch(allActionDucer(RIDS_PUSH,newRid));
              this.props.sendRequest( newRid[sele.marketId].request)
            })
          return
        }
        params.params.bets = selectionArr
        this.rids[12].request = params
        if (betMode === 3) {
          params.params.sys_bet = sys_bet_variant.variant
          params.params.amount = Number.parseFloat(betStake * sys_bet_variant.bets).toFixed(2)
        }

        this.props.sendRequest(params)
      }
    }
  }
  setBetStake(event) {
    const stake = Number(event).toFixed(2),{isQuickBet,betMode,betSlipMode,betSelections,sys_bet_variant,lowBalance}=this.props.betslip,profile= this.props.profile;
    let stateData = {}
    if (isQuickBet) {
      if (stake > 0) { stateData.quickBetStake = stake } else stateData.quickBetStake = 0
    } else {
      let betSelectionsCopy = {...betSelections}
      if (stake > 0) {
        if (betMode === 1) {
          Object.keys(betSelectionsCopy).forEach((key, index) => {
            let stateb = parseFloat(Number.parseFloat(stake).toFixed(2))
            betSelectionsCopy[key].singleStake = stateb
            betSelectionsCopy[key].singlePosWin = stateb * betSelectionsCopy[key].price
          })

        } else stateData.betStake = stake
      } else {
        if (betMode === 1) {
          Object.keys(betSelectionsCopy).forEach((key, index) => {
            betSelectionsCopy[key].singleStake = ""
            betSelectionsCopy[key].singlePosWin = 0
          })
          stateData.betStake = ""
        } else stateData.betStake = ""

      }
      stateData.betSelections = betSelectionsCopy
      dataStorage('betSlip', betSelectionsCopy)
      dataStorage('betStake', Number.isNaN(stake) ? "" : stake)
    }
    if(betSlipMode !==1){
      let moni = profile.bonus === '0.00'? profile.balance :  profile.games.split(',').includes('1')? profile.bonus: profile.balance
      stateData.lowBalance = betMode === 3 ? parseFloat(parseFloat(parseFloat(stake).toPrecision())* parseFloat(parseFloat(sys_bet_variant.bets).toPrecision(12)) || 0) >parseFloat(parseFloat(moni).toPrecision())? true : false : parseFloat(parseFloat(moni).toPrecision(12))< parseFloat(parseFloat(stake).toPrecision())  ? true : false
      if(stateData.lowBalance && !lowBalance && this.props.appState.isLoggedIn){
        stateData.showBetSlipNoty= true
        stateData.betSlipNotyMsg=profile.bonus === '0.00'?<View><Text trans="">Insufficient balance <Text onPress={this.deposit.bind(this)} trans="">Deposit</Text></Text></View>:<View><Text>Insufficient bonus balance, consume bonus in order to use main balance</Text></View>
        stateData.betSlipNotyType='warning'
        this.isLowBalance()
      }else{
        clearTimeout(this.notifyTimeout)
      }
    }
    this.props.dispatch(allActionDucer(BETSLIP,stateData))
  }
  onClear(){
    const {isQuickBet,betMode,betSlipMode,betSelections,sys_bet_variant,lowBalance,betStake}=this.props.betslip,profile= this.props.profile;
    let stateData = {},oldStake = betStake,stake=isNaN(oldStake) ? 0 : oldStake,stakeString=stake.toString()
    stakeString = stakeString.substr(0,stakeString.length-1)
    if(stakeString!==''){
      stake = parseFloat(stakeString)
    }
    if (isQuickBet) {
      if (stake > 0) { stateData.quickBetStake = stake } else stateData.quickBetStake = 0
    } else {
      let betSelectionsCopy = {...betSelections}
      if (stake > 0) {
        if (betMode === 1) {
          Object.keys(betSelectionsCopy).forEach((key, index) => {
            let stateb = parseFloat(Number.parseFloat(stake).toFixed(2))
            betSelectionsCopy[key].singleStake = stateb
            betSelectionsCopy[key].singlePosWin = stateb * betSelectionsCopy[key].price
          })

        } 
        stateData.betStake = stake
      } else {
        if (betMode === 1) {
          Object.keys(betSelectionsCopy).forEach((key, index) => {
            betSelectionsCopy[key].singleStake = ""
            betSelectionsCopy[key].singlePosWin = 0
          })

        } 
        stateData.betStake = ""

      }
      stateData.betSelections = betSelectionsCopy
      dataStorage('betSlip', betSelectionsCopy)
      dataStorage('betStake', Number.isNaN(stake) ? "" : stake)
    }
    if(betSlipMode !==1){
      let moni = profile.bonus === '0.00'? profile.balance :  profile.games.split(',').includes('1')? profile.bonus: profile.balance
      stateData.lowBalance = betMode === 3 ? parseFloat(parseFloat(parseFloat(stake).toPrecision())* parseFloat(parseFloat(sys_bet_variant.bets).toPrecision(12)) || 0) >parseFloat(parseFloat(moni).toPrecision())? true : false : parseFloat(parseFloat(moni).toPrecision(12))< parseFloat(parseFloat(stake).toPrecision())  ? true : false
      if(stateData.lowBalance && !lowBalance){
        stateData.showBetSlipNoty= true
        stateData.betSlipNotyMsg=profile.bonus === '0.00'?<View><Text trans="">Insufficient balance  <Text onPress={this.deposit.bind(this)} >Deposit</Text> </Text></View>:<View><Text>Insufficient bonus balance, consume bonus in order to use main balance</Text></View>
        stateData.betSlipNotyType='warning'
        this.isLowBalance()
      }else{
        clearTimeout(this.notifyTimeout)
      }
    }
    this.props.dispatch(allActionDucer(BETSLIP,stateData))
  }
  deposit(){
    this.props.dispatch(allActionDucer(BETSLIP,{ isBetSlipOpen:false }))
    this.props.navigate('wallet')
  }
  mathCuttingFunction(a) {
    const {decimalFormatRemove3Digit}= this.props.sportsbook
    if (decimalFormatRemove3Digit) {
      let b = a.toString().split(".")[0],
        f = a.toString().split(".")[1];
      return f ? 1 < f.length ? 99 === parseInt(f.substr(0, 2)) ? parseInt(b) + 1 : parseInt(b) : Math.floor(a) : a
    }
    return Math.round(a)
  }
  reCalculate() {
    const {betSelections,enableFreebet,
      freeBetStake,
      betStake,sys_bet_variant}= this.props.betslip;
     let f=0, betSelectionsArr = [];

    Object.keys(betSelections).forEach((sele) => {
      betSelectionsArr.push(betSelections[sele])
    })
    let d = [],
      h = [],
      g, e, c = sys_bet_variant.variant;
    for (e = 0; e < c; e++) { d[e] = e; h[e] = betSelectionsArr.length - e };
    h = h.reverse();
    e = c - 1;
    for (let l; d[0] <= h[0];)
      if (d[e] < h[e])
        if (e !== c - 1) e = c - 1;
        else {
          g = 1;
          for (l = 0; l < c; l++) 0 === betSelectionsArr[d[l]].flag ? g *= betSelectionsArr[d[l]].price : 1 === betSelectionsArr[d[l]].flag && (g = 0);
          f = (100 * f + this.mathCuttingFunction(100 * g)) / 100;
          d[e]++
        }
      else
        for (e-- , d[e]++ , g = e; g < c - 1; g++) d[g + 1] = d[g] + 1;
    // d = Math.round(this.factorial(betSelections.length) / (this.factorial(c) * this.factorial(betSelections.length -
    //     c)));
    // h = this.props.betStake*this.props.sys_bet_variant.bets / d;
    h = (enableFreebet? freeBetStake.amount: betStake) ;
    this.stakePerBet = (this.mathCuttingFunction(100 * h) / 100).toFixed(2);
    f = {
      win: (this.mathCuttingFunction(f * h * 100) / 100).toFixed(2),
      options: d
    };
    this.sys_bet_result = f
  }
  removeAllBetSelections() {
    const {selectionSub,isQuickBet,betStake} = this.props.betslip
    this.props.dispatch(allActionDucer(BETSLIP,{ betSelections: {}, betMode: 1, betStake: isQuickBet?betStake:0 }))
    dataStorage('betSlip', {}, 2)
    selectionSub && this.props.unsubscribe(selectionSub,'selectionSub')
  }
  removeGameFromBets(gameId) {
    const {betSelections} =  this.props.betslip,{subscriptions,selectionSub}=this.props.sportsbook; let betSLen = Object.keys(betSelections).length
    let  stateData = {}
    if (betSLen === 1) {
      this.removeAllBetSelections()
      return
    }
    Object.keys(betSelections).forEach((sID,k)=>{
      if(parseInt(sID,10)!==gameId){
        let newconflicts=betSelections[sID].conflicts.slice(0)
        for(let conflict in newconflicts){
         if(newconflicts[conflict].marketId ===gameId){
          betSelections[sID].conflicts.splice(parseInt(conflict),1)
         }
      }
    }
  })
    delete betSelections[gameId]
    betSLen = Object.keys(betSelections).length
    if (betSLen < 2){
      stateData.betMode = 1
      stateData.betStake = 0
    }

    dataStorage('betSlip', betSelections)
    if (subscriptions[selectionSub]) {
      this.props.unsubscribe(selectionSub)
      stateData.selectionSub = null
    }
    stateData.betSelections = betSelections
    this.props.dispatch(allActionDucer(BETSLIP,stateData))
    betSLen > 0 && this.props.subscribeToSelection(betSelections)
  }
  onOddsSettingsChange(e) {
    let acceptMode = this.props.betslip.acceptMode,mode = e
    if (mode !== acceptMode)
    this.props.dispatch(allActionDucer(BETSLIP,{ acceptMode: parseInt(mode) }))
  }
  betslipToggleView(){
    const {isBetSlipOpen}=this.props.betslip
    this.props.dispatch(allActionDucer(BETSLIP,{isBetSlipOpen:!isBetSlipOpen, showBetslipSettings: false, animation: false}))
  }
  onOddsTypeChange(e) {
    let oddType = this.props.sportsbook.oddType,type = e
    if (type !== oddType)
    {this.props.dispatch(allActionDucer(SPORTSBOOK_ANY,{ oddType: type }))
    dataStorage('odds_format',type)}
  }
  retrieve() {
    if (this.retrieveBookingInput && this.retrieveBookingInput.value !== '') {
      this.props.dispatch(allActionDucer(BETSLIP,{ retrieveBookingLoading: true }))
      let val = this.retrieveBookingInput.value
      if (val !== '') {
        this.props.retrieve(val, this.checkBookingResult.bind(this))
        this.retrieveBookingInput.value = ''
      }
    }
  }
  factorial(n) {
    return (n !== 1) ? n * this.factorial(n - 1) : 1;
  }
  getTotalBets(){
     let totalBets=0,{betSelections,sys_bet_variant,enableFreebet,betMode}=this.props.betslip
     if (betMode === 1) {
     Object.keys(betSelections).forEach((sele, ind) => {
        if (betSelections[sele].singleStake !== "" && betSelections[sele].singleStake !== 0) {
          totalBets += 1
        }
      })
      return totalBets
      }else if(betMode === 3) {return  null !== sys_bet_variant ? sys_bet_variant.bets : this.sys_bet_result.options }
      else if (enableFreebet) return Object.keys(betSelections).length 
    
  }
  getTotalStake(){
    let totalStake=0,{betSelections,sys_bet_variant,betMode,betStake}=this.props.betslip
    if (betMode === 1) {
    Object.keys(betSelections).forEach((sele, ind) => {
       if (betSelections[sele].singleStake !== "" && betSelections[sele].singleStake !== 0) {
         totalStake += betSelections[sele].singleStake
       }
     })
     return Number.parseFloat(totalStake,10).toFixed(2)
     }else if(betMode === 3&& betStake) {return  Number.parseFloat(betStake * sys_bet_variant.bets || 0,10).toFixed(2)}
     else return Number.parseFloat(betStake > 0 ? betStake : 0.00,10).toFixed(2)
   
  }
  calculateTotalOdds(betSelections){
    let totalOdds=0
    Object.keys(betSelections).forEach((sele, ind) => {
      if (totalOdds === 0) {
        totalOdds = betSelections[sele].price
      } else {
        totalOdds *= betSelections[sele].price
      }})
       return totalOdds
  }
  getTotalWinAmount(selectionBonusPercentage){
    let {betSelections,freeBetStake,enableFreebet}=this.props.betslip,totalOdds=this.calculateTotalOdds(betSelections)
   return Number.parseFloat((totalOdds * (enableFreebet? freeBetStake.amount: this.getTotalStake())) + ((totalOdds * (enableFreebet? freeBetStake.amount: this.getTotalStake())) * (selectionBonusPercentage / 100)),10).toFixed(2).toString().replace(/\d(?=(\d{3})+\.)/g, '$&,')
  }
  getPossibleWinAmount(){
    let {betSelections,freeBetStake,enableFreebet}=this.props.betslip,totalOdds=this.calculateTotalOdds(betSelections)
   return Number.parseFloat(totalOdds * (enableFreebet? freeBetStake.amount: this.getTotalStake()),10).toFixed(2).toString().replace(/\d(?=(\d{3})+\.)/g, '$&,')
  }
   _renderItem({item,index}){
      let selection = item,{betMode,enableFreebet,betSelections,betSlipMode,freeBetStake}= this.props.betslip,{oddType}=this.props.sportsbook,betlen = null !== betSelections && undefined !== betSelections ? Object.keys(betSelections).length : 0
    return (
      <View key={selection.marketId} style={[viewStyles.betSlipMatchInfo,{marginBottom:5}]}>
        <View>
          <View style={[viewStyles.betslipMatchInfoTeamsBlock]}>
            <View style={[viewStyles.betslipMatchLeftBlock,gridStyles.colsm10]}>
              <View style={[viewStyles.betslipMatchTeams]}>
                {selection.conflicts.length>0 &&<View style={[viewStyles.betslipMatchdetailsBlock,gridStyles.colsm1]}><CustomIcon name="error"/></View>}
                <Text numberOfLines={1} ellipsizeMode="tail" style={[viewStyles.selectionTeams,gridStyles[selection.conflicts.length>0?'colsm11':'colsm12']]}>{selection.title}</Text>
              </View>
            </View>

            <View style={[viewStyles.betslipMatchRightBlock,gridStyles.colsm2,{display:'flex',flexDirection:'row',justifyContent:'space-between',paddingRight:5}]}>
              <View id={selection.marketId} style={[viewStyles.betslipMatchdetailsBlock]}><CustomIcon name="info-outline" color="rgba(51,51,51,.65)" size={15}/></View>
              <View style={[viewStyles.betslipMatchdetailsBlock,{flexDirection:'row',justifyContent:'flex-end'}]}>
                <TouchableNativeFeedback useForeground={TouchableNativeFeedback.canUseNativeForeground()} onPress={() => this.removeGameFromBets(selection.marketId)}>
                  <CustomIcon name="close" size={15} color="rgba(51,51,51,.65)"/>
                </TouchableNativeFeedback>
              </View>
            </View>
          </View>

          <View style={viewStyles.sbBetInfo}>
            {selection.suspended ?
              <View style={[viewStyles.sbEventOverlay,viewStyles.sbEventOverlaySuspended]}>
                <View style={[viewStyles.sbEventOverlayInfo,viewStyles.suspendedContainer]}>
                  <View style={viewStyles.suspendedContainerPart}>
                    <CustomIcon name="lock" size={20} color="rgba(51,51,51,.65)"/>
                    <Text style={viewStyles.sbEventOverlayTitle}>Suspended</Text>
                  </View>
                </View>
              </View>
              : null
            }
            <View style={viewStyles.sbBetInfoContent}>
              <Text style={viewStyles.betslipMatchMarketType}>{selection.marketName} {selection.marketBase}</Text>
              <Text style={viewStyles.betslipMatchOldCoeficiente}>
                <Text style={viewStyles.betslipMatchOldCoeficiente}>
                  {selection.initialPrice !== selection.price ? <Text>{oddConvert({
                    main: {
                      decimalFormatRemove3Digit: 0,
                      notLockedOddMinValue: null,
                      roundDecimalCoefficients: 3,
                      showCustomNameForFractionalFormat: null,
                      specialOddFormat: null,
                      useLadderForFractionalFormat: 0
                    }, env: { oddFormat: null }
                  }, { mathCuttingFunction: () => { } })(selection.initialPrice, oddType)}</Text> : null}
                </Text>
              </Text>
            </View>

            <View style={viewStyles.sbBetInfoContent}>
              <Text style={viewStyles.betslipMatchEvent}>
                {selection.pick} {selection.pick === 'W1' || selection.pick === 'W2' ? ' - ' + selection.pick.replace(/Team 1/gi, selection.team1Name).replace(/Team 2/gi, selection.team2Name).replace(/w1/gi, selection.team1Name).replace(/w2/gi, selection.team2Name) : ''}
              </Text>
              <Text cstyle={viewStyles.sbetslipMatchCoeficiente}>
                <Text style={{color:'#018da0'}}>{oddConvert({
                  main: {
                    decimalFormatRemove3Digit: 0,
                    notLockedOddMinValue: null,
                    roundDecimalCoefficients: 3,
                    showCustomNameForFractionalFormat: null,
                    specialOddFormat: null,
                    useLadderForFractionalFormat: 0
                  }, env: { oddFormat: null }
                }, { mathCuttingFunction: () => { } })(selection.price, oddType)}</Text>
              </Text>
            </View>
            <KeyboardAvoidingView behavior="padding" enabled>
            {betMode === 1  && !enableFreebet &&
              <View style={[viewStyles.sbBetInputBlock,viewStyles.stateText]}>
                <View style={[viewStyles.stateText,{flex:2}]}>
                  <Text>
                    Stake
                  </Text>

                </View>
                <View  style={[viewStyles.sbInputInnerLabel,{flex:1}]}>
                  <TextInput keyboardType={'decimal-pad'}  placeholder="0"  onChangeText={(text)=>this.setSingleBetStake(selection.marketId,text)} value={selection.singleStake.toString()}/>
                </View>

              </View>
            }
            </KeyboardAvoidingView >
            {betMode === 1 && betlen === 1 ?

              <View style={viewStyles.sbBetResult}>
                <View style={[viewStyles.sbBetReturn,viewStyles.borderTop]}>
                  <Text>Possible Win:</Text>
                  <Text style={{color:'#028947'}}>{selection.singleStake !== "" ? (selection.singleStake * selection.price).toFixed(2) :enableFreebet? selection.price *freeBetStake.amount: 0}</Text>
                </View>
              </View>
              : null}
          </View>
        </View>
      </View>
    )
   }
   cannotPlaceBet(){
    const {betSlipMode,betInprogress,enableFreebet}= this.props.betslip,{isLoggedIn}=this.props.appState,profile= this.props.profile,{config}=this.props.sportsbook
    return (betSlipMode === 2 && isLoggedIn && profile.bonus==='0.00' && (parseFloat(parseFloat(this.getTotalStake().toString()).toPrecision(12))> (parseFloat(profile.balance).toPrecision(12)) && !enableFreebet))||(betSlipMode === 2 && isLoggedIn && parseFloat(parseFloat(profile.bonus).toPrecision(12))>0&& (parseFloat(parseFloat(this.getTotalStake().toString()).toPrecision(12))> parseFloat(parseFloat(profile.games.split(',').includes('1')?profile.bonus:'0').toPrecision(12))) && !enableFreebet) || (this.getTotalStake()<(config.min_bet_stakes[config.currency]||0.5) && !enableFreebet) || betInprogress
   }
  render() {
    const { betMode, betSlipMode,
      betSelections, betStake, lowBalance, sys_bet_variant,
      showBetSlipNoty, betInprogress,showBetslipSettings,
      betSlipNotyMsg,betSlipNotyType, acceptMode, enableEventSeletionBonus, bookingNumber, betFailed, isOddChange,freeBetStake,freeBets,enableFreebet,isBetSlipOpen } = this.props.betslip,{oddType, sportsbettingRules, config,authUser,}=this.props.sportsbook,
      {isLoggedIn} = this.props.appState,profile= this.props.profile,{showMatchDetails,details}=this.state
    let newSelection = [], qualifiedSelectionCount = 0, selectionBonusPercentage = 0, min_variant = 2,bonusMSG="",
      totalOdds =this.calculateTotalOdds(betSelections),  chainWinning = 0,
      totalBets = betMode === 3 ? Object.keys(betSelections).length : 0
    let betlen = null !== betSelections && undefined !== betSelections ? Object.keys(betSelections).length : 0
    this.sys_bet = []
    Object.keys(betSelections).forEach((sele, ind) => {
      if (betSelections[sele].price >= 1.3)
        qualifiedSelectionCount += 1
      newSelection.push(betSelections[sele])
      if (min_variant < betlen) {
        let opts = 0, nf = this.factorial(betlen), rf = this.factorial(min_variant), nrf = this.factorial(betlen - min_variant)
        opts = nf / (rf * nrf)
        this.sys_bet.push({ variant: min_variant, sys: min_variant + '/' + betlen, bets: opts })
      }
      min_variant++
    })
    if (null !== sys_bet_variant && betStake > 0) {
      this.reCalculate()
    }
    if (betMode === 4 && betStake >= 0.5) {
      let result = 0
      Object.keys(betSelections).forEach((bet) => {
        if (result === 0) {
          result = betStake * betSelections[bet].price
        } else {
          result = (result - betStake) + (betStake * betSelections[bet].price)
        }
      })
      chainWinning = result
    }
    if (betStake > 0)
      for (const rule in sportsbettingRules) {
        if (qualifiedSelectionCount >= sportsbettingRules[rule].MinimumSelections && qualifiedSelectionCount <= sportsbettingRules[rule].MaximumSelections && betMode === sportsbettingRules[rule].BetType) {
          if (qualifiedSelectionCount < betlen && null !== sportsbettingRules[rule].IgnoreLowOddSelection)
            selectionBonusPercentage = sportsbettingRules[rule].AmountPercent
          else if (qualifiedSelectionCount < betlen && null === sportsbettingRules[rule].IgnoreLowOddSelection)
            selectionBonusPercentage = 0
          else
            selectionBonusPercentage = sportsbettingRules[rule].AmountPercent
            if(sportsbettingRules[parseInt(rule)+1])if(qualifiedSelectionCount < sportsbettingRules[parseInt(rule)+1].MaximumSelections && betMode === sportsbettingRules[parseInt(rule)+1].BetType){
              bonusMSG=`Select ${sportsbettingRules[parseInt(rule)+1].MinimumSelections-qualifiedSelectionCount} more events (Each ≥ 1.3) and get  ${sportsbettingRules[parseInt(rule)+1].AmountPercent}% extra bonus!`
            }
          break
        }else if(qualifiedSelectionCount < sportsbettingRules[rule].MaximumSelections && betMode === sportsbettingRules[rule].BetType){
          bonusMSG=`Select ${sportsbettingRules[rule].MinimumSelections-qualifiedSelectionCount} more event${sportsbettingRules[rule].MinimumSelections-qualifiedSelectionCount>1?"s":''} (Each ≥ 1.3) and get  ${sportsbettingRules[rule].AmountPercent}% extra bonus!`
          break
        }
      }
    newSelection.sort((a, b) => {
      if (a.order > b.order)
        return 1
      if (b.order > a.order)
        return -1

      return
    })
    return (
      <>
     { !isBetSlipOpen&&<><Fab
      style={{ backgroundColor: '#026775' }}
      position="bottomRight"
      onPress={this.betslipToggleView}>
     <View style={viewStyles.betslipOpenerContainer} >
      <Badge warning style={{position:'absolute',right:0,top:-5,height:20}}><Text style={viewStyles.textWhite}>{betlen}</Text></Badge>
      <View style={viewStyles.betslipOpenerContainerText}><Text style={[viewStyles.textWhite,{fontSize:10}]}>BETSLIP</Text></View>
      </View>
    </Fab>
    <BetSlipNotification message={betSlipNotyMsg} type={betSlipNotyType} canNotify={showBetSlipNoty} onClose={this.hideNoty} isOddChange={isOddChange ?() => { this.onOddsSettingsChange({target:{value:2}}); this.placeBet() }:null} lowBalance={lowBalance} onLowBalance={this.deposit.bind(this)}/>
    </>}
    <Modal
     visible={isBetSlipOpen}
     animationType="slide" 
     transparent={false} 
     onRequestClose={this.betslipToggleView}
     ref={(el) => { this.betslipbody = el }}
     >
    <View style={{flex:1}}>
      <View>
      <>
        <View>
        <View style={[viewStyles.betslipHeader]} >
          <View style={{flex:3,flexDirection:'row',padding:10}}>
            <View style={{flex:1}}><Text style={{color:'#fff',textTransform:'uppercase',fontSize:16,fontWeight:'700'}}>BETSLIP</Text></View>
            {isLoggedIn&&<View style={{flex:1,flexDirection:'row'}}><View style={{flexDirection:'row',alignItems:'center'}}><Text style={{color:'#ff7b00'}}>{(parseFloat(profile.balance)+parseFloat(profile.bonus)).toFixed(3)}</Text><Text style={{color:'#fff',paddingLeft:5}}>{profile.currency}</Text></View></View>}
          </View>

          <View style={{flexDirection:'row',flex:1,justifyContent:'space-between',height:'100%'}}>
              <View style={{flex:1,paddingLeft:5,paddingRight:5,flexDirection:'row',justifyContent:'space-between'}}>
                <TouchableNativeFeedback useForeground={TouchableNativeFeedback.canUseNativeForeground()} onPress={this.openBetslipSettings}>
                <View style={{flex:1,alignItems:'center',height:'100%',flexDirection:'row',alignSelf:'center',justifyContent:'center'}}>
                  <CustomIcon name={`settings`} size={20} color="#fff"/>
                </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback useForeground={TouchableNativeFeedback.canUseNativeForeground()} onPress={this.betslipToggleView}>
                <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center',height:'100%'}}>
                  <CustomIcon name={`close`} size={15} color="#fff"/>
                </View>
                </TouchableNativeFeedback>
              </View>

          </View>
        </View>
      </View>
          <View style={{backgroundColor: 'rgba(188,188,197,.9)'}}>
              <View style={{marginBottom:1,flexDirection:'row'}}>
              <TouchableNativeFeedback useForeground={TouchableNativeFeedback.canUseNativeForeground()} onPress={() => this.changeBetSlipMode(2)}>
                <View style={[viewStyles.betModeBTN,betSlipMode===2 && viewStyles.betSlipTypeSelected]}>
                  <Text style={{color:'#fff',textTransform:'uppercase'}}>Betting</Text>
                  {betSlipMode === 2 && <Badge warning style={{marginLeft:5,height:20,position:'relative'}}><Text style={viewStyles.textWhite}>{betlen}</Text></Badge>}
                </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback useForeground={TouchableNativeFeedback.canUseNativeForeground()} onPress={() => this.changeBetSlipMode(1)}>
                <View style={[viewStyles.betModeBTN,betSlipMode===1 && viewStyles.betSlipTypeSelected]}  >
                <Text style={{color:'#fff',textTransform:'uppercase'}}>Booking</Text>
                  {betSlipMode ===1 && <Badge warning style={{marginLeft:5,height:20,position:'relative'}}><Text style={viewStyles.textWhite}>{betlen}</Text></Badge>}
                </View>
                </TouchableNativeFeedback>
              </View>
          {
            betSlipMode === 2 && betlen >=1 && isLoggedIn && authUser.has_free_bets === true && freeBets.length &&
            <View >
              <View >
                <Text>{ enableFreebet ?'Free Bet is ON': 'Free Bet available'}</Text>

                <Item >
                  <CheckBox onChange={(e) => { this.useFreeBet(e) }} value={enableFreebet}/>
                  <Text>
                    <Text ></Text>
                  </Text>
                </Item>
              </View>
              <View >
                {
                  enableFreebet ?
                    <View  style={{ top: 0, left: 0 }}>
                      <View >
                      <OddsSettings onChange={this.setFreeBetStake.bind(this)} customInput={freeBets} value={freeBetStake} title={'Choose Stake'} />
                      </View>
                    </View>
                  :null}
              </View>
            </View>
        }

              <View >
                <View style={{paddingRight:5,paddingLeft:5,flexDirection:'row',alignItems:'center',justifyContent:'space-between',backgroundColor:'rgba(209,209,219,.9)'}}>
                <View style={{flex:3}}>
                <Form style={{flexDirection:'row'}}>
                <Item picker  style={{width:'40%'}}>
                  <Picker
                    mode="dropdown"
                    style={{height:40}}
                    iosIcon={<Icon name="arrow-down" />}
                    placeholder="Bet Type"
                    placeholderStyle={{ color: "#bfc6ea" }}
                    placeholderIconColor="#007aff"
                    selectedValue={betMode}
                    onValueChange={this.changeBetMode.bind(this)}
                    enabled={betlen>1} 
                  >
                    <Picker.Item  label="Single" value={1} />
                    <Picker.Item disabled={betlen < 2} label="Multiple" value={2} />
                    <Picker.Item disabled={betlen < 3 || betlen > 16} label="System" value={3} />
                    <Picker.Item disabled={betlen < 2} label="Chain" value={4} />
                    
                  </Picker>
                </Item>
                  {betMode === 3  &&
                      <Item picker style={{width:'45%'}}>
                      <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" />}
                        style={{ width: undefined,height:30 }}
                        placeholder="Bet Option"
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        selectedValue={JSON.stringify(sys_bet_variant || this.sys_bet[0])}
                        onValueChange={this.setSysBetVariant.bind(this)}
                      >
                        {
                        this.sys_bet.map((sys, i) => {
                          return <Picker.Item key={i} disabled={betlen < 2} label={`${sys.sys}(${sys.bets} bets)`} value={JSON.stringify(sys)} />
                        })
                      }
                      
                      </Picker>
                    </Item>
                    }
                  </Form>
                </View>
                  <View >
                    <TouchableNativeFeedback  useForeground={TouchableNativeFeedback.canUseNativeForeground()} onPress={() => this.removeAllBetSelections()}>
                      <Text numberOfLines={1} ellipsizeMode='tail' >Remove All</Text>
                    </TouchableNativeFeedback>
                  </View>
                </View>
              </View>
              </View>
      </>
      </View>
      <View style={{flex:0.76,paddingTop:5}}>
        <FlatList 
          data={newSelection}
          ref={(e)=>this.betselectionRef=e}
          renderItem={this._renderItem.bind(this)}
          ListEmptyComponent={()=> <View style={{padding:10,flex:1,justifyContent:'center',flexDirection:'row',alignItems:'center'}}>
          <View style={{flex:1,flexDirection:'row',alignItems:'center'}}><Text style={{fontSize:14}}>No bets have been selected. To bet, please click on the respective result.</Text></View>
        </View>}
          keyExtractor={(item)=>item.marketId.toString()}
          removeClippedSubviews={true}
          initialNumToRender={5}
        />
        </View>   
           {betlen>0&& <View style={[viewStyles.borderTop,{flex:0.25,backgroundColor: '#ededf2'}]}>
            <View>
              <ScrollView>
              {bonusMSG!==''&&<View style={{flexDirection:'row',alignItems:'center',height:25,backgroundColor:'#a6eca980',paddingLeft:10}}>
                  <View><CustomIcon name="promotion" size={13} color="#028947"/></View>
                  <View style={{padding:5}}><Text style={{color:"#028947",fontSize:12}}>{bonusMSG}</Text></View>
                </View>}
              <View style={[viewStyles.betslipMatchesTotalInfo]}>
              <View>
                <KeyboardAvoidingView behavior="padding" enabled>
                {(betlen > 1 && betSlipMode === 2  && !enableFreebet) || (betSlipMode ===1 && betlen > 1) ?
                  <View style={[viewStyles.footerSbBetInputBlock]}>
                    <View style={{flex:1}}>
                      <Text>
                      Stake {betMode === 1 || betMode === 3 ? 'Per Bet' : ''}
                    </Text>
                    </View>
                    <Item style={[viewStyles.sbInputInnerLabel,{flex:1.5,flexDirection:'row',alignItems:'center'}]}>
                      <View><Text style={{fontSize:13}}>{config.currency}</Text></View>
                      <Input value={betStake.toString()} keyboardType={'decimal-pad'} placeholder="0" onChangeText={(text)=>this.setBetStake(text)} style={{
                          borderRadius: 4,
                          fontWeight: '400',
                          fontSize: 13,
                          flex:1
                      }}/>
                    </Item>
                    <View style={[viewStyles.betBtnContainer,{flex:2}]}>
                        {
                          betSlipMode === 1 ?
                            <TouchableOpacity disabled={betInprogress} onPress={this.bookBet} style={[viewStyles.button]} >
                                <ActivityIndicator animating={betInprogress} color="#fff" size={20} style={{ display: !betInprogress ? "none" : "flex" }} />
                                <Text style={[{display: betInprogress ? "none" : "flex",color:'#fff',fontSize:16,textTransform:'uppercase'}]} children="Get Bet ID" />
                            </TouchableOpacity>
                            : null}
                        {
                          betSlipMode === 2 && isLoggedIn ?
                          betFailed && isOddChange?
                                <TouchableOpacity onPress={(e) => { this.onOddsSettingsChange({target:{value:2}}); this.placeBet() }} disabled={(betSlipMode === 2 && isLoggedIn && lowBalance && !enableFreebet) || this.cannotPlaceBet()}>
                                  <ActivityIndicator animating={betInprogress} color="#fff" size={20} style={{ display: !betInprogress ? "none" : "flex" }} />
                                  <Text style={[{display: betInprogress ? "none" : "flex",color:'#fff',fontSize:16,textTransform:'uppercase'}]} children="Accepts changes and place bet" />
                                </TouchableOpacity>
                                :
                            <TouchableOpacity onPress={this.placeBet} style={[viewStyles.button,this.cannotPlaceBet()&&{backgroundColor:"#e7e7e7"}]} disabled={this.cannotPlaceBet()}>
                                <ActivityIndicator animating={betInprogress} color="#fff" size={20} style={{ display: !betInprogress ? "none" : "flex" }} />
                                <Text style={[{display: betInprogress ? "none" : "flex",color:'#fff',fontSize:16,textTransform:'uppercase'}]} children="Place Bet" />
                                </TouchableOpacity>
                            : (betSlipMode === 2 && !isLoggedIn && betlen) ?
                              <TouchableOpacity onPress={() => {this.betslipToggleView();this.props.navigate('login')}} style={[viewStyles.button,{backgroundColor: '#4889db'}]} >
                                <Text style={{color: '#fff',fontSize:12}}>Sign in to place bet</Text></TouchableOpacity> :null
                        }
                      </View>
                  </View>:null}
                  </KeyboardAvoidingView>

                <View style={[viewStyles.sbBetResult]}>
                  {
                  betlen>0&&<>
                  {(betMode === 1 || betMode === 3 )&&
                    <View  style={[viewStyles.sbBetReturn]}>
                      <Text>Number of Bets:</Text>
                      <Text>{this.getTotalBets()}</Text>
                    </View>
                    }
                  {betMode === 2 &&
                    <View  style={[viewStyles.sbBetReturn]}>
                      <Text>Total Odds: </Text>
                      <Text>{oddConvert({
                        main: {
                          decimalFormatRemove3Digit: 0,
                          notLockedOddMinValue: null,
                          roundDecimalCoefficients: 3,
                          showCustomNameForFractionalFormat: null,
                          specialOddFormat: null,
                          useLadderForFractionalFormat: 0
                        }, env: { oddFormat: null }
                      }, { mathCuttingFunction: () => { } })(totalOdds, oddType)}</Text>
                    </View>
                    }

                  <View style={[viewStyles.sbBetReturn]}>
                    <Text>Total Stake:</Text>
                    {
                      enableFreebet?
                      <Text>{freeBetStake.amount}</Text>
                      :<Text>{this.getTotalStake().toString().replace(/\d(?=(\d{3})+\.)/g, '$&,')}</Text>

                    }
                  </View>

                  <View style={[viewStyles.sbBetReturn,viewStyles.borderTop]}>
                    <Text>{betMode !== 1 ? 'Possible ' : 'Total '} Win:</Text>
                    <Text  style={{color:'#028947'}}>{betMode === 3 ? (this.sys_bet_result.win).toString().replace(/\d(?=(\d{3})+\.)/g, '$&,') : betMode === 4 ? Number.parseFloat(chainWinning).toFixed(2).toString().replace(/\d(?=(\d{3})+\.)/g, '$&,') : this.getPossibleWinAmount()}</Text>
                  </View>
                  </>
                  
                  }
                  {selectionBonusPercentage > 0 && enableEventSeletionBonus && betSlipMode === 2 &&
                    <>
                    <View  style={[viewStyles.sbBetReturn]}>
                      <Text>Bonus Percentage:</Text>
                      <Text >{selectionBonusPercentage}%</Text>
                    </View>

                    <View  style={[viewStyles.sbBetReturn]}>
                      <Text>Accumulator Bonus:</Text>
                      <Text  style={{color:'#b6862e'}}>{parseFloat((totalOdds * this.getTotalStake()) * (selectionBonusPercentage / 100),10).toFixed(2).toString().replace(/\d(?=(\d{3})+\.)/g, '$&,')} </Text>
                    </View>
                    </>
                    }
                  {(selectionBonusPercentage > 0 && enableEventSeletionBonus && betSlipMode === 2) || enableFreebet ?
                    <View  style={[viewStyles.sbBetReturn]}>
                      <Text style={{color:'#028947'}}>Total Win:</Text>
                      <Text style={{color:'#028947'}}>{this.getTotalWinAmount(selectionBonusPercentage)} </Text>
                    </View>
                  :null}
                </View>

            {betlen===1&& <View style={[viewStyles.betBtnContainer,{flex:2,paddingTop:10}]}>
                        {
                          betSlipMode === 1 ?
                            <TouchableOpacity disabled={betInprogress} onPress={this.bookBet} style={[viewStyles.button]} >
                                <ActivityIndicator animating={betInprogress} color="#fff" size={20} style={{ display: !betInprogress ? "none" : "flex" }} />
                                <Text style={[{display: betInprogress ? "none" : "flex",color:'#fff',fontSize:16,textTransform:'uppercase'}]} children="Get Bet ID" />
                            </TouchableOpacity>
                            : null}
                        {
                          betSlipMode === 2 && isLoggedIn ?
                          betFailed && isOddChange?
                                <TouchableOpacity onPress={(e) => { this.onOddsSettingsChange({target:{value:2}}); this.placeBet() }} disabled={(betSlipMode === 2 && isLoggedIn && lowBalance && !enableFreebet) || this.cannotPlaceBet()}>
                                  <ActivityIndicator animating={betInprogress} color="#fff" size={20} style={{ display: !betInprogress ? "none" : "flex" }} />
                                  <Text style={[{display: betInprogress ? "none" : "flex",color:'#fff',fontSize:16,textTransform:'uppercase'}]} children="Accepts and place bet" />
                                </TouchableOpacity>
                                :
                            <TouchableOpacity onPress={this.placeBet} style={[viewStyles.button,this.cannotPlaceBet()&&{backgroundColor:'#e7e7e7'}]} 
                            disabled={this.cannotPlaceBet()}>
                                <ActivityIndicator animating={betInprogress} color="#fff" size={20} style={{ display: !betInprogress ? "none" : "flex" }} />
                                <Text style={[{display: betInprogress ? "none" : "flex",color:'#fff',fontSize:16,textTransform:'uppercase'}]} children="Place Bet" />
                                </TouchableOpacity>
                            : (betSlipMode === 2 && !isLoggedIn && betlen) ?
                              <TouchableOpacity onPress={() => {this.betslipToggleView();this.props.navigate('login')}} style={[viewStyles.button,{backgroundColor: '#4889db'}]} >
                                <Text style={{color: '#fff',fontSize:16}}>Sign in to place bet</Text></TouchableOpacity> :null
                        }
                      </View>}
              </View>
            </View>
            </ScrollView>
              </View>
              </View>}
              <BetSlipNotification message={betSlipNotyMsg} type={betSlipNotyType} canNotify={showBetSlipNoty} onClose={this.hideNoty} isOddChange={isOddChange ?() => { this.onOddsSettingsChange({target:{value:2}}); this.placeBet() }:null} lowBalance={lowBalance} onLowBalance={this.deposit.bind(this)}/>
            </View>
            <Modal
          visible={bookingNumber !== null && betSlipMode === 1}
          transparent={true}
          onRequestClose={()=>this.props.dispatch(allActionDucer(BETSLIP,{ bookingNumber: null }))}
        >
          <View style={{flex:1}}>
          <TouchableNativeFeedback onPress={()=>this.props.dispatch(allActionDucer(BETSLIP,{ bookingNumber: null }))}>
          <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.4)',position:'relative'}}>
            <TouchableWithoutFeedback>
            <View style={viewStyles.bookingIdBlock} style={{position:'absolute',bottom:0,left:0,right:0,top:'50%',backgroundColor:'#fff'}}>
              
              <View style={{justifyContent:'center',flex:1,padding:20}}>
                <View style={{width:'100%',justifyContent:'center',flexDirection:'row'}}><Text style={{fontSize:18}}>Booking ID </Text></View>
                <View style={{width:'100%',justifyContent:'center',flexDirection:'row'}}><Text style={{fontSize:30,color:'#4889db',fontWeight:'700'}}>{bookingNumber !== 1 ? bookingNumber : null}</Text></View>
                <View style={{width:'100%',justifyContent:'center',flexDirection:'row',margin:5}}><TouchableNativeFeedback onPress={()=>{Clipboard.setString(bookingNumber.toString());makeText('Booking number copied to clipboard')}}><View style={{flexDirection:'row',justifyContent:'center'}}><View><Text>Copy</Text></View><CustomIcon name="copy" size={20}/></View></TouchableNativeFeedback></View>
              </View>
              <View style={{width:'100%',flexDirection:'row',alignItems:'center',justifyContent:'space-around',position:'absolute',left:0,right:0,bottom:0,paddingBottom:20}}>
                <TouchableNativeFeedback onPress={()=>this.shareToSocialMedia({title:'Share Booking Code',message:bookingNumber,url:'www.Your Company.com/bookingShare?id='+bookingNumber})}>
                  <Icon name="ios-share" size={30} style={{color:"#194b51",fontSize:40}}/>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback>
                  <Icon name="download" style={{fontSize:40,color:'#194b51'}}/>
                </TouchableNativeFeedback>
              </View>
            </View>
            </TouchableWithoutFeedback>
          </View>
          </TouchableNativeFeedback>
          </View>
        </Modal>
      </Modal>
      </>
    )

  }
}