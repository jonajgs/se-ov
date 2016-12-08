import WorkingMemory from '../models/WorkingMemory';
import KnowledgeModule from '../models/KnowledgeModule';
import {
    START,
    NEXT,
} from '../actions/inferenceMachine';
import {
    startRepository,
    nextRespository,
} from '../repositories/inferenceMachine';

const defaultState = {
    index: 0,
    workingMemory: new WorkingMemory(),
    knowledgeModule: new KnowledgeModule("Animales", 'filezoo.bc'),
};

export default function inferenceMachineReducer(state = defaultState, action) {
    console.log('Action', action);
    console.log('STATE', state);
    switch ( action.type ) {
        case START:
            return startRepository(state, action.navigator);
        case NEXT:
            return nextRespository(state, action);
        default:
            return state;
    }
}
