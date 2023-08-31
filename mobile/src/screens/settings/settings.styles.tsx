import {padding} from 'helpers/styles';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  menuContainer: {
    width: '100%',
    display: 'flex',
    position: 'relative',
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },

  menuListInner: {
    flexDirection: 'column',
  },
  optionsWrapper: {
    shadowRadius: 3,
    borderRadius: 14,
    shadowOpacity: 0.2,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    shadowOffset: {width: -1, height: 1},
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  menuItem: {
    minWidth: 150,
    width: '100%',
    display: 'flex',
    ...padding(12, 0),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  menuItemLabel: {
    fontSize: 15,
    textTransform: 'capitalize',
  },

  container: {
    gap: 30,
    flexDirection: 'column',
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

  header: {
    gap: 10,
    alignItems: 'center',
    flexDirection: 'column',
  },
  headerTitle: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerTitleText: {
    fontSize: 25,
  },
  headerSubtitle: {
    width: '100%',
  },
  headerSubtitleText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#8F8E93',
  },

  // SETTINGS
  settings: {
    gap: 10,
    width: '100%',
    flexDirection: 'column',
  },
  settings__item: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
  },
  settings__item__details: {
    flex: 1,
    gap: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  settings__item__details__info: {
    gap: 2,
    flex: 1,
    flexDirection: 'column',
  },
  settings__item__details__info__title: {
    fontSize: 15,
  },
  settings__item__details__info__subtitle: {
    fontSize: 13,
    lineHeight: 19,
  },
  settings__item__details__icon: {
    display: 'flex',
  },
});

export default styles;
