/* global gemini */
var renderStory = require('./utils').renderStory;

gemini.suite('Simple ToastView', suite => {
  suite
    .before(renderStory('ToastView', 'simple toast'))
    .setCaptureElements(['[class^="Toast-module-root"]'])
    .capture('simple');
});

gemini.suite('ToastView With Action', suite => {
  suite
    .before(renderStory('ToastView', 'with action'))
    .setCaptureElements(['[class^="Toast-module-root"]'])
    .capture('with action');
});