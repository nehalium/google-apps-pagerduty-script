// Main entry point of the application
function main() { 
  load(getReportDateFrom(1));
}

// Run for specific date
function catchUp() {
  load(new Date('2018-09-25'));
}

// Gets data from API and loads it into spreadsheet
function load(date) {
  var data = PagerDuty.getData(date);
  Appender.append(data.items);
}

// Returns the date for the current run
function getReportDateFrom(daysPast) {
  var reportDate = new Date();
  reportDate.setDate(reportDate.getDate() - daysPast);
  return reportDate;
}

