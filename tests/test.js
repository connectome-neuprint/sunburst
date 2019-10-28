import SunBurst from '../src/index';

const sunburst = new SunBurst({
  // height: 300,
  // width: 300,
});

const target = document.getElementById('sunburst');

const data = {
  name: "connections",
  children: [
    {
      name: 'inputs',
      children: [
        {
          name: 'AL',
          value: 417
        },
      ],
    },
    {
      name: 'outputs',
      children: [
        {
          name: 'PBx',
          children: [
            {
              name: 'foo',
              value: 45
            },
            {
              name: 'bar',
              value: 123
            }
          ]
        },
      ],
    },
  ]
};


sunburst.setData(data).render(target);
