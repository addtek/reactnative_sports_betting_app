import React, { PureComponent } from 'react'
import  moment from 'moment-timezone'
import {dataStorage, viewStyles} from '../../common'
import { allActionDucer } from '../../actionCreator'
import {PROFILE, MODAL } from '../../actionReducers'
import {validateEmail,validateFullname,validatePhone,validatePassword,validateUsername,validateSMSCode, makeText} from '../../utils/index'
import { calcMD5 } from '../../utils/jsmd5'
import API from '../../services/api'
import CustomIcon from '../customIcon';
import { Container, Content, Tabs, Tab, TabHeading, Item, Label, Input, Picker, Icon} from 'native-base'
import { Text, View,TouchableNativeFeedback, StyleSheet, ActivityIndicator } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
const $api = API.getInstance()
export default class UserProfile extends PureComponent{
    constructor(props){
        super(props)
        this.state={
        formType:1,
        showPass:false,
        username:this.props.profile.nickname,
        password:'',
        old_password:'',
        c_password:'',
        uid:null,
        AuthToken:null,
        email:this.props.profile.email,
        firstname:this.props.profile.firstName,
        lastname:this.props.profile.lastName,
        phoneNumber:'',
        idnumber:this.props.profile.idnumber,
        gender:this.props.profile.gender,
        birth_date:this.props.profile.birth_date?moment.unix(this.props.profile.birth_date).toDate():moment().toDate(),
        address:this.props.profile.address,
        document_type:this.props.profile.document_type,
        formStep:1,
        countdown:60,
        canResend:false,
        terms:false,
        phoneNumberEmpty:false,
        usernameEmpty:false,
        lastnameEmpty:false,
        firstnameEmpty:false,
        termsEmpty:false,
        passwordEmpty:false,
        showDatePicker:false,
        passMismatch:false,
        tabView:0
        }
        this._tabs=null
        this.$publicKey="ZDJSc2QzbDBlSG8yTmpZPQ=="
         $api.setToken(this.state.AuthToken)
         this.onInputChange= this.onInputChange.bind(this)
         this.toggleShow= this.toggleShow.bind(this)
         this.changePass= this.changePass.bind(this)
         this.onChangeTab= this.onChangeTab.bind(this)
         this.showDatePickerBD= this.showDatePickerBD.bind(this)
         this.onDateChangeBD= this.onDateChangeBD.bind(this)
    }
     componentDidMount() {
        dataStorage('loginState',{},0)
        .then(userData=>{
        if(userData){
            userData= JSON.parse(userData)
            const {id,AuthToken,mobile} = userData
            this.setState({uid:id,AuthToken:AuthToken,phoneNumber:mobile})

        }
        })
        const {tabView}=this.props.navigation.state.params ?this.props.navigation.state.params:{};
        if(void 0!==tabView && null!==tabView)null!==this._tabs &&setTimeout(this._tabs.goToPage.bind(this._tabs,tabView));
     }
     changeForm(type){
        type !== this.props.formType && this.props.changeForm(type)
     }
     toggleShow(){
        !this.state.changingpass &&this.setState(prevState=>({showPass: !prevState.showPass}));
      }
      onDateChangeBD(e,value) {
        if(e.type==='set'){
          let val = value, mDate = moment(val).toDate()
          this.setState({birth_date:mDate,showDatePicker:false})
        }
        else this.setState({showDatePicker:false})
        
       
      }
      showDatePickerBD() {
        this.setState(prevState=>({showDatePicker:!prevState.showDatePicker}))
      }
     onInputChange(text,name){
        let newState = {}
        newState[name]= text
        newState[name+'Empty']= false
        if(!this.state.formEdited)newState['formEdited']= true
        this.setState(newState)
        }
    updateInfo(){
        this.setState({updatingInfo:true})
        const {username,phoneNumber,formEdited,birth_date,document_type,idnumber,uid,email,AuthToken,address,gender,firstname,lastname}= this.state,$time = moment().format('YYYY-MM-DD H:mm:ss'),
        $hash =calcMD5(`AuthToken${AuthToken}uid${uid}mobile${phoneNumber}email${email}nickname${username}gender${gender}birth_date${birth_date!==''?moment(birth_date).unix():0}document_type${document_type}idnumber${idnumber}address${address}time${$time}${this.$publicKey}`)
        let p = {mobile:phoneNumber,uid:uid,AuthToken:AuthToken,idnumber:idnumber,address:address,email:email,gender:gender,uid:uid,nickname:username,firstName:firstname,lastName:lastname,document_type:document_type,time:$time,hash:$hash}
        if(birth_date!== '') p['birth_date'] = moment(birth_date).unix(); else  p['birth_date'] = 0
        if(formEdited)$api.updateProfile(p,this.onEditSucess.bind(this))
        else {
            this.setState({updatingInfo:false})
            makeText('Noting to Update!', 5000)
        }
    }
    changePass(){
        const {uid,AuthToken,password,old_password,phoneNumber,c_password}= this.state,$time = moment().format('YYYY-MM-DD H:mm:ss'),
        $hash =calcMD5(`uid${uid}password${old_password}AuthToken${AuthToken}time${$time}${this.$publicKey}`)
        if(password===c_password){
            this.setState({changingpass:true})
            $api.changePassword({uid:uid,old_pass:old_password,mobilenumber:phoneNumber,password:password,time:$time,hash:$hash,AuthToken:AuthToken},this.onPasswordChanged.bind(this))
        }else{
            this.setState({passMismatch:true})
        }
    }
    onPasswordChanged({data}){
        makeText(data.msg,5000)
        if(data.status ===200){
            //  this.props.dispatchLogout(1)
            //  this.props.dispatch(allActionDucer(MODAL,{modalOpen:false,type:0}))
        }
        this.setState({changingpass:false,formEdited:false})
    }
    onEditSucess({data}){
        if(data.status ===200){
            const {username,phoneNumber,birth_date,document_type,idnumber,uid,email,address,gender}= this.state
            this.props.dispatch(allActionDucer(PROFILE,{birth_date:birth_date!==''?moment(birth_date).unix():0,mobile:phoneNumber,uid:uid,idnumber:idnumber,address:address,email:email,gender:gender,nickname:username,document_type:document_type}))
        }
        this.setState({edited:data.msg,updatingInfo:false,formEdited:false})
        makeText(data.msg,5000)
    }
    onChangeTab(e){
        e.i!==this.state.tabView&&this.setState({ tabView: e.i })
    }
    render(){
         const {showPass,emailEmpty,password,phoneNumber,email,username,c_password,updatingInfo,changingpass,firstnameEmpty,lastnameEmpty,passMismatch,old_passwordEmpty,c_passwordEmpty,
            passwordEmpty,idnumber,birth_date,gender,address,document_type,old_password,lastname,firstname,showDatePicker,tabView}=this.state,{profile}=this.props
        return(
            <Container>
            <Content>
            <Tabs tabBarUnderlineStyle={{backgroundColor:'#11c9e3'}} onChangeTab={this.onChangeTab} page={tabView} ref={component => this._tabs = component}>
            <Tab heading={ <TabHeading style={{backgroundColor:'#eee'}}><Text>Update Info</Text></TabHeading>}>
                <View style={{margin:10,borderRadius:5,borderColor:'#eee',borderWidth:1}}>
                <View style={{padding:10}}>
                  <View style={styles.header}>
                    <CustomIcon name={profile.completeInfo?"check-circle":"warning"} size={20} color={profile.completeInfo?"#299e77":"#b6862e"}/><View style={{paddingLeft:20,}}><Text>{profile.completeInfo?"Great, Your profile is complete!":"Complete your profile and get free bonus!"}</Text></View>
                   </View>  
                </View>
                <View style={styles.inputContainer}>
                <Item floatingLabel >
                    <Label children="Mobile Number" />
                    <Input value={phoneNumber} editable={false} />
                </Item>
                </View >
                <View style={styles.inputContainer}>
                <Item floatingLabel error={(username !=='' && !validateUsername(username))}>
                    <Label children="Nickname" />
                    <Input value={username} editable={!profile.completeInfo?true:false} onChangeText={(text)=>this.onInputChange(text,"username")} />
                </Item>
                {(username !=='' && !validateUsername(username))&&<View><Text style={styles.errorText}>Nickname must be minimum of 6 characters</Text></View>}
                </View>
                <View style={styles.inputContainer}>
                <Item floatingLabel error={((firstname !=='' && !validateFullname(firstname)) || firstnameEmpty)}>
                    <Label children="First Name" />
                    <Input value={firstname} editable={!profile.completeInfo?true:false} onChangeText={(text)=>this.onInputChange(text,"firstname")} />
                </Item>
                {((firstname !=='' && !validateFullname(firstname)) || firstnameEmpty)&&<View><Text style={styles.errorText}>{(firstname !=='' && !validateFullname(firstname)) ? 'First name must be minimum of 2 characters': 'First name cannot be empty'}</Text></View>}
                </View>
                <View style={styles.inputContainer}>
                <Item floatingLabel error={((lastname !=='' && !validateFullname(lastname)) || lastnameEmpty)}>
                    <Label children="Last Name" />
                    <Input value={firstname} editable={!profile.completeInfo?true:false} onChangeText={(text)=>this.onInputChange(text,"lastname")} />
                </Item>
                {((lastname !=='' && !validateFullname(lastname)) || lastnameEmpty)&&<View><Text style={styles.errorText}>{(lastname !=='' && !validateFullname(lastname)) ? 'Last name must be minimum of 2 characters': 'Last name cannot be empty'}</Text></View>}
                </View>
                <View style={styles.inputContainer}>
                <Item picker>
                    <View style={{flex:1,flexDirection:'row',alignItems:"center"}}>
                    <View><Label style={{fontSize:12}}>Gender</Label></View>
                    <Picker
                    mode="dropdown"
                    style={{flex:1}}
                    iosIcon={<Icon name="arrow-down" />}
                    placeholderStyle={{ color: "#bfc6ea" }}
                    selectedValue={gender}
                    onValueChange={(text)=>this.onInputChange(text,'gender')}
                    enabled={!profile.completeInfo?true:false} 
                  >
                    <Picker.Item  label="Don't Specify" value="U" />
                    <Picker.Item  label="Male" value="M" />
                    <Picker.Item  label="Female" value="F" />
                    
                  </Picker>
                    </View>
                </Item>
               
                </View>
                <View style={styles.inputContainer}>
                <Item floatingLabel error={((email !=='' && !validateEmail(email)) || emailEmpty)}>
                    <Label children="Email" />
                    <Input value={email} keyboardType="email-address" editable={!profile.completeInfo?true:false} onChangeText={(text)=>this.onInputChange(text,"email")} />
                </Item>
                {((email !=='' && !validateEmail(email)) || emailEmpty)&&<View><Text style={styles.errorText}>{(email !=='' && !validateEmail(email)) ? 'Invalid email format': 'Email cannot be empty'}</Text></View>}
                </View>
                <View style={styles.inputContainer}>
                <Item picker>
                   
                    <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                    <View><Label style={{fontSize:12}}>ID Type</Label></View>
                    <Picker
                    mode="dropdown"
                    style={{flex:1}}
                    iosIcon={<Icon name="arrow-down" />}
                    placeholder="ID Type"
                    placeholderStyle={{ color: "#bfc6ea" }}
                    placeholderIconColor="#007aff"
                    selectedValue={document_type}
                    onValueChange={(text)=>this.onInputChange(text,'document_type')}
                    enabled={!profile.completeInfo?true:false}  
                  >
                    <Picker.Item  label="Identity Card/ID Book" value={1} />
                    <Picker.Item  label="Passport" value={2} />
                    <Picker.Item  label="Driver License" value={3} />
                    <Picker.Item  label="Firearms License" value={4} />
                    <Picker.Item  label="Other" value={5} />
                    
                  </Picker>
                    </View>
                   
                </Item>
               
                </View>
                <View style={styles.inputContainer}>
                <Item floatingLabel error={(document_type !=='' && idnumber==='')}>
                    <Label children="ID Number" />
                    <Input value={idnumber} editable={!profile.completeInfo?true:false} onChangeText={(text)=>this.onInputChange(text,"idnumber")} />
                </Item>
                {(document_type !=='' && idnumber==='')&&<View><Text style={styles.errorText}>Must provide ID Card Number</Text></View>}
                </View>
                <View style={{margin:5,paddingLeft:5,paddingRight:5}}>
                   <View style={{marginLeft:5}}><Text style={{fontSize:15,color:"#A9A9A9"}}>Date of Birth </Text></View>
                  <TouchableWithoutFeedback onPress={this.showDatePickerBD}>
                    <View style={{height:40,borderBottomColor:'#eee',borderBottomWidth:1,flexDirection:'row',alignItems:'center',paddingLeft:5,padding :5}}>
                      <View style={{marginLeft:5}}><Text style={{fontSize:15}}>{moment(birth_date).format('DD/MM/YYYY')}</Text></View>
                      <CustomIcon name="calendar" size={25} color="#11c9e3" style={{margin:5}}/>
                    </View>
                  </TouchableWithoutFeedback>
                  {showDatePicker&&profile.completeInfo===0&&<DateTimePicker
                      maximumDate={moment().subtract(18, 'years').toDate()}
                      timeZoneOffsetInMinutes={0}
                      value={birth_date}
                      mode={'date'}
                      display="default"
                      onChange={this.onDateChangeBD}
                    />}
                   
                  </View>
                  <View style={styles.inputContainer}>
                    <Item floatingLabel error={(address !=='' && address.length<4)}>
                        <Label children="Address" />
                        <Input value={address} editable={!profile.completeInfo?true:false} onChangeText={(text)=>this.onInputChange(text,"address")} />
                    </Item>
                    {(address !=='' && address.length<4)&&<View><Text style={styles.errorText}>Provide a valid address</Text></View>}
                </View>
                <View style={{margin:10}}>
                       <TouchableNativeFeedback disabled={updatingInfo} onPress={this.updateInfo.bind(this)}>
                           <View style={{height:40,width:'100%',justifyContent:'center',alignItems:'center',borderRadius:5,flexDirection:'row',backgroundColor:updatingInfo?'rgba(209,209,219,.9)':'#018da0'}}>
                               {updatingInfo?<ActivityIndicator animating={true}/>:<Text style={viewStyles.textWhite}>Update Profile</Text>}
                           </View>
                       </TouchableNativeFeedback>
                </View>
               </View>
            </Tab>
            <Tab heading={ <TabHeading style={{backgroundColor:'#eee'}}><Text>Change Password</Text></TabHeading>}>
                <View style={{margin:10,borderRadius:5,borderColor:'#eee',borderWidth:1}}>
                <View style={{padding:10}}>
                  <View style={styles.header}>
                    <CustomIcon name="lock" size={20} color="#b6862e"/><View style={{paddingLeft:20}}><Text style={{fontSize:18,fontWeight:"700"}}>Reset Password</Text></View>
                   </View>  
                </View>
                <View style={styles.inputContainer}>
                <Item floatingLabel error={old_passwordEmpty}>
                    <Label children="Old Password" />
                    <Input value={old_password} secureTextEntry={true} onChangeText={(text)=>this.onInputChange(text,'old_password')}/>
                </Item>
                {old_passwordEmpty&&<View><Text style={styles.errorText}>Old password is required</Text></View>}
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
                    <TouchableNativeFeedback disabled={(changingpass ||(c_password==="" || password==="" || old_password==="")||!validatePassword(password))} onPress={this.changePass.bind(this)}>
                        <View style={{height:40,width:'100%',justifyContent:'center',alignItems:'center',borderRadius:5,flexDirection:'row',backgroundColor:(changingpass ||(c_password==="" || password==="" || old_password==="")||!validatePassword(password))?'rgba(209,209,219,.9)':'#018da0'}}>
                            {changingpass?<ActivityIndicator animating={true}/>:<Text style={viewStyles.textWhite}>Reset Now</Text>}
                        </View>
                    </TouchableNativeFeedback>
                </View>
                </View>
            </Tab>
            </Tabs>
            </Content>
        </Container>
            
        )
    }
}
const styles=StyleSheet.create({
    inputContainer:{
        margin:10
    },
    errorText:{
        color:'crimson',
        fontSize:12
    },
    header:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        marginBottom:10
    }
})