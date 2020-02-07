/*:
 * @plugindesc Match three implementation
 * @author Ihoold
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
 * @param Tile types
 * @desc How many types of tiles will be in game. Maximum 12.
 * @default 4
 *
 * @param Tile #1 path
 * @desc Name of a tile sprite file in the pictures folder (without extension).
 * @default 1
 *
 * @param Tile #2 path
 * @desc Name of a tile sprite file in the pictures folder (without extension).
 * @default 2
 *
 * @param Tile #3 path
 * @desc Name of a tile sprite file in the pictures folder (without extension).
 * @default 3
 *
 * @param Tile #4 path
 * @desc Name of a tile sprite file in the pictures folder (without extension).
 * @default 4
 *
 * @param Tile #5 path
 * @desc Name of a tile sprite file in the pictures folder (without extension).
 * @default 5
 *
 * @param Tile #6 path
 * @desc Name of a tile sprite file in the pictures folder (without extension).
 * @default 6
 *
 * @param Tile #7 path
 * @desc Name of a tile sprite file in the pictures folder (without extension).
 * @default 7
 *
 * @param Tile #8 path
 * @desc Name of a tile sprite file in the pictures folder (without extension).
 * @default 8
 *
 * @param Tile #9 path
 * @desc Name of a tile sprite file in the pictures folder (without extension).
 * @default 9
 *
 * @param Tile #10 path
 * @desc Name of a tile sprite file in the pictures folder (without extension).
 * @default 10
 *
 * @param Tile #11 path
 * @desc Name of a tile sprite file in the pictures folder (without extension).
 * @default 11
 *
 * @param Tile #12 path
 * @desc Name of a tile sprite file in the pictures folder (without extension).
 * @default 12
 * 
 * =================================================================
 * Plugin Commands
 * =================================================================
 * 
 * ShowMatchThree (smt) - display the plugin scene.
*/

