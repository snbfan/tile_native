var m = (function (url) {

    var highlightedIndex = undefined,   // stores index of currently highlighted tile
        toggledClass = undefined,       // stores the initial class of highlighted tile
        toggledBackground = undefined,  // stores the initial background-position of highlighted tile
        select = undefined,             // select object
        phones = [],                    // phones objects container
        tiles = [];                     // tiles objects container


    /**
     * Draws tiles and select
     *
     * @param {array} phones
     */
    function drawContent(phones) {

        tiles = document.getElementsByClassName('item');
        select = document.getElementsByTagName('select')[0];
        select.onchange = toggleHighlight;

        var i = 0, l = tiles.length;
        while (i < l) {
            // generate tile content
            createTileContent(i);
            // insert option into select
            createOptionNode(i);
            i++;
        }
    }

    /**
     * Creates title, inserts it into tile
     *
     * @param {number} index
     */
    function createTileContent(index) {
        var title = document.createElement('H5'), content = '';
        tiles[index].appendChild(title);

        // insert title + price
        content = phones[index].name + ', ' + phones[index].price;

        // set background
        tiles[index].style['background-image'] = 'url("' + phones[index].image + '")';
        tiles[index].style['background-size'] = 'cover';

        // specificly for big tiles
        if (isBigTile(index)) {
            tiles[index].style['background-position'] = 'center';
            content += '<br>' + phones[index].subscription_type;
        }

        title.innerHTML = content;
        title.className = 'title';
    }

    /**
     * Checks if the title is big
     *
     * @param {number} index
     * @returns {boolean}
     */
    function isBigTile(index) {
        return /green/.test(tiles[index].className);
    }

    /**
     * Creates option, inserts it into select
     *
     * @param {number} index
     */
    function createOptionNode(index) {
        var option = document.createElement('option');
        select.appendChild(option);
        option.value = index + 1;
        option.innerHTML = phones[index].name;
    }

    /**
     * Tile background toggler
     *
     * @param {object} event
     */
    function toggleHighlight(event) {
        // drop previously highlighted tile
        dropHighlight();
        // highlight new
        setHighlight((parseInt(event.target.selectedIndex) - 1));
    }

    /**
     * Sets highlighted class for tile #index
     *
     * @param {number} index
     */
    function setHighlight(index) {
        if (tiles[index]) {
            highlightedIndex = index;
            toggledClass = tiles[index].className.match(/blue|green/g);
            toggledBackground = tiles[index].style['background-position'];
            tiles[index].className = tiles[index].className.replace(/blue|green/g, ' black');
        }
    }

    /**
     * Drops highlighted class for previously highlighted tile
     *
     */
    function dropHighlight() {
        if (tiles[highlightedIndex]) {
            tiles[highlightedIndex].style['background-position'] = toggledBackground;
            tiles[highlightedIndex].className = tiles[highlightedIndex].className.replace('black', toggledClass);
        }
    }

    /**
     * Creates a JSONP call with given url
     *
     * @param {string} url
     */
    function loadJSONP(url) {
        var script = document.createElement('script');
        script.src = url;
        document.getElementsByTagName('head')[0].appendChild(script);
    }

    // when everyone is ready - call for data
    window.document.addEventListener("DOMContentLoaded", function (event) {
        loadJSONP(url);
    });

    // return function to care about JSONP results
    return function(json) {
        phones = json;
        drawContent(phones);
    };

})('data/data?callback=m');
