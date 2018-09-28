var PagerDuty = (function() {
  // Public members  
  var pagerduty = {};
  pagerduty.getData = getData;
  return pagerduty;
  
  // Private members
  function getData(forDate) {
    var since = getSinceDate(forDate);
    var until = getUntilDate(forDate);
    var limit = 100;
    var offset = 0;
    var count = 0;
    var items = [];
    
    while(true) {
      var result = executeQuery(getQuery(since, until, limit, offset));
      
      for (var i=0; i<result.incidents.length; i++) {
        items.push(result.incidents[i]);
        count++;
      }
      
      if (result.more) {
        offset += limit;
      } else {
        break;  
      }
    }
    
    return {
      count: count,
      items: items
    };
  }
  
  // Calls the API and returns a JSON result
  function executeQuery(query) {
    var options = {
      method: 'GET',
      muteHttpExceptions: true,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.pagerduty+json;version=2',
        'Authorization': 'Token token=' + Config.pagerduty.token
      }
    };
    var response = UrlFetchApp.fetch(Config.pagerduty.url + Config.pagerduty.paths.incidents + query, options);
    var json = response.getContentText();
    return JSON.parse(json);
  }
  
  // Returns the beginning of the time period we are interested in
  function getSinceDate(forDate) {
    var date = new Date(forDate);
    date.setHours(0,0,0,0);
    return date;
  }
  
  // Returns the end of the time period we are interested in
  function getUntilDate(forDate) {
    var date = addDays(new Date(forDate), 1);
    date.setHours(0,0,-1,0);
    return date;
  }
  
  // Returns a date object for the specified days in the past
  function addDays(fromDate, numberOfDays) {
    var newDate = fromDate;
    newDate.setDate(newDate.getDate() + numberOfDays);
    return newDate;
  }
  
  // Returns a formatted date in UTC
  // e.g. 2016-09-12T00:00:00
  function formatUtcDate(date) {
    return Utilities.formatDate(date, 'Etc/GMT', 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\'');
  }
  
  // Returns the URI query for the API request
  function getQuery(since, until, limit, offset) {
    var query = '';
    query += '?since=' + formatUtcDate(since);
    query += '&until=' + formatUtcDate(until);
    query += '&limit=' + limit;
    query += '&offset=' + offset;
    query += '&sort_by=created_at:ASC';
    query += '&time_zone=UTC';
    return query;
  }
})()
