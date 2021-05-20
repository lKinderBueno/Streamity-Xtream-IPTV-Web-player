import React from 'react'
import Button from "./Button"
import "./VolumeButton.css"

const VolumeButton = ({enabled, volume, onChangeInput, onClick}) => {
    return (
        <div className="volume-container">
            <Button enabled={enabled} iconOn={"fas fa-volume-up"} iconOff={"fas fa-volume-mute"} textOn={"Mute"} textOff={"Unmute"} onClick={onClick}/>
            <input 
                value={volume} 
                type={'range'} 
                min={0}
                max={100}
                step={5}
                onChange={onChangeInput}
                >
            </input>
        </div>
    )
}

export default VolumeButton
