// **********************************************************************************************************************
//
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
//
// File:            Function_HTTP.js
// Created:         16/02/2011
// Author:          Mike
// Project:         HTML5
// Description:
//
// **********************************************************************************************************************

// ASYNC_WEB_STATUS_LOADING=1,

// #############################################################################################
/// Function:<summary>
///             Common onload routine for GET/POST
///          </summary>
// #############################################################################################
function HTTP_onload(_xmlhttp, _pFile) {

    if ((_xmlhttp.status < 200) || (_xmlhttp.status >= 300))
	{
		_pFile.m_Status = ASYNC_WEB_STATUS_ERROR;
		_pFile.m_Data = "";
	}
	else {
	    _pFile.m_Status = ASYNC_WEB_STATUS_LOADED;
	    try {
	        // If the responseType was changed to 'arraybuffer' this assignment will fail and trigger an exception
	        _pFile.m_Data = _xmlhttp.responseText;
	    }
	    catch (e) {
	        _pFile.m_Data = "";
	    }
	}
}

// #############################################################################################
/// Function:<summary>
///          	Handle updates for an xmlrequest that's in flight
///          </summary>
///
/// In:		<param name="_xmlhttp"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function HTTP_ReadyStateChange( _xmlhttp, _onload ) {

	if (_xmlhttp.readyState != 4) return;

	var pFile = AsyncAlloc_pop(_xmlhttp);
	if (pFile)
	{
	    // Do common work with the pFile
		pFile.m_http_status = _xmlhttp.status;
		pFile.m_Complete = true;

	    // Turn response headers into a ds_map
		pFile.m_ResponseHeadersMap = ds_map_create();
		var kvps = _xmlhttp.getAllResponseHeaders().split("\r\n");
		for (var n in kvps) {
		    if (!kvps.hasOwnProperty(n)) continue;
		
		    var kvp = kvps[n].split(": ");
		    if (kvp.length == 2) {
		        ds_map_add(pFile.m_ResponseHeadersMap, kvp[0], kvp[1]);
		    }
		}
		
		// Do any other request type specific work		
		if (_onload) { 
		    _onload(_xmlhttp, pFile); 
		}
	}
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function FailAsyncHTTPRequest(_url) {

    // In situations where an http request (of any form) has failed without ever making
    // a request we still need to tell the user it failed miserably, so just fake a response    
    var xmlObj = {};
    g_pASyncManager.Add(g_AsyncPutGetID, _url, ASYNC_WEB, xmlObj);
    
    setTimeout(function () {
        var pFile = AsyncAlloc_pop(xmlObj);
        if (pFile) {
            pFile.m_http_status = 404;
		    pFile.m_Complete = true;
		    pFile.m_Status = ASYNC_WEB_STATUS_ERROR;
		    pFile.m_Data = "";
        }
    }, 500);
    
    return g_AsyncPutGetID++;
}

// #############################################################################################
/// Function:<summary>
///          	Common GET/POST code
///          </summary>
///
/// In:		<param name="_type">'GET' or 'POST'</param>
///			<param name="_url"></param>
///			<param name="_params">Parameters to send in POST ('' in GET)</param>
///			<param name="_onload">Additional callback for the xmlhttprequest onload</param>
///			<param name="_responseType">Response type of the data (e.g. 'arraybuffer' for binary)</param>
/// Out:	<returns>
///
///			</returns>
// #############################################################################################
function DoAsyncHTTPRequest(_type, _url, _headers, _params, _onload, _responseType) {

	try
	{
	    // Determine how to handle performing the request
	    var requestSettings = GetHTTPRequestSettings(_url, _headers);
	    g_pASyncManager.Add(g_AsyncPutGetID, _url, ASYNC_WEB, requestSettings.xmlhttp);
	    
	    // Override the normal response type for the xmlhttp request if being asked to
	    if (_responseType !== undefined) {
	        requestSettings.xmlhttp.responseType = _responseType;
	    }
	    
	    // Branch according to the actual type of the xmlhttp object that was created
		if (requestSettings.ie9) {
		    DoIE9AsyncHTTPRequest(_type, _url, _headers, _params, requestSettings.xmlhttp, requestSettings.xdomain, _onload);
		}
		else {
		    DoStdAsyncHTTPRequest(_type, _url, _headers, _params, requestSettings.xmlhttp, _onload);
		}
	}
    catch (e) {    
        return FailAsyncHTTPRequest(_url);
	}

	return g_AsyncPutGetID++;
}

