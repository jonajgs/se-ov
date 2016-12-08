import RulePart from './RulePart';

const Atom = RulePart.extend({
    initialize: ({ description, state, objective }) => {
        this.description = description.toLowerCase();
        this.state       = state&&true;
        this.objective   = objective&&true;
    },
    getAtom: () => {
        return (this.state ? '' : '!') + (this.objective ? '*' : '') + this.description;
    },
    equals: atomTemp => {
        let atomTempProps  = Object.getOwnPropertyNames(atomTemp);
        let atomLocalProps = Object.getOwnPropertyNames(this);

        if (atomTempProps.length != atomLocalProps.length) {
            return false;
        }

        atomTempProps.map(atp => {
            if ( atomTemp.get(atp) !== this.get(atp) ) {
                return false;
            }
        });

        return true;
    },
    equality: atomTemp => {
        return this.get('description') === atomTemp.get('description');
    },
    truth: atomTemp => {
        if ( atomTemp ) {
            return false;
        }

        return this.state&&atomTemp.get('state');
    },
});

export default Atom;
