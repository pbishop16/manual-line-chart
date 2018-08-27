import Component from '@ember/component';
import {
  set,
  getProperties,
  setProperties,
 } from '@ember/object';
import d3 from 'npm:d3';

export default Component.extend({
  tagName: 'svg',
  attributeBindings: ['svgWidth:width', 'svgHeight:height'],

  margin: null,
  interval: 10,
  svgWidth: 950,
  svgHeight: 500,
  data: null,

  init() {
    this._super(...arguments);

    const {
      data,
      interval,
      margin,
    } = getProperties(this, ['data', 'interval', 'margin']);

    if (!data) {
      const defaultData = [];

      for(let i = 0; i <= interval; i++) {
        defaultData.pushObject({
          xData: 5 * i,
          yData: 5 + i,
        });
      }

      set(this, 'data', defaultData);
    }

    if (!margin) {
      set(this, 'margin', {
        top: 20,
        left: 50,
        right: 20,
        bottom: 30,
      });
    }
  },

  didInsertElement() {
    this._super(...arguments);

    this.setLayout();
    this.setScales();
    this.setLine();
    this.buildChart();
  },

  setLayout() {
    const {
      svgWidth,
      svgHeight,
      margin,
      elementId,
    } = getProperties(this, ['svgWidth', 'svgHeight', 'margin', 'elementId']);
    const {
      top,
      right,
      bottom,
      left,
    } = getProperties(margin, ['top','right', 'bottom', 'left']);
    const svg = d3.select(`#${elementId}`);
    const width = svgWidth - left - right;
    const height = svgHeight - top - bottom;
    const g = svg.append('g').attr('transform',`translate(${left},${top})`);

    setProperties(this, {
      svg,
      width,
      height,
      g,
    });
  },

  setScales() {
    const {
      width,
      height,
    } = getProperties(this, ['width', 'height']);
    const x = d3.scaleLinear().rangeRound([0,width]);
    const y = d3.scaleLinear().rangeRound([height,0]);

    setProperties(this, {
      x,
      y,
    });
  },

  setLine() {
    const {
      x,
      y,
    } = getProperties(this, ['x','y']);
    const line = d3.line()
                   .x(d => x(d.xData))
                   .y(d => y(d.yData));

    set(this, 'line', line);
  },

  buildChart() {
    const {
      x,
      y,
      data,
      g,
      height,
      line,
    } = getProperties(this, [
      'x',
      'y',
      'data',
      'g',
      'height',
      'line',
    ]);

    x.domain(d3.extent(data, d => d.xData));
    y.domain(d3.extent(data, d => d.yData));

    g.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x))
      .select('.domain');

    g.append('g')
        .call(d3.axisLeft(y))
      .append('text')
        .attr('fill', '#000')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .attr('text-anchor', 'end')
        .text('Y Axis');

    g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('stroke-width', 1.5)
        .attr('d', line);
  },
});
