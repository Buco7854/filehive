# FileHive

[![Linux](https://svgshare.com/i/Zhy.svg)](https://svgshare.com/i/Zhy.svg) [![Windows](https://svgshare.com/i/ZhY.svg)](https://svgshare.com/i/ZhY.svg) [![GitHub license](https://img.shields.io/github/license/Buco7854/filehive.svg)](/LICENSE)


FileHive is a web file manager built on Express.js that enables autoindex of a specific directory.
It comes with a lot of customization options, access management, and support for both memory and Redis storage for authentication and rate-limiting.
It supports uploading, deleting files and directories, and serves files with nginx speed when configured for.

⚠️ **Warning: FileHive has limited support for Windows.** ⚠️

Please note the following limitations and considerations when using FileHive on a Windows system:
- Hidden files on Windows may not be properly supported, as FileHive only recognizes files starting with a dot as hidden. Other hidden files, such as `desktop.ini` or other Windows hidden system files, may not be identified as hidden by FileHive.
- If you need to index a folder that requires changing permissions, it is important to note that this process can be significantly more complicated on Windows compared to Linux, where a simple `chmod` command can be used.


## Features

- Auto-index of a specific directory
- Support for both memory  and Redis storage for authentication and rate-limiting
- Customizable route names, session cookie names, and more
- Access management
- File upload, deletion, directory creation and deletion
- Works with nginx for speedy file serving
- Configuration is reloaded in real-time, allowing for updates to permissions without restarting the app

## Installation

To install FileHive, follow these steps:

1. Clone this repository by running
    ```bash
    git clone https://github.com/Buco7854/filehive
    ```
2. navigate to the directory.
    ```bash
    cd filehive
    ```
3. Install dependencies by running
    ```bash
    npm install
    ```
4. Customize the configuration in `config.yaml.example` and rename it to `config.yaml`.

5. Run the server by running
    ```bash
    npm start
	```
   or
    ```bash
    node src/app.js
    ```

## Configuration Documentation

Below is a complete list of configurations for filehive and their descriptions.

## Required Configurations

### `protocol`

The protocol to use, http or https. This is a required field for security purposes. If you are using a proxy with an existing https configuration, you do not need to specify https here. Otherwise, use https, or your credentials may be vulnerable. If you set up https, you must provide the private_key and certificate keys (end of file).

Type: string

Example:
```yaml
protocol:  https
```

### `port`

The port on which filehive will listen.

Type: number

Example:
```yaml
port: 80
```


### `dir`

The root directory to serve.

Type: string

Example:
```yaml
dir: "/path/to/dir/to/index/"
```


### `autoindex`

A boolean that specifies whether to autoindex a route if it is not in the configuration file.

Type: boolean

Example:
```yaml
autoindex: true
```


### `upload`

A boolean that specifies whether to allow uploads when the route is not in the configuration file.

Type: boolean

Example:
```yaml
upload: true
```


## Optional Configurations

### `show_hidden`

A boolean that specifies whether to allow a user to view hidden files and directories when the route is not in the configuration file.
Default is `false`.

Type: boolean

Example: 
```yaml
show_hidden: true
```

### `users`

User configuration, the username is the key.

Type: object

Example:
```yaml
users:
    a_user:
        password: "password"
```


### `routes_anonymous_access`

The configuration for a route when an unauthenticated user accesses it.
Please note that trailing slash or not are not needed but in the case you want to pass a wildcard then there must be a trailing slash in front.
Default is an empty array.

Type: array of objects

Example:
```yaml
routes_anonymous_access:
    -   path: "/public/*"
        autoindex: true
        upload: false
        show_hidden: false
```


### `routes_user_access`

The configuration for a route.
If user and path match the entry, it will be used.
If no match is found, fallbacks to the `routes_anonymous_access` setting. If no match is found again, then use general settings. The routes are sorted from the longest to the shorter and will stop at the first match.
Default is an empty array.

Type: array of objects

Example:

```yaml
routes_user_access:
    -   path: "/user/"
        autoindex: true
        upload: true
        show_hidden: true
        user: "a_user"
```


### `store`

The name of the store where the session tokens and ratelimits are stored. If redis is available, better use it for persistence between file restarts.
Default is `"memory"`.

Type: string

Example:
```yaml
store: "redis"
```


### `store-prefix`

The prefix in front of the key in the stores.
Default is `"filehive-store"`.

Type: string

Example: 
```yaml
store-prefix: "my-prefix"
```


### `redis`

The redis store.
Everything in there is optional.
Default is an empty object.

Type: object

Example:
```yaml
redis:
    host: "localhost"
    port: 6379
    password: "password"
    username: "username"
    database: 0
```


### `listen-address`

The address on which your app will listen to requests.
DSfault is `"localhost"`.

Type: string

Example: 
```yaml
listen-address: "0.0.0.0"
```


### `proxies`

If your app is behind one or multiple proxies such as nginx, set their IP here (prepended by a hyphen).
It is important to not that if at least one proxy is specified, FileHive will not serve files anymore and will instead return json so that the proxies auth requests can be done as fast as possible. 
Default is an empty array.

Type: array of string

Example:
```yaml
proxies:
 - 127.0.0.1
```


### `static_path`
The path for FileHive static files.
Do not name a directory the same as this path, for example if you have a 'test' subdirectory directly after `dir`, just don't name the `static_path` 'test'.
This serves files under `./src/public`.
It is in no way related to the directory that filehive will serve (`dir`).
Default is `"/filehive-static"`.

Type: string

Example: 
```yaml
static_path: "/this-is-filhive-statics"
```

### `upload_path`

The path for the upload route. Same instruction as in `static_path`.
Default is `"/filehive-upload"`.

Type: string

Example: 
```yaml
upload_path: "/this-is-upload"
```

### `delete_path`

The path for the upload route. Same instruction as in `static_path`.
Default is `"/filehive-delete"`.

Type: string

Example:
```yaml
delete_path: "/this-is-delete"
```

### `create_folder_path`

The path for the upload route. Same instruction as in `static_path`.
Default is `"/filehive-create-folder"`.

Type: string

Example:
```yaml
create_folder_path: "/this-is-create"
```

### `folder_creation_mode`

An OCTAL integer representing the permissions in Linux. For example, `0o770`, not `770`.
The permission wouldn't be the same, and you would have bad surprises.
Default is `0o775`.

Type: number

Example:
```yaml
folder_creation_mode: 0o770
```

### `cookie_key`

the key of the cookie used for the user sessions.
Default is `"FILEHIVE-SESSION"`.

Type: string

Example:
```yaml
cookie_key: "my-custom-cookie-key"
```

### `date_format`

The date format of the country provided for the autoindex dates.
The default is `en-US`.

Type: string

Example:
```yaml
date_format: "FR"
```

### `private_key`

Your SSL certificate private key file.
You must provide the private_key and certificate keys for an HTTPS configuration.
Default is `undefined`.
Type: string

Example:
```yaml
private_key: "/etc/letsencrypt/live/example.com/privkey.pem"
```

### `certificate`

Your SSL certificate file.
You must provide the private_key and certificate keys for an HTTPS configuration.
Default is `undefined`.

Type: string

Example: 
```yaml
certificate : "/etc/letsencrypt/live/example.com/fullchain.pem"
```

### `max_upload_file_size`

The maximum allowed file size for uploads, in bytes.
The default value is `undefined`, which means that there is no size limit.

Type number

Example:
```yaml
file_upload_size_limit: 32212254720
```

## Remarks
- The app's configuration is updated in real-time, allowing changes to permissions and other settings without requiring a restart.
However, it's important to keep in mind that certain configuration keys, such as the `port` or FileHive routes, may require an app restart in order for changes to take effect, as they are not accessed on every instance.

- A user can only delete a file when he has the permission to view it (`autoindex`, also `show_hidden` if the file is hidden), and when he can also upload to the folder the file is in (`upload`).

- The user running FileHive need read and write permissions under the directory it is located and under the `dir` provided.
    I recommend running it as systemd service (see below), with `www-data` user inside a child directory of `/var/www/` and setting the `dir ` inside a child of `/var/www/` too (the user should have the permissions, if not just give them to him).

## Run as a service

To run the file as a systemd service, please follow these steps:

1. Copy the configuration code below into a new file with the extension `.service`. For example, you can name it `filehive.service` (it is also in the repo under the same name).
    ```
    [Unit]
    Description=FileHive
    After=network.target
    
    [Service]
    User=www-data
    WorkingDirectory=/path/to/filehive/src/
    ExecStart=/usr/bin/node app.js
    Restart=always
    
    [Install]
    WantedBy=multi-user.target
    ```
2. Move the `.service` file to the `/etc/systemd/system/` directory by running the following command:
    ```sudo mv filehive.service /etc/systemd/system/```
3. Reload the systemd daemon to pick up the new service:
    ```sudo systemctl daemon-reload```
4. Enable the service to start on boot:
    ```sudo systemctl enable filehive.service```
5. Start the service:
    ```sudo systemctl start filehive.service```

You can check the status of the service by running:
```sudo systemctl status filehive.service```
   And you can stop the service by running:
```sudo systemctl stop filehive.service```

## Use with Nginx
To improve the performance of FileHive in delivering files, it is highly recommended to use it with nginx as a reverse proxy.
If you choose to do so, you can add the following configuration to serve files in place of FileHive.
You can find the necessary file at `./filehive_nginx.conf`.

```
map $status $status_title {

	400 "Bad Request";
	401 "Unauthorized";
	403 "Forbidden";
	404 "Not Found";
	405 "Method Not Allowed";
	406 "Not Acceptable";
	407 "Proxy Authentication Required";
	408 "Request Timeout";
	409 "Conflict";
	410 "Gone";
	411 "Length Required";
	412 "Precondition Failed";
	413 "Payload Too Large";
	414 "URI Too Long";
	415 "Unsupported Media Type";
	416 "Range Not Satisfiable";
	417 "Expectation Failed";
	418 "I'm a teapot";
	421 "Misdirected Request";
	422 "Unprocessable Entity";
	423 "Locked";
	425 "Too Early";
	426 "Upgrade Required";
	428 "Precondition Required";
	429 "Too Many Requests";
	431 "Request Header Fields Too Large";
	451 "Unavailable For Legal Reasons";
	500 "Internal Server Error";
	501 "Not Implemented";
	502 "Bad Gateway";
	503 "Service Unavailable";
	504 "Gateway Timeout";
	505 "HTTP Version Not Supported";
	506 "Variant Also Negotiates";
	507 "Insufficient Storage";
	508 "Loop Detected";
	510 "Not Extended";
	511 "Network Authentication Required";
	default "Unknown Error";
}
map $status $status_message {

	400 "The server cannot or will not process the request due to an apparent client error.";
	401 "The client must authenticate itself to get the requested response.";
	403 "The server understood the request, but is refusing to fulfill it. You probably are missing permissions.";
	404 "The server cannot find the requested resource.";
	405 "The method specified in the request is not allowed for the resource identified by the URI.";
	406 "The resource identified by the request is only capable of generating response entities that have content characteristics not acceptable according to the accept headers sent in the request.";
	407 "The client must first authenticate itself with the proxy.";
	408 "The server timed out waiting for the request.";
	409 "The request could not be completed due to a conflict with the current state of the resource.";
	410 "The requested resource is no longer available and will not be available again.";
	411 "The request did not specify the length of its content, which is required by the requested resource.";
	412 "The server does not meet one of the preconditions that the requester put on the request.";
	413 "The server cannot process the request because the request payload is too large.";
	414 "The URI requested by the client is too long.";
	415 "The server cannot process the request because the media type requested by the client is not supported.";
	416 "The client has asked for a portion of the file (byte serving), but the server cannot supply that portion.";
	417 "The server cannot meet the requirements of the Expect request-header field.";
	418 "This code was defined in 1998 as one of the traditional IETF April Fools' jokes.";
	421 "The request was directed at a server that is not able to produce a response.";
	422 "The request was well-formed but was unable to be followed due to semantic errors.";
	423 "The resource that is being accessed is locked.";
	425 "The server is unwilling to risk processing a request that might be replayed.";
	426 "The client should switch to a different protocol such as TLS/1.0, given in the Upgrade header field.";
	428 "The origin server requires the request to be conditional.";
	429 "The user has sent too many requests in a given amount of time.";
	431 "The server is unwilling to process the request because its header fields are too large.";
	451 "The server is denying access to the resource as a consequence of a legal demand.";
	500 "The server encountered an unexpected condition that prevented it from fulfilling the request.";
	501 "The server does not support the functionality required to fulfill the request.";
	502 "The server, while acting as a gateway or proxy, received an invalid response from the upstream server it accessed in attempting to fulfill the request.";
	503 "The server is currently unable to handle the request due to a temporary overload or maintenance of the server.";
	504 "The server, while acting as a gateway or proxy, did not receive a timely response from the upstream server specified by the URI.";
	505 "The server does not support the HTTP protocol version used in the request.";
	506 "The server has an internal configuration error: the chosen variant resource is configured to engage in transparent content negotiation itself, and is therefore not a proper end point in the negotiation process.";
	507 "The method could not be performed on the resource because the server is unable to store the representation needed to successfully complete the request.";
	508 "The server detected an infinite loop while processing the request.";
	510 "The client needs to update to a newer version of the protocol to access the requested resource.";
	511 "The client needs to authenticate to gain network access.";
	default "Sorry, something weird hapened.";

}

server {

	listen 443 ssl ;
	listen [::]:443 ;
	server_name example.com;
	ssl_certificate /path/to/certficate.file;
	ssl_certificate_key /path/to/certificate_key.file;
	access_log /path/to/access.log;
	error_log /path/to/error.log;
	root /path/to/dir;
	client_max_body_size SHOUD BE HIGHER OR EQUAL TO FILEHIVE ONE;
	
    # Every incomming requests
	location / {

		if (-f $request_filename) {

			rewrite ^ /__internal$uri last;
		}

		proxy_pass http://FILEHIVE_ADRESS_IF_NOT_LOCAL:FILEHIVE_PORT;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
	}
    # Perform verification for files permissions
	location /__internal {
		rewrite ^/__internal(?<realurl>/.*)$ $realurl break;
		auth_request /auth;
		auth_request_set $auth_status $upstream_status;
		try_files $uri =404;

	}

	error_page 400 402 403 404 405 406 407 408 409 410 411 412 413 414 415 416 417 418 421 422 423 424 425 426 428 429 431 451 500 501 502 503 504 505 506 507 508 510 511 /nginx-error-template.html;
	error_page 401 /nginx-401-error-template.html;
	location /nginx-401-error-template.html {

		add_header Set-Cookie "lastVisited=$realurl;Path=/" always;
		ssi on;
		internal;
		auth_basic off;
		root /path/to/filehive/src/public/errors/;

	}
	location /nginx-error-template.html {

		ssi on;
		internal;
		auth_basic off;
		root /path/to/filehive/src/public/errors/;

	}
	# filehive static files
	location /HERE_YOUR_FILEHIVE_STATIC_PATH {

		alias /path/to/filehive/src/public/;
	}

	# Location block for the auth endpoint
	location = /auth {

		# Define the authentication server
		internal;
		proxy_pass http://FILEHIVE_ADRESS_IF_NOT_LOCAL:FILEHIVE_PORT$request_uri;
		proxy_set_header X-Original-URI $request_uri;
		proxy_set_header Host $http_host;
		proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header X-Forwarded-Proto $scheme;
		proxy_set_header If-Modified-Since "";
	}
}
```
## Usage

To use FileHive, simply navigate to the root URL of the server.

## Screenshots

![FileHive Login Page](/assets/login.png)

![FileHive Directory Listing](/assets/directory_listing.png)

![FileHive Directory Creation](/assets/directory_creation.png)

![FileHive Delete](/assets/delete.png)

![FileHive Drag And Drop](/assets/drag-and-drop.png)

## License

FileHive is licensed under the MIT License. See the LICENSE file for more information.
