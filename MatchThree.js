/*:
 * @plugindesc Match three implementation
 * @author Ihoold
 *
 * @param -- Time --
 * 
 * @param Board width
 * @desc Number of tiles in a row.
 * @default 10
 * 
 * @param Board height
 * @desc Number of tiles in a column.
 * @default 8
 * 
 * @param Tile width
 * @desc Width of a tile, should match the provided tile image.
 * @default 64
 * 
 * @param Tile height
 * @desc Height of a tile, should match the provided tile image.
 * @default 64
 * 
 * =================================================================
 * Plugin Commands
 * =================================================================
 * 
 * ShowMatchThree (smt) - display the plugin scene.
*/

(function() {
    let parameters = PluginManager.parameters('MatchThree');

    const boardWidth = Number(parameters['Board width']) || 10;
    const boardHeight = Number(parameters['Board height']) || 8;
    const tileWidth = Number(parameters['Tile width']) || 64;
    const tileHeight = Number(parameters['Tile height']) || 64;
    
    let ShowMatchThree = {};    
    
    let Colors = ["red", "blue", "green", "purple", "orange", "white"];
    let randomFromArray = function(array) {
        let random_index = Math.floor(Math.random() * array.length);
        return array[random_index];
    }

    class Tile {
        constructor(type) {
            this.type = type;
            this.popped = false;
        }

        pop() {
            this.popped = true;
        }
    }
    
    class Board {
        constructor(width, height, canvas) {
            this.width = width;
            this.height = height;
            this.contents = canvas;
            this.initRandomBoardState();
        }

        initRandomBoardState() {
            this.state = Array(this.height).fill(null).map(x => Array(this.width).fill(null));
            this.fillWithRandomBlocks();
        }

        draw() {
            for(let row = 0; row < this.height; row++) {
                for(let col = 0; col < this.width; col++) {
                    if (this.state[row][col] != null) {
                        let x = col * tileWidth;
                        let y = row * tileHeight;
                        let color = this.state[row][col].type;
                        this.contents.fillRect(x, y, tileWidth, tileHeight, color);
                    }
                }
            }
        }

        clearPoppedValues() {
            for(let row = 0; row < this.height; row++) {
                for(let col = 0; col < this.width; col++) {
                    if (this.state[row][col] != null && this.state[row][col].popped) {
                        this.state[row][col] = null;
                    }
                }
            }
        }

        fallColumn(col) {
            let prev_not_null = this.height - 2;
            for(let row = this.height - 1; row >= 0; row--) {
                if (row < prev_not_null) {
                    prev_not_null = row;
                }

                if (this.state[row][col] == null) {
                    while (this.state[prev_not_null][col] == null) {
                        prev_not_null--;
                        if (prev_not_null < 0) {
                            return;
                        }
                    }

                    this.state[row][col] = this.state[prev_not_null][col];
                    this.state[prev_not_null][col] = null;
                }
            }
        }

        fallBlocks() {
            for(let col = 0; col < this.width; col++) {
                this.fallColumn(col);
            }
        }

        fillWithRandomBlocks() {
            for(let row = 0; row < this.height; row++) {
                for(let col = 0; col < this.width; col++) {
                    if (this.state[row][col] == null) {
                        this.state[row][col] = new Tile(randomFromArray(Colors));
                    }
                }
            }
        }

        matchFound(type, bx, by, ex, ey) {
            let len = (ey - by) * (ex - bx);
            if (len >= 3) {
                console.log("Match of ", len, " pieces with ", type, " color");
                console.log(bx, by, ex, ey);

                for (let row = bx; row < ex; row++) {
                    for (let col = by; col < ey; col++) {
                        this.state[row][col].pop();
                    }
                }
            }
        }

        findMatchesInRow(row) {
            let curr_strike = 0;
            let curr_type = "";
            for(var col = 0; col < this.width; col++) {
                let type = this.state[row][col].type;
                if (type != curr_type) {
                    this.matchFound(curr_type, row, col - curr_strike, row + 1, col);
                    curr_strike = 1;
                    curr_type = type;
                } else {
                    curr_strike++;
                }
            }
            this.matchFound(curr_type, row, col - curr_strike, row + 1, col);
        }

        findMatchesInRows() {
            for(let row = 0; row < this.height; row++) {
                this.findMatchesInRow(row);
            }
        }

        findMatchesInColumn(col) {
            let curr_strike = 0;
            let curr_type = "";
            for(var row = 0; row < this.height; row++) {
                let type = this.state[row][col].type;
                if (type != curr_type) {
                    this.matchFound(curr_type, row - curr_strike, col, row, col + 1);
                    curr_strike = 1;
                    curr_type = type;
                } else {
                    curr_strike++;
                }
            }
            this.matchFound(curr_type, row - curr_strike, col, row, col + 1);
        }

        findMatchesInColumns() {
            for(let column = 0; column < this.width; column++) {
                this.findMatchesInColumn(column);
            }
        }

        findMatches() {
            this.findMatchesInColumns();
            this.findMatchesInRows();
        }

        move(b_row, b_col, e_row, e_col) {
            let temp = this.state[b_row][b_col];
            this.state[b_row][b_col] = this.state[e_row][e_col];
            this.state[e_row][e_col] = temp;
            console.log("Moving (", b_col, ",", b_row, ") -> (", e_col, ",", e_row, ")");
        }
    }
    
    function Window_M3() {
        this.initialize.apply(this, arguments);
    }
    
    Window_M3.prototype = Object.create(Window_Base.prototype);
    Window_M3.prototype.constructor = Window_M3;
    
    Window_M3.prototype.initialize = function() {
        let width = this.windowWidth();
        let height = this.windowHeight();
        let x = (Graphics.boxWidth - width) / 2;
        let y = (Graphics.boxHeight - height) / 2;
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this.initBoard();
        this.refresh();
    };

    Window_M3.prototype.initBoard = function() {
        this.board = new Board(boardWidth, boardHeight, this.contents);
    };
    
    Window_M3.prototype.windowWidth = function() {
        return boardWidth * tileWidth + 2 * Window_Base.prototype.standardPadding();
    };
       
    Window_M3.prototype.windowHeight = function() {
        return boardHeight * tileHeight + 2 * Window_Base.prototype.standardPadding();
    };
    
    Window_M3.prototype.drawBoard = function() {
        return this.board.draw();
    };

    Window_M3.prototype.checkForMove = function() {
        if (TouchInput.isTriggered()) {
            $gameTemp._m3_xpos = TouchInput.x - this.x - this.standardPadding();
            $gameTemp._m3_ypos = TouchInput.y - this.y - this.standardPadding();
        } else if (TouchInput.isReleased()) {
            let x = TouchInput.x - this.x - this.standardPadding();
            let y = TouchInput.y - this.y - this.standardPadding();
    
            this.makeMove($gameTemp._m3_xpos, $gameTemp._m3_ypos, x, y);
        }
    };

    Window_M3.prototype.makeMove = function(bx, by, ex, ey) {
        let b_row = Math.floor(by / tileHeight);
        let b_col = Math.floor(bx / tileWidth);
        let e_row = Math.floor(ey / tileHeight);
        let e_col = Math.floor(ex / tileWidth);

        let dist = Math.abs(b_row - e_row) + Math.abs(b_col - e_col);
        if (dist == 1) {
            this.board.move(b_row, b_col, e_row, e_col);
        }
    };

    Window_M3.prototype.refresh = function() {
        this.checkForMove();
        this.board.findMatches();
        this.board.clearPoppedValues();
        this.board.fallBlocks();
        this.board.fillWithRandomBlocks();
        this.drawBoard();
    };
    
    // Scene
    function Scene_M3() {
        this.initialize.apply(this, arguments);
    }
    
    Scene_M3.prototype = Object.create(Scene_Base.prototype);
    Scene_M3.prototype.constructor = Scene_M3;
    
    Scene_M3.prototype.initialize = function() {
        Scene_Base.prototype.initialize.call(this);
    };
    
    Scene_M3.prototype.create = function() {
        Scene_Base.prototype.create.call(this);
        this.createWindowLayer();
        this.createBackground();
        this.createCommandWindow();
        this.createMatchThreeWindow();
    };
    
    Scene_M3.prototype.terminate = function() {
        $gameTemp._m3_xpos = null;
        $gameTemp._m3_ypos = null;
    
        Scene_Base.prototype.terminate.call(this);
    }
    
    Scene_M3.prototype.update = function() {
        Scene_Base.prototype.update.call(this);
        this._M3Window.refresh();
    };
    
    Scene_M3.prototype.createMatchThreeWindow = function() {
        this._M3Window = new Window_M3();
        this.addChild(this._M3Window);
    };
    
    Scene_M3.prototype.createCommandWindow = function() {
        this._commandWindow = new Window_MenuCommand(0, 0);
        this._commandWindow.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._commandWindow);
    };
    
    Scene_M3.prototype.createBackground = function() {
        this._backgroundSprite = new Sprite();
        this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
        this.addChild(this._backgroundSprite);
    };
    
    // Commands
    ShowMatchThree._pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        ShowMatchThree._pluginCommand.call(this, command, args);
        
        if (command === 'ShowMatchThree' || command === 'smt') {
            SceneManager.push(Scene_M3);
        }
    };
})();
