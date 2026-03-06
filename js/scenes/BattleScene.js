var BattleScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, { key: 'BattleScene' });
    },

    init: function(data) {
        this.battleType = data.type || 'wild';      // 'wild', 'trainer', 'pvp'
        this.enemyTeam = data.enemyTeam || [];
        this.returnScene = data.returnScene || 'TownScene';
        this.trainerName = data.trainerName || 'Wild';
        this.trainerKey = data.trainerKey || null;
        this.isGymLeader = data.isGymLeader || false;
        this.isHost = data.isHost || false;
    },

    create: function() {
        var cam = this.cameras.main;
        var w = cam.width, h = cam.height;

        this.cameras.main.setBackgroundColor('#87CEEB');
        DialogManager.init(this);

        // Battle state
        this.currentPlayerBeastIdx = PlayerState.getFirstAliveBeast();
        this.currentEnemyBeastIdx = 0;
        this.playerBuffs = { atk: 0, def: 0, spd: 0, accuracy: 0 };
        this.enemyBuffs = { atk: 0, def: 0, spd: 0, accuracy: 0 };
        this.battleOver = false;
        this.awaitingInput = false;
        this.moveMenu = null;
        this.actionMenu = null;
        this.inputCooldown = 0;

        // PvP state
        this.pvpEnemyMove = null;
        this.pvpWaitingForOpponent = false;

        // For PvP, set up message handler
        if (this.battleType === 'pvp') {
            this._setupPvPHandlers();
        }

        // Draw battle scene
        this._drawBattleField();
        this._drawBeasts();
        this._drawBeastInfo();

        // Opening message
        var self = this;
        var openMsg = this.battleType === 'wild'
            ? 'A wild ' + this.enemyTeam[0].name + ' appeared!'
            : this.trainerName + ' wants to battle!';

        this.time.delayedCall(500, function() {
            DialogManager.showDialog([openMsg], function() {
                self._showActionMenu();
            });
        });

        TouchControls.show();
    },

    _setupPvPHandlers: function() {
        var self = this;
        Multiplayer.onMessage = function(data) {
            if (data.type === 'MOVE_SELECT') {
                self.pvpEnemyMove = data.move;
                if (self.pvpWaitingForOpponent) {
                    self._resolvePvPTurn();
                }
            } else if (data.type === 'TEAM_INFO') {
                self.enemyTeam = data.team;
                self.currentEnemyBeastIdx = 0;
                self._drawBeasts();
                self._drawBeastInfo();
            }
        };
    },

    _drawBattleField: function() {
        var cam = this.cameras.main;
        var w = cam.width, h = cam.height;

        // Sky
        var sky = this.add.graphics();
        sky.fillGradientStyle(0x87CEEB, 0x87CEEB, 0xb8e6b8, 0xb8e6b8);
        sky.fillRect(0, 0, w, h * 0.5);

        // Ground
        var ground = this.add.graphics();
        ground.fillStyle(0x7cba6d, 1);
        ground.fillRect(0, h * 0.5, w, h * 0.5);

        // Enemy platform
        var platE = this.add.graphics();
        platE.fillStyle(0x5a9c4f, 1);
        platE.fillEllipse(w * 0.7, h * 0.35, 120, 20);

        // Player platform
        var platP = this.add.graphics();
        platP.fillStyle(0x5a9c4f, 1);
        platP.fillEllipse(w * 0.3, h * 0.55, 120, 20);
    },

    _drawBeasts: function() {
        var cam = this.cameras.main;
        var w = cam.width, h = cam.height;

        // Clear existing sprites
        if (this.playerBeastSprite) this.playerBeastSprite.destroy();
        if (this.enemyBeastSprite) this.enemyBeastSprite.destroy();

        var playerBeast = PlayerState.team[this.currentPlayerBeastIdx];
        var enemyBeast = this.enemyTeam[this.currentEnemyBeastIdx];

        if (playerBeast) {
            this.playerBeastSprite = this.add.image(w * 0.25, h * 0.45, 'beast_' + playerBeast.id + '_back')
                .setScale(2).setDepth(20);
        }

        if (enemyBeast) {
            this.enemyBeastSprite = this.add.image(w * 0.72, h * 0.22, 'beast_' + enemyBeast.id + '_front')
                .setScale(2).setDepth(20);
        }
    },

    _drawBeastInfo: function() {
        if (this.playerInfo) this.playerInfo.destroy();
        if (this.enemyInfo) this.enemyInfo.destroy();

        var cam = this.cameras.main;
        var w = cam.width, h = cam.height;

        var playerBeast = PlayerState.team[this.currentPlayerBeastIdx];
        var enemyBeast = this.enemyTeam[this.currentEnemyBeastIdx];

        if (playerBeast) {
            this.playerInfo = BattleUI.drawBeastInfo(this, 8, h * 0.58, playerBeast, true);
        }

        if (enemyBeast) {
            this.enemyInfo = BattleUI.drawBeastInfo(this, w - 148, 8, enemyBeast, false);
        }
    },

    _showActionMenu: function() {
        if (this.battleOver) return;
        this.awaitingInput = true;

        if (this.actionMenu) this.actionMenu.destroy();
        if (this.moveMenu) this.moveMenu.destroy();

        var cam = this.cameras.main;
        var options = ['Fight', 'Bag', 'Beast', 'Run'];
        if (this.battleType === 'trainer' || this.battleType === 'pvp') {
            options[3] = 'Run'; // Can't run from trainer battles (will show message)
        }

        var self = this;
        this.actionMenu = BattleUI.drawActionMenu(this, 0, 0, options, function(idx) {
            self.awaitingInput = false;
            BattleUI.clearMenu();
            if (self.actionMenu) self.actionMenu.destroy();
            self.actionMenu = null;

            switch(idx) {
                case 0: self._showMoveMenu(); break;
                case 1: self._useBag(); break;
                case 2: self._switchBeast(); break;
                case 3: self._tryRun(); break;
            }
        });
    },

    _showMoveMenu: function() {
        var playerBeast = PlayerState.team[this.currentPlayerBeastIdx];
        var cam = this.cameras.main;
        var self = this;

        this.moveMenu = BattleUI.drawMoveMenu(this, playerBeast, 8, cam.height - 100, function(moveIdx) {
            BattleUI.clearMenu();
            if (self.moveMenu) self.moveMenu.destroy();
            self.moveMenu = null;

            var moveId = playerBeast.moves[moveIdx];
            if (!moveId || !playerBeast.pp[moveId] || playerBeast.pp[moveId] <= 0) {
                DialogManager.showDialog(["No PP left for this move!"], function() {
                    self._showActionMenu();
                });
                return;
            }

            if (self.battleType === 'pvp') {
                Multiplayer.sendMoveSelect(moveId);
                self.playerSelectedMove = moveId;
                if (self.pvpEnemyMove) {
                    self._resolvePvPTurn();
                } else {
                    self.pvpWaitingForOpponent = true;
                    DialogManager.showDialog(["Waiting for opponent..."]);
                }
            } else {
                self._executeTurn(moveId);
            }
        });
    },

    _useBag: function() {
        var self = this;
        var totalOrbs = PlayerState.getTotalOrbs();

        if (this.battleType === 'wild' && totalOrbs > 0) {
            var orbOptions = [];
            var orbActions = [];

            orbOptions.push('Potion (' + PlayerState.inventory.potions + ')');
            orbActions.push(function() { self._usePotion(); });

            if (PlayerState.inventory.friendshipOrbs > 0) {
                orbOptions.push('Friendship Orb (' + PlayerState.inventory.friendshipOrbs + ')');
                orbActions.push(function() { self._useFriendshipOrb('friendship'); });
            }
            if (PlayerState.inventory.simpleFriendshipOrbs > 0) {
                orbOptions.push('Simple Orb (' + PlayerState.inventory.simpleFriendshipOrbs + ')');
                orbActions.push(function() { self._useFriendshipOrb('simple'); });
            }
            orbOptions.push('Cancel');
            orbActions.push(function() { self._showActionMenu(); });

            DialogManager.showChoice('Use item:', orbOptions, function(idx) {
                orbActions[idx]();
            });
        } else {
            DialogManager.showChoice('Use item:', ['Potion (' + PlayerState.inventory.potions + ')', 'Cancel'], function(idx) {
                if (idx === 0) self._usePotion();
                else self._showActionMenu();
            });
        }
    },

    _usePotion: function() {
        var self = this;
        if (PlayerState.inventory.potions <= 0) {
            DialogManager.showDialog(["No potions left!"], function() { self._showActionMenu(); });
            return;
        }

        var beast = PlayerState.team[this.currentPlayerBeastIdx];
        var maxHP = PlayerState.calcStats(BEASTS[beast.id].baseStats, beast.level).hp + beast.level;

        if (beast.currentHP >= maxHP) {
            DialogManager.showDialog([beast.name + " is already at full HP!"], function() { self._showActionMenu(); });
            return;
        }

        PlayerState.usePotion(this.currentPlayerBeastIdx);
        this._drawBeastInfo();

        DialogManager.showDialog(["Used a Potion on " + beast.name + "!"], function() {
            self._enemyTurn();
        });
    },

    _useFriendshipOrb: function(orbType) {
        var self = this;
        var orbName = orbType === 'simple' ? 'Simple Friendship Orb' : 'Friendship Orb';
        var invKey = orbType === 'simple' ? 'simpleFriendshipOrbs' : 'friendshipOrbs';

        if (PlayerState.inventory[invKey] <= 0) {
            DialogManager.showDialog(["No " + orbName + "s left!"], function() { self._showActionMenu(); });
            return;
        }

        var enemyBeast = this.enemyTeam[this.currentEnemyBeastIdx];

        // Simple orbs only work on beasts up to level 50
        if (orbType === 'simple' && enemyBeast.level > 50) {
            DialogManager.showDialog(["The Simple Friendship Orb won't work!", enemyBeast.name + " is too strong for a simple orb!"], function() {
                self._showActionMenu();
            });
            return;
        }

        PlayerState.inventory[invKey]--;
        var caught = BattleEngine.attemptCatch(enemyBeast);

        if (caught) {
            this.cameras.main.shake(300, 0.01);
            var catchBeast = PlayerState.createBeastInstance(enemyBeast.id, enemyBeast.level);
            catchBeast.currentHP = enemyBeast.currentHP;

            DialogManager.showDialog(["You used a " + orbName + "!", "...", "The orb glows warmly! " + enemyBeast.name + " became your friend!"], function() {
                if (PlayerState.team.length < 6) {
                    PlayerState.addBeastToTeam(catchBeast);
                    DialogManager.showDialog([enemyBeast.name + " was added to your team!"], function() {
                        self._endBattle(true);
                    });
                } else {
                    DialogManager.showDialog(["Your team is full! " + enemyBeast.name + " was released."], function() {
                        self._endBattle(true);
                    });
                }
            });
        } else {
            DialogManager.showDialog(["You used a " + orbName + "!", "...", "Oh no! " + enemyBeast.name + " resisted the orb!"], function() {
                self._enemyTurn();
            });
        }
    },

    _switchBeast: function() {
        var self = this;
        var options = [];
        var indices = [];

        for (var i = 0; i < PlayerState.team.length; i++) {
            if (i === this.currentPlayerBeastIdx) continue;
            var b = PlayerState.team[i];
            if (b.currentHP > 0) {
                options.push(b.name + ' L' + b.level + ' HP:' + b.currentHP);
                indices.push(i);
            }
        }

        if (options.length === 0) {
            DialogManager.showDialog(["No other beasts available!"], function() { self._showActionMenu(); });
            return;
        }

        options.push('Cancel');

        DialogManager.showChoice('Switch to:', options, function(idx) {
            if (idx < indices.length) {
                self.playerBuffs = { atk: 0, def: 0, spd: 0, accuracy: 0 };
                self.currentPlayerBeastIdx = indices[idx];
                self._drawBeasts();
                self._drawBeastInfo();

                var newBeast = PlayerState.team[self.currentPlayerBeastIdx];
                DialogManager.showDialog(["Go, " + newBeast.name + "!"], function() {
                    self._enemyTurn();
                });
            } else {
                self._showActionMenu();
            }
        });
    },

    _tryRun: function() {
        var self = this;
        if (this.battleType !== 'wild') {
            DialogManager.showDialog(["Can't run from a trainer battle!"], function() {
                self._showActionMenu();
            });
            return;
        }

        // 75% chance to flee
        if (Math.random() < 0.75) {
            DialogManager.showDialog(["Got away safely!"], function() {
                self._endBattle(false);
            });
        } else {
            DialogManager.showDialog(["Couldn't get away!"], function() {
                self._enemyTurn();
            });
        }
    },

    _executeTurn: function(playerMoveId) {
        var playerBeast = PlayerState.team[this.currentPlayerBeastIdx];
        var enemyBeast = this.enemyTeam[this.currentEnemyBeastIdx];
        var playerMove = MOVES[playerMoveId];

        // Enemy picks a random move
        var enemyMoves = enemyBeast.moves.filter(function(m) {
            return enemyBeast.pp[m] > 0;
        });
        if (enemyMoves.length === 0) enemyMoves = ['tackle'];
        var enemyMoveId = enemyMoves[Math.floor(Math.random() * enemyMoves.length)];
        var enemyMove = MOVES[enemyMoveId];

        // Determine turn order
        var first = BattleEngine.determineTurnOrder(playerBeast, enemyBeast, this.playerBuffs, this.enemyBuffs);

        var self = this;

        if (first === 1) {
            // Player goes first
            this._doAttack(playerBeast, enemyBeast, playerMove, playerMoveId, true, function() {
                if (self.battleOver) return;
                if (enemyBeast.currentHP <= 0) {
                    self._onEnemyFainted();
                    return;
                }
                self._doAttack(enemyBeast, playerBeast, enemyMove, enemyMoveId, false, function() {
                    if (playerBeast.currentHP <= 0) {
                        self._onPlayerBeastFainted();
                    } else {
                        self._showActionMenu();
                    }
                });
            });
        } else {
            // Enemy goes first
            this._doAttack(enemyBeast, playerBeast, enemyMove, enemyMoveId, false, function() {
                if (self.battleOver) return;
                if (playerBeast.currentHP <= 0) {
                    self._onPlayerBeastFainted();
                    return;
                }
                self._doAttack(playerBeast, enemyBeast, playerMove, playerMoveId, true, function() {
                    if (enemyBeast.currentHP <= 0) {
                        self._onEnemyFainted();
                    } else {
                        self._showActionMenu();
                    }
                });
            });
        }
    },

    _resolvePvPTurn: function() {
        this.pvpWaitingForOpponent = false;
        var playerMoveId = this.playerSelectedMove;
        var enemyMoveId = this.pvpEnemyMove;
        this.pvpEnemyMove = null;

        var playerBeast = PlayerState.team[this.currentPlayerBeastIdx];
        var enemyBeast = this.enemyTeam[this.currentEnemyBeastIdx];
        var playerMove = MOVES[playerMoveId] || MOVES['tackle'];
        var enemyMove = MOVES[enemyMoveId] || MOVES['tackle'];

        var first = BattleEngine.determineTurnOrder(playerBeast, enemyBeast, this.playerBuffs, this.enemyBuffs);
        var self = this;

        if (first === 1) {
            this._doAttack(playerBeast, enemyBeast, playerMove, playerMoveId, true, function() {
                if (enemyBeast.currentHP <= 0) { self._onEnemyFainted(); return; }
                self._doAttack(enemyBeast, playerBeast, enemyMove, enemyMoveId, false, function() {
                    if (playerBeast.currentHP <= 0) self._onPlayerBeastFainted();
                    else self._showActionMenu();
                });
            });
        } else {
            this._doAttack(enemyBeast, playerBeast, enemyMove, enemyMoveId, false, function() {
                if (playerBeast.currentHP <= 0) { self._onPlayerBeastFainted(); return; }
                self._doAttack(playerBeast, enemyBeast, playerMove, playerMoveId, true, function() {
                    if (enemyBeast.currentHP <= 0) self._onEnemyFainted();
                    else self._showActionMenu();
                });
            });
        }
    },

    _doAttack: function(attacker, defender, move, moveId, isPlayer, callback) {
        var self = this;
        var atkBuffs = isPlayer ? this.playerBuffs : this.enemyBuffs;
        var defBuffs = isPlayer ? this.enemyBuffs : this.playerBuffs;

        // Deduct PP
        if (attacker.pp && attacker.pp[moveId] !== undefined) {
            attacker.pp[moveId] = Math.max(0, attacker.pp[moveId] - 1);
        }

        // Check accuracy
        if (!BattleEngine.checkAccuracy(move, atkBuffs, defBuffs)) {
            DialogManager.showDialog([attacker.name + "'s attack missed!"], callback);
            return;
        }

        var messages = [attacker.name + " used " + move.name + "!"];

        if (move.power > 0) {
            var damage = BattleEngine.calcDamage(attacker, move, defender, atkBuffs, defBuffs);
            defender.currentHP = Math.max(0, defender.currentHP - damage);

            // Type effectiveness text
            var multiplier = BattleEngine.getTypeMultiplier(move.type, defender.type, defender.type2);
            var effText = BattleEngine.getEffectivenessText(multiplier);
            if (effText) messages.push(effText);

            // Animate
            var targetSprite = isPlayer ? this.enemyBeastSprite : this.playerBeastSprite;
            if (targetSprite) {
                this.tweens.add({
                    targets: targetSprite,
                    alpha: 0.3,
                    duration: 100,
                    yoyo: true,
                    repeat: 2
                });
            }
        }

        // Status effects
        if (move.effect) {
            var result = BattleEngine.applyStatusEffect(move, attacker, defender, atkBuffs, defBuffs);
            if (result) {
                var statNames = { atk: 'Attack', def: 'Defense', spd: 'Speed', accuracy: 'Accuracy' };
                var target = result.target === 'self' ? attacker.name : defender.name;
                var dir = result.amount > 0 ? 'rose' : 'fell';
                messages.push(target + "'s " + (statNames[result.stat] || result.stat) + " " + dir + "!");
            }
        }

        this._drawBeastInfo();

        DialogManager.showDialog(messages, callback);
    },

    _onEnemyFainted: function() {
        var self = this;
        var enemyBeast = this.enemyTeam[this.currentEnemyBeastIdx];

        // Animate fainting
        if (this.enemyBeastSprite) {
            this.tweens.add({
                targets: this.enemyBeastSprite,
                y: this.enemyBeastSprite.y + 40,
                alpha: 0,
                duration: 500
            });
        }

        DialogManager.showDialog([enemyBeast.name + " fainted!"], function() {
            // Award XP
            if (self.battleType !== 'pvp') {
                var xpGain = BattleEngine.calcXPGain(enemyBeast);
                var result = PlayerState.addXP(self.currentPlayerBeastIdx, xpGain);
                var playerBeast = PlayerState.team[self.currentPlayerBeastIdx];

                var xpMessages = [playerBeast.name + " gained " + xpGain + " XP!"];

                if (result && result.leveledUp) {
                    xpMessages.push(playerBeast.name + " grew to level " + playerBeast.level + "!");
                    self._drawBeastInfo();
                }

                var afterXP = function() {
                    // Check for evolution
                    if (result && result.evolved) {
                        self._drawBeasts();
                        self._drawBeastInfo();
                        DialogManager.showDialog([
                            "What? " + (result.evolvedName || playerBeast.name) + " is evolving!",
                            "Congratulations! Your beast evolved into " + playerBeast.name + "!"
                        ], function() {
                            self._afterLevelUp(result);
                        });
                    } else {
                        self._afterLevelUp(result);
                    }
                };

                DialogManager.showDialog(xpMessages, afterXP);
            } else {
                self._checkNextEnemyBeast();
            }
        });
    },

    _afterLevelUp: function(result) {
        var self = this;
        if (result && result.newMoves.length > 0) {
            self._handleNewMoves(result.newMoves, 0, function() {
                self._checkNextEnemyBeast();
            });
        } else {
            self._checkNextEnemyBeast();
        }
    },

    _handleNewMoves: function(newMoves, idx, callback) {
        if (idx >= newMoves.length) { callback(); return; }

        var self = this;
        var moveInfo = newMoves[idx];
        var moveDef = MOVES[moveInfo.move];
        var beast = PlayerState.team[this.currentPlayerBeastIdx];

        if (beast.moves.length < 4) {
            PlayerState.learnMove(this.currentPlayerBeastIdx, moveInfo.move, -1);
            DialogManager.showDialog([beast.name + " learned " + moveDef.name + "!"], function() {
                self._handleNewMoves(newMoves, idx + 1, callback);
            });
        } else {
            // Need to choose which move to replace
            var options = beast.moves.map(function(m) { return MOVES[m].name; });
            options.push("Don't learn");

            DialogManager.showDialog([beast.name + " wants to learn " + moveDef.name + "!", "But it already knows 4 moves."], function() {
                DialogManager.showChoice("Replace which move?", options, function(replaceIdx) {
                    if (replaceIdx < 4) {
                        var oldMove = MOVES[beast.moves[replaceIdx]];
                        PlayerState.learnMove(self.currentPlayerBeastIdx, moveInfo.move, replaceIdx);
                        DialogManager.showDialog([beast.name + " forgot " + oldMove.name + " and learned " + moveDef.name + "!"], function() {
                            self._handleNewMoves(newMoves, idx + 1, callback);
                        });
                    } else {
                        DialogManager.showDialog([beast.name + " did not learn " + moveDef.name + "."], function() {
                            self._handleNewMoves(newMoves, idx + 1, callback);
                        });
                    }
                });
            });
        }
    },

    _checkNextEnemyBeast: function() {
        var self = this;
        this.currentEnemyBeastIdx++;
        this.enemyBuffs = { atk: 0, def: 0, spd: 0, accuracy: 0 };

        if (this.currentEnemyBeastIdx >= this.enemyTeam.length) {
            // Victory!
            this._onVictory();
            return;
        }

        var nextBeast = this.enemyTeam[this.currentEnemyBeastIdx];
        var trainerText = this.battleType === 'trainer' ? this.trainerName + ' sent out ' : '';

        DialogManager.showDialog([trainerText + nextBeast.name + "!"], function() {
            self._drawBeasts();
            self._drawBeastInfo();
            self._showActionMenu();
        });
    },

    _onPlayerBeastFainted: function() {
        var self = this;
        var beast = PlayerState.team[this.currentPlayerBeastIdx];

        if (this.playerBeastSprite) {
            this.tweens.add({
                targets: this.playerBeastSprite,
                y: this.playerBeastSprite.y + 40,
                alpha: 0,
                duration: 500
            });
        }

        DialogManager.showDialog([beast.name + " fainted!"], function() {
            // Check if any beasts are alive
            var nextIdx = PlayerState.getFirstAliveBeast();
            if (nextIdx === -1) {
                self._onDefeat();
                return;
            }

            // Switch beast
            self._forceSwitchBeast();
        });
    },

    _forceSwitchBeast: function() {
        var self = this;
        var options = [];
        var indices = [];

        for (var i = 0; i < PlayerState.team.length; i++) {
            var b = PlayerState.team[i];
            if (b.currentHP > 0) {
                options.push(b.name + ' L' + b.level + ' HP:' + b.currentHP);
                indices.push(i);
            }
        }

        DialogManager.showChoice('Send out which beast?', options, function(idx) {
            self.playerBuffs = { atk: 0, def: 0, spd: 0, accuracy: 0 };
            self.currentPlayerBeastIdx = indices[idx];
            self._drawBeasts();
            self._drawBeastInfo();

            var newBeast = PlayerState.team[self.currentPlayerBeastIdx];
            DialogManager.showDialog(["Go, " + newBeast.name + "!"], function() {
                self._showActionMenu();
            });
        });
    },

    _onVictory: function() {
        var self = this;
        this.battleOver = true;

        if (this.battleType === 'trainer' && this.trainerKey) {
            PlayerState.defeatedTrainers.push(this.trainerKey);

            if (this.isGymLeader) {
                PlayerState.badges.push('tidepool');
                PlayerState.save();

                DialogManager.showDialog([
                    "You defeated " + this.trainerName + "!",
                    "Congratulations! You earned the Tidepool Badge!",
                    "This badge proves your strength as a beast trainer.",
                    "Your journey has only just begun...",
                    "More gyms, more beasts, and greater challenges await!",
                    "Thank you for playing Phone Beasts!"
                ], function() {
                    self._endBattle(true);
                });
                return;
            }

            DialogManager.showDialog(["You defeated " + this.trainerName + "!"], function() {
                self._endBattle(true);
            });
        } else if (this.battleType === 'pvp') {
            DialogManager.showDialog(["You won the battle!"], function() {
                self._endBattle(true);
            });
        } else {
            self._endBattle(true);
        }
    },

    _onDefeat: function() {
        var self = this;
        this.battleOver = true;

        DialogManager.showDialog([
            "All your beasts have fainted!",
            "You rushed back to the nearest healing center..."
        ], function() {
            // Heal all and return to gym city or town
            PlayerState.healAll();
            PlayerState.position.map = 'town';
            PlayerState.position.x = 3;
            PlayerState.position.y = 5;
            PlayerState.save();
            self.scene.start('TownScene');
        });
    },

    _endBattle: function(won) {
        PlayerState.save();
        if (this.battleType === 'pvp') {
            Multiplayer.disconnect();
        }
        // Check if returning to an interior map
        var mapData = MAPS[PlayerState.position.map];
        if (mapData && mapData.isInterior) {
            this.scene.start('InteriorScene');
        } else {
            this.scene.start(this.returnScene);
        }
    },

    _enemyTurn: function() {
        var enemyBeast = this.enemyTeam[this.currentEnemyBeastIdx];
        var playerBeast = PlayerState.team[this.currentPlayerBeastIdx];

        var enemyMoves = enemyBeast.moves.filter(function(m) {
            return enemyBeast.pp[m] > 0;
        });
        if (enemyMoves.length === 0) enemyMoves = ['tackle'];
        var enemyMoveId = enemyMoves[Math.floor(Math.random() * enemyMoves.length)];
        var enemyMove = MOVES[enemyMoveId];

        var self = this;
        this._doAttack(enemyBeast, playerBeast, enemyMove, enemyMoveId, false, function() {
            if (playerBeast.currentHP <= 0) {
                self._onPlayerBeastFainted();
            } else {
                self._showActionMenu();
            }
        });
    },

    update: function(time, delta) {
        this.inputCooldown -= delta;
        if (this.inputCooldown > 0) return;

        if (DialogManager.isShowing()) {
            if (TouchControls.justPressed('a') || TouchControls.justPressed('b')) {
                if (DialogManager.choiceMode) {
                    DialogManager.confirmChoice();
                } else {
                    DialogManager.advance();
                }
                this.inputCooldown = 200;
            }
            if (DialogManager.choiceMode) {
                if (TouchControls.justPressed('up')) {
                    DialogManager.updateChoiceSelection('up');
                    this.inputCooldown = 150;
                }
                if (TouchControls.justPressed('down')) {
                    DialogManager.updateChoiceSelection('down');
                    this.inputCooldown = 150;
                }
            }
            return;
        }

        // Battle menu d-pad/A/B input
        if (BattleUI.activeMenu) {
            var result = BattleUI.handleInput();
            if (result === 'back') {
                // B pressed on move menu — go back to action menu
                if (this.moveMenu) this.moveMenu.destroy();
                this.moveMenu = null;
                this._showActionMenu();
            }
            if (result) this.inputCooldown = 150;
        }
    }
});
