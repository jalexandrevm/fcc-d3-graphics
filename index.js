// defining dimensions
const w = 740;
const h = 480;
const padding = 20;

d3.select(".container").append('h1')
  .text('Learning D3')
  .attr('id', 'title');
d3.select(".container").append('h2');
d3.select("h2").append('div');
d3.select("h2").append('div')
  .append('span')
  .text('Anual Sales');
d3.select("h2").append('div')
  .attr('id', 'btn-chg')
  .append('span')
  .text('REAL')
  .attr('id', 'switch')
  .on('click', changeGraphics);
d3.select(".container").append("div")
  .attr('id', 'graphics');

function changeGraphics(event) {
  if (event.target.innerText === 'TEST') {
    event.target.innerText = 'REAL';
    showD3GDP();
  } else {
    event.target.innerText = 'TEST';
    learnD3Graphics()
  }
}
const clearSVGArea = () => {
  // removing tooltip and svg if exists
  d3.select('#tooltip').remove();
  d3.select('svg').remove();
}
const drawSVGArea = () => {
  // difining our svg area
  d3.select("#graphics").append('div')
    .attr('id', 'tooltip');
  d3.select("#graphics").append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr('margin', 'auto');
}

// test made to understand Bar Chart with D3
// data for test
const learnD3Graphics = () => {
  const dataset = [
    [10, 2002], [14, 2001], [29, 2007], [19, 2003], [35, 2011], [47, 2004], [22, 2012], [36, 2013], [29, 2010], [19, 2009], [35, 2005], [22, 2008], [37, 2006]
  ];
  // ordering data
  const sorted = d3.sort(dataset, d => d[1]);
  // removing the other graphic
  clearSVGArea();
  // creating the new SVG area
  drawSVGArea();
  // getting our svg element
  const svg = d3.select("svg");
  // defining scales
  const xScale = d3.scaleLinear()
    .domain([d3.min(sorted, d => d[1]), 1 + d3.max(sorted, d => d[1])])
    .range([padding, (w - padding)]);
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, d => d[0])])
    .range([h - padding, padding]);
  // defining axis
  const xAxis = d3.axisBottom(xScale);
  svg.append('g')
    .attr('transform', 'translate(0, ' + (h - padding) + ')')
    .attr('id', 'x-axis')
    .call(xAxis);
  const yAxis = d3.axisLeft(yScale);
  svg.append('g')
    .attr('transform', 'translate(' + padding + ', 0)')
    .attr('id', 'y-axis')
    .call(yAxis);
  // including bars
  const rectWidth = ((w - 2 * padding) / dataset.length);
  svg.selectAll('rect').data(sorted).enter().append('rect')
    .attr('x', (d, i) => padding + i * rectWidth)
    .attr('y', (d) => yScale(d[0]))
    .attr('width', (rectWidth))
    .attr('height', (d) => h - padding - yScale(d[0]))
    .attr('class', 'bar')
    .attr('data-date', d => d[1])
    .attr('data-gdp', d => d[0])
    .append('title')
    .text(d => d[0])
}
// learnD3Graphics();

const showD3GDP = () => {
  clearSVGArea();
  // made for real
  d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
    .then(data => {
      // certifying the array's length
      // console.log(data.data.length);
      const arrData = data.data;
      // discovering how to make date work on my time zone
      // console.log(new Date(arrData[0][0] + 'T00:00'));
      const arrYears = arrData.map(item => new Date(item[0] + 'T00:00'));
      const arrSales = arrData.map(item => item[1]);
      // removing the other graphic
      clearSVGArea();
      // creating the new SVG area
      drawSVGArea();
      // getting our svg element
      const svg = d3.select("svg");
      // getting our tooltip element
      const tooltip = d3.select('#tooltip');
      // defining scales
      // was necessary a time scale
      const xScale = d3.scaleTime()
        .domain([d3.min(arrYears), d3.max(arrYears)])
        .range([2 * padding, (w - padding)]);
      // a linear scale worked fine here
      const yScale = d3.scaleLinear()
        .domain([0, d3.max(arrData, d => d[1])])
        .range([h - 1.5 * padding, 1.5 * padding]);
      // defining axis
      const xAxis = d3.axisBottom(xScale);
      svg.append('g')
        .attr('transform', 'translate(0, ' + (h - 1.5 * padding) + ')')
        .attr('id', 'x-axis')
        .call(xAxis);
      const yAxis = d3.axisLeft(yScale);
      svg.append('g')
        .attr('transform', 'translate(' + 2 * padding + ', 0)')
        .attr('id', 'y-axis')
        .call(yAxis);
      // getting bars width
      const rectWidth = ((w - 3 * padding) / arrData.length);
      // verifying bar's width
      // console.log(rectWidth);
      // adding bars to chart
      svg.selectAll('rect').data(arrData).enter().append('rect')
        .attr('x', (d, i) => 2 * padding + i * rectWidth)
        .attr('y', (d) => yScale(d[1]))
        .attr('width', (rectWidth))
        .attr('height', (d) => h - (1.5 * padding) - yScale(d[1]))
        .attr('class', 'bar')
        .attr('data-date', (d, i) => arrData[i][0])
        .attr('data-gdp', (d, i) => arrData[i][1])
        .attr('index', (d, i) => i)
        .on('mouseover', function (event) {
          const i = this.getAttribute('index');
          const year = arrYears[i].getFullYear();
          const month = parseInt(arrYears[i].getMonth()) + 1;
          tooltip.transition().duration(200).style('opacity', 0.9);
          tooltip
            .html(
              year + ' / ' + ((month === 1) ? 'Q1' : ((month === 4) ? 'Q2' : ((month === 7) ? 'Q3' : ((month === 10) ? 'Q4' : 'N')))) +
              '<br>' +
              '$' + arrSales[i] +
              ' Billion'
            )
            .attr('data-date', data.data[i][0])
            .style('left', (((i * rectWidth + 10 + 120) < 670) ? (i * rectWidth + 10 + 'px') : (i * rectWidth - 140 + 'px')))
            .style('top', h - 50 + 'px')
            .style('background-color', '#fff')
            .style('transform', 'translateX(60px)');
        })
        .on('mouseout', function () {
          tooltip.transition().duration(200).style('opacity', 0);
        });
    });
}
showD3GDP();
