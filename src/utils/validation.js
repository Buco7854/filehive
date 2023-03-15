const Ajv = require("ajv");
const schema = {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "additionalProperties": false,
        "properties": {
            "protocol": {
                "type": "string",
                "pattern": "^(http|https)"
            },
            "port": {
                "type": "number",
            },
            "dir": {
                "type": "string"
            },
            "autoindex": {
                "type": "boolean"
            },
            "upload": {
                "type": "boolean"
            },
            "show_hidden": {
                "type": "boolean",
                "default": false,
            },
            "users": {
                "type": "object",
                "default": {},
                "additionalProperties": {
                    "type": "object",
                    "properties": {
                        "password": {
                            "type": "string"
                        },
                        "roles": {
                            "type": "array",
                            "default": [],
                            "items": {
                                "type": "string"
                            }
                        }
                    },
                    "required": ["password", "roles"]
                }
            },
            "routes_anonymous_access": {
                "type": "array",
                "default": [],
                "items": {
                    "type": "object",
                    "properties": {
                        "path": {
                            "type": "string"
                        },
                        "autoindex": {
                            "type": "boolean"
                        },
                        "upload": {
                            "type": "boolean"
                        },
                        "show_hidden": {
                            "type": "boolean",
                            "default": false,
                        },
                    },
                    "required": ["path", "autoindex", "upload"]
                }
            },
            "routes_user_access": {
                "type": "array",
                "default": [],
                "items": {
                    "type": "object",
                    "properties": {
                        "path": {
                            "type": "string"
                        },
                        "autoindex": {
                            "type": "boolean"
                        },
                        "upload": {
                            "type": "boolean"
                        },
                        "user": {
                            "type": "string"
                        },
                        "show_hidden": {
                            "type": "boolean",
                            "default": false,
                        },
                    },
                    "required": ["path", "autoindex", "upload", "user"]
                }
            },
            "store": {
                "type": "string",
                "default": "memory",
                "pattern": "^(redis|memory)"
            },
            "store-prefix": {
                "type": "string",
                "default": "filehive-store",
                "pattern": "^[a-zA-Z0-9-_]+$"
            },
            "redis": {
                "type": "object",
                "default": {},
                "properties": {
                    "host": {
                        "type": "string",
                        "default": undefined
                    },
                    "port": {
                        "type": "number",
                        "default": undefined
                    },
                    "password": {
                        "type": "string",
                        "default": undefined
                    },
                    "username": {
                        "type": "string",
                        "default": undefined
                    },
                    "database": {
                        "type": "number",
                        "default": undefined
                    }
                },
                "additionalProperties": false
            },
            "listen-address": {
                "type": "string",
                "default": "127.0.0.1"
            },
            "proxies": {
                "type": "array",
                "default": [],
                "items": {
                    "type": "string"
                }
            },
            "static_path": {
                "type": "string",
                "default": "/filehive-static"
            },
            "upload_path": {
                "type": "string",
                "default": "/filehive-upload"
            },
            "delete_path": {
                "type": "string",
                "default": "/filehive-delete"
            },
            "create_folder_path": {
                "type": "string",
                "default": "/filehive-create-folder"
            },
            "folder_creation_mode": {
                "type": "number",
                "default": 0o775
            },
            "cookie_key": {
                "type": "string",
                "default": "FILEHIVE-SESSION"
            },
            "date_format": {
                "type": "string",
                "default": "en-US"
            },
            "private_key": {
                "type": "string",
                "default": undefined
            },
            "certificate": {
                "type": "string",
                "default": undefined
            },
            "max_upload_file_size": {
                "type": "number",
                "default": undefined
            }
        },
        "required": ["protocol", "port", "dir", "autoindex", "upload"]
    }
;
const ajv = new Ajv({ allErrors: true, useDefaults: 'empty', removeAdditional:true });
const validate = ajv.compile(schema);

function validateConfiguration(config) {
    const isValid = validate(config);

    if (!isValid) {
        throw new Error('Invalid configuration: ' + ajv.errorsText(validate.errors));
    }

    return config
}

module.exports = {
    validateConfiguration,
};