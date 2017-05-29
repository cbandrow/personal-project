export default class Helper{
  constructor(data){
    this.data = data || ''
  }

  cleanVehicleData(vehicleData){
    let reducedData = vehicleData.makes.reduce((acc, make) =>{
      if(!acc[make.name]){
        acc[make.name] = {
          name: make.name,
          models: make.models.map((model) =>{
            return {
              name: model.name,
              id: model.id
            }
          })
        }
      }
      return acc
    }, {})
    console.log(reducedData)
    return reducedData
  }

  cleanResponseData(respData){
    let newResults = respData.responses[0].webDetection.webEntities.reduce((acc, value) =>{
      if(!acc.includes(value.description)){
        acc.push(value.description)
      }
      return acc
    }, [])

    return newResults
    console.log(respData.responses[0].webDetection.webEntities)
  }
}