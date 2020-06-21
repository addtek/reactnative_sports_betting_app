import React, {PureComponent} from 'react'
import Carousel,{Pagination} from 'react-native-snap-carousel';
import {PagingDotsCustom,PreviousSlide,NextSlide} from '../stateless';
import { View,Image, Text, ToastAndroid, StyleSheet,Dimensions} from 'react-native';
let {width,height}= Dimensions.get('window')

export default class HomeBanner extends PureComponent{
   constructor(props){
     super(props)
     this.state={
      currentSlideIndex: 0
     }
     this.bannerRef = null
     this.options = {
      slidesToShow: 1,
      autoplay: true,
      transitionMode:"scroll",
      autoplayInterval:5000,
      pauseOnHover:true
  }
  this.sendBannerToGame = this.sendBannerToGame.bind(this);
   }
   sendBannerToGame(data) {
    this.props.history.replace(`${data.url}/${data.sport.alias}/${data.region.name}/${data.competition.id}/${data.game.id}`,{sport:data.sport,region:data.region,competition:data.competition,game:data.game})
  }
  _renderItem({item}){

    return item.slide_id=== 26? <View style={{flex:1,width:'100%'}}  onPress={(e)=>{this.sendBannerToGame({url:item.url,...JSON.parse(item.description)})}}><Image	source={ {uri:item.image} } style={styles.stretch}/></View>:<View style={{flex:1,width:'100%'}} ><Image style={styles.stretch}	source={{uri:item.image}}/></View>
  }
  get pagination () {
    const {currentSlideIndex } = this.state, {photos,featured_banner} = this.props,homebanners = [...photos,...featured_banner];
    return (
        <Pagination
          dotsLength={homebanners.length}
          activeDotIndex={currentSlideIndex}
          tappableDots
          carouselRef={this.bannerRef}
          containerStyle={{backgroundColor: 'rgba(0, 0, 0, 0.2)', position:'absolute',bottom:2,left:2,height:0,padding:0, marginHorizontal: 0,
              marginVertical:0,
              paddingVertical:10,
              paddingHorizontal:10,borderRadius: 10}}
          dotContainerStyle={{padding:0,height:10,margin:0,padding:0,marginHorizontal: 3,
            marginVertical:0,
            paddingVertical:0,
            paddingHorizontal:0,}}
          dotStyle={{
              width: 10,
              height: 10,
              borderRadius: 5,
              marginHorizontal: 0,
              marginVertical:0,
              paddingVertical:0,
              paddingHorizontal:0,
              backgroundColor: 'rgba(255, 255, 255, 0.92)'
          }}
          inactiveDotStyle={{
              // Define styles for inactive dots here
          }}
          inactiveDotOpacity={0.5}
          inactiveDotScale={1}
        />
    );
}
 render (){
  const { isSlideshowMode = false,photos,featured_banner} = this.props,homebanners = [...photos,...featured_banner];
  
  homebanners.sort((a,b)=>{
     if(a.list_order > b.list_order)
     return 1
     if(a.list_order < b.list_order)
     return -1
     return 0
  })
    return(
    <View>
    <Carousel
      ref={ (e)=>this.bannerRef= e}
      data={homebanners}
      renderItem={this._renderItem.bind(this)}
      onSnapToItem={(index) => this.setState({ currentSlideIndex: index }) }
      sliderWidth={width}
      itemWidth={width}
      loop={true}
      autoplay={true}
      autoplayDelay={3000}
      autoplayInterval={5000}
      lockScrollWhileSnapping={true}
      layout={'default'}
      firstItem={0}
    />
    { this.pagination }
    </View>
    )
   }
   
 }
 const styles = StyleSheet.create({
  stretch: {
    width: width,
    height: 120,
    resizeMode: 'stretch'
  }
});