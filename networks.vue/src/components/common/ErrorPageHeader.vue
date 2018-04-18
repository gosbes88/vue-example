<template>
    <header class="header">
        <div class="header__item">
            <div class="header-change">
                <div class="header-change__item">
                    <router-link :to='mainLink' class="logo-link js-remove-storage">
                        <img class="logo-link__img" src="../../assets/img/networks-logo.svg">
                        <span class="logo-link__title" v-lang.networks></span>
                    </router-link>
                </div>
            </div>
        </div>
    </header>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: 'error-page-header',
        computed: {
            mainLink() {
                return this.hasManager
                        ? {name: "Manager"}
                        : this.hasUser
                                ? {name: "Participant"}
                                : "/404";
            },
            ...mapGetters([
                'hasUser',
                'hasManager'
            ])
        }
    }

</script>