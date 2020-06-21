import React from 'react'
import moment from 'moment-timezone'
import { BetHistoryLoader } from '../loader'
import { View, Text, TextInput, TouchableOpacity,TouchableNativeFeedback, LayoutAnimation, FlatList, Modal} from 'react-native'
import { Item, Picker, Icon,Label,Tab, Tabs, TabHeading } from 'native-base'
import CustomIcon from '../customIcon'
import { viewStyles, dataStorage } from '../../common'
import API from '../../services/api'
import { calcMD5 } from '../../utils/jsmd5'
import { makeText } from '../../utils'
const $api = API.getInstance()
export default class Bonuses extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      openedBet: null,
      attempttingBonusClaim: false,
      datepickerF: moment().toDate(),
      datepickerT: moment().toDate(),
      showDatePickerT:false,
      showDatePickerF:false,
      bonusHistory: [],
      bonusList: [],
      uid: null,
      showFilterInputs:true,
      AuthToken: null,
      currentPage: 1,
      formType: 4,
      opened:null,
      tabView:0,
      initialPage:0,
      attempttingBonusWithdraw:false
    }
    this._tabs=null
    this.onChangeTab = this.onChangeTab.bind(this)
    this.showFilter = this.showFilter.bind(this)
    this._renderItem = this._renderItem.bind(this)
    this._renderBonusItem = this._renderBonusItem.bind(this)
    this.getBetHistory = this.getBetHistory.bind(this)
    this.onDateChangeF = this.onDateChangeF.bind(this)
    this.onDateChangeT = this.onDateChangeT.bind(this)
    this.showBonusDetails = this.showBonusDetails.bind(this)
    this.claimBonus = this.claimBonus.bind(this)
  }
  componentDidMount() {
    dataStorage('loginState',{},0)
    .then(userData=>{
      if(userData){
         userData= JSON.parse(userData)
        const {id,AuthToken,mobile} = userData
       this.setState({uid:id,AuthToken:AuthToken})

      }
    }).then(()=>{
      this.getBetHistory()
      this.getBonusesList()
    })
    const {tabView}=this.props.navigation.state.params ?this.props.navigation.state.params:{};
        if(void 0!==tabView && null!==tabView)
        {
          null!==this._tabs &&setTimeout(this._tabs.goToPage.bind(this._tabs,tabView));
        }
  }
  showBonusDetails(id){
    this.setState(prevState=>({opened:prevState.opened ===id? null : id}))
  }
  reloadHistory() {
    this.setState({ reloadHistory: !0, loadingHistory: !0 })
  }
  attemptCashout(bet = null) {
    this.setState(prevState => ({ showCashoutDailog: !prevState.showCashoutDailog, cashable_bet: bet }))
  }
  getBetHistory(where = {}) {
    this.setState({ reloadHistory: !0, loadingHistory: !0 })
    const { uid } = this.state, $time = moment().format('YYYY-MM-DD H:mm:ss'),
      $hash = calcMD5(`uid${uid}time${$time}${this.props.appState.$publicKey}`)
    let p = { uid: uid, time: $time, hash: $hash }
    p = { ...p, ...where }
    $api.getUserBonusHistory(p, this.onSuccess.bind(this))

  }
  getBonusesList() {
    const $time = moment().format('YYYY-MM-DD H:mm:ss'),
      $hash = calcMD5(`time${$time}${this.props.appState.$publicKey}`)
    let p = { time: $time, hash: $hash }
    $api.getBonusList(p, this.onListFetched.bind(this))
  }
  loadMore() {
    const { currentPage } = this.state
    this.setState({ currentPage: currentPage + 1 })
    this.getBetHistory({ page: currentPage + 1 })
  }
  onListFetched({ data }) {
    let state = {}
    if (data && data.status === 200 && data.data.length) state.bonusList = data.data
    this.setState(state)
  }
  onSuccess({ data }) {
    let state = { reloadHistory: !1, loadingHistory: !1, data }
    if (data && data.status === 200 && data.data.length) state.bonusHistory = data.data
    else makeText(data.msg,5000)
    this.setState(state)

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
  claimBonus(bonus) {
    const { uid } = this.state, $time = moment().format('YYYY-MM-DD H:mm:ss'),
    $hash = calcMD5(`uid${uid}bid${bonus.Id}time${$time}${this.props.appState.$publicKey}`)
    let p = {type:1, bid: bonus.Id,isCash:bonus.isCash, uid: uid, time: $time, hash: $hash }
    this.props.showClaimDialog(p)

  }
  onChangeTab(e){
    e.i !==this.state.tabView &&this.setState({ tabView: e.i })
  }
  withdrawBonus(){
    const { uid } = this.state, $time = moment().format('YYYY-MM-DD H:mm:ss'),
      $hash = calcMD5(`uid${uid}time${$time}${this.props.appState.$publicKey}`)
    let p = { uid: uid, time: $time, hash: $hash,type:2 }
    this.props.showClaimDialog(p)
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
  showFilter(){
    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
    this.setState(prevState=>({showFilterInputs: !prevState.showFilterInputs}))
  }
  _renderItem({item,index}){
    const {config}= this.props
     return(
       <View style={{flex:1,marginTop:2,marginBottom:2,backgroundColor:index%2===0?'#f1f1f1':'#e8e8ec'}}>
         <View style={{flex:1,marginTop:5,marginBottom:5,marginLeft:15,marginRight:15,borderBottomColor:'#026775',borderBottomWidth:1}}>
           <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
             <View style={{flexDirection:'row',alignItems:'center'}}><View ><Text>Bonus Name</Text></View></View>
             <View style={{flexDirection:'row',alignItems:'center'}}><View ><Text>{item.Bid}</Text></View></View>
           </View>
           <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
             <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}><View><Text>Bonus Amount</Text></View></View>
             <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}><View><Text>{item.BonusAmount}</Text></View></View>
           </View>
         </View >
         <View style={[{flex:1,marginTop:5,marginBottom:5,marginLeft:15,marginRight:15},(item.outcome === 0 ||item.payout > 0)&&{borderBottomColor:'#026775',borderBottomWidth:1}]}>
             <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}><View><Text>Bonus Amount</Text></View><View><Text>{item.RealAmount}  {config.currency}</Text></View></View>
             <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}><View><Text>Expiration Date</Text></View><View><Text>{moment(item.ExpirationDate).format('ddd, D MMM YYYY')}</Text></View></View>
             <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}><View><Text>Bonus Status</Text></View><View><Text>{item.Status}</Text></View></View>
         </View>
       </View>
     )
   }
   _renderBonusItem({item,index}){
    const {config}= this.props
     return(
       <View style={{flex:1,marginTop:2,marginBottom:2,backgroundColor:index%2===0?'#f1f1f1':'#e8e8ec'}}>
         <View style={{flex:1,marginTop:5,marginBottom:5,marginLeft:15,marginRight:15,borderBottomColor:'#026775',borderBottomWidth:1}}>
           <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
             <View style={{flexDirection:'row',alignItems:'center'}}><View style={{marginLeft:5}}><Text>Bonus Name</Text></View></View>
             <View style={{flexDirection:'row',alignItems:'center'}}><View style={{marginLeft:10}}><Text>{item.Bid}</Text></View></View>
           </View>
           <View>
             <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}><View><Text>Bonus Amount</Text></View></View>
             <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}><View><Text>{item.BonusAmount}</Text></View></View>
           </View>
         </View >
         <View style={[{flex:1,marginTop:5,marginBottom:5,marginLeft:15,marginRight:15},(item.outcome === 0 ||item.payout > 0)&&{borderBottomColor:'#026775',borderBottomWidth:1}]}>
             <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}><View><Text>Bonus Amount</Text></View><View><Text>{item.RealAmount}  {config.currency}</Text></View></View>
             <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}><View><Text>Expiration Date</Text></View><View><Text>{moment(history.ExpirationDate).format('ddd, D MMM YYYY')}</Text></View></View>
             <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}><View><Text>Bonus Status</Text></View><View><Text>{item.Status}</Text></View></View>
         </View>
       </View>
     )
   }
  render() {
    const config = this.props.config, { loadingHistory, bonusHistory, bonusList,opened,showFilterInputs,tabView,initialPage} = this.state, { backToMenuModal,onClose, formType,attempttingBonusClaim ,attempttingBonusWithdraw} = this.props

    return (
      <View style={{flex:1}}>
       <Tabs tabBarUnderlineStyle={{backgroundColor:'#11c9e3'}} onChangeTab={this.onChangeTab} page={tabView} ref={component => this._tabs = component}>
         <Tab heading={ <TabHeading style={{backgroundColor:'#eee'}}><Text>Bonus</Text></TabHeading>}>
           <View style={{flex:1}}>
                 <View style={{flex:1}}>
                 {/* <FlatList
                   data={bonusList}
                   keyExtractor={(item)=>item.id.toString()}
                   renderItem={this._renderBonusItem}
                   ListEmptyComponent={()=><View style={{height:50,flexDirection:'row',alignItems:'center',justifyContent:'space-around'}}><Text>There is nothing to show at the moment</Text></View>}
                 /> */}
                 </View>
           </View>
         </Tab>
         <Tab heading={ <TabHeading style={{backgroundColor:'#eee'}}><Text>Bonus History</Text></TabHeading>}>
           <View style={{flex:1}}>
           {/* <View>
           <TouchableNativeFeedback useForeground={TouchableNativeFeedback.canUseNativeForeground()} onPress={this.showFilter}>
                  <View style={{flexDirection:'row',alignItems:'center',justifyContent:"space-between",marginTop:10,height:40,backgroundColor:'#018da0',paddingLeft:10,paddingRight:10}}>
                     <View>
                       <Text style={{color:'#fff'}}>Filter</Text>
                     </View>
                     <CustomIcon name={`${showFilterInputs? 'arrow-up':'arrow-down'}`} size={15} color="#11c9e3"/>
                  </View>
                </TouchableNativeFeedback>
                 </View> */}
                 <View style={{flex:1,marginTop:5}}>
                 <FlatList
                   data={bonusHistory}
                   keyExtractor={(item,index)=>index.toString()}
                   renderItem={this._renderItem}
                   ListEmptyComponent={()=><View style={{height:50,flexDirection:'row',alignItems:'center',justifyContent:'space-around'}}><Text>There is nothing to show at the moment</Text></View>}
                   onEndReached={()=>this.loadMore()}
                   onEndReachedThreshold={0.9}
                 />
                 </View>
           </View>
         </Tab>
       </Tabs>
     </View>
    )
  }
}