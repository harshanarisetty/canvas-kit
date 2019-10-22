import * as React from 'react';
import styled from '@emotion/styled';
import {GenericStyle} from '@workday/canvas-kit-react-common';
import Column, {ColumnProps} from './Column';
import canvas, {spacingNumbers} from '@workday/canvas-kit-react-core';
import isPropValid from '@emotion/is-prop-valid';

export interface LayoutProps {
  /**
   * Layout cannot be empty.
   */
  children: React.ReactElement<ColumnProps>[] | React.ReactNode;
  /**
   * Spacing of layout children.
   */
  spacing: number;
  /**
   * Gutter of layout
   */
  gutter: number | string;
  /**
   * If there should be a max-width
   */
  capWidth?: boolean;
}

const LayoutStyles: GenericStyle = {
  classname: 'layout',
  styles: {
    display: 'flex',
    width: '100%',
    boxSizing: 'border-box',
  },
};

const LayoutContainer = styled('div', {
  shouldForwardProp: prop => isPropValid(prop) && prop !== 'spacing',
})<LayoutProps>(
  LayoutStyles.styles,
  ({gutter}) => {
    if (gutter === 0) {
      return;
    }

    return {padding: `0 ${gutter}`};
  },
  ({capWidth}) => {
    if (!capWidth) {
      return;
    }

    return {
      maxWidth: '1280px',
      margin: '0 auto',
    };
  }
);

export default class Layout extends React.Component<LayoutProps> {
  static defaultProps = {
    gutter: canvas.spacing.xs,
    spacing: spacingNumbers.xs,
  };

  public static Column = Column;

  private renderChild = (child: React.ReactElement<ColumnProps>): React.ReactNode => {
    if (!child) {
      return;
    }

    if (child.type === Column) {
      const childProps = child.props;

      if (childProps.spacing || childProps.spacing === 0) {
        return child;
      }

      return React.cloneElement(child as React.ReactElement<ColumnProps>, {
        spacing: this.props.spacing,
      });
    }

    return child;
  };

  public render() {
    const {children, gutter, capWidth, ...elemProps} = this.props;

    return (
      <LayoutContainer gutter={gutter} capWidth={capWidth} {...elemProps}>
        {React.Children.map(children, this.renderChild)}
      </LayoutContainer>
    );
  }
}
