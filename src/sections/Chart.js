import React from 'react'
import VegaRenderer from './VegaRenderer';
var vega = require('vega');

export default class Chart extends React.Component {

  state = {
    svg: '<svg></svg>',
    vegaObject: {
      "$schema": "https://vega.github.io/schema/vega/v5.json",
      "width": 400,
      "height": 200,
      "padding": 5,
    
      "data": [
        {
          "name": "table",
          "values": this.props.data
        }
      ],
    
      "scales": [
        {
          "name": "xscale",
          "type": "band",
          "domain": {"data": "table", "field":  'fieldX'},
          "range": "width",
          "padding": 0.05,
          "round": true
        },
        {
          "name": "yscale",
          "domain": {"data": "table", "field":  'fieldY'},
          "nice": true,
          "range": "height"
        }
      ],
    
      "axes": [
        { "orient": "bottom", "scale": "xscale" },
        { "orient": "left", "scale": "yscale" }
      ],
    
      "marks": [
        {
          "type": this.props.mark,
          "from": {"data":"table"},
          "encode": {
            "enter": {
              "x": {"scale": "xscale", "field": 'fieldX'},
              "width": {"scale": "xscale", "band": 1},
              "y": {"scale": "yscale", "field": 'fieldY'},
              "y2": {"scale": "yscale", "value": 0}
            },
            "update": {
              "fill": {"value": "steelblue"}
            },
            "hover": {
              "fill": {"value": "red"}
            }
          }
        },
        {
          "type": "text",
          "encode": {
            "enter": {
              "align": {"value": "center"},
              "baseline": {"value": "bottom"},
              "fill": {"value": "#333"}
            }
          }
        }
      ]
    }
  }

  render () {
    return (
      <div className="chart-section-container">
        <h2>Chart</h2>
        <div dangerouslySetInnerHTML={{__html: this.state.svg}}/>
        <VegaRenderer vegaSpec={this.state.vegaObject} renderer="CANVAS"/>
      </div>
    ) 
  }

  createVegaView = vegaJSON => {
    return new vega.View(vega.parse(vegaJSON))
  }

  renderVegaChart = vegaView => {
    vegaView.renderer('none').initialize()
    vegaView.toSVG()
      .then(svg => {
       this.setState({svg})
      })
      .catch(err =>{ console.error(err)})
  }

  formulateTransforms = transforms => {
     return transforms.map(item => {
       if (item.type === 'filter') {
        return {
          type: item.type,
          expr: `datum.${item.field} ${item.rule}`
        }
       }

       if (item.type === 'aggregate') {
        return {
          type: item.type,
          "groupby": [item.field]
        }
       }
     })
  }

  updateVegaObject = (vegaObject, itemName, oldItemValue, newItemValue) => {
    let newObject = Object.assign({}, vegaObject)

    if ( itemName === "xItem" ) {

      newObject= JSON.stringify(newObject).replace(new RegExp(oldItemValue, 'g'), newItemValue)
      newObject = JSON.parse(newObject)
    }

    if ( itemName === "yItem") {
      newObject= JSON.stringify(newObject).replace(new RegExp(oldItemValue, 'g'), newItemValue)
      newObject = JSON.parse(newObject)
    }


    if (itemName === "mark" ) {
      newObject= JSON.stringify(newObject).replace(new RegExp(oldItemValue, 'g'), newItemValue)
      newObject = JSON.parse(newObject)
    }

    if (itemName === "data" ) {
      newObject= JSON.stringify(newObject).replace(new RegExp(oldItemValue, 'g'), newItemValue)
      newObject = JSON.parse(newObject)
    }

    if (itemName === "transforms" ) {
      newObject.data[0]["transform"] = this.formulateTransforms(newItemValue)
    }
    
    if (itemName === "dataSources" ) {
      newObject.data = newItemValue;
    }
    
    this.props.updateCurrentVegaObject(newObject)
    return newObject
  }

  updateVegaView = () => {
    let view = this.createVegaView(this.state.vegaObject)
    this.renderVegaChart(view)
  }

  componentDidUpdate (prevProps, prevState) {

    let vegaObject;
    if (prevProps.xItem !== this.props.xItem) {
      vegaObject = this.updateVegaObject(prevState.vegaObject, 'xItem', prevProps.xItem[0] || 'fieldX' ,this.props.xItem[0]);
      this.setState({vegaObject}, this.updateVegaView)
    }
    
    if (prevProps.yItem !== this.props.yItem) {
       vegaObject = this.updateVegaObject(prevState.vegaObject, 'yItem', prevProps.yItem[0]  || 'fieldY'  ,this.props.yItem[0]);
       this.setState({vegaObject}, this.updateVegaView)
      }
      
      if (prevProps.mark !== this.props.mark) {
       vegaObject = this.updateVegaObject(prevState.vegaObject, 'mark' , prevProps.mark, this.props.mark);
       this.setState({vegaObject}, this.updateVegaView)
      }
      
      if (prevProps.transforms !== this.props.transforms) {
        vegaObject = this.updateVegaObject(prevState.vegaObject, 'transforms' , prevProps.transforms, this.props.transforms);
        this.setState({vegaObject}, this.updateVegaView)
      }
      
      if (prevProps.data !== this.props.data) {
       vegaObject = this.updateVegaObject(prevState.vegaObject, 'data' , prevProps.data, this.props.data);
       this.setState({vegaObject}, this.updateVegaView)
    }

      if (prevProps.dataSources !== this.props.dataSources) {
       vegaObject = this.updateVegaObject(prevState.vegaObject, 'dataSources' , prevProps.dataSources, this.props.dataSources);
       this.setState({vegaObject}, this.updateVegaView)
    }
  }


  componentDidMount () {
    if(this.state.vegaObject) {
      this.updateVegaView()
    }
  }
}