// #############################################################################################
/// Function:<summary>
///          	Work out the setup for doing an HTTP request, whether or not we're using
///             XMLHttpRequest, XDomainRequest or an ActiveXObject
///          </summary>
// #############################################################################################
function GetHTTPRequestSettings(_url, _headers) {

    // Setup the object to return
    var requestSettings = {
        xmlhttp: null,
        xdomain: true,
        ie9: false
    };

	// Work out if we're cross domain or not...
	if ((_url.substring(0, 7) != "http://") && (_url.substring(0, 8) != "https://")) {
		requestSettings.xdomain = false;
	}
	else {
	    var dom = "";
	    if (_url.substring(0, 7) == "http://") {
	        dom = _url.substring(7);
	    }
	    if (_url.substring(0, 8) == "https://") {
	        dom = _url.substring(8);
	    }
		if (dom.substring(0, document.domain.length) == document.domain) {
			requestSettings.xdomain = false;
		}
	}

	if ((requestSettings.xdomain) && (window.XDomainRequest))
	{
		requestSettings.xmlhttp = new XDomainRequest();		
		requestSettings.xdomain = true;
		requestSettings.ie9 = true;
	}
	else
	{
		if (window.XMLHttpRequest)
		{
			requestSettings.xmlhttp = new XMLHttpRequest();
			requestSettings.xdomain = false;
			requestSettings.ie9 = (g_OSBrowser == BROWSER_IE) && (yyBrowserDetect.browser_version <= 9.0);
		}
		else if (window.ActiveXObject)
		{
			if (new ActiveXObject("Microsoft.XMLHTTP"))
			{
				requestSettings.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			}
			else
			{
				requestSettings.xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
			}
		}
		
		/* Enable credentials (i.e. cookies) for requests when enabled using the GML
		 * http_set_request_crossorigin() function.
		 *
		 * This has to be an opt-in because if you enable credentials for a request and the
		 * response doesn't include *exactly* the right blend of CORS headers the browser wants,
		 * the browser will tell us the request failed and not give us the payload, probably
		 * breaking things for lots of people who don't need cookies.
		*/
		if(g_HttpRequestCrossOriginType === "use-credentials")
		{
			requestSettings.xmlhttp.withCredentials = true;
		}
	}
	return requestSettings;
}

// #############################################################################################
/// Function:<summary>
///          	Handle non-IE9 HTTP requests on IE9
///          </summary>
// #############################################################################################
function DoStdAsyncHTTPRequest(_type, _url, _headers, _params, _xmlhttp, _onload) {

    try {
        _xmlhttp.open(_type, _url, true);
	    if (_headers !== null) {
	        for (var kvp in _headers) {
	            if (!_headers.hasOwnProperty(kvp)) continue;
	            
	            try {
	                _xmlhttp.setRequestHeader(_headers[kvp].key, _headers[kvp].value);
	            }
	            catch (e) {	                
	                debug("Unable to set request header " + _headers[kvp].key + ":" + _headers[kvp].value + " " + e.message);
	            }
	        }
	    }
	    else if (_type == "POST") {
	        _xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	    }	    	    
	    _xmlhttp.onreadystatechange = function () {  HTTP_ReadyStateChange(_xmlhttp, _onload); };
	    _xmlhttp.send(_params);
	}
	catch (e) {
	    debug(e.message);
	}
}

