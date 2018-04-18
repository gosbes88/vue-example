<template>
    <span>
        <router-link :to="link" v-if="isSelected">
            <slot></slot>
        </router-link>
        <slot v-else></slot>
    </span>
</template>

<script>
    export default {
        props: {
            isSelected: {
                type: Boolean,
                default: false
            },
            surveySelected: {
                type: String,
                default: ""
            }
        },
        computed: {
            link() {
                return this.surveySelected === "OWN"
                    ? {name: 'SurveyOwnSettings'}
                    : {name: 'SurveySettings', params: {id: this.surveySelected === "OWN" ? '' : this.surveySelected}};
            }
        }
    };
</script>