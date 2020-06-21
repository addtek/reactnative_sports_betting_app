import React,{PureComponent} from 'react'
import API from '../../services/api'
import SlotGamesBanner from '../../components/slotgamebanner'
import { allActionDucer } from '../../actionCreator'
import {CasinoLoading} from '../../components/loader'
import { SPORTSBOOK_ANY, PLAY_GAME, QUIT_GAME,GAME_BANNER } from '../../actionReducers'
import GamePlayMode from './slotGameITem'
import { View, ScrollView, FlatList, TouchableOpacity,Text,TextInput,Image, TouchableNativeFeedback, SafeAreaView } from 'react-native'
import { viewStyles, dataStorage } from '../../common'
import { ActionSheet } from 'native-base'
import CustomIcon from '../../components/customIcon'
import { withNavigationFocus } from 'react-navigation'
import { LayoutAnimation } from 'react-native'
const $api = API.getInstance()
 class SlotGames extends PureComponent{
    constructor(props){
        super(props)

        this.state={
            loadingInitailData:false,
            games:[],
            loadingGames:true,
            categories:[],
            loadingCategories:true,
            providers:[],
            loadingProviders:true,
            loadingMore:false,
            gameCurrentPage :1,
            game:{playtype:'',extearnal_game_id:null},
            wantToPlay:false,
            activeCat:'all',
            activePro:'all',
            hidePro:false,
            keyword:''
        }
         this.playGame= this.playGame.bind(this)
         this.searchGames= this.searchGames.bind(this)
         this.closeGame= this.closeGame.bind(this)
         this.togglePlayForReal= this.togglePlayForReal.bind(this)
         this.filterGamesByCategory= this.filterGamesByCategory.bind(this)
         this.filterGamesByCategory= this.filterGamesByCategory.bind(this)
         this.filterGamesByProivder= this.filterGamesByProivder.bind(this)
         $api.getBanners({bid:25},this.bannersResult.bind(this),this.onError.bind(this))
    }
    componentDidMount() {
        $api.getSlotGames({reqType:'post'},this.handleCasinoGames.bind(this))
        $api.getSlotGames({reqType:'get',pro:''},this.handleCategories.bind(this))
        $api.getSlotGameProviders(null,this.handleProviders.bind(this))
        this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { activeView: 'Casino', loadSports: true }))
    
    }
    componentDidUpdate() {
        const {isFocused} = this.props
        if(isFocused){
            const game = this.props.navigation.state.params?this.props.navigation.state.params.game:null
                
            if(this.props.appState.isLoggedIn && !this.state.wantToPlay && this.state.game.extearnal_game_id!==null){
                this.props.dispatch(allActionDucer(PLAY_GAME,{playMode:true}))
                this.setState({wantToPlay:true})
            }else if(game && !this.state.wantToPlay){
                this.playGame(game)
                this.props.navigation.setParams({game: null});
            }
        }

        
    }
    componentWillUnmount() {
         
    }
    bannersResult({data}){
        this.props.dispatch(allActionDucer(GAME_BANNER,data.data))
    }
    onError(d){
        // console.log(d)
    }
    togleProviders(){
        LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
        this.setState(prevState=>({hidePro: !prevState.hidePro}))
    }
    playGame(game){
        if(game.playtype === 'fun')
        {
            this.props.dispatch(allActionDucer(PLAY_GAME,{playMode:true}))
            this.setState({wantToPlay:true,game:game})
        }
        else{
            if(this.props.appState.isLoggedIn){
                dataStorage('loginState',{},0)
                .then(userData=>{
                if(userData)
                {
                 userData = JSON.parse(userData)
                 if (userData.id && userData.AuthToken) {
                     this.setState({wantToPlay:this.props.appState.isLoggedIn,game:{...game, token:userData.AuthToken}})
                     this.props.dispatch(allActionDucer(PLAY_GAME,{playMode:true}))
                }
            }
            })
            }
             else this.props.navigation.navigate('login')
        }
    }
    closeGame(){
        this.props.dispatch(allActionDucer(QUIT_GAME,{playMode:false}))
        this.setState({wantToPlay:false,game:{playtype:'',extearnal_game_id:null}})
    }
    togglePlayForReal(){
      let {game}= this.state,token=null
      if(this.props.appState.isLoggedIn){
        dataStorage('loginState',{},0)
        .then(userData=>{
        if(userData)
        {
         userData = JSON.parse(userData)
         if (userData.id && userData.AuthToken) {
            token= userData.AuthToken
        }
        }
        this.setState({game:{...game,playtype:game.playtype ==='real'? 'fun':'real',token:token}})
        })
    }
     else {
        this.setState({wantToPlay:false})
        this.props.navigation.navigate('login')
     }
    }
    handleCasinoGames({data}){
        // const  g = this.state.games.slice(0,this.state.games.length)
        data.data.length ? this.setState({games:data.data,loadingGames:false}):this.setState({loadingGames:false})
    }
    handleMoreCasinoGames({data}){
        const  g = this.state.games.slice(0,this.state.games.length)
        data.data.length ? this.setState({games:[...g,...data.data],loadingMore:false}):this.setState({loadingMore:false})
    }
    handleProviders({data}){
        this.setState({providers:data.data,loadingProviders:false})
    }
    handleCategories({data}){
        this.setState({categories:data.data,loadingCategories:false})
    }
    loadMore(){
        const {gameCurrentPage,activePro,activeCat,keyword}=this.state
        let params = {reqType:'post'}
        activeCat !== 'all' && (params.cate=activeCat)
        activePro !=='all' && (params.pro=activePro)
        keyword.length>0 && (params.keyword=keyword)
        $api.getSlotGames({page:gameCurrentPage+1,...params},this.handleMoreCasinoGames.bind(this))
        this.setState({gameCurrentPage:gameCurrentPage+1,loadingMore:true})
    }
    filterGamesByProivder(provider){
        // const{activePro,activeCat}=this.state
        let params = {reqType:'post'}
        provider !== 'all' && (params.pro=provider)
        this.setState({activePro:provider,activeCat:'all',keyword:'',loadingGames:true,gameCurrentPage:1})
        $api.getSlotGames(params,this.handleCasinoGames.bind(this))
        $api.getSlotGames({reqType:'get',pro:params.pro},this.handleCategories.bind(this))
    }
    filterGamesByCategory(category){
        const{activePro,keyword}=this.state
        let params = {reqType:'post'}
        category !== 'all' && (params.cate=category)
        activePro !=='all' && (params.pro=activePro)
        keyword.length>0 && (params.keyword=keyword)
        this.setState({activeCat:category,loadingGames:true})
        $api.getSlotGames(params,this.handleCasinoGames.bind(this))
    }
    searchGames(e){
        const{activePro,activeCat}=this.state,val=e
        let params = {reqType:'post'}
        activeCat !== 'all' && (params.cate=activeCat)
        activePro !=='all' && (params.pro=activePro)
        val.length>0 && (params.keyword=val)
        this.setState({keyword:val,loadingGames:true})
        $api.getSlotGames(params,this.handleCasinoGames.bind(this))
    }
    showCasinoGameAction(game){
        const BUTTONS = ["PLAY FOR REAL", "PLAY FOR FUN", "Cancel"],CANCEL_INDEX = 2;
        ActionSheet.show(
            {
                options: BUTTONS,
                cancelButtonIndex: CANCEL_INDEX,
                title: game.name
            },
            buttonIndex => 
                buttonIndex !== CANCEL_INDEX&&this.playGame({...game,playtype:buttonIndex===0?'real':'fun'})
            
            )
      }
    render(){
         const{GamesBanner}=this.props,{loadingGames,games,providers,categories,hidePro,game,wantToPlay,activeCat,activePro,keyword}=this.state
          let pros = [{title:'All',provider:'all'},...providers],mGames = games%2===0?games:[...games,{extearnal_game_id:12121212121212121212}]
         return(
            <View style={{flex:1}}>
              <GamePlayMode visible={wantToPlay} game={game} onClose={this.closeGame} togglePlayForReal={this.togglePlayForReal}/>
            <SlotGamesBanner photos={GamesBanner}/>
                <View>
                    <View style={{flexDirection:'row',alignItems:'center',height:40,backgroundColor:'#fff',borderBottomColor:'#026775',borderBottomWidth:1}}>
                        <View style={{flex:1,paddingLeft:10,paddingRight:10}}><Text style={{color:'#026775',fontSize:14,fontWeight:'700',textTransform:'uppercase'}}>Game providers</Text></View>
                        <View  style={{flex:1}}>
                            <View style={{backgroundColor:'#d1d1d4',color:'#fff',borderRadius:4}}>
                                <TextInput placeholder="Search Games"
                                ref={(el) => { this.searchTicketInput = el }} style={{backgroundColor:'#d1d1d4', width: '100%', paddingLeft:15 }} 
                                value={keyword}
                                onChangeText={this.searchGames}
                                />
                            
                            </View>
                        </View>
                            <TouchableNativeFeedback useForeground={TouchableNativeFeedback.canUseNativeForeground()} onPress={this.togleProviders.bind(this)}>
                            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',width:30,height:'100%'}}>
                                <CustomIcon name={hidePro?'arrow-down':'arrow-up'} color="#333" size={18} />
                            </View>
                            </TouchableNativeFeedback>
                    </View>
                    {!hidePro&&<View style={{borderBottomColor:'#026775',borderBottomWidth:1,backgroundColor:'#d1d1d4'}}>
                        <FlatList numColumns={3}
                        data={pros}
                        keyExtractor={(item,index)=>index.toString()}
                        renderItem={({item})=><View style={{flex:1,width:'100%'}}><TouchableOpacity onPress={()=>this.filterGamesByProivder(item.provider)}>
                        <View style={[{flex:1,height:30,paddingLeft:5,paddingRight:5,borderRadius:5,backgroundColor:'#e8e8ec',marginLeft:5,marginBottom:2,marginRight:5,marginTop:2,justifyContent:'center',alignItems:'center',flexDirection:'row'},activePro === item.provider && viewStyles.catactive]}><Text>{item.title}</Text></View></TouchableOpacity></View>
                            
                        }
                        />
                    </View>}

                </View>
                <View >
                        <ScrollView style={{margin:0}} horizontal={true} showsHorizontalScrollIndicator={false}>
                        <TouchableOpacity onPress={()=>this.filterGamesByCategory('all')}>
                            <View  style={[activeCat === 'all' && viewStyles.catactive,{flexDirection:'row',alignItems:'center',justifyContent:'center',minWidth:55,height:40,backgroundColor: '#026775',borderRadius:10,margin:5,paddingLeft:10,paddingRight:10}]}><Text style={{color:'#fff'}}>All</Text></View>
                        </TouchableOpacity>
                        {
                            categories.map((category,key)=>{
                                return(
                            <TouchableOpacity key={key} onPress={()=>this.filterGamesByCategory(category.id)}>
                                <View style={[activeCat === category.id && viewStyles.catactive,{flexDirection:'row',alignItems:'center',justifyContent:'center',minWidth:55,height:40,backgroundColor: '#026775',borderRadius:10,margin:5,paddingLeft:10,paddingRight:10}]}><Text style={{color:'#fff'}}>{category.title}</Text></View></TouchableOpacity>
                                )
                            })
                        }
                        </ScrollView>
                    </View>

                                            
        {
            loadingGames?
        
                <CasinoLoading/>
            
            :
            <FlatList
                data={mGames}
                keyExtractor={(item)=>item.extearnal_game_id.toString()}
                renderItem={({item,index})=>item.icon?<TouchableNativeFeedback onPress={()=>this.showCasinoGameAction(item)}><View style={{flex:1,position:'relative',display:'flex',flexDirection:'row',minHeight:150,justifyContent:'space-between',padding:3}}>
                <View style={[viewStyles.casinoItem]}>
                <Image style={[viewStyles.casinoItemImg,{height:'100%'}]} source={{uri:item.icon}} />
                </View>
                </View></TouchableNativeFeedback>:<View style={{flex:1,position:'relative',display:'flex',flexDirection:'row',minHeight:150,justifyContent:'space-between',padding:3}}></View>}
                numColumns={2}
                onEndReached={this.loadMore.bind(this)}
                onEndReachedThreshold={0.8}
                initialNumToRender={10}
            />
                }
        </View>
        )
    }
}

export default withNavigationFocus(SlotGames)