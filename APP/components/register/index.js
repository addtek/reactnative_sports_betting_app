import React,{PureComponent} from 'react'
import { View, ScrollView,Text, Platform,LayoutAnimation, TouchableNativeFeedback, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native'
import {validateEmail,validateFullname,validatePhone,validatePassword,validateUsername,validateSMSCode} from '../../utils/index'
import { Item, Form, Content, Container, Label, Input, CheckBox } from 'native-base'
import CustomIcon from '../customIcon'
import API from '../../services/api'
import  {calcMD5} from '../../utils/jsmd5'
import { dataStorage } from '../../common'
import { allActionDucer } from '../../actionCreator'
import { MODAL, PROFILE } from '../../actionReducers'
import moment from 'moment'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
const $api = API.getInstance()
export default class RegisterFrom extends PureComponent {
    constructor(props){
        super(props)
        this.state={
          showPass:false,
          username:'',
          password:'',
          email:'',
          firstname:'',
          lastname:'',
          sms:'',
          phoneNumber:'',
          formStep:1,
          countdown:60,
          canResend:false,
          terms:false,
          phoneNumberEmpty:false,
          usernameEmpty:false,
          termsEmpty:false,
          passwordEmpty:false,
          recaptch_value:'',
          sendingSMS:false,
          lastnameEmpty:false,
          firstnameEmpty:false,
          emailEmpty:false
        }
        this.toggleShow = this.toggleShow.bind(this);
        this.timer = this.timer.bind(this);
        this.verifyPhone = this.verifyPhone.bind(this);
        this.startCountDown = this.startCountDown.bind(this);
        this.recaptchaRef = React.createRef()
        this.onSMSSend = this.onSMSSend.bind(this)
        this.resendSMS = this.resendSMS.bind(this)
        this.countdownTimer = null
      }
    componetDidMount(){
        // ReactGA.modalview('/register');
    }
    onInputChange(e){
    let $el = e,newState = {}
     console.log($el)
    newState[$el.name]= $el.value
    newState[$el.name+'Empty']= false
    this.setState(newState)
    }
    setPhoneNumber(e){
    let $el = e,newState = {}
    newState['phoneNumber']= e
    newState['phoneNumberEmpty']= false
    this.setState(newState)
    }
    setNickname(e){
    let $el = e,newState = {}
    newState['username']= e
    newState['usernameEmpty']= false
    this.setState(newState)
    }
    setFirstName(e){
    let $el = e,newState = {}
    newState['firstname']= e
    newState['firstnameEmpty']= false
    this.setState(newState)
    }
    setLastName(e){
    let $el = e,newState = {}
    newState['lastname']= e
    newState['lastnameEmpty']= false
    this.setState(newState)
    }
    setEmail(e){
    let $el = e,newState = {}
    newState['email']= e
    newState['emailEmpty']= false
    this.setState(newState)
    }
    setPassword(e){
    let $el = e,newState = {}
    newState['password']= e
    newState['passwordEmpty']= false
    this.setState(newState)
    }
    setSMSCode(e){
    let $el = e,newState = {}
    newState['sms']= e
    newState['smsEmpty']= false
    this.setState(newState)
    }
    onAgreeChange(){
    const {terms}=this.state
    // !terms &&  this.recaptchaRef.current.execute()
    this.setState(prev=>({terms:!prev.terms}))
    }
    canContinue(){
        const {password,phoneNumber,firstname,lastname,email,terms}=this.state
        return (password==='' || phoneNumber==='' || lastname==='' || firstname===''|| email!=='' || !terms)
    }
    toggleShow(){
    
      this.setState(prevState=>({showPass: !prevState.showPass}));
    }
    startCountDown(){
        this.setState({countdown:60})
        this.countdownTimer = setInterval(()=>this.timer(),1000)
     }
    timer(){
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
        let count = this.state.countdown
        if(count>1)this.setState({countdown:count-1})
        else{
            clearInterval(this.countdownTimer)
            this.setState({canResend:true})
        }
    }
    createAccount(data){
        this.props.dispatch(allActionDucer(MODAL,{attemptingSignup:true,signupHasError:false,signupErrorMSG:'',resetHasError:false,resetErrorMSG:'',smsHasError:false,smsErrorMSG:''}))
        const pass = data.password,mobile = data.mobilenumber,$time = moment().format('YYYY-MM-DD H:mm:ss'),
        $hash =calcMD5(`mobilenumber${mobile}password${pass}CPassword${pass}sms${data.sms}nickname${data.nickname}dialing_code${233}country_codeghcurrency_name${'ghs'}email${data.email}invite${''}time${$time}${this.props.appState.$publicKey}`)
        $api.createAccount({"g-recaptcha-response":data.recaptcha,"g-recaptcha-type":true,sms:data.sms,dialing_code:233,country_code:'gh',invite:'',currency_name:'ghs',nickname:data.nickname,email:data.email,lastName:data.lastName,firstName:data.firstName,mobilenumber:mobile,password:pass,CPassword:pass,time:$time,hash:$hash},this.onAccountCreated.bind(this))
      }
      sendSMS(mobile, success){
        this.props.dispatch(allActionDucer(MODAL,{sendingSMS:true,smsHasError:false,smsErrorMSG:'',signupHasError:false,signupErrorMSG:'',}))
        let $time = moment().format('YYYY-MM-DD H:mm:ss'),
        $hash =calcMD5(`dialing${233}mobile${mobile}time${$time}${this.props.appState.$publicKey}`)
        $api.sendSMS({mobile:mobile,dialing:233,time:$time,hash:$hash},({data})=>(this.smsSent(data,success)))
      }
      smsSent(data,success){
        if(data.status === 200){
        this.props.dispatch(allActionDucer(MODAL,{sendingSMS:false,smsHasError:false,smsErrorMSG:''}))
        success()
        }
         else this.props.dispatch(allActionDucer(MODAL,{sendingSMS:false,smsHasError:true,smsErrorMSG:data.msg}))
      }
      onAccountCreated({data}){
        if(data.status ===200){
          let date = new Date();
          date.setTime(date.getTime()+(0.5*24*60*60*1000));
          this.props.dispatch(allActionDucer(PROFILE,data.data))
          this.props.dispatch(allActionDucer(MODAL,{created:true,attemptingSignup:false,signupHasError:false,signupErrorMSG:''}))
          let userId = data.data.uid, authToken = data.data.AuthToken;
          dataStorage('loginState',{id:userId,AuthToken:authToken,mobile:data.data.mobilenumber,date:date})
          this.props.navigation.popToTop()
        }
         else this.onCreateError(data)
      }
      onCreateError(data){
        this.props.dispatch(allActionDucer(MODAL,{signupHasError:true,signupErrorMSG:data.msg,attemptingSignup:false}))
      }
    verifyPhone(){
        const {phoneNumber,password,terms,recaptch_value,firstname,lastname,email,username} =  this.state
        if( (phoneNumber !== '' && validatePhone(phoneNumber))&& (email!=='' && validateEmail(email)) && (lastname!=='' && validateFullname(lastname)) && (firstname!=='' && validateFullname(firstname)) && (password!=='' && validatePassword(password))&& (username !=='' && validateUsername(username))&& terms ) {
            this.setState({canResend:false,sendingSMS:true}) 
            this.sendSMS(phoneNumber,this.onSMSSend)
        }else {
            let dirty={}
            if(!terms)
            dirty.termsEmpty=true
            if(phoneNumber === '' || !validatePhone(phoneNumber))
            dirty.phoneNumberEmpty=true
            if(firstname === '' || !validateFullname(firstname))
            dirty.firstnameEmpty=true
            if(lastname === '' || !validateFullname(lastname))
            dirty.lastnameEmpty=true
            if(email === '' || !validateEmail(email))
            dirty.emailEmpty=true
            if(password === '' || !validatePassword(password))
            dirty.passwordEmpty=true
            if(username ==='' || !validateUsername(username))
            dirty.usernameEmpty=true
            this.setState(dirty)
        }
    }
    resendSMS(){
        this.setState({canResend:false,sendingSMS:true,countdown:60}) 
        this.sendSMS(this.state.phoneNumber,this.onSMSSend)
    }
    onSMSSend(){
        LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
        this.setState({formStep:2,sendingSMS:false})
        this.startCountDown()
    }
    back(){
    clearInterval(this.countdownTimer)
    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
    this.setState({formStep:1,countdown:60,canResend:false,terms:false})
    }
    setRecaptchaValue(value) {
        e.persist()
        this.setState({recaptch_value: value})
        // e.value !==''  && this.verifyPhone()
    }
    attemptSignup(){
        // clearInterval(this.countdownTimer)
        const {phoneNumber,username,password,sms,lastname,firstname,email,recaptch_value} =  this.state
        this.createAccount({recaptcha:recaptch_value,mobilenumber:phoneNumber,nickname:username,password:password,sms:sms,lastName:lastname,firstName:firstname,email:email})
    }
     close(){
        clearInterval(this.countdownTimer)
        this.props.onClose()
     }
    render() {
        const {showPass,password,phoneNumber,email,username,emailEmpty,sms,lastname,firstname,formStep,countdown,canResend,terms,phoneNumberEmpty,
            lastnameEmpty,firstnameEmpty,
            termsEmpty,
            passwordEmpty}=this.state,{attemptingSignup,sendingSMS,signupHasError,signupErrorMSG,smsErrorMSG,smsHasError,created}=this.props.sb_modal
        return (
            <Container style={{ backgroundColor: '#ededf2' }}>
                <Content contentContainerStyle={{ padding: 20 }} >
                 <View style={{flex:1,borderColor:'rgba(209,209,219,.9)',borderWidth:1,borderRadius:20,padding:20}}>
                 <View style={{flex:1}}>
                                <Text style={{ textAlign: 'center', fontSize: 20, color: '#AEB3B1',textTransform:'uppercase' }}>Registration</Text>
                            </View>
                                <Form>

                                        {
                                      created?
                                      <View className={` ${formStep !==2? 'animated fadeOut':'animated fadeIn'}`} di="second-form">
                                            <Text className="recaptcha-version-3" style={{fontSize:20}}>
                                              Thank You for joining yourdomain.com(GH), Your Account was created successfully!
                                            </Text>
                                            <Text>Your currently signed!</Text>
                                            <Text style={{fontSize:20}}>Bet more, Win Big!!!</Text>
                                            </View>
                                            :
                                      formStep ===1 && !created?
                                        <>
                                        <Item floatingLabel error={(phoneNumber !=='' && !validatePhone(phoneNumber)) || phoneNumberEmpty} style={{marginLeft:0}}>
                                            <Label style={{color:'#194b51'}}  children="Phone Number" />
                                            <Input
                                                autoFocus
                                                keyboardType={'phone-pad'}
                                                enablesReturnKeyAutomatically
                                                editable={!sendingSMS}
                                                ref={(input)=>{this.phonenumber = input}}
                                                onChangeText={(number) => this.setPhoneNumber(number)}
                                            />
                                            </Item>
                                            {((phoneNumber !=='' && !validatePhone(phoneNumber)) || phoneNumberEmpty) &&
                                            <View className="field-message-wrapper">
                                                <Text style={styles.errorText}>{(phoneNumber !=='' && !validatePhone(phoneNumber)) ? 'Phone number must match format: 0240000000  or 240000000': 'Phone number cannot be empty'}</Text>
                                            </View>}

                                            <Item floatingLabel error={username !=='' && !validateUsername(username)} style={{marginLeft:0}}>
                                                <Label style={{color:'#194b51'}}  children="Nickname" />
                                                <Input
                                                    enablesReturnKeyAutomatically
                                                    editable={!sendingSMS}
                                                    ref={(input)=>{this.nickname = input}}
                                                    onChangeText={(e) => {this.setNickname(e)}} />
                                            </Item>
                                            {(username !=='' && !validateUsername(username)) &&
                                            <View className="field-message-wrapper">
                                                <Text style={styles.errorText}>Nickname must be minimum of 6 characters</Text>
                                            </View>}
                                            <Item floatingLabel error={(firstname !=='' && !validateFullname(firstname)) || firstnameEmpty} style={{marginLeft:0}}>
                                            <Label style={{color:'#194b51'}}  children="First Name" />
                                                <Input
                                                    enablesReturnKeyAutomatically
                                                    editable={!sendingSMS}
                                                    ref={(input)=>{this.firstname = input}}
                                                    onChangeText={(e) => {this.setFirstName(e)}} />
                                            </Item>
                                            {((firstname !=='' && !validateFullname(firstname)) || firstnameEmpty) && 
                                                <View className="field-message-wrapper">
                                                    <Text style={styles.errorText}>{(firstname !=='' && !validateFullname(firstname)) ? 'First name must be minimum of 2 characters': 'First name cannot be empty'}</Text>
                                            </View>}
                                            <Item floatingLabel error={(lastname !=='' && !validateFullname(lastname)) || lastnameEmpty} style={{marginLeft:0}}>
                                            <Label style={{color:'#194b51'}} children="Last Name" />
                                                <Input
                                                    enablesReturnKeyAutomatically
                                                    editable={!sendingSMS}
                                                    ref={(input)=>{this.lastname = input}}
                                                    onChangeText={(e) => {this.setLastName(e)}} />          
                                                            
                                                        
                                            </Item>
                                            {((lastname !=='' && !validateFullname(lastname)) || lastnameEmpty) &&
                                                <View className="field-message-wrapper">
                                                    <Text style={styles.errorText}>{(lastname !=='' && !validateFullname(lastname)) ? 'Last name must be minimum of 2 characters': 'Last name cannot be empty'}</Text>
                                            </View>}
                                            <Item floatingLabel error={(email !=='' && !validateEmail(email)) || emailEmpty} style={{marginLeft:0}}>
                                            <Label style={{color:'#194b51'}} children="Email" />
                                                <Input
                                                    enablesReturnKeyAutomatically
                                                    keyboardType={'email-address'}
                                                    editable={!sendingSMS}
                                                    ref={(input)=>{this.email = input}}
                                                    onChangeText={(e) => {this.setEmail(e)}} />                  
                                            </Item>
                                            {((email !=='' && !validateEmail(email)) || emailEmpty) &&
                                                <View className="field-message-wrapper">
                                                    <Text style={styles.errorText}>{(email !=='' && !validateEmail(email)) ? 'Invalid email format': 'Email cannot be empty'}</Text>
                                            </View>}
                                            <Item floatingLabel error={(password !=='' && !validatePassword(password)) || passwordEmpty} style={{marginTop:20,marginLeft:0}}>
                                              <Label style={{color:'#194b51'}} children="Password" />
                                                <Input
                                                    ref={(input)=>{this.password = input}}
                                                    secureTextEntry={!showPass}
                                                    enablesReturnKeyAutomatically
                                                    editable={!sendingSMS}
                                                    onChangeText={(e) => {this.setPassword(e)}}/>
                                                <TouchableOpacity onPress={this.toggleShow}>
                                                    <CustomIcon name={`${showPass ?'visible':'hidden'}`} color="#AEB3B1" size={30}/>
                                                </TouchableOpacity>        
                                            </Item>
                                            {((password !=='' && !validatePassword(password)) || passwordEmpty) && 
                                            <View className="field-message-wrapper">
                                                <Text style={styles.errorText}>{(password !=='' && !validatePassword(password)) ? 'Password must be minimum of 8 characters': 'Password cannot be empty'}</Text>
                                            </View>}
                                            <View style={{flex:1,flexDirection:'row',alignItems:'center',marginTop:20,paddingRight:5}}>
                                            <CheckBox
                                             
                                                checked={terms}
                                                color={'#026775'}
                                                onPress={(e)=>this.onAgreeChange(e)}
                                                />
                                                <TouchableWithoutFeedback onPress={()=>this.onAgreeChange()}>
                                                    <Label style={{marginLeft:20,color:'#194b51',fontSize:14}} children="I agree to all Terms &amp; Conditions &amp; Privacy Policy  and I am over 18 years of age." />
                                                </TouchableWithoutFeedback>

                                            </View>
                                            {/* <Text className="recaptcha-version-3">
                                                This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy" target="_blank">Privacy Policy</a> and <a href="https://policies.google.com/terms" target="_blank">Terms of Service</a> apply.
                                            </Text> */}
                                            <View style={{paddingTop:10,paddingBottom:10}}>
                                                <Text style={{color:'crimson'}}>{smsHasError? smsErrorMSG:''}</Text>
                                            </View>
                                            <TouchableNativeFeedback useForeground={TouchableNativeFeedback.canUseNativeForeground()}
                                                onPress={this.verifyPhone}
                                                disabled={sendingSMS}
                                                >
                                                <View style={{
                                                    height: 40,
                                                    flex: 1,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    borderRadius: 4,
                                                    backgroundColor: "#018da0",
                                                }}>
                                                <ActivityIndicator animating={sendingSMS} color="#fff" size={20} style={{ display: !sendingSMS ? "none" : "flex" }} />
                                                 <Text style={[{display: sendingSMS ? "none" : "flex",color:'#fff',fontSize:16,textTransform:'uppercase'}]} children="Create Account" />
                                                </View>
                                            </TouchableNativeFeedback>
                                        </>
                                       : 
                                        <View style={{marginTop:30}}>
                                            <Text style={{color:'#194b51',fontSize:20,marginBottom:20,textTransform:'uppercase'}}>
                                              Verify your Phone Number
                                            </Text>
                                            <Text style={{color:'#194b51',marginBottom:20}}>We have sent an SMS code to the number : {phoneNumber}</Text>
                                            <Item style={{marginLeft:0}}>
                                            {/* <Label style={{color:'#194b51'}}>SMS CODE</Label> */}
                                            <Input
                                                style={{color:'#194b51'}}
                                                    ref={(input)=>{this.password = input}}
                                                    enablesReturnKeyAutomatically
                                                    keyboardType={'number-pad'}
                                                    placeholder="SMS CODE"
                                                    placeholderTextColor="#194b51"
                                                    editable={!attemptingSignup}
                                                    onChangeText={(e) => {this.setSMSCode(e)}}/>
                                               {canResend?<TouchableOpacity onPress={this.resendSMS}>
                                                                <CustomIcon name={`refresh`} color="#AEB3B1" size={30}/>
                                                            </TouchableOpacity>
                                                                :
                                                                <View style={{width:50,height:40,backgroundColor:'#E7E7E7',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                                                    <Text style={{color:'#194b51',fontWeight:'700',fontSize:16}}>{countdown}</Text></View>}
                                            </Item>
                                            <View style={{paddingTop:10,paddingBottom:10}}>
                                                <Text style={{color:'crimson'}}>{signupHasError? signupErrorMSG:''}</Text>
                                            </View>
                                            
                                            <TouchableNativeFeedback useForeground={TouchableNativeFeedback.canUseNativeForeground()}
                                                onPress={this.back.bind(this)}>
                                            <Text style={{color:'#194b51',marginTop:20,marginBottom:20}}>
                                             Not your phone number ?
                                            </Text>
                                            </TouchableNativeFeedback>
                                            <TouchableNativeFeedback useForeground={TouchableNativeFeedback.canUseNativeForeground()}
                                                onPress={this.attemptSignup.bind(this)}
                                                disabled={sms ==='' || !validateSMSCode(sms)  || attemptingSignup}
                                                >
                                                <View style={{
                                                    height: 40,
                                                    flex: 1,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    borderRadius: 4,
                                                    backgroundColor: "#018da0",
                                                }}>
                                                <ActivityIndicator animating={attemptingSignup} color="#fff" size={20} style={{ display: !attemptingSignup ? "none" : "flex" }} />
                                                 <Text style={[{display: attemptingSignup ? "none" : "flex",color:'#fff',fontSize:16,textTransform:'uppercase'}]} children="Submit" />
                                                </View>
                                            </TouchableNativeFeedback>
                                           
                                        </View>
                                       }
                                        <TouchableNativeFeedback useForeground={TouchableNativeFeedback.canUseNativeForeground()} onPress={()=>{this.props.navigation.navigate('login')}} >
                                        <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center',marginTop:20}}>
                                            <Text style={{color:'#194b51'}}>Already have an account? </Text>
                                            <Text style={{color:'#194b51',marginLeft:10}}>
                                                 Sign In 
                                            </Text>
                                        </View>
                                        </TouchableNativeFeedback>
                                    {/* <ReCAPTCHA
                                    ref={this.recaptchaRef}
                                    reCaptchaType="invisible"
                                    onExecute ={this.setRecaptchaValue}
                                    siteKey ="6LcL_MAUAAAAACsmwoZ6vbEp3sEiOzgk_6kOKtD-"
                                    /> */}
                                </Form> 
                 </View>
                </Content> 
               </Container>
        )
    }
}
 const styles= StyleSheet.create({
     errorText:{
         color:'crimson',
         fontSize:12
     }
 })