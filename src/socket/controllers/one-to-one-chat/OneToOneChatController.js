
const BaseController = require("../base-controller");

module.exports = class OneToOneChatController extends BaseController {
    online_users = [];

    one_to_one_join_room = (room_id) => {
        this.socket.join(room_id);
        console.log("joined room==",room_id);
        this.socket.emit("one_to_one_room_joined", room_id);
    };

    one_to_one_send_message = ({ room_id, data }) => {
        console.log(room_id, data);
        this.socket.to(room_id).emit("one_to_one_receive_message", data);
    };

    one_to_one_typing_started = (room_id) => {
        this.socket.to(room_id).emit("one_to_one_typing_started");
    };

    one_to_one_typing_stopped = (room_id) => {
        this.socket.to(room_id).emit("one_to_one_typing_stopped");
    };

    // one_to_one_go_online = (room_id) => {
    //     this.socket.broadcast.emit("one_to_one_get_online_user", room_id);
    // };

    // tutor_admin_go_offline = (room_id) => {
    //     this.socket.broadcast.emit("tutor_admin_get_offline_user", room_id);
    // };
};
