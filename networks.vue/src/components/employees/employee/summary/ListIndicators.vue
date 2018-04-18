<template>
    <div class="key-indicators__list-wrap" @wheel="scrollWheel">
        <div class="key-indicators__list" ref="wrapperIndicator">
            <div class="key-indicators__content" ref="wrapper">
                <slot></slot>
            </div>
        </div>

        <div class="employee-main__footer">
            <div class="employee-main__footer-col-1">
                <div class="scrollbar-block" ref="scrollLine" v-if="show"  @click="scrollBlock" @mousemove="moveScrollBar">
                    <div class="scrollbar-block__runner" ref="scrollBar" :style="{'left': 0}" @mousedown="initializeScroll"></div>
                </div>
            </div>

            <div class="employee-main__footer-col-2">
                <div class="key-indicators__all-indicators">
                    <router-link :to="{name: 'Indicators'}" v-lang.employees.allIndicators></router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { bus } from '../../../../main';

    export default {
        data() {
            return {
                isScrollMoved: false,
                beginCoord: 0,
                scale: 1,
                timer: null
            };
        },
        props: {
            show: {
                type: Boolean,
                default: true
            },
            id: {
                type: String,
                required: true
            }
        },
        methods: {
            initializeScroll(event) {
                this.isScrollMoved = true;
                this.beginCoord = event.clientX;
            },
            destroyScroll() {
                this.isScrollMoved = false;
                this.beginCoord = 0;
            },
            scrollWheel(event) {
                if(!this.show) {
                    return;
                }
                event.preventDefault();
                const delta = 15;
                if (event.deltaY < 0) {
                    let padding = (parseFloat(this.$refs.scrollBar.style.left) - delta);
                    this.$refs.scrollBar.style.left = (padding < 0 ? 0 : padding) + 'px';
                } else {
                    let padding = (parseFloat(this.$refs.scrollBar.style.left) + delta);
                    const maxPadding = this.$refs.scrollLine.clientWidth - this.$refs.scrollBar.clientWidth;
                    this.$refs.scrollBar.style.left = (padding > maxPadding ? maxPadding : padding) + 'px';
                }
                this.$refs.wrapperIndicator.scrollLeft = parseFloat(this.$refs.scrollBar.style.left) * this.scale;
            },
            scrollBlock(event) {
                const coord = event.currentTarget.getBoundingClientRect();
                let cursorPosition = event.clientX - coord.left - this.$refs.scrollBar.clientWidth / 2;

                if (cursorPosition < this.$refs.scrollBar.clientWidth / 2) {
                    this.$refs.scrollBar.style.left = 0;
                    this.$refs.wrapperIndicator.scrollLeft = 0;
                } else if (coord.width - cursorPosition < this.$refs.scrollBar.clientWidth / 2) {
                    this.$refs.scrollBar.style.left = (coord.width - this.$refs.scrollBar.clientWidth) + 'px';
                    this.$refs.wrapperIndicator.scrollLeft = this.$refs.wrapper.offsetWidth - this.$refs.wrapperIndicator.offsetWidth;
                } else {
                    cursorPosition = cursorPosition + this.$refs.scrollBar.clientWidth >= coord.width
                            ? coord.width - this.$refs.scrollBar.clientWidth
                            : cursorPosition;
                    this.$refs.scrollBar.style.left = cursorPosition + 'px';
                    this.$refs.wrapperIndicator.scrollLeft = this.scale * cursorPosition;
                }
            },
            moveScrollBar(event) {
                if (!this.isScrollMoved || event.clientX === this.beginCoord) {
                    return;
                }
                const coord = this.$refs.scrollLine.getBoundingClientRect();

                if (event.clientX < coord.left) {
                    this.$refs.scrollBar.style.left = 0;
                    this.$refs.wrapperIndicator.scrollLeft = 0;
                } else if (event.clientX > coord.right) {
                    this.$refs.scrollBar.style.left = (coord.width - this.$refs.scrollBar.clientWidth) + 'px';
                    this.$refs.wrapperIndicator.scrollLeft = this.$refs.wrapper.offsetWidth - this.$refs.wrapperIndicator.offsetWidth;
                } else {
                    let pos = parseFloat(this.$refs.scrollBar.style.left) + event.clientX - this.beginCoord;
                    if (pos > coord.width - this.$refs.scrollBar.clientWidth) {
                        pos = coord.width - this.$refs.scrollBar.clientWidth;
                    } else if (pos <= 0) {
                        pos = 0;
                    }
                    this.$refs.scrollBar.style.left = pos + 'px';
                    this.$refs.wrapperIndicator.scrollLeft = this.$refs.wrapperIndicator.scrollLeft + this.scale * (event.clientX - this.beginCoord);
                }
                this.beginCoord = event.clientX;
            },
            calcScale(id = this.id) {
                const wrappers = [this.$refs.wrapper, this.$refs.wrapperIndicator, this.$refs.scrollLine, this.$refs.scrollBar];
                if (id !== this.id || !this.show || !wrappers.every(Boolean)) {
                    return;
                }
                this.scale = (this.$refs.wrapper.clientWidth - this.$refs.wrapperIndicator.clientWidth) / (this.$refs.scrollLine.clientWidth - this.$refs.scrollBar.clientWidth);
            },
            setPositionScrollBlock() {
                if (!this.$refs.scrollBar) {
                    return;
                }
                clearTimeout(this.timer);
                this.timer = setTimeout(() => {
                    if (parseFloat(this.$refs.scrollBar.style.left) >= this.$refs.scrollLine.clientWidth - this.$refs.scrollBar.clientWidth) {
                        this.$refs.wrapperIndicator.scrollLeft = this.$refs.wrapper.offsetWidth - this.$refs.wrapperIndicator.offsetWidth;
                    } else {
                        this.calcScale();
                        this.$refs.wrapperIndicator.scrollLeft = parseFloat(this.$refs.scrollBar.style.left) * this.scale;
                    }
                }, 200);
            }
        },
        created() {
            document.addEventListener('mouseup', this.destroyScroll.bind(this));
            document.addEventListener('mousemove', this.moveScrollBar.bind(this));
            bus.$on('load', this.calcScale.bind(this));
            bus.$on('windowResize', this.setPositionScrollBlock);
        },
        beforeDestroy() {
            bus.$off('windowResize', this.setPositionScrollBlock);
        }
    };
</script>