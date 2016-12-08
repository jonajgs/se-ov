import Backbone from 'backbone';
import BooleanStack from './BooleanStack';
import Atom from './Atom';
import Denial from './Denial';
import Binary from './Binary';

const Rule = Backbone.Model.extend({
    defaults: {
        mark: false,
        trigger: false,
        objective: false,
        conditionParts: [],
        conclutionParts: [],
    },
    initialize: function(rule) {
        this.analize(rule);
    },
    constructor: function(rule) {
        Backbone.Model.apply(this, arguments);
    },
    analize: function(rule) {
        let parts = rule.split(' ');
        let r = false;
        let condition = false;
        let conclution = false;
        let atom = false;
        let objective = false;
        let partRule;

        parts.map(part => {
            switch ( part ) {
                case "<atomo>":
                    atom      = true;
                    objective = false;
                    break;
                case "</atomo>":
                    atom      = false;
                    objective = false;
                    break;
                case "<atomoObj>":
                    atom      = true;
                    objective = true;
                    this.set('objective', true);
                    break;
                case "</atomoObj>":
                    atom      = false;
                    objective = false;
                    break;
                case "<condicion>":
                    condition = true;
                    break;
                case "</condicion>":
                    condition = false;
                    break;
                case "<conclusion>":
                    conclution = true;
                    break;
                case "</conclusion>":
                    conclution = false;
                    break;
                case "<negacion/>":
                    partRule = new Denial();

                    if ( condition&&!conclution ) {
                        this.set(
                            'conditionParts',
                            this.get('conditionParts').concat([new Denial()])
                        );
                    }
                    if ( conclution&&!condition ) {
                        this.set(
                            'conclutionParts',
                            this.get('conclutionParts').concat([new Denial()])
                        );
                    }
                    break;
                case "<conjuncion/>":
                    partRule = new Binary(true);

                    if ( condition&&!conclution ) {
                        this.set(
                            'conditionParts',
                            this.get('conditionParts').concat([new Binary(true)])
                        );
                    }
                    if ( conclution&&!condition ) {
                        this.set(
                            'conclutionParts',
                            this.get('conclutionParts').concat([new Binary(true)])
                        );
                    }
                    break;
                case "<disyuncion/>":
                    partRule = new Binary(false);

                    if ( condition&&!conclution ) {
                        this.set(
                            'conditionParts',
                            this.get('conditionParts').concat([new Binary(false)])
                        );
                    }
                    break;
                default:
                    if ( atom ){
                        partRule = new Atom({ description: part, state: true, objective });

                        if ( condition&&!conclution&&!objective ) {
                            this.set(
                                'conditionParts',
                                this.get('conditionParts').concat([partRule])
                            );
                        }
                        if ( conclution&&!condition ) {
                            this.set(
                                'conclutionParts',
                                this.get('conclutionParts').concat([partRule])
                            );
                        }
                    }
                    break;
            }
        });

    },
    getRule: () => {
        return {
            conditions: this.conditionParts,
            conclutions: this.conclutionParts,
        };
    },
    conditionTest: memoryWork => {
        let bs = new BooleanStack();
        let truth1 = false;
        let truth2 = false;
        let atomTemp;
        let denialTemp;
        let binaryTemp;
        let atomMemoryWork;

        this.conditionParts.map(cp => {
            if ( cp instanceof Atom ) {
                atomTemp = new Atom(cp);
                atomMemoryWork = memoryWork.recover(atomTemp);
                truth1 = atomTemp.truth(atomMemoryWork);
                bs.push(truth1);
            } else if ( cp instanceof Denial ) {
                denialTemp = new Denial(cp);
                truth1 = bs.pop();
                truth1 = !truth1;
                bs.push(truth1);
            } else if ( cp instanceof Binary ) {
                binaryTemp = new Binary(cp);
                truth1 = bs.pop();
                truth2 = bs.pop();
                if ( binaryTemp.get('conjuntion') ) {
                    bs.push(truth1&&truth2);
                } else {
                    bs.push(truth1||truth2);
                }
            }

            return bs.pop();
        });
    },
    triggered: memoryWork => {
        let atomTemp;
        let comeObjective = false;
        let atoms = [];
        this.trigger = true;

        this.conditionParts.map(cp => {
            if ( cp instanceof Atom) {
                atomTemp = new Atom(cp);
                atoms.push(atomTemp);
                if ( atomTemp.get('objective') ) {
                    comeObjective = true;
                }
            } else if ( cp instanceof Denial ) {
                atomTemp.set({ state: !atomTemp.get('state') });
            }
        });

        atoms.map(atom => {
            //try {
                memoryWork.saveAtom(atom);
            //} catch ( DuplicatedAtom da ) {
            //    return da.getAtom();
            //}
        });

        return comeObjective;
    },
    isObjective: function() {
        return this.get('objective');
    },
});

export default Rule;
