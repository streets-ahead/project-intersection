import React from 'react';

//TODO: add support for child meta-tags that way we could to twitter 
// cards and stuff
class DocumentMeta extends React.Component {
  componentWillMount() {
    this.doUpdate();
  }
  
  componentDidUpdate(prevProps) {
    if(prevProps.title !== this.props.title) {
      this.doUpdate();
    }
  }
  
  doUpdate() {
    if(typeof document !== "undefined") document.title = this.props.title;
  }
  
  render() {
    return null;
  }
}

export default DocumentMeta;
