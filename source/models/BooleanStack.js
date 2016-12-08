import Backbone from 'backbone';

const BooleanStack = Backbone.Model.extend({
    initialize: () => {
        this.data = [];
    },
    clear: () => {
        this.data = [];
    },
    empty: () => {
        return this.data.length;
    },
    top: () => {
        if ( !this.empty() ) {
            return Boolean(this.data[this.data.length - 1]);
        }

        return false;
    },
    pop: () => {
        let tmp;
        if ( !this.empty() ) {
            tmp = Boolean(this.top());
            this.data = this.data.slice(0, this.data.length - 1);
            return tmp;
        }
        return false;
    },
    push: value => {
        this.data.push(value);
    }
});

export default BooleanStack;
