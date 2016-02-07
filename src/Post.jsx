import React from 'react';

export default class Post extends React.Component {
  render() {
    return <div dangerouslySetInnerHTML={{__html: this.props.content.body}} />;
  }
}
