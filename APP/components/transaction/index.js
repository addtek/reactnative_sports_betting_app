import React,{PureComponent} from 'react'
import  moment from 'moment-timezone'
import {BetHistoryLoader} from '../../components/loader'
import { View, Text, TextInput, TouchableOpacity,TouchableNativeFeedback, LayoutAnimation, FlatList} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Item, Picker, Icon,Label} from 'native-base'
import CustomIcon from '../customIcon'
import {dataStorage } from '../../common'
import API from '../../services/api'
import { calcMD5 } from '../../utils/jsmd5'
const $api = API.getInstance()
export default class Transactions extends PureComponent {
    constructor(props) {
      super(props)
      this.state = {
        openedBet: null,
        reloadHistory:false,
        nomoredata:false,
        cashingOut: null,
        outcome: '-1',
        bet_type: 'ALL',
        showFilterInputs:false,
        bet_id: '',
        period: 24,
        periodType: 1,
        datepickerF: moment().toDate(),
        datepickerT: moment().toDate(),
        activeBets:[],
        showDatePickerT:false,
        showDatePickerF:false,
        balanceHistory:[]
        ,currentPage:1,
        uid: null,
        AuthToken: null,
        phoneNumber: this.props.profile.mobilenumber
      }
      this.searchTransactionHistory = this.searchTransactionHistory.bind(this)
      this.getBetHistory = this.getBetHistory.bind(this)
      this.showDatePickerF = this.showDatePickerF.bind(this)
      this.showDatePickerT= this.showDatePickerT.bind(this)
      this._renderItem = this._renderItem.bind(this)
      this.onDateChangeF = this.onDateChangeF.bind(this)
      this.onDateChangeT = this.onDateChangeT.bind(this)
      this.showFilter = this.showFilter.bind(this)
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
    })
    }
    componentDidUpdate() {
     
    }
    reloadHistory() {
      this.setState({ reloadHistory: !0 ,loadingHistory:!0})
    }
    attemptCashout(bet = null) {
      this.setState(prevState => ({ showCashoutDailog: !prevState.showCashoutDailog, cashable_bet: bet }))
    }
    getBetHistory(where = {},more=false) {
      this.setState({ reloadHistory: !0 ,loadingHistory:!0 })
      const {phoneNumber,uid,AuthToken}= this.state,$time = moment().format('YYYY-MM-DD H:mm:ss'),
      $hash =calcMD5(`AuthToken${AuthToken}uid${uid}mobile${phoneNumber}time${$time}${this.props.appState.$publicKey}`)
      let p = {mobile:phoneNumber,uid:uid,AuthToken:AuthToken,uid:uid,time:$time,hash:$hash}
      p= {...p,...where}
      $api.getUserBalanceHistory(p,(data)=>this.onSuccess(data,more))
      
    }
    onSuccess({data},more){
      let state = {reloadHistory: !1 ,loadingHistory:!1,data}
      if(data && data.status===200){const b = this.state.balanceHistory.slice(0);state.balanceHistory=more ?[...b,...data.data]:data.data; more && data.data.length===0 && (state.nomoredata=!0)}
      else makeToast(data.msg,5000)
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
    searchTransactionHistory(more=false) {
      const { datepickerF, datepickerT,currentPage, bet_id, bet_type, } = this.state;
      let p = {range:-1, startDate:datepickerF===''?datepickerT!==''? moment(datepickerT).subtract(1, 'days').startOf('day').format('YYYY-MM-DD'):moment().startOf('month').format('YYYY-MM-DD'): moment(datepickerF).startOf('day').format('YYYY-MM-DD'), endDate: datepickerT===''?datepickerF!==''? moment(datepickerF).add(1, 'days').endOf('day').format('YYYY-MM-DD'):moment().endOf('month').format('YYYY-MM-DD'):moment(datepickerT).endOf('day').format('YYYY-MM-DD') };
      if (null !== bet_id && bet_id.length > 0) p.paycode = bet_id;
      if (bet_type !== '-1') p.type = bet_type;
      if (more) {p.page = currentPage+1;this.setState({currentPage:currentPage+1});}
      else this.setState({nomoredata:!1,currentPage:1})
      this.getBetHistory(p,more);
    }
    loadMore(){
      this.searchTransactionHistory(true)
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
    clearDateRange(id){
        id = id.substr(0, id.length-1)
        var obj={periodType: 1} 
       obj[id]='' 
       this.setState(obj)
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
               <View style={{flexDirection:'row',alignItems:'center'}}><View ><Text>Trans. ID</Text></View></View>
               <View style={{flexDirection:'row',alignItems:'center'}}><View ><Text>{item.type==='Withdraw' || item.type==='Deposit'?item.paycode:item.id}</Text></View></View>
             </View>
             <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
               <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}><View><Text>Date</Text></View></View>
               <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}><View><Text>{moment(item.date).format('ddd, D MMM YYYY')}</Text></View></View>
             </View>
           </View >
           <View style={[{flex:1,marginTop:5,marginBottom:5,marginLeft:15,marginRight:15},(item.outcome === 0 ||item.payout > 0)&&{borderBottomColor:'#026775',borderBottomWidth:1}]}>
               <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}><View><Text>Amount</Text></View><View><Text>{item.amount}  {config.currency}</Text></View></View>
               <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}><View><Text>Trans Type</Text></View><View><Text>{item.type}</Text></View></View>
               <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}><View><Text>Status</Text></View><View><Text>{item.status}</Text></View></View>
           </View>
         </View>
       )
     }
    render() {
      const  config = this.props.config,{loadingHistory, bet_type, bet_id, datepickerF,datepickerT,balanceHistory,showFilterInputs,showDatePickerF,showDatePickerT }= this.state
      
      return (

        <View style={{flex:1}}>
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
                <View style={{margin:5}}>
                  <View>
                    <Item floatingLabel>
                    <Label style={{color:'#194b51'}}  children="Transaction ID" />
                      <TextInput autoComplete="off" placeholder="#"  value={bet_id} onChangeText={this.setBetID} ref={(el) => this.partialInput = el}  style={{flex:1}}/>
                    </Item>
                  </View>
                </View>
                <View style={{margin:5}}>
                <Item picker>
                <Label style={{color:'#194b51'}}  children="Bet Type" />
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
                    <Picker.Item  label="All" value={'All'} />
                    <Picker.Item  label="Deposit" value={0} />
                    <Picker.Item  label="Withdrawal" value={1} />
                    <Picker.Item  label="Winnings" value={2} />
                    <Picker.Item  label="Activity" value={3} />
                    <Picker.Item  label="Bets" value={4} />
                    <Picker.Item  label="Rolled Back Bets" value={5} />
                    
                  </Picker>
                </Item>
                
                </View>
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
                  <TouchableNativeFeedback useForeground={TouchableNativeFeedback.canUseNativeForeground()} onPress={() => { this.searchTransactionHistory() }}>
                    <View style={{height:40,borderRadius:10,backgroundColor:'#11c9e3',flexDirection:'row',alignItems:'center',justifyContent:'center'}}><Text style={{color:'#fff'}}>Search</Text></View></TouchableNativeFeedback>
                </View>
                </View>

              <View style={{flex:1.5}}>
              <FlatList
                data={balanceHistory}
                keyExtractor={(item)=>item.id.toString()}
                renderItem={this._renderItem}
                ListEmptyComponent={()=><View style={{height:50,flexDirection:'row',alignItems:'center',justifyContent:'space-around'}}><Text>There is nothing to show at the moment</Text></View>}
                onEndReached={()=>this.loadMore()}
                onEndReachedThreshold={0.9}
              />
              </View>
        </View>
      )
    }
  }