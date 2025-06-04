import React from 'react';

import Dialog from '../Dialog';

// Mock tamagui AlertDialog components
jest.mock('tamagui', () => {
  const MockAlertDialog = function (props: { children: React.ReactNode; open?: boolean }) {
    return {
      type: 'AlertDialog',
      props,
      children: props.children,
    };
  };

  MockAlertDialog.Portal = function MockPortal(props: { children: React.ReactNode }) {
    return {
      type: 'AlertDialog.Portal',
      props,
      children: props.children,
    };
  };

  MockAlertDialog.Overlay = function MockOverlay(props: Record<string, any>) {
    return {
      type: 'AlertDialog.Overlay',
      props,
      children: props.children,
    };
  };

  MockAlertDialog.Content = function MockContent(props: { children: React.ReactNode }) {
    return {
      type: 'AlertDialog.Content',
      props,
      children: props.children,
    };
  };

  return {
    AlertDialog: MockAlertDialog,
  };
});

describe('Dialog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render content when closed', () => {
    const dialog = Dialog({
      isOpen: false,
      children: 'Test Content',
    });
    expect(dialog).toBeDefined();
    expect(dialog.props.open).toBe(false);
  });

  it('should render content when open', () => {
    const dialog = Dialog({
      isOpen: true,
      children: 'Test Content',
    });
    expect(dialog).toBeDefined();
    expect(dialog.props.open).toBe(true);
  });
});
