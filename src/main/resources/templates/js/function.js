var DEBUG = true;
var CACHE = false;
var RECIPIENTS = new Array();
var MAIL_COUNT = 0;
var MAIL_OBJECT = null;

var oEditors = [];

function supportHtml5Storage() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
};

function sleep(numberMillis) {
    var now = new Date();
    var exitTime = now.getTime() + numberMillis;
    while (true) {
        now = new Date();
        if (now.getTime() > exitTime) {
            return;
        }
    }
};

/**
 * Ajax Call
 */
function Ajax(documentId, jspFile) {
    this.documentId = documentId;
    this.jspFile = jspFile;
    this.param = null;
    this.end_event = null;
    this.return_check = false;
    this.parameter = new Parameter();
    this.setParam = function (param) {
        this.param = param;
        return this;
    };
    this.setArgsParam = function(a) {
    	
    	
    }
    this.addParam = function(name, value) {
    	if( typeof( value ) != "undefined" && typeof( value ) != "function") 
    	{
    		if( value != null && value != "NULL" )
    		{
        		this.parameter.addParam(name, value);
            	this.param = this.parameter.value;
    		}
    	}
    	return this;
    }
    this.execute = function (end_event, start_event) {
        if (DEBUG && window.console != undefined) {
            if (this.param == null || this.param == "" || this.param == undefined) {
            	if (DEBUG) {
            		console.info("Ajax:: " + jspFile);
            	}
            } else {
            	if (DEBUG) {
            		console.info("Ajax:: " + jspFile + "?" + this.param);
            	}
            }
        }
        this.end_event = end_event;
        $.ajax({
            type: "post",
            url: jspFile,
            data: this.param,
            dataType: "text",
            statusCode: {
                404: function () {
                    if (DEBUG) {
                        console.log("Ajax:: 404 Error. " + jspFile);
                    }
                },
                403: function () {
                    if (DEBUG) {
                        console.log("Ajax:: 403 Error. " + jspFile);
                    }
                },
                500: function () {
                    if (DEBUG) {
                        console.log("Ajax:: 500 Error. " + jspFile);
                    }
                }
            },
            success: function (data) {
            	if (DEBUG) {
                    console.log("Ajax:: " + data);
                }
            //	if( supportHtml5Storage() && CACHE == true ) {
            //		localStorage.setItem(jspFile, data);
            //	}
            	if( typeof(start_event) != "undefined" ) {
	                if (typeof(start_event) == "function") {
	                    data = start_event(data);
	                }
            	}
                if (documentId != null && documentId != "") {
                    document.getElementById(documentId).innerHTML = data;
                }

            	if( typeof(end_event) != "undefined" ) {
	                if (typeof(end_event) == "function") {
	                    end_event(data);
	                }
            	}
                
            }
        });
    };
    this.json = function (end_event) {
        this.execute(end_event, function (data) {
        //	if( supportHtml5Storage() && CACHE == true ) {
        //		localStorage.setItem(jspFile, data);
        //	}
        	
        	if (DEBUG) {
                console.log("Ajax:: " + data);
            }
        	return parseJSON(data);
        });
    };
    this.xml = function (end_event) {
        this.execute(end_event, function (data) {
        //	if( supportHtml5Storage() && CACHE == true ) {
        //		localStorage.setItem(jspFile, data);
        //	}
        	if (DEBUG) {
                console.log("Ajax:: " + data);
            }
        	return parseXML(data);
        });
    };
};

// parse는 어떠한 형태로된 데이터이든 가능한한 변경할수있는 형태로 능동적으로 변경시켜줌
function parseXML(data) {
	if( data != null && data != undefined ) {
		if( typeof data == "object" ) {
			try {											// 변환 작업
				return json2xml( data );
			} catch (e) {
				return (new XMLSerializer()).serializeToString( data );
		 	}
		} else if( typeof data == "string" ) {
			try {
				return json2xml( JSON.parse( data ) );
			} catch(e) {
				if(window.ActiveXObject) {
					var xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
					xmlDoc.async = false;
					xmlDoc.loadXML(data);
			        return xmlDoc.xml;
				} else if( typeof (XMLSerializer) != "undefined" ) {	// 파싱 검사
					return (new XMLSerializer()).serializeToString(createXMLFromString( data ));
				} else {
					var xmlDoc = new ActiveXObject("MSXML2.DOMDocument.6.0");
					xmlDoc.async = false;
					xmlDoc.loadXML( data );
					return xmlDoc.xml;
				}
			}
		}
	} else {
		return "";
	}
};

function parseJSON(data) {
	if( data != null && data != undefined ) {
		if( typeof data == "object" ) {
			try {											// 변환 작업
				return xml2json( data );
			} catch (e) {
				return data;
		 	}
		} else if( typeof data == "string" ) {
			try {
				return JSON.parse( data );
			} catch(e) {
				return xml2json( createXMLFromString( data ));
			}
		}
	} else {
		return {};
	}
};

function S4() {
   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
};

function guid() {
   return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
};
//
//Array.prototype.removeAt = function(idx) {
//    return (idx<0 || idx>this.length) ? this : this.slice(0, idx).concat(this.slice(idx+1, this.length));
//};
//
//Array.prototype.remove = function(x) {
//	
//	
//	$.grep(y, function(value) {
//		  return value != removeItem;
//		});
//	
//	
//    for(i in this){
//        if(this[i].toString() == x.toString()){
//            this.splice(i,1)
//        }
//    }
//};

//
//* @author Jung Seong Hun
//* 비 동기 처리를 동기식처럼 동작 하는 코드
//* @see 
//	a = new Sjax();
//	b = "";
//	a.add(function(o, guid) {					// TODO: 파라메터 o, guid
//		new Sjax(function(data){
//			b = data;
//			try{ o.end(guid); } catch(e) { }	// TODO: 반드시 필수 코드
//		}).userPoint();
//	});
//	
//	a.execute(function(){
//		console.log("complete");	// 작업은 완료되었으나 실패가 있을수 있음
//	},function(){
//		console.log("fail");		// 작업 완료 응답을 받지 않았으나 성공이 있을수 있음.
//	});
//	
//	클래스명.prototype.함수명 = function( o, guid ) {
//		// AJAX 코드
//		{
//			try{ o.end(guid); } catch(e) { }
//		}
//	};

function Sjax(timeout, fps) {
	this.fps = fps != undefined && fps != null ? parseInt( 1000/parseInt(fps) ) : parseInt( 1000/60 );
	this.timeout = timeout != undefined && timeout != null ? timeout : 240;		// 기본 타임아웃 약 10초
	this.list = new Array();
	this.currentEventIndex = 0;		// sequence
	this.totalEventCount = 0;		// sequence
	
	this.thread = null;
	this.doneEvent = null;
	this.timeoutEvent = null;
};

Sjax.prototype.init = function(){
	this.list = new Array();
	this.currentEventIndex = 0;
	this.totalEventCount = 0;
};

Sjax.prototype.add = function(func){
	var guid2 = guid();
	var index = this.list.push({
		guid: guid2,			// k: 고유 식별 키 값
		event: func,
		isDone: false,
	});
};

Sjax.prototype.end = function(guid) {
	for( var i = 0; i < this.list.length; i++) {
		if( this.list[i].guid == guid ) {
			this.list[i].isDone = true;
			break;
		}
	}
};

Sjax.prototype.next = function() {
	var parent = this;
	var totalTime = 0;
	var guid = parent.list[parent.currentEventIndex].guid;
	parent.list[parent.currentEventIndex].isDone = false;
	parent.list[parent.currentEventIndex].event(parent, guid);	// object, key , event execute
	
	var totalTime = 0;
	try{ clearInterval(parent.thread); } catch(e) { }
	parent.thread = setInterval(function(){
		try {
			console.log("Sjax:: waiting for request");
			if( parent.list[parent.currentEventIndex].isDone == true ) {
				console.log("Sjax:: complete " + (parent.currentEventIndex + 1) + "/" + parent.totalEventCount );
				parent.run();
			} else {
				// continue
			}			
			if( totalTime > parent.timeout ) {
				console.log("Sjax:: complete (timeout) " + (parent.currentEventIndex +1 ) + "/" + parent.totalEventCount ); 
				parent.run();
			}
			totalTime++;
		} catch (e) {
			console.log("Sjax:: Exception: " + e.toString());
			try{ clearInterval(parent.thread); } catch(e) { }
		}
	},parent.fps);	// 초당 24번 호출
};

Sjax.prototype.run = function() {
	var parent = this;
	try{ clearInterval(parent.thread); } catch(e) { }
	if( (this.currentEventIndex + 1) == this.totalEventCount) {		// 현재 인덱스가 끝이거나 0 일경우, totalEventCount가 0일경우 이 코드에 도달하지못함
		for( var i = 0; i < parent.list.length; i++) {
			parent.list[i].isDone = false;
		}
		try{ parent.doneEvent(); } catch(e) { console.log("Sjax:: Exception: " + e.toString()); }
		console.log("Sjax:: end");
	} else {
		this.currentEventIndex++;
		parent.next(this.currentEventIndex);		// 함수 실행
	}
};

Sjax.prototype.sequence = function( doneEvent ) {
	for( var i = 0; i < this.list.length; i++) {
		this.list[i].isDone = false;
	}
	this.doneEvent = doneEvent;
	//this.timeoutEvent = timeoutEvent;
	
	this.totalEventCount = this.list.length;
	this.currentEventIndex = 0;
	if( this.totalEventCount > 0 ) {	  
		this.currentEventIndex = 0;		// 인덱스를 0으로 초기화
		this.next(this.currentEventIndex);	// 첫번째 0 함수 실행
	} else {
		this.currentEventIndex = -1;
		try{ doneEvent(); } catch(e) { console.log("Sjax:: Exception: " + e.toString()); }
	}	
};

