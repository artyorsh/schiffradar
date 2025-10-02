import { useEffect } from 'react';
import { Image } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useLingui } from '@lingui/react/macro';

import { Button } from '@/uilib/button.component';
import { SafeArea } from '@/uilib/safe-area.component';
import { Text } from '@/uilib/text.component';

export interface ILocationPermissionRequestVM {
  onMount(): void;
  onUnmount(): void;
  requestPermissions(): void;
}

export const LocationPermissionRequest: React.FC<{ vm: ILocationPermissionRequestVM }> = ({ vm }) => {
  const { t } = useLingui();

  useEffect(() => {
    vm.onMount();

    return () => vm.onUnmount();
  }, [vm]);

  return (
    <SafeArea style={styles.container}>
      <Image
        style={styles.image}
        resizeMode='contain'
        source={require('./location-permission-icon.png')}
      />
      <Text
        style={styles.title}
        category='heading'>
        {t`location.permission_request.title`}
      </Text>
      <Text style={styles.body}>
        {t`location.permission_request.body`}
      </Text>
      <Button
        testID='@permission-request/continue'
        title={t`location.permission_request.continue_button`}
        onPress={() => vm.requestPermissions()}
      />
    </SafeArea>
  );
};

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    paddingHorizontal: theme.gap(8),
    paddingVertical: theme.gap(16),
    borderTopLeftRadius: theme.radius,
    borderTopRightRadius: theme.radius,
  },
  image: {
    height: 256,
    alignSelf: 'center',
  },
  title: {
    marginTop: theme.gap(8),
  },
  body: {
    marginTop: theme.gap(4),
    marginBottom: rt.insets.bottom + theme.gap(4),
  },
}));
