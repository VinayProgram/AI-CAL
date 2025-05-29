const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

let baseGridSizeOnScreen = 50; // Desired apparent size on screen
let currentZoomLevel = 1.0;
let targetZoomLevel = 1.0; // For smooth zoom
const zoomSpeed = 0.1;
const minZoom = 0.2;
const maxZoom = 5.0;

let cameraOffset = { x: 0, y: 0 };
let targetCameraOffset = { x: 0, y: 0 }; // For smooth pan
const panSpeed = 0.1; // Smoothing factor for panning

let isPanning = false;
let lastMousePos = { x: 0, y: 0 };

function getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Smooth zoom and pan
    currentZoomLevel = lerp(currentZoomLevel, targetZoomLevel, 0.2); // Adjust smoothing factor
    cameraOffset.x = lerp(cameraOffset.x, targetCameraOffset.x, panSpeed);
    cameraOffset.y = lerp(cameraOffset.y, targetCameraOffset.y, panSpeed);

    const actualGridSpacing = baseGridSizeOnScreen; // The spacing in the transformed space will be baseGridSizeOnScreen

    ctx.save();

    // Apply transformations - Center zoom on canvas center
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(currentZoomLevel, currentZoomLevel);
    ctx.translate(-cameraOffset.x, -cameraOffset.y); // Pan in the zoomed space

    // Calculate visible range
    // Top-left corner in world coordinates (considering the view is centered on cameraOffset)
    const worldViewX0 = cameraOffset.x - (canvas.width / 2) / currentZoomLevel;
    const worldViewY0 = cameraOffset.y - (canvas.height / 2) / currentZoomLevel;
    // Bottom-right corner
    const worldViewX1 = cameraOffset.x + (canvas.width / 2) / currentZoomLevel;
    const worldViewY1 = cameraOffset.y + (canvas.height / 2) / currentZoomLevel;

    // Determine start and end lines
    const startX = Math.floor(worldViewX0 / actualGridSpacing) * actualGridSpacing;
    const endX = Math.ceil(worldViewX1 / actualGridSpacing) * actualGridSpacing;
    const startY = Math.floor(worldViewY0 / actualGridSpacing) * actualGridSpacing;
    const endY = Math.ceil(worldViewY1 / actualGridSpacing) * actualGridSpacing;

    ctx.beginPath();
    ctx.strokeStyle = '#ccc'; // Grid color
    ctx.lineWidth = 1 / currentZoomLevel; // Keep line width visually constant

    // Vertical lines
    for (let x = startX; x <= endX; x += actualGridSpacing) {
        ctx.moveTo(x, startY);
        ctx.lineTo(x, endY);
    }

    // Horizontal lines
    for (let y = startY; y <= endY; y += actualGridSpacing) {
        ctx.moveTo(startX, y);
        ctx.lineTo(endX, y);
    }
    ctx.stroke();
    ctx.restore();

    requestAnimationFrame(drawGrid);
}

// --- Event Listeners ---

// Zoom
canvas.addEventListener('wheel', function(event) {
    event.preventDefault();

    const mousePos = getMousePos(canvas, event);

    // Position of the mouse in world coordinates before zoom
    const worldXBeforeZoom = (mousePos.x - canvas.width / 2) / currentZoomLevel + cameraOffset.x;
    const worldYBeforeZoom = (mousePos.y - canvas.height / 2) / currentZoomLevel + cameraOffset.y;

    // Update target zoom level
    const delta = event.deltaY > 0 ? 1 - zoomSpeed : 1 + zoomSpeed;
    targetZoomLevel *= delta;
    targetZoomLevel = Math.max(minZoom, Math.min(maxZoom, targetZoomLevel));

    // Adjust camera offset to keep the point under the mouse stationary
    // This makes the cameraOffset the new center of the view, adjusted for the mouse position
    targetCameraOffset.x = worldXBeforeZoom - (mousePos.x - canvas.width / 2) / targetZoomLevel;
    targetCameraOffset.y = worldYBeforeZoom - (mousePos.y - canvas.height / 2) / targetZoomLevel;

});

// Pan
canvas.addEventListener('mousedown', function(event) {
    isPanning = true;
    lastMousePos = getMousePos(canvas, event);
});

canvas.addEventListener('mousemove', function(event) {
    if (!isPanning) return;
    const mousePos = getMousePos(canvas, event);

    const deltaX = (mousePos.x - lastMousePos.x) / currentZoomLevel; // Scale delta by zoom
    const deltaY = (mousePos.y - lastMousePos.y) / currentZoomLevel;

    targetCameraOffset.x -= deltaX;
    targetCameraOffset.y -= deltaY;

    lastMousePos = mousePos;
});

canvas.addEventListener('mouseup', function() {
    isPanning = false;
});

canvas.addEventListener('mouseleave', function() {
    isPanning = false;
});


// Initial draw
// Make sure canvas has a size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// Center initial view roughly
targetCameraOffset.x = 0; // Or some starting world point
targetCameraOffset.y = 0;

drawGrid();

function lerp(start, end, t) {
  return start * (1 - t) + end * t;
}