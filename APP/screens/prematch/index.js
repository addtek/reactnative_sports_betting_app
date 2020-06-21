import React, {PureComponent} from 'react';
// import { SportListLoader, SportsbookSportItemLoading } from '../../components/loader'
// import Sport from '../../containers/sports'
// import Popular from '../../components/popular'
import {allActionDucer} from '../../actionCreator';
import {SPORTSBOOK_ANY, RIDS_PUSH, APPREADY, PREMATCH_DATA} from '../../actionReducers';
import {
  stringReplacer,
  viewStyles,
  gridStyles,
} from '../../common';
import {SportsbookSportItem} from '../../components/stateless';
import {View, FlatList, ScrollView, Text, RefreshControl,Switch,TouchableNativeFeedback,LayoutAnimation} from 'react-native';
import Region from '../../components/region';
import {withNavigationFocus} from 'react-navigation';
import { Fab } from 'native-base';
import CustomIcon from '../../components/customIcon';
import { Map } from 'immutable';
import { SportsbookSportItemLoading, SportListLoader } from '../../components/loader';
import Controls from '../../containers/controls';
class Prematch extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeID: null,
      subid: null,
      refreshing: !1,
      loadingInitialData: false,
      allowMultiSelect: false,
      selectedCompetitions: [],
    };
    this.flatListRef = null;
    this.sportsListRef = null;
    this.navigate = this.navigate.bind(this);
    this.navigatetoMarket = this.navigatetoMarket.bind(this);
    this.addToSelectedCompetitions = this.addToSelectedCompetitions.bind(this);
    this.reloadData = this.reloadData.bind(this);
    this.setAllowMultiSelect = this.setAllowMultiSelect.bind(this);
    this.resetSelection = this.resetSelection.bind(this);
    this.scrollToIndex = this.scrollToIndex.bind(this);
    this._renderItem = this._renderItem.bind(this);
    this.setSelectedSport = this.setSelectedSport.bind(this);
    this.openGameToView = this.openGameToView.bind(this);
    this.openGameToView = this.getTotalGames.bind(this);
    this.rids = {...this.props.sportsbook.rids};
  }
  componentDidMount() {
    let {sessionData} = this.props.sportsbook;
    this.props.dispatch(
      allActionDucer(APPREADY, {
        activeView: 'Prematch',
      }),
    );
    this.props.dispatch(
      allActionDucer(PREMATCH_DATA, {
        loadSports: true,
      }),
    );
    if (undefined !== sessionData.sid && !this.state.loadingInitialData) {
      this.loadSportsList();
      this.setState({loadingInitialData: true, view: 'Prematch'});
    }
  }
  componentDidUpdate() {
    let {sessionData,subscriptions} = this.props.sportsbook,{data}=this.props.prematchData,{activeView}=this.props.appState,{subid,loadingInitialData}=this.state;
    if (
      undefined !== sessionData.sid &&
      !loadingInitialData &&
      !data.sport
    ) {
      this.props.dispatch(allActionDucer(PREMATCH_DATA, {loadSports: true}));
      this.loadSportsList();
      this.setState({loadingInitialData: true, view: 'Prematch'});
    } else if (
      undefined !== sessionData.sid &&
      data.sport &&
      activeView !== 'Prematch' &&
      this.props.isFocused
    ) {
      this.props.dispatch(
        allActionDucer(APPREADY, {
          activeView: 'Prematch',
        }),
      );
      this.props.dispatch(
        allActionDucer(PREMATCH_DATA, {
          loadSports: true,
          data: {},
        }),
      );
      this.loadSportsList();
      // this.setState({ loadingInitialData: true})
    }
    if(!this.props.isFocused && loadingInitialData){
      if (subid !== null)
        if (subscriptions[subid]) {
          this.props.unsubscribe(subid)
          delete subscriptions[subid]
          this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, {subscriptions:subscriptions, premathSportListSid: null}))
          this.setState({ subid: null,loadingInitialData:false})
        }
    }
  }
  componentWillUnmount() {
    // this.props.bulkUnsubscribe([], true)
    this.props.dispatch(
      allActionDucer(APPREADY, {
        activeView: '',
      }),
    );
    this.props.dispatch(
      allActionDucer(PREMATCH_DATA, {
        loadSports: false,
        data: {},
        populargamesData: {},
        popularcompetitionData:{},
      }),
    );
  }
  loadPrematchGames(id) {
    this.props.popularInSportsBook('game', true);
    this.props.popularInSportsBook('competition');
    this.rids["7.5"].request = {
      command: 'get',
      params: {
        source: 'betting',
        what: {
          sport: ['id', 'name', 'alias', 'order'],
          region: ['id', 'name', 'alias', 'order'],
          competition: ['id', 'order', 'name'],
          game: ['@count'],
        },
        where: {
          sport: {type: {'@ne': 1}},
          game: {
            type: {
              '@or': [
                {type: {'@in': this.props.sportsbook.Prematch}},
                {visible_in_prematch: 1},
              ],
            },
          },
        },
        subscribe: true,
      },
      rid: "7.5",
    };
    if (id) {
      this.rids["7.5"].request.params.where.sport.id = id;
    }
    this.props.dispatch(allActionDucer(PREMATCH_DATA, {loadSports:true}));
    let newRid = {};
    newRid["7.5"] = this.rids["7.5"];
    this.props.dispatch(allActionDucer(RIDS_PUSH, newRid));
    this.props.sendRequest(this.rids["7.5"].request);
  }
  loadSportsList() {
    let d = {
      source: 'betting',
      what: {
        sport: ['id', 'name', 'alias', 'type', 'order'],game:"@count"
      },
      where: {
        game: {},
      },
    };
    d.where.sport = {
      type: {
        '@ne': 1,
      },
    };
    d.where.game.type = {
      '@or': [{type: {'@in': [0, 2]}}, {visible_in_prematch: 1}],
    };
    let id = 'prematchGamesSportList',
      newRid = {[id]: {id: id, request: {}}};
    newRid[id].rid = id;
    newRid[id].request = {
      command: 'get',
      params: {...d, subscribe: true},
      rid: id,
    };
    newRid[id].callback = this.handleSportList.bind(this);
    this.rids[id] = newRid[id];
    this.props.dispatch(allActionDucer(RIDS_PUSH, newRid));
    this.props.dispatch(allActionDucer(PREMATCH_DATA,{loadUpcomingEvents:true}));
    this.props.sendRequest(newRid[id].request);
  }
  handleSportList(data) {
    const subid = data.data.subid,rid= data.rid,
    dataN = data.data.data
    if(Object.keys(dataN.sport).length){
    let sportData=[]
    Object.keys(dataN.sport).forEach((i)=>{
      let dataD = dataN.sport[i]
      sportData.push(dataD)
    })
    sportData.sort((a, b) => {
      if (a.order > b.order)
        return 1
      if (b.order > a.order)
        return -1
      return 0
    })
    const {premathSportListSid, subscriptions} = this.props.sportsbook,
      {activeID} = this.state,s= this.props.navigation.state.params ?this.props.navigation.state.params.s:null;
    let firtitem =null!==s? s:activeID!==null?activeID: sportData[0]

    this.loadPrematchGames(firtitem.id);
    if (this.state.subid !== null )
    if (subscriptions[premathSportListSid]) {
      this.props.unsubscribe(this.state.subid);
      delete subscriptions[this.state.subid];
    }
    subscriptions[subid] = {
      subid: subid,
      callback: data =>
      this.props.handleSportUpdate(data,'prematchData',PREMATCH_DATA, 'prematchSportListData'),
      subStateVarName: 'premathSportListSid',
      request: this.rids[rid].request,
    };
    this.setState({activeID: firtitem,subid:subid});
    this.props.dispatch(
      allActionDucer(SPORTSBOOK_ANY, {
        subscriptions: subscriptions,
        premathSportListSid: subid,
      }),
    );
    this.props.dispatch(
      allActionDucer(PREMATCH_DATA, {
        prematchSportListData: data.data.data,
        loadUpcomingEvents: false,
      }),
    );
    }
    else{
      this.props.dispatch(
        allActionDucer(PREMATCH_DATA, {
          loadUpcomingEvents: false,
        }),
      );
    }
  }
  navigate(route, data) {
    this.props.navigation.navigate(route, data);
  }
  navigatetoMarket(data) {
    this.props.navigation.navigate('game_view', data);
  }
  reloadData() {
    this.props.dispatch(
      allActionDucer(PREMATCH_DATA, {loadSports: true, refreshing: true}),
    );
    this.loadSportsList();
  }
  setSelectedSport = (sport,i) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    if (sport.hasOwnProperty('id')) {
      this.loadPrematchGames(sport.id);
    }
    this.setState({activeID: {...sport,itemIndex:i}});
    this.sportsListRef.scrollTo({animated: true, x: i*(80),y:0})
  };
  openGameToView = (competition, region, sport) => {
    // this.props.history.push(`/sports/prematch/${sport.alias}/${region.name}/${competition.id}`,{sport:sport,region:region,competition:competition})
    this.props.history.push(
      `${this.props.match.url}/${sport.alias}/${region.name}/${competition.id}`,
      {sport: sport, region: region, competition: competition},
    );
  };
  loadMarkets = data => {
    // console.log(data);
  };

  getTotalGames = region => {
    var size = 0;
    for (let reg in region) {
      if (null !== region[reg]) {
        var competition = region[reg].competition;
        for (let compete in competition) {
          // console.log(competition[compete].game)
          if (null !== competition[compete]) {
            if (null !== competition[compete].game)
              size += Object.keys(competition[compete].game).length;
          }
        }
      }
    }
    return size > 0 ? size : '';
  };
  _renderItem({index, item, sport}) {
    const {
        oddType
      } = this.props.sportsbook,{activeView}=this.props.appState,{betSelections}=this.props.betslip,
      {addEventToSelection} = this.props,{allowMultiSelect,selectedCompetitions}=this.state;
    return (
      <Region
        regIndex={index}
        navigatetoMarket={this.navigatetoMarket}
        selectedCompetitions={selectedCompetitions}
        allowMultiSelect={allowMultiSelect}
        scrollToIndex={this.scrollToIndex}
        viewCompetition={this.navigate}
        addToSelectedCompetitions={this.addToSelectedCompetitions}
        addEventToSelection={addEventToSelection}
        sport={sport}
        activeView={activeView}
        region={item}
        betSelections={betSelections}
        oddType={oddType}
      />
    );
  }
  scrollToIndex = ind => {
    this.flatListRef.scrollToIndex({animated: true, index: ind,viewPosition:0.1});
  };
  addToSelectedCompetitions(c) {
    const {selectedCompetitions} = this.state;
    let copySelection =selectedCompetitions.slice()
    const alreadyExist = copySelection.includes(c);
    if (!alreadyExist) copySelection.push(c);
    else {
      let index = copySelection.indexOf(c)
      copySelection.splice(index, 1);
    }
    copySelection.length<=1 && LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
    this.setState({selectedCompetitions: copySelection});
  }
  setAllowMultiSelect(e){
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
    this.setState(prevState=>({allowMultiSelect:!prevState.allowMultiSelect}))
  }
  resetSelection(){
    this.setState({selectedCompetitions:[]})
  }
  render() {
    const {
        data,
        refreshing,
        popularcompetitionData,
        populargamesData,
        prematchSportListData,
        loadSports,
        loadUpcomingEvents
      } = this.props.prematchData,{betSelections}=this.props.betslip,{isFocused}=this.props,   
      {activeID,allowMultiSelect,selectedCompetitions} = this.state,
      pg = [],
      pc = [];
    let initialData = {},
      spItems = [],betlen = null !== betSelections && undefined !== betSelections ? Object.keys(betSelections).length : 0,
      sport = data ? data.sport : {};
    if (prematchSportListData.hasOwnProperty('sport')) {
      const sport = prematchSportListData.sport;
      Object.keys(sport).forEach(sp => {
        if (void 0 !== sport[sp] && null !== sport[sp])
          spItems.push({
            id: sport[sp].id,
            name: sport[sp].name,
            alias: sport[sp].alias,
            order:sport[sp].order,
            game: !isNaN(sport[sp].game)?sport[sp].game:0
          });
          // console.log(sport[sp].game)
      });
    }
    spItems.sort((a, b) => {
      if (a.order > b.order)
        return 1
      if (b.order > a.order)
        return -1
      return 0
    })
    if (data.sport) {
      if (activeID !== null && void 0 !== activeID) {
        if (typeof activeID === 'object' && null !== activeID) {
          initialData = sport[activeID.id] ? sport[activeID.id] : {};
        } else {
          initialData = sport[activeID] ? sport[activeID] : {};
        }
      } else {
        initialData = sport[Object.keys(sport)[0]];
      }
    }

    Object.keys(popularcompetitionData).forEach(c => {
      if (null !== popularcompetitionData[c])
        pc.push(popularcompetitionData[c]);
    });
    Object.keys(populargamesData).forEach(g => {
      if (null !== populargamesData[g]) pg.push(populargamesData[g]);
    });
    let region = [],
      totalgames = 0;
    if (initialData.hasOwnProperty('id')) {
      totalgames = this.getTotalGames(initialData.region);
      for (let regionid in initialData.region) {
        if (null !== initialData.region[regionid])
          region.push(initialData.region[regionid]);
      }
    }
    region.sort((a, b) => {
      if (a.order > b.order) {
        return 1;
      }
      if (b.order > a.order) {
        return -1;
      }
      return 0;
    });
    return (
      <ScrollView
       scrollEnabled={false}
        contentContainerStyle={{flex:1}}
        >
        <View>
        <>
          <ScrollView
           ref={e=>this.sportsListRef=e}
            horizontal={true}
            contentContainerStyle={{
              paddingHorizontal: 3,
              backgroundColor: '#026775',
            }}
            showsHorizontalScrollIndicator={false}>
            {
              loadUpcomingEvents?
               <SportsbookSportItemLoading/>
           :
            <>
              {pc.length > 0 && (
                <SportsbookSportItem
                  s={{id: 'TC', alias: 'trophy', name: 'Top Leagues'}}
                  is_live={true}
                  i={100}
                  activeID={
                    typeof activeID === 'object' && null !== activeID
                      ? activeID.id
                      : activeID
                  }
                  onClick={s => {
                    this.setSelectedSport(s);
                  }}
                />
              )}
              {pg.length > 0 && (
                <SportsbookSportItem
                  s={{id: 'TG', alias: 'medal', name: 'Top Games'}}
                  is_live={true}
                  i={101}
                  activeID={
                    typeof activeID === 'object' && null !== activeID
                      ? activeID.id
                      : activeID
                  }
                  onClick={s => {
                    this.setSelectedSport(s);
                  }}
                />
              )}
            </>}
            {spItems.map((s, i) => {
              return (
                <SportsbookSportItem
                  key={s.id}
                  s={s}
                  i={i}
                  is_live={true}
                  activeID={
                    typeof activeID === 'object' && null !== activeID
                      ? activeID.id
                      : activeID
                  }
                  onClick={s => {
                    this.setSelectedSport(s,i);
                  }}
                />
              );
            })}
          </ScrollView>
          <View
            style={[
              viewStyles.sportHeader,
              {height:35},
              viewStyles[
                stringReplacer(
                  initialData.alias ? initialData.alias : '',
                  [/\s/g, /'/g, /\d.+?\d/g, /\(.+?\)/g],
                  ['', '', '', ''],
                ).toLowerCase()
              ],
              viewStyles.select,
              {padding: 10,margin:0},
            ]}>
            <View style={[viewStyles.sportTitle, gridStyles.colsm10]}>
              <Text style={[viewStyles.textWhite, viewStyles.textShow]}>
                {initialData.hasOwnProperty('id')
                  ? initialData.name
                  : activeID === 'TC'
                  ? 'Top Competitions'
                  : activeID === 'TG'
                  ? 'Top Games'
                  : ''}
              </Text>
            </View>
            <View style={[viewStyles.sportAccord, gridStyles.colsm2]}>
              <Text style={[viewStyles.textWhite]}>
                {this.getTotalGames(initialData.region)}
              </Text>
            </View>
          </View>
        </>
        <View style={{height:40,flexDirection:'row',padding:10,justifyContent:'space-between',backgroundColor: '#F2F1F1',}}>
        <View style={{flexDirection:'row',alignItems:'center'}}>
        <View style={{flexDirection:'row',alignItems:'center'}}>
           <Text style={{fontSize:14}}>Enable multiple selection</Text>
        </View>
        <Switch value={allowMultiSelect} onChange={this.setAllowMultiSelect}/>
        </View>
        <View style={{width:90,alignItems:'center',flexDirection:'row',justifyContent:'flex-start'}}>
        <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} onPress={this.resetSelection}>
          <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
            <Text style={{fontSize:15}}>Deselect all</Text>
          </View>
        </TouchableNativeFeedback>
        </View>
      </View>
        </View>
        {/* <View style={{flex:3}}> */}
      {   
      loadSports?
      <FlatList
      data={[1,2,3,4,5]}
      keyExtractor={(item,index)=>index.toString()}
      renderItem={({item,index})=><SportListLoader key={index} index={index} isLive={false}/>}
      />
      :
        <FlatList
          ref={e => (this.flatListRef = e)}
          contentContainerStyle={{paddingBottom:90}}
          data={activeID === 'TC' ? pc : activeID === 'PC' ? pg : region}
          extraData={Map({activeID:activeID,allowMultiSelect:allowMultiSelect})}
          keyExtractor={(item)=>item.id.toString()}
          renderItem={({item, index}) =>
            this._renderItem({
              item: item,
              index: index,
              sport: {
                id: initialData.id,
                name: initialData.name,
                alias: initialData.alias,
              },
            })
          }         
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={this.reloadData}
            tintColor={'#018da0'}
            colors={['#018da0']}
          />
        }
        removeClippedSubviews={true}
        ListEmptyComponent={() => (
          <View style={viewStyles.sbIndicatorMessage}>
            <View style={{flexDirection:'row'}}>
              <CustomIcon name="sb-sports-list" size={20} />
              <Text style={viewStyles.sbIndicatorMessageView}>
                No data to show
              </Text>
            </View>
          </View>
        )}
        />}
        {allowMultiSelect&&selectedCompetitions.length>0 && <Fab
          style={{ backgroundColor: '#026775' }}
          position="bottomLeft"
          onPress={() => this.navigate('c',selectedCompetitions)}>
          <CustomIcon name="check-circle" size={30} color="#026775"/>
        </Fab>}
        {isFocused&&<Controls navigate={this.props.navigation.navigate}s/>}
        {/* </View> */}
      </ScrollView>
    );
  }
}
export default withNavigationFocus(Prematch);
