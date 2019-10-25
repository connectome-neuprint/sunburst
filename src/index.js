import * as d3 from 'd3';

const DEFAULT_PRIMARY_COLOR = "#ff0000";
const DEFAULT_SECONDARY_COLOR = "#0000ff";


export default class sunburst {
  constructor(props = {}) {
    this.data = props.data || {};
    this.primaryColor = props.primaryColor || DEFAULT_PRIMARY_COLOR;
    this.secondaryColor = props.secondaryColor || DEFAULT_SECONDARY_COLOR;
  }

  setData(dataObject) {
    this.data = dataObject;
    return this;
  }

  render(target) {
    // use d3 to append an svg element to the 'target' container.
    const { data } = this;
    const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1))
    console.log(color);
    console.log('rendering to', target);
  }
}
