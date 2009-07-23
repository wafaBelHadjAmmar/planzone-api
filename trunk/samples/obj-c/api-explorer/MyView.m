
/*
 Copyright (c) 2009 Planzone. All rights reserved.
 Created by Imade LAKHLIFI on 7/21/09.
 
 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:
 
 * Redistributions of source code must retain the above copyright notice, this
 list of conditions and the following disclaimer.
 
 * Redistributions in binary form must reproduce the above copyright notice,
 this list of conditions and the following disclaimer in the documentation
 and/or other materials provided with the distribution.
 
 * Neither the name of the author nor the names of its contributors may be used
 to endorse or promote products derived from this software without specific
 prior written permission.
 
 */

#import "MyView.h"


@implementation MyView


@synthesize btnPrinc;
@synthesize btnList;
@synthesize btnListPlanzone;
@synthesize btnListProjet;
@synthesize btnListTodo;
@synthesize btnQuitPanel;
@synthesize mainWindow;
@synthesize TextView;
@synthesize RadioFormat;


/**  This operation is called when the user press the authentification button,
  *  it creates a Planzone object and calls the 'getRequestToken' operation.
  */
- (IBAction) login:(id)sender {
	
	PlanzoneObj = [[Planzone alloc]init];
	
	[PlanzoneObj getRequestToken];
 
	[btnList setHidden:(NO)];
	
	[btnPrinc setEnabled:(NO)];

	
}


/**  This operation is called when the user press the 'access to the Planzone API',
  *  it calls the 'getAccessToken' operation, to allow the user to make request to the Planzone API.
  */
- (IBAction) liste:(id)sender{
	
	if (!PlanzoneObj.accessToken) {
		[PlanzoneObj getAccessToken];
	}
	 
	[btnListPlanzone setHidden:(NO)];
	
	[btnListProjet setHidden:(NO)];
	
	[btnListTodo setHidden:(NO)];
	
	[RadioFormat setHidden:(NO)];
		
}


/**  This operation is called when the user press the 'Planzone list' button,
  *  it calls the 'getListePlanzone' operation, and show the result.
  */
- (IBAction) listePlanzone:(id)sender {

	[PlanzoneObj getListePlanzone];
	
	[self showResult];
    
}


/**  This operation is called when the user press the 'Projet list' button,
 *  it calls the 'getListePrpjet' operation, and show the result.
 */
- (IBAction) listeProjet:(id)sender {

	[PlanzoneObj getListeProjet];
	
	[self showResult];
    
}


/**  This operation is called when the user press the 'Todo list' button,
 *  it calls the 'getListeTodo' operation, and show the result.
 */
- (IBAction) listeTodo:(id)sender {
	
	[PlanzoneObj getListeTodo];
	
	[self showResult];
	
}


/**  This operation is called when the user checks the JSON radioButton,
  *  it calls the 'setFormatJSON' operation
  */
- (IBAction) setFormatJSON:(id)sender {
	
	[PlanzoneObj setFormatJSON];
	
}


/**  This operation is called when the user checks the XML radioButton,
 *  it calls the 'setFormatXML' operation
 */
- (IBAction) setFormatXML:(id)sender {
	
	[PlanzoneObj setFormatXML];
	
}


/**  This operation show received data on the TextView
  */
- (void) showResult {
	
	NSString *buff;
	
	if (PlanzoneObj.format==@"xml") {
		buff=[PlanzoneObj.xml XMLStringWithOptions: NSXMLNodePrettyPrint];
	}
	
	if (PlanzoneObj.format==@"json") {
		buff=PlanzoneObj.jsonString;
	}
	
	[TextView setString:@""];
	
	[TextView setString:buff];
		
}


/**  This operation is called when the user press the 'Quit' button, it exits the application properly.
  */
- (IBAction) exitApplication:(id)sender {
	
	[PlanzoneObj release];
	
	[[NSApplication sharedApplication] terminate:self];
	
}


@end
