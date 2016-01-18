###*
 * jquery.SlideCounter
 * 
 * 
 * 数字 座標（数字一つの高さ × n）
 * |9|　   0
 * |8|　 - 1
 * |7|　 - 2
 * |6|　 - 3
 * |5|　 - 4
 * |4|　 - 5
 * |3|　 - 6
 * |2|　 - 7
 * |1|　 - 8
 * |0|　 - 9 ↑上段
 * |9|　 -10 ↓下段
 * |8|　 -11
 * |7|　 -12
 * |6|　 -13
 * |5|　 -14
 * |4|　 -15
 * |3|　 -16
 * |2|　 -17
 * |1|　 -18
 * |0|　 -19
 * 
 * 0~9までの数字を2段重ねで表示
 * 
 * 
 * 
 * 
 * 
 * 
###
do($ = jQuery) ->

	###*
	 * SlideCounterPart
	 * カウンターの各桁
	 * 
	###
	class SlideCounterPart
				
		###*
		 * constructor
		 * @param {jQueryObject} li要素
		 * @param {Object} オプション
		###
		constructor: (_$el , _options) ->

			# 初期値
			options = {
				# 必須
				image: ''          # 数字の画像
				width: 10          # 幅
				height: 20         # 高さ

				# オプション
				delay: 0           # アニメーション開始の時間差
				easing: 'swing'    # イージング
				speed: 200         # アニメーション速度
				background: '#FFF' # 背景色
				isVelocity: false  # Velocity.js を使用するか
			}

			# オプションをマージ
			@options = $.extend(options, _options)
			
			# アニメーションさせるdiv要素を作って配置する
			@$el = _$el
			@$div = $('<div>')
			_$el.append @$div

			
			# li要素のスタイル
			@$el.css
				position: 'relative'
				display: 'block'
				float: 'left'
				width: @options.width
				height: @options.height
				overflow: 'hidden'
				'background-color': @options.background


			# div要素のスタイル
			@$div.css
				position: 'absolute'
				width: @options.width
				height: @options.height * 2 * 10

				# 画像のパスを背景画像に設定
				'background-image': 'url(' + @options.image + ')'
				'background-repeat': 'repeat-y'

			
		
		###*
		 * アニメーションさせずに表示を切り替える
		 * @param {Number} _num
		###
		set: (_num) ->

			@$div.css
				'top': -(9 - _num) * @options.height
			@tmp = _num

			return
			
		
		###*
		 * アニメーションさせて表示を切り替える
		 * @param {Number} _num
		###
		animate: (_num) ->

			num = _num

			# アニメーションの時間差			
			delay = @options.delay * (@options.total - @options.serial)
			
			# イージング
			easing = @options.easing

			# 移動目標が現在より小さい数字の場合は逆回転になってしまうので、目標を上段の数字に補正する
			# target = if num isnt 0 and num < @tmp then -(9 - num) else -((9 -  num) + 10)
			target = if num < @tmp then -(9 - num) else -((9 -  num) + 10)

			# 目標位置に応じて移動速度を変化させる 移動距離は必ず加算の方向になるよう補正する
			duration = if num < @tmp then (10 - (@tmp - num)) * @options.speed else (num - @tmp) * @options.speed

			# 前回表示時と数値が変わっていたら表示をアニメーションで切り替える			
			if(@tmp isnt num)

				# Velocity.js を使用する場合のアニメーションの
				if @options.isVelocity
					@$div
						.velocity('stop')
						.stop()
						.css
							'top': - ((9 - @tmp) + 10) * @options.height　# 表示位置を下段の数字に補正する
						.velocity(
							{
								top: target * @options.height
							}, 
							{
								duration: duration
								delay: delay
								easing: easing
							}
						)

				# Velocity.js を使用しない場合は jQuery.animate でアニメーション
				else
					@$div
						.stop()
						.css
							'top': - ((9 - @tmp) + 10) * @options.height　# 表示位置を下段の数字に補正する
						.animate(
							{
								top: target * @options.height
							}, 
							{
								duration: duration
								delay: delay
								easing: easing
							}
						)


				# 表示した数値を保持しておく
				@tmp = _num
			return

	#------------------------------
	# SlideCounter
	#------------------------------

	###*
	 * SlideCounter
	 * @param {Object} _options 
	 * 
	###
	$.fn.SlideCounter = (_options) ->

		if !_options.image?
			throw new Error('image is required.')
		if !_options.width?
			throw new Error('width is required.')
		if !_options.height?
			throw new Error('height is required.')

		# Velocity.js が存在すればtrue
		isVelocity = $.fn.velocity?
		console.log "isVelocity : " + isVelocity

		# カウンター
		$counter = this

		# カウンターの基本スタイル
		$counter.css
			position: 'relative'
			display: 'block'
			overflow: 'hidden'
			margin: 0
			padding: 0
			'list-style-type': 'none'

		# 各桁に分解した数値が入る配列
		numList = []

		# 各カウンターインスタンスが入る配列
		partList = []

		# li要素
		$li = $counter.find('li')

		# li要素の数
		size = $li.size()

		# li要素の数だけ繰り返す
		for i in [0..size - 1]
			li = $li.eq(i)
			
			# 何番目のli要素か
			_options.serial = i

			# li要素の数
			_options.total = size

			# velocity.jsを使用しているか
			_options.isVelocity = isVelocity
			
			# SlideCounterPart インスタンスを作る
			partList[i] = new SlideCounterPart(li, _options)

			# 右端のli要素以外に margin-right を適用
			margin = if(i is size - 1) then 0 else _options.margin
			li.css
				'margin-right': margin

		# 表示可能最大値 （li要素が4つ → 4ケタ → 9999）
		max = Math.pow(10, size) - 1


		###*
		 * カウンターの表示を変更する
		 * @param {Number} _number   表示する数値
		 * @param {Boolean} _animate アニメーションさせるならtrue
		###
		$counter.set = (_number , _animate = false) ->
			console.log _number
			
			
			# 最大値を超えないよう補正
			if _number > max
				_number = max

			# ゼロパディング
			num = zeroPadding(_number, size)

			# 数値を各桁に分解する
			numList = []
			for value, i in partList
				# （+）で数値に変換しつつ配列に格納
				numList[i] = +num.substr(i,1)

			# アニメーションさせずに表示を変更する
			if !_animate
				for value, i in partList
					value.set(numList[i])

			# アニメーションさせて表示を変更する
			else
				for value, i in partList
					value.animate(numList[i])
			
			return


		###*
		 * ゼロパディング 
		 * @param {Number} _num 数値
		 * @praram {Number} _length 桁数
		 * @return {String} 指定の桁数に足りない分は0で埋めた文字列
		###
		zeroPadding = (_num, _length) ->
			return (Array(_length).join('0') + _num).slice(-_length)

		return this


	return