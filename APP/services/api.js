import axios from 'axios'
import { errorHandler } from '../utils/index';
class API{
    static instance = null

    constructor(){
        this.isLoggedIn = false
        this.token = null
        this.cancelToken = axios.CancelToken.source()

        this.http = axios.create({
            baseURL:"https://your.domain.extension/api",
            headers:{'Content-Type': 'application/json;charset=utf-8'},
            cancelToken:this.cancelToken.token
        })

        this.http.interceptors.request.use((config)=>{
            if(this.isLoggedIn){
                config.headers.common['Authorization'] = 'Bearer '+this.token
            }
            return config
        })
    }

    static getInstance = ()=>{
        if(API.instance == null){
            API.instance = new API();
        }
        return API.instance
    }

    setToken =  (token)=> {
        this.token = token
        this.isLoggedIn=true
    }

    logError(error){
      errorHandler(error)
    }
    
    getBanners(bid,success,error){
        this.http.get('getbanner',{params:{bid:bid}}).then(success,error)
    }
    getNewsBanner(){
     return this.http.get('getnewsbanner')
    }
    getNewsNav(success,error=this.logError){
        this.http.get('getNewsNav').then(success,error)
    }
    getNewsList(success,error=this.logError){
        this.http.get('getNewsList').then(success,error)
    }
    getNewsView(data,success,error=this.logError){
        this.http.get('getNewsView',{params:data}).then(success,error)
    }
    getInfoView(data,success,error=this.logError){
        return this.http.get('getInfoView',{params:data})
    }
    loadAllJobs(){
        return this.http.get('getjobs')
    }
    getSingleJob(data){
        return this.http.get('getJob',{params:{id:data.id}})
    }
    applyForJob(data){
        return this.http.post('jobapplynow',data)
    }
    franchise(data){
        return this.http.post('franchise',data)
    }
    login(credentials,success,error=this.logError){
       this.http.post('login',credentials).then(success,error)
    }
    sendSMS(data,success, error){
        this.http.post('sendSMS',data).then(success,error)
    }
    logout(){
       this.http.get('logout').then(e=>null,error=>null)
    }

    getProfile(success,error=this.logError){
       this.http.get('load/profile').then(success,error)
    }
    getBalance(data,success,error=this.logError){
        this.http.post('getuserbalancebonus',data).then(success,error)
    }
    getUserInfo(data,success,error=this.logError){
        this.http.post('getuserinfo',data).then(success,error)
    }
    getUserBalanceHistory(data,success,error=this.logError){
        this.http.post('getUserBalanceHistory',data).then(success,error)
     }
    getUserBonusHistory(data,success,error=this.logError){
    this.http.post('myBonusRecord',data).then(success,error)
    }
    getBonusList(data,success,error=this.logError){
    this.http.post('promotionList',data).then(success,error)
    }
    withdrawBonus(data){
       return this.http.post('withdrawalBonus',data)
    }
    getBonus(data){
       return this.http.post('getBonus',data)
    }
    deposit(data,success,error=this.logError){
        this.http.post('userDeposit',data).then(success,error)
    }
    withdraw(data,success,error=this.logError){
        this.http.post('userWithdrawal',data).then(success,error)
    }

    updateProfile(data,success,error=this.logError){
        this.http.post('userInfoSave',data).then(success,error)
    }
    resetPassword(data,success,error=this.logError){
        this.http.post('resetPassword',data).then(success,error)
    }

    changePassword(data,success,error=this.logError){
        this.http.post('changePassword',data).then(success,error)
    }
    createAccount(data,success,error=this.logError){
        this.http.post('register',data).then(success,error)
    }
    getSlotGames(data,success,error= this.logError){
        this.http[data.reqType]('getSlotGames',data.reqType==='post'?data:{params:data}).then(success,error)
    }
    getSlotGameCategorys(data,success,error= this.logError){
        this.http.post('getSlotGameCategorys',data).then(success,error)
    }
    getSlotGameProviders(data,success,error= this.logError){
        this.http.post('getSlotGameProviders',data).then(success,error)
    }
    cancelRequest(){
        this.cancelToken.cancel("Request cancelled @ "+Date.now())
    }

}


export default API;
