
import moment from 'moment-timezone' ;
import {ToastAndroid,Alert} from 'react-native'
const emailRegex =  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-z]{2,}))$/
    ,phoneRegex= /^0(2)(0|3|4|6|7)\d{3}\d{4}|0(5)(0|4|5|6|7)\d{3}\d{4}|(5)(0|4|5|6|7)\d{3}\d{4}|(2)(0|3|4|6|7)\d{3}\d{4}$/
      ,full_nameRegex=/^[a-z A-Z +,.'-]{2,}$/,passwordReqex = /^[0-9a-zA-Z]{8,}$/,usernameRegex = /^[0-9a-zA-Z]{6,}$/,SMSRegex=/^[0-9a-zA-Z]{6,}$/,onlyMoney=/^[0-9]+(\.[0-9]{1,2})?$/;


export const dateDiff = ($date,diffInMinutes)=>{
    if($date===0){
        return false
    }
    var $dateToTime = (typeof $date == "string") ? moment($date,'YYYY-MM-DD') : $date;
    if(typeof $date == 'string')
        return ($dateToTime <= moment().startOf('day'))  
        return $dateToTime > moment().subtract(diffInMinutes,'minutes')
}
,formatTimeAgo = ($date)=>{
    return moment($date).fromNow()
},
formartCalender = ($date)=>{
    return moment($date,'YYYY-MM-DD HH:mm:ss').calendar()
}
, validateEmail = (email)=>{
    return emailRegex.test(email)
},validatePhone=(number)=>{
    return phoneRegex.test(number)
},
validateFullname=(name)=>{
    return full_nameRegex.test(name)
},
validateUsername=(name)=>{
    return usernameRegex.test(name)
},
validateSMSCode=(code)=>{
    return SMSRegex.test(code)
},
validatePassword=(pass)=>{
    return passwordReqex.test(pass)
},validateNumber=(money)=>{
    return onlyMoney.test(money)
}

export const errorHandler = (error)=>{
    const {response} = error
    if(response){
        const {status,data} = response
        switch (status) {
            case 422:
                const {password,email,phone} = data
                if(password){
                    makeText(password[0])
                }
                if (email) {
                    makeText(email[0])                        
                }
                if (phone) {
                    makeText(phone[0])                        
                }
                break;
            case 401:
                (typeof data == "object" ) ? makeText(data.message) : makeText(data)
                break;
            
            default:
              setTimeout(() => makeText("Ooops Something wrong, try again later"), 3000);
             console.log(response)
                break;
        }
    }else{
        console.log(JSON.stringify(error))
    }
}
export const  makeText = (message,duration=1) => {
    ToastAndroid.show(message, duration===1 ?ToastAndroid.SHORT:ToastAndroid.LONG)
}
export const AlertPrompt = (title,content=null,actions=null)=>{
    Alert.alert(title,content,actions)

} 
 

