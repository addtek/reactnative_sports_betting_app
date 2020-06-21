import React from 'react';
import {Text,View,Image, LayoutAnimation, Platform, TouchableNativeFeedback,Dimensions} from 'react-native'
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from 'react-navigation-drawer';
import Icon from 'react-native-vector-icons/Ionicons'
import HomeScreen from '../containers/home';
import GameView from '../containers/gameview'
import DrawerMenu from '../containers/drawer';
import LiveInPlay from '../containers/inplay';
import Prematch from '../containers/prematch';
import Competitions from '../containers/competitions';
import RegisterFrom from '../containers/register';
import LoginForm from '../containers/login';
import SearchBar  from '../containers/searchbar';
import Roulette from '../containers/roulette'
import SlotGames from '../containers/casino'
import VirtualSports from '../containers/virtual'
import BetHistory from '../containers/bethistory';
import Profile from '../containers/account';
import EditProfile from '../containers/userprofile';
import Bonuses from '../containers/bonus';
import Transaction from '../containers/transactions';
import Settings from '../containers/settings';
import Wallet from '../containers/wallet';
import ChangeGameBtn from '../containers/changeGameBtn'
import HTMLView from '../screens/htmlView'
import ForgotPassword from '../components/forgotpassword';
const{width}= Dimensions.get('window'), TabsStack = Platform.OS === 'android'?createMaterialTopTabNavigator({
  Home: {getScreen:()=>HomeScreen,navigationOptions :{
    title: 'Home',
    tabBarLabel:'Home',
    tabBarIcon: <Icon
      name="ios-home"
      size={20}
      color="#eee" />
  }
  }, Live: {getScreen:()=>LiveInPlay,navigationOptions :{
    title: 'Live',
    tabBarLabel:'Live',
    tabBarIcon: <Icon
      name="ios-live"
      size={20}
      color="#eee" />
  }
  },
  Prematch:{getScreen:()=>Prematch,navigationOptions :{
    title: 'Prematch',
    tabBarLabel:'Prematch',
    tabBarIcon: <Icon
      name="ios-live"
      size={20}
      color="#eee" />
  }},
  Roulette:{getScreen:()=>Roulette,navigationOptions :{
    title: 'Roulette',
    tabBarLabel:'Roulette',
    tabBarIcon: <Icon
      name="ios-live"
      size={20}
      color="#eee" />
  }},
  SlotGames:{getScreen:()=>SlotGames,navigationOptions :{
    title: 'Slot Games',
    tabBarLabel:'Slot Games',
    tabBarIcon: <Icon
      name="ios-live"
      size={20}
      color="#eee" />
  }},
  VirtualSport:{getScreen:()=>VirtualSports,navigationOptions :{
    title: 'Virtual Sports',
    tabBarLabel:'Virtual Sports',
    tabBarIcon: <Icon
      name="ios-live"
      size={20}
      color="#eee" />
  }},
}, { 
  initialRouteName:'Home', 
  lazy:true, 
  // tabBarPosition: 'bottom',
  swipeEnabled:false,
  // animationEnabled: false,
  tabBarOptions: {
      indicatorStyle:{height:1,backgroundColor:"#ff7b00"},
      // showIcon: true,
      showLabel:true,
      activeTintColor: '#ff7b00',
      inactiveTintColor: '#eee',
      style: {
          backgroundColor: '#018da0',
      },
      labelStyle: {
          fontWeight: 'bold',
          fontSize: 10.5,
          // margin: 10
      },
      pressOpacity:0.5,
      scrollEnabled:true,
      tabStyle:{width:width/3.5}
      
  }
}):
createBottomTabNavigator({
  Home: {getScreen:()=>HomeScreen,navigationOptions :{
    title: 'Home',
    tabBarLabel:'Home',
    tabBarIcon: <Icon
      name="ios-home"
      size={20}
      color="#eee" />
  }
  }, Live: {getScreen:()=>LiveInPlay,navigationOptions :{
    title: 'Live',
    tabBarLabel:'Live',
    tabBarIcon: <Icon
      name="ios-live"
      size={20}
      color="#eee" />
  }
  },
  Prematch:{getScreen:()=>Prematch,navigationOptions :{
    title: 'Prematch',
    tabBarLabel:'Prematch',
    tabBarIcon: <Icon
      name="ios-live"
      size={20}
      color="#eee" />
  }},
  Roulette:{getScreen:()=>Roulette,navigationOptions :{
    title: 'Roulette',
    tabBarLabel:'Roulette',
    tabBarIcon: <Icon
      name="ios-live"
      size={20}
      color="#eee" />
  }},
}, { 
  initialRouteName:'Home', 
  lazy:true, 
  // tabBarPosition: 'bottom',
  swipeEnabled:false,
  animationEnabled: false,
  tabBarOptions: {
    renderIndicator: () => null,
      // showIcon: true,
      showLabel:true,
      activeTintColor: '#ff7b00',
      inactiveTintColor: '#eee',
      style: {
          backgroundColor: '#018da0',
      },
      labelStyle: {
          fontWeight: 'bold',
          fontSize: 12,
          // margin: 10
      },
      pressOpacity:0.5,
      scrollEnabled:true,
      // tabStyle:{width:130}
      
  }
}),drawerStack=createStackNavigator({
  i:{screen:TabsStack,navigationOptions: ({ navigation }) => ({
    header:({scene,previous})=>
      <SearchBar navigation={navigation} headerRight={(e)=> <View style={{ flexDirection:'row',alignContent:'center',justifyContent:'space-between',alignSelf:'center',alignItems:'center',padding:10}}>
        {
            e.isLoggedIn && <TouchableNativeFeedback onPress={()=>navigation.navigate('wallet')}>
                <View style={{padding:10,borderRadius:4,backgroundColor:'#018da0',marginLeft:5,marginRight:5}}>
                    <Text style={{color:'#fff'}}>Deposit</Text>
                </View>
            </TouchableNativeFeedback>
        }
        <Icon name="ios-search" size={30} style={{paddingLeft:10,marginLeft:5,marginRight:5}}color="#fff" onPress={()=>{LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);e.setWantToSearch(!e.wantToSearch)}}/>
        <Icon name="ios-menu" size={35}  style={{paddingLeft:10,marginLeft:5,marginRight:5}}color="#fff" onPress={() => navigation.toggleDrawer()}/>
    </View>}
    headerLeft={()=> <View style={{flexDirection:'row',alignContent:'center',justifyContent:'space-between',paddingLeft:10,paddingRight:10,alignSelf:'center',width:130}}><Text numberOfLines={1} ellipsizeMode='tail' style={{flex:1,color:'#fff',paddingLeft:10,textTransform:'uppercase',fontSize:14}}>Your  Brand</Text></View>}/>,
    headerMode :'float',
    headerStyle:{
        backgroundColor: '#026775',
        elevation:0,
        position:'relative'
    },
    headerTitle:'',
    headerTitleStyle: {
        color: '#ffffff',
        fontSize:25
    }
})},
 c:{
   screen:Competitions,navigationOptions: ({ navigation }) => ({
    headerStyle: {
      backgroundColor:"#026775"
    },
    headerTintColor:'#fff',
    headerTitle: ()=><View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
      <Text numberOfLines={1} ellipsizeMode='tail' style={{flex:1,color:'#fff',paddingLeft:2,fontSize:14}}>Competition View</Text>
    </View>
  })
 },
 game_view:{
   screen:GameView,navigationOptions: ({ navigation }) => ({
    headerStyle: {
      backgroundColor:"#026775"
    },
    headerTintColor:'#fff',
    headerTitle: ()=><View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
      <Text numberOfLines={1} ellipsizeMode='tail' style={{flex:1,color:'#fff',paddingLeft:10,textTransform:'uppercase',fontSize:14}}>Game Events</Text>
    </View>,
    headerRight:()=><ChangeGameBtn/>
  })
 }
 ,
   register:{
    screen:RegisterFrom,navigationOptions: ({ navigation }) => ({
    headerStyle: {
      backgroundColor:"#026775"
    },
    headerTintColor:'#fff',
    headerTitle: ()=><View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
      <Text numberOfLines={1} ellipsizeMode='tail' style={{flex:1,color:'#fff',paddingLeft:10,textTransform:'uppercase',fontSize:14}}>Create Account</Text>
    </View>
  })},
  login:{
    screen:LoginForm,navigationOptions: ({ navigation }) => ({
    headerStyle: {
      backgroundColor:"#026775"
    },
    headerTintColor:'#fff',
    headerTitle: ()=><View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
      <Text numberOfLines={1} ellipsizeMode='tail' style={{flex:1,color:'#fff',paddingLeft:10,textTransform:'uppercase',fontSize:14}}>Sign In</Text>
    </View>
  })},
  forgotpassword:{
    screen:ForgotPassword,navigationOptions: ({ navigation }) => ({
    headerStyle: {
      backgroundColor:"#026775"
    },
    headerTintColor:'#fff',
    headerTitle: ()=><View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
      <Text numberOfLines={1} ellipsizeMode='tail' style={{flex:1,color:'#fff',paddingLeft:10,textTransform:'uppercase',fontSize:14}}>Forgot Password</Text>
    </View>
  })},
  bethistory:{
    screen:BetHistory,navigationOptions: ({ navigation }) => ({
    headerStyle: {
      backgroundColor:"#026775"
    },
    headerTintColor:'#fff',
    headerTitle: ()=><View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
      <Text numberOfLines={1} ellipsizeMode='tail' style={{flex:1,color:'#fff',paddingLeft:10,textTransform:'uppercase',fontSize:14}}>Bet History</Text>
    </View>
  })},
  bonus:{
    screen:Bonuses,navigationOptions: ({ navigation }) => ({
    headerStyle: {
      backgroundColor:"#026775"
    },
    headerTintColor:'#fff',
    headerTitle: ()=><View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
      <Text numberOfLines={1} ellipsizeMode='tail' style={{flex:1,color:'#fff',paddingLeft:10,textTransform:'uppercase',fontSize:14}}>Bonuses</Text>
    </View>
  })},
  profile:{
    screen:Profile,navigationOptions: ({ navigation }) => ({
    headerStyle: {
      backgroundColor:"#026775"
    },
    headerTintColor:'#fff',
    headerTitle: ()=><View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
      <Text numberOfLines={1} ellipsizeMode='tail' style={{flex:1,color:'#fff',paddingLeft:10,textTransform:'uppercase',fontSize:14}}>Account</Text>
    </View>
  })},
  transactions:{
    screen:Transaction,navigationOptions: ({ navigation }) => ({
    headerStyle: {
      backgroundColor:"#026775"
    },
    headerTintColor:'#fff',
    headerTitle: ()=><View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
      <Text numberOfLines={1} ellipsizeMode='tail' style={{flex:1,color:'#fff',paddingLeft:10,textTransform:'uppercase',fontSize:14}}>Transactions</Text>
    </View>
  })},
  wallet:{
    screen:Wallet,navigationOptions: ({ navigation }) => ({
    headerStyle: {
      backgroundColor:"#026775"
    },
    headerTintColor:'#fff',
    headerTitle: ()=><View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
      <Text numberOfLines={1} ellipsizeMode='tail' style={{flex:1,color:'#fff',paddingLeft:10,textTransform:'uppercase',fontSize:14}}>Wallet</Text>
    </View>
  })},
  settings:{
    screen:Settings,navigationOptions: ({ navigation }) => ({
    headerStyle: {
      backgroundColor:"#026775"
    },
    headerTintColor:'#fff',
    headerTitle: ()=><View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
      <Text numberOfLines={1} ellipsizeMode='tail' style={{flex:1,color:'#fff',paddingLeft:10,textTransform:'uppercase',fontSize:14}}>Settings</Text>
    </View>
  })},
  profileEdit:{
    screen:EditProfile,navigationOptions: ({ navigation }) => ({
    headerStyle: {
      backgroundColor:"#026775"
    },
    headerTintColor:'#fff',
    headerTitle: ()=><View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
      <Text numberOfLines={1} ellipsizeMode='tail' style={{flex:1,color:'#fff',paddingLeft:10,textTransform:'uppercase',fontSize:14}}>Edit Profile</Text>
    </View>
  })},
  htmlview:{
    screen:HTMLView,navigationOptions: ({ navigation }) => ({
    headerStyle: {
      backgroundColor:"#026775"
    },
    headerTintColor:'#fff',
    headerTitle: ()=><View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
      <Text numberOfLines={1} ellipsizeMode='tail' style={{flex:1,color:'#fff',paddingLeft:10,textTransform:'uppercase',fontSize:14}}>Infomation View</Text>
    </View>
  })},
},{ 
  
  initialRouteName:'i'}),
  Main = createDrawerNavigator({
    Main: {screen:drawerStack}
    },{contentComponent: DrawerMenu,initialRouteName:'Main',drawerPosition:'right'}),
 AppNavigation = createStackNavigator({
   main:{screen:Main}
 },{
  initialRouteName:'main',
  headerMode:'none'
})

const appNav = createAppContainer(AppNavigation)
export default appNav;