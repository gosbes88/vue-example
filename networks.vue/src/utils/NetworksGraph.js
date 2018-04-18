import * as d3 from "d3";
import avatarImg from '../assets/img/avatar-default.png';

export class NetworksGraph {
    /**
     *
     * @param networks
     * @param svgSelector - id svg
     * @param tooltipSelector - id tooltip div
     * @param options - additional settings
     */
    constructor(networks, svgSelector, tooltipSelector, {width, height, marginLeft, marginRight, marginTop, marginBottom}) {
        this.networks = networks;
        this.svgSelector = svgSelector;
        this.tooltipSelector = tooltipSelector;
        this.width = width;
        this.height = height;
        [this.marginLeft, this.marginRight, this.marginTop, this.marginBottom] = [marginLeft, marginRight, marginTop, marginBottom];
        this.tooltip = d3.select(tooltipSelector);

        this.svg = d3.select(svgSelector)
            .attr('width', this.width)
            .attr('height', this.height)
            .call(d3.behavior.zoom().scaleExtent([0.1, 10]).on('zoom', this.zoom.bind(this)))
            .on("dblclick.zoom", null)
            .append('g');

        this.link = null;
        this.node = null;
        this.neighbors = {};
        this.glyph = null;
        this.glyphLabels = null;
        this.weights = {};
    }

    zoom() {
        this.svg.attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
    }

    init() {
        this.draw(true);
    }

    draw(initDefs) {
        let force = d3.layout.force()
            .gravity(0.1)
            .distance(80)
            .charge(-300)
            .size([this.width, this.height]);

        force.nodes(this.networks.nodes)
            .links(this.networks.links)
            .on('tick', this.tick.bind(this))
            .start();


        force.nodes().forEach(node => {
            node.radius = 10 + node.weight * 1.5;
            this.weights[node.weight] = node.weight * 1.5;
        });

        console.log(force.nodes());

        if (initDefs) {
            this._initDefs();
        }

        this.link = this.svg.selectAll('.link')
            .data(this.networks.links)
            .enter().append('line')
            .attr("class", 'line')
            .style('stroke', '#ccc');

        this.node = this.svg.selectAll('.node')
            .data(this.networks.nodes)
            .enter().append('g')
            .attr("class", 'node')
            .attr('transform', d => {return "translate(" + d.x + "," + d.y + ")"});

        this.node.append("circle")
            .attr('class', 'shadow')
            .attr("r", d => (10 + 8 + 2 * (d.weight * 1.5)) / 2)
            .style("fill", "#494949")
            .style("filter", "url(#shadow)");

        this.node.append("circle")
            .attr("r", d => 10 + d.weight * 1.5)
            .style("fill", d => "#ccc");

        this.node.append("circle")
            .attr("class", "whiteBlank")
            .attr("r", d => 10 - 1 + d.weight * 1.5)
            .style("fill", "#fff");

        this.node.append("circle")
            .attr('class', 'node-border')
            .attr("r", d => 8 + d.weight * 1.5)
            .style("fill", d => `url(#defaultAvatar${d.weight})`)
            .on("mouseover", this._handleMouseOver.bind(this))
            .on("mouseout", this._handleMouseOut.bind(this));

        let root = this;
        this.node.on("mouseover", this._handleMouseOver.bind(this))
            .on("mouseout", this._handleMouseOut.bind(this))
            .on("click", function(node) { root.highLightNeighbors(node, this);});

        d3.select(this.svgSelector).on('click', () => this.deHighLight());

        force.nodes().forEach(node => this.neighbors[node.index] = this.neighbors[node.index] || []);
        force.links().forEach(link => {
            this.neighbors[link.source.index].push(link.target.index);
            this.neighbors[link.target.index].push(link.source.index);
        });

        this.glyph = this.node.append('circle')
            .attr({
                'r': 5,
                'cx': 10,
                'cy': -10,
                'class': 'node-glyph'
            });
        this.glyph.style('display', 'none');

        this.glyphLabels = this.node.append('text')
            .attr({
                'dx': 10,
                'dy': -9,
                'text-anchor': 'middle',
                'class': 'glyph-label'
            })
            .text(d => '');
        this.glyphLabels.style('display', 'node');
    }

    highLightNeighbors(node, $this) {
        d3.event.stopPropagation();
        this.deHighLight();
        this.link.classed('background-line', l => !(node.index === l.source.index || node.index === l.target.index));
        this.node.classed('background', n => this.neighbors[node.index].indexOf(n.index) === -1);
        d3.select($this).classed('background', false);
        d3.selectAll($this.childNodes).style({
            'display': 'inline-block',
            'visibility': 'visible'
        });
        this.glyphLabels.text(() => this.neighbors[node.index].length);
    }

