import React ,{PureComponent} from 'react'

import moment from 'moment-timezone'
import { allActionDucer } from '../../actionCreator'
import { SPORTSBOOK_ANY, RIDS_PUSH, PROFILE, LOGIN, LOGOUT, MODAL } from '../../actionReducers'
import { calcMD5 } from '../../utils/jsmd5'
import API from '../../services/api'
import MTN from '../../images/MTN.png'
import AIRTELTIGO from '../../images/AIRTELTIGO.png'
import VDFCASH from '../../images/vdfcash.png'
import { Container, Content,Tabs,Tab,TabHeading,Accordion, ListItem, Left, Radio, Icon,Body,Right, Item, Label, Picker } from 'native-base'
import { makeText, AlertPrompt } from '../../utils'
import { dataStorage, viewStyles } from '../../common'
import CustomIcon from '../customIcon';
import { Text, Image,View, TextInput, TouchableOpacity, Modal, TouchableWithoutFeedback, TouchableNativeFeedback, ActivityIndicator,StyleSheet } from 'react-native'
const $api = API.getInstance()
export default class Wallet extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            formType: 1,
            uid: null,
            AuthToken: null,
            phoneNumber: '',
            amount: '',
            formStep: 1,
            telcoType: 1,
            voucher: '',
            password:'',
            showPass:false,
            payment_method:1,
            source:1,
            switchTelco:false,
            amountErr:false,amountErrMSG:'',
            tabView:0
        }
        this._tabs=null
         this.MOMOTELCOs={1:{name:'MTN Mobile Money',icon:MTN},2:{name:'Vodafone Cash',icon:VDFCASH},3:{name:'AirtelTigo Money',icon:AIRTELTIGO}}
        $api.setToken(this.state.AuthToken)
        this.onInputChange = this.onInputChange.bind(this)
        this.changeTelco = this.changeTelco.bind(this)
        this.toggleShow = this.toggleShow.bind(this)
        this.attemptWithdrawal = this.attemptWithdrawal.bind(this)
        this.attemptForceWithdrawal = this.attemptForceWithdrawal.bind(this)
        this.attemptDeposit = this.attemptDeposit.bind(this)
        this.setPayementMethod = this.setPayementMethod.bind(this)
        this.setPassword = this.setPassword.bind(this)
        this.setMoMoValue = this.setMoMoValue.bind(this)
        this.setMoMoVoucher = this.setMoMoVoucher.bind(this)
        this.showTelcoSwither = this.showTelcoSwither.bind(this)
        this.setSource = this.setSource.bind(this)
        this.onChangeTab = this.onChangeTab.bind(this)
    }
    componentDidMount(){
        dataStorage('loginState',{},0)
        .then(userData=>{
        if(userData){
            userData= JSON.parse(userData)
            const {id,AuthToken,mobile} = userData
        this.setState({uid:id,AuthToken:AuthToken,phoneNumber:mobile})

        }
        })
        const {tabView}=this.props.navigation.state.params ?this.props.navigation.state.params:{};
        if(void 0!==tabView && null!==tabView){

            null!==this._tabs &&setTimeout(this._tabs.goToPage.bind(this._tabs,tabView));
        }
        // this.props.navigation.setParams({tabView: null});
    }
    changeForm(type) {
        if (type !== this.props.formType) {
            this.setState({ amount: '',password:'' })
            this.props.changeForm(type)
        }
    }
    toggleShow(){
        !this.state.changingpass &&this.setState(prevState=>({showPass: !prevState.showPass}));
      }
    onInputChange(e) {
        let $el = e.target, newState = {}
        newState[$el.name] = $el.value
        newState[$el.name + 'Empty'] = false
        if (!this.state.formEdited) newState['formEdited'] = true
        this.setState(newState)
    }
    setMoMoValue(e) {
        this.setState({amount:e})
    }
    setMoMoVoucher(e) {
        this.setState({voucher:e})
    }
    setPassword(e) {
        this.setState({password:e})
    }
    setSource(e) {
        this.setState({source:e})
    }
    changeTelco(telco) {
        this.state.telcoType !== telco && this.setState({ telcoType: telco, amount: '' })
    }
    attemptDeposit(){
        this.setState({attemptingDeposit:true})
        const {telcoType,phoneNumber,voucher,uid,AuthToken,amount}= this.state,$time = moment().format('YYYY-MM-DD H:mm:ss'),
        $hash =calcMD5(`AuthToken${AuthToken}uid${uid}mobile${phoneNumber.substring(1,phoneNumber.length)}type${telcoType===1?'MTN':telcoType ===2?'Vodafone':''}amount${amount}${telcoType===2?`voucher${voucher}`:''}time${$time}${this.props.appState.$publicKey}`)
        let p = {pay_type:'Teller',amount:amount,type:telcoType===1?'MTN':telcoType ===2?'Vodafone':'AirtelTigo',mobile:phoneNumber.substring(1,phoneNumber.length),uid:uid,AuthToken:AuthToken,uid:uid,time:$time,hash:$hash}
        if(telcoType=== 2) p.voucher = voucher
        $api.deposit(p,this.onDepositSuccess.bind(this))
        AlertPrompt("Deposit",'Processing your request, check your phone for prompt and follow the instructions')

    }
    onDepositSuccess({data}){
        this.setState({attemptingDeposit:false})
        AlertPrompt('Deposit','null' === data.msg? 'Reguest timeout': data.msg)
    }
    attemptWithdrawal(){
        this.setState({attemptingWithdrawal:true})
        const {source,phoneNumber,password,uid,AuthToken,amount}= this.state,$time = moment().format('YYYY-MM-DD H:mm:ss'),
        $hash =calcMD5(`AuthToken${AuthToken}uid${uid}mobile${phoneNumber}withdrawaltype${source}amount${amount}password${password}time${$time}${this.props.appState.$publicKey}`)
        let p = {withdrawaltype:source,password:password,amount:amount,mobile:phoneNumber,uid:uid,AuthToken:AuthToken,uid:uid,time:$time,hash:$hash}
        $api.withdraw(p,this.onWithdrawSuccess.bind(this))
    }
    attemptForceWithdrawal(){
        this.setState({attemptingForceWithdrawal:true})
        const {source,phoneNumber,password,uid,AuthToken,amount}= this.state,$time = moment().format('YYYY-MM-DD H:mm:ss'),
        $hash =calcMD5(`AuthToken${AuthToken}uid${uid}mobile${phoneNumber}withdrawaltype${source}amount${amount}password${password}time${$time}${this.props.appState.$publicKey}`)
        let p = {compel:1,withdrawaltype:source,password:password,amount:amount,mobile:phoneNumber,uid:uid,AuthToken:AuthToken,uid:uid,time:$time,hash:$hash}
        $api.withdraw(p,this.onWithdrawSuccess.bind(this))
    }
    onWithdrawSuccess({data}){
        this.setState({attemptingWithdrawal:false,attemptingForceWithdrawal:false})
        AlertPrompt('Withdrawal',data.msg)
    }
    setPayementMethod(opt){
        const {payment_method}=this.state
        let newState={switchTelco:false}
        payment_method!==opt && (newState.payment_method=opt);
        this.setState(newState)
    }
    showTelcoSwither(){
        this.setState(prevState=>({switchTelco:!prevState.switchTelco}))
    }
    onChangeTab(e){
        e.i!==this.state.tabView&&this.setState({ tabView:e.i,amount:'',payment_method:1,source:1,password:'',voucher:'' })
      }
    render() {
        const { amount, password,showPass,phoneNumber,switchTelco, telcoType, voucher, source, attemptingWithdrawal,attemptingForceWithdrawal, attemptingDeposit,payment_method,tabView} = this.state, {backToMenuModal, formType, onClose, config,  } = this.props
        return (
            <Container>
                {
                        <Modal
                         visible={switchTelco}
                         transparent={true}
                         onRequestClose={this.showTelcoSwither}
                         animationType="fade"
                        >
                            <TouchableWithoutFeedback onPress={this.showTelcoSwither}>
                            <View style={{flex:1,position:'relative',backgroundColor:'rgba(0,0,0,0.5)'}}>
                                <View style={{position:'absolute',left:0,right:0,bottom:0,backgroundColor:'#fff'}}>
                                <TouchableWithoutFeedback>
                                <View style={{width:'100%',flexDirection:'row',alignItems:'center',justifyContent:"space-between",padding:10}}>
                                   <View><Text style={{fontSize:13,color:'#026775'}}>Select Telco</Text></View>
                                   <TouchableOpacity onPress={this.showTelcoSwither}>
                                        <CustomIcon name="close" size={20} color="crimson"/>
                                    </TouchableOpacity>
                                </View>
                                </TouchableWithoutFeedback>
                                <ListItem icon button onPress={()=>this.setPayementMethod(1)}>
                                    <Left><View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',height:30}}><Image source={this.MOMOTELCOs[1].icon} resizeMode="contain"  style={{width:40,height:30,}}/></View></Left>
                                    <Body><View style={{flexDirection:'row',alignItems:'center'}}><View><Text>{this.MOMOTELCOs[1].name}</Text></View></View></Body>
                                    <Right><Radio selected={payment_method === 1}  onPress={()=>this.setPayementMethod(1)}/></Right>
                                </ListItem>
                                <ListItem icon button onPress={()=>this.setPayementMethod(2)}>
                                    <Left><View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',height:30}}><Image source={this.MOMOTELCOs[2].icon} resizeMode="contain"  style={{width:40,height:30,}}/></View></Left>
                                    <Body><Text>{this.MOMOTELCOs[2].name}</Text></Body>
                                    <Right><Radio selected={payment_method === 2}  onPress={()=>this.setPayementMethod(2)}/></Right>
                                </ListItem>
                                <ListItem icon button onPress={()=>this.setPayementMethod(3)}>
                                    <Left><View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',height:30}}><Image source={this.MOMOTELCOs[3].icon} resizeMode="contain"  style={{width:40,height:30,}}/></View></Left>
                                    <Body><Text>{this.MOMOTELCOs[3].name}</Text></Body>
                                    <Right><Radio selected={payment_method === 3}  onPress={()=>this.setPayementMethod(3)}/></Right>
                                </ListItem>
                                </View>
                            </View>
                            </TouchableWithoutFeedback>
                        </Modal>
                       }
                <Content>
                <Tabs tabBarUnderlineStyle={{backgroundColor:'#11c9e3'}} onChangeTab={this.onChangeTab} page={tabView} ref={component => this._tabs = component}>
                <Tab heading={ <TabHeading style={{backgroundColor:'#eee'}}><Text>Deposit</Text></TabHeading>}>
                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',margin:10}}><View><Text style={{color:'#026775'}}>Mobile Number</Text></View>
                    <View><Text style={{color:'#026775',fontSize:15}}>{phoneNumber.substring(0,2)}****{phoneNumber.substring(6,phoneNumber.length)}</Text></View></View>
                   <View>
                       <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',margin:5,padding:10,borderColor:'#eee',borderWidth:1,borderRadius:4}}>
                           <View style={{flexDirection:'row',alignItems:'center'}}><Image source={this.MOMOTELCOs[payment_method].icon} resizeMode="contain" style={{width:60,height:30}}/><View style={{paddingLeft:5,paddingRight:5}}><Text>{this.MOMOTELCOs[payment_method].name}</Text></View></View>
                           <View><TouchableOpacity onPress={this.showTelcoSwither}><View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}><View><Text style={{color:"#026775"}}>Switch</Text></View><CustomIcon name="arrow-right" size={10} color="#026775" style={{marginLeft:5}}/></View></TouchableOpacity></View>
                       </View>
                       
                   </View>
                   <View style={{padding:20,margin:5,borderColor:'#eee',borderWidth:1,borderRadius:5}}>
                       <View>
                      {payment_method===2&& <Item>
                        <TextInput value={voucher} placeholder="Voucher" onChangeText={this.setMoMoVoucher} style={{flex:1}}/>
                       </Item>}
                       </View>
                       <View>
                       <Item>
                        <TextInput editable={!attemptingDeposit} value={amount} placeholder="Amount" keyboardType="decimal-pad" onChangeText={this.setMoMoValue} style={{flex:1}}/>
                       </Item>
                       </View>
                       <View style={{marginTop:10}}>
                       <TouchableNativeFeedback disabled={(((telcoType===3 ||telcoType===1) && (amount==='' || parseFloat(amount)<1)) ||(amount!=='' && isNaN(amount))|| (telcoType===2 && (amount===''|| voucher==='' || parseFloat(amount)<1))||attemptingDeposit)} onPress={this.attemptDeposit}>
                           <View style={{height:40,width:'100%',justifyContent:'center',alignItems:'center',borderRadius:5,flexDirection:'row',backgroundColor:(((telcoType===3 ||telcoType===1) && (amount==='' || parseFloat(amount)<1)) || (telcoType===2 && (amount===''|| voucher==='' || parseFloat(amount)<1))||attemptingDeposit)?'rgba(209,209,219,.9)':'#018da0'}}>
                               {attemptingDeposit?<ActivityIndicator animating={true}/>:<Text style={viewStyles.textWhite}>Top Up Now</Text>}
                           </View>
                       </TouchableNativeFeedback>
                       </View>
                       
                   </View>
                   <View style={{padding:20,margin:5,borderColor:'#eee',borderWidth:1,borderRadius:5}}>
                       <View >
                            <Text style={styles.infotext}>1. Maximum per transaction is {config.currency} 2000.00</Text>
                            <Text style={styles.infotext}>2. Minimum per transaction is {config.currency} 1.00</Text>
                            <Text style={styles.infotext}>3. No transaction fee is charged</Text>
                            <Text style={styles.infotext}>4. Balance can only be withdrawn to the mobile number that you registered with</Text>
                       </View>  
                   </View>
                </Tab>
                <Tab heading={ <TabHeading style={{backgroundColor:'#eee'}}><Text>withdraw</Text></TabHeading>}>
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',margin:10}}><View><Text style={{color:'#026775'}}>Mobile Number</Text></View>
                    <View><Text style={{color:'#026775',fontSize:15}}>{phoneNumber.substring(0,2)}****{phoneNumber.substring(6,phoneNumber.length)}</Text></View></View>
                   <View>
                       <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',margin:5,padding:10,borderColor:'#eee',borderWidth:1,borderRadius:4}}>
                           <View style={{flexDirection:'row',alignItems:'center'}}><Image source={this.MOMOTELCOs[payment_method].icon} resizeMode="contain" style={{width:60,height:30}}/><View style={{paddingLeft:5,paddingRight:5}}><Text>{this.MOMOTELCOs[payment_method].name}</Text></View></View>
                           <View><TouchableOpacity onPress={this.showTelcoSwither}><View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}><View><Text style={{color:"#026775"}}>Switch</Text></View><CustomIcon name="arrow-right" size={10} color="#026775" style={{marginLeft:5}}/></View></TouchableOpacity></View>
                       </View>
                       
                   </View>
                   <View style={{padding:20,margin:5,borderColor:'#eee',borderWidth:1,borderRadius:5}}>
                       <View>
                       <Item>
                        <TextInput editable={!attemptingWithdrawal} value={amount} placeholder="Amount" keyboardType="decimal-pad" onChangeText={this.setMoMoValue} style={{flex:1}}/>
                       </Item>
                       <Item>
                       <Item picker>
                              <Label style={{color:'#194b51',fontSize:11}}  children="Withdrawal Source: " />
                                  <Picker
                                    mode="dropdown"
                                    iosIcon={<Icon name="arrow-down" />}
                                    placeholder="Withdrawal Source"
                                    placeholderStyle={{ color: "#bfc6ea" }}
                                    placeholderIconColor="#007aff"
                                    selectedValue={source}
                                    onValueChange={this.setSource}
                                  >
                                   <Picker.Item label="Mobile Money" value={1} />
                                   <Picker.Item label="Counter" value={0} />
                                                                     
                                  </Picker>
                                </Item>
                       </Item>
                       <Item>
                        <TextInput editable={!attemptingWithdrawal} value={password} secureTextEntry={true} placeholder="Password"  onChangeText={this.setPassword} style={{flex:1}}/>
                       </Item>
                       </View>
                       <View style={{marginTop:10}}>
                       <TouchableNativeFeedback disabled={attemptingForceWithdrawal||attemptingWithdrawal||amount === '' || parseFloat(amount)<10 || password ===''} onPress={this.attemptWithdrawal}>
                           <View style={{height:40,width:'100%',justifyContent:'center',alignItems:'center',borderRadius:5,flexDirection:'row',backgroundColor:attemptingForceWithdrawal||attemptingWithdrawal||amount === '' || parseFloat(amount)<10 || password ===''?'rgba(209,209,219,.9)':'#018da0'}}>
                               {attemptingWithdrawal?<ActivityIndicator animating={true}/>:<Text style={viewStyles.textWhite}>Withdraw Now</Text>}
                           </View>
                       </TouchableNativeFeedback>
                       </View>
                       
                   </View>
                   <View style={{padding:20,margin:5,borderColor:'#eee',borderWidth:1,borderRadius:5}}>
                       <View >
                            <Text style={styles.infotext}>1. Maximum per transaction is {config.currency} 2000.00</Text>
                            <Text style={styles.infotext}>2. Minimum per transaction is {config.currency} 10.00</Text>
                            <Text style={styles.infotext}>3. No transaction fee is charged</Text>
                            <Text style={styles.infotext}>4. Withdrawal will be approved only after you hve fulfilled the playthrough requirements.</Text>
                       </View>  
                   </View>
                </Tab>
                </Tabs>
                </Content>
            </Container>
        )
    }
}
 const styles = StyleSheet.create({
     infotext:{
         color:"#A9A9A9",
         fontSize:11,   
     }
 })