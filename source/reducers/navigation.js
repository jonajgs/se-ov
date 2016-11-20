import Home from '../components/home';
import { PUSH, POP, GO_TO_INDEX } from '../actions/navigation';

const initialState = {
    title: 'Inicio',
    index: 0,
    component: Home,
};

export default function(state = initialState, action) {
    switch (action.type) {
        default:
            return initialState;
    }
}
