import {connect} from 'react-redux'
import component from '../../../App'
import AsyncStorage from '@react-native-community/async-storage'
import { allActionDucer, appStateActionDucer } from '../../actionCreator'
import { SPORTSBOOK_ANY, APPREADY } from '../../actionReducers'
import RNFetchBlob from 'rn-fetch-blob'
import { getVersion} from 'react-native-device-info'
import axios from 'axios'
import API from '../../services/api'
import { PermissionsAndroid,Platform } from 'react-native'
const $api = API.getInstance()
const mapStateToProps  = (state, ownProps)=>{
 return {
     appState: state.appState,
     sportsbook :state.sportsbook,
     profile:state.profile,
     liveData:state.liveData,
     prematchData:state.prematchData,
     sb_modal:state.sb_modal,
     betslip:state.betslip,
     competionData:state.competionData,
     gameViewData:state.gameViewData,
     betsHistoryData:state.betsHistoryData,
     homeData:state.homeData,
 }
}
const requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: "Storage Permission",
        message:
          "We needs access to your device storage " +
          "so we can keep your app updated.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED
    
  } catch (err) {
    return false
  }
};

const mpaDispatchToProps=(dispatch,ownProps)=>{
  return {
    dispatch:dispatch,
    loadApp:()=>{
      return new Promise ((resolve,reject)=>{
      // Platform.OS ==='android'&&axios.post('https://app.yourdomain.com/app.php/version',{installed_version:getVersion()}).then(({data})=>{
      //    if(data && data.canUpdate){
      //     dispatch(appStateActionDucer(APPREADY, { downloadingUpdate: true }))
      //     let permission =requestCameraPermission()
      //     if(permission){          
      //       const android = RNFetchBlob.android
      //     RNFetchBlob
      //     .config({
      //       addAndroidDownloads:{
      //       useDownloadManager : true,
      //       title : 'Your Company Sportsbook version'+data.currentVersion,
      //       description : 'Sportsbook',
      //       mime : 'application/vnd.android.package-archive',
      //       path:`${RNFetchBlob.fs.dirs.DownloadDir}/Your CompanyAPK.apk`,
      //       mediaScannable : true,
      //       notification : true,
      //       }
      //     })
      //     .fetch('GET', 'https://app.yourdomain.com/data/attachment/2-1579692089.apk', {
      //       //some headers ..
      //     })
      //     .then((res) => {
      //       android.actionViewIntent(res.path(), 'application/vnd.android.package-archive')
      //       dispatch(appStateActionDucer(APPREADY, { downloadingUpdate: false }))
      //     })
      //     .catch((err) => {
      //       console.log(err)
      //     })}
      //    }
      //   })

        AsyncStorage.getItem('userSettings')
        .then((settings)=>{
          if(settings){
            let settingsJSON = JSON.parse(settings)
            dispatch(allActionDucer(SPORTSBOOK_ANY,{...settingsJSON}))
          }
          
        })
      resolve(AsyncStorage.getItem('loginState'))
      })
    },
    dispatchAppReady:()=>{
      dispatch(appStateActionDucer(APPREADY, { isReady: true }))
    }

  }
}
export default connect(mapStateToProps,mpaDispatchToProps)(component)