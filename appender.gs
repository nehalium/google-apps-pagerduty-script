// Global constants
var SHEET_DATA = "Data";

var Appender = (function() {
  // Public members  
  var appender = {};
  appender.append = append;
  return appender;
  
  // Private members
  function append(items) {
    var values = buildTable(items);
    var sheet = getSheetReference(SHEET_DATA);
    for (var i=0; i<values.length; i++) {
      sheet.appendRow(values[i]);
    }
  }
  
  // Returns a table based on the items in the payload
  function buildTable(items) {
    var values = [];
    var row = [];
    var timeStamp = getTimestamp();
    for (var i=0; i<items.length; i++) {
      row = [];
      row.push(items[i].incident_number); // #
      row.push(items[i].service.summary); // Service
      row.push(convertToLocalTime(items[i].created_at));
      if (items[i].status == 'resolved') {
        // Resolved On
        row.push(convertToLocalTime(items[i].last_status_change_at));
        // Resolved By
        if (items[i].last_status_change_by.id !== items[i].service.id) {
          row.push(items[i].last_status_change_by.summary);
        } else {
          row.push('');
        }
        // Duration
        row.push(dateDiff(items[i].created_at, items[i].last_status_change_at));
      } else {
        row.push('Not Resolved'); // Resolved On
        row.push(''); // Resolved By
        row.push(''); // Duration
      }
      row.push(''); // # Escalations
      row.push(items[i].urgency); // Urgency
      row.push(items[i].id); // ID
      row.push(items[i].html_url); // URL
      row.push(items[i].status); // Status
      row.push(items[i].alert_counts.triggered); // Alerts Triggered
      row.push(items[i].alert_counts.resolved); // Alerts Resolved
      row.push(timeStamp); // Timestamp
      values.push(row);
    }
    return values;
  }
  
  // Returns the difference in seconds between two dates
  function dateDiff(date1, date2) {
    var time1 = new Date(date1).getTime();
    var time2 = new Date(date2).getTime();
    return parseInt((time2 - time1) / 1000);
  }
  
  // Returns a date in local time
  function convertToLocalTime(date) {
    return formatLocalDate(new Date(date));
  }
  
  // Returns a formatted date in local time
  // e.g. 2016-09-12T00:00:00
  function formatLocalDate(date) {
    return Utilities.formatDate(date, getLocalTimeZone(), 'yyyy-MM-dd\'T\'HH:mm:ss.SSS');
  }
  
  function getLocalTimeZone() {
    return SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone();
  }
  
  // Returns a timestamp
  function getTimestamp() {
    return Utilities.formatDate(new Date(), 'Etc/GMT', 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\'')
  }
  
  // Returns a reference to the specified sheet
  function getSheetReference(sheetName) {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    return spreadsheet.getSheetByName(sheetName);
  }
})()