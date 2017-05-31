import React from 'react'
import Results from '../Results/Results'

const ResultsHolder = ({cars, loadingStatus}) =>{
  return (
    <section className = "results-holder">
      {lengthMessage(cars)}
      {loading(loadingStatus)}
      {cars.map((car, i)=>{
        return(
          <div key = {i}>
            <Results car = {car}/>
          </div>
        )
      })}
    </section>
  )
}

const lengthMessage = (cars)=>{
  if(cars.length > 1){
      return(
        <h3>Your uploaded image may be: </h3>
      )
    } else if (cars.length === 1) {
      return(
        <h3>The car is: </h3>
      )
  }
}

const loading = (loadingStatus) => {
  if(loadingStatus === true){
    return (
      <div className = "loading-image">
        <img width = '100px' src = "../../assets/images/loading.gif"/>
        <h3>Loading Results...</h3>
      </div>
    )
  } else {
    return (
      null
    )
  }
}

export default ResultsHolder