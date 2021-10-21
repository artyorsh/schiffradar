import React, { useState } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

export interface IModalWindowRef {
  mount(element: React.ReactElement): number;
  unmount(id: number): void;
}

type IElementMap = Map<number, React.ReactElement>;

interface Props extends ViewProps {
  onWindowSizeChange(numberOfActiveModals: number): void;
}

export const ModalWindow = React.forwardRef<IModalWindowRef, Props>((props, ref) => {

  const [elements, setElements] = useState<IElementMap>(new Map());

  React.useEffect(() => {
    props.onWindowSizeChange(elements.size);
  }, [elements.size]);

  React.useImperativeHandle(ref, () => ({
    mount(element: React.ReactElement): number {
      elements.set(elements.size, element);
      setElements(new Map(elements));

      return elements.size - 1;
    },
    unmount(id: number): void {
      elements.delete(id);
      setElements(new Map(elements));
    },
  }));

  const renderElement = ([id, element]: [number, React.ReactElement]): React.ReactElement => {
    return React.cloneElement(element, { key: id });
  };

  return (
    <View
      {...props}
      pointerEvents='box-none'
      style={[StyleSheet.absoluteFill, props.style]}>
      {Array.from(elements.entries()).map(renderElement)}
    </View>
  );
});
