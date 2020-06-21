import moment from 'moment-timezone'
import { StyleSheet,Dimensions } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
let {width}= Dimensions.get('window')
export const flagPath= {"world":require("../assets/flags/world.png"),"europe":require("../assets/flags/europe.png"),"asia":require("../assets/flags/asia.png"),"africa":require("../assets/flags/africa.png"),"south-america":require("../assets/flags/south-america.png"),"albania":require("../assets/flags/albania.png"),"algeria":require("../assets/flags/algeria.png"),"antigua-and-barbuda":require("../assets/flags/antigua-and-barbuda.png"),"argentina":require("../assets/flags/argentina.png"),"armenia":require("../assets/flags/armenia.png"),"australia":require("../assets/flags/australia.png"),"austria":require("../assets/flags/austria.png"),"azerbaijan":require("../assets/flags/azerbaijan.png"),"bahrain":require("../assets/flags/bahrain.png"),"barbados":require("../assets/flags/barbados.png"),"belgium":require("../assets/flags/belgium.png"),"bolivia":require("../assets/flags/bolivia.png"),"botswana":require("../assets/flags/botswana.png"),"brazil":require("../assets/flags/brazil.png"),"bulgaria":require("../assets/flags/bulgaria.png"),"burkina-faso":require("../assets/flags/burkina-faso.png"),"cameroon":require("../assets/flags/cameroon.png"),"chile":require("../assets/flags/chile.png"),"colombia":require("../assets/flags/colombia.png"),"costa-rica":require("../assets/flags/costa-rica.png"),"cote-divoire":require("../assets/flags/cote-divoire.png"),"croatia":require("../assets/flags/croatia.png"),"cyprus":require("../assets/flags/cyprus.png"),"czech-republic":require("../assets/flags/czech-republic.png"),"denmark":require("../assets/flags/denmark.png"),"egypt":require("../assets/flags/egypt.png"),"el-salvador":require("../assets/flags/el-salvador.png"),"estonia":require("../assets/flags/estonia.png"),"ethiopia":require("../assets/flags/ethiopia.png"),"fiji":require("../assets/flags/fiji.png"),"finland":require("../assets/flags/finland.png"),"france":require("../assets/flags/france.png"),"gambia":require("../assets/flags/gambia.png"),"germany":require("../assets/flags/germany.png"),"ghana":require("../assets/flags/ghana.png"),"gibraltar":require("../assets/flags/gibraltar.png"),"greece":require("../assets/flags/greece.png"),"guatemala":require("../assets/flags/guatemala.png"),"honduras":require("../assets/flags/honduras.png"),"hong-kong":require("../assets/flags/hong-kong.png"),"hungary":require("../assets/flags/hungary.png"),"iceland":require("../assets/flags/iceland.png"),"india":require("../assets/flags/india.png"),"iran":require("../assets/flags/iran.png"),"ireland":require("../assets/flags/ireland.png"),"israel":require("../assets/flags/israel.png"),"italy":require("../assets/flags/italy.png"),"jamaica":require("../assets/flags/jamaica.png"),"jordan":require("../assets/flags/jordan.png"),"kenya":require("../assets/flags/kenya.png"),"kuwait":require("../assets/flags/kuwait.png"),"mali":require("../assets/flags/mali.png"),"malta":require("../assets/flags/malta.png"),"mauritania":require("../assets/flags/mauritania.png"),"mexico":require("../assets/flags/mexico.png"),"morocco":require("../assets/flags/morocco.png"),"myanmar":require("../assets/flags/myanmar.png"),"nepal":require("../assets/flags/nepal.png"),"netherlands":require("../assets/flags/netherlands.png"),"new-zealand":require("../assets/flags/new-zealand.png"),"nicaragua":require("../assets/flags/nicaragua.png"),"nigeria":require("../assets/flags/nigeria.png"),"oman":require("../assets/flags/oman.png"),"palestine":require("../assets/flags/palestine.png"),"panama":require("../assets/flags/panama.png"),"paraguay":require("../assets/flags/paraguay.png"),"peru":require("../assets/flags/peru.png"),"philippines":require("../assets/flags/philippines.png"),"poland":require("../assets/flags/poland.png"),"portugal":require("../assets/flags/portugal.png"),"qatar":require("../assets/flags/qatar.png"),"romania":require("../assets/flags/romania.png"),"russia":require("../assets/flags/russia.png"),"rwanda":require("../assets/flags/rwanda.png"),"saudi-arabia":require("../assets/flags/saudi-arabia.png"),"senegal":require("../assets/flags/senegal.png"),"south-africa":require("../assets/flags/south-africa.png"),"spain":require("../assets/flags/spain.png"),"switzerland":require("../assets/flags/switzerland.png"),"syria":require("../assets/flags/syria.png"),"tajikistan":require("../assets/flags/tajikistan.png"),"united-republic-of-tanzania":require("../assets/flags/united-republic-of-tanzania.png"),"thailand":require("../assets/flags/thailand.png"),"tunisia":require("../assets/flags/tunisia.png"),"turkey":require("../assets/flags/turkey.png"),"uganda":require("../assets/flags/uganda.png"),"ukraine":require("../assets/flags/ukraine.png"),"uae":require("../assets/flags/uae.png"),"uruguay":require("../assets/flags/uruguay.png"),"venezuela":require("../assets/flags/venezuela.png"),"zambia":require("../assets/flags/zambia.png"),"americas":require("../assets/flags/americas.png"),"england":require("../assets/flags/england.png"),"northern-ireland":require("../assets/flags/northern-ireland.png"),"scotland":require("../assets/flags/scotland.png"),"wales":require("../assets/flags/wales.png"),"north-america":require("../assets/flags/north-america.png"),"belarus":require("../assets/flags/belarus.png"),"canada":require("../assets/flags/canada.png"),"kazakhstan":require("../assets/flags/kazakhstan.png"),"latvia":require("../assets/flags/latvia.png"),"norway":require("../assets/flags/norway.png"),"slovakia":require("../assets/flags/slovakia.png"),"sweden":require("../assets/flags/sweden.png"),"united-kingdom":require("../assets/flags/united-kingdom.png"),"bosniaherzegovina":require("../assets/flags/bosniaherzegovina.png"),"china":require("../assets/flags/china.png"),"dominican-republic":require("../assets/flags/dominican-republic.png"),"indonesia":require("../assets/flags/indonesia.png"),"iraq":require("../assets/flags/iraq.png"),"japan":require("../assets/flags/japan.png"),"south-korea":require("../assets/flags/south-korea.png"),"lithuania":require("../assets/flags/lithuania.png"),"serbia":require("../assets/flags/serbia.png"),"slovenia":require("../assets/flags/slovenia.png"),"usa":require("../assets/flags/usa.png"),"great-britain":require("../assets/flags/great-britain.png"),"kyrgyzstan":require("../assets/flags/kyrgyzstan.png"),"cuba":require("../assets/flags/cuba.png"),"malaysia":require("../assets/flags/malaysia.png"),"oceania":require("../assets/flags/oceania.png"),"vietnam":require("../assets/flags/vietnam.png")}, 
gridStyles=StyleSheet.create({ 
  colsm1 :{
    flexBasis: '8.33333%',
    maxWidth: '8.33333%',
  },colsm2 :{
    flexBasis: '16.66667%',
    maxWidth: '16.66667%',
  },colsm3: {
    flexBasis: '25%',
    maxWidth: '25%',
  },colsm4: {
    flexBasis: '33.33333%',
    maxWidth: '33.33333%',
  },colsm5: {
    flexBasis: '41.66667%',
    maxWidth: '41.66667%',
  },colsm6: {
    flexBasis: '50%',
    maxWidth: '50%',
  },colsm7: {
    flexBasis: '58.33333%',
    maxWidth: '58.33333%',
  },colsm8 :{
    flexBasis: '66.66667%',
    maxWidth: '66.66667%',
  },colsm9: {
    flexBasis: '75%',
    maxWidth: '75%',
  },colsm10: {
    flexBasis: '83.33333%',
    maxWidth: '83.33333%',
  },colsm11: {
    flexBasis: '91.66667%',
    maxWidth: '91.66667%',
  },colsm12: {
    flexBasis: '100%',
    },colsm2_5: {
      flexBasis: '22.6666%',
      maxWidth: '22.6666%',
    },colsm4_5: {
      flexBasis: '38.66667%',
      maxWidth: '38.66667%',
    }}),viewStyles=StyleSheet.create({
      selectedEvent: {
        backgroundColor: '#11c9e3' 
      },
      textWhite:{color: '#fff'},
      textBlack:{color: '#333'},
      warning: {color:"#db8e48"},
      error:{color:"crimson"},
      success:{color:"#4dae50"},
      themeTextColor:{color:'#194b51'},
      sport: {
        minHeight: 70,
        margin:0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingLeft:10,
        paddingRight:10,
        overflow: "hidden",
        flexShrink: 0,
      },sportHeader: {
        backgroundColor: '#026775',
        flexDirection:'row'
      },
      sportTitle: {
        display: 'flex',
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft:10
      },
      sportAccord :{
        display: 'flex',
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: 10
      },
      sportItem: {
        display: "flex",
        minHeight: 35,
        padding: 5,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        alignItems: "center",
        backgroundColor: "#ededf2"
      },
      promotionSportBackground:{
        position: 'absolute',
        top: 0,
        left: 0,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4
      },
      sportBackground: {
        position: "absolute",
        top: "auto",
        bottom: -10,
        left: "50%",
        marginLeft: 2.5,
        width: 15,
        height: 15,
        opacity: 0,
        transform: [{ rotate: '45deg'}]
      },sportBackgroundTop:{
        right: 0,
        height: 4
      }
      ,  sportsContainer: {
        minHeight: 25,
        fontSize: 12,
        backgroundColor: "#e8e8ec",
        borderBottomWidth: 1,
        borderStyle: "solid",
        borderColor: "#d5d5da"
      },
      regionBlockOpen: { overflow: "hidden" },
      sportsRegionListItem: {
        borderColor: "#d5d5da",
        backgroundColor: "#fff"
      },
      regionHeader: {
        height: 50,
        alignItems: "center",
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
        justifyContent: "center",
        paddingLeft: 5
      },
      regionIcon: {
        alignSelf: "center",
        width: 30,
        marginLeft: 5
      },
      regionName: {
        flex: 1,
        overflow: "hidden",
        fontSize: 12,
      },
      eventBorderRight:{
        borderRightWidth:1,
        borderStyle: 'solid',
        borderRightColor:'#dedee0'
      },
      eventBorderLeft:{
        borderLeftWidth:1,
        borderStyle: 'solid',
        borderLeftColor:'#dedee0'
      },
      eventBorderBottom:{
        borderBottomWidth:1,
        borderStyle: 'solid',
        borderBottomColor:'#dedee0'
      },
      regionText: { display: "flex",flexDirection:'row',justifyContent:'space-between', alignItems: "center", width: "100%" },
      regionCompetition: { padding: 0, overflow: "hidden" },
      competitionList: {
        display:'flex',
        flexDirection:'row',
        backgroundColor: "#d1d1d4",
        paddingTop: 1,
        paddingBottom: 1
      },
      eventBlockInline: {
        marginTop: 5,
        backgroundColor: 'rgba(209,209,219,.9)',
        paddingBottom: 5,
        paddingRight: 10,
        paddingLeft: 10,
        display: "flex",
        flexDirection: "row"
      },
      eventBlockColumn: {
        marginTop: 5,
        padding:5,
        display: "flex",
        backgroundColor: 'rgba(209,209,219,.9)',
      },
      eventDetails:{
        display:'flex',
        flexDirection:'row',
        // justifyContent:'center',
        flexShrink: 0,
        marginBottom:5
      },
      liveEventDetailsInline :{
        minWidth: 120,
        height: 15,
        flexDirection: 'row',
        alignItems:'center',
    },
    liveEventDetails :{
      minWidth: 120,
      height: 35,
      marginRight: 10,
      borderRadius: 4,
      fontSize: 9,
      fontWeight: '700',
      display: 'flex',
      },
      liveEventDetailsText:{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
      },
      eventDetailsCompetition: {
        fontSize: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      eventInfo: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        flexShrink: 0
      },
      eventInfoLiveStreamDisabled: {
       width:55
      },
      marketsCount: {
        flex:1,
        width: 35,
        paddingLeft: 2,
        paddingRight: 2,
        fontSize: 12,
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: 2,
        textAlign: "center",
        color: "#e44a3f",
        borderColor: "#e44a3f"
      },
      eventOdds: {
        width: '100%'
      },
      eventName: {
        paddingRight: 5,
        fontSize: 12,
        fontWeight: '500',
      },
      eventPrice :{
        fontWeight: '700',
        fontSize: 12,
        // textAlign: 'right',
        flex: 1,
      },
      eventOddsInline: {
        position: "relative",
        borderRadius: 4,
        zIndex: 1,
        display: "flex",
        flexDirection: "row",padding:0
      },
      sportItemPrematch: {
        marginBottom: 0,
        display:'flex',
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        flexShrink: 0,
        color: "#fff",
      },
      count :{
        top: 0,
        right: 0,
        fontSize: 11,
        color: "#fff",
      },
      sportName:{
        textTransform: 'uppercase',
        textAlign: 'center',
        color: "#fff",
        padding:3,
        fontSize:12
      },
      singleEvent: {
        fontSize: 12,
        backgroundColor: "#fff",
        position: "relative",
        minHeight: 45,
        paddingTop: 2,
        paddingBottom: 2,
        paddingLeft: 10,
        paddingRight: 10,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
      },
      sportIcon: {
        position: "relative",
        display: "flex",
        width: 20,
        marginRight: 10,
        color: "#fff",
      },
      casinoItem: {
        // width: "50%",
        // marginTop: 5,
        // marginBottom: 5,
        flex:1,
        borderRadius: 5,
        position: "relative",
        height: "100%",
      },
      catactive:{backgroundColor: '#11c9e3'},
      casinoItemImg: { width: "100%", borderRadius: 10,flex:1},
      flowButton: {
        width: "100%",
        position: "absolute",
        height: "100%",
        textAlign: "center",
        top: "40%",
        left: 0,
        right: 0,
        marginTop: -44,
        zIndex: 90
      },
      flowButtonInner: { paddingLeft: 5, paddingRight: 5, height: 60 },
      flowButtonFristButton: {
        height: 40,
        width: "100%",
        paddingLeft: 5,
        paddingRight: 5,
        marginTop: 5,
        marginBottom: 5,
        borderRadius: 4,
        transform: [{translate3d:'250%, 0, 0'}],
        backgroundColor: "#1a7051",
        color: "#fff",
        textTransform: "uppercase"
      },
      flowButtonSecondButton: {
        transform: [{translate3d:'-250%, 0, 0'}],
        backgroundColor: "rgba(0, 0, 0, 0.527)",
        color: "#fff"
      },
      coeficiente_change_down:{
        right: -1,
        bottom: -1,
        color:'#f54f2e'
      },
      coeficiente_change_up:{
        right: -1,
        top:-1,
        color:'#159e1c'
      },
      regionHeader: {
        height: 50,
        alignItems: "center",
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
        justifyContent: "flex-start",
        paddingLeft: 5
      },
      icon: { color: "rgba(51, 51, 51, .65)", fontSize: 12 },
      li: { backgroundColor: "#fff" },
      regionIcon: {
        alignSelf: "center",
        width: 30,
        height: 18,
        marginLeft: 5
      },
      regionName: {
        flex: 1,
        flexBasis: "80%",
        overflow: "hidden",
        fontSize: 14
      },
      regionText: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        width: "100%"
      },
      totalGamesText: { display: "flex", minWidth: 10,flexDirection:'row',alignItems:'center',},
      textShow: { display: "flex", width: "100%" },
      regionCompetition: { padding: 0, overflow: "hidden" },
      competitionList: {
        backgroundColor: "#d1d1d4",
        paddingTop: 1
      },
      eventsLive: {
        display: "flex",
        flexDirection: "row",
        fontSize: 10,
        textAlign: "center",
        alignItems: "center",
        justifyContent:'center'
      },
      eventsSpan: {
        justifyContent: "center",
        overflow: "hidden",
        flex: 1,
        textAlign: "center",
        flexDirection:'row'
      },
      competitionBlock: {
        backgroundColor: "#ccc",
      },
      headerText: {
        width: "95%",
        paddingLeft: "35",
        fontWeight: "500",
        fontSize: 12
      },
      matchLeague: { backgroundColor: "#f7f7f9", color: "rgba(51, 51, 51, .65)" },
      matchLeagueTitleText: {
        overflow: "hidden",
        width: "99%",
        maxWidth: "99%",
        display: "flex",
        flexDirection: "row",
        alignItems:'center',
        paddingLeft: 20
      },
      popularLeagueMatchLeagueTitleTextFirst: {
        overflow: "hidden",
        width: "80%",
        maxWidth: "80%",
        paddingLeft: 5,
        paddingRight: 5
      },
      popularLeagueMatchLeagueTitleTextLast: {
        overflow: "hidden",
        width: "20%",
        maxWidth: "20%",
        paddingLeft: 5,
        paddingRight: 5,
        alignSelf: "flex-end"
      },
      matchTitleText: { fontSize: 10, overflow: "hidden",display:'flex',flex:1,flexDirection:'row'},
      matchTitleTextx2: { marginBottom:0 },
      sbAccordionItem: {
        display: "flex",
        flexDirection: "row",
        borderStyle: "solid",
        borderBottomWidth: 1,
        borderColor: "#d5d5da"
      },
      sbAccordionTitle: {
        position: "relative",
        fontSize: 10,
        display: "flex",       
        // alignItems: "center"
      },
      sbAccordionTitleMatchTitle: { backgroundColor: "#fff" },
      sbAccordionTitleMatchTitleSelected: { backgroundColor: "#c4d9f2" },
      hiddenIcons: {
        // position: "absolute",
        right: 3,
        bottom: 0,
        flex:1,
        fontSize: 0,
        textAlign: "right",
        opacity: 1,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
      },
      hiddenIconsMatchTime: { paddingLeft: 5 },
      matchTimeInfo: {
        paddingLeft: 4,
        flex:1
      },
      addToFavorite: {
        display: "flex",
        paddingRight: 0,
        fontSize: 21,
        flexDirection:'row',
      },
      sbAccordionCotent: { display: "flex", flexDirection: "row" },
      sbAccordionContentMatchContentInner: {
        display: "flex",
        flex:1,
        flexDirection: "row",
        height: "100%",

      },
      sbAccordionContent:{
        flex:1,
        height:'100%',
        flexDirection:'row'
      },
      matchContent: {
        borderBottomRightRadius: 3,
        borderBottomLeftRadius: 3
      },
      sbGameBetBlockWrapper: {
        display: "flex",
        flexDirection: "row",
        borderBottomRightRadius: 4,
        // borderTopWidth: 1,
        // borderStyle: "solid",
        height:'100%',
        // borderTopWidth: 1,
        // borderBottomWidth: 1,
        // borderColor: "#dedee0"
      },
      sbGameBetBlock: {
        paddingLeft: 0,
        paddingRight: 0,
        borderTopWidth: 0,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        flex: 1,
        backgroundColor: '#fff',
        borderColor: "#dedee0",
        height:'100%',
        flexDirection:'row'
      },
      sbGameBetBlockInner: {
        fontSize: 10,
        flexDirection: "row",
        flex: 1,
        borderLeftWidth: 1,
        borderStyle: "solid",
        borderColor: "#d5d5da",
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
        display: "flex"
      },
      sbGameBetCoeficiente: { color: "#0167e8", fontWeight: "700", fontSize: 12 }
      ,sportlistCompetitionAccordion: {
        backgroundColor: "#e8e8ec",
        // borderRadius: 8
      },
      competitionName: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 0,
        height: 37,
        alignItems:'center',
        paddingLeft: 10,
        color: '#fff',
        backgroundColor: '#026775'
      },
      competitionGame :{
        width: '100%',
        display: 'flex'
      },
      gameDate :{
        height: 35,
        display: 'flex',
        flexDirection: 'row',
        alignItems:'center',
        justifyContent: 'flex-start',
        borderStyle: 'solid',
        borderColor: '#dedee0',
        borderBottomWidth:1,
        backgroundColor: '#ededf2',
        color: 'rgba(51, 51, 51, .65)',
        top: -1,
        zIndex: 10,
      },
      date :{
        fontWeight: '600',
      },
      events: {
        flex: 1,
        flexBasis: '30%',
        flexShrink:1,
        flexDirection:'row',
        alignItems:'center'
      },
      eventText:{
        flex:1,
        fontSize: 10,
        textAlign: 'center',
        fontWeight: '600',
      },
      sbAccordionContainer: { paddingTop: 0, paddingBottom: 0 }, 
      gLoading: {
        alignSelf: "center",
        marginLeft: 5,
        marginRight: 5,
        height: 8,
        borderRadius: 3,
        backgroundColor:'rgba(0,0,0,.1)'
      },
      sbIndicatorMessage: {
        padding: 20,
        fontSize: 13,
        fontWeight: "400",
        textAlign: "center",
        backgroundColor: "rgba(209, 209, 219, .9)"
      },
      sbIndicatorMessageView: {
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      },
      gLoadingRoundLarge: { width: 40, height: 40, borderRadius: 20 },
      gLoadingRoundSmall: { width: 10, height: 10, borderRadius: 5 },
      gLoadingRoundMedium: { width: 20, height: 20, borderRadius: 10 },
      gLoadingLarge: { width: 100 },
      gLoadingMedium: { width: 70 },
      gLoadingSmall: { width: 40 },
      gameInfo: {
        display: "flex",
        height: 200,
        backgroundColor: "#1e1e1ed3",
        alignItems: "center"
      },
      gameInfoChild: {
        display: "flex",
        flexDirection: "column",
        flex: 1,
        alignItems: "center"
      },
      gameInfoLastChild: {
        justifyContent: "center",
        flex: 1,
        flexGrow: 1,
        flexBasis: "50%",
        fontSize: 15
      },
      gameInfoWinner: { flex: 1, flexGrow: 1, flexBasis: "1%" },
      gameInfoGameDateTime: {
        flex: 1,
        flexGrow: 1,
        flexBasis: '1%',
        fontSize: 13,
        fontWeight: "600"
      },
      gameInfoGameDateTimeChild: { height: 17 },
      gameInfoGameDateTimeChildText: { fontSize:15, color: "#cac8c8" },
      gameInfoGameTeamscompetition: {
        flex: 1,
        flexGrow: 1,
        flexBasis: "1%",
        fontWeight: "600"
      },
      gameInfoGameTeamscompetitionChild: {
        display: "flex",
        flexDirection: "row",
        height: 17,
        color: "#cac8c8"
      },
      gameInfoGameTeamscompetitionTeams: { color: "#bdbdbd", display: "flex",fontSize: 15 },
      gameInfoGameTeamscompetitionTeamsvs: { color: "#7d7d7d",fontSize: 16,paddingLeft:5,paddingRight:5 },
      gameinfoContainer: { flexDirection: 'row', alignItems: "center",flex:1 },
      timeLineContainer: {
        height: 50,
        paddingRight: 2,
        paddingLeft: 2,
        opacity: 1,
        flex:1,
        flexDirection:'row',
        backgroundColor: "#ededf2"
      },
      timeLineContainerShow: { opacity: 1,position:'relative' },
      timeLine: {
        flex:1,
        height: 40,
        flexDirection: "row",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start"
      },
      curTime: {
        flex:1,
        position: "absolute",
        top: '50%',
        left: 0,
        height: 6,
        borderRadius:3,
        backgroundColor: "#11c9e3",
        // transform: [{translateY:width/2}]
      },
      curTimeChild:{
        width:'7.86666666667%',
        color: 'rgba(0,0,0,.8)',
        position: 'relative',
        height: 5,
        textAlign: 'left',
        fontSize: 10,
        flexShrink: 0
      },       
      curTimeChildNotHalf:{
        height: 12,
        // paddingLeft:3,
        // paddingRight:3,
      },  
      sbGameMarketsGameInfo: {
        marginTop: 5,
        marginBottom: 5,
        borderRadius: 4,
        paddingLeft:10,
        paddingRight:10,
        flexDirection: "row",
        alignItems: "center"
      },
      gameInfoText: { paddingLeft: 25, lineHeight: 22 },
      timeLineAfter: {
        backgroundColor: '#11c9e382',
        position: "absolute",
        top: "50%",
        left: 0,
        right: 0,
        height: 6,
        borderRadius:3,
        opacity: 0.5,
        borderRadius: 2,
        // transform: [{"translateY":width/2}]
      },
      fullTime: { height: 15.3, position: "relative" },
      fullHalfBefore: {
        width: 12,
        height: 12,
        borderRadius: 6,
        position: "absolute",
        top: 5,
        backgroundColor: "#11c9e3"
      },
      fullHalfAfter: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#fff",
        position: "absolute",
        top: 8,
        left: 3,
        zIndex: 2
      },
      fullAfter: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#fff",
        position: "absolute",
        top: 8,
        right: 3,
        zIndex: 2
      },
      timeLineTextNotHalf: {
        position: "absolute",
        top: -19,
        left: 0,
        transform: [{"translateX":width/2}]
      },
      halfTime: { height: 15.3, position: "relative" },
      halftimeBefore: {
        width: 12,
        height: 12,
        borderRadius: 6,
        position: "absolute",
        top: 1,
        left: -6,
        backgroundColor: "rgba(0,0,0,.8)"
      },
      eventsNavItem: {
        position: "relative",
        flexDirection: "row",
        alignItems:'center',
        justifyContent:'center',
        marginTop: 8,
        marginBottom: 4,
        marginLeft: 6,
        paddingTop: 9,
        paddingRight: 10,
        paddingLeft: 10,
        paddingBottom: 7,
        borderRadius: 4,
        zIndex: 1,
        backgroundColor: "#ededf2"
      },
      eventsNavItem2: {
        position: "relative",
        flexDirection: "row",
        alignItems:'center',
        justifyContent:'center',
        paddingRight: 10,
        paddingLeft: 10,
        paddingBottom: 7,
        zIndex: 1,
        backgroundColor: "#fff"
      },
      eventsNavItemActive: { backgroundColor: "#fff"},
      activeMarketType: {
        position: "absolute",
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        top: 0,
        right: 0,
        left: 0,
        height: 3,
        flex:1,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
      },
      activeMarketType2: {
        position: "absolute",
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        bottom: 0,
        right: 0,
        left: 0,
        height: 3,
        flex:1
      },
      activeMarketTypeActive: { backgroundColor: "#4dae50" },
      marketTypeName: {textAlign:'center', minWidth: 30, flexDirection:'row',
      alignItems:'center',
      justifyContent:'center',flex:1},
      eventHeader: {
        height: 45,
        display: "flex",
        flexDirection: "row",
        backgroundColor: "#ededf2",
        borderColor: "#d5d5da",
        borderBottomWidth:1,
        paddingLeft: 10,
        paddingRight: 10,
        fontWeight: "700",
        alignItems: "center",
        position: "relative",
        textTransform: "uppercase",
        justifyContent: "space-between"
      },
      marketIcons: {
        paddingTop: 3,
        paddingBottom: 3,
        flexDirection: "row",
        alignItems: "center"
      },     
      soccer: { color: "#fff", backgroundColor: "#4dae50" },
      basketball: { color: "#fff", backgroundColor: "#fe9800" },
      tennis: { color: "#fff", backgroundColor: "#cddb3a" },
      volleyball: { color: "#fff", backgroundColor: "#4051b4" },
      icehockey: { color: "#fff", backgroundColor: "#05a9f3" },
      baseball: { color: "#fff", backgroundColor: "#795548" },
      badminton: { color: "#fff", backgroundColor: "#70c2a7" },
      tabletennis: { color: "#fff", backgroundColor: "#2296f3" },
      ballhockey: { color: "#fff", backgroundColor: "#3d9bb7" },
      handball: { color: "#fff", backgroundColor: "#f24436" },
      cyberfootball: { color: "#fff", backgroundColor: "#1b1b1b" },
      americanfootball: { color: "#fff", backgroundColor: "#32850e" },
      futsal: { color: "#fff", backgroundColor: "#65b5c2" },
      biathlon: { color: "#fff", backgroundColor: "#bedbed" },
      boxing: { color: "#fff", backgroundColor: "#2a8c4c" },
      rugbyleague: { color: "#fff", backgroundColor: "#799755" },
      cricket: { color: "#fff", backgroundColor: "#1bab7d" },
      cycling: { color: "#fff", backgroundColor: "#595959" },
      soccer_text: { color:"#4dae50" },
      basketball_text: { color: "#fe9800" },
      tennis_text: { color: "#cddb3a" },
      volleyball_text: { color: "#4051b4" },
      icehockey_text: { color: "#05a9f3" },
      baseball_text: { color: "#795548" },
      badminton_text: { color: "#70c2a7" },
      tabletennis_text: { color: "#2296f3" },
      ballhockey_text: { color: "#3d9bb7" },
      handball_text: { color: "#f24436" },
      americanfootball_text: { color: "#32850e" },
      cyberfootball_text: { color: "#1b1b1b" },
      futsal_text: { color: "#65b5c2" },
      biathlon_text: { color: "#65b5c2" },
      boxing_text: { color: "#2a8c4c" },
      rugbyleague_text: { color: "#799755" },
      cricket_text: { color: "#1bab7d" },
      cycling_text: { color: "#595959" },
      betslipOpenerContainer:{
        flex:1,
      },
      betslipOpenerContainerText: {
        width: '100%',
        lineHeight: 1,
        fontSize: 10,
        textAlign: 'center',
        overflow: 'hidden',
        flexDirection:'row',
        alignItems:'center',
        flex:1
      },
      betsCount: {
        position: 'absolute',
        fontSize: 10,
        borderRadius: 100,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#c38a2c',
        top: -3,
        right: 0,
        width: 20,
        height: 20,
      },
      betslipHeader: {
        color: "#fff",
        backgroundColor: "#026775",
        borderColor: "#018da0",
        
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
      },
      betModeBTN:{flex:1,padding:10,position:'relative',flexDirection:'row',alignItems:'center',backgroundColor:'#018da0',justifyContent:'center'},
      betSlipTypeSelected:{backgroundColor:'#013239'},
      betslipMatchInfo: {
        position: "relative",
        marginTop: 0,
        marginRight: 5,
        marginBottom: 5,
        padding: 0,
        borderRadius: 4,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#dedee0",
        backgroundColor: "rgba(24,114,60,.07)"
      },
      betslipMatchInfoTeamsBlock: {
        position: "relative",
        borderTopLeftRadius:4,
        borderTopRightRadius: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#ededf2",
        borderBottomWidth: 1,
        borderBottomColor: "#d5d5da",
        flexDirection:'row'
      },
      betslipMatchLeftBlock: {
        height: "100%",
        width: "100%",
        borderTopRightRadius: 4,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
      },
      betslipMatchRightBlock: {
        color: "rgba(51,51,51,.65)",
        backgroundColor: "#ededf2"
      },
      betslipMatchTeams: {
        position: "relative",
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 5,

      },
      selectionTeams: {
        fontSize: 14,
        fontWeight: "400",
        width: "100%",
        textAlign: "left",
        paddingBottom: 2,
        color: "rgba(51,51,51,.65)"
      },
      betslipMatchdetailsBlock: {
        minHeight: 35,
        borderTopRightRadius: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      },
      sbBetInfo: {
        margin: 0,
        padding: 8,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        position: "relative",
        flexDirection: "column",
        backgroundColor: "rgba(209,209,219,.9)"
      },
      sbEventOverlaySuspended: {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
      },
      sbEventOverlay: {
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        overflow: "hidden",
        zIndex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        color: "rgba(51,51,51,.65)",
        backgroundColor: "rgba(237,237,242,.9)",
        borderColor: "#dedee0",
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      suspendedContainer: { flexDirection: "column", justifyContent: "center" },
      sbEventOverlayInfo: {
        flex:1,
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
      },
      suspendedContainerPart: {
        paddingTop: 8,
        display: "flex",
        flexDirection: "row"
      },
      sbEventOverlayTitle: {
        fontWeight: "400",
        fontSize: 14,
        color:"rgba(51,51,51,.65)",
        textTransform: "uppercase"
      },
      sbBetInfoContent: {
        width: "100%",
        textAlign: "left",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row"
      },
      betslipMatchMarketType: { fontWeight: "500", color: "#707070" },
      betslipMatchOldCoeficiente: {
        textDecorationLine: "line-through",
        fontWeight: "400",
        color: "#ec583a"
      },
      sbetslipMatchCoeficiente: {
        color: "#018da0",
        fontWeight: "700",
        fontSize: 14
      },
      sbBetInputBlock: {
        width: "100%",
        marginTop: 8,
        marginBottom: 8,
        display: "flex",
        alignItems: "center",
        flexDirection: "row"
      },
      betslipMatchesTotalInfo:{
        paddingTop:3,
        paddingRight:8,
        paddingBottom:8
      },
      footerSbBetInputBlock:{
        marginTop:0,
        marginBottom:5,
        marginRight:8,
        marginLeft:8,
        flexDirection: 'row',
        alignItems: 'center',
      },
      sbInputInnerLabel:{
        height: 40,
        borderRadius: 4,
        fontWeight: '400',
        backgroundColor: '#fff',
        paddingLeft: 8,
        paddingRight: 8,
        display: 'flex',
      },
      sbBetResult:{
        width: '100%',
        justifyContent:'space-between',
      },
      sbBetReturn:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginLeft:8,
        marginRight:8
      },
      borderTop:{marginTop: 3,
        paddingTop: 3,
        borderTopWidth: 1,borderStyle: 'solid',borderTopColor: '#b7b5b5'},
      button: {
        width: "90%",
        height: 40,
        padding: 10,
        flexDirection:'row',
        alignItems: "center",
        justifyContent: "center",
        fontSize: 13,
        color: "#fff",
        borderRadius:6,
        backgroundColor: "#11c9e3",
        fontWeight: "600"
      },
      betBtnContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center"
      },
      bookingIdBlock: {
        width: "100%",
        height: 30,
        display: "flex",
        flexDirection: "row",
        paddingLeft:10,
        paddingRight:10,
        borderBottomWidth: 1,
        borderBottomColor:'#dedee0',
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#e8e8ec"
      },
      bookingText: { color: "#e8e8ec" },
      bookingId: { color: "#fff", paddingLeft: 10 },
      printBtn: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: 0
      },
      casinoGame: {
        paddingTop: 0 ,
        paddingRight: 2,
        paddingBottom: 5,
        paddingLeft: 5,
        margin: 0,
      } ,
      loadingP: {
        width: '100%',
        paddingTop: 5,
        paddingRight: 24,
        paddingBottom: 0,
        paddingLeft: 8,
        height: 35,
        display: 'flex',
        backgroundColor: '#fff',
        overflow: 'hidden',
        position: 'relative',
        margin: 0
      } ,
      imgLoading:{
        height: 160,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor:  '#fff',
        borderStyle: 'solid'
    }   
    }), stringReplacer= (search, pin, replace, matchTo = null, fallback = '')=> {
  var orgStr = search
  if (undefined !== orgStr && null !== orgStr) {
    if (null !== matchTo) {
      // matchTo =new RegExp(matchTo,'g')
      // console.log(matchTo)
      if (matchTo.test(orgStr))
        pin.forEach((searchPin, ind) => {
          orgStr = orgStr.replace(matchTo, fallback)
        })
      else
        pin.forEach((searchPin, ind) => {
          orgStr = orgStr.replace(searchPin, replace[ind])
        })
    } else pin.forEach((searchPin, ind) => {
      orgStr = orgStr.replace(searchPin, replace ? replace[ind] : '')
    })

    return orgStr
  } else return ''
},  dataStorage=(item, data = {}, type = 1) =>{
  
  if (typeof item === 'string' && item.length) {
    if (type === 1) {
      if (item === 'betSlip') {
        var betSlip = {}
        betSlip.bets = data
        betSlip.expires = moment().add(72, 'hours')
        AsyncStorage.setItem(item, JSON.stringify(betSlip))
      } else if (item === 'bookingNumber') {
        AsyncStorage.getItem('betSlip').then((betSlip)=>{
          if(betSlip) {
            betSlip=JSON.parse(betSlip)
            betSlip[item] = data
            AsyncStorage.setItem('betSlip', JSON.stringify(betSlip))
          }
        })
      }
      else
        AsyncStorage.setItem(item, JSON.stringify(data))
    } else if (type === 2) {
      AsyncStorage.removeItem(item)
    } else {
        return AsyncStorage.getItem(item)
    }
  }
}, arrayBuffer=(arr, size)=>{
  let a=[...arr],b=[]
  while(a.length){
      let obj = []
      for (let i = 0; i < size; i++) {
          if(a[i])obj.push(a[i]);
      }
      a= a.slice(size,a.length)
      b.push(obj)
  }
  return b
}
export const  EventIDToNameMap = {
  1: "Goal",
  2: "RedCard",
  3: "YellowCard",
  4: "Corner",
  5: "Penalty",
  6: "Substitution",
  10: "Period",
  20: "BallSafe",
  21: "DangerousAttack",
  22: "KickOff",
  23: "GoalKick",
  24: "FreeKick",
  25: "ThrowIn",
  26: "ShotOffTarget",
  27: "ShotOnTarget",
  28: "Offside",
  29: "GoalkeeperSave",
  30: "ShotBlocked",
  100: "NotStarted",
  101: "FirstHalf",
  102: "HalfTime",
  103: "SecondHalf",
  104: "PreExtraHalf",
  105: "ExtraTimeFirstHalf",
  106: "ExtraTimeHalfTime",
  107: "ExtraTimeSecondHalf",
  108: "Finished",
  199: "Timeout",
  200: "FirstSet",
  201: "SecondSet",
  202: "ThirdSet",
  203: "FourthSet",
  204: "FifthSet",
  205: "Point",
  206: "BallInPlay",
  207: "ServiceFault",
  208: "DoubleFault",
  209: "Ace",
  210: "InjuryBreak",
  211: "RainDelay",
  212: "Challenge",
  213: "FinalSet",
  214: "Let1stServe",
  215: "Retired",
  216: "Walkover",
  217: "Game",
  218: "Set",
  300: "FirstQuarter",
  301: "FirstQuarterEnded",
  302: "SecondQuarter",
  303: "SecondQuarterEnded",
  304: "ThirdQuarter",
  305: "ThirdQuarterEnded",
  306: "FourthQuarter",
  307: "FourthQuarterEnded",
  308: "OverTime",
  309: "OverTimeEnded",
  320: "Foul",
  321: "FreeThrow",
  322: "Free1Throw",
  323: "Free2Throws",
  324: "Free3Throws",
  325: "MissedFreeThrow",
  326: "Attack",
  327: "OnePoint",
  328: "TwoPoints",
  329: "ThreePoints",
  400: "FirstPeriod",
  401: "FirstPeriodEnded",
  402: "SecondPeriod",
  403: "SecondPeriodEnded",
  404: "ThirdPeriod",
  405: "ThirdPeriodEnded",
  410: "TimerStatus",
  420: "Suspension",
  421: "SuspensionOver",
  500: "Throw_In",
  501: "Throw_Out",
  502: "GoalKeeper_Throw",
  503: "Free_Throw",
  504: "SevenMeter_Throw",
  505: "PenaltyScored",
  506: "PenaltyMissed"
}
export const convertSetName= ()=>{
  var b = {
    Soccerset0: "1st Half",
    Soccerset1: "1st Half",
    Soccerset2: "2nd Half",
    Soccerset3: "Extra Time 1st Half",
    Soccerset4: "Extra Time 2nd Half",
    Soccerset5: "penalties",
    Soccerset6: "Full Time",
    CyberFootballset0: "1st Half",
    CyberFootballset1: "1st Half",
    CyberFootballset2: "2nd Half",
    CyberFootballset3: "Extra Time 1st Half",
    CyberFootballset4: "Extra Time 2nd Half",
    CyberFootballset5: "penalties",
    Socceradditional_time1: "Additional Time1",
    Socceradditional_time2: "Additional Time2",
    Soccerpenalty: "Penalty",
    Soccerfinished: "Finished",
    finished: "Finished",
    Soccerwait: "Waiting",
    Soccertimeout: "Timeout",
    Boxingset: "Round",
    Boxingset0: "Round 0",
    Boxingset1: "Round 1",
    Boxingset2: "Round 2",
    Boxingset3: "Round 3",
    Boxingset4: "Round 4",
    Boxingset5: "Round 5",
    Boxingset6: "Round 6",
    Boxingset7: "Round 7",
    Boxingset8: "Round 8",
    Boxingset9: "Round 9",
    Boxingset10: "Round 10",
    Boxingset11: "Round 11",
    Boxingset12: "Round 12",
    Tennisset: "Set",
    Tennisset0: "Set 0",
    Tennisset1: "Set 1",
    Tennisset2: "Set 2",
    Tennisset3: "Set 3",
    Tennisset4: "Set 4",
    Tennisset5: "Set 5",
    Tennisset6: "Set 6",
    Tennisset7: "Set 7",
    Tennisset8: "Set 8",
    Tennisset9: "Set 9",
    Tennisset10: "Set 10",
    IceHockeyset: "Period",
    IceHockeyset0: "Period 0",
    IceHockeyset1: "Period 1",
    IceHockeyset2: "Period 2",
    IceHockeyset3: "Period 3",
    IceHockeyset4: "Period 4",
    "E-IceHockeyset": "Period",
    "E-IceHockeyset0": "Period 0",
    "E-IceHockeyset1": "Period 1",
    "E-IceHockeyset2": "Period 2",
    "E-IceHockeyset3": "Period 3",
    "E-IceHockeyset4": "Period 4",
    EBasketballset: "Quarter",
    EBasketballset0: "Quarter 0",
    EBasketballset1: "1st Quarter",
    EBasketballset2: "2nd Quarter",
    EBasketballset3: "3rd Quarter",
    EBasketballset4: "4th Quarter",
    EBasketballset5: "OT",
    Basketballset: "Quarter",
    Basketballset0: "Quarter 0",
    Basketballset1: "1st Quarter",
    Basketballset2: "2nd Quarter",
    Basketballset3: "3rd Quarter",
    Basketballset4: "4th Quarter",
    Basketballset5: "OT",
    Volleyballset: "Set",
    Volleyballset0: "Set 0",
    Volleyballset1: "Set 1",
    Volleyballset2: "Set 2",
    Volleyballset3: "Set 3",
    Volleyballset4: "Set 4",
    Volleyballset5: "Set 5",
    Volleyballset6: "Set 6",
    Volleyballset7: "Set 7",
    Volleyballset8: "Set 8",
    Volleyballset9: "Set 9",
    Volleyballset10: "Set 10",
    Handballset: "Half",
    Handballset0: "0 Half",
    Handballset1: "1st Half",
    Handballset2: "2nd Half",
    Baseballset: "Inning",
    Baseballset0: "Inning 0",
    Baseballset1: "1st Inning",
    Baseballset2: "2nd Inning",
    Baseballset3: "3rd Inning",
    Baseballset4: "4th Inning",
    Baseballset5: "5th Inning",
    Baseballset6: "6th Inning",
    Baseballset7: "7th Inning",
    Baseballset8: "8th Inning",
    Baseballset9: "9th Inning",
    Baseballset10: "Extra Inning",
    Baseballset11: "11th Inning",
    Baseballset12: "12th Inning",
    Baseballset13: "13th Inning",
    Baseballset14: "14th Inning",
    Baseballset15: "15th Inning",
    Baseballset16: "16th Inning",
    Baseballset17: "17th Inning",
    Baseballset18: "18th Inning",
    Baseballset19: "19th Inning",
    Baseballset20: "20th Inning",
    Baseballset21: "21th Inning",
    Baseballset22: "22th Inning",
    Baseballset23: "23th Inning",
    Baseballset24: "24th Inning",
    Baseballset25: "25th Inning",
    BeachVolleyballset: "Set",
    BeachVolleyballset1: "Set 1",
    BeachVolleyballset2: "Set 2",
    BeachVolleyballset3: "Set 3",
    BeachSoccerset: "Period",
    BeachSoccerset1: "Period 1",
    BeachSoccerset2: "Period 2",
    BeachSoccerset3: "Period 3",
    BeachFootballset: "Period",
    BeachFootballset1: "Period 1",
    BeachFootballset2: "Period 2",
    BeachFootballset3: "Period 3",
    Rugbyset: "Time",
    Rugbyset0: "Time 0",
    Rugbyset1: "1st Half",
    Rugbyset2: "2nd Half",
    RugbyLeagueset: "Half",
    RugbyLeagueset1: "1st Half",
    RugbyLeagueset2: "2nd Half",
    RugbyUnionset: "Half",
    RugbyUnionset1: "1st Half",
    RugbyUnionset2: "2nd Half",
    Snookerset: "Frame",
    Snookerset0: "Frame 0",
    Snookerset1: "Frame 1",
    Snookerset2: "Frame 2",
    Snookerset3: "Frame 3",
    Snookerset4: "Frame 4",
    Snookerset5: "Frame 5",
    Snookerset6: "Frame 6",
    Snookerset7: "Frame 7",
    Snookerset8: "Frame 8",
    Snookerset9: "Frame 9",
    Snookerset10: "Frame 10",
    Snookerset11: "Frame 11",
    Snookerset12: "Frame 12",
    Snookerset13: "Frame 13",
    Snookerset14: "Frame 14",
    Snookerset15: "Frame 15",
    Snookerset16: "Frame 16",
    Snookerset17: "Frame 17",
    Snookerset18: "Frame 18",
    Snookerset19: "Frame 19",
    Snookerset20: "Frame 20",
    Snookerset21: "Frame 21",
    Snookerset22: "Frame 22",
    Snookerset23: "Frame 23",
    Snookerset24: "Frame 24",
    Snookerset25: "Frame 25",
    Snookerset26: "Frame 26",
    Snookerset27: "Frame 27",
    Snookerset28: "Frame 28",
    Snookerset29: "Frame 29",
    Snookerset30: "Frame 30",
    Snookerset31: "Frame 31",
    Snookerset32: "Frame 32",
    Snookerset33: "Frame 33",
    Snookerset34: "Frame 34",
    Snookerset35: "Frame 35",
    Snookerset36: "Frame 36",
    Snookerset37: "Frame 37",
    Snookerset38: "Frame 38",
    Snookerset39: "Frame 39",
    AmericanFootballset: "Quarter",
    AmericanFootballset0: "Quarter 0",
    AmericanFootballset1: "Quarter 1",
    AmericanFootballset2: "Quarter 2",
    AmericanFootballset3: "Quarter 3",
    AmericanFootballset4: "Quarter 4",
    AustralianFootballset: "Quarter",
    AustralianFootballset0: "Quarter 0",
    AustralianFootballset1: "Quarter 1",
    AustralianFootballset2: "Quarter 2",
    AustralianFootballset3: "Quarter 3",
    AustralianFootballset4: "Quarter 4",
    WaterPoloset: "Period",
    WaterPoloset0: "Period 0",
    WaterPoloset1: "Period 1",
    WaterPoloset2: "Period 2",
    WaterPoloset3: "Period 3",
    WaterPoloset4: "Period 4",
    WaterPoloset5: "Period 5",
    WaterPoloset6: "Period 6",
    MiniSoccerset: "Time",
    MiniSoccerset0: "Time 0",
    MiniSoccerset1: "1st Half",
    MiniSoccerset2: "2nd Half",
    BallHockeyset: "Period",
    BallHockeyset1: "Period 1",
    BallHockeyset2: "Period 2",
    TableTennisset: "Set",
    TableTennisset1: "Set 1",
    TableTennisset2: "Set 2",
    TableTennisset3: "Set 3",
    TableTennisset4: "Set 4",
    TableTennisset5: "Set 5",
    TableTennisset6: "Set 6",
    TableTennisset7: "Set 7",
    Badmintonset: "Game",
    Badmintonset1: "Game 1",
    Badmintonset2: "Game 2",
    Badmintonset3: "Game 3",
    Squashset: "Game",
    Squashset0: " 0",
    Squashset1: "Game 1",
    Squashset2: "Game 2",
    Squashset3: "Game 3",
    Squashset4: "Game 4",
    Squashset5: "Game 5",
    Netballset: "Quarter",
    Netballset1: "Quarter 1",
    Netballset2: "Quarter 2",
    Netballset3: "Quarter 3",
    Netballset4: "Quarter 4",
    Dotaset: "Game",
    Dotaset1: "Game-1",
    Dotaset2: "Game-2",
    Dotaset3: "Game-3",
    Dotaset4: "Game-4",
    Dotaset5: "Game-5",
    Dotaset6: "Game-6",
    Dotaset7: "Game-7",
    Dota2set: "Game",
    Dota2set1: "Game-1",
    Dota2set2: "Game-2",
    Dota2set3: "Game-3",
    Dota2set4: "Game-4",
    Dota2set5: "Game-5",
    Dota2set6: "Game-6",
    Dota2set7: "Game-7",
    CounterStrikeset: "Map",
    CounterStrikeset1: "Map 1",
    CounterStrikeset2: "Map 2",
    CounterStrikeset3: "Map 3",
    CounterStrikeset4: "Map 4",
    CounterStrikeset5: "Map 5",
    CounterStrikeset6: "Map 6",
    CounterStrikeset7: "Map 7",
    Hearthstoneset: "Game",
    Hearthstoneset1: "Game-1",
    Hearthstoneset2: "Game-2",
    Hearthstoneset3: "Game-3",
    Hearthstoneset4: "Game-4",
    Hearthstoneset5: "Game-5",
    Hearthstoneset6: "Game-6",
    Hearthstoneset7: "Game-7",
    HeroesOfTheStorm: "Game",
    HeroesOfTheStorm1: "Game-1",
    HeroesOfTheStorm2: "Game-2",
    HeroesOfTheStorm3: "Game-3",
    HeroesOfTheStorm4: "Game-4",
    HeroesOfTheStorm5: "Game-5",
    HeroesOfTheStorm6: "Game-6",
    HeroesOfTheStorm7: "Game-7",
    LeagueOfLegendsset: "Game",
    LeagueOfLegendsset1: "Game-1",
    LeagueOfLegendsset2: "Game-2",
    LeagueOfLegendsset3: "Game-3",
    LeagueOfLegendsset4: "Game-4",
    LeagueOfLegendsset5: "Game-5",
    LeagueOfLegendsset6: "Game-6",
    LeagueOfLegendsset7: "Game-7",
    LeagueofLegendsset: "Game",
    LeagueofLegendsset1: "Game-1",
    LeagueofLegendsset2: "Game-2",
    LeagueofLegendsset3: "Game-3",
    LeagueofLegendsset4: "Game-4",
    LeagueofLegendsset5: "Game-5",
    LeagueofLegendsset6: "Game-6",
    LeagueofLegendsset7: "Game-7",
    StarCraftset: "Map",
    StarCraftset1: "Map 1",
    StarCraftset2: "Map 2",
    StarCraftset3: "Map 3",
    StarCraftset4: "Map 4",
    StarCraftset5: "Map 5",
    StarCraftset6: "Map 6",
    StarCraftset7: "Map 7",
    StarCraft2set: "Map",
    StarCraft2set1: "Map 1",
    StarCraft2set2: "Map 2",
    StarCraft2set3: "Map 3",
    StarCraft2set4: "Map 4",
    StarCraft2set5: "Map 5",
    StarCraft2set6: "Map 6",
    StarCraft2set7: "Map 7",
    set: "Set",
    set0: "Set 0",
    set1: "Set 1",
    set2: "Set 2",
    set3: "Set 3",
    set4: "Set 4",
    set5: "Set 5",
    set6: "Set 6",
    set7: "Set 7",
    set8: "Set 8",
    set9: "Set 9",
    set10: "Set 10",
    set11: "Set 11",
    set12: "Set 12",
    set13: "Set 13",
    set14: "Set 14",
    set15: "Set 15",
    set16: "Set 16",
    set17: "Set 17",
    set18: "Set 18",
    set19: "Set 19",
    set20: "Set 20",
    Futsalset: "Half",
    Futsalset1: "1st Half",
    Futsalset2: "2nd Half",
    Futsalset3: "Extra Time 1st Half",
    Futsalset4: "Extra Time 2nd Half",
    Futsalset5: "penalties",
    MortalKombatXLset: "Game",
    MortalKombatXLset1: "Game 1",
    MortalKombatXLset2: "Game 2",
    MortalKombatXLset3: "Game 3",
    MortalKombatXLset4: "Game 4",
    MortalKombatXLset5: "Game 5",
    StreetFighterVset: "Game",
    StreetFighterVset1: "Game 1",
    StreetFighterVset2: "Game 2",
    StreetFighterVset3: "Game 3",
    StreetFighterVset4: "Game 4",
    StreetFighterVset5: "Game 5",
    Cricketset: "Innings",
    Cricketset0: "Innings 0",
    Cricketset1: "1st Innings",
    Cricketset2: "2nd Innings",
    Floorballset: "Period",
    Floorballset0: "Period 0",
    Floorballset1: "Period 1",
    Floorballset2: "Period 2",
    Floorballset3: "Period 3",
    Floorballset4: "Period 4",
    Hockeyset: "Period",
    Hockeyset0: "Period 0",
    Hockeyset1: "Period 1",
    Hockeyset2: "Period 2",
    Hockeyset3: "Period 3",
    Hockeyset4: "Period 4",
    Dartsset1: "Leg 1",
    Dartsset2: "Leg 2",
    Dartsset3: "Leg 3",
    Dartsset4: "Leg 4",
    Dartsset5: "Leg 5",
    "3x3 Basketballset1": "1st Period"
  };
  return function (a, f) {
    return void 0 !==
      b[f + a] ? b[f + a] : void 0 !== b[a] ? b[a] : a
  }
}
export const oddConvert = (b, a)=>{
  function f(a, b, d) {
    var e = a + Math.ceil((b - a) / 2);
    return 0 === e && h[e] > d || e === h.length - 1 && h[e] < d || h[e] < d && d < h[e + 1] ? h[e] : h[e] < d ? f(e, b, d) : f(a, e - 1, d)
  }

  function m(a) {
    function b(g, h, k) {
      h = void 0 !== h ? h : 1;
      k = void 0 !== k ? k : 0;
      d = 1 / (g - parseInt(g, 10));
      e = h * parseInt(d, 10) + k;
      f = Math.round(a * e);
      return f / e === a ? f.toString() + "/" + e.toString() : b(d, e, h)
    }
    var d, e, f;
    a = a !== parseInt(a, 10) ? parseFloat((parseInt(a, 10) - 1).toString() + "." + String(a).split(".")[1]) : a - 1;
    return 0 === a % 1 ? String(a) +
      "/1" : String(b(a))
  }

  function l(c, d) {
    var e = parseFloat(c),
      g = parseInt(c, 10),
      l = void 0 !== c && "" !== c ? Math.round(1E3 * parseFloat(c) || 0) / 1E3 : c;
    switch (d) {
      case "decimal":
        if (void 0 === c || "" === c) return c;
        e = b.main.decimalFormatRemove3Digit ? (a.mathCuttingFunction(100 * e) / 100).toFixed(2) : g !== e && c.toString().split(".")[1] && 2 < c.toString().split(".")[1].length ? Math.round(c * Math.pow(10, b.main.roundDecimalCoefficients)) / Math.pow(10, b.main.roundDecimalCoefficients) : e.toFixed(2);
        return b.main.notLockedOddMinValue ? e < b.main.notLockedOddMinValue ?
          1 : e : e;
      case "fractional":
        return c ? b.main.useLadderForFractionalFormat ? (k[e] || (e = f(0, h.length - 1, e)), e = k[e]) : e = m(l) : e = c, e;
      case "american":
        return c ? 2 < l ? "+" + Math.round(100 * (l - 1)) : 1 !== l ? Math.round(-100 / (l - 1)) : "-" : l;
      case "hongkong":
        return e = void 0 !== c && "" !== c ? g !== e && 2 < c.toString().split(".")[1].length ? Math.round((c - 1) * Math.pow(10, b.main.roundDecimalCoefficients)) / Math.pow(10, b.main.roundDecimalCoefficients) : (e - 1).toFixed(2) : c, b.main.decimalFormatRemove3Digit && (e = (a.mathCuttingFunction(100 * e) / 100).toFixed(2)),
          e;
      case "malay":
        return 2 === e ? "1.00" : 2 < e ? (Math.round((1 / (1 - e)).toFixed(b.main.roundDecimalCoefficients + 3) * Math.pow(10, b.main.roundDecimalCoefficients + 3)) / Math.pow(10, b.main.roundDecimalCoefficients + 3)).toFixed(b.main.roundDecimalCoefficients) : (e - 1).toFixed(b.main.roundDecimalCoefficients);
      case "indo":
        return 2 === e ? "1.00" : 2 < e ? (e - 1).toFixed(b.main.roundDecimalCoefficients) : (Math.round((1 / (1 - e)).toFixed(b.main.roundDecimalCoefficients + 3) * Math.pow(10, b.main.roundDecimalCoefficients + 3)) / Math.pow(10, b.main.roundDecimalCoefficients +
          3)).toFixed(b.main.roundDecimalCoefficients);
      default:
        return l
    }
  }
  var k = {
    "1.001": "1/1000",
    "1.002": "1/500",
    "1.004": "1/250",
    "1.005": "1/200",
    "1.01": "1/100",
    "1.015": "1/66",
    "1.02": "1/50",
    "1.03": "1/33",
    "1.04": "1/25",
    "1.05": "1/20",
    "1.06": "1/16",
    "1.07": "1/14",
    "1.08": "1/12",
    "1.09": "1/11",
    "1.1": "1/10",
    "1.11": "1/9",
    "1.13": "1/8",
    "1.14": "1/7",
    "1.15": "2/13",
    "1.17": "1/6",
    "1.18": "2/11",
    "1.2": "1/5",
    "1.22": "2/9",
    "1.25": "1/4",
    "1.27": "27/100",
    "1.28": "2/7",
    "1.3": "3/10",
    "1.31": "31/100",
    "1.33": "1/3",
    "1.34": "17/50",
    "1.36": "4/11",
    "1.37": "37/100",
    "1.4": "2/5",
    "1.41": "41/100",
    "1.44": "4/9",
    "1.45": "9/20",
    "1.47": "47/100",
    "1.48": "12/25",
    "1.5": "1/2",
    "1.51": "51/100",
    "1.53": "8/15",
    "1.54": "27/50",
    "1.55": "11/20",
    "1.57": "4/7",
    "1.58": "29/50",
    "1.6": "3/5",
    "1.62": "8/13",
    "1.63": "5/8",
    "1.64": "16/25",
    "1.66": "4/6",
    "1.67": "67/100",
    "1.7": "7/10",
    "1.71": "5/7",
    "1.72": "8/11",
    "1.73": "73/100",
    "1.75": "3/4",
    "1.76": "19/25",
    "1.79": "79/100",
    "1.8": "4/5",
    "1.81": "81/100",
    "1.83": "5/6",
    "1.84": "21/25",
    "1.87": "87/100",
    "1.88": "22/25",
    "1.9": "9/10",
    "1.91": "10/11",
    "1.92": "23/25",
    "1.95": "20/21",
    "1.96": "48/50",
    "1.99": "99/100",
    2: "1/1",
    "2.01": "101/100",
    "2.02": "51/50",
    "2.03": "103/100",
    "2.05": "21/20",
    "2.06": "53/50",
    "2.07": "107/100",
    "2.09": "109/100",
    "2.1": "11/10",
    "2.11": "111/100",
    "2.13": "113/100",
    "2.15": "23/20",
    "2.17": "117/100",
    "2.19": "119/100",
    "2.2": "6/5",
    "2.21": "121/100",
    "2.23": "123/100",
    "2.25": "5/4",
    "2.26": "63/50",
    "2.27": "127/100",
    "2.29": "129/100",
    "2.3": "13/10",
    "2.31": "131/100",
    "2.33": "133/100",
    "2.35": "27/20",
    "2.37": "137/100",
    "2.38": "11/8",
    "2.39": "139/100",
    "2.4": "7/5",
    "2.41": "141/100",
    "2.45": "29/20",
    "2.47": "147/100",
    "2.49": "149/100",
    "2.5": "6/4",
    "2.51": "151/100",
    "2.53": "153/100",
    "2.55": "31/20",
    "2.57": "157/100",
    "2.6": "8/5",
    "2.61": "161/100",
    "2.63": "13/8",
    "2.65": "33/20",
    "2.67": "167/100",
    "2.7": "17/10",
    "2.73": "173/100",
    "2.75": "7/4",
    "2.77": "177/100",
    "2.8": "9/5",
    "2.81": "181/100",
    "2.83": "183/100",
    "2.85": "37/20",
    "2.87": "187/100",
    "2.88": "15/8",
    "2.89": "189/100",
    "2.9": "19/10",
    "2.91": "191/100",
    "2.93": "193/100",
    "2.95": "39/20",
    "2.97": "197/100",
    3: "2/1",
    "3.01": "201/100",
    "3.03": "203/100",
    "3.07": "207/100",
    "3.1": "21/10",
    "3.13": "213/100",
    "3.17": "217/100",
    "3.2": "11/5",
    "3.21": "221/100",
    "3.25": "9/4",
    "3.27": "227/100",
    "3.3": "23/10",
    "3.33": "233/100",
    "3.37": "237/100",
    "3.4": "12/5",
    "3.41": "241/100",
    "3.45": "49/20",
    "3.5": "5/2",
    "3.51": "251/100",
    "3.55": "51/20",
    "3.6": "13/5",
    "3.61": "261/100",
    "3.65": "53/20",
    "3.7": "27/10",
    "3.71": "271/100",
    "3.75": "11/4",
    "3.76": "69/25",
    "3.8": "14/5",
    "3.81": "281/100",
    "3.85": "57/20",
    "3.9": "29/10",
    "3.91": "291/100",
    "3.95": "59/20",
    4: "3/1",
    "4.01": "301/100",
    "4.1": "31/10",
    "4.2": "16/5",
    "4.3": "33/10",
    "4.33": "10/3",
    "4.4": "17/5",
    "4.5": "7/2",
    "4.55": "71/20",
    "4.65": "73/20",
    "4.75": "15/4",
    "4.85": "77/20",
    "4.9": "39/10",
    5: "4/1",
    "5.1": "41/10",
    "5.2": "21/5",
    "5.3": "43/10",
    "5.4": "22/5",
    "5.5": "9/2",
    "5.6": "23/5",
    "5.7": "47/10",
    "5.8": "24/5",
    "5.9": "49/10",
    6: "5/1",
    "6.1": "51/10",
    "6.2": "26/5",
    "6.3": "53/10",
    "6.4": "27/5",
    "6.5": "11/2",
    "6.6": "28/5",
    "6.7": "57/10",
    "6.8": "29/5",
    "6.9": "59/10",
    7: "6/1",
    "7.1": "61/10",
    "7.2": "31/5",
    "7.3": "63/10",
    "7.4": "32/5",
    "7.5": "13/2",
    "7.6": "33/5",
    "7.7": "67/10",
    "7.8": "34/5",
    "7.9": "69/10",
    8: "7/1",
    "8.1": "71/10",
    "8.2": "36/5",
    "8.3": "73/10",
    "8.4": "37/5",
    "8.5": "15/2",
    "8.7": "77/10",
    "8.9": "79/10",
    9: "8/1",
    "9.1": "81/10",
    "9.3": "83/10",
    "9.5": "17/2",
    "9.7": "87/10",
    "9.9": "89/10",
    10: "9/1",
    "10.1": "91/10",
    "10.3": "93/10",
    "10.5": "19/2",
    "10.7": "97/10",
    "10.9": "99/10",
    11: "10/1",
    12: "11/1",
    13: "12/1",
    14: "13/1",
    15: "14/1",
    16: "15/1",
    17: "16/1",
    19: "18/1",
    21: "20/1",
    23: "22/1",
    26: "25/1",
    29: "28/1",
    34: "33/1",
    41: "40/1",
    51: "50/1",
    67: "66/1",
    71: "70/1",
    81: "80/1",
    91: "90/1",
    101: "100/1",
    126: "125/1",
    151: "150/1",
    201: "200/1",
    251: "250/1",
    301: "300/1",
    401: "400/1",
    501: "500/1",
    751: "750/1",
    1001: "1000/1",
    1501: "1500/1",
    2001: "2000/1",
    2501: "2500/1",
    3001: "3000/1",
    3501: "3500/1",
    4001: "4000/1"
  },
    d;
  if(b.main.showCustomNameForFractionalFormat) {d = {EVS: "1/1"}; k[2] = "EVS"}
  var h = Object.keys(k);
  h.sort(function (a, b) {
    return parseFloat(a) - parseFloat(b)
  });
  var g = {},
    e = "decimal fractional american hongkong malay indo".split(" ");
  return function (a, f, h, k, m) {
    if (null === a || void 0 === a || isNaN(a)) return a;
    if (1 === a) return null;
    b.main.specialOddFormat && b.main.specialOddFormat[f] &&
      (f = b.main.specialOddFormat[f].displayKey[k] || b.main.specialOddFormat[f].default);
    k = (f || b.env.oddFormat).concat(a);
    if(void 0 === g[k]) 
    {
      f = f || b.env.oddFormat;
       if(-1 === e.indexOf(f)) f = e[0];
       g[k] = "fractional" === f && "fictional" === h && b.main.useLadderForFractionalFormat && void 0 !== a ? Math.round(100 * parseFloat(a - 1) || 0) / 100 + "/1" : l(a, f)}
    return m && d[g[k]] ? d[g[k]] : g[k]
  }
}

export const sortDateByStartTimeASC = (a, b)=> {
  var anewDate = moment.unix(a.start_ts).format('YYYY-MM-DD H:mm');
  var bnewDate = moment.unix(b.start_ts).format('YYYY-MM-DD H:mm');
  if (moment(anewDate).isAfter(bnewDate)) {
    return 1;
  }
  if (moment(anewDate).isBefore(bnewDate)) {
    return -1;
  }
  return 0;
}
export const sortDateByStartTimeDesc = (a, b)=> {
  var anewDate = moment.unix(a.start_ts).format('YYYY-MM-DD H:mm');
  var bnewDate = moment.unix(b.start_ts).format('YYYY-MM-DD H:mm');
  if (moment(anewDate).isAfter(bnewDate)) {
    return -1;
  }
  if (moment(anewDate).isBefore(bnewDate)) {
    return 1;
  }
  return 0;
}

