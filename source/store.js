import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';
import thunk from 'redux-thunk';

export default applyMiddleware(thunk)(createStore)(reducers);
