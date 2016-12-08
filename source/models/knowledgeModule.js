import Backbone from 'backbone';
import RNFS from 'react-native-fs';
import Rule from './Rule';

const knowledgeModule = Backbone.Model.extend({
    defaults: {
        description: '',
        knowledgeBase: [],
    },
    initialize: function(description, file = null){
        this.set('description', description);

        if(file) {
            this.loadKnowledgeBase(file);
        }
    },
    constructor: function() {
        Backbone.Model.apply(this, arguments);
    },
    loadKnowledgeBase: function(file) {
        RNFS.readFile(RNFS.ExternalDirectoryPath + '/' + file)
            .then(function(result) {
                return result
                    .replace(/<\/regla> /g, '</regla>\n')
                    .split('\n')
                    .filter(rule => rule.trim() !== '')
                    .map(rule => new Rule(rule));
            })
            .then(result => {
                this.set('knowledgeBase', result);
            });
    },
    getKnowledgeModule: () => {
        return {
            name: 'modulo conocimiento',
            knowledge: this.knowledgeBase,
        };
    },
    filterObjectives: function() {
        let objetives = [];

        this.get('knowledgeBase').filter(rule => {
            if ( rule.isObjective() ) {
                objetives.push(rule);
            }
        });

        return objetives;
    },
    unmark: function() {
        this.get('knowledgeBase').map(rule => {
            rule.set('mark', false);
        });
    },
    removeTriggers: function() {
        this.get('knowledgeBase').map(rule => {
            rule.set({ trigger: false });
        });
    },
    rulesTriggered: function() {
        return this.get('knowledgeBase').filter(rule => {
            if ( rule.trigger ) {
                return true;
            }
        });
    },
});

export default knowledgeModule;
