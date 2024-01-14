import React, { Component } from 'react';
import { View, Text, Image, Linking, StyleSheet, Animated, ScrollView } from 'react-native';
import axios from 'axios';
import { Card, Title, Paragraph } from 'react-native-paper';

class Newsscreen extends Component {
  state = {
    articles: [],
    isLoading: false,
    error: null,
    page: 1,
    hasMore: true,
    scrollY: new Animated.Value(0),
  };

  componentDidMount() {
    this.getArticles();
  }

  getArticles = () => {
    const { page, isLoading, hasMore } = this.state;
  
    if (isLoading || !hasMore) {
      return;
    }
  
    const apiKey = '3c83fa40b4694069bb604bcd913bfecc';
    const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}&page=${page}`;
  
    this.setState({ isLoading: true });
  
    axios
      .get(apiUrl)
      .then(response => {
        const newArticles = response.data.articles.map((article, index) => ({
          date: `${article.publishedAt}`,
          title: `${article.title}`,
          url: `${article.url}`,
          description: `${article.description}`,
          urlToImage: article.urlToImage || 'https://example.com/placeholder-image.jpg',
          index,
        }));
  
        if (newArticles.length === 0) {
          // No new articles, set hasMore to false
          this.setState({ hasMore: false, isLoading: false });
        } else {
          // There are new articles, update state and page
          this.setState(prevState => ({
            articles: [...prevState.articles, ...newArticles],
            isLoading: false,
            page: prevState.page + 1,
            hasMore: true, // Set hasMore to true for the next potential fetch
          }));
        }
      })
      .catch(error => this.setState({ error, isLoading: false }));
  };
  

  handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
    { useNativeDriver: false }
  );

  render() {
    const { isLoading, articles } = this.state;
    const headerHeight = this.state.scrollY.interpolate({
      inputRange: [0, 100],
      outputRange: [50, 0],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.container}>
        <Animated.View style={[styles.header, { height: headerHeight }]}>
          <Text style={styles.headerText}>News Screen</Text>
        </Animated.View>
        <Animated.ScrollView onScroll={this.handleScroll} scrollEventThrottle={400}>
          {articles.map(article => (
            <Card
              key={article.url}
              style={styles.card}
              onPress={() => {
                Linking.openURL(`${article.url}`);
              }}
            >
              <View style={styles.cardRow}>
                <View style={styles.cardTextContainer}>
                  <Title>{article.title}</Title>
                </View>
                <View style={styles.cardImageContainer}>
                  <Image style={styles.cardImage} source={{ uri: article.urlToImage }} />
                </View>
              </View>
              <View style={styles.cardDescription}>
                <Paragraph>{article.description}</Paragraph>
                <Text>Published At: {article.date}</Text>
              </View>
            </Card>
          ))}
          {isLoading && <Text style={styles.loadingText}>Loading...</Text>}
        </Animated.ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      height:20,
      paddingTop: 0,
      backgroundColor: '#3498db',
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1, // Add this to ensure the header is above other components
    },
    headerText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'white',
    },
    card: {
      marginTop: 0, // Set to 0 to ensure no additional margin
      borderColor: 'black',
      borderRadius: 5,
      borderBottomWidth: 1,
    },
    cardRow: {
      flexDirection: 'row',
    },
    cardTextContainer: {
      justifyContent: 'space-around',
      flex: 2 / 3,
      margin: 10,
    },
    cardImageContainer: {
      flex: 1 / 3,
      margin: 10,
    },
    cardImage: {
      width: 120,
      height: 120,
    },
    cardDescription: {
      margin: 10,
    },
    loadingText: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default Newsscreen;
