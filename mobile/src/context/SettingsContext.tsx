import {Linking} from 'react-native';
import Icons from '@components/common/Icons';
import overrideColorScheme from 'react-native-override-color-scheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createContext, useContext, useEffect, useMemo, useState} from 'react';
import {ColorSchemeName, useColorScheme as _useColorScheme} from 'react-native';

const CONTACT_URL = 'https://alphaglitch.dev';

export type Settings = {
  sync: 'on' | 'off';
  theme: 'light' | 'dark' | 'system';
  sorting: 'name' | 'date';
  currency: 'Native' | 'Fiat';
  privacy: 'on' | 'off';
  language?: string;
};

export const preferredSocials = [
  'WhatsApp',
  'Twitter',
  'Snapchat',
  'Discord',
  'Telegram',
  'TikTok',
];

type SupportedApps = (typeof preferredSocials)[number][];

interface SettingsContextType {
  isDark: boolean;
  settings: Settings;
  supportedApps: {
    platform: string;
    icon: React.ReactElement;
  }[];
  updateSettings: (
    key: keyof Settings,
    value: Settings[keyof Settings],
  ) => void;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}

export const SettingsContext = createContext<SettingsContextType>(
  {} as SettingsContextType,
);

export const useSettings = (): SettingsContextType =>
  useContext(SettingsContext);

interface SettingsProviderProps {
  children: React.ReactElement | React.ReactElement[];
}

export default function SettingsProvider({children}: SettingsProviderProps) {
  const systemTheme = _useColorScheme() as NonNullable<ColorSchemeName>;

  const [socialApps, setSupportedApps] = useState<SupportedApps>([]);

  const [settings, setSettings] = useState<Settings>({
    sync: 'off',
    privacy: 'off',
    theme: 'system',
    sorting: 'name',
    currency: 'Native',
    language: 'English',
  });

  const getSupportedApps = async () => {
    const installed = [];

    for (const app of preferredSocials) {
      const isInstalled = await Linking.canOpenURL(`${app.toLowerCase()}://`);
      if (isInstalled && installed.length < 4) {
        installed.push(app);
      }
    }
    setSupportedApps(installed);
  };

  useEffect(() => {
    if (socialApps.length === 0) {
      getSupportedApps();
    }
  }, []);

  const openContact = () => {
    Linking.canOpenURL(CONTACT_URL).then(supported => {
      if (supported) {
        Linking.openURL(CONTACT_URL);
      }
    });
  };

  useEffect(() => {
    if (settings.theme === 'dark' || settings.theme === 'light') {
      overrideColorScheme.setScheme(settings.theme);
    } else {
      overrideColorScheme.setScheme();
    }
  }, [settings.theme]);

  const updateSettings = async (
    key: keyof Settings,
    value: Settings[keyof Settings],
  ) => {
    setSettings({...settings, [key]: value});
    await AsyncStorage.setItem(
      'settings',
      JSON.stringify({...settings, [key]: value}),
    );
  };

  const getIcon = (platform: keyof typeof Icons) => {
    const Icon = Icons[platform];
    return Icon ? <Icon size={40} /> : <></>;
  };

  const supportedApps = useMemo(() => {
    const socials = socialApps.map(app => {
      return {
        platform: app,
        icon: getIcon(app as keyof typeof Icons),
      };
    });
    return socials.length >= 4
      ? [
          ...socials,
          {
            platform: 'More',
            icon: <Icons.More size={40} />,
          },
        ]
      : [
          {
            platform: 'More',
            icon: <Icons.More size={40} />,
          },
          ...socials,
        ];
  }, [socialApps]);

  const isDark = useMemo(() => {
    if (settings?.theme === 'system') return systemTheme === 'dark';
    if (settings?.theme === 'light') return false;
    return true;
  }, [settings.theme]);

  return (
    <SettingsContext.Provider
      value={{
        isDark,
        settings,
        setSettings,
        updateSettings,
        supportedApps,
      }}>
      {children}
    </SettingsContext.Provider>
  );
}
