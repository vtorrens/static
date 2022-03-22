function TechDiversityRace() {
  // Name for the visualisation to appear in the menu bar.
  this.name = "Tech Diversity: Race (Update with Two Companies Comparison)";

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = "tech-diversity-race";

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function () {
    let self = this;
    //load of data for first pie chart being compared
    this.data = loadTable(
      "./data/tech-diversity/race-2018.csv",
      "csv",
      "header",
      // Callback function to set the value
      // this.loaded to true.
      function (table) {
        self.loaded = true;
      }
    );
    //load of data for second pie chart being compared
    this.data1 = loadTable(
      "./data/tech-diversity/race-2018.csv",
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

    // Create a select DOM element.

    //First dropdown to select first company to compare. Added a class to style
    this.select = createSelect();
    this.select.position(350, 70);
    this.select.addClass("drop-down1");

    //Second dropdown to select second company to compare. Added a class to style
    this.select1 = createSelect();
    this.select1.position(800, 70);
    this.select1.addClass("drop-down1");

    // Fill the options with all company names. Two global variables, one for each company that will be selected to compare.
    let companies = this.data.columns;
    let companies1 = this.data1.columns;

    // First entry is empty.
    for (let i = 1; i < companies.length; i++) {
      this.select.option(companies[i]);
    }
    for (let i = 1; i < companies1.length; i++) {
      this.select1.option(companies1[i]);
    }
  };
  //Ensure that the function becomes unreachable. This will enable the function to be eligible for reclamation
  this.destroy = function () {
    this.select.remove();
    this.select1.remove();
  };

  // Create 2 new pie chart objects for the companies that user will compare.
  // Note that a separate constructor (PieChart) is leveraged that can be reused.
  this.pie = new PieChart(width / 3, height / 2, width * 0.4);
  this.pie1 = new PieChart(width / 1.3, height / 2, width * 0.4);

  //Tech-Diversity Race main draw function
  this.draw = function () {
    if (!this.loaded) {
      console.log("Data not yet loaded");
      return;
    }

    // Get the value of the company we're interested in from the
    // select item.
    let companyName = this.select.value();
    let companyName1 = this.select1.value();

    // Get the column of raw data for each one of the companies.
    let col = this.data.getColumn(companyName);
    let col1 = this.data1.getColumn(companyName1);

    // Convert all data strings to numbers.
    col = stringsToNumbers(col);
    col1 = stringsToNumbers(col1);

    // Copy the row labels from the table (the first item of each row).
    let labels = this.data.getColumn(0);
    let labels1 = this.data1.getColumn(0);

    // Colour to use for each category.
    let colours = ["blue", "red", "green", "pink", "purple", "yellow"];

    // Manage Titles and Subtitles.
    this.titlediversity =
      "Select Dropdowns to Compare Racial Diversity Between Companies";
    let piesubtitle = "Employee diversity at " + companyName; // subtitle pie 1
    let piesubtitle1 = "Employee diversity at " + companyName1; //subtitle pie 2

    // Draw the two pie charts!
    this.pie.draw(col, labels, colours, piesubtitle);
    this.pie1.draw(col1, labels1, colours, piesubtitle1);

    //Draw Main Title
    this.drawDiversitytitle();
  };
  // Function to draw main title
  this.drawDiversitytitle = function () {
    fill(0);
    noStroke();
    textAlign("center", "center");
    fill(0, 0, 128);
    textSize(30);
    text(this.titlediversity, 500, 30);
  };
}
