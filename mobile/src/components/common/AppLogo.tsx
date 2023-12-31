import useColorScheme from 'hooks/useColorScheme';
import Svg, {Circle, ClipPath, Defs, G, Path, Rect} from 'react-native-svg';

export default function AppLogo({size = 150}) {
  const isDark = useColorScheme() === 'dark';

  return (
    <Svg
      width={146}
      height={36}
      fill="none"
      viewBox="0 0 146 36"
      style={{
        width: size,
        height: size * (36 / 146),
      }}>
      <Path
        fill={isDark ? '#fff' : '#000'}
        d="M63.664 18.408c0 2.376-.696 4.464-1.944 6.024l1.92 1.92-1.68 1.68-1.992-1.992c-1.296.84-2.904 1.32-4.728 1.32-5.184 0-8.424-3.792-8.424-8.952s3.24-8.928 8.424-8.928c5.16 0 8.424 3.768 8.424 8.928Zm-8.424 6.504c1.152 0 2.112-.264 2.904-.72l-2.328-2.328 1.68-1.68 2.304 2.328c.696-1.128 1.008-2.568 1.008-4.104 0-3.456-1.632-6.48-5.568-6.48s-5.592 3.024-5.592 6.48c0 3.48 1.656 6.504 5.592 6.504Zm19.453-10.176h2.52V27h-2.52v-1.584h-.048c-.648.96-1.92 1.92-4.032 1.92-2.28 0-4.08-1.32-4.08-4.128v-8.472h2.544v7.752c0 1.656.696 2.712 2.424 2.712 1.944 0 3.192-1.176 3.192-3v-7.464Zm7.296-2.064c-.696 0-1.416-.48-1.416-1.344 0-.864.72-1.32 1.416-1.32.744 0 1.44.456 1.44 1.32 0 .864-.696 1.344-1.44 1.344Zm-1.248 2.064h2.52V27h-2.52V14.736Zm5.855-4.896h2.52v9.816l4.992-4.92h3.096l-4.656 4.56L97.708 27h-3.024l-3.864-6.048-1.704 1.608V27h-2.52V9.84Zm13.289 0h2.544V27h-2.544V9.84Zm11.471 17.52c-3.84 0-6.168-2.664-6.168-6.48 0-3.816 2.328-6.48 6.168-6.48 3.84 0 6.168 2.664 6.168 6.48 0 3.816-2.328 6.48-6.168 6.48Zm0-2.064c2.4 0 3.648-1.896 3.648-4.416 0-2.544-1.248-4.416-3.648-4.416-2.4 0-3.648 1.872-3.648 4.416 0 2.52 1.248 4.416 3.648 4.416Zm16.286-7.344c0-.888-.528-1.56-2.208-1.56-2.016 0-2.76.624-2.88 2.208h-2.448c.12-2.352 1.632-4.2 5.328-4.2 2.712 0 4.728 1.032 4.728 4.296v5.832c0 .864.192 1.32 1.176 1.224v1.2a3.793 3.793 0 0 1-1.464.264c-1.344 0-1.968-.48-2.208-1.68h-.048c-.768 1.08-2.16 1.824-4.056 1.824-2.496 0-4.032-1.44-4.032-3.504 0-2.688 1.992-3.528 5.064-4.128 1.896-.36 3.048-.6 3.048-1.776Zm-3.528 7.416c2.088 0 3.528-1.032 3.528-3.024v-1.848c-.408.288-1.392.576-2.568.816-2.088.456-3 1.056-3 2.304 0 1.128.672 1.752 2.04 1.752ZM140.372 14.4c2.28 0 4.08 1.32 4.08 4.128V27h-2.544v-7.752c0-1.656-.696-2.712-2.424-2.712-1.944 0-3.192 1.176-3.192 3V27h-2.52V14.736h2.52v1.584h.048c.648-.96 1.92-1.92 4.032-1.92Z"
      />
      <Rect width={36} height={36} fill="#4731D3" rx={18} />
      <Path
        fill="#E0FFA6"
        d="m25.82 18.015-9.547 10.229a.681.681 0 0 1-1.167-.597l1.25-6.25-4.913-1.845a.682.682 0 0 1-.256-1.108l9.547-10.228a.682.682 0 0 1 1.167.596l-1.253 6.258 4.912 1.841a.683.683 0 0 1 .256 1.104h.003Z"
      />
    </Svg>
  );
}

export function AppLogoIcon({size = 36}) {
  const isDark = useColorScheme() === 'dark';

  return (
    <Svg
      fill="none"
      viewBox="0 0 36 36"
      style={{
        width: size,
        height: size,
      }}>
      <Rect width={36} height={36} fill={!isDark ? '#000' : '#fff'} rx={8} />
      <Path
        strokeWidth={0.5}
        fillRule="evenodd"
        clipRule="evenodd"
        fill={isDark ? '#000' : '#fff'}
        stroke={isDark ? '#000' : '#fff'}
        d="M10.276 18.045c.715-4.788 4.041-8.17 7.724-8.17 3.093 0 5.936 2.386 7.19 5.987a4.377 4.377 0 0 1 1.86-.298C25.649 11.213 22.225 8 18 8c-4.953 0-8.808 4.417-9.59 9.91a2.202 2.202 0 0 0-1.386 2.384 2.197 2.197 0 0 0 4.283.309 2.212 2.212 0 0 0-1.031-2.558ZM26.8 22.176c.584 0 1.143-.232 1.556-.646a2.21 2.21 0 0 0-1.556-3.767c-.584 0-1.143.233-1.556.647a2.21 2.21 0 0 0 0 3.12c.413.414.973.646 1.556.646Z"
      />
      <Rect
        x={8}
        y={25}
        rx={1.3}
        width={20}
        height={2.6}
        fill={isDark ? '#000' : '#fff'}
      />
    </Svg>
  );
}
