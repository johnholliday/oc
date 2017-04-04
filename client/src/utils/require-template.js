'use strict';

var format = require('stringformat');
var path = require('path');
var _ = require('underscore');

var templateNotFound = 'Error requiring oc-template: "{0}" not found';
var templateNotValid = 'Error requiring oc-template: "{0}" is not a valid oc-template';

function isValidTemplate(template){
  if (typeof template !== 'object') {
    return false;
  }

  var apiMethods = _.keys(template);
  if (apiMethods.length !== 4) {
    return false;
  }

  return _.contains(
    apiMethods,
    'getInfo',
    'getCompiledTemplate',
    'compile',
    'render'
  );
}


module.exports = function(template) {
  var ocTemplate;
  var localTemplate = path.join(__dirname, '../../', 'node_modules', template);
  var relativeTemplate = path.resolve('.', 'node_modules', template);
  
  try {
    if (require.cache && !!require.cache[localTemplate]) {
      delete require.cache[localTemplate];
    }
    ocTemplate = require(localTemplate);
  } catch(err) {
    try {
      if (require.cache && !!require.cache[relativeTemplate]) {
        delete require.cache[relativeTemplate];
      }
      ocTemplate = require(relativeTemplate);
    } catch (err) {
      throw format(templateNotFound, template);
    }
  }

  if (!isValidTemplate(ocTemplate)) {
    throw format(templateNotValid, template);
  }

  return ocTemplate;
};
