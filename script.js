class Shape {
    constructor(type, x, y, color = '#000000') {
        this.id = Math.random().toString(36).substring;
        this.type = type;
        this.name = `${type}`;
        this.x = x;
        this.y = y;
        this.rotation = 0;
        this.color = color;
        this.isSelected = false;
    }

    draw(ctx) {
        ctx.save();
        const [centerX, centerY] = this.getCenter();
        ctx.translate(centerX, centerY);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.fillStyle = this.getColorWithOpacity(this.color, 0.5);
        if (this.isSelected) {
            ctx.strokeStyle = '#0066ff';
            ctx.lineWidth = 2;
        }
        
        ctx.save();
        ctx.rotate(-this.rotation * Math.PI / 180);
        ctx.fillStyle = '#000000';
        ctx.font = '14px New York';

        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        ctx.fillText(this.name, 0, -this.getBoundingBox().height/2 - 5);
        ctx.restore();
    }


    getCenter() { return [this.x, this.y]; }
    getBoundingBox() { return { x: this.x, y: this.y, width: 0, height: 0 }; }

    getColorWithOpacity(color, opacity) {
        if (color.startsWith('#')) {
            let hex = color.slice(1);
            if (hex.length === 3) {
                hex = hex.split('').map(h => h + h).join('');
            }
            
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        }
        if (color.startsWith('rgb')) {
            return color.replace(')', `, ${opacity})`).replace('rgb', 'rgba');
        }
        return color;
    }
}

class Rectangle extends Shape {
    constructor(x, y, width = 100, height = 50) {
        super('rectangle', x, y);
        this.width = width;
        this.height = height;
    }

    draw(ctx) {
        super.draw(ctx);
        ctx.beginPath();
        ctx.rect(-this.width/2, -this.height/2, this.width, this.height);
        ctx.fill();
        if (this.isSelected) ctx.stroke();
        ctx.restore();
    }

    getCenter() {
        return [this.x + this.width/2, this.y + this.height/2];
    }

    getBoundingBox() {
        return { x: this.x, y: this.y, width: this.width, height: this.height };
    }

    contains(x, y) {
        const [centerX, centerY] = this.getCenter();
        const dx = x - centerX;
        const dy = y - centerY;
        const rotatedX = dx * Math.cos(-this.rotation * Math.PI / 180) - dy * Math.sin(-this.rotation * Math.PI / 180);
        const rotatedY = dx * Math.sin(-this.rotation * Math.PI / 180) + dy * Math.cos(-this.rotation * Math.PI / 180);
        return Math.abs(rotatedX) <= this.width/2 && Math.abs(rotatedY) <= this.height/2;
    }
}

class Circle extends Shape {
    constructor(x, y, radius = 25) {
        super('circle', x, y);
        this.radius = radius;
    }

    draw(ctx) {
        super.draw(ctx);
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();
        if (this.isSelected) ctx.stroke();
        ctx.restore();
    }

    getCenter() {
        return [this.x + this.radius, this.y + this.radius];
    }

    getBoundingBox() {
        return {
            x: this.x,
            y: this.y,
            width: this.radius * 2,
            height: this.radius * 2
        };
    }

    contains(x, y) {
        const [centerX, centerY] = this.getCenter();
        const dx = x - centerX;
        const dy = y - centerY;
        return dx * dx + dy * dy <= this.radius * this.radius;
    }
}

class Triangle extends Shape {
    constructor(x, y) {
        super('triangle', x, y);
        this.sideA = 50;
        this.sideB = 50;
        this.sideC = 50;
        this._validateSides();
    }

    _validateSides() {
        const minSize = 10;
        const maxSize = 200;

        this.sideA = Math.max(minSize, Math.min(maxSize, this.sideA));
        this.sideB = Math.max(minSize, Math.min(maxSize, this.sideB));
        this.sideC = Math.max(minSize, Math.min(maxSize, this.sideC));

        if (this.sideA + this.sideB <= this.sideC) {
            this.sideC = this.sideA + this.sideB - 1;
        }
        if (this.sideB + this.sideC <= this.sideA) {
            this.sideA = this.sideB + this.sideC - 1;
        }
        if (this.sideA + this.sideC <= this.sideB) {
            this.sideB = this.sideA + this.sideC - 1;
        }
    }

