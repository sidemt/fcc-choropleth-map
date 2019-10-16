// US Education Data
const dataUrl =
  'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json';

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
    drawChart(dataset);
  };
};

// Draw chart
function drawChart(dataset) {
  // Width and height of the svg area
  const width = 960;
  const height = 500;

  const path = d3.geoPath();

  // The SVG
  const svg = d3.select('#graph')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

  // US County Data
  const countyDataUrl =
    'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json';

  d3.json(countyDataUrl).then(function(data) {
    svg.selectAll('path')
        // Refer to https://github.com/topojson/topojson-client/blob/master/README.md#feature
        .data(topojson.feature(data, data.objects.counties).features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('fill', 'green');
  }).catch(function(err) {
    console.log(err);
  });
}
