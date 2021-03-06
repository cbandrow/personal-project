import React, { Component } from 'react'
import { render } from 'react-dom'
import ImageImport from './ImageImport/ImageImport'
import ImageHolder from './ImageHolder/ImageHolder'
import ResultsHolder from './ResultsHolder/ResultsHolder'
import Helper from './helpers/helper'
import jsonData from './helpers/jsonData.js'
import key2 from './helpers/apiKey.js'
import stubData from './helpers/stubbeddata.js'
import vehicleData from './helpers/vehicleData.js'
import LandingPage from './LandingPage/LandingPage'
import DisplayCarFacts from './DisplayCarFacts/DisplayCarFacts'

import key from './helpers/edmundsApi'
import stubbedInfoData from './helpers/stubbedInfoData'

export default class App extends Component {
  constructor(data){
    super()
    this.helper = new Helper(data)
    this.state = {
      imagePreviewUrl: '',
      apiResults: [],
      completeVehicles: [],
      compareResults: [],
      loadingStatus: false,
      error: '',
      makeMatches: [],
      carData: '',
    }
  }

  componentDidMount(){
    let results = this.helper.cleanVehicleData(vehicleData)
    this.setState({
      error: false,
      completeVehicles: this.helper.cleanVehicleData(vehicleData),
    })
  }

  handleImageData(inputState){
    let content
    let statePromise = new Promise((resolve, reject)=>{
      this.setState({
        error: false,
        apiResults: [],
        compareResults: [],
        loadingStatus: true,
        imagePreviewUrl: inputState.imagePreviewUrl,
        carData: '',
      })

      setTimeout(()=>{
        if(this.state.imagePreviewUrl && this.state.loadingStatus){
          console.log('loading...')
          resolve('imagePreviewUrl Set in State')
        } else{
          reject('Wasnt set in state')
        }
      }, 300);
    })
    statePromise.then(() =>{
      content = this.state.imagePreviewUrl.replace('data:image/jpeg;base64,', '')
      this.sendDataCloudVision(content)
    })
    .catch(() => console.log('Issue setting state of ImagePreview data'))
  }

  sendDataCloudVision(content){
    let newContent = jsonData(content)
    let results
     fetch(`https://vision.googleapis.com/v1/images:annotate?key=${key2}`,{
       method: 'POST',
       headers: {'Content-Type': 'application/json'},
       body: JSON.stringify(newContent),
     }).then((resp) => resp.json())
       .then((data) =>{
        results = this.helper.cleanResponseData(data)
        console.log('...done')
        return results
     })
     .then((results) =>{
      let returnMatches = this.helper.getPotentialMakes(results, this.state.completeVehicles)
      this.setState({
        makeMatches: returnMatches[0],
        apiResults: returnMatches[1]
      })

      let makes = returnMatches[0].map((makeData) =>{
        return makeData
      })
      return makes
    })
    .then((makes) =>{
      let modelMatches = this.helper.getPotentialModels(this.state.apiResults, this.state.completeVehicles, makes)

      this.setState({
        compareResults: modelMatches,
        loadingStatus: false
      })
    })
     .then(data => this.determineError())
     .catch(err => console.log(err))
  }

  determineError(){
    if(this.state.loadingStatus === false && this.state.compareResults.length < 1 && this.state.apiResults){
      console.log("error?")
      this.setState({
        error: true,
      })
    } else {
      this.setState({
        error: false,
      })
      console.log("loading complete")
    }
  }

  handleResultData(car){
    let make = this.state.makeMatches.filter((make) =>{
      return car.includes(make)
    })
    let model = car.replace(`${make} `, '')
    this.getCarData(make, model)
  }

  getCarData(make, model){
    fetch(`https://api.edmunds.com/api/editorial/v2/${make}/${model}?view=basic&fmt=json&api_key=${key}`)
    .then(resp => resp.json())
    .then((data) =>{
      this.setState({
        carData: this.helper.reduceCarDetails(data),
      })
    })
    .catch(err => console.log(err))

    // let carData = this.helper.reduceCarDetails(stubbedInfoData)
    // this.setState({
    //   carData: carData
    // })
  }

  displayComponents(){
    if(this.state.imagePreviewUrl){
      return (
          <section className = 'content-holder'>
            <ImageHolder url = {this.state.imagePreviewUrl}/>
            <ResultsHolder cars = {this.state.compareResults}
              loadingStatus = {this.state.loadingStatus} error = {this.state.error} handleResultData = {this.handleResultData.bind(this)}/>
              {this.displayCarInfo()}
            </section>
      )
    }
  }

  displayCarInfo(){
    if(this.state.carData){
      return (
        <section className = "car-facts">
          <DisplayCarFacts carData = {this.state.carData}/>
        </section>
      )
    }
  }

  render() {
    return (
      <main>
        <header>
          <img className = "logo" src = '../assets/images/logo.png'/>
          {this.state.imagePreviewUrl ?
            <div className = 'display-upload header-upload'>
              <ImageImport handleImageData = {this.handleImageData.bind(this)}/>
            </div>
          : null}
        </header>
        <section className = {!this.state.imagePreviewUrl ? `main-content` : `main-content main-background`}>
          {!this.state.imagePreviewUrl ?
              <LandingPage handleImageData = {this.handleImageData.bind(this)}/>
          : null}
          {this.displayComponents()}
        </section>
      </main>
    )
  }
}
