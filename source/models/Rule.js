import Backbone from 'backbone';
import BooleanStack from './BooleanStack';
import Atom from './Atom';
import Denial from './Denial';
import Binary from './Binary';

const Rule = Backbone.Model.extend({
    initialize: rule => {
        this.mark = false;
        this.trigger = false;
        this.objective = false;
        this.conditionParts = [];
        this.conclutionParts = [];
        this.analize(rule);
    },
    analize: rule => {
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
                    atom      =true;
                    objective =true;
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
                    conclusion = true;
                    break;
                case "</conclusion>":
                    conclusion = false;
                    break;
                case "<negacion/>":
                    partRule = new Denial();
                    if ( condition&&!conclusion ) {
                        this.conditionParts.push(partRule);
                    }
                    if ( conclusion&&!condition ) {
                        this.conclutionParts.push(partRule);
                    }
                    break;
                case "<conjuncion/>":
                    partRule = new Binary(true);
                    if ( condition&&!conclusion ) {
                        this.conditionParts.push(partRule);
                    }
                    if ( conclusion&&!condition ) {
                        this.conclutionParts.push(partRule);
                    }
                    break;
                case "<disyuncion/>":
                    partRule = new Binary(false);
                    if ( condition&&!conclusion ) {
                        this.conditionParts.push(partRule);
                    }
                    break;
                default:
                    if ( atom ){
                        parte = new Atom({ part, state: true, objective });
                        if ( condition&&!conclusi&&!objective ) {
                            this.conditionParts.push(partRule);
                        }
                        if ( conclution&&!condition ) {
                            this.conclutionParts.push(partRule);
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
    condiionTest: memoryWork => {
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
    trigger: memoryWork => {
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
            try {
                memoryWork.saveAtom(atom);
            } catch ( DuplicatedAtom da ) {
                return da.getAtom();
            }
        });

        return comeObjective;
    },
    isObjective: () => {
        return this.objective;
    },
});

export default Rule;
