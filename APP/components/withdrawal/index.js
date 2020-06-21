import React ,{PureComponent} from 'react'

import moment from 'moment-timezone'
import { allActionDucer } from '../../actionCreator'
import { SPORTSBOOK_ANY, RIDS_PUSH, PROFILE, LOGIN, LOGOUT, MODAL } from '../../actionReducers'
import { calcMD5 } from '../../utils/jsmd5'
import OPTION1 from '../../images/OPTION1.png'
import OPTION2 from '../../images/OPTION2.png'
import API from '../../services/api'
import MOBILEMONEY from '../../images/mobile_money.png'
import { Container, Content,Tabs,Tab,TabHeading,Accordion, ListItem, Left, Radio, Icon,Body,Right } from 'native-base'
import { makeText } from '../../utils'
import { dataStorage } from '../../common'
import { Text, Image,View } from 'react-native'
const $api = API.getInstance()
export default class Wallet extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            formType: 1,
            uid: null,
            AuthToken: null,
            phoneNumber: null,
            amount: '',
            formStep: 1,
            telcoType: 1,
            voucher: '',
            password:'',
            showPass:false,
            payemnt_method:1,
            source:1
        }
        $api.setToken(this.state.AuthToken)
        this.onInputChange = this.onInputChange.bind(this)
        this.changeTelco = this.changeTelco.bind(this)
        this.toggleShow = this.toggleShow.bind(this)
        this.attemptWithdrawal = this.attemptWithdrawal.bind(this)
        this.attemptForceWithdrawal = this.attemptForceWithdrawal.bind(this)
        this.attemptDeposit = this.attemptDeposit.bind(this)
        this.setPayementMethod = this.setPayementMethod.bind(this)
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
    changeTelco(telco) {
        this.state.telcoType !== telco && this.setState({ telcoType: telco, amount: '' })
    }
    attemptDeposit(){
        makeText('Processing your request, check your Phone for Prompt',2)
        this.setState({attemptingDeposit:true})
        const {telcoType,phoneNumber,voucher,uid,AuthToken,amount}= this.state,$time = moment().format('YYYY-MM-DD H:mm:ss'),
        $hash =calcMD5(`AuthToken${AuthToken}uid${uid}mobile${phoneNumber}type${telcoType===1?'MTN':telcoType ===2?'Vodafone':''}amount${amount}${telcoType===2?`voucher${voucher}`:''}time${$time}${this.props.appState.$publicKey}`)
        let p = {pay_type:'Teller',amount:amount,type:telcoType===1?'MTN':telcoType ===2?'Vodafone':'',mobile:phoneNumber,uid:uid,AuthToken:AuthToken,uid:uid,time:$time,hash:$hash}
        if(telcoType=== 2) p.voucher = voucher
        $api.deposit(p,this.onDepositSuccess.bind(this))
    }
    onDepositSuccess({data}){
        this.setState({attemptingDeposit:false})
        makeText('null' === data.msg? 'Reguest timeout': data.msg,2)
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
        makeText(data.msg,data.status ===200 ? 2 : 1)
    }
    setPayementMethod(opt){
        const {payemnt_method}=this.state
        payemnt_method!==opt && this.setState({payemnt_method:opt})
    }
    render() {
        const { amount, password,showPass,phoneNumber, telcoType, voucher, source, attemptingWithdrawal,attemptingForceWithdrawal, attemptingDeposit,payemnt_method} = this.state, {backToMenuModal, formType, onClose, config,  } = this.props
        return (
            <Container>
                <Content>
                <Tabs tabBarUnderlineStyle={{backgroundColor:'#11c9e3'}}>
                <Tab heading={ <TabHeading style={{backgroundColor:'#eee'}}><Text>Deposit</Text></TabHeading>}>
                    <View style={{margin:10}}><Text style={{color:'#026775'}}>Select Payment Method</Text></View>
                   <ListItem icon button onPress={()=>this.setPayementMethod(1)}>
                       <Left><View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',height:30}}><Image source={MOBILEMONEY} resizeMode="contain"  style={{width:40,height:30,}}/></View></Left>
                       <Body><View style={{flexDirection:'row',alignItems:'center'}}><View><Text>Mobile Money</Text></View></View></Body>
                       <Right><Radio selected={payemnt_method === 1}  onPress={()=>this.setPayementMethod(1)}/></Right>
                   </ListItem>
                   <ListItem icon button onPress={()=>this.setPayementMethod(2)}>
                       <Left><Icon name="card" style={{color:'#046380'}}/></Left>
                       <Body><Text>Card Payment</Text></Body>
                       <Right><Radio selected={payemnt_method === 2}  onPress={()=>this.setPayementMethod(2)}/></Right>
                   </ListItem>
                </Tab>
                <Tab heading={ <TabHeading style={{backgroundColor:'#eee'}}><Text>withdraw</Text></TabHeading>}>
                </Tab>
                </Tabs>
                </Content>
            </Container>
        )
    }
}