import React, {PureComponent} from 'react'
import {View,Text, TouchableOpacity} from 'react-native'
import {oddConvert, viewStyles} from '../../common'
import CustomIcon from '../customIcon';
export  default class LiveBtn extends PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        priceChanged:false
      };
      this.priceBtn = null;
      this.timeoutId= null
        this.eventData = { price: null, initialPrice: null }
    }
    componentWillUnmount() {
      clearTimeout(this.timeoutId)
    }
    componentDidUpdate() {
      const {e} =this.props
      if(e.initialPrice!==void 0){
        if (this.eventData.price !== e.price &&
          this.eventData.initialPrice !== e.initialPrice) {
            this.setState({priceChanged:!0})
          clearTimeout(this.timeoutId)
          this.timeoutId = setTimeout(function () {
            if (undefined !== this.priceBtn && null !== this.priceBtn) {
               this.setState({priceChanged:!1})
            }
          }.bind(this), 10000);
          this.eventData.price = e.price
          this.eventData.initialPrice = e.initialPrice
        }
      }
    }
    render() {
      const {
        props: { game, betSelections, e, eventMarket, addEventToSelection, oddType,competition,sport },state:{priceChanged}
      } = this
      let style=[viewStyles.sbGameBetBlockInner];
      betSelections[eventMarket.id] && betSelections[eventMarket.id].eventId == e.id && style.push(viewStyles.selectedEvent);
      game.is_blocked ===1 && style.push(viewStyles.blocked);
      return (
        <View ref={(el) => { this.priceBtn = el }} {...{ style:style }}>
         {!game.is_blocked &&  <TouchableOpacity onPress={() =>addEventToSelection(game, eventMarket, e,{competition:competition.name,sport:sport.alias})} activeOpacity={0.3} style={{flex:1,display:'flex',flexDirection:'row',justifyContent:'center',paddingHorizontal:0,paddingVertical:0,margin:0,padding:0,alignItems:'center'}}>
          <View style={viewStyles.sbGameBetCoeficiente}>
            <Text style={[{fontWeight:'bold',display: game.is_blocked ? 'none' : 'flex',color:!game.is_blocked &&priceChanged &&e.initialPrice ? (e.initialPrice > e.price) ? '#f54f2e':(e.initialPrice < e.price) ? '#159e1c' : '#018da0' : '#018da0'},betSelections[eventMarket.id] && betSelections[eventMarket.id].eventId == e.id&&!priceChanged&&{color:'#fff'}]}>{oddConvert({
                  main: {
                    decimalFormatRemove3Digit: 0,
                    notLockedOddMinValue: null,
                    roundDecimalCoefficients: 3,
                    showCustomNameForFractionalFormat: null,
                    specialOddFormat: null,
                    useLadderForFractionalFormat: 0
                  }, env: { oddFormat: null }
                }, { mathCuttingFunction: () => { } })(e.price, oddType)}
            </Text>
            </View>
            </TouchableOpacity>}
           <CustomIcon name="lock" size={20} style={{ display: game.is_blocked ? 'flex' : 'none',color:'#dedee0' }}></CustomIcon>
           {!game.is_blocked && priceChanged &&<CustomIcon name={e.initialPrice ? (e.initialPrice > e.price) ? 'decrease':(e.initialPrice < e.price) ? 'increase' : '' : ''} size={15} style={[{position:'absolute',margin:0,padding:0},e.initialPrice ? (e.initialPrice > e.price) ? viewStyles.coeficiente_change_down:(e.initialPrice < e.price) ? viewStyles.coeficiente_change_up : {} : {}]}></CustomIcon>}
        
        </View>
      )
    }
  }