import React,{PureComponent} from 'react'
import Carousel,{Pagination} from 'react-native-snap-carousel';
import {PagingDotsCustom,PreviousSlide,NextSlide} from '../stateless';
import { StyleSheet,Dimensions,View,Image } from 'react-native';
let { width,height}= Dimensions.get('window')

export default class SlotGameBanner extends PureComponent{
   constructor(props){
     super(props)
     this.state={
      currentSlideIndex: 0
     }
     this.bannerRef = React.createRef()
     this.options = {
      slidesToShow: 1,
      autoplay: true,
      transitionMode:"scroll",
      autoplayInterval:5000,
      pauseOnHover:true
  }
  this.handleAfterSlide = this.handleAfterSlide.bind(this);
   }
   _renderItem({item}){

    return <View style={{flex:1,width:'100%'}}  ><Image	source={ {uri:item.image} } style={styles.stretch}/></View>
  }
   handleAfterSlide(newSlideIndex) {
		this.setState({
			currentSlideIndex: newSlideIndex
		});
	}
  get pagination () {
    const {currentSlideIndex } = this.state, {photos} = this.props
    return (
        <Pagination
          dotsLength={photos.length}
          activeDotIndex={currentSlideIndex}
          tappableDots={true}
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
  const {photos} = this.props;

    return(
        <View>
          <Carousel
      ref={ (e)=>this.bannerRef= e}
      data={photos}
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
  }})