    updateProperty(property, value) {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return;

        if (property === 'sideA' || property === 'sideB' || property === 'sideC') {
            this[property] = numValue;
            this._validateSides();
        } else {
            this[property] = value;
        }
    }

    calculateHeight() {
        const s = (this.sideA + this.sideB + this.sideC) / 2;
        const area = Math.sqrt(s * (s - this.sideA) * (s - this.sideB) * (s - this.sideC));
        return (2 * area) / this.sideA;
    }

    draw(ctx) {
        super.draw(ctx);
        
        const a = this.sideA;
        const b = this.sideB;
        const c = this.sideC;
        
        const cosB = (a * a + c * c - b * b) / (2 * a * c);
        const angleB = Math.acos(cosB);
        
        const x1 = -a/2;
        const y1 = 0;
        const x2 = a/2;
        const y2 = 0;
        const x3 = x1 + c * Math.cos(angleB);
        const y3 = -c * Math.sin(angleB);
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.closePath();
        ctx.fill();
        if (this.isSelected) ctx.stroke();
        ctx.restore();
    }

    getCenter() {
        const a = this.sideA;
        const c = this.sideC;
        const cosB = (a * a + c * c - this.sideB * this.sideB) / (2 * a * c);
        const angleB = Math.acos(cosB);
        
        const x3 = -this.sideA/2 + this.sideC * Math.cos(angleB);
        const y3 = -this.sideC * Math.sin(angleB);
        
        return [
            this.x + (-this.sideA/2 + this.sideA/2 + x3) / 3,
            this.y + (0 + 0 + y3) / 3
        ];
    }

    getBoundingBox() {
        const a = this.sideA;
        const c = this.sideC;
        const cosB = (a * a + c * c - this.sideB * this.sideB) / (2 * a * c);
        const angleB = Math.acos(cosB);
        
        const x3 = -this.sideA/2 + this.sideC * Math.cos(angleB);
        const y3 = -this.sideC * Math.sin(angleB);
        
        const minX = Math.min(-this.sideA/2, this.sideA/2, x3);
        const maxX = Math.max(-this.sideA/2, this.sideA/2, x3);
        const minY = Math.min(0, 0, y3);
        const maxY = Math.max(0, 0, y3);
        
        return {
            x: this.x + minX,
            y: this.y + minY,
            width: maxX - minX,
            height: maxY - minY
        };
    }

    contains(x, y) {
        const [centerX, centerY] = this.getCenter();
        const dx = x - centerX;
        const dy = y - centerY;
        const rotatedX = dx * Math.cos(-this.rotation * Math.PI / 180) - dy * Math.sin(-this.rotation * Math.PI / 180);
        const rotatedY = dx * Math.sin(-this.rotation * Math.PI / 180) + dy * Math.cos(-this.rotation * Math.PI / 180);
        
        const a = this.sideA;
        const c = this.sideC;
        const cosB = (a * a + c * c - this.sideB * this.sideB) / (2 * a * c);
        const angleB = Math.acos(cosB);
        
        const x1 = -a/2;
        const y1 = 0;
        const x2 = a/2;
        const y2 = 0;
        const x3 = x1 + c * Math.cos(angleB);
        const y3 = -c * Math.sin(angleB);
        
        const denominator = ((y2 - y3)*(x1 - x3) + (x3 - x2)*(y1 - y3));
        const a1 = ((y2 - y3)*(rotatedX - x3) + (x3 - x2)*(rotatedY - y3)) / denominator;
        const b1 = ((y3 - y1)*(rotatedX - x3) + (x1 - x3)*(rotatedY - y3)) / denominator;
        const c1 = 1 - a1 - b1;
        
        return a1 >= 0 && a1 <= 1 && b1 >= 0 && b1 <= 1 && c1 >= 0 && c1 <= 1;
    }
}

