import React from 'react'
import moment from 'moment-timezone'
import BetHistory from '../../containers/bethistory'
import { MODAL } from '../../actionReducers'
import { allActionDucer } from '../../actionCreator'
import UserProfile from '../../containers/userprofile'
import Wallet from '../../containers/wallet'
import Transactions from '../../containers/transactions'
import { clearToast, makeToast, onFormInputFocusLost, onFormInputFocus } from '../../common'
import Bonuses from '../../containers/bonus'
import { Help } from '../help'
import API from '../../services/api'
import Swiper from 'swiper'
import AccountMenuOption from '../accountMenuOption'
const $api = API.getInstance()
export default class AccModal extends React.Component{
    constructor(props){
        super(props)
        this.state={amount:'',claimData:{isCash:null},amountEmpty:!1,allowSlideNext:false,allowSlidePrev:false}
        this.closeModal = this.closeModal.bind(this)
        this.changeTab = this.changeTab.bind(this)
        this.onInputChange = this.onInputChange.bind(this)
        this.handleSlideChange = this.handleSlideChange.bind(this)
        this.backToMenuModal = this.backToMenuModal.bind(this)
        this.showContent = this.showContent.bind(this)
        this.livePreviewSwiper=null
    }
    componentDidMount() {
      this.livePreviewSwiper = new Swiper('.swiper-container-modal', {noSwiping: false,allowSlideNext:this.state.allowSlideNext,allowSlidePrev:this.state.allowSlidePrev});
      this.livePreviewSwiper.on('slideChange',this.handleSlideChange);
    }
    componentDidUpdate(prevProps) {
      (prevProps.sb_modal.tabType!==this.props.sb_modal.tabType&&this.props.sb_modal.tabType!==0) && this.showNext()
      
    }
    componentWillUnmount(){
      clearToast()
      this.livePreviewSwiper.slideReset()
   }
   handleSlideChange(){
    this.livePreviewSwiper.allowSlideNext=false
    this.livePreviewSwiper.allowSlidePrev=false
   }
   onInputChange(e){
    let $el = e.target,newState = {}
    newState[$el.name]= $el.value
    newState[$el.name+'Empty']= false
    this.setState(newState)
    }
    closeModal() {
        this.livePreviewSwiper.slideReset()
        this.props.dispatch(allActionDucer(MODAL,{modalOpen:false,type:null}))
    }
    backToMenuModal() {
      this.props.dispatch(allActionDucer(MODAL,{tabType:0}))
      this.livePreviewSwiper.allowSlidePrev= true
      this.livePreviewSwiper.slidePrev()
    }
    showNext(){
      this.livePreviewSwiper.allowSlideNext= true
      this.livePreviewSwiper.slideNext()
    }
    changeTab(type,tabType=null) {
      const hasType = null!==tabType
        this.props.dispatch(allActionDucer(MODAL,{type:type,tabType:hasType?tabType:0}))
        if(hasType){
          this.showNext()
        }
    }
    showContent(type) {
      this.props.dispatch(allActionDucer(MODAL,{tabType:type}))
      this.showNext()
    }
    changeForm(type) {
        this.props.dispatch(allActionDucer(MODAL,{tabType:type}))
    }
    claimDialog(dat){
      let settable = {}
      dat.type=== 1?settable.attempttingBonusClaim=!this.props.sb_modal.attempttingBonusClaim: settable.attempttingBonusWithdraw=!this.props.sb_modal.attempttingBonusWithdraw
      this.props.dispatch(allActionDucer(MODAL,{showClaimDialog:!this.props.sb_modal.showClaimDialog,...settable}))
      this.setState({claimData:dat})
    }
    confirmClaim(){
      if(this.state.claimData.isCash && this.state.amount ===''){
        this.setState({amountEmpty:true})
        return true
      }
      else
     {  
       let p  = {...this.state.claimData}
      p.isCash ===1 && (p.amount= this.state.amount)
       p.type === 1 ?$api.getBonus(p)
      .then(({ data }) => {
        this.setState({amountEmpty:false})
        this.props.dispatch(allActionDucer(MODAL,{showClaimDialog:!1,attempttingBonusClaim:!1}))
        makeToast(data.msg, 6000)
      }): $api.withdrawBonus(p)
      .then(({ data }) => {
        this.props.dispatch(allActionDucer(MODAL,{showClaimDialog:!1,attempttingBonusWithdraw:!1}))
        makeToast(data.msg, 6000)
      })}
    }
    cancelClaim(){
      this.props.dispatch(allActionDucer(MODAL,{showClaimDialog:!1,attempttingBonusClaim:!1,attempttingBonusWithdraw:!1}))
      this.setState({claimData:{isCash:null},amount:''})
     }

