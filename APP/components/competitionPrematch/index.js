import React,{useState,useEffect} from 'react'
import {View,Text, TouchableOpacity,Image} from 'react-native'
import Competition from '../competition'
import { viewStyles, gridStyles,flagPath } from '../../common';
import { stringReplacer } from '../../common';
import CustomIcon from '../customIcon';
export const CompetitionPrematch=(pProps)=>{
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
        if (a.order > b.order)
          return 1
        if (b.order > a.order)
          return -1
        return 0
      })
    return(
                <View style={viewStyles.li}>
                <TouchableOpacity {...{ style: [viewStyles.regionHeader, gridStyles.colsm12, ((!ignoreActiveRegion && competitionRegion.id === region.id) || (ignoreActiveRegion && opened)) && viewStyles.select], onPress: () => { this.showCompetition();this.props.scrollToIndex(regIndex) } }}>
                  <>
                  <View style={[gridStyles.colsm10 ,viewStyles.regionText]}>
                  <Image
                    style={{width:30,height:30}}
                    source={flagPath[pProps.region.alias.replace(/\s/g, '-').replace(/'/g, '').toLowerCase()]}
                  />
                  <View style={gridStyles.colsm10}><Text style={viewStyles.regionName}>{pProps.region.name} </Text></View>
                 <View> <Text {...{ style: viewStyles.totalGamesText }}></Text></View>
                </View>
                <View style={[gridStyles.colsm2, viewStyles.regionText]}>
                  <View><Text {...{ style: [gridStyles.colsm8,viewStyles.textShow] }}>{regionTotalGames}</Text></View>
                  <CustomIcon name={(!ignoreActiveRegion && pProps.competitionRegion.id === region.id) ? "arrow-up" : (ignoreActiveRegion && opened) ? 'arrow-up' : "arrow-down"} {...{ style: [gridStyles.colsm2] }}/>
                </View></>
                </TouchableOpacity>
               {((!ignoreActiveRegion && pProps.competitionRegion.id == pProps.region.id) ||(ignoreActiveRegion && opened)) &&
                  <View style={viewStyles.regionCompetition}>
                   <View style={viewStyles.competitionList}>
                      <View>{
                        competitionArr.map((competition, competeID) => {
                          return (
                            <Competition key={competeID} loadMarkets={loadMarkets} region={{ id: region.id, name: region.name, alias: region.alias }} sport={{ id: sport.id, name: sport.name, alias: sport.alias }} activeView={activeView}
                              currentCompetition={currentCompetition} activeGame={activeGame} gameSets={gameSets} competitionData={competitionData} competition={competition} key={competition.id} loadGames={loadGames}
                              addEventToSelection={addEventToSelection} betSelections={betSelections} oddType={oddType}/>
                          )
                        })
                      }</View>
                    </View>
                  </View>
              }
              </View>
    )
}