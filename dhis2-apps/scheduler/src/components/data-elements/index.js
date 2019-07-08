import React, {Component} from 'react'
import {ListSelectWithLocalSearch} from '@dhis2/d2-ui-core';

class DataElements extends Component {
    constructor (props){
        super(props)
        this.state = {
            d2: props.d2,
            dataElements: []
        }
        
        props.d2.models.dataElement.list({
            fields: 'id,displayName'
        })
        .then((dataElements) => {
            dataElements = dataElements.toArray()
            this.setState({dataElements})
        })
        
        this.selectDataElement = this.selectDataElement.bind(this)
        
    }

    selectDataElement(e){
        this.props.onDataElementSelection(
            this.state.dataElements.filter(
                ({displayName}) => displayName === e)[0]
            )
    }

    getChildContext() {
        return {
            d2: this.props.d2,
        };
    }

    mapDataElements(dataElements){
        return dataElements.map(({displayName, id}) => {
            return {name: displayName, id: id, label: displayName}
        })
            
    }

    render(){

        const {dataElements} = this.state
        if (!dataElements){
            return null
        }
        this.mapDataElements(dataElements)
        return (
            <>
                    <div>
                    <ListSelectWithLocalSearch
                        source={this.mapDataElements(dataElements)}
                        onItemDoubleClick={this.selectDataElement}
                    />
                </div>
            </>
        )
    }
}

export default DataElements