Sjax.prototype.execute = function(doneEvent, timeoutEvent) {
	for( var i = 0; i < this.list.length; i++) {
		this.list[i].isDone = false;
	}
	this.doneEvent = doneEvent;
	this.timeoutEvent = timeoutEvent;
	
	var parent = this;
	for( var i = 0; i < parent.list.length; i++) {
		var guid = parent.list[i].guid;
		parent.list[i].event(parent, guid);
	}
	var cnt = 0;			// execute의 경우 카운트를 세어냄
	var totalTime = 0;
	try{ clearInterval(parent.thread); } catch(e) { }
	parent.thread = setInterval(function(){
		try {
			for( var i = 0; i < parent.list.length; i++) {
				if( parent.list[i].isDone ) {
					cnt++;
				} else {
					break;
				}
			}
			console.log("Sjax:: waiting for request");
			if( cnt == parent.list.length ) {
				try{ parent.doneEvent(); } catch(e) { console.log("Queue:: Exception: " + e.toString()); }
				console.log("Sjax:: complete (" + cnt + ")");
				clearInterval(parent.thread);
			} else if( totalTime > parent.timeout ) {
				try{ parent.timeoutEvent(); } catch(e) { console.log("Queue:: Exception: " + e.toString()); }
				console.log("Sjax:: complete (timeout) (" + cnt + ")");
				clearInterval(parent.thread);
			}
			totalTime++;
		} catch (e) {
			console.log("Sjax:: Exception: " + e.toString());	//  스레드 진행도중 이미 초기화가 되었을수 있음
			try{ clearInterval(parent.thread); } catch(e) { }
		}
	}, parent.fps);	// 초당 24번 호출
};



// Queue 이름을 변경

function Queue(timeout, fps) {
	this.fps = fps != undefined && fps != null ? parseInt( 1000/parseInt(fps) ) : parseInt( 1000/60 );
	this.timeout = timeout != undefined && timeout != null ? timeout : 240;		// 기본 타임아웃 약 10초
	this.list = new Array();
	this.currentEventIndex = 0;		// sequence
	this.totalEventCount = 0;		// sequence
	
	this.thread = null;
	this.doneEvent = null;
	this.timeoutEvent = null;
}

Queue.prototype.init = function(){
	this.list = new Array();
	this.currentEventIndex = 0;
	this.totalEventCount = 0;
};

Queue.prototype.add = function(func){
	var guid2 = guid();
	var index = this.list.push({
		guid: guid2,			// k: 고유 식별 키 값
		event: func,
		isDone: false,
	});
};

Queue.prototype.end = function(guid) {
	for( var i = 0; i < this.list.length; i++) {
		if( this.list[i].guid == guid ) {
			this.list[i].isDone = true;
			break;
		}
	}
};

Queue.prototype.next = function() {
	var parent = this;
	var totalTime = 0;
	var guid = parent.list[parent.currentEventIndex].guid;
	parent.list[parent.currentEventIndex].isDone = false;
	parent.list[parent.currentEventIndex].event(parent, guid);	// object, key , event execute
	
	var totalTime = 0;
	try{ clearInterval(parent.thread); } catch(e) { }
	parent.thread = setInterval(function(){
		try {
			console.log("Queue:: wait");
			if( parent.list[parent.currentEventIndex].isDone == true ) {
				console.log("Queue::complete" + (parent.currentEventIndex + 1) + "/" + parent.totalEventCount );
				parent.run();
			} else {
				// continue
			}			
			if( totalTime > parent.timeout ) {
				console.log("Queue::complete(timeout) " + (parent.currentEventIndex +1 ) + "/" + parent.totalEventCount ); 
				parent.run();
			}
			totalTime++;
		} catch (e) {
			console.log("Queue:: Exception: " + e.toString());
			try{ clearInterval(parent.thread); } catch(e) { }
		}
	},parent.fps);	// per seconds 24
};

Queue.prototype.run = function() {
	var parent = this;
	try{ clearInterval(parent.thread); } catch(e) { }
	if( (this.currentEventIndex + 1) == this.totalEventCount) {		// 현재 인덱스가 끝이거나 0 일경우, totalEventCount가 0일경우 이 코드에 도달하지못함
		for( var i = 0; i < parent.list.length; i++) {
			parent.list[i].isDone = false;
		}
		try{ parent.doneEvent(); } catch(e) { console.log("Queue:: Exception: " + e.toString()); }
		console.log("Queue:: 종료");
	} else {
		this.currentEventIndex++;
		parent.next(this.currentEventIndex);		// 함수 실행
	}
};

Queue.prototype.sequence = function( doneEvent ) {
	for( var i = 0; i < this.list.length; i++) {
		this.list[i].isDone = false;
	}
	this.doneEvent = doneEvent;
	//this.timeoutEvent = timeoutEvent;
	
	this.totalEventCount = this.list.length;
	this.currentEventIndex = 0;
	if( this.totalEventCount > 0 ) {	  
		this.currentEventIndex = 0;		// 인덱스를 0으로 초기화
		this.next(this.currentEventIndex);	// 첫번째 0 함수 실행
	} else {
		this.currentEventIndex = -1;
		try{ doneEvent(); } catch(e) { console.log("Queue:: Exception: " + e.toString()); }
	}	
};

Queue.prototype.execute = function(doneEvent, timeoutEvent) {
	for( var i = 0; i < this.list.length; i++) {
		this.list[i].isDone = false;
	}
	this.doneEvent = doneEvent;
	this.timeoutEvent = timeoutEvent;
	
	var parent = this;
	for( var i = 0; i < parent.list.length; i++) {
		var guid = parent.list[i].guid;
		parent.list[i].event(parent, guid);
	}
	var cnt = 0;			// execute의 경우 카운트를 세어냄
	var totalTime = 0;
	try{ clearInterval(parent.thread); } catch(e) { }
	parent.thread = setInterval(function(){
		try {
			for( var i = 0; i < parent.list.length; i++) {
				if( parent.list[i].isDone ) {
					cnt++;
				} else {
					break;
				}
			}
			console.log("Queue:: 기다리는중");
			if( cnt == parent.list.length ) {
				try{ parent.doneEvent(); } catch(e) { console.log("Queue:: Exception: " + e.toString()); }
				console.log("Queue:: 종료 (" + cnt + ")");
				clearInterval(parent.thread);
			} else if( totalTime > parent.timeout ) {
				try{ parent.timeoutEvent(); } catch(e) { console.log("Queue:: Exception: " + e.toString()); }
				console.log("Queue:: 종료 (타임아웃) (" + cnt + ")");
				clearInterval(parent.thread);
			}
			totalTime++;
		} catch (e) {
			console.log("Queue:: Exception: " + e.toString());	//  스레드 진행도중 이미 초기화가 되었을수 있음
			try{ clearInterval(parent.thread); } catch(e) { }
		}
	}, parent.fps);	// 초당 24번 호출
};

// 전역변수 형태 : 위의 코드와 조금 다름 사용하지 않을 계획
//var Callbacks = {
//		timeout: 100,
//		// guid 
//		// event
//		// isDone
//		list: new Array(),
//		init: function(){
//			Callbacks.list = new Array();
//		},
//		add: function( func ){
//			var guid2 = guid();
//			var index = Callbacks.list.push({
//				guid: guid2,
//				event: func,
//				isDone: false,
//			});
//		},
//		execute: function(callbackEvent){
//			for( var i = 0; i < Callbacks.list.length; i++) {
//				var guid = Callbacks.list[i].guid;
//				Callbacks.list[i].event( (function() { 
//					for( var i = 0; i < Callbacks.list.length; i++) {
//						if( Callbacks.list[i].guid == guid ) {
//							Callbacks.list[i].isDone = true;
//							break;
//						}
//					}
//				}()) );
//			}
//			var totalTime = 0;
//			var timer = setInterval(function(){
//				var cnt = 0;
//				for( var i = 0; i < Callbacks.list.length; i++) {
//					if( Callbacks.list[i].isDone ) {
//						cnt++;
//					} else {
//						break;
//					}
//				}
//				console.log("콜백을 기다리는중" + cnt);
//				totalTime++;
//				if( cnt == Callbacks.list.length ) {
//					callbackEvent();
//					clearInterval(timer);
//				} else if( totalTime > Callbacks.timeout ) {
//					callbackEvent();
//					clearInterval(timer);
//				}
//			},10);
//		}
//	};
//


//
// * Parameter to String & JSON
// * @returns getValue, getJSON

function Parameter() {
    this.json = {};
    this.value = "";
    this.addParam = function (name, value) {
        if (this.value == "") {
            this.value += name + "=" + value;
            this.json[name] = value;
        } else {
            this.value += "&" + name + "=" + value;
            this.json[name] = value;
        }
        return this;
    };
    this.getValue = function () {
        return this.value;
    };
    this.getJSON = function () {
        return JSON.stringify(this.json);
    };
}


function createXMLFromString(string) {
    var xmlDocument;
    var xmlParser;
    if (window.ActiveXObject) {
        xmlDocument = new ActiveXObject('Microsoft.XMLDOM');
        xmlDocument.async = false;
        xmlDocument.loadXML(string);
    } else if (window.XMLHttpRequest) {
        xmlParser = new DOMParser();
        xmlDocument = xmlParser.parseFromString(string, "text/xml");
    } else {
        return null;
    }
    return xmlDocument;
}

function createDocumentFromJSON(json, elementName) {
	var root = document.createElement("element");
	var element = null;
	$.each(json, function(i, o ){
		if( i != "" && o != "" ) {
			element = document.createElementNS("http://www.w3.org/1999/XSL/Transform", elementName );			
			element.setAttribute("name", i );
			element.setAttribute("select", "'" + o + "'");
			root.appendChild(element);
		}
	});
	// TODO: Element 가 최상위 Root 형태로 반환됨. appendChild가 필요하다면 
	// root.childElementCount 와 root.childNodes 이용하여 사용해야함
	return root;
}

