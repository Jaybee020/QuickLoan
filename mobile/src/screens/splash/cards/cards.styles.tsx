import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    gap: 30,
    alignItems: 'center',
    paddingHorizontal: 18,
    flexDirection: 'column',
  },

  card: {
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  card_details: {
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    paddingTop: 10,
    paddingBottom: 50,
    position: 'absolute',
    paddingHorizontal: 22,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  card_illustration: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card_info: {
    gap: 8,
    width: '100%',
    flexDirection: 'column',
  },
  card_title: {
    fontSize: 30,
  },
  card_subtitle: {
    fontSize: 18,
    lineHeight: 24,
  },
});

export default styles;
