import * as d3 from "d3";

const DEFAULT_PRIMARY_COLOR = "#ff0000";
const DEFAULT_SECONDARY_COLOR = "#0000ff";

function arcVisible(d) {
  return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
}

function labelVisible(d) {
  return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
}

function labelTransform(d, radius) {
  const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI;
  const y = ((d.y0 + d.y1) / 2) * radius;
  return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
}

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

    const partition = inputData => {
      const root = d3
        .hierarchy(inputData)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);
      return d3.partition().size([2 * Math.PI, root.height + 1])(root);
    };

    const width = 300;
    const radius = width / 6;
    const color = d3.scaleOrdinal(
      d3.quantize(d3.interpolateRainbow, data.children.length + 1)
    );
    const format = d3.format(",d");
    const arc = d3
      .arc()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
      .padRadius(radius * 1.5)
      .innerRadius(d => d.y0 * radius)
      .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1));

    const root = partition(data);
    root.each(d => {
      const newD = d;
      newD.current = d;
      return newD;
    });

    const svg = d3
      .select(target)
      .append("svg")
      .attr("viewBox", [0, 0, width, width])
      .style("font", "10px sans-serif");

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${width / 2})`);

    // draw the arcs
    const path = g
      .append("g")
      .selectAll("path")
      // data supplied is all the descendant nodes apart from the root
      .data(root.descendants().slice(1))
      .join("path")
      .attr("fill", d => {
        // loop over parents to find oldest ancestor color
        while (d.depth > 1) {
          d = d.parent;
        }
        return color(d.data.name);
      })
      .attr("fill-opacity", d => {
        if (arcVisible(d.current)) {
          return (d.children ? 0.6 : 0.4)
        }
        return 0;
      })
      .attr("d", d => arc(d.current));

    // set the on click function
    path
      .filter(d => d.children)
      .style("cursor", "pointer")
      .on("click", clicked);

    // add the title/tooltip to each arc
    path.append("title").text(
      d =>
        `${d
          .ancestors()
          .map(node => node.data.name)
          .reverse()
          .join("/")}\n${format(d.value)}`
    );

    // add the text label to each arc
    const label = g
      .append("g")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .style("user-select", "none")
      .selectAll("text")
      .data(root.descendants().slice(1))
      .join("text")
      .attr("dy", "0.35em")
      .attr("fill-opacity", d => +labelVisible(d.current))
      .attr("transform", d => labelTransform(d.current, radius))
      .text(d => d.data.name);

    // add "parent" circle to the middle of the graphic. This is used to go back
    // after zooming in to a child arc
    const parent = g
      .append("circle")
      .datum(root)
      .attr("r", radius)
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("click", clicked);

    function clicked(p) {
      parent.datum(p.parent || root);

      root.each(
        d =>
          (d.target = {
            x0:
              Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) *
              2 *
              Math.PI,
            x1:
              Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) *
              2 *
              Math.PI,
            y0: Math.max(0, d.y0 - p.depth),
            y1: Math.max(0, d.y1 - p.depth)
          })
      );

      const t = g.transition().duration(750);

      // Transition the data on all arcs, even the ones that aren’t visible,
      // so that if this transition is interrupted, entering arcs will start
      // the next transition from the desired position.
      path
        .transition(t)
        .tween("data", d => {
          const i = d3.interpolate(d.current, d.target);
          return t => (d.current = i(t));
        })
        .filter(function(d) {
          return +this.getAttribute("fill-opacity") || arcVisible(d.target);
        })
        .attr("fill-opacity", d => {
          if ( arcVisible(d.target)) {
            return (d.children ? 0.6 : 0.4)
          }
          return 0
        })
        .attrTween("d", d => () => arc(d.current));

      label
        .filter(function(d) {
          return +this.getAttribute("fill-opacity") || labelVisible(d.target);
        })
        .transition(t)
        .attr("fill-opacity", d => +labelVisible(d.target))
        .attrTween("transform", d => () => labelTransform(d.current, radius));
    }

  }
}
