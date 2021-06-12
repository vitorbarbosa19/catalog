import React from 'react'
import SelfieImage from '../image/SelfieImage'
import RgBackImage from '../image/RgBackImage'
import RgFrontImage from '../image/RgFrontImage'
import CardImage from '../image/CardImage'
import CnhImage from '../image/CnhImage'
import SelfieRgImage from '../image/SelfieRgImage'
import './styles.css'

const UploadInstructions = ({instrucoesText, imageType}) => {
    return (
        <div style={{display:'flex', justifyContent:'space-around', marginTop:'20px', marginBottom:'20px'}}>
            {imageType === 'selfie' && ( <SelfieImage />)}
            {imageType === 'rgback' && ( <RgBackImage />)}
            {imageType === 'rgfront' && ( <RgFrontImage />)}
            {imageType === 'card' && ( <CardImage />)}
            {imageType === 'cnh' && ( <CnhImage />)}
            {imageType === 'selfierg' && ( <SelfieRgImage />)}
            <div style={{padding: '2.5%', width:'55%', display:'flex', flexDirection:'column', justifyContent:'space-around'}}>
                {instrucoesText.map((text:any) => {
                    return (
                        <label  className='listLabel' key={text} style={{  fontSize: '1.3rem', margin:'0', padding:'0'}}>{text}</label>
                    )
                })}
            </div>
        </div>
    )
}

export default UploadInstructions