//
// * XSLT transformation
// * 
// * 2014-06-18 주석 추가 내용
// * 		xsl callTemplate기능 이용시 xsl 맨 아래에 <xsl:template match name="root"></xsl:template>  구문이 반드시 필요함
function Xslt(documentId, xmlFile, xslFile) {
    this.documentId = documentId;
    this.xmlFile = xmlFile;
    this.xslFile = xslFile;
    this.method = "POST";
    this.callback = null;
    this.async = true;
    this.param = "";
    this.end_event = null;
    this.setParam = function (param) {
        if (param == null || param == undefined) {
            this.param = "";
        } else {
            this.param = param;
        }
        return this;
    };
    this.templateName = "";
    this.templateDefine = null;
    this.call = function (templateName, defineJSON) {
        if (templateName == null || templateName == undefined) {
            this.templateName = "";
            if( defineJSON != null && defineJSON != undefined ) {
            	this.templateDefine = {};
            } else {
            	this.templateDefine = {};
            }
        } else {
            this.templateName = templateName;
            if( defineJSON != null && defineJSON != undefined ) {
            	this.templateDefine = defineJSON;
            } else {
            	this.templateDefine = {};
            }
        }
        return this;
    };
    this.execute = function (end_event) {
        var isXmlURL = false;
        var isXslURL = false;
//        
//         * XML, XSL url Check
//         * http://
//         * https://
//         * . or slash
//        
        
        if( (typeof xmlFile) == "object" ) {
        	
        } else {
        	try {
	            if (xmlFile.substring(0, 1) == "." || xmlFile.substring(0, 1) == "/" || xmlFile.substring(0, 1) != "<" ) {
	                isXmlURL = true;
	            } else {
	                isXmlURL = false;
	            }
        	} catch(e) {
        		isXmlURL = false;
        	}
        }
        
        if( (typeof xslFile) == "object" ) {
        	
        } else {
        	try {
	        	if (xslFile.substring(0, 1) == "." || xslFile.substring(0, 1) == "/" || xslFile.substring(0, 1) != "<" ) {
	                isXslURL = true;
	            } else {
	                isXslURL = false;
	            }	
        	} catch(e) {
        	    isXslURL = false;
        	}
        }

        this.end_event = end_event;

        if (typeof (XSLTProcessor) != "undefined") {
            var xml;
            var xml_doc;
            if (isXmlURL) {
                xml = new Xml(this.xmlFile, this.param, this.method, null);
                xml.setAsync(false);
                xml.request();
                xml_doc = xml.req.responseXML;
            } else {
                // xml_doc = createXMLFromString(xmlFile);
            	xml_doc = XML.parse(xmlFile);
            }

            var xsl_doc;
            if (isXslURL) {
            	// localStorage Cache
                try {
                    if (supportHtml5Storage() && CACHE == true) {
                        if (localStorage.getItem(this.xslFile) == null) {
                            xml = new Xml(this.xslFile, this.param, this.method, null); // xml request code
                            xml.setAsync(false);
                            xml.request();
                            localStorage.setItem(this.xslFile, xml.req.responseText);
                            xsl_doc = xml.req.responseXML;
                            
                        	if( DEBUG ) {
                        		console.info("Xslt:: " + this.xslFile);
                        	}
                        } else {
                            //xsl_doc = createXMLFromString(localStorage.getItem(this.xslFile));
                        	xsl_doc = XML.parse(localStorage.getItem(this.xslFile));
                        	if( DEBUG ) {
                        		console.info("Xslt:: " + this.xslFile + " is cached.");
                        	}
                        }
                    } else {
                        xml = new Xml(this.xslFile, this.param, this.method, null); // xml request code
                        xml.setAsync(false);
                        xml.request();
                        xsl_doc = xml.req.responseXML;
                        if( DEBUG ) {
                        	console.info("Xslt:: " + this.xslFile);
                    	}
                    }
                } catch (e) {
                    localStorage.removeItem(this.xslFile);
                    console.info("Xslt:: " + this.xslFile + " localStorage cache error.");
                    xml = new Xml(this.xslFile, this.param, this.method, null); // xml request code
                    xml.setAsync(false);
                    xml.request();
                    xsl_doc = xml.req.responseXML;
                }
            } else {
                //xsl_doc = createXMLFromString(xslFile);
            	xsl_doc = XML.parse(xslFile);
            	
            	if( DEBUG ) {
            		console.info("Xslt:: " + this.xslFile);
            	}
            }

            // Template
            if (this.templateName != "") {
                var elm = document.createElementNS("http://www.w3.org/1999/XSL/Transform", "xsl:call-template");
                elm.setAttribute("name", this.templateName);
                var docLength = xsl_doc.childNodes[0].childNodes.length;
                xsl_doc.childNodes[0].childNodes[docLength - 2].appendChild(elm);
            }
            
            // Define   XSL_DOC 최상위 노드에 추가함 Webkit
            var declare = "";	// XSLT 미 지원시 xsltTransform 변수
            if( this.templateDefine != "" && this.templateDefine != null && this.templateDefine != undefined ) {
            	try {
            		$.each(this.templateDefine, function(i, o ) {
                        //declare += "<xsl:variable name=\"" + i + "\" select=\"&quote;" + o + "&quote;\" />";
            			if( (typeof o) == "string" ) {
                			declare += "<xsl:variable name=\"" + i + "\">"+o+"</xsl:variable>";
                			element = document.createElementNS("http://www.w3.org/1999/XSL/Transform", "xsl:variable" );			
                			element.setAttribute("name", i );
                			element.appendChild(document.createTextNode(o) );
            			}
/*
                        element = document.createElementNS("http://www.w3.org/1999/XSL/Transform", "xsl:variable" );			
            			element.setAttribute("name", i );
            			element.setAttribute("select", "'" + o + "'");
*/
            			
            			xsl_doc.childNodes[0].insertBefore( element, xsl_doc.childNodes[0].firstElementChild );
                	});
            	} catch(e) {
            		console.log(e);
            	}
            }
            /*
            xsl_doc = (new XMLSerializer()).serializeToString(xsl_doc);
            a = XML.parse(xsl_doc);
            xml_doc = (new XMLSerializer()).serializeToString(xml_doc);
            b = XML.parse(xml_doc);
            */
            var xslt_proc = new XSLTProcessor();
            xslt_proc.importStylesheet(xsl_doc);
        //    console.log(xml_doc);
         //   console.log(document);
            resultDocument = xslt_proc.transformToFragment(xml_doc, document); // transformToFragment(xml_doc, document);
            var str = "";
            if( resultDocument != null ) {
            	str = (new XMLSerializer()).serializeToString(resultDocument);
            }
        	//console.log(str);
        	if (documentId != null && documentId != "") {
                isObject(documentId, function () {
                    document.getElementById(documentId).innerHTML = str;
                });
            }
            
            if (end_event != null) {
                end_event(str);
            }
            
            // 7 depth bug
//          if (node == null || node == undefined) {
            	// XSLT Transform 전역변수구현..
//            	if( DEBUG ) {
//            		log("Xslt:: XSLT Transform");
//            	}
//                xsltTransform(this.documentId, this.xmlFile, this.xslFile, this.param, this.end_event, this.templateName, declare);
//            } else {
            
//                var str = (new XMLSerializer()).serializeToString(node);
//                
//                if (documentId != null && documentId != "") {
//                    isObject(documentId, function () {
//                        document.getElementById(documentId).innerHTML = str;
//                    });
//                }
//                if (end_event != null) {
//                    end_event(str);
//                }
//			}
        } else {	// IE
        	var declare = "";	// XSLT 미 지원시 xsltTransform 변수
//			try {
                var processor = new ActiveXObject("MSXML2.XSLTemplate.6.0");
                var xmlDoc = new ActiveXObject("MSXML2.DOMDocument.6.0");
                var xslDoc = new ActiveXObject("MSXML2.FreeThreadedDOMDocument.6.0");
                xmlDoc.async = false;
                xslDoc.async = false;
                if (isXmlURL) {
                    if (this.param != "") {
                        xmlDoc.load(xmlFile + "?" + this.param);
                    } else {
                        xmlDoc.load(xmlFile);
                    }
                } else {
                    xmlDoc.loadXML(xmlFile);
                }

                if (isXslURL) {
                	// localStorage Cache
                	try {
                        if (supportHtml5Storage() && CACHE == true) {		// set cache
                            if (localStorage.getItem(this.xslFile) == null) {
                            	xslDoc.load(this.xslFile);										// xml request code
                                localStorage.setItem(this.xslFile, xslDoc.xml);
                            } else {
                            	xslDoc.loadXML( localStorage.getItem(this.xslFile) );
                                console.log("Xslt:: " + this.xslFile + " is cached.");
                            }
                        } else {
                        	xslDoc.load(this.xslFile);											// xml request code
                        }
                    } catch (e) {
                    	localStorage.removeItem(this.xslFile);
                    	xslDoc.load(this.xslFile);
                    	console.log("Xslt:: " + this.xslFile + " localStorage cache error.");			// xml request code
                    }
                } else {
                	xslDoc.loadXML(this.xslFile);
                }

                // call template
                if (this.templateName != "") {
                    //var xslCallTemplate = new ActiveXObject("MSXML2.FreeThreadedDOMDocument");
                    //xslCallTemplate.loadXML("<xsl:call-template xmlns=\"http://www.w3.org/1999/XSL/Transform\" name=\"" + this.templateName + "\"></xsl:call-template>");		    		
                    //var ct = "<xsl:call-template xmlns=\"http://www.w3.org/1999/XSL/Transform\" name=\"" + this.templateName + "\"></xsl:call-template>";
                    //xslCallTemplate.createElement("xsl:call-template").setAttribute("name",this.templateName);
                    //TODO: Type does not match Critical Error!
                    //xslDoc.documentElement.childNodes(docLength-1).appendChild(createXMLFromString(ct));

                    // TODO:이 작업은 ELEMENT 형식의 노드를 사용하여 수행할 수 없습니다.
                    // 현재 IE10 이상의 버그에서 발견됨
                    // http://msdn.microsoft.com/ko-kr/library/ie/dn467845(v=vs.85).aspx
                    // 외부 리소스를 포함하는 스크립트 요소가 appendChild 중에 더 이상 실행되지 않습니다. 
                    // var docLength = xslDoc.documentElement.childNodes.length;
                	// var elm = document.createElement("xsl:call-template");
                	// elm.setAttribute("name", this.templateName);
                	// elm.setAttribute("xmlns:xsl", "http://www.w3.org/1999/XSL/Transform");
                    // xslDoc.documentElement.childNodes(docLength - 1).appendChild(elm);
                	// 2014-06-19 수정 elementByTagName으로 찾는 방식으로 변경
                    var docLength = xslDoc.getElementsByTagName("xsl:template").length;
                	var elm = xslDoc.createElement("xsl:call-template");
                	elm.setAttribute("name", this.templateName);
                	elm.setAttribute("xmlns:xsl", "http://www.w3.org/1999/XSL/Transform");
                	xslDoc.getElementsByTagName("xsl:template")[docLength - 1].appendChild(elm);
                }
                
                // Define   XSL_DOC 최상위 노드에 추가함		IE
                if( this.templateDefine != "" && this.templateDefine != null && this.templateDefine != undefined ) {
                	try {
	                	$.each(this.templateDefine, function(i, o ) {
	                		//declare += "<xsl:variable name=\"" + i + "\" select=\"'" + o + "'\" />";
	                		if( (typeof o) == "string" ) {
		                		declare += "<xsl:variable name=\"" + i + "\">"+o+"</xsl:variable>";
		                		
		                		var elm = xslDoc.createElement("xsl:variable");
		                		elm.setAttribute("name", i);
		                		elm.appendChild( xslDoc.createTextNode(o) );
		                		elm.setAttribute("xmlns:xsl", "http://www.w3.org/1999/XSL/Transform");
	                		}
/*
	                		var elm = xslDoc.createElement("xsl:variable");
	                        elm.setAttribute("name", i);
	                        elm.setAttribute("select", "'" + o + "'");
	                        elm.setAttribute("xmlns:xsl", "http://www.w3.org/1999/XSL/Transform");
*/
	                        xslDoc.childNodes.item(1).insertBefore(elm,  xslDoc.documentElement.childNodes(0) );
	                	}); 
                	} catch(e) {
                		console.log(e);
                	}
                }                
                
                // IE BUG fix (템플릿 작업이 있었거나 Define 추가작업이 있었을경우 reload 함
                if  (this.templateName != "" || this.templateDefine != "" ) {
                    //  IE  call-template bug reload 
                    var xslDoc2 = new ActiveXObject("MSXML2.FreeThreadedDOMDocument.6.0");
                    xslDoc2.async = false;
                    xslDoc2.loadXML(xslDoc.xml);
                    xslDoc = xslDoc2;
                }

                processor.stylesheet = xslDoc;
                var objXSLTProc = processor.createProcessor();
                objXSLTProc.input = xmlDoc;
                objXSLTProc.transform();
                var result = objXSLTProc.output;
                if( DEBUG ) {
            		console.log("Xslt:: Success.");
            	}
                if (documentId != null && documentId != "") {
                    isObject(documentId, function () {
                        document.getElementById(documentId).innerHTML = result;
                    });
                }
                
                if (end_event != null) {
                    end_event(result);
                }
/*
            } catch (e) {
            	if( DEBUG ) {
            		console.log("Xslt:: XSLT Transform: " + e);
            	}
                // 7 depth bug
                xsltTransform(this.documentId, this.xmlFile, this.xslFile, this.param, this.end_event, this.templateName, declare);
            }
*/
        }
    };
}

