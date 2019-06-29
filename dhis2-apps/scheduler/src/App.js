import React, {Component} from 'react';
import PropTypes from 'prop-types';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import HeaderBar from '@dhis2/d2-ui-header-bar'
import { App as D2UIApp, mui3theme as dhis2theme } from '@dhis2/d2-ui-core'
import {Sidebar} from '@dhis2/d2-ui-core';
import './App.css';
import OrgUnitSelect from './components/org-unit-select';

class App extends Component{
  constructor(props) {
      super(props);

      this.state = {
          d2: props.d2,
      };
  }

  getChildContext() {
    return { d2: this.state.d2 };
  }

  render(){
    if (!this.state.d2) {
        console.log('no');
        return null;
    }
    const sections = [
        { key: 's1', label: 'Section 1' },
        { key: 's2', label: 'Section 2' },
        { key: 's3', label: 'Section 3' },
        { key: 's4', label: 'Section 4' },
    ];

    const styles = {
      box: {
          position: 'relative',
          border: '1px solid #808080',
          borderRadius: 3,
          width: 512,
          height: 256,
          margin: 16,
      },
      header: {
          height: 44,
          background: '#276696',
          color: 'white',
          fontSize: 16,
          fontWeight: 700,
      },
      headerText: {
          padding: 12,
      },
      leftBar: {
          position: 'absolute',
          paddingTop: '10em'
      },
      page: {
          paddingLeft: 295 + 8,
          paddingTop: 24,
      },
  };

    return (
      <D2UIApp>
        <MuiThemeProvider theme={createMuiTheme(dhis2theme)}>
          <HeaderBar d2={this.props.d2}/>
            <OrgUnitSelect d2={this.props.d2}/>
          
        </MuiThemeProvider>
        
      </D2UIApp>
    );
  }
}

App.childContextTypes = {
  d2: PropTypes.object,
};

App.propTypes = {
  d2: PropTypes.object.isRequired,
};

export {App};
