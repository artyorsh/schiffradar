import React from 'react';
import { Image, ImageSourcePropType } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Button } from '@/uilib/button.component';
import { IconButton } from '@/uilib/icon-button.component';
import { SafeArea } from '@/uilib/safe-area.component';
import { Text } from '@/uilib/text.component';

interface Props {
  title: string;
  image: ImageSourcePropType;
  viewDetails(): void;
  dismiss(): void;
}

export const VesselDetails: React.FC<Props> = ({ title, image, viewDetails, dismiss }) => (
  <SafeArea style={styles.container}>
    <IconButton
      style={styles.dismissButton}
      icon='Close'
      onPress={() => dismiss()}
    />
    <Image
      style={styles.image}
      source={image}
      resizeMode='contain'
    />
    <Text
      style={styles.title}
      category='heading'>
      {title}
    </Text>
    <Button
      style={styles.viewButton}
      testID='@vessel-details/view'
      title='View on MarineTraffic'
      onPress={() => viewDetails()}
    />
  </SafeArea>
);

const styles = StyleSheet.create((theme, _rt) => ({
  container: {
    paddingHorizontal: theme.gap(8),
    paddingVertical: theme.gap(16),
    borderTopLeftRadius: theme.radius,
    borderTopRightRadius: theme.radius,
  },
  dismissButton: {
    position: 'absolute',
    top: theme.gap(4),
    right: theme.gap(4),
  },
  image: {
    height: 256,
    alignSelf: 'center',
  },
  title: {
    marginTop: theme.gap(8),
  },
  viewButton: {
    marginTop: theme.gap(4),
  },
}));
