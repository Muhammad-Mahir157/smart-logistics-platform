import './navbar.scss';
import SearchIcon from '@mui/icons-material/Search';
import LanguageIcon from '@mui/icons-material/Language';
import NightlightIcon from '@mui/icons-material/Nightlight';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import MessageIcon from '@mui/icons-material/Message';
import ListOutlinedIcon from '@mui/icons-material/ListOutlined';

export const Navbar = () => {
  return (
    <div className='mynavbar'>
        <div className="wrapper">

            <div className="search">
              <input type="text" placeholder='Search' />
              <SearchIcon/>
            </div>

              <div className="myitems">
                <div className="myitem">
                  < LanguageIcon className='icon'/> English
                </div>
                
                <div className="myitem"> 
                < NightlightIcon className='icon'/>
                 </div>

                <div className="myitem">
                  < FullscreenExitIcon className='icon'/>
                </div>

                <div className="myitem">
                  <NotificationsNoneOutlinedIcon className='icon'/>
                  <div className='Counter'>1</div>
                </div>

                <div className="myitem">
                  < MessageIcon className='icon'/> 
                  <div className='Counter'>2</div>
                </div>

                <div className="myitem">
                  <ListOutlinedIcon className='icon'/>
                </div>

                <div className="myitem">
                  <img src="https://cdn-icons-png.flaticon.com/512/219/219986.png"
                  alt="admin_profile_picture"
                  className='avatar'
                  />
                </div>
            </div>
      </div>
    </div>
   

  )
}

export default Navbar