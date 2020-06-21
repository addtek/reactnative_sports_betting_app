import React,{PureComponent} from 'react'
import {stringReplacer, viewStyles} from '../../common'
import { View, Text,TouchableNativeFeedback } from 'react-native'
import CustomIcon from '../customIcon'
import { Item, Picker, Icon, ListItem, Left, Right, Radio,Form } from 'native-base'
import Dialog from 'react-native-dialog'
export const CheckBox = (props) => {
    return (
      <label className="container">{props.text}
        <input type="checkbox" checked={props.checked} onChange={(e) => { props.onChange(e, props.id) }} />
        <Text className="checkmark"></Text>
      </label>
    )
  }
export class PagingDotsCustom extends PureComponent{

  getIndexes(count, inc) {
    const arr = [];
    for (let i = 0; i < count; i += inc) {
      arr.push(i);
    }
    return arr;
  }
  render(){

    const styles = {
      listStyles: {
        position: 'relative',
        margin: 0,
        top: -5,
        display: "inline-block",
        padding: 5,
        backgroundColor: "rgba(0,0,0,.2)",
        borderRadius:10,
      },
      listItemStyles: {
        display: "inline-block",
        width: 10,
        height: 10,
        margin: "0 3px",
        fontSize: 14,
        backgroundColor: "#e2e2e2",
        borderRadius: 5,
      }
    },{props}=this,custom={listStyles:{},listItemStyles:{}}
    if(props.style){
      Object.keys(props.style).forEach((key)=>{
        custom[key] = props.style[key]
      })
    }
    return(
  <ul style={{...styles.listStyles,...custom.listStyles}}>
    {this.getIndexes(props.slideCount, props.slidesToScroll).map(index => {
      return (
        <li style={{...styles.listItemStyles,...custom.listItemStyles,backgroundColor:props.currentSlide === index ? "#fff" : "rgba(255,255,255,.5)"}} key={index} onPress={props.goToSlide.bind(null, index)}>
        </li>
      );
    })}
  </ul>
    )
  }
}
export  class PreviousSlide extends PureComponent{

  render(){
    return(
      <button className="carousel-arrow left icon-icon-left" onPress={this.props.previousSlide}></button>
    )
  }
}
export class NextSlide extends PureComponent{

  render(){
    return(
      <button className="carousel-arrow right icon-icon-right" onPress={this.props.nextSlide} ></button>
    )
  }
}
export const BetSlipNotification = (props) => {
  return (
    <Dialog.Container visible={props.canNotify} onBackdropPress={props.onClose}>
          <Dialog.Title>Betslip notification</Dialog.Title>
          <View>
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
            <View style={{flex:1}}>
              <CustomIcon name={props.type==="success"?"check-circle":props.type} size={30} {...viewStyles[props.type]}/>
            </View>
            <View style={{flex:5}}>
              {
               (typeof  props.message == "string")?
                <Text className="message-text">{props.message}</Text>
                :
                props.message
              }
            </View>
            </View>
          </View>
          {
            props.isOddChange !==null &&  <Dialog.Button label="Accept and place bet" onPress={props.isOddChange}/>
          }
          {
            props.lowBalance && <Dialog.Button label="Deposit" onPress={props.onLowBalance}/>
          }
          <Dialog.Button label="Close" onPress={props.onClose}/>
    </Dialog.Container>
  )
}
export const SportItem = ({onClick,activeID,s,i,is_live})=>{
   let styleP= [viewStyles.sport,{backgroundColor: '#11c9e3',marginRight:3,borderRadius:4,flexDirection:'row',height:40},activeID === s.id || (null === activeID && i === 0) ?viewStyles[`${stringReplacer(s.alias, [/\s/g, /\d.+?\d/g, /\(.+?\)/g], ['', '', '']).toLowerCase()}`]:{}],styleT=[viewStyles.promotionSportBackground,viewStyles.sportBackgroundTop,viewStyles[`${stringReplacer(s.alias, [/\s/g, /\d.+?\d/g, /\(.+?\)/g], ['', '', '']).toLowerCase()}`]];
   (activeID === s.id || (null === activeID && i === 0)) && styleP.push(viewStyles.active)
  return(
    <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} onPress={(e)=>{onClick(s.id)}}>
    <View style={styleP}>
      <View style={styleT}></View>
      <CustomIcon style={{color:'#fff'}} name={stringReplacer(s.alias, [/\s/g, /\d.+?\d/g, /\(.+?\)/g], ['', '', ''])} size={25}/>
      {activeID ===s.id || (null === activeID && i === 0) ? <Text style={viewStyles.sportName}>{s.name}</Text> : null}
    </View>
    </TouchableNativeFeedback>
  )
}
export const SportsbookSportItem = ({onClick,activeID,s,i,is_live,type})=>{
  let sportTextColor=`${stringReplacer(s.alias, [/\s/g, /\d.+?\d/g, /\(.+?\)/g], ['', '', '']).toLowerCase()}_text`, styleP= [viewStyles.sport],styleT=[viewStyles.sportBackground,viewStyles[`${stringReplacer(s.alias, [/\s/g, /\d.+?\d/g, /\(.+?\)/g], ['', '', '']).toLowerCase()}`],{opacity:activeID === s.id?1:0}]
  return(
    <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} onPress={(e)=>{onClick(s)}}>
    <View style={styleP}>
      <View><View style={{zIndex:2,position:'absolute',top:5,right:-12,paddingLeft:2,paddingRight:2,backgroundColor:'#11c9e38c',borderRadius:5}}><Text style={viewStyles.count}>{s.game}</Text></View>
      <CustomIcon style={[{color:'#fff'},(activeID === s.id )&&viewStyles[sportTextColor]]} name={stringReplacer(s.alias, [/\s/g, /\d.+?\d/g, /\(.+?\)/g], ['', '', ''])} size={25}/>
      </View>
      <Text style={[viewStyles.sportName,(activeID === s.id )&&viewStyles[sportTextColor]]}>{s.name}</Text>
      {is_live && (activeID === s.id) && <View style={styleT}></View>}
    </View>
    </TouchableNativeFeedback>
  )
}

