import env from "../utils/env";

const corsOptions = {
    origin: env.CLIENT_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
};

export { corsOptions };