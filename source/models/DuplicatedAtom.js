import Backbone from 'backbone';

const DuplicatedAtom = Backbone.Model.extend({
    initialize: description => {
        return `Atomo duplicado ${description}`;
    }
});

export default DuplicatedAtom;
