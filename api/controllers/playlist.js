var path = require('path');

exports.playlist = (req, res) => {
    res.sendFile(path.join(__dirname, '../../public', 'playlist.html'));

}