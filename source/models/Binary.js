import Operator from './Operator';
import Backbone from 'backbone';

const Binary = Operator.extend({
    defaults: {
        conjuntion: false,
    },
    initialize: function(conjuntion) {
        this.set('conjuntion', conjuntion);
    },
    constructor: function() {
        Backbone.Model.apply(this, arguments);
    },
    getBinary: function() {
        return (this.conjuntion ? '&' : '|');
    },
});

export default Binary;
