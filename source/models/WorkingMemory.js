import Backbone from 'backbone';
import Atom from './Atom';

const WorkingMemory = Backbone.Model.extend({
    defaults: {
        affirmed: [],
        denied: [],
    },
    initialize: function() {

    },
    constructor: function() {
        Backbone.Model.apply(this, arguments);
    },
    checkAtom: function(atom) {
        if ( !(atom instanceof Atom) ) {
            return new Atom(atom);
        }

        return atom;
    },
    contains: function(array, atom) {
        let _index = false;
        array.map((value, index) => {
            if ( this.equals(value, atom) ) {
                _index = index + 1;
            }
        });

        return _index;
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
    saveAtom: function(atom) {
        if ( atom.get('state') ) {
            let affirmed = this.get('affirmed');
            affirmed.push(atom);
            this.set('affirmed', affirmed);
        } else {
            let denied = this.get('denied');
            denied.push(atom);
            this.set('denied', denied);
        }
    },
    present: function(atom) {
        let atomTemp = new Atom({
            description: atom.get('description'),
            state: !atom.get('state'),
            objective: atom.get('objective'),
        });

        return (
            this.contains(this.get('affirmed'), atom) ||
            this.contains(this.get('denied'), atom) ||
            this.contains(this.get('affirmed'), atomTemp) ||
            this.contains(this.get('denied'), atomTemp)
        );
    },
    wasAffirmed: atom => {
        return this.contains(this.get('affirmed'), atom);
    },
    wasDenied: atom => {
        return this.contains(this.get('denied'), atom);
    },
    recover: atom => {
        let affirmed = this.contains(this.get('affirmed'), atom);
        let denied   = this.contains(this.get('denied'), atom);

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
            name: 'Memoria de trabajo',
            affirmed: this.affirmed,
            denied: this.denied,
        };
    },
});

export default WorkingMemory;
