import React from 'react'
import {oddConvert} from '../../common'
export default class GameEventBtn extends React.Component {
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
            this.priceBtn.classList.remove('coeficiente-change-up');
            this.priceBtn.classList.remove('coeficiente-change-down');
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
            this.priceBtn.classList.remove('coeficiente-change-up');
            this.priceBtn.classList.remove('coeficiente-change-down');
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
      const {
        props: { evnt, game, evtmarket, betSelections, oddType ,size,competition,sport}
      } = this
      return (
        <div ref={(el) => { this.priceBtn = el }} onClick={(e) =>  {e.stopPropagation();this.selectEvent(game.is_blocked,game, evtmarket, evnt,competition,sport)}  } className={`${size? size:''} ${evnt.name.toLowerCase()} ${betSelections[evtmarket.id] && betSelections[evtmarket.id].eventId == evnt.id ? 'selected-event' : ''} ${evnt.initialPrice ? (evnt.initialPrice > evnt.price) ? 'coeficiente-change-down' : (evnt.initialPrice < evnt.price) ? 'coeficiente-change-up' : '' : ''}`}>
         {!game.is_blocked && <span className={`price`} data-event={evnt.id}>{oddConvert({
            main: {
              decimalFormatRemove3Digit: 0,
              notLockedOddMinValue: null,
              roundDecimalCoefficients: 3,
              showCustomNameForFractionalFormat: null,
              specialOddFormat: null,
              useLadderForFractionalFormat: 0
            }, env: { oddFormat: null }
          }, { mathCuttingFunction: () => { } })(evnt.price, oddType)}</span>}
          <i className="blocked-icon" style={{ display: game.is_blocked ? 'flex' : 'none' }}></i>
        </div>
      )
    }
  }