import Home from '../components/home';
import {
    PUSH,
} from '../actions/navigation';

const stateDefault = {
    component: Home,
};

export default function navigationReducer(state = stateDefault, action) {
    switch(action.type) {
        case PUSH:
            return {
                ...state,
                component: action.component,
            };
        default:
            return state;
    }
};
