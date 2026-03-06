// Shared overworld functions used by all map scenes
var OverworldMixin = {
    initOverworld: function(mapKey) {
        // Copy mixin methods onto the scene so this._method() calls work
        var methods = ['_renderMap', '_createPlayer', '_createNPCs', '_createTrainerNPCs',
            '_createShopkeepNPCs', '_setupCamera', '_showLocationName', '_canMoveTo',
            '_checkExit', '_doExit', '_checkDoor', '_movePlayer', '_checkEncounter',
            '_interact', '_handleShop', '_handleStarter', '_professorIntercept',
            'updateOverworld'];
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
            8: 'tile_tree', 9: 'tile_sign', 10: 'tile_fence', 11: 'tile_flowers',
            12: 'tile_heal_roof', 13: 'tile_heal_wall', 14: 'tile_machine',
            15: 'tile_counter', 16: 'tile_bookshelf', 17: 'tile_rug',
            18: 'tile_mountain', 19: 'tile_chest'
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
                    } else if (tileId === -5) {
                        displayTile = 7; // interior exit rendered as floor
                    } else {
                        // NPCs/special - use floor if interior map, grass otherwise
                        displayTile = this.mapData.isInterior ? 7 : 0;
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
        // Render shopkeep NPCs from map data
        this._createShopkeepNPCs();
    },

    _createTrainerNPCs: function() {
        var data = this.mapData.data;
        var trainerTileMap = {
            '-13': { suffix: '_trainer1', sprite: 'npc_trainer_down' },
            '-14': { suffix: '_trainer2', sprite: 'npc_trainer_down' },
            '-16': { key: 'gymLeader', sprite: 'npc_gymleader_down' },
            '-18': { suffix: '_trainer1', sprite: 'npc_trainer_down' },
            '-19': { suffix: '_trainer2', sprite: 'npc_trainer_down' }
        };
        for (var y = 0; y < data.length; y++) {
            for (var x = 0; x < data[y].length; x++) {
                var tileStr = String(data[y][x]);
                var info = trainerTileMap[tileStr];
                if (!info) continue;

                var trainerKey = info.key || (this.mapKey + info.suffix);
                if (!TRAINERS[trainerKey]) continue;

                var nx = x * this.tileSize + this.tileSize / 2;
                var ny = y * this.tileSize + this.tileSize / 2 - 2;
                var npcSprite = this.add.image(nx, ny, info.sprite).setDepth(9);
                this.npcSprites['trainer_' + trainerKey] = npcSprite;
                npcSprite.trainerKey = trainerKey;
                npcSprite.gridX = x;
                npcSprite.gridY = y;
            }
        }
    },

    _createShopkeepNPCs: function() {
        var data = this.mapData.data;
        for (var y = 0; y < data.length; y++) {
            for (var x = 0; x < data[y].length; x++) {
                if (data[y][x] === -17) {
                    var nx = x * this.tileSize + this.tileSize / 2;
                    var ny = y * this.tileSize + this.tileSize / 2 - 2;
                    var npcSprite = this.add.image(nx, ny, 'npc_shopkeep_down').setDepth(9);
                    this.npcSprites['shopkeep_' + x + '_' + y] = npcSprite;
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
        // Blocked tiles: water, wall, roof, tree, fence, heal_roof, heal_wall, machine, counter, bookshelf
        if (tile === 3 || tile === 4 || tile === 5 || tile === 8 || tile === 10 ||
            tile === 12 || tile === 13 || tile === 14 || tile === 15 || tile === 16 || tile === 18) return false;
        // NPCs block
        if (tile === -11 || tile === -12 || tile === -13 || tile === -14 || tile === -15 || tile === -16 || tile === -17 || tile === -18 || tile === -19) return false;
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
        var targetScene = sceneMap[exit.targetMap] || 'GenericMapScene';
        if (!MAPS[exit.targetMap]) return;

        // Professor intercept when first leaving town
        if (this.mapKey === 'town' && exitResult.dir === 'south' && !PlayerState.receivedOrbs && PlayerState.hasStarter) {
            this._professorIntercept(exitResult);
            return;
        }

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

    _checkDoor: function() {
        var doors = this.mapData.doors;
        if (!doors) return;

        var key = this.playerGridX + ',' + this.playerGridY;
        var door = doors[key];
        if (!door) return;

        // Check if standing on a door tile (tile 6)
        var data = this.mapData.data;
        var tile = data[this.playerGridY][this.playerGridX];
        if (tile !== 6) return;

        // Save return position (one tile below the door)
        PlayerState.interiorReturn = {
            map: this.mapKey,
            x: this.playerGridX,
            y: this.playerGridY + 1
        };

        PlayerState.position.map = door.targetMap;
        PlayerState.position.x = door.targetX;
        PlayerState.position.y = door.targetY;
        PlayerState.save();

        this.cameras.main.fadeOut(300, 0, 0, 0);
        var self = this;
        this.time.delayedCall(300, function() {
            MenuUI.close();
            var targetMap = MAPS[door.targetMap];
            if (targetMap && targetMap.isInterior) {
                self.scene.start('InteriorScene');
            } else {
                var sceneMap = {
                    'town': 'TownScene', 'route1': 'RouteScene',
                    'worldMap': 'WorldMapScene', 'gymCity': 'GymCityScene'
                };
                self.scene.start(sceneMap[door.targetMap] || 'GenericMapScene');
            }
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

                // Check for doors (entering buildings)
                self._checkDoor();

                // Check for interior exit (tile -5)
                var data = self.mapData.data;
                var currentTile = data[self.playerGridY][self.playerGridX];
                if (currentTile === -5) {
                    var exitPos = self.mapData.exitPosition;
                    var extMap = self.mapData.exteriorMap;
                    if (PlayerState.interiorReturn) {
                        extMap = PlayerState.interiorReturn.map;
                        exitPos = { x: PlayerState.interiorReturn.x, y: PlayerState.interiorReturn.y };
                    }
                    PlayerState.position.map = extMap;
                    PlayerState.position.x = exitPos.x;
                    PlayerState.position.y = exitPos.y;
                    PlayerState.interiorReturn = null;
                    PlayerState.save();

                    self.cameras.main.fadeOut(300, 0, 0, 0);
                    self.time.delayedCall(300, function() {
                        MenuUI.close();
                        var sceneMap = {
                            'town': 'TownScene', 'route1': 'RouteScene',
                            'worldMap': 'WorldMapScene', 'gymCity': 'GymCityScene'
                        };
                        self.scene.start(sceneMap[extMap] || 'GenericMapScene');
                    });
                    return;
                }

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
            var locationId = this.mapKey;
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
                } else if (npc.action === 'shop') {
                    this._handleShop();
                } else if (npc.action === 'starter') {
                    this._handleStarter();
                } else {
                    DialogManager.showDialog(npc.dialog);
                }
                return;
            }
        }

        // Check for pickups (chest tile 19)
        if (tile === 19 && this.mapData.pickups) {
            var pickupKey = targetX + ',' + targetY;
            var pickup = this.mapData.pickups[pickupKey];
            if (pickup) {
                var globalPickupKey = this.mapKey + '_' + pickupKey;
                if (PlayerState.collectedPickups.indexOf(globalPickupKey) >= 0) {
                    DialogManager.showDialog(["The chest is empty."]);
                    return;
                }
                PlayerState.collectedPickups.push(globalPickupKey);
                if (pickup.item === 'xpGain') {
                    PlayerState.inventory.xpGains += (pickup.count || 1);
                } else if (pickup.item === 'potion') {
                    PlayerState.inventory.potions += (pickup.count || 1);
                }
                PlayerState.save();
                DialogManager.showDialog(pickup.dialog || ["You found an item!"]);
                return;
            }
        }

        // Check for trainers
        if (tile === -13 || tile === -14 || tile === -16 || tile === -18 || tile === -19) {
            var trainerTileSuffix = { '-13': '_trainer1', '-14': '_trainer2', '-18': '_trainer1', '-19': '_trainer2' };
            var trainerKey = null;
            if (tile === -16) trainerKey = 'gymLeader';
            else trainerKey = this.mapKey + (trainerTileSuffix[String(tile)] || '_trainer1');

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
    },
    _handleShop: function() {
        var self = this;
        DialogManager.showChoice('What would you like to buy?', [
            'Potion (20g) - Heals 20 HP',
            'Friendship Orb (100g)',
            'Cancel'
        ], function(idx) {
            if (idx === 0) {
                PlayerState.inventory.potions++;
                DialogManager.showDialog(["You bought a Potion!", "Potions: " + PlayerState.inventory.potions], function() {
                    PlayerState.save();
                });
            } else if (idx === 1) {
                PlayerState.inventory.friendshipOrbs++;
                DialogManager.showDialog(["You bought a Friendship Orb!", "Friendship Orbs: " + PlayerState.inventory.friendshipOrbs], function() {
                    PlayerState.save();
                });
            }
        });
    },

    _handleStarter: function() {
        var self = this;
        if (PlayerState.hasStarter) {
            DialogManager.showDialog([
                "Your " + PlayerState.team[0].name + " looks healthy!",
                "Take good care of your beasts!"
            ]);
            return;
        }
        DialogManager.showDialog([
            "Ah, there you are!",
            "Are you ready to choose your first beast partner?",
            "I have three wonderful beasts for you to choose from!"
        ], function() {
            self.cameras.main.fadeOut(500, 0, 0, 0);
            self.time.delayedCall(500, function() {
                self.scene.start('StarterSelectScene');
            });
        });
    },

    _professorIntercept: function(exitResult) {
        var self = this;
        PlayerState.receivedOrbs = true;
        PlayerState.inventory.simpleFriendshipOrbs += 5;
        PlayerState.save();

        DialogManager.showDialog([
            "Wait! " + PlayerState.name + "!",
            "Professor Elm rushes over...",
            "I almost forgot! Take these with you!",
            "You received 5 Simple Friendship Orbs!",
            "Use them during battle to befriend wild beasts.",
            "Simple orbs work on beasts up to level 50.",
            "For stronger beasts, you'll need proper Friendship Orbs!",
            "Good luck on your journey!"
        ], function() {
            // Now do the actual exit
            var exit = exitResult.exit;
            var sceneMap = {
                'town': 'TownScene', 'route1': 'RouteScene',
                'worldMap': 'WorldMapScene', 'gymCity': 'GymCityScene'
            };
            var targetScene = sceneMap[exit.targetMap] || 'GenericMapScene';
            if (!MAPS[exit.targetMap]) return;

            PlayerState.position.map = exit.targetMap;
            PlayerState.position.x = exit.targetX;
            PlayerState.position.y = exit.targetY;
            PlayerState.save();

            self.cameras.main.fadeOut(300, 0, 0, 0);
            self.time.delayedCall(300, function() {
                MenuUI.close();
                self.scene.start(targetScene);
            });
        });
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
