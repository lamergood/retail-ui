import React from 'react';

import { DefaultizeProps } from '../lib/utils';

import { ComponentTable, StatePropsCombinations, StateType } from './ComponentTable';

type ComponentCombinatorInterface<C, P, S> = {
  combinations: Array<StatePropsCombinations<P, S>>;
  Component: C;
};

export type ComponentCombinatorProps<C, P, S> = ComponentCombinatorInterface<C, P, S> & DefaultProps<C, P, S>;

type DefaultProps<C = any, P = any, S = any> = {
  presetProps: DefaultizeProps<C, P>;
  presetState: Partial<S>;
};

type ComponentCombinatorComponentProps<C, P, S> = ComponentCombinatorProps<C, P, S> & DefaultProps<C, P, S>;

export class ComponentCombinator<
  T extends React.Component<any, any, any>,
  C extends React.ComponentType<any>,
  P extends React.ComponentProps<C>,
> extends React.Component<
  ComponentCombinatorComponentProps<
    C extends React.ComponentClass<P, any> ? React.ClassType<P, T, C> : C,
    P,
    StateType<C>
  >,
  { page: number }
> {
  public static defaultProps: DefaultProps = {
    presetProps: {},
    presetState: {},
  };

  public state = {
    page: 0,
  };

  public render() {
    const { page } = this.state;
    const { combinations, Component, presetProps, presetState } = this.props;
    const pages = [];
    let row = 0;
    const sizes = combinations.map((c) => c.length);
    const flatCombinations = ([] as typeof combinations[0]).concat(...combinations);

    for (let j = 0; j < sizes.length - 1; j++) {
      pages.push({
        offsetX: row,
        offsetY: (row += sizes[j]),
      });
    }

    const pageOffsets = pages[page];
    return (
      <div>
        <div id="paginator" style={{ marginBottom: 5 }}>
          <button disabled={page === 0} id="prev-page" onClick={this.prevPage}>
            Prev
          </button>{' '}
          <small>{`${page + 1} / ${pages.length}`}</small>{' '}
          <button disabled={page + 1 >= pages.length} id="next-page" onClick={this.nextPage}>
            Next
          </button>
        </div>
        <div>
          {pageOffsets && (
            <ComponentTable
              key={page}
              Component={Component}
              presetProps={presetProps}
              presetState={presetState}
              rows={flatCombinations.slice(pageOffsets.offsetY, flatCombinations.length)}
              cols={flatCombinations.slice(pageOffsets.offsetX, pageOffsets.offsetY)}
            />
          )}
        </div>
      </div>
    );
  }

  private prevPage = () => {
    this.setState(({ page }) => ({
      page: page - 1,
    }));
  };

  private nextPage = () => {
    this.setState(({ page }) => ({
      page: page + 1,
    }));
  };
}
