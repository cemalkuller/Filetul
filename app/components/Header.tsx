import React, { memo } from 'react';
import { StyleSheet, Text } from 'react-native';

import { theme } from '../core/theme';

type Props = {
  children: React.ReactNode;
};

const Header = ({ children }: Props) => (
  <Text style={styles.header}>{children}</Text>
);

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    color: theme.colors.secondary,
    marginBottom : 30,
    width : '100%',
    textAlign : 'center'

  },
});

export default memo(Header);