// chrome bug 있음
//function loadXML(file)
//{
//    var xmlDoc = null;
//    try //Internet Explorer
//    {
//        xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
//        xmlDoc.async=false;
//        xmlDoc.load(file);
//    }
//    catch(e)
//    {
//        try //Firefox, Mozilla, Opera, etc.
//        {
//            xmlDoc=document.implementation.createDocument("","",null);
//            xmlDoc.async=false;
//            xmlDoc.load(file);
//        }
//        catch(e)
//        {
//            try //Google Chrome
//            {
//                var xmlhttp = new window.XMLHttpRequest();
//                xmlhttp.open("GET",file,false);
//                xmlhttp.send(null);
//                xmlDoc = xmlhttp.responseXML.documentElement;
//            }
//            catch(e)
//            {
//            error=e.message;
//            }
//        }
//    }
//    return xmlDoc;
//}
//function xslTransform(xmlObject, xslObject)
//{
//    try 
//    {
//        $("body").append("<div id='test'></div>");
//        var a = $("#test").transform({ xmlobj: xmlObject, xslobj: xslObject });
//    }
//    catch (exception) 
//    {
//        if (typeof (exception) == "object" && exception.message) 
//            alert(exception.message);
//        else alert(exception);
//    }
//}


function Xml(url, parms, method, callback) {
    this.url = url;
    this.parms = parms;
    this.method = method;
    this.callback = callback;
    this.async = true;
    this.create();
    this.req.onreadystatechange = this.dispatch(this);
}

Xml.prototype.dispatch = function (xslt) {
    function funcRef() {
        if (xslt.req.readyState == 4) {
            if (xslt.callback) {
                xslt.callback(xslt.req);
            }
        }
    }
    return funcRef;
};

Xml.prototype.request = function () {
    if (this.method == "POST") {
    	if( this.parms == "" ) {
    		this.req.open("POST", this.url, this.async); // post not send parameter bug
    	} else {
    		this.req.open("POST", this.url + "?" + this.parms, this.async); // post not send parameter bug
    	}
        this.req.send(this.parms);
    } else if (this.method == "GET") {
    	if( this.parms == "" ) {
    		this.req.open("GET", this.url, this.async); // post not send parameter bug
    	} else {
    		this.req.open("GET", this.url + "?" + this.parms, this.async); // post not send parameter bug
    	}
        this.req.send(null);
    }
};

Xml.prototype.setAsync = function (async) {
    this.async = async;
};

Xml.prototype.create = function () {
    var xmlhttp = null;
    if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
        try {
            xmlhttp = new XMLHttpRequest();
        } catch (e) {
            xmlhttp = false;
        }
    }
    this.req = xmlhttp;
};

function xsltTransform(target, XMLPath, XSLTPath, Param, end_event, templateName, declare) {
    Param = encodeText(Param);
    var xsltProcessor = "./xsltProcessor";
    var xsltParam = new Parameter()
        .addParam("xml", XMLPath)
        .addParam("xsl", XSLTPath)
        .addParam("param", Param)
        .addParam("template", templateName)
        .addParam("declare", declare)
        .value;
    $.ajax({
        type: "post",
        url: xsltProcessor,
        data: xsltParam,
        dataType: "text",
        success: function (data) {
            if (target != null) {
                document.getElementById(target).innerHTML = data;
            }
            if (end_event != null) {
                end_event(data);
            }
        }
    });
};

function trim(str) {
    if (str == undefined || str == null) {
        str = "";
    } else {
        str = str.replace(/^\s*/, '').replace(/\s*$/, '');
    }
    return str;
};

