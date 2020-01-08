// Function sends the email from Jordan's account.
function sendSecondEmail(emailAddress, firstName) {
  var htmlEmail = HtmlService.createTemplateFromFile('secondEmailBody');
  htmlEmail.firstName = firstName;
  
  var message = htmlEmail.evaluate().getContent();
  var subject = '81cents follow-up';
  
   MailApp.sendEmail({
    to: emailAddress,
    subject: subject, 
    htmlBody: message,
    name: 'Jordan',
    cc: '@81cents.com, @81cents.com',
  });
}


// Function checks conditions for sending the customer follow-up.
function secondFollowup() {
  
  // Get the Customer Dashboard.
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Customer Dashboard"); 
  var lastRow = spreadsheet.getLastRow().toString();
  
  var startingRowNo = 3;
  var startingColNo = 2;
  var numRows = 1;
  var numCols = 12;
  
  // Creates a 2D array for columns B:M
  var range = spreadsheet.getRange(startingRowNo, startingColNo, numRows, numCols);
  var subgrid = range.getValues();

  // Creates a 2D array for column K to edit and copy back into the spreadsheet.
  var editRange = spreadsheet.getRange(startingRowNo, 12, numRows, 1);
  var editSubgrid = editRange.getValues();
  
  // Loop to check the data in each row.
  for (var i = 0; i < subgrid.length; i++) {
    
    var row = subgrid[i];
    
    var firstName = row[0]; // Column B
    var email = row[4]; // Column F
    
    // Identifying columns.
    var surveySentString = row[3]; // Column E
    var resultsCollectedString = row[6]; // Column H
    var firstEmailSent = row[9]; // Column K
    var secondEmailSent = row[10]; // Column L
    var thirdEmailSent = row[11]; // Column M
    
    // Testing conditions.
    var emailMatches = /\S+@\S+\.\S+/.test(email); // If column F has an email address.
    var isSurveySent = surveySentString === "Sent"; // If column E is "Sent".
    var areResultsCollected = resultsCollectedString.isBlank(); // If column H is blank.
    var wasFirstEmailSent = firstEmailSent === "Sent"; // If column K is "Sent". 
    var wasSecondEmailSent = secondEmailSent.isBlank(); // If column L is blank.
    var wasThirdEmailSent = thirdEmailSent.isBlank(); // If column M is blank.
    
    //If all the conditions match, then send the email.
    if (emailMatches && isSurveySent && areResultsCollected && wasFirstEmailSent && wasSecondEmailSent && wasThirdEmailSent) {
      sendSecondEmail(email, firstName);
      editSubgrid[i][0] = "Sent";
    }
  }
  
  // Marks spreadsheet column K "Sent" after all the emails are sent.
  editRange.setValues(editSubgrid);
}