const canvas = document.getElementById('gameCanvas');

export const sineWave = (duck, t) => {
    const amplitude = 100; // Amplitude of the sine wave
    const frequency = 2; // Frequency of the sine wave

    // Determine the number of complete cycles (left-to-right and right-to-left)
    const cycles = Math.floor(t * 2); // Each cycle is from 0 to 0.5 (left-to-right) and 0.5 to 1 (right-to-left)

    // Calculate the phase within the current cycle
    const phase = (t * 2) % 1;

    if (cycles % 2 === 0) {
        // Left-to-right
        duck.x = phase * canvas.width;
    } else {
        // Right-to-left
        duck.x = canvas.width - phase * canvas.width;
    }

    // Calculate the y position based on the sine wave
    duck.y = canvas.height / 2 + amplitude * Math.sin(phase * frequency * 2 * Math.PI);
};
