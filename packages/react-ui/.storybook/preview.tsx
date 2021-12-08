import React from 'react';
import { Meta } from '@storybook/react';
import { isTestEnv } from '../lib/currentEnvironment';
import { ThemeContext } from '../lib/theming/ThemeContext';

import { FLAT_THEME_OLD } from '../lib/theming/themes/FlatThemeOld';
import { FLAT_THEME } from '../lib/theming/themes/FlatTheme';
import { DEFAULT_THEME_OLD } from '../lib/theming/themes/DefaultThemeOld';
import { DEFAULT_THEME } from '../lib/theming/themes/DefaultTheme';

const themes = { DEFAULT_THEME, FLAT_THEME, DEFAULT_THEME_OLD, FLAT_THEME_OLD };

export const decorators: Meta['decorators'] = [
  (Story, context) => {
    const theme = themes[context.globals.theme] || DEFAULT_THEME;
    if (theme !== DEFAULT_THEME) {
      return (
        <ThemeContext.Provider value={theme}>
          <Story />
        </ThemeContext.Provider>
      );
    }
    return <Story />;
  },
  (Story) => (
    <div id="test-element" style={{ display: 'inline-block', padding: 4 }}>
      <Story />
    </div>
  ),
];

export const parameters: Meta['parameters'] = {
  creevey: {
    captureElement: '#test-element',
    skip: [
      {
        in: ['chromeFlat', 'firefoxFlat', 'ie11Flat', 'chromeFlat8px', 'firefoxFlat8px', 'ie11Flat8px'],
        kinds: /^(?!\bButton\b|\bCheckbox\b|\bInput\b|\bRadio\b|\bTextarea\b|\bToggle\b|\bSwitcher\b|\bTokenInput\b)/,
      },
    ],
  },
  options: {
    storySort: (a, b) => (a[1].kind === b[1].kind ? 0 : a[1].id.localeCompare(b[1].id, undefined, { numeric: true })),
  },
};

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'React UI Theme',
    defaultValue: 'DEFAULT_THEME',
    toolbar: {
      icon: 'paintbrush',
      items: Object.keys(themes),
      showName: true,
    },
  },
};

if (isTestEnv) {
  import('../lib/styles/HoldSelectionColor');
}