export const OddsSettings = (props) => {
  return (
    <View className="odd-settings">
      <View className="odd-settings-title">
        <Text style={{fontSize:14}}>{props.title}</Text>
      </View>
      <View className="sb-radio-group">
      {
        props.custom ?
      
          <ListItem button  onPress={()=>props.onChange(2)}>
            <Left>
              <Text style={{fontSize:13,color:'#026775'}}>Accept any odds</Text>
            </Left>
            <Right>
              <Radio selected={props.value === 2}  onPress={()=>props.onChange(2)}/>
            </Right>
          </ListItem>
          : props.customInput? 
          props.customInput.map((input,id)=>{
             return (
              <ListItem button  onPress={()=>props.onChange(input.id)}>
              <Left>
                <Text style={{fontSize:13,color:'#026775'}}>{input.amount}</Text>
              </Left>
              <Right>
                <Radio selected={props.value.id === input.id} onPress={()=>props.onChange(input.id)}/>
              </Right>
            </ListItem>
             )
          })
          :
          <>
          <ListItem button  onPress={()=>props.onChange(1)}>
         
              <Left>
                <Text style={{fontSize:13,color:'#026775'}}>Accept higher odds</Text>
              </Left>
              <Right>
                <Radio selected={props.value === 1} onPress={()=>props.onChange(1)} />
              </Right>
           
            </ListItem>
          <ListItem button  onPress={()=>props.onChange(2)}>
              <Left>
                <Text style={{fontSize:13,color:'#026775'}}>Accept any odds</Text>
              </Left>
              <Right>
                <Radio selected={props.value === 2}  onPress={()=>props.onChange(2)}/>
              </Right>
            </ListItem>
          <ListItem button  onPress={()=>props.onChange(0)}>
                <Left>
                <Text style={{fontSize:13,color:'#026775'}}>Always ask</Text>
              </Left>
              <Right>
                <Radio selected={props.value === 0} onPress={()=>props.onChange(0)}/>
              </Right>
            </ListItem>
          </>
        }
      </View>
    </View>
  )
}
export const OddsType = (props) => {
  return (
    <View className="odd-types">
      <View className="ember-view">
        <View className="ember-view">
        <Form>
            <Item picker>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={{ width: undefined,height:30 }}
                placeholder="Odds Type"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue={props.value}
                onValueChange={props.onChange}
              >
                <Picker.Item  label="Decimal" value="decimal" />
                <Picker.Item label="Fractional" value="fractional" />
                <Picker.Item label="American" value="american" />
                <Picker.Item label="Hongkong" value="hongkong" />
                <Picker.Item label="Malay" value="malay" />
                <Picker.Item label="indo" value="Indo" />
                
              </Picker>
            </Item>
          </Form>
        </View>
      </View>
    </View>
  )
}