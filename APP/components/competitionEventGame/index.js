import React,{PureComponent} from 'react' 
import LiveBtn from '../liveBtn'
import moment from 'moment-timezone'
 import {
  stringReplacer,
  convertSetName,
  viewStyles,
  gridStyles
} from '../../common'
import { View, Text, TouchableNativeFeedback } from 'react-native';
import CustomIcon from '../customIcon';
export default class CompetitionEventGame extends PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        opened: false,
        loadGames: false,
        games:  [], data: [],
        gamesArr: [],
        draggedGame: null
      };
      this.gamebody = null
      this.timeout = null
      this.onDragStart = this.onDragStart.bind(this)
      this.onDragEnd = this.onDragEnd.bind(this)
      this.addClass = this.addClass.bind(this)
    }
    loadMarkets(game,sport,region,competition){
       const activeView = this.props.activeView
      if(activeView === 'Live' || activeView === 'Prematch'){
      this.props.loadMarkets(competition,region,sport,game)
      // updateBrowserHistoryState({sport:sport.id,region:region.id,competition:competition.id,game:game.id},`/sports/${activeView.toLowerCase()}/${sport.alias}/${region.name}/${competition.id}/${game.id}`)
    }
      else{
          const view =activeView === 'Home' ? 'live':'prematch'
      this.props.history.replace(`/sports/${view}/${sport.alias}/${region.name}/${competition.id}/${game.id}`,{sport:sport.id,region:region.id,competition:competition.id,game:game.id})
      }
    }
    sortDateByDayASC(a, b){
  
      if (moment(a.date).isAfter(b.date, 'day')) {
        return 1;
      }
      if (moment(a.date).isBefore(b.date, 'day')) {
        return -1;
      }
      return 0;
    }
    sortDateByTimeASC(a, b) {
      var anewDate = moment.unix(a.start_ts).format('YYYY-MM-DD H:mm');
      var bnewDate = moment.unix(b.start_ts).format('YYYY-MM-DD H:mm');
      if (moment(anewDate).isAfter(bnewDate)) {
        return 1;
      }
      if (moment(anewDate).isBefore(bnewDate)) {
        return -1;
      }
      return 0;
    }
    sortDateDESC(a, b){
      if (a.date > b.date) {
        return -1;
      }
      if (b.date > a.date) {
        return 1;
      }
      return 0;
    }
    onDragStart(e, g, c) {
      e.dataTransfer.setData('text', JSON.stringify(g))
      // e.dataTransfer.effectAllowed = "move";
      this.addClass(g.id + '' + c)
    }
    gameClicked(g) {
      this.setState({ draggedGame: g.id })
      this.props.addToMultiViewGames(g.id)
    }
    onDragEnd(e, g) {
      this.setState({ draggedGame: null })
      document.getElementById(g).classList.remove('dragging')
    }
    addClass(g) {
      this.timeout = setTimeout(() => {
        document.getElementById(g).classList.add('dragging')
      });
    }
    componentWillUnmount(){
      clearTimeout(this.timeout)
    }
    render() {
      const {
        props: { games, region, sport, betSelections, addEventToSelection, activeGame, competition, oddType,navigatetoMarket,activeMarket}
      } = this;
      let data = [],eventSize=0
      if (null !== games && undefined !== games)
        Object.keys(games).forEach((game, ind) => {
          if (null !== games[game]) {
            data.push(games[game])
            if(eventSize ===0){
              let cc =games[game]
                const dd = cc;
                if(dd.market){
                  let market= dd.market,
                  index0= Object.keys(market)[0];
                  if(market[index0] && market[index0].event)
                  eventSize= Object.keys(market[index0].event).length
                }
            }
          }
        })
      data.sort(this.sortDateByDayASC)
      return (
        <View ref={(e) => { this.gamebody = e }} style={viewStyles.sportlistCompetitionAccordion} >
          <View style={viewStyles.sbAccordionContainer}>
            {
              data.map((game, index) => {
                if (null !== game && (null !== game.market)) {
                  let currentSet = game !== null && game.info && game.info.current_game_state ? convertSetName()(game.info.current_game_state, stringReplacer(sport.alias, [/\s/g], [''])) : '';
                  let events = [],cmarket,marketSize = game.market ? Object.keys(game.market).length : 0,  eventMarket = game.market ? game.market[Object.keys(game.market)[0]] : null;
                  if (marketSize > 0 && eventSize > 0)
                    for (const mark in game.market) {
                      cmarket = game.market[mark]
                      if (cmarket && cmarket.type == "P1XP2") {
                        Object.keys(cmarket.event).forEach((eventItem, ind) => {
                          if (null !== cmarket.event[eventItem])
                            events.push(cmarket.event[eventItem])
                        })
                        break;
                      } else if (cmarket && cmarket.type == "P1P2") {
                        Object.keys(cmarket.event).forEach((eventItem, ind) => {
                          if (null !== cmarket.event[eventItem])
                            events.push(cmarket.event[eventItem])
                        })
                        break;
                      }
                    }
                  events.sort((a, b) => {
                    if (a.order > b.order)
                      return 1
                    if (b.order > a.order)
                      return -1
                    return 0
                  })
                  return (
                      <View key={index} style={[viewStyles.sbAccordionItem]}>
                        <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} onPress={() =>navigatetoMarket({game:game, sport:sport, region:region, competition:competition})} >
                        <View style={[eventSize>0?gridStyles.colsm6:gridStyles.colsm12,viewStyles.sbAccordionTitle,viewStyles.sbAccordionTitleMatchTitle]}>
                          <View style={viewStyles.matchTitleText}>
                            <Text  numberOfLines={1} ellipsizeMode='tail'style={[eventSize>0?gridStyles.colsm10:gridStyles.colsm11,{padding:3},viewStyles.themeTextColor]}>{game.team1_name}</Text>
                            <Text style={[eventSize>0?gridStyles.colsm2:gridStyles.colsm1,{color:'rgba(230,180,79,.99)'}]}>{game.info ? game.info.score1 : ''}</Text>
                          </View>
                          <View style={[viewStyles.matchTitleText,viewStyles.matchTitleTextx2]}>
                            <Text numberOfLines={1} ellipsizeMode='tail' style={[eventSize>0?gridStyles.colsm10:gridStyles.colsm11,{padding:3},viewStyles.themeTextColor]}>{game.team2_name}</Text>
                            <Text style={[eventSize>0?gridStyles.colsm2:gridStyles.colsm1,{color:'rgba(230,180,79,.99)'}]}>{game.info ? game.info.score2 : ''}</Text>
                          </View>
                          <View style={viewStyles.hiddenIcons}>
                            <View style={[gridStyles.colsm10,{flexDirection:'row'}]}>
                              <View style={viewStyles.matchTimeInfo}>
                                <Text numberOfLines={1} ellipsizeMode='tail' style={{padding:3,color: "#1ba573",fontWeight:'700',fontSize:12}}>{game.info ? currentSet !== 'notstarted' ? currentSet : moment.unix(game.start_ts).format('D MMMM YYYY H:mm') : null} {game.info ? game.info.current_game_time : null}</Text>
                              </View>
                              {/* <View  className="goal-alert-msg">Goal!!!</View> */}
                            </View>
                              <CustomIcon name="star-outline" size={12} style={[gridStyles.colsm2,viewStyles.addToFavorite]}{...viewStyles.themeTextColor}/>
                          </View>
                          
                        </View>
                        </TouchableNativeFeedback>
                        {eventSize>0&& <View style={[gridStyles.colsm6, viewStyles.sbAccordionContent, viewStyles.matchContent]}>
                            <View style={viewStyles.sbAccordionContentMatchContentInner}>
                              <View style={[viewStyles.sbGameBetBlockWrapper, gridStyles.colsm12]}>
                                <View style={viewStyles.sbGameBetBlock}>
                                  {
                                  (events.length > 0) ?
                                    events.map((e, i) => {
                                      return (
  
                                        <LiveBtn key={i} e={e} betSelections={betSelections} game={game} eventMarket={eventMarket} addEventToSelection={addEventToSelection} oddType={oddType} competition={competition} sport={sport} />
                                      )
                                    })
                                    :
                                    this.props.eventTypeLen.map((e,i)=>{
                                      return(
                                        <View key={i} style={viewStyles.sbGameBetBlockInner}><View style={{flex:1,display:'flex',justifyContent:'center',flexDirection:'row',paddingHorizontal:0,paddingVertical:0,margin:0,padding:0,alignItems:'center'}}><View style={viewStyles.sbGameBetCoeficiente}><Text style={viewStyles.themeTextColor}>-</Text></View></View></View>
                                      )
                                    })
                                  }
                                </View>
                              </View>
                            </View>
                           
                          </View>}
                      </View>
                  )
                }
              })
            }
          </View>
        </View>
      )
    }
  }