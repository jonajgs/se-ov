import WorkingMemory from '../models/WorkingMemory';
import KnowledgeModule from '../models/KnowledgeModule';
import InferenceMachine from '../models/InferenceMachine';
import Rule from '../models/Rule';

export function startRepository(state, navigator) {
    let inferenceMachine = new InferenceMachine(state.knowledgeModule, state.workingMemory);
    let question = inferenceMachine.nextQuestion(state, state.knowledgeModule, state.workingMemory);

    return {
        ...state,
        question,
        inferenceMachine,
        navigator,
    };
};

export function nextRespository(state, action) {

    let question = state.inferenceMachine.nextQuestion(state, state.knowledgeModule, state.workingMemory, state.inferenceMachine.get('knowledgeModuleTemp'), action);

    if(!question) {
        let inferenceMachine = new InferenceMachine(state.knowledgeModule, state.workingMemory);
        question = inferenceMachine.nextQuestion(state, state.knowledgeModule, state.workingMemory);
    }

    return {
        ...state,
        question,
        navigator: action.navigator,
    };
};
