import * as express from "express";
import {Routes} from "./Routes";
import * as path from "path";
import * as socketIO from "socket.io";
import { createServer, Server } from 'http';


class Index {

    public PORT : number = 3000;
    public app: express.Application;
    public routesMap: Routes = new Routes();
    public server: Server;
    public io : socketIO.Server;

    constructor() {
        this.app = express();
        this.app.use('/uploads', express.static(path.resolve(__dirname, './uploads')));
        this.server = new Server(this.app);
        this.io = socketIO(this.server);
        this.listen();
        this.routesMap.routes(this.app, this.io);
    }

    private config(): void {
        //example of function
    }

    private listen() : void  {
        this.server.listen(this.PORT, () => {
            console.log("VK App server started on port " + this.PORT);
        });
    }

}

export default new Index().app;