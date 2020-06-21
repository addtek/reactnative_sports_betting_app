import React, {PureComponent} from 'react'
import moment from 'moment-timezone'
import { stringReplacer, convertSetName, viewStyles } from '../../common'
import SelectableEventBtn from '../../components/selectableEventBtn'
import {SportItem, SportsbookSportItem} from '../../components/stateless'
import { View, ScrollView, StyleSheet,Text,LayoutAnimation, Platform ,UIManager, TouchableNativeFeedback} from 'react-native'
import { SportsbookSportItemLoading, LiveEventLoader } from '../loader'
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}
export default class HomepageEvents extends PureComponent{
    constructor(props) {
      super(props)
      this.state = {
        activeID:null,
        hover:false
      }
      this.setSelectedSport = this.setSelectedSport.bind(this)
    }
    componentDidMount() {
  
    }
    componentDidUpdate() {
  
    }
    load(data){
      this.props.history.replace(`/sports/${this.props.is_live?'live':'prematch'}/${data.sport.alias}/${data.region.name}/${data.competition.id}/${data.game.id}`,{sport:data.sport,region:data.region,competition:data.competition,game:data.game})
    }
    setSelectedSport(id){
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
     if(id!== this.state.activeID){this.setState({activeID:id})}
   }

    render() {
      const{props:{data,betSelections,oddType,addEventToSelection,is_live,navigatetoMarket,goToSportsPage,loadSports },state:{activeID,hover}}=this
      let initialData = {},spItems = [],rendableData=[];
      if(data.sport){
        let sport = data.sport
        Object.keys(sport).forEach((sp)=>{
          if(void 0 !== sport[sp] && null !== sport[sp])
          spItems.push({id:sport[sp].id,name:sport[sp].name,alias:sport[sp].alias,order:sport[sp].order,game:sport[sp].game})
        })
        spItems.sort((a, b) => {
          if (a.order > b.order)
            return 1
          if (b.order > a.order)
            return -1
          return 0
        })
        if(activeID !==null){
          initialData = data.sport[activeID]
        }else{
          initialData = data.sport[Object.keys(data.sport)[0]]
        }
        if(void 0 !==initialData && null !== initialData){
          let reg = initialData.region? initialData.region :null
           if(reg)
           {
             let limit=5,limitCount=1
             for (const c in reg) {
              let r= reg[c], comp = r &&r.competition?r.competition:null
              if(comp){
                Object.keys(comp).forEach((g)=>{
                  let game =comp[g] ?comp[g].game:null
                  if(game){
                    Object.keys(game).forEach((m)=>{
                      let market = game[m]?game[m].market:null
                      if(market){
                        for(let mar in market){
                          let marketEvents = {}
                          if (market[mar] && market[mar].type === 'P1XP2') {
                            for (const e in market[mar].event) {
                              const event = {...market[mar].event[e]};
                              if (event) {
                                marketEvents[event.name] = event
                              }
                              
                            }
                            limitCount<=limit &&rendableData.push({sport:{id:initialData.id,name:initialData.name,alias:initialData.alias},region:{id:r.id,name:r.name,alias:r.alias},competition:{id:comp[g].id,name:comp[g].name},
                              game:{id:game[m].id,team1_name:game[m].team1_name,team2_name:game[m].team2_name,score1:game[m].info.score1,score2:game[m].info.score2,time:game[m].info.current_game_time,set:convertSetName()(game[m].info.current_game_state, stringReplacer(initialData.alias, [/\s/g], [''])),start_ts:game[m].start_ts},market:{...market[mar],event:null},event:marketEvents,count:game[m].markets_count,col_count:market[mar].col_count});
                            
                              limitCount+=1
                            
                            break
                          }
                          else if (market[mar]&&market[mar].type === 'P1P2') {
                            for (const e in market[mar].event) {
                              const event = {...market[mar].event[e]};
                              if (event) {
      
                                marketEvents[event.name] = event
      
                              }
                            }
                             limitCount<=limit && rendableData.push({sport:{id:initialData.id,name:initialData.name,alias:initialData.alias},region:{id:r.id,name:r.name,alias:r.alias},competition:{id:comp[g].id,name:comp[g].name},
                              game:{id:game[m].id,is_blocked:game[m].is_blocked ,team1_name:game[m].team1_name,team2_name:game[m].team2_name,score1:game[m].info.score1,score2:game[m].info.score2,time:game[m].info.current_game_time,set:convertSetName()(game[m].info.current_game_state, stringReplacer(initialData.alias, [/\s/g], [''])),start_ts:game[m].start_ts},market:{...market[mar],event:null},event:marketEvents,count:game[m].markets_count,col_count:market[mar].col_count});
                            limitCount+=1
                           
                            break
                          }
                        }
                      }
                       
                     })
                  }
                })
              }else break
             }
           }
          
        }
      }
      return(
        <>

          {is_live?
          <View style={viewStyles.sportItem}>
            <ScrollView horizontal={true} contentContainerStyle={{paddingHorizontal:0}} showsHorizontalScrollIndicator={false}>
            {
              loadSports?
              <SportsbookSportItemLoading/>
              :
              spItems.map((s,i)=>{
                return <SportItem s={s} i={i} activeID={activeID} key={i} onClick={this.setSelectedSport} is_live={is_live}/>
              })
            }
            </ScrollView>
          </View>
          :
          <View style={{flex:1,padding:0,margin:0}}>
          <ScrollView horizontal={true} contentContainerStyle={{paddingHorizontal:3,paddingVertical:5,backgroundColor:'#026775'}} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
              {
                 loadSports?
                 <SportsbookSportItemLoading/>
                 :
                spItems.map((s,i)=>{
                  return <SportsbookSportItem key={i} type="home" s={s} i={i} activeID={activeID}  onClick={goToSportsPage} is_live={is_live}/>
                })
              }
          </ScrollView>
          </View>
          }
          <View >
          {
            loadSports &&is_live?
            <LiveEventLoader/>
            :
            rendableData.map((d,i)=>{
              let eventsArr = []
              Object.keys(d.event).forEach((singleEvent, id) => {
                if (null !== d.event[singleEvent]) eventsArr.push(d.event[singleEvent])
              })
              eventsArr.sort((a, b) => {
                if (a.order > b.order) {
                  return 1;
                }
                if (b.order > a.order) {
                  return -1;
                }
                return 0;
              })
              return(
                <TouchableNativeFeedback key={i} background={TouchableNativeFeedback.SelectableBackground()} onPress={()=>navigatetoMarket(d)}>
                <View style={viewStyles.eventBlockColumn} >
                  <View style={viewStyles.eventDetails}>
                      <View style={{...viewStyles.liveEventDetailsInline,...viewStyles.liveEventDetails}}>
                        <Text style={{...viewStyles.liveEventDetailsText, borderRadius: 4,paddingLeft:5,paddingRight:5}}>{d.game.set} {d.game.time}</Text>
                        <Text style={{...viewStyles.liveEventDetailsText,marginLeft: 5,borderRadius: 4,paddingLeft: 2,paddingRight:2}}>{d.game.score1} - {d.game.score2}</Text>
                      </View>
                     <View style={{flex:2,alignItems:'center',display:'flex',flexDirection:'row'}}>
                       <Text numberOfLines={1} ellipsizeMode='tail' style={viewStyles.eventDetailsCompetition}>{d.region.name} - {d.competition.name}</Text>
                     </View>
                      <View style={{...viewStyles.eventInfo,...viewStyles.eventInfoLiveStreamDisabled}} >
                        <Text style={viewStyles.marketsCount}>+{d.count}</Text>
                      </View>
                  </View>
                  <View style={{...viewStyles.eventOddsInline,...viewStyles.eventOdds}}>
                    {
                      eventsArr.map((e,index)=>{ 
                        return (
                          <SelectableEventBtn nth={index} showType={'home'} eventLen={eventsArr.length} key={e.id} betSelections={betSelections} game={d.game} market={d.market} data={e} sport={d.sport} competition={d.competition}eventLen={eventsArr.length} event_col={d.col_count} addEventToSelection={addEventToSelection}
                            oddType={oddType} />
                        )
                      })
                    }
                  </View>
                </View>
                </TouchableNativeFeedback>
              )
            })
          }
          </View>
        </>
      )
    }
  }
  const styles= StyleSheet.create({
    sportItemPrematch: {
      marginBottom: 0,
      overflow: "hidden",
      flexShrink: 0,
      color: "#fff"
    }
  })