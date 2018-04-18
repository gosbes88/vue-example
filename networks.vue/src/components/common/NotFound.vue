<template>
    <div class="page-error">
        <article class="page-error__content">
            <img src="../../assets/img/page-error.svg" class="page-error__icon error-svg-icon">

            <h1 class="page-error__title" v-lang.httpErrors.error404></h1>

            <div class="page-error__text" v-lang.httpErrors.error404description></div>
            <a class="page-error__link" href="http://valadorus.com/landing/faq" v-lang.httpErrors.writeToUs></a>
        </article>
    </div>
</template>

<script>
    export default {
        created() {
            this.$store.commit('setErrorPage', true);
        },
        head: {
            title: function () {
                return {
                    inner: this.translate('httpErrors.error404')
                };
            }
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    .page-error {
        height: ~"calc(100vh - 100px)";

        &__text {
            display: inline;
        }

        &__icon {
            margin: 0 auto 45px auto;
        }
    }

    .error-svg-icon {
        width: 103px;
        height: 103px;
        display: inline-block;
    }
</style>