import {Application} from "express";
import * as path from "path";
import * as Busboy from "busboy";
import {FileUploader} from "./RequestHandlers/FileUploader";
import * as SocketIO from "socket.io";
import {Room} from "./Room";
// @ts-ignore
import {Utils} from "../../lib/Utils";
// @ts-ignore
import {Track} from "../../lib/Track";

export class Routes {

    public running_rooms: Array<Room> = [];

    public routes(app: Application, io: SocketIO.Server): void {

        // Allow Cross-Origin access to this server.
        app.use(function (req, res, next) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader("Access-Control-Allow-Credentials", "true");
            res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
            res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
            next();
        });

        io.on('connection', (socket) => {
            socket.on('create', (track_id, title, description) => {
                let room_id = Utils.generateId(8);
                socket.join(room_id);
                let track = new Track(track_id, (tact: number, value: number) => {
                    console.log(tact + "---" + value)
                });
                let room = new Room(room_id, track, title, description);
                room.users.push(socket.id);
                this.running_rooms.push(room);
                socket.emit('create_success', room);
            });

            socket.on('join', (room_id) => {
                socket.join(room_id);
                let room = this.getRoomById(room_id);
                if (room) {
                    this.running_rooms[this.running_rooms.indexOf(room)].users.indexOf(socket.id) === -1 ? this.running_rooms[this.running_rooms.indexOf(room)].users.push(socket.id) : console.log(socket.id + "already in " + room_id);
                    socket.emit('join_success', this.getRoomById(room_id));
                }
            });

            socket.on('leave', (room_id) => {
                console.log('here');
                let room = this.getRoomById(room_id);
                if (room) {
                    if (this.running_rooms[this.running_rooms.indexOf(room)].users.indexOf(socket.id) !== -1) {
                        this.running_rooms[this.running_rooms.indexOf(room)].users.splice(this.running_rooms[this.running_rooms.indexOf(room)].users.indexOf(socket.id), 1);
                        if (this.running_rooms[this.running_rooms.indexOf(room)].users.length === 0) {
                            this.running_rooms.splice(this.running_rooms.indexOf(room), 1);
                        }
                    }
                }
            });

            socket.on('disconnecting', () => {
                if (Object.keys(socket.rooms).length > 1) {
                    for (let item in socket.rooms) {
                        this.running_rooms.some((room) => {
                            let index = room.users.indexOf(socket.rooms[item]);
                            if (index !== -1) {
                                room.users.splice(index, 1);
                                if (room.users.length === 0) {
                                    this.running_rooms.splice(this.running_rooms.indexOf(room), 1);
                                }
                            }
                        })
                    }
                }
            });

            socket.on('play', (room_id) => {
                let room = this.getRoomById(room_id);
                if (room) {
                    room.track.play();
                }
            });

            socket.on('pause', (room_id) => {
                let room = this.getRoomById(room_id);
                if (room) {
                    console.log("PAUSING!");
                    room.track.pause();
                }
            });
        });

        app.get('/test', (req, res) => {
            res.end("That's all folks, yeah!");
        });

        app.get('/rooms', (req, res) => {
            res.send(this.running_rooms);
        });

        // Uploads a new file on the server.
        app.post('/upload', (req, res) => {
            let saveDir = path.resolve('./uploads/');
            let fu: FileUploader = new FileUploader(saveDir, 31457280, 10); // 30 MB and 1 file maximum

            // Lets create config for busboy
            let config = {
                headers: req.headers,
                limits: {
                    fileSize: fu.MaxFileSize,
                    files: fu.FilesCount
                }
            };

            let busboy = new Busboy(config);
            req.pipe(busboy);

            let uploadedFiles: Array<string> = [];
            busboy.on('file', (fieldname, file, filename, encoding, mimeType) => {
                fu.OnFile(fieldname, file, filename, encoding, mimeType);
                // Save name of uploaded file to array.
                file.on('end', () => {
                    uploadedFiles.push(filename);
                });
            });

            busboy.on('finish', () => {
                console.log('Upload complete');
                res.writeHead(200, {'Connection': 'close'});
                let response = {
                    uploaded: uploadedFiles
                };
                res.end(JSON.stringify(response));
            });
        })
    }

    private getRoomById(id: string) {
        for (let i = 0; i < this.running_rooms.length; i++) {
            if (this.running_rooms[i].id === id) {
                return this.running_rooms[i];
            }
        }
        return null;
    }
}