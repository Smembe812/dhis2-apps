import React, {Component} from 'react';
import PropTypes from 'prop-types';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import HeaderBar from '@dhis2/d2-ui-header-bar'
import { App as D2UIApp, mui3theme as dhis2theme } from '@dhis2/d2-ui-core'
import Sidebar from './components/ui/drawer';
import "storm-react-diagrams/dist/style.min.css" 
import './App.css'
import OrgUnitSelect from './components/org-unit-select';
import PaperSheet from './components/ui/paper'
import DataElements from './components/data-elements'
import FormBuilder from './components/form-builder'
import DataContainer from './components/data-container'

import {
	DiagramEngine,
	DiagramModel,
	DefaultNodeModel,
	LinkModel,
	DiagramWidget,
	DefaultLinkModel
} from "storm-react-diagrams";

const styles = theme => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    paddingTop: '3em',
    marginLeft: '20em'
  },
  toolbar: theme.mixins.toolbar,
});

class App extends Component{
  constructor(props) {
      super(props);

      this.state = {
          d2: props.d2,
          engine: new DiagramEngine(),
          model: new DiagramModel(),
          nodesAndEdges: []
      };

      this.state.engine.installDefaultFactories();

      this.handleDataElementSelection = this.handleDataElementSelection.bind(this)
      this.handleIndicatorSelection = this.handleIndicatorSelection.bind(this)
  }

  getChildContext() {
    return { d2: this.state.d2 };
  }

  createPort(node, options){
      if (options === 'in'){
          return node.addInPort("In");
      }
      else if (options === 'out') {
          return node.addOutPort("Out");
      }
  }

  handleIndicatorSelection(indicator){
    const name = indicator
    this.setState({selectedIndicator: {name}})

    const node = this.createNode({
        name: indicator,
        color: 'rgb(0, 192, 255)',
        x: 100,
        y: 100
    },
    {
        name: indicator
    })

    const port1 = this.createPort(node, 'out');

    this.state.nodesAndEdges.push(node)
    const model = this.addNodeToModel(this.state.model, node)
    const engine = this.loadEngine()
  }

  handleDataElementSelection(indicator){
    const name = indicator
    this.setState({onSelectDataElement: {name}})

    const node = this.createNode({
          name,
          color: 'rgb(192, 255, 0)',
          x: 400,
          y: 100
      },
      {
          name
      })

      const port1 = this.createPort(node, 'in');

      this.state.nodesAndEdges.push(node)
      const model = this.addNodeToModel(this.state.model, node)
      const engine = this.loadEngine()
      
  }

  createNode(options, extras = null){
      const { name, color, x, y} = options
      const node = new DefaultNodeModel(name, color);

      if (extras !== null)
          Object.assign(node, {extras})

      node.setPosition(x, y)
      return node
  }

  addNodeToModel(model, node){
    console.log(node)
    this.state.model.addAll(node)
    console.log(this.state.model)

  }

  loadEngine(){
    this.state.engine.setDiagramModel(this.state.model)
  }


  createSecondNode(){
    const node2 = this.createNode({
      name: 'Node 2',
      color: 'rgb(192, 255, 0)',
      x: 400,
      y: 100
    })

  const port2 = this.createPort(node2, 'in');
  this.state.model.addAll(node2);
  }
  render(){
    const {classes} = this.props


    //5) load model into engine
    

    //this.state.engine.setDiagramModel(this.state.model);
  
    if (!this.state.d2) {
        console.warn('d2 not loaded');
        return null;
    }
   
    
    return (
      <D2UIApp>
        <MuiThemeProvider theme={createMuiTheme(dhis2theme)}>
          <HeaderBar d2={this.props.d2}/>
            <Sidebar>
                <OrgUnitSelect d2={this.props.d2}/>
            </Sidebar>
            <main className={classes.content}>
              <div className={classes.toolbar}>
              <Card className={classes.card}>
                <CardContent>
                  <DiagramWidget className="srd-demo-canvas" diagramEngine={this.state.engine} />  
                 
                </CardContent>
              </Card>
              <DataContainer 
                d2={this.props.d2} 
                onIndicatorSelection={this.handleIndicatorSelection} 
                onDataElementSelection={this.handleDataElementSelection}/>
              
              </div>
            </main>
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

export default withStyles(styles)(App);