// #############################################################################################
/// Function:<summary>
///          	Handle HTTP requests on IE9
///          </summary>
// #############################################################################################
function DoIE9AsyncHTTPRequest(_type, _url, _headers, _params, _xmlhttp, _xdomain, _onload) {
        
    _xmlhttp.open(_type, _url);
	_xmlhttp.ontimeout = function (_event) {
	    IE_Http_Get_onerror(_event, _xmlhttp);
	};
	_xmlhttp.onerror = function (_event) {
	    IE_Http_Get_onerror(_event, _xmlhttp);
	};

	if (_xdomain) {
	    _xmlhttp.onload = function (_event) {
	        IE_Http_Get_onload(_event, _xmlhttp, 200);
	    };
	}
	else {
	    _xmlhttp.onload = function (_event) { };
	    _xmlhttp.onreadystatechange = function () {
	        if (_xmlhttp.readyState == 4) {
	            IE_Http_Get_onload(null, _xmlhttp, _xmlhttp.status);
	        }
	    };
	}

    if (_headers !== null) {
	    for (var kvp in _headers) {	        
	        if (!_headers.hasOwnProperty(kvp)) continue;
	        try {	        
	            _xmlhttp.setRequestHeader(_headers[kvp].key, _headers[kvp].value);
	        }
	        catch (e) {
	            // Cannot set custom headers on an XDR object
	            debug("Unable to set request header " + _headers[kvp].key + ":" + _headers[kvp].value + " " + e.message);
	        }
	    }
	}

	_xmlhttp.onprogress = function () { };
	_xmlhttp.send(_params);
}

// #############################################################################################
/// Function:<summary>
///          	Get callback
///          </summary>
///
/// In:		<param name="_xmlhttp"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function IE_Http_Get_onload(_event,_xmlhttp,_status) {

	var pFile = AsyncAlloc_pop(_xmlhttp);
	if (pFile)
	{		
		pFile.m_Complete = true;
		if ((_status >= 200) && (_status < 300)) {
		    pFile.m_Status = ASYNC_WEB_STATUS_LOADED;		
		    pFile.m_http_status = _status;
		}
		else {
		    pFile.m_Status = ASYNC_WEB_STATUS_ERROR;	
		    pFile.m_http_status = 404;
		}		
		pFile.m_Data = _xmlhttp.responseText;
		pFile.m_ResponseHeadersMap = -1;
	}
}

// #############################################################################################
/// Function:<summary>
///          	IE9 error
///          </summary>
///
/// In:		<param name="_event"></param>
///			<param name="_xmlhttp"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function IE_Http_Get_onerror(_event, _xmlhttp) {

	var pFile = AsyncAlloc_pop(_xmlhttp);
	if (pFile)
	{		
		pFile.m_Complete = true;
		pFile.m_Status = ASYNC_WEB_STATUS_ERROR;
		pFile.m_Data = "";
		pFile.m_http_status = 404;
		pFile.m_ResponseHeadersMap = -1;
	}
}


