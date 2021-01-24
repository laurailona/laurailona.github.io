/* Define height and width of svg image and elements */
var height = 500;
var width = 1000;
var padding = 60;
var rectHeight = 50;
var rectWidth = 50;

var pathMovementDuration = 4000;
var duration = 1000;

/* Retrieve hierarchical data as root */
var dataSet = {id: "All patients (Incidence)", children: [
  {id: "1", children: [
    {id: "ECOG 0-2", children: [
      {id: "Treatment: R-Chop/ RDHAP"}
    ]},
    {id:"ECOG > 2", children: [
      {id: "Treatment: R-Chop/ R-Bendamustine"}
    ]}
  ]},
  {id: "2", children: [
    {id: "ECOG 0-2", children: [
      {id: "Treatment: R-Chop/ RDHAP"}
    ]},
    {id:"ECOG > 2", children: [
      {id: "Treatment: R-Chop/ R-Bendamustine"}
    ]}
  ]},
  {id: "3", children: [
    {id: "ECOG 0-2", children: [
      {id: "Treatment: R-Chop/ RDHAP"}
    ]},
    {id:"4", children: [
      {id: "Treatment: R-Chop/ R-Bendamustine"}
    ]}
  ]},
  {id: "4", children: [
    {id: "ECOG 0-2", children: [
      {id: "Treatment: R-Chop/ RDHAP"}
    ]},
    {id:"ECOG > 2", children: [
      {id: "Treatment: R-Chop/ R-Bendamustine"}
    ]}
  ]},
  {id: "5-50", children: [
    {id: "ECOG 0-2", children: [
      {id: "Treatment: R-Chop/ RDHAP"}
    ]},
    {id:"4", children: [
      {id: "Treatment: R-Chop/ R-Bendamustine"}
    ]}
  ]}
]};

/* Create SVG Element */
var svg = d3.select("body").append("svg")
                  .attr("width", width + padding)
                  .attr("height", height + padding);

/* Append group element to svg element */
var g = svg.append("g")
            .attr("transform",
                  "translate(" + (padding / 2) + "," + (padding/2) + ")");


var treemap = d3.tree()
                .size([width, height]);


var i = 0;
var root;

// Assigns parent, children, height, depth
root = d3.hierarchy(dataSet, function(d) { return d.children; });
root.x0 = width / 2 - padding/2;
root.y0 = 0;

//###var nodes = d3.hierarchy(dataSet);


// Collapse after the second level
//treeData = treemap(nodes);

root.children.forEach(collapse);

update(root);
setTimeout(function() {animateBalls()}, duration); // Create initial tree and animate balls

// Collapse the node and all it's children
function collapse(d) {
  if(d.children) {
    d._children = d.children
    d._children.forEach(collapse)
    d.children = null
  }
}

