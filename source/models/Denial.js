import Operator from './Operator';

const Denial = Operator.extend({
    initialize: () => {},
    getDenial: () => '!',
});

export default Denial;

public class Negacion:Operador{
    public Negacion(){
    }
    public override string ToString(){
        return "!";
    }
}