function nameFilter(id) {
    $("#" + id).val($("#" + id).val().replace(/[~!\#$^%&* \=+|:;?"<,.>(@)']/gi, ""));
};

function idFilter(id) {
    $("#" + id).val($("#" + id).val().replace(/[~!\#$^%&* \=+|:;?"<,.>(@)']/gi, ""));
};

function emailFilter(id) {
    $("#" + id).val($("#" + id).val().replace(/[~!\#$^%&* \=+|:;?"<,>()']/gi, ""));
};

function nameCheck(id) {
    var str = $("#" + id).val();
    var strlen = str.length;
    var json = {};
    json.success = true;
    json.reason = "";
    json.error = 0;

    if (strlen < 2) {
        json.success = false;
        json.reason = "2글자 이상";
        json.error = -1;
    } else if (strlen > 10) {
        json.success = false;
        json.reason = "10글자 이하";
        json.error = -2;
    } else {
        for (var i = 0; i < strlen; i++) {
            var c = str.charCodeAt(i);
            //65~90 대문자, 97~122 소문자, 44032~55203 완성형한글
            if (!(c >= 65 && c <= 90) && !(c >= 97 && c <= 122) && !(c >= 44032 && c <= 55203)) {
                json.success = false;
                json.reason = "특수문자 포함";
                json.error = -3;
                break;
            }
        }
    }
    return json;
};

//
// * 아이디 유효성 검사
// * @description
//		id check 4글자 이상, 첫글자 대문자/소문자
// 		error 1 : 글자수 제한 4
// 		error 2 : 글자수 초과 12
// 		error 3 : 올바르지 않은 형식
// * @param id
// * @returns JSONObject

function idCheck(id) {
    $("#" + id).val($("#" + id).val().replace(/[~!\#$^%&* \=+|:;?"<,.>(@)']/gi, ""));
    var str = $("#" + id).val();
    var strlen = str.length;
    var json = {};

    json.success = true;
    json.reason = "";
    json.error = 0;

    if (strlen < 4) {
        json.success = false;
        json.reason = "4글자 이상";
        json.error = -1;
    } else if (strlen > 12) {
        json.success = false;
        json.reason = "12글자 이하";
        json.error = -2;
    } else {
        var c = str.charCodeAt(0);
        if ((c >= 65 && c <= 90) || (c >= 97 && c <= 122)) {
            json.success = true;
            json.reason = "";
            json.error = 0;
            for (var i = 1; i < strlen; i++) {
                c = str.charCodeAt(i);
                //65~90 대문자, 97~122 소문자, 0 ~ 9 
                if (!(c >= 65 && c <= 90) && !(c >= 97 && c <= 122) && !(c >= 48 && c <= 57)) {
                    json.success = false;
                    json.reason = "올바르지 않은 문자";
                    json.error = -3;
                    break;
                }
            }
        } else {
            json.success = false;
            json.reason = "올바르지 않은 문자";
            json.error = -3;
        }
    }
    return json;
};

/**
 * 비밀번호 유효성 검사
 * @description
	password Check 6글자 이상 24글자 이하 대/소/숫자 포함
	error 1 : 글자수 제한 6
	error 2 : 글자수 초과 24
	error 3 : 대/소문자 숫자 포함
 * @param id
 * @returns JSONObject
 */
function passwordCheck(id) {
    var json = {};
    var str = $("#" + id).val();
    var strlen = str.length;
    var regex;
    var regexkey = new Array(".*[a-z]+.*",
        ".*[A-Z]+.*",
        ".*\\d+.*");
    json.success = true;
    json.reason = "";
    json.error = 0;

    if (strlen < 6) {
        json.success = false;
        json.reason = "6글자 이상";
        json.error = -1;
    } else if (strlen > 24) {
        json.success = false;
        json.reason = "24글자 이하";
        json.error = -2;
    } else {
        for (var i = 0; i < 3; i++) {
            regex = new RegExp(regexkey[i]);
            if (!regex.test(str)) {
                json.success = false;
                json.reason = "대/소문자 숫자 포함";
                json.error = -3;
            }
        }
    }
    return json;
};

function emailCheck() {
    var regex = new RegExp("^(?:\\w+\\.?)*\\w+@(?:\\w+\\.)+\\w+$");
    return regex.test($("#email").val());
};


function isObject(id, event) {
    if ($("#" + id).length > 0) {
        event();
    }
};

function bind(elementObject, eventName, event) {
    if (elementObject != null && elementObject != undefined && event != undefined) {
        $(elementObject).unbind(eventName);
        $(elementObject).bind(eventName, event);
    }
};

function unbind(elementObject) {
    $(elementObject).unbind();
};

// encode % fix
function encodeText(str) {
    if (str == undefined || str == null) {
        return "";
    } else {
        str = str.replace(/%/gi, "%25");
        str = str.replace(/\+/g, "%2B");
        str = encodeURIComponent(str);
        return str;
    }
};

function decodeText(str) {
	str = str.replace(/%/gi, "%25");
	var map = {"gt":">" /* , … */};
    str = str.replace(/&(#(?:x[0-9a-f]+|\d+)|[a-z]+);?/gi, function($0, $1) {
        if ($1[0] === "#") {
            return String.fromCharCode($1[1].toLowerCase() === "x" ? parseInt($1.substr(2), 16)  : parseInt($1.substr(1), 10));
        } else {
            return map.hasOwnProperty($1) ? map[$1] : $0;
        }
    });
    str = decodeURIComponent(str);
    return str;
};

/**
 * userAgent Lower Case
 */
function userAgent() {
    var userAgent = navigator.userAgent.toLowerCase();
    return userAgent;
};

function isNull(obj) {
	try {
		if( typeof(obj) == "undefined" ||
			obj == null ||  
			obj == undefined ) { 
			return true;
		} else {
			return false;
		}
	} catch (e) {
		return true;
	}
};

function isNotNull(str) {
    if (str == null || str == undefined) {
        return false;
    } else {
        return true;
    }
};


/**
 * Smart editor device support
 */
function getSESupportDevice() {
    var userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.indexOf("iphone") > -1 || userAgent.indexOf("ipad") > -1 || userAgent.indexOf("msie 7") > -1) // 아이폰, 아이패드
    {
        return false;
    } else if (userAgent.indexOf("opera") > -1) {
        return false;

    } else if ((!(userAgent.indexOf("chrome") > -1) && userAgent.indexOf("safari/53") > -1) || userAgent.indexOf("android") > -1) // 갤럭시 탭, 안드로이드폰
    {
        return false;
    } else {
        return true;
    }
};

/**
 * i18n functions : i18n.js 참조
 * alert(_("Display translated string"));
 */
function stripStr(str) {
    return str.replace(/^\s*/, "").replace(/\s*$/, "");
};

function stripStrML(str) {
    var parts = str.split('\n');
    for (var i = 0; i < parts.length; i++) {
        parts[i] = stripStr(parts[i]);
    }
    return parts.join(" ");
};

// Return translation
function _(str) {
    if (i18nDict && i18nDict[str]) {
        return i18nDict[str].replace(/\n/g, "<br />"); // 자동 줄바꿈
    }
    return str;
};


function getLocale() {
    var locale = $.getURLParam("locale");

    if (locale != null) {
        return locale;
    }

    if (navigator) {
        if (navigator.language) {
            return navigator.language;
        } else if (navigator.browserLanguage) {
            return navigator.browserLanguage;
        } else if (navigator.systemLanguage) {
            return navigator.systemLanguage;
        } else if (navigator.userLanguage) {
            return navigator.userLanguage;
        }
    }
};

/*

	document.write("[1] 브라우저 이름 : ", navigator.appName, "<BR>");
	document.write("[2] 이름/버전 이름 : ", navigator.userAgent, "<BR>");
	document.write("[3] 버전 : ", navigator.appVersion, "<BR>");
	document.write("[4] 코드 : ", navigator.appCodeName, "<BR>");
	document.write("[5] 언어 : ", navigator.language, "<BR>");
	document.write("[6] 시스템 환경 : ", navigator.platform, "<BR>");
	document.write("[7] 스크립트 가능 유무 : ", navigator.javaEnabled(), "<BR>");
	document.write("[8] 오류 유무 : ", navigator.taintEnabled(), "<BR>");
 */


/**
 * Mobile Device & Browser
 * @returns {Boolean}
 */
function isMobile() {
    var uAgent = navigator.userAgent.toLowerCase();
    var mobilePhones = new Array("iphone", "ipad", "firefox", "android", "shw");

    var isMobile = false;

    for (var i = 0; i < mobilePhones.length; i++) {
        if (uAgent.indexOf(mobilePhones[i]) != -1) {
            isMobile = true;
            break;
        }
    }
    return isMobile;
};

function isPhone() {
    var uAgent = navigator.userAgent.toLowerCase();
    var mobilePhones = new Array("iphone", "android");

    var isMobile = false;

    for (var i = 0; i < mobilePhones.length; i++) {
        if (uAgent.indexOf(mobilePhones[i]) != -1) {
            isMobile = true;
            break;
        }
    }
    return isMobile;
};


function isDevice(name) {
    var uAgent = navigator.userAgent.toLowerCase();
    var isMobile = false;
    if (uAgent.indexOf(name) != -1) {
        isMobile = true;
    }
    return isMobile;
};

function isiPad() // iPad
{
    return isDevice("ipad");
};

function isiPhone() // iPhone
{
    return isDevice("iphone");
};

function isFirefox() // FireFox
{
    return isDevice("firefox");
};

function isAndroid() // other android phone
{
    return isDevice("android");
};

function isGalaxytab() // galaxy tab
{
    return isDevice("shw");
};

function isChrome() // google chrome
{
    return isDevice("chrome");
};

function isSafari() // apple safari
{
    return isDevice("safari");
};

function isIE() // ms internet explorer
{
    return isDevice("msie");
};

function isOpera() // opera
{
    return isDevice("opera");
};

function resizeIframe(id) {
    $(id).css("height", $(id).contents().find("body").height());
};



var Base64 = {
    // private property
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    // public method for encoding
    encode: function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = Base64._utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
        }
        return output;
    },
    // public method for decoding
    decode: function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = Base64._utf8_decode(output);
        return output;
    },
    // private method for UTF-8 encoding
    _utf8_encode: function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    },
    // private method for UTF-8 decoding
    _utf8_decode: function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
};



/*
function Convert(object) {
    this.object = object;
    this.xmlToJSON = function () {
        return xml2json(this.object);
    };
    this.stringToJSON = function () {
        return xml2json(createXMLFromString(this.object), "");
    };
}
*/

var XML = {
	parse: function(xml) { 
	   var dom = null;
	   if (window.DOMParser) {
	      try { 
	         dom = (new DOMParser()).parseFromString(xml, "text/xml"); 
	      } 
	      catch (e) { dom = null; }
	   }
	   else if (window.ActiveXObject) {
	      try {
	         dom = new ActiveXObject('Microsoft.XMLDOM');
	         dom.async = false;
	         if (!dom.loadXML(xml)) // parse error ..

	            window.alert(dom.parseError.reason + dom.parseError.srcText);
	      } 
	      catch (e) { dom = null; }
	   }
	   else
	      alert("cannot parse xml string!");
	   return dom;
	}
};
/*	This work is licensed under Creative Commons GNU LGPL License.

License: http://creativecommons.org/licenses/LGPL/2.1/
Version: 0.9
Author:  Stefan Goessner/2006
Web:     http://goessner.net/ 
*/
function xml2json(xml, tab) {
    var X = {
        toObj: function (xml) {
        	if(tab == undefined) {
        		tab = "";
        	}
        	if( (typeof xml) == "string" ) {
        		xml = XML.parse(xml);
        	}
            var o = {};
            if (xml.nodeType == 1) { // element node ..
                if (xml.attributes.length) // element with attributes  ..
                for (var i = 0; i < xml.attributes.length; i++)
                o["@" + xml.attributes[i].nodeName] = (xml.attributes[i].nodeValue || "").toString();
                if (xml.firstChild) { // element has child nodes ..
                    var textChild = 0,
                        cdataChild = 0,
                        hasElementChild = false;
                    for (var n = xml.firstChild; n; n = n.nextSibling) {
                        if (n.nodeType == 1) hasElementChild = true;
                        else if (n.nodeType == 3 && n.nodeValue.match(/[^ \f\n\r\t\v]/)) textChild++; // non-whitespace text
                        else if (n.nodeType == 4) cdataChild++; // cdata section node
                    }
                    if (hasElementChild) {
                        if (textChild < 2 && cdataChild < 2) { // structured element with evtl. a single text or/and cdata node ..
                            X.removeWhite(xml);
                            for (var n = xml.firstChild; n; n = n.nextSibling) {
                                if (n.nodeType == 3) // text node
                                o["#text"] = X.escape(n.nodeValue);
                                else if (n.nodeType == 4) // cdata node
                                o["#cdata"] = X.escape(n.nodeValue);
                                else if (o[n.nodeName]) { // multiple occurence of element ..
                                    if (o[n.nodeName] instanceof Array) o[n.nodeName][o[n.nodeName].length] = X.toObj(n);
                                    else o[n.nodeName] = [o[n.nodeName], X.toObj(n)];
                                } else // first occurence of element..
                                o[n.nodeName] = X.toObj(n);
                            }
                        } else { // mixed content
                            if (!xml.attributes.length) o = X.escape(X.innerXml(xml));
                            else o["#text"] = X.escape(X.innerXml(xml));
                        }
                    } else if (textChild) { // pure text
                        if (!xml.attributes.length) o = X.escape(X.innerXml(xml));
                        else o["#text"] = X.escape(X.innerXml(xml));
                    } else if (cdataChild) { // cdata
                        if (cdataChild > 1) o = X.escape(X.innerXml(xml));
                        else for (var n = xml.firstChild; n; n = n.nextSibling)
                        o["#cdata"] = X.escape(n.nodeValue);
                    }
                }
                if (!xml.attributes.length && !xml.firstChild) o = null;
            } else if (xml.nodeType == 9) { // document.node
                o = X.toObj(xml.documentElement);
            } else alert("unhandled node type: " + xml.nodeType);
            return o;
        },
        toJson: function (o, name, ind) {
            var json = name ? ("\"" + name + "\"") : "";
            if (o instanceof Array) {
                for (var i = 0, n = o.length; i < n; i++)
                o[i] = X.toJson(o[i], "", ind + "\t");
                json += (name ? ":[" : "[") + (o.length > 1 ? ("\n" + ind + "\t" + o.join(",\n" + ind + "\t") + "\n" + ind) : o.join("")) + "]";
            } else if (o == null) json += (name && ":") + "null";
            else if (typeof (o) == "object") {
                var arr = [];
                for (var m in o)
                arr[arr.length] = X.toJson(o[m], m, ind + "\t");
                json += (name ? ":{" : "{") + (arr.length > 1 ? ("\n" + ind + "\t" + arr.join(",\n" + ind + "\t") + "\n" + ind) : arr.join("")) + "}";
            } else if (typeof (o) == "string") json += (name && ":") + "\"" + o.toString() + "\"";
            else json += (name && ":") + o.toString();
            return json;
        },
        innerXml: function (node) {
            var s = ""
            if ("innerHTML" in node) s = node.innerHTML;
            else {
                var asXml = function (n) {
                    var s = "";
                    if (n.nodeType == 1) {
                        s += "<" + n.nodeName;
                        for (var i = 0; i < n.attributes.length; i++)
                        s += " " + n.attributes[i].nodeName + "=\"" + (n.attributes[i].nodeValue || "").toString() + "\"";
                        if (n.firstChild) {
                            s += ">";
                            for (var c = n.firstChild; c; c = c.nextSibling)
                            s += asXml(c);
                            s += "</" + n.nodeName + ">";
                        } else s += "/>";
                    } else if (n.nodeType == 3) s += n.nodeValue;
                    else if (n.nodeType == 4) s += "<![CDATA[" + n.nodeValue + "]]>";
                    return s;
                };
                for (var c = node.firstChild; c; c = c.nextSibling)
                s += asXml(c);
            }
            return s;
        },
        escape: function (txt) {
            return txt.replace(/[\\]/g, "\\\\")
                .replace(/[\"]/g, '\\"')
                .replace(/[\n]/g, '\\n')
                .replace(/[\r]/g, '\\r');
        },
        removeWhite: function (e) {
            e.normalize();
            for (var n = e.firstChild; n;) {
                if (n.nodeType == 3) { // text node
                    if (!n.nodeValue.match(/[^ \f\n\r\t\v]/)) { // pure whitespace text node
                        var nxt = n.nextSibling;
                        e.removeChild(n);
                        n = nxt;
                    } else n = n.nextSibling;
                } else if (n.nodeType == 1) { // element node
                    X.removeWhite(n);
                    n = n.nextSibling;
                } else // any other node
                n = n.nextSibling;
            }
            return e;
        }
    };
    if (xml.nodeType == 9) // document node
    xml = xml.documentElement;
    var json = X.toJson(X.toObj(X.removeWhite(xml)), xml.nodeName, "\t");
    //return "{\n" + tab + (tab ? json.replace(/\t/g, tab) : json.replace(/\t|\n/g, "")) + "\n}";
    return JSON.parse("{\n" + tab + (tab ? json.replace(/\t/g, tab) : json.replace(/\t|\n/g, "")) + "\n}");
};

/*	This work is licensed under Creative Commons GNU LGPL License.

License: http://creativecommons.org/licenses/LGPL/2.1/
Version: 0.9
Author:  Stefan Goessner/2006
Web:     http://goessner.net/ 
*/
// json2xml(o, tab) 
function json2xml(o, root) {
	var toXml = function (v, name, ind) {
	    var xml = "";
	    if (v instanceof Array) {
	        for (var i = 0, n = v.length; i < n; i++)
	        xml += ind + toXml(v[i], name, ind + "\t") + "\n";
	    } else if (typeof (v) == "object") {
	        var hasChild = false;
	        xml += ind + "<" + name;
	        for (var m in v) {
	            if (m.charAt(0) == "@") xml += " " + m.substr(1) + "=\"" + v[m].toString() + "\"";
	            else hasChild = true;
	        }
	        xml += hasChild ? ">" : "/>";
	        if (hasChild) {
	            for (var m in v) {
	                if (m == "#text") xml += v[m];
	                else if (m == "#cdata") xml += "<![CDATA[" + v[m] + "]]>";
	                else if (m.charAt(0) != "@") xml += toXml(v[m], m, ind + "\t");
	            }
	            xml += (xml.charAt(xml.length - 1) == "\n" ? ind : "") + "</" + name + ">";
	        }
	    } else {
	        xml += ind + "<" + name + ">" + htmlSpecialChar( v.toString() ) + "</" + name + ">";	// 2014-06-19 특수문자 처리
	    }
	    return xml;
	}, xml = "";
	for (var m in o)
	xml += toXml(o[m], m, "");
	
	// return tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "");
	// 2014-06-18 Modify
	if( root != null && root != undefined && String(root) != ""  ) {
		return "<" + String(root) + ">" + xml.replace(/\t|\n/g, "") + "</" + String(root) + ">";
	} else {
		return xml.replace(/\t|\n/g, "");
	}
};


/**
 * DHTML History Call
 */
/*
function Histroy(url, param)
{
	var historyParam = "";
	if (typeof param == "undefined") {
		historyParam = "?param=null";
	}else{
		historyParam = "?" + param;
	}
	XMLHttp(url + historyParam ,his_id);	
}
*/

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 검토가 필요한 부분
function setParamDoubleData(id, innerDelimiter, outerFragment) {
    var param_list = "";
    var count = 1;
    $("[id='" + id + "']").each(function () {
        param_list += count + innerDelimiter + $(this).val() + outerFragment;
        count = count + 1;
    });

    return param_list;
};

// 모바일
function setDeviceSacle() {
    //var userAgent = navigator.userAgent.toLowerCase();
    /*
	if( userAgent.indexOf("iphone") > -1 )			// 아이폰
	{
		if(document.getElementById("menu").style.display != "none")
		{
			menuToggleView("menu");
		}
		
		var meta = document.createElement("meta");
		meta.name = "viewport";
		meta.content = "initial-scale=0.4, width=device-width, target-densitydpi=device-dpi, minimum-scale=0.4, user-scalable=yes";
		document.head.appendChild(meta);
		
		device = "iphone";
	}
	else if( userAgent.indexOf("ipad") > -1 )		// 아이패드
	{
		if(document.getElementById("menu").style.display != "none")
		{
			menuToggleView("menu");
		}
		

		var meta = document.createElement("meta");
		meta.name = "viewport";
		meta.content = "width=device-width, initial-scale=1.0, maximum-scale=2.0, minimum-scale=1.0, user-scalable=yes";
		document.head.appendChild(meta);
		
		device = "ipad";
	}
	else if( ( !(userAgent.indexOf("chrome") > -1) && userAgent.indexOf("safari/53") > -1) || userAgent.indexOf("android") > -1  )	// 갤럭시 탭, 안드로이드폰
	{
		if(document.getElementById("menu").style.display != "none")
		{
			menuToggleView("menu");
		}
		
		var meta = document.createElement("meta");
		meta.name = "viewport";
		meta.content = "initial-scale=0.4, width=device-width, target-densitydpi=device-dpi, minimum-scale=0.4, user-scalable=yes";
		document.head.appendChild(meta);
		
		device = "android";
	}
	else
	{
		if(document.getElementById("menu").style.display != "none")
		{
			menuToggleView("menu");
		}
		
		var meta = document.createElement("meta");
		meta.name = "viewport";
		meta.content = "initial-scale=1.0, width=device-width, target-densitydpi=device-dpi, minimum-scale=0.5, user-scalable=yes";
		document.head.appendChild(meta);
		
		
		device = "android";
	}
*/
};

function Paging(contentTarget, pagingTarget, listCount, totalCount) {
    this.pagingTarget = pagingTarget;
    this.contentTarget = contentTarget;
    this.totalCount = totalCount;
    this.listCount = listCount;
    this.currentPage = null;
    this.pageCount = null;
    this.endEvent = null;
    this.onClickEvent = null;

    var left_end = "/img/left_end.png";
    var left_one = "/img/left_one.png";
    var right_one = "/img/right_one.png";
    var right_end = "/img/right_end.png";

    this.setCurrentPage = function (currentPage) {
        this.currentPage = currentPage;
        return this;
    };
    this.setPageCount = function (pageCount) {
        this.pageCount = pageCount;
        return this;
    };
    this.execute = function (onClickEvent, endEvent) {
        if (this.currentPage == null) {
            this.currentPage = 1;
        }
        var tmpMaxPage = Math.ceil(this.totalCount / this.listCount);
        var minPage = 1;
        var maxPage = parseInt(tmpMaxPage);
        //		var tmpTotalCount 	= parseInt(this.totalCount);
        //		var tmpListCount  	= parseInt(this.listCount);
        //		var tmpPageCount  	= parseInt(this.pageCount);

        var pageGroupCount = (this.totalCount / this.listCount) / this.pageCount;
        var startPage = parseInt((this.currentPage - 1) / this.pageCount);

        if (startPage > pageGroupCount) {
            startPage = parseInt(pageGroupCount);
        }

        var loopStart = startPage * this.pageCount + 1;
        var loopEnd = ((startPage * this.pageCount) + this.pageCount);
        if (loopEnd > maxPage) {
            loopEnd = maxPage;
        }

        //		var moveRightPageNumber = (loopEnd +1);
        if (startPage == parseInt(pageGroupCount)) {
            moveRightPageNumber = maxPage;
        }

        // todo: 파라메터 값주의 " , ' 값에 따라 문제 발생

        //<%=scriptCode%>',<%=minPage%>, <%=totalCount%>,<%=listCount%>,'<%=pagingTarget%>','<%=contentTarget%>
        //	1, this.contentTarget, this.pagingTarget
        //	onClickEvent(컨텐츠, 페이징, 이동할페이지번호, 목록갯수, 전체카운트)
        var NormalPaging = "<div id=\"paging\"><ul><li onClick=\"(" + onClickEvent + "(" + minPage + "," + totalCount + "));\"><img src=\"" + left_end + "\" /></li>";
        if (this.currentPage != 1) {
            NormalPaging += "<li class=\"naviLeft\" onClick=\"(" + onClickEvent + "(" + (parseInt(this.currentPage) - 1) + "," + totalCount + "));\"><img src=\"" + left_one + "\" /></li>";
        } else {
            NormalPaging += "<li class=\"naviLeft\" onClick=\"(" + onClickEvent + "(" + minPage + "," + totalCount + "));\"><img src=\"" + left_one + "\" /></li>";
        }
        // page start
        for (var i = loopStart; i < loopEnd + 1; i++) {
            if (this.currentPage == i) {

                NormalPaging += "<li class=\"num numSelect\" onClick=\"(" + onClickEvent + "(" + i + "," + totalCount + "));\">" + i + "</li>";
            } else {
                NormalPaging += "<li class=\"num\" onClick=\"(" + onClickEvent + "(" + i + "," + totalCount + "));\">" + i + "</li>";
            }
        }
        // page end
        if (this.currentPage != maxPage) {
            NormalPaging += "<li class=\"naviRight\" onClick=\"(" + onClickEvent + "(" + (parseInt(this.currentPage) + 1) + "," + totalCount + "));\"><img src=\"" + right_one + "\" /></li>";
        } else {
            NormalPaging += "<li class=\"naviRight\" onClick=\"(" + onClickEvent + "(" + maxPage + "," + totalCount + "));\"><img src=\"" + right_one + "\" /></li>";
        }
        NormalPaging += "<li onClick=\"(" + onClickEvent + "(" + maxPage + "," + totalCount + "));\"><img src=\"" + right_end + "\" /></li></ul></div>";

        var JumpPaging = "";

        document.getElementById(this.pagingTarget).innerHTML = "<div class=\"pagingLayout\">" + NormalPaging + JumpPaging + "</div>";

        $("#" + this.pagingTarget + " input:button").button();

        if (endEvent != null) {
            endEvent();
        }
    };
};

function moneyComma(money){
	money = money.toString();
	money = money.replace(/[^0-9]/gi,'');
	var moneyStr = money.toString().replace(/(\d)(?=(\d\d\d)+$)/g , '$1,');
	return moneyStr;
};

// object일경우 arguments
// function일경우 직접입력한 함수
// apply를 통해 내부 함수에 직접 파라메터 형태로 입력
function invoke( obj, args ) {
	if( typeof(obj) != "undefined" ) {
		if( typeof(obj) == "function") {
			if( typeof(args) != "undefined") {
				if( typeof(args) == "object" ) {
					obj.apply(this, args);
				}
			} else {
				obj();
			}
		} else if( typeof(obj) == "object" ) {
			if( typeof(obj[0]) == "object" && typeof(obj[1]) == "string"  ) { 
				if ( obj[0].constructor.name == "Sjax" ) {
					try { obj[0].end(obj[1]); } catch(e) { }
				}
			}
			else if( typeof( obj[ obj.length - 1 ] ) != "undefined" ) {	
				if( typeof( obj[ obj.length - 1 ] ) == "function") {
					
					if( typeof(args) != "undefined") {
						if( typeof(args) == "object" ) {
							obj[ obj.length - 1 ].apply(this, args);
						}
					} else {
						obj[ obj.length - 1 ]();
					}
					
				}
			}
		}
	}
};



function htmlSpecialChar(str) {
    return str.replace(/&/g, "&amp;")
    		.replace(/</g, "&lt;")
    		.replace(/>/g, "&gt;")
    		.replace(/"/g, "&quot;");
};

/**
 * A Javascript object to encode and/or decode html characters using HTML or Numeric entities that handles double or partial encoding
 * Author: R Reid
 * source: http://www.strictly-software.com/htmlencode
 * Licences: GPL, The MIT License (MIT)
 * Copyright: (c) 2011 Robert Reid - Strictly-Software.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 * Revision:
 *  2011-07-14, Jacques-Yves Bleau: 
 *       - fixed conversion error with capitalized accentuated characters
 *       + converted arr1 and arr2 to object property to remove redundancy
 *
 * Revision:
 *  2011-11-10, Ce-Yi Hio: 
 *       - fixed conversion error with a number of capitalized entity characters
 *
 * Revision:
 *  2011-11-10, Rob Reid: 
 *		 - changed array format
 *
 * Revision:
 *  2012-09-23, Alex Oss: 
 *		 - replaced string concatonation in numEncode with string builder, push and join for peformance with ammendments by Rob Reid
 */

Encoder = {

	// When encoding do we convert characters into html or numerical entities
	EncodeType : "entity",  // entity OR numerical

	isEmpty : function(val){
		if(val){
			return ((val===null) || val.length==0 || /^\s+$/.test(val));
		}else{
			return true;
		}
	},
	
	// arrays for conversion from HTML Entities to Numerical values
	arr1: ['&nbsp;','&iexcl;','&cent;','&pound;','&curren;','&yen;','&brvbar;','&sect;','&uml;','&copy;','&ordf;','&laquo;','&not;','&shy;','&reg;','&macr;','&deg;','&plusmn;','&sup2;','&sup3;','&acute;','&micro;','&para;','&middot;','&cedil;','&sup1;','&ordm;','&raquo;','&frac14;','&frac12;','&frac34;','&iquest;','&Agrave;','&Aacute;','&Acirc;','&Atilde;','&Auml;','&Aring;','&AElig;','&Ccedil;','&Egrave;','&Eacute;','&Ecirc;','&Euml;','&Igrave;','&Iacute;','&Icirc;','&Iuml;','&ETH;','&Ntilde;','&Ograve;','&Oacute;','&Ocirc;','&Otilde;','&Ouml;','&times;','&Oslash;','&Ugrave;','&Uacute;','&Ucirc;','&Uuml;','&Yacute;','&THORN;','&szlig;','&agrave;','&aacute;','&acirc;','&atilde;','&auml;','&aring;','&aelig;','&ccedil;','&egrave;','&eacute;','&ecirc;','&euml;','&igrave;','&iacute;','&icirc;','&iuml;','&eth;','&ntilde;','&ograve;','&oacute;','&ocirc;','&otilde;','&ouml;','&divide;','&oslash;','&ugrave;','&uacute;','&ucirc;','&uuml;','&yacute;','&thorn;','&yuml;','&quot;','&amp;','&lt;','&gt;','&OElig;','&oelig;','&Scaron;','&scaron;','&Yuml;','&circ;','&tilde;','&ensp;','&emsp;','&thinsp;','&zwnj;','&zwj;','&lrm;','&rlm;','&ndash;','&mdash;','&lsquo;','&rsquo;','&sbquo;','&ldquo;','&rdquo;','&bdquo;','&dagger;','&Dagger;','&permil;','&lsaquo;','&rsaquo;','&euro;','&fnof;','&Alpha;','&Beta;','&Gamma;','&Delta;','&Epsilon;','&Zeta;','&Eta;','&Theta;','&Iota;','&Kappa;','&Lambda;','&Mu;','&Nu;','&Xi;','&Omicron;','&Pi;','&Rho;','&Sigma;','&Tau;','&Upsilon;','&Phi;','&Chi;','&Psi;','&Omega;','&alpha;','&beta;','&gamma;','&delta;','&epsilon;','&zeta;','&eta;','&theta;','&iota;','&kappa;','&lambda;','&mu;','&nu;','&xi;','&omicron;','&pi;','&rho;','&sigmaf;','&sigma;','&tau;','&upsilon;','&phi;','&chi;','&psi;','&omega;','&thetasym;','&upsih;','&piv;','&bull;','&hellip;','&prime;','&Prime;','&oline;','&frasl;','&weierp;','&image;','&real;','&trade;','&alefsym;','&larr;','&uarr;','&rarr;','&darr;','&harr;','&crarr;','&lArr;','&uArr;','&rArr;','&dArr;','&hArr;','&forall;','&part;','&exist;','&empty;','&nabla;','&isin;','&notin;','&ni;','&prod;','&sum;','&minus;','&lowast;','&radic;','&prop;','&infin;','&ang;','&and;','&or;','&cap;','&cup;','&int;','&there4;','&sim;','&cong;','&asymp;','&ne;','&equiv;','&le;','&ge;','&sub;','&sup;','&nsub;','&sube;','&supe;','&oplus;','&otimes;','&perp;','&sdot;','&lceil;','&rceil;','&lfloor;','&rfloor;','&lang;','&rang;','&loz;','&spades;','&clubs;','&hearts;','&diams;'],
	arr2: ['&#160;','&#161;','&#162;','&#163;','&#164;','&#165;','&#166;','&#167;','&#168;','&#169;','&#170;','&#171;','&#172;','&#173;','&#174;','&#175;','&#176;','&#177;','&#178;','&#179;','&#180;','&#181;','&#182;','&#183;','&#184;','&#185;','&#186;','&#187;','&#188;','&#189;','&#190;','&#191;','&#192;','&#193;','&#194;','&#195;','&#196;','&#197;','&#198;','&#199;','&#200;','&#201;','&#202;','&#203;','&#204;','&#205;','&#206;','&#207;','&#208;','&#209;','&#210;','&#211;','&#212;','&#213;','&#214;','&#215;','&#216;','&#217;','&#218;','&#219;','&#220;','&#221;','&#222;','&#223;','&#224;','&#225;','&#226;','&#227;','&#228;','&#229;','&#230;','&#231;','&#232;','&#233;','&#234;','&#235;','&#236;','&#237;','&#238;','&#239;','&#240;','&#241;','&#242;','&#243;','&#244;','&#245;','&#246;','&#247;','&#248;','&#249;','&#250;','&#251;','&#252;','&#253;','&#254;','&#255;','&#34;','&#38;','&#60;','&#62;','&#338;','&#339;','&#352;','&#353;','&#376;','&#710;','&#732;','&#8194;','&#8195;','&#8201;','&#8204;','&#8205;','&#8206;','&#8207;','&#8211;','&#8212;','&#8216;','&#8217;','&#8218;','&#8220;','&#8221;','&#8222;','&#8224;','&#8225;','&#8240;','&#8249;','&#8250;','&#8364;','&#402;','&#913;','&#914;','&#915;','&#916;','&#917;','&#918;','&#919;','&#920;','&#921;','&#922;','&#923;','&#924;','&#925;','&#926;','&#927;','&#928;','&#929;','&#931;','&#932;','&#933;','&#934;','&#935;','&#936;','&#937;','&#945;','&#946;','&#947;','&#948;','&#949;','&#950;','&#951;','&#952;','&#953;','&#954;','&#955;','&#956;','&#957;','&#958;','&#959;','&#960;','&#961;','&#962;','&#963;','&#964;','&#965;','&#966;','&#967;','&#968;','&#969;','&#977;','&#978;','&#982;','&#8226;','&#8230;','&#8242;','&#8243;','&#8254;','&#8260;','&#8472;','&#8465;','&#8476;','&#8482;','&#8501;','&#8592;','&#8593;','&#8594;','&#8595;','&#8596;','&#8629;','&#8656;','&#8657;','&#8658;','&#8659;','&#8660;','&#8704;','&#8706;','&#8707;','&#8709;','&#8711;','&#8712;','&#8713;','&#8715;','&#8719;','&#8721;','&#8722;','&#8727;','&#8730;','&#8733;','&#8734;','&#8736;','&#8743;','&#8744;','&#8745;','&#8746;','&#8747;','&#8756;','&#8764;','&#8773;','&#8776;','&#8800;','&#8801;','&#8804;','&#8805;','&#8834;','&#8835;','&#8836;','&#8838;','&#8839;','&#8853;','&#8855;','&#8869;','&#8901;','&#8968;','&#8969;','&#8970;','&#8971;','&#9001;','&#9002;','&#9674;','&#9824;','&#9827;','&#9829;','&#9830;'],
		
	// Convert HTML entities into numerical entities
	HTML2Numerical : function(s){
		return this.swapArrayVals(s,this.arr1,this.arr2);
	},	

	// Convert Numerical entities into HTML entities
	NumericalToHTML : function(s){
		return this.swapArrayVals(s,this.arr2,this.arr1);
	},


	// Numerically encodes all unicode characters
	numEncode : function(s){ 
		if(this.isEmpty(s)) return ""; 

		var a = [],
			l = s.length; 
		
		for (var i=0;i<l;i++){ 
			var c = s.charAt(i); 
			if (c < " " || c > "~"){ 
				a.push("&#"); 
				a.push(c.charCodeAt()); //numeric value of code point 
				a.push(";"); 
			}else{ 
				a.push(c); 
			} 
		} 
		
		return a.join(""); 	
	}, 
	
	// HTML Decode numerical and HTML entities back to original values
	htmlDecode : function(s){

		var c,m,d = s;
		
		if(this.isEmpty(d)) return "";

		// convert HTML entites back to numerical entites first
		d = this.HTML2Numerical(d);
		
		// look for numerical entities &#34;
		arr=d.match(/&#[0-9]{1,5};/g);
		
		// if no matches found in string then skip
		if(arr!=null){
			for(var x=0;x<arr.length;x++){
				m = arr[x];
				c = m.substring(2,m.length-1); //get numeric part which is refernce to unicode character
				// if its a valid number we can decode
				if(c >= -32768 && c <= 65535){
					// decode every single match within string
					d = d.replace(m, String.fromCharCode(c));
				}else{
					d = d.replace(m, ""); //invalid so replace with nada
				}
			}			
		}

		return d;
	},		

	// encode an input string into either numerical or HTML entities
	htmlEncode : function(s,dbl){
			
		if(this.isEmpty(s)) return "";

		// do we allow double encoding? E.g will &amp; be turned into &amp;amp;
		dbl = dbl || false; //default to prevent double encoding
		
		// if allowing double encoding we do ampersands first
		if(dbl){
			if(this.EncodeType=="numerical"){
				s = s.replace(/&/g, "&#38;");
			}else{
				s = s.replace(/&/g, "&amp;");
			}
		}

		// convert the xss chars to numerical entities ' " < >
		s = this.XSSEncode(s,false);
		
		if(this.EncodeType=="numerical" || !dbl){
			// Now call function that will convert any HTML entities to numerical codes
			s = this.HTML2Numerical(s);
		}

		// Now encode all chars above 127 e.g unicode
		s = this.numEncode(s);

		// now we know anything that needs to be encoded has been converted to numerical entities we
		// can encode any ampersands & that are not part of encoded entities
		// to handle the fact that I need to do a negative check and handle multiple ampersands &&&
		// I am going to use a placeholder

		// if we don't want double encoded entities we ignore the & in existing entities
		if(!dbl){
			s = s.replace(/&#/g,"##AMPHASH##");
		
			if(this.EncodeType=="numerical"){
				s = s.replace(/&/g, "&#38;");
			}else{
				s = s.replace(/&/g, "&amp;");
			}

			s = s.replace(/##AMPHASH##/g,"&#");
		}
		
		// replace any malformed entities
		s = s.replace(/&#\d*([^\d;]|$)/g, "$1");

		if(!dbl){
			// safety check to correct any double encoded &amp;
			s = this.correctEncoding(s);
		}

		// now do we need to convert our numerical encoded string into entities
		if(this.EncodeType=="entity"){
			s = this.NumericalToHTML(s);
		}

		return s;					
	},

	// Encodes the basic 4 characters used to malform HTML in XSS hacks
	XSSEncode : function(s,en){
		if(!this.isEmpty(s)){
			en = en || true;
			// do we convert to numerical or html entity?
			if(en){
				s = s.replace(/\'/g,"&#39;"); //no HTML equivalent as &apos is not cross browser supported
				s = s.replace(/\"/g,"&quot;");
				s = s.replace(/</g,"&lt;");
				s = s.replace(/>/g,"&gt;");
			}else{
				s = s.replace(/\'/g,"&#39;"); //no HTML equivalent as &apos is not cross browser supported
				s = s.replace(/\"/g,"&#34;");
				s = s.replace(/</g,"&#60;");
				s = s.replace(/>/g,"&#62;");
			}
			return s;
		}else{
			return "";
		}
	},

	// returns true if a string contains html or numerical encoded entities
	hasEncoded : function(s){
		if(/&#[0-9]{1,5};/g.test(s)){
			return true;
		}else if(/&[A-Z]{2,6};/gi.test(s)){
			return true;
		}else{
			return false;
		}
	},

	// will remove any unicode characters
	stripUnicode : function(s){
		return s.replace(/[^\x20-\x7E]/g,"");
		
	},

	// corrects any double encoded &amp; entities e.g &amp;amp;
	correctEncoding : function(s){
		return s.replace(/(&amp;)(amp;)+/,"$1");
	},


	// Function to loop through an array swaping each item with the value from another array e.g swap HTML entities with Numericals
	swapArrayVals : function(s,arr1,arr2){
		if(this.isEmpty(s)) return "";
		var re;
		if(arr1 && arr2){
			//ShowDebug("in swapArrayVals arr1.length = " + arr1.length + " arr2.length = " + arr2.length)
			// array lengths must match
			if(arr1.length == arr2.length){
				for(var x=0,i=arr1.length;x<i;x++){
					re = new RegExp(arr1[x], 'g');
					s = s.replace(re,arr2[x]); //swap arr1 item with matching item from arr2	
				}
			}
		}
		return s;
	},

	inArray : function( item, arr ) {
		for ( var i = 0, x = arr.length; i < x; i++ ){
			if ( arr[i] === item ){
				return i;
			}
		}
		return -1;
	}

};



function json2array( obj ) { 
	var temp = [];
	$.each(obj, function(key,value){
	    temp.push( { key: key, value: value } );
	});
	return temp.sort( function(a,b){ return a.value - b.value; } ); 
};

function fragments( args, data, index) {
	if( isNull(index) ) {
		index = 0;
	}
	if( !isNull(args) ) {
		if( typeof(args) == "object" ) {
			if( !isNull(args[index])) {
				if( typeof(args[index]) == "function" ) {
					return data;
				} else {
					return args[index];	
				}
			} else {
				return data;
			}
		} else {
			return data;
		}
	} else {
		return data;
	}
};

// JSON
function DataView(dataFunction, viewFunction) {
    this.df = dataFunction;
    this.vf = viewFunction;
    this.parameter = [];
    this.x = json2xml({}, rootElementName);
    this.addParam = function(value) {
    	if( typeof( value ) != undefined && typeof( value ) != "function") 
    	{
    		this.parameter.push(value);
    	}
    	return this;
    };
    this.execute = function (callbackEvent) {
    	this.parameter.push( function(x) {
		    this.x = json2xml(JSON.parse(x), rootElementName);
		    
		    viewFunction(this.x, function(){
		    	if( DEBUG ) {
			    	console.log("DataView:: " + this.x );
			    }
		    	if( typeof(callbackEvent) == "function" ) {
		    		callbackEvent.apply(this, arguments);
		    	}
		    });
		});
		dataFunction.apply(this, this.parameter);
    };
};


//XML
function XDataView(dataFunction, viewFunction) {
	this.df = dataFunction;
	this.vf = viewFunction;
	this.parameter = [];
	this.x = json2xml({}, rootElementName);
	this.addParam = function(value) {
		if( typeof( value ) != undefined && typeof( value ) != "function") 
		{
			this.parameter.push(value);
		}
		return this;
	};
	this.execute = function (callbackEvent) {
		this.parameter.push( function(xx) {
		    this.x = (xx == null || xx == "") ? json2xml({}, rootElementName) : xx;
		    viewFunction(this.x, function(){
		    	if( DEBUG ) {
			    	console.log("XDataView:: " + this.x );
			    }
		    	if( typeof(callbackEvent) == "function" ) {
		    		callbackEvent.apply(this, arguments);
		    	}
		    });
		});
		dataFunction.apply(this, this.parameter);
	};
};






