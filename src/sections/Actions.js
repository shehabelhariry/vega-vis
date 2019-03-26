import React from 'react'
import {Droppable, Draggable } from 'react-beautiful-dnd'

export default class Actions extends React.Component {

  state = {
    xFilters: [],
    filterFormIsVisible: false,
    transforms: []
  }
  
  filterItem = (xItem) => {
    this.setState({filterFormIsVisible: true})
  }

  addTransform = (e) => {
    e.preventDefault()
    let values = []
    for (let item of e.target.elements) {
      values.push(item.value)
    }
    let [name, type, field, rule] = values;
    let newTransform = {name, type, field, rule};
    newTransform = [...this.state.transforms, newTransform]
    this.setState({transforms: newTransform}, () => {
      this.props.applyTransformOnVegaObject(this.state.transforms)
    })
  }

  render () {
    const {xItem, yItem, mark, updateMark} = this.props;
    return (
      <div className="actions-section-container">
          <h2 style={{textAlign: "center"}}>Actions</h2>
          <Droppable droppableId="x" className="actions-section-container" >
              {(provided, snapshot) => (
                  <div className="action-field">
                    <span>x: </span>
                    <div
                      ref={provided.innerRef}
                      style={{ backgroundColor: snapshot.isDraggingOver ? '#73c1ff' : '#eaeaea', padding: 20 }}
                      {...provided.droppableProps}>
                    {xItem && xItem.length > 0 &&      
                      <Draggable draggableId={xItem[0]} index={0}>
                      {
                        (provided, snapshot) => (
                          <div
                            className="draggabale-attribute"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}>
                            {xItem[0]}
                          </div>
                        )
                      }
                      </Draggable>
                    }
                    </div>
                  </div>
                )}
          </Droppable>
          <Droppable droppableId="y" className="actions-section-container" >
                {(provided, snapshot) => (
                  <div className="action-field">
                    <span>y: </span>
                    <div
                      ref={provided.innerRef}
                      style={{ backgroundColor: snapshot.isDraggingOver ? '#73c1ff' : '#eaeaea', padding: 20 }}
                      {...provided.droppableProps}>

                      {yItem && yItem.length > 0  &&         
                      <Draggable draggableId={yItem[0]} index={0}>
                      {
                        (provided, snapshot) => (
                          <div
                            className="draggabale-attribute"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}>
                            {yItem[0]}
                          </div>
                        )
                      }
                      </Draggable>
                    }
                    </div>
                  </div>
                )}
          </Droppable>
          <div className="action-field">
            <p>mark:</p>
            <select onChange={updateMark} value={mark} className="action-field--select">
              <option>arc</option>
              <option>point</option>
              <option>area</option>
              <option>image</option>
              <option>group</option>
              <option>line</option>
              <option>path</option>
              <option>rect</option>
              <option>rule</option>
              <option>shape</option>
              <option>trail</option>
            </select>
          </div>
         {this.state.transforms.length > 0 &&  <h4>Applied Transforms</h4>}
          {this.state.transforms.map(transform => <p className="applied-transform" key={`${transform.name}-${transform.type}`}>{`${transform.name}-${transform.type}`}</p>)}
          <form className="transform-form" onSubmit={this.addTransform}>
            <h3>Transforms</h3>
            <div className="form-group">
              <label>Transform name</label>
              <input name='transform-name' placeholder="transform name"  className="action-field--text"/>
            </div>
            <div className="form-group">
              <label>Transform type</label>
              <select name='filter-type'className="action-field--select" >
                <option value="filter">filter</option>
                <option value="aggregate">aggregate</option>
              </select>
            </div>
            <div className="form-group">
              <label>Transform field</label>
              <select name='filter-field'className="action-field--select" >
                {this.props.attributeNames.map(item => <option key={item} value={item} >{item}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Transform rule</label>
              <input name='transform-rule' placeholder="transform rule" className="action-field--text"/>
            </div>
            <div className="form-group">
              <button className="button">Create Transform</button>
            </div>
          </form>
      </div>
    )
  }
}