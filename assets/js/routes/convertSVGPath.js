export function parseSVGPath(d) {
    const commands = d.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/ig);
    const coords = [];
    let currentX = 0;
    let currentY = 0;

    for (const command of commands) {
        const type = command[0];
        const params = command.slice(1).trim().split(/[\s,]+/).map(Number);

        switch (type) {
            case 'M': // Move to
                currentX = params[0];
                currentY = params[1];
                coords.push({ x: currentX, y: currentY });
                break;
            case 'L': // Line to
                currentX = params[0];
                currentY = params[1];
                coords.push({ x: currentX, y: currentY });
                break;
            case 'Q': // Quadratic Bezier curve
                currentX = params[2];
                currentY = params[3];
                coords.push({ x: currentX, y: currentY });
                break;
            case 'T': // Shorthand/smooth quadratic Bezier curve
                currentX = params[0];
                currentY = params[1];
                coords.push({ x: currentX, y: currentY });
                break;
            // Add more cases as needed for other commands
            default:
                console.warn(`Command ${type} not supported yet`);
                break;
        }
    }

    return coords;
}


/** 
// Example usage
const pathData = "M 0 250 L 100 250 L 150 200 L 150 200 L 150 150 L 200 100 L 200 50 L 250 50 L 300 50 L 350 0 L 400 0 L 450 50 L 500 50 L 550 50 L 600 100 L 650 150 L 750 150 L 800 100 L 850 100 L 900 150 L 950 200 L 1000 200 L 1000 250 L 1000 300 L 950 350 L 900 400 L 850 450 L 750 450 L 700 500 L 650 450 L 600 500 L 550 450 L 500 400 L 400 400 L 250 500 L 100 400 L 0 250 ";
 const coordinates = parseSVGPath(pathData);
console.log(coordinates); */
