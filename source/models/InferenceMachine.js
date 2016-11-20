import Backbone from 'backbone';

const InferenceMachine = Backone.Model.extend({
    backward: false,

    // encadenarAdelante
    chainForward: (knowledgeModule, workingMemory) => {
        let atomRule;
        let atom;
        let consultResult = false;
        let conditionResult = false;

        knowledgeModule.knowledgeBase.map(element => {
            atomRule = new Rule(element);
            element.conditionParts.map(condition => {
                if ( condition instanceof Atom ) {
                    atom = new Atom(atom);
                    if ( !workingMemory.present(atom) ) {
                        consultResult = consultPerAtom(atom, atomRule);
                        atom.set('state', consultResult);

                        try {
                            workingMemory.saveAtom(new Atom(atom));
                        } catch ( DuplicatedAtom duplicatedAtom ) {
                            console.log('Se duplico del atomo ', duplicatedAtom);
                        }
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

    concat: (destination, source) => {
        source.map(atom => {
            let atomTemp = new Atom(atom);
            if ( atom instanceof Atom ) {
                destination.push(atomTemp);
            }

            if ( atom instanceof Denial ) {
                atomTemp.set('state', !atomTemp.get('state'));
            }
        });
    },

    isEligible: (rule, toSatisfy) => {
        let conclutionAtoms = [];
        let atomTemp;

        rule.get('conclutionParts').map(atom => {
            atomTemp = new Atom(atom);
            if ( atom instanceof Atom ) {
                conclutionAtoms.push(atomTemp);
            }

            if ( atomTemp instanceof Denial ) {
                atomTemp.set('state', !atomTemp.get('state'));
            }
        });

        conclutionAtoms.map(atom => {
            if ( toSatisfy.contains(atom) ) {
                return true;
            }
        });

        return false;
    },

    chainBack: (knowledgeModule, workingMemory) => {
        let objetiveRules = knowledgeModule.filterObjetives();
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
            position = Math.floor((Math.random() * total) + 1);

            if ( !used[position] ) {
                times++;
                used[position] = true;
                toSatisfy = [];
                knowledgeBasePremium = [];
                knowledgeModule.unmark();
                knowledgeModule.removeTriggers();
                objetiveRules[position].conclutionParts.map(conclution => {
                    if ( conclution instanceof Atom ) {
                        let atom = new Atom(conclution);
                        if ( atom.get('objective') ) {
                            knowledgeBasePremiumName = atom.get('description').toUpperCase();
                        }
                    }
                });
                knowledgeModuleTemp = new KnowledgeModule(knowledgeBasePremiumName);
                this.concat(toSatisfy, objetiveRules[position].conclutionParts);
                do {
                    exit = true;
                    knowledgeModule.knowledgeBase.map(atomRule => {
                        if ( !atomRule.get('mark') && isEligible(atomRule, toSatisfy) ) {
                            exit = false;
                            console.log('elegida ', atomRule);
                            atomRule.set('mark', true);
                            this.concat(toSatisfy, atomRule.conditionParts);
                            knowledgeBasePremium.unshift(atomRule);
                        }
                    });
                } while ( !exit );
                knowledgeModuleTemp.set('knowledgeBase', knowledgeBasePremium);
                console.log('Intentando con ', knowledgeModuleTemp);

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
