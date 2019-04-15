import {combineReducers} from 'redux';
import Configuration from './redux_configuration';

const allReducers = combineReducers({
    config:Configuration
});

export default allReducers;