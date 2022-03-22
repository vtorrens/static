function OnlineAttitudes() {
  // Name for the visualisation to appear in the menu bar.
  this.name = "Covid Pandemic Effects on Online Attitudes ";

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = "online-attitudes";

  // Property to represent whether data has been loaded.
  this.loaded = false;

  //Title

  this.title = "Covid Pandemic Effects on Attitudes Towards Online-Learning";

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function () {
    var self = this;
    data = loadTable(
      "./data/Online-attitudes/onlineAttitudes.csv",
      "csv",
      "header",
      // Callback function to set the value
      // this.loaded to true.
      function (table) {
        self.loaded = true;
      }
    );
  };

  this.setup = function () {
    if (!this.loaded) {
      console.log("Data not yet loaded");
      return;
    }
  };
  this.waffles = [];
  console.log(this.waffles);
  let waffle;

  this.setup = function setup() {
    attitudes = ["Before", "During", "After"];

    values = [
      "Will Never Do it",
      "Very Negative",
      "Negative",
      "Neutral",
      "Positive",
      "Very Positive",
    ];

    for (var i = 0; i < attitudes.length; i++) {
      if (i < 4)
        this.waffles.push(
          new Waffle(
            150 + i * 300,
            200,
            200,
            200,
            10,
            10,
            data,
            attitudes[i],
            values,
            attitudes[i]
          )
        );
      else {
        this.waffles.push(
          new Waffle(
            120 + (i - 4) * 220,
            240,
            200,
            200,
            10,
            10,
            data,
            attitudes[i],
            values
          )
        );
      }
    }
  };
  this.draw = function draw() {
    for (var i = 0; i < this.waffles.length; i++) {
      this.waffles[i].draw();
    }
    for (var i = 0; i < this.waffles.length; i++) {
      this.waffles[i].checkMouse(mouseX, mouseY);
      push();
      this.drawTitle();
      pop();
    }
    //    // Manage Titles.
    //    push();
    //    textSize(20);
    //    fill(0, 102, 153);
    //    text(this.title, 100, 50);
    //    pop();
  };

  this.drawTitle = function () {
    fill(0);
    noStroke();
    textAlign("center", "center");
    fill(0, 0, 128);
    textSize(30);
    text(this.title, 500, 50);
    text("Before Pandemic", 250, 170);
    text("During Pandemic", 550, 170);
    text("After Pandemic", 850, 170);
  };

  function Waffle(
    x,
    y,
    width,
    height,
    boxes_across,
    boxes_down,
    table,
    columnHeading,
    possibleValues
  ) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.boxes_down = boxes_down;
    this.boxes_across = boxes_across;

    this.column = table.getColumn(columnHeading);

    this.possibleValues = possibleValues;

    this.categories = [];
    this.boxes = [];

    this.categoryLocation = function (categoryName) {
      for (var i = 0; i < this.categories.length; i++) {
        if (categoryName == this.categories[i].name) {
          return i;
        }
      }
      return -1;
    };

    this.addCategories = function () {
      var colours = ["red", "green", "blue", "purple", "yellow", "orange"];

      for (var i = 0; i < possibleValues.length; i++) {
        this.categories.push({
          name: possibleValues[i],
          count: 0,
          colour: colours[i % colours.length],
        });
      }
      for (var i = 0; i < this.column.length; i++) {
        var catLocation = this.categoryLocation(this.column[i]);

        if (catLocation != -1) {
          this.categories[catLocation].count++;
        }
      }
      //iterate over the categories and add proportions

      for (var i = 0; i < this.categories.length; i++) {
        this.categories[i].boxes = round(
          (this.categories[i].count / this.column.length) *
            (this.boxes_down * this.boxes_across)
        );
      }
    };
    this.addBoxes = function () {
      var currentCategory = 0;
      var currentCategoryBox = 0;

      var boxWidth = this.width / this.boxes_across;
      var boxHeight = this.height / this.boxes_down;

      for (var i = 0; i < this.boxes_down; i++) {
        this.boxes.push([]);
        for (var j = 0; j < this.boxes_across; j++) {
          if (currentCategoryBox == this.categories[currentCategory].boxes) {
            currentCategoryBox = 0;
            currentCategory++;
          }

          this.boxes[i].push(
            new Box(
              this.x + j * boxWidth,
              this.y + i * boxHeight,
              boxWidth,
              boxHeight,
              this.categories[currentCategory]
            )
          );
          currentCategoryBox++;
        }
      }
    };
    // add categories
    this.addCategories();
    this.addBoxes();

    this.draw = function () {
      //draw waffle diagram and title
      for (var i = 0; i < this.boxes.length; i++) {
        for (var j = 0; j < this.boxes[i].length; j++) {
          if (this.boxes[i][j].category != undefined) {
            this.boxes[i][j].draw();
          }
        }
      }
    };
    this.checkMouse = function (mouseX, mouseY) {
      for (var i = 0; i < this.boxes.length; i++) {
        for (var j = 0; j < this.boxes[i].length; j++) {
          if (this.boxes[i][j].category != undefined) {
            var mouseOver = this.boxes[i][j].mouseOver(mouseX, mouseY);
            if (mouseOver != false) {
              push();
              fill(0);
              textSize(20);
              var tWidth = textWidth(mouseOver);
              textAlign(LEFT, TOP);
              rect(mouseX, mouseY, tWidth + 20, 40);
              fill(255);
              text(mouseOver, mouseX + 10, mouseY);
              pop();
              break;
            }
          }
        }
      }
    };
  }
}
