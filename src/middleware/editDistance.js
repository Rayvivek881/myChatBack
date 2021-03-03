const IsOkName = (s1, s2) => {
    const max = (a, b) =>{
        if (a > b) {
            return a;
        } else {
            return b;
        }
    }
    const lsts1 = s1.split(' ');
    const lsts2 = s2.split(' ');
    let ans = 0, ans1 = 0;
    for (var i in lsts1) {
        if (lsts2.indexOf(i) != -1) {
            ans += 2;
        }
    }
    ans = Math.ceil((ans / (lsts2.length + lsts1.length)) * 100);
    for (var i in lsts2) {
        if (lsts1.indexOf(i) != -1) {
            ans1 += 2;
        }
    }
    ans1 = Math.ceil((ans1 / (lsts2.length + lsts1.length)) * 100);
    return max(ans, ans1) >= 50;
}
module.exports = IsOkName;