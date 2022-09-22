// **********************************************************************************************************************
//
// Copyright (c)2013, YoYo Games Ltd. All Rights reserved.
//
// File:            Function_Buffers.js
// Created:            27/02/2013
// Author:            Mike
// Project:            HTML5
// Description:
//
// Date                Version        BY        Comment
// ----------------------------------------------------------------------------------------------------------------------
// 27/02/2013
//
// **********************************************************************************************************************

var NETWORK_SOCKET_WS = 6;
var NETWORK_SOCKET_WSS = 7;

//
var NETWORK_TYPE_CONNECT = 1;
var NETWORK_TYPE_DISCONNECT = 2;
var NETWORK_TYPE_DATA = 3;
var NETWORK_TYPE_NON_BLOCKING_CONNECT = 4;

var NETWORK_SEND_BINARY = 1;
var NETWORK_SEND_TEXT = 2;

//
var yyWebSocketClient = window.WebSocket;
var yyWebSocketServer = null;
try {
    // if we're on node.js, we might have a websocket server API
    // https://github.com/websockets/ws
    yyWebSocketServer = require("ws").Server;
} catch (_) {}
//
function yyWebSocket(socketObj, type, isServer) {
    this.socket = socketObj;
    this.type   = type;
    this.isServer = isServer;
}
yyWebSocket.prototype = {
    // actual WebSocket object (or websockets/ws server)
    socket: null,
    // whether a socket is a server
    isServer: false,
    // whether socket is ready to send packets through
    canSend: false,
    // network_ index of socket
    index: -1
};
//
var YYHANDSHAKE_SV0 = "GM:Studio-Connect";
var YYHANDSHAKE_CL1 = 0xCAFEBABE;
var YYHANDSHAKE_CL2 = 0xDEADB00B;
var YYHANDSHAKE_SV1 = 0xDEAFBEAD;
var YYHANDSHAKE_SV2 = 0xF00DBEEB;
var YYHANDSHAKE_PRE = 0xDEADC0DE;
//
var yyWebSocketList = []; // <yyWebSocket>
var yyWebSocketList_unused = []; // free indexes for reuse
function yyWebSocketList_add(wrap) {
    var i = yyWebSocketList_unused.shift();
    if (i == null) i = yyWebSocketList.length;
    yyWebSocketList[i] = wrap;
    wrap.index = i;
    return i;
}
function yyWebSocketList_remove(wrap) {
    var i = yyWebSocketList.indexOf(wrap);
    if (i >= 0) {
        yyWebSocketList[i] = null;
        yyWebSocketList_unused.push(i);
    }
}
//
function yyDispatchNetworkingEvent(e) {
    var file = g_pASyncManager.Add(e.id, null, ASYNC_NETWORKING, e);
    file.m_Complete = true;
}
//
function buffer_create_from_dataview(view, offset, length) {
    var ua0 = new Uint8Array(view.buffer);
    var ofs = view.byteOffset + offset;
    var index = buffer_create(length, eBuffer_Format_Fixed, 1);

    var buffer = g_BufferStorage.Get(index);
    for (var i = 0; i < length; i++) buffer.yyb_write(eBuffer_U8, ua0[ofs + i]);

    buffer.yyb_seek(eBuffer_Start,0); //Seek to the beginning so that buffer_read will work

    return index;
}
//
function yyDispatchNetworkingDataEvents(view, prefix, id, ip, port, port2, messageType) {
    var len = view.byteLength;
    var buffers = [];
    if (prefix) {
        var pos = 0;
        while (pos < len) {
            if (view.getUint32(pos, true) != YYHANDSHAKE_PRE
                || view.getUint32(pos + 4, true) != 12
            ) {
                console.log("Raw packet received from a non-raw socket(" + id + ").");
                buffers.push(buffer_create_from_dataview(view, pos, len - pos));
                break;
            }
            var plen = view.getUint32(pos + 8, true);
            buffers.push(buffer_create_from_dataview(view, pos + 12, plen));
            pos += 12 + plen;
        }
    } else buffers.push(buffer_create_from_dataview(view, 0, len));
    for (var i = 0; i < buffers.length; i++) {
        yyDispatchNetworkingEvent({
            "type": NETWORK_TYPE_DATA, "id": id,
            "ip": ip, "port": port, "other_port": port2,
            "buffer": buffers[i], "size": buffer_get_size(buffers[i]),
            "message_type": messageType
        });
    }
}
//
function yyWebSocketServer_closure(_type, port, _max_client, _prefix) {
    // todo: can only do max_client by dropping clients on connect?
    if (yyWebSocketServer == null) {
        debug("No WebSocket server implementation is available.");
        return -1;
    }
    try {
        var skt = new yyWebSocketServer({
            port: port,
            clientTracking: true
        });
        var wrap = new yyWebSocket(skt, NETWORK_SOCKET_WS, true);
        skt.yyWrap = wrap;
        skt.on("connection", function(clSocket, req) {
            var clWrap = new yyWebSocket(clSocket, NETWORK_SOCKET_WS, false);
            var clIndex = -1;
            var clURL = req.socket.remoteAddress;
            var clPort = port;
            var clPort2 = req.socket.remotePort;
            var clReady = !_prefix;
            function dispatchConnect() {
                yyDispatchNetworkingEvent({
                    "type": NETWORK_TYPE_CONNECT,
                    "id": wrap.index, "socket": clIndex,
                    "ip": clURL, "port": clPort, "other_port": clPort2
                });
                clWrap.canSend = true;
            }
            clSocket.onmessage = function(e) {
                // in ws, e.data in NodeJS buffer (https://nodejs.org/api/buffer.html)
                var nbuf = e.data;
                if (nbuf == null) return;
                var abuf = nbuf.buffer;
                if (abuf == null) return;
                var bufSize = nbuf.byteLength;
                var bufView = new DataView(abuf, nbuf.offset, bufSize);
                if (clReady) {
                    // if connected / raw, process actual packets:
                    yyDispatchNetworkingDataEvents(bufView, _prefix, clIndex, clURL, clPort, clPort2);
                } else {
                    // otherwise verify that client responds correctly to handshake (step 2):
                    if (bufSize >= 16
                        && bufView.getUint32(0, true) == YYHANDSHAKE_CL1
                        && bufView.getUint32(4, true) == YYHANDSHAKE_CL2
                        && bufView.getUint32(8, true) == 16
                    ) {
                        clIndex = yyWebSocketList_add(clWrap);
                        clReady = true;
                        dispatchConnect();
                        // send step 3 message:
                        var sv1_abuf = new ArrayBuffer(12);
                        var sv1_view = new DataView(sv1_abuf);
                        sv1_view.setInt32(0, YYHANDSHAKE_SV1, true);
                        sv1_view.setInt32(4, YYHANDSHAKE_SV2, true);
                        sv1_view.setInt32(8, 12, true);
                        clSocket.send(sv1_abuf);
                    } else {
                        console.log("Invalid handshake response from client.");
                        clSocket.terminate();
                    }
                }
            };
            clSocket.onerror = function(e) {
                console.log(e);
                yyDispatchNetworkingEvent({
                    "type": NETWORK_TYPE_DISCONNECT,
                    "id": wrap.index, "socket": clIndex,
                    "ip": clURL, "port": clPort, "other_port": clPort2
                });
                yyWebSocketList_remove(clWrap);
            };
            if (clReady) {
                // if on raw, assume connected straight away:
                clIndex = yyWebSocketList_add(clWrap);
                dispatchConnect();
            } else {
                // otherwise start the handshake:
                var sv0_abuf = new ArrayBuffer(YYHANDSHAKE_SV0.length + 1);
                var sv0_view = new DataView(sv0_abuf);
                for (var i = 0; i < YYHANDSHAKE_SV0.length; i++) {
                    sv0_view.setUint8(i, YYHANDSHAKE_SV0.charCodeAt(i));
                }
                sv0_view.setUint8(i, 0);
                clSocket.send(sv0_abuf);
            }
        });
        skt.on("error", function(e) {
            console.log("Server error: ", e);
        });
        return yyWebSocketList_add(wrap);
    } catch (e) {
        debug("Error creating server: " + e);
        return -1;
    }

}
function yyWebSocketClient_closure(index, url, port, prefix) {
    if (yyWebSocketClient == null) {
        debug("No WebSocket client implementation is available.");
        return -1;
    }
    var wrap = yyWebSocketList[index];
    if (wrap == null || wrap.socket != null) return -1;
    try {
        /* URL format: (ws://|wss://)?hostname(:port)?(/path)?
         *
         * The protocol specifies whether to use plaintext or HTTPS, unless network_socket_wss is
         * in use, which will override it and force wss:// always.
         *
         * If a non-zero port number was passed to the connect function, it will be used, otherwise
         * we will look for a port number in the URL before using default (80/443).
         *
         * If no path was in the URL, "/" will be used.
        */

        var orig_url = url;
        var secure = (wrap.type == NETWORK_SOCKET_WSS);

        if(url.substring(0, 5) == "ws://")
        {
            if(secure)
            {
                console.log("Socket type is network_socket_wss, but URL (" + url + ") is insecure - upgrading to wss://");
            }

            url = url.substring(5);
        }
        else if(url.substring(0, 6) == "wss://")
        {
            secure = true;
            url = url.substring(6);
        }

        var path_at = url.indexOf("/");
        var path = "/";

        if(path_at != -1)
        {
            path = url.substring(path_at);
            url = url.substring(0, path_at);
        }

        var port_at = url.indexOf(":");
        if(port_at != -1)
        {
            if(port == 0)
            {
                port = url.substring(port_at + 1);
            }
            
            url = url.substring(0, port_at);
        }

        url = (secure ? "wss://" : "ws://") + url + (port != 0 ? ":" + port : "") + path;

        var skt = new yyWebSocketClient(url);
        var sktState = prefix ? -1 : 1;
        function dispatchConnect(success) {
            yyDispatchNetworkingEvent({
                "type": NETWORK_TYPE_NON_BLOCKING_CONNECT,
                "id": wrap.index, "succeeded": success ? 1 : 0,
                "ip": orig_url, "port": port
            });
            if (success) wrap.canSend = true;
        }
        function processMessage(srcView, messageType) {
            switch (sktState) {
                case -1: { // handshake step 1
                    // (a goofy string comparison):
                    var i = srcView.byteLength;
                    if (i > YYHANDSHAKE_SV0.length) {
                        i = YYHANDSHAKE_SV0.length;
                        if (srcView.getUint8(i) == 0) while (--i >= 0) {
                            if (srcView.getUint8(i) != YYHANDSHAKE_SV0.charCodeAt(i)) break;
                        }
                    }
                    if (i < 0) {
                        // if it does, send the handshake response (step 2):
                        sktState = 0;
                        var cl1_abuf = new ArrayBuffer(16);
                        var cl1_view = new DataView(cl1_abuf);
                        cl1_view.setUint32(0, YYHANDSHAKE_CL1, true);
                        cl1_view.setUint32(4, YYHANDSHAKE_CL2, true);
                        cl1_view.setUint32(8, 16, true);
                        skt.send(cl1_abuf);
                    } else {
                        // probably not a GM server
                        console.log("Invalid first response from server");
                        dispatchConnect(false);
                        skt.close();
                        wrap.socket = null;
                    }
                }; break;
                case 0: { // handshake step 3
                    if (srcView.byteLength >= 12
                    && srcView.getUint32(0, true) == YYHANDSHAKE_SV1
                    && srcView.getUint32(4, true) == YYHANDSHAKE_SV2
                    && srcView.getUint32(8, true) == 12) {
                        // all is good, we can do things now
                        sktState = 1;
                        dispatchConnect(true);
                        if (srcView.byteLength > 12) {
                            // a message got glued to back of step 3 response?
                            processMessage(new DataView(srcView.buffer, srcView.byteOffset + 12, srcView.byteLength - 12));
                        }
                    } else {
                        console.log("Invalid second response from server");
                        dispatchConnect(false);
                    }
                }; break;
                default: {
                    yyDispatchNetworkingDataEvents(srcView, prefix, index, orig_url, port, port, messageType);
                };
            }
        }
        skt.onopen = function(e) {
            // if raw, connection is ready as soon as socket is connected:
            if (sktState > 0) dispatchConnect(true);
        };
        skt.onmessage = function(e) {
            if (e.data instanceof Blob) {

                // here e.data is a Blob
                var reader = new FileReader();
                reader.onload = function() {
                    processMessage(new DataView(reader.result), NETWORK_SEND_BINARY);
                };
                reader.onerror = function(e) {
                    console.log("Failed to read message:", e);
                };
                reader.readAsArrayBuffer(e.data);
            } // end if
            else
            if (typeof e.data == "string") {
                var encoder = new TextEncoder();
                var encoded = encoder.encode(e.data);
                processMessage(new DataView(encoded.buffer), NETWORK_SEND_TEXT);
            } // end if
            else {
                console.log("Failed to process message:", e);
            }


        };
        skt.onerror = function(e) {
            console.log(e);
            if (!wrap.canSend) dispatchConnect(false);
        };
        wrap.socket = skt;

        return wrap.index;
    } catch (e) {
        debug("Connection error: " + e);
        return -1;
    }
}



