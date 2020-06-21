/**
 * @format
 */
import React from 'react'
import {AppRegistry} from 'react-native';
import App from './APP/containers/app';
import 'react-native-gesture-handler';
import { Root } from 'native-base';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import PushNotificationManager from './PushNotificationManager'
import { combineReducers, applyMiddleware, createStore } from 'redux';
import { appStateReducer, sportsBookReducer, profileReducer, modalReducer, homeDataReducer, casinoReducer, liveDataReducer, prematchDataReducer, competitionDataReducer, gameViewDataReducer, betslipDataReducer, betHistoryDataReducer } from './APP/actionReducers';
import thunk from 'redux-thunk';

const reducers = combineReducers({
    appState:appStateReducer,
    sportsbook:sportsBookReducer,
    profile:profileReducer,
    homeData:homeDataReducer,
    casinoMode:casinoReducer,
    liveData:liveDataReducer,
    sb_modal:modalReducer,
    prematchData:prematchDataReducer,
    competitionData:competitionDataReducer,
    gameViewData:gameViewDataReducer,
    betslip:betslipDataReducer,
    betHistoryData:betHistoryDataReducer
}),store = createStore(reducers,applyMiddleware(thunk))
, AppView = () => {
    return (
        <Root>
            <Provider store={store}>
                <PushNotificationManager>
                    <App />
                </PushNotificationManager>
            </Provider>
        </Root>
    )
}
AppRegistry.registerComponent(appName, () => AppView);
