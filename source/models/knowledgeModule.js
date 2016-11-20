import Backbone from 'backbone';
import RNFS from 'react-native-fs';
import Rule from './Rule';

const knowledgeModule = Backbone.Model.extend({
    initialize: (description, file) => {
        this.description = description;
        this.loadKnowledgeBase(file);
    },
    loadKnowledgeBase: file => {
        this.knowledgeBase = RNFS.readFile(RNFS.MainBundlePath + state.file, res => res.split(' '));
    },
    getKnowledgeModule: () => {
        return {
            name: 'modulo conocimiento',
            knowledge: this.knowledgeBase;
        };
    },
    filterObjectives: () => {
        return this.knowledgeBase.filter(kb => {
            let rule = new Rule(kb);
            if ( rule.isObjective() ) {
                return true;
            }
        });
    },
    unmark: () => {
        this.knowledgeBase.map(kb => {
            let rule = new Rule(kb);
            rule.set({ mark: false });
        });
    },
    removeTriggers: () => {
        this.knowledgeBase.map(kb => {
            let rule = new Rule(kb);
            rule.set({ trigger: false });
        });
    },
    rulesTriggered: () => {
        return this.knowledgeBase.filter(kb => {
            let rule = new Rule(kb);
            if ( rule.trigger ) {
                return true;
            }
        });
    },
});

export default knowledgeModule;
