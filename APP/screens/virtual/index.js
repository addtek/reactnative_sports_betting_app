import React,{useEffect,useState} from 'react'
import { dataStorage } from '../../common'
import { ScrollView, ActivityIndicator } from 'react-native';
import WebView from 'react-native-webview';
 const VirtualSports=(props)=>{
    const  [loading,setLoaded]= useState(''); let  authorize = '';
    let iframeRef = null;
   useEffect(()=>{
       if(!props.appState.isLoggedIn){
           authorize=``
           setLoaded(authorize)
           null!== iframeRef && iframeRef.reload()
       }
       else dataStorage('loginState',{},0)
       .then(userData=>{
       if(userData)
       {
           userData = JSON.parse(userData)
       if (userData.id && userData.AuthToken) {
           authorize=`&authToken=${encodeURIComponent(userData.AuthToken)}&UserId=${encodeURIComponent(userData.id)}`
           setLoaded(authorize)
           null!== iframeRef &&iframeRef.reload()
       }else{
           authorize=``
           setLoaded(authorize)
           null!== iframeRef &&iframeRef.reload()
       }}
   
   })},[props.appState.isLoggedIn])
    return(                  
        <ScrollView contentContainerStyle={{flex:1}}>
        <WebView 
        ref={(e)=>iframeRef=e}
        source={{uri:`https://mobile.somedsomain.com/virtual-sports?${authorize}&lang=${props.appState.lang}`}} 
        startInLoadingState={true}
        renderLoading={()=><ActivityIndicator size="large" color="#11c9e3" />}/>
        </ScrollView>
        )
  }
  export default VirtualSports