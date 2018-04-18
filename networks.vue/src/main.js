import Vue from 'vue';
import App from './App.vue';
import router from './router/index';
import VueHead from 'vue-head';
import MultiLanguage from 'vue-multilanguage';
import language from './lang/language';
import VueResource from "vue-resource";
import store from './store';
import { sync } from 'vuex-router-sync';
import VueAutosize from 'vue-autosize';
import { LOGIN_URL, BASE_URL, HTTP_STATUS } from './utils/Constants';

sync(store, router);

export const bus = new Vue();

let xhr = null;
Object.defineProperties(Vue.prototype, {
    $bus: {
        get() {
            return bus;
        }
    },
    $xhr: {
        get() {
            return xhr;
        },
        set(value) {
            xhr = value;
        }
    }
});

Vue.use(VueHead, {
    separator: ''
});
Vue.use(MultiLanguage, language);
Vue.use(VueResource);
Vue.use(VueAutosize);
Vue.config.productionTip = false;

Vue.directive('focus', {
   inserted(el) {
       el.focus();
   }
});

router.beforeEach((to, from, next) => {
    Vue.http.get('/as/service/rest/user/validate-token')
            .then(response => response.body)
            .then(auth => {
                if (auth) {
                    if (vue.$xhr) {
                        vue.$xhr.forEach( e => e.abort());
                        vue.$xhr = [];
                    }
                    next();
                } else {
                    window.location = window.location.origin + LOGIN_URL;
                }
            })
            .catch(error => console.log(error));
});

router.afterEach((to, from) => {
    store.commit('setFooterView', false);
    store.commit('setErrorPage', false);
    store.commit('changeFilledFooter', false);
    if (!['SurveySettings', 'SurveyOwnSettings'].includes(to.name)) {
        window.sessionStorage.removeItem('survey');
    }
});

Vue.http.interceptors.push((request, next) => {
    next(response => {
        if (response.status === 401) {
            window.location = window.location.origin + LOGIN_URL;
        } else if (HTTP_STATUS[response.status]) {
            window.location = window.location.origin + BASE_URL + HTTP_STATUS[response.status];
        }
    });
});

export let vue = new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
});