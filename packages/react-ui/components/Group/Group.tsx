import React from 'react';
import PropTypes from 'prop-types';

import { isIE11, isEdge } from '../../lib/client';
import { CORNERS } from '../Button/constant';
import { Nullable } from '../../typings/utility-types';
import { isButton } from '../Button';
import { CommonWrapper, CommonProps } from '../../internal/CommonWrapper';
import { cx } from '../../lib/theming/Emotion';
import { rootNode, TSetRootNode } from '../../lib/rootNode';

import { styles } from './Group.styles';

export interface GroupProps extends CommonProps {
  width?: React.CSSProperties['width'];
}

interface GroupChildProps {
  width?: React.CSSProperties['width'];
  corners?: number;
}

const changeCornersIfButton = (child: React.ReactNode, buttonCorners: number) => {
  if (isButton(child)) {
    return React.cloneElement(child, { corners: buttonCorners });
  }

  return child;
};

@rootNode
export class Group extends React.Component<GroupProps> {
  public static __KONTUR_REACT_UI__ = 'Group';
  private setRootNode!: TSetRootNode;

  public static propTypes = {
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  };

  public render() {
    const style: React.CSSProperties = {
      width: this.props.width,
    };

    let first: Nullable<React.ReactElement<any>> = null;
    let last: Nullable<React.ReactElement<any>> = null;

    React.Children.forEach(this.props.children, (child) => {
      if (child && React.isValidElement(child)) {
        first = first || child;
        last = child;
      }
    });

    return (
      <CommonWrapper rootNodeRef={this.setRootNode} {...this.props}>
        <span className={styles.root()} style={style}>
          {React.Children.map(this.props.children, (child) => {
            if (!child || !React.isValidElement<GroupChildProps>(child)) {
              return null;
            }

            const isWidthInPercent = Boolean(child.props.width && child.props.width.toString().includes('%'));
            const itemCss = cx({
              [styles.item()]: true,
              [styles.itemFirst()]: child === first,
            });

            let buttonCorners = 0;
            if (child !== first) {
              buttonCorners |= CORNERS.TOP_LEFT | CORNERS.BOTTOM_LEFT;
            }
            if (child !== last) {
              buttonCorners |= CORNERS.TOP_RIGHT | CORNERS.BOTTOM_RIGHT;
            }

            const modifiedChild = changeCornersIfButton(child, buttonCorners);

            return (
              <div
                className={cx({
                  [styles.fixed()]: !isWidthInPercent,
                  [styles.stretch()]: isWidthInPercent,
                  [styles.stretchFallback()]: Boolean(isWidthInPercent && this.props.width && (isIE11 || isEdge)),
                })}
              >
                <div className={itemCss}>{modifiedChild}</div>
              </div>
            );
          })}
        </span>
      </CommonWrapper>
    );
  }
}
