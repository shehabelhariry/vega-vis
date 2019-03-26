import React, { Component } from 'react';
import './App.css';
import Data from './sections/Data'
import Actions from './sections/Actions'
import Chart from './sections/Chart'
import Vega from './sections/Vega'
import SQL from './sections/SQL'
import { DragDropContext, Droppable} from 'react-beautiful-dnd'
import {data} from './data'

class App extends Component {

  constructor (props) {
    super(props)
    this.onDragEnd = this.onDragEnd.bind(this);
  }
  

  state = {
    data,
    attributeNames: data && Object.keys(data[0]),
    xItem: [],
    yItem: [],
    formulatedData: data,
    mark: "rect",
    transforms: [],
    currentVegaObject: {},
    dataSources: [{
      name: 'table',
      values: data
    }]
  }

  onDragEnd = result => {
    if (!result.destination) {
      return;
    }

    if(result.destination.droppableId === 'x' && this.state.xItem.length !== 1) {
      const updatedAttributeNames = this.state.attributeNames.filter(item => item!== result.draggableId);
      this.setState({
        xItem: [result.draggableId],
        attributeNames: updatedAttributeNames
      })
    }

    if(result.destination.droppableId === 'y' && this.state.yItem.length !== 1) {
      const updatedAttributeNames = this.state.attributeNames.filter(item => item!== result.draggableId);
      this.setState({
        yItem: [result.draggableId],
        attributeNames: updatedAttributeNames
      })
    }

  }

  updateMark = (newMark) => {
    this.setState({mark: newMark.target.value});
  }
  
  updateCurrentVegaObject = (vegaObject) => {
    this.setState({currentVegaObject: vegaObject});
  }

  updateFormulatedData = (newData) => {
    this.setState({formulatedData: newData})
  }

  applyTransformOnVegaObject = (transforms) => {
    this.setState({transforms})
  }

  formulateDataSource = (dataSource) => {
    return {
      name: dataSource.name,
      source: dataSource.sourceData
    }
  }

  updateDataSource = (dataSource) => {
    const formulatedDataSource = this.formulateDataSource(dataSource) 
    this.setState({dataSources: [...this.state.dataSources, formulatedDataSource]}, () => {
      alert('data source added')
    })
  }

  render() {
    return (
      <div className="App app-container">
        <DragDropContext
         onDragEnd={this.onDragEnd}
         >
          <Droppable droppableId="droppable-1" >
            {(provided, snapshot) => (
              <div
                className="data-section-container"
                ref={provided.innerRef}
                style={{ backgroundColor: snapshot.isDraggingOver ? '#73c1ff' : '#eaeaea' }}
                {...provided.droppableProps}>
                  <Data 
                    attributeNames={this.state.attributeNames}
                    dataSources={this.state.dataSources}
                    addDataSource={this.updateDataSource} 
                  />
              </div>
            )}
          </Droppable>
          <Actions 
            xItem={this.state.xItem} 
            yItem={this.state.yItem} 
            updateMark={this.updateMark} 
            mark={this.state.mark} 
            data={this.state.formulatedData}
            updateFormulatedData={this.updateFormulatedData}
            attributeNames={this.state.attributeNames}
            applyTransformOnVegaObject={this.applyTransformOnVegaObject}
          />
        </DragDropContext>
        <Chart 
          data={this.state.formulatedData} 
          xItem={this.state.xItem} 
          yItem={this.state.yItem} 
          mark={this.state.mark}
          transforms={this.state.transforms}
          updateCurrentVegaObject={this.updateCurrentVegaObject}
          dataSources={this.state.dataSources}
        />
        <div className="scripts-section-container">
          <Vega currentVegaObject={this.state.currentVegaObject}/>
          <SQL/>
        </div>
      </div>
    );
  }
}

export default App;
