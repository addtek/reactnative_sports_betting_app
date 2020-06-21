import React,{PureComponent} from 'react'
import CompetitionEventGame from '../competitionEventGame'
import { View,Text,TouchableNativeFeedback,LayoutAnimation, Platform, UIManager} from 'react-native';
import { viewStyles } from '../../common';
import { CheckBox } from 'native-base';
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}
export default class Competition extends PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        isSelected: false,
        checked:false
      };
      this.selectCompetition = this.selectCompetition.bind(this)
      this.openGameToView = this.openGameToView.bind(this)
    }
  
    selectCompetition() {
      this.setState(prevState => ({ isSelected: !prevState.isSelected }))
    }
    setChecked(competition) {
      this.props.addToSelectedCompetitions(competition)
      this.setState(prevState => ({ checked: !prevState.checked }))
    }
    openGameToView(competition,region,sport,game=null){
      let state = {sport:sport,region:region,competition:competition}
      game!==null && (state.game=game)
      this.props.history.push(`/sports/${this.props.activeView.toLowerCase()}/${sport.alias}/${region.name}/${competition.id}${null!==game?'/'+game.id:''}`,state)
    }
    render() {
      const{ multiview, competition, viewCompetition, gameSets, region, sport, currentCompetition, activeView, loadMarkets, addEventToSelection, betSelections, activeGame,
          addToMultiViewGames, multiviewGames, oddType ,allowMultiSelect,selectedCompetitions,navigatetoMarket
      } = this.props

      return (
        activeView !== "Live" ?
        <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} onPress={() =>allowMultiSelect?this.setChecked(competition.id): viewCompetition('c',[competition.id])} >
          <View style={[viewStyles.competitionBlock]}>
            <View style={[viewStyles.header, viewStyles.matchLeague,{borderBottomWidth:1,borderBottomColor:'#d5d5da',height:50,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}]}>
            {allowMultiSelect &&<CheckBox
             checked={selectedCompetitions.includes(competition.id)}
             color={'#026775'}
             onPress={()=>this.setChecked(competition.id)}
            />}
              <Text numberOfLines={1} ellipsizeMode='tail' style={[viewStyles.matchLeagueTitleText,viewStyles.themeTextColor]}>{competition.name}</Text>
            </View>
          </View>
        </TouchableNativeFeedback>
          :
            <View style={[viewStyles.competitionBlock]}>
              {activeView!=="Live" &&<View style={[viewStyles.header, viewStyles.matchLeague]}><Text numberOfLines={1} ellipsizeMode='tail' style={[viewStyles.matchLeagueTitleText,viewStyles.themeTextColor]}>{competition.name}</Text></View>}
              <View style={{display:'flex',flex:1}}>
                <CompetitionEventGame navigatetoMarket={navigatetoMarket} eventTypeLen={this.props.eventTypeLen} multiview={multiview} activeGame={activeGame} games={competition.game} gameSets={gameSets} loadMarkets={this.openGameToView} sport={sport} region={region} competition={competition}
                  addEventToSelection={addEventToSelection} betSelections={betSelections} addToMultiViewGames={addToMultiViewGames} multiviewGames={multiviewGames} oddType={oddType}activeView={activeView} />
              </View>
            </View>
      )
    }
  } 