import React from 'react'
import {View, Text, FlatList} from 'react-native'
import { viewStyles, gridStyles } from '../../common'
import CustomIcon from '../customIcon'

export const SportListLoader = (props) => {

       return(
  <View style={viewStyles.li}>
    {props.isLive?<View style={[viewStyles.regionHeader,{height:50,backgroundColor: "#ededf2"},{borderBottomColor:'#d5d5da',borderBottomWidth:1},viewStyles.select]}>
    <View style={[gridStyles.colsm6 ,viewStyles.regionText]}>
      <View {...{ style:[ viewStyles.totalGamesText,gridStyles.colsm1] }}>
        <CustomIcon name={"arrow-up"} size={12} {...{ style: [gridStyles.colsm12,viewStyles.addToFavorite,{fontSize:15}] }} {...viewStyles.themeTextColor}/>
      </View>
      <View style={[{flexDirection:'row',alignItems:'center',borderStyle:'solid',borderWidth:1,borderColor:'#d5d5da',backgroundColor:'#fff',width:27,height:27,borderRadius:13.5}]}>
      </View>
      <View style={[gridStyles.colsm9,{textAlign: "center",
    alignItems: "center",
    justifyContent:'center',flexDirection:'row'}]}><View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View></View>
      </View>
      <View style={[viewStyles.eventsLive, gridStyles.colsm6]}>
      {[1,'X',2].map((en, enk) => {
        return (
          <View key={enk} style={viewStyles.eventsSpan}><Text style={viewStyles.themeTextColor}>{en}</Text></View>
        )
      })}

    </View>
    </View>:
     <View  style={[viewStyles.regionHeader, gridStyles.colsm12,{borderBottomColor:'#d5d5da',borderBottomWidth:1},viewStyles.select]}>
     <View style={[gridStyles.colsm10 ,viewStyles.regionText]}>
     <View style={[{flexDirection:'row',alignItems:'center',borderStyle:'solid',borderWidth:1,borderColor:'#d5d5da',backgroundColor:'#fff',width:27,height:27,borderRadius:13.5}]}>
     </View>
     <View style={[gridStyles.colsm9,{textAlign: "center",
       alignItems: "center",
       justifyContent:'center',flexDirection:'row',paddingLeft:10}]}><View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View></View>
   </View>
   <View style={[gridStyles.colsm3, viewStyles.regionText,{paddingRight:3,paddingLeft:3}]}>
     <View style={{flex:1,flexDirection:'row',alignItems:'center'}}><View style={[viewStyles.gLoading,viewStyles.gLoadingSmall]}></View></View>
     <View style={{flex:1,flexDirection:'row',alignItems:'center'}}><CustomIcon name={"arrow-up"} {...{ style: [gridStyles.colsm12] }} {...viewStyles.themeTextColor}/></View>
   </View>
   </View>}
  
    <View style={viewStyles.regionCompetition}>
     <View  style={viewStyles.competitionList}>
        {
          [1,2,].map((n,m)=>{
            return(
              
                !props.isLive?
                  props.index>2?<View  key={m} style={[viewStyles.competitionBlock,viewStyles.active]}>
                    <View style={[viewStyles.header, viewStyles.matchLeague,{borderBottomWidth:1,borderBottomColor:'#d5d5da',height:50,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}]}>
                    <View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View>
                    </View>
                  </View>:null
                  :
              <View key={m} style={[viewStyles.competitionBlock,viewStyles.select]}>
                <View style={{display:'flex',flex:1}}>
                <View style={viewStyles.sportlistCompetitionAccordion} >
               <View style={viewStyles.sbAccordionContainer}>
                 {
                   [1,2].map((game, index) => {
                     
                       return (
                           <View key={index} style={[viewStyles.sbAccordionItem]}>
                           
                             <View style={[gridStyles.colsm6,viewStyles.sbAccordionTitle,viewStyles.sbAccordionTitleMatchTitle]}>
                               <View style={[viewStyles.matchTitleText,{paddingTop:10}]}>
                                 <View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View>
                                 <View style={[viewStyles.gLoading,viewStyles.gLoadingSmall]}></View>
                               </View>
                               <View style={[viewStyles.matchTitleText,viewStyles.matchTitleTextx2,{paddingTop:10}]}>
                                 <View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View>
                                 <View style={[viewStyles.gLoading,viewStyles.gLoadingSmall]}></View>
                               </View>
                               <View style={[viewStyles.hiddenIcons,{marginTop:5}]}>
                                 <View style={[gridStyles.colsm10,{flexDirection:'row',marginTop:5}]}>
                                   <View style={{paddingLeft:4}}><View style={[viewStyles.gLoading,viewStyles.gLoadingMedium]}></View></View>
                                 </View>
                                   <CustomIcon name="star-outline" size={12} style={[gridStyles.colsm2,viewStyles.addToFavorite]}{...viewStyles.themeTextColor}/> 
                               </View>
                               
                             </View>
                             {<View style={[gridStyles.colsm6, viewStyles.sbAccordionContent, viewStyles.matchContent]}>
                                 <View style={viewStyles.sbAccordionContentMatchContentInner}>
                                   <View style={[viewStyles.sbGameBetBlockWrapper, gridStyles.colsm12]}>
                                     <View style={viewStyles.sbGameBetBlock}>
                                       {
                                       
                                         [1,2,3].map((e,i)=>{
                                           return(
                                             <View key={i} style={viewStyles.sbGameBetBlockInner}><View style={{flex:1,display:'flex',justifyContent:'center',flexDirection:'row',paddingHorizontal:0,paddingVertical:0,margin:0,padding:0,alignItems:'center'}}><View style={viewStyles.sbGameBetCoeficiente}><View style={[viewStyles.gLoading,viewStyles.gLoadingSmall]}></View></View></View></View>
                                           )
                                         })
                                       }
                                     </View>
                                   </View>
                                 </View>
                                
                               </View>}
                           </View>
                       )
                     
                   })
                 }
               </View>
             </View>
                      </View>
                    </View>
              
            )
          })
        }    
      </View>
    </View>
       </View>
       
        )
      }