(function() {
    let parameters = PluginManager.parameters('MatchThree');

    const boardWidth = Number(parameters['Board width'] ) || 10;
    const boardHeight = Number(parameters['Board height']) || 8;
    const tileWidth = Number(parameters['Tile width']) || 64;
    const tileHeight = Number(parameters['Tile height']) || 64;
    const tileTypes = Number(parameters['Tile types']) || 4;
    let tiles_paths = [];

    for (let i=1; i<= tileTypes; i++) {
        let tile_file = parameters['Tile #' + i.toString() + ' path'] || i.toString();
        tiles_paths.push("MatchThree/" + tile_file);
    }
    
    let ShowMatchThree = {};    
    
    let randomIndex = function(array) {
        return Math.floor(Math.random() * array.length);
    };

    let randomInt = function(begin, end) {
        return Math.floor(Math.random() * (end-begin+1)) + begin;
    };

    let translateGridToCords = function(col, row) {
        return [col * tileWidth, row * tileHeight];
    };

    let translateCordsToGrid = function(x, y) {
        return [Math.floor(x / tileWidth), Math.floor(y / tileHeight)];
    };

    // Spriteset_Board - based on a Spriteset_map
    function Spriteset_Board() {
        this.initialize.apply(this, arguments);
    }
    Spriteset_Board.prototype = Object.create(Spriteset_Base.prototype);
    Spriteset_Board.prototype.constructor = Spriteset_Board;

    Spriteset_Board.prototype.loadTilesBitmaps = function() {
        this._board.bitmaps = [];
        for (let i = 0; i < tiles_paths.length; i++) {
            this._board.bitmaps.push(ImageManager.loadPicture(tiles_paths[i]));
        }
    };

    Spriteset_Board.prototype.initialize = function() {
        Spriteset_Base.prototype.initialize.call(this);
        // this.fillWithRandomBlocks();
    };

    Spriteset_Board.prototype.createLowerLayer = function() {
        Spriteset_Base.prototype.createLowerLayer.call(this);
        this.createBoard();
        // this.createDestination();
    };

    Spriteset_Board.prototype.update = function() {
        Spriteset_Base.prototype.update.call(this);
    };

    Spriteset_Board.prototype.createBoard = function() {
        this._board = new Board();
        this.loadTilesBitmaps();
        this._baseSprite.addChild(this._board);
    };

    Spriteset_Board.prototype.makeMove = function(bx, by, ex, ey) {
        this._board.makeMove(bx, by, ex, ey);
    };

    // Spriteset_Board.prototype.updateTiles = function() {
    //     for(let row = 0; row < this.height; row++) {
    //         for (let col = 0; col < this.width; col++) {
    //             let tile = this.state[row][col];
    //             tile.update();
    //             if (tile.isBusy()) {
    //                 this.busy = true;
    //             }
    //         }
    //     }
    // };
    //
    // Spriteset_Board.prototype.update = function() {
    //     this.updateTiles();
    //
    //     if (!this.isBusy()) {
    //         this.findMatches();
    //         this.clearPoppedValues();
    //         this.fallBlocks();
    //     }
    //
    //     this.draw();
    // };
    //
    // Spriteset_Board.prototype.handleNegativeCords = function(x, y) {
    //     if ((x + tileWidth <= 0) || (y + tileHeight <= 0)) {
    //         return [0, 0, 0, 0, 0, 0];
    //     }
    //
    //     let [x_start, y_start, width_to_draw, height_to_draw] = [0, 0, tileWidth, tileHeight];
    //     if (x < 0) {
    //         x_start = -1 * x;
    //         width_to_draw = tileWidth + x;
    //         x = 0;
    //     }
    //
    //     if (y < 0) {
    //         y_start = -1 * y;
    //         height_to_draw = tileHeight + y;
    //         y = 0;
    //     }
    //
    //     return [x_start, y_start, width_to_draw, height_to_draw, x, y];
    // };
    //
    // Spriteset_Board.prototype.drawRow = function(row) {
    //     for(let col = 0; col < this.width; col++) {
    //         if (this.state[row][col] != null) {
    //             let [sx, sy, sw, sh, dx, dy] = this.handleNegativeCords(this.state[row][col].x, this.state[row][col].y);
    //             this.contents.bltImage(this.state[row][col].bitmap, sx, sy, sw, sh, dx, dy);
    //         }
    //     }
    // };
    //
    // Spriteset_Board.prototype.draw = function() {
    //     this.contents.clear();
    //     for(let row = 0; row < this.height; row++) {
    //         this.drawRow(row);
    //     }
    // };
    //
    // Spriteset_Board.prototype.clearPoppedValues = function() {
    //     for(let row = 0; row < this.height; row++) {
    //         for(let col = 0; col < this.width; col++) {
    //             if (this.state[row][col] != null && this.state[row][col].popped) {
    //                 this.state[row][col] = null;
    //             }
    //         }
    //     }
    // };
    //
    // // Returns number of empty blocks in the column
    // Spriteset_Board.prototype.fallColumn = function(col) {
    //     let prev_not_null = this.height - 2;
    //     for(let row = this.height - 1; row >= 0; row--) {
    //         if (row < prev_not_null) {
    //             prev_not_null = row;
    //         }
    //
    //         if (this.state[row][col] == null) {
    //             while (this.state[prev_not_null][col] == null) {
    //                 prev_not_null--;
    //                 if (prev_not_null < 0) {
    //                     return row + 1;
    //                 }
    //             }
    //
    //             this.state[row][col] = this.state[prev_not_null][col];
    //             this.state[prev_not_null][col] = null;
    //         }
    //     }
    //     return 0;
    // };
    //
    // Spriteset_Board.prototype.generateBlockInColumn = function(n, col) {
    //     for (let row = 0; row < n; row++) {
    //         let [newX, newY] = translateGridToCords(col, -1 * (row+1));
    //         let [realX, realY] = translateGridToCords(col, n - row - 1);
    //         let randomType = randomIndex(this.tiles);
    //         this.state[n - row - 1][col] = new Tile(newX, newY, realX, realY, randomType, this.tiles[randomType]);
    //     }
    // };
    //
    // Spriteset_Board.prototype.fallBlocks = function() {
    //     for(let col = 0; col < this.width; col++) {
    //         let blocksToGenerate = this.fallColumn(col);
    //         this.generateBlockInColumn(blocksToGenerate, col);
    //     }
    // };
    //
    // Spriteset_Board.prototype.fillWithRandomBlocks = function() {
    //     for(let row = 0; row < this.height; row++) {
    //         for(let col = 0; col < this.width; col++) {
    //             let randomType = randomIndex(this.tiles);
    //             let [x, y] = translateGridToCords(col, row);
    //             this.state[row][col] = new Tile(x, y, x, y, randomType, this.tiles[randomType]);
    //         }
    //     }
    // };
    //
    // Spriteset_Board.prototype.matchFound = function(type, bcol, brow, ecol, erow) {
    //     let len = (erow - brow) * (ecol - bcol);
    //     if (len >= 3) {
    //         console.log("Match of ", len, " pieces with ", type, " color, at: ", bcol, brow, ecol, erow);
    //
    //         for (let row = brow; row < erow; row++) {
    //             for (let col = bcol; col < ecol; col++) {
    //                 this.state[row][col].pop();
    //             }
    //         }
    //     }
    // };
    //
    // Spriteset_Board.prototype.findMatchesInRow = function(row) {
    //     let curr_strike = 0;
    //     let curr_type = "";
    //     for(let col = 0; col < this.width; col++) {
    //         let type = this.state[row][col].type;
    //         if (type !== curr_type) {
    //             this.matchFound(curr_type,col - curr_strike, row, col,row + 1);
    //             curr_strike = 1;
    //             curr_type = type;
    //         } else {
    //             curr_strike++;
    //         }
    //     }
    //     this.matchFound(curr_type,col - curr_strike, row, col,row + 1);
    // };
    //
    // Spriteset_Board.prototype.findMatchesInRows = function() {
    //     for(let row = 0; row < this.height; row++) {
    //         this.findMatchesInRow(row);
    //     }
    // };
    //
    // Spriteset_Board.prototype.findMatchesInColumn = function(col) {
    //     let curr_strike = 0;
    //     let curr_type = "";
    //     for(let row = 0; row < this.height; row++) {
    //         let type = this.state[row][col].type;
    //         if (type !== curr_type) {
    //             this.matchFound(curr_type, col,row - curr_strike, col + 1, row);
    //             curr_strike = 1;
    //             curr_type = type;
    //         } else {
    //             curr_strike++;
    //         }
    //     }
    //     this.matchFound(curr_type, col,row - curr_strike, col + 1, row);
    // };
    //
    // Spriteset_Board.prototype.findMatchesInColumns = function() {
    //     for(let column = 0; column < this.width; column++) {
    //         this.findMatchesInColumn(column);
    //     }
    // };
    //
    // Spriteset_Board.prototype.findMatches = function() {
    //     this.findMatchesInColumns();
    //     this.findMatchesInRows();
    // };

    // Board
    function Board() {
        this.initialize.apply(this, arguments);
    }

    Board.prototype = Object.create(PIXI.Container.prototype);
    Board.prototype.constructor = Board;

    Board.prototype.initialize = function() {
        PIXI.Container.call(this);

        this._width = boardWidth * tileWidth;
        this._height = boardHeight * tileHeight;
        this._marginX = Math.floor((Graphics.width - this._width) / 2);
        this._marginY = Math.floor((Graphics.height - this._height) / 2);
        this.bitmaps = [];

        this._createState();
        this._createSprite();
    };

    Board.prototype.isReady = function() {
        for (let i = 0; i < this.bitmaps.length; i++) {
            if (this.bitmaps[i] && !this.bitmaps[i].isReady()) {
                return false;
            }
        }
        return true;
    };

    Board.prototype.update = function() {
        this._state.update();

        this.animationCount++;
        this.animationFrame = Math.floor(this.animationCount / 30);

        this.children.forEach(function(child) {
            if (child.update) {
                child.update();
            }
        });

        for (let i=0; i<this.bitmaps.length;i++) {
            if (this.bitmaps[i]) {
                this.bitmaps[i].touch();
            }
        }

    };

    Board.prototype.updateTransform = function() {
        if (this._needsRepaint || (this._lastAnimationFrame !== this.animationFrame)) {
            this._lastAnimationFrame = this.animationFrame;
            this._bitmap.clear();
            this._paintAllTiles();
            this._needsRepaint = false;
        }
        PIXI.Container.prototype.updateTransform.call(this);
    };

    Board.prototype._createState = function() {
        this._state = new BoardState();
    };

    Board.prototype._createSprite = function() {
        this._bitmap = new Bitmap(this._width, this._height);
        this._sprite = new Sprite(this._bitmap);
        this._sprite.move(this._marginX, this._marginY);

        this.addChild(this._sprite);
        this._needsRepaint = true;
    };

    Board.prototype._paintAllTiles = function() {
        for (let x = 0; x < boardWidth; x++) {
            for (let y = 0; y < boardHeight; y++) {
                this._paintTile(x, y);
            }
        }
    };

    Board.prototype._paintTile = function(col, row) {
        let tile = this._readBoardState(col, row);
        this._drawTile(tile.id, tile.x, tile.y);
    };

    Board.prototype._drawTile = function(tileId, dx, dy) {
        let source = this.bitmaps[tileId];
        if (source) {
            this._bitmap.bltImage(source,
                0, 0, tileWidth, tileHeight,
                dx, dy, tileWidth, tileHeight);
        }
    };

    Board.prototype._readBoardState = function(col, row) {
        return this._state._board[col][row];
    };

    Board.prototype.makeMove = function (bx, by, ex, ey) {
        let [b_col, b_row] = translateCordsToGrid(bx - this._marginX, by - this._marginY);
        let [e_col, e_row] = translateCordsToGrid(ex - this._marginX, ey - this._marginY);
        let dist = Math.abs(b_row - e_row) + Math.abs(b_col - e_col);
        if (dist === 1) {
            this._state.makeMove(b_row, b_col, e_row, e_col);
            this._needsRepaint = true;
        }
    };

    // Board state
    class BoardState {
        constructor() {
            this._board = Array(boardWidth).fill(null).map(x => Array(boardHeight).fill(null));
            this.fillWithRandomTiles();
        }

        fillWithRandomTiles() {
            for (let col = 0; col < boardWidth; col++) {
                for(let row = 0; row < boardHeight; row++) {
                    this._board[col][row] = new Tile(col * tileWidth, row * tileHeight, randomInt(0, 3));
                }
            }
        }

        makeMove(b_row, b_col, e_row, e_col) {
            let temp = this._board[b_col][b_row].id;
            this._board[b_col][b_row].id = this._board[e_col][e_row].id;
            this._board[e_col][e_row].id = temp;
            console.log("Moving (", b_col, ",", b_row, ") -> (", e_col, ",", e_row, ")");
        }

        update() {}
    }

    // Tile
    class Tile {
        constructor(startX, startY, id) {
            this.x = startX;
            this.y = startY;
            this.id = id;
        }

        pop() {}
        update() {}
    }

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
        this.createSpriteset();
    };
    
    Scene_M3.prototype.terminate = function() {
        this.removeChild(this._spriteset);
        Scene_Base.prototype.terminate.call(this);
    };

    Scene_M3.prototype._checkForMove = function () {

        if (TouchInput.isTriggered()) {
            this.last_x = TouchInput.x;
            this.last_y = TouchInput.y;
        } else if (TouchInput.isReleased()) {
            this.curr_x = TouchInput.x;
            this.curr_y = TouchInput.y;
            return true;
        }

        return false;
    };

    Scene_M3.prototype._move = function () {
        this._spriteset.makeMove(this.last_x, this.last_y, this.curr_x, this.curr_y);
    };

    Scene_M3.prototype.update = function() {
        Scene_Base.prototype.update.call(this);
        if (this._checkForMove()) {
            this._move();
        }
    };
    
    Scene_M3.prototype.createSpriteset = function() {
        this._spriteset = new Spriteset_Board();
        this.addChild(this._spriteset);
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
