const express = require('express');
const cors = require('cors');
const http = require('http');
const session = require('express-session');

//Apis
const AuthApi = require('./backend/Interfaces/AuthApi.js');
const FetchDataApi = require('./backend/Interfaces/FetchApi.js');
const PostDataApi = require('./backend/Interfaces/PostApi.js');

//Modules
const RedirectModule = require('./backend/modules/RedirectModule.js');
const DatabaseModule = require('./backend/modules/DatabaseModule.js');
const SessionModule = require('./backend/modules/SessionModule.js');

const App = express();

const ip = process.env.HOST;
const port = process.env.PORT;

const ServerConfig = {
    hostname: ip,
    port: port
};

const HttpServer = http.createServer(ServerConfig, App);
const CorsPolicy = { origin: '*', allowedHeaders: '*', credentials: true };

App.use(cors(CorsPolicy));
App.use(express.json());
App.use(express.urlencoded({ extended: true }));
App.use(session(SessionModule.SessionData));

//Login and Register Api route (no auth needed)
App.post('/api/login', AuthApi.Login);
App.post('/api/register', AuthApi.Register);
App.post('/api/logout', RedirectModule.isAuthenticated, AuthApi.Logout);

//Api Get Routes
App.get('/api/getpininfo/:id', RedirectModule.isAuthenticated, FetchDataApi.GetPinInfo);
App.get('/api/gethorarioinfo/:id', RedirectModule.isAuthenticated, FetchDataApi.GetPinHorarioInfo);
App.get('/api/getallpins', RedirectModule.isAuthenticated, FetchDataApi.GetAllPins);
App.get('/api/isuseradmin', RedirectModule.isAuthenticated, FetchDataApi.IsUserAdmin);

//Review Api
App.post('/api/postreview/', RedirectModule.isAuthenticated, PostDataApi.PostReview);
App.get('/api/getreviews/:id', RedirectModule.isAuthenticated, FetchDataApi.GetReviews);


App.post('/api/editpin/', RedirectModule.isAdmin, RedirectModule.isAuthenticated, PostDataApi.EditPin);

//Public Routes (no auth needed)
App.use('/login', express.static('./frontend/login'))
App.use('/register', express.static('./frontend/register'))
App.use('/assets', express.static('./frontend/assets'));
App.use('/styles', express.static('./frontend/styles'));

// Protect Frontend routes

App.use('/', RedirectModule.isAuthenticated, SessionModule.RenewSession, RedirectModule.Redirect, express.static('./frontend/'));

// Start Server
HttpServer.listen(port, ip, () => { console.log(`Server is listening on http://${ip}:${port}`) });
