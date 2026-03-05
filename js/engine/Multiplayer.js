var Multiplayer = {
    peer: null,
    conn: null,
    isHost: false,
    isConnected: false,
    roomCode: '',
    onMessage: null,
    onConnect: null,
    onDisconnect: null,

    createRoom: function(callback) {
        var self = this;
        this.isHost = true;

        this.peer = new Peer();
        this.peer.on('open', function(id) {
            // Use last 6 chars as room code
            self.roomCode = id.slice(-6).toUpperCase();
            if (callback) callback(self.roomCode, id);
        });

        this.peer.on('connection', function(conn) {
            self.conn = conn;
            self._setupConnection();
        });

        this.peer.on('error', function(err) {
            console.error('PeerJS error:', err);
        });
    },

    joinRoom: function(fullPeerId, callback) {
        var self = this;
        this.isHost = false;

        this.peer = new Peer();
        this.peer.on('open', function() {
            self.conn = self.peer.connect(fullPeerId, { reliable: true });
            self._setupConnection();
            if (callback) callback();
        });

        this.peer.on('error', function(err) {
            console.error('PeerJS error:', err);
        });
    },

    // For joining by short code, we need the full peer ID.
    // The host shares their full peer ID which includes the short code.
    joinByCode: function(code, hostPeerId, callback) {
        this.joinRoom(hostPeerId, callback);
    },

    _setupConnection: function() {
        var self = this;

        this.conn.on('open', function() {
            self.isConnected = true;
            if (self.onConnect) self.onConnect();
        });

        this.conn.on('data', function(data) {
            if (self.onMessage) self.onMessage(data);
        });

        this.conn.on('close', function() {
            self.isConnected = false;
            if (self.onDisconnect) self.onDisconnect();
        });

        this.conn.on('error', function(err) {
            console.error('Connection error:', err);
        });
    },

    send: function(data) {
        if (this.conn && this.isConnected) {
            this.conn.send(data);
        }
    },

    sendMoveSelect: function(moveId) {
        this.send({ type: 'MOVE_SELECT', move: moveId });
    },

    sendBeastSwitch: function(index) {
        this.send({ type: 'BEAST_SWITCH', index: index });
    },

    sendTeamInfo: function(team) {
        // Send sanitized team info
        var info = team.map(function(b) {
            return {
                id: b.id, name: b.name, type: b.type,
                level: b.level, currentHP: b.currentHP,
                stats: b.stats, moves: b.moves
            };
        });
        this.send({ type: 'TEAM_INFO', team: info });
    },

    sendReady: function() {
        this.send({ type: 'READY' });
    },

    disconnect: function() {
        if (this.conn) this.conn.close();
        if (this.peer) this.peer.destroy();
        this.peer = null;
        this.conn = null;
        this.isConnected = false;
        this.isHost = false;
        this.roomCode = '';
    }
};
