import {InputProps, NormalText, TextInput, TextProps} from './themed';

export function RgText(props: TextProps) {
  return (
    <NormalText
      {...props}
      style={[props.style, {fontFamily: 'Uncut-Sans-Regular'}]}
    />
  );
}

export function Text(props: TextProps) {
  return (
    <NormalText
      {...props}
      style={[props.style, {fontFamily: 'Uncut-Sans-Medium'}]}
    />
  );
}

export function BdText(props: TextProps) {
  return (
    <NormalText
      {...props}
      style={[props.style, {fontFamily: 'Uncut-Sans-Semibold'}]}
    />
  );
}

export function InputRg(props: InputProps) {
  return (
    <TextInput
      {...props}
      style={[props.style, {fontFamily: 'Uncut-Sans-Regular'}]}
    />
  );
}

export function Input(props: InputProps) {
  return (
    <TextInput
      {...props}
      style={[props.style, {fontFamily: 'Uncut-Sans-Medium'}]}
    />
  );
}

export function InputBd(props: InputProps) {
  return (
    <TextInput
      {...props}
      style={[props.style, {fontFamily: 'Uncut-Sans-Semibold'}]}
    />
  );
}
