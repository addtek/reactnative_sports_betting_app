import React,{PureComponent} from 'react'
import {View,Text, TouchableOpacity} from 'react-native'
import {oddConvert,stringReplacer, viewStyles, gridStyles} from '../../common'
import CustomIcon from '../customIcon';
export default class SelectableEventBtn extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isSelected: false,
      priceChanged:!1
    }
    this.priceBtn = null;
    this.timeoutId = null
    this.eventData = { price: null, initialPrice: null } 
    this.addEvent =this.addEvent.bind(this)
    this.eventClasses= {1:'colsm4',2:'colsm6',3:'colsm4',4:'colsm12',5:'colsm5',6:'colsm2',7:'colsm2_5',8:'colsm4_5'}
  }

  componentDidUpdate() {
     const {data} =this.props
      if(data.initialPrice!==void 0){
        if (this.eventData.price !== data.price &&
          this.eventData.initialPrice !== data.initialPrice) {
            this.setState({priceChanged:!0})
          clearTimeout(this.timeoutId)
          this.timeoutId = setTimeout(function () {
            if (undefined !== this.priceBtn && null !== this.priceBtn) {
               this.setState({priceChanged:!1})
            }
          }.bind(this), 10000);
          this.eventData.price = data.price
          this.eventData.initialPrice = data.initialPrice
        }
      }
  }
componentWillUnmount(){
  clearTimeout(this.timeoutId)
}
addEvent(e,game,market,data,c,s){
  e.stopPropagation()
  if(!game.is_blocked) this.props.addEventToSelection(game, market, data,{competition:c.name,sport:s.alias})
 }
 getEventClassName(marketcol,eventLen,name=''){
     let classID=3
     if(void 0 !== marketcol){
     if(marketcol === 3 && eventLen>3){
       classID = 4
     }
     else if(marketcol === 2 && eventLen===2){
      classID = 2
     }
     else if(eventLen===1){
      classID = 4
     }
       
     }else{
       this.props.showType === 'home' ? eventLen>2? name==='Draw'? classID=7:  classID = 8: classID=eventLen:classID=eventLen
     }
      return this.eventClasses[classID]
 }
  render() {
    const {
      props: { data, eventLen,showType,display_key,groupId,sport,competition,is_market,
        event_col, market, game, betSelections, oddType,nth },state:{priceChanged}
    } = this
    let style=[viewStyles.singleEvent]
    betSelections[market.id] && betSelections[market.id].eventId == data.id && style.push(viewStyles.selectedEvent);
    game.is_blocked ===1 && style.push(viewStyles.blocked);
    void 0  ===display_key && eventLen>3? style.push(gridStyles.colsm12):style.push(gridStyles[this.getEventClassName(event_col,eventLen,data.name)]);
    if(nth>0)style.push(viewStyles.eventBorderLeft);
    if(is_market)style.push(viewStyles.eventBorderBottom);
    if(data.name==='W1' &&showType==='home')style.push({borderTopLeftRadius:4,borderBottomLeftRadius:4});
    if(data.name==='W2' &&showType==='home')style.push({borderTopRightRadius:4,borderBottomRightRadius:4});
    return (
      <View ref={(el) => { this.priceBtn = el }} {...{ style:style }} >
        <TouchableOpacity onPress={(e) => this.addEvent(e,game,market,data,competition,sport)} activeOpacity={0.9} style={{flex:1,display:'flex',flexDirection:'row',paddingHorizontal:0,paddingVertical:0,margin:0,padding:0,alignItems:'center'}}>
        <View style={{display:'flex',flexDirection:'row',flex:2}}>
          <Text style={[{...viewStyles.eventName,flex:data.name==='Draw' &&showType==='home'? 1:2},betSelections[market.id] && betSelections[market.id].eventId == data.id&&{color:'#fff'}]}>{`${stringReplacer(data.name === 'Nul'? data.type:data.name, [/Team 1/gi, /Team 2/gi, /W1/gi, /W2/gi,/Draw/gi,/P1/gi,/P2/gi], [game.team1_name, game.team2_name, showType==='home'?game.team1_name:1, showType==='home'?game.team2_name:2,'X', game.team1_name, game.team2_name])} ${data.hasOwnProperty('base') ? `(${data.base})` : ''}`}</Text>
        </View>
        <View style={{...viewStyles.eventPrice,display:'flex',position:'relative',justifyContent:'flex-end',flex:data.name==='Draw' &&showType==='home'? 4:1}}>
          <Text style={[{display: game.is_blocked ? 'none' : 'flex',fontWeight:'700',color:!game.is_blocked &&priceChanged &&data.initialPrice ? (data.initialPrice > data.price) ? '#f54f2e':(data.initialPrice < data.price) ? '#159e1c' : '#018da0' : '#018da0'},betSelections[market.id] && betSelections[market.id].eventId == data.id&&!priceChanged&&{color:'#fff'}]}>{oddConvert({
          main: {
            decimalFormatRemove3Digit: 0,
            notLockedOddMinValue: null,
            roundDecimalCoefficients: 3,
            showCustomNameForFractionalFormat: null,
            specialOddFormat: null,
            useLadderForFractionalFormat: 0
          }, env: { oddFormat: null }
        }, { mathCuttingFunction: () => { } })(data.price, oddType)}</Text>
           <CustomIcon name="lock" size={20} style={{ display: game.is_blocked ? 'flex' : 'none',color:'#dedee0' }}></CustomIcon>
           </View>
      </TouchableOpacity>
           {!game.is_blocked && priceChanged &&<CustomIcon name={data.initialPrice ? (data.initialPrice > data.price) ? 'decrease':(data.initialPrice < data.price) ? 'increase' : '' : ''} size={15} style={[{position:'absolute',margin:0,padding:0},data.initialPrice ? (data.initialPrice > data.price) ? viewStyles.coeficiente_change_down:(data.initialPrice < data.price) ? viewStyles.coeficiente_change_up : {} : {}]}></CustomIcon>}
        
      </View>
    )
  }
}