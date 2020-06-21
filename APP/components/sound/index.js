import React from 'react'
import {stringReplacer,EventIDToNameMap} from '../../common'
export default class LiveEventSound extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      const {
        props
      } = this
      let alias = stringReplacer(props.alias, [/\s/g, /'/g, /\d.+?\d/g, /\(.+?\)/g], ['', '', '', '']).toLowerCase(),
        eventName = stringReplacer(EventIDToNameMap[props.type_id], [/\s/g], [''])
      return (
  
        <audio style={{ display: 'none' }} autoPlay>
          <source src={`/assets/addon/audio/${alias}/${eventName}.mp3`} type="audio/mpeg" />
          <source src={`/assets/addon/audio/${alias}/${eventName}.wav`} type="audio/wav" />
          <source src={`/assets/addon/audio/${alias}/${eventName}.ogg`} type="audio/ogg" />
          Your browser does not support the audio element.
        </audio>
  
      )
    }
  }