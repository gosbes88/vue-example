import getters from './Getters';
import state from './State';
import actions from './Actions';
import mutations from './Mutations';

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};