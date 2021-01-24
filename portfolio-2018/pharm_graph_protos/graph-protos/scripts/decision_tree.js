/* Define height and width of svg image and elements */
var height = 500;
var width = 1000;
var padding = 60;
var rectHeight = 50;
var rectWidth = 100;

var pathMovementDuration = 3000;

/* Retrieve hierarchical data as root */
var dataSet = {id: "All patients (Incidence)", children: [
  {id: "< 65 years", children: [
    {id: "ECOG 0-2", children: [
      {id: "Treatment: R-Chop/ RDHAP"}
    ]},
    {id:"ECOG > 2", children: [
      {id: "Treatment: R-Chop/ R-Bendamustine"}
    ]}
  ]},
  {id: ">= 65 years", children: [
    {id: "ECOG 0-2", children: [
      {id: "Treatment: R-CHOP/ R-Bendamustine"}
    ]},
    {id: "ECOG > 2", children: [
      {id: "Treatment: Bendamustine, Rhuximab, Chlorambucil"}
    ]},
    {id: "ECOG > 2", children: [
      {id: "<3"}
    ]}
  ]}
]};

var treemap = d3.tree()
                .size([width, height]);

var nodes = d3.hierarchy(dataSet);
nodes = treemap(nodes);

/* Target Canvas-Div */
var canvas = document.querySelector("#canvas");

/* Create SVG Element */
var svg = d3.select("body").append("svg")
                  .attr("width", width + padding)
                  .attr("height", height + padding);

/* Append group element to svg element */
var g = svg.append("g")
            .attr("transform",
                  "translate(" + (padding / 2) + "," + (padding/2) + ")");

// STARTING FROM HERE NEEDS TO BE UPDATED OR RE-RENDERED - MOVED??
/* Add the links between individual nodes - is this still necessary? */
var link = g.selectAll(".link")
            .data(nodes.descendants().slice(1))
            .enter()
            .append("path")
            .attr("class", "link")
            .attr("d", function(d) {
              return "M" + d.x + " " + d.y
              + " L" + (d.x) + " " + (d.parent.y + d.y) /2
              + " L" + d.parent.x + " " + (d.parent.y + d.y) /2
              + " L" + d.parent.x + "," + d.parent.y;
            });

/* Add each node as a group */
var node = g.selectAll(".node")
            .data(nodes.descendants())
            .enter()
            .append("g")
            .attr("class", function(d) {
              return "node" +
                (d.children ? " node--internal" : " node--leaf")
                +
                (d.parent ? "" : " node--root");
            })
            .attr("transform", function(d) {
              return "translate(" + d.x + "," + d.y + ")";
            });


/* Add background layer for text */
node.append("rect")
    .attr("width", rectWidth)
    .attr("height", rectHeight)
    .attr("y", -rectHeight/2)
    .attr("x", -rectWidth/2)
    .attr("rx", "30")
    .attr("class", "node-label")

/* Add the text to the node */
node.append("text")
    .attr("dy", ".35em")
    .attr("y", 0)
    .style("text-anchor", "middle")
    .text(function(d) {
      if (d.data.id.length < 10) {
          return d.data.id;
        } else {
          return d.data.id.slice(0,7) + "..";
        }
    });


/* Create initial circle for each leaf node */
var leafNodes = d3.selectAll(".node--leaf");

/* Count leaf Nodes */
var numberOfLeafs = leafNodes.size();

/* Allocate colours to endpoints */
var categoryColours = ["#f7e08b", "#71ded3", "#b1d7f1", "#ffc0cb", '#d4d8d9'];

/* Set percentages (later from data), calculate offset positions for balls */
var rows = 4;
var percentages = [12,61,13,4,10]; // This will later come from data

var offset = [];

// Calculate offset positions from percentages, which are equivalent to column width of each category
for (var i = 0; i < numberOfLeafs; i++) {
  var currentOffset = 0;
  for (var j = 0; j < i; j++) {
    currentOffset += percentages[j];
  }
  offset.push(currentOffset);
}

// Define starting points of each category based on offsets
var ballStartingPoints = [[offset[0]*10+padding, 590], [offset[1]*10+padding, 590], [offset[2]*10+padding, 590], [offset[3]*10+padding, 590], [offset[4]*10+padding, 590]]; // THIS IS NOT DYNAMIC AT THE MOMENT put in forloop!!!

/* Check for root and create path */
var paths = [];
var columnWidth = 150; // This will be dynamically calculated later
var root = d3.selectAll(".node--root");

function getRootPosition() { // TODO check what to use instead of each
  var rootPosition = [];
  root.each(function(d) {
    rootPosition.push(d.x + padding/2);
    rootPosition.push(d.y - (rectHeight/2) + (padding/2));
  })
  return rootPosition;
}

