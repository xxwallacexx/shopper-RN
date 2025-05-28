import React from 'react';
import ActionSheet from '../ActionSheet';

// Mock tamagui Sheet component
jest.mock('tamagui', () => ({
  Sheet: Object.assign(
    function MockSheet(props: Record<string, any>) { 
      return { 
        type: 'Sheet',
        props,
        children: props.children
      }; 
    },
    {
      Overlay: function MockOverlay(props: Record<string, any>) { 
        return { 
          type: 'Sheet.Overlay',
          props,
          children: props.children
        }; 
      },
      Frame: function MockFrame(props: Record<string, any>) { 
        return { 
          type: 'Sheet.Frame',
          props,
          children: props.children
        }; 
      }
    }
  )
}));

describe('ActionSheet', () => {
  const defaultProps = {
    isSheetOpen: false,
    setIsSheetOpen: jest.fn(),
    sheetPosition: 0,
    setSheetPosition: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with default props', () => {
    const sheet = ActionSheet({
      ...defaultProps,
      children: 'Test Content'
    });
    expect(sheet).toBeDefined();
  });

  it('should render with custom props', () => {
    const customProps = {
      ...defaultProps,
      isSheetOpen: true,
      bg: 'red',
      snapPoints: [50] as [number],
      children: 'Test Content'
    };
    const sheet = ActionSheet(customProps);
    expect(sheet).toBeDefined();
  });
}); 