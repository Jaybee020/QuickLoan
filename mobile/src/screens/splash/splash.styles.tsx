import {edges, padding} from 'helpers/styles';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    gap: 30,
    paddingHorizontal: 0,
    flexDirection: 'column',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 22,
  },
  body: {
    flex: 1,
    width: '100%',
  },
  footer: {
    gap: 24,
    flex: 1,
    maxHeight: 200,
    alignItems: 'center',
    paddingHorizontal: 22,
    flexDirection: 'column',
  },

  email: {
    padding: 4,
    width: '100%',
    borderWidth: 2,
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    flexDirection: 'row',
  },

  email__input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    lineHeight: 16,
    ...padding(0, 12),
    borderRightWidth: 0,
  },

  footer_button: {
    height: 50,
    padding: 12,
    borderRadius: 10,
    ...padding(0, 16),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  footer_button_text: {
    fontSize: 16,
  },
  footerText: {
    fontSize: 16,
  },
});

export default styles;
