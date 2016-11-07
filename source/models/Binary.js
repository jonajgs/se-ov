import Operator from './Operator';

const Binary = Operator.extend({
    initialize: conjuntion => {
        this.conjuntion = conjuntion;
    },
    getBinary: () => {
        return (this.conjuntion ? '&' : '|');
    },
});

export default Binary;
