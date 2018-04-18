<template>
    <div ref="carousel" @wheel="moveByWheel">
        <button v-show="Math.abs(position) < Math.abs(maxPosition)"
                class='carousel-block__btn-next'
                type='button'
                @mousedown="goNext"
        >
            <i class='carousel-block__next-icon' :style="{background: `url(${nextImg}) no-repeat`}"></i>
        </button>
        <button v-show="position < 0"
                class='carousel-block__btn-prev'
                type='button'
                @mousedown="goPrev"
        >
            <i class='carousel-block__prev-icon' :style='{background: `url(${prevImg}) no-repeat`}'></i>
        </button>
        <div ref="list" class="carousel-block__list">
            <div ref="item" class="carousel-block__item" v-for="(item, index) in surveys" :key="index">
                <survey-statistic-item
                        :item="item"
                        :chart-position="{}"
                        :progress-position="{}"
                ></survey-statistic-item>
            </div>
        </div>
    </div>
</template>

<script>
    import SurveyStatisticItem from './SurveyStatisticItem.vue';
    import nextImg from '../../assets/img/carousel-arrow-next.svg';
    import prevImg from '../../assets/img/carousel-arrow-prev.svg';

    export default {
        props: {
            surveys: {
                type: Array,
                default: () => []
            },
            count: {
                type: Number,
                default: 5
            },
            movedItems: {
                type: Number,
                default: 1
            }
        },
        data() {
            return {
                nextImg,
                prevImg,
                isTouch: typeof window !== "undefined" && "ontouchstart" in window,
                width: 0,
                position: 0,
                itemWidth: 0,
                maxPosition: 0,
                dragStartX: 0,
                timer: null,
                dragging: false,
                keyCodes: {
                    RIGHT: 37,
                    LEFT: 39
                }
            };
        },
        components: {
            SurveyStatisticItem
        },
        mounted() {
            this.width = this.$refs.carousel.offsetWidth / this.count;
            this.maxPosition = this.$refs.item.length * this.width - this.count * this.width;
            this.$refs.item.forEach(item => item.style.width = this.width + "px");
            document.addEventListener("keydown", this.moveByKey);
            document.addEventListener("mouseup", this.clearTimer);
            this.$el.addEventListener(this.isTouch ? "touchstart" : "mousedown", this.onStart);
        },
        methods: {
            onStart(event) {
                document.addEventListener(
                    this.isTouch ? "touchend" : "mouseup",
                    this.onEnd
                );

                document.addEventListener(
                    this.isTouch ? "touchmove" : "mousemove",
                    this.onDrag
                );

                this.dragging = true;
                this.dragStartX = this.isTouch ? event.touches[0].clientX : event.clientX;
            },
            onEnd(event) {
                event.stopPropagation();
                this.dragging = false;
                const items = Math.round(this.position / this.width);
                this.position = this.width * items;
                this.$refs.list.style.marginLeft = this.position + 'px';
                document.removeEventListener(
                    this.isTouch ? "touchend" : "mouseup",
                    this.onEnd,
                    true
                );
                document.removeEventListener(
                    this.isTouch ? "touchmove" : "mousemove",
                    this.onDrag,
                    true
                );
            },
            onDrag(event) {
                if (!this.dragging) {
                    return;
                }
                const eventPosX = this.isTouch ? event.touches[0].clientX : event.clientX;
                const newOffsetX = this.dragStartX - eventPosX;

                if (newOffsetX > 0) {
                    this.position = Math.max(this.position - newOffsetX, -this.width * (this.$refs.item.length - this.count));
                } else if (newOffsetX < 0) {
                    this.position = Math.min(this.position - newOffsetX, 0);
                }

                this.$refs.list.style.marginLeft = this.position + 'px';
                this.dragStartX = eventPosX;
            },
            goPrev(event) {
                this.position = Math.min(this.position + this.width * this.movedItems, 0);
                this.$refs.list.style.marginLeft = this.position + 'px';
                this.timer = setTimeout(() => this.goPrev(event), 200);
            },
            goNext(event) {
                this.position = Math.max(this.position - this.width * this.movedItems, -this.width * (this.$refs.item.length - this.count));
                this.$refs.list.style.marginLeft = this.position + 'px';
                this.timer = setTimeout(() => this.goNext(event), 200);
            },
            clearTimer() {
                if (this.timer) {
                    clearTimeout(this.timer);
                }
            },
            moveByWheel(event) {
                if (event.deltaX > 0 || event.deltaY < 0 || event.wheelDelta > 0) {
                    this.position = Math.min(this.position + this.width * this.movedItems, 0);
                } else if (event.deltaX < 0 || event.deltaY > 0 || event.wheelDelta < 0) {
                    this.position = Math.max(this.position - this.width * this.movedItems, -this.width * (this.$refs.item.length - this.count));
                }
                this.$refs.list.style.marginLeft = this.position + 'px';
            },
            moveByKey(event) {
                if (event.keyCode === this.keyCodes.LEFT) {
                    this.position = Math.max(this.position - this.width, -this.width * (this.$refs.item.length - this.count));
                } else if (event.keyCode === this.keyCodes.RIGHT) {
                    this.position = Math.min(this.position + this.width, 0);
                }
                this.$refs.list.style.marginLeft = this.position + 'px';
            }
        },
        beforeDestroy() {
            this.$el.removeEventListener(this.isTouch ? "touchstart" : "mousedown", this.onStart);
            document.removeEventListener("keydown", this.moveByKey);
            document.removeEventListener("mouseup", this.clearTimer);
        }
    };
</script>