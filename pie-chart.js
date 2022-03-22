function PieChart(x, y, diameter) {
  this.x = x; // x position of pie chart
  this.y = y; //y position of pie chart
  this.diameter = diameter; // diameter of pie chart
  this.labelSpace = 30; //distance between pie chart labels

  this.get_radians = function (data) {
    let total = sum(data); // total base to then calculate individual portions in radians
    let radians = []; //radians array

    // for loop to convert data to radians and push into array
    for (let i = 0; i < data.length; i++) {
      radians.push((data[i] / total) * TWO_PI);
    }
    //return the array with data converted to radians that will be leveraged to draw pie chart.
    return radians;
  };

  this.draw = function (data, labels, colours, piesubtitle) {
    // Test that data is not empty and that each input array is the
    // same length.
    if (data.length == 0) {
      alert("Data has length zero!");
    } else if (
      ![labels, colours].every((array) => {
        return array.length == data.length;
      })
    ) {
      alert(`Data (length: ${data.length})
      Labels (length: ${labels.length})
      Colours (length: ${colours.length})
      Arrays must be the same length!`);
    }

    // https://p5js.org/examples/form-pie-chart.html

    let angles = this.get_radians(data);
    let lastAngle = 0;
    let colour;
    push();
    for (let i = 0; i < data.length; i++) {
      if (colours) {
        colour = colours[i];
      } else {
        colour = map(i, 0, data.length, 0, 255);
      }
      // colour for each section of pie chart
      push();
      fill(colour);
      stroke(0);
      strokeWeight(1);

      //draws each section of pie chart
      arc(
        this.x,
        this.y,
        this.diameter,
        this.diameter,
        lastAngle,
        lastAngle + angles[i] + 0.001
      ); // Hack for 0!

      // creates labels matching colours. Calls makelegend function below
      if (labels) {
        this.makeLegendItem(labels[i], i, colour);
      }

      if (piesubtitle) {
        this.piesubtitle(piesubtitle);
      }
      lastAngle += angles[i];
      pop();
    }
    pop();
  };

  // Function that draws subtitles of individual pie chart
  this.piesubtitle = function (piesubtitle) {
    noStroke();
    textAlign("center", "center");
    fill(0, 0, 128);
    textSize(30);
    text(piesubtitle, this.x, this.y - this.diameter * 0.6);
  };

  // Function that draws legend of pie chart
  this.makeLegendItem = function (label, i, colour) {
    let x = this.x + 170;
    let y = this.y + this.labelSpace * i + this.diameter / 3;
    let boxWidth = this.labelSpace / 2;
    let boxHeight = this.labelSpace / 2;

    fill(colour);
    //legend boxes
    rect(x, y, boxWidth, boxHeight);

    //legend text
    fill("black");
    noStroke();
    textAlign("left", "center");
    textSize(12);
    text(label, x + boxWidth + 10, y + boxWidth / 2);
  };
}
