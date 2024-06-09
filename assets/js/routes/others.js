/**   // Route: straight line from left to right
    (duck, t) => {
        duck.x = t * canvas.width;
        duck.y = Math.random() * canvas.height; // Random y position
    },
    // Route: straight line from right to left
    (duck, t) => {
        duck.x = canvas.width - t * canvas.width;
        duck.y = Math.random() * canvas.height; // Random y position
    },
    // Route: straight line from top to bottom
    (duck, t) => {
        duck.x = Math.random() * canvas.width; // Random x position
        duck.y = t * canvas.height;
    },
    // Route: straight line from bottom to top
    (duck, t) => {
        duck.x = Math.random() * canvas.width; // Random x position
        duck.y = canvas.height - t * canvas.height;
    },
    // Sine wave from left to right
    (duck, t) => {
        duck.x = t * canvas.width;
        duck.y = canvas.height / 2 + 100 * Math.sin(t * 2 * Math.PI);
    },
    // Sine wave from right to left
    (duck, t) => {
        duck.x = canvas.width - t * canvas.width;
        duck.y = canvas.height / 2 + 100 * Math.sin(t * 2 * Math.PI);
    },
    // Diagonal from bottom left to top right
    (duck, t) => {
        duck.x = t * canvas.width;
        duck.y = canvas.height - t * canvas.height;
    },
    // Diagonal from top right to bottom left
    (duck, t) => {
        duck.x = canvas.width - t * canvas.width;
        duck.y = t * canvas.height;
    },
    // Zig-zag pattern from left to right
    (duck, t) => {
        const zigzagFrequency = 10;
        const zigzagAmplitude = 50;
        duck.x = t * canvas.width;
        duck.y = (canvas.height / 2) + zigzagAmplitude * Math.sin(t * zigzagFrequency * Math.PI);
    },
    
    route circle: copy diamond and more points of location*/