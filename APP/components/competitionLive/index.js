import React,{useState,useEffect} from 'react'
import {View,Text,TouchableNativeFeedback, LayoutAnimation, Image} from 'react-native'
import Competition from '../competition'
import { viewStyles, gridStyles,flagPath } from '../../common';
import { stringReplacer } from '../../common';
import CustomIcon from '../customIcon';

export const CompetitionLive=(pProps)=>{
    const [opened,isOpen] = useState(pProps.cIndex < 4? true:false), [ignoreActiveRegion, ignoreRegion] = useState(pProps.cIndex <4?true:false),[hover, setHover] = useState(false);
      useEffect(()=>{if(pProps.competitionRegion.id === pProps.region.id  && !ignoreActiveRegion && !opened){isOpen(!opened)}},[pProps.competitionRegion])
      let  eventsName = []
      for(let game in pProps.cProps.competition.game){
        if(pProps.cProps.competition.game[game] &&pProps.cProps.competition.game[game].hasOwnProperty('market')){
          if (Object.keys(pProps.cProps.competition.game[game].market).length > 0) {
            if(pProps.cProps.competition.game[game].market[Object.keys(pProps.cProps.competition.game[game].market)[0]]!==null){
             for (const ev in pProps.cProps.competition.game[game].market[Object.keys(pProps.cProps.competition.game[game].market)[0]].event) {
   
               eventsName.push(pProps.cProps.competition.game[game].market[Object.keys(pProps.cProps.competition.game[game].market)[0]].event[ev])
             }
             break
            }
           }
        }
      }
      
      eventsName.sort((a, b) => {
        if(null !== a && null!== b){if (a.order > b.order)
          return 1
        if (b.order > a.order)
          return -1}
        return 0
      })
    return(
      <View style={viewStyles.li}>
        <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} onPress={() => {LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);pProps.scrollToIndex(pProps.cIndex);isOpen(!opened);ignoreRegion(!ignoreActiveRegion);}} >
        <View style={[viewStyles.regionHeader,{height:50,backgroundColor: "#ededf2"},!opened && {borderBottomColor:'#d5d5da',borderBottomWidth:1}]}>
        <View style={[gridStyles.colsm6 ,viewStyles.regionText]}>
          <View {...{ style:[ viewStyles.totalGamesText,gridStyles.colsm1] }}>
            <CustomIcon name={ (ignoreActiveRegion && opened) ? 'arrow-up' : "arrow-down"} size={12} {...{ style: [gridStyles.colsm12,viewStyles.addToFavorite,{fontSize:15}] }} {...viewStyles.themeTextColor}/>
          </View>
          <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',borderStyle:'solid',borderWidth:1,borderColor:'#d5d5da',backgroundColor:'#fff',width:27,height:27,borderRadius:13.5}}>
          <Image
           style={{width:26,height:26}}
           resizeMode="contain"
            source={flagPath[pProps.region.alias.replace(/\s/g, '-').replace(/'/g, '').toLowerCase()]}
              />
          </View>
          <View style={[gridStyles.colsm9,{textAlign: "center",
        alignItems: "center",
        justifyContent:'center',flexDirection:'row'}]}><Text numberOfLines={1} ellipsizeMode='tail' style={[viewStyles.regionName,{padding:5,opacity:1},viewStyles.themeTextColor]}>{pProps.cProps.competition.name} </Text></View>
          </View>
          <View style={[viewStyles.eventsLive, gridStyles.colsm6]}>
          {eventsName.map((en, enk) => {
            return (
              <View key={enk} style={viewStyles.eventsSpan}><Text style={viewStyles.themeTextColor}>{stringReplacer(null!==en?en.type:'', [/P/g], [''])}</Text></View>
            )
          })}

        </View>
        </View>
        </TouchableNativeFeedback>
           {
          ((!ignoreActiveRegion && pProps.competitionRegion.id == pProps.region.id) ||(ignoreActiveRegion && opened)) && <View style={viewStyles.regionCompetition}>
         <View  style={viewStyles.competitionList}>
             <Competition {...pProps.cProps} navigatetoMarket={pProps.navigatetoMarket} eventTypeLen={eventsName}/>     
          </View>
           </View>
           }
      </View>
    )
}