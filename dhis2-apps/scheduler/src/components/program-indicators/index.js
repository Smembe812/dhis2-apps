import React, {Component} from 'react'

class ProgramIndicators extends Component {
    constructor (props){
        super(props)
        this.state = {
            d2: props.d2
        }
        
        this.props.d2.models.programIndicators.list({
            paging: false,
        fields: 'id,displayName'
        })
        .then((programIndicators)=> (
            this.setState(
                {programIndicators: programIndicators.toArray()}
                )
            )
        )
    }
    getChildContext() {
        return {
            d2: this.props.d2,
        };
    }

    render(){
        console.log(this.state)

        const {programIndicators} = this.state
        if (!programIndicators){
            return null
        }
        return (
            <ul>
                {programIndicators.map(({displayName, key}) => (
                    <li key={key}>{displayName}</li>
                ))}
            </ul>
        )
    }
}

export default ProgramIndicators