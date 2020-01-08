// Function sends the email from Jordan's account.
function sendDiscountEmail(emailAddress, firstName){
	var htmlEmail = HtmlService.createTemplateFromFile('discountEmail');
	htmlEmail.firstName = firstName;
				
	var message = htmlEmail.evaluate().getContent();
	var subject = '81cents Thank You Discount';
	
	MailApp.sendEmail({
		to: emailAddress,
		subject: subject, 
		htmlBody: message,
		name: 'Jordan',
		cc: '@81cents.com',
		bcc: '@81cents.com'
	});
}


// Function to check conditions for sending the email.
function customerDiscount(){
	
	// Get the Customer Dashboard.
	var spreadsheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Customer Dashboard"); 
	var lastRow = spreadsheet.getLastRow();
	
	var startingRowNo = 3;
	var startingColNo = 2; // B column
	var numRows = lastRow;
	var numCols = 9;
	
	// Creates a 2D array for columns B:J
	var range = spreadsheet.getRange(startingRowNo, startingColNo, numRows, numCols);
	var subgrid = range.getValues();
	
	// Creates a 2D array for column J to edit and copy back into the spreadsheet.
	var editRange = spreadsheet.getRange(startingRowNo, 10, numRows, 1); 
	var editSubgrid = editRange.getValues();
	
	// Loop to check the data in each row.
	for (var i = 0; i < subgrid.length; i++) {
			
		var row = subgrid[i];
		
			var email = row[4];
			var firstName = row[0];
									
			var resultsCollectedString = row[6];
			var emailSentString = row[8];

			var emailMatches = /\S+@\S+\.\S+/.test(email);
			var areResultsCollected = resultsCollectedString === "Yes" || resultsCollectedString === "Y";
			var wasEmailSentAlready = emailSentString === "Sent";

		// If all the conditions match, then send the email.
			if (emailMatches && areResultsCollected && !wasEmailSentAlready) {
				sendDiscountEmail(email, firstName);
				editSubgrid[i][0] = "Sent";
			} 
	}
	
	// Marks the spreadsheet 'Sent' after all emails send.
	editRange.setValues(editSubgrid);
}