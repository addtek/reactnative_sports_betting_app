import React,{PureComponent} from 'react';
import {SPORTSBOOK_ANY, SITE_BANNER, RIDS_PUSH, HOME_DATA, APPREADY, PREMATCH_DATA} from '../../actionReducers';
import {allActionDucer} from '../../actionCreator';
import API from '../../services/api';
import {
  StyleSheet,
  ScrollView,
  Text,
  Image,
  ToastAndroid,
  View,
  Dimensions,
  TouchableOpacity,
  TouchableNativeFeedback,
  RefreshControl,
} from 'react-native';
import {ActionSheet} from 'native-base'
import Icon from 'react-native-vector-icons/Ionicons';
import HomeBanner from '../../components/homebanner';
import FeaturedGames from '../../components/featruedgame';
import HomepageEvents from '../../components/homeEvents'
import Carousel from 'react-native-snap-carousel';
import { arrayBuffer, viewStyles } from '../../common';
import { withNavigationFocus } from 'react-navigation';
import Controls from '../../containers/controls';
const $api = API.getInstance();
class Home extends PureComponent {
  static navigationOptions = {
    title: 'Home',
    tabBarIcon: <Icon name="ios-home-outline" size={25} color="#eee" />,
  };
  constructor(props) {
    super(props);
    this.state = {
      loadingInitailData: false,
      featuredbanner: [],
      games: [],
    };
    this.showCasinoGameAction= this.showCasinoGameAction.bind(this)
    this.goToSportsPage= this.goToSportsPage.bind(this)
    this.reloadData= this.reloadData.bind(this)
    this.slotgameCarouselRef = null;
    this.bannerRef = React.createRef();
    this.rids = this.props.sportsbook.rids;
    this.timeOptions = [15, 30, 60];
    this.navigatetoMarket=this.navigatetoMarket.bind(this)
    $api.getBanners(26, this.fBanners.bind(this), this.onError.bind(this));
    $api.getBanners(24, this.bannersResult.bind(this), this.onError.bind(this));
  }
  componentDidMount() {
    const {sessionData}=this.props.sportsbook
    this.props.dispatch(
      allActionDucer(APPREADY, {activeView: 'Home'}),
    );
    this.props.dispatch(
      allActionDucer(HOME_DATA, {loadSports: true}),
    );
    if (
      undefined !== sessionData.sid &&
      !this.state.loadingInitailData
    ) {
      this.setState({loadingInitailData: true});
      this.props.loadHomeData();
      this.loadHomeEvents();
    }
    $api.getSlotGames({reqType: 'post'}, this.handleCasinoGames.bind(this));
  }
  componentDidUpdate() {
     const {sessionData}=this.props.sportsbook,{activeView}=this.props.appState
    if (
      undefined !== sessionData.sid &&
      !this.state.loadingInitailData
    ) {
      this.setState({loadingInitailData: true});
      this.props.loadHomeData();
      this.loadHomeEvents();
    }
    else if (
      undefined !== sessionData.sid &&
      activeView !== 'Home' &&
      this.props.isFocused
    ) {
      this.props.dispatch(
        allActionDucer(APPREADY, {
          activeView: 'Home'
        }),
      );
      // this.props.loadHomeData();
      // this.loadHomeEvents();
      // this.setState({ loadingInitialData: true})
    }
  
  }
  componentWillUnmount() {

  }
  handleCasinoGames({data}) {
    data.data.length
      ? this.setState({games: data.data, loadingGames: false})
      : this.setState({loadingGames: false});
  }
  navigatetoMarket(data) {
    this.props.dispatch(allActionDucer(APPREADY, {activeView:data.game.type=== 0 || data.game.type=== 2?'Prematch':'Live'}));
    this.props.navigation.navigate('game_view', data);
  }
  bannersResult({data}) {
    this.props.dispatch(
      allActionDucer(SITE_BANNER, {
        siteBanner: Array.isArray(data.data) ? [...data.data] : [data.data[1]],
      }),
    );
  }
  fBanners({data}) {
    let newD = [];
    if (Array.isArray(data.data)) newD = [...data.data];
    else {
      for (const key in data.data) {
        newD.push(data.data[key]);
      }
    }
    this.setState({featuredbanner: newD});
  }
  onError(d) {
    ToastAndroid.show(d.toString(), ToastAndroid.LONG);
  }
  loadHomeEvents() {
    this.queryEvents('liveNow');
    this.queryEvents('upcoming');
    this.setState({refreshing:false})
  }
  queryEvents(type, mf = null) {
    let id = type === 'liveNow' ? 19 : type === 'upcoming' ? 20 : 21;
    this.props.dispatch(allActionDucer(HOME_DATA, id===19?{loadLiveNow:true}:{loadUpcomingEvents:true}));
    let d = {
      source: 'betting',
      what: {
        sport: ['id', 'name', 'alias', 'type', 'order'],
      },
      where: {
        game: {
          // "@limit": this.props.sportsbook.gameLimit
        },
        market: {
          display_key: 'WINNER',
          display_sub_key: 'MATCH',
        },
      },
    };
    d.where.sport = {
      type: {
        '@ne': 1,
      },
    };
    if ('lastMinutesBets' === type) {
      d.where.game.start_ts = {
        '@now': {
          '@gte': 0,
          '@lt': 60 * (mf ? mf : this.props.sportsbook.minutesFilter),
        },
      };
    } else if ('liveNow' === type) {
      d.where.game.type = 1;
      d.what.competition = ['id', 'order', 'name'];
      d.what.region = ['id', 'name', 'alias'];
      d.what.game = [
        'id',
        'type',
        'team1_name',
        'team2_name',
        'team1_id',
        'team2_id',
        'order',
        'start_ts',
        'markets_count',
        'is_blocked',
        'video_id',
        'tv_type',
        'info',
        'team1_reg_name',
        'team1_reg_name',
      ];
      d.what.event = ['id', 'price', 'type', 'name', 'order'];
      d.what.market = ['id', 'type', 'express_id', 'name'];
      d.where.event = {type: {'@in': ['P1', 'X', 'P2']}};
      d.where.market = {display_key: 'WINNER', display_sub_key: 'MATCH'};
    } else if ('upcoming' === type) {
      d.what.game = '@count';
      d.where.game.type = {
        '@or': [{type: {'@in': [0, 2]}}, {visible_in_prematch: 1}],
      };
    }
    this.rids[id].request = {
      command: 'get',
      params: {...d, subscribe: true},
      rid: id,
    };
    let newRid = {};
    newRid[id] = this.rids[id];
    this.props.dispatch(allActionDucer(RIDS_PUSH, newRid));
    this.props.sendRequest(this.rids[id].request);
  }
  setMinutesFilter(filter) {
    if (filter !== null && void 0 !== filter) {
      this.queryEvents('upcoming', this.timeOptions[filter]);
      this.props.dispatch(
        allActionDucer(SPORTSBOOK_ANY, {
          minutesFilter: this.timeOptions[filter]
        }),
      );
      this.props.dispatch(
        allActionDucer(PREMATCH_DATA, {
          loadUpcomingEvents: true
        }),
      );
    }
  }
  playGame(game) {
    this.props.navigation.navigate('SlotGames', {game: game});
  }
  goToSportsPage(params) {
    this.props.navigation.navigate('Prematch', {s:params});
  }
  showCasinoGameAction(game){
    const BUTTONS = ["PLAY FOR REAL", "PLAY FOR FUN", "Cancel"],CANCEL_INDEX = 2;
    ActionSheet.show(
        {
            options: BUTTONS,
            cancelButtonIndex: CANCEL_INDEX,
            title: game.name
        },
        buttonIndex => {
            buttonIndex === CANCEL_INDEX? ActionSheet.hide():this.playGame({...game,playtype:buttonIndex===0?'real':'fun'})
        }
        )
  }
  reloadData(){
    this.setState({refreshing: true})
    $api.getBanners(26, this.fBanners.bind(this), this.onError.bind(this));
    $api.getBanners(24, this.bannersResult.bind(this), this.onError.bind(this));
    this.props.loadHomeData();
    this.loadHomeEvents();
   }
  render() {
    const 
        {
          populargamesData}=this.props.prematchData,{
        betSelections}=this.props.betslip,{
        oddType
      } = this.props.sportsbook,{activeView,hasInternetConnection}=this.props.appState,
      {
        addEventToSelection,
        history,
        navigation
      } = this.props,
      {siteBanner,liveNowData,
        loadLiveNow,
        upcomingData,loadUpcomingEvents} = this.props.homeData,
      {featuredbanner, games,refreshing} = this.state,{isFocused}=this.props,betlen = null !== betSelections && undefined !== betSelections ? Object.keys(betSelections).length : 0;
    const pg = [],CasinoGame=({item})=>{ 
        return (
            <View style={{flex:1,position:'relative',width:'100%',display:'flex',flexDirection:'row',minHeight:150,justifyContent:'space-between',padding:3}}>
            {item.map((game,gID)=>{
            return(
                <TouchableOpacity key={gID} onPress={()=>this.showCasinoGameAction(game)} activeOpacity={0.8} style={{flex:1 }}>
                <View style={[viewStyles.casinoItem,gID ===0?{paddingRight:3}:{paddingLeft:3}]}>
                <Image style={viewStyles.casinoItemImg} source={{uri:game.icon}} />
                </View>
                </TouchableOpacity>
                    )
                })}
            </View>
        )
      };
      let {width,height}= Dimensions.get('window')

    Object.keys(populargamesData).forEach(g => {
      if (null !== populargamesData[g] && void 0 !== populargamesData[g])
        pg.push(populargamesData[g]);
    });
    return (
      <View style={{flex:1}}>
      <ScrollView style={{flex: 1, padding: 0}}
       refreshControl={<RefreshControl refreshing={refreshing} onRefresh={this.reloadData} tintColor={'#018da0'} colors={['#018da0']}/>}
      >
        <View style={{flex:1}}>
          <HomeBanner
            photos={siteBanner}
            featured_banner={featuredbanner}
            history={navigation}
          />
          {pg.length > 0 && (
            <View>
              <View style={styles.contentBody}>
                <View style={styles.header}>
                  <Text style={styles.title}>Featured Events</Text>
                </View>
                <FeaturedGames
                  history={this.props.navigation}
                  data={pg}
                  navigatetoMarket={this.navigatetoMarket}
                  activeView={activeView}
                  betSelections={betSelections}
                  oddType={oddType}
                  addEventToSelection={addEventToSelection}
                />
              </View>
            </View>
          )}
        </View> 
        <View style={styles.contentBody}>
            <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} onPress={()=>this.props.navigation.navigate('Prematch')}>
            <View style={styles.header}>
                <Text style={styles.title}>Upcoming Games</Text>
                <View style={styles.minutesFilter}><Text style={styles.filterButton}>more</Text></View>
            </View>
            </TouchableNativeFeedback>
            <HomepageEvents history={navigation} data={upcomingData} betSelections={betSelections} oddType={oddType} addEventToSelection={addEventToSelection} loadSports={loadUpcomingEvents} is_live={false}  goToSportsPage={this.goToSportsPage} />
        </View>
        <View style={styles.contentBody}>
            <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} onPress={()=>this.props.navigation.navigate('Live')}>
            <View style={styles.header}>
                <Text style={styles.title}>Live Now</Text>
                <View style={styles.minutesFilter}><Text style={styles.filterButton}>more</Text></View>
            </View>
            </TouchableNativeFeedback>
            <HomepageEvents loadSports={loadLiveNow} history={history} data={liveNowData} betSelections={betSelections} oddType={oddType} addEventToSelection={addEventToSelection} is_live={true} navigatetoMarket={this.navigatetoMarket}/>
        </View>
        <View style={[styles.contentBody,{paddingBottom:5}]}>
          <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} onPress={()=>this.props.navigation.navigate('SlotGames')}>
            <View style={styles.header}>
                <Text style={styles.title}>Slot Games</Text>
                <View style={styles.minutesFilter}><Text style={styles.filterButton}>more</Text></View>
            </View>
          </TouchableNativeFeedback>
            <Carousel ref={(e)=>this.slotgameCarouselRef=e} 
                data={arrayBuffer(games,2)}
                renderItem={(item)=><CasinoGame item={item.item}/>}
                sliderWidth={width}
                itemWidth={width}
                layout={'default'}
                firstItem={0}
                />
        </View>
      </ScrollView>
      {isFocused&&<Controls navigate={this.props.navigation.navigate}/>}
      </View>
    );
  }
}
export default withNavigationFocus(Home);
const styles = StyleSheet.create({
  contentBody: {
    marginTop: 5,
    backgroundColor:'#fff'
  },
  header: {
    minHeight: 35,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#018da0',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    margin:0
  },
  title: {
    color: '#fff',
    display: 'flex',
    overflow: 'hidden',
    fontWeight: '700',
    fontSize: 12,
    paddingTop:5,
    textTransform: 'uppercase',
  },
  minutesFilter: {
    display: "flex",
    overflow: "hidden",
    flexDirection:'row',
    alignItems:'center',
    fontSize: 12,
    width:60,
  },
  filterButton: {
    backgroundColor: "#fff",
    borderRadius: 4,
    flex: 1,
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    textAlign:'center',
    fontSize: 13,
    paddingHorizontal:0,
    paddingBottom:3
  }
});
