import React,{PureComponent} from 'react'
import { View,Text, TouchableNativeFeedback, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Item, Form, Content, Container, Label, Input } from 'native-base'
import CustomIcon from '../customIcon'
import API from '../../services/api'
import  {calcMD5} from '../../utils/jsmd5'
import { dataStorage } from '../../common'
import { allActionDucer } from '../../actionCreator'
import { MODAL, PROFILE } from '../../actionReducers'
import moment from 'moment'
const $api = API.getInstance()

 export default class LoginForm extends PureComponent{
  constructor(props){
    super(props)
    this.state={
      showPass:false,
      username:'',
      password:'',
      phoneNumber:'',
    }
    this.toggleShow = this.toggleShow.bind(this);
    this.onInputChange = this.onInputChange.bind(this)
    this.attemptLogin = this.attemptLogin.bind(this)
    this.errMSG= {PhoneErr:'Invalid Phone Number',AccOrPassErr:'Unkown Account or Wrong Password'}
  }
  onInputChange(e){
    let $el = e.target,newState = {}
    newState[$el.name]= $el.value
    this.setState(newState)
  }
  login(data){
    this.props.dispatch(allActionDucer(MODAL,{attemptingLogin:true,loginHasError:false,loginErrorMSG:''}))
    const pass = data.password,mobile = data.mobilenumber,$time = moment().format('YYYY-MM-DD H:mm:ss'),
    $hash =calcMD5(`mobilenumber${mobile}password${pass}time${$time}${this.props.appState.$publicKey}`)
    $api.login({mobilenumber:mobile,password:pass,time:$time,hash:$hash},this.onLoginSuccess.bind(this))
  }
  attemptLogin(){
    const {password,phoneNumber}=this.state
    this.login({mobilenumber:phoneNumber,password:password})
  }
  onLoginSuccess({data}){
    if(data.status ===200){
      let date = new Date();
    date.setTime(date.getTime()+(0.5*24*60*60*1000));
    this.props.dispatch(allActionDucer(PROFILE,data.data))
    this.props.dispatch(allActionDucer(MODAL,{attemptingLogin:false,loginHasError:false,loginErrorMSG:''}))
    let userId = data.data.uid, authToken = data.data.AuthToken;
    dataStorage('loginState',{id:userId,AuthToken:authToken,mobile:data.data.mobilenumber,date:date})
    this.props.navigation.popToTop()
    // this.props.dispatchLogin()
    }
     else this.onLoginError(data)
  }
  onLoginError(data){
    this.props.dispatch(allActionDucer(MODAL,{attemptingLogin:false,loginHasError:true,loginErrorMSG:data.msg}))
  }
toggleShow(){
  !this.props.attemptingLogin &&this.setState(prevState=>({showPass: !prevState.showPass}));
}
setPhoneNumber(e){
  let newState = {}
  newState['phoneNumber']= e
  this.setState(newState)
  }
setPassword(e){
  let newState = {}
  newState['password']= e
  this.setState(newState)
  }
     render(){
      const {showPass,password,phoneNumber}=this.state,{loginHasError,
        loginErrorMSG,attemptingLogin}= this.props.sb_modal
         return(
          <Container style={{ backgroundColor: '#ededf2' }}>
          <Content contentContainerStyle={{ padding: 20 }} >
            <View style={{flex:1,borderColor:'rgba(209,209,219,.9)',borderWidth:1,borderRadius:20,padding:20}}>
            <View style={{flex:1}}>
                      <Text style={{ textAlign: 'center', fontSize: 20, color: '#AEB3B1',textTransform:'uppercase' }}>Sign In</Text>
                  </View>
              <Form style={{marginTop:40}}>
              <Item floatingLabel style={{marginLeft:0}}>
              <Label style={{color:'#194b51'}}  children="Phone Number" />
              <Input
                  autoFocus
                  keyboardType={'phone-pad'}
                  enablesReturnKeyAutomatically
                  editable={!attemptingLogin}
                  ref={(input)=>{this.phonenumber = input}}
                  onChangeText={(number) => this.setPhoneNumber(number)}
              />
              </Item>
              <Item floatingLabel style={{marginLeft:0}}>
              <Label style={{color:'#194b51'}}  children="Password" />
                  <Input
                      ref={(input)=>{this.password = input}}
                      secureTextEntry={!showPass}
                      enablesReturnKeyAutomatically
                      editable={!attemptingLogin}
                      onChangeText={(e) => {this.setPassword(e)}}/>
                  <TouchableOpacity onPress={this.toggleShow}>
                    <CustomIcon name={`${showPass ?'visible':'hidden'}`} color="#AEB3B1" size={30}/>
                  </TouchableOpacity>
                              
              </Item>
                <View style={{marginTop:40,flex:1,flexDirection:'row',alignItems:'center'}}>
                <TouchableNativeFeedback useForeground={TouchableNativeFeedback.canUseNativeForeground()}
                  onPress={this.attemptLogin}
                  disabled={attemptingLogin || phoneNumber==='' || password===''}
                  >
                  <View style={{
                      height: 40,
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 4,
                      backgroundColor: "#018da0",
                  }}>
                  <ActivityIndicator animating={attemptingLogin} color="#fff" size={20} style={{ display: !attemptingLogin ? "none" : "flex" }} />
                    <Text style={[{display: attemptingLogin ? "none" : "flex",color:'#fff',fontSize:16,textTransform:'uppercase'}]} children="Log In" />
                  </View>
                </TouchableNativeFeedback>
                </View>
                <View style={{paddingTop:10,paddingBottom:10}}>
                    <Text style={{color:'crimson'}}>{loginHasError? this.errMSG[loginErrorMSG]?this.errMSG[loginErrorMSG]:loginErrorMSG:''}</Text>
                </View>
                <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:20,paddingLeft:10,paddingRight:10}}>
                    <TouchableNativeFeedback useForeground={TouchableNativeFeedback.canUseNativeForeground()}
                            onPress={()=>{this.props.navigation.navigate('forgotpassword')}}
                            >
                        <Text style={{color:'#194b51'}}>Forgot password? </Text>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback useForeground={TouchableNativeFeedback.canUseNativeForeground()}
                        onPress={()=>{this.props.navigation.navigate('register')}}
                        >
                    <Text style={{color:'#194b51',marginLeft:10}}>
                          Register 
                    </Text></TouchableNativeFeedback>
                </View>
          </Form>
            </View>
          </Content>
          </Container>
         )
     }
 }