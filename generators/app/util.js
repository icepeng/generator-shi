const fs = require('fs');

const rewrite = (args) => {
    const lines = args.haystack.split('\n');

    let otherwiseLineIndex = -1;
    lines.forEach((line, i) => {
        if (line.indexOf(args.needle) !== -1) {
            otherwiseLineIndex = i;
        }
    });
    if (otherwiseLineIndex === -1) return lines.join('\n');

    let spaces = 0;
    while (lines[otherwiseLineIndex].charAt(spaces) === ' ') {
        spaces += 1;
    }

    let spaceStr = '';
    for (let i = spaces; i > 0; i -= 1) {
        spaceStr += ' ';
    }

    lines.splice(otherwiseLineIndex + 1, 0, args.splicable.map(line => spaceStr + line).join('\n'));

    return lines.join('\n');
};

exports.rewrite = (args) => {
    const input = args;
    input.haystack = fs.readFileSync(args.file, 'utf8');
    const body = rewrite(input);
    fs.writeFileSync(args.file, body);
};
