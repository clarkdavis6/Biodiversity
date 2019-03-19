function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  var metadataURL = "/metadata/" + sample;
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(metadataURL).then((sampleMetadata) => {
    console.log(sampleMetadata);
    // Use d3 to select the panel with id of `#sample-metadata`
    var panelMetadata = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    panelMetadata.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(sampleMetadata).forEach(([key, value]) => {
      panelMetadata.append("h5").text(`${key}: ${value}`);
    });
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
  });
  // BONUS: Build the Gauge Chart
  // buildGauge(data.WFREQ);
}
function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var charts = "/samples/" + sample;
  d3.json(charts).then(function (chartData) {
    console.log(chartData)
    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: chartData.otu_ids,
      y: chartData.sample_values,
      mode: 'markers',
      text: chartData.otu_labels,
      marker: {
        size: chartData.sample_values,
        color: chartData.otu_ids
      }
    };

    var trace1 = [trace1];
    var layout = {
      showlegend: false,
      height: 600,
      width: 1400
    };
    Plotly.newPlot('bubble', trace1, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var values = chartData.sample_values;
    var lables = chartData.otu_ids;
    var hover = chartData.otu_labels;

    console.log("values:", values);
    console.log("lables:", lables);
    console.log("hover:", hover);

    var pieData = [{
      values: values.slice(0, 10),
      lables: lables.slice(0, 10),
      hovertext: hover.slice(0, 10),
      type: 'pie',
    }];
    var layout = {
      showlegend: true
    };
    Plotly.newPlot('pie', pieData, layout);

  });
}
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
