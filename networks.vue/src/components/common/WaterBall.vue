<template>
    <canvas :style="{width: `${width}px`, height: `${height}px`}" ref="canvas"></canvas>
</template>

<script>
    /**
     * Перерисовка будет при назначении событияupdate для данного модуля
     * или при непосредственном обращении родителя к методу update модуля
     */
    export default {
        name: 'WaterLine',
        props: {
            width: {
                type: Number,
                default: 150
            },
            height: {
                type: Number,
                default: 150
            },
            value: {
                type: Number,
                default: 100
            },
            maxValue: {
                type: Number,
                default: 100
            },
            options: {
                type: Object,
                default: () => {
                    return {
                        lineWidth: 1,
                        colorLine: 'rgba(0, 0, 0, .1)',
                        colorFill: 'rgba(0, 0, 0, .3)'
                    };
                }
            }
        },
        data() {
            return {
                ctx: null,
                minValue: this.height / 8,
                lineWidth: this.height / 20
            };
        },
        created() {
            this.$on("update", this.update.bind(this));
        },
        mounted() {
            this.ctx = this.$refs.canvas.getContext('2d');
            this.draw();
        },
        methods: {
            update() {
                this.clear();
                this.draw();
            },
            clear() {
                this.ctx.clearRect(0, 0, this.width, this.height);
            },
            draw() {
                this.ctx.canvas.width = this.width;
                this.ctx.canvas.height = this.height;

                if (this.value === this.maxValue) {
                    this.drawCircle(this.options.colorFill);
                    this.drawCircle(this.options.colorFill);
                    this.drawCircle(this.options.colorFill);
                    return;
                }

                let coord = this.calcCoordinates();

                if (this.value / this.maxValue >= 0.9) {
                    let DRAW_FILLED_CIRCLE = () => {
                        this.drawCircle(this.options.colorFill);
                        this.drawWaterLine(coord.small, {isTranslate: false, big: false});
                        this.drawWaterLine(coord.small, {isTranslate: true, big: false});
                    };
                    this.drawFigure(DRAW_FILLED_CIRCLE);
                } else {
                    let DRAW_DEFAULT_CIRCLE = () => {
                        this.drawWaterLine(coord.small, {isTranslate: false, big: false});
                        this.drawWaterLine(coord.big, {isTranslate: false, big: true});
                        this.drawWaterLine(coord.small, {isTranslate: true, big: false});
                    };
                    this.drawFigure(DRAW_DEFAULT_CIRCLE);
                }
            },
            drawFigure(supplier) {
                this.ctx.save();
                this.drawCircle();
                this.ctx.clip();
                supplier();
                this.ctx.restore();
            },
            calcCoordinates() {
                const valueHeight = this.value * this.height / this.maxValue;
                let fillingLevel = valueHeight === 0 ? 0 : Math.ceil(this.height - valueHeight);
                fillingLevel = valueHeight > this.minValue ? fillingLevel : parseInt(this.height - this.minValue);

                let hypotenuse = this.height / 2;
                let catheter1 = fillingLevel - this.height / 2;
                let catheter2 = Math.ceil(Math.sqrt(Math.pow(hypotenuse, 2) - Math.pow(catheter1, 2)));

                // x = X + cos(a) * R, y = Y + sin(a) * R - рассчёт координат точки соприкосновения с дугой
                let x0 = this.width / 2 - catheter2 / hypotenuse * hypotenuse;
                let y0 = this.height / 2 + catheter1 / hypotenuse * hypotenuse;


                //расчёт большей точки
                let hypotenuseBig = this.height / 2;
                let catheterBig1 = y0 - this.lineWidth > this.height / 2 ? y0 - this.height / 2 - this.lineWidth : this.height / 2 - (y0 - this.lineWidth);
                let catheterBig2 = Math.ceil(Math.sqrt(Math.pow(hypotenuseBig, 2) - Math.pow(catheterBig1, 2)));
                //стартовые точки для большой дуги
                let X0 = this.width / 2 - catheterBig2 / hypotenuseBig * hypotenuseBig;
                let Y0 = y0 - this.lineWidth;

                const deltaXBig = Math.abs(this.height / 2 - X0);
                const deltaX = this.height / 2 - x0;

                let koefPoint = !this.value || this.value * 100 / this.maxValue <= 33 ? 1.3 : 1.6;
                let koefPointEnd = !this.value || this.value * 100 / this.maxValue <= 66 ? 1.1 : 1.4;

                return {
                    small: {
                        x0,
                        y0: fillingLevel || y0,
                        x1: 1.6 * deltaX,
                        y1: koefPoint * fillingLevel,
                        x2: this.width - x0,
                        y2: koefPointEnd * fillingLevel
                    },
                    big : {
                        x0: X0,
                        y0: Y0,
                        x1: 1.6 * deltaXBig,
                        y1: koefPoint * Y0,
                        x2: this.width - X0,
                        y2: koefPointEnd * Y0
                    }
                };
            },
            drawCircle(fillStyle = "white", colorStyle = this.options.colorLine) {
                this.ctx.beginPath();
                this.ctx.arc(this.width / 2, this.height / 2, this.width / 2, 0, Math.PI * 2, true);
                this.ctx.fillStyle = fillStyle;
                this.ctx.fill();
                this.ctx.strokeStyle = colorStyle;
                this.ctx.stroke();
                this.ctx.closePath();
            },
            drawWaterLine({x0, y0, x1, y1, x2, y2}, {isTranslate = false, big = false}) {
                this.ctx.beginPath();
                if (isTranslate) {
                    this.ctx.translate(this.width, 0);
                    this.ctx.scale(-1, 1);
                }
                this.ctx.moveTo(x0, y0);
                this.ctx.fillStyle = this.options.colorFill;
                big
                    ? this.ctx.quadraticCurveTo(x1, y1 - this.lineWidth, x2, y2 - this.lineWidth)
                    : this.ctx.quadraticCurveTo(x1, y1, x2, y2);
                /**
                 * 10 - взят большой коэффициент для того, чтобы дуга была широкой и её закрашенная часть
                 * залила весь круг
                 */
                this.ctx.bezierCurveTo(10 * this.width, 2 * this.height, x0 - 10 * this.width, 2 * this.height, x0, y0);
                this.ctx.fill();
                if (isTranslate) {
                    this.ctx.translate(-this.width, 0);
                }
                this.ctx.closePath();
            }
        }
    };
</script>