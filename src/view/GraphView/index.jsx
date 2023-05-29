import React from 'react'
import GraphView from './components/GraphView/GraphView'
import PropertyFiled from './components/PropertyFiled/PropertyFiled'

function index() {
  return (
    <div className="index" style={{overflow:'hidden'}}>
      <GraphView></GraphView>
      <PropertyFiled></PropertyFiled>
    </div>
  )
}

export default index