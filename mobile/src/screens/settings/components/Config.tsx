import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
  renderers,
} from 'react-native-popup-menu';

import {View} from 'react-native';
import styles from '../settings.styles';
import {capitalize} from '@helpers/common';
import {Text} from '@components/ui/typography';
import {CaretRight} from 'phosphor-react-native';
import useColorScheme from '@hooks/useColorScheme';
import {Settings, useSettings} from '@context/SettingsContext';
import {ScrollView} from 'components/ui/themed';

const {ContextMenu} = renderers;

interface ConfigProps {
  config: {
    key: string;
    title: string;
    options?: string[];
    description?: string;
  };
}
const Config = ({config}: ConfigProps) => {
  const {settings, updateSettings} = useSettings();

  const isDark = useColorScheme() === 'dark';
  const menuBg = isDark ? '#282828' : '#fff';
  const shadowColor = isDark ? '#555' : '#888';
  const borderColor = isDark ? '#666' : '#e1e1e1';

  return (
    <>
      <Menu
        renderer={ContextMenu}
        style={[
          styles.menuContainer,
          {
            position: 'relative',
            alignItems: 'flex-end',
          },
        ]}>
        <MenuTrigger>
          <View
            style={[
              styles.settings__item,
              {
                paddingTop: 12,
              },
            ]}>
            <View style={[styles.settings__item]}>
              <View style={[styles.settings__item__details]}>
                <View style={[styles.settings__item__details__info]}>
                  <Text
                    style={[
                      styles.settings__item__details__info__title,
                      {
                        marginBottom: config?.description ? 3 : 0,
                      },
                    ]}>
                    {`${config?.title}${
                      config?.key !== 'contact' ? ':' : ''
                    } ${capitalize(
                      settings[config?.key as keyof Settings] ?? '',
                    )}`}
                  </Text>
                  {config?.description && (
                    <Text
                      style={[
                        styles.settings__item__details__info__subtitle,
                        {
                          color: '#8F8E93',
                        },
                      ]}>
                      {config?.description}
                    </Text>
                  )}
                </View>

                <View style={[styles.settings__item__details__icon]}>
                  <CaretRight size={18} weight="bold" color={'#8F8E93'} />
                </View>
              </View>
            </View>
          </View>
        </MenuTrigger>

        <MenuOptions
          customStyles={{
            optionsWrapper: [
              styles.optionsWrapper,
              {
                top: 20,
                left: 0,
                right: 0,
                bottom: 0,
              },
            ],
            optionsContainer: [
              styles.optionsContainer,
              {
                width: '100%',
                paddingHorizontal: 20,
              },
            ],
          }}>
          <ScrollView
            bounces={false}
            decelerationRate={0.3}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.menuListInner,
              {
                shadowColor,
                backgroundColor: menuBg,
              },
            ]}>
            {config?.options?.map((option, index, options) => {
              return (
                <MenuOption
                  key={index}
                  style={[
                    styles.menuItem,
                    {
                      borderBottomColor: borderColor,
                      borderBottomWidth:
                        index === options?.length - 1 ? 0 : 0.7,
                    },
                  ]}
                  onSelect={() => {
                    updateSettings(config?.key as keyof Settings, option);
                  }}>
                  <Text style={[styles.menuItemLabel]}>{option}</Text>
                </MenuOption>
              );
            })}
          </ScrollView>
        </MenuOptions>
      </Menu>
    </>
  );
};

export default Config;
