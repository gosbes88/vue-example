import * as d3 from 'd3';
import avatarImg from '../assets/img/avatar-default.png';
import { MAX_RADIUS_NODE, MIN_RADIUS_NODE } from './Constants';

export class TreeRelations {
    constructor(treeData = [], svgSelector = "#relation", options = {} ) {
        this.width = options.width;
        this.height = options.height;
        this.treeData = treeData;
        this.svg = d3.select(svgSelector || "#relation")
                .attr('width', this.width)
                .attr('height', this.height)
                .append('g');
        this.tree = d3.layout.tree().size([this.width, this.height]);
        this.mainSvgGroup = null;
        this.tooltip = d3.select('.tooltip');
        this.radiusSmall = options.radiusSmall || 125;
        this.radiusBig = options.radiusBig || 250;
        this.parentNodeRadius = {};
        this.childNodeRadius = {};
        this.nodeMaxRadius = options.nodeMaxRadius || null;
    }

    static create(treeData = [], svgSelector, options = {}) {
        new TreeRelations(treeData, svgSelector, options).init();
    }

    get mainSvgGroup() {
        return this._mainSvgGroup;
    }

    set mainSvgGroup(val) {
        this._mainSvgGroup = val;
    }

    get treeData() {
        return this._treeData;
    }