leafNodes.each(function(d, i) {
  var path = [];
  var coordinates = [];
  var currentNode = d;
  var parentNode = currentNode.parent;
  var rootPosition = getRootPosition();

  // Final position
  coordinates.push(ballStartingPoints[i][0] + padding/2);
  coordinates.push(height + padding + 30); // puts it 30 below lowest node
  path.unshift(coordinates);

  //ballStartingPoints.push(coordinates);
  coordinates = [];


  while(currentNode.parent) {
    parentNode = currentNode.parent;
    // Move 1
    coordinates.push(currentNode.x + padding/2);
    coordinates.push(currentNode.y + padding/2);
    path.unshift(coordinates);
    coordinates = [];

    // Move 2
    coordinates.push(currentNode.x + padding/2);
    coordinates.push((parentNode.y + currentNode.y)/2 + padding/2);
    path.unshift(coordinates);
    coordinates = [];

    // Move 3
    coordinates.push(parentNode.x + padding/2);
    coordinates.push((parentNode.y + currentNode.y)/2 + padding/2);
    path.unshift(coordinates);
    coordinates = [];

    currentNode = parentNode;
  }
  path.unshift(rootPosition); // TODO this needs to be changed to first node
  paths.push(path);
})

// UPTO HERE CAN BE UPDATE FUNCTION

/* Make path */

/* Make rects */

/* Make texts */

// Make balls THIS NEEDS TO BE SEPARATE FUNCTION

var endpoint = 0;
var colourIndex = 0;

for (var i = 0; i < numberOfLeafs; i++) {
  for (var j = 0; j < percentages[i] * rows; j++) {
    svg.append("circle")
              .attr("transform", "translate(" + paths[0][0] + ")")
              .attr("r", "5")
              .attr("class", function(d) {
                return "ball ball-" + i; // this will need to be done differently when balls come from data
              })
              .attr("fill", function(d) {
                return categoryColours[i]; // this will need to be done differently when balls come from data
              });
  }
}

/* Target each ball */
var balls = d3.selectAll(".ball");

/* Select balls according to category */
for(var i = 0; i < numberOfLeafs; i++) {
  var currentCircles = d3.selectAll(".ball-" + i);

  var currentPath = svg.append("path")
                    .data([paths[i]])
                    .attr("d", d3.line()
                    .x(function(d) { return d[0]; })
                    .y(function(d) { return d[1]; })
                    )
                    .attr("class", "path path-" + i);

  transition(currentCircles, currentPath, i);

  function transition(currentCircles, currentPath, currentClassNumber) {
    currentCircles.transition()
              .delay(function(d, i) {
                return i * 12;
              })
              .duration(pathMovementDuration)
              .attrTween("transform", translateAlong(currentPath.node()))
              .end()
              .then(finalMove(currentCircles, currentClassNumber));
  }

  // Returns an attrTween for translating along the specified path element.
    function translateAlong(path) {
      var l = path.getTotalLength();
        return function(d, i, a) {
          return function(t) {
            var p = path.getPointAtLength(t * l);
            return "translate(" + p.x + "," + p.y + ")";
          };
        };
      }
/* Move balls into rows and columns in bar below graph */
function finalMove(currentCircles, currentClassNumber) {

  // Set offset values
  var currentOffset = (offset[currentClassNumber] * 10) + padding/2;
  var columnIndex = 0;

  // Initiate the transition
  currentCircles
      .transition()
      .delay(function(d, i) {
        return pathMovementDuration - 500 + i * 12; // Ensure balls only begin moving after the end of the other transition
      })
      .duration(100).attr("transform", function(d,i) {
        columnIndex++;
        if (columnIndex > currentCircles.size()/rows) {
          columnIndex = 1;
        }
        var xOffset = ballStartingPoints[currentClassNumber][0] + ((columnIndex-1)*10);
        var yOffset = ballStartingPoints[currentClassNumber][1];

        if (i < currentCircles.size()/rows) {
          return "translate(" + xOffset + "," + yOffset + ")";
          //i * 10 + currentOffset;
        }
        if (i < currentCircles.size()/rows*2 && i >= currentCircles.size()/rows) {
          yOffset += 10;
          return "translate(" + xOffset + "," + yOffset + ")"
        }
        if (i < currentCircles.size()/rows*3 && i >= currentCircles.size()/rows*2) {
          yOffset += 20;
          return "translate(" + xOffset + "," + yOffset + ")"
        }
        if (i < currentCircles.size()/rows*4 && i >= currentCircles.size()/rows*3) {
          yOffset += 30;
          return "translate(" + xOffset + "," + yOffset + ")"
        }

        });
}
}

/* Update tree */
function verticalUpdate(element) {
  // Update tree tree
  var treemap = d3.cluster()
                  .size([width, height]);


  //

}

/* Collapse tree - PUT IN SEPARATE function? */

function collapseChildren(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update(d);
}
