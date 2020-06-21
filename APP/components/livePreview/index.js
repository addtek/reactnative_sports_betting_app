import React, {PureComponent} from 'react';
import { View, Text, Image, ImageBackground, Dimensions, LayoutAnimation,Animated } from 'react-native'
// import LiveEventSound from '../sound';
import { convertSetName, stringReplacer, EventIDToNameMap } from '../../common';
import moment from 'moment';
import CustomIcon from '../../components/customIcon';
import LinearGradient from 'react-native-linear-gradient';
import RadialGradient from 'react-native-radial-gradient';
import { Easing } from 'react-native-reanimated';
let {width}= Dimensions.get('window')
export default class LiveGamePreview extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            playSound: false,
            isfloatingLiveStream: false,
            hidefloatingLiveStream: false,
            fadeAnim: new Animated.Value(1),
            centerLargeLineRotateAnimWidth: new Animated.Value(0),
            centerLargeLineRotateAnimRotate: new Animated.Value(90),
            centerLargeLineAnim: new Animated.Value(0),
            goalContainerWidth: new Animated.Value(0),
            goalContainerHeight: new Animated.Value(0),
            textVisibility: new Animated.Value(0),
            ballVisibility: new Animated.Value(0),
            netVisibility: new Animated.Value(0),
            ballTranslateY: new Animated.Value(0),
            ballTranslateX: new Animated.Value(0),
            ballRotate: new Animated.Value(0),
            ballScale: new Animated.Value(1),
            tennisBallScale: new Animated.Value(0.6),
            centerSmallLinesOpacityAnim: new Animated.Value(.3),
            overlayLinesAnim: new Animated.Value(0),
            overlaySeparatorAnim: new Animated.Value(0),
            overlayTextAnim: new Animated.Value(0),
            linesAnimationAnim: new Animated.Value(0.5),
            tennisBallX: new Animated.Value(0),
            tennisBallY: new Animated.Value(0),
            duncking:false
        };
        this.event_type_id=null
        this.last_event_side= null
        this.sport_background = {
            1: require('../../images/soccer-background.png')
        }
        this.playSound = this.playSound.bind(this);
        this.blinkAnimation = this.blinkAnimation.bind(this);
        this.ballInPlay = this.ballInPlay.bind(this);
        this.reverseFloatingStream = this.reverseFloatingStream.bind(this);
        this.livePreviewSwiper = null;
    }
    componentDidMount() {
      let last_event = this.props.activeGame.last_event
      if((last_event && (this.props.activeSport.id ===3||this.props.activeSport.id ===1)&& (last_event.type_id === '326' || last_event.type_id ==='21'|| last_event.type_id ==='20'|| last_event.type_id ==='29' )&&(((this.event_type_id!==last_event.type_id)&& this.last_event_side!==last_event.side)||((this.event_type_id===last_event.type_id)&& this.last_event_side!==last_event.side))) ){ 
        this.state.tennisBallX.stopAnimation()
        this.state.fadeAnim.stopAnimation()
        this.state.goalContainerWidth.stopAnimation()
        this.state.ballVisibility.stopAnimation()
        this.state.ballScale.stopAnimation()
        this.blinkAnimation()
        this.event_type_id=last_event.type_id
        this.last_event_side= last_event.side
      }
      else if(last_event && last_event.type_id === '1'&&(((this.event_type_id!==last_event.type_id)&& this.last_event_side!==last_event.side)||((this.event_type_id===last_event.type_id)&& this.last_event_side!==last_event.side))){
        this.state.tennisBallX.stopAnimation()
        this.state.fadeAnim.stopAnimation()
        this.state.goalContainerWidth.stopAnimation()
        this.state.ballVisibility.stopAnimation()
        this.state.ballScale.stopAnimation()  
        this.goalAnimation()
          this.event_type_id=last_event.type_id
        this.last_event_side= last_event.side
      }
      else if(last_event && (last_event.type_id === '327' ||
      last_event.type_id === '328' ||
      last_event.type_id === '329' ||
      last_event.type_id === '320' ||
      last_event.type_id === '325')&&(((this.event_type_id!==last_event.type_id)&& this.last_event_side!==last_event.side)||((this.event_type_id===last_event.type_id)&& this.last_event_side!==last_event.side))){
        this.setState({duncking:true})
        this.state.tennisBallX.stopAnimation()
        this.state.fadeAnim.stopAnimation()
        this.state.goalContainerWidth.stopAnimation()
        this.state.ballVisibility.stopAnimation()
        this.state.ballScale.stopAnimation()
        last_event.type_id === '327'?this.basketballDunk(last_event.side):this.fadeInOutAnimation()
        this.event_type_id=last_event.type_id
        this.last_event_side= last_event.side
      }
      else if(last_event && (last_event.type_id === '206'||last_event.type_id === '205')&&(this.event_type_id!==last_event.type_id||((this.event_type_id===last_event.type_id)&& this.last_event_side!==last_event.side))){
        this.state.tennisBallX.stopAnimation()
        this.state.fadeAnim.stopAnimation()
        this.state.goalContainerWidth.stopAnimation()
        this.state.ballVisibility.stopAnimation()
        this.state.ballScale.stopAnimation()
        last_event.type_id === '206'?this.ballInPlay(last_event.side):this.fadeInOutAnimation()
        this.event_type_id=last_event.type_id
        this.last_event_side= last_event.side
      }
    }
    componentDidUpdate(prevProps, prevState) {
        (prevProps.currentLiveEventTeamName !== this.props.currentLiveEventTeamName ||prevProps.currentLiveEventName!== this.props.currentLiveEventName)&& this.props.activeSport.id===1 && LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
        let last_event = this.props.activeGame.last_event,prev_event= prevProps.activeGame.last_event
        if((last_event && (this.props.activeSport.id ===3||this.props.activeSport.id ===1)&& (last_event.type_id === '326' || last_event.type_id ==='21'|| last_event.type_id ==='20'|| last_event.type_id ==='29' )&&(((this.event_type_id!==last_event.type_id)&& this.last_event_side!==last_event.side)||((this.event_type_id===last_event.type_id)&& this.last_event_side!==last_event.side))) ){ 
          this.state.tennisBallX.stopAnimation()
          this.state.fadeAnim.stopAnimation()
          this.state.goalContainerWidth.stopAnimation()
          this.state.ballVisibility.stopAnimation()
          this.state.ballScale.stopAnimation()
          this.blinkAnimation()
          this.event_type_id=last_event.type_id
          this.last_event_side= last_event.side
        }
        else if(last_event && last_event.type_id === '1'&&(((this.event_type_id!==last_event.type_id)&& this.last_event_side!==last_event.side)||((this.event_type_id===last_event.type_id)&& this.last_event_side!==last_event.side))){
          this.state.tennisBallX.stopAnimation()
          this.state.fadeAnim.stopAnimation()
          this.state.goalContainerWidth.stopAnimation()
          this.state.ballVisibility.stopAnimation()
          this.state.ballScale.stopAnimation()  
          this.goalAnimation()
          this.event_type_id=last_event.type_id
          this.last_event_side= last_event.side
        }
        else if(last_event && (last_event.type_id === '327' ||
        last_event.type_id === '328' ||
        last_event.type_id === '329' ||
        last_event.type_id === '320' ||
        last_event.type_id === '325')&&((last_event.event_value===prev_event.event_value&&this.props.activeGame.info['score'+last_event.side]!==prevProps.activeGame.info['score'+last_event.side])||(last_event.event_value!==prev_event.event_value||this.props.activeGame.info['score'+last_event.side]!==prevProps.activeGame.info['score'+last_event.side])||((this.event_type_id!==last_event.type_id)&& this.last_event_side!==last_event.side)||((this.event_type_id===last_event.type_id)&& this.last_event_side!==last_event.side))){
          this.setState({duncking:true})
          this.state.tennisBallX.stopAnimation()
          this.state.fadeAnim.stopAnimation()
          this.state.goalContainerWidth.stopAnimation()
          this.state.ballVisibility.stopAnimation()
          this.state.ballScale.stopAnimation()
          last_event.type_id === '327'?this.basketballDunk(last_event.side):this.fadeInOutAnimation()
          this.event_type_id=last_event.type_id
          this.last_event_side= last_event.side
        }
        else if(last_event && (last_event.type_id === '206'||last_event.type_id === '205')&&(this.event_type_id!==last_event.type_id||((this.event_type_id===last_event.type_id)&& this.last_event_side!==last_event.side))){
          this.state.tennisBallX.stopAnimation()
          this.state.fadeAnim.stopAnimation()
          this.state.goalContainerWidth.stopAnimation()
          this.state.ballVisibility.stopAnimation()
          this.state.ballScale.stopAnimation()
          last_event.type_id === '206'?this.ballInPlay(last_event.side):this.fadeInOutAnimation()
          this.event_type_id=last_event.type_id
          this.last_event_side= last_event.side
        }
        else if(last_event&& (last_event.type_id!==this.event_type_id || this.last_event_side!==last_event.side)){
          this.state.tennisBallX.stopAnimation()
          this.state.fadeAnim.stopAnimation()
          this.state.goalContainerWidth.stopAnimation()
          this.state.ballVisibility.stopAnimation()
          this.state.ballScale.stopAnimation()
          this.event_type_id=last_event.type_id
          this.last_event_side= last_event.side
        }
    }

    blinkAnimation(){
        Animated.sequence([
        Animated.timing(this.state.fadeAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver:true
        }),
        Animated.timing(this.state.fadeAnim, {
          toValue: 0.6,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver:true
      })]).start((o) =>o.finished &&this.blinkAnimation());
    }
    goalAnimation(){
        const {            
            textVisibility,
            goalContainerWidth,
            centerSmallLinesOpacityAnim,
            goalContainerHeight,
           }=this.state
            Animated.sequence([
              Animated.parallel([
                Animated.timing(goalContainerHeight, {
                  toValue: Math.round(50/2), 
                  duration:1000
                //   useNativeDriver: true
                }),
                Animated.timing(goalContainerWidth, {
                  toValue: Math.round(width/2),
                  duration:1000
                //   useNativeDriver: true
                }),
                Animated.timing(textVisibility, {
                  toValue: 1,
                  duration:3000
                //   useNativeDriver: true
                }),
                Animated.timing(centerSmallLinesOpacityAnim, {
                  toValue: 1,
                  duration:100
                //   useNativeDriver: true
                }),
              ]),
                Animated.parallel([
                    Animated.timing(goalContainerHeight, {
                      toValue: 0, 
                      duration:5000
                    //   useNativeDriver: true
                    }),
                    Animated.timing(goalContainerWidth, {
                      toValue: 0,
                      duration:5000
                    //   useNativeDriver: true
                    }),
                    Animated.timing(centerSmallLinesOpacityAnim, {
                      toValue: 0,
                      duration:5000
                    //   useNativeDriver: true
                    }),
                    Animated.timing(textVisibility, {
                      toValue: 0,
                      duration:2000
                    //   useNativeDriver: true
                    }),
                  ])
                  
            ]).start()
    }
    fadeInOutAnimation(){
      const {netVisibility}=this.state
      Animated.sequence([
        Animated.timing(netVisibility, {
          toValue: 1,
          duration: 500,
          // delay:50,
          useNativeDriver: true
        }),
        Animated.timing(netVisibility, {
          toValue: 0,
          duration: 1000,
          delay:3000,
          useNativeDriver: true
        })
      ]).start()
    }
    basketballDunk(side){
      const {ballScale,ballTranslateY,ballTranslateX,ballRotate,ballVisibility,netVisibility}=this.state
      
      let rotate=side==='2'?-360:360,transXStage1= side==="2"?-20:20
      Animated.sequence([
        Animated.parallel([
          Animated.timing(ballTranslateX, {
            toValue: transXStage1,
            duration: 40,
            // delay:100,
            useNativeDriver: true
          }),
        Animated.timing(ballScale, {
          toValue: 1,
          duration: 40,
          // delay:100,
          // friction: 1,
          useNativeDriver: true
      }),
        Animated.timing(netVisibility, {
          toValue: 1,
          duration: 40,
          // delay:50,
          useNativeDriver: true
        }),
        Animated.timing(ballVisibility, {
          toValue: 1,
          duration: 40,
          // delay:100,
          useNativeDriver: true
        }),
        Animated.timing(ballRotate, {
          toValue: rotate,
          duration: 40,
          // delay:100,
          useNativeDriver: true
        
      }),
        ]),
        Animated.parallel([
          Animated.timing(ballTranslateY, {
            toValue: 5,
            duration: 40,
            // delay:100,
            useNativeDriver: true
        }),
          Animated.timing(ballTranslateX, {
            toValue: side==='2'?-30:30,
            duration: 40,
            useNativeDriver: true
        }),
        Animated.timing(ballRotate, {
          toValue: rotate,
          duration: 40,
          // delay:100,
          useNativeDriver: true
        
      }),

        ]),
        Animated.parallel([
          Animated.timing(ballTranslateY, {
            toValue: 10,
            duration: 40,
            // delay:100,
            useNativeDriver: true
        }),
          Animated.timing(ballTranslateX, {
            toValue: side==='2'?-40:40,
            duration: 40,
            useNativeDriver: true
        }),
        Animated.timing(ballRotate, {
          toValue: rotate,
          duration: 40,
          // delay:100,
          useNativeDriver: true
        
      }),
      
        ]),
        Animated.parallel([
          Animated.timing(ballTranslateY, {
            toValue: 15,
            duration: 40,
            // delay:100,
            useNativeDriver: true
        }),
          Animated.timing(ballTranslateX, {
            toValue: side==='2'?-50:50,
            duration: 40,
            useNativeDriver: true
        }),
        Animated.timing(ballRotate, {
          toValue: rotate,
          duration: 40,
          // delay:100,
          useNativeDriver: true
        
      }),

        ]),
        Animated.parallel([
          Animated.timing(ballTranslateY, {
            toValue: 20,
            duration: 40,
            // delay:100,
            useNativeDriver: true
        }),
        Animated.timing(ballRotate, {
          toValue: rotate,
          duration: 40,
          // delay:100,
          useNativeDriver: true
        
      }),
          Animated.timing(ballTranslateX, {
            toValue: side==='2'?-60:60,
            duration: 40,
            useNativeDriver: true
        }),
        Animated.timing(ballRotate, {
          toValue: rotate,
          duration: 40,
          // delay:100,
          useNativeDriver: true
        
      }),
        ]),
        Animated.parallel([
          Animated.timing(ballTranslateY, {
            toValue: 25,
            duration: 40,
            // delay:100,
            useNativeDriver: true
        }),
        Animated.timing(ballRotate, {
          toValue: rotate,
          duration: 40,
          // delay:100,
          useNativeDriver: true
        
      }),
          Animated.timing(ballTranslateX, {
            toValue: side==='2'?-70:70,
            duration: 40,
            useNativeDriver: true
        }),
        Animated.timing(ballRotate, {
          toValue: rotate,
          duration: 40,
          // delay:100,
          useNativeDriver: true
        
      }),
        ]),
        Animated.parallel([
          Animated.timing(ballTranslateY, {
            toValue: 30,
            duration: 40,
            // delay:100,
            useNativeDriver: true
        }),
          Animated.timing(ballTranslateX, {
            toValue: side==='2'?-75:75,
            duration: 40,
            useNativeDriver: true
        }),
        Animated.timing(ballRotate, {
          toValue: rotate,
          duration: 40,
          // delay:100,
          useNativeDriver: true
        
      }),
        Animated.timing(ballScale, {
          toValue: 0.7,
          duration: 40,
          // delay:100,
          useNativeDriver: true
      })
        ]),
        Animated.parallel([
          Animated.timing(ballTranslateY, {
            toValue: 35,
            duration: 40,
            // delay:100,
            useNativeDriver: true
        }),
          Animated.timing(ballTranslateX, {
            toValue: side==='2'?-80:80,
            duration: 40,
            useNativeDriver: true
        })
        ]),
        Animated.parallel([
          Animated.timing(ballTranslateY, {
            toValue: 40,
            duration: 40,
            // delay:100,
            useNativeDriver: true
        }),
           Animated.timing(ballTranslateX, {
            toValue: side==='2'?-82:82,
            duration: 40,
            useNativeDriver: true
            
        }),
        ]),
        Animated.parallel([
          Animated.timing(ballTranslateY, {
            toValue: 45,
            duration: 40,
            // delay:100,
            useNativeDriver: true
        }),
        Animated.timing(ballTranslateX, {
          toValue: side==='2'?-84:84,
          duration: 40,
          useNativeDriver: true
          
      }),
        ]),
        Animated.parallel([
          Animated.timing(ballTranslateY, {
            toValue: 50,
            duration: 40,
            // delay:100,
            useNativeDriver: true
        }),
        Animated.timing(ballTranslateX, {
          toValue: side==='2'?-86:86,
          duration: 40,
          useNativeDriver: true
          
      }),
        ]),
        Animated.parallel([
          Animated.timing(ballTranslateY, {
            toValue: 55,
            duration: 40,
            // delay:100,
            useNativeDriver: true
        }),
        Animated.timing(ballTranslateX, {
          toValue: side==='2'?-88:88,
          duration: 40,
          useNativeDriver: true
          
      }),
        ]),
        Animated.parallel([
          Animated.timing(ballTranslateY, {
            toValue: 60,
            duration: 40,
            // delay:100, 
            useNativeDriver: true
        }),
        Animated.timing(ballTranslateX, {
          toValue: side==='2'?-90:90,
          duration: 40,
          useNativeDriver: true
          
      }),
        ]),
        Animated.parallel([
          Animated.timing(ballTranslateY, {
            toValue: 65,
            duration: 40,
            // delay:100,
            useNativeDriver: true
        })
        ]),
        Animated.parallel([
          Animated.timing(ballTranslateY, {
            toValue: 70,
            duration: 40,
            // delay:100,
            useNativeDriver: true
        })
        ]),
        Animated.parallel([
          Animated.timing(ballRotate, {
            toValue: rotate,
            duration: 40,
            // delay:100,
            useNativeDriver: true
          
        }),
          Animated.timing(ballTranslateX, {
            toValue: side==='2'?-90:90,
            duration: 600,
            useNativeDriver: true
            
        }),
          Animated.timing(ballTranslateY, {
            toValue: 95,
            duration: 600,
            useNativeDriver: true
            
        }),
      Animated.timing(ballVisibility, {
        toValue: 0,
        duration: 40,
        useNativeDriver: true
        }),
        Animated.timing(netVisibility, {
          toValue: 0,
          duration: 600,
          // delay:600,
          useNativeDriver: true
      })
        ])
      ]).start(()=>this.setState({duncking:false}));
      
  }
  ballInPlay(side){ 
    const {tennisBallX,tennisBallY,ballRotate}=this.state
    let pointsStart={x:side==="2"?-200:200,y:side==="2"?-100:100}
    Animated.sequence([
      Animated.parallel([
        Animated.timing(tennisBallX, {
          toValue: pointsStart.x,
          duration: 1000,
          useNativeDriver: true
      }),
        Animated.timing(tennisBallY, {
          toValue: pointsStart.y,
          duration: 1000,
          useNativeDriver: true
        
      }),
        Animated.timing(ballRotate, {
          toValue: 90,
          duration: 1000,
          useNativeDriver: true
        
      })
      ]),
      Animated.parallel([
        Animated.timing(tennisBallX, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true
        
      }),
        Animated.timing(tennisBallY, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true
      }),
      Animated.timing(ballRotate, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true
    })
      ])
    ]).start((o) =>o.finished &&this.ballInPlay(side));
  }
    playSound() {
        this.setState(prevState => ({ playSound: !prevState.playSound }));
    }
    reverseFloatingStream() {
        $('.stream-exist').removeClass('small');
        this.setState({ isfloatingLiveStream: false, hidefloatingLiveStream: true });
    }
    displayGameSets(game) {
        let sets = [];
        if (game) {
            Object.keys(game.stats).forEach(val => {
                val.includes('score_set') && sets.push(game.stats[val]);
            });
        }
        return (sets = sets.map((v, k) => {
            return (
                <Text key={k} style={[viewStyles.setsInfo]}>
                    {v.team1_value + ' - ' + v.team2_value}
                </Text>
            );
        }));
    }
    getSetTotalScore(activeGame) {
        return activeGame.hasOwnProperty('info')&&`${activeGame.info.score1 + ' - ' + activeGame.info.score2}`;
    }
    render() {
        const {
            activeGame,
            activeView,
            activeSport,
            currentLiveEventName,
            currentLiveEventTeamName,
        } = this.props,
            { isfloatingLiveStream,fadeAnim,goalContainerWidth,goalContainerHeight,textVisibility,centerSmallLinesOpacityAnim,ballRotate,ballScale,ballVisibility,netVisibility,ballTranslateY,ballTranslateX,tennisBallX,
              tennisBallY,duncking,tennisBallScale} = this.state,
            currentSet =
                activeGame !== null &&
                    activeGame.info !== undefined &&
                    activeView === 'Live'
                    ? convertSetName()(
                        activeGame.info.current_game_state,
                        stringReplacer(activeSport.alias, [/\s/g], ['']),
                    )
                    : '',
            sportAlias = stringReplacer(
                activeSport.alias,
                [/\s/g, /'/g, /\d.+?\d/g, /\(.+?\)/g],
                ['', '', '', ''],
            ).toLowerCase();
        return activeGame &&
            (activeSport.id === 1 || activeSport.id === 3 || activeSport.id === 4) &&
            activeGame.last_event ? (
                <View
                    style={[viewStyles.sbAccordionContent, viewStyles.liquidContainer, viewStyles.gameViewContainerStreamExist]}>
                    <View >
                        <View>
                            <View style={[viewStyles.gameinfoContainer]}>
                                <View style={viewStyles.gameTimeBlock}>
                                    <View style={viewStyles.gameTimeBlockChild}/>
                                    <View style={[viewStyles.currentGameTime,viewStyles.gameTimeBlockChild]}>
                                        <Text style={{color:'#fff'}}>{currentSet === 'notstarted'
                                            ? moment
                                                .unix(activeGame.start_ts)
                                                .format('D MMMM YYYY H:mm')
                                            : currentSet}{' '}
                                            {activeGame
                                                ? activeGame.info
                                                    ? activeGame.info.current_game_time
                                                    : null
                                                : null}{' '}
                                            {activeGame &&
                                                activeGame.info &&
                                                activeGame.info.match_add_minutes &&
                                                activeGame.info.match_add_minutes > 0
                                                ? ' +' + activeGame.info.add_minutes + "'"
                                                : ''}
                                        </Text>
                                    </View>
                                    {!isfloatingLiveStream ? (
                                        <View style={[viewStyles.switchAudio,viewStyles.gameTimeBlockChild]} onClick={this.playSound}>
                                            <CustomIcon
                                                name={`audio-${
                                                    this.state.playSound ? 'on' : 'off'
                                                    }`}color="#fff"

                                            />
                                        </View>
                                    ) : (<View
                                                style={[viewStyles.switchAudio,viewStyles.gameTimeBlockChild, viewStyles.clear]}
                                                onClick={this.reverseFloatingStream}>
                                                <CustomIcon
                                                    name={`close-ouline`}
                                                    size={22} />
                                            </View>
                                        )}
                                </View>
                                <View>
                                    <View style={[viewStyles.sbAnimationContainer,
                                        activeSport.id > 1 && viewStyles.background
                                        ]}>
                                        <View style={[viewStyles.sbAnimationBlock]}>
                                            {
                                                activeSport.id === 1 ?
                                                <ImageBackground source={this.sport_background[activeSport.id]} style={[viewStyles.boardContainer,{flex:1,height:200},activeSport]}>
                                                <View style={[viewStyles.boardContainerBoard]}>
                                                    <View style={viewStyles.boardBefore[activeSport.id]}></View>
                                                    <View style={viewStyles.boardAfter[activeSport.id]}></View>
                                                    <View style={[viewStyles.boardContainerCenter[activeSport.id]]}><View style={viewStyles.boardContainerCenterBefore[activeSport.id]}></View></View>
                                                    <View style={[viewStyles.sides]}>
                                                        <View style={[viewStyles.side]}>
                                                            <View  style={viewStyles.sideBefore[activeSport.id]}/>
                                                            <View  style={viewStyles.sideAfter[activeSport.id]}/>
                                                            
                                                          
                                                                <View style={[viewStyles.angles]}>
                                                                    <View style={[viewStyles.anglesTop,viewStyles.anglesChild]}><View style={viewStyles.anglesChildAfter}/></View>
                                                                    <View style={[viewStyles.anglesBottom,viewStyles.anglesChild]}><View style={viewStyles.anglesChildAfter}/></View>
                                                                </View>
                                                            
                                                            
                                                                <View style={[viewStyles.areas]}>
                                                                    <View style={[viewStyles.areasSmall[activeSport.id]]}>
                                                                        <View style={viewStyles.areasSmallAfter[activeSport.id]}/>
                                                                    </View>
                                                                    <View style={[viewStyles.areasLarge[activeSport.id]]}>
                                                                        <View style={[viewStyles.areasLargeCircle[activeSport.id]]}>
                                                                            <View style={viewStyles.areasLargeCircleAfter[activeSport.id]}/>
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                        
                                                        </View>
                                                        <View style={[viewStyles.side,viewStyles.sideLastChild]}>
                                                            <View  style={viewStyles.sideBefore[activeSport.id]}/>
                                                            <View  style={viewStyles.sideAfter[activeSport.id]}/>
                                                           
                                                                <View style={[viewStyles.angles]}>
                                                                    <View style={[viewStyles.anglesTop,viewStyles.anglesChild]}>
                                                                    <View style={viewStyles.anglesChildAfter}/>
                                                                    </View>
                                                                    <View style={[viewStyles.anglesBottom,viewStyles.anglesChild]}>
                                                                        <View style={viewStyles.anglesChildAfter}/>
                                                                    </View>
                                                                </View>
                                                          
                                                                <View style={[viewStyles.areas]}>
                                                                <View style={[viewStyles.areasSmall[activeSport.id]]}>
                                                                    <View style={viewStyles.areasSmallAfter[activeSport.id]}/>
                                                                </View>
                                                                <View style={[viewStyles.areasLarge[activeSport.id]]}>
                                                                    <View style={[viewStyles.areasLargeCircle[activeSport.id]]}>
                                                                        <View style={viewStyles.areasLargeCircleAfter[activeSport.id]}/>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            </ImageBackground>
                                            :
                                            <RadialGradient  colors={activeSport.id === 3?["#fbb03b","#ff9f44"]:['#4894c8', '#2586c8']}  style={[viewStyles.boardContainer,{flex:1,height:200}]}>
                                                <View style={[viewStyles.boardContainerBoard]}>
                                                    <View style={viewStyles.boardBefore[activeSport.id]}></View>
                                                    <View style={viewStyles.boardAfter[activeSport.id]}></View>
                                                    <View style={[viewStyles.boardContainerCenter[activeSport.id]]}><View style={viewStyles.boardContainerCenterBefore[activeSport.id]}></View></View>
                                                    <View style={[viewStyles.sides]}>
                                                        <View style={[viewStyles.side]}>
                                                            <View  style={viewStyles.sideBefore[activeSport.id]}/>
                                                            <View  style={viewStyles.sideAfter[activeSport.id]}/>
                                                            
                                                            {activeSport.id === 3 ? 
                                                                <View style={[viewStyles.areas]}>
                                                                    <View style={[viewStyles.areasLarge[activeSport.id],duncking&&activeGame.last_event.type_id==='327'&&activeGame.last_event.event_value===3&& activeGame.last_event.side==='2'&&{backgroundColor:'rgba(255, 0, 0, 0.4)'}]}>
                                                                        <View style={[viewStyles.areasLargeCircle[activeSport.id],duncking&&activeGame.last_event.type_id==='327'&&activeGame.last_event.event_value===2&& activeGame.last_event.side==='2'&&{backgroundColor:'rgba(255, 0, 0, 0.4)'}]}/>
                                                                        <View style={[viewStyles.areasLargeLines]}/>
                                                                    </View>

                                                                    <View style={[viewStyles.areasSmall[activeSport.id]]}>
                                                                        <View style={[viewStyles.areasSmallCirclesBlock,{transform: [{ translateX: 0.15 * 200 }]}]}>
                                                                            <View style={[viewStyles.areasSmallCircles]}>
                                                                                <View style={[viewStyles.areasSmallCirclesBefore,duncking&&activeGame.last_event.type_id==='327'&&activeGame.last_event.event_value===1&& activeGame.last_event.side==='2'&&{backgroundColor:'rgba(255, 0, 0, 0.4)'}]}/>
                                                                                <View style={[{flex:1,flexGrow:1},viewStyles.areasSmallCirclesChild]}>
                                                                                    <View style={[viewStyles.areasSmallCirclesChildLeftAfter[activeSport.id],{borderStyle:'dashed'},duncking&&activeGame.last_event.type_id==='327'&&activeGame.last_event.event_value===1&& activeGame.last_event.side==='2'&&{backgroundColor:'rgba(255, 0, 0, 0.4)'}]}/>
                                                                                </View>
                                                                                <View style={[{flex:1,flexGrow:1},viewStyles.areasSmallCirclesChild]}>
                                                                                    <View style={[viewStyles.areasSmallCirclesChildRightAfter[activeSport.id],duncking&&activeGame.last_event.type_id==='327'&&activeGame.last_event.event_value===1&& activeGame.last_event.side==='2'&&{backgroundColor:'rgba(255, 0, 0, 0.4)'}]}/>
                                                                                </View>
                                                                            </View>

                                                                            <View style={[viewStyles.outerBlock]}>
                                                                                <View style={[viewStyles.areasSmallCirclesBlockOuterBlockChildTop,{position:'absolute',left:0,right:0,height:3}]}>
                                                                                    <View style={[viewStyles.areasSmallCirclesBlockOuterBlockChildChild,viewStyles.areasSmallCirclesBlockOuterBlockChildChildFirst,{left:'30%'}]}/>
                                                                                    <View style={[viewStyles.areasSmallCirclesBlockOuterBlockChildChild,viewStyles.areasSmallCirclesBlockOuterBlockChildChildSecond,{left:'40%'}]}/>
                                                                                    <View style={[viewStyles.areasSmallCirclesBlockOuterBlockChildChild,viewStyles.areasSmallCirclesBlockOuterBlockChildChildThird,{left:'60%'}]}/>
                                                                                    <View style={[viewStyles.areasSmallCirclesBlockOuterBlockChildChild,viewStyles.areasSmallCirclesBlockOuterBlockChildChildLast,{left:'80%'}]}/>
                                                                                </View>

                                                                                <View style={[viewStyles.areasSmallCirclesBlockOuterBlockChildBottom,{position:'absolute',left:0,right:0,height:3}]}>
                                                                                    <View style={[viewStyles.areasSmallCirclesBlockOuterBlockChildChild,viewStyles.areasSmallCirclesBlockOuterBlockChildChildFirst,{left:'30%'}]}/>
                                                                                    <View style={[viewStyles.areasSmallCirclesBlockOuterBlockChildChild,viewStyles.areasSmallCirclesBlockOuterBlockChildChildSecond,{left:'40%'}]}/>
                                                                                    <View style={[viewStyles.areasSmallCirclesBlockOuterBlockChildChild,viewStyles.areasSmallCirclesBlockOuterBlockChildChildThird,{left:'60%'}]}/>
                                                                                    <View style={[viewStyles.areasSmallCirclesBlockOuterBlockChildChild,viewStyles.areasSmallCirclesBlockOuterBlockChildChildLast,{left:'80%'}]}/>
                                                                                </View>
                                                                            </View>
                                                                        </View>
                                                                        <View style={[viewStyles.smallArea]}>
                                                                            <View style={[viewStyles.smallAreaCenter]}><View style={viewStyles.smallAreaCenterBefore}></View><View style={viewStyles.smallAreaCenterAfter}></View></View>
                                                                            <View style={[viewStyles.smallAreaCirle]}><View style={viewStyles.smallAreaCirleBefore}/></View>
                                                                        </View>
                                                                        {/* <View style={viewStyles.areasSmallAfter[activeSport.id]}/> */}
                                                                    </View>
                                                                </View>
                                                             : activeSport.id === 4 &&
                                                                <View style={[viewStyles.tennisArea]}>
                                                                  <View style={[viewStyles.tennisAreaBefore]}/>
                                                                  <View style={[viewStyles.tennisAreaAfter]}/>
                                                                </View>
                                                             }
                                                        </View>
                                                        <View style={[viewStyles.side,viewStyles.sideLastChild]}>
                                                            <View  style={viewStyles.sideBefore[activeSport.id]}/>
                                                            <View  style={viewStyles.sideAfter[activeSport.id]}/>
                                                            {activeSport.id === 3 ? (
                                                                <View style={[viewStyles.areas]}>
                                                                    <View style={[viewStyles.areasLarge[activeSport.id],duncking&&activeGame.last_event.type_id==='327'&&activeGame.last_event.event_value===3&& activeGame.last_event.side==='1'&&{backgroundColor:'rgba(255, 0, 0, 0.4)'}]}>
                                                                        <View style={[viewStyles.areasLargeCircle[activeSport.id],duncking&&activeGame.last_event.type_id==='327'&&activeGame.last_event.event_value===2&& activeGame.last_event.side==='1'&&{backgroundColor:'rgba(255, 0, 0, 0.4)'}]}/>
                                                                        <View style={[viewStyles.areasLargeLines]}/>
                                                                    </View>

                                                                    <View style={[viewStyles.areasSmall[activeSport.id]]}>
                                                                        <View style={[viewStyles.areasSmallCirclesBlock,{transform: [{ translateX: 0.15 * 200 }]}]}>
                                                                            <View style={[viewStyles.areasSmallCircles]}>
                                                                                <View style={[viewStyles.areasSmallCirclesBefore,duncking&&activeGame.last_event.type_id==='327'&&activeGame.last_event.event_value===1&& activeGame.last_event.side==='1'&&{backgroundColor:'rgba(255, 0, 0, 0.4)'}]}/>
                                                                                <View style={[viewStyles.left,viewStyles.areasSmallCirclesChild]}>
                                                                                    <View style={[viewStyles.areasSmallCirclesChildLeftAfter[activeSport.id],{borderStyle:'dashed'},duncking&&activeGame.last_event.type_id==='327'&&activeGame.last_event.event_value===1&& activeGame.last_event.side==='1'&&{backgroundColor:'rgba(255, 0, 0, 0.4)'}]}/>
                                                                                </View>
                                                                                <View style={[viewStyles.right,viewStyles.areasSmallCirclesChild]}>
                                                                                    <View style={[viewStyles.areasSmallCirclesChildRightAfter[activeSport.id],duncking&&activeGame.last_event.type_id==='327'&&activeGame.last_event.event_value===1&& activeGame.last_event.side==='1'&&{backgroundColor:'rgba(255, 0, 0, 0.4)'}]}/>
                                                                                </View>
                                                                            </View>

                                                                            <View style={[viewStyles.outerBlock]}>
                                                                                <View style={[viewStyles.areasSmallCirclesBlockOuterBlockChildTop,{position:'absolute',left:0,right:0,height:3}]}>
                                                                                    <View style={[viewStyles.areasSmallCirclesBlockOuterBlockChildChild,viewStyles.areasSmallCirclesBlockOuterBlockChildChildFirst,{left:'30%'}]}/>
                                                                                    <View style={[viewStyles.areasSmallCirclesBlockOuterBlockChildChild,viewStyles.areasSmallCirclesBlockOuterBlockChildChildSecond,{left:'40%'}]}/>
                                                                                    <View style={[viewStyles.areasSmallCirclesBlockOuterBlockChildChild,viewStyles.areasSmallCirclesBlockOuterBlockChildChildThird,{left:'60%'}]}/>
                                                                                    <View style={[viewStyles.areasSmallCirclesBlockOuterBlockChildChild,viewStyles.areasSmallCirclesBlockOuterBlockChildChildLast,{left:'80%'}]}/>
                                                                                </View>

                                                                                <View style={[viewStyles.areasSmallCirclesBlockOuterBlockChildBottom,{position:'absolute',left:0,right:0,height:3}]}>
                                                                                    <View style={[viewStyles.areasSmallCirclesBlockOuterBlockChildChild,viewStyles.areasSmallCirclesBlockOuterBlockChildChildFirst,{left:'30%'}]}/>
                                                                                    <View style={[viewStyles.areasSmallCirclesBlockOuterBlockChildChild,viewStyles.areasSmallCirclesBlockOuterBlockChildChildSecond,{left:'40%'}]}/>
                                                                                    <View style={[viewStyles.areasSmallCirclesBlockOuterBlockChildChild,viewStyles.areasSmallCirclesBlockOuterBlockChildChildThird,{left:'60%'}]}/>
                                                                                    <View style={[viewStyles.areasSmallCirclesBlockOuterBlockChildChild,viewStyles.areasSmallCirclesBlockOuterBlockChildChildLast,{left:'80%'}]}/>
                                                                                </View>
                                                                            </View>
                                                                        </View>
                                                                        <View style={[viewStyles.smallArea]}>
                                                                            <View style={[viewStyles.smallAreaCenter]}><View style={viewStyles.smallAreaCenterBefore}></View><View style={viewStyles.smallAreaCenterAfter}></View></View>
                                                                            <View style={[viewStyles.smallAreaCirle]}><View style={viewStyles.smallAreaCirleBefore}/></View>
                                                                        </View>
                                                                        {/* <View style={viewStyles.areasSmallAfter[activeSport.id]}/> */}
                                                                    </View>
                                                                </View>
                                                            ) : activeSport.id === 4 &&
                                                                <View style={[viewStyles.tennisArea]}>
                                                                   <View style={[viewStyles.tennisAreaBefore]}/>
                                                                   <View style={[viewStyles.tennisAreaAfter]}/>
                                                                </View>
                                                            }
                                                        </View>
                                                    </View>
                                                </View>
                                            </RadialGradient>
                                            }
                                            
                                            <View style={{position:'absolute',top:0,bottom:0,right:0,left:0,flex:1,height:200}}>
                                            
                                                {activeGame && activeGame.last_event &&(
                                                    <Animated.View
                                                    
                                                        style={[viewStyles.sbAnimation,activeSport.id!==4&&{opacity:fadeAnim}]}>
                                                        {(activeGame.last_event.type_id==='326' || activeGame.last_event.type_id==='20'|| activeGame.last_event.type_id==='21'||activeGame.last_event.type_id==='29') &&<LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1.0, y: 0 }} locations={[0, 0.9]} colors={activeGame.last_event.type_id==='20'||activeGame.last_event.type_id==='29'?['hsla(0,0%,100%,.5)','hsla(0,0%,100%,0)']:['rgba(255, 0, 0, 0)', 'rgba(255, 0, 0, 0.4)']} style={[viewStyles.linearGradient,activeGame.last_event.side==='2'&&{right:0,transform:[{rotateY:'180deg'}]}, viewStyles[
                                                            EventIDToNameMap[
                                                                activeGame.last_event.type_id
                                                            ]
                                                                ? EventIDToNameMap[
                                                                    activeGame.last_event.type_id
                                                                ].toLowerCase()
                                                                : ''
                                                        ], viewStyles[
                                                        activeGame &&
                                                            activeGame.last_event.type_id === '3' &&
                                                            activeGame.last_event.side === '2'
                                                            ? 'reverse'
                                                            : ''
                                                        ],
                                                        viewStyles[activeGame &&
                                                            activeGame.last_event.type_id === '20'
                                                            ? 'half-block'
                                                            : ''
                                                        ],
                                                        viewStyles[activeGame &&
                                                            activeGame.last_event.type_id === '1'
                                                            ? 'highlight-animation'
                                                            : ''
                                                        ], viewStyles[activeSport.id === 3 ? 'attack' : ''],
                                                       
                                                        viewStyles[activeSport.id === 4 && activeGame
                                                            ? activeGame.last_event.type_id === '205'
                                                                ? 'change1'
                                                                : ''
                                                            : ''
                                                        ],
                                                        viewStyles[activeSport.id === 3 ? 'in-possession' : ''
                                                        ]]}>
                                                    {
                                                      (activeGame.last_event.type_id!=='20'&&activeGame.last_event.type_id!=='29')&&
                                                        <View style={{position: 'absolute',
                                                            top: '42%',
                                                            width: 0,
                                                            height: 0,
                                                            backgroundColor: 'transparent',
                                                            borderStyle: 'solid',
                                                            borderLeftWidth: 90,
                                                            borderRightWidth: 90,
                                                            borderBottomWidth: 30,
                                                            borderLeftColor: 'transparent',
                                                            borderRightColor: 'transparent',
                                                            borderBottomColor: "rgba(255, 0, 0, 0.4)",
                                                            right:-105.2,transform: [
                                                                {rotate: '90deg'}
                                                              ] }}/>
                                                    }
                                                        </LinearGradient>}
                                                        {activeSport.id === 4 &&
                                                            activeGame.last_event.type_id==="205"&&<View>
                                                                <View style={[viewStyles.home]}>
                                                                    <View style={[{position:'absolute',top:"20%",width:'15%',padding:0,margin:0},viewStyles.imageContainer[1]]}>
                                                                        
                                                                            <Image
                                                                                resizeMode="contain"
                                                                                style={[viewStyles.point,{width:60,height:60,margin:0,padding:0}]}
                                                                                source={require('../../images/tennis/point.png')}
                                                                                alt="point"
                                                                            />
                                                                            <View style={viewStyles.score}>
                                                                              <View>
                                                                              <Text style={[viewStyles.scoreText]}>
                                                                                {activeGame.stats
                                                                                    ? activeGame.stats.point
                                                                                        ? activeGame.stats.passes
                                                                                            .team1_value
                                                                                        : 0
                                                                                    : ''}
                                                                              </Text>
                                                                              </View>
                                                                            </View>
                                                                        
                                                                    </View>
                                                                </View>
                                                                <View style={[viewStyles.away]}>
                                                                    <View style={[{position:'absolute',top:"20%",width:'15%',zIndex:1,margin:0,padding:0},viewStyles.imageContainer[2]]}>
                                                                        
                                                                            <Image
                                                                                resizeMode="contain"
                                                                                style={[viewStyles.point,{width:60,height:60,margin:0,padding:0}]}
                                                                                source={require('../../images/tennis/point.png')}
                                                                                alt="point"
                                                                            />
                                                                            <View style={viewStyles.score}>
                                                                             <View><Text style={[viewStyles.scoreText]}>
                                                                                {activeGame.stats
                                                                                    ? activeGame.stats.point
                                                                                        ? activeGame.stats.passes
                                                                                            .team2_value
                                                                                        : 0
                                                                                    : ''}
                                                                            </Text></View>
                                                                            </View>
                                                                       
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        }
                                                        {activeSport.id === 4 &&
                                                            activeGame.last_event.type_id == '206' &&
                                                                <View style={[{position:'absolute'},viewStyles.ballContainer[activeGame.last_event.side]['left']]}>
                                                                    <Animated.Image 
                                                                      resizeMode="contain"
                                                                      style={{width:20,height:20,transform:[{translateX:tennisBallX},{translateY:tennisBallY},{scale:tennisBallScale.interpolate({
                                                                        inputRange:[0,1],
                                                                        outputRange:[0.6,1]
                                                                      })},{rotate:ballRotate.interpolate({
                                                                        inputRange:[0,90],
                                                                        outputRange:['0deg','90deg']
                                                                      })}]}}
                                                                      source={require('../../images/tennis/ball.png')}
                                                                    />
                                                                </View>
                                                            }
                                                        {(activeSport.id === 1||activeSport.id===3) &&
                                                            (activeGame.last_event.type_id === '5' ||
                                                                activeGame.last_event.type_id === '25' ||
                                                                activeGame.last_event.type_id === '4' ||
                                                                activeGame.last_event.type_id === '321' ||
                                                                activeGame.last_event.type_id === '22' ||
                                                                activeGame.last_event.type_id === '23' ||
                                                                activeGame.last_event.type_id === '24') && (
                                                                <View style={{flex:1,height:200}}>
                                                                    {activeSport.id === 1 &&<Image source={require('../../images/soccer/ball.png')}  style={[viewStyles.soccerBall,viewStyles.soccerBallSport[activeGame.last_event.type_id],viewStyles.soccerBallPosition[activeGame.last_event.type_id][activeGame.last_event.side],{width:10, height:10}]}/>}
                                                                    {activeSport.id === 1 &&
                                                                        (activeGame.last_event.type_id === '24' ||
                                                                            activeGame.last_event.type_id === '4' ||
                                                                            activeGame.last_event.type_id === '22' ||
                                                                            activeGame.last_event.type_id === '23') ? (
                                                                            <View style={[viewStyles.animatedBlock[activeGame.last_event.type_id], viewStyles.halfBlock[activeSport.id],viewStyles.bulletsHalfBlock[activeGame.last_event.type_id][activeGame.last_event.side]]}>
                                                                                <View style={viewStyles.animatedBlockBefore}/>
                                                                                <View style={viewStyles.animatedBlockAfter}/>
                                                                                <View style={[viewStyles.bullet,viewStyles.bullets[activeGame.last_event.type_id][activeGame.last_event.side].bullet1]}/>
                                                                                <View style={[viewStyles.bullet,viewStyles.bullets[activeGame.last_event.type_id][activeGame.last_event.side].bullet2]}/>
                                                                                <View style={[viewStyles.bullet,viewStyles.bullets[activeGame.last_event.type_id][activeGame.last_event.side].bullet3]}/>
                                                                                <View style={[viewStyles.bullet,viewStyles.bullets[activeGame.last_event.type_id][activeGame.last_event.side].bullet4]}/>
                                                                                <View style={[viewStyles.bullet,viewStyles.bullets[activeGame.last_event.type_id][activeGame.last_event.side].bullet5]}/>
                                                                                <View style={[viewStyles.bullet,viewStyles.bullets[activeGame.last_event.type_id][activeGame.last_event.side].bullet6]}/>
                                                                                <View style={[viewStyles.bullet,viewStyles.bullets[activeGame.last_event.type_id][activeGame.last_event.side].bullet7]}/>
                                                                                <View style={[viewStyles.bullet,viewStyles.bullets[activeGame.last_event.type_id][activeGame.last_event.side].bullet8]}/>
                                                                                <View style={[viewStyles.bullet,viewStyles.bullets[activeGame.last_event.type_id][activeGame.last_event.side].bullet9]}/>
                                                                                <View style={[viewStyles.bullet,viewStyles.bullets[activeGame.last_event.type_id][activeGame.last_event.side].bullet10]}/>
                                                                            </View>
                                                                        ) : (
                                                                            <View style={[viewStyles.animatedBlock[activeGame.last_event.type_id], viewStyles.halfBlock[activeSport.id],viewStyles.bulletsHalfBlock[activeGame.last_event.type_id][activeGame.last_event.side]]}>
                                                                                <View style={viewStyles.animatedBlockBefore}/>
                                                                                <View style={viewStyles.animatedBlockAfter}/>
                                                                                <View style={[viewStyles.bullet,viewStyles.bullets[activeGame.last_event.type_id][activeGame.last_event.side].bullet1]}/>
                                                                                <View style={[viewStyles.bullet,viewStyles.bullets[activeGame.last_event.type_id][activeGame.last_event.side].bullet2]}/>
                                                                                <View style={[viewStyles.bullet,viewStyles.bullets[activeGame.last_event.type_id][activeGame.last_event.side].bullet3]}/>
                                                                                <View style={[viewStyles.bullet,viewStyles.bullets[activeGame.last_event.type_id][activeGame.last_event.side].bullet4]}/>
                                                                                <View style={[viewStyles.bullet,viewStyles.bullets[activeGame.last_event.type_id][activeGame.last_event.side].bullet5]}/>
                                                                                <View style={[viewStyles.bullet,viewStyles.bullets[activeGame.last_event.type_id][activeGame.last_event.side].bullet6]}/>
                                                                            </View>
                                                                        )}
                                                                </View>
                                                            ) }
                                                        {activeGame.last_event.type_id === '1' && (
                                                            <View style={{flex:1,height:200,position:'relative',alignItems:'center',flexDirection:'row',justifyContent:'center'}}>
                                                                <Animated.View style={{width:goalContainerWidth.interpolate({
                                                                                inputRange: [10, 25, 45],
                                                                                outputRange: [20, 40, 60]
                                                                            }),height:goalContainerHeight.interpolate({
                                                                              inputRange: [10, 25, 45],
                                                                              outputRange: [40, 60,80]
                                                                          }),opacity:centerSmallLinesOpacityAnim,borderRadius:20,backgroundColor:'#fff'}}>
                                                                  <View style={{flex:1,flexDirection:'row',alignItems:'center',backgroundColor:'#11c9e3',padding:5,borderTopLeftRadius:20,borderTopRightRadius:20}}>
                                                                  <Animated.Image
                                                                    style={{width:20,
                                                                    height:20,opacity:textVisibility}}
                                                                        source={require('../../images/soccer/ball.png')}
                                                                        alt="goal" />
                                                                    <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center'}}><Animated.Text style={{fontSize:20,fontWeight:'700',color:'#fff',opacity:textVisibility}}>Goal</Animated.Text></View>
                                                                  </View>
                                                                  <View style={{flex:1,justifyContent:'center',padding:5,flexDirection:'row',alignItems:'center'}}><Animated.Text style={{opacity:textVisibility}}>{currentLiveEventTeamName}</Animated.Text></View>
                                                                </Animated.View>
                                                            </View>
                                                        ) } 
                                                    </Animated.View>
                                                )}
                                                {activeSport.id === 3 && (
                                                    <View style={{flex:1,height:200}}>
                                                    <Animated.View
                                                     style={[viewStyles.sbAnimation]}
                                                     >
                                                    {/* <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1.0, y: 0 }} locations={[0, 0.9]} colors={['rgba(255, 0, 0, 0)', 'rgba(255, 0, 0, 0.4)']} style={[viewStyles.linearGradient,activeGame.last_event.side==='1'&&{right:0,transform:[{rotateY:'180deg'}]},activeGame.last_event.type_id == '320'&&activeGame.last_event.side==='2'&&{right:0,transform:[{rotateY:'-180deg'}]},
                                                   viewStyles[activeSport.id === 3 ? 'attack' : ''],
                                                    viewStyles[activeSport.id === 3 ? 'in-possession' : ''
                                                    ]]}>
                                                        <View style={{position: 'absolute',
                                                            top: '42%',
                                                            width: 0,
                                                            height: 0,
                                                            backgroundColor: 'transparent',
                                                            borderStyle: 'solid',
                                                            borderLeftWidth: 90,
                                                            borderRightWidth: 90,
                                                            borderBottomWidth: 30,
                                                            borderLeftColor: 'transparent',
                                                            borderRightColor: 'transparent',
                                                            borderBottomColor: "rgba(255, 0, 0, 0.4)",
                                                            right:-105.2,transform: [
                                                                {rotate: '90deg'}
                                                              ] }}/>
                                                    </LinearGradient> */}
                                                
                                                            <View style={[viewStyles.areas]}>
                                                                {/* <View style={[viewStyles.side,viewStyles.sideLastChild]}>
                                                                
                                                                </View> */}
                                                                {activeGame.last_event.type_id === '327' ||
                                                                    activeGame.last_event.type_id === '328' ||
                                                                    activeGame.last_event.type_id === '329' ||
                                                                    activeGame.last_event.type_id === '320' ||
                                                                    activeGame.last_event.type_id === '325' ? (
                                                                        <Animated.View style={[viewStyles.imagesBlock,{opacity:netVisibility},
                                                                          activeGame.last_event.type_id === '320'&&activeGame.last_event.side ==='2'&&{right:'23%',transform:[{translateX:100*0.5},{translateY:-20*0.5}]},activeGame.last_event.type_id === '320'&&activeGame.last_event.side ==='1'&&{left:'23%',transform:[{translateX:-100*0.5},{translateY:-20*0.5}]},activeGame.last_event.type_id !== '320'&&activeGame.last_event.side ==='2'&&{left:'23%',transform:[{translateX:-100*0.5},{translateY:-20*0.5}]},activeGame.last_event.type_id !== '320'&&activeGame.last_event.side ==='1'&&{right:'23%',transform:[{translateX:100*0.5},{translateY:-20*0.5}]},
                                                                        ]}>
                                                                            {activeGame.last_event.type_id ===
                                                                                '320' ? (
                                                                                    <View style={[viewStyles.images]}>
                                                                                        <Image
                                                                                            style={{width:60,
                                                                                            height:60}}
                                                                                            resizeMode="contain"
                                                                                            source={require('../../images/basketball/foul.png')}

                                                                                        />
                                                                                    </View>
                                                                                ) : activeGame.last_event.type_id ===
                                                                                    '325' ? (
                                                                                        <View style={[viewStyles.images]}>
                                                                                            <Image
                                                                                                style={{width:60,
                                                                                                height:60}}
                                                                                                resizeMode="contain"
                                                                                                source={require('../../images/basketball/basket-missed.png')}

                                                                                            />
                                                                                        </View>
                                                                                    ) : (
                                                                                        <View style={[viewStyles.images]}>
                                                                                           <View>
                                                                                           <Animated.Image
                                                                                                
                                                                                                style={[viewStyles.basket1,{width:60,
                                                                                                    height:60,
                                                                                                    opacity:netVisibility
                                                                                                  }]}
                                                                                                    resizeMode="contain"
                                                                                                source={require('../../images/basketball/basket1.png')}
                                                                                            />
                                                                                             <Animated.Image
                                                                                                resizeMode="contain"
                                                                                                source={require('../../images/basketball/basket2.png')}
                                                                                                style={[viewStyles.basket2,
                                                                                                  {opacity:netVisibility}
                                                                                                ]}
                                                                                            />
                                                                                           </View>
                                                                                            <View style={[viewStyles.ballBlock,viewStyles.ballBlockSide[activeGame.last_event.side],activeGame.last_event.side==='1'?{left:'-40%'}:{right:'-30%'}]}>
                                                                                                
                                                                                                 <Animated.Image
                                                                                                 style={{width:25,
                                                                                                 height:25,
                                                                                                 opacity:ballVisibility,
                                                                                                 transform:[{scale:ballScale.interpolate({
                                                                                                   inputRange:[0,1],
                                                                                                   outputRange:[0.1,1]
                                                                                                 })},{
                                                                                                  translateX:ballTranslateX},
                                                                                                  {
                                                                                                    translateY:ballTranslateY}
                                                                                                  ,{rotate:ballRotate.interpolate({
                                                                                                    inputRange: [0, 180],
                                                                                                    outputRange: ['0deg','180deg']
                                                                                                })}]
                                                                                                 }}
                                                                                                 source={require('../../images/basketball/ball.png')}

                                                                                                />
                                                                                            </View>
                                                                                        </View>
                                                                                     )} 
                                                                        </Animated.View>
                                                                    ) : null} 
                                                            </View>
                                                        </Animated.View>
                                                    </View>) }
                                            </View>
                                        </View>
                                    </View>
                                    <View style={[viewStyles.eventInfoContainer]}>
                                                            {activeGame &&
                                                                activeGame.last_event &&
                                                                activeGame.last_event.type_id &&
                                                                activeSport.hasOwnProperty('alias') && (
                                                                    <View style={[viewStyles.eventInfo]}>
                                                                        <View style={[viewStyles.eventInfoLeftRight]}>
                                                                            {activeSport.id === 1 &&
                                                                                activeGame.last_event.type_id === '3' ? (
                                                                                    <CustomIcon
                                                                                        name="card"
                                                                                        color='rgb(217, 171, 31)'
                                                                                        style={{
                                                                                            borderRadius: 4,
                                                                                            marginRight: 5,
                                                                                            fontSize: 19,
                                                                                        }} />
                                                                                ) : activeSport.id === 1 &&
                                                                                    activeGame.last_event.type_id === '2' ? (
                                                                                        <CustomIcon
                                                                                            name="card"
                                                                                            color="red"
                                                                                            style={{
                                                                                                borderRadius: 4,
                                                                                                marginRight: 5,
                                                                                                fontSize: 19,
                                                                                            }} />
                                                                                    ) : null}
                                                                            {activeSport.id == 1 &&
                                                                                activeGame.last_event.type_id === '4' ? (
                                                                                    <Image
                                                                                        style={{width:15,
                                                                                        height:15}}
                                                                                        source={require('../../images/soccer/corner.png')}
                                                                                        alt="corner" />
                                                                                ) : activeSport.id === 1 &&
                                                                                    activeGame.last_event.type_id === '6' ? (
                                                                                        <Image
                                                                                            style={{width:15,
                                                                                            height:15}}
                                                                                            source={require('../../images/soccer/substitution.png')}
                                                                                            alt="Substitution" />
                                                                                    ) : activeSport.id === 1 &&
                                                                                        activeGame.last_event.type_id === '1' ? (
                                                                                            <Image
                                                                                            style={{width:15,
                                                                                            height:15}}
                                                                                                source={require('../../images/soccer/ball.png')}
                                                                                                alt="goal" />
                                                                                        ) : null}
                                                                                        
                                                                            <Text
                                                                                 numberOfLines={1}
                                                                                 ellipsizeMode="tail"
                                                                                 style={{marginLeft:5,textTransform:'uppercase',fontSize:12,fontWeight:'700',color:'#fff'}}
                                                                                 >
                                                                                {currentLiveEventName}
                                                                            </Text>
                                                                        </View>
                                                                        {currentLiveEventTeamName&&currentLiveEventTeamName.length ? (
                                                                            <View style={[viewStyles.eventInfoLeftRight,viewStyles.eventInfoRight]}>
                                                                                <Text
                                                                                ellipsizeMode='tail'
                                                                                numberOfLines={1}
                                                                                style={{paddingRight:10,color:'#fff',fontSize:12}}
                                                                                >
                                                                                    {currentLiveEventTeamName}
                                                                                </Text>
                                                                                <View
                                                                                    style={[{width:2,height:20}, {
                                                                                        backgroundColor: currentLiveEventTeamName&&currentLiveEventTeamName.length
                                                                                            ? activeGame.info[`shirt${activeGame.last_event.side}_color`] !==
                                                                                                '000000'
                                                                                                ? '#' +
                                                                                                activeGame.info[`shirt${activeGame.last_event.side}_color`]
                                                                                                : 'rgb(165, 28, 210)'
                                                                                            : 'transparent',
                                                                                    }]}/>
                                                                            </View>
                                                                        ) : null}
                                                                    </View>
                                                                )}
                                                            {activeGame &&
                                                                activeGame.info &&
                                                                activeGame.info.match_add_minutes && (
                                                                    <View style={[viewStyles.extraTime]}>
                                                                        <Text style={{color:'#fff'}}>
                                                                            +{activeGame.info.match_add_minutes}'
                                                                        </Text>
                                                                    </View>
                                                                )}
                                                        </View>
                                    <View style={{flex:1,display:'flex',flexDirection:'row',justifyContent:'center'}}>
                                        <View style={[viewStyles.scoreInfoContainer]}>
                                            <View style={[viewStyles.scoreInfoInner]}>
                                                <View style={[viewStyles.gameInfoContainer]}>
                                                    <View style={{marginRight: 5}}>
                                                    <Text style={[viewStyles.scoreInfoType]}>
                                                        {activeSport.id === 1
                                                            ? 'Score'
                                                            : activeSport.id === 2 || activeSport.id === 4
                                                                ? 'Set'
                                                                : activeSport.id === 3
                                                                    ? 'Total'
                                                                    : 'Score'}
                                                    </Text>
                                                    </View>
                                                    <View><Text style={{color:'#fff',fontSize:12,fontWeight:'600'}}>{this.getSetTotalScore(activeGame)}</Text></View>
                                                </View>
                                                <View style={[viewStyles.setsInfoContainer]}>
                                                    <View style={[viewStyles.setsInfoInner]}>
                                                        {this.displayGameSets(activeGame)}
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            ): null
    }
}
const viewStyles = {
  sbAnimation: {
    position: "absolute",
    top: 5,
    bottom: 5,
    right: 5,
    left: 5
  },
  linearGradient: {
    height: 200 - 10,
    position: "absolute"
  },
  liquidContainer: {
    position: "relative",
    overflow: "hidden",
    transform: [{ translateY: 0 }]
  },
  sbAnimationContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative"
  },
  gameViewContainerStreamExistSmall: { transform: [{ scale: 0.6 }], top: 53 },
  gameViewContainerStreamExist: { zIndex: 10 },
  gameinfoContainerTeamNames: {
    position: "relative",
    height: 40,
    paddingLeft: 10,
    paddingRight: 10,
    zIndex: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    backgroundColor: "#018da0"
  },
  gameinfoContainerTeamNameInfo: {
    // overflow: "hidden",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flex: 1
  },
  gameinfoContainerTeamName: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1
  },
  teamName: { color: "#fff" },
  gameinfoContainerTeamScore: {
    marginLeft: 5,
    marginRight: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around"
  },
  gameinfoContainerTeamScoreContainer: {
    minWidth: 30,
    height: 30,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 4,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#11c9e3"
  },
  gameinfoContainerTeamScoreText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff"
  },
  gameTimeBlock: {
    position: "relative",
    height: 30,
    zIndex: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#018da0"
  },
  scoreInfoContainer: {
    flex: 1,
    flexDirection: "row",
    padding: 5,
    color: "#fff",
    backgroundColor: "#11c9e3"
  },

  scoreInfoInner: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  gameInfoContainer: {
    borderColor: "rgba(255, 255, 255, .2)",
    flexDirection: "row",
    // borderRightStyle: "solid",
    borderRightWidth: 1,
    paddingRight: 6
  },
  scoreInfoType: { color: "#fff", fontSize: 12, fontWeight: "600" },
  setsInfoInner: {
    flex: 1,
    flexDirection: "row"
  },
  setsInfo: {
    backgroundColor: "#12a4b8",
    marginLeft: 5,
    paddingRight: 6,
    paddingLeft: 6,
    borderRadius: 2,
    textAlign: "center",
    color: "#fff",
    fontSize: 12,
    fontWeight: "600"
  },
  gameTimeBlockChild: {
    display: "flex",
    flexDirection: "row",
    height: "100%",
    // justifyItems: "center",
    flex: 1,
    alignItems: "center"
  },
  switchAudio: { justifyContent: "flex-end", paddingRight: 10 },
  gameTimeBlockSwitchAudio: {
    justifyContent: "flex-end",
    paddingRight: 10,
    paddingLeft: 10,
    fontSize: 18
  },
  currentGameTime: { justifyContent: "center", fontSize: 14 },
  sbAnimationBlock: { position: "relative", flex: 1 },
  boardContainer: {
    position: "relative",
    width: width,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden"
  },
  boardContainerBoard: {
    overflow: "hidden",
    position: "relative",
    height: "100%",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#fff",
    zIndex: 1,
    flex: 1,
    marginTop: 3,
    marginBottom: 3,
    width: width - 6
  },
  sides: { flex: 1, position: "relative",},
  side: { position: "absolute", top: 0, bottom: 0, left: 0, right: 0},
  sideBefore: {
    3: {
        position: "absolute",
        top: 0,
        left: "30%",
        width: 1,
        height: '6%',
        minHeight: 7,
        backgroundColor: "#fff"
    },
    4:{
      position: "absolute",
      top: "50%",
      left: 0,
      width: "1%",
      height: 1,
      minWidth: 5,
      backgroundColor: "#fff"
    }
  },
  sideAfter: {
    3: {
    position: "absolute",
    bottom: 0,
      left: "30%",
      width: 1,
      height:'6%',
      minHeight: 7,
      backgroundColor: "#fff"
    }
  },
  sideLastChild: { transform: [{ rotateY: "180deg" }] },
  eventInfoContainer: {
    overflow: "hidden",
    height: 30,
    // marginTop: 5,
    display: "flex",
    // flexWrap: "wrap",
    flexDirection: "row"
  },

  eventInfo: {
    flex: 1,
    position: "relative",
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "rgba(0,0,0,.3)",
    bordeRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden"
  },
  eventInfoLeftRight: {
    position: "relative",
    height: 25,
    overflow: "hidden",
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  eventInfoRight: {
    paddingLeft: 10,
    flexDirection: "row",
    alignItems: "center"
  },
  extraTime:{
    width: 25,
    height: '100%',
    marginLeft: 5,
    backgroundColor: 'rgba(0, 0, 0, .3)',
    borderRadius: 4,
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  boardContainerCenter: {
    1:{
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "16%",
    paddingTop: "16%",
    transform: [{ translate: [-60 * 0.5, -60 * 0.5] }]
    },
    3:{
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "12%",
    paddingTop: "12%",
    transform: [{ translate: [-40 * 0.5, -40 * 0.5] }]
    },
  },
  smallAreaCenter:{
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 10,
    minWidth: 5,
    minHeight: 5,
    paddingTop: '100%',
    transform: [{ translate: [-40 * 0.05, -40 * 0.2] }]
  },
  smallAreaCenterBefore:{
    position: 'absolute',
    top: 0,
    left: 0,
    bottom:0,
    // width:30,
    // height:30,
    padding:3,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#fff",
    borderRadius: 60
  },
  smallAreaCenterAfter:{
    position: 'absolute',
    top: '-120%',
    left:-2,
    bottom:'-120%',
    width: 1,
    backgroundColor:'#fff'
   
  },
  smallAreaCirle:{
    position: 'absolute',
    top: 0,
    right: 0,
    width: 80,
    height: 30,
    // overflow: 'hidden'
  },
  smallAreaCirleBefore:{
    position: 'absolute',
    top: 0,
    bottom:0,
    right: 0,
    width: '200%',
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#fff",
    borderRadius: 200,
    transform: [{ translate: [-40 * 0.01, -40 * 0.4] }]
  },
  boardContainerCenterBefore: {
   1:{
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: 60,
    height: 60,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#fff",
    borderRadius: 0.3 * 200
   },
   3:{
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: 40,
    height: 40,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#fff",
    borderRadius: 0.3 * 200
   },
  },
  anglesChild: {
    position: "absolute",
    left: 0,
    width: "5%",
    height: 0.1 * 200
    // paddingTop: "5%"
  },
  angles: {
    flex: 1,
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  anglesTop: {
    top: 0,
    transform: [{ translate: [-(400 * 0.05) * 0.5, -(400 * 0.05) * 0.5] }]
  },
  anglesBottom: {
    bottom: 0,
    transform: [{ translate: [-(400 * 0.05) * 0.5, 400 * 0.05 * 0.5] }]
  },
  anglesChildAfter: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#fff",
    borderRadius: 0.5 * 200
  },
  areas: {
    // flex: 1,
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  areasSmall: {
    1: {
      position: "absolute",
      top: "30%",
      bottom: "30%",
      width: "8%",
      borderStyle: "solid",
      borderTopWidth: 1,
      borderRightWidth: 1,
      borderBottomWidth: 1,
      borderLeftWidth: 0,
      borderColor: "#fff"
    },
    3: {
      position: "absolute",
      top: "49%",
      left: 0,
      width: '12%',
      paddingTop: '100%',
      transform: [{ translateY: -50 * 0.5 }]
    }
  },
  areasSmallAfter: {
    1:{
    position: "absolute",
    top: "50%",
    right: "-50%",
    width: 3,
    height: 3,
    paddingTop: "14%",
    minWidth: 2,
    backgroundColor: "#fff",
    borderRadius: 200,
    transform: [{ translateY: 200 * 0.002 * 0.5 }]
    },
    3:{
        position: "absolute",
        left: "30%",
        bottom:0,
        width: 1,
        height: '6%',
        minHeight:7,
        backgroundColor: "#fff",
        borderRadius: 200,
    }
  },
  areasLarge: {
    1: {
      position: "absolute",
      top: "18%",
      bottom: "18%",
      width: "14%",
      borderStyle: "solid",
      borderTopWidth: 1,
      borderRightWidth: 1,
      borderBottomWidth: 1,
      borderLeftWidth: 0,
      borderColor: "#fff",
    },
    3: {
        position: "absolute",
        top: "5%",
        bottom: "5%",
        left: 0,
        width: "50%",
        overflow: "hidden",
    }
  },
  areasLargeCircle: {
    1: {
      position: "absolute",
      top: 0,
      bottom: 0,
      right: 0,
      width: "20%",
      overflow: "hidden",
      transform: [{ translateX: 0.054 *width/2 }]
    },
    3: {
    position: "absolute",
      top: "-4.5%",
      bottom: "-4.5%",
      left: 0,
      width: "100%",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#fff",
      borderRadius: 300,
      transform: [{ translateX: -(0.508 * width/2) }]
    }
  },
  areasLargeCircleAfter: {
    1: {
      position: "absolute",
      top: "50%",
      right: 0,
      width: "500%",
      paddingTop: "100%",
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: "#fff",
      borderRadius: 200 * 800,
      transform: [{ translateY: -200 * 0.253 * 0.5 }]
    },
    3: {}
  },
  areasLargeLines :{
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: '20%',
    borderStyle: 'solid',
    borderColor:'#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
},
  areasSmallCircles: {
    position: "relative",
    height: "100%",
    display: "flex",
    flexDirection: "row"
  },
  areasSmallCirclesBefore: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: "50%",
    width: "200%",
    borderColor: "#fff",
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 0
  },
  areasSmallCirclesChild: {
    position: "relative",
    overflow: "hidden",
    flex: 1
  },
  areasSmallCirclesChildAfter: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "200%",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#fff"
  },
  areasSmallCirclesChildLeftAfter: { 
      1:{left: 0, borderStyle: "dashed",borderWidth:1,borderRadius:1,borderColor:'#fff'},
      3:{
        left:0,
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: '200%',
        borderRadius: 200,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#fff"
      }
     },
  areasSmallCirclesChildRightAfter: {
      1:{ right: 0},
    3:{
        right:0,
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: '200%',
        borderRadius: 200,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#fff"
    }
    },
  areasSmallSmallArea: {
    position: "absolute",
    top: "50%",
    left: 0,
    width: "60%",
    paddingTop: "60%",
    transform: [{ translate: [200 * 0.15, 200 * 0.5] }]
  },
  areasSmallCirclesBlock: {
        position: "absolute",
        top: -10,
        bottom: -10,
        left: 0,
        right: 0,
        paddingTop: 10,
        paddingBottom: 10,
        transform: [{ translateX: 0.85 * 200 }]
    
  },
  areasSmallCirclesBlockOuterBlock: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: "50%",
    width: "150%",
    borderColor: "#fff",
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 0
  },
  areasSmallCirclesBlockOuterBlockChild: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 3
  },
  areasSmallCirclesBlockOuterBlockChildTop: { bottom: "100%" },
  areasSmallCirclesBlockOuterBlockChildBottom: { top: "100%" },
  areasSmallCirclesBlockOuterBlockChildChild: {
    display: "flex",
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: "#fff"
  },
  outerBlock: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: '50%',
    width:' 150%',
    borderColor: "#fff",
    borderStyle:'solid',
    borderWidth:1,
    borderLeftWidth: 0
},
  smallArea:{
    position: 'absolute',
    top: '50%',
    left: 0,
    width: '40%',
    paddingTop: '40%',
    transform: [{translate:[-(200*0.12)*0.14,-(-450*0.12)*0.5]}]
  },
  centerLinesContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  centerLines: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "10%",
    paddingRight: 1,
    paddingLeft: 1,
    zIndex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    transform: [{ translate: [-200 * 0.5, -200 * 0.5] }]
  },
  centerLinesSmall: {
    width: 0,
    height: 3,
    backgroundColor: '#fff',
    borderRadius: 1.5,
  },
  centerLinesLarge: {
    maxWidth: 0,
    flex:1
  },
  centerLinesLargeText: {
    width: '100%',
    height: 1.5,
    backgroundColor: '#fff',
    color: '#fff',
    fontSize: 40,
    fontweight: 700,
    letterSpacing: 5,
    textTransform: 'uppercase'
  },
  overlay:{
    position:'absolute',
    top:0,
    bottom:0,
    left:0,
    right:0,
    justifyContent: 'center',
    flexDirection:'row'
  },
  line:{
    position: 'relative',
    width: 0,
    backgroundColor:'#fff'
  },
  lineBefore:{
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, .3)'
  },
  linefirst:{
    right: '100%'
  },
  lineLast:{
    left: '100%'
  },
  separator:{
    width:0
  },
  text:{
    position: 'absolute',
    top: '50%',
    left: '50%'
  },
  boardBefore: {
    1: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: "50%",
      width: 1,
      backgroundColor: "#fff",
      transform: [{ translateX: -1 * 0.5 }]
    },
    3: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: "50%",
      width: 1,
      backgroundColor: "#fff",
      transform: [{ translateX: -1 * 0.5 }]
    },
    4:{
      position: "absolute",
      top: 0,
      bottom: 0,
      left: "50%",
      width: 2,
      backgroundColor: "#fff",
      transform: [{ translateX: -1 * 0.5 }]
    }
  },
  boardAfter: {
    1: {
      position: "absolute",
      top: "50%",
      left: "50%",
      width: 3,
      height: 3,
      backgroundColor: "#fff",
      borderRadius: 3,
      transform: [{ translate: [-3 * 0.5, -3 * 0.5] }]
    }
  },
  stScheme: {
    padding: 10
  },
  stSchemeInner: {
    width: "100%",
    display: "flex",
  },
  stContainer: {
    flex: 1
  },
  stBlock: {
    alignItems: "center",
    justifyContent: "center"
  },
  stCircle: {
    position: "relative",
    width: "30%",
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 80
  },
  stCircleAfter: {
    position: "absolute",
    top: 8,
    bottom: 8,
    left: 8,
    right: 8,
    borderRadius: 200
  },
  stType: {
    marginT: 5,
    paddingLeft: 5,
    paddingRight: 5,
    fontSize: 10,
    flexDirection:'row',
    alignItems:'center',
    justifyContent: "center",
    width:'90%'
  },
  slice: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
    // clipPath: [{polygon:[50% 0, 100% 0, 100% 100%, 50% 100%]}];
  },
  "half-block": {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "50%",
    zIndex: 1
  },
  soccerBall: {
    position: "absolute",
    zIndex: 1
  },
  soccerBallSport: {
   5:{
    top: '50%',
    width: '10%',
    height: '40%',
    transform: [{translateY:-(200*0.10)*0.5}]
   },
  },
  animatedBlock:{
    8:{

    },
    21:{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: '30%',
        width: '70%',
        opacity: 0
    },
    326:{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: '30%',
        width: '70%',
        opacity: 0
    },
    5:{
      
    }
  },
  animatedBlockBefore:{
    position: 'absolute',
    top: 0,
    width: 30,
    height: '50%'
  },
  animatedBlockAfter:{
    position: 'absolute',
    bottom: 0,
    width: 30,
    height: '50%'
  },
  soccerBallPosition: {
    4: {
      1: {
        top: "-2%",
        right: "-1%"
      },
      2: { bottom: "-2%", left: "-1%" }
    },
    5: {
      1: {
        right: "9.5%"
      },
      2: { left: "9.5%" }
    },
    22: {
      1: {
        top: "-2%",
        right: "-1%"
      },
      2: { bottom: "-2%", right: "-1%" }
    },
    23: {
      1: {
        left: "5%",
        bottom: "35%"
      },
      2: { top: "35%", right: "5%" }
    },
    24: {
      1: {
        left: "30%",
        bottom: "31.5%"
      },
      2: { top: "31.5%", right: "30%" }
    },
    25: {
      1: {
        bottom: "-3%",
        left: "40%"
      },
      2: { bottom: "-3%", right: "40%" }
    }
  },
  halfBlock:{
    1:{
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: '50%',
        zIndex: 1
    },
    3:{
      position: "absolute",
      width: "50%",
      top: 0,
      zIndex: 2
    }
  },
  bulletsHalfBlock:{
    4:{
        1:{
            right:0
        },
       2:{
         left:0
       } 
    },
    5:{
        1:{
            right:0
        },
       2:{
        left:0
       } 
    },
    22:{
        1:{
            left:0
        },
       2:{
        right:0
       } 
    },
    23:{
        1:{
            left:0
        },
       2:{
        right:0
       } 
    },
    24:{
        1:{
            left:0
        },
       2:{
        right:0
       } 
    },
    25:{
        1:{
            left:0
        },
       2:{
        right:0
       } 
    },
    321:{
        1:{
            left:0
        },
       2:{
        right:0
       } 
    },
    322:{
        1:{
            left:0
        },
       2:{
        right:0
       } 
    },
    323:{
        1:{
            left:0
        },
       2:{
        right:0
       } 
    },
    324:{
        1:{
            left:0
        },
       2:{
        right:0
       } 
    },
  },
  bullet: {
    position: "absolute",
    width: "3.5%",
    height: "3.5%",
    paddingTop: "3.5%",
    borderRadius: 200,
    backgroundColor: "#fff",
    overflow: "hidden"
  },
  penalty:{
    top: "50%",
    width: "2%",
    marginTop: "-1%",
    paddingTop: "2%"
  },

  bullets:{
    4:{
        0:{},
        1:{
        bullet1: {
            transform: [{ scale: 1 }],
            top: "5%",
            right: '3%'
          },
          bullet2: {
            transform: [{ scale: 0.95 }],
            top: '10%',
            right: "5.5%"
          },
          bullet3: {
            transform: [{ scale: 0.9 }],
            top: '15%',
            right: '7.5%'
          },
          bullet4: {
            transform: [{ scale: 0.85 }],
            top: '20%',
            right: '9%'
          },
          bullet5: {
            transform: [{ scale: 0.8 }],
            top: '25%',
            right: '10%'
          },
          bullet6: {
            transform: [{ scale: 0.75 }],
            top: '30%',
            right:' 10.5%'
          },
          bullet7: {
            transform: [{ scale: 0.7 }],
            top: '35%',
            right:' 10.5%'
          },
          bullet8: {
            transform: [{ scale: 0.65 }],
            top: '40%',
            right: '10%'
          },
          bullet9: {
            transform: [{ scale: 0.6 }],
            top: '45%',
            right: "9%"
          },
          bullet10: {
            transform: [{ scale: 0.55 }],
            top: '50%',
            right: "7.5%"
          }
        },
        2:{
            bullet1: {
                transform: [{ scale: 1 }],
                bottom: "5%",
                left: '5.3%'
              },
              bullet2: {
                transform: [{ scale: 0.95 }],
                bottom: '10%',
                left: "9.6%"
              },
              bullet3: {
                transform: [{ scale: 0.9 }],
                bottom: '15%',
                left: '12.9%'
              },
              bullet4: {
                transform: [{ scale: 0.85 }],
                bottom: '20%',
                left: '15.2%'
              },
              bullet5: {
                transform: [{ scale: 0.8 }],
                bottom: '25%',
                left: '16.5%'
              },
              bullet6: {
                transform: [{ scale: 0.75 }],
                bottom: '30%',
                left:'16.8%'
              },
              bullet7: {
                transform: [{ scale: 0.7 }],
                bottom: '35%',
                left:'16.1%'
              },
              bullet8: {
                transform: [{ scale: 0.65 }],
                bottom: '40%',
                left: '14.4%'
              },
              bullet9: {
                transform: [{ scale: 0.6 }],
                bottom: '45%',
                left: "11.7%"
              },
              bullet10: {
                transform: [{ scale: 0.55 }],
                bottom: '50%',
                left: "8%"
              }
        }
    },
    5:{
        0:{},
        1:{
        bullet1: {
            transform: [{ scale: 1 }],
            right: "4%"
          },
          bullet2: {
            transform: [{ scale: 0.95 }],
            right: "7%"
          },
          bullet3: {
            transform: [{ scale: 0.9 }],
            right: "10%"
          },
          bullet4: {
            transform: [{ scale: 0.85 }],
            right: "13%"
          },
          bullet5: {
            transform: [{ scale: 0.8 }],
            right: "16%"
          }
        },
        2:{
            bullet1: {
                transform: [{ scale: 1 }],
                left: "4%"
              },
              bullet2: {
                transform: [{ scale: 0.95 }],
                left: "7%"
              },
              bullet3: {
                transform: [{ scale: 0.9 }],
                left: "10%"
              },
              bullet4: {
                transform: [{ scale: 0.85 }],
                left: "13%"
              },
              bullet5: {
                transform: [{ scale: 0.8 }],
                left: "16%"
              }
        }
    },
    22:{
        1:{
            bullet1: {
                transform: [{ scale: 1 }],
                right: "17%",
                bottom: '36%'
              },
              bullet2: {
                transform: [{ scale: 0.95 }],
                right: "22%",
                bottom: '36%'
              },
              bullet3: {
                transform: [{ scale: 0.9 }],
                right: "27%",
                bottom: '36%'
              },
              bullet4: {
                transform: [{ scale: 0.85 }],
                right: "32%",
                bottom: '36%'
              },
              bullet5: {
                transform: [{ scale: 0.8 }],
                right: "37%",
                bottom: '36%'
              },
              bullet6: {
                transform: [{ scale: 0.75 }],
                right: "42%",
                bottom: '36%'
              },
              bullet7: {
                transform: [{ scale: 0.7 }],
                right: "47%",
                bottom: '36%'
              },
              bullet8: {
                transform: [{ scale: 0.65 }],
                right: "52%",
                bottom: '36%'
              },
              bullet9: {
                transform: [{ scale: 0.6 }],
                right: "57%",
                bottom: '36%'
              }
        },
        2:{
            bullet1: {
                transform: [{ scale: 1 }],
                right: "17%",
                top: '36%'
              },
              bullet2: {
                transform: [{ scale: 0.95 }],
                right: "22%",
                top: '36%'
              },
              bullet3: {
                transform: [{ scale: 0.9 }],
                right: "27%",
                top: '36%'
              },
              bullet4: {
                transform: [{ scale: 0.85 }],
                right: "32%",
                top: '36%'
              },
              bullet5: {
                transform: [{ scale: 0.8 }],
                right: "37%",
                top: '36%'
              },
              bullet6: {
                transform: [{ scale: 0.75 }],
                right: "42%",
                top: '36%'
              },
              bullet7: {
                transform: [{ scale: 0.7 }],
                right: "47%",
                top: '36%'
              },
              bullet8: {
                transform: [{ scale: 0.65 }],
                right: "52%",
                top: '36%'
              },
              bullet9: {
                transform: [{ scale: 0.6 }],
                right: "57%",
                top: '36%'
              } , 
              bullet10: {
                transform: [{ scale: 0.55 }],
                right: "57%",
                top: '36%'
              }  
        }
    },
    23:{
        1:{bullet1: {
            transform: [{ scale: 1 }],
            left: "17%",
            bottom: '36%'
          },
          bullet2: {
            transform: [{ scale: 0.95 }],
            left: "22%",
            bottom: '36%'
          },
          bullet3: {
            transform: [{ scale: 0.9 }],
            left: "27%",
            bottom: '36%'
          },
          bullet4: {
            transform: [{ scale: 0.85 }],
            left: "32%",
            bottom: '36%'
          },
          bullet5: {
            transform: [{ scale: 0.8 }],
            left: "37%",
            bottom: '36%'
          },
          bullet6: {
            transform: [{ scale: 0.75 }],
            left: "42%",
            bottom: '36%'
          },
          bullet7: {
            transform: [{ scale: 0.7 }],
            left: "47%",
            bottom: '36%'
          },
          bullet8: {
            transform: [{ scale: 0.65 }],
            left: "52%",
            bottom: '36%'
          },
          bullet9: {
            transform: [{ scale: 0.6 }],
            left: "57%",
            bottom: '36%'
          },
          bullet10: {
            transform: [{ scale: 0.55 }],
            left: "62%",
            bottom: '36%'
          }
        },
        2:{
            bullet1: {
                transform: [{ scale: 1 }],
                right: "17%",
                top: '36%'
              },
              bullet2: {
                transform: [{ scale: 0.95 }],
                right: "22%",
                top: '36%'
              },
              bullet3: {
                transform: [{ scale: 0.9 }],
                right: "27%",
                top: '36%'
              },
              bullet4: {
                transform: [{ scale: 0.85 }],
                right: "32%",
                top: '36%'
              },
              bullet5: {
                transform: [{ scale: 0.8 }],
                right: "37%",
                top: '36%'
              },
              bullet6: {
                transform: [{ scale: 0.75 }],
                right: "42%",
                top: '36%'
              },
              bullet7: {
                transform: [{ scale: 0.7 }],
                right: "47%",
                top: '36%'
              },
              bullet8: {
                transform: [{ scale: 0.65 }],
                right: "52%",
                top: '36%'
              },
              bullet9: {
                transform: [{ scale: 0.6 }],
                right: "57%",
                top: '36%'
              } , 
              bullet10: {
                transform: [{ scale: 0.55 }],
                right: "57%",
                top: '36%'
              }  
        }
    },
    24:{
        1:{
            bullet1: {
                transform: [{ scale: 1 }],
                left: "68%",
                bottom:'33.1%'
              },
              bullet2: {
                transform: [{ scale: 0.95 }],
                left: "73%",
                bottom:'34.2%'
              },
              bullet3: {
                transform: [{ scale: 0.9 }],
                left: "78%",
                bottom:'35.3%'
              },
              bullet4: {
                transform: [{ scale: 0.85 }],
                left: "83%",
                bottom:'36.4%'
              },
              bullet5: {
                transform: [{ scale: 0.8 }],
                left: "88%",
                bottom:'37.5%'
              },
              bullet6: {
                transform: [{ scale: 0.75 }],
                left: "93%",
                bottom:'38.6%'
              },
              bullet7: {
                transform: [{ scale: 0.7 }],
                left: "98%",
                bottom:'39.7%'
              },
              bullet8: {
                transform: [{ scale: 0.65 }],
                left: "103%",
                bottom:'40.8%'
              },
              bullet9: {
                transform: [{ scale: 0.6 }],
                left: "108%",
                bottom:'41.9%'
              },
              bullet10: {
                transform: [{ scale: 0.55 }],
                left: "113%",
                bottom:'43%'
              }
        },
        2:{
            bullet1: {
                transform: [{ scale: 1 }],
                right: "68%",
                top:'33.1%'
              },
              bullet2: {
                transform: [{ scale: 0.95 }],
                right: "73%",
                top:'34.2%'
              },
              bullet3: {
                transform: [{ scale: 0.9 }],
                right: "78%",
                top:'35.3%'
              },
              bullet4: {
                transform: [{ scale: 0.85 }],
                right: "83%",
                top:'36.4%'
              },
              bullet5: {
                transform: [{ scale: 0.8 }],
                right: "88%",
                top:'37.5%'
              },
              bullet6: {
                transform: [{ scale: 0.75 }],
                right: "93%",
                top:'38.6%'
              },
              bullet7: {
                transform: [{ scale: 0.7 }],
                right: "98%",
                top:'39.7%'
              },
              bullet8: {
                transform: [{ scale: 0.65 }],
                right: "103%",
                top:'40.8%'
              },
              bullet9: {
                transform: [{ scale: 0.6 }],
                right: "108%",
                top:'41.9%'
              },
              bullet10: {
                transform: [{ scale: 0.55 }],
                right: "113%",
                top:'43%'
              }  
        }
    },
    25:{
        1:{
            bullet1: {
                transform: [{ scale: 1 }],
                left: "85%",
                bottom:'5%'
              },
              bullet2: {
                transform: [{ scale: 0.95 }],
                left: "90%",
                bottom:'10%'
              },
              bullet3: {
                transform: [{ scale: 0.9 }],
                left: "95%",
                bottom:'15%'
              },
              bullet4: {
                transform: [{ scale: 0.85 }],
                left: "100%",
                bottom:'20%'
              },
              bullet5: {
                transform: [{ scale: 0.8 }],
                left: "105%",
                bottom:'25%'
              },
              bullet6: {
                transform: [{ scale: 0.75 }],
                left: "110%",
                bottom:'30%'
              }
        },
        2:{
            bullet1: {
                transform: [{ scale: 1 }],
                right: "85%",
                bottom:'5%'
              },
              bullet2: {
                transform: [{ scale: 0.95 }],
                right: "90%",
                bottom:'10%'
              },
              bullet3: {
                transform: [{ scale: 0.9 }],
                right: "95%",
                bottom:'15%'
              },
              bullet4: {
                transform: [{ scale: 0.85 }],
                right: "100%",
                bottom:'20%'
              },
              bullet5: {
                transform: [{ scale: 0.8 }],
                right: "105%",
                bottom:'25%'
              },
              bullet6: {
                transform: [{ scale: 0.75 }],
                right: "110%",
                bottom:'30%'
              }
        }
    },
    321:{
      1:{
        bullet1: {
            transform: [{ scale: 1 }],
            right: "4%"
          },
          bullet2: {
            transform: [{ scale: 0.95 }],
            right: "7%"
          },
          bullet3: {
            transform: [{ scale: 0.9 }],
            right: "10%"
          },
          bullet4: {
            transform: [{ scale: 0.85 }],
            right: "13%"
          },
          bullet5: {
            transform: [{ scale: 0.8 }],
            right: "16%"
          }
        },
        2:{
            bullet1: {
                transform: [{ scale: 1 }],
                left: "4%"
              },
              bullet2: {
                transform: [{ scale: 0.95 }],
                left: "7%"
              },
              bullet3: {
                transform: [{ scale: 0.9 }],
                left: "10%"
              },
              bullet4: {
                transform: [{ scale: 0.85 }],
                left: "13%"
              },
              bullet5: {
                transform: [{ scale: 0.8 }],
                left: "16%"
              }
        }
    },
    322:{
      1:{
        bullet1: {
            transform: [{ scale: 1 }],
            right: "4%"
          },
          bullet2: {
            transform: [{ scale: 0.95 }],
            right: "7%"
          },
          bullet3: {
            transform: [{ scale: 0.9 }],
            right: "10%"
          },
          bullet4: {
            transform: [{ scale: 0.85 }],
            right: "13%"
          },
          bullet5: {
            transform: [{ scale: 0.8 }],
            right: "16%"
          }
        },
        2:{
            bullet1: {
                transform: [{ scale: 1 }],
                left: "4%"
              },
              bullet2: {
                transform: [{ scale: 0.95 }],
                left: "7%"
              },
              bullet3: {
                transform: [{ scale: 0.9 }],
                left: "10%"
              },
              bullet4: {
                transform: [{ scale: 0.85 }],
                left: "13%"
              },
              bullet5: {
                transform: [{ scale: 0.8 }],
                left: "16%"
              }
        }
    },
    323:{
      1:{
        bullet1: {
            transform: [{ scale: 1 }],
            right: "4%"
          },
          bullet2: {
            transform: [{ scale: 0.95 }],
            right: "7%"
          },
          bullet3: {
            transform: [{ scale: 0.9 }],
            right: "10%"
          },
          bullet4: {
            transform: [{ scale: 0.85 }],
            right: "13%"
          },
          bullet5: {
            transform: [{ scale: 0.8 }],
            right: "16%"
          }
        },
        2:{
            bullet1: {
                transform: [{ scale: 1 }],
                left: "4%"
              },
              bullet2: {
                transform: [{ scale: 0.95 }],
                left: "7%"
              },
              bullet3: {
                transform: [{ scale: 0.9 }],
                left: "10%"
              },
              bullet4: {
                transform: [{ scale: 0.85 }],
                left: "13%"
              },
              bullet5: {
                transform: [{ scale: 0.8 }],
                left: "16%"
              }
        }
    },
    324:{
      1:{
        bullet1: {
            transform: [{ scale: 1 }],
            right: "4%"
          },
          bullet2: {
            transform: [{ scale: 0.95 }],
            right: "7%"
          },
          bullet3: {
            transform: [{ scale: 0.9 }],
            right: "10%"
          },
          bullet4: {
            transform: [{ scale: 0.85 }],
            right: "13%"
          },
          bullet5: {
            transform: [{ scale: 0.8 }],
            right: "16%"
          }
        },
        2:{
            bullet1: {
                transform: [{ scale: 1 }],
                left: "4%"
              },
              bullet2: {
                transform: [{ scale: 0.95 }],
                left: "7%"
              },
              bullet3: {
                transform: [{ scale: 0.9 }],
                left: "10%"
              },
              bullet4: {
                transform: [{ scale: 0.85 }],
                left: "13%"
              },
              bullet5: {
                transform: [{ scale: 0.8 }],
                left: "16%"
              }
        }
    },
},
  imagesBlock: {
    position: "absolute",
    top: "36%",
    width: "25%",
    zIndex: 1,
  },
  images: {
    paddingRight: 1,
    paddingLeft: 1,
    opacity: 1,
    transform: [{ scale: 1 }]
  },
  basket1: {
    position: 'relative',
    zIndex: 1
  },
  basket2: {
    position: 'relative',
    width: 60,
    height:30,
    marginTop: '-23%' ,
    zIndex: 3
  },
  areasSmallCirclesBlockOuterBlockChildChildFirst: { left: "30%" },
  areasSmallCirclesBlockOuterBlockChildChildSecond: { left: "40%" },
  areasSmallCirclesBlockOuterBlockChildChildThird: { left: "60%" },
  areasSmallCirclesBlockOuterBlockChildChildLast: { left: "60%" },
  dangerousattack: { width: "70%" },
  attack: { width: "60.5%" },
  attackaway: {
    transform: [{ rotateY: "180deg" }]
  },
  dangerousattackaway: {
    transform: [{ rotateY: "180deg" }]
  },
  goalkeepersave: {
    position: 'absolute',
    width: '8%',
    bottom: '30%',
    top: '30%',
  },
  "in-possession":{
    opacity: .7
  },
  ballBlock:{
    position: 'absolute',
    width: '50%',
    top: 10,
    zIndex: 2
  },
  ballBlockSide:{
   1:{
    transform: [{translateX:-(40*0.1)},{translateY: 200*0.03},{scale:1}],
   },
   2:{
    transform: [{translateX:40*0.1},{translateY: 200*0.03},{scale:1}],
   }
  },
  threepoints:{
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden'
  },
  twopoints:{
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden'
  },
  onepoint:{
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden'
  },
  freethrow:{
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden'
  },
  free1throw:{
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden'
  },
  free3throws:{
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden'
  },
  missedfreethrow:{
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden'
  },
  ballinplay :{
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  ballContainer:{
    1:{
      right:{
        left: '5%',
        bottom: '15%'
      },
      left:{
        left: '5%',
        top: '15%'
      }
   
  },
  2:{
    right:{
      right: '5%',
      top: '15%'
    },
    left:{
      right: '5%',
      bottom: '15%'
    }
  }
},
imageContainer:{
  1:{
    left: "15%",
    transform:[{translate:[-10,50]}]
  },
  2:{
    right: "15%",
    transform:[{translate:[10,50]}]
  }
},
score:{
  position: "absolute",
  top: 0,
  left: 0,
  bottom:0,
  right:0,
  flexDirection:'row',
  alignItems: "center",
  justifyContent: "center",
},
scoreText:{
  fontWeight: "700",
  fontSize: 25,
  textAlign:'center'
},
tennisArea:{
  position: "absolute",
  top: "10%",
  bottom: "10%",
  left: 0,
  width: "50%",
  borderStyle:'solid',
  borderColor:'#fff',
  borderTopWidth: 1,
  borderBottomWidth:1
},
tennisAreaBefore:{
  position: "absolute",
  top: 0,
  bottom: 0,
  left: "50%",
  width: 1,
  backgroundColor: "#fff"
},
tennisAreaAfter:{
  position: "absolute",
  top: "50%",
  right: 0,
  width: "50%",
  height:1,
  backgroundColor: "#fff"
},
};
