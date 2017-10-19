/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule CSSPropertyOperations
 */

'use strict';

var dangerousStyleValue = require('dangerousStyleValue');

if (__DEV__) {
  var hyphenateStyleName = require('fbjs/lib/hyphenateStyleName');
  var warnValidStyle = require('warnValidStyle');
}

/**
 * Operations for dealing with CSS properties.
 */
var CSSPropertyOperations = {
  /**
   * This creates a string that is expected to be equivalent to the style
   * attribute generated by server-side rendering. It by-passes warnings and
   * security checks so it's not safe to use this value for anything other than
   * comparison. It is only used in DEV for SSR validation.
   */
  createDangerousStringForStyles: function(styles) {
    if (__DEV__) {
      var serialized = '';
      var delimiter = '';
      for (var styleName in styles) {
        if (!styles.hasOwnProperty(styleName)) {
          continue;
        }
        var styleValue = styles[styleName];
        if (styleValue != null) {
          var isCustomProperty = styleName.indexOf('--') === 0;
          serialized += delimiter + hyphenateStyleName(styleName) + ':';
          serialized += dangerousStyleValue(
            styleName,
            styleValue,
            isCustomProperty,
          );

          delimiter = ';';
        }
      }
      return serialized || null;
    }
  },

  /**
   * Sets the value for multiple styles on a node.  If a value is specified as
   * '' (empty string), the corresponding style property will be unset.
   *
   * @param {DOMElement} node
   * @param {object} styles
   */
  setValueForStyles: function(node, styles, getStack) {
    var style = node.style;
    for (var styleName in styles) {
      if (!styles.hasOwnProperty(styleName)) {
        continue;
      }
      var isCustomProperty = styleName.indexOf('--') === 0;
      if (__DEV__) {
        if (!isCustomProperty) {
          warnValidStyle(styleName, styles[styleName], getStack);
        }
      }
      var styleValue = dangerousStyleValue(
        styleName,
        styles[styleName],
        isCustomProperty,
      );
      if (styleName === 'float') {
        styleName = 'cssFloat';
      }
      if (isCustomProperty) {
        style.setProperty(styleName, styleValue);
      } else {
        style[styleName] = styleValue;
      }
    }
  },
};

module.exports = CSSPropertyOperations;
