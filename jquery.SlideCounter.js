
/**
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
 */

(function() {
  (function($) {

    /**
    	 * SlideCounterPart
    	 * カウンターの各桁
    	 *
     */
    var SlideCounterPart;
    SlideCounterPart = (function() {

      /**
      		 * constructor
      		 * @param {jQueryObject} li要素
      		 * @param {Object} オプション
       */
      function SlideCounterPart(_$el, _options) {
        var options;
        options = {
          image: '',
          width: 10,
          height: 20,
          delay: 0,
          easing: 'swing',
          speed: 200,
          background: '#FFF',
          isVelocity: false
        };
        this.options = $.extend(options, _options);
        this.$el = _$el;
        this.$div = $('<div>');
        _$el.append(this.$div);
        this.$el.css({
          position: 'relative',
          display: 'block',
          float: 'left',
          width: this.options.width,
          height: this.options.height,
          overflow: 'hidden',
          'background-color': this.options.background
        });
        this.$div.css({
          position: 'absolute',
          width: this.options.width,
          height: this.options.height * 2 * 10,
          'background-image': 'url(' + this.options.image + ')',
          'background-repeat': 'repeat-y'
        });
      }


      /**
      		 * アニメーションさせずに表示を切り替える
      		 * @param {Number} _num
       */

      SlideCounterPart.prototype.set = function(_num) {
        this.$div.css({
          'top': -(9 - _num) * this.options.height
        });
        this.tmp = _num;
      };


      /**
      		 * アニメーションさせて表示を切り替える
      		 * @param {Number} _num
       */

      SlideCounterPart.prototype.animate = function(_num) {
        var delay, duration, easing, num, target;
        num = _num;
        delay = this.options.delay * (this.options.total - this.options.serial);
        easing = this.options.easing;
        target = num < this.tmp ? -(9 - num) : -((9 - num) + 10);
        duration = num < this.tmp ? (10 - (this.tmp - num)) * this.options.speed : (num - this.tmp) * this.options.speed;
        if (this.tmp !== num) {
          if (this.options.isVelocity) {
            this.$div.velocity('stop').stop().css({
              'top': -((9 - this.tmp) + 10) * this.options.height
            }).velocity({
              top: target * this.options.height
            }, {
              duration: duration,
              delay: delay,
              easing: easing
            });
          } else {
            this.$div.stop().css({
              'top': -((9 - this.tmp) + 10) * this.options.height
            }).animate({
              top: target * this.options.height
            }, {
              duration: duration,
              delay: delay,
              easing: easing
            });
          }
          this.tmp = _num;
        }
      };

      return SlideCounterPart;

    })();

    /**
    	 * SlideCounter
    	 * @param {Object} _options 
    	 *
     */
    $.fn.SlideCounter = function(_options) {
      var $counter, $li, i, isVelocity, j, li, margin, max, numList, partList, ref, size, zeroPadding;
      if (_options.image == null) {
        throw new Error('image is required.');
      }
      if (_options.width == null) {
        throw new Error('width is required.');
      }
      if (_options.height == null) {
        throw new Error('height is required.');
      }
      isVelocity = $.fn.velocity != null;
      console.log("isVelocity : " + isVelocity);
      $counter = this;
      $counter.css({
        position: 'relative',
        display: 'block',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
        'list-style-type': 'none'
      });
      numList = [];
      partList = [];
      $li = $counter.find('li');
      size = $li.size();
      for (i = j = 0, ref = size - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        li = $li.eq(i);
        _options.serial = i;
        _options.total = size;
        _options.isVelocity = isVelocity;
        partList[i] = new SlideCounterPart(li, _options);
        margin = i === size - 1 ? 0 : _options.margin;
        li.css({
          'margin-right': margin
        });
      }
      max = Math.pow(10, size) - 1;

      /**
      		 * カウンターの表示を変更する
      		 * @param {Number} _number   表示する数値
      		 * @param {Boolean} _animate アニメーションさせるならtrue
       */
      $counter.set = function(_number, _animate) {
        var k, l, len, len1, len2, m, num, value;
        if (_animate == null) {
          _animate = false;
        }
        console.log(_number);
        if (_number > max) {
          _number = max;
        }
        num = zeroPadding(_number, size);
        numList = [];
        for (i = k = 0, len = partList.length; k < len; i = ++k) {
          value = partList[i];
          numList[i] = +num.substr(i, 1);
        }
        if (!_animate) {
          for (i = l = 0, len1 = partList.length; l < len1; i = ++l) {
            value = partList[i];
            value.set(numList[i]);
          }
        } else {
          for (i = m = 0, len2 = partList.length; m < len2; i = ++m) {
            value = partList[i];
            value.animate(numList[i]);
          }
        }
      };

      /**
      		 * ゼロパディング 
      		 * @param {Number} _num 数値
      		 * @praram {Number} _length 桁数
      		 * @return {String} 指定の桁数に足りない分は0で埋めた文字列
       */
      zeroPadding = function(_num, _length) {
        return (Array(_length).join('0') + _num).slice(-_length);
      };
      return this;
    };
  })(jQuery);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpxdWVyeS5TbGlkZUNvdW50ZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtFQWtDRSxDQUFBLFNBQUMsQ0FBRDs7QUFFRDs7Ozs7QUFBQSxRQUFBO0lBS007O0FBRUw7Ozs7O01BS2EsMEJBQUMsSUFBRCxFQUFRLFFBQVI7QUFHWixZQUFBO1FBQUEsT0FBQSxHQUFVO1VBRVQsS0FBQSxFQUFPLEVBRkU7VUFHVCxLQUFBLEVBQU8sRUFIRTtVQUlULE1BQUEsRUFBUSxFQUpDO1VBT1QsS0FBQSxFQUFPLENBUEU7VUFRVCxNQUFBLEVBQVEsT0FSQztVQVNULEtBQUEsRUFBTyxHQVRFO1VBVVQsVUFBQSxFQUFZLE1BVkg7VUFXVCxVQUFBLEVBQVksS0FYSDs7UUFlVixJQUFDLENBQUEsT0FBRCxHQUFXLENBQUMsQ0FBQyxNQUFGLENBQVMsT0FBVCxFQUFrQixRQUFsQjtRQUdYLElBQUMsQ0FBQSxHQUFELEdBQU87UUFDUCxJQUFDLENBQUEsSUFBRCxHQUFRLENBQUEsQ0FBRSxPQUFGO1FBQ1IsSUFBSSxDQUFDLE1BQUwsQ0FBWSxJQUFDLENBQUEsSUFBYjtRQUlBLElBQUMsQ0FBQSxHQUFHLENBQUMsR0FBTCxDQUNDO1VBQUEsUUFBQSxFQUFVLFVBQVY7VUFDQSxPQUFBLEVBQVMsT0FEVDtVQUVBLEtBQUEsRUFBTyxNQUZQO1VBR0EsS0FBQSxFQUFPLElBQUMsQ0FBQSxPQUFPLENBQUMsS0FIaEI7VUFJQSxNQUFBLEVBQVEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUpqQjtVQUtBLFFBQUEsRUFBVSxRQUxWO1VBTUEsa0JBQUEsRUFBb0IsSUFBQyxDQUFBLE9BQU8sQ0FBQyxVQU43QjtTQUREO1FBV0EsSUFBQyxDQUFBLElBQUksQ0FBQyxHQUFOLENBQ0M7VUFBQSxRQUFBLEVBQVUsVUFBVjtVQUNBLEtBQUEsRUFBTyxJQUFDLENBQUEsT0FBTyxDQUFDLEtBRGhCO1VB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cEMsT0FBTyxDQUFDLEdBQVIsQ0FBWSxPQUFaO1FBSUEsSUFBRyxPQUFBLEdBQVUsR0FBYjtVQUNDLE9BQUEsR0FBVSxJQURYOztRQUlBLEdBQUEsR0FBTSxXQUFBLENBQVksT0FBWixFQUFxQixJQUFyQjtRQUdOLE9BQUEsR0FBVTtBQUNWLGFBQUEsa0RBQUE7O1VBRUMsT0FBUSxDQUFBLENBQUEsQ0FBUixHQUFhLENBQUMsR0FBRyxDQUFDLE1BQUosQ0FBVyxDQUFYLEVBQWEsQ0FBYjtBQUZmO1FBS0EsSUFBRyxDQUFDLFFBQUo7QUFDQyxlQUFBLG9EQUFBOztZQUNDLEtBQUssQ0FBQyxHQUFOLENBQVUsT0FBUSxDQUFBLENBQUEsQ0FBbEI7QUFERCxXQUREO1NBQUEsTUFBQTtBQU1DLGVBQUEsb0RBQUE7O1lBQ0MsS0FBSyxDQUFDLE9BQU4sQ0FBYyxPQUFRLENBQUEsQ0FBQSxDQUF0QjtBQURELFdBTkQ7O01BbEJjOztBQThCZjs7Ozs7O01BTUEsV0FBQSxHQUFjLFNBQUMsSUFBRCxFQUFPLE9BQVA7QUFDYixlQUFPLENBQUMsS0FBQSxDQUFNLE9BQU4sQ0FBYyxDQUFDLElBQWYsQ0FBb0IsR0FBcEIsQ0FBQSxHQUEyQixJQUE1QixDQUFpQyxDQUFDLEtBQWxDLENBQXdDLENBQUMsT0FBekM7TUFETTtBQUdkLGFBQU87SUExR1k7RUFySm5CLENBQUEsQ0FBRixDQUFPLE1BQVA7QUFsQ0EiLCJmaWxlIjoianF1ZXJ5LlNsaWRlQ291bnRlci5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbIiMjIypcclxuICoganF1ZXJ5LlNsaWRlQ291bnRlclxyXG4gKiBcclxuICogXHJcbiAqIOaVsOWtlyDluqfmqJnvvIjmlbDlrZfkuIDjgaTjga7pq5jjgZUgw5cgbu+8iVxyXG4gKiB8OXzjgIAgICAwXHJcbiAqIHw4fOOAgCAtIDFcclxuICogfDd844CAIC0gMlxyXG4gKiB8NnzjgIAgLSAzXHJcbiAqIHw1fOOAgCAtIDRcclxuICogfDR844CAIC0gNVxyXG4gKiB8M3zjgIAgLSA2XHJcbiAqIHwyfOOAgCAtIDdcclxuICogfDF844CAIC0gOFxyXG4gKiB8MHzjgIAgLSA5IOKGkeS4iuautVxyXG4gKiB8OXzjgIAgLTEwIOKGk+S4i+autVxyXG4gKiB8OHzjgIAgLTExXHJcbiAqIHw3fOOAgCAtMTJcclxuICogfDZ844CAIC0xM1xyXG4gKiB8NXzjgIAgLTE0XHJcbiAqIHw0fOOAgCAtMTVcclxuICogfDN844CAIC0xNlxyXG4gKiB8MnzjgIAgLTE3XHJcbiAqIHwxfOOAgCAtMThcclxuICogfDB844CAIC0xOVxyXG4gKiBcclxuICogMH4544G+44Gn44Gu5pWw5a2X44KSMuautemHjeOBreOBp+ihqOekulxyXG4gKiBcclxuICogXHJcbiAqIFxyXG4gKiBcclxuICogXHJcbiAqIFxyXG4jIyNcclxuZG8oJCA9IGpRdWVyeSkgLT5cclxuXHJcblx0IyMjKlxyXG5cdCAqIFNsaWRlQ291bnRlclBhcnRcclxuXHQgKiDjgqvjgqbjg7Pjgr/jg7zjga7lkITmoYFcclxuXHQgKiBcclxuXHQjIyNcclxuXHRjbGFzcyBTbGlkZUNvdW50ZXJQYXJ0XHJcblx0XHRcdFx0XHJcblx0XHQjIyMqXHJcblx0XHQgKiBjb25zdHJ1Y3RvclxyXG5cdFx0ICogQHBhcmFtIHtqUXVlcnlPYmplY3R9IGxp6KaB57SgXHJcblx0XHQgKiBAcGFyYW0ge09iamVjdH0g44Kq44OX44K344On44OzXHJcblx0XHQjIyNcclxuXHRcdGNvbnN0cnVjdG9yOiAoXyRlbCAsIF9vcHRpb25zKSAtPlxyXG5cclxuXHRcdFx0IyDliJ3mnJ/lgKRcclxuXHRcdFx0b3B0aW9ucyA9IHtcclxuXHRcdFx0XHQjIOW/hemgiFxyXG5cdFx0XHRcdGltYWdlOiAnJyAgICAgICAgICAjIOaVsOWtl+OBrueUu+WDj1xyXG5cdFx0XHRcdHdpZHRoOiAxMCAgICAgICAgICAjIOW5hVxyXG5cdFx0XHRcdGhlaWdodDogMjAgICAgICAgICAjIOmrmOOBlVxyXG5cclxuXHRcdFx0XHQjIOOCquODl+OCt+ODp+ODs1xyXG5cdFx0XHRcdGRlbGF5OiAwICAgICAgICAgICAjIOOCouODi+ODoeODvOOCt+ODp+ODs+mWi+Wni+OBruaZgumWk+W3rlxyXG5cdFx0XHRcdGVhc2luZzogJ3N3aW5nJyAgICAjIOOCpOODvOOCuOODs+OCsFxyXG5cdFx0XHRcdHNwZWVkOiAyMDAgICAgICAgICAjIOOCouODi+ODoeODvOOCt+ODp+ODs+mAn+W6plxyXG5cdFx0XHRcdGJhY2tncm91bmQ6ICcjRkZGJyAjIOiDjOaZr+iJslxyXG5cdFx0XHRcdGlzVmVsb2NpdHk6IGZhbHNlICAjIFZlbG9jaXR5LmpzIOOCkuS9v+eUqOOBmeOCi+OBi1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQjIOOCquODl+OCt+ODp+ODs+OCkuODnuODvOOCuFxyXG5cdFx0XHRAb3B0aW9ucyA9ICQuZXh0ZW5kKG9wdGlvbnMsIF9vcHRpb25zKVxyXG5cdFx0XHRcclxuXHRcdFx0IyDjgqLjg4vjg6Hjg7zjgrfjg6fjg7PjgZXjgZvjgotkaXbopoHntKDjgpLkvZzjgaPjgabphY3nva7jgZnjgotcclxuXHRcdFx0QCRlbCA9IF8kZWxcclxuXHRcdFx0QCRkaXYgPSAkKCc8ZGl2PicpXHJcblx0XHRcdF8kZWwuYXBwZW5kIEAkZGl2XHJcblxyXG5cdFx0XHRcclxuXHRcdFx0IyBsaeimgee0oOOBruOCueOCv+OCpOODq1xyXG5cdFx0XHRAJGVsLmNzc1xyXG5cdFx0XHRcdHBvc2l0aW9uOiAncmVsYXRpdmUnXHJcblx0XHRcdFx0ZGlzcGxheTogJ2Jsb2NrJ1xyXG5cdFx0XHRcdGZsb2F0OiAnbGVmdCdcclxuXHRcdFx0XHR3aWR0aDogQG9wdGlvbnMud2lkdGhcclxuXHRcdFx0XHRoZWlnaHQ6IEBvcHRpb25zLmhlaWdodFxyXG5cdFx0XHRcdG92ZXJmbG93OiAnaGlkZGVuJ1xyXG5cdFx0XHRcdCdiYWNrZ3JvdW5kLWNvbG9yJzogQG9wdGlvbnMuYmFja2dyb3VuZFxyXG5cclxuXHJcblx0XHRcdCMgZGl26KaB57Sg44Gu44K544K/44Kk44OrXHJcblx0XHRcdEAkZGl2LmNzc1xyXG5cdFx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnXHJcblx0XHRcdFx0d2lkdGg6IEBvcHRpb25zLndpZHRoXHJcblx0XHRcdFx0aGVpZ2h0OiBAb3B0aW9ucy5oZWlnaHQgKiAyICogMTBcclxuXHJcblx0XHRcdFx0IyDnlLvlg4/jga7jg5HjgrnjgpLog4zmma/nlLvlg4/jgavoqK3lrppcclxuXHRcdFx0XHQnYmFja2dyb3VuZC1pbWFnZSc6ICd1cmwoJyArIEBvcHRpb25zLmltYWdlICsgJyknXHJcblx0XHRcdFx0J2JhY2tncm91bmQtcmVwZWF0JzogJ3JlcGVhdC15J1xyXG5cclxuXHRcdFx0XHJcblx0XHRcclxuXHRcdCMjIypcclxuXHRcdCAqIOOCouODi+ODoeODvOOCt+ODp+ODs+OBleOBm+OBmuOBq+ihqOekuuOCkuWIh+OCiuabv+OBiOOCi1xyXG5cdFx0ICogQHBhcmFtIHtOdW1iZXJ9IF9udW1cclxuXHRcdCMjI1xyXG5cdFx0c2V0OiAoX251bSkgLT5cclxuXHJcblx0XHRcdEAkZGl2LmNzc1xyXG5cdFx0XHRcdCd0b3AnOiAtKDkgLSBfbnVtKSAqIEBvcHRpb25zLmhlaWdodFxyXG5cdFx0XHRAdG1wID0gX251bVxyXG5cclxuXHRcdFx0cmV0dXJuXHJcblx0XHRcdFxyXG5cdFx0XHJcblx0XHQjIyMqXHJcblx0XHQgKiDjgqLjg4vjg6Hjg7zjgrfjg6fjg7PjgZXjgZvjgabooajnpLrjgpLliIfjgormm7/jgYjjgotcclxuXHRcdCAqIEBwYXJhbSB7TnVtYmVyfSBfbnVtXHJcblx0XHQjIyNcclxuXHRcdGFuaW1hdGU6IChfbnVtKSAtPlxyXG5cclxuXHRcdFx0bnVtID0gX251bVxyXG5cclxuXHRcdFx0IyDjgqLjg4vjg6Hjg7zjgrfjg6fjg7Pjga7mmYLplpPlt65cdFx0XHRcclxuXHRcdFx0ZGVsYXkgPSBAb3B0aW9ucy5kZWxheSAqIChAb3B0aW9ucy50b3RhbCAtIEBvcHRpb25zLnNlcmlhbClcclxuXHRcdFx0XHJcblx0XHRcdCMg44Kk44O844K444Oz44KwXHJcblx0XHRcdGVhc2luZyA9IEBvcHRpb25zLmVhc2luZ1xyXG5cclxuXHRcdFx0IyDnp7vli5Xnm67mqJnjgYznj77lnKjjgojjgorlsI/jgZXjgYTmlbDlrZfjga7loLTlkIjjga/pgIblm57ou6LjgavjgarjgaPjgabjgZfjgb7jgYbjga7jgafjgIHnm67mqJnjgpLkuIrmrrXjga7mlbDlrZfjgavoo5zmraPjgZnjgotcclxuXHRcdFx0IyB0YXJnZXQgPSBpZiBudW0gaXNudCAwIGFuZCBudW0gPCBAdG1wIHRoZW4gLSg5IC0gbnVtKSBlbHNlIC0oKDkgLSAgbnVtKSArIDEwKVxyXG5cdFx0XHR0YXJnZXQgPSBpZiBudW0gPCBAdG1wIHRoZW4gLSg5IC0gbnVtKSBlbHNlIC0oKDkgLSAgbnVtKSArIDEwKVxyXG5cclxuXHRcdFx0IyDnm67mqJnkvY3nva7jgavlv5zjgZjjgabnp7vli5XpgJ/luqbjgpLlpInljJbjgZXjgZvjgosg56e75YuV6Led6Zui44Gv5b+F44Ga5Yqg566X44Gu5pa55ZCR44Gr44Gq44KL44KI44GG6KOc5q2j44GZ44KLXHJcblx0XHRcdGR1cmF0aW9uID0gaWYgbnVtIDwgQHRtcCB0aGVuICgxMCAtIChAdG1wIC0gbnVtKSkgKiBAb3B0aW9ucy5zcGVlZCBlbHNlIChudW0gLSBAdG1wKSAqIEBvcHRpb25zLnNwZWVkXHJcblxyXG5cdFx0XHQjIOWJjeWbnuihqOekuuaZguOBqOaVsOWApOOBjOWkieOCj+OBo+OBpuOBhOOBn+OCieihqOekuuOCkuOCouODi+ODoeODvOOCt+ODp+ODs+OBp+WIh+OCiuabv+OBiOOCi1x0XHRcdFxyXG5cdFx0XHRpZihAdG1wIGlzbnQgbnVtKVxyXG5cclxuXHRcdFx0XHQjIFZlbG9jaXR5LmpzIOOCkuS9v+eUqOOBmeOCi+WgtOWQiOOBruOCouODi+ODoeODvOOCt+ODp+ODs+OBrlxyXG5cdFx0XHRcdGlmIEBvcHRpb25zLmlzVmVsb2NpdHlcclxuXHRcdFx0XHRcdEAkZGl2XHJcblx0XHRcdFx0XHRcdC52ZWxvY2l0eSgnc3RvcCcpXHJcblx0XHRcdFx0XHRcdC5zdG9wKClcclxuXHRcdFx0XHRcdFx0LmNzc1xyXG5cdFx0XHRcdFx0XHRcdCd0b3AnOiAtICgoOSAtIEB0bXApICsgMTApICogQG9wdGlvbnMuaGVpZ2h044CAIyDooajnpLrkvY3nva7jgpLkuIvmrrXjga7mlbDlrZfjgavoo5zmraPjgZnjgotcclxuXHRcdFx0XHRcdFx0LnZlbG9jaXR5KFxyXG5cdFx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHRcdHRvcDogdGFyZ2V0ICogQG9wdGlvbnMuaGVpZ2h0XHJcblx0XHRcdFx0XHRcdFx0fSwgXHJcblx0XHRcdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRcdFx0ZHVyYXRpb246IGR1cmF0aW9uXHJcblx0XHRcdFx0XHRcdFx0XHRkZWxheTogZGVsYXlcclxuXHRcdFx0XHRcdFx0XHRcdGVhc2luZzogZWFzaW5nXHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHQpXHJcblxyXG5cdFx0XHRcdCMgVmVsb2NpdHkuanMg44KS5L2/55So44GX44Gq44GE5aC05ZCI44GvIGpRdWVyeS5hbmltYXRlIOOBp+OCouODi+ODoeODvOOCt+ODp+ODs1xyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdEAkZGl2XHJcblx0XHRcdFx0XHRcdC5zdG9wKClcclxuXHRcdFx0XHRcdFx0LmNzc1xyXG5cdFx0XHRcdFx0XHRcdCd0b3AnOiAtICgoOSAtIEB0bXApICsgMTApICogQG9wdGlvbnMuaGVpZ2h044CAIyDooajnpLrkvY3nva7jgpLkuIvmrrXjga7mlbDlrZfjgavoo5zmraPjgZnjgotcclxuXHRcdFx0XHRcdFx0LmFuaW1hdGUoXHJcblx0XHRcdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRcdFx0dG9wOiB0YXJnZXQgKiBAb3B0aW9ucy5oZWlnaHRcclxuXHRcdFx0XHRcdFx0XHR9LCBcclxuXHRcdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0XHRkdXJhdGlvbjogZHVyYXRpb25cclxuXHRcdFx0XHRcdFx0XHRcdGRlbGF5OiBkZWxheVxyXG5cdFx0XHRcdFx0XHRcdFx0ZWFzaW5nOiBlYXNpbmdcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdClcclxuXHJcblxyXG5cdFx0XHRcdCMg6KGo56S644GX44Gf5pWw5YCk44KS5L+d5oyB44GX44Gm44GK44GPXHJcblx0XHRcdFx0QHRtcCA9IF9udW1cclxuXHRcdFx0cmV0dXJuXHJcblxyXG5cdCMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHQjIFNsaWRlQ291bnRlclxyXG5cdCMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblx0IyMjKlxyXG5cdCAqIFNsaWRlQ291bnRlclxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBfb3B0aW9ucyBcclxuXHQgKiBcclxuXHQjIyNcclxuXHQkLmZuLlNsaWRlQ291bnRlciA9IChfb3B0aW9ucykgLT5cclxuXHJcblx0XHRpZiAhX29wdGlvbnMuaW1hZ2U/XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcignaW1hZ2UgaXMgcmVxdWlyZWQuJylcclxuXHRcdGlmICFfb3B0aW9ucy53aWR0aD9cclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCd3aWR0aCBpcyByZXF1aXJlZC4nKVxyXG5cdFx0aWYgIV9vcHRpb25zLmhlaWdodD9cclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdoZWlnaHQgaXMgcmVxdWlyZWQuJylcclxuXHJcblx0XHQjIFZlbG9jaXR5LmpzIOOBjOWtmOWcqOOBmeOCjOOBsHRydWVcclxuXHRcdGlzVmVsb2NpdHkgPSAkLmZuLnZlbG9jaXR5P1xyXG5cdFx0Y29uc29sZS5sb2cgXCJpc1ZlbG9jaXR5IDogXCIgKyBpc1ZlbG9jaXR5XHJcblxyXG5cdFx0IyDjgqvjgqbjg7Pjgr/jg7xcclxuXHRcdCRjb3VudGVyID0gdGhpc1xyXG5cclxuXHRcdCMg44Kr44Km44Oz44K/44O844Gu5Z+65pys44K544K/44Kk44OrXHJcblx0XHQkY291bnRlci5jc3NcclxuXHRcdFx0cG9zaXRpb246ICdyZWxhdGl2ZSdcclxuXHRcdFx0ZGlzcGxheTogJ2Jsb2NrJ1xyXG5cdFx0XHRvdmVyZmxvdzogJ2hpZGRlbidcclxuXHRcdFx0bWFyZ2luOiAwXHJcblx0XHRcdHBhZGRpbmc6IDBcclxuXHRcdFx0J2xpc3Qtc3R5bGUtdHlwZSc6ICdub25lJ1xyXG5cclxuXHRcdCMg5ZCE5qGB44Gr5YiG6Kej44GX44Gf5pWw5YCk44GM5YWl44KL6YWN5YiXXHJcblx0XHRudW1MaXN0ID0gW11cclxuXHJcblx0XHQjIOWQhOOCq+OCpuODs+OCv+ODvOOCpOODs+OCueOCv+ODs+OCueOBjOWFpeOCi+mFjeWIl1xyXG5cdFx0cGFydExpc3QgPSBbXVxyXG5cclxuXHRcdCMgbGnopoHntKBcclxuXHRcdCRsaSA9ICRjb3VudGVyLmZpbmQoJ2xpJylcclxuXHJcblx0XHQjIGxp6KaB57Sg44Gu5pWwXHJcblx0XHRzaXplID0gJGxpLnNpemUoKVxyXG5cclxuXHRcdCMgbGnopoHntKDjga7mlbDjgaDjgZHnubDjgorov5TjgZlcclxuXHRcdGZvciBpIGluIFswLi5zaXplIC0gMV1cclxuXHRcdFx0bGkgPSAkbGkuZXEoaSlcclxuXHRcdFx0XHJcblx0XHRcdCMg5L2V55Wq55uu44GubGnopoHntKDjgYtcclxuXHRcdFx0X29wdGlvbnMuc2VyaWFsID0gaVxyXG5cclxuXHRcdFx0IyBsaeimgee0oOOBruaVsFxyXG5cdFx0XHRfb3B0aW9ucy50b3RhbCA9IHNpemVcclxuXHJcblx0XHRcdCMgdmVsb2NpdHkuanPjgpLkvb/nlKjjgZfjgabjgYTjgovjgYtcclxuXHRcdFx0X29wdGlvbnMuaXNWZWxvY2l0eSA9IGlzVmVsb2NpdHlcclxuXHRcdFx0XHJcblx0XHRcdCMgU2xpZGVDb3VudGVyUGFydCDjgqTjg7Pjgrnjgr/jg7PjgrnjgpLkvZzjgotcclxuXHRcdFx0cGFydExpc3RbaV0gPSBuZXcgU2xpZGVDb3VudGVyUGFydChsaSwgX29wdGlvbnMpXHJcblxyXG5cdFx0XHQjIOWPs+err+OBrmxp6KaB57Sg5Lul5aSW44GrIG1hcmdpbi1yaWdodCDjgpLpgannlKhcclxuXHRcdFx0bWFyZ2luID0gaWYoaSBpcyBzaXplIC0gMSkgdGhlbiAwIGVsc2UgX29wdGlvbnMubWFyZ2luXHJcblx0XHRcdGxpLmNzc1xyXG5cdFx0XHRcdCdtYXJnaW4tcmlnaHQnOiBtYXJnaW5cclxuXHJcblx0XHQjIOihqOekuuWPr+iDveacgOWkp+WApCDvvIhsaeimgee0oOOBjDTjgaQg4oaSIDTjgrHjgr8g4oaSIDk5OTnvvIlcclxuXHRcdG1heCA9IE1hdGgucG93KDEwLCBzaXplKSAtIDFcclxuXHJcblxyXG5cdFx0IyMjKlxyXG5cdFx0ICog44Kr44Km44Oz44K/44O844Gu6KGo56S644KS5aSJ5pu044GZ44KLXHJcblx0XHQgKiBAcGFyYW0ge051bWJlcn0gX251bWJlciAgIOihqOekuuOBmeOCi+aVsOWApFxyXG5cdFx0ICogQHBhcmFtIHtCb29sZWFufSBfYW5pbWF0ZSDjgqLjg4vjg6Hjg7zjgrfjg6fjg7PjgZXjgZvjgovjgarjgol0cnVlXHJcblx0XHQjIyNcclxuXHRcdCRjb3VudGVyLnNldCA9IChfbnVtYmVyICwgX2FuaW1hdGUgPSBmYWxzZSkgLT5cclxuXHRcdFx0Y29uc29sZS5sb2cgX251bWJlclxyXG5cdFx0XHRcclxuXHRcdFx0XHJcblx0XHRcdCMg5pyA5aSn5YCk44KS6LaF44GI44Gq44GE44KI44GG6KOc5q2jXHJcblx0XHRcdGlmIF9udW1iZXIgPiBtYXhcclxuXHRcdFx0XHRfbnVtYmVyID0gbWF4XHJcblxyXG5cdFx0XHQjIOOCvOODreODkeODh+OCo+ODs+OCsFxyXG5cdFx0XHRudW0gPSB6ZXJvUGFkZGluZyhfbnVtYmVyLCBzaXplKVxyXG5cclxuXHRcdFx0IyDmlbDlgKTjgpLlkITmoYHjgavliIbop6PjgZnjgotcclxuXHRcdFx0bnVtTGlzdCA9IFtdXHJcblx0XHRcdGZvciB2YWx1ZSwgaSBpbiBwYXJ0TGlzdFxyXG5cdFx0XHRcdCMg77yIK++8ieOBp+aVsOWApOOBq+WkieaPm+OBl+OBpOOBpOmFjeWIl+OBq+agvOe0jVxyXG5cdFx0XHRcdG51bUxpc3RbaV0gPSArbnVtLnN1YnN0cihpLDEpXHJcblxyXG5cdFx0XHQjIOOCouODi+ODoeODvOOCt+ODp+ODs+OBleOBm+OBmuOBq+ihqOekuuOCkuWkieabtOOBmeOCi1xyXG5cdFx0XHRpZiAhX2FuaW1hdGVcclxuXHRcdFx0XHRmb3IgdmFsdWUsIGkgaW4gcGFydExpc3RcclxuXHRcdFx0XHRcdHZhbHVlLnNldChudW1MaXN0W2ldKVxyXG5cclxuXHRcdFx0IyDjgqLjg4vjg6Hjg7zjgrfjg6fjg7PjgZXjgZvjgabooajnpLrjgpLlpInmm7TjgZnjgotcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGZvciB2YWx1ZSwgaSBpbiBwYXJ0TGlzdFxyXG5cdFx0XHRcdFx0dmFsdWUuYW5pbWF0ZShudW1MaXN0W2ldKVxyXG5cdFx0XHRcclxuXHRcdFx0cmV0dXJuXHJcblxyXG5cclxuXHRcdCMjIypcclxuXHRcdCAqIOOCvOODreODkeODh+OCo+ODs+OCsCBcclxuXHRcdCAqIEBwYXJhbSB7TnVtYmVyfSBfbnVtIOaVsOWApFxyXG5cdFx0ICogQHByYXJhbSB7TnVtYmVyfSBfbGVuZ3RoIOahgeaVsFxyXG5cdFx0ICogQHJldHVybiB7U3RyaW5nfSDmjIflrprjga7moYHmlbDjgavotrPjgorjgarjgYTliIbjga8w44Gn5Z+L44KB44Gf5paH5a2X5YiXXHJcblx0XHQjIyNcclxuXHRcdHplcm9QYWRkaW5nID0gKF9udW0sIF9sZW5ndGgpIC0+XHJcblx0XHRcdHJldHVybiAoQXJyYXkoX2xlbmd0aCkuam9pbignMCcpICsgX251bSkuc2xpY2UoLV9sZW5ndGgpXHJcblxyXG5cdFx0cmV0dXJuIHRoaXNcclxuXHJcblxyXG5cdHJldHVybiJdfQ==
