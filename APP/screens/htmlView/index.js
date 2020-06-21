import React,{useEffect,useState} from 'react'
import {ActivityIndicator, View,ScrollView,Text } from 'react-native';
import WebView from 'react-native-webview';
import API from '../../services/api'
 const $api = API.getInstance()
 const HTMLView=(props)=>{
    const  [content,setContent]= useState(null); let  authorize = '';
    let iframeRef = null;
   useEffect(()=>{
    const {page}=props.navigation.state.params ?props.navigation.state.params:{};
    if(void 0!==page && null!==page){
        $api.getInfoView({id:page})
        .then(({data})=>{
            setContent(data.data)
        })
    }
},[])
    return(                  
        content!==null?
        <ScrollView
        contentContainerStyle={{flex:1}}
        >
            <WebView 
            ref={(e)=>iframeRef=e}
            style={{padding:20}}
            source={{html:`<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>
            <div style="padding:20px;background-color:rgba(209,209,219,.9);display:flex;flex-direction:row;align-items:center;justify-content:center;">
            <span style="font-size:30px;font-weight:700">${content.post_title}</span>
           </div>
            ${content.post_content}</body></html>`}} 
            startInLoadingState={true}
            renderLoading={()=><ActivityIndicator size="large" color="#11c9e3" />}/>
        </ScrollView>
        :
        <View></View>
        )
  }
  export default HTMLView