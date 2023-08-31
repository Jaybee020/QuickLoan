import {padding} from 'helpers/styles';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    gap: 14,
    borderRadius: 16,
    flexDirection: 'column',
  },

  header: {
    marginBottom: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  close_btn: {
    width: 28,
    height: 28,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  header_inner: {
    gap: 8,
    flexDirection: 'column',
  },
  header_title: {
    fontSize: 20,
  },
  header_subtitle: {
    fontSize: 15,
  },

  details: {
    gap: 14,
    width: '100%',
    marginBottom: 18,
    flexDirection: 'column',
  },

  price_info: {
    gap: 6,
    marginBottom: 26,
    flexDirection: 'column',
  },
  subtext: {
    fontSize: 13,
  },

  block: {
    gap: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  block_title: {
    fontSize: 16,
  },
  token: {
    gap: 10,
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  token_image: {
    width: 18,
    height: 18,
    borderRadius: 20,
  },
  token_name: {
    fontSize: 16,
  },
  token_value: {
    fontSize: 15,
  },
  token_estimate: {
    fontSize: 13,
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

  footer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer_text: {
    fontSize: 13,
  },
});

export default styles;
