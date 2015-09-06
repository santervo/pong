$(function() {

	function clamp(i, min, max) {
		return Math.min(Math.max(i, min), max)
	}

	function between(i, min, max) {
		return i >= min && i <= max
	}

	function distance(x1, y1, x2, y2) {
		var xD = x1 - x2
		var yD = y1 - y2
		return Math.sqrt(xD*xD + yD*yD)
	}

	var pong = {

		canvas: null,
		ctx: null,
		player: null,
		computer: null,
		ball: null,
		keys: {},
		tableWidth: 640,
		tableHeight: 480,
		paddleWidth: 20,
		paddleHeight: 80,
		paddleSpeed: 1,
		ballWidth: 20,
		ballSpeed: 5,

		init: function() {
			this.initCanvas()
			this.initObjects()
			this.bindKeys()
		},

		initCanvas: function() {
			this.canvas = document.createElement("canvas")
			this.canvas.width = this.tableWidth
			this.canvas.height = this.tableHeight
			this.ctx = this.canvas.getContext("2d")		
		},

		initObjects: function() {
			this.player = { 
				x: this.paddleWidth, 
				y: (this.tableHeight - this.paddleHeight) / 2 
			}

			this.computer = { 
				x: this.tableWidth - 2*this.paddleWidth, 
				y: (this.tableHeight - this.paddleHeight) / 2 
			}

			this.ball = {
				x: (this.tableWidth + this.ballWidth) / 2,
				y: (this.tableHeight + this.ballWidth) / 2,
				velX: -this.ballSpeed,
				velY: 0
			}
		},

		bindKeys: function() {
			var keys = this.keys

			_.each(["up", "down"], function(key) {
				$(document.body).bind("keydown", key, function() { keys[key] = true })
				$(document.body).bind("keyup", key, function() { keys[key] = false })
			})
		},

		start: function() {
			requestAnimationFrame(this.loop.bind(this))
		},

		loop: function() {
			this.update()
			this.draw()
			requestAnimationFrame(this.loop.bind(this))
		},

		update: function() {
			this.updatePlayer()
			this.updateBall()	
		},

		updatePlayer: function() {
			if(this.keys.up) {
				this.player.y -= this.paddleSpeed
			}
			else if(this.keys.down) {
				this.player.y += this.paddleSpeed
			}
			this.limitPaddle(this.player)
		},

		limitPaddle: function(paddle) {
			paddle.y = clamp(paddle.y, 0, this.tableHeight - this.paddleHeight)
		},

		updateBall: function() {
			this.ball.x += this.ball.velX
			this.ball.y += this.ball.velY

			this.handleWallCollision()
			this.handlePaddleCollisions()
		},

		handleWallCollision: function() {
			var topOffset = this.ball.y
			var bottomOffset = (this.ball.y + this.ballWidth) - this.tableHeight
			if(topOffset <= 0 || bottomOffset >= 0) {
				this.ball.y -= 2*(topOffset <= 0 ? topOffset : bottomOffset)
				this.ball.velY *= -1
			}
		},


		handlePaddleCollisions: function() {
			this.ball.velX < 0 ? this.handlePlayerCollision() : this.handleComputerCollision()
		},

		handlePlayerCollision: function() {
			if(this.ball.x <= this.player.x + this.paddleWidth) {
				var offset = (this.player.x + this.paddleWidth) - this.ball.x
				this.ball.x += 2*offset
				this.ball.velX *= -1
			}
		},

		handleComputerCollision: function() {
			if(this.ball.x + this.ballWidth >= this.computer.x) {
				var offset = (this.ball.x + this.ballWidth) - this.computer.x
				this.ball.x -= 2*offset
				this.ball.velX *= -1
			}
		},

		draw: function() {
			this.drawTable()
			this.drawPaddle(this.player)
			this.drawPaddle(this.computer)
			this.drawBall()
		},

		drawTable: function() {
			this.ctx.fillStyle = "#000000"
			this.ctx.fillRect(0, 0, this.tableWidth, this.tableHeight)
		},

		drawPaddle: function(paddle) {
			this.ctx.fillStyle = "#FFFFFF"
			this.ctx.fillRect(paddle.x, paddle.y, this.paddleWidth, this.paddleHeight)
		},

		drawBall: function() {
			this.ctx.fillStyle = "#FFFFFF"
			this.ctx.fillRect(this.ball.x, this.ball.y, this.ballWidth, this.ballWidth)
		}
	}

	pong.init()
	document.body.appendChild(pong.canvas)
	pong.start()

});