import React from './feature.scss'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export const Feature = () => {
  return (
    <div className='Featured'>
        
        <div className="top">
            <h1 className="title"> Driver Stats of this Month </h1>
            <MoreVertIcon fontSize='small'/> 
        </div>

        <div className="bottom">
            <div className="featureChart">
                <CircularProgressbar value={70} text={"Driving Time: 241:37"} strokeWidth={5} 
                styles={{
                    text: { fontSize: '9px'}
                        }} />
                <CircularProgressbar value={25} text={"Total Mileage: 12.5K"} strokeWidth={5} 
                styles={{
                    text: { fontSize: '9px'}
                        }}/>
                <CircularProgressbar value={41} text={"Journey: 441.5"} strokeWidth={5} 
                styles={{
                    text: { fontSize: '9px'}
                        }}/>
            </div>

            <div className='featureChart'>
                <CircularProgressbar value={52} text={"Jobs Completed: 210"} strokeWidth={5} 
                    styles={{
                        text: { fontSize: '9px'}
                            }}/>

                    <CircularProgressbar value={7} text={"Jobs Late: 3"} strokeWidth={5} 
                    styles={{
                        text: { fontSize: '9px'}
                            }}/>
                            
                    <CircularProgressbar value={5} text={"Jobs Missed: 2"} strokeWidth={5} 
                    styles={{
                        text: { fontSize: '9px'}
                            }}/>
            </div>
            
        </div>
    </div>
  )
}

export default Feature
