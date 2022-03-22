function DonutChart(x, y, diameter) {
  this.x = x;
  this.y = y;
  this.diameter = diameter;
  this.labelSpace = 40;

  this.get_radians = function (data) {
    // called from draw below
    let total = sum(data);
    let radians = [];
    for (let i = 0; i < data.length; i++) {
      // radians.push((data[i] / total) * TWO_PI); // convert result to radians
      radians.push((data[i] / total) * TAU); // convert result to radians
    }
    return radians;
  };

  this.draw = function (data, labels, colours, title, subtitle) {
    // Test that data is not empty and that each input array is the same length.
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

    push();
    angleMode(RADIANS);
    let angles = this.get_radians(data); // call function above to get radians
    let total = sum(data);
    let angleStart = 0; // start at 0
    let colour;

    let mouseDist = dist(this.x, this.y, mouseX, mouseY); // distance from center of doughnut

    // if (mouseY < height / 2){
    //     mouseAngle = -1*(createVector(100,0).angleBetween(createVector(mouseX - this.x, mouseY - this.y)))
    // }
    // else{
    mouseAngle = createVector(100, 0).angleBetween(
      createVector(mouseX - this.x, mouseY - this.y)
    );
    // }
    console.log(mouseAngle);
    // calculate angle, in radians, between vector(100,0) and vector of mouse position versus center of doughnut
    if (mouseAngle < 0) {
      mouseAngle += TWO_PI; // to ensure the mouseAngle is only a positive value
    }
    console.log(mouseAngle);
    for (let i = 0; i < data.length; i++) {
      if (colours) {
        colour = colours[i];
      } else {
        colour = map(i, 0, data.length, 0, 255);
      }
      push();
      fill(colour);
      stroke(50);
      strokeWeight(4);

      ellipseMode(RADIUS);
      let angleStop = angles[i];
      arc(
        this.x,
        this.y,
        this.diameter / 2,
        this.diameter / 2, // width, height
        angleStart,
        angleStart + angleStop
      ); // angle to start and stop, in radians
      angleStart += angleStop; // for each angle added
      pop();

      if (labels) {
        this.makeLegendItem(labels[i], i, colour); // call function below for each i
      }
    }

    if (title) {
      noStroke();
      textAlign("center", "center");
      fill(0, 0, 128);
      textSize(30);
      text(title, width / 2, this.y - this.diameter * 0.9);
    }
    if (subtitle) {
      noStroke();
      textAlign("left", "center");
      fill(0, 0, 128);
      textSize(20);
      text(subtitle, 15, 120);
    }

    // knock a hole out of the middle
    push();
    fill(250, 250, 210);
    stroke(50);
    strokeWeight(4);
    ellipse(this.x, this.y, this.diameter * 0.45, this.diameter * 0.45);
    pop();

    push();
    fill(0);
    noStroke();
    textStyle(ITALIC);
    textSize(40);
    // text("Value", this.x, this.y - 30);

    let startAngle = 0;

    for (let j = 0; j < data.length; j++) {
      let stopAngle = data[j] * TWO_PI; // convert percent value to radians
      if (
        mouseDist > this.diameter * 0.225 && // check if mouse hovering over doughnut, more than inner ring
        mouseDist < this.diameter * 0.5
      ) {
        // check if mouse hovering over doughnut, less that outer ring

        if (mouseAngle > startAngle && mouseAngle < startAngle + stopAngle) {
          // check if mouse is hovering over current doughnut slice; mouseAngle in radians
          // versus the doughnut slices in radians
          push();
          fill(colours[j]);
          // rect(this.x - 50, this.y - 5, 100, 70)
          // fill(255);
          textAlign("center", "center");
          noStroke();
          textSize(40);
          text(int(data[j] * 100) + "%", this.x, this.y);
          pop();
        }
      }
      startAngle += stopAngle;
    }

    pop();
  }; // end draw

  this.makeLegendItem = function (label, i, colour) {
    let x = this.x + 80 + this.diameter / 2;
    let y = this.y + this.labelSpace * i - this.diameter / 4;
    let boxWidth = this.labelSpace / 2;
    let boxHeight = this.labelSpace / 2;

    noStroke();
    fill(colour);
    rect(x, y, boxWidth, boxHeight);

    fill(0);
    textAlign(LEFT, CENTER);
    textSize(18);
    // textWrap(WORD);
    text(label, x + boxWidth + 10, y + boxWidth / 2);
  }; // end legend items
} // end DoughnutChart
