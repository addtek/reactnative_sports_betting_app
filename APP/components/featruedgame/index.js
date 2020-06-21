import React, {PureComponent} from 'react'
import Carousel from 'react-native-snap-carousel';
import {sortDateByStartTimeDesc,gridStyles,AlertPrompt, arrayBuffer, stringReplacer} from '../../common'
import {PagingDotsCustom} from '../stateless';
import CustomIcon from '../customIcon'
import moment from 'moment-timezone';
// import EventPrice from './event';
import {StyleSheet,ImageBackground,View,Text,Dimensions, TouchableNativeFeedback} from 'react-native';
import EventPrice from './event';

let {width,height}= Dimensions.get('window')
export default class FeaturedGames extends PureComponent{
   constructor(props){
     super(props)
     this.bannerRef = React.createRef()
     this.options = {
      slidesToShow: 1,
      autoplay: true,
      transitionMode:"scroll",
      autoplayInterval:8000,
      pauseOnHover:true,
      wrapAround:true
  }
  this.showGame= this.showGame.bind(this)
   }
    showGame({sport,region,competition,game}){
      this.props.navigatetoMarket({sport:sport,region:region,competition:competition,game:game})
    }
__renderItem({item}){
  item = item[0]
  let gameEvnt = item.event;
  const {betSelections,oddType,addEventToSelection} = this.props
  gameEvnt.sort((a,b)=>{
    if(a.order > b.order)
    return 1
    if(a.order< b.order)
    return -1
    return 0
  })
    return (
      
      <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} onPress={()=>this.showGame(item)}>
      <View  style={{...styles.featuredItem}} >
       <View style={{...styles.competitionLogo,...gridStyles.colsm4}}>
        <ImageBackground source={{uri:`https://statistics.bcapps.org/images/c/b/0/${item.competition.id}.png`}} imageStyle={{resizeMode:'contain'}} style={styles.logo}></ImageBackground>
        <Text style={{...styles.dateTime,...gridStyles.colsm11}}>{moment.unix(item.game.start_ts).format('MMM D YYYY H:mm')}</Text>
      </View>
      <View style={{...styles.competitionGame,...gridStyles.colsm11}}>
        <View style={{...styles.gameDetails}}>
          <View style={{...styles.team}}>
            <View style={{...styles.flagName,...gridStyles.colsm6}}>
              <ImageBackground imageStyle={{resizeMode:'contain'}} style={{...styles.teamLogo,...gridStyles.colsm2}} source={{uri:`https://statistics.bcapps.org/images/e/s/0/${item.game.team1_id}.png`}}></ImageBackground>
              <Text style={{...styles.teamName,...gridStyles.colsm10}}>{item.game.team1_name}</Text>
            </View>
            {gameEvnt.length>0 && <EventPrice evnt={gameEvnt[0]} evtmarket={item.market} game={item.game} betSelections={betSelections} competition={item.competition} sport={item.sport} oddType={oddType} addEventToSelection={addEventToSelection}/>}
          </View>
          <View style={{...styles.team}}>
          <View style={{...styles.flagName,...gridStyles.colsm6}}>
              <ImageBackground imageStyle={{resizeMode:'contain'}} style={{...styles.teamLogo,...gridStyles.colsm2}} source={{uri:`https://statistics.bcapps.org/images/e/s/0/${item.game.team2_id}.png`}}></ImageBackground>
              <Text style={{...styles.teamName,...gridStyles.colsm10}}>{item.game.team2_name}</Text>
            </View>
            {gameEvnt.length>0&&<EventPrice evnt={gameEvnt[1]} evtmarket={item.market} game={item.game} betSelections={betSelections} competition={item.competition} sport={item.sport} oddType={oddType} addEventToSelection={addEventToSelection}/>}
          </View>
        </View>
        <View style={styles.action}>
          <View style={styles.btn}><Text style={{color:'#fff',textTransform: 'uppercase',}}>Bet Now</Text></View>
          <View style={{display:'flex',flexDirection:'row',alignItems:'center',flex:1,paddingLeft:35,paddingRight:20}}><CustomIcon name={stringReplacer(item.sport.alias, [/\s/g, /\d.+?\d/g, /\(.+?\)/g], ['', '', ''])} size={20} style={{color:'#fff'}}/></View>
        </View>
      </View>
    </View>
    </TouchableNativeFeedback>

    )
}
 render (){
  const { data,addEventToSelection={addEventToSelection} } = this.props
  let reg = [], compete = [], game = []
  data.map((sport, sID) => { 
    Object.keys(sport.region).forEach((reg) => {
      //  reg.push({name:sport.region[reg].name,alias:sport.region[reg].alias,id:sport.region[reg].id,order:sport.region[reg].order})
      var thisRegion = sport.region[reg]
      Object.keys(thisRegion.competition).forEach((c) => {
      
        if(thisRegion.competition[c].game) 
       
        Object.keys(thisRegion.competition[c].game).forEach((g)=>{
          let market = thisRegion.competition[c].game[g].market[Object.keys(thisRegion.competition[c].game[g].market)[0]],event= market.event,newEvent=[]
          Object.keys(event).forEach((ev,id)=>{
            if(event[ev].name === 'W1' || event[ev].name === 'W2') newEvent.push(event[ev])
          })
          compete.push({competition: { name: thisRegion.competition[c].name, id: thisRegion.competition[c].id, order: thisRegion.competition[c].favorite_order ? thisRegion.competition[c].favorite_order : thisRegion.competition[c].order }
          ,region : { ...thisRegion },sport :{ name: sport.name, alias: sport.alias, id: sport.id },game:{ ...thisRegion.competition[c].game[g] },market:{id:market.id,name:market.name,type:market.type},event:newEvent})
            
          })
      })
    })})
   game= arrayBuffer(compete,1).map((group, sID) => {
      group.sort((a,b)=>sortDateByStartTimeDesc(a,b))
      return group
    }
       
      )
    compete.sort((a,b)=>sortDateByStartTimeDesc(a,b))
    return(
    <ImageBackground source={require('../../images/FEATURED-GAMES.jpg')} style={styles.featuredGroupContainer}>
    <Carousel ref={this.bannerRef} 
      data={game}
      renderItem={this.__renderItem.bind(this)}
      sliderWidth={width}
      itemWidth={width}
      loop={true}
      autoplay={true}
      autoplayDelay={3000}
      autoplayInterval={7000}
      layout={'default'}
      firstItem={0}
    />
    </ImageBackground>
    )
   }
   
 }
 const styles = StyleSheet.create({
  featuredGroupContainer: {
    width: '100%',
    flexDirection:'row',
    justifyContent: 'center',
    minHeight: 100,
  },
  featuredItem:{
    width:'100%',
    padding: 5,
    flexDirection:'row',
    backgroundColor: '#0000008e'
  },
  competitionLogo :{
    backgroundColor: '#fffeffb9',
    marginRight: 10,
    padding:10,
    flex:1
  },
  competitionGame: {
    flex:1,
    flexGrow:1,
    display:'flex',
    justifyContent:'space-around'
  },
  teamLogo: {
    width: '100%',
    position: 'relative',
    color: '#fff',
    height: 20,
    display: 'flex',
  },
  logo: {
    width: '100%',
    color: '#c1c1c1',
    textAlign: 'center',
    flex:1,
  },
  gameDetails: {
    flex:3,

  },
  team:{
    flex:1,
    width:'100%',
    height:40,
    display:'flex',
    flexDirection:'row'
  },
  dateTime :{
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  flagName: {
    display: 'flex',
    flexDirection:'row',
    marginTop:5,
  },
  teamName:{
    flex:2,
    // paddingLeft: 10,
    fontSize: 12,
    fontWeight: '600',
    color: '#fffeee',
    overflow: 'hidden',
    // flexShrink: 1,
  },
  action: {
    display:'flex',
    flexDirection:'row',
  },
  btn: {
    backgroundColor: '#11c9e3',
    padding: 2,
    alignItems:'center',
    borderTopLeftRadius:10,
    fontSize: 12,
    flex:1
  }
 })