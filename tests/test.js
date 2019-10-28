import SunBurst from '../src/index';

const sunburst = new SunBurst({
  // height: 300,
  // width: 300,
});

const target = document.getElementById('sunburst');

const data = {
  children: [
    'foo', 'bar', 'baz'
  ]
};


sunburst.setData(data).render(target);
