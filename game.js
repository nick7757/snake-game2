class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        
        // 设置画布大小
        this.canvas.width = 400;
        this.canvas.height = 400;
        
        // 游戏参数
        this.gridSize = 20;
        this.tileCount = this.canvas.width / this.gridSize;
        this.snake = [];
        this.food = {};
        this.direction = 'right';
        this.nextDirection = 'right';
        this.score = 0;
        this.gameLoop = null;
        this.speed = 100;
        
        // 初始化游戏
        this.init();
        
        // 绑定事件
        this.bindEvents();
    }
    
    init() {
        // 初始化蛇的位置
        this.snake = [
            { x: 5, y: 5 },
            { x: 4, y: 5 },
            { x: 3, y: 5 }
        ];
        
        // 生成第一个食物
        this.generateFood();
        
        // 重置分数
        this.score = 0;
        this.updateScore();
    }
    
    bindEvents() {
        // 键盘控制
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowUp':
                    if (this.direction !== 'down') this.nextDirection = 'up';
                    break;
                case 'ArrowDown':
                    if (this.direction !== 'up') this.nextDirection = 'down';
                    break;
                case 'ArrowLeft':
                    if (this.direction !== 'right') this.nextDirection = 'left';
                    break;
                case 'ArrowRight':
                    if (this.direction !== 'left') this.nextDirection = 'right';
                    break;
            }
        });
        
        // 移动端控制
        document.getElementById('upBtn').addEventListener('click', () => {
            if (this.direction !== 'down') this.nextDirection = 'up';
        });
        
        document.getElementById('downBtn').addEventListener('click', () => {
            if (this.direction !== 'up') this.nextDirection = 'down';
        });
        
        document.getElementById('leftBtn').addEventListener('click', () => {
            if (this.direction !== 'right') this.nextDirection = 'left';
        });
        
        document.getElementById('rightBtn').addEventListener('click', () => {
            if (this.direction !== 'left') this.nextDirection = 'right';
        });
        
        // 开始按钮
        document.getElementById('startBtn').addEventListener('click', () => {
            this.start();
        });
    }
    
    generateFood() {
        this.food = {
            x: Math.floor(Math.random() * this.tileCount),
            y: Math.floor(Math.random() * this.tileCount)
        };
        
        // 确保食物不会生成在蛇身上
        for (let segment of this.snake) {
            if (segment.x === this.food.x && segment.y === this.food.y) {
                this.generateFood();
                break;
            }
        }
    }
    
    update() {
        // 更新方向
        this.direction = this.nextDirection;
        
        // 获取蛇头
        const head = { ...this.snake[0] };
        
        // 根据方向移动蛇头
        switch(this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }
        
        // 检查是否撞墙
        if (head.x < 0 || head.x >= this.tileCount || 
            head.y < 0 || head.y >= this.tileCount) {
            this.gameOver();
            return;
        }
        
        // 检查是否撞到自己
        for (let segment of this.snake) {
            if (head.x === segment.x && head.y === segment.y) {
                this.gameOver();
                return;
            }
        }
        
        // 移动蛇
        this.snake.unshift(head);
        
        // 检查是否吃到食物
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.updateScore();
            this.generateFood();
        } else {
            this.snake.pop();
        }
    }
    
    draw() {
        // 清空画布
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制蛇
        this.ctx.fillStyle = '#4CAF50';
        for (let segment of this.snake) {
            this.ctx.fillRect(
                segment.x * this.gridSize,
                segment.y * this.gridSize,
                this.gridSize - 2,
                this.gridSize - 2
            );
        }
        
        // 绘制食物
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(
            this.food.x * this.gridSize,
            this.food.y * this.gridSize,
            this.gridSize - 2,
            this.gridSize - 2
        );
    }
    
    updateScore() {
        this.scoreElement.textContent = this.score;
    }
    
    gameOver() {
        clearInterval(this.gameLoop);
        alert(`游戏结束！得分：${this.score}`);
        this.init();
    }
    
    start() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
        }
        this.init();
        this.gameLoop = setInterval(() => {
            this.update();
            this.draw();
        }, this.speed);
    }
}

// 创建游戏实例
const game = new SnakeGame(); 