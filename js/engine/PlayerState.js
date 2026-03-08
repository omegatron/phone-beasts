var PlayerState = {
    name: 'Trainer',
    team: [],
    inventory: { potions: 5, friendshipOrbs: 0, simpleFriendshipOrbs: 0, xpGains: 0 },
    position: { map: 'town', x: 3, y: 5 },
    badges: [],
    defeatedTrainers: [],
    collectedPickups: [],
    hasStarter: false,
    receivedOrbs: false,
    interiorReturn: null,
    seenBeasts: [],
    caughtBeasts: [],

    init: function() {
        this.load();
    },

    createBeastInstance: function(beastId, level, customMoves) {
        var base = BEASTS[beastId];
        if (!base) return null;

        var instance = {
            id: beastId,
            name: base.name,
            type: base.type,
            type2: base.type2 || null,
            level: level,
            xp: 0,
            xpToNext: Math.pow(level + 1, 3),
            moves: [],
            currentHP: 0,
            stats: {}
        };

        instance.stats = this.calcStats(base.baseStats, level);
        instance.currentHP = instance.stats.hp;

        if (customMoves) {
            instance.moves = customMoves.slice(0, 4);
        } else {
            instance.moves = base.defaultMoves.slice(0, 4);
        }

        instance.pp = {};
        for (var i = 0; i < instance.moves.length; i++) {
            var move = MOVES[instance.moves[i]];
            if (move) instance.pp[instance.moves[i]] = move.pp;
        }

        return instance;
    },

    calcStats: function(baseStats, level) {
        return {
            hp:  Math.floor(baseStats.hp * (1 + (level - 1) * 0.08)) + level,
            atk: Math.floor(baseStats.atk * (1 + (level - 1) * 0.08)),
            def: Math.floor(baseStats.def * (1 + (level - 1) * 0.08)),
            spd: Math.floor(baseStats.spd * (1 + (level - 1) * 0.08))
        };
    },

    markSeen: function(beastId) {
        if (this.seenBeasts.indexOf(beastId) === -1) {
            this.seenBeasts.push(beastId);
        }
    },

    markCaught: function(beastId) {
        this.markSeen(beastId);
        if (this.caughtBeasts.indexOf(beastId) === -1) {
            this.caughtBeasts.push(beastId);
        }
    },

    addBeastToTeam: function(beast) {
        if (this.team.length < 6) {
            this.team.push(beast);
            this.markCaught(beast.id);
            return true;
        }
        return false;
    },

    getFirstAliveBeast: function() {
        for (var i = 0; i < this.team.length; i++) {
            if (this.team[i].currentHP > 0) return i;
        }
        return -1;
    },

    healAll: function() {
        for (var i = 0; i < this.team.length; i++) {
            var beast = this.team[i];
            var base = BEASTS[beast.id];
            beast.stats = this.calcStats(base.baseStats, beast.level);
            beast.currentHP = beast.stats.hp;
            for (var j = 0; j < beast.moves.length; j++) {
                var move = MOVES[beast.moves[j]];
                if (move) beast.pp[beast.moves[j]] = move.pp;
            }
        }
    },

    usePotion: function(beastIndex) {
        if (this.inventory.potions <= 0) return false;
        var beast = this.team[beastIndex];
        if (!beast || beast.currentHP <= 0) return false;
        var maxHP = this.calcStats(BEASTS[beast.id].baseStats, beast.level).hp;
        beast.currentHP = Math.min(beast.currentHP + 20, maxHP);
        this.inventory.potions--;
        return true;
    },

    getTotalOrbs: function() {
        return (this.inventory.friendshipOrbs || 0) + (this.inventory.simpleFriendshipOrbs || 0);
    },

    addXP: function(beastIndex, xpGain) {
        var beast = this.team[beastIndex];
        if (!beast) return null;

        beast.xp += xpGain;
        var leveledUp = false;
        var newMoves = [];

        while (beast.xp >= beast.xpToNext && beast.level < 50) {
            beast.level++;
            beast.xp -= beast.xpToNext;
            beast.xpToNext = Math.pow(beast.level + 1, 3);
            leveledUp = true;

            var base = BEASTS[beast.id];
            var oldMaxHP = beast.stats.hp;
            beast.stats = this.calcStats(base.baseStats, beast.level);
            beast.currentHP += (beast.stats.hp - oldMaxHP);

            if (base.learnableMoves[beast.level]) {
                newMoves.push({ level: beast.level, move: base.learnableMoves[beast.level] });
            }
        }

        // Check for evolution
        var evolved = false;
        var base = BEASTS[beast.id];
        if (base.evolvesAt && beast.level >= base.evolvesAt && base.evolvesTo) {
            var evoBase = BEASTS[base.evolvesTo];
            if (evoBase) {
                beast.id = evoBase.id;
                beast.name = evoBase.name;
                beast.type = evoBase.type;
                beast.type2 = evoBase.type2 || null;
                var oldMaxHP = beast.stats.hp;
                beast.stats = this.calcStats(evoBase.baseStats, beast.level);
                beast.currentHP += (beast.stats.hp - oldMaxHP);
                evolved = true;
            }
        }

        return { leveledUp: leveledUp, newMoves: newMoves, evolved: evolved, evolvedName: evolved ? beast.name : null };
    },

    useXPGain: function(beastIndex) {
        if (this.inventory.xpGains <= 0) return null;
        var beast = this.team[beastIndex];
        if (!beast || beast.currentHP <= 0 || beast.level >= 50) return null;

        this.inventory.xpGains--;
        var xpNeeded = beast.xpToNext - beast.xp;
        return this.addXP(beastIndex, xpNeeded);
    },

    learnMove: function(beastIndex, newMoveId, replaceIndex) {
        var beast = this.team[beastIndex];
        if (!beast) return;

        if (beast.moves.length < 4) {
            beast.moves.push(newMoveId);
        } else if (replaceIndex >= 0 && replaceIndex < 4) {
            beast.moves[replaceIndex] = newMoveId;
        }
        beast.pp[newMoveId] = MOVES[newMoveId].pp;
    },

    save: function() {
        try {
            localStorage.setItem('phoneBeasts_save', JSON.stringify({
                name: this.name,
                team: this.team,
                inventory: this.inventory,
                position: this.position,
                badges: this.badges,
                defeatedTrainers: this.defeatedTrainers,
                collectedPickups: this.collectedPickups,
                hasStarter: this.hasStarter,
                receivedOrbs: this.receivedOrbs,
                interiorReturn: this.interiorReturn,
                seenBeasts: this.seenBeasts,
                caughtBeasts: this.caughtBeasts
            }));
        } catch(e) {}
    },

    load: function() {
        try {
            var data = localStorage.getItem('phoneBeasts_save');
            if (data) {
                var save = JSON.parse(data);
                this.name = save.name || 'Trainer';
                this.team = save.team || [];
                this.inventory = save.inventory || { potions: 5, friendshipOrbs: 0, simpleFriendshipOrbs: 0, xpGains: 0 };
                // Migrate old saves that had 'traps'
                if (this.inventory.traps !== undefined) {
                    this.inventory.simpleFriendshipOrbs = (this.inventory.simpleFriendshipOrbs || 0) + this.inventory.traps;
                    delete this.inventory.traps;
                }
                if (this.inventory.friendshipOrbs === undefined) this.inventory.friendshipOrbs = 0;
                if (this.inventory.simpleFriendshipOrbs === undefined) this.inventory.simpleFriendshipOrbs = 0;
                if (this.inventory.xpGains === undefined) this.inventory.xpGains = 0;
                this.position = save.position || { map: 'town', x: 3, y: 5 };
                this.badges = save.badges || [];
                this.defeatedTrainers = save.defeatedTrainers || [];
                this.collectedPickups = save.collectedPickups || [];
                this.hasStarter = save.hasStarter || false;
                this.receivedOrbs = save.receivedOrbs || false;
                this.interiorReturn = save.interiorReturn || null;
                this.seenBeasts = save.seenBeasts || [];
                this.caughtBeasts = save.caughtBeasts || [];
                return true;
            }
        } catch(e) {}
        return false;
    },

    clearSave: function() {
        localStorage.removeItem('phoneBeasts_save');
    }
};
