/**
 * @format
 */

import 'react-native';
import React from 'react';
import LiveBtn from '../APP/components/liveBtn';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer.create(<LiveBtn addEventToSelection={(a,b,c,d)=>{ console.log(a,b,c,d)}} game={{is_blocked:0,id:1232,info:{team1_name:'dfdf',team2_name:'dfdfd'}}} betSelections={{}} e={{price:2.00,}} eventMarket={{id:2323}} oddType="decimal" competition={{id:255,name:'EPL', alias:'EPSd'}} sport={{id:2111,name:'Football',alias:'Soccer'}}/>).toJSON();
  expect(tree).toMatchSnapshot();
});
