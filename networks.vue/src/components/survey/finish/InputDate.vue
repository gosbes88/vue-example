<template>
    <div class="date-block">
        <label class="date-block__title" v-text="label"></label>
        <date-picker :placeholder="translate('survey.noDate')"
                     class="date-block__inp"
                     :class="className"
                     v-model="date"
                     :config="config"
        ></date-picker>
    </div>
</template>

<script>
    import { Russian, English } from '../../../mixins/DatePickerConfig';
    import 'flatpickr/dist/flatpickr.css';
    import 'flatpickr/dist/themes/material_green.css';
    import DatePicker from 'vue-flatpickr-component';

    export default {
        props: {
            label: {
                type: String,
                default: ""
            },
            className: {
                type: String,
                default: ""
            },
            locale: {
                type: String,
                default: "ru-RU"
            },
            minDate: {
                type: String,
                default: 'today'

            },
            maxDate: {
                type: String,
                default: ''

            },
            value: {
                type: String,
                default: "",
                validator: (val) => {
                    return /^(?:[1-9]\d{3}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1\d|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[1-9]\d(?:0[48]|[2468][048]|[13579][26])|(?:[2468][048]|[13579][26])00)-02-29)$/.test(val) || val === "";
                }
            }
        },
        data() {
            return {
                date: this.value,
                config: {
                    wrap: false,
                    altFormat: 'j F Y',
                    dateFormat: 'Y-m-d',
                    altInput: true,
                    noCalendar: false,
                    allowInput: true,
                    minDate: this.minDate,
                    maxDate: this.maxDate,
                    locale: this.locale === 'ru-RU' ? Russian : English
                }
            };
        },
        components: {
            DatePicker
        },
        watch: {
            date(val) {
                this.$emit('updateDate', val);
            }
        }
    };
</script>

<style>

</style>