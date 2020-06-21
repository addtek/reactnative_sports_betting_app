import React,{PureComponent} from 'react'
import {
    stringReplacer,
    convertSetName,
  
  } from '../../common'
import CustomIcon from '../../components/customIcon';
import { View, Text, StyleSheet } from 'react-native'
const statsBannerStyles=StyleSheet.create({
    hidden:{display:'none'},
    teamsStatsContainer:{
        width:'100%',
        flexDirection:'row',
        alignItems:'center',
        // paddingLeft:5,
        // paddingRight:5
    },
    teamsStatsContainerChild:{
       paddingTop:10,
       paddingBottom:10,
       paddingLeft:5,
       paddingRight:5,
       justifyContent:'center',
       alignItems:'center',
       flexDirection:'row'
    },
    column:{
       flex:1,
       flexGrow:1
    },
    activeTeam:{
        padding:5, borderRadius: 8,margin:4.7
    },
    teamColor:{
        borderLeftWidth: 4, height: '100%' 
    }
})
export class StatsBannerSoccer extends PureComponent {

    render() {
        const {
            props: { activeGame, activeSport, loadMarket }
        } = this
        return (
            <View style={statsBannerStyles.teamsStatsContainer}>
                <View style={statsBannerStyles.column,{flex:4}}>
                    <View style={[statsBannerStyles.teamsStatsContainerChild,{justifyContent:'flex-start'},{backgroundColor:'#018da0'}]}><Text style={{color:"#fff"}}>Teams</Text></View>
                    <View style={[statsBannerStyles.teamsStatsContainerChild,{justifyContent:'flex-start'}]}>
                        <CustomIcon
                            name="shirt"
                            size={18}
                            color={
                                activeGame
                                    ? activeGame.info.shirt1_color !== '000000'
                                        ? '#' + activeGame.info.shirt1_color
                                        : 'rgb(59, 189, 189)'
                                    : ''
                            } />
                        <View style={{marginLeft:5}}><Text ellipsizeMode="tail" numberOfLines={1} style={{maxWidth:'100%'}}>{activeGame.team1_name}</Text></View>
                    </View>
                    <View style={[statsBannerStyles.teamsStatsContainerChild,{justifyContent:'flex-start'}]}>
                        <CustomIcon
                            name="shirt"
                            size={18}
                            color={
                                activeGame
                                    ? activeGame.info.shirt2_color !== '000000'
                                        ? '#' + activeGame.info.shirt2_color
                                        : 'rgb(165, 28, 210)'
                                    : ''
                            } />
                        <View style={{marginLeft:5}}><Text ellipsizeMode="tail" numberOfLines={1} style={{maxWidth:'100%'}}>{activeGame.team2_name}</Text></View>
                    </View>
                </View>
                {/* <View style={statsBannerStyles.column}>
                    <View style={[statsBannerStyles.teamsStatsContainerChild,{backgroundColor:'#018da0'}]}>
                        <CustomIcon
                            name="corner"
                            color='#fff'
                            style={{
                                borderRadius: 4,
                                fontSize: 19,
                            }} />
                    </View>
                    <View style={statsBannerStyles.teamsStatsContainerChild}><Text>{activeGame.stats.corner?activeGame.stats.corner.team1_value:0}</Text></View>
                    <View style={statsBannerStyles.teamsStatsContainerChild}><Text>{activeGame.stats.corner?activeGame.stats.corner.team2_value:0}</Text></View>
                </View>
                <View style={statsBannerStyles.column}>
                    <View style={[statsBannerStyles.teamsStatsContainerChild,{backgroundColor:'#018da0'}]}>
                        <CustomIcon
                        name="card"
                        color='rgb(217, 171, 31)'
                        style={{
                            borderRadius: 4,
                            fontSize: 19,
                        }} />
                    </View>
                    <View style={statsBannerStyles.teamsStatsContainerChild}><Text>{activeGame.stats.yellow_card?activeGame.stats.yellow_card.team1_value:0}</Text></View>
                    <View style={statsBannerStyles.teamsStatsContainerChild}><Text>{activeGame.stats.yellow_card?activeGame.stats.yellow_card.team2_value:0}</Text></View>
                </View>
                <View style={statsBannerStyles.column}>
                    <View style={[statsBannerStyles.teamsStatsContainerChild,{backgroundColor:'#018da0'}]}>
                        <CustomIcon
                            name="card"
                            color="red"
                            style={{
                                borderRadius: 4,
                                fontSize: 19,
                            }} />
                    </View>
                    <View style={statsBannerStyles.teamsStatsContainerChild}><Text>{activeGame.stats.red_card?activeGame.stats.red_card.team1_value:0}</Text></View>
                    <View style={statsBannerStyles.teamsStatsContainerChild}><Text>{activeGame.stats.red_card?activeGame.stats.red_card.team2_value:0}</Text></View>
                </View>
                <View>
                    <View style={[statsBannerStyles.teamsStatsContainerChild,{backgroundColor:'#018da0'}]}>
                        <CustomIcon
                            name="penalty"
                            color="#fff"
                            style={{
                                borderRadius: 4,
                                fontSize: 19,
                            }} />
                    </View>
                    <View style={statsBannerStyles.teamsStatsContainerChild}><Text>{activeGame.stats.penalty?activeGame.stats.penalty.team1_value:0}</Text></View>
                    <View style={statsBannerStyles.teamsStatsContainerChild}><Text>{activeGame.stats.penalty?activeGame.stats.penalty.team2_value:0}</Text></View>
                </View> */}
                {activeGame.stats.score_set1&&<View style={statsBannerStyles.column}>
                    <View style={[statsBannerStyles.teamsStatsContainerChild,{backgroundColor:'#018da0'}]}><Text style={{color:"#fff"}}>1</Text></View>
                    <View style={statsBannerStyles.teamsStatsContainerChild}><Text>{activeGame.stats.score_set1.team1_value}</Text></View>
                    <View style={statsBannerStyles.teamsStatsContainerChild}><Text>{activeGame.stats.score_set1.team2_value}</Text></View>
                </View>}
                {activeGame.stats.score_set2&&<View style={statsBannerStyles.column}>
                    <View style={[statsBannerStyles.teamsStatsContainerChild,{backgroundColor:'#018da0'}]}><Text style={{color:"#fff"}}>2</Text></View>
                    <View style={statsBannerStyles.teamsStatsContainerChild}><Text>{activeGame.stats.score_set2.team1_value}</Text></View>
                    <View style={statsBannerStyles.teamsStatsContainerChild}><Text>{activeGame.stats.score_set2.team2_value}</Text></View>
                </View>}
                <View style={statsBannerStyles.column}>
                    <View style={[statsBannerStyles.teamsStatsContainerChild,{backgroundColor:'#018da0'}]}><Text style={{color:"#fff"}}>Score</Text></View>
                    <View style={statsBannerStyles.teamsStatsContainerChild}><Text>{activeGame.info.score1}</Text></View>
                    <View style={statsBannerStyles.teamsStatsContainerChild}><Text>{activeGame.info.score2}</Text></View>
                </View>

            </View>
        )
    }
}
export class StatsBannerTennis extends PureComponent {
    render() {
        const {
            props: { activeGame, activeSport, loadMarket }
        } = this
        return (
            <View style={statsBannerStyles.teamsStatsContainer}>
                <View style={statsBannerStyles.column,{flex:4}}>
                    <View style={[statsBannerStyles.teamsStatsContainerChild,{backgroundColor:'#018da0'},{justifyContent:'flex-start'}]}><Text style={{color:"#fff"}}>Teams</Text></View>
                    <View style={[statsBannerStyles.teamsStatsContainerChild,{justifyContent:'flex-start'}]}>
                        <CustomIcon
                            name="shirt"
                            size={18}
                            color={
                                activeGame
                                    ? activeGame.info.shirt1_color !== '000000'
                                        ? '#' + activeGame.info.shirt1_color
                                        : 'rgb(59, 189, 189)'
                                    : ''
                            } />
                        <View style={{marginLeft:5}}><Text ellipsizeMode="tail" numberOfLines={1} style={{maxWidth:'100%'}}>{activeGame.team1_name}</Text></View>
                    </View>
                    <View style={[statsBannerStyles.teamsStatsContainerChild,{justifyContent:'flex-start'}]}>
                        <CustomIcon
                            name="shirt"
                            size={18}
                            color={
                                activeGame
                                    ? activeGame.info.shirt2_color !== '000000'
                                        ? '#' + activeGame.info.shirt2_color
                                        : 'rgb(165, 28, 210)'
                                    : ''
                            } />
                        <View style={{marginLeft:5}}><Text ellipsizeMode="tail" numberOfLines={1} style={{maxWidth:'100%'}}>{activeGame.team2_name}</Text></View>
                    </View>
                </View>
                {activeGame.stats.score_set1&&<View style={statsBannerStyles.column}>
                    <View style={[statsBannerStyles.teamsStatsContainerChild,{backgroundColor:'#018da0'}]}><Text style={{color:"#fff"}}>1</Text></View>
                    <View style={statsBannerStyles.teamsStatsContainerChild}><Text>{activeGame.stats.score_set1.team1_value}</Text></View>
                    <View style={statsBannerStyles.teamsStatsContainerChild}><Text>{activeGame.stats.score_set1.team2_value}</Text></View>
                </View>}
                {activeGame.stats.score_set2&&<View style={statsBannerStyles.column}>
                    <View style={[statsBannerStyles.teamsStatsContainerChild,{backgroundColor:'#018da0'}]}><Text style={{color:"#fff"}}>2</Text></View>
                    <View style={statsBannerStyles.teamsStatsContainerChild}><Text>{activeGame.stats.score_set2.team1_value}</Text></View>
                    <View style={statsBannerStyles.teamsStatsContainerChild}><Text>{activeGame.stats.score_set2.team2_value}</Text></View>
                </View>}
                {activeGame.stats.score_set3 &&<View style={statsBannerStyles.column}>
                    <View style={[statsBannerStyles.teamsStatsContainerChild,{backgroundColor:'#018da0'}]}><Text style={{color:"#fff"}}>3</Text></View>
                    <View style={statsBannerStyles.teamsStatsContainerChild}><Text>{activeGame.stats.score_set3.team1_value}</Text></View>
                    <View style={statsBannerStyles.teamsStatsContainerChild}><Text>{activeGame.stats.score_set3.team2_value}</Text></View>
                </View>}
                {activeGame.stats.score_set4&&<View style={statsBannerStyles.column}>
                    <View style={[statsBannerStyles.teamsStatsContainerChild,{backgroundColor:'#018da0'}]}><Text style={{color:"#fff"}}>4</Text></View>
                    <View style={statsBannerStyles.teamsStatsContainerChild}><Text>{activeGame.stats.score_set4.team1_value}</Text></View>
                    <View style={statsBannerStyles.teamsStatsContainerChild}><Text>{activeGame.stats.score_set4.team2_value}</Text></View>
                </View>}
                <View style={statsBannerStyles.column}>
                    <View style={[statsBannerStyles.teamsStatsContainerChild,{backgroundColor:'#018da0'}]}><Text style={{color:"#fff"}}>Set</Text></View>
                    <View style={statsBannerStyles.teamsStatsContainerChild}><Text>{activeGame.info.score1 }</Text></View>
                    <View style={statsBannerStyles.teamsStatsContainerChild}><Text>{activeGame.info.score2}</Text></View>
                </View>
                <View style={statsBannerStyles.column}>
                    <View style={[statsBannerStyles.teamsStatsContainerChild,{backgroundColor:'#018da0'}]}><Text style={{color:"#fff"}}>Pts</Text></View>
                    <View style={statsBannerStyles.teamsStatsContainerChild}><Text>{activeGame.stats.passes.team1_value}</Text></View>
                    <View style={statsBannerStyles.teamsStatsContainerChild}><Text>{activeGame.stats.passes.team2_value}</Text></View>
                </View>
                <View style={statsBannerStyles.column}>
                    <View style={[statsBannerStyles.teamsStatsContainerChild,{backgroundColor:'#018da0'}]}><Text style={{color:"#fff"}}></Text></View>
                    <View style={[statsBannerStyles.teamsStatsContainerChild]}><View style={[statsBannerStyles.activeTeam,{ backgroundColor: activeGame ? activeGame.info.pass_team && activeGame.info.pass_team == 'team1' ? '#333' : '#e7e7e7' : '#e7e7e7' }]}></View></View>
                    <View style={[statsBannerStyles.teamsStatsContainerChild]}><View style={[statsBannerStyles.activeTeam,{ backgroundColor: activeGame ? activeGame.info.pass_team && activeGame.info.pass_team == 'team2' ? '#333' : '#e7e7e7' : '#e7e7e7' }]}></View></View>
                </View>
               
            </View>
        )
    }
}
export class StatsBannerBasketBall extends PureComponent {
    render() {
        const {
            props: { activeGame, activeSport, loadMarket }
        } = this
        let currentSet = activeGame && activeGame.info ? convertSetName()(activeGame.info.current_game_state, stringReplacer(activeSport.alias, [/\s/g], [''])) : ''
        return (
            <View style={statsBannerStyles.teamsStatsContainer}>
                <View style={statsBannerStyles.column,{flex:4}}>
                    <View style={[statsBannerStyles.teamsStatsContainerChild,{backgroundColor:'#018da0'},{justifyContent:'flex-start'}]}><Text style={{color:"#fff"}}>Teams</Text></View>
                    <View style={[statsBannerStyles.teamsStatsContainerChild,{justifyContent:'flex-start'}]}>
                        <CustomIcon
                            name="shirt"
                            size={18}
                            color={
                                activeGame
                                    ? activeGame.info.shirt1_color !== '000000'
                                        ? '#' + activeGame.info.shirt1_color
                                        : 'rgb(59, 189, 189)'
                                    : ''
                            } />
                        <View style={{marginLeft:5}}><Text ellipsizeMode="tail" numberOfLines={1} style={{maxWidth:'100%'}}>{activeGame.team1_name}</Text></View>
                    </View>
                    <View style={[statsBannerStyles.teamsStatsContainerChild,{justifyContent:'flex-start'}]}>
                        <CustomIcon
                            name="shirt"
                            size={18}
                            color={
                                activeGame
                                    ? activeGame.info.shirt2_color !== '000000'
                                        ? '#' + activeGame.info.shirt2_color
                                        : 'rgb(165, 28, 210)'
                                    : ''
                            } />
                        <View style={{marginLeft:5}}><Text ellipsizeMode="tail" numberOfLines={1} style={{maxWidth:'100%'}}>{activeGame.team2_name}</Text></View>
                    </View>
                </View>
                {activeGame.stats.score_set1&&<View style={statsBannerStyles.column}>
                    <View style={[statsBannerStyles.teamsStatsContainerChild,{backgroundColor:'#018da0'}]}><Text style={{color:"#fff"}}>1</Text></View>
                    <View style={statsBannerStyles.teamsStatsContainerChild}><Text>{activeGame.stats.score_set1.team1_value}</Text></View>
                    <View style={statsBannerStyles.teamsStatsContainerChild}><Text>{activeGame.stats.score_set1.team2_value}</Text></View>
                </View>}
                {activeGame.stats.score_set2&&<View style={statsBannerStyles.column}>
                    <View style={[statsBannerStyles.teamsStatsContainerChild,{backgroundColor:'#018da0'}]}><Text style={{color:"#fff"}}>2</Text></View>
                    <View style={statsBannerStyles.teamsStatsContainerChild}><Text>{activeGame.stats.score_set2.team1_value}</Text></View>
                    <View style={statsBannerStyles.teamsStatsContainerChild}><Text>{activeGame.stats.score_set2.team2_value}</Text></View>
                </View>}
                {activeGame.stats.score_set3 &&<View style={statsBannerStyles.column}>
                    <View style={[statsBannerStyles.teamsStatsContainerChild,{backgroundColor:'#018da0'}]}><Text style={{color:"#fff"}}>3</Text></View>
                    <View style={statsBannerStyles.teamsStatsContainerChild}><Text>{activeGame.stats.score_set3.team1_value}</Text></View>
                    <View style={statsBannerStyles.teamsStatsContainerChild}><Text>{activeGame.stats.score_set3.team2_value}</Text></View>
                </View>}
                {activeGame.stats.score_set4&&<View style={statsBannerStyles.column}>
                    <View style={[statsBannerStyles.teamsStatsContainerChild,{backgroundColor:'#018da0'}]}><Text style={{color:"#fff"}}>4</Text></View>
                    <View style={statsBannerStyles.teamsStatsContainerChild}><Text>{activeGame.stats.score_set4.team1_value}</Text></View>
                    <View style={statsBannerStyles.teamsStatsContainerChild}><Text>{activeGame.stats.score_set4.team2_value}</Text></View>
                </View>}
                <View style={statsBannerStyles.column}>
                    <View style={[statsBannerStyles.teamsStatsContainerChild,{backgroundColor:'#018da0'}]}><Text style={{color:"#fff",maxWidth:'100%'}} numberOfLines={1} ellipsizeMode="tail">{activeGame.stats.score_set4&&activeGame.stats.score_set3&&activeGame.stats.score_set2?'T':'Total'}</Text></View>
                    <View style={statsBannerStyles.teamsStatsContainerChild}><Text>{activeGame.info.score1 }</Text></View>
                    <View style={statsBannerStyles.teamsStatsContainerChild}><Text>{activeGame.info.score2}</Text></View>
                </View>
                <View style={statsBannerStyles.column}>
                    <View style={[statsBannerStyles.teamsStatsContainerChild,{backgroundColor:'#018da0'}]}><Text style={{color:"#fff"}}></Text></View>
                    <View style={[statsBannerStyles.teamsStatsContainerChild]}><View style={[statsBannerStyles.activeTeam,{ backgroundColor: activeGame ? activeGame.info.pass_team && activeGame.info.pass_team == 'team1' ? '#333' : '#e7e7e7' : '#e7e7e7' }]}></View></View>
                    <View style={[statsBannerStyles.teamsStatsContainerChild]}><View style={[statsBannerStyles.activeTeam,{ backgroundColor: activeGame ? activeGame.info.pass_team && activeGame.info.pass_team == 'team2' ? '#333' : '#e7e7e7' : '#e7e7e7' }]}></View></View>
                </View>
            </View>
        )
    }
}

