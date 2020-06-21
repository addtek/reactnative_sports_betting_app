import React, {PureComponent} from 'react'
import SelectableEventBtn from '../selectableEventBtn'
import { View,Text, TouchableNativeFeedbackBase, TouchableNativeFeedback, LayoutAnimation } from 'react-native'
import CustomIcon from '../customIcon'
import { viewStyles } from '../../common'
export default class Market extends PureComponent {
    constructor(props) {
      super(props)
      this.state = {
        hideEvents: props.marketIndex <5 ?false:true
      }
    }
    render() {
      const {
        props: { market, activeGame, addEventToSelection, betSelections, sport,competition, oddType },
        state: { hideEvents }
      } = this
      var marketDataArr = [], cashout = 0, marketId,display_key, expressId
      Object.keys(market.data).forEach((event, key) => {
        marketDataArr.push(market.data[event])
        cashout = market.data[event].cashout
        marketId = market.data[event].group_id
        expressId = market.data[event].express_id
        display_key = market.data[event].display_key
      })
      return (
          <View className="event">
            <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} onPress={() => { LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);this.setState(prevState => ({ hideEvents: !prevState.hideEvents })) }}>
            <View style={[viewStyles.eventHeader]} >
              <Text ellipsizeMode="tail" numberOfLines={1} style={{fontSize:14,fontWeight:'700',flex:10}}>{activeGame ? market.name.replace(/Team 1/gi, activeGame.team1_name).replace(/Team 2/gi, activeGame.team2_name) : ''}</Text>
              {
                null!==activeGame &&
                  <View style={[viewStyles.marketIcons,{flex:2,justifyContent:'space-between'}]}>
                    {void 0 !== expressId &&<View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingLeft:2,paddingRight:2}}> 
                    <CustomIcon name="link" size={15} color="#9fa948"/>
                     <Text>
                      {expressId}
                     </Text>
                    </View>}
                    {cashout===1 && 
                      <CustomIcon name="cashout-available" size={15} color="#028947"/>
                    }
                  </View>
              }
              <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                <CustomIcon name={hideEvents?'arrow-down':'arrow-up'} size={15}/>
              </View>
            </View>
            </TouchableNativeFeedback>
            {/* {(marketId === 128 || (marketId===130 && (display_key==="HANDICAP" || void 0 ===display_key))) && <View className="handicap-header" style={{display:hideEvents && 'none'}}>
              <View className="handicap-title">{display_key=== "HANDICAP3WAY"? '1':activeGame.team1_name}</View>
              {
               display_key=== "HANDICAP3WAY" && <View className="handicap-title">Tie: 2</View>
              }
              <View className="handicap-title">{display_key=== "HANDICAP3WAY"? '2':activeGame.team2_name}</View>
              </View>} */}
            <View style={{flex:1, display: hideEvents ? 'none' : 'flex' }}>
              {
                marketDataArr.map((event,key) => {
                  var eventArr = []
                  if (null !== event && event.hasOwnProperty('event')) {
                    Object.keys(event.event).forEach((singleEvent, id) => {
                      if (null !== event.event[singleEvent]) eventArr.push(event.event[singleEvent])
                    })
                  } 
                  eventArr.sort((a, b) => {
  
                    if (a.order > b.order)
                      return 1
                    if (b.order > a.order)
                      return -1
                    return 0
                  }) 
                  return (
                    <View {...{ className: `event-item-col-${event.col_count||'3'}` }} key={event.id+''+key} style={{flex:1,flexDirection:'row'}}>
                      {
                        activeGame !==null &&
                          eventArr.map(
                            (eventData, index) => {
                              let evtmarket = { ...event }
                              delete evtmarket.event
                              return (
                                <SelectableEventBtn is_market={true} nth={index} key={index} betSelections={betSelections} sport={sport} competition={competition}  market_type={event.market_type} game={activeGame} display_key={display_key} groupId={marketId} market={evtmarket} data={eventData} eventLen={eventArr.length} event_col={event.col_count} addEventToSelection={addEventToSelection}
                                  oddType={oddType} />
                              )
                            }
                          )
                          }
                    </View>
                  )
                })
              }
            </View>
          </View>
          
      )
    }
  }