    render(){
         const{modalOpen,type,tabType,showClaimDialog,attempttingBonusClaim,attempttingBonusWithdraw}  = this.props.sb_modal,{amount,claimData,amountEmpty}= this.state, {sportsbook,profile,sendRequest,dispatchLogout}= this.props, showStyles={opacity:1,pointerEvents:'unset'}
        return (

                <div className={`sb-modal sb-modal-backdrop`} style={modalOpen?{...showStyles}:{}}>
                  <div className="sb-modal-backdrop" style={showClaimDialog?{...showStyles}:{}}>
                  <div className="account-popup-container container-no-background">
                      <div className="account-popup-header">
                         {claimData.type ===1? 'Claim Bonus' :'Withdraw Bonus'}
                    </div>

                      <div className="account-popup-body-container">
                      {claimData.type ===2 &&<div className="account-popup-message"> Early withdrawal bonuses can cause losses!  <a onClick={this.closeModal} href="/bonus-terms"><span>Read Bonus Terms</span></a>
                      </div>}
                      <div className="account-popup-message">Are you sure want to {claimData.type===1 ?'claim this ' : 'withdraw '} bonus?
                      </div>
                            {
                              claimData.isCash === 1 && <div className="ember-view col-sm-12">
                              <div className="sb-login-form-container sign-in">
                              <div>
                              <div className="sb-login-form-wrapper">
                              <div className="form-group required">
                              <div className="form-element empty">
                                  <div className="input-wrapper  show-password-switcher">
                                      <div className="field-icons-container ember-view">
                                          {(amountEmpty) && <React.Fragment>
                                          <div className="warning-block">
                                              <span className={`warning icon-sb-warning icon`} ></span>
                                          </div>  <div className="field-message-container ember-view" style={{right: 0, top: "-44px"}}>
                                              <div className="field-message-wrapper">
                                                  <span>Amount is Required</span>
                                          </div></div></React.Fragment>}
                                      </div>
                                      <input name="amount" value={amount} className={`${amountEmpty? 'error animated pulse':''} ember-text-field ember-view`} type="number" onChange={(e) => this.onInputChange(e)} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off" />
                                      <span className={`placeholder ${amount ==='' && 'placeholder-inactive'}`}>Amount</span>
                                  </div>
                              </div>
                          </div>
                          </div>
                          </div>
                          </div>
                          </div>
                            }
                          <div className="account-popup-buttons">
                                  <a className="btn btn1" onClick={this.confirmClaim.bind(this)}>Yes {claimData.type ===2 &&' Withdraw'}</a>
                                  <a className="btn btn1 cancel" onClick={this.cancelClaim.bind(this)}>Cancel</a>
                          </div>
                      </div>
                  </div>
                  </div>
                    <div className="swiper-container col-sm-12 swiper-container-modal" style={{height:'100%'}}>
                        <div className="swiper-wrapper">
                            <div className="swiper-slide">
                            <div className="sb-modal-content">
                            <div className="sb-modal-menu col-sm-12">
                              <div className="user-balance-section">
                                <div className="user">
                                  <div className="avatar-container col-sm-2"><div className="user-avatar"></div></div>
                                  <div className="number-id col-sm-10">
                                    <span className="number">{profile.nickname} </span>
                                    <span className="id">+233{profile.mobilenumber}</span>
                                    {/* <span className="id">ID: {profile.idnumber}</span> */}
                                  </div>
                                  <div onClick={this.closeModal} className="close uci-close"></div>
                                </div>
                                <div className="money">
                                  <div className="main-balance">
                                    <span>Main Balance</span>
                                    <span>{sportsbook.config.currency} {profile.balance}</span>
                                  </div>
                                  <div className="bonus-balance">
                                    <span>Bonus Balance</span>
                                    <span>{profile.bonus}</span>
                                  </div>
                                </div>
                              </div>
                              <AccountMenuOption type={type} onExpand={this.changeTab} id={1} title={'Profile'} icon={"icon-sb-edit-profile"} tabType={tabType}>
                                <div className={tabType == 1? 'active' : ''} onClick={() => { this.showContent(1) }}> <span>Edit Profile </span></div>
                                <div className={tabType == 2 ? 'active' : ''} onClick={() => { this.showContent(2) }}><span>Change Password</span></div>
                              </AccountMenuOption>
                              <AccountMenuOption type={type} onExpand={this.changeTab} id={3} title={'Wallet'} icon={"icon-sb-wallet"} tabType={tabType}>
                              <div className={tabType == 1 ? 'active' : ''} onClick={() => { this.showContent(1) }}> <span>Deposit </span>
                              </div>
                              <div className={tabType == 2 ? 'active' : ''} onClick={() => { this.showContent(2) }}><span>Withdrawal</span>
                              </div>
                              <div className={tabType == 2 ? 'active' : ''} onClick={() => { this.showContent(3) }}><span>Transactions</span>
                              </div>
                              </AccountMenuOption>
                              <AccountMenuOption type={type} onExpand={(id)=>this.changeTab(id,1)} id={2} title={'Bets History'} icon={"icon-sb-my-bets"} tabType={tabType}/>
                              <AccountMenuOption type={type} onExpand={(id)=>this.changeTab(id,1)} id={5} title={'Bonuses'} icon={"icon-sb-bonuses"} tabType={tabType}/>
                              <AccountMenuOption type={type} onExpand={(id)=>this.changeTab(id,1)} id={6} title={'Help'} icon={"icon-sb-info"} tabType={tabType}/>
                             
                            
                              {/* <div className={`menu-link-item ${type ===7 && 'active'}`} onClick={()=>this.changeTab(7)}>
                                <div className="col-sm-1"><span className="profile-icon icon-sb-messages"></span></div>
                                <div className="col-sm-11">Messages</div>
                              </div> */}
                          
                            </div>
                            </div>
                        </div>
                    
                    <div className="swiper-slide">
                    <div className="sb-modal-content">
                    {type === 2 ?
                    <BetHistory  onClose={this.closeModal}
                      sendRequest={sendRequest} backToMenuModal={this.backToMenuModal}
                      />
                    :type===1?
                    <UserProfile backToMenuModal={this.backToMenuModal} changeForm={this.changeForm.bind(this)} dispatchLogout={dispatchLogout} onClose={this.closeModal} formType={tabType}/>
                   :type===3?
                    <Wallet backToMenuModal={this.backToMenuModal} changeForm={this.changeForm.bind(this)} dispatchLogout={dispatchLogout} onClose={this.closeModal} formType={tabType}/>
                    :type===4?
                    <Transactions backToMenuModal={this.backToMenuModal} changeForm={this.changeForm.bind(this)} dispatchLogout={dispatchLogout} onClose={this.closeModal} formType={tabType}/>
                    :type===5?
                    <Bonuses backToMenuModal={this.backToMenuModal} changeForm={this.changeForm.bind(this)}attempttingBonusClaim={attempttingBonusClaim} attempttingBonusWithdraw={attempttingBonusWithdraw} showClaimDialog={this.claimDialog.bind(this)} dispatchLogout={dispatchLogout} onClose={this.closeModal} formType={tabType}/>
                    :type===6?
                    <Help backToMenuModal={this.backToMenuModal} changeForm={this.changeForm.bind(this)} dispatchLogout={dispatchLogout} onClose={this.closeModal} formType={tabType}/>
                    :type===7?
                    <Help backToMenuModal={this.backToMenuModal} changeForm={this.changeForm.bind(this)} dispatchLogout={dispatchLogout} onClose={this.closeModal} formType={tabType}/>
                  :null}
                    </div>              
                    </div>  
                    </div>            
                  </div>
                </div>
        )
    }
}