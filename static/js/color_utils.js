// Utilities for color conversion

// Convert sRGB color to linear color
function sRGBToLinear(sRGBColor) {
    const linearColor = sRGBColor.map((c) => {
        const s = c / 255;
        return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });

    return linearColor;
}
