const DEFAULT_PRIMARY_COLOR = '#ff0000';
const DEFAULT_SECONDARY_COLOR = '#0000ff';

export default class sunburst {
  constructor(props={}) {
    this.data = props.data || {};
    this.primaryColor = props.primaryColor || DEFAULT_PRIMARY_COLOR;
    this.secondaryColor = props.secondaryColor || DEFAULT_SECONDARY_COLOR;
  }

  render(target) {
    // use d3 to append an svg element to the 'target' container.
    //
  }
}