    deHighLight() {
        this.node.classed('background', false);
        this.link.classed('background-line', false);
        this.glyph.style('display', 'none');
        this.glyphLabels.style('display', 'none');
    }

    _handleMouseOver(node) {
        if (!this.tooltip) {
            return;
        }

        this.tooltip
            .transition()
            .duration(200)
            .style("opacity", 1)
            .style("z-index", 1);
        this.tooltip.html(`${node.lastName || ''} ${node.name || '' }`)
            .style("top", (d3.event.pageY + 10) + "px")
            .style("left", (d3.event.pageX + 10) + "px");
    }

    _handleMouseOut() {
        if (!this.tooltip) {
            return;
        }
        this.tooltip.transition()
            .duration(200)
            .style("opacity", 0)
            .style("z-index", -1);
    }

    tick() {
        this.link.attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        console.log(this.networks.nodes);
        // let q = d3.geom.quadtree(this.networks.nodes),
        //     i = 0,
        //     n = this.networks.nodes.length;
        //
        // while(++i < n) {
        //     q.visit(this.collide(this.networks.nodes[i]));
        // }

        this.node.attr('transform', d => "translate(" + d.x + "," + d.y + ")");
    }

    collide(node) {

        console.log(node);
    }

    remove() {
        d3.select("svg g")
            .select("g")
            .remove();
        return this;
    }

    update(networks = []) {
        this.remove();
        this.networks = networks;
        this.draw();
    }

    _initDefs() {
        const baseDefs = this.svg.append('defs');
        let dropShadowFilter = baseDefs.append('svg:filter')
            .attr('id', 'shadow')
            .attr('filterUnits', "userSpaceOnUse")
            .attr('width', '250%')
            .attr('height', '250%');

        dropShadowFilter.append('svg:feGaussianBlur')
            .attr('in', 'SourceGraphic')
            .attr('stdDeviation', 4)
            .attr('result', 'blur-out');

        dropShadowFilter.append('svg:feOffset')
            .attr('in', 'color-out')
            .attr('dx', 0)
            .attr('dy', 0)
            .attr('result', 'the-shadow');

        dropShadowFilter.append('svg:feBlend')
            .attr('in', 'SourceGraphic')
            .attr('in2', 'the-shadow')
            .attr('mode', 'normal');

        Object.keys(this.weights).forEach(w => {
            baseDefs.append("pattern")
                .attr("id", "defaultAvatar" + w)
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", 1)
                .attr("height", 1)
                .append("image")
                .attr('x',0)
                .attr('y',0)
                .attr('width', 2  * (8 + this.weights[w]))
                .attr('height', 2 * (8 + this.weights[w]))
                .attr("xlink:href", avatarImg);
        });
    }

    static create(networks, svgSelector, tooltipSelector, options) {
        new NetworksGraph(networks, svgSelector, tooltipSelector, options).init();
    }

    get weights() {
        return this._weights;
    }

    set weights(value) {
        this._weights = value;
    }

    get glyphLabels() {
        return this._glyphLabels;
    }

    set glyphLabels(value) {
        this._glyphLabels = value;
    }

    get glyph() {
        return this._glyph;
    }

    set glyph(value) {
        this._glyph = value;
    }

    get neighbors() {
        return this._neighbors;
    }

    set neighbors(value) {
        this._neighbors = value;
    }

    get node() {
        return this._node;
    }

    set node(value) {
        this._node = value;
    }

    get link() {
        return this._link;
    }

    set link(value) {
        this._link = value;
    }

    get svg() {
        return this._svg;
    }

    set svg(value) {
        this._svg = value;
    }

    get tooltip() {
        return this._tooltip;
    }

    set tooltip(value) {
        this._tooltip = value;
    }

    get width() {
        return this._width;
    }

    set width(value) {
        this._width = value;
    }

    get networks() {
        return this._networks;
    }

    set networks(value) {
        if (typeof value === 'object') {
            this._networks = value;
        } else {
            throw 'incorrect argument "value" to function "set" for networks';
        }
    }

    get marginBottom() {
        return this._marginBottom;
    }

    set marginBottom(value) {
        this._marginBottom = value;
    }

    get marginTop() {
        return this._marginTop;
    }

    set marginTop(value) {
        this._marginTop = value;
    }

    get marginRight() {
        return this._marginRight;
    }

    set marginRight(value) {
        this._marginRight = value;
    }

    get marginLeft() {
        return this._marginLeft;
    }

    set marginLeft(value) {
        this._marginLeft = value;
    }

    get height() {
        return this._height;
    }

    set height(value) {
        this._height = value;
    }

    get tooltipSelector() {
        return this._tooltipSelector;
    }

    set tooltipSelector(value) {
        this._tooltipSelector = value;
    }

    get svgSelector() {
        return this._svgSelector;
    }

    set svgSelector(value) {
        this._svgSelector = value;
    }
}