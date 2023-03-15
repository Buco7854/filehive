const httpStatus = {
    400: {
        name: "Bad Request",
        message:
            "The server cannot or will not process the request due to an apparent client error.",
    },
    401: {
        name: "Unauthorized",
        message:
            "The client must authenticate itself to get the requested response.",
    },
    403: {
        name: "Forbidden",
        message:
            "The server understood the request, but is refusing to fulfill it. You probably are missing permissions.",
    },
    404: {
        name: "Not Found",
        message: "The server cannot find the requested resource.",
    },
    405: {
        name: "Method Not Allowed",
        message:
            "The method specified in the request is not allowed for the resource identified by the URI.",
    },
    406: {
        name: "Not Acceptable",
        message:
            "The resource identified by the request is only capable of generating response entities that have content characteristics not acceptable according to the accept headers sent in the request.",
    },
    407: {
        name: "Proxy Authentication Required",
        message: "The client must first authenticate itself with the proxy.",
    },
    408: {
        name: "Request Timeout",
        message: "The server timed out waiting for the request.",
    },
    409: {
        name: "Conflict",
        message:
            "The request could not be completed due to a conflict with the current state of the resource.",
    },
    410: {
        name: "Gone",
        message:
            "The requested resource is no longer available and will not be available again.",
    },
    411: {
        name: "Length Required",
        message:
            "The request did not specify the length of its content, which is required by the requested resource.",
    },
    412: {
        name: "Precondition Failed",
        message:
            "The server does not meet one of the preconditions that the requester put on the request.",
    },
    413: {
        name: "Payload Too Large",
        message:
            "The server cannot process the request because the request payload is too large.",
    },
    414: {
        name: "URI Too Long",
        message: "The URI requested by the client is too long.",
    },
    415: {
        name: "Unsupported Media Type",
        message:
            "The server cannot process the request because the media type requested by the client is not supported.",
    },
    416: {
        name: "Range Not Satisfiable",
        message:
            "The client has asked for a portion of the file (byte serving), but the server cannot supply that portion.",
    },
    417: {
        name: "Expectation Failed",
        message:
            "The server cannot meet the requirements of the Expect request-header field.",
    },
    418: {
        name: "I'm a teapot",
        message:
            "This code was defined in 1998 as one of the traditional IETF April Fools' jokes.",
    },
    421: {
        name: "Misdirected Request",
        message:
            "The request was directed at a server that is not able to produce a response.",
    },
    422: {
        name: "Unprocessable Entity",
        message:
            "The request was well-formed but was unable to be followed due to semantic errors.",
    },
    423: {
        name: "Locked",
        message: "The resource that is being accessed is locked.",
    },
    425: {
        name: "Too Early",
        message:
            "The server is unwilling to risk processing a request that might be replayed.",
    },
    426: {
        name: "Upgrade Required",
        message:
            "The client should switch to a different protocol such as TLS/1.0, given in the Upgrade header field.",
    },
    428: {
        name: "Precondition Required",
        message: "The origin server requires the request to be conditional.",
    },
    429: {
        name: "Too Many Requests",
        message: "The user has sent too many requests in a given amount of time.",
    },
    431: {
        name: "Request Header Fields Too Large",
        message:
            "The server is unwilling to process the request because its header fields are too large.",
    },
    451: {
        name: "Unavailable For Legal Reasons",
        message:
            "The server is denying access to the resource as a consequence of a legal demand.",
    },
    500: {
        name: "Internal Server Error",
        message:
            "The server encountered an unexpected condition that prevented it from fulfilling the request.",
    },
    501: {
        name: "Not Implemented",
        message:
            "The server does not support the functionality required to fulfill the request.",
    },
    502: {
        name: "Bad Gateway",
        message:
            "The server, while acting as a gateway or proxy, received an invalid response from the upstream server it accessed in attempting to fulfill the request.",
    },
    503: {
        name: "Service Unavailable",
        message:
            "The server is currently unable to handle the request due to a temporary overload or maintenance of the server.",
    },
    504: {
        name: "Gateway Timeout",
        message:
            "The server, while acting as a gateway or proxy, did not receive a timely response from the upstream server specified by the URI.",
    },
    505: {
        name: "HTTP Version Not Supported",
        message:
            "The server does not support, or refuses to support, the major version of HTTP that was used in the request message.",
    },
    505: {
        name: "HTTP Version Not Supported",
        message:
            "The server does not support the HTTP protocol version used in the request.",
    },
    500: {
        name: "Internal Server Error",
        message:
            "The server encountered an unexpected condition that prevented it from fulfilling the request.",
    },
    501: {
        name: "Not Implemented",
        message:
            "The server does not support the functionality required to fulfill the request.",
    },
    502: {
        name: "Bad Gateway",
        message:
            "The server received an invalid response from an upstream server while trying to fulfill the request.",
    },
    503: {
        name: "Service Unavailable",
        message:
            "The server is currently unable to handle the request due to a temporary overload or maintenance of the server.",
    },
    504: {
        name: "Gateway Timeout",
        message:
            "The server did not receive a timely response from an upstream server while trying to fulfill the request.",
    },
    505: {
        name: "HTTP Version Not Supported",
        message:
            "The server does not support the HTTP protocol version used in the request.",
    },
    506: {
        name: "Variant Also Negotiates",
        message:
            "The server has an internal configuration error: the chosen variant resource is configured to engage in transparent content negotiation itself, and is therefore not a proper end point in the negotiation process.",
    },
    507: {
        name: "Insufficient Storage",
        message:
            "The method could not be performed on the resource because the server is unable to store the representation needed to successfully complete the request.",
    },
    508: {
        name: "Loop Detected",
        message:
            "The server detected an infinite loop while processing the request.",
    },
    510: {
        name: "Not Extended",
        message:
            "The client needs to update to a newer version of the protocol to access the requested resource.",
    },
    511: {
        name: "Network Authentication Required",
        message: "The client needs to authenticate to gain network access.",
    },
    520: {
        name: "Unknown Error",
        message: "The server returned an unknown error.",
    },
    521: {
        name: "Web Server Is Down",
        message:
            "The server has refused the connection from the client, because the server is down or busy.",
    },
    522: {
        name: "Connection Timed Out",
        message: "The server has timed out the connection.",
    },
    523: {
        name: "Origin Is Unreachable",
        message: "The server was not able to reach the origin server.",
    },
    524: {
        name: "A Timeout Occurred",
        message: "The server has timed out the request.",
    },
    525: {
        name: "SSL Handshake Failed",
        message: "The SSL/TLS handshake between the client and the server failed.",
    },
    526: {
        name: "Invalid SSL Certificate",
        message:
            "The server could not validate the SSL/TLS certificate that the client presented.",
    },
    527: {
        name: "Railgun Error",
        message:
            "The connection to the origin server timed out or failed after the WAN connection had been established by the Cloudflare server.",
    },
    530: {
        name: "Origin DNS Error",
        message: "The DNS resolution of the origin server has failed.",
    },
    598: {
        name: "Network Read Timeout Error",
        message:
            "The client did not produce a request within the time that the server was prepared to wait.",
    },
    599: {
        name: "Network Connect Timeout Error",
        message:
            "The client was unable to establish a connection to the server within the time limit that the server was prepared to wait.",
    },
};



class HttpError extends Error {
    constructor(status, message) {
        super(message);
        this.name = "HttpError";
        this.status = status
    }
}

module.exports = {
    HttpError,
    httpStatus,
}
