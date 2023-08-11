function numberGenerate() {
    const number = Math.floor(Math.random() * 100000 + 1);
    return number;
}

module.exports = numberGenerate;