export const MarketLoader = (props) => {
  return (
    <>
      <View style="game-info banner-image col-sm-12">
        {props.activeView !== "Live" &&
          <>
            <View style="game-date-time col-sm-12">
              <View style="date col-sm-6"><View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View></View>
              <View style="time col-sm-6"><View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View></View>
            </View>
            <View style="game-teams-competition col-sm-12">
              <View style="teams">
                <View style="w1"><View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View></View>
                <View style="vs"><View style={[viewStyles.gLoading,viewStyles.gLoadingMedium]}></View></View>
                <View style="w2"><View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View></View>
              </View>
            </View>
          </>
  
        }
      </View>
      {props.activeView === "Live" &&
      <>
        <View style={`live-game-teams-stats`}>
            <View style={`stats-header`}>
              <View style="title"><View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View></View>
              <View style={`first-half-score`}></View>
              <View style={`second-half-score`}></View>
              <View style={`third-half-score`}></View>
              <View style={`forth-half-score`}></View>
              <View style="score"><View style={[viewStyles.gLoading,viewStyles.gLoadingMedium]}></View></View>

            </View>
            <View style={`stats-teams`} style={{ borderBottom: "1 solid color: rgba(51,51,51,.65)" }}>
              <View style="title"><View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View></View>
              <View style={`first-half-score`}></View>
              <View style={`second-half-score`}></View>
              <View style={`third-half-score`}></View>
              <View style={`forth-half-score`}></View>
              <View style="score"><View style={[viewStyles.gLoading,viewStyles.gLoadingMedium]}></View></View>
            </View>
            <View style={`stats-teams`} style={{ borderBottom: "1 solid color: rgba(51,51,51,.65)" }}>
              <View style="title"><View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View></View>
              <View style={`first-half-score`}></View>
              <View style={`second-half-score`}></View>
              <View style={`third-half-score`}></View>
              <View style={`forth-half-score`}></View>
              <View style="score"><View style={[viewStyles.gLoading,viewStyles.gLoadingMedium]}></View></View>
            </View>
          </View>
        <View id="" style={`game-markets-header sport-header fill ember-view`}>
          <View style="game-markets-header-View sb-sport-header-title">
            <View>
              <View style="game-markets-header-county"><View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View></View>
              <View style="game-markets-header-league"> </View>
              <View style="game-markets-header-teams"><View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View></View>
            </View>
          </View>

          <View style="info-icons">
            <View style="lineups-opener ">

            </View>
            <View style="icon-icon-statistics statistics"></View>
          </View>
        </View>
        </>
      }
      <View style="market-event-container">
        <View style="scrollable">
          {props.activeView === "Live" ?
            <View style="sb-game-markets-game-info">
              <CustomIcon name="icon-icon-info"></CustomIcon>
              <View style="game-info-View"><View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View></View>
            </View>
            : null}
          <View>
            <View style="events-nav">
              <View style="events-nav-item">
                <View style={[viewStyles.gLoading,viewStyles.gLoadingMedium]}></View>
              </View>
              <View style="events-nav-item">
                <View style={[viewStyles.gLoading,viewStyles.gLoadingMedium]}></View>
              </View>
              <View style="events-nav-item">
                <View style={[viewStyles.gLoading,viewStyles.gLoadingMedium]}></View>
              </View>
              <View style="events-nav-item">
                <View style={[viewStyles.gLoading,viewStyles.gLoadingMedium]}></View>
              </View>
            </View>
            <View>
              <View style="events-list">
               {
                 [1,2,3,4].map((e,i)=>{
                   return(
                    <View key={i} style="event">
                    <View style="event-header">
                      <View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View>
                      <View style="market-icons">
                        <View style={[viewStyles.gLoading,viewStyles.gLoadingMedium]}></View>
                      </View>
                    </View>
                    <View style="event-data" >
                      <View style="event-item-col-2">
                        <View style="single-event col-sm-6">
                          <View style="event-name col-sm-7"><View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View></View>
                          <View style="event-price col-sm-5"><View style={[viewStyles.gLoading,viewStyles.gLoadingMedium]}></View></View>
                        </View>
                        <View style="single-event col-sm-6">
                          <View style="event-name col-sm-7"><View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View></View>
                          <View style="event-price col-sm-5"><View style={[viewStyles.gLoading,viewStyles.gLoadingMedium]}></View></View>
                        </View>
                      </View>
                      <View style="event-item-col-2">
                        <View style="single-event col-sm-6">
                          <View style="event-name col-sm-7"><View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View></View>
                          <View style="event-price col-sm-5"><View style={[viewStyles.gLoading,viewStyles.gLoadingMedium]}></View></View>
                        </View>
                        <View style="single-event col-sm-6">
                          <View style="event-name col-sm-7"><View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View></View>
                          <View style="event-price col-sm-5"><View style={[viewStyles.gLoading,viewStyles.gLoadingMedium]}></View></View>
                        </View>
                      </View>
                      <View style="event-item-col-2">
                        <View style="single-event col-sm-6">
                          <View style="event-name col-sm-7"><View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View></View>
                          <View style="event-price col-sm-5"><View style={[viewStyles.gLoading,viewStyles.gLoadingMedium]}></View></View>
                        </View>
                        <View style="single-event col-sm-6">
                          <View style="event-name col-sm-7"><View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View></View>
                          <View style="event-price col-sm-5"><View style={[viewStyles.gLoading,viewStyles.gLoadingMedium]}></View></View>
                        </View>
                      </View>
                    </View>
                  </View>
                   )
                 })
               }
              </View>
            </View>
          </View>
        </View>
      </View>
    </>
  )
}
export const MViewtiviewMarketLoader = (props) => {
  return (
    <>
      <View style="sport-header">
        <View style="sport-title"><View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View></View>
        <View style="sport-accord"><View style={[viewStyles.gLoading,viewStyles.gLoadingSmall]}></View></View>
      </View>
          <View style={`live-game-teams-stats`}>
            <View style={`stats-header`}>
              <View style="title"><View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View></View>
              <View style={`first-half-score`}></View>
              <View style={`second-half-score`}></View>
              <View style={`third-half-score`}></View>
              <View style={`forth-half-score`}></View>
              <View style="score"><View style={[viewStyles.gLoading,viewStyles.gLoadingMedium]}></View></View>

            </View>
            <View  style={[viewStyles.statsTeams,{borderStyle:'solid',borderBottomColor:'rgba(51,51,51,.65)', borderBottom: 1 }]}>
              <View style="title"><View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View></View>
              <View style={`first-half-score`}></View>
              <View style={`second-half-score`}></View>
              <View style={`third-half-score`}></View>
              <View style={`forth-half-score`}></View>
              <View style="score"><View style={[viewStyles.gLoading,viewStyles.gLoadingMedium]}></View></View>
            </View>
            <View style={[viewStyles.statsTeams,{borderStyle:'solid',borderBottomColor:'rgba(51,51,51,.65)', borderBottom: 1 }]}>
              <View style="title"><View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View></View>
              <View style={`first-half-score`}></View>
              <View style={`second-half-score`}></View>
              <View style={`third-half-score`}></View>
              <View style={`forth-half-score`}></View>
              <View style="score"><View style={[viewStyles.gLoading,viewStyles.gLoadingMedium]}></View></View>
            </View>
          </View>
      <View style="market-event-container">
        <View style="scrollable">
          {props.activeView === "Live" ?
            <View style="sb-game-markets-game-info">
              <CustomIcon name="icon-icon-info"></CustomIcon>
              <View style="game-info-View"><View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View></View>
            </View>
            : null}
          <View>

            <View>
              <View style="events-list">
               {
                 [1,2,3,4].map((e,i)=>{
                   return(
                    <View key={i} style="event">
                    <View style="event-header">
                      <View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View>
                      <View style="market-icons">
                        <View style={[viewStyles.gLoading,viewStyles.gLoadingMedium]}></View>
                      </View>
                    </View>
                    <View style="event-data">
                      <View style="event-item-col-3">
                        <View style="single-event">
                          <View style="event-name"><View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View></View>
                          <View style="event-price"><View style={[viewStyles.gLoading,viewStyles.gLoadingSmall]}></View></View>
                        </View>
                        <View style="single-event">
                          <View style="event-name"><View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View></View>
                          <View style="event-price"><View style={[viewStyles.gLoading,viewStyles.gLoadingSmall]}></View></View>
                        </View>
                        <View style="single-event ">
                          <View style="event-name"><View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View></View>
                          <View style="event-price"><View style={[viewStyles.gLoading,viewStyles.gLoadingSmall]}></View></View>
                        </View>
                      </View>
                    </View>
                  </View>
                   )
                 })
               }
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style="goto-link"><View><CustomIcon name="icon-go-to-link"/>OPEN THIS EVENT</View></View>
    </>
  )
}
export const CompetitionLoader = () => {
  return (
    <View style="competition-game loading-competition">
      <View style="game-date">
        <View style="date"><View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View></View>
        <View style="events">
          <View style="w1"></View>
          <View style="draw"></View>
          <View style="w2"></View></View>
      </View>
      {
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((d, i) => {
          return (
            <View key={i} style="game">
              <View style="game-teams col-sm-4">
                <View style="w1"><View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View></View>
                <View style="w2"><View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View></View>
              </View>
              <View style="game-time col-sm-2">
                <View style="time"><View style={[viewStyles.gLoading,viewStyles.gLoadingSmall]}></View></View>
                <View style="market-count"><View style={[viewStyles.gLoading,viewStyles.gLoadingSmall]}></View></View>
              </View>
              <View style="game-market col-sm-6">
                <View style="w1 col-sm-4"><View style="price"><View style={[viewStyles.gLoading,viewStyles.gLoadingSmall]}></View></View></View>
                <View style="draw col-sm-4"><View style="price"><View style={[viewStyles.gLoading,viewStyles.gLoadingSmall]}></View></View></View>
                <View style="w2 col-sm-4"><View style="price"><View style={[viewStyles.gLoading,viewStyles.gLoadingSmall]}></View></View></View>
              </View>
            </View>
          )
        })
      }
    </View>
  )
}
export const OverviewLoader = () => {
  return (
    <>
      <View style="sports-container">
        <View style="sport-header select ">
          <View style="sport-title"><View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View></View>
          <View style="sport-accord"><View style="View View-hide">
            <View style={[viewStyles.gLoading,viewStyles.gLoadingSmall]}></View>
          </View>
            <View style="icon-icon-arrow-down icon icon-show col-sm-1 icon-up"></View>
          </View>
        </View>
        <View style="region-block-open" style={{ display: 'block' }}>
          <View style="sports-region-list">
            {
              [1, 2, 3].map((d, i) => {
                return (
                  <View key={i}>
                    <View style="region-header overview">
                      <View style="region-name"><View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View> </View>
                      <View style="total-games View">
                        <View style="icon-icon-arrow-down icon icon-show col-sm-1 icon-up">
                        </View>
                      </View>
                    </View>
                    <View style="region-competition show" style={{ display: "block" }}>
                      <View style="competition-list ">
                        <View style="competition-block live">
                          <View style="events">
                            <View style="sportlist-competition-accordion">
                              <View style="sb-accordion-container">
                                <View style="sb-accordion-item match open overview">
                                  <View style="sb-accordion-title match-title border-bottom">
                                    <View style="match-title-View"><View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View>
                                    </View>
                                    <View style="match-title-View match-title-View-x2"><View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View>
                                    </View>
                                    <View style="hidden-icons">
                                      <View style="match-time">
                                        <View style="match-time-info"><View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View>
                                        </View>
                                      </View>
                                      <View style="add-to-favorite">
                                      </View>
                                    </View>
                                  </View>
                                  <View style="sb-accordion-content overview-item match-content sportlist-game-accordion">
                                    <View style=" sb-accordion-title sb-block-header hidden-icon-parent game-market-title event-list-breadcrumb ">
                                      <View style="custom-select ">
                                        <View style="custom-select-style custom-select-defaViewt">
                                          <View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View>
                                        </View>

                                      </View>
                                      <View style="sb-accordion-title-icons">
                                        <View style="sb-accordion-title-icons-left">
                                          <View style="calendar-events-title-dropdown-container">
                                          </View>
                                        </View>
                                        <View style="more-matches"><View style={[viewStyles.gLoading,viewStyles.gLoadingSmall]}></View>
                                        </View></View></View><View style="event-list">
                                      <View style="event-item-col-undefined">
                                        <View style="single-event">
                                          <View style="event-name col-sm-9"><View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View></View>
                                          <View style="event-price col-sm-3"><View style={[viewStyles.gLoading,viewStyles.gLoadingSmall]}></View></View>
                                        </View>
                                      </View>
                                      <View style="event-item-col-undefined">
                                        <View style="single-event">
                                          <View style="event-name col-sm-9"><View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View></View>
                                          <View style="event-price col-sm-3"><View style={[viewStyles.gLoading,viewStyles.gLoadingSmall]}></View></View>
                                        </View>
                                      </View>
                                      <View style="event-item-col-undefined">
                                        <View style="single-event">
                                          <View style="event-name col-sm-9"><View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View></View>
                                          <View style="event-price col-sm-3"><View style={[viewStyles.gLoading,viewStyles.gLoadingSmall]}></View></View>
                                        </View>
                                      </View>
                                    </View>
                                  </View>
                                </View>
                              </View>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                )
              })
            }

          </View>
        </View>
      </View>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d, i) => {
        return (
          <View key={i} style="sports-container">
            <View style="sport-header select ">
              <View style="sport-title"><View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View></View>
              <View style="sport-accord"><View style="View View-hide">
                <View style={[viewStyles.gLoading,viewStyles.gLoadingSmall]}></View>
              </View>
                <View style="icon-icon-arrow-down icon icon-show col-sm-1"></View>
              </View>
            </View>
          </View>
        )
      })}
    </>
  )
}
export const CalenderLoader = () => {
  var lLen = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  return (
    <>
      {
        lLen.map((l, i) => {
          return (
            <View key={i} style="calender-event-item loading-view col-sm-12">
              <View style="sport col-sm-2"><View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View></View>
              <View style="time col-sm-1"><View style={[viewStyles.gLoading,viewStyles.gLoadingSmall]}></View></View>
              <View style="league col-sm-2"><View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View></View>
              <View style="event col-sm-3"><View><View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View></View></View>
              <View style="w1 col-sm-1"><View style={[viewStyles.gLoading,viewStyles.gLoadingMedium]}></View></View>
              <View style="draw col-sm-1"><View style={[viewStyles.gLoading,viewStyles.gLoadingMedium]}></View></View>
              <View style="w2 col-sm-1"><View style={[viewStyles.gLoading,viewStyles.gLoadingMedium]}></View></View>
              <View style="stats col-sm-1"><View style={{ ViewAlign: "right", paddingRight: "10" }}><View style={[viewStyles.gLoading,viewStyles.gLoadingSmall]}></View></View></View>
            </View>
          )
        })
      }
    </>
  )
}
export const ResViewtsLoader = () => {
  var lLen = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  return (
    <>
      {
        lLen.map((l, i) => {
          return (
            <View key={i} style="game loading-view">
              <View style="game-header">
                <View style="date col-sm-2"><View><View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View></View></View>
                <View style="competition col-sm-3"><View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View></View>
                <View style="event col-sm-5"><View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View></View>
                <View style="score col-sm-1"><View><View style={[viewStyles.gLoading,viewStyles.gLoadingMedium]}></View></View></View>
                <View style="arrow"><View style="total-games View"><View style="icon-icon-arrow-down icon icon-show"></View></View></View>
              </View>
            </View>
          )
        })
      }
    </>
  )
}
export const BetHistoryLoader = () => {
  var lLen = [1, 2, 3, 4, 5]
  return (

    lLen.map((l, i) => {
      return (
        <View key={i}>
          <View  style="bet-details history-loading" >
          <View style="bet-info-1">
            <View>
            <View style="date"><View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View></View>
            <View style="id"><View style={[viewStyles.gLoading,viewStyles.gLoadingMedium]}></View></View>
            </View>
            <View>
            <View style="date"><View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View></View>
            <View style="id"><View style={[viewStyles.gLoading,viewStyles.gLoadingMedium]}></View></View>
            </View>
          </View>
          <View style="bet-info-2">
            <View>
            <View style="date"><View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View></View>
          <View style="id"><View style={[viewStyles.gLoading,viewStyles.gLoadingMedium]}></View></View>
            </View>
            <View>
            <View style="date"><View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View></View>
            <View style="id"><View style={[viewStyles.gLoading,viewStyles.gLoadingMedium]}></View></View>
            </View>
          </View>
        </View>
        </View>
      )
    })

  )
}
export const SportsbookSportItemLoading = ()=>{
  let styleP= [viewStyles.sport]
  return(
          [1,2,3,4,5,6,7,8,9,10].map((s,i)=>{
            return <View key={i} style={styleP}>
                  <View style={viewStyles.count}>
                  <View ><View style={[viewStyles.gLoading,viewStyles.gLoadingRoundLarge]}></View></View>
                  <View style={viewStyles.sportName}><View style={[viewStyles.gLoading,viewStyles.gLoadingMedium]}></View></View>
                </View>
            </View>
          })
  )
}
export const GameResViewtsLoder = ()=>{
  var numT =[1,2,3,4,5,6,7,8,9,10]
 return(
   numT.map((e,i)=>{
     return(
      <View key={i} style="market-events"><View><View style={[viewStyles.gLoading,viewStyles.gLoadingMedium]}></View></View><View> <View style={[viewStyles.gLoading,viewStyles.gLoadingMedium]}></View></View></View>
     )
   })
 )
}
export const LiveEventLoader = (props)=>{
  // const is_live = props.is_live
  
  return(

          [0,1,2,3,4,5].map((d,i)=>{
              
            return(
              <View style={viewStyles.eventBlockColumn} key={i}>
                <View style={viewStyles.eventDetails}>
                   
                      <View style={{...viewStyles.liveEventDetailsInline,...viewStyles.liveEventDetails}}>
                      <View><View style={[viewStyles.gLoading,viewStyles.gLoadingSmall]}></View></View>
                      <View>
                      <View style={[viewStyles.gLoading,viewStyles.gLoadingSmall]}></View>
                      </View>
                     </View>
                  
                    <View style={{flex:2,alignItems:'center',display:'flex',flexDirection:'row'}} >
                    <View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View>
                    </View>
                    <View style={{...viewStyles.eventInfo,...viewStyles.eventInfoLiveStreamDisabled}}>
                    <View style={[viewStyles.gLoading,viewStyles.gLoadingSmall]}></View>
                    </View>
                </View>
                <View style={[viewStyles.eventOddsInline,{flex:1}]}>
                  {
                    ["W1","X","W2"].map((e,index)=>{ 
                      let style=[viewStyles.singleEvent]
                      style.push(gridStyles[e==='X'?'colsm2':'colsm5'])
                    if(index>0)style.push(viewStyles.eventBorderLeft);
                    if(e==='W1' )style.push({borderTopLeftRadius:4,borderBottomLeftRadius:4});
                    if(e==='W2' )style.push({borderTopRightRadius:4,borderBottomRightRadius:4});
                      return (
                        <View key={index} style={[style]}>
                         {e!=='X'&& <View style={{display:'flex',flexDirection:'row',flex:2}}><View style={[viewStyles.gLoading,viewStyles.gLoadingMedium]}></View></View>}
                          <View style={{...viewStyles.eventPrice,display:'flex',position:'relative',justifyContent:'flex-end'}}><View style={[viewStyles.gLoading,viewStyles.gLoadingSmall]}></View></View>
                        </View>
                      )
                    })
                  }
                </View>
                
              </View>
            )
          })
  )
},
CasinoLoading=()=>{
  return(
         
        <FlatList
          data={[1,2,3,4,55,5]}
          keyExtractor={(item,index)=>index.toString()}
          numColumns={2}
          renderItem={({item,index})=>
          <View style={{flex:1,position:'relative',display:'flex',flexDirection:'row',minHeight:150,justifyContent:'space-between',padding:3}}>
              <View key={index} style={[viewStyles.casinoItem]}>
              <View style={{width:"100%"}}>
              <View style={viewStyles.imgLoading}>
              <View style={[viewStyles.gLoading,viewStyles.gLoadingLarge]}></View>
              </View>
              </View>
              </View>
            </View>
          }
        
      />
      
  ) 
}