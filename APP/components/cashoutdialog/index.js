import React,{PureComponent} from 'react'
import moment from 'moment-timezone'
import { Modal, View, Text, TouchableHighlight, ActivityIndicator,TouchableOpacity, TouchableNativeFeedback,TextInput, ScrollView } from 'react-native'
import CustomIcon from '../customIcon'
import { Item, Label, Picker, Left, Right, Radio,Icon,ListItem } from 'native-base'
import Slider from '@react-native-community/slider';
import { viewStyles } from '../../common'
export default class CashoutDialog extends PureComponent {
    constructor(props) {
      super(props)
      this.state = {
        isFullCashout: true,
        isPartialCashout: false,
        cashoutMode: 1,
        balanceFractionSize: 2,
        sliderVal: 0,
        inputValue: 0,
        cashoutInProgress: false,
        cashOutRuleLoading: false,
        valueError: false,
        ErrorMSG: '',
        cashOutRule: { valueReaches: '', partial_amount: null },
        dialogSettings: { type: 'cashout', cashoutDialogType: 'manual', auto: 'full', new_price: null, partial_amount: 0, valueReaches: '', incaseAmountChange: 0 }
      }
      this.minLCashoutValue = parseFloat(this.props.config.min_bet_stakes && this.props.config.min_bet_stakes[this.props.config.currency]) || 0.1
      this.k = [1, 0.1, 0.01]
      this.onCashoutModeChange = this.onCashoutModeChange.bind(this)
      this.onCashoutdDialogTypeChange = this.onCashoutdDialogTypeChange.bind(this)
      this.onCashoutTypeChange = this.onCashoutTypeChange.bind(this)
      this.attemptCashOutRule = this.attemptCashOutRule.bind(this)
      this.getCashOutRule = this.getCashOutRule.bind(this)
      this.attemptCashOut = this.attemptCashOut.bind(this)
      this.cancelCashOutRule = this.cancelCashOutRule.bind(this)
      this.cashoutRuleCallback = this.cashoutRuleCallback.bind(this)
      this.cancelCashoutRuleCallback = this.cancelCashoutRuleCallback.bind(this)
      this.getCashoutRuleCallback = this.getCashoutRuleCallback.bind(this)
      this.doCashoutCallback = this.doCashoutCallback.bind(this)
      this.setValueReaches = this.setValueReaches.bind(this)
      this.setPartialVal = this.setPartialVal.bind(this)
    }
    componentDidMount() {
      this.getCashOutRule()
    }
    componentDidUpdate() {
  
    }
    onCashoutModeChange(e) {
      this.setState(prevState => ({ dialogSettings: { ...prevState.dialogSettings, incaseAmountChange: parseInt(e, 10) } }))
      this.props.onUserInteraction()
    }
    onCashoutdDialogTypeChange(e) {
      // e.value==='auto' && this.getCashOutRule();
      this.setState(prevState => ({inputValue:0, dialogSettings: { ...prevState.dialogSettings, cashoutDialogType: e.value, auto: 'full', partial_amount: '', valueReaches: 0 } }))
    }
    onCashoutTypeChange() {
      this.setState(prevState => ({ dialogSettings: { ...prevState.dialogSettings, auto: prevState.dialogSettings.auto==='full'?'partial':'full' } }))
    }
    onClose() {
  
    }
    setValueReaches(e) {
      const {dialogSettings}= this.state, {cashable_bet} = this.props
      let states = {}, a = parseFloat(parseFloat(e).toPrecision(12)), min = dialogSettings.priceChanged ? dialogSettings.new_price : cashable_bet.cash_out, max = (parseFloat(parseFloat(cashable_bet.possible_win).toPrecision(12)) - parseFloat(parseFloat(this.k[2]).toPrecision(12))).toFixed(2);
  
      if(a > max || a < parseFloat(parseFloat(min).toPrecision(12)) ){ 
        states.valueError = !0; states.ErrorMSG = 'The specified amount is out of the acceptable range.'} else{ states.valueError = !1; states.ErrorMSG = ''}
        this.setState(prevState => ({ ...states, dialogSettings: { ...prevState.dialogSettings, valueReaches: a } }))
    }
    cashoutRuleCallback(c) {
      c = c.data;
      let g = { cashoutRule: {} };
     if( 0 === c.result ){g.cashoutRule.created = !0; g.cashoutRule.canceled = !1; g.cashoutRule.error = !1; g.cashoutRule.cashoutSuccess = !0} 
     else 
     {
       g.cashoutRule.error = !0; 
       g.cashoutRule.created = !1; 
       g.cashoutRule.canceled = !0; 
       g.cashoutRule.cashoutSuccess = !1; 
       g.cashoutRule.message = c.details
      }
      this.setState(prevState => ({ cashoutInProgress: !1, cashOutRule: { ...prevState.cashOutRule, ...g.cashoutRule }, dialogSettings: { ...prevState.dialogSettings, type: "confirm" } }))
    }
    cancelCashoutRuleCallback(c) {
      c = c.data;
      let g = { cashoutDialog: {}, cashoutRule: {} };
      g.cashoutDialog.type = "confirm";
      if(0 === c.result)  
      {
        g.cashoutRule.canceled = !0; g.cashoutRule.error = !1; g.cashoutRule.created = !1; g.cashoutRule.cashoutSuccess = !0
      } 
      else {
        g.cashoutRule.error = !0; g.cashoutRule.created = !1; g.cashoutRule.canceled = !1; g.cashoutRule.cashoutSuccess = !1; g.cashoutRule.message = c.details}
      g.cashoutInProgress = !1
      this.setState(prevState => ({ cashoutInProgress: g.cashoutInProgress, dialogSettings: { ...prevState.dialogSettings, ...g.cashoutDialog }, cashOutRule: { ...prevState.cashOutRule, ...g.cashoutRule } }))
    }
    getCashoutRuleCallback(a) {
      a = a.data
      this.setState({ cashOutRuleLoading: false })
      let g = { cashOutRule: {} }
      if(0 === a.result) {
        g.cashOutRule.valueReaches = a.details.MinAmount; g.cashOutRule.partial_amount = a.details.PartialAmount; this.setState(g)
      }
  
    }
    doCashoutCallback(k, callback) {
      k = k.data
      let g = { cashoutDialog: {}, cashOutRule: {} }
      if ("Ok" === k.result) {
        if (typeof (callback) === 'function') {
          // callback()
        }
        g.cashoutDialog.type = "confirm";
        g.cashOutRule.cashoutSuccess = !0;
      } else 
      {
        if("Fail" === k.result && k.details && k.details.new_price) {
          g.cashoutDialog.type = "cashout"; g.cashoutDialog = k.details; g.cashoutDialog.priceChanged = !0} 
          else{ 
          if("NotAvailable" === k.result || "Fail" === k.result) {
            g.cashoutDialog.type = "confirm"; g.cashOutRule.cashoutSuccess = !1; g.cashOutRule.manualError = !0
          }
          else
             {
               g.cashoutDialog.type = "confirm"; g.cashOutRule.cashoutSuccess = !1; g.cashOutRule.manualError = !0; g.cashOutRule.unknownError = !0
              }}
            }
      this.setState(prevState => ({ cashoutInProgress: !1, cashOutRule: { ...prevState.cashOutRule, ...g.cashOutRule }, dialogSettings: { ...prevState.dialogSettings, ...g.cashoutDialog } }))
      callback()
    }
    attemptCashOutRule() {
      this.setState({ cashoutInProgress: !0 })
      this.props.onSetAutoCashout({ ...this.state.dialogSettings, id: this.props.cashable_bet.id }, this.cashoutRuleCallback)
    }
    getCashOutRule() {
      this.setState({ cashOutRuleLoading: !0 })
      this.props.onGetCashoutRule({ ...this.state.dialogSettings, id: this.props.cashable_bet.id }, this.getCashoutRuleCallback)
    }
    attemptCashOut() {
      this.setState({ cashoutInProgress: !0 })
      this.props.onCashout({ ...this.state.dialogSettings, id: this.props.cashable_bet.id, cash_out: this.state.dialogSettings.priceChanged ? this.state.dialogSettings.new_price : this.props.cashable_bet.cash_out }, this.doCashoutCallback)
    }
    cancelCashOutRule() {
      this.setState({ cashoutInProgress: !0 })
      this.props.onCancelRule({ ...this.state.dialogSettings, id: this.props.cashable_bet.id }, this.cancelCashoutRuleCallback)
    }
    cancelValues() {
      this.setState({ inputValue: null, sliderVal: 0, dialogSettings: { cashoutDialogType: 'manual', auto: 'full', partial_amount: '', valueReaches: 0 } })
    }
    setPartialVal(e) {
      let a = e
        this.setState(prevState => ({inputValue: a, dialogSettings: { ...prevState.dialogSettings, partial_amount: a } }))
    }
    setPartialValInput(e) {
      let a = parseFloat(e)
      this.setState(prevState => ({inputValue: a, dialogSettings: { ...prevState.dialogSettings, partial_amount: a } }))
    }
    render() {
      const { props: {
        config,
        cashable_bet,
        onAttemptCashout,showCashoutDailog},
        state: { dialogSettings, sliderVal, inputValue, cashOutRule, cashoutInProgress,
          cashOutRuleLoading,
          valueError,
          ErrorMSG }
      } = this
      return (
         <Modal
          visible={showCashoutDailog}
          transparent={true}
          animationType="slide" 
          onRequestClose={onAttemptCashout}
         >
          <View style={{backgroundColor:'rgba(0,0,0,.6)',flex:1,flexDirection:'row',alignItems:'center'}}>
          <ScrollView contentContainerStyle={{backgroundColor:'#e8e8ec',borderRadius:10,marginLeft:10,marginRight:10,paddingHorizontal:0,paddingVertical:0}}>
            <View style={{flexDirection:'row',paddingLeft:10,paddingRight:10,backgroundColor:'#065863',height:45,borderTopLeftRadius:10,borderTopRightRadius:10}}>
              <View style={{flexDirection:'row',alignItems:"center",flex:4}}><View><Text style={{textTransform:'uppercase',fontWeight:'700',fontSize:18,color:"#fff"}}>Cash-Out</Text></View>
              </View>
              <View style={{flexDirection:'row',alignItems:"center",flex:1,justifyContent:'flex-end'}}><TouchableHighlight onPress={onAttemptCashout} ><CustomIcon name="close" size={20} color="#fff"/></TouchableHighlight></View>
            </View>
            <View style={{paddingLeft:10,paddingRight:10,backgroundColor:'#065863'}}>
                  <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}><View><Text style={viewStyles.textWhite}>ID: </Text></View><View><Text style={viewStyles.textWhite}>{cashable_bet.id}</Text></View></View>
                  <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}><View><Text style={viewStyles.textWhite}>Date:</Text></View><View><Text style={viewStyles.textWhite}>{moment.unix(cashable_bet.date_time).format('ddd, D MMM YYYY')}</Text></View></View>
            </View>
            <View style={{flex:1}}>
              {
                !cashoutInProgress && !cashOutRuleLoading?
                dialogSettings.type === 'cashout'?
                  !cashOutRule.valueReaches ?
                    <>
                      <View style={{flexDirection:'row',alignItems:'center',height:35}}>
                        <View style={[{height:33,flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center'},dialogSettings.cashoutDialogType!=='manual'&&{backgroundColor:'#11c9e3'}]}>
                          <TouchableOpacity onPress={() => dialogSettings.cashoutDialogType !== 'manual' ? this.onCashoutdDialogTypeChange({ value: 'manual' }) : null }>
                            <View style={{flex:1,width:'100%',flexDirection:'row',alignItems:'center',justifyContent:'center'}}><Text>Manual</Text></View>
                          </TouchableOpacity>
                        </View>
                        <View style={[{height:33,flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center'},dialogSettings.cashoutDialogType!=='auto'&&{backgroundColor:'#11c9e3'}]}>    
                        <TouchableOpacity onPress={() =>  dialogSettings.cashoutDialogType !== 'auto' ? this.onCashoutdDialogTypeChange({ value: 'auto' }) : null }>
                        <View style={{flex:1,width:'100%',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                        <CustomIcon name="settings" color="#fff" size={15}/>
                        <View>
                        <Text>Auto</Text></View>
                        </View>
                        </TouchableOpacity> 
                        </View>
                      </View>
                      <View style={{flex:1}}>
                        <View style={{padding:10,fontWeight:'600',fontSize:13}}><Text>If Cash-out {dialogSettings.cashoutDialogType === "manual" ? ' amount changes !' : ' value reaches !'}</Text></View>
                        {dialogSettings.cashoutDialogType === "manual" ?
                          <View style={{position: 'relative' }}>
                              <Item picker>
                                  <Picker
                                    mode="dropdown"
                                    style={{height:30}}
                                    iosIcon={<Icon name="arrow-down" />}
                                    placeholderStyle={{ color: "#bfc6ea" }}
                                    placeholderIconColor="#007aff"
                                    selectedValue={dialogSettings.incaseAmountChange}
                                    onValueChange={this.onCashoutModeChange}
                                  >
                                    <Picker.Item  label="Always Ask" value={0} />
                                    <Picker.Item  label="Accept Higher Amount" value={1} />
                                    <Picker.Item  label="Accept any amount changes" value={2} />
                                    
                                  </Picker>
                              </Item>
                          </View> :
                          <View className="value-reaches">
                            <View className="sportsbook-input-value">
                            <Item>
                                <TextInput editable={false}  value={dialogSettings.valueReaches.toString()} onChangeText={this.setValueReaches} ref={(el) => this.reachesInput = el}  style={{flex:1,textAlign:"center"}}/>
                            </Item>
                            </View>
                            <View style={{flexDirection:'row',alignItems:'center',justifyContent:"space-between",paddingRight:5,paddingLeft:5}}>
                              <View><Text>{dialogSettings.priceChanged ? dialogSettings.new_price : cashable_bet.cash_out}</Text></View>
                              <Slider maximumValue={parseFloat((cashable_bet.possible_win - this.k[2]).toFixed(2))} minimumValue={dialogSettings.priceChanged ? dialogSettings.new_price : cashable_bet.cash_out} step={0.01} value={dialogSettings.valueReaches} onValueChange={this.setValueReaches} style={{flex:1}} maximumTrackTintColor="#f24436" minimumTrackTintColor="#ff7b00" thumbTintColor="#065863"/>
                              <View><Text>{(cashable_bet.possible_win - this.k[2]).toFixed(2)}</Text></View>
                            </View>
                          </View>
                        }
                        <View>
                        <ListItem>
                          
                          <Left>
                            
                            <View style={{flexDirection:'row'}}><Text>Full Cash-Out </Text>{dialogSettings.cashoutDialogType === "manual" &&<Label style={{ paddingBottom: 5, paddingLeft: 20, fontWeight: '700', fontSize: 15 }}>({dialogSettings.priceChanged ? dialogSettings.new_price : cashable_bet.cash_out}  {config.currency})</Label>}</View> 
                          </Left>
                          <Right>
                            <Radio onPress={this.onCashoutTypeChange} selected={dialogSettings.auto === 'full'} />
                          </Right>
                        
                        </ListItem>
                        <ListItem>
                         
                           <Left>
                            <Text>Partial Cash-Out</Text>
                          </Left>
                          <Right>
                            <Radio onPress={this.onCashoutTypeChange} selected={dialogSettings.auto === 'partial'} />
                          </Right>
                          
                        
                         
                        </ListItem>
                        {dialogSettings.auto === 'partial'&&<View>
                                <View style={{margin:5}}>
                                  <View>
                                    <Item>
                                      <TextInput placeholder="Cash-out Amount" placeholderTextColor="#194b51" editable={false} autoComplete="off" keyboardType={'decimal-pad'} value={inputValue.toFixed(2).toString()} onChangeText={this.setPartialValInput.bind(this)} ref={(el) => this.partialInput = el}  style={{flex:1,textAlign:'center'}}/>
                                    </Item>
                                  </View>
                                </View>
                              
                                <View style={{flexDirection:'row',alignItems:'center',padding:5,justifyContent:'space-between'}}>
                                  <View><Text>0</Text></View>
                                  <View><Text>{dialogSettings.priceChanged ? dialogSettings.new_price : cashable_bet.cash_out}</Text></View>
                                </View>
                              
                                <View style={{marginBottom:20}}>
                                  <Slider disabled={dialogSettings.auto !== 'partial'} minimumValue={0} maximumValue={dialogSettings.priceChanged ? dialogSettings.new_price : cashable_bet.cash_out} step={0.01} value={inputValue} onValueChange={this.setPartialVal} ref={(el) => this.sliderInputRef = el} maximumTrackTintColor="#f24436" minimumTrackTintColor="#ff7b00" thumbTintColor="#065863"/>
                                </View>
                                
                         </View>}
                        </View>
                      </View>
                      {dialogSettings.priceChanged || valueError&&<View className="warning"><Text>{dialogSettings.priceChanged ? 'Cash-out amount has changed' : ErrorMSG}</Text></View>}
                      <View style={{flexDirection:'row',alignItems:'center',justifyContent:"space-between"}}>
                        <TouchableNativeFeedback disabled={valueError || (dialogSettings.cashoutDialogType == 'manual' && (dialogSettings.partial_amount == 0 || dialogSettings.partial_amount == null) && dialogSettings.auto == 'partial') || (dialogSettings.cashoutDialogType == 'auto' && dialogSettings.valueReaches == 0 && (dialogSettings.partial_amount == 0 || dialogSettings.partial_amount == null) && dialogSettings.auto == 'partial') || dialogSettings.cashoutDialogType == 'auto' && dialogSettings.valueReaches == 0 && dialogSettings.auto == 'full'} className="action"
                          onPress={() => { dialogSettings.cashoutDialogType === "manual" ? this.attemptCashOut() : this.attemptCashOutRule() }}>
                            <View style={{flex:1,height:40,borderBottomLeftRadius:10,backgroundColor:'#065863',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                              <Text style={viewStyles.textWhite}>{dialogSettings.cashoutDialogType === "manual" ? 'cash-out' : 'Create Rule'}</Text>
                            </View>
                          </TouchableNativeFeedback>
                        <TouchableNativeFeedback className="action" onPress={() => { this.cancelValues();onAttemptCashout() }}>
                          <View style={{flex:1,height:40,borderBottomRightRadius:10,backgroundColor:'#065863',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                              <Text style={viewStyles.textWhite}>Cancel</Text>
                          </View>
                        </TouchableNativeFeedback>
                      </View>
                    </>
                    :
                    <>
                      <View style={{padding:10,height:100,justifyContent:'center'}}>
                            <Text style={{fontSize:18,fontWeight:'700'}}>Rule active</Text>
                            <Text style={{fontSize:12}}>If the value reaches <Text style={{fontSize:12,fontWeight:'700'}}>{cashOutRule.valueReaches}</Text> <Text>{config.currency}</Text> <Text> Cash-out </Text></Text>
                            
                      </View>
                      <View>
                        <TouchableNativeFeedback onPress={() => { this.cancelCashOutRule() }} disabled={cashOutRuleLoading}>
                          <View style={{flex:1,height:40,backgroundColor:'#065863',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                          <Text style={viewStyles.textWhite}>Cancel Rule</Text>
                          </View>
                        </TouchableNativeFeedback>
                      </View>
                    </>
                  : dialogSettings.type === 'confirm' && !cashoutInProgress ?
                    <>
                      <View style={{height:100,flexDirection:'row',alignItems:'center',paddingLeft:10}}>
                        <CustomIcon name={cashOutRule.cashoutSuccess ? 'check-circle' : 'error'} size={40} color={cashOutRule.cashoutSuccess ? '#299e77' : '#f24436'}/>
                        <View style={{padding:10}}>
                        {
                          cashOutRule.unknownError ?
                           <View><Text>Error occurred.</Text></View>
                            : null
                        }
                        <Text>{
                          cashOutRule.created && cashOutRule.cashoutSuccess ? 'Auto Cash-Out rule has been created.' :
                            cashOutRule.canceled && !cashOutRule.error && cashOutRule.cashoutSuccess ? 'Auto Cash-Out rule has been canceled.' :
                              (cashOutRule.canceled && cashOutRule.error) || (!cashOutRule.canceled && cashOutRule.error) ? cashOutRule.message :
                                cashOutRule.cashoutSuccess && !cashOutRule.cancled && !cashOutRule.created ? 'Cash-out completed.' :
                                  cashOutRule.manualError && !cashOutRule.cashoutSuccess ? 'Cash-out for selected bet is not available.' : ''}</Text>
                        </View>
                      </View>
                      <View>
                        <TouchableNativeFeedback onPress={() => { onAttemptCashout() }} disabled={cashOutRuleLoading}>
                          <View style={{flex:1,height:40,backgroundColor:'#065863',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                          <Text style={viewStyles.textWhite}>OKAY</Text>
                          </View>
                        </TouchableNativeFeedback>
                      </View>
                    </>
                    : null
                    :null
              }
              {(cashoutInProgress||cashOutRuleLoading)&&<ActivityIndicator animating={(cashoutInProgress||cashOutRuleLoading)} color="#11c9e3" size={80} hidesWhenStopped={true}/>}
            </View>
          </ScrollView>
        </View>
         </Modal>
      )
  
    }
  }