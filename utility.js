const glob = require('glob');
const jsonfile = require('jsonfile');
const fs = require('fs');
const path = require('path');

module.exports = {
    loadAssets: function () {
        // Attempt to load or verify basic field model asset information.
        let generic = this.loadGenericAssets();

        // Attempt to locate and load game specific asset information.
        let games = this.loadGameAssets();

        return { generic: generic, games: games };
    },
    loadGameAssets: function () {
        let assets = [];
        let files = glob.sync('client/models/games/**/config.json');
        if (files.length === 0) {
            console.warn("No games found in the games directory.");
        }
        else {
            files.forEach(config => {
                json = jsonfile.readFileSync(config);
                const isValid = json !== undefined
                    && json.name !== undefined
                    && json.season != undefined
                    && json.assets != undefined
                    && json.assets.length > 0;
                if (isValid === true) {
                    console.log(`Found game \'${json.name}\'...`);
                    json.assets.forEach(asset => {
                        asset.path = path.relative('client', path.join(path.dirname(config), asset.path));
                    });
                    assets.push(json);
                }
            });
        }
        return assets;
    },
    loadGenericAssets: function () {
        let assets = [];
        const obj = jsonfile.readFileSync(__dirname + '/client/models/assets.json');
        {
            if (obj === undefined) {
                console.error("No generic field assets defined. Check your assets.json file.");
            }
            else {
                assets = obj;
            }
        };
        return assets;
    }
};






