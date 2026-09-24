import pino from "pino";

const logger = pino({
    level: process.env.LOG_LEVEL || "info",


    transport: {
        targets: [
            // this shows logs over on console too
            // {
            //     target: "pino-pretty",
            //     level: "info",
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
        ],
    },

})


export default logger;