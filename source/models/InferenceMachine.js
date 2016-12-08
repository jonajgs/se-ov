import Backbone from 'backbone';
import KnowledgeModule from './KnowledgeModule';
import Denial from './Denial';
import Rule from './Rule';
import Atom from './Atom';

const InferenceMachine = Backbone.Model.extend({
    defaults: {
        backward: false,
        knowledgeModuleTemp: null,
    },
    initialize: function(knowledgeModule, workingMemory) {
        // stuff
        this.build(knowledgeModule, workingMemory);
    },
    constructor: function() {
        Backbone.Model.apply(this, arguments);
    },
    build: function(knowledgeModule, workingMemory) {
        let objetiveRules = knowledgeModule.filterObjectives();

        let toSatisfy = [];
        let knowledgeBasePremium = [];
        let result;
        let knowledgeBasePremiumName;
        let exit = false;
        let position = -1;
        let times = 0;
        let total = objetiveRules.length;
        this.backward = true;
        let knowledgeModuleTemp;

        position = Math.floor((Math.random() * total));

        knowledgeModule.unmark();
        knowledgeModule.removeTriggers();

        objetiveRules[position].get('conclutionParts').map(conclution => {
            if ( conclution instanceof Atom ) {
                if ( conclution.get('objective') ) {
                    knowledgeBasePremiumName = conclution.get('description').toUpperCase();
                }
            }
        });

        knowledgeModuleTemp = new KnowledgeModule(knowledgeBasePremiumName);
        this.concat(toSatisfy, objetiveRules[position].get('conclutionParts'));
        do {
            exit = true;
            knowledgeModule.get('knowledgeBase').map(atomRule => {
                if ( !atomRule.get('mark') && this.isEligible(atomRule, toSatisfy) ) {
                    exit = false;
                    atomRule.set('mark', true);
                    this.concat(toSatisfy, atomRule.get('conditionParts'));
                    knowledgeBasePremium.unshift(atomRule);
                }
            });
        } while ( !exit );
        knowledgeModuleTemp.set('knowledgeBase', knowledgeBasePremium);
        console.log('Intentando con ', knowledgeModuleTemp.get('description'));
        this.set('knowledgeModuleTemp', knowledgeModuleTemp);
        // aqui pedire la pregunta
        //result = this.chainForward(knowledgeModuleTemp, workingMemory);
    },
    equals: function(atom1, atom2) {
        if(atom2) {
            return (
                atom1.get('description') === atom2.get('description') &&
                atom1.get('state') === atom2.get('state') &&
                atom1.get('objective') === atom2.get('objective')
            );
        }
        return false;
    },
    nextQuestion: function(_state, knowledgeModule, workingMemory, _knowledgeModuleTemp = null, action = {}) {
        let knowledgeModuleTemp;

        if(!_knowledgeModuleTemp) {
            knowledgeModuleTemp = this.get('knowledgeModuleTemp');
        } else {
            knowledgeModuleTemp = _knowledgeModuleTemp;
        }

        if(action && action.answer) {
            let state = (action.answer === 'yes') ? true : false;
            _state.question.set('state', state);
            workingMemory.saveAtom(_state.question);
        }

        let atomQuestion = knowledgeModuleTemp.get('knowledgeBase')[_state.index].get('conditionParts').find(atom => {
            return atom instanceof Atom && !workingMemory.present(atom);
        });


        return atomQuestion;
    },
    chainForward: function(knowledgeModule, workingMemory) {
        console.log('CHAIN FORWARD', knowledgeModule);
        let atomRule;
        let atom;
        let consultResult = false;
        let conditionResult = false;

        knowledgeModule.get('knowledgeBase').map(atomRule => {
            atomRule.get('conditionParts').map(condition => {
                if ( condition instanceof Atom ) {
                    atom = condition;
                    console.log('aqui');
                    if ( !workingMemory.present(atom) ) {
                        atom.set('state', consultResult);

                        //try {
                            workingMemory.saveAtom(atom);
                        //} catch ( DuplicatedAtom duplicatedAtom ) {
                        //    console.log('Se duplico del atomo ', duplicatedAtom);
                        //}
                    }
                }
            });
            conditionResult = atomRule.conditionTest(workingMemory);

            if ( conditionResult ) {
                console.log('se disparo ', atomRule);
                atomRule.trigger(workingMemory);

                conditionResult = false;

                if ( atomRule.isObjective() ) {
                    return atomRule.get('conclutionParts');
                }
            } else {
                if ( backward ) {
                    return null;
                }

                console.log('No se disparo ...');
            }
        });

        return null;
    },

    concat: function(destination, source) {
        source.map(atom => {
            if ( atom instanceof Atom ) {
                destination.push(atom);
            }

            if ( atom instanceof Denial ) {
                atom.set('state', !atom.get('state'));
            }
        });
    },

    isEligible: function(rule, toSatisfy) {
        let conclutionAtoms = [];
        let atomTemp;
        let retorno = false;

        rule.get('conclutionParts').map(atom => {

            if ( atom instanceof Atom ) {
                conclutionAtoms.push(atom);
            }

            if ( atom instanceof Denial ) {
                atom.set('state', !atom.get('state'));
            }
        });

        conclutionAtoms.map(atom => {
            if ( toSatisfy.find(a => a == atom) ) {
                retorno = true;
            }
        });

        return retorno;
    },

    chainBack: function(knowledgeModule, workingMemory) {
        let objetiveRules = knowledgeModule.filterObjectives();

        let toSatisfy = [];
        let knowledgeBasePremium = [];
        let result;
        let knowledgeBasePremiumName;
        let used = new Array(objetiveRules.length);
        let exit = false;
        let position = -1;
        let times = 0;
        let total = objetiveRules.length;
        this.backward = true;
        let knowledgeModuleTemp;

        do {
            position = Math.floor((Math.random() * total));

            if ( !used[position] ) {
                times++;
                used[position] = true;
                toSatisfy = [];
                knowledgeBasePremium = [];
                knowledgeModule.unmark();
                knowledgeModule.removeTriggers();
                objetiveRules[position].get('conclutionParts').map(conclution => {
                    if ( conclution instanceof Atom ) {
                        if ( conclution.get('objective') ) {
                            knowledgeBasePremiumName = conclution.get('description').toUpperCase();
                        }
                    }
                });

                knowledgeModuleTemp = new KnowledgeModule(knowledgeBasePremiumName);
                this.concat(toSatisfy, objetiveRules[position].get('conclutionParts'));
                do {
                    exit = true;
                    knowledgeModule.get('knowledgeBase').map(atomRule => {
                        if ( !atomRule.get('mark') && this.isEligible(atomRule, toSatisfy) ) {
                            exit = false;
                            atomRule.set('mark', true);
                            this.concat(toSatisfy, atomRule.get('conditionParts'));
                            knowledgeBasePremium.unshift(atomRule);
                        }
                    });
                } while ( !exit );
                knowledgeModuleTemp.set('knowledgeBase', knowledgeBasePremium);
                console.log('Intentando con ', knowledgeModuleTemp.get('description'));

                let result = this.chainForward(knowledgeModuleTemp, workingMemory);
                if ( result ) {
                    this.backward = false;
                    return result;
                }
            }
        } while ( times < total );
        this.backward = false;
        return null;
    },
});

export default InferenceMachine;