function update(source) {

  // Assigns the x and y position for the nodes
  var treeData = treemap(root);

  // Compute the new tree layout.
  var nodes = treeData.descendants(),
      links = treeData.descendants().slice(1);

  // Normalize for fixed-depth.
  //nodes.forEach(function(d){ d.y = d.depth * 180});

  // ****************** Nodes section ***************************

  // Update the nodes...
  var node = svg.selectAll('g.node')
      .data(nodes, function(d) {return d.id || (d.id = ++i); });

  // Enter any new modes at the parent's previous position.
  var nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .attr("transform", function(d) {
        return "translate(" + (source.x0 + padding/2) + "," + (source.y0 + padding/2) + ")";
    })
    .on('click', click);

  // Add Circle for the nodes
  nodeEnter.append('circle')
      .attr('class', 'node')
      .attr('r', 1e-6)
      .style("fill", function(d) {
          return d._children ? "#c4f3e7" : "#f0f8ff";
      });

  // Add labels for the nodes
  nodeEnter.append('text')
      .attr("dy", ".35em")
      .attr("x", function(d) {
          return d.children || d._children ? -13 : 13;
      })
      .attr("text-anchor", function(d) {
          return d.children || d._children ? "end" : "start";
      })
      .text(function(d) { return d.data.id; });

  // UPDATE
  var nodeUpdate = nodeEnter.merge(node);

  // Transition to the proper position for the node
  nodeUpdate.transition()
    .duration(duration)
    .attr("transform", function(d) {
        return "translate(" + (d.x + padding/2) + "," + (d.y + padding/2) + ")";
     });

  // Update the node attributes and style
  nodeUpdate.select('circle.node')
    .attr('r', 10)
    .style("fill", function(d) {
        return d._children ? "#c4f3e7" : "#f0f8ff";
    })
    .attr('cursor', 'pointer')
    .classed('node--leaf', function(d) {
      return d.children ? false : true;
    })
    .classed('node--root', function(d) {
      return d.parent ? false : true;
    });


  // Remove any exiting nodes
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) {
          return "translate(" + (source.x +padding/2) + "," + (source.y + padding/2) + ")";
      })
      .remove();

  // On exit reduce the node circles size to 0
  nodeExit.select('circle')
    .attr('r', 1e-6);

  // On exit reduce the opacity of text labels
  nodeExit.select('text')
    .style('fill-opacity', 1e-6);

  // ****************** links section ***************************

  // Update the links...
  var link = svg.selectAll('path.link')
      .data(links, function(d) { return d.id; });

  // Enter any new links at the parent's previous position.
  var linkEnter = link.enter().insert('path', "g")
      .attr("class", "link")
      .attr('d', function(d){
        var o = {x: source.x0, y: source.y0}
        return createLink(o, o)
      });

  // UPDATE
  var linkUpdate = linkEnter.merge(link);

  // Transition back to the parent element position
  linkUpdate.transition()
      .duration(duration)
      .attr('d', function(d){ return createLink(d, d.parent) });

  // Remove any exiting links
  var linkExit = link.exit().transition()
      .duration(duration)
      .attr('d', function(d) {
        var o = {x: source.x, y: source.y}
        return createLink(o, o)
      })
      .remove();

  // Store the old positions for transition.
  nodes.forEach(function(d){
    d.x0 = d.x;
    d.y0 = d.y;
  });

  // Creates the path for the links
  function createLink(s, d) {

    path = `M ${s.x +padding/2} ${s.y+padding/2}
            L ${s.x +padding/2} ${(s.y+d.y)/2 + padding/2},
              ${d.x +padding/2} ${(s.y+d.y)/2 + padding/2},
              ${d.x+padding/2} ${d.y+padding/2}`

    return path
  }
  // Toggle children on click.
  function click(d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
    update(d);
  }
}

/* BALL ANIMATION */
//////////////////////////// TODO

function animateBalls() {
  /* Create initial circle for each leaf node */
  var leafNodes = d3.selectAll(".node--leaf");
  var ballInterval = 25;
  /* Count leaf Nodes */
  var numberOfLeafs = leafNodes.size();

  /* Allocate colours to endpoints */
  // TODO
  var categoryColours = ["#f7e08b", "#71ded3", "#b1d7f1", "#ffc0cb", '#d4d8d9',"#f7e08b", "#71ded3", "#b1d7f1", "#ffc0cb", '#d4d8d9',"#f7e08b", "#71ded3", "#b1d7f1", "#ffc0cb", '#d4d8d9',"#f7e08b", "#71ded3", "#b1d7f1", "#ffc0cb"];

  /* Set percentages (later from data), calculate offset positions for balls */
  var rows = 4;
  var percentages = [12,12,10,14,1,10,5,10,10,10,8,5,1,5,1,7,10,6,2,3,4,9,19,20,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]; // This will later come from data

  var offset = [];

  // Calculate offset positions from percentages, which are equivalent to column width of each category
  for (var i = 0; i < numberOfLeafs; i++) {
    var currentOffset = 0;
    for (var j = 0; j < i; j++) {
      currentOffset += percentages[j];
    }
    offset.push([currentOffset *10 + padding, 590]);
  }

  // combine offsets and ballstartingPoints

  // Define starting points of each category based on offsets
  var ballStartingPoints = offset;

  /* Check for root and create path */
  var paths = [];
  var root = d3.selectAll(".node--root"); // THIS IS UNDEFINED!!!
  console.log(root.size());

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
                  return i * ballInterval;
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
          return pathMovementDuration - 500 + i * ballInterval; // Ensure balls only begin moving after the end of the other transition
        })
        .duration(400).attr("transform", function(d,i) {
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
}

// TODO transition and remove balls */
function removeBalls() {
  svg.selectAll(".ball").remove();
}

function updateBalls() {
  removeBalls();
  animateBalls();
}
