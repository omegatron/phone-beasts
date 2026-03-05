// Shared overworld functions used by all map scenes
var OverworldMixin = {
    initOverworld: function(mapKey) {
        // Copy mixin methods onto the scene so this._method() calls work
        var methods = ['_renderMap', '_createPlayer', '_createNPCs', '_createTrainerNPCs',
            '_setupCamera', '_showLocationName', '_canMoveTo', '_checkExit', '_doExit',
            '_movePlayer', '_checkEncounter', '_interact', 'updateOverworld'];
        for (var i = 0; i < methods.length; i++) {
            this[methods[i]] = OverworldMixin[methods[i]];
        }

        this.mapKey = mapKey;
        this.mapData = MAPS[mapKey];
        this.tileSize = TILE_SIZE;
        this.playerGridX = PlayerState.position.x;
        this.playerGridY = PlayerState.position.y;
        this.isMoving = false;
        this.moveSpeed = 150; // ms per tile
        this.moveTimer = 0;
        this.facing = 'down';
        this.walkFrame = 0;
        this.inputCooldown = 0;
        this.encounterCooldown = 0;
        this.npcSprites = {};

        DialogManager.init(this);
        this._renderMap();
        this._createPlayer();
        this._createNPCs();
        this._setupCamera();
        this.cameras.main.fadeIn(500, 0, 0, 0);

        // Location name popup
        this._showLocationName();

        // Save position
        PlayerState.position.map = mapKey;
        PlayerState.position.x = this.playerGridX;
        PlayerState.position.y = this.playerGridY;
    },

    _renderMap: function() {
        var data = this.mapData.data;
        var tileMap = {
            0: 'tile_grass', 1: 'tile_path', 2: 'tile_tallgrass', 3: 'tile_water',
            4: 'tile_wall', 5: 'tile_roof', 6: 'tile_door', 7: 'tile_floor',
            8: 'tile_tree', 9: 'tile_sign', 10: 'tile_fence', 11: 'tile_flowers'
        };

        this.tileGroup = this.add.group();

        for (var y = 0; y < data.length; y++) {
            for (var x = 0; x < data[y].length; x++) {
                var tileId = data[y][x];
                var displayTile = tileId;

                // Negative tiles get rendered as their underlying terrain
                if (tileId < 0) {
                    if (tileId === -1 || tileId === -2 || tileId === -3 || tileId === -4) {
                        displayTile = 1; // exits are paths
                    } else {
                        displayTile = 0; // NPCs/special on grass
                    }
                }

                var tileKey = tileMap[displayTile] || 'tile_grass';
                var sprite = this.add.image(x * this.tileSize + this.tileSize / 2,
                    y * this.tileSize + this.tileSize / 2, tileKey);
                this.tileGroup.add(sprite);
            }
        }
    },

    _createPlayer: function() {
        var px = this.playerGridX * this.tileSize + this.tileSize / 2;
        var py = this.playerGridY * this.tileSize + this.tileSize / 2 - 2;
        this.player = this.add.image(px, py, 'player_' + this.facing + '_0').setDepth(10);
    },

    _createNPCs: function() {
        var npcs = this.mapData.npcs;
        for (var key in npcs) {
            var npc = npcs[key];
            var nx = npc.x * this.tileSize + this.tileSize / 2;
            var ny = npc.y * this.tileSize + this.tileSize / 2 - 2;
            var spriteKey = npc.sprite + '_' + npc.dir;
            var npcSprite = this.add.image(nx, ny, spriteKey).setDepth(9);
            this.npcSprites[key] = npcSprite;
        }

        // Render trainer NPCs from map data
        this._createTrainerNPCs();
    },

    _createTrainerNPCs: function() {
        var data = this.mapData.data;
        for (var y = 0; y < data.length; y++) {
            for (var x = 0; x < data[y].length; x++) {
                if (data[y][x] === -13 || data[y][x] === -14 || data[y][x] === -16) {
                    var trainerKey;
                    var spriteKey;
                    if (data[y][x] === -13) {
                        trainerKey = this.mapKey === 'route1' ? 'route1_trainer1' : null;
                        spriteKey = 'npc_trainer_down';
                    } else if (data[y][x] === -14) {
                        trainerKey = this.mapKey === 'route1' ? 'route1_trainer2' : null;
                        spriteKey = 'npc_trainer_down';
                    } else if (data[y][x] === -16) {
                        trainerKey = 'gymLeader';
                        spriteKey = 'npc_gymleader_down';
                    }

                    if (trainerKey) {
                        var nx = x * this.tileSize + this.tileSize / 2;
                        var ny = y * this.tileSize + this.tileSize / 2 - 2;
                        var npcSprite = this.add.image(nx, ny, spriteKey).setDepth(9);
                        this.npcSprites['trainer_' + trainerKey] = npcSprite;
                        npcSprite.trainerKey = trainerKey;
                        npcSprite.gridX = x;
                        npcSprite.gridY = y;
                    }
                }
            }
        }
    },

    _setupCamera: function() {
        var cam = this.cameras.main;
        var mapW = this.mapData.width * this.tileSize;
        var mapH = this.mapData.height * this.tileSize;
        cam.setBounds(0, 0, mapW, mapH);
        cam.startFollow(this.player, true, 0.1, 0.1);
    },

    _showLocationName: function() {
        var cam = this.cameras.main;
        var locText = this.add.text(cam.width / 2, 20, this.mapData.name, {
            fontSize: '14px', fontFamily: 'monospace', color: '#ffffff',
            backgroundColor: 'rgba(0,0,0,0.6)', padding: { x: 10, y: 4 }
        }).setOrigin(0.5).setScrollFactor(0).setDepth(50);

        this.tweens.add({
            targets: locText,
            alpha: 0,
            delay: 2000,
            duration: 1000,
            onComplete: function() { locText.destroy(); }
        });
    },

    updateOverworld: function(time, delta) {
        this.inputCooldown -= delta;
        this.encounterCooldown -= delta;

        // Menu handling
        if (MenuUI.isOpen) {
            MenuUI.handleInput();
            return;
        }

        // Dialog handling
        if (DialogManager.isShowing()) {
            if (TouchControls.justPressed('a')) {
                if (DialogManager.choiceMode) {
                    DialogManager.confirmChoice();
                } else {
                    DialogManager.advance();
                }
            }
            if (DialogManager.choiceMode) {
                if (TouchControls.justPressed('up')) DialogManager.updateChoiceSelection('up');
                if (TouchControls.justPressed('down')) DialogManager.updateChoiceSelection('down');
            }
            return;
        }

        // Menu button
        if (TouchControls.justPressed('menu') || TouchControls.justPressed('b')) {
            MenuUI.open(this);
            return;
        }

        // Movement
        if (!this.isMoving && this.inputCooldown <= 0) {
            var dx = 0, dy = 0;
            if (TouchControls.isDown('up'))    { dy = -1; this.facing = 'up'; }
            else if (TouchControls.isDown('down'))  { dy = 1; this.facing = 'down'; }
            else if (TouchControls.isDown('left'))  { dx = -1; this.facing = 'left'; }
            else if (TouchControls.isDown('right')) { dx = 1; this.facing = 'right'; }

            if (dx !== 0 || dy !== 0) {
                var newX = this.playerGridX + dx;
                var newY = this.playerGridY + dy;

                // Check for exits
                var exitResult = this._checkExit(newX, newY);
                if (exitResult) {
                    this._doExit(exitResult);
                    return;
                }

                if (this._canMoveTo(newX, newY)) {
                    this._movePlayer(newX, newY);
                }
            }

            // Update facing sprite even when standing
            this.player.setTexture('player_' + this.facing + '_0');
        }

        // Interaction
        if (TouchControls.justPressed('a') && !this.isMoving) {
            this._interact();
        }
    },

    _canMoveTo: function(x, y) {
        var data = this.mapData.data;
        if (y < 0 || y >= data.length || x < 0 || x >= data[0].length) return false;
        var tile = data[y][x];
        // Blocked tiles: water, wall, roof, tree, fence
        if (tile === 3 || tile === 4 || tile === 5 || tile === 8 || tile === 10) return false;
        // NPCs block
        if (tile === -11 || tile === -12 || tile === -13 || tile === -14 || tile === -15 || tile === -16) return false;
        return true;
    },

    _checkExit: function(x, y) {
        var data = this.mapData.data;
        if (y < 0 || y >= data.length || x < 0 || x >= data[0].length) return null;
        var tile = data[y][x];

        if (tile === -1 && this.mapData.exits.south) return { dir: 'south', exit: this.mapData.exits.south };
        if (tile === -2 && this.mapData.exits.north) return { dir: 'north', exit: this.mapData.exits.north };
        if (tile === -3 && this.mapData.exits.east) return { dir: 'east', exit: this.mapData.exits.east };
        if (tile === -4 && this.mapData.exits.west) return { dir: 'west', exit: this.mapData.exits.west };
        return null;
    },

    _doExit: function(exitResult) {
        var exit = exitResult.exit;
        var sceneMap = {
            'town': 'TownScene', 'route1': 'RouteScene',
            'worldMap': 'WorldMapScene', 'gymCity': 'GymCityScene'
        };
        var targetScene = sceneMap[exit.targetMap];
        if (!targetScene) return;

        PlayerState.position.map = exit.targetMap;
        PlayerState.position.x = exit.targetX;
        PlayerState.position.y = exit.targetY;
        PlayerState.save();

        this.cameras.main.fadeOut(300, 0, 0, 0);
        var self = this;
        this.time.delayedCall(300, function() {
            MenuUI.close();
            self.scene.start(targetScene);
        });
    },

    _movePlayer: function(newX, newY) {
        this.isMoving = true;
        this.playerGridX = newX;
        this.playerGridY = newY;

        // Walk animation
        this.walkFrame = (this.walkFrame + 1) % 3;
        this.player.setTexture('player_' + this.facing + '_' + this.walkFrame);

        var targetX = newX * this.tileSize + this.tileSize / 2;
        var targetY = newY * this.tileSize + this.tileSize / 2 - 2;

        var self = this;
        this.tweens.add({
            targets: this.player,
            x: targetX,
            y: targetY,
            duration: this.moveSpeed,
            onComplete: function() {
                self.isMoving = false;
                self.player.setTexture('player_' + self.facing + '_0');

                // Update saved position
                PlayerState.position.x = self.playerGridX;
                PlayerState.position.y = self.playerGridY;

                // Check for wild encounter
                self._checkEncounter();
            }
        });
    },

    _checkEncounter: function() {
        if (this.encounterCooldown > 0) return;
        var data = this.mapData.data;
        var tile = data[this.playerGridY][this.playerGridX];
        if (tile !== 2) return; // Only tall grass

        var rate = this.mapData.encounterRate || 15;
        if (Math.random() * 100 < rate) {
            this.encounterCooldown = 1000;
            var locationId = this.mapKey === 'route1' ? 'route1' : 'worldMap';
            var wildBeast = BattleEngine.generateWildBeast(locationId);
            if (wildBeast) {
                // Screen flash effect
                this.cameras.main.flash(300, 255, 255, 255);
                PlayerState.save();
                var self = this;
                this.time.delayedCall(300, function() {
                    self.scene.start('BattleScene', {
                        type: 'wild',
                        enemyTeam: [wildBeast],
                        returnScene: self.scene.key
                    });
                });
            }
        }
    },

    _interact: function() {
        // Check what's in front of the player
        var dx = 0, dy = 0;
        if (this.facing === 'up') dy = -1;
        else if (this.facing === 'down') dy = 1;
        else if (this.facing === 'left') dx = -1;
        else if (this.facing === 'right') dx = 1;

        var targetX = this.playerGridX + dx;
        var targetY = this.playerGridY + dy;
        var data = this.mapData.data;

        if (targetY < 0 || targetY >= data.length || targetX < 0 || targetX >= data[0].length) return;
        var tile = data[targetY][targetX];

        // Check for sign
        var signKey = targetX + ',' + targetY;
        if (this.mapData.signs && this.mapData.signs[signKey]) {
            DialogManager.showDialog([this.mapData.signs[signKey]]);
            return;
        }

        // Check NPCs
        var npcs = this.mapData.npcs;
        for (var key in npcs) {
            var npc = npcs[key];
            if (npc.x === targetX && npc.y === targetY) {
                if (npc.action === 'heal') {
                    var self = this;
                    DialogManager.showDialog(npc.dialog, function() {
                        PlayerState.healAll();
                        PlayerState.save();
                    });
                } else {
                    DialogManager.showDialog(npc.dialog);
                }
                return;
            }
        }

        // Check for trainers
        if (tile === -13 || tile === -14 || tile === -16) {
            var trainerKey = null;
            if (tile === -13 && this.mapKey === 'route1') trainerKey = 'route1_trainer1';
            else if (tile === -14 && this.mapKey === 'route1') trainerKey = 'route1_trainer2';
            else if (tile === -16) trainerKey = 'gymLeader';

            if (trainerKey && TRAINERS[trainerKey]) {
                // Check if already defeated
                if (PlayerState.defeatedTrainers.indexOf(trainerKey) >= 0) {
                    DialogManager.showDialog(TRAINERS[trainerKey].defeatDialog);
                    return;
                }

                var trainer = TRAINERS[trainerKey];
                var self = this;
                DialogManager.showDialog(trainer.dialog, function() {
                    var enemyTeam = BattleEngine.createTrainerTeam(trainerKey);
                    PlayerState.save();
                    self.scene.start('BattleScene', {
                        type: 'trainer',
                        trainerKey: trainerKey,
                        trainerName: trainer.name,
                        enemyTeam: enemyTeam,
                        returnScene: self.scene.key,
                        isGymLeader: trainerKey === 'gymLeader'
                    });
                });
            }
        }
    }
};


// TOWN SCENE
var TownScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, { key: 'TownScene' });
    },

    create: function() {
        OverworldMixin.initOverworld.call(this, 'town');
    },

    update: function(time, delta) {
        OverworldMixin.updateOverworld.call(this, time, delta);
    }
});
