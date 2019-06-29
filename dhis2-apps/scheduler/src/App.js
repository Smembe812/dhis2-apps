import React, {Component} from 'react';
import PropTypes from 'prop-types';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import HeaderBar from '@dhis2/d2-ui-header-bar'
import { App as D2UIApp, mui3theme as dhis2theme } from '@dhis2/d2-ui-core'
import Sidebar from './components/ui/drawer';
import './App.css';
import OrgUnitSelect from './components/org-unit-select';
import PaperSheet from './components/ui/paper'

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

    return (
      <D2UIApp>
        <MuiThemeProvider theme={createMuiTheme(dhis2theme)}>
          <HeaderBar d2={this.props.d2}/>
            <Sidebar>
              
              <PaperSheet heading="Select Org Unit">
                <OrgUnitSelect d2={this.props.d2}/>
              </PaperSheet>
              <PaperSheet heading="Select Period">
              </PaperSheet>
              <PaperSheet heading="Select Indicators">
              </PaperSheet>
            </Sidebar>
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