function network_create_server(_type, _port, _max_client) {
    return yyWebSocketServer_closure(_type, _port, _max_client, true);
}

function network_create_server_raw(_type, _port, _max_client) {
    return yyWebSocketServer_closure(_type, _port, _max_client, false);
}

function network_set_timeout() {
    ErrorFunction("network_set_timeout()")
}

function network_create_socket_ext(_type,_port) //losing any info passed in here
{
    if(_type != NETWORK_SOCKET_WS && _type != NETWORK_SOCKET_WSS)
    {
        console.log("network_create_socket_ext() - Only network_socket_ws and network_socket_wss are supported on HTML5.");
        return -1;
    }

    return yyWebSocketList_add(new yyWebSocket(null, _type, false));
}

function network_create_socket(_type, _port, _max_client) {
    if(_type != NETWORK_SOCKET_WS && _type != NETWORK_SOCKET_WSS)
    {
        console.log("network_create_socket_ext() - Only network_socket_ws and network_socket_wss are supported on HTML5.");
        return -1;
    }

    return yyWebSocketList_add(new yyWebSocket(null, _type, false));
}
function network_connect(_socket, _url, _port) {
    ErrorFunction( "network_connect()" );
    return -1;
}
function network_connect_raw(_socket, _url, _port) {
    ErrorFunction( "network_connect_raw()" );
    return -1;
}
function network_connect_async(_socket, _url, _port) {
    return yyWebSocketClient_closure(_socket, _url, _port, true);
}
function network_connect_raw_async(_socket, _url, _port) {
    return yyWebSocketClient_closure(_socket, _url, _port, false);
}
function network_resolve(_url) {
    return "127.0.0.1";
}
function network_send_broadcast(_socket, _port, _buffer, _size) {
    return -1;
}

