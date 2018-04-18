import * as d3 from 'd3';
import { MAX_SCORE_COMPETENCE, MAX_SCORE_INDICATOR } from './Constants';

export class RatingsChart {
    /**
     *
     * @param ratings - [{title, value}, ...]
     * @param svgSelector - id svg
     * @param tooltipSelector - id tooltip div
     * @param options - additional settings
     */
    constructor(ratings, svgSelector, tooltipSelector, {width, height, marginLeft, marginRight, marginTop, marginBottom, competence, xTitle, yTitle}) {
        this.width = width - marginLeft - marginRight;
        this.height = height - marginTop - marginBottom;
        [this.competence, this.xTitle = '', this.yTitle = '', this.marginBottom, this.marginLeft ] = [competence, xTitle, yTitle, marginBottom, marginLeft];
        this.svg = d3.select(svgSelector || "#chart")
                .attr('width', this.width + marginLeft + marginRight)
                .attr('height', this.height + marginTop + marginBottom)
                .append('g')
                .attr("transform", `translate(${marginLeft},${marginTop})`);
        this.ratings = ratings;
        this.minPadding = 0.1;
        this.tooltip = d3.select(tooltipSelector);
    }

    _calcPaddingForRect() {
        /**
         * Рассчёт оптимального расстояния между столбцами
         */
        const calc = count => 0.9 - (0.05 * (count - 1));
        const currentValue = calc(this.ratings.length);
        return currentValue < this.minPadding ? this.minPadding : currentValue;
    }

    init() {
        const xScale = d3.scale.ordinal()
            .rangeRoundBands([0, this.width], this._calcPaddingForRect());

        const yScale = d3.scale.linear()
            .range([this.height, 0]);

        const xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom");

        const yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left");

        xScale.domain(this.ratings.map(r => r.title));
        yScale.domain([0, this._getMaxValue()]);

        this.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", `translate(0,${this.height})`)
            .call(xAxis);

        if (this.ratings.length > 10) {
            this.svg.select(".x.axis")
                .selectAll("text")
                .style("text-anchor", "end")
                .style("font-size", "10px")
                .attr("dx", "-.8em")
                .attr("dy", "-.5em")
                .attr("transform", "rotate(-90)")
                .text(r => r.substr(0, 10));
        } else {
            this.svg.select(".x.axis")
                .selectAll("text")
                .text(r => r.substr(0, 10));
        }

        this.svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("y", -12)
            .attr("x", 30)
            .style("text-anchor", "end")
            .text(this.yTitle);

        this.svg.selectAll(".bar")
            .data(this.ratings)
            .enter()
            .append("rect")
            .style("fill", r => this._getColor(r.value))
            .attr("class", "bar")
            .attr("x", r => xScale(r.title))
            .attr("width", xScale.rangeBand())
            .attr("y", r => yScale(r.value))
            .attr("height", r => (this.height - yScale(r.value)))
            .on('mouseover', r => {
                this.tooltip
                    .transition()
                    .duration(200)
                    .style("opacity", 1);
                this.tooltip.html(r.title + '<br/>' + r.value)
                    .style("bottom", this.marginBottom + (this.height - yScale(r.value)) + 10 + "px")
                    .style("left", this.marginLeft + xScale(r.title) + xScale.rangeBand() / 2 + "px");
            })
            .on('mouseout', r => {
                this.tooltip.transition().duration(200).style("opacity", 0);
            });
    }

    _getMaxValue() {
        if (!this.competence) {
            return MAX_SCORE_COMPETENCE;
        }
        return this.competence.type === 'RATING'
                ? MAX_SCORE_INDICATOR
                : MAX_SCORE_COMPETENCE;
    }

    _getColor(val) {
        const progress = val / this._getMaxValue() * 100;
        switch (true) {
            case progress < 33:
                return '#a41732';
            case progress < 66:
                return '#ff9a00';
            case progress <= 100:
                return '#73af2e';
            default:
                return '#999';
        }
    }

    remove() {
        d3.select("svg g")
            .select("g")
            .remove();
        return this;
    }

    update(ratings = []) {
        this.remove();
        this.ratings = ratings;
        this.init();
    }

    get tooltip() {
        return this._tooltip;
    }

    set tooltip(value) {
        this._tooltip = value;
    }

    get minPadding() {
        return this._minPadding;
    }

    set minPadding(value) {
        this._minPadding = value;
    }

    get ratings() {
        return this._ratings;
    }

    set ratings(value) {
        this._ratings = value;
    }

    get width() {
        return this._width;
    }

    set width(value) {
        this._width = value;
    }

    get height() {
        return this._height;
    }

    set height(value) {
        this._height = value;
    }

    get competence() {
        return this._competence;
    }

    set competence(value) {
        this._competence = value;
    }

    get xTitle() {
        return this._xTitle;
    }

    set xTitle(value) {
        this._xTitle = value;
    }

    get yTitle() {
        return this._yTitle;
    }

    set yTitle(value) {
        this._yTitle = value;
    }

    static create(ratings, svgSelector, tooltipSelector, options) {
        new RatingsChart(ratings, svgSelector, tooltipSelector, options).init();
    }
}