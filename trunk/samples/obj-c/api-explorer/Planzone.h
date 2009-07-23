
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
#import "OAuthConsumer/OAuthConsumer.h"
#import "JSON.h"

#define WEB

#ifdef WEB
#define URL_REQ			@"http://ws.planzone.com"
#define URL_AUTH		@"http://ws.planzone.com"
#else
#define URL_REQ			@"http://ws.fr-gamay.org:8080"
#define URL_AUTH		@"https://ws.fr-gamay.org:8080"
#endif

#define DEFAULT_FORMAT	@"xml"


/**  This Class represents the Planzone object which allows the user to login to
  *  his Planzone, and makes some requests to the Planzone API. This Object contains 
  *  all elements needed to communicate with the API (request_token, access_token, consumer ...)
  */
@interface Planzone : NSObject {
	
	OAToken			*requestToken;
	OAToken			*accessToken;
	NSXMLDocument	*xml;
	OAConsumer		*consumer;
	NSString		*format;
	NSString		*jsonString;

}


- (void) getRequestToken;
- (void) oAuthLogin;
- (void) getAccessToken;
- (void) getListePlanzone;
- (void) getListeProjet;
- (void) getListeTodo;
- (void) setFormatXML;
- (void) setFormatJSON;


@property (nonatomic, retain) OAToken		*requestToken;
@property (nonatomic, retain) OAToken		*accessToken;
@property (nonatomic, retain) NSXMLDocument	*xml;
@property (nonatomic, retain) OAConsumer	*consumer;
@property (nonatomic, retain) NSString		*format;
@property (nonatomic, retain) NSString		*jsonString;


@end
