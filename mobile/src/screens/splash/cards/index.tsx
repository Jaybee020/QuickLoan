import styles from './cards.styles';
import Layout from 'constants/Layout';
import {View} from 'components/ui/themed';
import {BdText, Text} from 'components/ui/typography';
import Gradients, {Vectors} from 'components/common/Vectors';

const Cards = () => {
  const cards = [
    {
      title: 'Aggregate loans',
      subtitle:
        'Optimize blockchain efficiency with our abstraction and aggregation techniques',
      color: '#41354e',
      subtitleColor: '#725892',
    },
  ];

  return (
    <View style={[styles.container]}>
      {cards.map((card, index) => {
        return (
          <View
            key={index}
            style={[
              styles.card,
              {
                maxHeight: '100%',
                maxWidth: Layout.window.width - 20,
              },
            ]}>
            <Gradients.Purple />
            <View style={[styles.card_details]}>
              <View style={[styles.card_illustration]}>
                <Vectors.Purple />
              </View>

              <View style={[styles.card_info]}>
                <BdText
                  style={[
                    styles.card_title,
                    {
                      color: card.color,
                    },
                  ]}>
                  {card?.title}
                </BdText>

                <Text
                  style={[
                    styles.card_subtitle,
                    {
                      color: card.subtitleColor,
                    },
                  ]}>
                  {card?.subtitle}
                </Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default Cards;
