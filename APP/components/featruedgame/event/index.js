import React from 'react'
import {oddConvert,gridStyles} from '../../../common'
import { View, Text, StyleSheet } from 'react-native'
import CustomIcon from '../../customIcon'
export default class EventPrice extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
  
      }
      this.timeoutId = null
      this.priceBtn = null
      this.eventData = { price: null, initialPrice: null }
    }
    componentDidMount() {
      if (this.eventData.price !== this.props.evnt.price &&
        this.eventData.initialPrice !== this.props.evnt.initialPrice) {
        clearTimeout(this.timeoutId)
        this.timeoutId = setTimeout(function () {
          if (undefined !== this.priceBtn && null !== this.priceBtn) {
            // this.priceBtn.classList.remove('coeficiente-change-up');
            // this.priceBtn.classList.remove('coeficiente-change-down');
          }
        }.bind(this), 10000);
        this.eventData.price = this.props.evnt.price
        this.eventData.initialPrice = this.props.evnt.initialPrice
      }
    }
    selectEvent(is_blocked,game, evtmarket, evnt,c,s){
      if(!is_blocked)
      this.props.addEventToSelection(game, evtmarket, evnt,{competition:c.name,sport:s.alias})
    }
    componentDidUpdate() {
      if (this.eventData.price !== this.props.evnt.price &&
        this.eventData.initialPrice !== this.props.evnt.initialPrice) {
        clearTimeout(this.timeoutId)
        this.timeoutId = setTimeout(function () {
          if (undefined !== this.priceBtn && null !== this.priceBtn) {
            // this.priceBtn.classList.remove('coeficiente-change-up');
            // this.priceBtn.classList.remove('coeficiente-change-down');
          }
        }.bind(this), 10000);
        this.eventData.price = this.props.evnt.price
        this.eventData.initialPrice = this.props.evnt.initialPrice
      }
    }
    componentWillUnmount(){
      clearTimeout(this.timeoutId)
    }
    render() {
      // onClick={(e) =>  {e.stopPropagation();this.selectEvent(game.is_blocked,game, evtmarket, evnt,competition,sport)}  }
      const { evnt, game, evtmarket, betSelections, oddType,competition,sport }= this.props
      return (
        <View ref={(el) => { this.priceBtn = el }} style={{...styles.event,...gridStyles.colsm4}} className={`event ${evnt.name.toLowerCase()} ${betSelections[game.id] && betSelections[game.id].eventId == evnt.id ? 'selected-event' : ''} ${evnt.initialPrice ? (evnt.initialPrice > evnt.price) ? 'coeficiente-change-down' : (evnt.initialPrice < evnt.price) ? 'coeficiente-change-up' : '' : ''}`}>
          <Text className={`price`} style={{color:'#fff'}} data-event={evnt.id}>{oddConvert({
            main: {
              decimalFormatRemove3Digit: 0,
              notLockedOddMinValue: null,
              roundDecimalCoefficients: 3,
              showCustomNameForFractionalFormat: null,
              specialOddFormat: null,
              useLadderForFractionalFormat: 0
            }, env: { oddFormat: null }
          }, { mathCuttingFunction: () => { } })(evnt.price, oddType)}</Text>
          <CustomIcon name="lock" size={20} style={{ display: game.is_blocked ? 'flex' : 'none',...styles.blockedIcon }}/>
        </View>
      )
    }
  }

  const styles= StyleSheet.create({
    event :{
      color: '#fffeee',
      fontSize: 14,
      fontWeight: '700',
      paddingLeft: 10,
      maxWidth: '33.33333%',
      flex:1,
      alignSelf:'flex-start'
    },
    blockedIcon :{
      paddingTop: 10,
      /* position: absolute; */
      // top: 0,
      zIndex: 2,
      width: 20,
      height: '100%',
      opacity: 0.5,
      textAlign: 'center',
      justifyContent: 'center',
      alignItems: 'center'
    }
  })