// Canvas Manager
class CanvasManager {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.shapes = [];
        this.gridSize = 5;
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
         this.selectedShape = null;
        
        this.setupCanvas();
        this.setupEventListeners();
        this.setupControls();
        this.updateShapePanel();
    }

    setupCanvas() {
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.draw();
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    setupControls() {
        document.getElementById('resizeCanvas').addEventListener('click', () => {
            const width = parseInt(document.getElementById('canvasWidth').value);
            const height = parseInt(document.getElementById('canvasHeight').value);
            this.resizeCanvas(width, height);
        });
        document.getElementById('gridSize').addEventListener('input', (e) => {
            this.gridSize = parseInt(e.target.value);
            this.draw();
        });
    }

    createShape(type, x, y) {
        let shape;
        switch(type) {
            case 'rectangle':
                shape = new Rectangle(x, y);
                break;
            case 'circle':
                shape = new Circle(x, y);
                break;
            case 'triangle':
                shape = new Triangle(x, y);
                break;
            default:
                return;
        }
        this.shapes.push(shape);
        this.updateShapeList();
        this.draw();
    }

    deleteSelectedShape() {
        if (this.selectedShape) {
            this.shapes = this.shapes.filter(shape => shape !== this.selectedShape);
            this.selectedShape = null;
            this.updateShapeList();
            this.draw();
            this.updateShapePanel();
        }
    }

    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (this.selectedShape) {
            this.selectedShape.isSelected = false;
        }

        for (let i = this.shapes.length - 1; i >= 0; i--) {
            if (this.shapes[i].contains(x, y)) {
                this.isDragging = true;
                this.dragStart = { x, y };
                this.shapes[i].isSelected = true;
                this.selectedShape = this.shapes[i];
                this.updateShapePanel();
                break;
            }
        }

        this.updateShapeList();
        this.draw();
    }

    handleMouseMove(e) {
        if (!this.isDragging || !this.selectedShape) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const dx = x - this.dragStart.x;
        const dy = y - this.dragStart.y;

        this.selectedShape.x += dx;
        this.selectedShape.y += dy;

        this.dragStart = { x, y };
        this.updateShapePanel();
        this.updateShapeList();
        this.draw();
    }

    handleMouseUp() {
        this.isDragging = false;
    }

    handleKeyDown(e) {
        if (e.key === 'Delete') {
            this.deleteSelectedShape();
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();
        this.shapes.forEach(shape => shape.draw(this.ctx));
    }

    drawGrid() {
        this.ctx.strokeStyle = '#ddd';
        this.ctx.lineWidth = 0.5;

        for (let x = 0; x < this.canvas.width; x += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }

        for (let y = 0; y < this.canvas.height; y += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    resizeCanvas(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.draw();
    }

    updateShapeList() {
        const shapeList = document.getElementById('shapeList');
        shapeList.innerHTML = '';
        
        this.shapes.forEach((shape, index) => {
            const li = document.createElement('li');
            li.className = shape === this.selectedShape ? 'selected' : '';
            li.innerHTML = `
                <div class="shape-name">
                    <input type="text" 
                           value="${shape.name}"
                           class="shape-name-input"
                           onchange="canvasManager.updateShapeName(${index}, this.value)"
                           onclick="event.stopPropagation()">
                </div>
                <div class="shape-info">
                    X: ${Math.round(shape.x)}, Y: ${Math.round(shape.y)}
                </div>
            `;
            li.onclick = () => this.selectShape(shape);
            shapeList.appendChild(li);
        });
    }

    updateShapeName(index, newName) {
        if (this.shapes[index]) {
            this.shapes[index].name = newName;
            this.draw();
        }
    }

    selectShape(shape) {
        if (this.selectedShape) {
            this.selectedShape.isSelected = false;
        }
        this.selectedShape = shape;
        shape.isSelected = true;
        this.updateShapeList();
        this.draw();
        this.updateShapePanel();
    }

    updateShapePanel() {
        const panel = document.getElementById('element-panel');
        const content = document.getElementById('panel-content');
        
        panel.style.display = 'block';
        
        const shape = this.selectedShape;
        const defaultPanel = `
            <label>Position X:</label>
            <input type="number" value="NaN" disabled>
            
            <label>Position Y:</label>
            <input type="number" value="NaN" disabled>
            
            <label>Rotation:</label>
            <input type="number" value="NaN" disabled>
            
            <div class="quick-rotation-buttons">
                <button class="quick-rotation-button" disabled>0°</button>
                <button class="quick-rotation-button" disabled>90°</button>
                <button class="quick-rotation-button" disabled>180°</button>
                <button class="quick-rotation-button" disabled>270°</button>
            </div>
            
            <label>Color:</label>
            <input type="color" value="#000000" disabled>
        `;

        if (!shape) {
            content.innerHTML = defaultPanel;
            return;
        }

        content.innerHTML = `
            <label>Position X:</label>
            <input type="number" value="${Math.round(shape.x)}" 
                oninput="canvasManager.updateShapeProperty('x', this.value)">
            
            <label>Position Y:</label>
            <input type="number" value="${Math.round(shape.y)}"
                oninput="canvasManager.updateShapeProperty('y', this.value)">
            
            <label>Rotation:</label>
            <input type="number" value="${shape.rotation}"
                oninput="canvasManager.updateShapeProperty('rotation', this.value)">
            
            <div class="quick-rotation-buttons">
                <button class="quick-rotation-button" onclick="canvasManager.setQuickRotation(0)">0°</button>
                <button class="quick-rotation-button" onclick="canvasManager.setQuickRotation(90)">90°</button>
                <button class="quick-rotation-button" onclick="canvasManager.setQuickRotation(180)">180°</button>
                <button class="quick-rotation-button" onclick="canvasManager.setQuickRotation(270)">270°</button>
            </div>
            
            <label>Color:</label>
            <input type="color" value="${shape.color}"
                oninput="canvasManager.updateShapeProperty('color', this.value)">
            
            ${this.getShapeSpecificControls(shape)}
            
            <button onclick="canvasManager.deleteSelectedShape()">Delete Shape</button>
        `;
    }


    getShapeSpecificControls(shape) {
        switch(shape.type) {
            case 'rectangle':
                return `
                    <label>Width:</label>
                    <input type="number" value="${shape.width}" 
                        oninput="canvasManager.updateShapeProperty('width', this.value)">
                    <label>Height:</label>
                    <input type="number" value="${shape.height}"
                        oninput="canvasManager.updateShapeProperty('height', this.value)">
                `;
            case 'circle':
                return `
                    <label>Radius:</label>
                    <input type="number" value="${shape.radius}"
                        oninput="canvasManager.updateShapeProperty('radius', this.value)">
                `;
            case 'triangle':
                return `
                    <label>Base (Side A):</label>
                    <input type="number" value="${shape.sideA}"
                        oninput="canvasManager.updateShapeProperty('sideA', this.value)">
                    <label>Right Side (Side B):</label>
                    <input type="number" value="${shape.sideB}"
                        oninput="canvasManager.updateShapeProperty('sideB', this.value)">
                    <label>Left Side (Side C):</label>
                    <input type="number" value="${shape.sideC}"
                        oninput="canvasManager.updateShapeProperty('sideC', this.value)">
                `;
            default:
                return '';
        }
    }


    updateShapeProperty(property, value) {
        if (!this.selectedShape) return;

        this.selectedShape[property] = property === 'color' ? value : parseFloat(value);
        this.draw();
        this.updateShapeList();
    }

    setQuickRotation(degrees) {
        if (!this.selectedShape) return;
        
        this.selectedShape.rotation = degrees;
        this.updateShapePanel();
        this.draw();
    }
}

const canvasManager = new CanvasManager();
function createShape(type) {
    canvasManager.createShape(type, canvasManager.canvas.width / 2, canvasManager.canvas.height / 2);
}