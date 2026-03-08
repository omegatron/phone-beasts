var DialogManager = {
    scene: null,
    container: null,
    textObj: null,
    isActive: false,
    queue: [],
    currentText: '',
    displayedText: '',
    charIndex: 0,
    typeSpeed: 30,
    timer: null,
    onComplete: null,
    choiceMode: false,
    choices: [],
    choiceIndex: 0,
    choiceCallbacks: [],
    nameInputMode: false,

    init: function(scene) {
        this.scene = scene;
        this.isActive = false;
        this.queue = [];
    },

    showDialog: function(texts, onComplete) {
        if (!Array.isArray(texts)) texts = [texts];
        this.queue = texts.slice();
        this.onComplete = onComplete || null;
        this.isActive = true;
        this._showNext();
    },

    showChoice: function(prompt, options, callback) {
        this.choiceMode = true;
        this.choices = options;
        this.choiceIndex = 0;
        this.choiceCallbacks = [callback];
        this.isActive = true;
        this._drawDialogBox();
        this._renderChoices(prompt);
    },

    _showNext: function() {
        if (this.queue.length === 0) {
            this.hide();
            if (this.onComplete) this.onComplete();
            return;
        }
        this.currentText = this.queue.shift();
        this.displayedText = '';
        this.charIndex = 0;
        this._drawDialogBox();
        this._typeNextChar();
    },

    _drawDialogBox: function() {
        if (this.container) this.container.destroy();

        var scene = this.scene;
        var cam = scene.cameras.main;
        var boxW = cam.width - 16;
        var boxH = 90;
        // Position dialog above the touch controls overlay (bottom 45% of screen)
        var boxX = 8;
        var boxY = cam.height * 0.50 - boxH;

        this.container = scene.add.container(boxX, boxY);
        this.container.setDepth(1000);
        this.container.setScrollFactor(0);

        // Background
        var bg = scene.add.graphics();
        bg.fillStyle(0x000000, 0.85);
        bg.fillRoundedRect(0, 0, boxW, boxH, 6);
        bg.lineStyle(2, 0xffffff, 0.8);
        bg.strokeRoundedRect(0, 0, boxW, boxH, 6);
        this.container.add(bg);

        // Text
        this.textObj = scene.add.text(12, 10, '', {
            fontSize: '14px',
            fontFamily: 'monospace',
            color: '#ffffff',
            wordWrap: { width: boxW - 24 },
            lineSpacing: 4
        });
        this.container.add(this.textObj);
    },

    _typeNextChar: function() {
        var self = this;
        if (this.charIndex < this.currentText.length) {
            this.displayedText += this.currentText[this.charIndex];
            this.charIndex++;
            if (this.textObj) this.textObj.setText(this.displayedText);
            this.timer = this.scene.time.delayedCall(this.typeSpeed, function() {
                self._typeNextChar();
            });
        }
    },

    _renderChoices: function(prompt) {
        var scene = this.scene;
        var cam = scene.cameras.main;
        var boxW = cam.width - 16;

        if (this.textObj) this.textObj.setText(prompt || 'Choose:');

        // Render choices
        this.choiceTexts = [];
        for (var i = 0; i < this.choices.length; i++) {
            var prefix = (i === this.choiceIndex) ? '> ' : '  ';
            var t = scene.add.text(20, 30 + i * 18, prefix + this.choices[i], {
                fontSize: '13px',
                fontFamily: 'monospace',
                color: (i === this.choiceIndex) ? '#f1c40f' : '#ffffff'
            });
            this.container.add(t);
            this.choiceTexts.push(t);
        }
    },

    updateChoiceSelection: function(dir) {
        if (!this.choiceMode) return;
        if (dir === 'up') this.choiceIndex = Math.max(0, this.choiceIndex - 1);
        if (dir === 'down') this.choiceIndex = Math.min(this.choices.length - 1, this.choiceIndex + 1);

        for (var i = 0; i < this.choiceTexts.length; i++) {
            var prefix = (i === this.choiceIndex) ? '> ' : '  ';
            this.choiceTexts[i].setText(prefix + this.choices[i]);
            this.choiceTexts[i].setColor(i === this.choiceIndex ? '#f1c40f' : '#ffffff');
        }
    },

    confirmChoice: function() {
        if (!this.choiceMode) return -1;
        var idx = this.choiceIndex;
        this.choiceMode = false;
        this.hide();
        if (this.choiceCallbacks[0]) this.choiceCallbacks[0](idx);
        return idx;
    },

    advance: function() {
        if (this.choiceMode) {
            this.confirmChoice();
            return;
        }

        // If still typing, show all text immediately
        if (this.charIndex < this.currentText.length) {
            if (this.timer) this.timer.remove();
            this.displayedText = this.currentText;
            this.charIndex = this.currentText.length;
            if (this.textObj) this.textObj.setText(this.displayedText);
            return;
        }

        // Show next text in queue
        this._showNext();
    },

    hide: function() {
        this.isActive = false;
        if (this.timer) this.timer.remove();
        if (this.container) {
            this.container.destroy();
            this.container = null;
        }
        this.textObj = null;
    },

    isShowing: function() {
        return this.isActive;
    }
};
