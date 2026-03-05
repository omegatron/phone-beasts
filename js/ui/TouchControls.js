var TouchControls = {
    keys: { up: false, down: false, left: false, right: false, a: false, b: false, menu: false },
    pressed: { up: false, down: false, left: false, right: false, a: false, b: false, menu: false },
    enabled: true,
    element: null,

    init: function() {
        this.element = document.getElementById('touch-controls');
        this._createButtons();
        this._setupKeyboard();
    },

    _createButtons: function() {
        var el = this.element;
        el.innerHTML = '';

        // D-pad
        var dpad = document.createElement('div');
        dpad.className = 'dpad-container';
        dpad.innerHTML =
            '<div class="dpad-btn dpad-up" data-dir="up">\u25B2</div>' +
            '<div class="dpad-btn dpad-down" data-dir="down">\u25BC</div>' +
            '<div class="dpad-btn dpad-left" data-dir="left">\u25C0</div>' +
            '<div class="dpad-btn dpad-right" data-dir="right">\u25B6</div>';
        el.appendChild(dpad);

        // Action buttons
        var actions = document.createElement('div');
        actions.className = 'action-container';
        actions.innerHTML =
            '<div class="action-btn btn-a" data-btn="a">A</div>' +
            '<div class="action-btn btn-b" data-btn="b">B</div>' +
            '<div class="action-btn btn-menu" data-btn="menu">MENU</div>';
        el.appendChild(actions);

        // Bind touch events
        var self = this;
        var btns = el.querySelectorAll('.dpad-btn, .action-btn');
        for (var i = 0; i < btns.length; i++) {
            (function(btn) {
                var key = btn.dataset.dir || btn.dataset.btn;

                btn.addEventListener('touchstart', function(e) {
                    e.preventDefault();
                    if (self.enabled) {
                        self.keys[key] = true;
                        self.pressed[key] = true;
                        btn.classList.add('pressed');
                    }
                }, { passive: false });

                btn.addEventListener('touchend', function(e) {
                    e.preventDefault();
                    self.keys[key] = false;
                    btn.classList.remove('pressed');
                }, { passive: false });

                btn.addEventListener('touchcancel', function(e) {
                    self.keys[key] = false;
                    btn.classList.remove('pressed');
                }, { passive: false });

                // Mouse fallback for desktop testing
                btn.addEventListener('mousedown', function(e) {
                    e.preventDefault();
                    if (self.enabled) {
                        self.keys[key] = true;
                        self.pressed[key] = true;
                        btn.classList.add('pressed');
                    }
                });

                btn.addEventListener('mouseup', function(e) {
                    self.keys[key] = false;
                    btn.classList.remove('pressed');
                });

                btn.addEventListener('mouseleave', function(e) {
                    self.keys[key] = false;
                    btn.classList.remove('pressed');
                });
            })(btns[i]);
        }
    },

    _setupKeyboard: function() {
        var self = this;
        var keyMap = {
            'ArrowUp': 'up', 'ArrowDown': 'down', 'ArrowLeft': 'left', 'ArrowRight': 'right',
            'w': 'up', 's': 'down', 'a': 'left', 'd': 'right',
            'z': 'a', 'x': 'b', 'Enter': 'a', 'Escape': 'menu', ' ': 'a',
            'Backspace': 'b'
        };

        document.addEventListener('keydown', function(e) {
            var key = keyMap[e.key];
            if (key && self.enabled) {
                e.preventDefault();
                if (!self.keys[key]) self.pressed[key] = true;
                self.keys[key] = true;
            }
        });

        document.addEventListener('keyup', function(e) {
            var key = keyMap[e.key];
            if (key) {
                self.keys[key] = false;
            }
        });
    },

    show: function() {
        this.element.style.display = 'block';
    },

    hide: function() {
        this.element.style.display = 'none';
    },

    justPressed: function(key) {
        if (this.pressed[key]) {
            this.pressed[key] = false;
            return true;
        }
        return false;
    },

    isDown: function(key) {
        return this.keys[key];
    }
};
