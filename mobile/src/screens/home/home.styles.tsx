import {padding} from 'helpers/styles';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    gap: 30,
  },

  home: {
    gap: 20,
    borderRadius: 16,
    ...padding(24, 16),
    flexDirection: 'column',
  },
  header: {
    gap: 12,
    marginBottom: 10,
  },
  header_title: {
    fontSize: 20,
  },
  header_subtitle: {
    fontSize: 15,
  },

  block: {
    gap: 12,
    flexDirection: 'column',
  },
  block_title: {
    fontSize: 15,
  },

  select: {
    gap: 12,
    height: 52,
    borderWidth: 1,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    ...padding(0, 16, 0, 15),
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  token: {
    gap: 10,
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  token_image: {
    width: 28,
    height: 28,
    borderRadius: 20,
  },
  token_name: {
    fontSize: 15,
  },
  token_value: {
    fontSize: 15,
  },
  token_estimate: {
    fontSize: 13,
  },
  token_input: {
    flex: 1,
    fontSize: 15,
  },

  button: {
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button_text: {
    fontSize: 16,
  },
});

export default styles;
