function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

function retrieveUserRecord(firstname, lastname) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheets()[0];
  var dataArray = sheet.getDataRange().getValues(); 
  
  for(var i = 0; i < dataArray.length;i++){
    if(dataArray[i][0]) {
      Logger.log(dataArray[i][0].toLowerCase());
      Logger.log(dataArray[i][1].toLowerCase());;
      if(dataArray[i][0].toLowerCase() == lastname.toLowerCase() && dataArray[i][1].toLowerCase() == firstname.toLowerCase()) {
        dataArray[i].push(i);
        
        /* If you try to return a date object, it returns null :( */
        dataArray[i][3] = "";
        
        return dataArray[i];
      }
    }
  }
}

function doPost (e) {
  
  /*
  Gets a lock that prevents any user from concurrently running a section of code. A code section
  guarded by a script lock cannot be executed simultaneously regardless of the identity of the user.
  https://developers.google.com/apps-script/reference/lock/lock-service#getScriptLock()
  */
  var lock = LockService.getScriptLock()

  /*
  Attempts to acquire the lock, timing out with an exception after the provided number of milliseconds.
  This method is the same as tryLock(timeoutInMillis) except that it throws an exception when the lock
  could not be acquired instead of returning false.
  https://developers.google.com/apps-script/reference/lock/lock#waitLock(Integer)
  */
  lock.waitLock(10000)

  try {

    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

    var sheet = spreadsheet.getSheets()[0];
    var lastcolumn = sheet.getLastColumn();
    
    /*
    Returns the range with the top left cell at the given coordinates, and with the given number of rows.
    https://developers.google.com/apps-script/reference/spreadsheet/sheet#getRange(Integer,Integer)
    Then returns the position of the last column that has content.
    https://developers.google.com/apps-script/reference/spreadsheet/sheet#getlastcolumn
    Then returns the rectangular grid of values for this range (a two-dimensional array of values, indexed by row, then by column.)
    https://developers.google.com/apps-script/reference/spreadsheet/range#getValues()
    */
    var headers = sheet.getRange(1, 1, 1, lastcolumn).getValues()[0]
    
    // Gets the last row and then adds one
    var nextRow = sheet.getLastRow() + 1

    /*
    Maps the headers array to a new array. If a header's value is 'timestamp' then it
    returns a new Date() object, otherwise it returns the value of the matching URL parameter
    https://developers.google.com/apps-script/guides/web
    
    This only deals with user information other than attendance.
    */
    var newRow = headers.map(function(header) {
      if (!(header === 'timestamp') && e.parameter[header] == null) {
        return '';
      }
      return header === 'timestamp' ? new Date() : e.parameter[header]
    })
    
    /* 
    Get a json-ified list of empty strings and trues, denoting which of the previous events this person has signed in.
    Convert the last part of newRow (currently empty strings) to match the list.
    */
    if (e.parameter['datesattended'] && e.parameter['datesattended'] != '') {
      datesArray = JSON.parse(e.parameter['datesattended'])
      Array.prototype.splice.apply(newRow, [newRow.length-datesArray.length, newRow.length].concat(datesArray));
    }
    
    /* Get today's date */
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getDate();
    var year = dateObj.getUTCFullYear();
    var todaystring = String(year) + "/" + String(month) + "/" + String(day);
    
    /* Check to see if today isn't yet one of the headers. */
    if (headers.indexOf(todaystring) == -1) {
      /* Add it to the headers on the actual spreadsheet as a new column. */
      sheet.getRange(1, lastcolumn + 1).setValue(todaystring);
      newRow.push(true);
    } else {
      newRow[newRow.length - 1] = true;
    }

    /*
    Gets a range from the next row to the end row based on how many items are in newRow
    then sets the new values of the whole array at once.
    https://developers.google.com/apps-script/reference/spreadsheet/range#setValues(Object)
    */
    
    if (isNaN(e.parameter['row'])) {
      sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);
    } else {
      var newrange = sheet.getRange(parseInt(e.parameter['row'])+1, 1, 1, newRow.length);
      Logger.log(newrange.getA1Notation());
      newrange.setValues([newRow]);
    }

    return HtmlService.createHtmlOutputFromFile('index')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
    /*
    Return success results as JSON
    https://developers.google.com/apps-script/reference/content/content-service
    */
//    return ContentService
//    .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow, 'day': todaystring}))
//      .setMimeType(ContentService.MimeType.JSON)
  }

  /*
  Return error results as JSON
  https://developers.google.com/apps-script/reference/content/content-service
  */
  catch (e) {
    Logger.log(e);
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
      .setMimeType(ContentService.MimeType.JSON)
  }

  finally {
    /*
    Releases the lock, allowing other processes waiting on the lock to continue.
    https://developers.google.com/apps-script/reference/lock/lock#releaseLock()
    */
    lock.releaseLock()
  }
}

function test_doPost() {
  
  var testSet = [ {'surname':'y', 'firstname':'test'} ];
  
  for (var test in testSet) {
    Logger.log('Test ' + test + ' = ' + doPost(testSet[test]));
  }
}
