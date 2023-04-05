function getSol() {
    const fs = require('fs');
    const words = fs.readFileSync('../public/solutions.txt', 'utf-8').split('\n');
    const filteredWords = words.filter(word => word.trim().length === 6);
    const randomIndex = Math.floor(Math.random() * filteredWords.length);

// Get the word at the random index
    const solution = filteredWords[randomIndex];
    console.log(solution);
    return solution;
}
app.get('/get-sol', (req, res) => {
    const solution = getSol();
    res.send(solution);
});
