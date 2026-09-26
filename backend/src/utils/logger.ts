import pino from "pino";

const logger = pino({
    level: process.env.LOG_LEVEL || "info",
    transport: {
        targets: [
            // {
            //     target: "pino-pretty",
            //     level: process.env.LOG_LEVEL || "info",
            //     options: {
            //         colorize: true,
            //         translateTime: "SYS:standard",
            //         ignore: "pid,hostname",
            //     },
            // },
            {
                target: "pino/file",
                level: "info",
                options: {
                    destination: "./logs/app.log",
                    mkdir: true,
                },
            },
            {
                target: "pino/file",
                level: "error",
                options: {
                    destination: "./logs/error.log",
                    mkdir: true,
                },
            },
        ],
    },
});

export default logger;