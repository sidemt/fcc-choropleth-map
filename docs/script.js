// US Education Data
// const dataUrl =
//   'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json';
const dataUrl =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';

getDataset();

// Retrieve the dataset
function getDataset() {
  // Instanciate XMLHttpRequest Object
  req = new XMLHttpRequest();
  // Initialize GET request
  req.open('GET', dataUrl, true);
  // Send the request
  req.send();
  // onload event handler
  req.onload = function() {
    // Parse the returned JSON string to JavaScript object
    json = JSON.parse(req.responseText);
    // use the value of "data" only
    const dataset = json;
    drawChart(dataset); // dataset contains education data
  };
};

// Draw chart
function drawChart(dataset) {
  // Width and height of the svg area
  const width = 960;
  const height = 500;

  const path = d3.geoPath();

  // Min and Max value of the variance
  const minVari = d3.min(dataset, (d) => d['bachelorsOrHigher']);
  const maxVari = d3.max(dataset, (d) => d['bachelorsOrHigher']);
  console.log(minVari + ' / ' + maxVari);

  // Define colors to be used for color scale
  const colors = ['#F5E6E8', '#D5C6E0', '#AAA1C8', '#967AA1'];

  // Build color scale
  const colorScale = d3
      .scaleQuantize()
      .domain([minVari, maxVari])
      .range(colors);

  // returns corresponding education data of given county id
  function findEduData(id, eduDataset) {
    const result = eduDataset.find( ({fips}) => fips === id );
    return result['bachelorsOrHigher'];
  }


  // The SVG
  const svg = d3.select('#graph')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

  // US County Data
  const countyDataUrl =
    'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json';

  d3.json(countyDataUrl).then(function(data) { // draw counties
    svg.selectAll('path')
        // Refer to https://github.com/topojson/topojson-client/blob/master/README.md#feature
        .data(topojson.feature(data, data.objects.counties).features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('data-fips', (d) => d['id'])
        .attr('data-education', (d) => findEduData(d['id'], dataset))
        .attr('fill', (d) => colorScale(findEduData(d['id'], dataset)))
        .attr('class', 'county'); // required for the fcc test
  }).catch(function(err) {
    console.log(err);
  });

  // legend

  const sample = colors.map(function(color) {
    console.log(colorScale.invertExtent(color));
    return colorScale.invertExtent(color);
  });
  console.log('sample: ' + sample);

  // Scale for legend
  const legendScale = d3
      .scaleBand()
      .domain(sample.map(function(item) {
        return item[0];
      }))
      .range([0, 200]);

  // Define legend area
  const legendSvg = d3
      .select('#legend')
      .append('svg')
      .attr('width', 200)
      .attr('height', 40);

  // Display legend
  legendSvg
      .selectAll('rect')
      .data(sample)
      .enter()
      .append('rect')
      .attr('width', legendScale.bandwidth())
      .attr('height', 20)
      .attr('fill', (d) => colorScale(d[0]))
      .attr('x', (d, i) => i * legendScale.bandwidth())
      .attr('y', 0);

  // Configure legend axes
  const legendAxis = d3.axisBottom(legendScale).tickFormat(d3.format('.1f'));

  // Draw legend x-axis
  legendSvg
      .append('g')
      .attr('transform', 'translate(0, 20)')
      .call(legendAxis);
}
