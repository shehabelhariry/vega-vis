import React from 'react'

export default function Vega ({currentVegaObject}) {
  return (
    <div className="vega-section-container">
      <h2 style={{textAlign: "center"}}>Vega Object</h2>
      <textarea style={{width: 400, minHeight: 300}} value={JSON.stringify(currentVegaObject, null, 2)} />
      {/* <pre>{JSON.stringify(currentVegaObject, null, 2)}</pre> */}
    </div>
  ) 
}