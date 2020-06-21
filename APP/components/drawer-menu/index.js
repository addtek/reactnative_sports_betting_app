import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {NavigationActions} from 'react-navigation';
import {StyleSheet, ScrollView, Text, View, Dimensions,Share, TouchableOpacity, TouchableNativeFeedback} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomIcon from '../customIcon';
import LinearGradient from 'react-native-linear-gradient';
import { allActionDucer } from '../../actionCreator';
import { BETSLIP } from '../../actionReducers';

const { width } = Dimensions.get('window')
class SideMenu extends PureComponent {
    constructor(props) {
        super(props)
    }
  navigateToScreen = (route,params=null) => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route,params
    });
    this.props.navigation.dispatch(navigateAction);
  }
    _share(phone) {
        $msg = { dialogTitle: "Invite via", message: `https://play.google.com/store/apps/details?id=com.yourapppackagename \n\n  I` } ;
        Share.share({
            title: $msg.title,
            message: $msg.message
        }, { dialogTitle: $msg.dialogTitle }).catch(err => null)
    }

  render () {
      const {isLoggedIn,profile,dispatchLogOut}= this.props
    return (
      <View style={{flex:1, justifyContent: 'space-between' }}>
        <ScrollView contentContainerStyle={{ justifyContent: 'space-between' }}>
          <LinearGradient start={{ x: 0.1, y: 0.25 }} end={{ x: 0.5, y: 1.0 }} locations={[0, 0.6, 0.8]} colors={['#018da0', '#017585', '#017585']} style={styles.linearGradient}>
            {isLoggedIn?<View style={styles.profileContainer}>
                <View style={styles.profile}>
                    <TouchableNativeFeedback useForeground={TouchableNativeFeedback.canUseNativeForeground()} onPress={this.navigateToScreen('profile')}>
                            <View style={styles.imageshow} >
                             <Text style={{alignSelf:'center',fontSize:60,color:'#222'}} children={ profile.full_name != null ? `${profile.full_name.charAt(0)}` : null}/>
                            </View>
                    </TouchableNativeFeedback>
                    <View>
                    <View>
                    <TouchableNativeFeedback useForeground={TouchableNativeFeedback.canUseNativeForeground()} onPress={this.navigateToScreen('transactions')}>
                      
                      <View style={{flex:1,backgroundColor:'#026775',borderRadius:5}}>
                        <View style={{alignItems:'center',padding:10,justifyContent:'center'}}>
                          <Text style={{color:'#fff'}}>Balance</Text>
                          <Text style={{color:'#fff'}}><Text style={{color:'#ff7b00',marginRight:10}}>{(parseFloat(profile.balance)+parseFloat(profile.bonus)).toFixed(3)}  </Text>{profile.currency}</Text>
                          </View>
                        </View>
                      
                    </TouchableNativeFeedback>
                    </View>
                    </View>
                </View>
                <View style={styles.cardDetails} >
                    <Text numberOfLines={1} style={styles.textMedium} children={profile.nickname} />
                    <Text style={styles.textMedium} numberOfLines={1} note children={profile.mobilenumber} />
                    <Text style={styles.textMedium} numberOfLines={1} note children={profile.email} />
                </View>
            </View>:
            <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
            <View>
            <TouchableNativeFeedback useForeground={TouchableNativeFeedback.canUseNativeForeground()} onPress={this.navigateToScreen('login')}>
              <View style={styles.navSectionStyle}>
              <Icon style={[styles.navItemStyle,{alignSelf:'center'}]} size={20} name='ios-log-in'  color="#194b51"/>
              <Text style={{ padding: 5, marginLeft: 10, alignSelf: 'center', fontSize: 15,color:'#fff' }}> Log in </Text>
              </View>
            </TouchableNativeFeedback>
            </View>
            <View >
            <TouchableNativeFeedback useForeground={TouchableNativeFeedback.canUseNativeForeground()} onPress={this.navigateToScreen('register')}>
              <View style={styles.navSectionStyle}>
              <Icon style={[styles.navItemStyle,{alignSelf:'center'}]} size={20} name='ios-create'  color="#194b51"/>
              <Text style={{ padding: 5, marginLeft: 10, alignSelf: 'center', fontSize: 15,color:'#fff' }}> Register </Text>
              </View>
            </TouchableNativeFeedback>
            </View>
            </View>}
          </LinearGradient>
          
          <View style={{marginTop:20}}>
            
            <View>
            <TouchableNativeFeedback useForeground={TouchableNativeFeedback.canUseNativeForeground()} onPress={()=>this._share(profile.phone)}>
              <View style={styles.navSectionStyle}>
              <Icon style={[styles.navItemStyle,{alignSelf:'center'}]} size={20} name='ios-share'  color="#194b51"/>
              <Text style={{ padding: 5, marginLeft: 10,alignSelf:'center',fontSize:15,color:'#194b51' }}> Share </Text>
              </View>
            </TouchableNativeFeedback>
            </View>
            <View >
            <TouchableNativeFeedback useForeground={TouchableNativeFeedback.canUseNativeForeground()} onPress={this.navigateToScreen('favorites')}>
              <View style={styles.navSectionStyle}>
              <Icon style={[styles.navItemStyle,{alignSelf:'center'}]} size={20} name='ios-star'  color="#194b51"/>
              <Text style={{ padding: 5, marginLeft: 10, alignSelf: 'center', fontSize: 15,color:'#194b51' }}> Favorites</Text>
              </View>
            </TouchableNativeFeedback>
            </View>
            <View>
            <TouchableNativeFeedback useForeground={TouchableNativeFeedback.canUseNativeForeground()} onPress={this.props.showBetSlip}>
              <View style={styles.navSectionStyle}>
              <CustomIcon style={[styles.navItemStyle,{alignSelf:'center'}]} size={20} name='sb-betlsip'  color="#194b51"/>
              <Text style={{ padding: 5, marginLeft: 10, alignSelf: 'center', fontSize: 15,color:'#194b51' }}> Bet Slip</Text>
              </View>
            </TouchableNativeFeedback>
            </View>
            {isLoggedIn &&<>
            <View >
            <TouchableNativeFeedback useForeground={TouchableNativeFeedback.canUseNativeForeground()} onPress={this.navigateToScreen('bethistory')}>
              <View style={styles.navSectionStyle}>
              <CustomIcon style={[styles.navItemStyle,{alignSelf:'center'}]} size={20} name='bets-list'  color="#194b51"/>
              <Text style={{ padding: 5, marginLeft: 10, alignSelf: 'center', fontSize: 15,color:'#194b51' }}> Bets History </Text>
              </View>
            </TouchableNativeFeedback>
            </View>
            <View >
            <TouchableNativeFeedback useForeground={TouchableNativeFeedback.canUseNativeForeground()}   onPress={this.navigateToScreen('profile')}>
             <View style={styles.navSectionStyle}>
             <CustomIcon style={[styles.navItemStyle,{alignSelf:'center'}]} size={20} name='profile'  color="#194b51"/>
              <Text style={{ padding: 5, marginLeft: 10, alignSelf: 'center', fontSize: 15,color:'#194b51' }}> Account </Text>
             </View>
            </TouchableNativeFeedback>
            </View>
            {/* <View >
            <TouchableOpacity  style={styles.navSectionStyle} onPress={this.navigateToScreen('profile')}>
              <CustomIcon style={[styles.navItemStyle,{alignSelf:'center'}]} size={20} name='wallet'  color="#194b51"/>
              <Text style={{ padding: 5, marginLeft: 10, alignSelf: 'center', fontSize: 15,color:'#194b51' }}> Wallet </Text>
            </TouchableOpacity>
            </View> */}
            <View >
            <TouchableNativeFeedback useForeground={TouchableNativeFeedback.canUseNativeForeground()} onPress={this.navigateToScreen('bonus')}>
              <View style={styles.navSectionStyle}>
              <CustomIcon style={[styles.navItemStyle,{alignSelf:'center'}]} size={20} name='promotion'  color="#194b51"/>
              <Text style={{ padding: 5, marginLeft: 10, alignSelf: 'center', fontSize: 15,color:'#194b51' }}> Bonuses </Text>
              </View>
            </TouchableNativeFeedback>
            </View>
            </>
            
            }
             <View>
            <TouchableNativeFeedback useForeground={TouchableNativeFeedback.canUseNativeForeground()} onPress={this.navigateToScreen('htmlview',{page:49})}>
               <View style={styles.navSectionStyle}>
               <Icon style={[styles.navItemStyle,{alignSelf:'center'}]} size={20} name='ios-code-working' color="#194b51"/>
              <Text style={{ padding: 5, marginLeft: 10,alignSelf:'center',fontSize:15,color:'#194b51' }}> Terms of Service </Text>
               </View>
             </TouchableNativeFeedback>
            </View>
            <View>
            <TouchableNativeFeedback useForeground={TouchableNativeFeedback.canUseNativeForeground()} onPress={this.navigateToScreen('settings')}>
              <View style={styles.navSectionStyle}>
              <Icon style={[styles.navItemStyle,{alignSelf:'center'}]} size={20} name='ios-settings'  color="#194b51"/>
              <Text style={{ padding: 5, marginLeft: 10, alignSelf: 'center', fontSize: 15,color:'#194b51' }}> Settings </Text>
              </View>
            </TouchableNativeFeedback>
            </View>
             <View>
            <TouchableNativeFeedback useForeground={TouchableNativeFeedback.canUseNativeForeground()} onPress={this.navigateToScreen('htmlview',{page:50})}>
              <View style={styles.navSectionStyle}>
              <Icon style={[styles.navItemStyle,{alignSelf:'center'}]} size={20} name='ios-lock' color="#194b51"/>
              <Text style={{ padding: 5, marginLeft: 10,alignSelf:'center',fontSize:15,color:'#194b51' }}> Privacy Policy </Text>
              </View>
             </TouchableNativeFeedback>
            </View>
           { isLoggedIn&&<View>
            <TouchableNativeFeedback useForeground={TouchableNativeFeedback.canUseNativeForeground()} onPress={dispatchLogOut}>
               <View style={styles.navSectionStyle}>
               <Icon style={[styles.navItemStyle,{alignSelf:'center'}]} size={20} name='ios-log-out' color="#194b51"/>
              <Text style={{ padding: 5, marginLeft: 10,alignSelf:'center',fontSize:15,color:'#194b51' }}> Logout </Text>
               </View>
             </TouchableNativeFeedback>
            </View>}
          </View>
        </ScrollView>

        <View>
        <TouchableNativeFeedback useForeground={TouchableNativeFeedback.canUseNativeForeground()} onPress={this.navigateToScreen('htmlview',{page:51})}>
          <View style={styles.footerContainer}>
          <Icon style={[styles.navItemStyle,{alignSelf:'center'}]} size={20} name='ios-help-circle'  color="#194b51"/> 
          <Text style={{ padding: 5, marginLeft: 10,alignSelf:'center',fontSize:15,color:'#194b51' }}>Help & feedback</Text>
          </View>
         </TouchableNativeFeedback>
        </View>
      </View>
    );
  }
}

SideMenu.propTypes = {
  navigation: PropTypes.object
};

const styles = StyleSheet.create({

    cointext: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15
    },
    footerContainer:{
        flexDirection: 'row',
        marginLeft: 15,
        padding:10,
        borderTopWidth:1,
        borderTopColor:'#eee',
    },
    navSectionStyle:{
        flexDirection:'row',
        padding:10,
        marginLeft:10
    },
    linearGradient: {
        flex: 1,
    },
    profileContainer:{
        
    },
    profile:{
        marginRight:10,
        marginLeft: 10,
        marginTop: 10,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',

    },
    imageshow: {
        height: width / 5,
        width: width / 5,
        borderRadius: width / 10,
        margin: 5,
        alignSelf: 'center',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#fff'
    },
    scrollView: {
        flex: 0,
        flexWrap: 'wrap',
        flexDirection: 'row'
    },
    cardDetails: {
        padding: 8,
        flex: 1
    },
    textSmall: {
        color:'#fff',
        fontSize: 13,
        marginLeft: 10,
    },
    textMedium: {
        color: '#fff',
        fontSize: 15,
        fontWeight: "bold",
        marginLeft:10,
       
    },

})
export default SideMenu;