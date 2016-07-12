'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Cards = function () {
  function Cards() {
    _classCallCheck(this, Cards);

    this.cards = Array.from(document.querySelectorAll('.card'));

    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.update = this.update.bind(this);
    this.targetBCR = null;
    this.target = null;
    this.startX = 0;
    this.currentX = 0;
    this.screenX = 0;
    this.targetX = 0;
    this.draggingCard = false;

    this.addEventListeners();

    requestAnimationFrame(this.update);
  }

  _createClass(Cards, [{
    key: 'addEventListeners',
    value: function addEventListeners() {
      document.addEventListener('touchstart', this.onStart);
      document.addEventListener('touchmove', this.onMove);
      document.addEventListener('touchend', this.onEnd);

      document.addEventListener('mousedown', this.onStart);
      document.addEventListener('mousemove', this.onMove);
      document.addEventListener('mouseup', this.onEnd);
    }
  }, {
    key: 'onStart',
    value: function onStart(evt) {
      if (this.target) return;

      if (evt.target.classList.contains('card')) {
        this.target = evt.target;
      } else if (evt.target.parentNode.classList.contains('card')) {
        this.target = evt.target.parentNode;
      } else {
        console("Not card or child of card");
        return;
      }

      this.targetBCR = this.target.getBoundingClientRect();

      this.startX = evt.pageX || evt.touches[0].pageX;
      this.currentX = this.startX;

      this.draggingCard = true;
      this.target.style.willChange = 'transform';

      evt.preventDefault();
    }
  }, {
    key: 'onMove',
    value: function onMove(evt) {
      if (!this.target) return;

      this.currentX = evt.pageX || evt.touches[0].pageX;
    }
  }, {
    key: 'onEnd',
    value: function onEnd(evt) {
      if (!this.target) return;

      this.targetX = 0;
      var screenX = this.currentX - this.startX;
      var threshold = this.targetBCR.width * 0.35;
      if (Math.abs(screenX) > threshold) {
        this.targetX = screenX > 0 ? this.targetBCR.width : -this.targetBCR.width;
      }

      this.draggingCard = false;
    }
  }, {
    key: 'update',
    value: function update() {

      requestAnimationFrame(this.update);

      if (!this.target) return;

      if (this.draggingCard) {
        if (this.currentX > this.startX) this.target.getElementsByClassName("car-status")[0].innerText = "Liked";else this.target.getElementsByClassName("car-status")[0].innerText = "DisLiked";
        this.screenX = this.currentX - this.startX;
      } else {
        this.screenX += (this.targetX - this.screenX) / 4;
      }

      var normalizedDragDistance = Math.abs(this.screenX) / this.targetBCR.width;
      var opacity = 1 - Math.pow(normalizedDragDistance, 3);

      this.target.style.transform = 'translateX(' + this.screenX + 'px)';
      this.target.style.opacity = opacity;

      // User has finished dragging.
      if (this.draggingCard) return;

      var isNearlyAtStart = Math.abs(this.screenX) < 0.1;
      var isNearlyInvisible = opacity < 0.01;

      // If the card is nearly gone.
      if (isNearlyInvisible) {

        // Bail if there's no target or it's not attached to a parent anymore.
        if (!this.target || !this.target.parentNode) return;

        this.target.parentNode.removeChild(this.target);

        var targetIndex = this.cards.indexOf(this.target);
        this.cards.splice(targetIndex, 1);

        // Slide all the other cards.
        this.animateOtherCardsIntoPosition(targetIndex);
      } else if (isNearlyAtStart) {
        this.target.getElementsByClassName("car-status")[0].innerText = "";
        this.resetTarget();
      }
    }
  }, {
    key: 'animateOtherCardsIntoPosition',
    value: function animateOtherCardsIntoPosition(startIndex) {
      var _this = this;

      // Remove the target.
      if (startIndex === this.cards.length) {
        this.resetTarget();
        return;
      }

      var onAnimationComplete = function onAnimationComplete(evt) {
        var card = evt.target;
        card.removeEventListener('transitionend', onAnimationComplete);

        _this.resetTarget();
      };
    }
  }, {
    key: 'resetTarget',
    value: function resetTarget() {
      if (!this.target) return;

      this.target.style.willChange = 'initial';
      this.target.style.transform = 'none';
      this.target = null;
    }
  }]);

  return Cards;
}();

window.addEventListener('load', function () {
  return new Cards();
});