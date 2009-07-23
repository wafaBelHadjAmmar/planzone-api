
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

#import "Planzone.h"


@implementation Planzone


@synthesize requestToken;
@synthesize accessToken;
@synthesize xml;
@synthesize consumer;
@synthesize format;
@synthesize jsonString;


/**  This operation gets a request token as explained in the OAuth specification 
  *  section 6.1.1. Consumer Obtains a Request Token. This is the first phase of the authentication process.
  *  You will need to the application key and the application secret key. 
  */
- (void) getRequestToken{ 
	
	if (!consumer) {
		consumer = [[OAConsumer alloc] initWithKey:@"put_your_application_Key_here"
                                            secret:@"and_your secret_key_here"];
															
	}
	
	NSURL *url = [NSURL URLWithString:[[NSString alloc] initWithFormat:@"%@/v1/oauth/request_token",URL_REQ]];
   
	OAMutableURLRequest *request = [[OAMutableURLRequest alloc] initWithURL:url
                                                                   consumer:consumer
                                                                      token:nil   // we don't have a Token yet
                                                                      realm:nil   // our service provider doesn't specify a realm
                                                          signatureProvider:nil]; // use the default method, HMAC-SHA1
    [request setHTTPMethod:@"POST"];
	
    OADataFetcher *fetcher = [[OADataFetcher alloc] init];
	
    [fetcher fetchDataWithRequest:request
                         delegate:self
                didFinishSelector:@selector(requestTokenTicket:didFinishWithData:)
                  didFailSelector:@selector(requestTokenTicket:didFailWithError:)];
	
}


/**  This operation is called when the request_token has been correctly received.
  *  The operation saves it and calls the Login operation.
  */
- (void) requestTokenTicket:(OAServiceTicket *)ticket didFinishWithData:(NSData *)data {
	
	if (ticket.didSucceed) {
		
		NSString *responseBody = [[NSString alloc] initWithData:data
													   encoding:NSUTF8StringEncoding];
		
		requestToken = [[OAToken alloc] initWithHTTPResponseBody:responseBody];
		
		NSLog([[NSString alloc] initWithFormat:@"REQUEST_TOKEN RECEIVED : %@ & %@",requestToken.key,requestToken.secret]);
		
		[self oAuthLogin];

	}
}


/**  This operation is called when the request_token has not been received.
  */
- (void) requestTokenTicket:(OAServiceTicket *)ticket didFailWithError:(NSError *)error {
	
	NSLog(@"	Error: REQUEST_TOKEN FAILED");
}


/**  This operation allows the user to input his login and password on his default browser 
  */
- (void) oAuthLogin { 
	
	NSString * token = [requestToken key];
	
	NSString * fullURL = [[NSString alloc] initWithFormat:@"%@/pz/login/oAuthAuthorize.jsf?oauth_token=%@",URL_AUTH,token];
	
	NSURL *url = [NSURL URLWithString:fullURL];
	
	[[NSWorkspace sharedWorkspace] openURL:url];
	
}


/**	 This operation gets an access token from a request token as explained in the OAuth specification 
  *	 section 6.3.Obtaining an Access Token. This is the last phase of the authentication process. 
  *  You will need to the application key, the application secret key, the request token,
  *	 the token secret and the user must have granted access to your application. 
  */
- (void) getAccessToken{ 
	
	NSURL *url = [NSURL URLWithString:[[NSString alloc] initWithFormat:@"%@/v1/oauth/access_token",URL_REQ]];
	
	OAMutableURLRequest *request2 = [[OAMutableURLRequest alloc] initWithURL:url
																	consumer:consumer
																	   token:requestToken
																	   realm:nil   // our service provider doesn't specify a realm
														   signatureProvider:nil];  // use the default method, HMAC-SHA1
	
    [request2 setHTTPMethod:@"POST"];
	
    OADataFetcher *fetcher = [[OADataFetcher alloc] init];
	
    [fetcher fetchDataWithRequest:request2
                         delegate:self
                didFinishSelector:@selector(accessTokenTicket:didFinishWithData:)
                  didFailSelector:@selector(accessTokenTicket:didFailWithError:)];

}


/**  This operation is called when the access_token has been correctly received.
  *  The operation saves it.
  */
- (void) accessTokenTicket:(OAServiceTicket *)ticket didFinishWithData:(NSData *)data {
	
	NSString *responseBody = [[NSString alloc] initWithData:data
												   encoding:NSUTF8StringEncoding];
	
	accessToken = [[OAToken alloc] initWithHTTPResponseBody:responseBody];
	
	NSLog([[NSString alloc] initWithFormat:@"ACCESS_TOKEN RECEIVED : %@ & %@",accessToken.key,accessToken.secret]);
	
}