    set treeData(val) {
        if (typeof val === 'object') {
            this._treeData = val;
        } else {
            throw 'incorrect argument "val" to function "set" for treeData';
        }
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
                .style("top", (d3.event.layerY - 10) + "px")
                .style("left", (d3.event.layerX + 10) + "px");
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

    _update(){
        this.tree = this.tree.size([this.height, this.width]);
        let nodes = this.tree.nodes(this.treeData),
            links = this.tree.links(nodes);

        let node = this.mainSvgGroup.selectAll("g.node").data(nodes);
        let nodeEnter = node.enter()
                .append("g")
                .attr("class", "node")
                .attr("transform", d => "translate(" + d.x0 + "," + d.y0 + ")");

        nodeEnter.append('defs')
                .append("pattern")
                .attr('id', d => d.id)
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", 1)
                .attr("height", 1)
                .append("image")
                .attr('x',0)
                .attr('y',0)
                .attr('width', d => d.rSmall * 2)
                .attr('height', d => d.rSmall * 2)
                .attr("xlink:href", d => d.id && d.avatar ? "/organizations/img/employee/" + d.id + "/avatar" : avatarImg);

        nodeEnter.append("circle")
                .attr('class', 'shadow')
                .attr("r", d => (d.rBig + d.rSmall) / 2)
                .style("fill", "#494949")
                .style("filter", "url(#shadow)");

        nodeEnter.append("circle")
                .attr("r", d => d.rBig)
                .style("fill", d => d.color ? d.color : "#ccc");

        nodeEnter.append("circle")
                .attr("class", "whiteBlank")
                .attr("r", d => d.rBig - 1)
                .style("fill", "#fff");

        nodeEnter.append("circle")
                .attr('class', 'node-border')
                .attr("r", d => d.rSmall - 1)
                .style("fill", d => d.avatar && d.avatar.length > 0 ? `url(#${d.id})` : `url(${d.isBig ? '#defaultAvatar' : '#smallDefaultAvatar'})`)
                .on("mouseover", this._handleMouseOver.bind(this))
                .on("mouseout", this._handleMouseOut.bind(this));

        this.mainSvgGroup
                .selectAll("path.link")
                .data(links)
                .enter()
                .insert("path", "g")
                .attr("d", d => `M${d.target.x0},${d.target.y0}L${d.source.x0},${d.source.y0}`)
                .attr('fill', 'none')
                .attr('stroke', d => d.target.color ? d.target.color : '#ccc');
    }

    _sort() {
        this.tree.sort((a, b) => b.lastName.toLowerCase() < a.lastName.toLowerCase() ? 1 : -1);
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

        baseDefs.append("pattern")
                .attr("id", "defaultAvatar")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", 1)
                .attr("height", 1)
                .append("image")
                .attr('x',0)
                .attr('y',0)
                .attr('width', 2 * this.parentNodeRadius.rSmall)
                .attr('height', 2 * this.parentNodeRadius.rSmall)
                .attr("xlink:href", avatarImg);

        baseDefs.append("pattern")
                .attr("id", "smallDefaultAvatar")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", 1)
                .attr("height", 1)
                .append("image")
                .attr('x',0)
                .attr('y',0)
                .attr('width', 2 * this.childNodeRadius.rSmall)
                .attr('height', 2 * this.childNodeRadius.rSmall)
                .attr("xlink:href", avatarImg);
    }

    _calcNodeRadius() {
        if (!this.treeData.children) {
            return;
        }
        const circumference = 2 * Math.PI * this.radiusSmall;
        const maxRadius = this.nodeMaxRadius || MAX_RADIUS_NODE;
        let nodeRadius = Math.floor(circumference / (2 * this._calcNodeCountToCircle(this.treeData.children.length)));
        nodeRadius = nodeRadius > maxRadius
                ? maxRadius
                : nodeRadius < MIN_RADIUS_NODE
                    ? MIN_RADIUS_NODE
                    : nodeRadius;
        this.parentNodeRadius = {
            rBig: 2 * nodeRadius,
            rSmall: 2 * (nodeRadius * 5 / 6)
        };
        this.childNodeRadius = {
            rBig: nodeRadius,
            rSmall: (nodeRadius * 5 / 6)
        };
    }

    _calcCoordCircles() {
        let tempData = this.treeData.children ? this.treeData.children.slice(0, 30) : [];
        if (tempData.length === 1) {
            tempData[0] = {...tempData[0], ...this.childNodeRadius, x0: this._calcCoordX(0.5 * Math.PI, false), y0: this._calcCoordY(0.5 * Math.PI, false)};
        } else {
            let nodesToSmallCircle = this._calcNodeCountToCircle(tempData.length);
            let nodesToBigCircle = tempData.length - nodesToSmallCircle;
            const sectorSmallSize = 2 * Math.PI / nodesToSmallCircle;
            for (let i = 0; i < nodesToSmallCircle; i++) {
                tempData[i] = {...tempData[i], ...this.childNodeRadius, x0: this._calcCoordX(sectorSmallSize * i, false), y0: this._calcCoordY(sectorSmallSize * i, false)};
            }

            /**
             * Рассчёт координат расположения узлов во внешнем круге. Логика - по одному узлу на краях угла (-30 и 30 градусов),
             * остальные равноудалены друг от друга в дуге между крайними узлами
             */
            const sectorBigSize = nodesToBigCircle ? Math.PI / (3 * (0.5 * nodesToBigCircle - 1)) : nodesToBigCircle;
            if (sectorBigSize) {
                for(let i = 0; i < 0.5 * nodesToBigCircle; i++) {
                    let angle = 5 * Math.PI / 6 + sectorBigSize * i;
                    tempData[nodesToSmallCircle + i] = {...tempData[nodesToSmallCircle + i], ...this.childNodeRadius, x0: this._calcCoordX(angle, true), y0: this._calcCoordY(angle, true)};
                    tempData[tempData.length - (1 + i)] = {...tempData[tempData.length - (1 + i)], ...this.childNodeRadius, x0: this._calcCoordX(angle + Math.PI, true), y0: this._calcCoordY(angle  + Math.PI, true)};
                }
            }
        }
        this.treeData = {...this.treeData, ...this.parentNodeRadius, children: tempData, x0: this.width / 2, y0: this.height / 2, isBig: true};
    }

    _calcNodeCountToCircle(totalCount) {
        switch (true) {
            case totalCount <= 12:
                return totalCount;
            case totalCount <= 18:
                return totalCount - 4;
            case totalCount <= 24:
                return totalCount - 8;
            default:
                return totalCount - 12;
        }
    }

    _calcCoordX(angle, isCircleBig) {
        return this.width / 2 + (isCircleBig ? this.radiusBig : this.radiusSmall) * Math.cos(angle);
    }

    _calcCoordY(angle, isCircleBig) {
        return this.height / 2 + (isCircleBig ? this.radiusBig : this.radiusSmall) * Math.sin(angle);
    }

    init(isInitDefs = true) {
        this._calcNodeRadius();
        this._calcCoordCircles();
        if (isInitDefs) {
            this._initDefs();
        }
        this.mainSvgGroup = this.svg.append('g');
        this._sort();
        this._update();
    }

    remove() {
        d3.select("svg g")
            .select("g")
            .remove();
        return this;
    }

    update(treeData = []) {
        this.remove();
        this.treeData = treeData;
        this.init(false);
    }
}