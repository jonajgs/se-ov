import Backbone from 'backbone';

const WorkingMemory = Backbone.Model.extend({
    initialize: () => {
        this.affirmed = [];
        this.denied   = [];
    },
    checkAtom: atom => {
        if ( !(atom instanceof Atom) ) {
            return new Atom(atom);
        }

        return atom;
    },
    contains: (array, atom) => {
        array.map((value, index) => {
            if ( value.equals(atom) ) {
                return index + 1;
            }
        });

        return false;
    },
    saveAtom: atom => {
        atom = this.checkAtom(atom);

        if ( !this.contains(this.affirmed, atom) && !this.contains(this.denied, atom) ) {
            if ( atom.get('state') ) {
                this.affirmed.push(atom);
            } else {
                this.denied.push(atom);
            }
        } else {
            throw new DuplicatedAtom(atom).getAtom();
        }
    },
    present: atom => {
        let atomTemp = new Atom(atom);

        atomTemp.set({ state: !atom.get('state') });

        return (
            this.contains(this.affirmed, atom) ||
            this.contains(this.denied, atom) ||
            this.contains(this.affirmed, atomTemp) ||
            this.contains(this.denied, atomTemp) ||
        );
    },
    wasAffirmed: atom => {
        return this.contains(this.affirmed, atom);
    },
    wasDenied: atom => {
        return this.contains(this.denied, atom);
    },
    recover: atom => {
        let affirmed = this.contains(this.affirmed, atom);
        let denied   = this.contains(this.denied, atom);

        if ( affirmed ) {
            return this.affirmed[affirmed - 1];
        }

        if ( denied ) {
            return this.denied[denied - 1];
        }

        return null;
    },
    getWorkingMemory: () => {
        return {
            name: 'Memoria de trabajo';
            affirmed: this.affirmed,
            denied: this.denied,
        };
    },
});

export default WorkingMemory;