/**  This operation is called when the acess_token has not been received.
  */
- (void)accessTokenTicket:(OAServiceTicket *)ticket didFailWithError:(NSError *)error {
		
	NSLog([[NSString alloc] initWithFormat:@"	Error ACCESS_TOKEN failed  "]);
	
}


/**  This operation is called to get the Planzone list of the user.
  *  The operation makes a request to the Planzone API.
  */
- (void) getListePlanzone  { 

	if (!format) {
		format= DEFAULT_FORMAT;
	}
			
	NSURL *url = [NSURL URLWithString:[[NSString alloc] initWithFormat:@"%@/v1/rest/planzones?format=%@",URL_REQ,format]];
	
    OAMutableURLRequest *request = [[OAMutableURLRequest alloc] initWithURL:url
                                                                   consumer:consumer
                                                                      token:accessToken
                                                                      realm:nil
                                                          signatureProvider:nil];
	    
	[request setHTTPMethod:@"GET"];
    
    OADataFetcher *fetcher = [[OADataFetcher alloc] init];
	
    [fetcher fetchDataWithRequest:request
						delegate:self
						didFinishSelector:@selector(apiTicket:didFinishWithData:)
						didFailSelector:@selector(apiTicket:didFailWithError:)];
	
}


/**  This operation is called when the application has received a result.
  *  It also can be the Todo list or the Project list or anything else.
  *  The operation saves the received data in XML variable or JSON variable,
  *  it depends of the request parameters
  */
- (void)apiTicket:(OAServiceTicket *)ticket didFinishWithData:(NSData *)data {
	
	NSString *responseBody = [[NSString alloc] initWithData:data
												   encoding:NSUTF8StringEncoding];
	NSString *buff;
	
	if (format==@"xml") {
		
		NSUInteger * mask;
		
		NSError ** error;
		
		xml=[[NSXMLDocument alloc] initWithXMLString:(NSString *) responseBody options:(NSUInteger)mask error:(NSError **)error];
		
		buff=[xml XMLStringWithOptions: NSXMLNodePrettyPrint];
	}
	
	if (format==@"json") {
	
		jsonString= [[NSString alloc] initWithString:(NSString *)responseBody];
		buff=jsonString;
	}
	
}


/**  This operation is called when data has not been received after a request to the Planzone API.
  */
- (void) apiTicket:(OAServiceTicket *)ticket didFailWithError:(NSError *)error {
	
	NSLog(@"	Error API_CALL failed ");	
}


/**  This operation is called to get the Project list of the user.
  *  The operation makes a request to the Planzone API.
  */
- (void) getListeProjet { 
	
	if (!format) {
		format= DEFAULT_FORMAT;
	}
	
	NSURL *url = [NSURL URLWithString:[[NSString alloc] initWithFormat:@"%@/v1/rest/projects?format=%@",URL_REQ,format]];
	
    OAMutableURLRequest *request = [[OAMutableURLRequest alloc] initWithURL:url
                                                                   consumer:consumer
                                                                      token:accessToken
                                                                      realm:nil
                                                          signatureProvider:nil];
	
	[request setHTTPMethod:@"GET"];
    
    OADataFetcher *fetcher = [[OADataFetcher alloc] init];
	
    [fetcher fetchDataWithRequest:request
						 delegate:self
				didFinishSelector:@selector(apiTicket:didFinishWithData:)
				  didFailSelector:@selector(apiTicket:didFailWithError:)];
	
}


/**  This operation is called to get the Todo list of the user.
  *  The operation makes a request to the Planzone API.
  */
- (void) getListeTodo { 
	
	if(!format) {
		format= DEFAULT_FORMAT;
	}
	
	NSURL *url = [NSURL URLWithString:[[NSString alloc] initWithFormat:@"%@/v1/rest/todos?format=%@",URL_REQ,format]];
	
    OAMutableURLRequest *request = [[OAMutableURLRequest alloc] initWithURL:url
                                                                   consumer:consumer
                                                                      token:accessToken
                                                                      realm:nil
                                                          signatureProvider:nil];
	
	[request setHTTPMethod:@"GET"];
    
    OADataFetcher *fetcher = [[OADataFetcher alloc] init];
	
    [fetcher fetchDataWithRequest:request
						 delegate:self
				didFinishSelector:@selector(apiTicket:didFinishWithData:)
				  didFailSelector:@selector(apiTicket:didFailWithError:)];
	
}


/**  This operation is used to set the received data format as JSON
  */
- (void) setFormatJSON {
	
	format = @"json";
	
}


/**  This operation is used to set the received data format as XML
 */
- (void) setFormatXML {
	
	format = @"xml";
	
}


@end
