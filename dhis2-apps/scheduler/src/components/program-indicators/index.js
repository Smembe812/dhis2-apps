import React, {Component} from 'react'
import {SelectField, ListSelectWithLocalSearch} from '@dhis2/d2-ui-core';

class ProgramIndicators extends Component {
    constructor (props){
        super(props)
        this.state = {
            d2: props.d2,
            selectedProgram: 'dsdsd'
        }
        Promise.all([
            props.d2.models.programIndicators.list({
                paging: false,
                fields: 'id,displayName'
            }),
            props.d2.models.program.list({
                fields: 'id,displayName'
            }),
            props.d2.models.dataElements.list({
                fields: 'id,displayName'
            })
        ])
        .then(([programIndicators, programs, dataElements]) => {
            programs = programs.toArray()
            programIndicators = programIndicators.toArray()
            dataElements = dataElements.toArray()
            this.setState({programs, programIndicators, dataElements})
        })

        this.selectIndicator = this.selectIndicator.bind(this)
        this.handleSelectProgram = this.handleSelectProgram.bind(this)
        
    }

    selectIndicator(e){
        this.props.onIndicatorSelection(e)
    }

    selectDataElement(e){
        this.props.onSelectDataElement(e)
    }

    getChildContext() {
        return {
            d2: this.props.d2,
        };
    }

    mapIndicators(programIndicators){
        return programIndicators.map(({displayName, id}) => {
            return {name: displayName, id: id, label: displayName}
        })
            
    }

    mapPrograms(programs){
        return programs.map(({displayName, id}) => {
            return {name: displayName, id: id}
        })
            
    }

    mapDataElements(dataElements){
        return dataElements.map(({displayName, id}) => {
            return {name: displayName, id}
        })
    }

    async handleSelectProgram(program){
        const programIndicators = await this.getProgramIndicators(program)
        this.setState({program, programIndicators})
    }
    

    getProgramIndicators(program){
        return new Promise((resolve, reject) => {
            
            this.state.d2.models.programIndicators.list({
                paging: false,
                fields: 'id,displayName',
                filter: `program.id:eq:${program.id}`
            })
            .then(indicators => resolve(indicators.toArray()))
            .catch(err => reject(err))
        })
    }

    render(){

        const {programIndicators, programs, selectedProgram} = this.state
        if (!programIndicators){
            return null
        }
        this.mapIndicators(programIndicators)
        return (
            <>
                <SelectField
                    label="Select Indicator"
                    value="dasdsd"
                    items={this.mapPrograms(programs)}
                    onChange={this.handleSelectProgram}
                />
                <div>
                <ListSelectWithLocalSearch
                    source={this.mapIndicators(programIndicators)}
                    onItemDoubleClick={this.selectIndicator}
                />
            </div>
            </>
        )
    }
}

export default ProgramIndicators