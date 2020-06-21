import React,{PureComponent} from 'react'
import Competition from '../competition'
import {View,Text, TouchableNativeFeedback, LayoutAnimation, Image} from 'react-native'
import { viewStyles, gridStyles, flagPath } from '../../common';
import CustomIcon from '../customIcon';

export default class Region extends PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        opened: false,
        ignoreActiveRegion: false,
        hover: false
      };
      this.showCompetition = this.showCompetition.bind(this)
      this.toggleHover = this.toggleHover.bind(this)
    }
    showCompetition() {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
      this.setState(prevState => ({ opened: !prevState.opened,ignoreActiveRegion:true}))
    }
    toggleHover() {
      this.setState({ hover: !this.state.hover })
  
    }
    componentDidUpdate() {
      const {opened,ignoreActiveRegion}=this.state,{regIndex}=this.props
      if((!opened&&regIndex<3 && !ignoreActiveRegion) )
      this.setState(prevState => ({ opened: !prevState.opened }))
    }
  
    render() {
      const  { multiview, region, loadGames, gameSets, currentCompetition, sport, activeView, loadMarkets, competitionData, addEventToSelection, betSelections,
          activeGame, addToMultiViewGames, multiviewGames, oddType,regIndex,viewCompetition,addToSelectedCompetitions,allowMultiSelect,selectedCompetitions,navigatetoMarket }= this.props
        , { opened }= this.state
  
      let competition = region.competition, regionTotalGames = 0, competitionArr = [];
      for (let compete in competition) {
        if (null !== competition[compete]) {
          regionTotalGames += 1
          competitionArr.push(competition[compete])
        }
      }
      competitionArr.sort((a, b) => {
        if (a.order > b.order)
          return 1
        if (b.order > a.order)
          return -1
        return 0
      })

      return (
  
        regionTotalGames > 0 ?
          <View style={viewStyles.li}>
            <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()}  onPress={() => {this.props.scrollToIndex(regIndex); this.showCompetition() } }>
              <View style={[viewStyles.regionHeader, gridStyles.colsm12,!opened && {borderBottomColor:'#d5d5da',borderBottomWidth:1}, opened && viewStyles.select]}>
              <View style={[gridStyles.colsm10 ,viewStyles.regionText]}>
              <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',borderStyle:'solid',borderWidth:1,borderColor:'#d5d5da',backgroundColor:'#fff',width:27,height:27,borderRadius:13.5}}>
              <Image
                style={{width:26,height:26}}
                resizeMode="contain"
                source={flagPath[region.alias.replace(/\s/g, '-').replace(/'/g, '').toLowerCase()]}
              />
              </View>
              <View style={[gridStyles.colsm9,{textAlign: "center",
                alignItems: "center",
                justifyContent:'center',flexDirection:'row',paddingLeft:10}]}><Text style={[viewStyles.regionName,viewStyles.themeTextColor]}>{region.name} </Text></View>
            </View>
            <View style={[gridStyles.colsm3, viewStyles.regionText,{paddingRight:3,paddingLeft:3}]}>
              <View style={{flex:1,flexDirection:'row',alignItems:'center'}}><Text {...{ style: [gridStyles.colsm8,viewStyles.textShow,viewStyles.themeTextColor] }}>{regionTotalGames}</Text></View>
              <View style={{flex:1,flexDirection:'row',alignItems:'center'}}><CustomIcon name={opened ? 'arrow-up' : "arrow-down"} {...{ style: [gridStyles.colsm12] }} {...viewStyles.themeTextColor}/></View>
            </View>
            </View>
            </TouchableNativeFeedback>
           {((opened)) &&
              <View style={viewStyles.regionCompetition}>
               <View style={viewStyles.competitionList}>
                  <View>{
                    competitionArr.map((competition, competeID) => {
                      return (
                        <Competition navigatetoMarket={navigatetoMarket} selectedCompetitions={selectedCompetitions} allowMultiSelect={allowMultiSelect} addToSelectedCompetitions={addToSelectedCompetitions} viewCompetition={viewCompetition} key={competeID} multiview={multiview} loadMarkets={loadMarkets} region={{ id: region.id, name: region.name, alias: region.alias }} sport={{ id: sport.id, name: sport.name, alias: sport.alias }} activeView={activeView}
                          currentCompetition={currentCompetition} activeGame={activeGame} gameSets={gameSets} competitionData={competitionData} competition={competition} key={competition.id} loadGames={loadGames}
                          addEventToSelection={addEventToSelection} betSelections={betSelections} addToMultiViewGames={addToMultiViewGames} multiviewGames={multiviewGames} oddType={oddType}/>
                      )
                    })
                  }</View>
                </View>
              </View>
          }
          </View>
          : null
  
      )
  
    }
  }