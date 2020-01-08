function sendSample(i, sampleData, sampleRange, sampleEmail){
  
  // Creates function that subtracts a number of days from a date.
  Date.prototype.minusDays = function(days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() - days);
  return date;
  }

  var today = new Date();
  var todayMinusSix = today.minusDays(6);
        
  var sampleDate = sampleData[i][0]; // Sample report request date.
       
  // Only send if today's date is 6 days after entry date.
  if (todayMinusSix > sampleDate) {
    
    var htmlEmail = HtmlService.createTemplateFromFile('sampleEmail');     
    var subject = '81cents Follow Up';
    var message = htmlEmail.evaluate().getContent();
          
    MailApp.sendEmail({
      to: sampleEmail, 
      subject: subject,
      htmlBody: message,
      name: 'Jordan Sale',
      cc: 'lisa@81cents.com',
      bcc: 'jordan@81cents.com'
    });
          
  // Mark as 'Sent'
  sampleData[i][6] = "Sent";
  }
}

function sampleFollowUp() {
  // Access the "Sample Report Signups" spreadsheet.
  var sampleSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sample Report Signups");
  var lastSampleRow = sampleSheet.getLastRow().toString();
  
  // Access the "Customer Dashboard" spreadsheet.
  var customerSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("REVAMPED Master Customer Intake form");
  var lastCustomerRow = customerSheet.getLastRow().toString();
  
  // Create 2D array for "Sample Report Signups".
  var sampleRange = sampleSheet.getRange("A2:J" + lastSampleRow);
  var sampleData = sampleRange.getValues();
  
  // Create 2D array for "Customer Dashboard".
  var customerRange = customerSheet.getRange("A2:B" + lastCustomerRow);
  var customerData = customerRange.getValues();
  
  // Loop to check the data in each "Sample Report Signup" row.
  for (var i in sampleData){

    // Get Sample Report email from column B.
    var sampleEmail = sampleData[i][1];
    
    // Loop to check Sample Report emails against REVAMPED Customer emails.
    for (var j in customerData){
      
      // Get REVAMPED Customer Intake Form emails from column A.
      var customerEmail = customerData[j][0];
      var emailSent = sampleData[i][6];
      
      // Compare the Sample Report Emails against the REVAMPED Customer emails
      if (customerEmail.toUpperCase() === sampleEmail.toUpperCase()){
        sampleData[i][6] = "Converted";
        sampleRange.setValues(sampleData);
      }
    }
      
    if (emailSent != "Sent" && emailSent != "Converted"){
      sendSample(i, sampleData, sampleRange, sampleEmail);
    }
  }
  sampleRange.setValues(sampleData); // Set values as "Sent" or "Converted".
}  