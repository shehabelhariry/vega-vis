import React from 'react'
import { Draggable } from 'react-beautiful-dnd'

export default class Data  extends React.Component {
  state = {
    formIsVisible: false,
    isTransformVisible: false
  }

  toggleCreateSourceForm = () => {
    this.setState({formIsVisible: !this.state.formIsVisible})
  }

  toggleCreateSourceFormTransform = () => {
    this.setState({isTransformVisible: !this.state.isTransformVisible})
  }
  
  addDataSource = (e) => {
    e.preventDefault()
    const elements = e.target.elements;
    let dataSource = {};
    for (let element of elements) {
      if(element.name) {
        dataSource[element.name] = element.value
      }
    }
    this.props.addDataSource(dataSource)
  }
  
  addTransformToSourceData = (e) => {
    e.preventDefault()
  }

  changeUsedDataSource = e => {
    console.log(e.target.value)
  }

  render () {
    let {attributeNames, dataSources} = this.props
    return (
      <div>
        <h2>Data Source</h2>
        <select className="action-field--select" onChange={this.changeUsedDataSource}>
            {dataSources && dataSources.map(dataSource => <option key={dataSource.name} value={dataSource.name} >{dataSource.name}</option>)}
        </select>
        <h2>Data Fields</h2>
        { attributeNames && attributeNames.map((item, index) => (
          <div style={{position: 'relative'}} key={item}>
            <Draggable draggableId={item} index={index} >
            {
              (provided, snapshot) => (
                <div
                  className="draggabale-attribute"
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}>

                  {item}
                </div>
              )
            }
            </Draggable>
          </div>
        ))}
        <div>
        { !this.state.formIsVisible && <button className="button" onClick={this.toggleCreateSourceForm}>Create Data Source</button>}
        { this.state.formIsVisible &&
        <form className="transform-form" onSubmit={this.addDataSource}>
          <div className="form-group">
            <label>Source</label>
            <select name="sourceData" className="action-field--select">
                {dataSources && dataSources.map(dataSource => <option key={dataSource.name} value={dataSource.name} >{dataSource.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Name</label>
            <input name='name' placeholder="source name"  className="action-field--text"/>
          </div>
          {!this.state.isTransformVisible &&           
            <a className="button small link"  onClick={this.toggleCreateSourceFormTransform} href="#!">
            + Transform
            </a>}
          {
          this.state.isTransformVisible &&
          <form onSubmit={this.addTransformToSourceData}>
            <div className="form-group">
              <label>Transform type</label>
              <select name='filter-type'className="action-field--select" >
                <option value="filter">filter</option>
                <option value="aggregate">aggregate</option>
              </select>
            </div>
            <div className="form-group">
              <label>Transform type</label>
              <input name='transform-type' placeholder="transform rule" className="action-field--text"/>
            </div>
            <div className="form-group">
              <label>Transform rule</label>
              <input name='transform-rule' placeholder="transform rule" className="action-field--text"/>
            </div>
            <button className="button link">Add Transformation</button>
          </form>
          }
          <div className="form-group">
            <button className="button">Create Data Source</button>
          </div>
        </form>
        
        }
        </div>
      </div>
    )
        }
}