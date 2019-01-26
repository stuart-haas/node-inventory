module.exports = {
    root: {
        src: "./src",
        dest: "./public"
    },

    env: {
        dev: "dev",
        prod: "prod"
    },

    tasks: {
        dev: {
            cmd: "dev",
            list: ["nodemon", "watch"]
        },

        nodemon: {
            cmd: "nodemon",
            script: "app.js",
            ext: "jade js",
            ignore: ["/src/", "/public/", "gulpfile.js", "gulpfile.config.js", "webpack.config.js"]
        },

        watch: {
            cmd: "watch", 
            list: ["css", "js"]
        },

        debug: {
            cmd: "debug"
        },

        lint: {
            cmd: "lint"
        },

        default: {
            cmd: "default"
        },

        css: {
            cmd: {"default": "css", "lint": "css:lint", "debug": "css:debug"},
            src: "/css",
            dest: "/css",
            maps: "./maps",
            env: {
                dev: {
                    exclude: ["!."]
                },
                prod: {
                    exclude: ["!."]
                }
            },
            extensions: ["sass", "scss", "css"]
        },

        js: {
            cmd: {"default": "js", "lint": "js:lint", "debug": "js:debug"},
            src: "/js",
            dest: "/js",
            env: {
                dev: {
                    exclude: ["!."],
                    entries: {
                        app: ["/app.js"]
                    }
                },
                prod: {
                    exclude: ["!."],
                    entries: {
                        app: ["/app.js"]
                    }
                }
            },
            maps: "/maps",
            extensions: ["js", "json"]
        }
    }
};