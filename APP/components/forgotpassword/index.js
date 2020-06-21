import React,{PureComponent} from 'react'
import  moment from 'moment-timezone'
import {validateSMSCode,validatePhone,validatePassword} from '../../utils/index'
import { TouchableNativeFeedback, View, Text, ActivityIndicator, StyleSheet, LayoutAnimation } from 'react-native'
import { Input, Item, Label, Container, Content } from 'native-base'
import API from '../../services/api'
import { calcMD5 } from '../../utils/jsmd5'
import CustomIcon from '../customIcon';
import { viewStyles } from '../../common'
const $api = API.getInstance()
export default class ForgotPassword extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      mobilenumber: '',
      smscode: '',
      countdown: 60,
      howPass: false,
      c_password: '',
      password: '',
      formStep: 1,
      passMismatch:false,
      attemptingPassReset:false,resetHasError:false,resetErrorMSG:'',smsHasError:false,smsErrorMSG:''
    }
    this.$publicKey="ZDJSc2QzbDBlSG8yTmpZPQ=="
    this.onResetSuccess = this.onResetSuccess.bind(this)
    this.resetPassword = this.resetPassword.bind(this)
    this.timer = this.timer.bind(this)
    this.startCountDown = this.startCountDown.bind(this)
    this.resetPass = this.resetPass.bind(this)
    this.onSMSSend = this.onSMSSend.bind(this)
    this.sendSMS = this.sendSMS.bind(this)
  }
  sendSMS() {
    this.setState({ formStep: 2 })
    const number = this.state.mobilenumber
    if (number !== '') {
      this.setState({sendingSMS:true,smsHasError:false,smsErrorMSG:'',signupHasError:false,signupErrorMSG:'',canResend: false})
      let $time = moment().format('YYYY-MM-DD H:mm:ss'),
      $hash =calcMD5(`dialing${233}mobile${number}time${$time}${this.$publicKey}`)
      $api.sendSMS({mobile:number,dialing:233,time:$time,hash:$hash},({data})=>(this.onSMSSend(data)))
    }
  }
  resetPass() {
   const { mobilenumber, smscode, password } = this.state

   this.comparePasswords()?this.resetPassword({mobilenumber:mobilenumber,sms:smscode,password:password}):this.setState({passMismatch:true})
  }
  onSMSSend(data) {
    if(data.status === 200){
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
      this.setState({sendingSMS:false,smsHasError:false,smsErrorMSG:'',formStep: 2})
      this.startCountDown()
      }
       else this.setState({sendingSMS:false,smsHasError:true,smsErrorMSG:data.msg})
  
  }

  canResetPass() {
    const { mobilenumber, smscode, c_password, password } = this.state
    return !this.comparePasswords() || (smscode==='' || !validateSMSCode(smscode)) || c_password === '' || (password=== '' || !validatePassword(password)) || (mobilenumber==='' || !validatePhone(mobilenumber))
  }
  startCountDown() {
    this.setState({ countdown: 60 })
    this.countdownTimer = setInterval(() => this.timer(), 1000)
  }
  timer() {
    let count = this.state.countdown
    if (count >= 1) this.setState({ countdown: count - 1 })
    else {
      clearInterval(this.countdownTimer)
      this.setState({ canResend: true })
    }
  }
  newPassword(){
    this.setState({formStep:3})
  }
  onInputChange(e,name) {
    let  newState = {}
    newState[name] = e
    newState[name+'Empty']= false
    this.setState(newState)
  }
  comparePasswords(){
    const {password,c_password}= this.state
    return  password.trim() === c_password.trim()
  }
  back(){
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
    clearInterval(this.countdownTimer)
    this.setState({formStep:1,countdown:60,canResend:false})
    }
    resetPassword(data){
      this.setState({attemptingPassReset:true,resetHasError:false,resetErrorMSG:'',smsHasError:false,smsErrorMSG:''})
      const $dialing_code=233,time= moment().format('YYYY-MM-DD H:mm:ss'),mobilenumber= data.mobilenumber,password=data.password,sms=data.sms,CPassword =data.password,
      $hash = calcMD5(`dialing_code${$dialing_code}mobilenumber${mobilenumber}sms${sms}password${password}CPassword${CPassword}time${time}${this.$publicKey}`);
      $api.resetPassword({dialing_code:$dialing_code,mobilenumber:mobilenumber,sms:sms,password:password,CPassword:CPassword,time:time,hash:$hash},({data})=>this.onResetSuccess(data))
    }
    onResetSuccess(data){
      if(data.status === 200)
     { 
       this.setState({attemptingPassReset:false,resetHasError:false,resetErrorMSG:''})
       this.props.navigation.navigate('login')
    }
      else this.setState({attemptingPassReset:false,resetHasError:true,resetErrorMSG:data.msg})
    }
  render() {
    const { mobilenumber, smscode, countdown, canResend, formStep, c_password,c_passwordEmpty,passwordEmpty, showPass,passMismatch, password,attemptingPassReset, resetHasError,resetErrorMSG, sendingSMS,smsHasError,smsErrorMSG } = this.state
    return (
      <Container style={{ backgroundColor: '#ededf2' }}>
      <Content contentContainerStyle={{ padding: 20 }} >
                  <View style={{flex:1,margin:10}}>
                  {
                    formStep === 1 ?
                    <View style={{flex:1,borderColor:'rgba(209,209,219,.9)',borderWidth:1,padding:10,margin:10,borderRadius:20}}>
                      <View style={[styles.inputContainer,{justifyContent:'center',alignItems:'center',flexDirection:'row'}]}>
                          <Text style={{fontSize:15,fontWeight:'700'}}>Verify Your Identity</Text>
                      </View>
                      <View style={styles.inputContainer}>
                          <Text>Enter your registered Mobile Number below to recieve OTP code.</Text>
                      </View>
                      <View style={styles.inputContainer}>
                          <View>
                            <Item floatingLabel error={mobilenumber!=='' && !validatePhone(mobilenumber)}>
                              <Label className="placeholder placeholder-inactive">Mobile Number</Label>
                              <Input autoFocus={true} value={mobilenumber} onChangeText={(text)=>this.onInputChange(text,"mobilenumber")} keyboardType="phone-pad"/>
                            </Item>
                          </View>
                        <View>
                          <Text>{smsHasError? smsErrorMSG:''}</Text>
                        </View>
                        <TouchableNativeFeedback disabled={mobilenumber==='' || !validatePhone(mobilenumber)} onPress={this.sendSMS}>
                            <View style={{
                                            height: 40,
                                            flex: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderRadius: 4,
                                            backgroundColor:(mobilenumber==='' || !validatePhone(mobilenumber))?'rgba(209,209,219,.9)':'#018da0'
                                            }}>
                          {sendingSMS ?
                          <ActivityIndicator animating={true}/>:
                              <Text style={viewStyles.textWhite}>Verify Account</Text>
                          }
                            </View>
                        </TouchableNativeFeedback>
                      </View>
                      </View>
                      : 
                        <View style={{flex:1,borderColor:'rgba(209,209,219,.9)',borderWidth:1,padding:10,margin:10,borderRadius:20}}>
                          <View style={{justifyContent:"center",flexDirection:'row',margin:20}}><Text  style={{ fontSize: 20}}>Verify your Phone Number</Text></View>
                           <View style={{padding:20}}>
                            <Text style={{fontSize:12}}>We have send an SMS code to the number : <Text style={{fontSize:14,color:'#11c9e3'}}>{mobilenumber}</Text></Text>
                            <Text onPress={this.back.bind(this)} style={{color:'#018da0',margin:10}}>Not your phone number ?</Text>
                           </View>
                         
                              <View style={styles.inputContainer} >
                                <Item>
                                  <View style={{flexDirection:'row',alignItems:"center",justifyContent:'space-between'}}>
                                  <Input autoFocus={true} placeholder="SMS CODE" value={smscode}  onChangeText={(text)=> this.onInputChange(text,"smscode")}  style={{flex:1}}/>
                                  {canResend ?
                                      <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} onPress={this.sendSMS}>
                                      <View style={{width:40,height:'100%',justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
                                        <CustomIcon name="refresh" size={30} />
                                      </View>
                                      </TouchableNativeFeedback>
                                        : <View style={{width:40,height:'100%',justifyContent:'center',alignItems:'center',flexDirection:'row'}}><Text>{countdown}</Text></View>}
                                  </View>
                                </Item>
                              </View>
                          
                              <View style={styles.inputContainer}>
                              <Item floatingLabel error={((password !=='' && !validatePassword(password)) || passwordEmpty)}>
                                  <Label children="New Password" />
                                  <Input value={password} secureTextEntry={true} onChangeText={(text)=>this.onInputChange(text,'password')}/>
                              </Item>
                              {((password !=='' && !validatePassword(password)) || passwordEmpty)&&<View><Text style={styles.errorText}>{(password !=='' && !validatePassword(password)) ? 'Password must be minimum of 8 characters': 'Password cannot be empty'}</Text></View>}
                              </View>
                              <View style={styles.inputContainer}>
                              <Item floatingLabel error={passMismatch||c_passwordEmpty}>
                                  <Label children="Confirm Password" />
                                  <Input value={c_password} secureTextEntry={true} onChangeText={(text)=>this.onInputChange(text,'c_password')} onFocus={()=>this.setState({passMismatch:false})}/>
                              </Item>
                              {(passMismatch||c_passwordEmpty)&&<View><Text style={styles.errorText}>{c_passwordEmpty?"You must confirm your new password":"Password doesn't match"}</Text></View>}
                              </View>
                          <View style={{margin:10}}>
                          <Text style={styles.errorText}>{resetHasError? resetErrorMSG:''}</Text>
                          </View>
                          <TouchableNativeFeedback disabled={this.canResetPass()} onPress={this.resetPass}>
                              <View style={{
                                            height: 40,
                                            flex: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderRadius: 4,
                                            backgroundColor:this.canResetPass()?'rgba(209,209,219,.9)':'#018da0'
                                            }}>
                              {attemptingPassReset ?<ActivityIndicator animating={true}/>:<Text style={viewStyles.textWhite}>Reset Password</Text>}
                              </View>
                          </TouchableNativeFeedback>
                        </View>
                  }
                </View>
            </Content>
          </Container>
    )
  }
}
const styles= StyleSheet.create({
  inputContainer:{
    margin:10
},
errorText:{
  color:'crimson',
  fontSize:12
}
})