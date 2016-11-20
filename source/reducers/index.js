import { combineReducers } from 'redux';
import InferenceMachine from './inferenceMachine';
import Navigation from './navigation';

const reducers = combineReducers({
    inferenceMachine: InferenceMachine,
    navigation: Navigation,
});

export default reducers;
