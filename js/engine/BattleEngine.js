var BattleEngine = {
    // Type effectiveness chart
    typeChart: {
        fire:     { grass: 2, water: 0.5, fire: 0.5, normal: 1, electric: 1, ground: 1 },
        water:    { fire: 2, grass: 0.5, water: 0.5, normal: 1, electric: 1, ground: 1 },
        grass:    { water: 2, fire: 0.5, grass: 0.5, normal: 1, electric: 1, ground: 1 },
        electric: { water: 2, ground: 0.5, electric: 0.5, normal: 1, fire: 1, grass: 1 },
        ground:   { electric: 2, water: 1, fire: 1, grass: 0.5, normal: 1, ground: 1 },
        normal:   { fire: 1, water: 1, grass: 1, electric: 1, ground: 1, normal: 1 }
    },

    getTypeMultiplier: function(moveType, defenderType, defenderType2) {
        var chart = this.typeChart[moveType];
        if (!chart) return 1;
        var mult = chart[defenderType] || 1;
        if (defenderType2) {
            mult *= (chart[defenderType2] || 1);
        }
        return mult;
    },

    calcDamage: function(attacker, move, defender, attackerBuffs, defenderBuffs) {
        if (move.power === 0) return 0;

        var level = attacker.level;
        var atk = attacker.stats.atk * (1 + (attackerBuffs.atk || 0));
        var def = defender.stats.def * (1 + (defenderBuffs.def || 0));
        var power = move.power;
        var typeMultiplier = this.getTypeMultiplier(move.type, defender.type, defender.type2);

        // STAB (Same Type Attack Bonus) - check both types
        var stab = (move.type === attacker.type || move.type === attacker.type2) ? 1.5 : 1;

        var baseDmg = ((2 * level / 5 + 2) * power * atk / def) / 50 + 2;
        var random = 0.85 + Math.random() * 0.15;
        var damage = Math.floor(baseDmg * typeMultiplier * stab * random);

        return Math.max(1, damage);
    },

    checkAccuracy: function(move, attackerBuffs, defenderBuffs) {
        var acc = move.accuracy;
        // Apply accuracy/evasion buffs
        acc *= (1 + (attackerBuffs.accuracy || 0));
        return Math.random() * 100 < acc;
    },

    applyStatusEffect: function(move, attacker, defender, attackerBuffs, defenderBuffs) {
        if (!move.effect) return null;

        var eff = move.effect;
        if (eff.target === 'self') {
            attackerBuffs[eff.stat] = (attackerBuffs[eff.stat] || 0) + eff.amount;
            return { target: 'self', stat: eff.stat, amount: eff.amount };
        } else {
            defenderBuffs[eff.stat] = (defenderBuffs[eff.stat] || 0) + eff.amount;
            return { target: 'enemy', stat: eff.stat, amount: eff.amount };
        }
    },

    determineTurnOrder: function(beast1, beast2, buffs1, buffs2) {
        var spd1 = beast1.stats.spd * (1 + (buffs1.spd || 0));
        var spd2 = beast2.stats.spd * (1 + (buffs2.spd || 0));
        if (spd1 === spd2) return Math.random() < 0.5 ? 1 : 2;
        return spd1 > spd2 ? 1 : 2;
    },

    calcXPGain: function(defeatedBeast) {
        var base = BEASTS[defeatedBeast.id];
        if (!base) return 10;
        return Math.floor((base.baseXP * defeatedBeast.level) / 5);
    },

    calcCatchChance: function(targetBeast) {
        var base = BEASTS[targetBeast.id];
        var hpPercent = targetBeast.currentHP / PlayerState.calcStats(base.baseStats, targetBeast.level).hp;
        var chance = (1 - hpPercent) * 0.5 + 0.1;
        return Math.min(0.9, Math.max(0.1, chance));
    },

    attemptCatch: function(targetBeast) {
        var chance = this.calcCatchChance(targetBeast);
        return Math.random() < chance;
    },

    generateWildBeast: function(locationId) {
        var encounters = ENCOUNTERS[locationId];
        if (!encounters || encounters.length === 0) return null;

        // Weighted random selection
        var totalWeight = 0;
        for (var i = 0; i < encounters.length; i++) totalWeight += encounters[i].weight;

        var roll = Math.random() * totalWeight;
        var cumulative = 0;
        var chosen = encounters[0];
        for (var i = 0; i < encounters.length; i++) {
            cumulative += encounters[i].weight;
            if (roll < cumulative) { chosen = encounters[i]; break; }
        }

        var level = chosen.minLevel + Math.floor(Math.random() * (chosen.maxLevel - chosen.minLevel + 1));
        return PlayerState.createBeastInstance(chosen.id, level);
    },

    createTrainerTeam: function(trainerKey) {
        var trainer = TRAINERS[trainerKey];
        if (!trainer) return [];

        var team = [];
        for (var i = 0; i < trainer.team.length; i++) {
            var t = trainer.team[i];
            team.push(PlayerState.createBeastInstance(t.id, t.level, t.moves));
        }
        return team;
    },

    getEffectivenessText: function(multiplier) {
        if (multiplier >= 2) return "It's super effective!";
        if (multiplier <= 0.5) return "It's not very effective...";
        return '';
    }
};
