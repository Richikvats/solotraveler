require("dotenv").config();

const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');

const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const { authMiddleware } = require('./utils/auth');

const app = express();
const PORT = process.env.PORT || 3001;

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware,
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve image assets
app.use(
    '/images',
    express.static(path.join(__dirname, '../client/images'))
);

// Serve React build only in production
if (process.env.NODE_ENV === 'production') {

    app.use(
        express.static(
            path.join(__dirname, '../client/build')
        )
    );

    app.get('*', (req, res) => {
        res.sendFile(
            path.join(
                __dirname,
                '../client/build/index.html'
            )
        );
    });
}

// Start Apollo server
const startApolloServer = async () => {

    await server.start();

    server.applyMiddleware({
        app
    });

    db.once('open', () => {

        app.listen(PORT, () => {

            console.log(
                `API server running on port ${PORT}!`
            );

            console.log(
                `GraphQL running at http://localhost:${PORT}${server.graphqlPath}`
            );

        });

    });

};

startApolloServer();