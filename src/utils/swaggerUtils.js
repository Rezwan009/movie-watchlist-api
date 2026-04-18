import swaggerJSDoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Movie Watchlist API",
            version: "1.0.0",
            description: "API documentation for Movie Watchlist system (Register, Login, GetUser, AddMovie, GetMovies, DeleteMovie)"
        },
        servers: [
            {
                url: "http://localhost:5001",
                description: "Local deployment Server"
            }
        ],
        components: {
            securitySchemes: {
                AuthToken: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Enter your token directly"
                }
            }
        },
        security: [
            {
                AuthToken: []
            }
        ]
    },
    apis: ["./src/routes/*.js"]
}

const swaggerspec = swaggerJSDoc(options);

export function setUpSwagger(app) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerspec))
}