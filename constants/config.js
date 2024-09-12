const corsOptions = {
  origin: [
    "http://localhost:4000",
    "http://localhost:4173",
    process.env.CLIENT_URL,
    "https://s457sx32-4000.inc1.devtunnels.ms/",
    'https://s457sx32-4000.inc1.devtunnels.ms',
    "*"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

const CHATTU_TOKEN = "chattu-token";

export { corsOptions, CHATTU_TOKEN };
