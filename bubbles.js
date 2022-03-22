function Bubbles() {
  // Name for the visualisation to appear in the menu bar.
  this.name = "Countries of the World Distributed By Covid Vaccination%";

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = "Bubbles";

  //   // Title to display above the plot.
  //   this.title = 'Bubbles';

  // Names for each axis.
  this.xAxisLabel = "year";
  this.yAxisLabel = "%";

  let marginSize = 35;

  // Layout object to store all common plot layout parameters and
  // methods.
  this.layout = {
    marginSize: marginSize,

    // Locations of margin positions. Left and bottom have double margin
    // size due to axis and tick labels.
    leftMargin: 130,
    rightMargin: width,
    topMargin: 30,
    bottomMargin: height,
    pad: 5,

    plotWidth: function () {
      return this.rightMargin - this.leftMargin;
    },

    plotHeight: function () {
      return this.bottomMargin - this.topMargin;
    },

    // Boolean to enable/disable background grid.
    grid: true,

    // Number of axis tick labels to draw so that they are not drawn on
    // top of one another.
    numXTickLabels: 10,
    numYTickLabels: 8,
  };

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function () {
    let self = this;
    this.data = loadTable(
      "./data/vaccines/vaccination4.csv",
      "csv",
      "header",
      // Callback function to set the value
      // this.loaded to true.
      function (table) {
        self.loaded = true;
      }
    );
  };

  this.bubbles = [];
  let maxAmt;
  this.years = [];
  this.yearButtons = [];

  this.setup = function () {
    console.log("setting up bubbles");
    //   createCanvas(1000, 1000);

    this.rows = this.data.getRows();
    this.numColumns = this.data.getColumnCount();
    //   console.log(this.numColumns);

    //    for (var i = 5; i < this.numColumns; i++) {
    //         var y = this.data.columns[i];
    //         this.years.push(y);
    //         this.buttons = createButton(y, y);
    //         // this.buttons.parent('years')
    //         this.buttons.mousePressed(function() {
    //             this.changeYear(this.elt.value);
    //         })
    //         this.yearButtons.push(this.buttons);
    //     }
    //     console.log(this.yearButtons);

    maxAmt = 0;
    for (let i = 0; i < this.rows.length; i++) {
      if (this.rows[i].get(0) != "") {
        let b = new Bubble(this.rows[i].get(0));
        for (let j = 1; j < this.numColumns; j++) {
          if (this.rows[i].get(j) != "") {
            let n = this.rows[i].getNum(j);
            if (n > maxAmt) {
              maxAmt = n; //keep a tally of the highest value
            }
            b.data.push(n);
          } else {
            b.data.push(0);
          }
        }
        this.bubbles.push(b);
      }
    }

    for (let i = 0; i < this.bubbles.length; i++) {
      this.bubbles[i].setData(0);
    }
  };

  this.changeYear = function (year) {
    let y = years.indexOf(year);

    for (let i = 0; i < this.bubbles.length; i++) {
      this.bubbles[i].setData(y);
    }
  };

  this.destroy = function () {
    this.bubbles = [];
    this.years = [];
    // this.yearButtons = [];
  };

  this.draw = function draw() {
    // background(100);

    noFill();
    noStroke();
    push();
    fill("blue");
    textSize(30);
    textAlign(LEFT);
    text("Countries of the World Distributed By Covid Vaccination %", 100, 50);
    pop();
    translate(width / 2, height / 2);
    for (let i = 0; i < this.bubbles.length; i++) {
      this.bubbles[i].update(this.bubbles);
      this.bubbles[i].draw();
    }
  };

  function Bubble(_name) {
    this.size = 20;
    this.target_size = 20;
    this.pos = createVector(0, 0);
    this.direction = createVector(0, 0);
    this.name = _name;
    this.color = color(255, 255, 255);
    this.data = [];

    //WHY IT DOES NOT WORK????
    this.hover = function (mouseX, mouseY) {
      //is the mouse over this bubble
      let hover = dist(mouseX, mouseY, this.pos.x, this.pos.y);
      console.log(hover);
      if (hover < this.size) return this.name;
      else return false;
    };

    this.draw = function () {
      push();
      noStroke();
      fill(this.color);
      ellipse(this.pos.x, this.pos.y, this.size);
      fill("blue");
      textSize(15);
      textAlign("center", "center");
      text(this.name, this.pos.x, this.pos.y);
      pop();
    };

    this.update = function (_bubbles) {
      this.direction.set(0, 0);
      for (let i = 0; i < _bubbles.length; i++) {
        if (_bubbles[i].name != this.name) {
          let v = p5.Vector.sub(this.pos, _bubbles[i].pos);
          let d = v.mag();

          if (d < this.size / 2 + _bubbles[i].size / 2) {
            if (d > 0) this.direction.add(v);
            else this.direction.add(p5.Vector.random2D());
          }
        }
      }
      this.direction.normalize();
      this.direction.mult(2);
      this.pos.add(this.direction);

      if (this.size < this.target_size) this.size += 1;
      else if (this.size > this.target_size) this.size -= 1;
    };

    this.setData = function (i) {
      this.target_size = map(this.data[i], 0, maxAmt, 20, 250);
    };
  }
}
