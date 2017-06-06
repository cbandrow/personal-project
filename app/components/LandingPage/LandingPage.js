import React from 'react'
import ImageImport from '../ImageImport/ImageImport'

const LandingPage = ({handleImageData}) => {
  return(
    <section className = "landing-page">
      <div className="video-bg">
        <video loop muted autoPlay poster="../../assets/images/road.jpg" className="video">
          <source src="../../assets/videos/background.mp4" type="video/mp4"/>
        </video>
      </div>
      <div className = "overlay">
        <h2>Find out the Make and Model of a Vehicle with the snap of a photo</h2>
      </div>
    </section>
  )
}


export default LandingPage
