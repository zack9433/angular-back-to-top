'use strict';

angular.module('zkBackToTop', [])
  .service('ZkEasingFactory', function() {

    /* https://gist.github.com/markgoodyear/9496715
     *
     * Easing Functions - inspired from http://gizma.com/easing/
     * only considering the t value for the range [0, 1] => [0, 1]
     */
    return {
        // no easing, no acceleration
        linear: function(t) {
          return t;
        },
        // accelerating from zero velocity
        easeInQuad: function(t) {
          return t * t;
        },
        // decelerating to zero velocity
        easeOutQuad: function(t) {
          return t * (2 - t);
        },
        // acceleration until halfway, then deceleration
        easeInOutQuad: function(t) {
          return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        },
        // accelerating from zero velocity
        easeInCubic: function(t) {
          return t * t * t;
        },
        // decelerating to zero velocity
        easeOutCubic: function(t) {
          return (--t) * t * t + 1;
        },
        // acceleration until halfway, then deceleration
        easeInOutCubic: function(t) {
          return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        },
        // accelerating from zero velocity
        easeInQuart: function(t) {
          return t * t * t * t;
        },
        // decelerating to zero velocity
        easeOutQuart: function(t) {
          return 1 - (--t) * t * t * t;
        },
        // acceleration until halfway, then deceleration
        easeInOutQuart: function(t) {
          return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
        },
        // accelerating from zero velocity
        easeInQuint: function(t) {
          return t * t * t * t * t;
        },
        // decelerating to zero velocity
        easeOutQuint: function(t) {
          return 1 + (--t) * t * t * t * t;
        },
        // acceleration until halfway, then deceleration
        easeInOutQuint: function(t) {
          return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
        }
    };
  })
  .directive('zkBackToTop', function(ZkEasingFactory, $document) {
    return {
      restrict: 'EA',
      template: '<div class="zk-back-to-top hide">' +
                  '<div class="zk-back-to-top__btn">' +
                    '<div class="zk-back-to-top__btn--head"></div>' +
                    '<div class="zk-back-to-top__btn--tail"></div>' +
                  '</div>' +
                '</div>',
      scope: {
        triggerElemId: '@'
      },
      replace: true,
      link: function postLink(scope, element, attrs) {

        var triggerElement = angular.element($document.find('#' + scope.triggerElemId));

        var scrollTo = function(Y, duration, easingFunction, callback) {

          var start = Date.now(),
              from = triggerElement[0].scrollTop;

          if (from === Y) {
            if (angular.isFunction(callback)) {
              callback();
            }
            return; /* Prevent scrolling to the Y point if already there */
          }

          function min(a, b) {
            return a < b ? a : b;
          }

          function scroll(timestamp) {

            var currentTime = Date.now(),
                time = min(1, ((currentTime - start) / duration)),
                easedT = easingFunction(time);

            triggerElement[0].scrollTop = (easedT * (Y - from)) + from;

            if (time < 1) {
              requestAnimationFrame(scroll);
            } else {
              if (angular.isFunction(callback)) {
                callback();
              }
            }
          }

          requestAnimationFrame(scroll);
        };

        triggerElement
          .on('scroll', function() {

            var pos = triggerElement[0].scrollTop;

            if (pos > 100) {
              if (element.hasClass('hide')) {
                element.removeClass('hide');
              }
            } else {
              if (! element.hasClass('hide')) {
                element.addClass('hide');
              }
            }
          });

          element.on('click', function() {
            scrollTo(0, 500, ZkEasingFactory.easeInQuad);
          });
      }
    };
  });
