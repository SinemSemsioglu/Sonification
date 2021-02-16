import React from 'react';
import {StyleSheet} from 'react-native'

const fontSizes = {
  large: 46,
  medium: 18,
  small: 14
}

styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoText: {
    fontSize: fontSizes.large,
    marginLeft: 10
  },
  description: {
    fontSize: fontSizes.medium,
    textAlign: 'justify'
  },
  iconButton: {
    margin: 10
  },
  horizontalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  mainAction: {
    padding: 20,
    alignItems: 'center'
  },
  section: {
    paddingTop: 20,
    paddingBottom: 20
  },
  indented: {
    paddingRight: 40,
    paddingLeft: 40
  },
  centered: {
    textAlign: 'center'
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2
  },
  checkBox: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  bottomed: {
    position: 'absolute',
    bottom: 0,
    right: 20,
    left: 20
  },
  gridContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row'
  },
  gridItem: {
    width: '50%',
    padding: 10,
    alignItems: 'center'
  },
  box: {
    borderWidth: 2
  },
  boxLevel: {
    textAlign: 'center',
    padding: 10
  },
  boxTop: {
    fontSize: fontSizes.medium,
    borderBottomWidth: 2,
  },
  bold: {
    fontWeight: '700'
  },
  activityListItem: {
    marginBottom: 5,
    marginTop: 5
  },
  paragraph: {
    marginBottom: 5
  },
  tInput: {
    marginBottom: 5
  },
  header: {
    fontWeight: '700',
    fontSize: fontSizes.medium,
    marginBottom: 5
  }
});


module.exports= {
  styles
}
