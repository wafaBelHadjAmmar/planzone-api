
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


#import <Cocoa/Cocoa.h>
#import "Planzone.h"

@class WebView;
@class WebFrame;


@interface MyView : NSObject {
	
	IBOutlet NSButton		*btnPrinc;
    IBOutlet NSWindow		*mainWindow;
    IBOutlet NSButton		*btnQuitPanel;
    IBOutlet NSButton		*btnList;
    IBOutlet NSButton		*btnListPlanzone;
    IBOutlet NSButton		*btnListProjet;
    IBOutlet NSButton		*btnListTodo;
	IBOutlet NSTextView		*TextView;
	IBOutlet NSMatrix		*RadioFormat;
	Planzone				*PlanzoneObj;

}


- (IBAction) login:(id)sender;
- (IBAction) exitApplication:(id)sender;
- (IBAction) liste:(id)sender;
- (IBAction) listePlanzone:(id)sender;
- (IBAction) listeProjet:(id)sender;
- (IBAction) listeTodo:(id)sender;
- (IBAction) setFormatJSON:(id)sender;
- (IBAction) setFormatXML:(id)sender;
- (void) showResult;


@property (nonatomic, retain) NSButton		*btnPrinc;
@property (nonatomic, retain) NSButton		*btnList;
@property (nonatomic, retain) NSButton		*btnListPlanzone;
@property (nonatomic, retain) NSButton		*btnListProjet;
@property (nonatomic, retain) NSButton		*btnListTodo;
@property (nonatomic, retain) NSWindow		*mainWindow;
@property (nonatomic, retain) NSButton		*btnQuitPanel;
@property (nonatomic, retain) NSTextView	*TextView;
@property (nonatomic, retain) NSMatrix		*RadioFormat;


@end