export class StatsBannerGeneric extends PureComponent {
    render() {
        const {
            props: { activeGame, activeSport, loadMarket }
        } = this
        return (
            <View style={statsBannerStyles.teamsStatsContainer}>
                <View style={statsBannerStyles.column,{flex:4}}>
                    <View style={[statsBannerStyles.teamsStatsContainerChild,{backgroundColor:'#018da0'},{justifyContent:'flex-start'}]}><Text style={{color:"#fff"}}>{activeGame.info ? convertSetName()(activeGame.info.current_game_state, stringReplacer(activeSport.alias, [/\s/g], [''])) : null} {activeGame ? activeGame.info ? activeGame.info.current_game_time : null : null}</Text></View>
                    <View style={[statsBannerStyles.teamsStatsContainerChild,{justifyContent:'flex-start'}]}>
                        {activeGame.info&&activeGame.info.shirt1_color&&<CustomIcon
                            name="shirt"
                            size={18}
                            color={
                                activeGame.info.shirt1_color !== '000000'
                                        ? '#' + activeGame.info.shirt1_color
                                        : 'rgb(59, 189, 189)'
                            } />}
                        <View style={{marginLeft:5}}><Text ellipsizeMode="tail" numberOfLines={1} style={{maxWidth:'100%'}}>{activeGame.team1_name}</Text></View>
                    </View>
                    <View style={[statsBannerStyles.teamsStatsContainerChild,{justifyContent:'flex-start'}]}>
                        {activeGame.info&&activeGame.info.shirt2_color&&<CustomIcon
                            name="shirt"
                            size={18}
                            color={
                                activeGame.info.shirt2_color !== '000000'
                                        ? '#' + activeGame.info.shirt2_color
                                        : 'rgb(165, 28, 210)'
                            } />}
                        <View style={{marginLeft:5}}><Text ellipsizeMode="tail" numberOfLines={1} style={{maxWidth:'100%'}}>{activeGame.team2_name}</Text></View>
                    </View>
                </View>
                {activeGame.stats.score_set1&&<View style={statsBannerStyles.column}>
                    <View style={[statsBannerStyles.teamsStatsContainerChild,{backgroundColor:'#018da0'}]}><Text style={{color:"#fff"}}>1</Text></View>
                    <View style={statsBannerStyles.teamsStatsContainerChild}><Text>{activeGame.stats.score_set1.team1_value}</Text></View>
                    <View style={statsBannerStyles.teamsStatsContainerChild}><Text>{activeGame.stats.score_set1.team2_value}</Text></View>
                </View>}
                {activeGame.stats.score_set2&&<View style={statsBannerStyles.column}>
                    <View style={[statsBannerStyles.teamsStatsContainerChild,{backgroundColor:'#018da0'}]}><Text style={{color:"#fff"}}>2</Text></View>
                    <View style={statsBannerStyles.teamsStatsContainerChild}><Text>{activeGame.stats.score_set2.team1_value}</Text></View>
                    <View style={statsBannerStyles.teamsStatsContainerChild}><Text>{activeGame.stats.score_set2.team2_value}</Text></View>
                </View>}
                {activeGame.stats.score_set3 &&<View style={statsBannerStyles.column}>
                    <View style={[statsBannerStyles.teamsStatsContainerChild,{backgroundColor:'#018da0'}]}><Text style={{color:"#fff"}}>3</Text></View>
                    <View style={statsBannerStyles.teamsStatsContainerChild}><Text>{activeGame.stats.score_set3.team1_value}</Text></View>
                    <View style={statsBannerStyles.teamsStatsContainerChild}><Text>{activeGame.stats.score_set3.team2_value}</Text></View>
                </View>}
                {activeGame.stats.score_set4&&<View style={statsBannerStyles.column}>
                    <View style={[statsBannerStyles.teamsStatsContainerChild,{backgroundColor:'#018da0'}]}><Text style={{color:"#fff"}}>4</Text></View>
                    <View style={statsBannerStyles.teamsStatsContainerChild}><Text>{activeGame.stats.score_set4.team1_value}</Text></View>
                    <View style={statsBannerStyles.teamsStatsContainerChild}><Text>{activeGame.stats.score_set4.team2_value}</Text></View>
                </View>}
                <View style={statsBannerStyles.column}>
                    <View style={[statsBannerStyles.teamsStatsContainerChild,{backgroundColor:'#018da0'}]}><Text style={{color:"#fff"}}>Set</Text></View>
                    <View style={statsBannerStyles.teamsStatsContainerChild}><Text>{activeGame.info.score1 }</Text></View>
                    <View style={statsBannerStyles.teamsStatsContainerChild}><Text>{activeGame.info.score2}</Text></View>
                </View>
                <View style={statsBannerStyles.column}>
                    <View style={[statsBannerStyles.teamsStatsContainerChild,{backgroundColor:'#018da0'}]}><Text style={{color:"#fff"}}></Text></View>
                    <View style={[statsBannerStyles.teamsStatsContainerChild]}><View style={[statsBannerStyles.activeTeam,{ backgroundColor: activeGame ? activeGame.info.pass_team && activeGame.info.pass_team == 'team1' ? '#333' : '#e7e7e7' : '#e7e7e7' }]}></View></View>
                    <View style={[statsBannerStyles.teamsStatsContainerChild]}><View style={[statsBannerStyles.activeTeam,{ backgroundColor: activeGame ? activeGame.info.pass_team && activeGame.info.pass_team == 'team2' ? '#333' : '#e7e7e7' : '#e7e7e7' }]}></View></View>
                </View>
            </View>

        )
    }
}