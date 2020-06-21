import React, {PureComponent} from 'react'
import {View,TouchableNativeFeedback,Text,ScrollView,StyleSheet,Linking, Platform} from 'react-native'
import {Container, Content,Item,Label, List,ListItem, Right, Left, Body} from 'native-base'
import CustomIcon from '../customIcon';
import { viewStyles } from '../../common';
import { makeText } from '../../utils';
export default class AccountScreen extends PureComponent {
    constructor(props){
        super(props)

    }
    callNumber = phone => {
        let phoneNumber = phone;
        if (Platform.OS !== 'android') {
        phoneNumber = `telprompt:${phone}`;
        }
        else  {
        phoneNumber = `tel:${phone}`;
        }
        Linking.canOpenURL(phoneNumber)
        .then(supported => {
        if (!supported) {
            makeText('Phone number is not available');
          } else {
            return Linking.openURL(phoneNumber);
        }
        })
        .catch(err => makeText(err));
        }
    logout(){
        const {dispatchLogOut,navigation}=this.props
        navigation.popToTop()
        dispatchLogOut()
    }
    goToScreen(name,data=null){
        const {navigation}=this.props
        data!==null?navigation.navigate(name,data):navigation.navigate(name)
    }
    render(){
        const {profile,dispatchLogOut}= this.props
        return(
            <Container>
                <Content style={{backgroundColor:'#e8e8ec'}}>
                    <View style={styles.profileHeader}>
                        <View style={styles.userInfo}>
                            <View style={styles.userInfoAvatar}><CustomIcon name="profile" size={30} color="#fff"/></View>
                            <View style={{justifyContent:'center'}}>
                                <View style={styles.flexRowLeft}><Text style={viewStyles.textWhite}>{profile.nickname}</Text></View>
                                <View style={styles.flexRowLeft}><Text style={viewStyles.textWhite}>{profile.mobilenumber}</Text></View>
                                <View style={styles.flexRowLeft}><Text style={viewStyles.textWhite}>{profile.email}</Text></View>
                            </View>
                            <View style={{justifyContent:'center'}}>
                                <View style={styles.flexRowCenter}><Text style={viewStyles.textWhite}>Accumulated Balance</Text></View>
                                <View style={styles.flexRowCenter}><Text style={viewStyles.textWhite}>{profile.currency} {(parseFloat(profile.balance) +parseFloat(profile.bonus)).toFixed(3)} </Text></View>
                            </View>
                        </View>
                        <View style={styles.userBalanceContainer}>
                            <View style={{flex:1,flexDirection:'row',alignItems:'center', justifyContent:'space-around'}}>
                                <TouchableNativeFeedback useForeground={TouchableNativeFeedback.canUseNativeForeground()} onPress={()=>this.goToScreen('wallet')}>
                                <View style={{flex:1,backgroundColor:'#026775',margin:10,borderRadius:4,flexDirection:'row',alignItems:'center',justifyContent:'center',padding:10}}><Text style={viewStyles.textWhite}>Deposit</Text></View>
                                </TouchableNativeFeedback>
                                <TouchableNativeFeedback useForeground={TouchableNativeFeedback.canUseNativeForeground()} onPress={()=>this.goToScreen('wallet',{tabView:1})}>
                                <View style={{flex:1,backgroundColor:'#026775',margin:10,borderRadius:4,flexDirection:'row',alignItems:'center',justifyContent:'center',padding:10}}><Text style={viewStyles.textWhite}>Withdraw</Text></View>
                                </TouchableNativeFeedback>
                            </View>
                            <View style={styles.flexRowCenter}>
                            <TouchableNativeFeedback useForeground={TouchableNativeFeedback.canUseNativeForeground()} onPress={()=>this.goToScreen('transactions')}>
                            <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                                <View style={{flex:3}}>
                                    <View style={styles.flexRowCenter}><Text style={viewStyles.textWhite}>Main Balance</Text></View>
                                    <View style={styles.flexRowCenter}><Text style={viewStyles.textWhite}>{profile.currency} {profile.balance}</Text></View>
                                </View>
                                <CustomIcon name="arrow-right" size={15} color="#fff"/>
                            </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground={TouchableNativeFeedback.canUseNativeForeground()} onPress={()=>this.goToScreen('bonus',{tabView:1})}>
                            <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                                <View style={{flex:3}}>
                                <View style={styles.flexRowCenter}><Text style={viewStyles.textWhite}>Bonus Balance</Text></View>
                                <View style={styles.flexRowCenter}><Text style={viewStyles.textWhite}>{profile.bonus}</Text></View>
                                </View>
                                <CustomIcon name="arrow-right" size={15} color="#fff"/>
                            </View>
                            </TouchableNativeFeedback>
                            </View>
                        </View>
                    </View>
                   <View style={{flex:1,backgroundColor:'#fff'}}>
                   <ListItem icon button onPress={()=>this.goToScreen('profileEdit')}>
                        <Left><CustomIcon name="profile" size={20} color="#026775"/></Left>
                        <Body><Text>Edit Profile</Text></Body>
                        <Right><CustomIcon name="arrow-right" size={15} color="#026775"/></Right>
                    </ListItem>
                   <ListItem icon button onPress={()=>this.goToScreen('transactions')}>
                        <Left><CustomIcon name="sb-betlsip" size={20} color="#026775"/></Left>
                        <Body><Text>Transactions</Text></Body>
                        <Right><CustomIcon name="arrow-right" size={15} color="#026775"/></Right>
                    </ListItem>
                    <ListItem icon button onPress={()=>this.goToScreen('bonus')}>
                        <Left><CustomIcon name="bonus-info" size={20} color="#026775"/></Left>
                        <Body><Text>Bonuses</Text></Body>
                        <Right><CustomIcon name="arrow-right" size={15} color="#026775"/></Right>
                    </ListItem>
                    <ListItem icon button onPress={()=>this.goToScreen('bethistory')}>
                        <Left><CustomIcon name="bets-list" size={20} color="#026775"/></Left>
                        <Body><Text>Bet History</Text></Body>
                        <Right><CustomIcon name="arrow-right" size={15} color="#026775"/></Right>
                    </ListItem>
                    <ListItem icon button onPress={()=>this.goToScreen('settings')}>
                        <Left><CustomIcon name="settings" size={20} color="#026775"/></Left>
                        <Body><Text>Settings</Text></Body>
                        <Right><CustomIcon name="arrow-right" size={15} color="#026775"/></Right>
                    </ListItem>
                   </View>
                   <View style={{flex:1,marginTop:20,backgroundColor:'#fff'}}>
                   <ListItem icon button onPress={()=>this.goToScreen('htmlview',{page:58})}>
                        <Left><CustomIcon name="promotion" size={20} color="#026775"/></Left>
                        <Body><Text>Promotion</Text></Body>
                        <Right><CustomIcon name="arrow-right" size={15} color="#026775"/></Right>
                    </ListItem>
                   <ListItem icon button onPress={()=>this.goToScreen('htmlview',{page:51})}>
                        <Left><CustomIcon name="help" size={20} color="#026775"/></Left>
                        <Body><Text>Help</Text></Body>
                        <Right><CustomIcon name="arrow-right" size={15} color="#026775"/></Right>
                    </ListItem>
                   </View>
                   <View style={{flex:1,marginTop:20,backgroundColor:'#fff'}}>
                    <View style={[styles.flexRowLeft,{flex:1,borderBottomColor:'#e8e8ec',borderBottomWidth:1}]}>
                        <View style={{flex:3,borderRightColor:'#e8e8ec',borderRightWidth:1,padding:10}}>
                            <View style={{paddingBottom:5}}><Text style={{fontSize:13}}>Customer Service</Text></View>
                            <View><Text style={{fontSize:11,color:'#026775'}}>Our customer service teams will gladly assist with all your request anytime, anywhere, anyhow!</Text></View>
                        </View>
                        <TouchableNativeFeedback useForeground={TouchableNativeFeedback.canUseNativeForeground()} onPress={()=>this.callNumber(`+233302200012`)}>
                            <View style={{justifyContent:'center',padding:10}}>
                                <View style={styles.flexRowCenter}>
                                <CustomIcon name="contact-sales" size={25} color="#026775"/>
                                </View>
                                <View style={styles.flexRowCenter}>
                                <Text style={{fontSize:12}}>Call Us</Text>
                                </View>
                                <View style={styles.flexRowCenter}>
                                <Text style={{fontSize:12,color:'#026775'}}>+233 (0) 302200012</Text>
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                   </View>
                   <TouchableNativeFeedback useForeground={TouchableNativeFeedback.canUseNativeForeground()} onPress={()=>this.logout()}>
                            <View style={{flex:1,marginTop:20,backgroundColor:'#fff',flexDirection:'row',alignItems:'center',justifyContent:'center',padding:10}}>
                                <CustomIcon name="logout" size={20} color="#026775"/>
                                <View style={{padding:5}}><Text style={{color:'crimson'}}>Log Out</Text></View>
                            </View>
                        </TouchableNativeFeedback>
                </Content>
            </Container>
        )
    }
}
const styles= StyleSheet.create({
    profileHeader:{
       width:'100%',
       backgroundColor:'#026775'
    },
    userInfo:{
        width:'100%',
        padding:10,
        flexDirection:'row',
        alignItems:'center',
        justifyContent: 'space-between'
    },
    userInfoAvatar:{width:40,height:40,borderRadius:40,backgroundColor:'#065863',position: 'relative',flexDirection:'row',alignItems:'center',justifyContent:'center'},
    userBalanceContainer:{
        backgroundColor:'#065863',
        alignItems:'center',
        justifyContent:'space-between',
        padding:10
    },
    flexRowLeft:{flexDirection:'row',alignItems:'center',justifyContent:'flex-start'},
    flexRowCenter:{flexDirection:'row',alignItems:'center',justifyContent:'center'}
})