function network_send_packet(_socket, _buffer, _size) {
    var wrap = yyWebSocketList[_socket];
    if (wrap == null) return -1;
    //
    var skt = wrap.socket;
    if (skt == null || !wrap.canSend) return -1;
    //
    var srcYyb = g_BufferStorage.Get(_buffer);
    if (srcYyb == null) return -1;
    var srcView = srcYyb.m_DataView;
    //
    var pktBuf = new ArrayBuffer(_size + 12);
    var pktView = new DataView(pktBuf);
    // set header:
    pktView.setUint32(0, YYHANDSHAKE_PRE, true);
    pktView.setUint32(4, 12, true);
    pktView.setUint32(8, _size, true);
    // copy payload:
    for (var i = 0; i < _size; i += 1) {
        pktView.setUint8(i + 12, srcView.getUint8(i));
    }
    // (WebSocket.send doesn't return anything so we don't really know)
    skt.send(pktBuf);
    return _size;
}

function network_send_raw(_socket, _buffer, _size, _options) {
    var wrap = yyWebSocketList[_socket];
    if (wrap == null) return -1;
    //
    var skt = wrap.socket;
    if (skt == null || !wrap.canSend) return -1;
    //
    var b = buffer_get_address(_buffer);
    if (_size < b.byteLength) b = new DataView(b, 0, _size);

    if(_options !== undefined && (_options & NETWORK_SEND_TEXT) != 0)
    {
        var utf8decoder = new TextDecoder(); // default 'utf-8' or 'utf8'
        b = utf8decoder.decode(b);
    }

    skt.send(b);
    return _size;
}

function network_set_config(cfg, val) {
    // 1. Connection timeout can be implemented by reopening socket if it fails, but that's nasty.
    // 2. Synchronous connect is not supported in HTML5 and that's a good thing really.
}

function network_send_udp(_socket, _url, _port, _buffer, _size) {
    return -1;
}

function network_send_udp_raw(_socket, _url, _port, _buffer, _size) {
    return -1;
}

function network_destroy(_socket) {
    var wrap = yyWebSocketList[_socket];
    if (wrap == null) return;
    var skt = wrap.socket;
    if (skt == null) return;
    if (wrap.isServer) {
        skt.close();
    } else if (skt.terminate) {
        // (for ws client sockets)
        skt.terminate();
    } else if (skt.close) skt.close();
    yyWebSocketList_remove(wrap);
    return 0;
}