// #############################################################################################
/// Function:<summary>
///          	Issue an asyn "GET"
///          </summary>
///
/// In:		<param name="_url">URL to get</param>
/// Out:	<returns>
///				ID of request
///			</returns>
// #############################################################################################
function http_get(_url)
{    
    return DoAsyncHTTPRequest("GET", yyGetString(_url), null, "", HTTP_onload);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function http_get_file(_url, _localTarget)
{
    _localTarget = yyGetString(_localTarget);

    var onloadFile = function (_xmlhttp, _pFile) {
    
        if (_xmlhttp.response) {            
            try {
                var stringData = String.fromCharCode.apply(null, new Uint8Array(_xmlhttp.response));
                SaveTextFile_Block(_localTarget, stringData);            
                
                _pFile.m_Status = ASYNC_WEB_STATUS_LOADED;
                _pFile.m_Data = _localTarget;
            }
            catch (e) {
                debug(e.message);
                _pFile.m_Status = ASYNC_WEB_STATUS_ERROR;
            }
        }
        else {
            _pFile.m_Status = ASYNC_WEB_STATUS_ERROR;
        }
    };

    return DoAsyncHTTPRequest("GET", yyGetString(_url), null, "", onloadFile, 'arraybuffer');
}

// #############################################################################################
/// Function:<summary>
///          	Issue an async "POST" with string as the post data
///          </summary>
///
/// In:		<param name="_url">URL to get</param>
/// Out:	<returns>
///				ID of request
///			</returns>
// #############################################################################################
function http_post_string(_url, _string)
{
    if (!_string)
    {
        _string = "";
    }
    else
    {    
        _string = yyGetString(_string);
    }
	return DoAsyncHTTPRequest('POST', yyGetString(_url), null, _string, HTTP_onload);
}

// #############################################################################################
/// Function:<summary>
///          	Issue a flexible async HTTP request
///          </summary>
// #############################################################################################
function http_request(_url, _method, _headerMap, _body)
{
    _url = yyGetString(_url);
    _method = yyGetString(_method);
    _headerMap = yyGetInt32(_headerMap);

    // Turn the supplied header ds_map into a set of key-value pairs
    var headers = [];
    var pMap = g_ActiveMaps.Get(_headerMap);
    if (pMap !== null) {
        for (const [key, item] of pMap) {
            var v = key;
            if (pMap.originalKeys && pMap.originalKeys.has(key))
                v = pMap.originalKeys.get(key);
            headers.push({ key: v, value: item  });
        }
    }
    // If the "_body" is a number then it's an index to a binary buffer
    if (typeof(_body) === 'number') {
        return http_request_buffer(_url, _method, headers, _body);
    }
    else {
        if (!_body) { _body = ""; }
        return DoAsyncHTTPRequest(_method, _url, headers, _body, HTTP_onload); 
    }
}

// #############################################################################################
/// Function:<summary>
///          	Handle an http_request that's using binary buffers in the process
///          </summary>
// #############################################################################################
function http_request_buffer(_url, _method, _headers, _body)
{
    var pBuff = g_BufferStorage.Get(_body);    
    if (!pBuff) {
        return FailAsyncHTTPRequest(_url);
    }
    else if (pBuff.m_BufferIndex != 0) {
    
        // Open a view onto the buffer's data that's just the data written to it
        var arrayView = new Uint8Array(pBuff.m_pRAWUnderlyingBuffer, 0, pBuff.m_BufferIndex);
        return DoAsyncHTTPRequest(_method, _url, _headers, arrayView, HTTP_onload);
    }
    else {
        // Handle putting the result into the supplied buffer
        var onloadBuffer = function (_xmlhttp, _pFile) {            
        
            // Override the data to be the buffer index the data went in at
            _pFile.m_Data = pBuff.m_BufferIndex;            
            
            // Copy the response data across to the user's buffer
            // Bit clunky this, but it easily allows for the yyBuffer to handle resizing itself
            if (_xmlhttp.response) {
                _pFile.m_Status = ASYNC_WEB_STATUS_LOADED;
            
                var arrayData = new Uint8Array(_xmlhttp.response);                
                for (var i = 0, len = arrayData.length; i < len; ++i) {                    
                    pBuff.yyb_write(eBuffer_U8, arrayData[i]);
                }
                _pFile.m_Data = arrayData.length;
            }
            else {
                _pFile.m_Status = ASYNC_WEB_STATUS_ERROR;
            }
        };
        return DoAsyncHTTPRequest(_method, _url, _headers, _body, onloadBuffer, 'arraybuffer');
    }
};

// #############################################################################################
/// Function:<summary>
///          	Sets the crossOrigin type for HTTP requests
///          </summary>
// #############################################################################################
function http_set_request_crossorigin(_crossOriginType)
{
	g_HttpRequestCrossOriginType = yyGetString(_crossOriginType);
}

// #############################################################################################
/// Function:<summary>
///          	Gets the crossOrigin type for HTTP requests
///          </summary>
// #############################################################################################
function http_get_request_crossorigin()
{
	return g_HttpRequestCrossOriginType;
}